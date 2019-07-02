import {
  getToken
} from '../../api/login-api'
import Base64 from './base64'
const base64 = new Base64()

function getCookie(name) {
  let arr
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  arr = document.cookie.match(reg)
  if (arr) return unescape(arr[2])
  else return null
}

function decode(str) {
  if (str) {
    return base64.decode(str)
  } else {
    return ''
  }
}

export default function autoLogin() {
  return getToken({
    luci_username: decode(getCookie('luciusername')),
    luci_app: decode(getCookie('luciapp')),
    luci_password: decode(getCookie('lucipassword'))
  }).then(token => {
    window.sessionStorage.setItem('token', token)
    return Promise.resolve(true)
  }).catch(e => {
    return Promise.reject(e)
  })
}
