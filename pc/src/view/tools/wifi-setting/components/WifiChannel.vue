<template>
  <div class="wifi-channel" :class="{'h0': isH0}">
    <h4>{{ $t('i18n.CHANNEL') }}：</h4>
    <button class="select-channel" @click="clickOpenChannelLists()" :disabled="isHide">
      {{ channelTxt }}
      <i :class="{'i-open': isOpen}"></i>
    </button>
    <wifi-channel-lists @busChangeChannel="changeChannel" openLists="isOpen"></wifi-channel-lists>
  </div>
</template>

<script>
import WifiChannelLists from './WifiChannelLists'
export default {
  name: 'WifiChannel',
  data: function() {
    return {
      isH0: false,
      isOpen: false,
      channelTxt: `${this.$t('i18n.AUTO')}`,
      isHide: false
    }
  },
  components: {
    WifiChannelLists
  },
  methods: {
    toggleHeight: function(data) {
      this.isH0 = !data
      this.isHide = !data
    },
    clickOpenChannelLists: function() {
      // 决定channellists是否隐藏
      this.isOpen = !this.isOpen
      this.isOpenChannelLists(this.isOpen)
    },
    changeChannel: function(data, isOpen) {
      if (parseInt(data) === 0) {
        this.channelTxt = `${this.$t('i18n.AUTO')}`
      } else {
        this.channelTxt = data // 获取子组件wifichannellists的数据，改变channel值
      }
      // 用户点击wifichannellists组件的情况
      this.$emit('busGetChannel', data)
      this.isOpen = isOpen // 将父组件this.isOpen的状态与子组件同步
    },
    isOpenChannelLists: function(data) {
      this.$root.Bus.$emit('busIsOpen', data)
    },
    dataIsFalse: function(data) {
      // 判断来自wifiswitch的组件数据如果为false,则子组件wifichannellists的高度就应该为0
      this.isOpenChannelLists(data)
      // 将this.isOpen = false
      this.isOpen = false
    }
  },
  created() {
    this.$root.Bus.$on('busToggleHeight', data => {
      // 根据wifiswitch传递的数据决定该组件高度是否隐藏
      this.toggleHeight(data)
      if (!data) {
        // 如果wifiswitch传递的数据为false
        this.dataIsFalse(data)
      }
    })
    this.$root.Bus.$on('busChannelInfo', (data, close) => {
      this.$emit('busGetChannel', data)
      this.channelTxt = data
      if (parseInt(close) === 0) {
        this.isH0 = true
        this.isHide = true
      } else if (parseInt(close) === 1) {
        this.isH0 = false
        this.isHide = false
      }
    })
  },
  mounted() {
    // 该组件刚挂载完成时，触发一次，解决用户不点击wifichannellists组件的情况
    this.$emit('busGetChannel', this.channelTxt)
  },
  beforeDestroy() {
    this.$root.Bus.$off('busChannelInfo')
    this.$root.Bus.$off('busToggleHeight')
  }
}
</script>

<style lang="scss" scoped>
.wifi-channel {
  margin-top: 30px;
  height: 82px;
  transition: height 0.3s, margin-top 0.3s;
  position: relative;
  z-index: 9;
  & > h4 {
    padding: 0 10px;
    font-size: 14px;
    color: rgba(131, 137, 161, 1);
    line-height: 20px;
    margin-bottom: 10px;
    overflow: hidden;
  }
  & > .select-channel {
    width: 480px;
    height: 52px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    line-height: 52px;
    padding: 0 20px;
    color: rgba(58, 56, 72, 1);
    font-size: 16px;
    border: 1px solid #E6E6E7;
    overflow: hidden;
    transition: border .3s;
    text-align: left;
    &:hover, &:focus {
      border: 1px solid #009fe8;
      line-height: 52px;
      padding: 0 20px;
    }
    & > i {
      float: right;
      width: 0px;
      height: 0px;
      border: 6px solid transparent;
      border-top: 8px solid rgba(131, 137, 161, 1);
      border-bottom-color: transparent;
      margin-top: 23px;
      transition: border-top-color 0.5s;
    }
    .i-open {
      border-top-color: transparent;
      border-bottom: 8px solid rgba(131, 137, 161, 1);
      margin-top: 15px;
      transition: border-bottom-color 0.5s;
    }
  }
}
.h0 {
  height: 0;
  margin-top: 0;
  & > h4 {
    font-size: 0;
  }
  & > .select-channel {
    height: 0;
    border-color: #fafbfc;
  }
}
</style>
