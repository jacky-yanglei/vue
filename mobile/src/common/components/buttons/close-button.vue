<template>
  <div class="colse-btn">
    <i :class="{'forbid-close': forbidClose}" @click="closeButtonFn()"></i>
  </div>
</template>

<script>
export default {
  name: 'CloseButton',
  data: function () {
    return {}
  },
  props: {
    forbidClose: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    closeButtonFn: function () {
      if (!this.forbidClose) {
        // 关闭按钮可以被点击
        this.$emit('emitCloseButton')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../common/scss/_mixin';
  @import '../../../common/scss/_utils';
  .colse-btn {
    padding-top: rem(80px);
    & > i {
      display: block;
      width: rem(80px);
      height: rem(80px);
      border-radius: 100%;
      background-color: red;
      margin: 0 auto;
      font-size: 0;
      background: url(../../../assets/images/icon_popups_esc.png) no-repeat;
      background-size: cover;
      &.forbid-close {
        background: url(../../../assets/images/icon_popups_not_esc.png) no-repeat;
        background-size: cover;
      }
    }
  }
</style>
