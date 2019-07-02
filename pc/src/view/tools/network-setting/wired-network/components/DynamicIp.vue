<template>
  <div class="dynamic-ip">
    <p :class="{'show-p': isShowP}">{{ $t('i18n.IP_ADDRESS_UPPERCASE') }}：{{ wanIp }}</p>
    <div class="advanced-setting">
      <p>{{ $t('i18n.ADVANCED_SETUP') }}：
        <span><div class="check" :class="{'checked': checked}" @click="clickCheckedFn()"></div></span>
      </p>
      <div class="input" :class="{'input-h': showInputH}">
        <div class="input-wrapper">
          <input class="beauty-placeholder"
          type="text"
          :placeholder="'DNS1'"
          v-model="DNS1.value"
          @change="busCheckPassFn()"
          @input="verifyDNS1Fn()">
          <div class="wan-tip" v-show="!DNS1.valid">{{ $t('i18n.IP_FORMAL_ERROR') }}</div>
        </div>
        <div class="input-wrapper">
          <input class="beauty-placeholder"
          type="text"
          :placeholder="'DNS2'"
          v-model="DNS2.value"
          @change="busCheckPassFn()"
          @input="verifyDNS2Fn()">
          <div class="wan-tip" v-show="!DNS2.valid">{{ $t('i18n.IP_FORMAL_ERROR') }}</div>
        </div>
        <div class="input-wrapper">
          <input class="beauty-placeholder"
          type="text"
          :placeholder="'MTU [ 500~1480 ]'"
          v-model="MTU.value"
          @change="busCheckPassFn()"
          @input="verifyMTUFn()">
          <div class="wan-tip" v-show="!MTU.valid">{{ $t('i18n.MTU_VERIFICATION_TIPS') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CheckI from '@/common/components/check/check'
import regular from '@/common/service/regular'
export default {
  name: 'DunamicIp',
  data: function() {
    return {
      showInputH: false,
      DNS1: {
        value: '',
        valid: true
      },
      DNS2: {
        value: '',
        valid: true
      },
      MTU: {
        value: '',
        valid: true
      },
      wanData: {},
      wanIp: '',
      checkPass: [true, true, true],
      checked: false,
      isShowP: false
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
      if (this.wanData.bootproto === 'dhcp') {
        this.isShowP = true
        this.wanIp = this.wanData.ip
        this.DNS1.value = this.wanData.dns1
        this.DNS2.value = this.wanData.dns2
        this.MTU.value = this.wanData.mtu
      } else {
        this.isShowP = false
        this.wanIp = ''
        this.DNS1.value = ''
        this.DNS2.value = ''
        this.MTU.value = ''
      }
    },
    verifyDNSFn: function(txt) {
      return (regular.verifyIp(txt)) || (txt === '')
    },
    verifyDNS1Fn: function() {
      this.DNS1.valid = this.verifyDNSFn(this.DNS1.value)
      this.checkPass[0] = this.DNS1.valid
    },
    verifyDNS2Fn: function(txt) {
      this.DNS2.valid = this.verifyDNSFn(this.DNS2.value)
      this.checkPass[1] = this.DNS2.valid
    },
    verifyMTUFn: function() {
      this.MTU.valid = (this.MTU.value === '') || regular.MTU(this.MTU.value)
      this.checkPass[2] = this.MTU.valid
    },
    busCheckPassFn: function() {
      this.$root.Bus.$emit('busDNS1Dynamic', this.DNS1.value)
      this.$root.Bus.$emit('busDNS2Dynamic', this.DNS2.value)
      this.$root.Bus.$emit('busMTUDynamic', this.MTU.value)
      this.$root.Bus.$emit('busDynamicCheckPass', this.checkPass)
      this.$root.Bus.$emit('busDynamicCheckbox', this.checked)
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
.dynamic-ip {
  & > p {
    font-size:14px;
    color:rgba(131,137,161,1);
    text-align: center;
    padding-bottom: 30px;
    display: none;
    &.show-p {
      display: block;
    }
  }
  & > .advanced-setting {
    & > p {
      font-size: 14px;
      color: rgba(58, 56, 72, 1);
      line-height: 26px;
      margin-bottom: 20px;
      & > span {
        display: inline-block;
        width: 26px;
        height: 26px;
        position: relative;
        top: 8px;
        left:5px;
      }
    }
    & > .input {
      height: 0;
      overflow: hidden;
      transition: height 0.5s;
      .beauty-placeholder {
        &:-moz-placeholder {
          color: #B3B3B3;
        }
        &:-ms-input-placeholder {
          color: #B3B3B3;
        }
        &::-webkit-input-placeholder {
          color: #B3B3B3;
        }
      }
      .input-wrapper {
        position: relative;
        & > input {
          width: 480px;
          height: 46px;
          border-radius: 4px;
          outline: none;
          border: 1px solid rgba(230,230,231,1);
          background-color: #fff;
          padding: 20px;
        }
        & > .wan-tip {
          position: absolute;
          top: 50%;
          right: 5%;
          transform: translateY(-50%);
          font-size: 14px;
          color: red;
          opacity: 0.7;
        }
      }
      .input-wrapper:nth-of-type(1) {
        & > input {
          border-radius: 4px 4px 0 0;
        }
      }
      .input-wrapper:nth-of-type(2) {
        & > input {
          border-radius: 0 0 4px 4px;
          border-top-color: transparent;
        }
      }
      .input-wrapper:nth-of-type(3) {
        & > input {
          margin-top: 20px;
          margin-bottom: 40px;
        }
        & > .wan-tip {
          transform: translateY(-100%);
        }
      }
    }
    & > .input.input-h {
      height: 198px;
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
}
</style>
