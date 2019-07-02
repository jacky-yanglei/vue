<template>
    <div class="filter-pop">
      <div :class="loading?'filter':''">
        <div class="box">
          <h3>{{$t('i18n.INPUT_WIFI_PASSWORD')}}</h3>
          <div class="input-group" :class="!passwordValid?'error':''">
            <input @focus="passwordValid = true" v-model="password" :type="!showPwd?'password':'text'" :placeholder="$t('i18n.INPUT_WIFI_PASSWORD')" >
            <!-- <div class="switch-input" @click="switchInput">
              可见
            </div> -->
            <div v-if="!passwordValid" class="error-text">{{$t('i18n.INCORRECT_PASSWORD_TRY_AGAIN')}}</div>
          </div>
          <div>
            <primary-button :disabled="password.length < 8" @buttonClicked="submitPwd">{{$t('i18n.CONFIRM')}}</primary-button>
          </div>
        </div>
        <div>
          <CloseButton :forbidClose="loading" @emitCloseButton="clickCloseButton"></CloseButton>
        </div>
      </div>
      <div class="loading" v-if="loading">
        <loading-wait :show="true" :msg="$t('i18n.WIFI_SETUP_PROGRESS') + $t('i18n.NETWORK_WILL_DISCONNENTION_PLEASE_CHECK_INTERNET_1') + thisWifiSsid"></loading-wait>
      </div>
    </div>
</template>

<script>
import PrimaryButton from '@/common/components/buttons/primary-button'
import LoadingWait from '@/common/components/loadings/loading-wait'
import CloseButton from '@/common/components/buttons/close-button'
import { netRepeaterSet, getNetRepeaterStatusApi } from '@/api/network-check-api.js'
import { getInitStatusApi } from '@/api/login-api.js'
import getNetTypeAndWifiSsidService from '@/common/service/getNetTypeAndWifiSsid.js'

export default {
  name: 'InputWIFIView',
  data() {
    return {
      passwordValid: true, // 密码验证
      loading: false, // 正在验证的状态
      showPwd: false, // 是否展示密文密码
      password: '', // 密码参数
      thisWifiSsid: '',
      WifiInfo: { // wifi的信息
        enable: 1 // 提交的参数 =>不重要但是必须设置成 1
      },
      errorNumber: 1
    }
  },
  components: {
    PrimaryButton,
    CloseButton,
    LoadingWait
  },
  created () {
    if (this.$root.Bus.WifiInfo) {
      this.WifiInfo = Object.assign(this.$root.Bus.WifiInfo, this.WifiInfo)
    } else {
      this.WifiInfo = Object.assign(JSON.parse(window.sessionStorage.getItem('WifiInfo')), this.WifiInfo)
    }
    // 获取wifi信息如果能直接在全局变量中获取就直接获取  获取不到就在sessionStorage中拿
    getNetTypeAndWifiSsidService().then(res => {
      this.thisWifiSsid = res.wifiSsid
    })
  },
  methods: {
    submitPwd: function () {
      let that = this
      this.loading = true // 开启验证状态
      this.WifiInfo.password = this.password
      netRepeaterSet(this.WifiInfo).then(res => {
        console.log(res)
        if (res === true) {
          this.checkInitStatus()
        } else if (res.ret === -1) {
          console.log('密码错误')
        } else {
          console.log('未知错误')
        }
      }).catch(() => {
        that.passwordValid = false
        that.loading = false
      })
    },
    checkInitStatus() {
      let aa
      this.getStatusInterValTime = window.setInterval(() => {
        getInitStatusApi().then(res => {
          if (' ' + res) {
            window.clearInterval(this.getStatusInterValTime)
            if (aa) {
            } else {
              aa = setTimeout(() => {
                this.$root.Bus.$emit('maskClick', true)
                this.getNetRepeaterStatus()
                clearTimeout(aa)
              }, 10000)
            }
          }
        })
      }, 1000)
    },
    getNetRepeaterStatus() {
      getNetRepeaterStatusApi()
        .then(res => {
          console.log(this.loading)
          if (this.loading) {
            // 确保进入其他页面后不会再改变路由到'/not-found-networking'
            if (Number.parseInt(res.ret) === 0) { // 设置成功并联网成功就跳转到设置成功的页面
              this.loading = false
              this.$router.push('/set-success')
            } else {
              if (Number.parseInt(res.ret) === 1) {
                this.errorNumber++
                if (this.errorNumber === 3) {
                  this.loading = false
                  this.errorNumber = 1
                  this.$router.push({name: 'NotFoundNetworking', params: {state: 1}})
                } else {
                  setTimeout(() => {
                    this.getNetRepeaterStatus()
                  })
                }
              }
            }
          }
        })
        .catch(e => {
          console.log(e)
        })
    },
    clickCloseButton() {
      this.$router.go(-1)
    },
    switchInput () {
      this.showPwd = !this.showPwd
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../common/scss/mixin';
  @import '../../../common/scss/utils';
  .filter-pop{
    width: 100%;
    min-height: 100vh;
    position: absolute;
    background:linear-gradient(-180deg,rgba(238,239,242,0.3),rgba(216,218,225,0.3));
    top: 0;
    left: 0;
    z-index: 100;
    overflow-y: auto;
    padding-top: rem(183px);
    .loading{
      position: absolute;
      width: 100%;
      height: 100vh;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    > div {
      width: rem(590px);
      margin: 0 auto;
      > .box {
        background-color: white;
        border-radius: 8px;
        padding: rem(40px);
        > h3 {
          text-align: center;
          font-size: rem(36px);
          color: #3A3848;
          line-height: rem(50px);
          margin-bottom: rem(60px);
        }
        .input-group{
          margin-bottom: rem(137px);
          position: relative;
          &.error{
            position: relative;
            .error-text {
              position: absolute;
              bottom: - rem(57px);
              color: #F14466;
              left: 0;
              width: 100%;
            }
            >input {
              border: 1px solid #F14466;
              background: rgba(241, 68, 102, 0.1);
              position: relative;
            }
          }
          input{
            width: 100%;
            box-sizing: border-box;
            border-bottom: 1px solid #E6E6E7;
            background-color: white;
            padding: rem(24px) rem(80px) rem(24px) rem(30px);
            border-radius: rem(8px);
            font-size: rem(30px);
            color: #3A3848;
            border-top: none;
            border-left: none;
            border-right: none;
            outline: none;
            &:focus{
              transition: all .2s linear;
              border: 1px solid #009FE8;
              box-shadow: 0 rem(8px) rem(30px) rgba(0, 159, 232, 0.3);
            }
          }
          .switch-input{
            position: absolute;
            top: rem(20px);
            right: rem(10px);
          }
        }
      }
    }
  }
  .filter{
    filter: blur(10px);
    height: 100vh;
    overflow: hidden;
  }
</style>
