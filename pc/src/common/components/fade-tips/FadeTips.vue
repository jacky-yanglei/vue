<template>
  <transition
    enter-active-class="animated fadeIn"
    leave-active-class="animated zoomOut">
    <div class="fade-tips" v-if="show">
      <div class="tips-icon icon-error" v-if="type == 'error'"></div>
      <div class="tips-icon icon-tip" v-if="type == 'tip'"></div>
      <div class="tips-icon icon-success" v-if="type == 'success'"></div>
      <br>
      <div>{{ msg }}</div>
    </div>
  </transition>
</template>

<script>
const TIME = 2

export default {
  name: 'fadeTips',
  props: {
    msg: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'success'
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      time: TIME,
      inter: '',
      showTemp: this.show
    }
  },
  watch: {
    show(val, oldVal) {
      this.showTemp = val
    },
    showTemp(val, oldVal) {
      if (this.inter) {
        clearInterval(this.inter)
      }

      if (val) {
        this.inter = setInterval(() => {
          this.time--
          if (this.time <= 0) {
            clearInterval(this.inter)
            this.time = TIME
            this.$emit('hide', this.showTemp)
          }
        }, 1000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fade-tips {
  padding: 20px 48px;
  min-width: 180px;
  min-height: 126px;
  background: #fff;
  box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -90px;
  margin-top: -63px;
  text-align: center;
  z-index: 9999;
}
.tips-icon {
  width: 46px;
  height: 46px;
  background: url(../../../assets/images/icon/icon_tips.png) no-repeat;
  margin-bottom: 20px;
  display: inline-block;
}
.icon-error {
  background-position: 0 0;
}
.icon-tip {
  background-position: -46px 0;
}
.icon-success {
  background-position: -92px 0;
}
</style>
