<template>
  <div class="diffusion-container">
    <div class="dot"></div>
    <div class="pulse"></div>
    <div class="pulse1"></div>
  </div>
</template>

<script>
export default {
  name: 'DiffusionCircle'
}
</script>

<style lang="scss" scoped>
@keyframes diffusion {
  0% {
    transform: scale(0.4);
    opacity: 0;
  }

  25% {
    transform: scale(0.4);
    opacity: 0.1;
  }

  50% {
    transform: scale(0.6);
    opacity: 0.3;
  }

  75% {
    transform: scale(0.9);
    opacity: 0.5;
  }

  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.diffusion-container {
  position: relative;
  width: 130px;
  height: 130px;
  margin: 0 auto;
  /* 保持大小不变的小圆圈 */
  .dot {
    position: absolute;
    width: 35px;
    height: 35px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: 3px solid #009fe8;
    border-radius: 50%;
    z-index: 2;
  }
  /* 产生动画（向外扩散变大）的圆圈 第一个圆 */
  .pulse {
    position: absolute;
    width: 130px;
    height: 130px;
    left: 0;
    top: 0;
    border: 3px solid #009fe8;
    border-radius: 50%;
    z-index: 1;
    opacity: 0;
    animation: diffusion 2s linear;
    animation-iteration-count: infinite;
  }
  /* 产生动画（向外扩散变大）的圆圈 第二个圆 */
  .pulse1 {
    position: absolute;
    width: 130px;
    height: 130px;
    left: 0;
    top: 0;
    border: 3px solid #009fe8;
    border-radius: 50%;
    z-index: 1;
    opacity: 0;
    animation: diffusion 2s 1s linear;
    animation-iteration-count: infinite;
  }
}
</style>
