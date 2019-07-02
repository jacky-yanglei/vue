<template>
  <div id="ljb-tools">
    <i class="icon-logo"></i>
    <span class="tip-vip-finish" v-if="tipVipFinishTxt">
      {{ $t('i18n.VIP_FINISH') }}：{{ tipVipFinishTxt }}
    </span>
    <button class="update-tip-btn"
      :class="{'mgr128': isAddClassMgr128 && isShowUpdateBtn, 'show': isShowUpdateBtn && isNewVer}"
      @click="toUpdateFirmware()">
      {{ $t('i18n.FIRMWARE_UPDATE') }}
      <i>1</i>
      <span></span>
    </button>
    <login-status ref="loginStatus" v-show="isShowLoginStatus" @expirationTime="showExpirationTime"></login-status>
    <button class="tools-btn" ref="toolsBtn" :disabled="isDisabled" @click="toggleToolsLists(showTools)" v-if="isShowLoginStatus">
      <span>{{ $t('i18n.TOOL') }}<i></i></span>
    </button>
    <tools-nav-lists @hide-tools-lists="hideToolsListsFn"></tools-nav-lists>
    <div class="cover-div" :class="{'cover': isShowCover}"></div>
  </div>
</template>

<script>
import LoginStatus from '@/view/tools/components/LoginStatus'
import ToolsNavLists from '@/view/tools/components/ToolsNavLists'
import { compareVersion } from '@/common/service/utils'
import { sysFirmwareInfo, sysFirmwareCheck } from '@/api/system-manage-api'
export default {
  name: 'LjbTools',
  data: function() {
    return {
      showTools: 'showTools',
      hideTools: 'hideTools',
      tipVipFinishTxt: '',
      isShowLoginStatus: true,
      isDisabled: false,
      isShowCover: false,
      isAddClassMgr128: false,
      isShowUpdateBtn: false,
      currentVer: null,
      newVer: null,
      isNewVer: false
    }
  },
  components: {
    LoginStatus,
    ToolsNavLists
  },
  methods: {
    toggleToolsLists: function(toggleTools) {
      // 切换tools列表
      if (toggleTools === this.showTools) {
        this.$root.Bus.$emit('busShowToolsLists', true)
        this.isShowLoginStatus = false
        this.isShowUpdateBtn = false
      } else {
        this.isShowLoginStatus = true
        this.isShowUpdateBtn = true
      }
    },
    showExpirationTime(time) {
      this.tipVipFinishTxt = time.split('_')[0]
    },
    hideToolsListsFn: function(data) {
      this.isShowLoginStatus = data
    },
    getRoute: function() {
      const pathStr = this.$route.path
      if (pathStr === '/') {
        this.isDisabled = false
      } else {
        this.isDisabled = true
      }
    },
    getVersionInfoFn: function() {
      sysFirmwareInfo()
        .then(data => {
          // 获取当前版本
          this.currentVer = data.version
        })
        .then(() => {
          let aa = setTimeout(() => {
            sysFirmwareCheck()
              .then(data => {
                // 获取最新版本
                this.newVer = data.version
                this.compareVersionFn()
              })
            clearTimeout(aa)
          }, 778)
        })
    },
    compareVersionFn: function() {
      let result = compareVersion(this.currentVer, this.newVer)
      // let result = compareVersion(this.newVer, this.currentVer)
      if (result) {
        this.isShowUpdateBtn = true
        this.isNewVer = true
      } else {
        this.isShowUpdateBtn = false
        this.isNewVer = false
      }
    },
    toUpdateFirmware: function() {
      this.$router.push('/tools/firmware')
    }
  },
  created() {
    this.$root.Bus.$on('busShowCover', data => {
      this.isShowCover = data
    })
    this.$root.Bus.$on('busMgr128', data => {
      this.isAddClassMgr128 = data
    })
    this.$root.Bus.$on('busShowUpdateBtn', data => {
      this.isShowUpdateBtn = data
    })
    let aa = setTimeout(() => {
      this.getVersionInfoFn()
      clearTimeout(aa)
    }, 777)
  },
  mounted() {
    this.getRoute()
    this.$root.Bus.$on('memberLoginOut', () => { // 注销登录，监听Bus事件，注销登录，将视图的vip时间置为空
      this.tipVipFinishTxt = ''
    })
    this.$root.Bus.$emit('HiddenAppLoading')
  },
  watch: {
    $route: 'getRoute'
  },
  beforeDestroy() {
    this.$root.Bus.$off('busShowCover')
    this.$root.Bus.$off('memberLoginOut')
    this.$root.Bus.$off('busMgr128')
    this.$root.Bus.$off('busShowUpdateBtn')
  }
}
</script>

<style lang="scss" scoped>
#ljb-tools {
  position: absolute;
  width: 1220px;
  top: -55px;
  height: 0;
  z-index: -1;
  & > .update-tip-btn {
    width:111px;
    height:36px;
    background:linear-gradient(-90deg,rgba(57,193,255,1),rgba(0,159,232,1));
    box-shadow:0px 6px 20px 0px rgba(0,0,0,0.06);
    border-radius:18px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 15%;
    margin-right: 34px;
    cursor: pointer;
    font-size: 14px;
    color: #fff;
    transition: box-shadow .3s;
    text-align: left;
    padding-left: 22px;
    display: none;
    &.mgr128 {
      right: 15%;
      margin-right: 128px;
    }
    &.show {
      display: block;
    }
    & > i {
      font-size: 0;
      position: absolute;
      top: 54%;
      transform: translateY(-54%);
      margin-left: 4px;
      width: 10px;
      height: 11px;
      background-color: red;
      background: url(../../assets/images/icon/update-logo.png) no-repeat;
      background-size: cover;
    }
    & > span {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      border-radius:18px;
      border: 2px solid transparent;
      background-color: transparent;
      transition: border-color .3s;
    }
    &:focus, &:hover {
      & > span {
        border-color: rgba(245,245,245,1);
        transition: border-color .3s;
      }
      box-shadow:0px 6px 20px 0px rgba(0,159,232,0.7);
    }
  }
  & > .tip-vip-finish {
    font-size: 14px;
    color: rgba(58, 56, 72, 1);
    line-height: 20px;
    margin-left: 80px;
    position: relative;
    top: -10px;
  }
  & > .icon-logo {
    width: 45px;
    height: 39px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 20px;
    background: url(../../assets/images/icon/icon_logo.png) no-repeat;
    background-size: 100% 100%;
  }
  & > .tools-btn {
    width: 40px;
    height: 40px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 20px;
    border-radius: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 6px 20px 0px rgba(0, 0, 0, 0.06);
    background: url(../../assets/images/icon/icon_toolbox_normal.png) no-repeat;
    background-size: 100%;
    cursor: pointer;
    transition: box-shadow 0.3s, opacity 0.8s;
    opacity: 1;
    color: rgba(58, 56, 72, 1);
    border: none;
    overflow: visible;
    & > span {
      display: inline-block;
      border-radius: 2px;
      background-color: #fff;
      position: absolute;
      white-space: nowrap;
      padding: 2px 4px 3px 3px;
      top: -28px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 12px;
      opacity: 0;
      transition: opacity 0.3s;
      & > i {
        position: absolute;
        height: 0;
        width: 0;
        border: 4px solid transparent;
        border-top: 5px solid #ffffff;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    &:hover {
      box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
      background: url(../../assets/images/icon/icon_toolbox_hover.png) no-repeat;
      background-size: 100%;
      & > span {
        opacity: 1;
      }
    }
    &:focus {
      box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
      background: url(../../assets/images/icon/icon_toolbox_hover.png) no-repeat;
      background-size: 100%;
      & > span {
        opacity: 1;
      }
    }
  }
  & > .cover {
    position: absolute;
    left: 0;
    top: -53px;
    right: 0;
    height: 80px;
    border-radius: 6px;
    z-index: 99;
  }
  .cover-div {
    z-index: -2;
    position: absolute;
  }
}
@media screen and (max-width: 1366px) {
  #ljb-tools {
    // border: 1px solid red;
    margin-left: 23px;
    width: 1066px;
    top: -40px;
  }
}
</style>
