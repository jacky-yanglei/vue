<template>
  <div>
    <div class="speed-btn-wrapper"
    :class="{'speeding': this.speeding,'speed-ok': this.isSpeedOk}"
    @click="btnClicked">
      <div class="wrapper">
        <div class="speed-btn"></div>
        <div class="text">
          <slot></slot>
        </div>
      </div>
    </div>
    <div class="speed-info" :class="{'speed-ok': isSpeedOk}">
      <div class="ping item">
        <div class="title">{{ $t('i18n.DELAY') }}</div>
        <div class="info"><span>{{ nodeInfo.accNodePing }}</span>ms</div>
      </div>
      <div class="packet-loss item">
        <div class="title">{{ $t('i18n.PACKET_LOSS') }}</div>
        <div class="info"><span>0</span>%</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpeedBtn',
  props: {
    speeding: {
      type: Boolean,
      default: false
    },
    isSpeedOk: {
      type: Boolean,
      default: false
    },
    nodeInfo: {
      type: Object,
      default: () => {
        return {
          accNodePing: ''
        }
      }
    }
  },
  methods: {
    btnClicked() {
      this.$emit('handleSpeedClick')
    }
  }
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
  border: rem(6px) solid rgba(0, 159, 232, 0.06);
  margin: 0 auto;
  margin-top: rem(120px);
  transition: margin-top 1s ease;
  &.speeding {
    margin-top: rem(60px);
    transition: margin-top 1s ease;
    border-color: #009fe8;
    box-shadow: 0 4px 20px 0 rgba(0, 159, 232, 0.5);
    .speed-btn {
      @include bgImg('../icons/speeding.png');
      animation: infiniteRotate 2s linear;
      animation-iteration-count: infinite;
    }
  }
  &.speed-ok {
    margin-top: rem(60px);
  }
  @keyframes infiniteRotate {
    0% {
      transform: rotate(0);
    }
    25% {
      transform: rotate(90deg);
    }
    50% {
      transform: rotate(180deg);
    }
    75% {
      transform: rotate(270deg);
    }
    100% {
      transform: rotate(360deg);
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
    background: linear-gradient(180deg, #00afff, #89d8ff);
  }
  .text {
    position: absolute;
    top: rem(30px);
    left: rem(73px);
    z-index: 13;
    width: rem(300px);
    height: rem(300px);
    background: white;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
}
.speed-info {
  position: relative;
  width: 100%;
  height: rem(200px);
  transform:scaleY(0);
  overflow: hidden;
  display: flex;
  justify-content: center;
  margin-top: rem(80px);
  opacity: 0;
  transition: all 1s linear;
  .item {
    position: relative;
    transition: all 1s linear;
    width: rem(200px);
    background:linear-gradient(180deg,rgba(240,243,247,1),rgba(255,255,255,1));
    border-radius: rem(20px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    transition: height 1s linear;
    .title {
      font-size: rem(24px);
      color:rgba(131,137,161,1);
    }
    .info {
      font-size: rem(20px);
      color: #8D8B8E;
      vertical-align: bottom;
      margin-top: rem(20px);
      span {
        color: #2C2A38;
        font-size: rem(56px);
        margin-right: rem(5px);
      }
    }
    &::after {
      position: absolute;
      top: 0;
      left: 50%;
      margin-left: rem(-23px);
      content: '';
      width: rem(46px);
      height: rem(6px);
      background:rgba(6,244,32,1);
      box-shadow:0px rem(2px) rem(8px) 0px rgba(53,255,182,1);
      border-radius:0px 0px rem(100px) rem(100px);
      border:1px solid rgba(255,255,255,0.5)
    }
    &.ping {
      margin-right: rem(60px);
    }
  }
  &.speed-ok {
    transition: all 1s linear;
    transform:scaleY(1);
    opacity: 1;
  }
}
</style>
