<template>
  <div class="login-wrapper">
    <div class="title">{{ $t('i18n.THANKS_USE_LJB') }}</div>
    <div class="input-wrapper">
      <input type="password" :placeholder="$t('i18n.INPUT_PASS')" v-model="pass">
    </div>
    <primary-button
    class="login-btn"
    @buttonClicked="login"
    :loading="watiting"
    :disabled="watiting">{{ $t('i18n.LOGIN') }}</primary-button>
    <div class="dis">{{ $t('i18n.LOGIN_DIS1') }}</div>
    <div class="dis">{{ $t('i18n.LOGIN_DIS2') }}</div>
    <fade-tips
    :msg="tips.msg"
    :show="tips.show"
    :type="tips.type"
    @hide="hidenFadeTips"></fade-tips>
  </div>
</template>

<script>
import PrimaryButton from '../../../common/components/buttons/primary-button'
import FadeTips from '../../../common/components/fade-tips/fade-tips'
import {getToken} from '../../../api/login-api'

import Base64 from '../../../common/service/base64'
const base64 = new Base64()

export default {
  name: 'Login',
  data() {
    return {
      pass: '',
      base64: false,
      watiting: false,
      tips: {
        msg: '',
        show: false,
        type: ''
      }
    }
  },
  mounted () {
    window.sessionStorage.setItem('token', '/;stok=')
  },
  methods: {
    login() {
      const inputData = {
        luci_username: 'qeeyou',
        luci_app: '2',
        luci_password: this.pass
      }
      if (this.pass) {
        this.watiting = true
        getToken(inputData)
          .then(token => {
            // this.watiting = false
            window.sessionStorage.setItem('token', token)

            const luciApp = base64.encode(inputData.luci_app)
            const luciUsername = base64.encode(inputData.luci_username)
            const luciPassword = base64.encode(inputData.luci_password)

            // 设置cookie
            let expires = new Date()
            expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000))
            expires = expires.toGMTString()
            document.cookie = `luciapp=${luciApp};expires=${expires};path=/`
            document.cookie = `luciusername=${luciUsername};expires=${expires};path=/`
            document.cookie = `lucipassword=${luciPassword};expires=${expires};path=/`
            this.$router.push('/')
          })
          .catch(() => {
            this.watiting = false
            this.tips.msg = this.$t('i18n.LOGIN_FAIL')
            this.tips.type = 'error'
            this.tips.show = true
          })
      }
    },
    hidenFadeTips() {
      this.tips.msg = ''
      this.tips.show = false
      this.tips.type = ''
    }
  },
  components: {
    PrimaryButton,
    FadeTips
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/scss/_mixin';
@import '../../../common/scss/_utils';

.login-wrapper {
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  background:linear-gradient(-180deg,rgba(238,239,242,1),rgba(216,218,225,1));
  padding: 0 rem(80px);
  text-align: center;
  overflow: hidden;
  .title {
    margin-top: rem(100px);
    font-size: rem(36px);
    color:rgba(58,56,72,1);
  }
  .input-wrapper {
    width: 100%;
    height: rem(90px);
    margin-top: rem(60px);
    input {
      width: 100%;
      height: 100%;
      border: none;
      background:rgba(255,255,255,1);
      border-radius: rem(8px);
      padding: 0 rem(30px);
      font-size: rem(30px);
      ::-webkit-input-placeholder,
      :-moz-placeholder,
      :-ms-input-placeholder {
        color: #B3B3B3;
      }
    }
  }
  .login-btn {
    margin-top: rem(60px);
    margin-bottom: rem(40px);
  }
  .dis {
    font-size: rem(28px);
    color:rgba(131,137,161,1);
    line-height: rem(40px);
  }
}
</style>
