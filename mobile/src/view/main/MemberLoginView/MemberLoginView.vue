<template>
  <div class="login-wrapper">
    <div class="title">{{ $t('i18n.MEMBER_LOGIN') }}</div>
    <div class="input-wrapper" :class="{'focus': userFocus}">
      <input type="text"
      :placeholder="$t('i18n.PLEASE_INPUT_ACCOUNT')"
      v-model="username"
      @focus="inputFocus('user')"
      @blur="inputBlur('user')">
    </div>
    <div class="input-wrapper" :class="{'focus': passFocus}">
      <input type="password"
      :placeholder="$t('i18n.PLEASE_INPUT_PASS')"
      v-model="pass"
      @focus="inputFocus('pass')"
      @blur="inputBlur('pass')">
    </div>
    <primary-button
    :loading="waitting"
    :disabled="waitting"
    class="login-btn"
    @buttonClicked="memberLogin">{{ $t('i18n.LOGIN') }}</primary-button>
    <div class="forget-pass"><a href="#">{{ $t('i18n.FORGET_PASS') }}</a></div>
    <fide-tips
    :msg="tips.msg"
    :show="tips.show"
    :type="tips.type"
    @hide="hideFide"></fide-tips>
  </div>
</template>

<script>
import PrimaryButton from '../../../common/components/buttons/primary-button'
import FideTips from '../../../common/components/fade-tips/fade-tips'
import { UserLoginApi } from '../../../api/user-manger-api'
import dealErrorCode from '../../../common/service/code'
import { mapMutations } from 'vuex'

import Base64 from '../../../common/service/base64'
import utils from '../../../common/service/utils'

const base64 = new Base64()

export default {
  name: 'MemberLogin',
  data () {
    return {
      username: '',
      pass: '',
      waitting: false,
      userFocus: false,
      passFocus: false,
      tips: {
        msg: '',
        type: '',
        show: false
      }
    }
  },
  mounted () {
    this.username = base64.decode(utils.getCookie('username'))
  },
  methods: {
    inputFocus(fouce) {
      if (fouce === 'user') {
        this.userFocus = true
      } else {
        this.passFocus = true
      }
    },
    inputBlur(fouce) {
      if (fouce === 'user') {
        this.userFocus = false
      } else {
        this.passFocus = false
      }
    },
    memberLogin() {
      if (this.username && this.pass) {
        const loginData = {
          'action': 'login',
          'name': this.username,
          'password': this.pass
        }
        this.waitting = true
        UserLoginApi(loginData)
          .then(res => {
            this.waitting = false
            const userName = base64.encode(this.username)

            // 设置cookie
            let expires = new Date()
            expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000))
            expires = expires.toGMTString()
            document.cookie = `username=${userName};expires=${expires};path=/`

            this.setUserInfo(res)
            this.$router.push('/')
          })
          .catch(e => {
            const code = 'i18n.ERROR_CODE.' + dealErrorCode(e.code)
            this.waitting = false
            this.tips.msg = this.$t(code)
            this.tips.type = 'error'
            this.tips.show = true
          })
      }
    },
    hideFide() {
      this.tips.show = false
    },
    ...mapMutations({
      'setUserInfo': 'SET_USER_INFO'
    })
  },
  components: {
    PrimaryButton,
    FideTips
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
  overflow: hidden;
  background:linear-gradient(-180deg,rgba(238,239,242,1),rgba(216,218,225,1));
  text-align: center;
  .title {
    font-size: rem(36px);
    color:rgba(58,56,72,1);
    margin-top: rem(100px);
    margin-bottom: rem(60px);
  }
  .input-wrapper {
    position: relative;
    width: rem(590px);
    height: rem(90px);
    margin: 0 auto;
    &:nth-child(2) {
      margin-bottom: rem(30px);
    }
    &.focus {
      &::after {
        position: absolute;
        z-index: 11;
        width: rem(594px);
        height: rem(94px);
        left: rem(-2px);
        top: rem(-2px);
        border-radius: rem(8px);
        content: '';
        background:linear-gradient(-90deg,rgba(57,193,255,1),rgba(0,159,232,1));
        box-shadow:0px rem(8px) rem(30px) 0px rgba(0,159,232, .3);
      }
    }
    input {
      position: relative;
      z-index: 12;
      width: 100%;
      height: 100%;
      border-radius: rem(8px);
      border: none;
      outline: none;
      background: white;
      font-size: rem(30px);
      padding-left: rem(30px);
      color:rgba(58,56,72,1);
      :-moz-placeholder,
      :-ms-input-placeholder,
      ::-webkit-input-placeholder {
        font-size: rem(30px);
        color:rgba(179,179,179,1);
      }
    }
  }
  .login-btn {
    display: block;
    margin: 0 auto;
    width: rem(590px);
    margin-top: rem(60px);
  }
  .forget-pass {
    text-align: center;
    font-size: rem(28px);
    margin-top: rem(60px);
    a {
      color:rgba(131,137,161,1);
      &:hover {
        color: #009FE8;
      }
    }
  }
}
</style>
