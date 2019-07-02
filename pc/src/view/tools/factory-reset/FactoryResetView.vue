<template>
  <div class="factory-data-reset">
    <div class="container">
      <error-tips :msg="msg" :show="show" @hide="show=false"></error-tips>
      <h5 class="title">{{ $t('i18n.FACTORY_RESET') }}</h5>
      <p class="tip">{{ $t('i18n.FACTORY_RESET_TIP') }}</p>
      <loading class="reset-loading" :class="{'show': waiting}"></loading>
      <p class="waiting" :class="{'show': waiting}">{{ $t('i18n.WAITING') }}</p>
      <primary-button height=46 class="button" :text="text" @btnClicked="factoryReset()" :disabled="waiting" :loading="waiting"></primary-button>
    </div>
  </div>
</template>

<script>
import Loading from '../../../common/components/loading/loading'
import ErrorTips from '@/common/components/error-tips/error-tips'
import { PrimaryButton } from '../../../common/components/buttons/index'

import { factoryResetApi } from '../../../api/system-manage-api'
import { getInitStatusApi } from '../../../api//login-api'
import getNetTypeAndWifiSsidService from '../../../common/service/getNetTypeAndWifiSsid'

import jsonp from '../../../plugin/jsonp'
export default {
  name: 'FactoryDataReset',
  data() {
    return {
      msg: '',
      show: false,
      checkInervalTime: '',
      waiting: false,
      text: this.$t('i18n.FACTORY_RESET'),
      resetWaiting: {
        msg: `${this.$t('i18n.SET_FACTORY_RESET_TIP')}`,
        show: true
      },
      resetOk: false,
      url: null,
      resetUrl: 'http://192.168.8.1'
    }
  },
  methods: {
    factoryReset() {
      getNetTypeAndWifiSsidService()
        .then(res => {
          const defaultSsid = res.defaultWifiSsid
          const network = res.network
          if (network === 2) { // 如果联网方式为wifi
            // 如果是无线网
            this.resetWaiting.msg =
              this.$t('i18n.USE_WIFI_SERVER_REST') + defaultSsid
          }
          factoryResetApi()
            .then(res => {
              this.$root.Bus.$emit('waitingMaskShow', this.resetWaiting)
              this.waiting = true
              this.text = this.$t('i18n.FACTORY_RESETING')
              this.$root.Bus.$emit('busStopLoopAccStateGet')
              this.$root.Bus.$emit('clearDevListAutoRefresh')
              const host = window.location.host
              if (host === '192.168.8.1' || host === 't.qeeyou.cn') {
                this.checkInervalTime = setInterval(() => {
                  this.checkComplete()
                }, 3000)
              } else {
                this.checkInervalTime = setInterval(() => {
                  this.checkServers()
                }, 3000)
              }
            })
            .catch(err => {
              this.text = this.$t('i18n.FACTORY_RESET')
              this.show = true
              this.msg = err
            })
        })
        .catch(e => {
          this.show = true
          this.msg = this.$t('i18n.FAILED_GET_NET')
          this.resetWaiting.msg = this.$t('i18n.SET_FACTORY_RESET_TIP')
          this.text = this.$t('i18n.FACTORY_RESET')
        })
    },
    checkComplete() {
      getInitStatusApi().then(res => {
        if (Number.parseInt(res) === 0) {
          clearInterval(this.checkInervalTime)
          if (!this.resetOk) {
            this.resetOk = true
            window.sessionStorage.removeItem('token')
            this.$router.push('/welcome')
            this.resetWaiting.show = false
          }
        }
      })
    },
    checkServers() {
      // jsonp
      const url = `${this.url}/cgi-bin/luci/sys_init_get`
      jsonp(
        url,
        {},
        {
          format: 'jsonp'
        }
      )
        .then(res => {
          window.clearInterval(this.checkInervalTime)
          let reg = /t\.qeeyou\.cn/g
          let result = reg.test(this.url)
          if (result) {
            window.location.href = this.url
          } else {
            window.location.href = this.resetUrl
          }
        })
        .catch(e => {
          window.clearInterval(this.checkInervalTime)
          let reg = /t\.qeeyou\.cn/g
          let result = reg.test(this.url)
          if (result) {
            window.location.href = this.url
          } else {
            window.location.href = this.resetUrl
          }
        })
    }
  },
  components: {
    ErrorTips,
    Loading,
    PrimaryButton
  },
  mounted() {
    this.url = window.location.protocol + '//' + window.location.host
    this.$root.Bus.$emit('HiddenAppLoading')
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_mixin';
@import '../../../common/sass/_constant';

.factory-data-reset {
  width: 400px;
  margin: 0 auto;
  .container {
    width: 100%;
    padding: 40px 60px;
    background: white;
    border-radius: $startContentRaduis;
    text-align: center;
    position: relative;
    z-index: 9;
    box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.15);
    .title {
      font-size: 22px;
      color: rgba(58, 56, 72, 1);
      border-radius: 6px 6px 0px 0px;
      margin-bottom: 10px;
    }
    .tip {
      font-size: 14px;
      color: rgba(131, 137, 161, 1);
    }
    .reset-loading {
      margin: 0 auto;
      margin-top: 30px;
      margin-bottom: 20px;
      opacity: 0;
      &.show {
        opacity: 1;
      }
    }
    .waiting {
      text-align: center;
      margin-bottom: 40px;
      font-size: 12px;
      color: rgba(131, 137, 161, 1);
      opacity: 0;
      &.show {
        opacity: 1;
      }
    }
  }
}
</style>
