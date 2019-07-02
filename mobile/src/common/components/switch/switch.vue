<template>
  <div class="switch-wrapper"
  :class="{'checked': checked}"
  @click.stop="toogleChecked">
    <div class="circle"></div>
  </div>
</template>

<script>
export default {
  props: {
    checked: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    toogleChecked() {
      this.$emit('handleChecked')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/_mixin';
@import '../../scss/_utils';

.switch-wrapper {
  position: relative;
  width: rem(84px);
  height: rem(44px);
  padding: rem(2px);
  background:rgba(131,137,161,.3);
  border-radius: rem(22px);
  &.checked {
    background: #009FE8;
    .circle {
      margin-left: rem(40px);
    }
  }
  .circle {
    width: rem(40px);
    height: rem(40px);
    background: white;
    margin-left: 0;
    border-radius: 50%;
  }
}
</style>
