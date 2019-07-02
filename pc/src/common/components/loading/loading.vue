<template>
  <div class="loading-component">
    <span class="circle"></span>
    <span class="circle"></span>
    <span class="circle"></span>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.loading-component {
  width: 50px;
  height: 10px;
  display: flex;
  .circle {
    width: 10px;
    height: 10px;
    background: rgba(0, 159, 232, 1);
    opacity: 1;
    border-radius: 50%;
    animation: lucency 1.04s ease infinite;
    &:nth-child(1) {
      animation-delay: .13s
    }
    &:nth-child(2) {
      display: block;
      margin-left: 10px;
      margin-right: 10px;
      animation-delay:0.26s;
    }
    &:nth-child(3) {
      animation-delay:0.39s;
    }
    @keyframes lucency {
      0% {
        opacity: 1;
        transform: scale(1.3);
      }
      100% {
        opacity: 0.2;
        transform: scale(0.3);
      }
    }
  }
}
</style>
