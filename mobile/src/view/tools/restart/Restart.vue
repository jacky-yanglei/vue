<template>
  <div>
    <div class="restart pdt-176" :class="{'blur': isShowBlur}">
      <div class="tools-wrapper-min">
        <h3 class="tools-title restart-title">{{$t('i18n.RESTART_LIANJIBAO')}}</h3>
        <p class="tools-tip">{{$t('i18n.LIANJIBAO_WILL_RESTART_IMMEDIATELY')}}</p>
        <loading-wait :msg="wait.msg" :show="wait.show" class="loading-wait"></loading-wait>
        <div class="tools-btn-min">
          <primart-button :disabled="disabled" :loading="loading" @buttonClicked="restartBtnFn()">{{$t('i18n.RESTART')}}</primart-button>
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
import { restartApi } from '@/api/system-manage-api'
import { getInitStatusApi } from '@/api/login-api'
export default {
  name: 'Restart',
  data: function() {
    return {
      disabled: false, // 禁止按钮被点击
      loading: false, // 是否显示按钮的loading效果
      forbidClose: false, // 控制关闭按钮是否被禁止点击
      wait: {
        msg: this.$t('i18n.WAITING'),
        show: false
      },
      isShowBlur: false,
      tip: {
        msg: '',
        show: false,
        type: 'success'
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
    restartBtnFn: function () {
      this.wait.show = true
      this.disabled = true
      this.loading = true
      getNetTypeAndWifiSsidService()
        .then(res => {
          const ssid = res.wifiSsid
          let str = this.$t('i18n.RESTART_LJB_PROGRESS') + this.$t('i18n.NETWORK_WILL_DISCONNENTION_PLEASE_CHECK_INTERNET')
          this.loadingMaskObj.msg = str + ssid
          this.loadingMaskObj.show = true
          this.loadingMaskObj.showMask = true
          this.isShowBlur = true
          this.apiRestartFn()
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
    closeButtonFn: function () {
      this.$router.push('/')
    },
    hideFadeTipsFn: function (data) {
      this.isShowBlur = data
      this.tip.show = data
    },
    apiRestartFn: function () {
      // 调用重启联机宝的接口
      restartApi()
        .then(res => {
          this.checkNetStatusFn()
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
    checkNetStatusFn: function () {
      let aa = setTimeout(() => {
        getInitStatusApi()
          .then(res => {
            clearTimeout(aa)
            this.loadingMaskObj.msg = ''
            this.loadingMaskObj.show = false
            this.loadingMaskObj.showMask = false
            this.tip.msg = this.$t('i18n.RESTART_LJB_SUCCESS')
            this.tip.show = true
            this.tip.type = 'success'
            this.isShowBlur = true
            this.wait.show = false
            this.disabled = false
            this.loading = false
          })
          .catch(e => {
            clearTimeout(aa)
            this.checkNetStatusFn()
          })
      }, 3000)
    }
  },
  created () {}
}
</script>

<style lang="scss" scoped>
  @import '../../../common/scss/_mixin';
  @import '../../../common/scss/_utils';
  @import '../../../common/scss/tools';
  .restart {
    .loading-wait {
      margin-top: rem(50px);
    }
  }
</style>
