<template>
  <div class="ljb-index-right">
    <index-speed-up></index-speed-up>
    <index-host-device></index-host-device>
    <index-warm-tip></index-warm-tip>
  </div>
</template>

<script>
import IndexSpeedUp from './components/IndexSpeedUp'
import IndexHostDevice from './components/IndexHostDevice'
import IndexWarmTip from './components/IndexWarmTip'
export default {
  name: 'IndexRight',
  data: function() {
    return {
      nowKey: 0
    }
  },
  components: {
    IndexSpeedUp,
    IndexHostDevice,
    IndexWarmTip
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.ljb-index-right {
  width: 492px;
  margin-left: 724px;
}
@media screen and (max-width: 1366px) {
  .ljb-index-right {
    width: 435px;
    margin-left: 649px;
    margin-right: 28px;
    // border: 1px solid red;
  }
}
</style>
