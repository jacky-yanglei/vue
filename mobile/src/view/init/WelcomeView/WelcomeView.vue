<template>
  <div class="wrapper">
    <img src="../../../assets/images/icon_logo.png" alt="">
    <h1>{{$t('i18n.LIANJIBAO_WELCOME')}}</h1>
    <p>{{$t('i18n.LIANJIBAO_WELCOME_TIP')}}</p>
    <div>
      <router-link to="check-networking"><primary-button>{{$t('i18n.GET_STARTED_A')}}<img class="next" src="@/assets/images/icon_button_arrow.png" alt=""> </primary-button></router-link>
    </div>
  </div>
</template>

<script>
import PrimaryButton from '@/common/components/buttons/primary-button'
import { getToken } from '@/api/login-api'
export default {
  components: {
    PrimaryButton
  },
  mounted () {
    let userInfo = {
      luci_username: 'qeeyou',
      luci_app: 2,
      luci_password: 12345678
    }
    getToken(userInfo)
      .then(res => {
        console.log(res)
        window.sessionStorage.setItem('token', res)
      })
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../common/scss/mixin';
  @import '../../../common/scss/utils';
  .wrapper{
    width: 100%;
    min-height: 100vh;
    background:linear-gradient(-180deg,rgba(238,239,242,1),rgba(216,218,225,1));
    text-align: center;
    padding-top: rem(241px);
    font-family: PingFangSC-Regular;
    h1{
      font-size: rem(48px);
      margin-top: rem(60px);
    }
    p{
      color: #75738B;
      margin-top: rem(20px);
      font-size: rem(28px);
    }
    img{
      width: rem(150px);
    }
    div{
      width: rem(590px);
      margin: rem(100px) auto 0;
      img.next{
        width: rem(18px);
        vertical-align: middle;
        position: relative;
        top: - rem(2px);
        margin-left: rem(20px);
      }
    }
  }
</style>
