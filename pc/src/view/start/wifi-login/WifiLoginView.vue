<template>
  <div style="position: relative;" class="start-pd">
    <ljb-blur-wifi></ljb-blur-wifi>
    <div class="wifi-login">
      <h2>{{ $t('i18n.INPUT_WIFI_PASSWORD') }}</h2>
      <input type="password" v-model="wifiPass" class="wifi-login-input" :class="{'wifi-login-error': vaildPassFaild}" :placeholder="$t('i18n.PLEASE_INPUT_WIFI_PASSWORD')" @focus="pswFocus()" @keyup.enter="loginWifi">
      <p>{{ errMsg }}</p>
      <primary-button class="wifi-btn" height="46" :text="text" @btnClicked="loginWifi" :disabled="waiting" :loading="waiting">
      </primary-button>
    </div>
  </div>
</template>

<script>
import { PrimaryButton } from '../../../common/components/buttons/index'
import LjbBlurWifi from '@/common/components/ljb-blur-wifi/Index'

import {
  netRepeaterSet,
  getNetRepeaterStatusApi
} from '../../../api/network-check-api'

import { getInitStatusApi } from '../../../api/login-api'
export default {
  name: 'WifiLogin',
  data: function() {
    return {
      wifiPass: '',
      vaildPassFaild: false,
      waiting: false,
      text: this.$t('i18n.CONFIRM'),
      errMsg: '',
      WifiInfo: '',
      getStatusInterValTime: '',
      statusChecking: true,
      errorNumber: 1
    }
  },
  components: {
    LjbBlurWifi,
    PrimaryButton
  },
  methods: {
    getParmas() {
      this.WifiInfo = Object.assign({}, this.$root.Bus.WifiInfo)
    },
    loginWifi() {
      // if (this.wifiPass) {
      this.waiting = true
      Object.assign(this.WifiInfo, { password: this.wifiPass, enable: 1 })
      this.$root.Bus.$emit('maskClick', false)
      netRepeaterSet(this.WifiInfo).then(res => {
        if (res) {
          this.checkInitStatus()
        }
      })
      // } else {
      //   this.vaildPassFaild = true
      // }
    },
    checkInitStatus() {
      this.getStatusInterValTime = window.setInterval(() => {
        getInitStatusApi().then(res => {
          if (' ' + res) {
            window.clearInterval(this.getStatusInterValTime)
            let aa = setTimeout(() => {
              this.$root.Bus.$emit('maskClick', true)
              this.getNetRepeaterStatus()
              clearTimeout(aa)
            }, 10000)
          }
        })
      }, 1000)
    },
    getNetRepeaterStatus() {
      getNetRepeaterStatusApi()
        .then(res => {
          if (this.statusChecking) {
            // 确保进入其他页面后不会再改变路由到'/network-error'
            this.statusChecking = false
            if (Number.parseInt(res.ret) === 0) {
              this.$router.push('/complate')
            } else {
              if (Number.parseInt(res.ret) === 1) {
                this.errorNumber++
                if (this.errorNumber === 3) {
                  this.errorNumber = 1
                  this.$router.push('/network-error')
                } else {
                  this.statusChecking = true
                  let aa = setTimeout(() => {
                    this.getNetRepeaterStatus()
                    clearTimeout(aa)
                  }, 10000)
                }
              } else {
                this.$router.push('/network-error')
              }
            }
          }
        })
        .catch(e => {})
    },
    pswFocus() {
      this.vaildPassFaild = false
    }
  },
  mounted() {
    this.getParmas()
    this.$root.Bus.$emit('HiddenAppLoading')
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_constant.scss';
@import '../../../common/sass/_mixin.scss';

.wifi-login {
  position: relative;
  z-index: 9;
  width: 320px;
  height: 342px;
  background-color: #fff;
  border-radius: 6px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  & > h2 {
    font-size: 22px;
    color: rgba(58, 56, 72, 1);
    line-height: 30px;
    text-align: center;
    padding-top: 40px;
  }
  & > .wifi-login-input {
    width: 240px;
    height: 46px;
    margin: 60px 40px 20px;
    border-radius: 4px;
    border: 1px solid transparent;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    color: rgba(179, 179, 179, 1);
    padding-left: 5px;
    transition: border 0.3s, box-shadow 0.3s;
    &:hover,
    &:focus {
      border: 1px solid rgba(0, 159, 232, 1);
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.5);
    }
  }
  & > p {
    width: 120px;
    height: 17px;
    font-size: 12px;
    color: rgba(241, 68, 102, 1);
    margin-left: 40px;
    margin-bottom: 43px;
    transition: font-size 0.3s;
  }
  & > .p {
    transition: font-size 0.3s;
    font-size: 0;
  }
  & > .wifi-btn {
    width: 240px;
    margin: 0 auto;
  }
  & > .wifi-login-error {
    border: 1px solid rgba(241, 68, 102, 1);
    background-color: rgba(241, 68, 102, 0.1);
  }
}
</style>
