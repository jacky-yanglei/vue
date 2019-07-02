<template>
  <div id="ljb-start">
    <keep-alive>
      <ljb-blur-wifi v-show="showBlur"></ljb-blur-wifi>
    </keep-alive>
    <transition
    enter-active-class="animated bounceInDown">
      <router-view class="z-index"></router-view>
    </transition>
  </div>
</template>

<script>
import LjbBlurWifi from '@/common/components/ljb-blur-wifi/Index'
export default {
  name: 'Start',
  data: function() {
    return {
      showBlur: false
    }
  },
  components: {
    LjbBlurWifi
  },
  watch: {
    $route: 'getRoutePath'
  },
  methods: {
    checkLoginStatus: function() {
      // 检查登录状态 api : /admin/get_user_details
      // this.$http
      //   .get('/admin/get_user_details')
      //   .then(function(data) {
      //     return data
      //   })
      //   .catch(err => {
      //   })
    },
    getRoutePath: function() {
      // 获取当前路由地址
      var path = this.$route.path
      if (path === '/start/wifi-login') {
        this.showBlur = true
      } else {
        this.showBlur = false
      }
    }
  },
  created() {
    this.getRoutePath()
  },
  mounted() {
    this.$root.Bus.$emit('HiddenAppLoading')
  }
}
</script>

<style lang="scss" scoped>
#ljb-start {
  position: relative;
  padding-top: 15.625%;
  .z-index {
    position: relative;
    z-index: 999;
  }
}
</style>
