/*
 * @Author: Zhengxinglun
 * @Date: 2018-05-18 09:30:20
 * @Last Modified by: Zhengxinglun
 * @Last Modified time: 2018-06-27 15:51:31
 */
import Axios from '../plugin/axios'

/**
 * 初始化网络检测
 */
export function checkNetTypeApi() {
  return Axios.get('/admin/net_type_check')
    .then(res => {
      if (Number.parseInt(res.ret) === 0) {
        return Promise.resolve(res.nettype)
      } else {
        return Promise.reject(res.msg)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}

/**
 * 检测互联网连接(post)
 * @return { Object }
 */
export function netBootprotoCheckApi() {
  return Axios.post('/admin/net_bootproto_check')
    .then(data => {
      return Promise.resolve(data)
    })
    .catch(e => {
      return Promise.reject(e)
    })
}

/**
 * 修改联网方式(post)
 * @param { string } type
 * @return { Object }
 */
export function netTypeSet(data) {
  return Axios.post('/admin/net_type_set', data)
    .then(data => {
      if (Number.parseInt(data.ret) === 0) {
        return Promise.resolve(data)
      } else {
        return Promise.reject(data.msg)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}

/**
 * 获取联网方式（get）
 * @return { Object }
 */
export function netTypeGetApi() {
  return Axios.get('/admin/net_type_get')
    .then(data => {
      if (Number.parseInt(data.ret) === 0) {
        return Promise.resolve(data.nettype)
      } else {
        return Promise.reject(data.msg)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}

/**
 * 检测DHCP
 */
export function checkBootprotoNetApi() {
  return Axios.post('/admin/net_bootproto_check')
    .then(res => {
      if (Number.parseInt(res.ret) === 0) {
        return Promise.resolve(res.bootproto)
      } else {
        return Promise.reject(res.msg)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}

/**
 * 获取初始化网络配置信息
 */
export function getInitNetInfoApi() {
  return Axios.post('/admin/net_init_info')
    .then(res => {
      if (Number.parseInt(res.ret) === 0) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res.msg)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}

/**
 * 修改LAN配置（post）
 * @param { String } ip
 * @param { String } netmask
 * @return { Object }
 */
export function netLanSet(data) {
  return Axios.post('/admin/net_lan_set', data)
    .then(data => {
      if (Number.parseInt(data.ret) === 0) {
        return Promise.resolve(true)
      } else {
        return Promise.reject(data.msg)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}

/**
 * 获取LAN配置(get)
 * @return { Object }
 */
export function netLanGet() {
  return Axios.get('/admin/net_lan_get')
    .then(data => {
      if (Number.parseInt(data.ret) === 0) {
        return Promise.resolve(data)
      } else {
        return Promise.reject(data.msg)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}

/**
 * 修改WAN配置(post)
 * @param { String } type
 * @param { String } ip
 * @param { String } gw
 * @param { String } netmask
 * @param { String } dns1
 * @param { String } dns2
 * @param { String } mtu
 * @return { Object }
 */
export function netWanSet(data) {
  return Axios.post('/admin/net_wan_set', data)
    .then(res => {
      if (Number.parseInt(res.ret) === 0) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res.msg)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}

/**
 * 获取WAN配置(get)
 * @return { Object }
 */
export function netWanGet() {
  return Axios.get('/admin/net_wan_get')
    .then(res => {
      if (Number.parseInt(res.ret) === 0) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res.msg)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}

/**
 * 修改无线配置（post）
 * @param { String } ifname
 * @param { String } enable
 * @param { String } ssid
 * @param { String } password
 * @param { String } channel
 * @param { String } encrypt
 * @param { String } encryption
 * @param { String } isolation
 * @param { String } hidden
 * @param { String } htmode
 * @param { String } txpower
 * @return { Object }
 */
export function netWlanSet(data) {
  return Axios.post('/admin/net_wlan_set', data)
    .then(res => {
      if (Number.parseInt(res.ret) === 0) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res.msg)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}

/**
 * 获取无线配置（get）
 * @param { String } ifname
 * @return { Object }
 */
export function netWlanGet(data) {
  return Axios.get('/admin/net_wlan_get', {params: data})
    .then(res => {
      if (Number.parseInt(res.ret) === 0) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res.msg)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}

/**
 * 修改UPNP配置(get)
 * @param { String } enable
 * @return { Object }
 */
export function netUpnpSet(data) {
  return Axios.get('/admin/net_upnp_set', {
    params: data
  })
    .then(res => {
      if (Number.parseInt(res.ret) === 0) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res.msg)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}
/**
 * 获取周边wifi列表（get）
 * @return { Object }
 */
export function netRepeaterScan() {
  return Axios.get('/admin/net_repeater_scan')
    .then(res => {
      if (Number.parseInt(res.ret) === 0) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res.msg)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}

/**
 * wifi中继设置（get）
 * @param { string } enable
 * @param { string } radio
 * @param { string } ssid
 * @param { string } bssid
 * @param { string } password
 * @return { Object }
 */
export function netRepeaterSet(data) {
  return Axios.get('/admin/net_repeater_set', {
    params: data
  })
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
 * 获取UPNP配置及映射列表(get)
 * @return { Object }
 */
export function netUpnpGet() {
  return Axios.get('/admin/net_upnp_get')
    .then(res => {
      if (Number.parseInt(res.ret) === 0) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res.msg)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}
/**
 * 获取wifi中继结果
 */
export function getNetRepeaterStatusApi() {
  return Axios.post('/admin/net_repeater_status')
    .then(res => {
      return Promise.resolve(res)
    })
    .catch(e => {
      return Promise.reject(e)
    })
}

/**
 * 获取wifi中继结果
 */
export function netRepeaterGetApi() {
  return Axios.post('/admin/net_repeater_get')
    .then(res => {
      if (parseInt(res.ret) === 0) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res.msg)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}
