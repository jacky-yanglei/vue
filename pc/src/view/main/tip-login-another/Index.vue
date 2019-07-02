<template>
  <div class="tip-login-another">
    {{ $t('i18n.TIP_LOGIN_ANOTHER') }}
    <div class="tip-btn">
      {{ $t('i18n.SURE') }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TipLoginAnother'
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_mixin.scss';
@mixin component-center {
  margin-top: 7.6%;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}
.tip-login-another {
  width: 400px;
  height: 236px;
  background: rgba(255, 255, 255, 1);
  border-radius: 6px;
  padding: 60px 46px 40px;
  font-size: 22px;
  color: rgba(58, 56, 72, 1);
  position: absolute;
  top: 0;
  box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.06);
  @include component-center;
  & > .tip-btn {
    @include startBtn-primaryHover;
    margin-top: 60px;
    width: 280px;
    line-height: 46px;
  }
}
</style>
