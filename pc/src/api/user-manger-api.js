import Axios from '../plugin/axios'

import dealErrorCode from '../common/service/dealErrorCode'

/**
 * 获取会员详情
 */
export function getUserDetailsApi() {
  return Axios.get('/admin/user_details_get')
    .then(res => {
      if (Number.parseInt(res.ret) === 0) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(dealErrorCode(res.code))
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}

/**
 * 会员登录和注销
 * @param {Object} data {action: String, name: String, password: String}
 */
export function UserLoginApi(data) {
  return Axios.post('/admin/user_login_action', data)
    .then(res => {
      if (Number.parseInt(res.ret) === 0) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    })
    .catch(e => {
      return Promise.reject(e)
    })
}

/**
 * 强制下线
 */
export function forceOfflineApi() {
  return Axios.get('/admin/user_force_offline')
    .then(res => {
      if (Number.parseInt(res.ret) === 0) {
        return Promise.resolve(true)
      } else {
        return Promise.reject(res)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}

/**
 * 清除用户过期状态
 */
export function clearUserInfo() {
  return Axios.post('/admin/user_clear_info')
    .then(res => {
      if (Number.parseInt(res.ret) === 0) {
        return Promise.resolve(true)
      } else {
        return Promise.reject(res)
      }
    })
    .catch(e => {
      return Promise.reject(e.message || e)
    })
}
