// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueI18n from 'vue-i18n'
import store from './store'
import fastClick from 'fastclick'

import zh from '@/assets/i18n/zh'
import en from '@/assets/i18n/en'

import flexible from './common/js/flexible'

import './common/scss/style.scss'

import getCodeMsgFn from '@/common/service/code'
import utils from '@/common/service/utils'

flexible(window, window['lib'] || (window['lib'] = {}))
fastClick.attach(document.body) // fix移动端点击延迟

Vue.config.productionTip = false

Vue.use(VueI18n)
Vue.prototype.getCodeMsgFn = getCodeMsgFn // 获取接口请求错误返回的code字段
Vue.prototype.apiErrorDealFn = utils.apiErrorDealFn // 处理接口请求错误返回的code字段或错误msg信息

const i18n = new VueI18n({
  locale: 'zh',
  messages: {
    zh: {
      i18n: zh
    },
    en: {
      i18n: en
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  components: { App },
  template: '<App/>',
  data: {
    Bus: new Vue()
  }
})
