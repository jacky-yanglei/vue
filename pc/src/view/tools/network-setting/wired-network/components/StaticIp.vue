<template>
  <div class="static-ip">
    <div class="input" :class="{'input-h': showInputH}">
      <div class="input-wrapper">
        <input class="beauty-placeholder"
          type="text"
          :placeholder="IP.placeholder"
          v-model="IP.value"
          @change="busCheckPassFn()"
          @input="verifyIpFn()"
          @blur="verifyIpFn()">
        <div class="wan-tip" v-show="!IP.valid">{{ $t('i18n.IP_FORMAL_ERROR') }}</div>
      </div>
      <div class="input-wrapper">
        <input class="beauty-placeholder"
          type="text"
          :placeholder="subnetMask.placeholder"
          v-model="subnetMask.value"
          @change="busCheckPassFn()"
          @input="verifyNetmasksFn()"
          @blur="verifyNetmasksFn()">
        <div class="wan-tip" v-show="!subnetMask.valid">{{ $t('i18n.SUBNET_MASK_FORMAL_ERROR') }}</div>
      </div>
      <div class="input-wrapper">
        <input class="beauty-placeholder"
          type="text"
          :placeholder="gateway.placeholder"
          v-model="gateway.value"
          @change="busCheckPassFn()"
          @input="verifyGatewayFn()"
          @blur="verifyGatewayFn()">
        <div class="wan-tip" v-show="!gateway.valid">{{ $t('i18n.IP_FORMAL_ERROR') }}</div>
      </div>
      <div class="input-wrapper">
        <input class="beauty-placeholder"
          type="text"
          :placeholder="DNS1.placeholder"
          v-model="DNS1.value"
          @change="busCheckPassFn()"
          @input="verifyDNS1Fn()"
          @blur="verifyDNS1Fn()">
        <div class="wan-tip" v-show="!DNS1.valid">{{ $t('i18n.IP_FORMAL_ERROR') }}</div>
      </div>
      <div class="input-wrapper">
        <input class="beauty-placeholder"
          type="text"
          :placeholder="DNS2.placeholder"
          v-model="DNS2.value"
          @change="busCheckPassFn()"
          @input="verifyDNS2Fn()"
          @blur="verifyDNS2Fn()">
        <div class="wan-tip" v-show="!DNS2.valid">{{ $t('i18n.IP_FORMAL_ERROR') }}</div>
      </div>
    </div>
    <div class="advance-seeting">
      <p>{{ $t('i18n.ADVANCED_SETUP') }}：
        <span><div class="check" :class="{'checked': checked}" @click="clickCheckedFn()"></div></span>
      </p>
      <div class="input-wrapper pdb40" :class="{'h86': showInputH}">
        <input class="beauty-placeholder"
          type="text"
          :placeholder="MTU.placeholder"
          v-model="MTU.value"
          @change="busCheckPassFn()"
          @input="verifyMTUFn()"
          @blur="verifyMTUFn()">
        <div class="wan-tip" v-show="!MTU.valid">{{ $t('i18n.MTU_VERIFICATION_TIPS') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import CheckI from '@/common/components/check/check'
import regular from '@/common/service/regular'
export default {
  name: 'StaticIp',
  data: function() {
    return {
      IP: {
        value: '',
        placeholder: this.$t('i18n.IP_ADDRESS_UPPERCASE'),
        valid: true
      },
      subnetMask: {
        value: '',
        placeholder: this.$t('i18n.SUBNET_MASK'),
        valid: true
      },
      gateway: {
        value: '',
        placeholder: this.$t('i18n.GATEWAY'),
        valid: true
      },
      DNS1: {
        value: '',
        placeholder: 'DNS1',
        valid: true
      },
      DNS2: {
        value: '',
        placeholder: 'DNS2',
        valid: true
      },
      MTU: {
        value: '',
        placeholder: 'MTU [ 500~1480 ]',
        valid: true
      },
      showInputH: false,
      wanData: {},
      checkPass: [true, true, true, true, true, true],
      checked: false
    }
  },
  components: {
    CheckI
  },
  methods: {
    showInputHFn: function(data) {
      this.showInputH = data
    },
    verifyInputFn: function(data) {
      this.wanData = data
      this.setDefaultInfo()
    },
    setDefaultInfo() {
      if (this.wanData.bootproto === 'static') {
        this.IP.value = this.wanData.ip
        this.subnetMask.value = this.wanData.netmask
        this.gateway.value = this.wanData.gw
        this.DNS1.value = this.wanData.dns1
        this.DNS2.value = this.wanData.dns2
        this.MTU.value = this.wanData.mtu
      } else {
        this.subnetMask.value = ''
        this.gateway.value = ''
        this.DNS1.value = ''
        this.DNS2.value = ''
        this.MTU.value = ''
      }
    },
    verifyIp: function(txt) {
      return regular.verifyIp(txt)
    },
    verifyIpFn: function() {
      this.IP.valid = this.verifyIp(this.IP.value)
      this.checkPass[0] = this.IP.valid
    },
    verifyNetmasksFn: function() {
      this.subnetMask.valid = regular.verifyMask(this.subnetMask.value)
      this.checkPass[1] = this.subnetMask.valid
    },
    verifyGatewayFn: function() {
      this.gateway.valid = this.verifyIp(this.gateway.value)
      this.checkPass[2] = this.gateway.valid
    },
    verifyDNS1Fn: function() {
      this.DNS1.valid = this.verifyIp(this.DNS1.value)
      this.checkPass[3] = this.DNS1.valid
    },
    verifyDNS2Fn: function() {
      this.DNS2.valid = this.verifyIp(this.DNS2.value) || (this.DNS2.value === '')
      this.checkPass[4] = this.DNS2.valid
    },
    verifyMTUFn: function() {
      this.MTU.valid = (this.MTU.value === '') || regular.MTU(this.MTU.value)
      this.checkPass[5] = this.MTU.valid
    },
    busCheckPassFn: function() {
      this.$root.Bus.$emit('busIpAddrStatic', this.IP.value)
      this.$root.Bus.$emit('busNetmasksStatic', this.subnetMask.value)
      this.$root.Bus.$emit('busGatewayStatic', this.gateway.value)
      this.$root.Bus.$emit('busDNS1Static', this.DNS1.value)
      this.$root.Bus.$emit('busDNS2Static', this.DNS2.value)
      this.$root.Bus.$emit('busMTUStatic', this.MTU.value)
      this.$root.Bus.$emit('busStaticCheckbox', this.checked)
      this.$root.Bus.$emit('busStaticCheckPass', this.checkPass)
    },
    clickCheckedFn: function() {
      this.checked = !this.checked
      this.busCheckPassFn()
      this.showInputHFn(this.checked)
    }
  },
  created() {
    this.$root.Bus.$on('busWanData', data => {
      this.verifyInputFn(data)
      this.busCheckPassFn()
    })
  },
  beforeDestroy() {
    this.$root.Bus.$off('busWanData')
  }
}
</script>

<style lang="scss" scoped>
.static-ip {
  padding-top: 10px;
  .input-wrapper {
    position: relative;
    & > input {
      width: 480px;
      height: 46px;
      border-radius: 4px;
      outline: none;
      border: 1px solid rgba(230,230,231,1);
      background-color: #fff;
      padding: 0 20px;
    }
    & > .wan-tip {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 5%;
      color: red;
      opacity: 0.7;
    }
  }
  .input-wrapper:nth-of-type(1) {
    & > input {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
  .input-wrapper:nth-of-type(2) {
    & > input {
      border-top-color: transparent;
      border-radius: 0;
    }
  }
  .input-wrapper:nth-of-type(3) {
    & > input {
      border-top-color: transparent;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      margin-bottom: 20px;
    }
    & > .wan-tip {
      transform: translateY(-100%);
    }
  }
  .input-wrapper:nth-of-type(4) {
    & > input {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
  .input-wrapper:nth-of-type(5) {
    & > input {
      border-top-color: transparent;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }
  .advance-seeting {
    // padding-bottom: 40px;
    padding-top: 20px;
    & > p {
      line-height: 26px;
      margin-bottom: 20px;
    }
    span {
      display: inline-block;
      position: relative;
      top: 8px;
    }
    & > input {
      height: 0px;
      padding: 0 20px;
      margin-bottom: 0px;
      border-width: 0;
      overflow: hidden;
      transition: height 0.3s, margin-bottom 0.3s;
    }
    & > .input-h {
      height: 46px;
      margin-bottom: 40px;
      border-width: 1px;
    }
    .check {
      width: 26px;
      height: 26px;
      border: 2px solid #009FE8;
      border-radius: 6px;
      cursor: pointer;
      &.checked {
        border: none;
        background: url('../../../../../assets/images/icon/icon_check_hover1.png');
        background-size: 100%;
      }
    }
  }
  .pdb40 {
    height: 0px;
    overflow: hidden;
    transition: height 0.3s;
    & > .wan-tip {
      transform: translateY(-150%);
    }
  }
  .pdb40.h86 {
    height: 86px;
    transition: height 0.3s;
  }
}
</style>
