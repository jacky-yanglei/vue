<template>
  <transition name="fade">
    <div class="fade-tips-mask" v-if="show">
      <div class="fade-tips">
        <div class="tips-icon icon-error" v-if="type === 'error'"></div>
        <div class="tips-icon icon-tip" v-if="type === 'tip'"></div>
        <div class="tips-icon icon-success" v-if="type === 'success'"></div>
        <br>
        <div class="txt-tip">{{ msg }}</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'FadeTips',
  data: function () {
    return {
      isShow: this.show
    }
  },
  props: {
    msg: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'success' // success | tip | error
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  updated () {
    if (this.show === true) {
      let a = setTimeout(() => { // 2s后关闭弹窗
        this.$emit('hide', false)
        clearTimeout(a)
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../common/scss/_mixin';
  @import '../../../common/scss/_utils';
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .fade-tips-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 90;
  }
  .fade-tips {
    width: rem(440px);
    min-height: rem(312px);
    position: fixed;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255,255,255,1);
    box-shadow: 0px rem(20px) rem(60px) 0px rgba(0,0,0,0.06);
    border-radius: rem(8px);
    border:1px solid  rgba(230,230,231,1);
    z-index: 91;
    & > .tips-icon {
      width: rem(110px);
      height: rem(110px);
      margin: 0 auto;
      margin-top: rem(60px);
      &.icon-error {
        background: url(../../../assets/images/icon_error.png) no-repeat;
        background-size: cover;
      }
      &.icon-tip {
        background: url(../../../assets/images/icon_warning.png) no-repeat;
        background-size: cover;
      }
      &.icon-success {
        background: url(../../../assets/images/icon_right.png) no-repeat;
        background-size: cover;
      }
    }
    & > .txt-tip {
      width: rem(300px);
      margin: 0 auto;
      text-align: center;
      font-size: rem(30px);
      color: rgba(58,56,72,1);
      padding-bottom: rem(30px);
      line-height: rem(42px);
    }
  }
</style>
