<template>
  <div class="error-tips" :class="{'show': show}">
    <incon-alert></incon-alert>
    <span>{{ msg }}</span>
  </div>
</template>

<script>
import { InconAlert } from '@/common/components/icons'

export default {
  name: 'errorTips',
  props: {
    msg: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  components: {
    InconAlert
  }
}
</script>

<style lang="scss" scoped>
.error-tips {
  position: absolute;
  top: -40px;
  left: 0;
  display: none;
  width: 100%;
  text-align: center;
  &.show {
    display: block;
  }
  span {
    margin-left: 5px;
    color: rgba(58, 56, 72, 1);
    font-size: 14px;
  }
}
</style>
