<template>
  <div class="search-wifi" :class="{'w0': showWifiLists}">
    <div class="close-update" :class="{'opacity': showWifiLists}">
      <button @click="clickShowWifiListsFn()" :disabled="!loadWifiList">
        <i class="i-bg1"></i>
      </button>
      <button @click="clickUpdateBtnFn()" :disabled="!loadWifiList">
        <i class="i-bg2" ref="updateBtn" :class="{'i-animate-bg2': addClassUpdateBg}"></i>
      </button>
    </div>
    <div class="search-wifi-title"><span>附近的无线网络</span></div>
    <div class="wifi-lists-wrapper">
      <div class="wifi-lists-title">
        <span class="wifi-list-name">名称</span>
        <span class="wifi-list-signal">信号</span>
      </div>
      <ul class="wifi-lists" ref="wifiLists">
        <button class="wifi-list"
        v-for="(item,key) in wifiListsInfo"
        v-show="!isLoading"
        :key="key"
        :class="{'wifi-selected': addClassWifiSelected === key ? true : false}"
        @click="wifiSelectedFn(key, item)"
        :disabled="!loadWifiList">
          <span class="wifi-list-name">{{ item.ssid }}</span>
          <span class="wifi-list-signal">{{ item.signal }}</span>
        </button>
        <div class="loading-wrapper" v-show="isLoading">
          <loading class="wifi-loading"></loading>
          <p class="text">获取WiFi列表中...</p>
        </div>
        <div class="loading-wrapper" v-show="!isLoading && isErrTip">
          <!-- <loading class="wifi-loading"></loading> -->
          <p class="text err-tip-p">{{ txtErrTip }}...</p>
        </div>
      </ul>
    </div>
    <fade-tips :msg="tip.msg" :type="tip.type" :show="tip.show" @hide="tip.show = false"></fade-tips>
  </div>
</template>

<script>
import { netRepeaterScan } from '@/api/network-check-api'
import Loading from '@/common/components/loading/loading'
import FadeTips from '@/common/components/fade-tips/FadeTips'
export default {
  name: 'SearchWifi',
  data: function() {
    return {
      wifiListsInfo: [],
      addClassWifiSelected: -1,
      showWifiLists: false,
      isUpdte: false,
      start: 0,
      addClassUpdateBg: false,
      currentWifiInfo: {},
      isLoading: true,
      tip: {
        msg: '',
        type: 'success',
        show: false
      },
      isErrTip: false,
      txtErrTip: '',
      loadWifiList: false
    }
  },
  methods: {
    wifiSelectedFn: function(key, wifiData) {
      this.addClassWifiSelected = key
      this.getWifiDataFn(wifiData)
      this.currentWifiInfo = this.wifiListsInfo[key]
    },
    showWifiListsFn: function(data) {
      this.showWifiLists = data
      this.loadWifiList = data
      this.$root.Bus.$emit('busIsOpenWifiList', this.showWifiLists)
    },
    getWifiDataFn: function(data) {
      this.$root.Bus.$emit('busWifiName', data)
    },
    clickShowWifiListsFn: function() {
      this.showWifiLists = false
      this.$root.Bus.$emit('busChangeFalse', this.showWifiLists)
      this.$root.Bus.$emit('busIsOpenWifiList', this.showWifiLists)
    },
    apiNetRepeaterScanFn: function() {
      this.isLoading = true
      // 请求获取周边WIFI列表的接口
      netRepeaterScan()
        .then(data => {
          this.wifiListsInfo = data.list
          this.isUpdte = false // 结束update的旋转按钮
          this.isLoading = false
          this.isErrTip = false
          if (this.bar) {
            this.bar.update()
          } else {
            this.createBar()
          }
        })
        .catch(e => {
          this.tip.msg = e
          this.tip.type = 'error'
          this.tip.show = true
          this.isLoading = false
          this.isUpdte = false
          this.isErrTip = true
          this.addClassUpdateBg = false
        })
    },
    apiInitNetRepeaterScanFn: function() {
      this.isLoading = true
      // 请求获取周边WIFI列表的接口
      netRepeaterScan()
        .then(data => {
          this.isErrTip = false
          this.wifiListsInfo = data.list
          // this.isUpdte = false // 结束update的旋转按钮
          this.isLoading = false
          if (this.bar) {
            this.bar.update()
          } else {
            this.createBar()
          }
        })
        .catch(e => {
          this.isLoading = false
          this.isErrTip = true
          this.txtErrTip = e
        })
    },
    clickUpdateBtnFn: function() {
      this.isErrTip = false
      if (!this.isLoading) {
        this.animateUpdateBtn()
        this.apiNetRepeaterScanFn()
      }
    },
    animateUpdateBtn: function() {
      this.isUpdte = !this.isUpdte
      if (this.isUpdte) {
        window.requestAnimationFrame(this.updateRunning)
      }
    },
    updateRunning: function() {
      let stop
      this.start = this.start + 4.5
      if (this.$refs.updateBtn) {
        this.$refs.updateBtn.style.transform = `rotate(${this.start}deg)`
        stop = window.requestAnimationFrame(this.updateRunning)
        // 点击刷新按钮重新获取周边wifi
        // 添加update-bg类名
        this.addClassUpdateBgFn(1)
        if (this.isUpdte === false) {
          // 判断在怎样的情况下停止加速？ 加速成功，加速失败；
          window.cancelAnimationFrame(stop)
          this.start = 0
          this.isUpdte = false
          // 取消updaate-bg类名
          this.addClassUpdateBgFn(0)
        }
      }
    },
    addClassUpdateBgFn: function(num) {
      if (num === 1) {
        this.addClassUpdateBg = true
      } else {
        this.addClassUpdateBg = false
        this.isUpdte = false
      }
    },
    getDocHeight: function() {
      let h = window.innerHeight
      let oH = h - 76 - 60 - 20
      if (this.$refs.wifiLists) {
        this.$refs.wifiLists.style.height = oH + 'px'
      }
    },
    createBar() {
      const ele = this.$refs.wifiLists
      this.$nextTick(() => {
        this.bar = new this.$geminiScrollbar({
          element: ele
        }).create()
      })
    },
    loadWifiListFn: function(data) {
      this.loadWifiList = data
      // 从新渲染当前页面的的高度
      this.getDocHeight()
    }
  },
  components: {
    Loading,
    FadeTips
  },
  created() {
    this.$root.Bus.$on('busShowWifiLists', data => {
      // 挂载显示search-wifi组件的方法
      this.showWifiListsFn(data)
      if (data) {
        this.apiInitNetRepeaterScanFn()
      }
    })
    // 调用获取周边WIFI列表的接口
    // this.apiInitNetRepeaterScanFn()
  },
  mounted() {
    this.getDocHeight()
  },
  beforeDestroy() {
    this.$root.Bus.$off('busShowWifiLists')
  }
}
</script>

<style lang="scss" scoped>
.search-wifi {
  position: fixed;
  width: 0px;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 102;
  background: linear-gradient(
    180deg,
    rgba(240, 243, 247, 1),
    rgba(255, 255, 255, 1)
  );
  box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.06);
  opacity: 0;
  transition: width linear .3s, opacity linear .3s;
  span {
    color: transparent;
  }
  & > .search-wifi-title {
    text-align: center;
    span {
      height: 76px;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 1),
        rgba(255, 255, 255, 1)
      );
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      line-height: 76px;
    }
  }
  & > .wifi-lists-wrapper {
    width: 100%;
    span {
      float: left;
      text-align: left;
      height: 60px;
      line-height: 60px;
      font-size: 14px;
      // color: rgba(131, 137, 161, 1);
    }
    .wifi-list-name {
      width: 80%;
      span {
        height: 55px;
        line-height: 55px;
        color: transparent;
      }
    }
    .wifi-list-signal {
      width: 20%;
    }
  }
  .wifi-lists-title {
    width: 100%;
    overflow: hidden;
    border-bottom: 1px solid rgba(230, 230, 231, 1);
    padding: 0 40px;
  }
  .wifi-lists {
    position: relative;
    overflow: auto;
    padding-bottom: 100px;
    .loading-wrapper {
      position: absolute;
      top: 50%;
      margin-top: -30px;
      width: 100%;
      .wifi-loading {
        margin: 0 auto;
      }
      .text {
        margin-top: 30px;
        text-align: center;
      }
    }
  }
  .wifi-list {
    display: block;
    width: 100%;
    background: none;
    border: none;
    outline: none;
    padding: 0 40px;
    cursor: pointer;
    overflow: hidden;
    & > span {
      // color: rgba(58, 56, 72, 1);
      color: transparent;
    }
    &:hover,
    &:focus {
      background: linear-gradient(
        -90deg,
        rgba(57, 193, 255, 1),
        rgba(0, 159, 232, 1)
      );
    }
  }
  .wifi-selected {
    background: linear-gradient(
      -90deg,
      rgba(57, 193, 255, 1),
      rgba(0, 159, 232, 1)
    );
  }
  .close-update {
    position: absolute;
    top: 0;
    left: -76px;
    opacity: 0;
    transition: opacity 0.3s;
    & > button {
      display: block;
      width: 56px;
      height: 56px;
      background-color: #fff;
      border-radius: 6px;
      margin-top: 20px;
      border: 2px solid transparent;
      transition: box-shadow 0.3s, border-color 0.3s;
      cursor: pointer;
      &:hover {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.5);
        border-color: rgba(0, 159, 232, 1);
        & > .i-bg1 {
          background: url('../../../assets/images/icon/icon_wifi_esc_hover1.png')
            no-repeat;
          background-size: 100% 100%;
        }
        & > .i-bg2 {
          background: url('../../../assets/images/icon/icon_refresh_hover1.png')
            no-repeat;
          background-size: 100% 100%;
        }
      }
      & > .i-bg1 {
        width: 24px;
        height: 24px;
        background: url('../../../assets/images/icon/icon_wifi_esc_normal.png')
          no-repeat;
        background-size: 100% 100%;
      }
      & > .i-bg2 {
        background: url('../../../assets/images/icon/icon_refresh_normal.png')
          no-repeat;
        background-size: 100% 100%;
        // border: 1px solid red;
      }
      & > .i-animate-bg2 {
        background: url('../../../assets/images/icon/icon_refresh_hover2.png')
          no-repeat;
        background-size: 100% 100%;
      }
    }
    i {
      display: block;
      width: 24px;
      height: 24px;
      margin: auto;
    }
  }
  .opacity {
    opacity: 1;
    transition: opacity .3s;
  }
}
.search-wifi.w0 {
  width: 318px;
  opacity: 1;
  transition: width linear .3s, opacity linear .3s;
  span {
    color: #3a3848;
  }
}
.err-tip-p {
  color: red;
  opacity: 0.8;
}
</style>
