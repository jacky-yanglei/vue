<template>
  <div id="ljb-tools-wifi-setting" :class="{'tf-24': changeTransform}">
    <div class="wifi-wetting-title">
      {{ $t('i18n.WIFI_SETTING') }}
    </div>
    <div class="wifi-setting">
      <wifi-switch @busTransform="toggleTransform"></wifi-switch>
      <wifi-channel @busGetChannel="getChannelData"></wifi-channel>
      <wifi-name @busGetName="getWIfiName"></wifi-name>
      <a href="javascript:;" class="save-setting" @click="getWifiSettingInfo()">{{ $t('i18n.SAVE_SET') }}</a>
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
export default {
  name: 'WifiSetting',
  data: function() {
    return {
      changeTransform: false,
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
      txtChannel: ''
    }
  },
  components: {
    WifiSwitch,
    WifiChannel,
    WifiName,
    FadeTips
  },
  methods: {
    toggleTransform: function(data) {
      // 改变transform
      this.changeTransform = !data
    },
    getChannelData: function(data) {
      // 获取wifichannel子组件传递的channel
      this.wifiSettingInfo.channel = data
    },
    getWIfiName: function(data) {
      // 获取wifiname子组件传递的wifiname
      this.wifiSettingInfo.name = data
    },
    getWifiSettingInfo: function() {
      if (this.changeTransform) {
        this.apiData.enable = '0'
      } else {
        this.apiData.enable = '1'
      }
      if (this.wifiSettingInfo.channel === `${this.$t('i18n.AUTO')}`) {
        this.wifiSettingInfo.channel = '0'
      }
      this.apiData.channel = this.wifiSettingInfo.channel
      if (this.wifiSettingInfo.name !== '' || this.changeTransform) {
        this.apiData.ssid = this.wifiSettingInfo.name
        // 调用相关接口
        this.apiNetWlanSet()
      } else {
        this.$root.Bus.$emit('busShowWarnTip', false)
      }
    },
    apiNetWlanSet: function() {
      this.$root.Bus.$emit('maskClick', false)
      netWlanSet(this.apiData)
        .then((data) => {
          if (data.ret === 0) {
            this.tip.msg = `${this.$t('i18n.SET_DOWN')}`
            this.tip.type = 'success'
            this.tip.show = true
            this.$root.Bus.$emit('maskClick', true)
          }
        })
        .catch(e => {
          this.tip.msg = e
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
          this.apiData = data.wlan0
          this.apiData.ifname = 'wlan0'
          this.$root.Bus.$emit('busCheckCloseStatus', data.wlan0.enable)
          this.txtChannel = this.apiData.channel
          if (this.txtChannel === 'auto') {
            this.txtChannel = `${this.$t('i18n.AUTO')}`
          }
          this.$root.Bus.$emit('busChannelInfo', this.txtChannel)
          this.$root.Bus.$emit('busWifiname', this.apiData.ssid)
        })
        .catch(e => {
        })
    }
  },
  mounted() {
    this.apiNetWlanGetFn()
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_mixin.scss';
#ljb-tools-wifi-setting {
  width: 600px;
  border: 1px solid transparent;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 15%);
  transition: transform 0.3s;
  top: -95px;
  background: linear-gradient(
    180deg,
    rgba(240, 243, 247, 1),
    rgba(255, 255, 255, 1)
  );
  box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  margin: 0 auto;
  margin-bottom: 70px;
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
    padding: 60px;
  }
  .save-setting {
    @include startBtn-primaryHover;
    width: 480px;
    height: 56px;
    margin-top: 80px;
    text-align: center;
    line-height: 56px;
    font-size: 16px;
    cursor: pointer;
  }
}
#ljb-tools-wifi-setting.tf-24 {
  transform: translate(-50%, 24%);
}
</style>
