export default {
  apiErrorDealFn: function (res) {
    // 处理接口请求错误的信息
    let code, msg, str
    let o = typeof (res)
    if (o === 'object') {
      code = res.code
      str = this.getCodeMsgFn(code)
      msg = this.$t('i18n.ERROR_CODE.' + str)
    } else {
      msg = res
    }
    return msg
  },
  compareVersion: function (ver1, ver2) {
    // 比较版本信息
    console.log(ver1, ver2)
    // ver1 : 表示当前版本(最低兼容版本)； ver2 ： 表示最新版本（当前版本）
    let reg = /^\d{1,}.\d{1,}.\d{1,}/
    let v1 = reg.exec(ver1)[0].split('.')
    let v2 = reg.exec(ver2)[0].split('.')
    let arrV1 = []
    let arrV2 = []
    v1.forEach((val, key) => {
      arrV1.push(parseInt(val))
    })
    v2.forEach((val) => {
      arrV2.push(parseInt(val))
    })
    if (arrV1[0] < arrV2[0]) {
      // 当前版本小于最新版本,需要升级,返回true： 需要升级；返回false： 不需要升级
      // 最低兼容版本 小于当前版本，不需要升级，返回true,否则会返回false,需要升级
      return true
    } else if (arrV1[0] === arrV2[0]) {
      if (arrV1[1] < arrV2[1]) {
        return true
      } else if (arrV1[1] === arrV2[1]) {
        if (arrV1[2] < arrV2[2]) {
          return true
        } else if (arrV1[2] === arrV2[2]) {
          return false
        }
      }
    } else {
      return false // 处理当前测试阶段的版本号高于最新版的情况
    }
  },
  /**
   * name String 需要从Cookie中获取的用户名
   */
  getCookie: function(name) {
    let arr
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    arr = document.cookie.match(reg)
    if (arr) return unescape(arr[2])
    else return null
  }
}
