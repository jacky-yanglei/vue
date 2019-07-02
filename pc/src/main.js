// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import GeminiScrollbar from 'vue-gemini-scrollbar'

import App from './App'
import router from './router'
// import axiosPlugin from './plugin'
import flexible from '@/common/js/flexible'
import './common/directive/directive'
import '@/common/sass/style.scss'
import 'animate.css'

import zh from '@/assets/i18n/zh'
import en from '@/assets/i18n/en'

Vue.config.productionTip = false

flexible(window, window['lib'] || (window['lib'] = {}))

Vue.use(VueI18n)

// Vue.use(axiosPlugin)

Vue.use(GeminiScrollbar)

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
  i18n,
  router,
  GeminiScrollbar,
  components: { App },
  template: '<App/>',
  data: {
    Bus: new Vue()
  }
})
