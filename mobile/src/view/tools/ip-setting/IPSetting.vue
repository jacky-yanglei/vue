<template>
  <div>
    <div class="tools-wrapper-main ip-setting"
      :class="{'blur': isShowBlur}"
      @click.stop.prevent="controlFocusFn()">
      <public-header :headerTxt="headerTxt"></public-header>
      <div class="mg-40 tools-wrapper-max">
        <input class="tools-input"
          :class="{'error-input': !this.txtIP.vaild && this.txtIP.errorTip}"
          type="text"
          v-model="txtIP.txt"
          @blur="blurVerifyFn()"
          @click.stop.prevent="focusIPFn()"
          ref="inputIP">
        <div class="error-tip" v-show="!this.txtIP.vaild && this.txtIP.errorTip">{{$t('i18n.INCORRECT_IP_ADDRESS_FORMAT')}}</div>
        <div class="tools-bottom">
          <primart-button :disabled="disabled"
            :loading="loading"
            @buttonClicked="saveBtnFn()">{{$t('i18n.SAVE_AND_EFFECT')}}</primart-button>
        </div>
      </div>
    </div>
    <fade-tips :msg="tip.msg" :show="tip.show" :type="tip.type" @hide="hideFadeTipsFn"></fade-tips>
    <loading-mask :msg="loadingMaskObj.msg" :show="loadingMaskObj.show" :showMask="loadingMaskObj.showMask"></loading-mask>
  </div>
</template>

<script>
import PublicHeader from '@/common/components/public-header/public-header'
import PrimartButton from '@/common/components/buttons/primary-button'
import FadeTips from '@/common/components/fade-tips/fade-tips'
import regular from '@/common/service/regular'
import { netLanGet, netLanSet } from '@/api/network-check-api'
import getNetTypeAndWifiSsidService from '@/common/service/getNetTypeAndWifiSsid'
import LoadingMask from '@/common/components/loadings/loading-mask'
import jsonp from '@/plugin/jsonp'
export default {
  name: 'IPSetting',
  data: function () {
    return {
      headerTxt: this.$t('i18n.SET_IP_ADDRESS'),
      disabled: false,
      loading: false,
      txtIP: {
        txt: null,
        vaild: false, // 是否通过IP校验
        errorTip: false // 错误提醒
      },
      oldIP: null, // 原有的IP
      netmask: null,
      isShowBlur: false,
      tip: {
        msg: null,
        show: false,
        type: 'success'
      },
      loadingMaskObj: { // 控制遮罩层的显示与否
        msg: '',
        show: false,
        showMask: false
      },
      checkNetInterval: null, // 检查网络是否连接的定时器的名称
      url: null
    }
  },
  components: {
    PublicHeader,
    PrimartButton,
    FadeTips,
    LoadingMask
  },
  methods: {
    verifyIPFn: function () {
      let result = regular.verifyIP(this.txtIP.txt)
      this.txtIP.vaild = result
      this.txtIP.errorTip = !result
    },
    blurVerifyFn: function () {
      // 失去焦点时校验
      this.verifyIPFn()
    },
    focusIPFn: function () {
      // 聚焦，让效果复原
      this.txtIP.errorTip = false
    },
    hideFadeTipsFn: function (data) {
      this.tip.show = data
      this.isShowBlur = data
    },
    saveBtnFn: function () {
      this.verifyIPFn()
      if (this.txtIP.vaild) {
        // IP校验成功
        if (this.txtIP.txt === this.oldIP) {
          this.tip.msg = this.$t('i18n.IP_ADDRESS_NOT_MODIFIED')
          this.tip.show = true
          this.tip.type = 'tip'
          this.isShowBlur = true
        } else {
          this.disabled = true
          this.loading = true
          getNetTypeAndWifiSsidService()
            .then(res => {
              const ssid = res.wifiSsid
              // 联网方式为WiFi
              let str = this.$t('i18n.IP_SETUP_PROGRESS') + this.$t('i18n.NETWORK_WILL_DISCONNENTION_PLEASE_CHECK_INTERNET')
              this.loadingMaskObj.msg = str + ssid
              this.loadingMaskObj.show = true
              this.loadingMaskObj.showMask = true
              this.isShowBlur = true
              this.apiNetLanSetFn()
            })
            .catch(e => {
              this.tip.msg = this.$t('i18n.FAILED_GET_NETWORK_INFO')
              this.tip.show = true
              this.tip.type = 'error'
              this.isShowBlur = true
              this.disabled = false
              this.loading = false
            })
        }
      }
    },
    apiNetLanGetFn: function () {
      // 页面加载时获取信息
      netLanGet()
        .then(res => {
          this.oldIP = res.ip
          this.txtIP.txt = res.ip
          this.netmask = res.netmask
        })
        .catch(e => {
          let msg = this.apiErrorDealFn(e)
          this.tip.msg = msg
          this.tip.show = true
          this.tip.type = 'error'
          this.isShowBlur = true
        })
    },
    apiNetLanSetFn: function () {
      // 调用net_lan_set接口
      let apiData = {
        ip: this.txtIP.txt,
        netmask: this.netmask
      }
      netLanSet(apiData)
        .then(res => {
          this.checkNetInterval = setInterval(() => {
            this.checkInternetFn() // 检查网络是否连接
          }, 3000)
        })
        .catch(e => {
          let msg = this.apiErrorDealFn(e)
          this.tip.msg = msg
          this.tip.show = true
          this.tip.type = 'error'
          this.isShowBlur = true
          this.loadingMaskObj.msg = ''
          this.loadingMaskObj.show = false
          this.loadingMaskObj.showMask = false
          this.disabled = false
          this.loading = false
        })
    },
    checkInternetFn: function () {
      // 检查网络是否连接
      const url = `http://${this.ip}/cgi-bin/luci/sys_init_get`
      jsonp(url, {}, {format: 'jsonp'})
        .then(res => {
          window.clearInterval(this.checkNetInterval)
          this.loadingMaskObj.show = false
          this.loadingMaskObj.showMask = false
          this.isShowBlur = false
          this.loadingMaskObj.msg = ''
          let reg = /t\.qeeyou\.cn/g
          let result = reg.test(this.url)
          if (result) {
            window.location.href = this.url
          } else {
            window.location.href = `http://${this.txtIP.txt}/`
          }
          this.disabled = false
          this.loading = false
        })
        .catch(e => {
          window.clearInterval(this.checkNetInterval)
          this.loadingMaskObj.show = false
          this.loadingMaskObj.showMask = false
          this.isShowBlur = false
          this.loadingMaskObj.msg = ''
          let reg = /t\.qeeyou\.cn/g
          let result = reg.test(this.url)
          if (result) {
            window.location.href = this.url
          } else {
            window.location.href = `http://${this.txtIP.txt}/`
          }
          this.disabled = false
          this.loading = false
        })
    },
    controlFocusFn: function () {
      this.$refs.inputIP.blur()
    }
  },
  created () {
    this.apiNetLanGetFn() // 页面加载时获取信息
  },
  mounted () {
    this.url = window.location.protocol + '//' + window.location.host
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../common/scss/_mixin';
  @import '../../../common/scss/_utils';
  @import '../../../common/scss/tools';
</style>
