<template>
  <div class="loading-wait" v-if="show">
    <span>
      <i></i>
      <i></i>
      <i></i>
    </span>
    <p :class="{'mask': showMask}">{{ msg }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingWait',
  data: function () {
    return {
      txt: this.$t('i18n.WAITING')
    }
  },
  props: {
    msg: {
      type: String,
      default: this.txt
    },
    show: {
      type: Boolean,
      default: true // true | false
    },
    showMask: {
      Boolean,
      default: false // true | false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../scss/_utils';
  .loading-wait {
    text-align: center;
    float: left;
    width: 100%;
    span {
      position: relative;
      display: inline-block;
      width: rem(100px);
    }
    i {
      font-size: 0;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: rem(20px);
      height: rem(20px);
      border-radius: rem(10px);
      background-color: rgba(0,159,232,1);
      &:nth-of-type(1) {
        left: 0;
        opacity: .1;
        animation: loading1 1.5s infinite 0.5s linear;
        @keyframes loading1 {
          0% {
            opacity: .1;
          }
          35% {
            opacity: .3;
          }
          70% {
            opacity: 1;
          }
          100% {
            opacity: .1;
          }
        }
      }
      &:nth-of-type(2) {
        left: rem(40px);
        opacity: .3;
        animation: loading2 1.5s infinite 0.5s linear;
        @keyframes loading2 {
          0% {
            opacity: .3;
          }
          30% {
            opacity: 1;
          }
          70% {
            opacity: .1;
          }
          100% {
            opacity: .3;
          }
        }
      }
      &:nth-of-type(3) {
        left: rem(80px);
        opacity: 1;
        animation: loading3 1.5s infinite 0.5s linear;
        @keyframes loading3 {
          0% {
            opacity: 1;
          }
          40% {
            opacity: .1;
          }
          70% {
            opacity: .3;
          }
          100% {
            opacity: 1;
          }
        }
      }
    }
    p {
      width: rem(420px);
      margin: 0 auto;
      margin-top: rem(30px);
      font-size: rem(24px);
      color: rgba(131,137,161,1);
      &.mask {
        background: none;
        padding-top: rem(30px);
        font-size: rem(28px);
        color: rgba(58, 56, 72, 1);
      }
    }
  }
</style>
