/**
 * Router
 */

import Vue from 'vue'
import Router from 'vue-router'

import main from './main'
import StartRouter from './start'

import Login from '../view/start/login/AdministratorLoginView'
import { getInitStatusApi, getToken } from '../api/login-api'

import Base64 from '../common/service/base64'
const base64 = new Base64()

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  routes: [
    {path: '*', component: Login},
    ...main,
    ...StartRouter
  ]
})

let isFirst = true
let initStatus = 0

router.beforeEach((to, from, next) => {
  if (isFirst) {
    getInitStatusApi().then(res => {
      initStatus = Number.parseInt(res)
      window.sessionStorage.setItem('init_status', res)
      checkRouter(to, from, next)
    }).catch(e => {
      next('/login')
    })
  } else {
    initStatus = Number.parseInt(window.sessionStorage.getItem('init_status'))
    checkRouter(to, from, next)
  }
})

function checkRouter (to, from, next) {
  const initRouter = [
    '/welcome',
    '/complate',
    '/dhcp-not-found',
    '/network-check',
    '/network-error',
    '/static-ip',
    '/wifi',
    '/wifi-login',
    '/check-sys-success',
    '/check-sys-failed',
    '/check-sys-firmware'
  ]
  if (initRouter.indexOf(to.path) < 0) { // 不在初始化路由中
    if (initStatus === 1) { // 已经初始化了
      if (to.path !== '/login' && isFirst) { // 不是login路由，则尝试登录
        getToken({
          luci_username: decode(getCookie('luciusername')),
          luci_app: decode(getCookie('luciapp')),
          luci_password: decode(getCookie('lucipassword'))
        }).then(token => {
          window.sessionStorage.setItem('token', token)
          isFirst = false
          next()
        }).catch(e => { // 登录失败则跳转到登录去
          next('/login')
        })
      } else {
        next()
      }
    } else {
      next('/welcome')
    }
  } else { // 在初始化路由中
    isFirst = false
    if (initStatus === 1 && to.path !== '/check-sys-failed') {
      next('/login')
    } else {
      next()
    }
  }
}

function getCookie(name) {
  let arr
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  arr = document.cookie.match(reg)
  if (arr) return unescape(arr[2])
  else return null
}

function decode (str) {
  if (str) {
    return base64.decode(str)
  } else {
    return ''
  }
}
export default router
