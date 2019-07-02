<template>
  <div id="ljb-tools-wifi-setting">
    <div class="wifi-wetting-title">
      {{ $t('i18n.WIFI_SETTING') }}
    </div>
    <div class="wifi-setting" v-show="!isLoading">
      <wifi-switch @busTransform="toggleTransform"></wifi-switch>
      <wifi-channel @busGetChannel="getChannelData"></wifi-channel>
      <wifi-name @busGetName="getWIfiName"></wifi-name>
      <button class="save-setting" @click="getWifiSettingInfo()">{{ $t('i18n.SAVE_SET') }}</button>
    </div>
    <div class="wifi-setting h300" v-show="isLoading">
      <loading class="loading"></loading>
      <p>{{ txtLoading }}</p>
    </div>
    <fade-tips :msg="tip.msg" :type="tip.type" :show="tip.show" @hide="tip.show = false"></fade-tips>
  </div>
</template>

<script>
import WifiSwitch from '@/view/tools/wifi-setting/components/WifiSwitch'
import WifiChannel from '@/view/tools/wifi-setting/components/WifiChannel'
import WifiName from '@/view/tools/wifi-setting/components/WifiName'
import { netWlanSet, netWlanGet } from '@/api/network-check-api'
import FadeTips from '@/common/components/fade-tips/FadeTips'
import { getInitStatusApi } from '../../../api/login-api'
import Loading from '@/common/components/loading/loading'

import getNetTypeAndWifiSsidService from '../../../common/service/getNetTypeAndWifiSsid'
export default {
  name: 'WifiSetting',
  data: function() {
    return {
      changeTransform: true,
      wifiSettingInfo: {
        channel: '',
        name: ''
      },
      apiData: {
        ifname: 'wlan0',
        enable: '',
        ssid: '',
        password: '12345678',
        channel: '',
        encrypt: '',
        encryption: '',
        isolation: '',
        hidden: '',
        hwmode: '',
        htmode: '',
        txpower: ''
      },
      tip: {
        msg: '',
        type: 'success',
        show: false
      },
      txtChannel: '',
      txtWifiNameFromApi: '',
      txtWifiNameChannelApi: '',
      isFocusChannelLists: false, // 用户在channelLists列表选择了信道
      changeWaiting: {
        msg: ``,
        show: true
      },
      changeComplate: false,
      isTrueSave: false,
      isLoading: true,
      txtLoading: this.$t('i18n.GETTING_WIFI_SETTING_LIST')
    }
  },
  components: {
    WifiSwitch,
    WifiChannel,
    WifiName,
    FadeTips,
    Loading
  },
  methods: {
    toggleTransform: function(data) {
      // 改变transform
      this.changeTransform = data
    },
    getChannelData: function(data) {
      // 获取wifichannel子组件传递的channel
      this.wifiSettingInfo.channel = data
    },
    getWIfiName: function(data, isTrue) {
      // 获取wifiname子组件传递的wifiname
      this.wifiSettingInfo.name = data
      this.isTrueSave = isTrue
    },
    getWifiSettingInfo: function() {
      if (this.changeTransform) {
        this.apiData.enable = '1'
      } else {
        this.apiData.enable = '0'
      }
      this.apiData.channel = this.wifiSettingInfo.channel
      if (this.changeTransform) {
        // wifi为开
        if (this.isTrueSave) {
          // wifiname正确设置
          this.apiData.ssid = this.wifiSettingInfo.name
          this.apiNetWlanSet(this.apiData)
        } else {
          // wifiname 设置错误
          this.$root.Bus.$emit('busShowWarnTip', false)
        }
      } else {
        // wifi为关
        this.apiData.ssid = this.txtWifiNameFromApi
        this.apiData.channel = this.txtWifiNameChannelApi
        this.apiNetWlanSet(this.apiData)
      }
    },
    apiNetWlanSet: function(apiData) {
      getNetTypeAndWifiSsidService()
        .then(res => {
          const network = res.network
          if (network === 2) {
            this.changeWaiting.msg =
              this.$t('i18n.USE_WIFI_SERVER_WIFISET') + apiData.ssid
            this.$root.Bus.$emit('waitingMaskShow', this.changeWaiting)
          }
          netWlanSet(apiData)
            .then(data => {
              if (data.ret === 0) {
                if (network === 2) {
                  this.checkInervalTime = setInterval(() => {
                    this.checkComplete()
                  }, 3000)
                } else {
                  if (network === 2) {
                    this.changeWaiting.msg = ''
                    this.changeWaiting.show = false
                    this.$root.Bus.$emit('waitingMaskShow', this.changeWaiting)
                  }
                  this.tip.msg = `${this.$t('i18n.SET_DOWN')}`
                  this.tip.type = 'success'
                  this.tip.show = true
                }
              }
            })
            .catch(e => {
              this.tip.msg = e
              this.tip.type = 'error'
              this.tip.show = true
            })
          this.checkInervalTime = setInterval(() => {
            this.checkComplete()
          }, 3000)
        })
        .catch(e => {
          this.tip.msg = this.$t('i18n.FAILED_GET_NET')
          this.tip.type = 'error'
          this.tip.show = true
        })
    },
    apiNetWlanGetFn: function() {
      let apiData = {
        ifname: 'wlan0'
      }
      netWlanGet(apiData)
        .then(data => {
          this.isLoading = false
          this.apiData = data.wlan0
          this.apiData.ifname = 'wlan0'
          this.$root.Bus.$emit('busCheckCloseStatus', data.wlan0.enable)
          this.txtChannel = this.apiData.channel
          if (
            data.wlan0.channel === 'auto' ||
            data.wlan0.channel === `${this.$t('i18n.AUTO')}` ||
            parseInt(data.wlan0.channel) === 0 ||
            data.wlan0.channel === ''
          ) {
            this.txtChannel = `${this.$t('i18n.AUTO')}`
          }
          this.$root.Bus.$emit(
            'busChannelInfo',
            this.txtChannel,
            data.wlan0.enable
          )
          this.$root.Bus.$emit(
            'busWifiname',
            this.apiData.ssid,
            data.wlan0.enable
          )
          this.txtWifiNameFromApi = data.wlan0.ssid
          this.txtWifiNameChannelApi = data.wlan0.channel
        })
        .catch(e => {
          this.isLoading = true
          this.txtLoading = this.$t('i18n.GET_WIFI_SETTING_INFO_FAILED')
        })
    },
    checkComplete() {
      getInitStatusApi().then(res => {
        if ('' + res) {
          clearInterval(this.checkInervalTime)
          this.changeWaiting.show = false
          if (this.changeComplate) {
            this.changeComplate = true
            this.$root.Bus.$emit('waitingMaskShow', this.resetWaiting)
          }
          this.tip.msg = `${this.$t('i18n.SET_DOWN')}`
          this.tip.type = 'success'
          this.tip.show = true
        }
      })
    }
  },
  mounted() {
    this.apiNetWlanGetFn()
  },
  beforeDestroy() {
    this.$root.Bus.$emit('busDestoryBar')
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_mixin.scss';
#ljb-tools-wifi-setting {
  width: 600px;
  border: 1px solid transparent;
  margin: 0 auto;
  transition: transform 0.3s;
  background: linear-gradient(
    180deg,
    rgba(240, 243, 247, 1),
    rgba(255, 255, 255, 1)
  );
  box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  margin: 0 auto;
  margin-bottom: 70px;
  position: relative;
  & > .wifi-wetting-title {
    width: 100%;
    height: 76px;
    font-size: 20px;
    font-weight: bold;
    line-height: 76px;
    text-align: center;
    background-color: #fff;
    border-radius: 6px 6px 0 0;
  }
  & > .wifi-setting {
    padding: 40px 60px 60px 60px;
    &.h300 {
      height: 200px;
      text-align: center;
      padding-top: 80px;
      & > .loading {
        margin: 0 auto;
      }
      & > p {
        margin-top: 20px;
      }
    }
  }
  .save-setting {
    @include startBtn-primaryHover;
    width: 480px;
    height: 56px;
    margin-top: 85px;
    text-align: center;
    line-height: 56px;
    font-size: 16px;
    cursor: pointer;
  }
}
</style>
