import * as types from './mutation-types'

import axios from '../plugin/axios'

// action是对mutations的一层封装，可以执行一系列的mutation操作，允许异步

export const setLoginStatus = function ({commit, state}) {
  console.log(1111)
  axios.get('/cgi-bin/luci/sys_init_get')
    .then(res => {
      commit(types.SET_LOGIN_STATUS, res)
    })
}
