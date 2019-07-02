<template>
  <div class="many-user-login-view start-pd">
    <many-user-login :phone="hidePhone"></many-user-login>
  </div>
</template>

<script>
import ManyUserLogin from '@/common/components/login/manyUserLogin'

export default {
  data () {
    return {
      phone: '15198228672'
    }
  },
  computed: {
    hidePhone() {
      return this.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$2')
    }
  },
  components: {
    ManyUserLogin
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_constant.scss';
@import '../../../common/sass/_mixin.scss';

.many-user-login-view {
  width: $startContentWidth;
  margin: 0 auto;
}
</style>
