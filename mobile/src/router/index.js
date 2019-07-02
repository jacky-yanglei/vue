import Vue from 'vue'
import Router from 'vue-router'
import init from './init'
import tools from './tools'

import MainView from '../view/main/MainView/MainView'

import { getInitStatusApi, getToken } from '../api/login-api'

import Base64 from '../common/service/base64'
const base64 = new Base64()

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: MainView,
      children: [
        {
          path: '/login-others',
          name: 'LoginOthers',
          component: resolve => {
            require(['@/view/main/LoginOthersView/LoginOthersView'], resolve)
          }
        },
        {
          path: '/speed-config',
          name: 'SpeedConfig',
          component: resolve => {
            require(['@/view/main/SpeedConfig/SpeedConfigView'], resolve)
          }
        },
        ...tools
      ]
    },
    {
      path: '/warm-prompt',
      name: 'WarmPrompt',
      component: resolve => {
        require(['@/view/main/WarmPromptView/WarmPromptView'], resolve)
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: resolve => {
        require(['@/view/main/LoginView/LoginView'], resolve)
      }
    },
    {
      path: '/member-login',
      name: 'MemberLogin',
      component: resolve => {
        require(['@/view/main/MemberLoginView/MemberLoginView'], resolve)
      }
    },
    ...init
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
    '/check-networking',
    '/set-success',
    '/not-found-networking',
    // '/set-static-ip',
    '/choice-wifi/input-wifi',
    '/choice-wifi',
    '/init-check-version'
  ] // 初始化路由数组
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
    if (initStatus === 1 && to.path !== '/init-check-version') {
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
