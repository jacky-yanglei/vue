<template>
<div>
  <div class="tools-wrapper-main change-passward" :class="{'blur': isShowBlur}">
    <public-header :headerTxt="headerTxt"></public-header>
    <div class="mg-40 tools-wrapper-max change-password-content" @click.stop.prevent="controlFocusFn()">
      <div class="form-group">
        <input class="tools-input"
          type="password"
          name="newPsd"
          :placeholder="$t('i18n.NEW_PASSWORD')"
          v-model="newPsd.txt"
          @click.stop.prevent="focusNewPsdFn()"
          @blur="blurNewPsdFn()"
          ref="NewPsd"
          :class="{'error-input': !newPsd.vaild && newPsd.errorTip}">
        <div class="error-tip" v-show="!newPsd.vaild && newPsd.errorTip">{{$t('i18n.ADMIN_PASSWORD_LENGHTH')}}</div>
      </div>
      <div class="form-group">
        <input class="tools-input"
          type="password"
          name="reNewPsd"
          :placeholder="$t('i18n.CONFIRM_NEW_PASSWORD')"
          v-model="renewPsd.txt"
          @click.stop.prevent="focusRenewPsdFn()"
          @blur="blurRenewPsdFn()"
          ref="ReNewPsd"
          :class="{'error-input': !renewPsd.vaild && renewPsd.errorTip}">
        <div class="error-tip" v-show="!renewPsd.vaild && renewPsd.errorTip">{{$t('i18n.THE_TWO_PASSWORDS_DIFFER')}}</div>
      </div>
      <div class="tools-bottom" :class="{'position': isChangePosition1 || isChangePosition2}">
        <p class="tools-tip color">{{$t('i18n.ADMIN_PASSWORD_IS_THE_SAME_AS_WIFI_PASSWORD')}}</p>
        <primart-button :disabled="disabled"
          :loading="loading"
          @buttonClicked="saveBtnFn()">{{$t('i18n.SAVE_AND_EFFECT')}}</primart-button>
      </div>
    </div>
  </div>
  <fade-tips :msg="tip.msg" :show="tip.show" :type="tip.type" @hide="hideFadeTipsFn"></fade-tips>
  <loading-mask :msg="loadingMaskObj.msg"
      :show="loadingMaskObj.show"
      :showMask="loadingMaskObj.showMask"></loading-mask>
</div>
</template>

<script>
import PublicHeader from '@/common/components/public-header/public-header'
import PrimartButton from '@/common/components/buttons/primary-button'
import regular from '@/common/service/regular'
import FadeTips from '@/common/components/fade-tips/fade-tips'
import { changePassword } from '@/api/system-manage-api'
import { netWlanSet } from '@/api/network-check-api'
import { getInitStatusApi } from '@/api/login-api'
import LoadingMask from '@/common/components/loadings/loading-mask'
import getNetTypeAndWifiSsidService from '@/common/service/getNetTypeAndWifiSsid'
export default {
  name: 'ChangePassword',
  data: function () {
    return {
      headerTxt: this.$t('i18n.MODIFY_ADMIN_PASSWORD'),
      disabled: false,
      loading: false,
      isShowErrorTip: false,
      isShowBlur: false,
      isChangePosition1: false,
      isChangePosition2: false,
      newPsd: {
        txt: '',
        vaild: false, // 用于验证内容
        errorTip: false // 用于错误提醒的样式控制
      },
      renewPsd: {
        txt: '',
        vaild: false,
        errorTip: false
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
    PublicHeader,
    PrimartButton,
    FadeTips,
    LoadingMask
  },
  methods: {
    saveBtnFn: function () {
      // console.log(this.newPsd.vaild, this.renewPsd.vaild)
      this.verifyNewPsdFn() // 校验新密码
      if (this.newPsd.vaild === false) return
      this.verifyRenewPsdFn() // 校验确认新密码
      if (this.renewPsd.vaild === false) return
      this.disabled = true
      this.loading = true
      getNetTypeAndWifiSsidService()
        .then(res => {
          const ssid = res.wifiSsid
          let str = this.$t('i18n.MODIFY_MANAGE_PASSWORD') + this.$t('i18n.NETWORK_WILL_DISCONNENTION_PLEASE_CHECK_INTERNET')
          this.loadingMaskObj.msg = str + ssid
          this.loadingMaskObj.show = true
          this.loadingMaskObj.showMask = true
          this.isShowBlur = true
          this.apiChangePasswordFn()
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
    focusNewPsdFn: function () {
      this.newPsd.errorTip = false
      this.isChangePosition1 = true
    },
    verifyNewPsdFn: function () {
      // 校验新密码
      let result = regular.verifyAdminPassword(this.newPsd.txt)
      if (!result) {
        this.newPsd.errorTip = true
        this.newPsd.vaild = false
      } else {
        this.newPsd.errorTip = false
        this.newPsd.vaild = true
        if (this.renewPsd.errorTip) {
          this.verifyRenewPsdFn()
        }
      }
    },
    blurNewPsdFn: function () {
      this.verifyNewPsdFn()
      this.isChangePosition1 = false
    },
    focusRenewPsdFn: function () {
      this.renewPsd.errorTip = false
      this.isChangePosition2 = true
    },
    verifyRenewPsdFn: function () {
      // 校验确认新密码
      let result = this.newPsd.txt === this.renewPsd.txt && this.renewPsd.txt !== ''
      if (!result) {
        this.renewPsd.errorTip = true
        this.renewPsd.vaild = false
        this.disabled = true
      } else {
        this.renewPsd.errorTip = false
        this.renewPsd.vaild = true
        this.disabled = false
      }
    },
    blurRenewPsdFn: function () {
      this.verifyRenewPsdFn()
      this.isChangePosition2 = false
    },
    hideFadeTipsFn: function (data) {
      this.isShowBlur = data
      this.tip.show = data
    },
    apiChangePasswordFn: function () {
      let apiData = {
        password1: this.newPsd.txt,
        password2: this.renewPsd.txt
      }
      changePassword(apiData)
        .then(res => {
          this.apiNetWlanSetFn()
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
    apiNetWlanSetFn: function () {
      netWlanSet({ password: this.newPsd.txt })
        .then((res) => {
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
            this.tip.msg = this.$t('i18n.MODIFY_ADMIN_PASSWORD_SUCCESS')
            this.tip.show = true
            this.tip.type = 'success'
            this.isShowBlur = true
            this.disabled = false
            this.disabled = false
            this.loading = false
          })
          .catch(e => {
            clearTimeout(aa)
            this.checkNetStatusFn()
          })
      }, 3000)
    },
    controlFocusFn: function () {
      this.$refs.NewPsd.blur()
      this.$refs.ReNewPsd.blur()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../common/scss/_mixin';
  @import '../../../common/scss/_utils';
  @import '../../../common/scss/tools';
  .change-passward {
    .tools-input {
      &::-moz-placeholder {
        font-size: rem(30px);
        color: rgba(179,179,179,1);
      }
      &::placeholder {
        font-size: rem(30px);
        color: rgba(179,179,179,1);
      }
    }
    .color {
      color: rgba(117,115,139,1);
      margin-bottom: rem(40px);
    }
    .form-group {
      padding-bottom: rem(30px);
      & > .error-tip {
        padding-top: rem(20px);
        font-size: rem(26px);
        color: rgba(241,68,102,1);
        transition: padding-top .3s;
      }
    }
    .tools-bottom {
      &.position {
        position: relative;
        padding: 0;
        margin-top: rem(340px);
      }
    }
  }
</style>
