<template>
  <div class="public-header">
    <h3>{{ headerTxt }}</h3>
    <span @click="goBackFn()">
      <i></i>
    </span>
  </div>
</template>

<script>
export default {
  name: 'PublicHeader',
  data: function () {
    return {}
  },
  props: {
    headerTxt: {
      default: '',
      type: String
    }
  },
  methods: {
    goBackFn: function() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../common/scss/_mixin';
  @import '../../../common/scss/_utils';
  .public-header {
    width: 100%;
    height: rem(112px);
    position: relative;
    line-height: rem(112px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    z-index: 2;
    & > span {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: rem(70px);
      height: rem(70px);
      left: rem(10px);
    }
    i {
      font-size: 0;
      width: rem(40px);
      height: rem(40px);
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: rem(20px);
      background: url(../../../assets/images/icon_topbar_back.png) no-repeat;
      background-size: cover;
    }
    & > h3 {
      text-align: center;
      font-size: rem(36px);
      color: rgba(58,56,72,1);
    }
  }
</style>
