export default {
  verifyAdminPassword: function (value, minLength = 8, maxLength = 32) {
    // 校验管理密码，8-32位
    return (value.length >= minLength) && (value.length <= maxLength)
  },
  verifyIP: function (value) {
    // 校验IP em: 192.168.8.1
    let reSpaceCheck = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/
    if (reSpaceCheck.test(value)) {
      value.match(reSpaceCheck)
      if (RegExp.$1 < 255 && RegExp.$1 > 0 &&
        RegExp.$2 < 255 && RegExp.$2 >= 0 &&
        RegExp.$3 < 255 && RegExp.$3 >= 0 &&
        RegExp.$4 < 255 && RegExp.$4 > 0) {
        if (value !== '127.0.0.1') {
          return true
        }
      }
    }
    return false
  },
  // 校验掩码
  verifyMask: function (mask) {
    var exp = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/
    if (mask.match(exp) === null) {
      return false // "非法"
    } else {
      return true // "合法"
    }
  },
  // WiFi名称
  verifyWifiName: function (value) {
    var reg = /[\u4e00-\u9fa5]/g
    var rss = reg.test(value)
    return (value.length >= 1) && (value.length <= 32) && !rss
  }
}
