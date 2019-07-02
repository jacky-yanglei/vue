<template>
  <div class="wifi-setting-wrapper">
    <div class="tools-wrapper-main wifi-setting" :class="{'blur': isShowBlur}" @click.stop.prevent="controlFocusFn()">
      <public-header :headerTxt="headerTxt"></public-header>
      <div class="mg-40 tools-wrapper-max">
        <div class="wifi-switch">
          <span class="switch-txt">{{$t('i18n.WIFI_SWITCH')}}：</span>
          <span class="switch-btn" :class="{'switch-open-btn': isOpenSwitch}" @click="toggleSwitchFn()">
            <i class="circle"></i>
          </span>
        </div>
        <div class="wifi-wrapper-main z-index" :class="{'display-none': !isOpenSwitch}">
          <p>{{$t('i18n.CHANNEL')}}：</p>
          <div class="channel-wrapper" :class="{'select-channel': isSelectChannel}">
            <div class="curr-channel" @click.stop.prevent="openChannelListsFn()">
              <span>{{ currChannel }}</span>
              <i></i>
            </div>
            <div class="channel-lists-wrapper">
              <div class="channel-lists" ref="wrapper">
                <ul>
                  <li v-for="(item, key) in channelLists"
                    :key="key"
                    :class="{'selected': currChannelKey === key, 'font-size0': !isSelectChannel}"
                    @click.stop.prevent="selectChannelFn(key)">
                    {{ item }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="wifi-wrapper-main mgrt-120" :class="{'display-none': !isOpenSwitch}">
          <p>{{$t('i18n.WIFI_NAME')}}：</p>
          <input type="text"
          ref="inputWifiName"
          class="tools-input"
          v-model="wifiName.txt"
          @blur.stop.prevent="blurFn()"
          @click.stop.prevent="focusFn()"
          :class="{'error-input': !wifiName.vaild && wifiName.errorTip}">
          <div class="error-tip" v-show="!wifiName.vaild && wifiName.errorTip">{{ txtErrorTip }}</div>
        </div>
        <div class="tools-bottom" :class="{'position-absolute': isChangeBtnPosition}">
          <primart-button :disabled="disabled"
            :loading="loading"
            @buttonClicked="saveBtnFn()">{{$t('i18n.SAVE_SETTINGS')}}</primart-button>
        </div>
      </div>
    </div>
    <fade-tips :msg="tip.msg" :show="tip.show" :type="tip.type" @hide="hideFadeTipsFn"></fade-tips>
    <loading-mask :msg="loadingMaskObj.msg"
        :show="loadingMaskObj.show"
        :showMask="loadingMaskObj.showMask"></loading-mask>
  </div>
</template>

<script>
import PublicHeader from '@/common/components/public-header/public-header'
import PrimartButton from '@/common/components/buttons/primary-button'
import Bscroll from 'better-scroll'
import regular from '@/common/service/regular'
import { netWlanSet, netWlanGet } from '@/api/network-check-api'
import FadeTips from '@/common/components/fade-tips/fade-tips'
import LoadingMask from '@/common/components/loadings/loading-mask'
import getNetTypeAndWifiSsidService from '@/common/service/getNetTypeAndWifiSsid'
import { getInitStatusApi } from '@/api/login-api'
export default {
  name: 'WifiSetting',
  data: function () {
    return {
      headerTxt: this.$t('i18n.WIFI_SETTINGS'),
      disabled: true,
      loading: false,
      isOpenSwitch: false,
      channelLists: [this.$t('i18n.AUTO'), 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      currChannel: this.$t('i18n.AUTO'),
      currChannelKey: 0,
      isSelectChannel: false, // 是否开始选择信道
      txtErrorTip: this.$t('i18n.WIFI_NAME_VERIFICATION_RULE'),
      wlanData: null,
      isShowBlur: false,
      isChangeBtnPosition: false, // 是否切换
      enable: 0,
      wifiName: {
        txt: '',
        vaild: false,
        errorTip: false
      },
      tip: {
        msg: '',
        show: false,
        type: 'success'
      },
      loadingMaskObj: {
        msg: '',
        show: false,
        showMask: false
      }
    }
  },
  components: {
    PublicHeader,
    PrimartButton,
    FadeTips,
    LoadingMask
  },
  methods: {
    toggleSwitchFn: function () {
      this.isOpenSwitch = !this.isOpenSwitch
      if (this.isOpenSwitch) {
        this.enable = 1
      } else {
        this.enable = 0
      }
      if (!this.isOpenSwitch) {
        this.disabled = true
        this.loading = false
      } else {
        this.disabled = false
        this.loading = false
      }
    },
    openChannelListsFn: function () {
      this.isSelectChannel = !this.isSelectChannel
      this.$refs.inputWifiName.blur()
      if (this.isSelectChannel) {
        this.$nextTick(() => {
          this.scroll = new Bscroll(this.$refs.wrapper, {
            click: true
          })
        })
      }
    },
    selectChannelFn: function (key) {
      this.currChannelKey = key
      this.currChannel = this.channelLists[key]
      this.isSelectChannel = false
      this.$refs.inputWifiName.blur()
    },
    verifyWifiNameFn: function () {
      let result = regular.verifyWifiName(this.wifiName.txt)
      this.wifiName.vaild = result
      this.wifiName.errorTip = !result
    },
    blurFn: function () {
      // 失去焦点时校验
      let aa = setTimeout(() => {
        this.isChangeBtnPosition = false
        clearTimeout(aa)
      }, 200)
      this.verifyWifiNameFn()
    },
    focusFn: function () {
      // 获取焦点时复原
      this.wifiName.errorTip = false
      this.isChangeBtnPosition = true
    },
    hideFadeTipsFn: function (data) {
      this.tip.show = data
      this.isShowBlur = data
    },
    saveBtnFn: function () {
      this.verifyWifiNameFn()
      if (this.wifiName.vaild) {
        // 设置内容无误
        this.disabled = true
        this.loading = true
        getNetTypeAndWifiSsidService()
          .then(res => {
            let str = this.$t('i18n.WIFI_SETUP_PROGRESS') + this.$t('i18n.NETWORK_WILL_DISCONNENTION_PLEASE_CHECK_INTERNET')
            this.loadingMaskObj.msg = str + this.wifiName.txt
            this.loadingMaskObj.show = true
            this.loadingMaskObj.showMask = true
            this.isShowBlur = true
            this.apiNetWlanSetFn()
          })
          .catch(e => {
            this.tip.msg = this.$t('i18n.FAILED_GET_NETWORK_INFO')
            this.tip.show = true
            this.tip.type = 'error'
            this.isShowBlur = true
            this.disabled = false
            this.loading = false
          })
      }
    },
    apiNetWlanGetFn: function () {
      // 获取wlan无线配置信息
      let apiData = {
        ifname: 'wlan0'
      }
      netWlanGet(apiData)
        .then(res => {
          this.wlanData = res.wlan0
          this.controlViewFn(res.wlan0) // 控制视图
          this.controlSwitchFn(res.wlan0.enable) // 控制开关
        })
        .catch(e => {
          this.tip.msg = this.$t('i18n.FAILED_GET_NETWORK_INFO')
          this.tip.show = true
          this.tip.type = 'error'
          this.isShowBlur = true
          this.disabled = false
          this.loading = false
        })
    },
    controlSwitchFn: function (enable) {
      // 控制开关
      this.enable = parseInt(enable)
      if (this.enable === 1) {
        this.isOpenSwitch = true
        this.disabled = false
        this.loading = false
      } else {
        this.isOpenSwitch = false
        this.disabled = true
        this.loading = false
      }
    },
    controlViewFn: function (data) {
      // 控制视图
      this.wifiName.txt = data.ssid
      let channel = data.channel
      if (channel === '' || channel === '0' || channel === 'auto' || channel === this.$t('i18n.AUTO')) {
        channel = 0
      }
      channel = parseInt(channel)
      this.currChannel = this.channelLists[channel]
      this.currChannelKey = channel
    },
    apiNetWlanSetFn: function () {
      let apiData = Object.assign(
        { ifname: 'wlan0' },
        this.wlanData,
        { ssid: this.wifiName.txt, channel: this.currChannel },
        { enable: this.enable }
      )
      netWlanSet(apiData)
        .then(res => {
          this.checkNetStatusFn()
        })
        .catch(e => {
          let msg = this.apiErrorDealFn(e)
          this.tip.msg = msg
          this.tip.show = true
          this.tip.type = 'error'
          this.isShowBlur = true
          this.loadingMaskObj.msg = ''
          this.loadingMaskObj.show = false
          this.loadingMaskObj.showMask = false
          this.disabled = false
          this.loading = false
        })
    },
    checkNetStatusFn: function () {
      let aa = setTimeout(() => {
        getInitStatusApi()
          .then(res => {
            clearTimeout(aa)
            this.loadingMaskObj.msg = ''
            this.loadingMaskObj.show = false
            this.loadingMaskObj.showMask = false
            this.tip.msg = this.$t('i18n.WIFI_NAME_MODIFY_SUCCESS')
            this.tip.show = true
            this.tip.type = 'success'
            this.isShowBlur = true
            this.disabled = false
            this.disabled = false
            this.loading = false
          })
          .catch(e => {
            clearTimeout(aa)
            this.checkNetStatusFn()
          })
      }, 3000)
    },
    controlFocusFn: function () {
      // 控制页面失去焦点
      this.$refs.inputWifiName.blur()
      this.isSelectChannel = false
    }
  },
  created () {
    this.apiNetWlanGetFn()
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../common/scss/_mixin';
  @import '../../../common/scss/_utils';
  @import '../../../common/scss/tools';
  .wifi-setting {
    .wifi-switch {
      overflow: hidden;
    }
    .wifi-wrapper-main {
      margin-top: rem(50px);
      position: relative;
      & > p {
        padding-bottom: rem(20px);
        font-size: rem(30px);
        color: rgba(131,137,161,1);
      }
      &.mgrt-120 {
        margin-top: rem(120px);
      }
      &.display-none {
        display: none;
      }
    }
    .channel-wrapper {
      width: 100%;
      height: rem(90px);
      background: rgba(255,255,255,1);
      border-radius: rem(8px);
      border: 1px solid rgba(230,230,231,1);
      position: absolute;
      z-index: 2;
      & > .curr-channel {
        padding-left: rem(30px);
        padding-right: rem(30px);
        height: rem(90px);
        line-height: rem(90px);
        position: relative;
        & > i {
          width: rem(18px);
          height: rem(12px);
          position: absolute;
          top: 50%;
          right: 5%;
          transform: translateY(-50%);
          float: right;
          background: url(../../../assets/images/icon_arrow_down_normal.png) no-repeat;
          background-size: cover;
        }
      }
      & > .channel-lists-wrapper {
        height: 0;
        overflow: hidden;
      }
      .channel-lists {
        // height: 0;
        height: rem(450px);
        overflow: hidden;
        transition: height .3s;
        li {
          padding-left: rem(30px);
          padding-right: rem(30px);
          height: rem(90px);
          line-height: rem(90px);
          font-size: rem(30px);
          transition: font-size .1s;
          color: rgba(58, 56, 72, 1);
          &.selected {
            background:linear-gradient(-90deg,rgba(57,193,255,1),rgba(0,159,232,1));
          }
          &.font-size0 {
            font-size: 0;
            transition: font-size .1s;
          }
        }
      }
      &.select-channel {
        height: rem(540px);
        transition: height .3s;
        i {
          background: url(../../../assets/images/icon_arrow_down_hover.png) no-repeat;
          background-size: cover;
        }
        & > .channel-lists-wrapper {
          height: rem(450px);
        }
      }
    }
    .z-index {
      z-index: 1;
    }
    .tools-bottom {
      &.position-absolute {
        position: relative;
        width: 100%;
        margin-top: rem(340px);
        padding: 0;
        // padding-bottom: rem(160px);
      }
    }
  }
</style>
