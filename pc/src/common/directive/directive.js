import Vue from 'vue'

Vue.directive('focus', {
  inserted(el, binding) {
    if (binding.value) {
      el.focus()
    }
  },
  update(el, binding) {
    if (binding.value) {
      el.focus()
    }
  }
})
