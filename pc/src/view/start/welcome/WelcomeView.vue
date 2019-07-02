/*
 * @Author: Zhengxinglun
 * @Date: 2018-05-17 15:41:04
 * @Last Modified by: Zhengxinglun
 * @Last Modified time: 2018-06-27 17:28:49
 */
<template>
  <transition enter-active-class="animated bounceInDown">
    <div class="welcome-view start-pd">
      <div class="welcome-container">
        <div class="logo"></div>
        <h3 class="welcome-use">{{ $t('i18n.LIANJIBAO_WELCOME') }}</h3>
        <p class="dis">{{ $t('i18n.LIANJIBAO_WELCOME_DESCRIPTION') }}</p>
      </div>
      <button type="button" class="begain-btn" @click="checkNetwork()">
        {{ $t('i18n.START_NOW') }}
        <span class="arrow"></span>
      </button>
      <oval></oval>
    </div>
  </transition>
</template>

<script>
import Oval from '@/common/components/oval/oval'
import { getInitStatusApi, getToken } from '../../../api/login-api'
export default {
  name: 'WelcomeView',
  mounted() {
    this.$root.Bus.$emit('HiddenAppLoading')
    getInitStatusApi()
      .then(res => {
        if (Number.parseInt(res)) {
          this.$router.push('/login')
        }
      })
  },
  methods: {
    checkNetwork() {
      this.getToken()
    },
    getToken() {
      getToken({
        luci_username: 'root',
        luci_app: '2',
        luci_password: '12345678'
      })
        .then(res => {
          window.sessionStorage.setItem('token', res)
          this.netTypeCheck()
        })
        .catch(e => {
        })
    },
    netTypeCheck() {
      this.$router.push('/network-check')
    }
  },
  components: {
    Oval
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_constant.scss';
@import '../../../common/sass/_mixin.scss';

.welcome-view {
  width: $startContentWidth;
  margin: 0 auto;
  .welcome-container {
    width: 100%;
    height: 238px;
    padding-top: 40px;
    background: rgba(255, 255, 255, 1);
    border-radius: $startContentRaduis;
    text-align: center;
    .logo {
      width: 54px;
      height: 48px;
      background-image: url('../../../assets/images/icon/icon_logo.png');
      background-size: 100%;
      margin: 0 auto;
    }
    .welcome-use {
      font-size: 28px;
      color: rgba(58, 56, 72, 1);
      line-height: 40px;
      text-align: center;
      margin: 0;
      margin-top: 20px;
    }
    .dis {
      font-size: 14px;
      color: rgba(58, 56, 72, 1);
      line-height: 20px;
      margin-top: 10px;
    }
  }
  .begain-btn {
    position: relative;
    @include startBtn-primary ();
    width: 100%;
    height: 56px;
    margin-top: 30px;
    &:hover {
      box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.5);
      &::before {
        position: absolute;
        top: -3px;
        left: -3px;
        content: '';
        display: block;
        width: 432px;
        height: 56px;
        border: 3px solid white;
        border-radius: $startContentRaduis;
      }
    }
    .arrow {
      vertical-align: middle;
      display: inline-block;
      width: 9px;
      height: 15px;
      background-image: url('../../../assets/images/icon/icon_button_arrow.png');
      background-size: 100;
      margin-left: 5px;
    }
  }
}
</style>
