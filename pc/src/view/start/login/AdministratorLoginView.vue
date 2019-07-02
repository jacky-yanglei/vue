/*
 * @Author: Zhengxinglun
 * @Date: 2018-05-17 10:39:08
 * @Last Modified by: Zhengxinglun
 * @Last Modified time: 2018-06-27 17:22:01
 */
<template>
  <div class="administrator-login-view start-pd">
    <div class="administrator-container">
      <error-tips :msg="msg" :show="show"></error-tips>
      <h5 class="title">{{ $t('i18n.LIANJIBAO_WELCOME') }}</h5>
      <label for="password">
        <input type="password"
          name="password"
          id="password"
          :placeholder="$t('i18n.ADMIN_PASSWORD')"
          v-model="pass"
          @blur="pswBlur"
          @keyup.enter="login"
          v-focus="focusStatus">
      </label>
      <primary-button
      :disabled="watiting"
      class="login-btn"
      :loading="watiting"
      :text="text"
      :height="'46'"
      @btnClicked="login()">
      </primary-button>
      <p class="dis">{{ $t('i18n.ADMIN_LOGIN_TIPS_A') }}</p>
      <p class="dis" v-html="$t('i18n.ADMIN_LOGIN_TIPS_B')"></p>
    </div>
    <oval></oval>
  </div>
</template>

<script>
import { getToken } from '@/api/login-api'
import ErrorTips from '@/common/components/error-tips/error-tips'
import { PrimaryButton } from '../../../common/components/buttons/'
import Oval from '@/common/components/oval/oval'

import Base64 from '@/common/service/base64'
const base64 = new Base64()

export default {
  name: 'AdministratorLogin',
  data() {
    return {
      pass: '',
      show: false,
      msg: '',
      watiting: false,
      text: this.$t('i18n.LOGIN'),
      focusStatus: true,
      base64: null
    }
  },
  created() {
    this.pass = this.getCookie('lucipassword')
  },
  mounted() {
    this.$root.Bus.$emit('waitingMaskShow', false)
    this.$root.Bus.$emit('HiddenAppLoading')
    window.sessionStorage.removeItem('token')
    window.sessionStorage.setItem('token', '/;stok=')
    this.$root.Bus.$emit('busStopLoopAccStateGet')
  },
  methods: {
    login() {
      // 登录
      const inputData = {
        luci_username: 'qeeyou',
        luci_app: '2',
        luci_password: this.pass
      }
      if (this.pass) {
        this.watiting = true
        getToken(inputData)
          .then(token => {
            window.sessionStorage.setItem('token', token)

            this.base64 = new Base64()
            const luciApp = this.base64.encode(inputData.luci_app)
            const luciUsername = this.base64.encode(inputData.luci_username)
            const luciPassword = this.base64.encode(inputData.luci_password)

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
            this.show = true
            this.msg = this.$t('i18n.PSD_LOGIN_FAILED')
            this.focusStatus = true
          })
      } else {
        this.focusStatus = true
      }
    },
    pswBlur() {
      this.focusStatus = false
    },
    getCookie: function(name) {
      let arr
      let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
      arr = document.cookie.match(reg)
      if (arr) return this.decode(arr[2])
      else return null
    },
    decode: function(str) {
      if (str) {
        return base64.decode(str)
      } else {
        return ''
      }
    }
  },
  components: {
    ErrorTips,
    PrimaryButton,
    Oval
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_constant.scss';
@import '../../../common/sass/_mixin.scss';

.administrator-login-view {
  width: $startContentWidth;
  margin: 0 auto;
  #text {
    width: 1000px;
    height: 500px;
    background: rgba(23,32,32, .3);
  }
  .administrator-container {
    position: relative;
    width: 100%;
    background: white;
    display: flex;
    flex-direction: column;
    padding: 40px 60px;
    border-radius: $startContentRaduis;
    .title {
      font-size: 22px;
      color: rgba(58, 56, 72, 1);
      line-height: 30px;
      margin-bottom: 60px;
      text-align: center;
    }
    label {
      position: relative;
      display: block;
      height: 46px;
      border-radius: 4px;
      width: 100%;
      margin-bottom: 40px;
      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background: #eee;
        z-index: 90;
      }
      input {
        position: relative;
        height: 46px;
        width: 100%;
        box-sizing: border-box;
        background: white;
        border: none;
        outline: none;
        border-radius: 4px;
        padding-left: 10px;
        font-size: 14px;
        &:focus {
          box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.5);
          border: 1px solid #009fe8;
          z-index: 91;
        }
      }
    }
    .login-btn {
      margin-bottom: 30px;
      margin-top: 0;
    }
    .dis {
      text-align: center;
      font-size: 14px;
      color: #BBB;
      line-height: 22px;
    }
  }
  .blurCanvas {
    position: relative;
    z-index: 999;
  }
}
</style>
