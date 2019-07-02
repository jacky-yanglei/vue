export default [
  {
    path: '/factory-reset',
    name: 'FactoryReset',
    component: resolve => {
      require(['@/view/tools/factory-reset/FactoryReset'], resolve)
    }
  },
  {
    path: '/restart',
    name: 'Restart',
    component: resolve => {
      require(['@/view/tools/restart/Restart'], resolve)
    }
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: resolve => {
      require(['@/view/tools/change-password/ChangePassword'], resolve)
    }
  },
  {
    path: '/firmware',
    name: 'Firmware',
    component: resolve => {
      require(['@/view/tools/firmware/Firmware'], resolve)
    }
  },
  {
    path: '/system-log',
    name: 'SystemLog',
    component: resolve => {
      require(['@/view/tools/system-log/SystemLog'], resolve)
    }
  },
  {
    path: '/ip-setting',
    name: 'IPSetting',
    component: resolve => {
      require(['@/view/tools/ip-setting/IPSetting'], resolve)
    }
  },
  {
    path: '/upnp',
    name: 'UPnP',
    component: resolve => {
      require(['@/view/tools/UPnP/UPnP'], resolve)
    }
  },
  {
    path: '/wifi-setting',
    name: 'WifiSetting',
    component: resolve => {
      require(['@/view/tools/wifi-setting/WifiSetting'], resolve)
    }
  },
  {
    path: '/network-setting',
    name: 'NetworkSetting',
    component: resolve => {
      require(['@/view/tools/network-setting/NetworkSetting'], resolve)
    }
  },
  {
    path: '/force-update',
    name: 'ForceUpdate',
    component: resolve => {
      require(['@/view/tools/force-update/ForceUpdate'], resolve)
    }
  }
]
