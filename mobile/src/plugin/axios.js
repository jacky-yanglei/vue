import axios from 'axios'
import qs from 'qs'
import blackList from './blacklist'
import router from '../router'

const Axios = axios.create({
  timeout: 100005,
  responseType: 'json',
  headers: { // 设置请求头
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded;multipart/form-data;charset=utf-8',
    'Authorization': 'v2'
  },
  withCredentials: true // 允许请求携带Cookie
})

// 请求拦截器
Axios.interceptors.request.use(
  config => {
    // 序列化
    if (
      (config.method === 'post') ||
      config.method === 'put' ||
      config.method === 'delete'
    ) {
      // 序列化
      if (config.headers['Content-Type'] !== 'multipart/form-data') {
        config.data = qs.stringify(config.data)
      }
    }
    if (blackList.indexOf(config.url) === -1) {
      const token = window.sessionStorage.getItem('token')
      config.url = `/cgi-bin/luci${token}${config.url}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// 响应拦截器
Axios.interceptors.response.use(res => {
  res = res.data
  if (Number.parseInt(res.ret) === -100) {
    router.push('/login')
  }
  return Promise.resolve(res)
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '错误请求' // 错误请求
        break
      case 401:
        err.message = '未授权，请重新登录' // 未授权，请重新登录
        break
      case 403:
        err.message = '拒绝访问' // 拒绝访问
        break
      case 404:
        err.message = '请求错误,未找到该资源' // 请求错误,未找到该资源
        break
      case 405:
        err.message = '请求方法未允许' // 请求方法未允许
        break
      case 408:
        err.message = '请求超时' // 请求超时
        break
      case 500:
        err.message = '服务器端出错' // 服务器端出错
        break
      case 501:
        err.message = '网络未实现' // 网络未实现
        break
      case 502:
        err.message = '网络错误' // 网络错误
        break
      case 503:
        err.message = '服务不可用' // 服务不可用
        break
      case 504:
        err.message = '网络超时' // 网络超时
        break
      case 505:
        err.message = 'http版本不支持该请求' // http版本不支持该请求
        break
      default:
        err.message = `连接错误${err.response.status}` // 连接错误${err.response.status}
    }
  } else {
    err.message = '连接到服务器失败' // 连接到服务器失败
  }
  return Promise.reject(err)
})

export default Axios
