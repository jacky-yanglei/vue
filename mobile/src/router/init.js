export default [
  {
    path: '/welcome',
    name: 'WelcomeView',
    component: resolve => {
      require(['@/view/init/WelcomeView/WelcomeView'], resolve)
    }
  },
  {
    path: '/check-networking',
    name: 'CheckNetworking',
    component: resolve => {
      require(['@/view/init/CheckNetworkingView/CheckNetworkingView'], resolve)
    }
  },
  {
    path: '/set-success',
    name: 'SetSuccess',
    component: resolve => {
      require(['@/view/init/SetSuccessView/SetSuccessView'], resolve)
    }
  },
  {
    path: '/not-found-networking/:state',
    name: 'NotFoundNetworking',
    component: resolve => {
      require(['@/view/init/NotFoundNetworkingView/NotFoundNetworkingView'], resolve)
    }
  },
  {
    path: '/set-static-ip', // 设置静态IP
    name: 'SetStaticIP',
    component: resolve => {
      require(['@/view/init/SetStaticIPView/SetStaticIPView'], resolve)
    }
  },
  {
    path: '/choice-wifi',
    name: 'ChoiceWIFI',
    component: resolve => {
      require(['@/view/init/ChoiceWIFIView/ChoiceWIFIView'], resolve)
    },
    children: [
      {
        path: '/choice-wifi/input-wifi',
        name: 'InputWIFIView',
        component: resolve => {
          require(['@/view/init/InputWIFIView/InputWIFIView'], resolve)
        }
      }
    ]
  },
  {
    path: '/init-check-version', // 固件版本检测
    name: 'CheckVersionView',
    component: resolve => {
      require(['@/view/init/CheckVersionView/CheckVersionView.vue'], resolve)
    }
  }
]
