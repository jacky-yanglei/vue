export default {
  bowserIE: function () {
    let isIE = false
    let userAgent = navigator.userAgent
    let isOpera = userAgent.indexOf('Opera') > -1
    let browsers = navigator.appName
    var bVersion = navigator.appVersion
    let version = bVersion.split(';')
    let trimVersion = (version[1]) ? version[1].replace(/[ ]/g, '') : version[0].replace(/[ ]/g, '')
    if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
      isIE = true
    } else if (browsers === 'Netscape' && trimVersion === 'WOW64') {
      isIE = true
    }

    return isIE
  },
  checkSysTyle: function() {
    // 检测浏览器运行的操作系统
    let p = navigator.platform
    let sys = { // 系统类型列表
      win: false,
      mac: false,
      x11: false
    }
    if (p.indexOf('Win') === -1) {
      sys.win = false
    } else {
      sys.win = true
    }
    if (p.indexOf('Mac') === -1) {
      sys.mac = false
    } else {
      sys.mac = true
    }
    if (p.indexOf('X11') === -1 || p.indexOf('Linux') === -1) {
      sys.x11 = false
    } else {
      sys.x11 = true
    }
    return sys
  }
}
export function dealVersion(ver) {
  let tem = null
  if (ver) {
    tem = Number.parseInt(ver.split('.').join(''))
  }
  return tem
}
// 比较版本
export function compareVersion(ver1, ver2) {
  console.log(ver1, ver2)
  // ver1 : 表示当前版本(最低兼容版本)； ver2 ： 表示最新版本（当前版本）
  let reg = /^\d{1,}.\d{1,}.\d{1,}/
  let v1 = reg.exec(ver1)[0].split('.')
  console.log(reg.exec(ver2)[0])
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
}
