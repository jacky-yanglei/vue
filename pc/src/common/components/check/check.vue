<template>
  <div class="check"
  :class="{'checked': checked}"
  @click="toggloCheck"></div>
</template>

<script>
export default {
  name: 'Check',
  props: {
    checkedStatic: {
      type: Boolean,
      default: false
    },
    checkedDynamic: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      checked: true
    }
  },
  methods: {
    toggloCheck() {
      this.checked = !this.checked
      this.$emit('changCheck', this.checked)
      this.busStaticIpCheckFn(this.checked)
      this.busDynamicIpCheckFn(this.checked)
    },
    busStaticIpCheckFn: function(data) {
      this.$root.Bus.$emit('busStaticIpCheck', data)
    },
    busDynamicIpCheckFn: function(data) {
      this.$root.Bus.$emit('busDynamicIpCheck', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.check {
  width: 26px;
  height: 26px;
  border: 2px solid #009FE8;
  border-radius: 6px;
  cursor: pointer;
  &.checked {
    border: none;
    background: url('./icon_check_hover@2x.png');
    background-size: 100%;
  }
}
</style>
