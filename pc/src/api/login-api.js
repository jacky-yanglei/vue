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
  return Axios.post('/cgi-bin/luci', loginInfo).then(data => {
    if (Number.parseInt(data.ret) === 0) {
      return Promise.resolve(data.token)
    } else {
      return Promise.reject(data.msg)
    }
  }).catch(e => {
    return Promise.reject(e.message || e)
  })
}

/**
 * 获取初始化状态
 */
export function getInitStatusApi() {
  return Axios.get('/cgi-bin/luci/sys_init_get').then(data => {
    if (Number.parseInt(data.ret) === 0) {
      window.sessionStorage.setItem('init_status', data['init_status'])
      return Promise.resolve(Number.parseInt(data['init_status']))
    } else {
      return Promise.reject(data.msg)
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
  return Axios.post('/admin/user_login_action').then(data => {
    if (Number.parseInt(data.ret) === 0) {
      return Promise.resolve(data)
    } else {
      return Promise.reject(data.msg)
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
  return Axios.get('/admin/user_details_get').then(data => {
    if (Number.parseInt(data.ret) === 0) {
      return Promise.resolve(data)
    } else {
      return Promise.reject(data.msg)
    }
  }).catch(e => {
    return Promise.reject(e.message || e)
  })
}
