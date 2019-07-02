<template>
  <div class="index-host-device" ref="HostDevice">
    <div class="host-device-title">
      {{ $t('i18n.HOST_DEVICE') }}（{{ deviceNum }}）
      <button :disabled="isDisabled" class="refresh" :class="{'refreshing': waitting}" @click="rereshDevList($event)">
      </button>
    </div>
    <div class="list-wrapper">
      <ul class="host-device-lists" id="host-device-lists" v-if="!waitting && !faild" :class="{'overflow-auto': isMac}">
        <div>
          <button class="device-list" v-for="(item, index) in deviceList" :key="index" @click="speedDevice(item, $event)" @keyup.enter="speedDevice(item, $event)" :disabled="isDisabled" :class="{'type-pc': item.dt === 1 || (item.dt !== 2 && item.dt !== 3 && item.dt !== 4 && item.dt !== 5),
                    'type-phone': item.dt === 2,
                    'type-ps': item.dt === 3,
                    'type-xbox': item.dt === 4,
                    'type-ns': item.dt === 5}">
            <div class="selected-bg" :class="{'selected': nowKey.indexOf(item.mac) >= 0  ? true : false}"></div>
            <div class="bottom-bg" :class="{'selected': nowKey.indexOf(item.mac) >= 0 ? true : false}"></div>
            <i :class="{'i-heightlight': nowKey.indexOf(item.mac) >= 0 ? true : false}"></i>
            <span class="device-list-name">
              {{ item.name }}<span v-if="parseInt(item.self) === 1">&nbsp;&nbsp;({{ $t('i18n.MY_HOST_DEVICE') }})</span>
            </span>
            <span class="dev-ip-info">IP：{{ item.ip }}<span class="net-type" :class="{'ct-wifi': parseInt(item.ct) === 2, 'ct-wired': parseInt(item.ct) === 1}"></span></span>
            <!-- <em>{{ nowKey.indexOf(item.mac) >= 0 ? speedingText : notSpeedText }}</em> -->
            <em class="cancle-btn" :class="{'speed-btn': nowKey.indexOf(item.mac) >= 0}">
              <em></em>
            </em>
          </button>
        </div>
      </ul>
      <div v-if="faild" class="get-list-faild">
        <span>{{ $t('i18n.GET_DEV_LIST_FAILD') }}</span>
      </div>
      <div class="wait-list" v-if="waitting">
        <loading class="refresh-loading"></loading>
        <p class="wait-text">{{ $t('i18n.GETTING_DEV_LIST') }}</p>
      </div>
    </div>
    <div :class="{'cover': isShowCover}"></div>
  </div>
</template>

<script>
import { devListGet, devTunSet } from '@/api/speed-manage-api'

import Loading from '../../../../../common/components/loading/loading'
import utils from '@/common/service/utils'

export default {
  name: 'IndexHostDevice',
  data: function() {
    return {
      deviceNum: 0,
      deviceList: [],
      waitting: false,
      faild: false,
      speeding: false,
      nowKey: [],
      isShowCover: false,
      isDisabled: false,
      notSpeedText: this.$t('i18n.CLICK_TO_SPEED_DEV'),
      speedingText: this.$t('i18n.ACCELERATION_CHANNEL_OPENING'),
      isIE: false,
      intervalTime: null,
      bar: null,
      isCloseHostDevice: false, // 当加速设备数大于两台时，是否停止已加速的第一台设备
      isMac: false // 判断系统为mac系统
    }
  },
  components: {
    Loading
  },
  methods: {
    clickHostDevice: function(key) {
      // this.nowKey = key // 选中被点击的主机设备
      const index = this.nowKey.indexOf(key)
      // alert(index)

      if (index >= 0) {
        this.nowKey.splice(index, 1)
      } else {
        if (this.nowKey.length <= 1) {
          this.nowKey.push(key)
        } else {
          this.nowKey.shift()
          this.nowKey.push(key)
        }
      }
    },
    rereshDevList(e) {
      e.target.blur()
      if (!this.waitting) {
        this.bar = null
        this.apiDevListGetFn(0)
      }
    },
    speedDevice(item, event) {
      event.target.blur()
      if (this.nowKey.length >= 2) {
        if (this.nowKey.indexOf(item.mac) < 0) {
          this.isCloseHostDevice = confirm(`${this.$t('i18n.CLOSE_HOST_DEVICE')}`)
        } else {
          this.isCloseHostDevice = true
        }
      }
      const data = {
        enable: Number.parseInt(item.wl) === 1 ? 0 : 1,
        mac: item.mac,
        bow: 'white'
      }
      if (this.speeding) {
        // 防止用户在没用得到响应就点击，防止连点
        return false
      }
      if (this.isCloseHostDevice) {
        this.speeding = true
      }
      if (this.nowKey.length < 2) {
        // 未达到两台设备加速
        devTunSet(data)
          .then(res => {
            this.speeding = false
            // this.clickHostDevice(item.mac)
            this.bar = null // 将自定义滚动条清空
            this.apiDevListGetFn(0)
          })
          .catch(e => {
            this.speeding = false
          })
      } else if (this.nowKey.length >= 2 && this.isCloseHostDevice) {
        // 结束第一台设备的加速
        devTunSet(data)
          .then(res => {
            this.speeding = false
            // this.clickHostDevice(item.mac)
            this.bar = null // 将自定义滚动条清空
            this.apiDevListGetFn(0)
          })
          .catch(e => {
            this.speeding = false
          })
      }
    },
    getDeviceList(data) {
      let sys = utils.checkSysTyle()
      this.isMac = false
      if (sys.mac) {
        this.isMac = true
      } else {
        this.isMac = false
      }
      this.createBar()
    },
    createBar() {
      // 产生滚动条
      if (this.bar) {
        this.$nextTick(() => {
          this.bar.update()
        })
      } else {
        this.$nextTick(() => {
          this.bar = new this.$geminiScrollbar({
            element: document.getElementById('host-device-lists')
          }).create()
        })
      }
    },
    apiDevListGetFn: function(refresh, autoRfresh = false) {
      if (!autoRfresh) {
        this.waitting = true
      }
      // 调用dev_list_get接口
      let apiData = {
        refresh: refresh
      }
      devListGet(apiData)
        .then(data => {
          if (!autoRfresh) {
            this.waitting = false
          }
          this.faild = false
          // 更新当前设备
          this.deviceList = data.dev_list
          this.nowKey = []
          data.dev_list.forEach((val, key) => {
            if (Number.parseInt(val.wl) === 1) {
              if (this.nowKey.indexOf(val.mac) < 0) {
                this.nowKey.push(val.mac)
              }
            }
          })

          this.deviceNum = data.dev_list.length
          // 更新当前设备数
          // 将当前设备数更新到视图
          this.getDeviceList()
        })
        .catch(e => {
          this.faild = true
          this.waitting = false
        })
    },
    autoRefrehDevList() {
      // 自动刷新获取设备列表
      this.apiDevListGetFn(0, true)
      this.intervalTime = window.setInterval(() => {
        this.apiDevListGetFn(0, true)
      }, 12300)
    },
    getRouteFn: function() {
      const pathStr = this.$route.path
      if (pathStr === '/') {
        // 不禁止button的focus效果
        this.isDisabled = false
        clearInterval(this.intervalTime)
        this.autoRefrehDevList()
      } else {
        // 禁止button的focus效果
        this.isDisabled = true
        clearInterval(this.intervalTime)
      }
    },
    checkIsIEFn: function() {
      let h = this.$refs.HostDevice.clientHeight
      // 解决在ie内核的浏览器下高度显示的一个兼容性问题
      if (this.isIE) {
        this.$refs.HostDevice.style.height = `${h - 3}px`
      }
    }
  },
  created() {
    const pathStr = this.$route.path
    if (pathStr === '/') {
      this.apiDevListGetFn(0)
    }
    this.$root.Bus.$on('busShowCover', data => {
      this.isShowCover = data
    })
    // 判断是否为ie内核
    this.isIE = utils.bowserIE()
    this.$root.Bus.$on('clearDevListAutoRefresh', () => {
      window.clearInterval(this.intervalTime)
    })
  },
  mounted() {
    this.checkIsIEFn()
    const pathStr = this.$route.path
    if (pathStr === '/') {
      clearInterval(this.intervalTime)
      this.autoRefrehDevList()
    }
    let sys = utils.checkSysTyle()
    this.isMac = false
    if (sys.mac) {
      this.isMac = true
    } else {
      this.isMac = false
    }
  },
  watch: {
    $route: 'getRouteFn'
  },
  beforeDestroy() {
    this.$root.Bus.$off('busShowCover')
    this.$root.Bus.$off('clearDevListAutoRefresh')
    clearInterval(this.intervalTime)
  }
}
</script>

<style lang="scss" scoped>
@mixin a-focus {
  border: 3px solid #05a2ea;
  box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.5);
  border-radius: 5px;
  background-color: #fff;
  // transition: box-shadow 0.5s, border 0.5s;
}
@mixin type-pc {
  background: url(../../../../../assets/images/icon/icon_PC_hover.png) no-repeat;
  background-size: 100% 100%;
}
@mixin type-phone {
  background: url(../../../../../assets/images/icon/icon_Phone_hover.png)
    no-repeat;
  background-size: 100% 100%;
}
@mixin type-phone {
  background: url(../../../../../assets/images/icon/icon_Phone_hover.png)
    no-repeat;
  background-size: 100% 100%;
}
@mixin type-ps {
  background: url(../../../../../assets/images/icon/icon_PS4_hover.png)
    no-repeat;
  background-size: 100% 100%;
}
@mixin type-xbox {
  background: url(../../../../../assets/images/icon/icon_XBOX_hover.png)
    no-repeat;
  background-size: 100% 100%;
}
@mixin type-ns {
  background: url(../../../../../assets/images/icon/icon_NS_hover.png) no-repeat;
  background-size: 100% 100%;
}
.index-host-device {
  width: 100%;
  height: 308px;
  background-color: #fff;
  border-radius: 6px;
  margin-bottom: 20px;
  box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.06);
  position: relative;
  .host-device-title {
    display: flex;
    align-items: center;
    height: 50px;
    font-size: 16px;
    color: #3a3848;
    letter-spacing: 0px;
    line-height: 50px;
    padding: 0 25px;
    justify-content: space-between;
    border-radius: 6px 6px 0px 0px;
    .refresh {
      display: inline-block;
      height: 27px;
      width: 27px;
      background-image: url('../../../../../assets/images/icon/icon_refresh_normal.png');
      background-size: 100%;
      background-repeat: no-repeat;
      cursor: pointer;
      &:hover,
      &:focus {
        background-image: url('../../../../../assets/images/icon/icon_refresh_hover.png');
      }
      &.refreshing {
        background-image: url('../../../../../assets/images/icon/icon_refresh_hover.png');
        animation: identifier 1s linear;
        animation-iteration-count: infinite;
        @keyframes identifier {
          0% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(180deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      }
    }
  }
  .list-wrapper {
    height: 250px;
    width: 100%;
    .host-device-lists {
      height: 250px;
      overflow: hidden;
      &.overflow-auto {
        overflow: auto;
      }
      background: linear-gradient(
        180deg,
        rgba(240, 243, 247, 1),
        rgba(255, 255, 255, 1)
      );
      border-radius: 0px 0px 6px 6px;
    }
    .get-list-faild {
      text-align: center;
      padding-top: 24px;
      color: #8c8b8e;
    }
    .wait-list {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .refresh-loading {
        margin: 0 auto;
        margin-bottom: 24px;
      }
      .wait-text {
        text-align: center;
      }
    }
  }
  .device-list {
    width: 100%;
    height: 76px;
    line-height: 76px;
    padding: 0 25px;
    text-align: left;
    box-sizing: border-box;
    cursor: pointer;
    border: 3px solid transparent;
    border-bottom: none;
    border-top: none;
    border-radius: 5px;
    line-height: 70px;
    // transition: box-shadow 0.5s, border 0.2s;
    position: relative;
    color: rgba(58, 56, 72, 1);
    & > .device-list-name {
      position: relative;
      top: -10px;
      font-size: 14px;
      color: rgba(58, 56, 72, 1);
      height: 20px;
      line-height: 16px;
    }
    & > .dev-ip-info {
      position: absolute;
      top: 0px;
      left: 54px;
      font-size: 12px;
      color:rgba(117,115,139,1);
      line-height: 17px;
      height: 17px;
      margin-top: 42px;
      & > .net-type {
        display: inline-block;
        width: 16px;
        height: 16px;
        position: relative;
        left: 5px;
        top: 4px;
        &.ct-wifi {
          background: url(../../../../../assets/images/icon/icon_wifi.png) no-repeat;
          background-size: cover;
        }
        &.ct-wired {
          background: url(../../../../../assets/images/icon/icon_wired.png) no-repeat;
          background-size: cover;
        }
      }
    }
    & > .selected-bg {
      position: absolute;
      left: 0;
      top: 0;
      right: 100%;
      bottom: 1px;
      background: linear-gradient(
        -90deg,
        rgba(0, 159, 232, 0),
        rgba(0, 159, 232, 1)
      );
      opacity: 0.05;
      transition: right 0.3s;
    }
    & > .bottom-bg {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 1px;
      background: linear-gradient(
        -90deg,
        rgba(0, 159, 232, 0),
        rgba(0, 159, 232, 1)
      );
      transition: width 0.3s;
    }
    & > .selected {
      left: -3px;
      right: 0;
      width: 100%;
      transition: right 0.3s, width 0.3s;
    }
    & > i {
      width: 24px;
      height: 24px;
      display: inline-block;
      background-color: #fff;
      position: relative;
      top: 7px;
    }
    &.type-pc {
      i {
        background: url(../../../../../assets/images/icon/icon_PC_normal.png)
          no-repeat;
        background-size: 100% 100%;
      }
      .i-heightlight {
        @include type-pc;
      }
      &:hover > i {
        @include type-pc;
      }
      &:focus > i {
        @include type-pc;
      }
    }
    &.type-phone {
      i {
        background: url(../../../../../assets/images/icon/icon_Phone_normal.png)
          no-repeat;
        background-size: 100% 100%;
      }
      .i-heightlight {
        @include type-phone;
      }
      &:hover > i {
        @include type-phone;
      }
      &:focus > i {
        @include type-phone;
      }
    }
    &.type-ps {
      i {
        background: url(../../../../../assets/images/icon/icon_PS4_normal.png)
          no-repeat;
        background-size: 100% 100%;
      }
      .i-heightlight {
        @include type-ps;
      }
      &:hover > i {
        @include type-ps;
      }
      &:focus > i {
        @include type-ps;
      }
    }
    &.type-xbox {
      i {
        background: url(../../../../../assets/images/icon/icon_XBOX_normal.png)
          no-repeat;
        background-size: 100% 100%;
      }
      .i-heightlight {
        @include type-xbox;
      }
      &:hover > i {
        @include type-xbox;
      }
      &:focus > i {
        @include type-xbox;
      }
    }
    &.type-ns {
      i {
        background: url(../../../../../assets/images/icon/icon_NS_normal.png)
          no-repeat;
        background-size: 100% 100%;
      }
      .i-heightlight {
        @include type-ns;
      }
      &:hover > i {
        @include type-ns;
      }
      &:focus > i {
        @include type-ns;
      }
    }
    & > span {
      margin-left: 19px;
    }
    &:hover {
      @include a-focus;
      .dev-ip-info {
        top: -3px;
      }
    }
    &:focus {
      @include a-focus;
      .dev-ip-info {
        top: -3px;
      }
    }
    & > em {
      // color: rgba(112, 117, 144, 1);
      float: right;
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      width: 64px;
      height: 34px;
      border-radius: 18px;
      // font-size: 14px;
      &.cancle-btn {
        background:rgba(131,137,161,1);
        & > em {
          position: absolute;
          width: 30px;
          height: 30px;
          border-radius: 30px;
          background-color: #fff;
          top: 50%;
          transform: translateY(-50%);
          left: 2px;
          transition: left .3s;
        }
      }
      &.cancle-btn.speed-btn {
        background:rgba(0,159,232,1);
        & > em {
          position: absolute;
          width: 30px;
          height: 30px;
          border-radius: 30px;
          background-color: #fff;
          top: 50%;
          transform: translateY(-50%);
          left: 32px;
          transition: left .3s;
        }
      }
    }
  }
  & > .cover {
    position: absolute;
    // border: 1px solid red;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border-radius: 6px;
    z-index: 99;
  }
}
@media screen and (max-width: 1366px) {
  .index-host-device {
    height: 240px;
    .list-wrapper {
      height: 180px;
      .host-device-lists {
        height: 180px;
      }
    }
  }
}
</style>
