<template>
  <div class="wifi-name" :class="{'h0': isH0}" v-if="isHide">
    <h4>{{ $t('i18n.WIFI_NAME') }}：</h4>
    <div class="write-name" :class="{'box-shadow': addClassBoxShadow}">
      <input type="text"
      v-model="wifiName"
      :class="{'error': exp}"
      @focus="focusWifiNameFn()"
      @blur="blurWifiNameFn(), getWifiName()"
      @input="getWifiName()"/>
      <div class="input-error" v-show="exp">{{ errorTip }}</div>
    </div>
  </div>
</template>

<script>
import regular from '@/common/service/regular'
export default {
  name: 'WifiName',
  data: function() {
    return {
      isH0: false,
      wifiName: '',
      exp: false,
      addClassBoxShadow: false,
      isHide: true,
      errorTip: this.$t('i18n.WIFI_NAME_ERROR')
    }
  },
  methods: {
    toggleWifiName: function(data) {
      if (!data) {
        this.isH0 = !data
        setTimeout(() => {
          this.isHide = data
        }, 100)
      } else {
        this.isHide = data
        this.isH0 = !data
      }
    },
    getWifiName: function() {
      // 在表单每次失去焦点时，获取相应的值并传递
      let exp = regular.verifyWifiName(this.wifiName)
      if (exp) {
        this.exp = false
        this.$emit('busGetName', this.wifiName, true)
      } else {
        this.exp = true
        this.$emit('busGetName', this.wifiName, false)
      }
    },
    focusWifiNameFn: function() {
      // this.exp = true
      this.addClassBoxShadow = true
    },
    blurWifiNameFn: function() {
      this.addClassBoxShadow = false
    }
  },
  created() {
    this.$root.Bus.$on('busToggleHeight', data => {
      this.toggleWifiName(data)
    })
    this.$root.Bus.$on('busShowWarnTip', data => {
      this.exp = !data
    })
    this.$root.Bus.$on('busWifiname', (data, close) => {
      this.wifiName = data
      this.getWifiName()
      if (parseInt(close) === 0) {
        this.isH0 = true
      } else if (parseInt(close) === 1) {
        this.isH0 = false
      }
    })
  },
  mounted() {
    // 该组件刚挂载完成时，触发一次，解决用户不点击wifichannellists组件的情况
    this.$emit('busGetName', this.wifiName)
  },
  beforeDestroy() {
    this.$root.Bus.$off('busToggleHeight')
    this.$root.Bus.$off('busShowWarnTip')
    this.$root.Bus.$off('busWifiname')
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../common/sass/_mixin.scss';
.wifi-name {
  margin-top: 30px;
  height: 82px;
  overflow: hidden;
  transition: height 0.3s, margin-top 0.3s;
  z-index: 8;
  & > h4 {
    padding: 0 10px;
    font-size: 14px;
    color: rgba(131, 137, 161, 1);
    line-height: 20px;
    margin-bottom: 10px;
  }
  & > .write-name {
    position: relative;
    width: 100%;
    height: 52px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    line-height: 50px;
    color: rgba(58, 56, 72, 1);
    font-size: 16px;
    @include inputWarnTip;
    & > input {
      border-color: #E6E6E7;
      &.error {
        padding-right: 200px;
      }
    }
  }
  & > .box-shadow {
    box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.5);
  }
}
.h0 {
  height: 0;
  margin-top: 0;
}
</style>
