<template>
  <div class="sidebar-wrapper">
    <div class="close-icon" @click="clooseSidebar"></div>
    <div class="user-info-container">
      <div class="head-portrait"></div>
      <div class="user-name">{{ userInfo.userName }}</div>
      <div class="deadline" v-if="userInfo.userName">{{ userInfo.userExpire.split(' ')[0] }} {{ $t('i18n.VIP_TIME_END') }}</div>
       <div class="deadline login" @click="toLogin" v-if="!userInfo.userName">{{ $t('i18n.PLEASE_LOGIN') }}</div>
    </div>
    <div class="tools-wrapper" ref="toolsWrapper">
      <div class="tools-list scroll-box">
        <div class="tool-item"
        v-for="(item, index) in tools"
        :class="item.name" :key="'tools' + index"
        @click="toolClicked(item)">
          <div class="item-icon"></div>
          <span class="item-name">{{ item.text }}</span>
        </div>
        <div class="tool-item logout"
          @click="loginOut()"
          v-show="userInfo.userName">
          <div class="item-icon"></div>
          <span class="item-name">{{ $t('i18n.LOGOUT') }}</span>
        </div>
      </div>
    </div>
    <div class="warm-prompt" @click="routeToWarmPrompt">
      <div class="blurry-line"></div>
      <div class="warn-title">
        <span class="title">{{ $t('i18n.WARM_PROMPT') }}</span>
        <span class="warm-icon"></span>
      </div>
      <div class="warm-content">
        怪物猎人世界组野队建议使用P2P节议使用P2P节  点，和国内好友联机建议使用模式…
      </div>
    </div>
  </div>
</template>

<script>
import Bscroll from 'better-scroll'

import { mapGetters, mapMutations } from 'vuex'

import { UserLoginApi } from '../../../../api/user-manger-api'
export default {
  name: 'Sidebar',
  data () {
    return {
      tools: [
        {
          text: this.$t('i18n.TOOLS.UPNP'),
          name: 'upnp',
          path: '/upnp'
        },
        {
          text: this.$t('i18n.TOOLS.NETWORK_CONFIG'),
          name: 'netconfig',
          path: '/network-setting'
        },
        {
          text: this.$t('i18n.TOOLS.WIFI_CONFIG'),
          name: 'wifi',
          path: '/wifi-setting'
        },
        {
          text: this.$t('i18n.TOOLS.IP_CONFIG'),
          name: 'ip',
          path: '/ip-setting'
        },
        {
          text: this.$t('i18n.TOOLS.SYS_LOG'),
          name: 'sys',
          path: '/system-log'
        },
        {
          text: this.$t('i18n.TOOLS.CHANGE_PASS'),
          name: 'pass',
          path: '/change-password'
        },
        {
          text: this.$t('i18n.TOOLS.RESTART'),
          name: 'restart',
          path: '/restart'
        },
        {
          text: this.$t('i18n.TOOLS.RESET'),
          name: 'reset',
          path: '/factory-reset'
        },
        {
          text: this.$t('i18n.TOOLS.UPDATE_RECOVER'),
          name: 'update',
          path: '/firmware'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted () {
    this.$nextTick(() => {
      this.scroll = new Bscroll(this.$refs.toolsWrapper, {
        click: false
      })
    })
  },
  updated() {
    if (this.scroll) {
      this.scroll.refresh()
      return null
    }
    this.$nextTick(() => {
      this.scroll = new Bscroll(this.$refs.toolsWrapper, {
        click: false
      })
    })
  },
  methods: {
    clooseSidebar() {
      this.$emit('handleChoseSidebar')
    },
    routeToWarmPrompt() {
      this.$router.push('/warm-prompt')
    },
    toolClicked(item) {
      this.$emit('handleToolClicked', item)
    },
    loginOut() {
      UserLoginApi({'action': 'logout'})
        .then(res => {
          this.changeUserInfo({userExpire: ''})
        })
    },
    toLogin() {
      this.$router.push('/member-login')
    },
    ...mapMutations({
      'changeUserInfo': 'SET_USER_INFO'
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../common/scss/_mixin';
@import '../../../../common/scss//_utils';
.sidebar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: rem(480px);
  height: 100%;
  background: white;
  z-index: 12;
  display: flex;
  flex-direction: column;
  .close-icon {
    position: absolute;
    top: rem(30px);
    right: rem(30px);
    width: rem(40px);
    height: rem(40px);
    @include bgImg('../../../../assets/images/icon_toolbox_esc_normal.png');
  }
  .user-info-container {
    width: 100%;
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    align-items: center;
    margin-top: rem(60px);
    padding-bottom: rem(40px);
    overflow: hidden;
    .head-portrait {
      width: rem(120px);
      height: rem(120px);
      min-height: rem(120px);
      border-radius: 50%;
      @include bgImg('../icons/icon_default_avatar.png');
    }
    .user-name {
      text-align: center;
      font-size: rem(32px);
      color: #3a3848;
      line-height: rem(45px);
      margin: rem(20px) 0;
    }
    .deadline {
      font-size: rem(24px);
      color: #9e9d9f;
      line-height: rem(33px);
      &.login {
        text-decoration: underline;
      }
    }
  }
  .tools-wrapper {
    position: relative;
    flex-grow: 1;
    // height: rem(300px);
    overflow: auto;
    padding-bottom: rem(40px);
    .tools-list {
      width: 100%;
      height: 100%;
      overflow: hidden;
      .tool-item {
        height: rem(100px);
        display: flex;
        align-items: center;
        padding-left: rem(40px);
        font-size: rem(28px);
        color: #8389a1;
        &.upnp {
          @include toolNavBg('../icons/tool-nav-icon/icon_upnp');
        }
        &.netconfig {
          @include toolNavBg('../icons/tool-nav-icon/icon_network_settings');
        }
        &.wifi {
          @include toolNavBg('../icons/tool-nav-icon/icon_wifi_settings');
        }
        &.ip {
          @include toolNavBg('../icons/tool-nav-icon/icon_ip_address');
        }
        &.sys {
          @include toolNavBg('../icons/tool-nav-icon/icon_system_log');
        }
        &.pass {
          @include toolNavBg('../icons/tool-nav-icon/icon_change_password');
        }
        &.restart {
          @include toolNavBg('../icons/tool-nav-icon/icon_reboot');
        }
        &.reset {
          @include toolNavBg('../icons/tool-nav-icon/icon_reset');
        }
        &.update {
          @include toolNavBg('../icons/tool-nav-icon/icon_upgrade');
        }
        &.logout {
          @include toolNavBg('../icons/tool-nav-icon/icon_log_out');
        }
        .item-icon {
          width: rem(44px);
          height: rem(44px);
          background-size: 100%;
          background-repeat: no-repeat;
          margin-right: rem(30px);
        }
      }
    }
  }
  .warm-prompt {
    position: relative;
    width: 100%;
    height: rem(202px);
    min-height: rem(202px);
    flex-shrink: 0;
    background: linear-gradient(
      90deg,
      rgba(240, 243, 247, 1),
      rgba(255, 255, 255, 1)
    );
    padding-top: rem(30px);
    padding-bottom: rem(40px);
  }
  .blurry-line {
    position: absolute;
    left: 0;
    top: rem(-20px);
    width: rem(480px);
    height: rem(20px);
    background: rgba(255, 255, 255, 1);
    opacity: 0.75;
  }
  .warn-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: rem(28px);
    line-height: rem(28px);
    color: #3a3848;
    padding-left: rem(40px);
    padding-right: rem(20px);
    overflow: hidden;
    .warm-icon {
      width: rem(12px);
      height: rem(18px);
      vertical-align: middle;
      @include bgImg('../icons/icon_arrow_right_normal.png');
      margin-top: rem(17px);
    }
  }
  .warm-content {
    padding: rem(20px) rem(56px) 0 rem(40px);
    font-size: rem(24px);
    color: #75738b;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}
</style>
