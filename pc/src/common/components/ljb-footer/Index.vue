<template>
  <div id="ljb-footer" @click="RouterGo()" :class="{'z-index': isNetWifi}">
    <span>
      返回（&nbsp;Esc&nbsp;或&nbsp;
      <i class="ljb-back-btn"></i>
      ）
    </span>
  </div>
</template>

<script>
export default {
  name: 'LjbFooter',
  data: function() {
    return {
      path: '',
      couldeClick: true,
      isNetWifi: false
    }
  },
  mounted() {
    document.addEventListener('keyup', this.escKeyup)
  },
  destroyed() {
    document.removeEventListener('keyup', this.escKeyup)
  },
  methods: {
    RouterGo: function() {
      if (this.couldeClick) {
        if (this.path === '/wifi-login') {
          this.$router.push('/wifi') // 路由向后退一步，到wifi组件
        } else {
          this.$router.push('/') // 路由向后退一步,到主界面
        }
      }
    },
    escKeyup: function(event) {
      if (event.which === 27) {
        this.RouterGo()
      }
    }
  },
  created() {
    this.path = this.$route.path
    this.$root.Bus.$on('maskClick', val => {
      this.couldeClick = val
    })
    this.$root.Bus.$on('busIsOpenWifiList', data => {
      // data : true = > wifilist开启；false:wifilists关闭
      this.isNetWifi = data
    })
  },
  beforeDestroy() {
    this.$root.Bus.$off('maskClick')
    this.$root.Bus.$off('busIsOpenWifiList')
  }
}
</script>

<style lang="scss" scoped>
#ljb-footer {
  // padding-top: 4.688%;
  padding-top: 0px;
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100px;
  opacity: 0.7;
  cursor: pointer;
  z-index: 101;
  transition: opacity 0.3s;
  &.z-index {
    z-index: -1;
  }
  & > span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: rgba(58, 56, 72, 1);
    font-size: 14px;
    line-height: 20px;
  }
  .ljb-back-btn {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url(../../../assets/images/icon/icon_gamepad_esc.png) no-repeat;
    background-size: 100%;
    position: relative;
    top: 6px;
  }
  &:hover {
    opacity: 1;
  }
}
</style>
