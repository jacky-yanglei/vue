<template>
  <div class="wifi-switch">
    {{ $t('i18n.WIFI_SWITCH') }}：
    <div class="switch" @click="clickWifiSwitch(closeSwitch)">
      <em>{{ switchTxt }}</em>
      <button :class="{'close-switch': !closeSwitch}"><i></i></button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WifiSwitch',
  data: function() {
    return {
      switchTxt: this.$t('i18n.OPEN'),
      closeSwitch: true
    }
  },
  methods: {
    clickWifiSwitch: function(close) {
      if (close) {
        this.closeSwitch = false
        this.switchTxt = this.$t('i18n.CLOSE')
      } else {
        this.closeSwitch = true
        this.switchTxt = this.$t('i18n.OPEN')
      }
      this.busData(this.closeSwitch)
    },
    busData: function(data) {
      this.$root.Bus.$emit('busToggleHeight', data)
      this.$emit('busTransform', data)
    },
    toggleCloseStatusFn: function(data) {
      let t = parseInt(data)
      if (t === 1) {
        this.closeSwitch = true
      } else if (t === 0) {
        this.closeSwitch = false
      }
    }
  },
  created() {
    this.$root.Bus.$on('busCheckCloseStatus', data => {
      this.toggleCloseStatusFn(data)
    })
  },
  beforeDestroy() {
    this.$root.Bus.$off('busCheckCloseStatus')
  }
}
</script>

<style lang="scss" scoped>
.wifi-switch {
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  color: #3A3848;
  padding: 0 10px;
  & > .switch {
    float: right;
    em {
      position: relative;
      top: -6px;
      margin-right: 15px;
    }
    button {
      display: inline-block;
      width: 70px;
      height: 34px;
      border: 3px solid rgba(0, 159, 232, 1);
      background-color: rgba(0, 159, 232, 1);
      border-radius: 16px;
      padding-left: 4px;
      padding-right: 4px;
      transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
      i {
        display: inline-block;
        width: 26px;
        height: 26px;
        background-color: rgba(255, 255, 255, 1);
        border-radius: 24px;
        position: relative;
        top: 1px;
        // left 的变化范围是0-28
        left: -18px;
        transform: translateX(35px);
        transition: background-color 0.3s, transform 0.3s;
      }
      &:hover, &:focus {
        border-color: #fff;
        background:rgba(0,159,232,1);
        box-shadow: 0px 6px 20px 0px rgba(0,159,232,0.5);
      }
    }
    .close-switch {
      background-color: #fff;
      border-color: rgba(131, 137, 161, 1);
      i {
        transform: translateX(0px);
        background-color: rgba(131, 137, 161, 1);
      }
      &:hover, &:focus {
        border-color: rgba(0, 159, 232, 1);
        background-color: transparent;
        i {
          background-color: rgba(0, 159, 232, 1);
          box-shadow: 0px 6px 20px 0px rgba(0,159,232,0.5);
        }
      }
    }
  }
}
</style>
