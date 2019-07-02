/*
 * @Author: Zhengxinglun
 * @Date: 2018-05-17 10:38:39
 * @Last Modified by: Zhengxinglun
 * @Last Modified time: 2018-06-22 11:25:14
 */
import Axios from '@/plugin/axios'

/**
 * 登录
 * @param {*} data 登录信息
 */
export function getToken(loginInfo) {
  return Axios.post('/cgi-bin/luci', loginInfo)
    .then(res => {
      if (parseInt(res.ret) === 0) {
        return Promise.resolve(res.token)
      } else {
        return Promise.reject(res)
      }
    }).catch(e => {
      return Promise.reject(e.message || e)
    })
}

/**
 * 获取初始化状态
 */
export function getInitStatusApi() {
  return Axios.get('/cgi-bin/luci/sys_init_get')
    .then(res => {
      if (parseInt(res.ret) === 0) {
        window.sessionStorage.setItem('init_status', res['init_status'])
        return Promise.resolve(parseInt(res['init_status']))
      } else {
        return Promise.reject(res)
      }
    }).catch(e => {
      return Promise.reject(e.message || e)
    })
}

/**
 * 登录登出（post）
 * @param { String } action
 * @param { String } user_name
 * @param { String } user_password
 * @return { Object }
 */
export function userLoginAction() {
  return Axios.post('/admin/user_login_action')
    .then(res => {
      if (parseInt(res.ret) === 0) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    }).catch(e => {
      return Promise.reject(e.message || e)
    })
}

/**
 * 会员详情（get）
 * @return { Object }
 */
export function userDetailsGet() {
  return Axios.get('/admin/user_details_get')
    .then(res => {
      if (parseInt(res.ret) === 0) {
        return Promise.resolve(res)
      } else {
        return Promise.reject(res)
      }
    }).catch(e => {
      return Promise.reject(e.message || e)
    })
}
