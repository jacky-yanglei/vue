<template>
  <div class="arrow" :class="[position, color]"></div>
</template>

<script>
export default {
  props: {
    position: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.arrow {
  width: 8px;
  height: 10px;
  &.right {
    &.blue {
      background: url('./icon_arrow_right_blue@2x.png');
      background-size: 100%;
    }
  }
  &.down {
    &.blue {
      background: url('./icon_arrow_down_blue@2x.png');
      background-size: 100%;
    }
  }
}
</style>
