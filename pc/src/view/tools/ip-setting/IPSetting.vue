<template>
  <div class="set-ip">
    <div class="set-ip-title">
      {{ $t('i18n.SET_IP_ADDR') }}
    </div>
    <div class="set-ip-body">
      <div class="write-ip">
        <div class="set-ip-input">
          <input type="text" v-model.trim="ip" :placeholder="$t('i18n.SET_IP_ADDR')" :class="{'error': !isIp}" @change="vaildIp()" @focus="ipFocus()" @keyup.enter="saveIp()">
          <div class="input-error" v-show="!isIp">{{ $t('i18n.PLEASE_INPUT_THE_CORRECT_IP_ADDRESS') }}</div>
        </div>
        <primary-button @btnClicked="saveIp()" :disabled="saveing" :loading="saveing" :text="text"></primary-button>
      </div>
    </div>
    <fade-tips :msg="tip.msg" :type="tip.type" :show="tip.show" @hide="tip.show = false"></fade-tips>
  </div>
</template>

<script>
import { PrimaryButton } from '../../../common/components/buttons/index'
import Check from '../../../common/components/check/check'
import FadeTips from '../../../common/components/fade-tips/FadeTips'

import VaildTools from '../../../common/service/regular'
import jsonp from '../../../plugin/jsonp'
import getNetTypeAndWifiSsidService from '../../../common/service/getNetTypeAndWifiSsid'

import { netLanGet, netLanSet } from '../../../api/network-check-api'
export default {
  name: 'SetIp',
  data() {
    return {
      text: this.$t('i18n.SAVE_EFFECT'),
      saveing: false,
      oldIp: '',
      ip: '',
      netmask: '',
      getInfoSuccess: false,
      tip: {
        msg: '',
        type: 'success',
        show: false
      },
      isIp: true,
      checkTime: '',
      waiting: {
        msg: this.$t('i18n.IP_SETTING_TIPS') + '...',
        show: true
      },
      url: null
    }
  },
  methods: {
    ipFocus() {
      this.isIp = true
    },
    vaildIp() {
      this.isIp = VaildTools.verifyIp(this.ip)
    },
    saveIp() {
      this.vaildIp()
      if (this.isIp && this.getInfoSuccess) {
        if (this.ip === this.oldIp) {
          this.tip.msg = this.$t('i18n.IP_ADDRESS_NOT_MODIFIED')
          this.tip.type = 'error'
          this.tip.show = true
        } else {
          this.saveing = true
          const data = {
            ip: this.ip,
            netmask: this.netmask
          }
          getNetTypeAndWifiSsidService()
            .then(res => {
              const ssid = res.wifiSsid
              const network = res.network
              if (network === 2) {
                // 联网方式为WiFi
                this.waiting.msg =
                  this.$t('i18n.USE_WIFI_SERVER_SETIP') + ssid
              }
              netLanSet(data)
                .then(res => {
                  this.waiting.show = true
                  this.$root.Bus.$emit('waitingMaskShow', this.waiting)
                  this.$root.Bus.$emit('busStopLoopAccStateGet')
                  this.$root.Bus.$emit('clearDevListAutoRefresh')
                  this.checkTime = setInterval(() => {
                    this.checkServers()
                  }, 3000)
                })
                .catch(e => {
                  // 错误处理
                  this.waiting.msg = this.$t('i18n.IP_SETTING_TIPS') + '...'
                  this.waiting.show = false
                  this.$root.Bus.$emit('waitingMaskShow', this.waiting)
                  this.tip.msg = e
                  this.tip.type = 'error'
                  this.tip.show = true
                  this.saveing = false
                })
            })
            .catch(e => {
              this.tip.msg = this.$t('i18n.FAILED_GET_NET')
              this.tip.type = 'error'
              this.tip.show = true
              this.saveing = false
              this.waiting.show = false
              this.$root.Bus.$emit('waitingMaskShow', this.waiting)
            })
        }
      }
    },
    checkServers() {
      const url = `http://${this.ip}/cgi-bin/luci/sys_init_get`
      jsonp(
        url,
        {},
        {
          format: 'jsonp'
        }
      )
        .then(res => {
          window.clearInterval(this.checkTime)
          let reg = /t\.qeeyou\.cn/g
          let result = reg.test(this.url)
          if (result) {
            window.location.href = this.url
          } else {
            window.location.href = `http://${this.ip}/`
          }
        })
        .catch(e => {
          window.clearInterval(this.checkTime)
          let reg = /t\.qeeyou\.cn/g
          let result = reg.test(this.url)
          if (result) {
            window.location.href = this.url
          } else {
            window.location.href = `http://${this.ip}/`
          }
        })
    }
  },
  created() {
    netLanGet()
      .then(res => {
        this.oldIp = res.ip
        this.ip = res.ip
        this.netmask = res.netmask
        this.getInfoSuccess = true
      })
      .catch(e => {
        this.tip.msg = e
        this.tip.type = 'error'
        this.tip.show = true
      })
  },
  mounted() {
    this.url = window.location.protocol + '//' + window.location.host
  },
  components: {
    PrimaryButton,
    FadeTips,
    Check
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_mixin.scss';
.set-ip {
  width: 600px;
  height: 344px;
  background: linear-gradient(
    180deg,
    rgba(240, 243, 247, 1),
    rgba(255, 255, 255, 1)
  );
  box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  position: relative;
  margin: 0 auto;
  & > .set-ip-title {
    width: 100%;
    height: 76px;
    background: rgba(255, 255, 255, 1);
    border-radius: 6px 6px 0px 0px;
    font-size: 20px;
    font-weight: bold;
    line-height: 76px;
    text-align: center;
  }
  .write-ip {
    padding: 60px;
    .set-ip-input {
      position: relative;
      @include inputWarnTip;
    }
  }
}
</style>
