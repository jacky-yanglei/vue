import {
  getUserDetailsApi
} from '../../../../api/user-manger-api'

export default {
  cause1(e, res) { // 用户登录
    if (!e.eventGetUserInfo) {
      getUserDetailsApi()
        .then((res) => {
          e.eventGetUserInfo = true
          e.eventLoginOut = false
          e.changeUserInfo(res)
        })
    }
  },
  cause3(e, res) { // 用户登出
    e.eventGetUserInfo = false
    if (!e.eventLoginOut) {
      e.changeUserInfo({
        userExpire: ''
      })
      e.eventLoginOut = true
    }
  },
  cause4(e, res) { // 占线处理
    e.$router.push({
      path: '/login-others',
      query: {
        status: res.status
      }
    })
  },
  cause5(e, res) { // 用户启动加速
    // 不处理
  },
  cause6(e, res) { // 从意外情况恢复加速
    // 不处理
    e.headText = e.$t('i18n.EVENT_CAUSE.CAUSE6')
  },
  cause7(e, res) { // WAN口网络恢复启动加速
    e.headText = e.$t('i18n.EVENT_CAUSE.CAUSE7')
  },
  cause8(e, res) { // 用户停止加速
    // todo 待定
  },
  cause9(e, res) { // 加速进程通知加速成功
    // 加速成功
  },
  cause10(e, res) { // WAN口通知中断加速断开
    e.isError = true
    e.headText = e.$t('i18n.EVENT_CAUSE.CAUSE10')
  },
  cause11(e, res) { // 加速进程通知加速断开
    e.isError = true
    e.headText = e.$t('i18n.EVENT_CAUSE.CAUSE11')
  },
  cause12(e, res) { // 加速通知超时检测到加速失败(加速进程启动成功，但是隧道未建立成功)
    e.headText = e.$t('i18n.EVENT_CAUSE.CAUSE12')
  },
  cause13(e, res) { // 加速通知超时检测到加速成功
    // 加速成功
  },
  cause14(e, res) { // 强制其它设备设备断开加速通道
    e.isError = true
    e.headText = e.$t('i18n.EVENT_CAUSE.CAUSE14')
  },
  cause15(e, res) { // 节点网络错误，请切换节点
    e.isError = true
    e.headText = e.$t('i18n.EVENT_CAUSE.CAUSE15')
  },
  cause16(e, res) { // 启动加速失败(加速进程启动失败)
    e.headText = e.$t('i18n.EVENT_CAUSE.CAUSE16')
  },
  cause17(e, res) { // 账号过期导致加速停止
    e.isError = true
    e.isTimeEnd = true
    e.headText = e.$t('i18n.EVENT_CAUSE.CAUSE17')
  }
}
