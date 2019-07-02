<template>
  <div id="ljb-index">
    <div :class="{ 'blur': toggleIndexBlurComponent, 'fixed': isAddClassFixed }" class="center">
      <div class="left-component-wrapper">
        <div class="index-loading-wrapper" v-show="!isReady">
          <loading class="index-loading"></loading>
          <p>{{ $t('i18n.GETTING_USER_INFORMATION') }}...</p>
        </div>
        <component :is="currentComponent" v-show="isReady"></component>
      </div>
      <index-right></index-right>
      <tools-component ref="toolsComponent"></tools-component>
    </div>
    <ljb-footer v-show="toggleIndexBlurComponent"></ljb-footer>
    <div class="mask-inner" v-show="toggleIndexBlurComponent">
      <div class="mask" v-if="toggleIndexBlurComponent" @click="blurClick()" :class="{ 'mask-color': isIE }"></div>
      <transition >
        <router-view class="z-index" ref="routerView" v-show="toggleIndexBlurComponent"></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import utils from '../../common/service/utils'
import IndexRight from '@/view/main/components/index-right/IndexRight'
import SpeedUpNoBtn from '@/view/main/components/SpeedUpNoBtn'
import VipTimeEnd from '@/view/main/components/VipTimeEnd'
import ToolsComponent from '@/view/tools/Tools'
import LjbFooter from '@/common/components/ljb-footer/Index'
import Loading from '../../common/components/loading/loading'

import { getUserDetailsApi } from '../../api/user-manger-api'

export default {
  name: 'mainIndex',
  data: function() {
    return {
      toggleIndexBlurComponent: false, // 切换主界面毛玻璃效果
      toggleWifiBlurComponent: false, // 切换wifi-login的毛玻璃效果
      isShow: true,
      isIE: false,
      isAddClassFixed: false,
      isLogin: false,
      couldeClick: true,
      currentComponent: SpeedUpNoBtn,
      isReady: false,
      isGetUserDetails: true // 是否允许获取用户用户详细信息
    }
  },
  components: {
    IndexRight,
    SpeedUpNoBtn,
    ToolsComponent,
    VipTimeEnd,
    LjbFooter,
    Loading
  },
  beforeMount() {
    // this.getAccState()
  },
  mounted() {
    this.getRoute()
    this.isIE = utils.bowserIE()
  },
  watch: {
    $route: 'getRoute'
  },
  created() {
    this.$root.Bus.$on('maskClick', val => {
      this.couldeClick = val
    })
    this.$root.Bus.$on('memberLoginSuccess', res => {
      let userType = parseInt(res.userType)
      if (userType === 7 || userType === 3 || userType === 15) {
        // 如果返回的userType值为3、7、15，表示账号时间已经过期
        this.currentComponent = VipTimeEnd
      } else {
        this.currentComponent = SpeedUpNoBtn
      }
      this.isReady = true
    })
    this.$root.Bus.$on('memberLoginOut', res => {
      this.currentComponent = SpeedUpNoBtn
      this.isReady = true
    })
    this.$root.Bus.$emit('HiddenAppLoading')
    this.$root.Bus.$on('busCheckLoginStatus', data => {
      if (this.isGetUserDetails) {
        if (data !== 'INIT') {
          this.getUserDetails()
          this.isGetUserDetails = false
        }
      }
      let aa = setTimeout(() => {
        this.isGetUserDetails = true
        clearTimeout(aa)
      }, 5522)
    })
    if (this.isCheckVer) {
      // this.getVersionInfoFn()
      this.isCheckVer = false
    }
    this.$root.Bus.$on('busCheckStateStatus', data => {
      this.getAccState(data)
    })
  },
  methods: {
    getRoute: function() {
      // 获取路由字符串
      const pathStr = this.$route.path
      this.toggleComponentFn(pathStr)
    },
    toggleComponentFn: function(path) {
      // 根据路由匹配，切换相关组件的显隐
      if (path === '/') {
        this.toggleIndexBlurComponent = false
        this.isAddClassFixed = false
      } else {
        this.toggleIndexBlurComponent = true
        this.isAddClassFixed = true
      }
    },
    blurClick: function() {
      if (this.couldeClick) {
        this.$router.push('/')
      }
    },
    getAccState(res) {
      // 获取加速状态
      if (res.status === 'INIT') {
        this.isLogin = false
        this.isReady = true // 没有登录时默认显示加速
        this.$root.Bus.$emit('memberLoginOut') // 触发Bus登录事件，控制过期时间和登录按钮的显示隐藏
      } else {
        this.isLogin = true
        this.getUserDetails()
      }
      this.$root.Bus.$emit('isLogin', this.isLogin) // 触发Bus类的islogin事件，控制NavList注销按钮的显示隐藏
    },
    getUserDetails() {
      // 获取用户信息
      getUserDetailsApi()
        .then(res => {
          this.$root.Bus.$emit('memberLoginSuccess', res)
          let userType = parseInt(res.userType)
          if (userType === 7 || userType === 3 || userType === 15) {
            // 如果返回的userType值为3、7、15，表示账号时间已经过期
            this.currentComponent = VipTimeEnd
          } else {
            this.currentComponent = SpeedUpNoBtn
          }
          this.isReady = true
        })
        .catch(e => {
          this.isReady = true
          this.$root.Bus.$emit('memberLoginOut')
        })
    },
    toUpdateFirmware: function() {
      this.$router.push('/tools/firmware')
    }
  },
  beforeDestroy() {
    this.$root.Bus.$off('maskClick')
    this.$root.Bus.$off('memberLoginSuccess')
    this.$root.Bus.$off('memberLoginOut')
    this.$root.Bus.$off('busCheckLoginStatus')
    this.$root.Bus.$off('busCheckStateStatus')
  }
}
</script>

<style lang="scss" scoped>
#ljb-index {
  position: relative;
  padding-top: 116px;
  .z-index {
    z-index: 100;
  }
  & > .center {
    position: absolute;
    right: 50%;
    z-index: 9;
    margin: 0 auto;
    transform: translateX(50%);
    & > .update-tip {
      position: absolute;
      top: -36px;
      width: 120px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      font-size: 12px;
      color: #fff;
      background:linear-gradient(-90deg,rgba(57,193,255,1),rgba(0,159,232,1));
      border-radius:4px 4px 0px 0px;
      left: 50%;
      transform: translateX(-50%);
      cursor: pointer;
      display: none;
      &.display {
        display: block;
      }
    }
  }
  & > .center.fixed {
    position: fixed;
  }
  .left-component-wrapper {
    position: relative;
    float: left;
    width: 704px;
    height: 628px;
    border-radius: 6px;
    background-color: #fff;
    -webkit-box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.06);
    box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.06);
    .index-loading-wrapper {
      position: absolute;
      top: 50%;
      z-index: 10;
      width: 100%;
      text-align: center;
      .index-loading {
        margin: 0 auto;
        margin-bottom: 24px;
      }
    }
    .login-tip {
      position: absolute;
      width: 704px;
      height: 50px;
      border-radius: 6px 6px 0px 0px;
      background: linear-gradient(
        90deg,
        rgba(0, 159, 232, 0.1),
        rgba(0, 159, 232, 0)
      );
      color: rgba(58, 56, 72, 1);
      text-align: center;
      font-size: 14px;
      line-height: 50px;
      &.error-tip {
        position: absolute;
        width: 704px;
        height: 50px;
        border-radius: 6px 6px 0px 0px;
        background: linear-gradient(
          90deg,
          rgba(241, 68, 102, 0.1),
          rgba(241, 68, 102, 0)
        );
        color: rgba(58, 56, 72, 1);
        color: rgba(241, 68, 102, 1);
        // top: 0;
        text-align: center;
        font-size: 14px;
        line-height: 50px;
      }
    }
  }
}
@media screen and (max-width: 1366px) {
  #ljb-index {
    padding-top: 90px;
    .left-component-wrapper {
      width: 600px;
      height: 500px;
      margin-left: 28px;
    //  border: 1px solid red;
    //  padding-left: 94px;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.fade-blur-enter-active {
  transition: opacity 0.2s;
}
.fade-blur-enter, .fade-blur-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
