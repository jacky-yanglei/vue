<template>
  <div class="ljb-start-staticIP start-pd">
    <div class="static-ip-setting">
      <h3>{{ $t('i18n.SET_STATIC_IP_ADDRESS') }}</h3>
      <div class="input-wrapper">
        <input type="text"
          v-model="staticIpInfo.ipAddr.val"
          class="staticIP-input beauty-placeholder"
          :class="{'error': staticIpInfo.ipAddr.vaild}"
          :placeholder="$t('i18n.IP_ADDRESS_UPPERCASE')"
          @change="verifyIpFn(staticIpInfo.ipAddr)"
          @input="verifyIpFn(staticIpInfo.ipAddr)"
          @blur="verifyIpFn(staticIpInfo.ipAddr)">
          <div class="wan-tip" :class="{'opacity': staticIpInfo.ipAddr.isShowWanTip}">{{ $t('i18n.IP_FORMAL_ERROR') }}</div>
      </div>
      <div class="input-wrapper">
        <input type="text"
          v-model="staticIpInfo.netmasks.val"
          class="staticIP-input beauty-placeholder"
          :class="{'error': staticIpInfo.netmasks.vaild}"
          :placeholder="$t('i18n.SUBNET_MASK') + '：255.255.255.0'"
          @change="verifyMaskFn(staticIpInfo.netmasks)"
          @input="verifyMaskFn(staticIpInfo.netmasks)"
          @blur="verifyMaskFn(staticIpInfo.netmasks)">
          <div class="wan-tip" :class="{'opacity': staticIpInfo.netmasks.isShowWanTip}">{{ $t('i18n.SUBNET_MASK_FORMAL_ERROR') }}</div>
      </div>
      <div class="input-wrapper">
        <input type="text"
          v-model="staticIpInfo.gateway.val"
          class="staticIP-input beauty-placeholder"
          :class="{'error': staticIpInfo.gateway.vaild}"
          :placeholder="$t('i18n.GATEWAY')"
          @change="verifyIpFn(staticIpInfo.gateway)"
          @input="verifyIpFn(staticIpInfo.gateway)"
          @blur="verifyIpFn(staticIpInfo.gateway)">
          <div class="wan-tip" :class="{'opacity': staticIpInfo.gateway.isShowWanTip}">{{ $t('i18n.IP_FORMAL_ERROR') }}</div>
      </div>
      <div class="input-wrapper">
        <input type="text"
          v-model="staticIpInfo.DNS1.val"
          class="staticIP-input beauty-placeholder"
          :class="{'error': staticIpInfo.DNS1.vaild}"
          :placeholder="$t('i18n.DNS1_SET_TIP')"
          @change="verifyIpFn(staticIpInfo.DNS1)"
          @input="verifyIpFn(staticIpInfo.DNS1)"
          @blur="verifyIpFn(staticIpInfo.DNS1)">
          <div class="wan-tip" :class="{'opacity': staticIpInfo.DNS1.isShowWanTip}">{{ $t('i18n.IP_FORMAL_ERROR') }}</div>
      </div>
      <div class="input-wrapper">
        <input type="text"
          v-model="staticIpInfo.DNS2.val"
          class="staticIP-input beauty-placeholder"
          :class="{'error': staticIpInfo.DNS2.vaild}"
          :placeholder="$t('i18n.DNS2_SET_TIP')"
          @change="verifyIpFn(staticIpInfo.DNS2)"
          @input="verifyIpFn(staticIpInfo.DNS2)"
          @blur="verifyIpFn(staticIpInfo.DNS2)">
          <div class="wan-tip" :class="{'opacity': staticIpInfo.DNS2.isShowWanTip}">{{ $t('i18n.IP_FORMAL_ERROR') }}</div>
      </div>
    </div>
    <primary-button
    :text="text"
    @btnClicked="checkAllVaildFn()"
    :disabled="setting"
    :loading="setting"
    class="button-mg">
    </primary-button>
    <oval></oval>
    <fade-tips :msg="tip.msg" :type="tip.type" :show="tip.show" @hide="tip.show = false"></fade-tips>
  </div>
</template>

<script>
import Oval from '@/common/components/oval/oval'
import { netWanSet } from '@/api/network-check-api'
import { getInitStatusApi } from '@/api/login-api'
import { PrimaryButton } from '../../../common/components/buttons/index'
import FadeTips from '@/common/components/fade-tips/FadeTips'

import regular from '@/common/service/regular'
export default {
  name: 'LjbStartStaticIP',
  data: function() {
    return {
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
      vaildPass: false,
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
      }
    }
  },
  components: {
    Oval,
    PrimaryButton,
    FadeTips
  },
  methods: {
    checkAllVaildFn() {
      if (
        this.isOkBtn[0] &&
        this.isOkBtn[1] &&
        this.isOkBtn[2] &&
        this.isOkBtn[3] &&
        this.isOkBtn[4]
      ) {
        this.apiNetWanSetFn()
      } else {
        this.tip.msg = this.$t('i18n.PLEASE_WRITE_SET')
        this.tip.type = 'error'
        this.tip.show = true
      }
    },
    apiNetWanSetFn: function() {
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
        .then(data => {
          this.restartIntervalTime = setInterval(() => {
            this.apiCheckComponlateFn()
          }, 3000)
        })
        .catch(e => {
          this.setting = false
          this.SetIpWaiting.show = false
          this.$root.Bus.$emit('waitingMaskShow', this.SetIpWaiting)
          this.text = this.$t('i18n.IS_SETTING')
          this.tip.msg = e
          this.tip.type = 'error'
          this.tip.show = true
        })
    },
    verifyIpFn: function(obj) {
      let verify = regular.verifyIp(obj.val)
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
          this.setting = false
          this.SetIpWaiting.show = false
          this.$root.Bus.$emit('waitingMaskShow', this.SetIpWaiting)
          this.$router.push('/complate')
        }
      })
    },
    wanTipFn: function(obj) {
      obj.isShowWanTip = true
    }
  },
  mounted() {
    this.$root.Bus.$emit('HiddenAppLoading')
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_constant.scss';
@import '../../../common/sass/_mixin.scss';

.ljb-start-staticIP {
  width: 432px;
  margin: 0 auto;
  & > .static-ip-setting {
    width: 100%;
    border-radius: 6px;
    background-color: #fff;
    padding: 40px 60px 60px 60px;
    h3 {
      font-size: 18px;
      color: rgba(58, 56, 72, 1);
      text-align: center;
      margin-bottom: 16px;
    }
    & > .input-wrapper {
      position: relative;
    }
    .staticIP-input {
      width: 100%;
      height: 46px;
      background-color: #fff;
      border-radius: 4px;
      border: 1px solid transparent;
      border-bottom: 1px solid #eee;
      transition: border 0.3s, box-shadow 0.3s;
      padding: 0 5px;
      font-size: 14px;
      margin-bottom: 10px;
      color: rgba(58, 56, 72, 1);
      z-index: 1;
      position: relative;
      &:focus {
        border: 1px solid rgba(0, 159, 232, 1);
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.5);
        z-index: 2;
      }
      &.error {
        background: rgba(241, 68, 102, 0.1);
        border: 1px solid #f14466;
      }
    }
    .wan-tip {
      position: absolute;
      z-index: 3;
      right: 30px;
      top: 12px;
      color: red;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .wan-tip.opacity {
      opacity: 0.8;
    }
    .beauty-placeholder {
      &:-moz-placeholder {
        text-align: left;
      }
      &:-ms-input-placeholder {
        text-align: left;
      }
      &::-webkit-input-placeholder {
        text-align: left;
      }
    }
  }
  & > .static-ip-btn {
    @include startBtn-primaryHover();
    width: 432px;
    height: 56px;
    margin-top: 30px;
    text-align: center;
    line-height: 56px;
    font-size: 16px;
  }
  .button-mg {
    margin-top: 30px;
  }
}
</style>
