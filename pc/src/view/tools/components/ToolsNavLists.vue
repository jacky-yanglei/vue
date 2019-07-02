<template>
  <transition-group tag="ul" class="tools-nav-lists" name="fade" :class="{'opacity': isShowLists}">
    <button :key="'close'" class="tool-list" @click="hideToolsLists()" v-if="isShowLists" :disabled="isDisabled">
      <span>{{ $t('i18n.CLOSE') }}<i></i></span>
    </button>
    <button v-if="isShowLists" :disabled="isDisabled" class="tool-list" v-for="(item, key) in navListsArr" :key="key" @click="toggleRoute(item.path)">
      <span>{{ item.name }}<i></i></span>
    </button>
    <button :key="'logout'" class="tool-list" @click="logout()" v-if="isLogin" :disabled="isDisabled">
      <span>{{ $t('i18n.LOGOUT') }}<i></i></span>
    </button>
  </transition-group>
</template>

<script>
import { UserLoginApi } from '../../../api/user-manger-api'
export default {
  name: 'ToolsNavLists',
  data: function() {
    return {
      isLogin: false,
      navListsArr: [
        { name: this.$t('i18n.UPNP'), path: 'tools/UPnP-setting' },
        {
          name: this.$t('i18n.NETWORK_SETTING'),
          path: 'tools/network-setting'
        },
        { name: this.$t('i18n.WIFI_SETTING'), path: 'tools/wifi-setting' },
        { name: this.$t('i18n.SET_IP_ADDR'), path: 'tools/ip-setting' },
        { name: this.$t('i18n.SYSTEM_LOG'), path: 'tools/system-log' },
        {
          name: this.$t('i18n.ADMIN_PASSWORD_CHANGE'),
          path: 'tools/change-password'
        },
        { name: this.$t('i18n.RESTART_NOW'), path: 'tools/restart' },
        {
          name: this.$t('i18n.FACTORY_RESET'),
          path: 'tools/factory-reset'
        },
        {
          name: this.$t('i18n.FIRMWARE_UPGRADE_AND_RESET'),
          path: 'tools/firmware'
        }
      ],
      isShowLists: false,
      isDisabled: false
    }
  },
  methods: {
    hideToolsLists: function() {
      // 向父组件传递隐藏tools列表的信息
      this.$emit('hide-tools-lists', true)
      this.isShowLists = false
      this.$root.Bus.$emit('busShowUpdateBtn', true)
    },
    logout: function() {
      UserLoginApi({ action: 'logout' })
        .then(res => {
          this.isLogin = false
          this.$root.Bus.$emit('memberLoginOut')
          this.$emit('hide-tools-lists', true)
          this.isShowLists = false
          // 同时控制加速按钮的的视图变化
          this.$root.Bus.$emit('busSpeedUpBtnLoginout')
          this.$root.Bus.$emit('busIndexSpeedUp')
          this.$root.Bus.$emit('busShowUpdateBtn', true)
        })
        .catch(e => {
          // todo 错误处理
        })
    },
    toggleRoute: function(path) {
      this.$router.push(path)
    },
    showToolsListsFn: function(data) {
      this.isShowLists = data
    },
    getRoute: function() {
      const pathStr = this.$route.path
      if (pathStr === '/') {
        this.isDisabled = false
      } else {
        this.isDisabled = true
      }
    }
  },
  created() {
    this.$root.Bus.$on('busShowToolsLists', data => {
      this.showToolsListsFn(data)
    })
    this.$root.Bus.$on('isLogin', res => {
      this.isLogin = res
    })
    this.$root.Bus.$on('busToShowLoginOutBtn', data => {
      this.isLogin = data
    })
  },
  watch: {
    $route: 'getRoute'
  },
  mounted() {
    this.getRoute()
  },
  beforeDestroy() {
    this.$root.Bus.$off('busShowToolsLists')
    this.$root.Bus.$off('isLogin')
    this.$root.Bus.$off('busToShowLoginOutBtn')
  }
}
</script>

<style lang="scss" scoped>
.tools-nav-lists {
  height: 40px;
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  z-index: -99;
  opacity: 0;
  transition: opacity 0.8s;
  .tool-list {
    float: right;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    margin-left: 30px;
    position: relative;
    color: rgba(58, 56, 72, 1);
    border: none;
    cursor: pointer;
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
      transition: opacity 0.4s;
      cursor: pointer;
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
      & > span {
        opacity: 1;
      }
    }
    &:focus {
      & > span {
        opacity: 1;
      }
    }
    &:nth-of-type(1) {
      background: url(../../../assets/images/icon/icon_toolbox_esc_normal.png)
        no-repeat;
      background-size: 100%;
      &:hover {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_toolbox_esc_hover.png)
          no-repeat;
        background-size: 100%;
      }
      &:focus {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_toolbox_esc_hover.png)
          no-repeat;
        background-size: 100%;
      }
    }
    &:nth-of-type(2) {
      background: url(../../../assets/images/icon/icon_upnp_normal.png)
        no-repeat;
      background-size: 100%;
      &:hover {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_upnp_hover.png)
          no-repeat;
        background-size: 100%;
      }
      &:focus {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_upnp_hover.png)
          no-repeat;
        background-size: 100%;
      }
    }
    &:nth-of-type(3) {
      background: url(../../../assets/images/icon/icon_network_settings_normal.png)
        no-repeat;
      background-size: 100%;
      &:hover {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_network_settings_hover.png)
          no-repeat;
        background-size: 100%;
      }
      &:focus {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_network_settings_hover.png)
          no-repeat;
        background-size: 100%;
      }
    }
    &:nth-of-type(4) {
      background: url(../../../assets/images/icon/icon_wifi_settings_normal.png)
        no-repeat;
      background-size: 100%;
      &:hover {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_wifi_settings_hover.png)
          no-repeat;
        background-size: 100%;
      }
      &:focus {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_wifi_settings_hover.png)
          no-repeat;
        background-size: 100%;
      }
    }
    &:nth-of-type(5) {
      background: url(../../../assets/images/icon/icon_ip_address_normal.png)
        no-repeat;
      background-size: 100%;
      &:hover {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_ip_address_hover.png)
          no-repeat;
        background-size: 100%;
      }
      &:focus {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_ip_address_hover.png)
          no-repeat;
        background-size: 100%;
      }
    }
    &:nth-of-type(6) {
      background: url(../../../assets/images/icon/icon_system_log_normal.png)
        no-repeat;
      background-size: 100%;
      &:hover {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_system_log_hover.png)
          no-repeat;
        background-size: 100%;
      }
      &:focus {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_system_log_hover.png)
          no-repeat;
        background-size: 100%;
      }
    }
    &:nth-of-type(7) {
      background: url(../../../assets/images/icon/icon_change_password_normal.png)
        no-repeat;
      background-size: 100%;
      &:hover {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_change_password_hover.png)
          no-repeat;
        background-size: 100%;
      }
      &:focus {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_change_password_hover.png)
          no-repeat;
        background-size: 100%;
      }
    }
    &:nth-of-type(8) {
      background: url(../../../assets/images/icon/icon_reboot_normal.png)
        no-repeat;
      background-size: 100%;
      &:hover {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_reboot_hover.png)
          no-repeat;
        background-size: 100%;
      }
      &:focus {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_reboot_hover.png)
          no-repeat;
        background-size: 100%;
      }
    }
    &:nth-of-type(9) {
      background: url(../../../assets/images/icon/icon_reset_normal.png)
        no-repeat;
      background-size: 100%;
      &:hover {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_reset_hover.png)
          no-repeat;
        background-size: 100%;
      }
      &:focus {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_reset_hover.png)
          no-repeat;
        background-size: 100%;
      }
    }
    &:nth-of-type(10) {
      background: url(../../../assets/images/icon/icon_upgrade_normal.png)
        no-repeat;
      background-size: 100%;
      &:hover {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_upgrade_hover.png)
          no-repeat;
        background-size: 100%;
      }
      &:focus {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_upgrade_hover.png)
          no-repeat;
        background-size: 100%;
      }
    }
    &:nth-of-type(11) {
      background: url(../../../assets/images/icon/icon_log_out_normal.png)
        no-repeat;
      background-size: 100%;
      &:hover {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_log_out_hover.png)
          no-repeat;
        background-size: 100%;
      }
      &:focus {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
        background: url(../../../assets/images/icon/icon_log_out_hover.png)
          no-repeat;
        background-size: 100%;
      }
    }
  }
}
.tools-nav-lists.opacity {
  opacity: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
