<template>
  <div>
    <div class="wrapper" :class="loading||tipShow?'filter':''">
      <h3>{{$t('i18n.SET_STATIC_IP')}}</h3>
      <div class="input-group">
        <div>{{$t('i18n.IP_ADDRESS')}}:</div>
        <div>
          <input type="text"
                 id="ip-addr"
                 v-model="staticIpInfo.ipAddr.val"
                 class="staticIP-input beauty-placeholder"
                 :class="{'error': staticIpInfo.ipAddr.vaild}"
                 :placeholder="$t('i18n.IP_ADDRESS')"
                 @change="verifyIpFn(staticIpInfo.ipAddr)"
                 @input="verifyIpFn(staticIpInfo.ipAddr)"
                 @blur="verifyIpFn(staticIpInfo.ipAddr)">
          <label for="ip-addr" v-if="staticIpInfo.ipAddr.vaild" class="error-tip">{{ errorTxt }}</label>
        </div>
      </div>
      <div class="input-group">
        <div>{{$t('i18n.SUBNET_MASK')}}:</div>
        <div>
          <input type="text"
                 id="netmasks"
                 v-model="staticIpInfo.netmasks.val"
                 class="staticIP-input beauty-placeholder"
                 :class="{'error': staticIpInfo.netmasks.vaild}"
                 :placeholder="$t('i18n.SUBNET_MASK') + '：255.255.255.0'"
                 @change="verifyMaskFn(staticIpInfo.netmasks)"
                 @input="verifyMaskFn(staticIpInfo.netmasks)"
                 @blur="verifyMaskFn(staticIpInfo.netmasks)">
          <label for="netmasks" v-if="staticIpInfo.netmasks.vaild" class="error-tip">{{ errorTxt }}</label>
        </div>
      </div>
      <div class="input-group">
        <div>{{$t('i18n.GATEWAY')}}:</div>
        <div>
          <input type="text"
                 id="gateway"
                 v-model="staticIpInfo.gateway.val"
                 class="staticIP-input beauty-placeholder"
                 :class="{'error': staticIpInfo.gateway.vaild}"
                 :placeholder="$t('i18n.GATEWAY')"
                 @change="verifyIpFn(staticIpInfo.gateway)"
                 @input="verifyIpFn(staticIpInfo.gateway)"
                 @blur="verifyIpFn(staticIpInfo.gateway)">
          <label for="gateway" v-if="staticIpInfo.gateway.vaild" class="error-tip">{{ errorTxt }}</label>
        </div>
      </div>
      <div class="input-group">
        <div>DNS1:</div>
        <div>
          <input type="text"
                 id="dns1"
                 v-model="staticIpInfo.DNS1.val"
                 class="staticIP-input beauty-placeholder"
                 :class="{'error': staticIpInfo.DNS1.vaild}"
                 :placeholder="$t('i18n.DNS1_SET_TIP')"
                 @change="verifyIpFn(staticIpInfo.DNS1)"
                 @input="verifyIpFn(staticIpInfo.DNS1)"
                 @blur="verifyIpFn(staticIpInfo.DNS1)">
          <label for="dns1" v-if="staticIpInfo.DNS1.vaild" class="error-tip">{{ errorTxt }}</label>
        </div>
      </div>
      <div class="input-group">
        <div>DNS2:</div>
        <div>
          <input type="text"
                 id="dns2"
                 v-model="staticIpInfo.DNS2.val"
                 class="staticIP-input beauty-placeholder"
                 :class="{'error': staticIpInfo.DNS2.vaild}"
                 :placeholder="$t('i18n.DNS2_SET_TIP')"
                 @change="verifyIpFn(staticIpInfo.DNS2)"
                 @input="verifyIpFn(staticIpInfo.DNS2)"
                 @blur="verifyIpFn(staticIpInfo.DNS2)">
          <label for="dns2" v-if="staticIpInfo.DNS2.vaild" class="error-tip">{{ errorTxt }}</label>
        </div>
      </div>
      <div class="input-group">
        <primary-button :disabled="!(isOkBtn[0]&&isOkBtn[1]&&isOkBtn[2]&&isOkBtn[3]&&isOkBtn[4])" @buttonClicked='apiNetWanSetFn'>{{$t('i18n.GET_STARTED')}}</primary-button>
      </div>
    </div>
    <div class="loading" v-if="loading">
      <loading-wait :show="true" :msg="$t('i18n.STATIC_IP_SETUP_PROGRESS') + $t('i18n.NETWORK_WILL_DISCONNENTION_PLEASE_CHECK_INTERNET_1') + thisWifiSsid"></loading-wait>
    </div>
    <fade-tips :msg="tipMsg" :show="tipShow" :type="'error'"></fade-tips>
  </div>
</template>

<script>
import PrimaryButton from '../../../common/components/buttons/primary-button'
import { netWanSet } from '@/api/network-check-api'
import { getInitStatusApi } from '@/api/login-api'
import regular from '@/common/service/regular'
import LoadingWait from '@/common/components/loadings/loading-wait'
import getNetTypeAndWifiSsidService from '@/common/service/getNetTypeAndWifiSsid'
import FadeTips from '@/common/components/fade-tips/fade-tips'
export default {
  name: 'SetStaticIPView',
  components: {
    PrimaryButton,
    LoadingWait,
    FadeTips
  },
  data() {
    return {
      errorTxt: this.$t('i18n.INPUT_FORMAT_ERROR'),
      staticIpInfo: {
        ipAddr: {
          val: '',
          vaild: false,
          isShowWanTip: false,
          key: 0
        },
        netmasks: {
          val: '',
          vaild: false,
          isShowWanTip: false,
          key: 1
        },
        gateway: {
          val: '',
          vaild: false,
          isShowWanTip: false,
          key: 2
        },
        DNS1: {
          val: '',
          vaild: false,
          isShowWanTip: false,
          key: 3
        },
        DNS2: {
          val: '',
          vaild: false,
          isShowWanTip: false,
          key: 4
        }
      },
      isOkBtn: [false, false, false, false, false],
      restartIntervalTime: '',
      setting: false,
      text: this.$t('i18n.COME_INTO_USE'),
      tip: {
        msg: '',
        type: 'success',
        show: false
      },
      SetIpWaiting: {
        msg: `${this.$t('i18n.SET_STATIC_IP_WAITING_TIP')}`,
        show: true
      },
      loading: false,
      thisWifiSsid: '',
      tipShow: false,
      tipMsg: ''
    }
  },
  mounted() {
    getNetTypeAndWifiSsidService().then(res => {
      this.thisWifiSsid = res.wifiSsid
    })
  },
  methods: {
    apiNetWanSetFn: function() {
      this.loading = true
      let obj = {
        bootproto: 'static',
        ip: this.staticIpInfo.ipAddr.val,
        gw: this.staticIpInfo.gateway.val,
        netmask: this.staticIpInfo.netmasks.val,
        dns1: this.staticIpInfo.DNS1.val,
        dns2: this.staticIpInfo.DNS2.val,
        mtu: ''
      }
      this.setting = true
      this.text = this.$t('i18n.COME_INTO_USE')
      this.SetIpWaiting.show = true
      this.$root.Bus.$emit('waitingMaskShow', this.SetIpWaiting)
      netWanSet(obj)
        .then(() => {
          this.restartIntervalTime = setInterval(() => {
            this.apiCheckComponlateFn()
          }, 3000)
        })
        .catch(e => {
          this.loading = false
          this.tipShow = true
          this.tipMsg = e
          setTimeout(() => {
            this.tipShow = false
          }, 2000)
        })
    },
    verifyIpFn: function(obj) {
      let verify = regular.verifyIP(obj.val)
      if (!verify) {
        obj.vaild = true
        this.isOkBtn[obj.key] = false
        obj.isShowWanTip = true
      } else {
        obj.vaild = false
        this.isOkBtn[obj.key] = true
        obj.isShowWanTip = false
      }
    },
    verifyMaskFn: function(mask) {
      let verify = regular.verifyMask(mask.val)
      if (!verify) {
        mask.vaild = true
        this.isOkBtn[mask.key] = false
        mask.isShowWanTip = true
      } else {
        mask.vaild = false
        this.isOkBtn[mask.key] = true
        mask.isShowWanTip = false
      }
    },
    apiCheckComponlateFn: function() {
      getInitStatusApi().then(res => {
        if ('' + res.ret) {
          clearInterval(this.restartIntervalTime)
          this.$router.push('/set-success')
        }
      })
    },
    wanTipFn: function(obj) {
      obj.isShowWanTip = true
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../common/scss/mixin';
  @import '../../../common/scss/utils';
  .wrapper{
    width: 100%;
    min-height: 100vh;
    background:linear-gradient(-180deg,rgba(238,239,242,1),rgba(216,218,225,1));
    text-align: center;
    padding-top: rem(60px);
    h3{
      margin-bottom: rem(40px);
      font-size: rem(36px);
    }
    .input-group{
      text-align: left;
      width: rem(590px);
      margin: 0 auto rem(30px);
      >div:first-child:not(.primary-button){
        font-size: rem(26px);
        color: #75738B;
        margin-bottom: rem(20px);
      }
      >div:last-child{
        position: relative;
        input{
          width: 100%;
          box-sizing: border-box;
          border: 1px solid white;
          background-color: white;
          padding: rem(24px) rem(200px) rem(24px) rem(30px);
          border-radius: rem(8px);
          font-size: rem(30px);
          color: #3A3848;
          &:focus{
            transition: all .2s linear;
            border: 1px solid #009FE8;
            box-shadow: 0 rem(8px) rem(30px) rgba(0, 159, 232, 0.3);
          }
          &.error {
            background: rgba(241, 68, 102, 0.1);
            border: 1px solid #f14466;
          }
        }
        .error-tip{
          position: absolute;
          top: rem(28px);
          right: rem(10px);
          width: rem(180px);
          text-align: center;
          font-size: rem(26px);
          color: red;
        }
      }
    }
  }
  .loading{
    position: absolute;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .filter{
    filter: blur(10px);
    height: 100vh;
    overflow: hidden;
  }
</style>
