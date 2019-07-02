<template>
  <div class="many-user-login">
    <div class="coantiner">
      <h5 class="phone">{{ phone }}</h5>
      <p class="dis">{{ $t('i18n.ACCOUNT_BEING_USED_TIP') }}</p>
      <p class="dis">{{ $t('i18n.MOBILE_VARIFICATION_TIP') }}</p>
      <div class="code-container">
        <input type="text" :placeholder="$t('i18n.FILL_IN_VERIFICATION_CODE')">
        <button class="sendCode">{{ $t('i18n.SEND_VERIFICATION_CODE') }}</button>
      </div>
      <button type="button" class="login-btn">{{ $t('i18n.LOGIN') }}</button>
    </div>
    <oval></oval>
  </div>
</template>

<script>
import Oval from '@/common/components/oval/oval'

export default {
  name: 'ManyUserLogined',
  props: {
    phone: {
      default: '',
      type: String
    }
  },
  components: {
    Oval
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_constant.scss';
@import '../../../common/sass/_mixin.scss';

.many-user-login {
  width: 432px;
  margin: 0 auto;
  .coantiner {
    width: 100%;
    background: rgba(255, 255, 255, 1);
    border-radius: $startContentRaduis;
    padding: 40px 60px;
    .phone {
      font-size: 22px;
      color: rgba(58, 56, 72, 1);
      text-align: center;
      margin-bottom: 20px;
    }
    .dis {
      font-size: 14px;
      color: rgba(58, 56, 72, 1);
      line-height: 20px;
      text-align: center;
    }
    .code-container {
      width: 100%;
      height: 46px;
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      input {
        height: 46px;
        width: 182px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        font-size: 14px;
        color: rgba(179, 179, 179, 1);
        line-height: 46px;
        border: 1px solid #f0f3f7;
        padding-left: 20px;
      }
      .sendCode {
        @include startBtn-primaryHover();
        width: 110px;
        height: 46px;
        font-size: 14px;
        margin: 0;
      }
    }
    .login-btn {
      @include startBtn-primaryHover();
      margin-top: 40px;
    }
  }
}
</style>
