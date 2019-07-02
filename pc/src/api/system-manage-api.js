import Axios from '@/plugin/axios'

/**
 * 远程调试控制(post)
 * @param { Object } data
 */
export function sysRemoteDebugControl(data) {
  return Axios.post('/cgi-bin/luci/sys_remote_debug_control', data).then(data => {
    return Promise.resolve(data)
  }).catch(e => {
    return Promise.reject(e)
  })
}

/**
 * 在线升级系统固件(post)
 * @param { Object } data
 */
export function sysOnlineUpgradeFirmware(data) {
  return Axios.post('/admin/sys_online_upgrade_firmware', data).then(data => {
    return Promise.resolve(data)
  }).catch(e => {
    return Promise.reject(e)
  })
}

/**
 * 获取固件更新信息（get）
 */
export function sysFirmwareCheck() {
  return Axios.get('/admin/sys_firmware_check').then(data => {
    return Promise.resolve(data)
  }).catch(e => {
    return Promise.reject(e.message || e)
  })
}

/**
 * 获取固件信息（get）
 */
export function sysFirmwareInfo() {
  return Axios.get('/cgi-bin/luci/sys_firmware_info').then(data => {
    return Promise.resolve(data)
  }).catch(e => {
    return Promise.reject(e.message || e)
  })
}

/**
 * 获取系统日志
 */
export function getSystemLogApi() {
  return Axios.get('/admin/sys_log_get')
    .then(data => {
      return Promise.resolve(data)
    })
    .catch(e => {
      return Promise.reject(e)
    })
}

/**
 * 清除系统日志
 */
export function cleanSystemLogApi() {
  return Axios.post('/admin/sys_log_clean')
    .then(data => {
      return Promise.resolve(data)
    })
    .catch(e => {
      return Promise.reject(e)
    })
}

/**
 * 重启联机宝
 */
export function restartApi() {
  return Axios.post('/admin/sys_reboot')
    .then(data => {
      if (Number.parseInt(data.ret) === 0) {
        return Promise.resolve()
      } else {
        return Promise.reject(data.msg)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}

/**
 * 恢复出厂设置
 */
export function factoryResetApi() {
  return Axios.post('/admin/sys_reset')
    .then(data => {
      if (Number.parseInt(data.ret) === 0) {
        return Promise.resolve()
      } else {
        return Promise.reject(data.msg)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}
/**
 * 修改管理密码
 * @param {Object} data {password: String}
 */
export function changePassword(data) {
  return Axios.post('/admin/sys_admin_set', data)
    .then(res => {
      if (Number.parseInt(res.ret) === 0) {
        return Promise.resolve(true)
      } else {
        return Promise.reject(Number.parseInt(res.ret))
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}
/**
 * 上传文件
 * @param {FormData} data
 */
export function uploadFirmwareApi(data, config) {
  return Axios.post('/admin/sys_upload_firmware', data, config)
    .then(res => {
      if (Number.parseInt(res.ret) === 0) {
        return Promise.resolve(true)
      } else {
        return Promise.reject(res.msg)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}

/**
 * 固件升级
 * @param {Object} data {save_config: Number}
 */
export function updateFirmwareApi(data) {
  return Axios.post('/admin/sys_upgrade_firmware', data)
    .then(res => {
      if (Number.parseInt(res.ret) === 0) {
        return Promise.resolve(true)
      } else {
        return Promise.reject(res.msg)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}
