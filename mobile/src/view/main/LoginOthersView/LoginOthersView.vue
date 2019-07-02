<template>
  <div class="login-others-wrapper">
    <div class="content-wrapper">
      <div class="text">{{ $t('i18n.LOGIN_OTHERS') }}</div>
      <primary-btn class="i-know"
      :disabled="knowBtns.disabled"
      :loading="knowBtns.loading"
      @buttonClicked="justKnow">{{ $t('i18n.I_KNOW') }}</primary-btn>
      <primary-btn
      :disabled="loginAgainBtns.disabled"
      :loading="loginAgainBtns.loading"
      @buttonClicked="loginAgain">{{ $t('i18n.LOGIN_AGAIN') }}</primary-btn>
    </div>
    <fade-tips
    :msg="tips.msg"
    :show="tips.show"
    :type="tips.type"
    @hide="hiddenFadeTips"></fade-tips>
    <cloose-btn @emitCloseButton="handleCloseBtn"></cloose-btn>
  </div>
</template>

<script>
import clooseBtn from '../../../common/components/buttons/close-button'
import PrimaryBtn from '../../../common/components/buttons/primary-button'
import FadeTips from '../../../common/components/fade-tips/fade-tips'

import { mapMutations } from 'vuex'
import { forceOfflineApi, clearUserInfo } from '../../../api/user-manger-api'
import dealErrorCode from '../../../common/service/code'
export default {
  name: 'LoginOthers',
  data () {
    return {
      status: '',
      wating: false,
      knowBtns: {
        disabled: false,
        loading: false
      },
      loginAgainBtns: {
        disabled: false,
        loading: false
      },
      tips: {
        msg: '',
        type: '',
        show: false
      }
    }
  },
  mounted () {
    this.status = this.$route.query.status
    if (!this.status) {
      this.$router.push('/')
      return null
    }
  },
  methods: {
    handleCloseBtn() {
      this.$router.push('/')
    },
    justKnow() { // 不重新登录
      this.knowBtns.disabled = true
      this.knowBtns.loading = true
      if (this.status === 'INIT') {
        this.clearUserInfoFn(false, 'know')
        return null
      }
      this.forceOffline(false, 'know')
    },
    forceOffline(toLogin = false, taeget) { // 强制下线
      forceOfflineApi()
        .then(res => {
          if (parseInt(res.ret) === 0) {
            this.clearUserInfoFn(toLogin, taeget)
          }
        })
    },
    clearUserInfoFn(toLogin = false, taeget) { // 清除过期状态
      clearUserInfo()
        .then(res => {
          if (taeget === 'know') {
            this.knowBtns.disabled = false
            this.knowBtns.loading = false
          } else {
            this.loginAgainBtns.disabled = false
            this.loginAgainBtns.disabled = false
          }

          this.changeUserInfo({userExpire: ''}) // 修改userInfo的state

          if (parseInt(res.ret) === 0) {
            if (toLogin) {
              this.$router.push('/member-login')
            } else {
              this.$router.push('/')
            }
          }
        })
        .catch((e) => {
          console.log(e)
          if (taeget === 'know') {
            this.knowBtns.disabled = false
            this.knowBtns.loading = false
          } else {
            this.loginAgainBtns.disabled = false
            this.loginAgainBtns.loading = false
          }
          this.tips.msg = this.$t(`i18n.ERROR_CODE.${dealErrorCode(e.code)}`)
          this.tips.show = true
          this.tips.type = 'error'
        })
    },
    loginAgain() { // 重新登录
      this.loginAgainBtns.disabled = true
      this.loginAgainBtns.loading = true
      if (this.status === 'INIT') {
        this.clearUserInfoFn(true, 'loginAgain')
        return null
      }
      this.forceOffline(true, 'loginAgain')
    },
    hiddenFadeTips() {
      this.tips.msg = ''
      this.tips.show = false
      this.tips.type = ''
    },
    ...mapMutations({
      'changeUserInfo': 'SET_USER_INFO'
    })
  },
  components: {
    clooseBtn,
    PrimaryBtn,
    FadeTips
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/scss/_mixin';
@import '../../../common/scss/_utils';

.login-others-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: linear-gradient(
    -180deg,
    rgba(238, 239, 242, 0.7),
    rgba(216, 218, 225, 0.7)
  );
  .content-wrapper {
    margin: 0 auto;
    margin-top: rem(280px);
    padding: rem(60px) rem(40px);
    width: rem(590px);
    background: rgba(255, 255, 255, 1);
    border-radius: rem(8px);
    text-align: center;
    .text {
      font-size: rem(30px);
      color: rgba(58, 56, 72, 1);
      line-height: rem(42px);
      font-weight: bold;
      margin-bottom: rem(80px);
    }
    .i-know {
      margin-bottom: rem(30px);
    }
  }
}
</style>
