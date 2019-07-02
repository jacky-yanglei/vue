<template>
  <div>
    <div id="app" ref="app" :class="{ 'blur': waiting.show }">
      <div class="w1220">
        <router-view/>
        <div id="ljb-bulr-index"></div>
      </div>
      <div class="bg-fixed"></div>
    </div>
    <waiting :msg="waiting.msg" :show="waiting.show"></waiting>
    <div class="app-loading-wrapper" :class="{ 'show': LoadingCompalte }" >
      <loading class="app-loading"></loading>
      <p>{{$t('i18n.SYS_LOADING')}}</p>
    </div>
  </div>
</template>

<script>
import Waiting from '@/common/components/waiting/Waiting'
import Loading from './common/components/loading/loading'

export default {
  name: 'App',
  data: function() {
    return {
      waiting: {
        msg: '',
        show: false
      },
      LoadingCompalte: false
    }
  },
  components: {
    Waiting,
    Loading
  },
  created() {
    this.$root.Bus.$on('waitingMaskShow', data => {
      this.waiting = data
    })
    window.addEventListener('hashchange', () => {
      const currentPath = window.location.hash.slice(1)
      this.$router.push(currentPath)
    })
    this.$root.Bus.$on('HiddenAppLoading', () => {
      this.LoadingCompalte = true
    })
  },
  mounted() {
    // this.$root.Bus.$emit('HiddenAppLoading')
  },
  beforeDestroy() {
    this.$root.Bus.$off('waitingMaskShow')
    this.$root.Bus.$off('HiddenAppLoading')
  }
}
</script>

<style lang="scss" scoped>
@import './common/sass/_utils.scss';
#app {
  position: relative;
  z-index: 2;
  max-width: rem(1920px);
  position: relative;
  min-height: 100%;
  text-align: center;
  margin: 0 auto;
  .w1220 {
    margin: 0 auto;
    display: inline-block;
    position: relative;
    text-align: left;
    margin-bottom: 30px;
    z-index: 2;
    width: 100%;
  }
  & > .bg-fixed {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      0deg,
      rgba(238, 239, 242, 1),
      rgba(216, 218, 225, 1)
    );
    z-index: 1;
  }
}
.app-loading-wrapper {
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &.show {
    z-index: 1;
  }
  .app-loading {
    margin: 0 auto;
  }
  >p {
    text-align: center;
    margin-top: 15px;
  }
}
@media screen and (max-width: 1366px) {
  #app {
    .w1220 {
      margin-top: 10px;
    }
  }
}
</style>
