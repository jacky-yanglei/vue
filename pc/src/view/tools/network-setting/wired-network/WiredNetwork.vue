<template>
  <div class="wired-network-body">
    <p>{{ $t('i18n.NETWORK_WAY') }}：<span>{{ $t('i18n.WIRED_NETWORK') }}</span></p>
    <div class="pdt30">
      <p>{{ $t('i18n.NETWORK_TYPE') }}：</p>
      <div class="ip-toggle-btns">
        <a href="javascript:void(0)" :class="{'btn-selected': toggleIpType === 0}" @click="toggleIpTypeFn(0)">{{ $t('i18n.DYNAMIC_IP_ADDR') }}</a>
        <a href="javascript:void(0)" :class="{'btn-selected': toggleIpType === 1}" @click="toggleIpTypeFn(1)">{{ $t('i18n.STATIC_IP_ADDR') }}</a>
      </div>
      <dynamic-ip v-show="toggleIpType === 0"></dynamic-ip>
      <static-ip v-show="toggleIpType === 1"></static-ip>
      <primary-button
        height="56"
        :text="text"
        :disabled="waitingDy"
        :loading="waitingDy"
        class="network-setting-save"
        @btnClicked="saveDynamicIpFn()"
        v-show="toggleIpType === 0">
      </primary-button>
      <primary-button
        height="56"
        :text="text"
        :disabled="waitingSt"
        :loading="waitingSt"
        class="network-setting-save mgt0"
        @btnClicked="saveStaticIpFn()"
        v-show="toggleIpType === 1">
      </primary-button>
      <a href="javascript:;" class="network-setting-toggle" @click="clickToggleNetType()">{{ $t('i18n.TOGGLE_WIFI_NETWORK') }}</a>
    </div>
    <fade-tips :msg="tip.msg" :type="tip.type" :show="tip.show" @hide="tip.show = false"></fade-tips>
  </div>
</template>

<script>
import DynamicIp from './components/DynamicIp'
import StaticIp from './components/StaticIp'
import { netWanGet, netTypeSet, netWanSet } from '@/api/network-check-api'
import { PrimaryButton } from '@/common/components/buttons/'
import FadeTips from '@/common/components/fade-tips/FadeTips'
import getNetTypeAndWifiSsidService from '@/common/service/getNetTypeAndWifiSsid'
import { getInitStatusApi } from '@/api/login-api'
export default {
  name: 'WiredNetwork',
  data: function() {
    return {
      dynamicIpInfo: {
        DNS1: '',
        DNS2: '',
        MTU: ''
      },
      wanData: {},
      toggleIpType: 0,
      staticIpInfo: {
        txtIpAddr: '',
        txtNetmasks: '',
        txtGateway: '',
        txtDNS1: '',
        txtDNS2: '',
        txtMTU: ''
      },
      dynamicCheckbox: false,
      dynamicCheckPass: [],
      staticCheckbox: false,
      staticCheckPass: [],
      text: this.$t('i18n.SAVE_EFFECT'),
      waitingDy: false,
      waitingSt: false,
      tip: {
        msg: '',
        type: 'success',
        show: false
      },
      objWaitingDy: {
        msg: this.$t('i18n.SAVE_CONFIGURATION_TIPS'),
        show: true
      },
      objWaitingSt: {
        msg: this.$t('i18n.SAVE_CONFIGURATION_TIPS'),
        show: true
      },
      pathStr: '',
      temPromise: null,
      isPassBtn: false,
      bootprotoType: null,
      errBrotoNum: 1,
      errGetNum: 1,
      stopSetInterval: null,
      stopTimeout: null,
      apiGetNumDy: 1,
      apiGetNumSt: 1
    }
  },
  components: {
    DynamicIp,
    StaticIp,
    PrimaryButton,
    FadeTips
  },
  methods: {
    DNS1DynamicFn: function(data) {
      this.dynamicIpInfo.DNS1 = data
    },
    DNS2DynamicFn: function(data) {
      this.dynamicIpInfo.DNS2 = data
    },
    MTUDynamicFn: function(data) {
      this.dynamicIpInfo.MTU = data
    },
    ipAddrStaticFn: function(data) {
      this.staticIpInfo.txtIpAddr = data
    },
    netmasksStaticFn: function(data) {
      this.staticIpInfo.txtNetmasks = data
    },
    gatewayStaticFn: function(data) {
      this.staticIpInfo.txtGateway = data
    },
    DNS1StaticFn: function(data) {
      this.staticIpInfo.txtDNS1 = data
    },
    DNS2StaticFn: function(data) {
      this.staticIpInfo.txtDNS2 = data
    },
    MTUStaticFn: function(data) {
      this.staticIpInfo.txtMTU = data
    },
    toggleIpTypeFn: function(num) {
      this.apiNetWanGetFn()
      window.localStorage.setItem('ipType', num)
      // 切换动态ip和静态ip
      let ipNum = parseInt(window.localStorage.getItem('ipType'))
      this.toggleIpType = ipNum
    },
    toggleIpTypeByStorageFn: function() {
      let ipNum = parseInt(window.localStorage.getItem('ipType')) || this.toggleIpType
      this.toggleIpType = ipNum
    },
    saveDynamicIpFn: function() {
      this.apiGetNumDy = 1
      if (this.isPassBtn) {
        if (this.dynamicCheckbox) {
          if (this.dynamicCheckPass[0] &&
          this.dynamicCheckPass[1] &&
          this.dynamicCheckPass[2]) {
            this.waitingDy = true
            // 调相关的接口
            this.apiNetTypeSetDynamicFn(this.dynamicIpInfo)
          }
        } else {
          let dynamicParams = {
            DNS1: '',
            DNS2: '',
            MTU: ''
          }
          this.waitingDy = true
          this.apiNetTypeSetDynamicFn(dynamicParams)
        }
      } else {
        this.tip.msg = `${this.$t('i18n.WARM_TIP_WIRED')}`
        this.tip.type = 'tip'
        this.tip.show = true
        this.isPassBtn = true
      }
    },
    saveStaticIpFn: function() {
      this.apiGetNumSt = 1
      let staticParams = this.staticIpInfo
      if (!this.staticCheckbox) {
        staticParams.txtMTU = ''
      }
      if (this.staticCheckPass[0] &&
        this.staticCheckPass[1] &&
        this.staticCheckPass[2] &&
        this.staticCheckPass[3] &&
        this.staticCheckPass[4] &&
        this.staticCheckPass[5]) {
        this.waitingSt = true
        this.apiNetTypeSetStaticFn(staticParams)
      }
    },
    saveIpInfoFn: function() {
    },
    clickToggleNetType: function() {
      this.$root.Bus.$emit('busToggleNetType', 'wifi')
    },
    apiNetWanGetFn: function() {
      netWanGet()
        .then(data => {
          if (data.ret === 0) {
            this.wanData = data
            // 调用触发传值 的接口
            this.busWanDataFn(this.wanData)
            this.isPassBtn = true
            // this.bootprotoType = data.bootproto
            // this.toggleDsFn()
            let href = window.location.href
            window.location.href = href
          }
        })
        .catch(e => {
          this.errGetNum++
          if (this.errGetNum <= 2) {
            this.apiNetWanGetFn()
          } else {
            this.errGetNum = 1
            this.isPassBtn = false
            // this.tip.msg = this.$t('i18n.GET_INFI_FAILED')
            // this.tip.type = 'error'
            // this.tip.show = true
          }
        })
    },
    busWanDataFn: function(data) {
      this.$root.Bus.$emit('busWanData', data)
    },
    busDynamicCheckPassFn: function(data) {
      this.dynamicCheckPass = data
    },
    busStaticCheckPassFn: function(data) {
      this.staticCheckPass = data
    },
    apiNetTypeSetDynamicFn: function(apiInfo) {
      if (this.temPromise) {
        if (this.temPromise.network) {
          if (parseInt(this.temPromise.network) === 2) {
            this.objWaitingDy.msg = `${this.$t('i18n.NETWORK_SETTING_W_2')}:${this.temPromise.wifiSsid},${this.$t('i18n.NETWORK_SETTING_W_3')}`
          } else if (parseInt(this.temPromise.network) === 1) {
            this.objWaitingDy.msg = this.$t('i18n.SAVE_CONFIGURATION_TIPS')
          }
        } else {
          // 警告提醒 ，正在获取相应数据
          this.tip.msg = `${this.$t('i18n.WARM_TIP_WIRED')}`
          this.tip.type = 'tip'
          this.tip.show = true
          return
        }
      } else {
        this.waitingDy = false
        this.tip.msg = `${this.$t('i18n.WARM_TIP_WIRED')}`
        this.tip.type = 'tip'
        this.tip.show = true
        return
      }
      this.$root.Bus.$emit('waitingMaskShow', this.objWaitingDy)
      let apiData = {
        nettype: 'ethernet'
      }
      netTypeSet(apiData)
        .then(data => {
          if (data.ret === 0) {
            this.apiNetWanSetDynamicFn(apiInfo)
          }
        })
        .catch(e => {
          this.$root.Bus.$emit('waitingMaskShow', { show: false })
          this.waitingDy = false
          this.tip.msg = e
          this.tip.type = 'error'
          this.tip.show = true
        })
    },
    apiNetWanSetDynamicFn: function(apiInfo) {
      let apiData = {
        bootproto: 'dhcp'
      }
      Object.assign(apiData, apiInfo)
      netWanSet(apiData)
        .then(data => {
          if (data.ret === 0) {
            this.stopSetInterval = setInterval(() => {
              getInitStatusApi()
                .then(res => {
                  if ('' + res.ret) {
                    if (this.apiGetNumDy === 1) {
                      clearInterval(this.stopSetInterval)
                      this.waitingDy = false
                      this.$root.Bus.$emit('waitingMaskShow', { show: false })
                      this.apiNetWanGetFn()
                      this.tip.msg = this.$t('i18n.SET_DOWN')
                      this.tip.type = 'success'
                      this.tip.show = true
                      let href = window.location.href
                      window.location.href = href
                      this.apiGetNumDy++
                    }
                    let aa = setTimeout(() => {
                      this.apiGetNumDy = 1
                      clearTimeout(aa)
                    }, 5000)
                  }
                })
            }, 2000)
          }
        })
        .catch(e => {
          this.$root.Bus.$emit('waitingMaskShow', { show: false })
          this.waitingDy = false
          this.tip.msg = e
          this.tip.type = 'error'
          this.tip.show = true
        })
    },
    apiNetTypeSetStaticFn: function(apiInfo) {
      if (parseInt(this.temPromise.network) === 2) {
        this.objWaitingSt.msg = `${this.$t('i18n.NETWORK_SETTING_W_2')}:${this.temPromise.wifiSsid},${this.$t('i18n.NETWORK_SETTING_W_3')}`
      } else if (parseInt(this.temPromise.network) === 1) {
        this.objWaitingSt.msg = this.$t('i18n.SAVE_CONFIGURATION_TIPS')
      }
      this.$root.Bus.$emit('waitingMaskShow', this.objWaitingSt)
      let apiData = {
        nettype: 'ethernet'
      }
      netTypeSet(apiData)
        .then(data => {
          if (data.ret === 0) {
            this.apiNetWanSetStaticFn(apiInfo)
          }
        })
        .catch(e => {
          this.$root.Bus.$emit('waitingMaskShow', { show: false })
          this.waitingSt = false
          this.tip.msg = e
          this.tip.type = 'error'
          this.tip.show = true
        })
    },
    apiNetWanSetStaticFn: function(apiInfo) {
      let apiData = {
        bootproto: 'static'
      }
      apiData.ip = apiInfo.txtIpAddr
      apiData.gw = apiInfo.txtGateway
      apiData.netmask = apiInfo.txtNetmasks
      apiData.dns1 = apiInfo.txtDNS1
      apiData.dns2 = apiInfo.txtDNS2
      apiData.mtu = apiInfo.txtMTU
      netWanSet(apiData)
        .then(data => {
          if (data.ret === 0) {
            this.stopSetInterval = setInterval(() => {
              getInitStatusApi()
                .then(res => {
                  if ('' + res.ret) {
                    if (this.apiGetNumSt === 1) {
                      clearInterval(this.stopSetInterval)
                      this.waitingSt = false
                      this.$root.Bus.$emit('waitingMaskShow', { show: false })
                      this.apiNetWanGetFn()
                      this.tip.msg = this.$t('i18n.SET_DOWN')
                      this.tip.type = 'success'
                      this.tip.show = true
                      let href = window.location.href
                      window.location.href = href
                      this.apiGetNumSt++
                    }
                    let aa = setTimeout(() => {
                      this.apiGetNumSt = 1
                      clearTimeout(aa)
                    }, 5000)
                  }
                })
            }, 2000)
          }
        })
        .catch(e => {
          this.$root.Bus.$emit('waitingMaskShow', { show: false })
          this.waitingSt = false
          this.tip.msg = e
          this.tip.type = 'error'
          this.tip.show = true
        })
    },
    getRoute: function() {
      this.pathStr = this.$route.path
    },
    checkBootprotoNetApiFn: function() {
      netWanGet()
        .then(data => {
          this.bootprotoType = data.bootproto
          this.toggleDsFn()
        })
        .catch(e => {
          this.errBrotoNum++
          if (this.errBrotoNum <= 3) {
            let aa = setTimeout(() => {
              this.checkBootprotoNetApiFn()
              clearTimeout(aa)
            }, 500)
          } else {
            this.errBrotoNum = 1
            // this.tip.msg = this.$t('i18n.GET_INFI_FAILED')
            // this.tip.type = 'error'
            // this.tip.show = true
          }
        })
    },
    toggleDsFn: function() {
      if (this.bootprotoType === 'dhcp') {
        this.toggleIpType = 0
      } else if (this.bootprotoType === 'static') {
        this.toggleIpType = 1
      }
    }
  },
  created() {
    // 调用获取wan的方法
    this.apiNetWanGetFn()
    this.checkBootprotoNetApiFn()
    // Dynamic
    this.$root.Bus.$on('busDNS1Dynamic', data => {
      this.DNS1DynamicFn(data)
    })
    this.$root.Bus.$on('busDNS2Dynamic', data => {
      this.DNS2DynamicFn(data)
    })
    this.$root.Bus.$on('busMTUDynamic', data => {
      this.MTUDynamicFn(data)
    })
    // Static
    this.$root.Bus.$on('busIpAddrStatic', data => {
      this.ipAddrStaticFn(data)
    })
    this.$root.Bus.$on('busNetmasksStatic', data => {
      this.netmasksStaticFn(data)
    })
    this.$root.Bus.$on('busGatewayStatic', data => {
      this.gatewayStaticFn(data)
    })
    this.$root.Bus.$on('busDNS1Static', data => {
      this.DNS1StaticFn(data)
    })
    this.$root.Bus.$on('busDNS2Static', data => {
      this.DNS2StaticFn(data)
    })
    this.$root.Bus.$on('busMTUStatic', data => {
      this.MTUStaticFn(data)
    })
    // 通过本地存储切换ip组件
    this.toggleIpTypeByStorageFn()
    // 从动态ip组件传checkbox状态
    this.$root.Bus.$on('busDynamicCheckbox', data => {
      this.dynamicCheckbox = data
    })
    // 从动态ip组件传checkPass
    this.$root.Bus.$on('busDynamicCheckPass', data => {
      this.busDynamicCheckPassFn(data)
    })
    // 从静态ip组件传checkbox状态
    this.$root.Bus.$on('busStaticCheckbox', data => {
      this.staticCheckbox = data
    })
    // 从静态ip组件传checkPass
    this.$root.Bus.$on('busStaticCheckPass', data => {
      this.busStaticCheckPassFn(data)
    })
    getNetTypeAndWifiSsidService()
      .then((data) => {
        this.temPromise = data
      })
    window.localStorage.setItem('ipType', 0)
  },
  beforeDestroy() {
    this.$root.Bus.$off('busDNS1Dynamic')
    this.$root.Bus.$off('busDNS2Dynamic')
    this.$root.Bus.$off('busMTUDynamic')
    this.$root.Bus.$off('busIpAddrStatic')
    this.$root.Bus.$off('busNetmasksStatic')
    this.$root.Bus.$off('busGatewayStatic')
    this.$root.Bus.$off('busDNS1Static')
    this.$root.Bus.$off('busDNS2Static')
    this.$root.Bus.$off('busMTUStatic')
    this.$root.Bus.$off('busDynamicCheckbox')
    this.$root.Bus.$off('busDynamicCheckPass')
    this.$root.Bus.$off('busStaticCheckbox')
    this.$root.Bus.$off('busStaticCheckPass')
    window.localStorage.setItem('ipType', 0)
  },
  watch: {
    $route: 'getRoute'
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../common/sass/_mixin';
@import '../../../../common/sass/_constant';
.wired-network-body {
  padding: 40px 60px 60px;
  & > .pdt30 {
    padding-top: 30px;
  }
}
p {
  font-size:14px;
  color:rgba(131,137,161,1);
  line-height:20px;
  & > span {
    color: rgba(44, 42, 56, 1);
  }
}
.ip-toggle-btns {
  width: 480px;
  border-radius: 4px;
  border: 1px solid rgba(0, 159, 232, 1);
  overflow: hidden;
  margin-top: 10px;
  margin-bottom: 20px;
  & > a {
    width: 50%;
    float: left;
    height: 46px;
    line-height: 46px;
    text-align: center;
    color: rgba(58, 56, 72, 1);
    cursor: pointer;
  }
  & > .btn-selected {
    background:linear-gradient(-90deg,rgba(57,193,255,1),rgba(0,159,232,1));
    color: #fff;
  }
}
.network-setting-save {
  line-height: 56px;
  margin-bottom: 10px;
}
.pdt30 .button-wrapper {
  margin-top: 0;
}
.network-setting-toggle {
  width:480px;
  height:56px;
  margin-top: 20px;
  background:linear-gradient(180deg,rgba(255,255,255,1),rgba(245,245,245,1));
  box-shadow: 0px 2px 0px 0px rgba(255,255,255,1);
  border-radius: 6px;
  line-height: 56px;
  text-align: center;
  border: 1px solid rgba(230,230,231,1);
  cursor: pointer;
  color:rgba(117,115,139,1);
  font-size: 16px;
  transition: box-shadow 0.3s, border 0.3s;
  &:hover {
    border: 1px solid #39c1ff;
    box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.5);
  }
  &:focus {
    border: 1px solid #39c1ff;
    box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.5);
  }
}
</style>
