<template>
    <div class="loading-ball">
      <div class="inner-loading-line"></div>
      <div class="middle-loading-line"></div>
      <div class="side-loading-line"></div>
    </div>
</template>

<script>
export default {
  name: 'LoadingBall',
  props: {
    show: {
      default: true,
      type: Boolean
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../scss/_utils';
  .loading-ball{
    display: inline-block;
    width: rem(300px);
    height: rem(300px);
    position: relative;
    >div{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      width: rem(0px);
      height: rem(0px);
      border: rem(8px) solid #009FE8;
      border-radius: 50%;
      opacity: 0;
      &.inner-loading-line{
        animation: loading 1.5s infinite 1s linear;
      }
      &.middle-loading-line{
        animation: loading 1.5s infinite 0.5s linear;
      }
      &.side-loading-line{
        animation: loading 1.5s infinite linear;
      }
    }
    @keyframes loading {
      from {
        width: rem(30px);
        height: rem(30px);
        opacity: 1;
      }
      to{
        width: 100%;
        height: 100%;
        opacity: 0.1;
      }
    }
  }
</style>
