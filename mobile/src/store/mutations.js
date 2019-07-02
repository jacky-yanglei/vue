import * as types from './mutation-types'

const mutations = {
  [types.SET_USER_INFO] (state, userInfo) {
    state.userInfo = userInfo
  },
  [types.SET_ACC_NODE] (state, accNode) {
    if (accNode.mode === '0' || accNode.mode === '' || accNode.mode === '自动') {
      accNode.mode = '0'
    }
    if (accNode.nodeZone === '0' || accNode.nodeZone === '' || accNode.nodeZone === '自动') {
      accNode.nodeZone = '自动'
    }
    state.accNode = accNode
  },
  [types.SYS_UPDATE_INFO] (state, sysUpdataInfo) {
    state.sysUpdataInfo = sysUpdataInfo
  },
  [types.CURR_VERSION] (state, currVersion) {
    state.currVersion = currVersion
  }
}

export default mutations
