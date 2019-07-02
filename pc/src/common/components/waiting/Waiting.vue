<template>
  <div class="mask waiting-index" v-if="show">
    <div class="waiting-main">
      <loading class="loading"></loading>
      <div class="waiting-text">{{ msg }}</div>
    </div>
  </div>
</template>

<script>
import Loading from '@/common/components/loading/loading'

export default {
  name: 'Waiting',
  props: {
    msg: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Loading
  }
}
</script>

<style lang="scss" scoped>
.waiting-index {
  z-index: 998;
}
.waiting-main {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 999;
  transform: translate(-50%, -50%);
  text-align: center;
  .loading {
    margin: 0 auto;
  }
  .waiting-text {
    font-size: 14px;
    color: #3A3848;
    line-height: 24px;
    max-width: 210px;
    margin-top: 30px;
  }
}
</style>
