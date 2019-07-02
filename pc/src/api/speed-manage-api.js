import Axios from '@/plugin/axios'

/**
 * 获取设备列表及设备列表刷新(get)
 * @param { String } refresh
 * @param { Object } data
 */
export function devListGet(data) {
  return Axios.get('/admin/dev_list_get', { params: data })
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
 * 获取节点列表及刷新(get)
 * @param { string } refresh
 * @return { Object } data
 */
export function accNodeList(data) {
  return Axios.get('/admin/acc_node_list', { params: data })
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
 * 获取加速配置（post）
 * @return { Object } data
 */
export function accConfigGet() {
  return Axios.post('/admin/acc_config_get')
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
 * 修改加速配置（post）
 * @param { String } mode
 * @param { String } nodeId
 * @param { String } nodeZone
 * @param { String } reconn
 * @return { Object } data
 */
export function accConfigSet(data) {
  return Axios.post('/admin/acc_config_set', data)
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
 * 加速过程控制（post）
 * @param { String } action
 * @return { Object } data
 */
export function accControlAction(data) {
  return Axios.post('/admin/acc_control_action', data)
    .then(res => {
      if (Number.parseInt(res.ret) === 0) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}

/**
 * 获取加速状态（get）
 * @return { Object } data
 */
export function accStateGet(data) {
  return Axios.get('/admin/acc_state_get', {params: data})
    .then(res => {
      let s = parseInt(res.ret)
      if (s === 0 || s === 1) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}

/**
 * 开关设备加速通道（post）
 * @param { String } enable
 * @param { String } mac
 * @param { String } bow
 * @return { Object } data
 */
export function devTunSet(data) {
  return Axios.post('/admin/dev_tun_set', data)
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
 * 修改设备别名配置（post）
 * @param { String } mac
 * @param { String } alias
 * @return { Object } data
 */
export function devAliasSet(data) {
  return Axios.post('/admin/dev_alias_set', data)
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
