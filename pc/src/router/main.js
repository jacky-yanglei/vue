import Index from '@/view/main/Index'
import ToolsRouter from './tools'

export default [
  {
    path: '/',
    name: 'Index',
    component: Index,
    children: [
      {
        path: 'speed-up',
        name: 'SpeedUp',
        component: resolve => {
          require(['@/view/main/speed-up/SpeedUp'], resolve)
        }
      },
      {
        path: 'warm-tip',
        name: 'WarmTip',
        component: resolve => {
          require(['@/view/main/warm-tip/Index'], resolve)
        }
      },
      {
        path: 'tip-login-another',
        name: 'TipLoginAnother',
        component: resolve => {
          require(['@/view/main/tip-login-another/Index'], resolve)
        }
      },
      ...ToolsRouter
    ]
  }
]
