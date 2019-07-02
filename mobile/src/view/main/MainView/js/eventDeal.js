import eventCause from './eventCause'

export default {
  event0(e, res) { // 初始化操作后
    this.event2(e, res)
  },
  event1(e, res) { // 登录
    e.isLogin = true
    e.speeding = false
    e.isSpeedOk = false
    e.isError = false
    eventCause['cause' + res.cause](e, res)
  },
  event2(e, res) { // 登出
    e.text = `${e.$t('i18n.LOGIN')}<br />QeeYou`
    e.headText = e.$t('i18n.NO_LOGIN_HEAD_INFO')
    e.isLogin = false
    e.speeding = false
    e.isSpeedOk = false
    e.isTimeEnd = false
    e.isError = false
    eventCause['cause' + res.cause](e, res)
  },
  event3(e) { // 登录成功
    e.isLogin = true
    e.speeding = false
    e.isSpeedOk = false
    e.isTimeEnd = false
    e.isError = false
  },
  event4(e, res) { // 登录失败， 暂不处理
    e.text = `${e.$t('i18n.LOGIN')}<br />QeeYou`
    e.headText = e.$t('i18n.NO_LOGIN_HEAD_INFO')
    e.isLogin = false
    e.speeding = false
    e.isSpeedOk = false
    e.tips.show = true
    e.tips.type = 'error'
    e.tips.msg = e.$t('i18n.LOGIN_FAIL')
    e.isTimeEnd = false
    e.isError = false
  },
  event5(e, res) { // 启动加速
    e.text = e.$t('i18n.STARTING_SPEED')
    e.headText = e.$t('i18n.STARTING_SPEED_HEAD_INFO')
    e.speeding = true
    e.isLogin = true
    e.isSpeedOk = false
    e.isTimeEnd = false
    e.isError = false
    eventCause['cause' + res.cause](e, res)
  },
  event6(e, res) { // 停止加速
    e.text = e.$t('i18n.NOT_SPEED')
    e.headText = e.$t('i18n.NOT_SPEED')
    e.isLogin = true
    e.speeding = false
    e.isSpeedOk = false
    e.isTimeEnd = false
    e.isError = false
    eventCause['cause' + res.cause](e, res)
  },
  event7(e, res) { // 加速成功
    e.text = e.$t('i18n.SPEED_SUCCESS')
    e.headText = e.$t('i18n.SPEED_SUCCESS')
    e.isTimeEnd = false
    e.isLogin = true
    e.speeding = false
    e.isSpeedOk = true
    e.isError = false
  },
  event8(e, res) { // 加速失败
    e.text = e.$t('i18n.STARTING_SPEED')
    e.headText = e.$t('i18n.STARTING_SPEED_HEAD_INFO')
    e.speeding = true
    e.isLogin = true
    e.isSpeedOk = false
    e.isTimeEnd = false
    e.isError = false
    eventCause['cause' + res.cause](e, res)
  },
  event9(e, res) { // 重新启动加速
    e.text = e.$t('i18n.STARTING_SPEED')
    e.headText = e.$t('i18n.STARTING_SPEED_HEAD_INFO')
    e.speeding = true
    e.isLogin = true
    e.isSpeedOk = false
    e.isTimeEnd = false
    e.isError = false
    eventCause['cause' + res.cause](e, res)
  }
}
