// import Start from '@/view/start/Index'

export default [
  {
    path: '/login',
    name: 'AdministratorLogin',
    component: resolve => {
      require(['@/view/start/login/AdministratorLoginView'], resolve)
    }
  },
  {
    path: '/many-users-login',
    name: 'ManyUsersLogin',
    component: resolve => {
      require(['@/view/start/login/ManyUsersLoginView'], resolve)
    }
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: resolve => {
      require(['@/view/start/welcome/WelcomeView'], resolve)
    }
  },
  {
    path: '/complate',
    name: 'InitCompalte',
    component: resolve => {
      require(['@/view/start/DHCP/DHCPConfigView'], resolve)
    }
  },
  {
    path: '/dhcp-not-found',
    name: 'DHCPNotFound',
    component: resolve => {
      require(['@/view/start/DHCP/DHCPNotFoundView'], resolve)
    }
  },
  {
    path: '/network-check',
    name: 'NetworkCheck',
    component: resolve => {
      require(['@/view/start/network-check/NetworkCheck'], resolve)
    }
  },
  {
    path: '/network-error',
    name: 'NetworkError',
    component: resolve => {
      require(['@/view/start/network-error/NetworkErrorView'], resolve)
    }
  },
  {
    path: '/static-ip',
    name: 'StaticIP',
    component: resolve => {
      require(['@/view/start/staticIP/StaticIpView'], resolve)
    }
  },
  {
    path: '/wifi',
    name: 'Wifi',
    component: resolve => {
      require(['@/view/start/wifi/WiFiListView'], resolve)
    }
  },
  {
    path: '/wifi-login',
    name: 'WifiLogin',
    component: resolve => {
      require(['@/view/start/wifi-login/WifiLoginView'], resolve)
    }
  },
  {
    path: '/check-sys-firmware',
    name: 'CheckSysFirmware',
    component: resolve => {
      require(['@/view/start/check-sys-firmware/CheckSysFirmware'], resolve)
    }
  },
  {
    path: '/check-sys-success',
    name: 'CheckSysSuccess',
    component: resolve => {
      require(['@/view/start/check-sys-firmware/CheckSysSuccess'], resolve)
    }
  },
  {
    path: '/check-sys-failed',
    name: 'CheckSysFailed',
    component: resolve => {
      require(['@/view/start/check-sys-firmware/CheckSysFailed'], resolve)
    }
  }
]
