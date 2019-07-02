<template>
<div class="channel-lists-div" :class="{'h190': isH190}">
  <ul ref="wifiChannelLists" class="wifi-channel-lists" id="wifi-channel-lists" :class="{'overflow-auto': isMac}">
    <li class="channel-list"
      v-for="(item, key) in channelLists"
      :key="key"
      @click="changeChannel(item.index, key)">
        {{item.index}}
    </li>
  </ul>
</div>
</template>

<script>
import utils from '@/common/service/utils'
export default {
  name: 'WifiChannelLists',
  data: function() {
    return {
      channelLists: [
        { index: this.$t('i18n.AUTO') },
        { index: 1 },
        { index: 2 },
        { index: 3 },
        { index: 4 },
        { index: 5 },
        { index: 6 },
        { index: 7 },
        { index: 8 },
        { index: 9 },
        { index: 10 },
        { index: 11 }
      ],
      isH190: false,
      nowKey: 0,
      isMac: false
    }
  },
  methods: {
    changeChannel: function(index, key) {
      this.isH190 = false // height=0
      if (index === `${this.$t('i18n.AUTO')}`) {
        index = 0
      }
      this.$emit('busChangeChannel', index, this.isH190) // 向父级传递数据，改变channel
      // 改变this.nowKey
      this.nowKey = key
    },
    toggleChannelLists: function(data) {
      // 由组件wifichannel控制lists是否打开
      this.isH190 = data
      // 渲染出滚动条
      if (this.bar) {
        this.bar.update()
      } else {
        this.createBar()
      }
    },
    createBar() {
      const ele = this.$refs.wifiChannelLists
      this.$nextTick(() => {
        this.bar = new this.$geminiScrollbar({
          element: ele
        }).create()
      })
    }
  },
  created() {
    this.$root.Bus.$on('busIsOpen', data => {
      this.toggleChannelLists(data)
    })
    let sys = utils.checkSysTyle()
    this.isMac = false
    if (sys.mac) {
      this.isMac = true
    } else {
      this.isMac = false
    }
  },
  mounted() {
    this.toggleChannelLists()
  },
  beforeDestroy() {
    this.$root.Bus.$off('busIsOpen')
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../common/sass/_constant.scss';
@import '../../../../common/sass/_mixin.scss';
.channel-lists-div {
  position: relative;
  height: 0;
  overflow: hidden;
  transition: height .3s;
  margin-top: 5px;
}
.wifi-channel-lists {
  position: absolute;
  width: 100%;
  height: 190px;
  background-color: #fff;
  // margin-top: 5px;
  border-color: transparent;
  border-radius: 2px;
  // overflow: auto;
  overflow: hidden;
  &.overflow-auto {
    overflow: auto;
  }
  transition: height 0.3s;
  .channel-list {
    width: 99%;
    height: 40px;
    background-color: transparent;
    margin-bottom: 5px;
    line-height: 40px;
    padding-left: 20px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
    border: 2px solid transparent;
    color: rgba(58, 56, 72, 1);
    &:focus, &:hover {
      background-color: #fff;
      z-index: 5;
      border-color: rgba(0, 159, 232, 1);
      box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.5);
    }
  }
}
.channel-lists-div.h190 {
  height: 190px;
  border: 1px solid #f2f5f8;
  transition: height .3s;
}
</style>
