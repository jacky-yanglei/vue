<template>
  <div class="main-wrapper">
    <div class="index-container" :class="{'blur': isShowConfig || isShowSidebar || isMaskWrapper}">
      <div class="nav-bar" @click="showMainSidebar"></div>
      <div class="main-content">
        <div class="status-info" v-if="!isTimeEnd && !isError">{{ headText}}</div>
        <div class="status-info time-end" v-if="isTimeEnd || isError">{{headText}}</div>
        <div class="logo"></div>
        <div v-if="!isFirstGetSpeedInfo">
          <speed-btn v-if="!isTimeEnd" :speeding="speeding" :isSpeedOk="isSpeedOk" :nodeInfo="nodeInfo" @handleSpeedClick="handleSpeedClick">
            <div v-html="text"></div>
          </speed-btn>
          <vip-time-end-speed-btn v-if="isTimeEnd">
            <div v-html="text"></div>
          </vip-time-end-speed-btn>
        </div>
        <div class="loading-wrapper">
          <loading v-if="isFirstGetSpeedInfo" :msg="waiteMsg"></loading>
        </div>
      </div>
      <div class="blur-mask" v-if="isShowConfig || isShowSidebar || isMaskWrapper"></div>
    </div>
    <main-sidebar
    v-if="isShowSidebar"
    @handleChoseSidebar="closeSidebar"
    @handleToolClicked="toolClicked"
    />
    <div class="main-config-wrapper" v-show="!isShowSidebar && !isMaskWrapper">
      <div class="top-head" :class="{'show': isShowConfig}" @click="showMainConfig"></div>
      <main-config v-if="isShowConfig" :isShow="isShowConfig" :accState="nodeInfo"></main-config>
    </div>
    <div class="main-mask-wrapper" :class="{'show': isMaskWrapper}">
      <router-view @handleHidenMainConfig="hidenBlurMsk"></router-view>
    </div>
    <fade-tips :msg="tips.msg" :type="tips.type" :show="tips.show" @hide="handleHideFadeTips"></fade-tips>
  </div>
</template>

<script>
import SpeedBtn from './components/speed-btn'
import Loading from '../../../common/components/loadings/loading-wait'
import VipTimeEndSpeedBtn from './components/vip-time-end-speed-btn'
import MainConfig from './components/main-config'
import MainSidebar from './components/main-sidebar'
import FadeTips from '../../../common/components/fade-tips/fade-tips'

import eventDeal from './js/eventDeal'

import { mapGetters, mapMutations } from 'vuex'
import { accStateGet } from '../../../api/speed-manage-api'
import { getUserDetailsApi } from '../../../api/user-manger-api'

export default {
  name: 'MainView',
  data() {
    return {
      isShowConfig: false, // 控制显示MainConfig设置
      isShowSidebar: false, // 控制是否显示侧边栏
      isMaskWrapper: false, // 控制mask是否显示
      isTimeEnd: false, // 是否过期
      text: `${this.$t('i18n.LOGIN')}<br />QeeYou`,
      headText: '',
      isLogin: false, // 是否登录
      speeding: false, // 是否处于加速中
      isSpeedOk: false, // 是否加速成功
      nodeInfo: {}, // 加速节点信息
      accInterval: null, // 加速状态轮询控制器
      isFirstGetSpeedInfo: true, // 第一次进入时获取加速信息时的load效果
      waiteMsg: this.$t('i18n.WAITING_PULL_SPEED_INFO'),
      requstSending: false, // 是否正在等待响应
      isError: false, // 加速错误,
      eventGetUserInfo: false, // 事件处理获取用户信息
      eventLoginOut: false, // 事件处理登出操作
      tips: {
        msg: '',
        type: '',
        show: false
      }
    }
  },
  created() {
    this.watchRouter()
    this.getAccState()
    this.getUserDeatils()
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    showMainConfig() { // 是否显示设置页面
      this.isShowConfig = !this.isShowConfig
    },
    showMainSidebar() { // 显示侧边栏
      this.isShowSidebar = !this.isShowSidebar
    },
    closeSidebar() { // 关闭侧边栏
      this.isShowSidebar = false
    },
    watchRouter() {
      window.clearInterval(this.accInterval) // 清除轮询状态获取
      if (this.$route.name !== 'Index') {
        this.isMaskWrapper = true
      } else {
        this.isMaskWrapper = false
        this.intervalGetAccState()
      }
    },
    /**
     * options 相关设置项
     */
    hidenBlurMsk(options) {
      if (options['type'] === 'mainConfig') {
        if (options['speedAgain']) {
          this.speeding = true
          this.isSpeedOk = false
          this.text = this.$t('i18n.STARTING_SPEED')
          this.headText = this.$t('i18n.STARTING_SPEED_HEAD_INFO')
        }
        this.isShowConfig = false
      }
    },
    toolClicked(item) {
      this.isShowSidebar = false

      this.$router.push(item.path)
    },
    getAccState() {
      if (this.requstSending) {
        return null
      }
      accStateGet()
        .then(res => {
          this.isFirstGetSpeedInfo = false
          this.requstSending = false
          this.nodeInfo = res
          if (parseInt(res.userType) === 3 || parseInt(res.userType) === 7 || parseInt(res.userType) === 15) {
            this.text = this.$t('i18n.RENEW_NOW')
            this.headText = this.$t('i18n.PAST_DUE_ACCOUNT_INFO')
            this.isTimeEnd = true
            return null
          }
          switch (res.status) {
            case 'INIT':
              this.initStatusFn(res)
              break
            case 'LOGIN_OK':
              this.loginOkStatusFn(res)
              break
            case 'ACCING':
              this.accingStatusFn(res)
              break
            case 'ACC_OK':
              this.accOkStatusFn(res)
              break
          }
        })
        .catch((e) => {
          this.requstSending = false
          console.log(e)
        })
      this.requstSending = true
    },
    initStatusFn(res) { // init状态时处理函数
      eventDeal['event' + res.event](this, res)
    },
    loginOkStatusFn(res) { // login_ok状态处理函数
      eventDeal['event' + res.event](this, res)
    },
    accingStatusFn(res) { // 加速中处理函数
      eventDeal['event' + res.event](this, res)
    },
    accOkStatusFn(res) { // 加速成功处理函数
      eventDeal['event' + res.event](this, res)
    },
    intervalGetAccState() { // 轮询获取加速状态
      this.accInterval = window.setInterval(() => {
        this.getAccState()
      }, 1000)
    },
    handleSpeedClick() { // 加速按钮点击事件处理
      if (!this.isLogin) {
        this.$router.push('/member-login')
      }
    },
    handleHideFadeTips() { // 隐藏fadetips
      this.tips.show = false
      this.tips.type = ''
      this.tips.msg = ''
    },
    getUserDeatils() {
      getUserDetailsApi()
        .then(res => {
          this.changeUserInfo(res)
        })
    },
    ...mapMutations({
      'changeUserInfo': 'SET_USER_INFO'
    })
  },
  watch: {
    '$route': 'watchRouter'
  },
  components: {
    SpeedBtn,
    MainConfig,
    MainSidebar,
    VipTimeEndSpeedBtn,
    Loading,
    FadeTips
  },
  beforeDestroy() {
    window.clearInterval(this.accInterval)
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/scss/_mixin';
@import '../../../common/scss/_utils';
.main-wrapper {
  position: relative;
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1),
    rgba(238, 239, 242, 1)
  );
  & > .main-mask-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    &.show {
      z-index: 9999;
    }
  }
}
.index-container {
  position: relative;
  z-index: 11;
  width: rem(750px);
  height: 100%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1),
    rgba(238, 239, 242, 1)
  );
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  margin: 0 auto;
  &.blur {
    filter: blur(10px);
  }
  .nav-bar {
    position: absolute;
    left: rem(40px);
    top: rem(126px);
    width: rem(56px);
    height: rem(56px);
    background-size: 100%;
    background-repeat: no-repeat;
    background-image: url('./icons/icon-nav-bar.png');
    cursor: pointer;
  }
  .main-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .status-info {
      width: 100%;
      height: rem(70px);
      min-height: rem(70px);
      background: linear-gradient(
        90deg,
        rgba(0, 159, 232, 0.1),
        rgba(0, 159, 232, 0)
      );
      text-align: center;
      font-size: rem(26px);
      color: rgba(58, 56, 72, 1);
      line-height: rem(70px);
      &.time-end {
        background: linear-gradient(
          90deg,
          rgba(241, 68, 102, 0.1),
          rgba(241, 68, 102, 0)
        );
        color: #f14466;
      }
    }
    .logo {
      width: rem(100px);
      height: rem(88px);
      background-repeat: no-repeat;
      background-size: 100%;
      background-image: url('../../../assets/images/icon_logo.png');
      margin: 0 auto;
      margin-top: rem(40px);
    }
    .loading-wrapper {
      margin-top: rem(300px);
    }
  }
  .blur-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 13;
  }
}
.main-config-wrapper {
  position: absolute;
  z-index: 9999;
  left: 0;
  bottom: 0;
  width: 100%;
  .top-head {
    position: relative;
    width: rem(370px);
    height: rem(50px);
    border-radius: 60px 60px 0px 0px;
    background-repeat: no-repeat;
    background-size: 100%;
    background-image: url('./icons/rectangle.png');
    margin: 0 auto;
    &::after {
      position: absolute;
      left: 50%;
      top: rem(-20px);
      margin-left: rem(-14px);
      content: '';
      width: rem(28px);
      height: rem(12px);
      @include bgImg('./icons/icon_set_up.png');
    }
    &.show {
      &::after {
        @include bgImg('./icons/icon_set_down.png');
      }
    }
  }
}
</style>
