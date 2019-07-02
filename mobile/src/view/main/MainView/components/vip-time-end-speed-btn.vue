<template>
  <div class="vip-time-end">
    <div class="speed-btn-wrapper">
      <div class="wrapper">
        <div class="speed-btn"></div>
        <div class="text">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import '../../../../common/scss/_mixin';
@import '../../../../common/scss/_utils';

.speed-btn-wrapper {
  position: relative;
  width: rem(460px);
  height: rem(460px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 50%;
  border: rem(6px) solid rgba(241,68,102,0.06);;
  margin: 0 auto;
  margin-top: rem(120px);
  transition: margin-top 1s ease;
  &:hover,
  &.speeding {
    margin-top: rem(120px);
    transition: margin-top 1s ease;
    border-color: #F14466;
    box-shadow: 0 4px 20px 0 rgba(241, 68, 102, 0.5);
    .speed-btn {
      background: linear-gradient(180deg, rgba(241, 68, 102, 1), rgba(255, 147, 147, 1));
    }
  }
  .wrapper {
    position: relative;
  }
  .speed-btn {
    position: relative;
    width: rem(360px);
    height: rem(360px);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    font-size: rem(26px);
    color: #3a3848;
    border-radius: 50%;
    padding: rem(35px);
    z-index: 2;
    background: linear-gradient(180deg, rgba(241, 68, 102, .7), rgba(255, 147, 147, .7));
  }
  .text {
    position: absolute;
    top: rem(30px);
    left: rem(73px);
    width: rem(300px);
    height: rem(300px);
    background: white;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    z-index: 9;
  }
}
</style>
