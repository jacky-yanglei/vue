<template>
  <div class="ljb-index-left" :class="{'ljb-index-left-animation':isShow}">
    <div class="login-tip" :class="{'error-tip': isShowErrorTip}" v-show="isShowErrorTip">{{ txtTipShow }}</div>
    <div class="login-tip" :class="{'success-tip': isShowSuccessTip}" v-show="isShowSuccessTip">{{ txtTipShow }}</div>
    <div class="btn-container">
      <button :disabled="isDisabled" @blur="blurFn()" class="speed-up-circle1" @click.stop.prevent="clickBtnFn()" v-focus="focusStatus">
        <div class="speed-up-circle2">
          <div class="speed-up-circle3">
            <h3 v-html="txtSpeedBtn"></h3>
          </div>
        </div>
        <div :class="{'speed-up-running': isShowSpeedUpPng}" ref="running"></div>
      </button>
      <button class="restart" @click.stop.prevent="apiRestartSpeedFn()" v-show="isShowRestartBtn">
        <div :class="{'hover-bg': isShowRestartStatus}"></div>
      </button>
    </div>
    <div class="delay-lost" :class="{'opacity-delay': isShowDelay}">
      <div class="delay">
        <i></i>
        <h4>{{ $t('i18n.DELAY_TIME') }}</h4>
        <p><em>{{ delay }}</em>ms</p>
      </div>
      <div class="lost">
        <i class="lost-icon"></i>
        <h4>{{ $t('i18n.PACKET_LOSS') }}</h4>
        <p><em>{{ loss }}</em>%</p>
      </div>
    </div>
  </div>
</template>

<script>
import { accStateGet, accControlAction } from '@/api/speed-manage-api'
import accCause from '@/common/service/accCause'
export default {
  name: 'BeforeSpeedUp',
  data: function() {
    return {
      isShow: false,
      txtTipShow: this.$t('i18n.TIP_AUTO_SPEED'), // 提醒的文字
      delay: 34,
      loss: 0,
      focusStatus: true,
      txtSpeedBtn: null,
      isShowDelay: false,
      isShowRestartStatus: false,
      isShowRestartBtn: false,
      isShowErrorTip: false, // 用户加速失败时的错误提醒
      isShowSpeedUpPng: false, // 是否显示加速动画效果的圆圈图片
      isDisabled: false, // 是否禁止button标签的focus效果
      status: null, // 用户的状态
      event: null, // 改变用户状态的事件
      cause: null, // 用于状态发生该事件的原因
      causeFormArr: null, // 从本地整理的文件中获取状态发生该事件的原因
      userConflict: null, // 通道是否被占用
      isOpenRegularPolling: false, // 是否开启常规状态的轮询，默认true,开启
      stopInitSetTimeoutForRP: null, // 定义一个用于页面加载时，延时常规轮询的变量
      stopSetIntervalForRP: null, // 定义一个定时进行常规轮询的变量
      isChangeAccStatusOfRP: false, // 是否改变常规轮询时的各种状态
      stopSetIntervalForSU: null, // 定义一个定时进行加速状态轮询的变量
      isGetInitAccStatus: false, // 是否获取到初始化状态
      isShowSuccessTip: true, // 显示成功状态的顶部提醒
      isStartApi: true, // 解决老版app登录后，web端连续多次调用加速过程控制的接口，使只调用一次
      currentMode: null,
      currentPattern: null,
      isEmitBusCheckStateStatus: false,
      isEmitBusLoginOkStatus: true,
      lastStatus: null, // 记录相对于当前状态的上一次状态
      userType: null, // 记录账户过期
      isOpenInitRG: true // 是否页面初始化加载时开启常规轮询
    }
  },
  methods: {
    apiInitCheckAccStateGetFn: function() {
      // 初始化时检查状态
      accStateGet()
        .then((data) => {
          this.isGetInitAccStatus = true
          this.isOpenRegularPolling = true
          this.isChangeAccStatusOfRP = true
          this.changeAccStatusFn(data)
          if (this.isEmitBusCheckStateStatus) {
            this.$root.Bus.$emit('busCheckStateStatus', data)
            this.isEmitBusCheckStateStatus = false
          }
          this.$root.Bus.$emit('busInitAccState', data)
          if (data.status === 'LOGIN_OK' || data.status === 'ACCING' || data.status === 'ACC_OK') {
            this.$root.Bus.$emit('busToShowLoginOutBtn', true) // 显示登出按钮
          } else {
            this.$root.Bus.$emit('busToShowLoginOutBtn', false) // 隐藏登出按钮
          }
        })
        .catch(e => {
          this.isOpenRegularPolling = true
          this.isChangeAccStatusOfRP = true
          this.isEmitBusCheckStateStatus = true
        })
    },
    apiStartSpeedFn: function() {
      // 调用开始加速的接口
      // 处理各种状态
      this.isShow = true
      this.isShowSpeedUpPng = true
      clearInterval(this.stopSetIntervalForRP) // 清除常规状态的轮询
      clearInterval(this.stopSetIntervalForSU) // 清除常规状态的轮询
      this.isOpenRegularPolling = false // 关闭常规状态的轮询
      this.isChangeAccStatusOfRP = false // 关闭改变常规轮询改变视图的方法
      this.txtSpeedBtn = this.$t('i18n.SPEED_RUNNING')
      // 调用加速过程控制的接口
      let apiData = {
        action: 'start'
      }
      if (this.isStartApi) {
        this.isStartApi = false
        accControlAction(apiData)
          .then((data) => {
            this.isStartApi = false
            if (parseInt(data.ret) === 0) {
              // 调取加速中的轮询检测的方法
              this.apiAccStateGetForSU()
              // 顶部提醒处理
              this.isShowErrorTip = false
              this.isShowSuccessTip = true
              this.txtTipShow = this.$t('i18n.TIP_AUTO_SPEED')
            }
          })
          .catch(e => {
            this.isStartApi = false
            this.openRegularPollingFn()
          })
      } else {
        let aa = setTimeout(() => {
          this.isStartApi = true
          clearTimeout(aa)
        }, 7000)
      }
    },
    apiRestartSpeedFn: function() {
      // 调用重新加速的接口
      // 处理各种状态
      this.isShow = true
      this.isShowDelay = false
      this.isShowSpeedUpPng = true
      clearInterval(this.stopSetIntervalForRP) // 清除常规状态的轮询
      clearInterval(this.stopSetIntervalForSU) // 清除加速状态的轮询
      this.isOpenRegularPolling = false // 关闭常规状态的轮询
      this.isChangeAccStatusOfRP = false // 关闭改变常规轮询改变视图的方法
      this.txtSpeedBtn = this.$t('i18n.SPEED_RUNNING')
      this.isShowRestartBtn = false
      // 调用加速过程控制的接口
      let apiData = {
        action: 'restart'
      }
      accControlAction(apiData)
        .then((data) => {
          if (data.ret === 0) {
            // 调取加速中的轮询检测的方法
            this.apiAccStateGetForSU()
            // 顶部提醒处理
            this.isShowErrorTip = false
            this.isShowSuccessTip = true
            this.txtTipShow = this.$t('i18n.TIP_AUTO_SPEED')
          }
        })
        .catch(e => {
          this.openRegularPollingFn()
        })
    },
    regularPollingFn: function() {
      // 开启常规轮询
      clearInterval(this.stopSetIntervalForSU) // 停止加速状态的轮询
      clearInterval(this.stopSetIntervalForRP)
      this.isOpenRegularPolling = true // 开启常规状态的轮询
      this.isChangeAccStatusOfRP = true // 开启常规状态的轮询对视图影响
      this.stopSetIntervalForRP = setInterval(() => {
        this.apiAccStateGetForRP(this.isOpenRegularPolling)
      }, 4771)
    },
    apiAccStateGetForRP: function(status) {
      // 获取常规轮询的加速状态
      if (status) {
        // 状态ok,调用检查状态的接口
        accStateGet()
          .then((data) => {
            // 顶部提醒处理
            this.isShowErrorTip = false
            this.isShowSuccessTip = true
            this.txtTipShow = this.$t('i18n.TIP_AUTO_SPEED')
            if (this.isChangeAccStatusOfRP) {
              this.changeAccStatusFn(data)
              this.isGetInitAccStatus = true // 显示加速页面
            }
            if (this.isEmitBusCheckStateStatus) {
              this.$root.Bus.$emit('busCheckStateStatus', data)
              this.$root.Bus.$emit('busInitAccState', data)
              this.isEmitBusCheckStateStatus = false
            }
          })
          .catch(e => {
            this.isGetInitAccStatus = true // 显示加速页面
            this.isShowSuccessTip = false
            this.isShowErrorTip = true
            let o = typeof (e)
            if (o === 'object') {
              this.txtTipShow = e.msg
            } else {
              this.txtTipShow = e
            }
            this.isShow = false
            this.isShowSpeedUpPng = false
            this.txtSpeedBtn = this.$t('i18n.NO_SPEEDING')
            this.isShow = false
            this.isShowDelay = false
            this.isEmitBusCheckStateStatus = true
          })
      }
    },
    apiAccStateGetForSU: function() {
      clearInterval(this.stopSetIntervalForSU)
      clearInterval(this.stopSetIntervalForRP) // 清除常规状态的轮询
      this.isOpenRegularPolling = false
      this.isChangeAccStatusOfRP = false
      this.txtSpeedBtn = this.$t('i18n.SPEED_RUNNING')
      this.isShow = true
      this.isShowDelay = false
      this.isShowSpeedUpPng = true
      // 获取加速状态的加速结果
      this.stopSetIntervalForSU = setInterval(() => {
        accStateGet()
          .then((data) => {
            // 顶部提醒处理
            this.isShowErrorTip = false
            this.isShowSuccessTip = true
            this.txtTipShow = this.$t('i18n.TIP_AUTO_SPEED')
            this.changeAccStatusFn(data)
          })
          .catch(e => {
            this.openRegularPollingFn() // 开启常规状态的轮询
            this.isShowErrorTip = true
            this.isShowSuccessTip = false
            let o = typeof (e)
            if (o === 'object') {
              this.txtTipShow = e.msg
            } else {
              this.txtTipShow = e
            }
            this.isShowSpeedUpPng = false
            this.txtSpeedBtn = this.$t('i18n.NO_SPEEDING')
            this.isShow = false
            this.isShowDelay = false
          })
      }, 470)
    },
    changeAccStatusFn: function(data) {
      this.lastStatus = this.status // 记录上一次状态
      this.status = data.status
      this.controlEmitFn()
      this.event = parseInt(data.event)
      this.delay = data.accNodePing
      this.userConflict = parseInt(data.userConflict)
      this.cause = parseInt(data.cause)
      this.causeFormArr = this.cause
      this.currentMode = parseInt(data.accCurrMode)
      this.currentPattern = data.accNodeZone
      this.userType = parseInt(data.userType)
      if (this.event !== 6) {
        this.isShowRestartBtn = false // 隐藏重新加速按钮
      }
      if (this.status === 'LOGIN_OK' && this.cause === 4) {
        // 占线处理
        this.$router.push({path: '/login-others', query: {status: this.status}})
        return
      }
      // 调用处理视图的方法
      this.dealViewFn()
    },
    dealViewFn: function() {
      switch (this.status) {
        case 'INIT':
          this.initStatusFn()
          break
        case 'LOGININ':
          console.log(this.status)
          break
        case 'LOGIN_OK':
          this.loginOkStatusFn()
          break
        case 'ACCING':
          this.accingStatusFn()
          break
        case 'ACC_OK':
          this.accOkStatusFn()
          break
        default:
          console.log('status:', this.status)
      }
    },
    initStatusFn: function() {
      switch (this.event) {
        case 0:
          this.initEventOkFn() // 未登录的正常状态
          break
        case 2:
          this.initEventOkFn() // 未登录的正常状态
          if (this.cause === 4) {
            // 弹出强制下线的页面
            this.$router.push({path: '/login-others', query: {status: this.status}})
          }
          break
        case 4:
          this.loginFailedEvent4Fn() // 登录失败的状态
          break
        default:
          console.log('status:', this.status, 'event:', this.event, 'cause:', this.cause)
      }
    },
    logininStatusFn: function() {},
    loginOkStatusFn: function() {
      this.$root.Bus.$emit('busCurrentPM', false)
      if (this.userType === 3 || this.userType === 7 || this.userType === 15) {
        this.dealAccountFailFn()
      } else {
        switch (this.event) {
          case 1:
            this.loginOkEvent1Fn() // 登录
            break
          case 3:
            this.loginOkEvent3Fn() // 登录成功
            break
          case 6:
            this.accStopFn() // 停止加速
            break
          default:
            console.log('status:', this.status, 'event:', this.event, 'cause:', this.cause)
        }
      }
    },
    loginOkEvent1Fn: function() {
      // 登录
      this.loginOkEventOkFn()
    },
    loginOkEvent3Fn: function() {
      // 登录成功
      this.loginOkEventOkFn()
    },
    loginOkEvent17Fn: function() {
      // 强制其它设备设备断开加速通道
      this.loginOkEventOkFn()
    },
    accingStatusFn: function() {
      // 加速中的状态
      switch (this.event) {
        case 5:
          this.accingEvent5Fn() // accing状态，event = 5
          break
        case 8:
          this.restartAccingFn() // 重新启动加速
          break
        case 9:
          this.restartAccingFn() // 重新启动加速
          break
        default:
          console.log('status:', this.status, 'event:', this.event, 'cause:', this.cause)
      }
    },
    accOkStatusFn: function() {
      switch (this.event) {
        case 7:
          this.accOkEvent7Fn() // 加速ok的正常状态
          break
        default:
          console.log('status:', this.status, 'event:', this.event, 'cause:', this.cause)
      }
      this.$root.Bus.$emit('busCurrentPM', true, {'mode': this.currentMode, 'pattern': this.currentPattern})
    },
    initEventOkFn: function() {
      // 未登录时的正常状态
      this.txtSpeedBtn = `${this.$t('i18n.LOGIN')}<br>${this.$t('i18n.QEE_YOU')}`
      this.isShow = false
      this.isShowDelay = false
      this.isShowSpeedUpPng = false
      this.$root.Bus.$emit('busIndexSpeedUp') // 控制主界面加速模块的登出状态
      this.$root.Bus.$emit('memberLoginOut') // 控制导航栏登出的视图效果
      this.$root.Bus.$emit('busToShowLoginOutBtn', false) // 隐藏登出按钮
      // 显示原因
      this.isShowSuccessTip = true
      this.isShowErrorTip = false
      this.txtTipShow = accCause[this.causeFormArr].cause
    },
    loginOkEventOkFn: function() {
      if ((this.cause === 1 || this.cause === 2) && this.userConflict !== 0) {
        // 处理占线
        this.isShowSpeedUpPng = false
        this.isShowSuccessTip = false
        this.isShowErrorTip = true
        this.txtSpeedBtn = this.$t('i18n.NO_SPEEDING')
        this.txtTipShow = accCause[this.causeFormArr].cause
        this.$router.push({path: '/login-others', query: {status: this.status}})
        return
      }
      // 登录ok的正常状态
      clearInterval(this.stopSetIntervalForSU)
      clearInterval(this.stopSetIntervalForRP) // 清除常规状态的轮询
      this.isOpenRegularPolling = false
      this.isChangeAccStatusOfRP = false
      this.isStartApi = true
      // this.apiStartSpeedFn()
      this.apiAccStateGetForSU()
      this.txtSpeedBtn = this.$t('i18n.SPEED_RUNNING')
      this.isShow = true
      this.isShowDelay = false
      this.isShowSpeedUpPng = true
      // 显示原因
      this.isShowSuccessTip = true
      this.isShowErrorTip = false
      this.txtTipShow = accCause[this.causeFormArr].cause
      // 该条件下触发某种状态
      if (this.isEmitBusLoginOkStatus) {
        this.$root.Bus.$emit('memberLoginSuccessBtn', 'LOGIN_OK')
        this.$root.Bus.$emit('memberLoginOkSuccess')
        this.isEmitBusLoginOkStatus = false
      }
      this.$root.Bus.$emit('busToShowLoginOutBtn', true) // 显示登出按钮
    },
    loginFailedEvent4Fn: function() {
      // 登录失败
      this.isShowErrorTip = true
      this.isShowSuccessTip = false
      this.txtTipShow = accCause[this.causeFormArr].cause
      this.txtSpeedBtn = `${this.$t('i18n.LOGIN')}<br>${this.$t('i18n.QEE_YOU')}`
      this.isShow = false
      this.isShowDelay = false
      this.isShowSpeedUpPng = false
      this.$root.Bus.$emit('busIndexSpeedUp') // 控制主界面加速模块的登出状态
      this.$root.Bus.$emit('memberLoginOut') // 控制导航栏登出的视图效果
      this.$root.Bus.$emit('busToShowLoginOutBtn', false) // 隐藏登出按钮
    },
    accStopFn: function() {
      // this.event = 6 （停止加速的行为）
      // this.event = 16 (wan异常断开)(前端不考虑)
      // this.event = 19 (加速断开)（前端不考虑）
      switch (this.cause) {
        case 3:
          this.accStopCause3Fn() // 用户登出（WEB、APP）
          break
        case 4:
          this.accStopCause4Fn() // 占线
          break
        case 8:
          this.accStopCause8Fn() // 老版app端停止加速
          break
        case 10:
          this.accStopCause10Fn() // WAN口中断通知加速断开
          break
        case 14:
          this.accStopCause14Fn() // 强制其它设备设备断开加速通道
          break
        case 15:
          this.accStopCause15Fn() // 节点网络错误
          break
        case 17:
          this.accStopCause17Fn() // 账号过期导致加速停止
          break
        default:
          console.log(this.cause)
      }
    },
    accStopCause4Fn: function() {
      // 占线处理
      this.$router.push({path: '/login-others', query: {status: this.status}})
    },
    accStopCauseFn: function() {
      // 用户停止加速的状态处理
      this.isShowDelay = false
      this.isShow = false
      this.txtSpeedBtn = this.$t('i18n.NO_SPEEDING')
      this.isShowErrorTip = true
      this.isShowSuccessTip = false
      this.isShowSpeedUpPng = false
      this.openRegularPollingFn()
    },
    accStopCause3Fn: function() {
      // 用户登出（WEB、APP）
      this.accStopCauseFn()
      this.isShowRestartBtn = false
      this.txtTipShow = accCause[this.causeFormArr].cause
    },
    accStopCause8Fn: function() {
      // 用户停止加速,老版app用户停止加速的事件状态
      this.accStopCauseFn()
      this.isShowRestartBtn = true
      this.txtTipShow = accCause[this.causeFormArr].cause
    },
    accStopCause10Fn: function() {
      // WAN口中断通知加速断开
      this.accStopCauseFn()
      this.isShowRestartBtn = false
      this.txtTipShow = accCause[this.causeFormArr].cause
    },
    accStopCause14Fn: function() {
      // 强制其它设备设备断开加速通道
      this.accStopCauseFn()
      this.isShowRestartBtn = false
      this.txtTipShow = accCause[this.causeFormArr].cause
    },
    accStopCause15Fn: function() {
      // 节点网络错误
      this.accStopCauseFn()
      this.isShowRestartBtn = false
      this.txtTipShow = accCause[this.causeFormArr].cause
    },
    accStopCause17Fn: function() {
      this.isShowSuccessTip = false
      this.isShowErrorTip = true
      this.txtSpeedBtn = this.$t('i18n.RENEW_NOW')
      this.txtTipShow = accCause[this.causeFormArr].cause
    },
    loginOkEvent8Fn: function() {
      // this.event = 8; (加速失败的事件行为)
      this.openRegularPollingFn()
      this.txtTipShow = accCause[this.causeFormArr].cause
      this.isShowErrorTip = true
      this.isShowSuccessTip = false
      this.txtSpeedBtn = this.$t('i18n.SPEEDING_FAILED')
    },
    accOkEvent7Fn: function() {
      // 加速成功的正常状态
      this.txtSpeedBtn = this.$t('i18n.SPEED_SUCCESS')
      this.openRegularPollingFn()
      this.isShow = true
      this.isShowDelay = true
      this.isShowSpeedUpPng = false
      this.$root.Bus.$emit('busToShowLoginOutBtn', true) // 显示登出按钮
      this.isShowSuccessTip = true
      this.isShowErrorTip = false
      this.txtTipShow = accCause[this.causeFormArr].cause
    },
    accingEvent5Fn: function() {
      switch (this.cause) {
        case 5:
          this.accingEvent5Cause5Fn()
          break
        case 6:
          this.accingEvent5Cause6Fn()
          break
        case 7:
          this.accingEvent5Cause7Fn()
          break
        case 12:
          this.accingEvent5Cause12Fn()
          break
        default:
          console.log(this.cause, 'event=5的cause')
      }
    },
    accingEvent5CauseFn: function() {
      this.isShow = true
      this.isShowSpeedUpPng = true
      this.isShowDelay = false
      this.txtSpeedBtn = this.$t('i18n.SPEED_RUNNING')
      this.isShowSuccessTip = true
      this.isShowErrorTip = false
      // this.openRegularPollingFn()
    },
    accingEvent5Cause5Fn: function() {
      this.accingEvent5CauseFn()
      this.txtTipShow = accCause[this.causeFormArr].cause
    },
    accingEvent5Cause6Fn: function() {
      this.accingEvent5CauseFn()
      this.txtTipShow = accCause[this.causeFormArr].cause
    },
    accingEvent5Cause7Fn: function() {
      this.accingEvent5CauseFn()
      this.txtTipShow = accCause[this.causeFormArr].cause
    },
    accingEvent5Cause12Fn: function() {
      this.accingEvent5CauseFn()
      this.txtTipShow = accCause[this.causeFormArr].cause
    },
    restartAccingFn: function() {
      // this.event = 9 (重新启动加速)
      switch (this.cause) {
        case 5:
          this.accingCause5Fn() // 用户启动加速
          break
        case 6:
          this.accingCause6Fn() // 断电重启或者Qeeyoud挂掉重启时恢复加速状态
          break
        case 7:
          this.accingCause7Fn() // WAN口网络恢复启动加速
          break
        case 11:
          this.accingCause11Fn() // 加速进程通知加速断开
          break
        case 12:
          this.accingCause12Fn() // 加速通知超时检测到加速失败(加速进程启动成功，但是隧道未建立成功)
          break
        case 16:
          this.accingCause16Fn() // 启动加速失败(加速进程启动失败)
          break
        default:
          console.log(this.cause)
      }
    },
    accingCauseFn: function() {
      // 处理重新加速的逻辑
      this.isShow = true
      this.isShowSpeedUpPng = true
      this.isShowDelay = false
      this.txtSpeedBtn = this.$t('i18n.SPEED_RUNNING')
      this.isShowSuccessTip = true
      this.isShowErrorTip = false
      // this.openRegularPollingFn()
    },
    accingCause5Fn: function () {
      // 用户启动加速
      this.accingCauseFn()
      this.txtTipShow = accCause[this.causeFormArr].cause
    },
    accingCause6Fn: function () {
      // 异常恢复时启动加速
      this.accingCauseFn()
      this.txtTipShow = accCause[this.causeFormArr].cause
    },
    accingCause7Fn: function () {
      // WAN口网络恢复启动加速
      this.accingCauseFn()
      this.txtTipShow = accCause[this.causeFormArr].cause
    },
    accingCause11Fn: function () {
      // 加速进程通知加速断开
      // this.accStopCauseFn()
      // this.isShowRestartBtn = true
      this.isShowSuccessTip = true
      this.isShowErrorTip = false
      this.txtTipShow = accCause[this.causeFormArr].cause
      // this.openRegularPollingFn()
    },
    accingCause12Fn: function() {
      this.isShowSuccessTip = true
      this.isShowErrorTip = false
      this.txtTipShow = accCause[this.causeFormArr].cause
      // this.openRegularPollingFn()
    },
    accingCause16Fn: function() {
      this.isShowSuccessTip = true
      this.isShowErrorTip = false
      this.txtTipShow = accCause[this.causeFormArr].cause
      // this.openRegularPollingFn()
    },
    openRegularPollingFn: function() {
      // 开启常规轮询
      clearInterval(this.stopSetIntervalForSU) // 清除加速中的轮询
      clearInterval(this.stopSetIntervalForRP) // 清除常规状态的轮询
      this.isOpenRegularPolling = true
      this.isChangeAccStatusOfRP = true
      this.regularPollingFn()// 开启常规轮询
    },
    clickBtnFn: function() {
      // 点击加速按钮
      if (this.status === 'INIT' && (this.event === 0 || this.event === 2 || this.event === 4)) {
        // 未登录
        this.clickToLoginViewFn()
      } else if (this.status === 'LOGIN_OK' && this.event === 6 && this.cause === 17) {
        window.open('http://www.qeeyou.cn/#/member/opening')
      }
      if (this.userType === 3 || this.userType === 7 || this.userType === 15) {
        window.open('http://www.qeeyou.cn/#/member/opening')
      }
    },
    clickToLoginViewFn: function() {
      // 未登录，点击进入登录页面
      this.$router.push('/member-login')
    },
    getRouteFn: function() {
      // 获取路由信息
      let path = this.$route.path
      if (path === '/') {
        this.focusStatus = true
        this.isDisabled = false
        // 开启常规轮询
        if (this.isOpenInitRG) {
          this.openInitCheckAccStateGetFn()
          this.openRegularPollingFn() // 开启常规轮询
        } else {
          this.isOpenInitRG = true
        }
      } else {
        this.isDisabled = true
        clearTimeout(this.stopInitSetTimeoutForRP)
        clearInterval(this.stopSetIntervalForRP)
        clearInterval(this.stopSetIntervalForSU)
        this.isOpenRegularPolling = false
        this.isChangeAccStatusOfRP = false
        this.$root.Bus.$emit('HiddenAppLoading')
      }
      this.isOpenInitRG = true
    },
    openInitCheckAccStateGetFn: function() {
      // 开启初始化检查acc_state_get
      clearInterval(this.stopSetIntervalForRP)
      if (this.isOpenInitRG) {
        clearInterval(this.stopSetIntervalForSU)
        this.apiInitCheckAccStateGetFn()
      }
      this.isOpenRegularPolling = false
      this.isChangeAccStatusOfRP = false
    },
    controlEmitFn: function() {
      // 根据状态改变this.isEmitBusCheckStateStatus
      if (this.status === 'LOGIN_OK' || this.status === 'ACC_OK') {
        if (this.status !== this.lastStatus) {
          this.isEmitBusCheckStateStatus = true
        } else {
          this.isEmitBusCheckStateStatus = false
        }
      } else {
        this.isEmitBusCheckStateStatus = false
      }
      if (this.status === 'LOGIN_OK' && this.lastStatus !== 'LOGIN_OK') {
        this.isEmitBusLoginOkStatus = true
      } else {
        this.isEmitBusLoginOkStatus = false
      }
    },
    dealAccountFailFn: function() {
      this.txtTipShow = this.$t('i18n.TIP_RENEW')
      this.isShowSuccessTip = false
      this.isShowErrorTip = true
      this.txtSpeedBtn = this.$t('i18n.RENEW_NOW')
      this.isShow = false
      this.isShowDelay = false
    },
    blurFn: function() {
      this.focusStatus = false
    }
  },
  created() {
    const pathIndex = this.$route.path
    // 页面初始化检测用户加速状态
    if (pathIndex === '/') {
      this.focusStatus = true
      this.openInitCheckAccStateGetFn()
      // 页面加载时，进入常规轮询状态
      this.stopInitSetTimeoutForRP = setTimeout(() => {
        this.regularPollingFn()
        clearTimeout(this.stopInitSetTimeoutForRP)
      }, 5637)
    }
    // 用户登录后，直接进入加速状态
    this.$root.Bus.$on('memberLoginSuccessOkBtn', data => {
      // 调用进入加速状态的方法
      // 调用开始加速的接口
      this.isOpenInitRG = false
      this.status = data
      clearInterval(this.stopSetIntervalForSU)
      clearInterval(this.stopSetIntervalForRP)
      this.isOpenRegularPolling = false
      this.isChangeAccStatusOfRP = false
      this.isStartApi = true
      // this.apiStartSpeedFn()
      this.apiAccStateGetForSU()
    })
    // 用户登出
    this.$root.Bus.$on('busSpeedUpBtnLoginout', () => {
      this.isShow = false
      this.isShowDelay = false
      this.isShowSpeedUpPng = false
      this.status = 'INIT'
      this.status = 2
      this.txtSpeedBtn = `${this.$t('i18n.LOGIN')}<br>${this.$t('i18n.QEE_YOU')}`
      this.apiAccStateGetForRP(this.isOpenRegularPolling)
      this.openRegularPollingFn() // 开启常规轮询
    })
    // 重新加速
    this.$root.Bus.$on('busRestartSpeedUp', () => {
      this.isOpenInitRG = false
      this.apiRestartSpeedFn()
    })
  },
  beforeDestroy() {
    this.$root.Bus.$off('memberLoginSuccessBtn')
    this.$root.Bus.$off('busSpeedUpBtnLoginout')
    this.$root.Bus.$off('busRestartSpeedUp')
    this.$root.Bus.$off('memberLoginSuccessOkBtn')
    // 清除常规状态的轮询
    clearInterval(this.stopSetIntervalForRP)
    // 清除加速状态的轮询
    clearInterval(this.stopSetIntervalForSU)
  },
  watch: {
    $route: 'getRouteFn' // 获取路由
  }
}
</script>

<style lang="scss" scoped>
.ljb-index-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 628px;
  float: left;
  background-color: #fff;
  border-radius: 6px;
  position: relative;
  box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.06);
  & > .btn-cover {
    border: 1px solid red;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border-radius: 6px;
    background-color: red;
    z-index: 99;
    opacity: 0;
    display: none;
    &.display-block {
      display: block;
    }
  }
  .login-tip {
    font-size: 14px;
    line-height: 50px;
    color: rgba(58, 56, 72, 1);
    width: 100%;
    height: 50px;
    background: linear-gradient(
      90deg,
      rgba(0, 159, 232, 0.1),
      rgba(0, 159, 232, 0)
    );
    border-radius: 6px 6px 0px 0px;
    position: absolute;
    top: 0;
    text-align: center;
    &.error-tip {
      background: linear-gradient(
        90deg,
        rgba(241, 68, 102, 0.1),
        rgba(241, 68, 102, 0)
      );
      color: rgba(241, 68, 102, 1);
    }
    &.success-tip {
      background:linear-gradient(90deg,rgba(0,159,232,0.1),rgba(0,159,232,0));
    }
  }
  .btn-container {
    width: 260px;
    height: 260px;
    margin: 0 auto;
    position: relative;
    transition: margin-top .5s;
    & > .restart {
      width: 60px;
      height: 60px;
      border-radius: 100%;
      background-color: #fff;
      position: absolute;
      right: -45px;
      bottom: 0px;
      box-shadow: 0 5px 15px 0 rgba(0, 159, 232, 0.2);
      cursor: pointer;
      border: 2px solid rgba(0, 159, 232, 0.2);
      transition: box-shadow .5s;
      z-index: 99;
      & > div {
        font-size: 0;
        border: none;
        position: absolute;
        width: 28px;
        height: 28px;
        background: url(../../../assets/images/icon/icon_refresh_hover.png) no-repeat;
        background-size: cover;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        &.hover-bg {
          background: url(../../../assets/images/icon/icon_refresh_hover.png) no-repeat;
          background-size: cover;
        }
      }
      &:hover {
        border-color: rgba(245, 245, 245, 1);
        background: linear-gradient(
          90deg,
          rgba(57, 193, 255, 1),
          rgba(0, 159, 232, 1)
        );
        box-shadow: 0 6px 20px 0 rgba(0, 159, 232, 0.7);
        & > div {
          background: url(../../../assets/images/icon/icon_refresh3.png) no-repeat;
          background-size: cover;
        }
      }
      &:focus {
        border-color: rgba(245, 245, 245, 1);
        background: linear-gradient(
          90deg,
          rgba(57, 193, 255, 1),
          rgba(0, 159, 232, 1)
        );
        box-shadow: 0 6px 20px 0 rgba(0, 159, 232, 0.7);
        & > div {
          background: url(../../../assets/images/icon/icon_refresh3.png) no-repeat;
          background-size: cover;
        }
      }
    }
  }
  .speed-up-circle1 {
    width: 260px;
    height: 260px;
    border: 5px solid rgba(0, 159, 232, 0.06);
    border-radius: 1000px;
    display: block;
    transition: box-shadow 0.3s, border-color 0.3s, margin-top 0.5s;
    cursor: pointer;
    position: relative;
    &:hover {
      box-shadow: 0px 4px 20px 0px rgba(0, 159, 232, 0.5);
      border-color: rgba(0, 159, 232, 0.8);
      text-decoration: none;
      .speed-up-circle2 {
        background: linear-gradient(
          0deg,
          rgba(137, 216, 255, 1),
          rgba(0, 175, 255, 1)
        );
      }
    }
    &:focus {
      box-shadow: 0px 4px 20px 0px rgba(0, 159, 232, 0.5);
      border-color: rgba(0, 159, 232, 0.8);
      text-decoration: none;
      .speed-up-circle2 {
        background: linear-gradient(
          0deg,
          rgba(137, 216, 255, 1),
          rgba(0, 175, 255, 1)
        );
      }
    }
  }
  .speed-up-circle2 {
    width: 200px;
    height: 200px;
    border-radius: 1000px;
    margin: -1px auto 0;
    padding-top: 1px;
    opacity: 0.7;
    background: linear-gradient(
      0deg,
      rgba(137, 216, 255, 0.7),
      rgba(0, 175, 255, 0.7)
    );
    filter: progid:DXImageTransform.Microsoft.gradient(
        startColorstr=rgba(137, 216, 255, 0.7),
        endColorstr=rgba(0, 175, 255, 0.7),
        GradientType=0
      );
    transition: background-color linear 0.5s;
    &:hover {
      background: linear-gradient(
        0deg,
        rgba(137, 216, 255, 1),
        rgba(0, 175, 255, 1)
      );
    }
  }
  .speed-up-circle3 {
    width: 168px;
    height: 168px;
    background-color: #fff;
    border-radius: 1000px;
    margin: 15px auto 16px;
    text-align: center;
    line-height: 192px;
    display: block;
    position: relative;
    & > h3 {
      line-height: 25px;
      color: rgba(58, 56, 72, 1);
      font-size: 18px;
      transition: color 0.5s;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .delay-lost {
    width: 324px;
    height: 0px;
    transition: height 0.5s, opacity 0.5s;
    overflow: hidden;
    opacity: 0;
    margin: 0 auto;
    & > div {
      width: 150px;
      height: 140px;
      background: linear-gradient(
        180deg,
        rgba(240, 243, 247, 1),
        rgba(255, 255, 255, 1)
      );
      border-radius: 6px;
    }
    & > .delay {
      float: left;
      position: relative;
    }
    & > .lost {
      margin-left: 180px;
      position: relative;
    }
    i {
      display: inline-block;
      width: 24px;
      height: 4px;
      background: rgba(6, 244, 32, 1);
      box-shadow: 0px 2px 8px 0px rgba(53, 255, 182, 1);
      border-radius: 0px 0px 100px 100px;
      position: absolute;
      left: 50%;
      margin-left: -12px;
    }
    .lost-icon {
      background: rgba(255, 34, 34, 1);
      box-shadow: 0px 2px 6px 0px rgba(255, 53, 53, 1);
      border-radius: 0px 0px 100px 100px;
    }
    h4 {
      font-size: 16px;
      color: rgba(131, 137, 161, 1);
      line-height: 22px;
      text-align: center;
      padding-top: 30px;
    }
    p {
      padding-top: 20px;
      text-align: center;
      font-size: 14px;
      color: rgba(141, 139, 142, 1);
      & > em {
        font-size: 36px;
        letter-spacing: 0;
        line-height: 43px;
        color: rgba(44, 42, 56, 1);
      }
    }
    &.opacity-delay {
      opacity: 1;
    }
  }
}
@media screen and (max-width: 1366px) {
  .ljb-index-left {
    height: 500px;
  }
}
.ljb-index-left.ljb-index-left-animation {
  .btn-container {
    transition: margin-top .5s;
    margin-bottom: 30px;
    margin-top: 40px;
  }
  .speed-up-circle2 {
    background: linear-gradient(
      0deg,
      rgba(137, 216, 255, 0.7),
      rgba(0, 175, 255, 0.7)
    );
    background-size: 100% 100%;
  }
  .delay-lost {
    height: 150px;
  }
}
.ljb-index-left {
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  -ms-transform: translateZ(0);
  -o-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-perspective: 1000;
  -moz-perspective: 1000;
  -ms-perspective: 1000;
  perspective: 1000;
  .speed-up-running {
    position: absolute;
    width: 200px;
    height: 200px;
    top: 25px;
    left: 25px;
    transform: rotate(90deg);
    background: url(../../../assets/images/icon/index-update.png) no-repeat;
    background-size: 100% 100%;
    animation: speed-btn 1s linear infinite;
    @keyframes speed-btn {
      0% {
        transform: rotate(0deg);
      }
      25% {
        transform: rotate(90deg);
      }
      50% {
        transform: rotate(180deg);
      }
      75% {
        transform: rotate(270deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
}
.btn-center {
  border: 1px solid red;
  width: 60px;
  height: 20px;
}
</style>
