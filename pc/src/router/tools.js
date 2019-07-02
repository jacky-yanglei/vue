export default [
  {
    path: 'tools/wifi-setting',
    name: 'WifiSetting',
    component: resolve => {
      require(['@/view/tools/wifi-setting/WifiSetting'], resolve)
    }
  },
  {
    path: 'tools/UPnP-setting',
    name: 'UPnPSetting',
    component: resolve => {
      require(['@/view/tools/UPnP/UPnP'], resolve)
    }
  },
  {
    path: 'tools/system-log',
    name: 'SystemLog',
    component: resolve => {
      require(['@/view/tools/system-log/Index'], resolve)
    }
  },
  {
    path: 'tools/restart',
    name: 'Restart',
    component: resolve => {
      require(['@/view/tools/restart/Index'], resolve)
    }
  },
  {
    path: 'tools/factory-reset',
    name: 'FactoryDataReset',
    component: resolve => {
      require(['@/view/tools/factory-reset/FactoryResetView'], resolve)
    }
  },
  {
    path: 'tools/firmware',
    name: 'FirmwareUpdateRecovery',
    component: resolve => {
      require(['@/view/tools/firmware/Index'], resolve)
    }
  },
  {
    path: 'tools/change-password',
    name: 'ChangePassword',
    component: resolve => {
      require(['@/view/tools/change-password/Index'], resolve)
    }
  },
  {
    path: 'tools/network-setting',
    name: 'NetworkSetting',
    component: resolve => {
      require(['@/view/tools/network-setting/NetworkSetting'], resolve)
    }
  },
  {
    path: 'tools/ip-setting',
    name: 'IpSetting',
    component: resolve => {
      require(['@/view/tools/ip-setting/IPSetting'], resolve)
    }
  },
  {
    path: '/member-login',
    name: 'MemberLogin',
    component: resolve => {
      require(['@/view/start/login/MemberLoginView'], resolve)
    }
  },
  {
    path: '/login-others',
    name: 'LoginOthers',
    component: resolve => {
      require(['@/view/main/login-others/login-others'], resolve)
    }
  }
]
