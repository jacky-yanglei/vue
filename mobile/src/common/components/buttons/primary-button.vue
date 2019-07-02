<template>
  <button :disabled="disabled" :class="disabled?'disabled':''" class="primary-button" @click="clickEmmit">
    <i :class="{'loading': loading}"></i>
    <slot></slot>
    <span class="button-loading"></span>
  </button>
</template>

<script>
export default {
  name: 'PrimaryButton',
  props: {
    disabled: {
      default: false,
      type: Boolean
    },
    loading: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    clickEmmit () {
      this.$emit('buttonClicked')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../scss/_utils';
  .primary-button {
    &.disabled{
      background: #cbcbcb;
      &:hover{
        box-shadow: none;
      }
    }
    position: relative;
    width: 100%;
    height: rem(90px);
    text-align: center;
    line-height: rem(90px);
    background: linear-gradient(-90deg,rgba(57,193,255,1),rgba(0,159,232,1));
    border-radius: rem(8px);
    color:rgba(255,255,255,1);
    font-size: rem(32px);
    &:hover {
      box-shadow:0px 8px 30px 0px rgba(0,159,232,0.3);
      &::after {
        position: absolute;
        top: rem(-2px);
        left: rem(-2px);
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        border: rem(2px) solid #fff;
        border-radius: rem(8px);
      }
    }
    & > i {
      display: inline-block;
      width: rem(36px);
      height: rem(36px);
      background: url(../../../assets/images/icon_button_loading.png) no-repeat;
      background-size: cover;
      animation: loading 1s linear infinite;
      position: relative;
      top: rem(5px);
      display: none;
      @keyframes loading {
        0% {
          transform: rotate(0deg)
        }
        25% {
          transform: rotate(90deg)
        }
        50% {
          transform: rotate(180deg)
        }
        75% {
          transform: rotate(270deg)
        }
        100% {
          transform: rotate(360deg)
        }
      }
      &.loading {
        display: inline-block;
      }
    }
  }
</style>
