<template>
  <div class="loading-mask" v-if="show">
    <loading-wait class="loading-wait"
      :msg="msg"
      :show="show"
      :showMask="showMask"></loading-wait>
  </div>
</template>

<script>
import LoadingWait from './loading-wait'
export default {
  name: 'LoadingMask',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    msg: {
      type: String
    },
    showMask: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {}
  },
  components: {
    LoadingWait
  },
  updated () {
    console.log(this.show, this.showMask, this.msg)
  }
}
</script>

<style lang="scss" scoped>
  .loading-mask {
    position: fixed;
    z-index: 99;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.5);
    .loading-wait {
      position: absolute;
      top: 40%;
      transform: translateY(-50%);
    }
  }
</style>
