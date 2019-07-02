<template>
  <button class="index-speed-up"  @click="toggleRouteToSpeedUp()" :disabled="isDisabled">
    <div class="speed-up-info-txt">
      <div v-for="(item,key) in infoTxt" :key="key" class="info-txt" id="txt-show">
        {{item.span}}：<span>{{item.h2}}</span><span class="auto-tip" v-show="isShowCurrentPM && item.h2 === '自动'">&nbsp;&nbsp;({{ item.autoTip }})</span>
      </div>
    </div>
    <div class="speed-up-info-img"></div>
    <div :class="{'cover': isShowCover}"></div>
  </button>
</template>

<script>
import { accConfigGet, accStateGet } from '@/api/speed-manage-api'
export default {
  name: 'IndexSpeedUp',
  data: function() {
    return {
      infoTxt: [
        { h2: '', span: this.$t('i18n.SPEED_NODE'), index: 999, autoTip: null },
        { h2: '', span: this.$t('i18n.SPEED_PATTERN'), index: 999, autoTip: null }
      ],
      modeArr: [this.$t('i18n.AUTO'), this.$t('i18n.PATTERN_MODE_ONE'), this.$t('i18n.PATTERN_MODE_TWO'), this.$t('i18n.PATTERN_MODE_THREE'), this.$t('i18n.PATTERN_MODE_FOUR')],
      accStateStatus: '',
      isShowCover: false,
      isDisabled: false,
      stopSetInterval: null,
      isLoopGetApi: true,
      isShowCurrentPM: false, // 当用户选择为自动时，显示当前真正加速的模式和分区
      isOpenGetConfig: true // 是否开启获取加速配置
    }
  },
  methods: {
    toggleRouteToSpeedUp: function() {
      if (!this.isShowCover) {
        if (this.accStateStatus !== 'INIT') {
          // 调用触发自定义事件busUpdateSpeedUpInfo的this.saveInfoTxt()
          this.saveInfoTxt()
          // 路由切换至/speed-up
          this.$router.push('/speed-up')
        } else {
          this.$router.push('/member-login')
        }
      }
    },
    resetInfoTxtSetting: function(data) {
      // 重置infoTxt
      this.infoTxt[0].h2 = data.servername
      this.infoTxt[0].index = data.index
    },
    resetInfoTxtPattern: function(data) {
      this.infoTxt[1].h2 = data.patternname
      this.infoTxt[1].index = data.index
    },
    saveInfoTxt: function() {
      // 触发自定义事件busUpdateSpeedUpInfo，传值给组件speed-pattern和speed-setting
      this.$root.Bus.$emit('busUpdateSpeedUpInfo', this.infoTxt)
    },
    apiInitAccConfigGetFn: function() {
      // 初始化获取加速配置
      accConfigGet()
        .then(data => {
          this.dealSpeedDataFn(data)
        })
        .catch(e => {
          let aa = setTimeout(() => {
            this.apiInitAccConfigGetFn()
            clearTimeout(aa)
          }, 2300)
        })
    },
    dealSpeedDataFn: function(data) {
      let mode
      if (data.mode === '') {
        mode = 0
      } else {
        mode = parseInt(data.mode) // 模式
      }
      let node = data.nodeZone // 节点
      if (node === '') {
        node = `${this.$t('i18n.AUTO')}`
      }
      if (this.isLoopGetApi) {
        this.infoTxt[1].h2 = this.modeArr[mode]
        this.infoTxt[0].h2 = node
      } else {
        this.infoTxt[1].h2 = `${this.$t('i18n.FAIL_LOGIN')}`
        this.infoTxt[0].h2 = `${this.$t('i18n.FAIL_LOGIN')}`
      }
    },
    apiInitAccStateGetFn: function() {
      accStateGet()
        .then(data => {
          this.initAccStateGetFn(data)
        })
        .catch(e => {
          // 如果失败，再次调用该方法
          // let stop = setInterval(() => {
          //   this.apiInitAccStateGetFn()
          //   clearInterval(stop)
          // }, 1000)
        })
    },
    initAccStateGetFn: function(data) {
      this.accStateStatus = data.status
      this.$root.Bus.$emit('busCheckLoginStatus', this.accStateStatus)
      this.isLoopGetApi = true
      if (this.accStateStatus !== 'INIT') {
        // 已登录，调获取加速配置的接口
        if (this.isOpenGetConfig) {
          this.apiInitAccConfigGetFn()
          this.isOpenGetConfig = false
        }
        let aa = setTimeout(() => {
          this.isOpenGetConfig = true
          clearTimeout(aa)
        }, 2300)
      } else {
        this.infoTxt[1].h2 = `${this.$t('i18n.FAIL_LOGIN')}`
        this.infoTxt[0].h2 = `${this.$t('i18n.FAIL_LOGIN')}`
      }
    },
    getRouteFn: function() {
      // 获取当前路由
      const pathStr = this.$route.path
      if (pathStr === '/') {
        this.apiInitAccStateGetFn()
        // 检查登录状态
        clearInterval(this.stopSetInterval)
        this.setIntervalFn()
        // 不禁止button的focus效果
        this.isDisabled = false
      } else {
        // 禁止button的focus效果
        this.isDisabled = true
        clearInterval(this.stopSetInterval)
      }
    },
    toggleLoginOutFn: function() {
      this.accStateStatus = 'INIT' // 把当前的状态更改为未登录的状态
      // 视图切换为退出状态
      this.infoTxt[0].h2 = `${this.$t('i18n.FAIL_LOGIN')}`
      this.infoTxt[1].h2 = `${this.$t('i18n.FAIL_LOGIN')}`
      this.isLoopGetApi = false
    },
    setIntervalFn: function() {
      // 轮询 获取加速状态
      this.stopSetInterval = setInterval(() => {
        if (this.accStateStatus === 'INIT') {
          // 未登录，先要检查登录状态
          this.apiInitAccStateGetFn()
        } else {
          // 已登录，直接获取相关的信息
          this.apiInitAccConfigGetFn()
        }
      }, 20000)
    }
  },
  created() {
    const pathindex = this.$route.path
    this.$root.Bus.$on('busIndexSpeedUp', () => {
      // 点击退出按钮后触发该事件
      this.toggleLoginOutFn()
    })
    // 初始化
    if (pathindex === '/') {
      this.apiInitAccStateGetFn()
      // 获取加速状态
      clearInterval(this.stopSetInterval)
      this.setIntervalFn()
    }
    this.$root.Bus.$on('busShowCover', data => {
      this.isShowCover = data
    })
    this.$root.Bus.$on('busStopLoopAccStateGet', () => {
      clearInterval(this.stopSetInterval)
      let aa = setTimeout(() => {
        clearInterval(this.stopSetInterval)
        this.setIntervalFn()
        clearTimeout(aa)
      }, 9287)
    })
    this.$root.Bus.$on('busCheckLoginOkStatus', (data, status) => {
      this.isLoopGetApi = data
      if (data) {
        clearInterval(this.stopSetInterval)
        this.apiInitAccConfigGetFn()
        this.$root.Bus.$emit('memberLoginOkSuccess', status)
        this.accStateStatus = status
        let aa = setTimeout(() => {
          clearInterval(this.stopSetInterval)
          this.setIntervalFn()
          clearTimeout(aa)
        }, 9287)
      }
    })
    this.$root.Bus.$on('memberLoginSuccessBtn', (status) => {
      // 表示登录成功
      this.accStateStatus = status
      this.isLoopGetApi = true
      if (this.isOpenGetConfig) {
        this.apiInitAccConfigGetFn()
        this.isOpenGetConfig = false
      }
      let aa = setTimeout(() => {
        this.isOpenGetConfig = true
        clearTimeout(aa)
      }, 2300)
    })
    this.$root.Bus.$on('busSaveSpeedStatus', data => {
      // 从模态框speed-up点击保存成功的按钮后，
      if (data) {
        accConfigGet()
          .then(data => {
            this.dealSpeedDataFn(data)
          })
        accStateGet()
          .then(data => {
            this.accStateStatus = data.status
          })
      }
    })
    this.$root.Bus.$on('busCurrentPM', (data, obj) => {
      this.isShowCurrentPM = data
      if (data) {
        this.infoTxt[1].autoTip = this.modeArr[obj.mode]
        this.infoTxt[0].autoTip = obj.pattern
      }
    })
    this.$root.Bus.$on('busInitAccState', data => {
      this.initAccStateGetFn(data)
    })
    this.$root.Bus.$on('busLoginOk', data => {
      this.accStateStatus = data
      accConfigGet()
        .then(res => {
          this.dealSpeedDataFn(res)
        })
    })
  },
  watch: {
    $route: 'getRouteFn'
  },
  beforeDestroy() {
    this.$root.Bus.$off('busIndexSpeedUp')
    this.$root.Bus.$off('busShowCover')
    this.$root.Bus.$off('busStopLoopAccStateGet')
    this.$root.Bus.$off('busCheckLoginOkStatus')
    this.$root.Bus.$off('memberLoginSuccessBtn')
    this.$root.Bus.$off('busSaveSpeedStatus')
    clearInterval(this.stopSetInterval)
    this.$root.Bus.$off('busCurrentPM')
    this.$root.Bus.$off('busInitAccState')
    this.$root.Bus.$off('busLoginOk')
  }
}
</script>

<style lang="scss" scoped>
@mixin a-focus {
  color: #000;
  background: linear-gradient(
    -180deg,
    rgba(57, 193, 255, 1),
    rgba(0, 159, 232, 1)
  );
  opacity: 1;
  border: 3px solid #fff;
  box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.5);
  .speed-up-info-txt {
    float: left;
    .info-txt{
      color: #fff;
    }
    span {
      color: #fff;
    }
  }
  .speed-up-info-img {
    width: 162px;
    height: 100px;
    background: url(../../../../../assets/images/icon/img_bar_chart_hover.png)
      no-repeat;
    background-size: 100% 100%;
    float: right;
    margin-right: 30px;
    margin-top: 22px;
  }
  .tip-txt-info {
    opacity: 1;
    overflow: visible;
  }
}
.index-speed-up {
  width: 100%;
  height: 152px;
  background-color: #fff;
  border-radius: 6px;
  margin-bottom: 20px;
  border: 3px solid transparent;
  cursor: pointer;
  box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.5s, opacity 0.3s;
  color: #000;
  position: relative;
  text-align: left;
  // opacity: 0;
  & > .speed-up-info-txt {
    width: 290px;
    overflow: hidden;
    float: left;
    padding-top: 41px;
    padding-bottom: 41px;
  }
  .info-txt {
    margin-left: 30px;
    position: relative;
    font-size: 16px;
    color: rgba(140, 139, 142, 1);
    &:nth-of-type(1) {
      margin-bottom: 20px;
    }
    & > span {
      font-size: 16px;
      color: rgba(158, 157, 159, 1);
      letter-spacing: 0px;
      line-height: 22px;
      transition: color 0.3s;
      color: rgba(44, 41, 57, 1);
    }
    & > .auto-tip {
      color: rgba(140, 139, 142, 1)
    }
    & > .tip-txt-info {
      position: absolute;
      border-radius: 2px;
      background-color: #fff;
      white-space: nowrap;
      overflow: visible;
      font-size: 14px;
      padding: 2px 4px 3px 3px;
      top: 30px;
      left: 50%;
      transform: translate(-50%);
      opacity: 0;
      transition: opacity 0.3s;
      & > i {
        position: absolute;
        height: 0;
        width: 0;
        border: 4px solid transparent;
        border-top: 5px solid #ffffff;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
  &:hover {
    @include a-focus;
  }
  &:focus {
    @include a-focus;
  }
  .speed-up-info-img {
    width: 162px;
    height: 100px;
    background: url(../../../../../assets/images/icon/img_bar_chart_normal.png)
      no-repeat;
    background-size: 100% 100%;
    float: right;
    margin-right: 30px;
    margin-top: 22px;
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
  .index-speed-up {
     height: 120px;
     &:hover {
       .speed-up-info-img {
        width: 105px;
        height: 84px;
        margin-top: 11px;
      }
     }
     .speed-up-info-txt {
      padding-top: 25px;
      padding-bottom: 25px;
     }
     .speed-up-info-img {
      width: 105px;
      height: 84px;
      margin-top: 11px;
     }
  }
}
</style>
