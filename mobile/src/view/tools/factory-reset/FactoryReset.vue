<template>
<div>
  <div class="factory-reset pdt-176" :class="{'blur': isShowBlur}">
    <div class="tools-wrapper-min">
      <h3 class="tools-title factory-reset-title">{{$t('i18n.FACTORY_RESET')}}</h3>
      <p class="tools-tip">{{$t('i18n.FACTORY_RESET_WILL_CLEAR_ALL_SETUP_DATA')}}</p>
      <loading-wait :show="wait.show" class="loading-wait"></loading-wait>
      <div class="tools-btn-min">
        <primart-button :disabled="disabled"
          :loading="loading"
          @buttonClicked="factoryResetBtnFn()">
          {{$t('i18n.FACTORY_RESET')}}</primart-button>
      </div>
    </div>
    <close-button :forbidClose="forbidClose" @emitCloseButton="closeButtonFn()"></close-button>
  </div>
  <fade-tips :msg="tip.msg" :show="tip.show" :type="tip.type" @hide="hideFadeTipsFn"></fade-tips>
  <loading-mask :msg="loadingMaskObj.msg"
    :show="loadingMaskObj.show"
    :showMask="loadingMaskObj.showMask"></loading-mask>
</div>
</template>

<script>
import PrimartButton from '@/common/components/buttons/primary-button'
import CloseButton from '@/common/components/buttons/close-button'
import LoadingWait from '@/common/components/loadings/loading-wait'
import getNetTypeAndWifiSsidService from '@/common/service/getNetTypeAndWifiSsid'
import FadeTips from '@/common/components/fade-tips/fade-tips'
import LoadingMask from '@/common/components/loadings/loading-mask'
import { factoryResetApi } from '@/api/system-manage-api'
import jsonp from '@/plugin/jsonp'
export default {
  name: 'FactoryReset',
  data: function() {
    return {
      disabled: false, // 禁止按钮被点击
      loading: false, // 是否显示按钮的loading效果
      forbidClose: false, // 控制关闭按钮是否被禁止点击
      isShowBlur: false,
      checkNetInterval: null,
      url: null,
      wait: {
        show: false
      },
      tip: {
        msg: '',
        type: 'success',
        show: false
      },
      loadingMaskObj: {
        msg: '',
        show: false,
        showMask: false
      }
    }
  },
  components: {
    PrimartButton,
    CloseButton,
    LoadingWait,
    FadeTips,
    LoadingMask
  },
  methods: {
    factoryResetBtnFn: function () {
      this.wait.show = true
      this.disabled = true
      this.loading = true
      getNetTypeAndWifiSsidService()
        .then(res => {
          const defaultSsid = res.defaultWifiSsid
          let str = this.$t('i18n.FACTORY_RESET_SETUP_PROGRESS') + this.$t('i18n.NETWORK_WILL_DISCONNENTION_PLEASE_CHECK_INTERNET')
          this.loadingMaskObj.msg = str + defaultSsid
          this.loadingMaskObj.show = true
          this.loadingMaskObj.showMask = true
          this.isShowBlur = true
          this.apiFactoryResetFn()
        })
        .catch(e => {
          this.tip.msg = this.$t('i18n.FAILED_GET_NETWORK_INFO')
          this.tip.show = true
          this.tip.type = 'error'
          this.isShowBlur = true
          this.wait.show = false
          this.disabled = false
          this.loading = false
        })
    },
    closeButtonFn: function() {
      this.$router.push('/') // 路由向后退一步,到主界面
    },
    hideFadeTipsFn: function (data) {
      this.isShowBlur = data
      this.tip.show = data
    },
    apiFactoryResetFn: function () {
      factoryResetApi()
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
          this.wait.show = false
          this.disabled = false
          this.loading = false
        })
    },
    checkInternetFn: function () {
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
            window.location.href = `http://192.168.8.1/`
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
            window.location.href = `http://192.168.8.1/`
          }
          this.disabled = false
          this.loading = false
        })
    }
  },
  created () {
    this.$emit('emitShowBlur', true)
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
  .factory-reset {
    .loading-wait {
      margin-top: rem(50px);
    }
  }
</style>
