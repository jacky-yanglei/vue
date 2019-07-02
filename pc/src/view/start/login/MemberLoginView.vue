<template>
  <div class="login-view">
    <login></login>
    <oval></oval>
  </div>
</template>

<script>
import Login from '@/common/components/login/login'
import Oval from '@/common/components/oval/oval'

export default {
  name: 'LoginView',
  components: {
    Login,
    Oval
  },
  mounted() {
    this.$root.Bus.$emit('HiddenAppLoading')
  }
}
</script>

<style lang="scss" scoped>
.login-view {
  width: 432px;
  margin: 0 auto;
}
</style>
