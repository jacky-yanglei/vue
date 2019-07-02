<template>
  <div class="switch-wrapper">
    <span class="text">{{ showChoose }}</span>
    <div
    class="switch"
    :class="choose ? 'open' : 'close'"
    @click="changeChose"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    choose: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showChoose() {
      return this.choose ? this.$t('i18n.OPEN') : this.$t('i18n.CLOSE')
    }
  },
  methods: {
    changeChose() {
      // this.choose = !this.choose
      this.$emit('changeChose', this.choose)
    }
  }
}
</script>

<style lang="scss" scoped>
.switch-wrapper {
  display: flex;
  align-items: center;
  .text {
    font-size:14px;
    color:rgba(58,56,72,1);
    margin-right: 10px;
  }
  .switch {
    position: relative;
    height: 40px;
    width: 76px;
    border-radius: 20px ;
    cursor: pointer;
    &:hover {
      box-shadow: 0px 6px 20px 0px rgba(0,159,232,0.5);
    }
    &::after {
      position: absolute;
      content: '';
      width: 26px;
      height: 26px;
      border-radius: 50%;
      top: 4px;
      transition: all .1s linear;
    }
    &.open {
      border: 3px solid white;
      background:rgba(0,159,232,1);
      &::after {
        background: white;
        left: 40px;
      }
    }
    &.close {
      border: 3px solid #8389A1;
      background: transparent;
      &:hover {
        border: 3px solid rgba(0,159,232,1);
        &::after {
          background:rgba(0,159,232,1);
        }
      }
      &::after {
        background:#8389A1;
        left: 4px;
      }
    }
  }
}
</style>
