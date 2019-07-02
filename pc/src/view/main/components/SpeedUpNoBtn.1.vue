<template>
  <div class="ljb-index-left" :class="{'ljb-index-left-animation':isShow}">
    <div class="login-tip" :class="{'error-tip': isShowErrorTip}" v-show="isShowErrorTip">{{ txtTipShow }}</div>
    <div class="btn-container">
      <button :disabled="isDisabled" class="speed-up-circle1" @click.stop.prevent="indexLeftAnimatin()" v-focus="focusStatus">
        <div class="speed-up-circle2">
          <div class="speed-up-circle3">
            <h3 v-html="txtSpeedBtn"></h3>
          </div>
        </div>
        <div :class="{'speed-up-running': isShowSpeedUpPng}" ref="running"></div>
      </button>
      <button class="restart" @click.stop.prevent="restartFn()" v-show="isShowRestartBtn">
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
    <div class="btn-cover" :class="{'display-block': isShowBtnCover}"></div>
  </div>
</template>

<script>
import { accStateGet, accControlAction } from '@/api/speed-manage-api'
import { forceOfflineApi } from '@/api/user-manger-api'
export default {
  name: 'BeforeSpeedUp',
  data: function() {
    return {
      isShow: false,
      isStop: true,
      speedUpTip: [this.$t('i18n.SPEED_RUNNING'), this.$t('i18n.SPEED_SUCCESS')],
      start: Math.ceil(Math.random() * 180),
      tipShow: true,
      txtTipShow: this.$t('i18n.TIP_AUTO_SPEED'), // 提醒的文字
      delay: 34,
      loss: 0,
      focusStatus: true,
      stopAccStatusGet: '',
      txtSpeedBtn: '',
      isStopAnimation: false,
      isShowDelay: false,
      currentAccStatus: '',
      isShowRestartStatus: false,
      isShowRestartBtn: false,
      stopCheckSpeedChannel: '', // 停止检查加速通道被占用
      accOkStatus: '', // 记录acc_ok状态值
      isNotStopApi: false, // 如果不是stop传参，则传参，否则不传参
      isShowErrorTip: false, // 用户加速失败时的错误提醒
      isShowSpeedUpPng: false, // 是否显示加速动画效果的圆圈图片
      isDisabled: false, // 是否禁止button标签的focus效果
      isShowBtnCover: false, // 是否显示遮罩层
      userConflict: '', // 通道是否被占用
      loginAccState: '', // 在status为login_ok时，accState的值
      isOpenRegularPolling: true, // 是否开启常规状态的轮询，默认true,开启
      accingUserConflict: 0, // 记录在accing状态时，userConflict的值
      isDealViewByRegularPolling: true, // 是否通过常规轮询处理视图效果,默认为true
      isCheckLoginStatus: true // 是否检查登录状态
    }
  },
  methods: {
    indexLeftAnimatin: function() {
      //  需要判断是在加速时，才执行加速效果
      // console.log(this.txtSpeedBtn, this.userConflict, this.currentAccStatus)
      // 判断当前的状态，如果未登录，就进入登录，如果登录就进入加速
      if (this.currentAccStatus === 'INIT') {
        let aa = setTimeout(() => {
          this.isShowBtnCover = false // 隐藏遮罩层
          clearTimeout(aa)
        }, 500)
        this.$router.push('/member-login')
      } else if (this.currentAccStatus === 'LOGIN_OK' && this.txtSpeedBtn === '一键加速') {
        this.isStopAnimation = false // 停止旋转动画{false:停止；true:开始}
        this.isShowDelay = false // 隐藏延迟视图
        this.isShow = true // 将加速按钮向上移动
        this.isShowSpeedUpPng = true // 显示旋转图片
        this.isShowRestartBtn = false // 不显示重新加速按钮
        this.isShowBtnCover = true // 显示遮罩层
        window.requestAnimationFrame(this.speedUpRunning)
        this.apiStartAccControlActionFn()
        this.isOpenRegularPolling = false // 关闭常规状态的轮询
        this.isDealViewByRegularPolling = false // 禁止常规轮询处理视图
      } else if (this.currentAccStatus === 'ACC_OK' && this.txtSpeedBtn === '停止加速') {
        // console.log('停止加速')
        this.isStopAnimation = false // 停止旋转动画
        this.isShowSpeedUpPng = true // 显示旋转图片
        this.isShowBtnCover = true // 显示遮罩层
        window.requestAnimationFrame(this.speedUpRunning)
        this.apiStopAccControlActionFn()
        this.isOpenRegularPolling = false // 关闭常规状态的轮询
        this.isDealViewByRegularPolling = false // 禁止常规轮询处理视图
      } else if (this.userConflict === 1 || this.userConflict === 13) {
        if (this.txtSpeedBtn === '强制下线') {
          // console.log('调用强制下线的方法')
          this.txtSpeedBtn = '正在强制下线'
          this.isShowSpeedUpPng = true // 显示旋转图片
          this.isShowBtnCover = true // 显示遮罩层
          this.apiForceOfflineFn()
          this.isOpenRegularPolling = false // 关闭常规状态的轮询
          this.isDealViewByRegularPolling = false // 禁止常规轮询处理视图
        }
      }
    },
    speedUpRunning: function() {
      if (this.isStopAnimation) {
        // 控制重新加速按钮的显示与否
        if (this.currentAccStatus === 'ACC_OK') {
          // this.isShowRestartBtn = true
        } else {
          this.isShowRestartBtn = false
        }
      }
    },
    apiStartAccControlActionFn: function() {
      this.$root.Bus.$emit('busShowCover', true)
      this.isOpenRegularPolling = false // 关闭常规状态的轮询
      this.isDealViewByRegularPolling = false // 禁止常规轮询处理视图
      // 启动加速
      let apiData = {
        action: 'start'
      }
      accControlAction(apiData)
        .then(data => {
          this.isNotStopApi = true
          this.apiAccStateGetFn()
          this.txtSpeedBtn = '正在启动加速'
        })
        .catch(e => {
          this.isStopAnimation = true // 停止旋转动画
          this.isShow = false // 将加速按钮向下移动
          this.isShowSpeedUpPng = false // 隐藏旋转图片
          this.$root.Bus.$emit('busShowCover', false)
          let aa = setTimeout(() => {
            this.isShowBtnCover = false // 隐藏遮罩层
            clearTimeout(aa)
          }, 500)
          this.isShowErrorTip = true
          this.txtTipShow = '加速失败，请重新一键加速'
          this.txtSpeedBtn = '一键加速'
          this.currentAccStatus = 'LOGIN_OK'
        })
    },
    apiStopAccControlActionFn: function() {
      this.txtSpeedBtn = '正在停止加速'
      this.$root.Bus.$emit('busShowCover', true)
      this.isOpenRegularPolling = false // 关闭常规状态的轮询
      this.isDealViewByRegularPolling = false // 禁止常规轮询处理视图
      // 停止加速
      let apiData = {
        action: 'stop'
      }
      accControlAction(apiData)
        .then(data => {
          this.isNotStopApi = false
          this.apiAccStateGetFn()
        })
        .catch(e => {
          // console.log('对相应错误进行提示')
          this.isStopAnimation = true // 停止旋转动画
          this.isShow = false // 将加速按钮向下移动
          this.isShowSpeedUpPng = false // 隐藏旋转图片
          this.$root.Bus.$emit('busShowCover', false)
          let aa = setTimeout(() => {
            this.isShowBtnCover = false // 隐藏遮罩层
            clearTimeout(aa)
          }, 500)
        })
    },
    apiAccStateGetFn: function() {
      // 获取加速状态
      let apiData
      if (this.isNotStopApi) {
        apiData = {
          status: 'ACCING'
        }
      } else {
        apiData = {}
      }
      this.stopAccStatusGet = setInterval(() => {
        accStateGet(apiData)
          .then(data => {
            this.currentAccStatus = data.status
            let status = data.status
            this.accOkStatus = status // 记录acc_ok状态值
            this.delay = data.accNodePing // 赋值延时
            this.loginAccState = parseInt(data.accState) // 获取当前加速状态
            this.userConflict = parseInt(data.userConflict) // 获取当前加速通道的占用情况
            if (data.ret === 0) { // 非accing状态
              if (this.userConflict === 0 || this.userConflict === 8 || this.accingUserConflict === 0) {
                this.isShowErrorTip = false // 隐藏顶部错误提醒
                if (this.accOkStatus === 'ACC_OK') { // 加速成功的状态
                  this.isShow = true // 将加速按钮向上移动
                  this.isShowSpeedUpPng = false // 隐藏旋转图片
                  this.isShowDelay = true // 显示延迟的效果
                  this.isShowErrorTip = false // 隐藏加速失败时的错误提醒
                  // setTimeout(() => {
                  this.isStopAnimation = true // 停止旋转动画
                  this.txtSpeedBtn = '停止加速'
                  this.$root.Bus.$emit('busShowCover', false)
                  let aa = setTimeout(() => {
                    this.isShowBtnCover = false // 隐藏遮罩层
                    clearTimeout(aa)
                  }, 500)
                  // }, 3000)
                  clearInterval(this.stopAccStatusGet)
                  let m = setTimeout(() => {
                    this.isShowRestartBtn = true // 显示重新加速按钮
                    clearTimeout(m)
                  }, 1000)
                  this.isOpenRegularPolling = true // 开启常规轮询
                  this.isDealViewByRegularPolling = true // 开启常规轮询处理视图
                } else if (status === 'LOGIN_OK') {
                  this.isStopAnimation = true // 停止旋转动画
                  this.isShowDelay = false // 隐藏延迟视图
                  this.txtSpeedBtn = '一键加速'
                  this.isShow = false // 将加速按钮向下移动
                  this.isShowSpeedUpPng = false // 隐藏旋转图片
                  this.$root.Bus.$emit('busShowCover', false)
                  let aa = setTimeout(() => {
                    this.isShowBtnCover = false // 隐藏遮罩层
                    clearTimeout(aa)
                  }, 500)
                  this.isShowRestartBtn = false // 隐藏重新加速按钮
                  if (this.loginAccState === 0) {
                    // 表明是登录未加速
                    this.isShowErrorTip = false // 隐藏加速失败时的错误提醒
                    this.txtTipShow = ''
                  } else if (this.loginAccState === 2) {
                    // 表明登录但加速失败，可能是节点或模式导致加速失败
                    this.isShowErrorTip = true // 显示加速失败时的错误提醒
                    this.txtTipShow = '加速失败，请重新加速或更换模式加速' // 在加速失败时的错误文字提醒赋值
                  } else if (this.loginAccState === 3) {
                    // 可能出现了断网
                    this.isShowErrorTip = true // 显示加速失败时的错误提醒
                    this.txtTipShow = '加速失败，请检查网络连接或更换网络连接' // 在加速失败时的错误文字提醒赋值
                  }
                  clearInterval(this.stopAccStatusGet)
                  this.isOpenRegularPolling = true // 开启常规轮询
                  this.isDealViewByRegularPolling = true // 开启常规轮询处理视图
                }
              } else if (this.userConflict === 1 || this.userConflict === 13 || this.accingUserConflict === 1) {
                this.$root.Bus.$emit('busShowCover', false) // 隐藏主界面按钮的遮罩层
                let aa = setTimeout(() => {
                  this.isShowBtnCover = false // 隐藏遮罩层
                  clearTimeout(aa)
                }, 500)
                if (status === 'LOGIN_OK') {
                  // 加速通道被占用
                  // this.$router.push('/login-others')
                  this.txtTipShow = '加速通道被占用'
                  this.isShowErrorTip = true // 显示顶部错误提醒
                  this.txtSpeedBtn = '强制下线'
                } else if (status === 'INIT') {
                  this.txtTipShow = ''
                  this.isShowErrorTip = false // 隐藏顶部错误提醒
                  this.txtSpeedBtn = `${this.$t('i18n.LOGIN')}<br>${this.$t('i18n.QEE_YOU')}` // 同步更改视图为登录状态
                }
                this.isOpenRegularPolling = true // 开启常规轮询
                this.isDealViewByRegularPolling = true // 开启常规轮询处理视图
              }
            } else if (data.ret === 1) { // accing状态
              // 返回加速中的状态,在调用获取加速结果的接口
              this.accingUserConflict = 0
              // this.apiAccStateGetFn()
              // this.isShowRestartBtn = false // 隐藏重新加速按钮
              this.isOpenRegularPolling = false // 关闭常规轮询
              this.isDealViewByRegularPolling = false // 禁止常规轮询处理视图
            }
          })
          .then(() => {
            if (this.accOkStatus === 'ACC_OK') {
              // 轮询查看acc_ok的状态，用于检测加速通道被占用的情况
              // this.apiCheckSpeedChannelFn()
              // this.isShowRestartBtn = true
            }
          })
          .catch(e => {
            // console.log(e, '221')
            // 改变视图样式
            this.isShow = false // 将加速按钮向下移动
            this.isShowSpeedUpPng = false // 隐藏旋转图片
            this.isStopAnimation = true // 停止旋转动画
            this.isShowErrorTip = true // 显示顶部错误提醒
            this.isShowRestartBtn = false // 隐藏重新加速按钮
            let aa = setTimeout(() => {
              this.isShowBtnCover = false // 隐藏遮罩层
              clearTimeout(aa)
            }, 500)
            let o = typeof (e)
            // 注意：这里的e返回的可能是一个对象
            if (e.ret && e.ret === -1) {
              this.userConflict = parseInt(e.userConflict)
              if (this.userConflict === 0 || this.userConflict === 8) {
                // console.log(e.msg, '234')
                // 通道未被占用
                this.txtSpeedBtn = '一键加速'
                setTimeout(() => {
                  this.$root.Bus.$emit('busShowCover', false)
                  let aa = setTimeout(() => {
                    this.isShowBtnCover = false // 隐藏遮罩层
                    clearTimeout(aa)
                  }, 500)
                  this.currentAccStatus = e.status
                }, 500)
                // 错误提醒
                this.txtTipShow = '加速失败，请重新加速或更换模式加速'
              } else if (this.userConflict === 1 || this.userConflict === 13) {
                // 加速通道被占用
                this.txtTipShow = '加速通道被占用'
                this.txtSpeedBtn = '强制下线'
                this.isShowSpeedUpPng = false // 隐藏加速旋转效果
                this.$root.Bus.$emit('busShowCover', false) // 隐藏主界面按钮的遮罩层
                let aa = setTimeout(() => {
                  this.isShowBtnCover = false // 隐藏遮罩层
                  clearTimeout(aa)
                }, 500)
                // this.$router.push('/login-others')
              }
            } else {
              if (o === 'object') {
                // console.log(e.msg, '254')
                this.txtTipShow = e.msg
              } else {
                this.txtTipShow = e || '网络未连接或与服务器断开'
              }
              this.$root.Bus.$emit('busShowCover', false)
              let aa = setTimeout(() => {
                this.isShowBtnCover = false // 隐藏遮罩层
                clearTimeout(aa)
              }, 500)
              this.isShowSpeedUpPng = false
            }
            this.isOpenRegularPolling = true // 开启常规轮询状态
            this.isDealViewByRegularPolling = true // 开启常规轮询处理视图
          })
      }, 600)
    },
    apiInitCheckAccStateGetFn: function() {
      // 检查登录状态
      accStateGet()
        .then(data => {
          let status = data.status
          this.currentAccStatus = data.status
          this.delay = data.accNodePing // 赋值延时
          this.userConflict = parseInt(data.userConflict) // 判断加速通道是否占用
          this.loginAccState = parseInt(data.accState) // 获取当前加速状态
          if (this.userConflict === 0 || this.userConflict === 8) {
            let aa = setTimeout(() => {
              this.isShowBtnCover = false // 隐藏遮罩层
              clearTimeout(aa)
            }, 500)
            // 加速通道未被占用
            if (status === 'INIT') {
              this.txtSpeedBtn = `${this.$t('i18n.LOGIN')}<br>${this.$t('i18n.QEE_YOU')}`
              this.isShowRestartBtn = false // 隐藏重新加速按钮
            } else if (status === 'LOGIN_OK') {
              this.txtSpeedBtn = '一键加速'
              this.isShowRestartBtn = false // 隐藏重新加速按钮
              this.isShowSpeedUpPng = false // 隐藏加速旋转效果
              if (this.loginAccState === 0) {
                // 表明是登录未加速
                this.isShowErrorTip = false // 隐藏加速失败时的错误提醒
                this.txtTipShow = ''
              } else if (this.loginAccState === 2) {
                // 表明登录但加速失败，可能是节点或模式导致加速失败
                this.isShowErrorTip = true // 显示加速失败时的错误提醒
                this.txtTipShow = '加速失败，请重新加速或更换模式加速' // 在加速失败时的错误文字提醒赋值
              } else if (this.loginAccState === 3) {
                // 可能出现了断网
                this.isShowErrorTip = true // 显示加速失败时的错误提醒
                this.txtTipShow = '加速失败，请检查网络连接或更换网络连接' // 在加速失败时的错误文字提醒赋值
              }
            } else if (status === 'ACC_OK') {
              this.txtSpeedBtn = '停止加速'
              this.isShowDelay = true
              this.isShow = true // 将加速按钮向上移动
              this.isShowSpeedUpPng = false // 隐藏旋转图片
              let t = setTimeout(() => {
                this.isShowRestartBtn = true // 显示重新加速按钮
                clearTimeout(t)
              }, 500)
            } else if (status === 'ACCING') {
              this.txtSpeedBtn = '正在启动加速'
              this.isShow = true
              this.isShowSpeedUpPng = true // 显示旋转图片
              this.isStopAnimation = false
              this.$root.Bus.$emit('busShowCover', true)
              this.speedUpRunning()
              // setTimeout(() => {
              //   this.apiCheckSpeedChannelFn()
              // }, 1000)
            }
          } else if (this.userConflict === 1 || this.userConflict === 13) {
            if (status === 'LOGIN_OK') {
              // 加速通道被占用
              // this.$router.push('/login-others')
              this.txtTipShow = '加速通道被占用'
              this.isShowErrorTip = true // 显示顶部错误提醒
              this.txtSpeedBtn = '强制下线'
            } else if (status === 'INIT') {
              this.txtTipShow = ''
              this.isShowErrorTip = false // 隐藏顶部错误提醒
              this.txtSpeedBtn = `${this.$t('i18n.LOGIN')}<br>${this.$t('i18n.QEE_YOU')}` // 同步更改视图为登录状态
            }
            this.isShowSpeedUpPng = false // 隐藏加速旋转效果
            this.$root.Bus.$emit('busShowCover', false) // 隐藏主界面按钮的遮罩层
            let aa = setTimeout(() => {
              this.isShowBtnCover = false // 隐藏遮罩层
              clearTimeout(aa)
            }, 500)
          }
          this.isOpenRegularPolling = true // 开启常规轮询状态
          this.isDealViewByRegularPolling = true // 开启常规轮询处理视图
        })
        .catch(e => {
          this.isShowErrorTip = true // 显示加速失败时的错误提醒
          let o = typeof (e)
          if (o === 'object') {
            // console.log(e.msg, '315')
            this.txtTipShow = e.msg || '网络未连接或与服务器断开'
          } else {
            this.txtTipShow = e || '网络未连接或与服务器断开'
          }
          this.$root.Bus.$emit('busShowCover', false)
          this.isOpenRegularPolling = true // 开启常规轮询状态
          this.isDealViewByRegularPolling = true // 开启常规轮询处理视图
        })
    },
    getRouteFn: function() {
      const pathStr = this.$route.path
      if (pathStr === '/') {
        // 检查登录状态
        // this.apiInitCheckAccStateGetFn()
        // 不禁止button的focus效果
        this.isDisabled = false
        clearInterval(this.stopCheckSpeedChannel)
        this.apiCheckSpeedChannelFn()
      } else {
        // 禁止button的focus效果
        this.isDisabled = true
        clearInterval(this.stopCheckSpeedChannel)
        clearInterval(this.stopAccStatusGet)
        this.$root.Bus.$emit('HiddenAppLoading')
      }
    },
    toggleSpeedUpBtnFn: function() {
      this.txtSpeedBtn = `${this.$t('i18n.LOGIN')}<br>${this.$t('i18n.QEE_YOU')}` // 同步更改视图为登录状态
      this.isShowDelay = false // 隐藏延迟视图
      this.isShow = false // 将加速按钮向下移动
      this.isShowSpeedUpPng = false // 隐藏旋转图片
      this.isStopAnimation = false
      this.isShowRestartBtn = false // 隐藏重新加速按钮
      this.currentAccStatus = 'INIT' // 将当前状态切换为未登录的状态
    },
    restartFn: function() {
      // 重新加速按钮
      this.apiRestartAccControlActionFn()
      this.isShow = true // 将加速按钮向上移动
      this.isShowSpeedUpPng = true // 显示旋转图片
      this.isStopAnimation = false
      this.isShowRestartStatus = true
      this.isShowDelay = false // 隐藏延迟视图
      this.speedUpRunning()
      this.txtSpeedBtn = '正在启动加速'
      this.isShowBtnCover = true // 显示遮罩层
    },
    apiRestartAccControlActionFn: function() {
      this.$root.Bus.$emit('busShowCover', true)
      this.isOpenRegularPolling = false // 关闭常规状态的轮询
      this.isDealViewByRegularPolling = false // 禁止常规轮询处理视图
      // 重新加速
      let apiData = {
        action: 'restart'
      }
      accControlAction(apiData)
        .then(data => {
          this.isNotStopApi = true // 判断不是传stop参数
          this.apiAccStateGetFn()
          this.isShowErrorTip = false // 隐藏加速失败时的错误提醒
          this.txtTipShow = '' // 在加速失败时的错误文字提醒赋值为空
        })
        .catch(e => {
          // console.log(e, '412')
          this.isStopAnimation = true // 停止旋转动画
          // this.isShow = false // 将加速按钮向下移动
          this.isShowSpeedUpPng = false // 隐藏旋转图片
          this.$root.Bus.$emit('busShowCover', false)
          let aa = setTimeout(() => {
            this.isShowBtnCover = false // 隐藏遮罩层
            clearTimeout(aa)
          }, 500)
          this.isShowErrorTip = true
          this.txtTipShow = '重新加速失败，请重新加速'
          this.txtSpeedBtn = '停止加速'
          this.currentAccStatus = 'ACC_OK'
          this.isOpenRegularPolling = true // 开启常规状态的轮询
          this.isDealViewByRegularPolling = true // 开启常规轮询处理视图
        })
    },
    apiCheckSpeedChannelFn: function() {
      // 检查加速通道是否被占用
      this.stopCheckSpeedChannel = setInterval(() => {
        this.regularPollingFn(this.isOpenRegularPolling) // 调用常规状态轮询的方法
      }, 3970)
    },
    regularPollingFn: function(data) {
      // 常规状态的轮询
      if (data) {
        // 开启常规状态轮询
        // console.log('开启')
        clearInterval(this.stopAccStatusGet)
        accStateGet()
          .then(data => {
            // console.log('请求ok', 466)
            this.delay = data.accNodePing // 赋值延时
            this.currentAccStatus = data.status
            // 处理加速通道被占用
            this.userConflict = parseInt(data.userConflict)
            if (this.userConflict === 1 || this.userConflict === 13) {
              if (data.status === 'LOGIN_OK') {
                // 加速通道被占用
                this.txtTipShow = '加速通道被占用'
                // this.$touter.push('/login-others')
                this.isShowErrorTip = true // 显示顶部错误提醒
                this.txtSpeedBtn = '强制下线'
              } else if (data.status === 'INIT') {
                // 未登录
                this.txtTipShow = ''
                this.isShowErrorTip = false // 隐藏顶部错误提醒
                this.txtSpeedBtn = `${this.$t('i18n.LOGIN')}<br>${this.$t('i18n.QEE_YOU')}` // 同步更改视图为登录状态
              }
              this.isShowSpeedUpPng = false // 隐藏加速旋转效果
              this.$root.Bus.$emit('busShowCover', false) // 隐藏主界面按钮的遮罩层
              let aa = setTimeout(() => {
                this.isShowBtnCover = false // 隐藏遮罩层
                clearTimeout(aa)
              }, 500)
            } else if (this.userConflict === 0 || this.userConflict === 8) {
              this.isShowErrorTip = false // 隐藏顶部错误提醒
              // 根据加速状态改变相应的视图效果
              if (this.isDealViewByRegularPolling) {
                this.dealSpeedUpBtnViewFn(data)
              }
            }
          })
          .catch(e => {
            // console.log(e.mag, '409')
            this.isShowErrorTip = true // 隐藏加速失败时的错误提醒
            if (e.msg) {
              this.txtTipShow = e.msg // 在加速失败时的错误文字提醒赋值
            } else {
              this.txtTipShow = '网络未连接或与服务器断开'
            }
            this.isShowSpeedUpPng = false // 隐藏加速旋转效果
          })
      } else {
        // 关闭常规状态轮询
        // console.log('关闭')
      }
    },
    dealSpeedUpBtnViewFn: function(data) {
      let status = data.status
      this.loginAccState = parseInt(data.accState) // 获取当前加速状态
      // 加速通道未被占用
      if (status === 'INIT') {
        let aa = setTimeout(() => {
          this.isShowBtnCover = false // 隐藏遮罩层
          clearTimeout(aa)
        }, 500)
        this.txtSpeedBtn = `${this.$t('i18n.LOGIN')}<br>${this.$t('i18n.QEE_YOU')}`
        this.isShowRestartBtn = false // 隐藏重新加速按钮
        this.$root.Bus.$emit('memberLoginOut')
        this.$root.Bus.$emit('busToShowLoginOutBtn', false) // 不显示登录按钮
        this.$root.Bus.$emit('busIndexSpeedUp')
        this.isShow = false
        this.isShowDelay = false
        this.$root.Bus.$emit('busCheckLoginOkStatus', false)
        this.isCheckLoginStatus = true
      } else if (status === 'LOGIN_OK') {
        this.txtSpeedBtn = '一键加速'
        this.$root.Bus.$emit('busToShowLoginOutBtn', true) // 显示登出按钮
        if (this.loginAccState === 0) {
          // 表明是登录未加速
          this.isShowErrorTip = false // 隐藏加速失败时的错误提醒
          this.txtTipShow = ''
          if (this.isCheckLoginStatus) {
            this.$root.Bus.$emit('busCheckLoginOkStatus', true, status)
            this.isCheckLoginStatus = false
          }
        } else if (this.loginAccState === 2) {
          // 表明登录但加速失败，可能是节点或模式导致加速失败
          this.isShowErrorTip = true // 显示加速失败时的错误提醒
          this.txtTipShow = '加速失败，请重新加速或更换模式加速' // 在加速失败时的错误文字提醒赋值
          this.$root.Bus.$emit('busCheckLoginOkStatus', false)
          this.isCheckLoginStatus = false
        } else if (this.loginAccState === 3) {
          // 可能出现了断网
          this.isShowErrorTip = true // 显示加速失败时的错误提醒
          this.txtTipShow = '加速失败，请检查网络连接或更换网络连接' // 在加速失败时的错误文字提醒赋值
          this.$root.Bus.$emit('busCheckLoginOkStatus', false)
          this.isCheckLoginStatus = false
        }
        this.isShowSpeedUpPng = false // 隐藏加速旋转按钮
        this.isShowRestartBtn = false // 隐藏重新加速按钮
        this.isShowDelay = false // 隐藏延迟的视图
        this.isShow = false // 夹加速按钮向下移动
        this.$root.Bus.$emit('busShowCover', false) // 隐藏遮罩层
        let aa = setTimeout(() => {
          this.isShowBtnCover = false // 隐藏遮罩层
          clearTimeout(aa)
        }, 500)
      } else if (status === 'ACC_OK') {
        // this.txtSpeedBtn = '加速成功'
        this.isShowDelay = true // 显示延时的视图
        this.$root.Bus.$emit('busToShowLoginOutBtn', true) // 显示登出按钮
        // setTimeout(() => {
        //   this.txtSpeedBtn = '停止加速'
        //   this.isShowSpeedUpPng = false // 隐藏旋转的图片
        // }, 3000)
        this.txtSpeedBtn = '停止加速'
        this.isShowSpeedUpPng = false
        this.isShow = true // 将加速按钮向上移动
        // this.isShowSpeedUpPng = true // 显示旋转图片
        let t = setTimeout(() => {
          this.isShowRestartBtn = true // 显示重新加速按钮
          clearTimeout(t)
        }, 500)
        this.isStopAnimation = true // 停止加速旋转动画
        let aa = setTimeout(() => {
          this.isShowBtnCover = false // 隐藏遮罩层
          clearTimeout(aa)
        }, 500)
        this.$root.Bus.$emit('busShowCover', false)
        this.isCheckLoginStatus = true
      } else if (status === 'ACCING') {
        this.$root.Bus.$emit('busToShowLoginOutBtn', true) // 显示登出按钮
        this.txtSpeedBtn = '正在启动加速'
        this.isShow = true
        this.isShowSpeedUpPng = true // 显示旋转图片
        this.isStopAnimation = false
        this.$root.Bus.$emit('busShowCover', true)
        this.speedUpRunning()
        this.isShowBtnCover = true // 显示遮罩层
        this.$root.Bus.$emit('busShowCover', false)
        this.isCheckLoginStatus = true
      }
    },
    apiForceOfflineFn: function() {
      forceOfflineApi()
        .then((data) => {
          // console.log(data, '504')
          // 隐藏顶部错误提醒
          this.isShowErrorTip = false
          this.txtSpeedBtn = '强制下线成功'
          // 调用加速的接口
          setTimeout(() => {
            this.apiStartAccControlActionFn()
          }, 3000)
        })
        .catch((e) => {
          // console.log(e, '514')
          this.txtTipShow = '强制下线'
          this.txtTipShow = '强制对方下线失败...'
          this.isShowErrorTip = true
          this.isShowSpeedUpPng = false // 隐藏旋转图片
          let aa = setTimeout(() => {
            this.isShowBtnCover = false // 隐藏遮罩层
            clearTimeout(aa)
          }, 500)
        })
    },
    changeToLoginSuccessFn: function() {
      this.txtSpeedBtn = '一键加速'
      this.currentAccStatus = 'LOGIN_OK'
      this.$root.Bus.$emit('busToShowLoginOutBtn', true) // 显示登出按钮
    }
  },
  created() {
    this.apiInitCheckAccStateGetFn()
    this.$root.Bus.$on('busSpeedUpBtn', () => {
      // console.log('触发了', '525')
      this.toggleSpeedUpBtnFn()
    })
    this.$root.Bus.$on('busSaveSpeedStatus', data => {
      // console.log(data)
      this.isShowRestartBtn = data
      if (this.currentAccStatus === 'LOGIN_OK') {
        this.isShowRestartBtn = false
      }
    })
    this.$root.Bus.$on('Forced', () => {
      // 调用加速接口（start）
      this.apiStartAccControlActionFn()
    })
    let a = setTimeout(() => {
      this.apiCheckSpeedChannelFn()
      clearTimeout(a)
    }, 4000)
    this.$root.Bus.$on('busStopLoopAccStateGet', () => {
      clearInterval(this.stopAccStatusGet)
      clearTimeout(this.stopCheckSpeedChannel)
    })
    this.$root.Bus.$on('memberLoginSuccessBtn', () => {
      this.changeToLoginSuccessFn()
    })
  },
  beforeDestroy() {
    this.$root.Bus.$off('busSpeedUpBtn')
    this.$root.Bus.$off('busStopLoopAccStateGet')
    this.$root.Bus.$off('Forced')
    this.$root.Bus.$off('memberLoginSuccessBtn')
    this.$root.Bus.$off('busSaveSpeedStatus')
    clearInterval(this.stopCheckSpeedChannel)
    clearInterval(this.stopAccStatusGet)
  },
  watch: {
    $route: 'getRouteFn'
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
    text-align: center;
    &.error-tip {
      font-size: 14px;
      line-height: 50px;
      color: rgba(58, 56, 72, 1);
      width: 704px;
      height: 50px;
      background: linear-gradient(
        90deg,
        rgba(241, 68, 102, 0.1),
        rgba(241, 68, 102, 0)
      );
      border-radius: 6px 6px 0px 0px;
      position: absolute;
      top: 0;
      text-align: center;
      color: rgba(241, 68, 102, 1);
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
