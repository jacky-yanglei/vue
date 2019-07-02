<template>
  <div class="wrapper">
    <div v-if="state == 0">
      <h3><img src="../../../assets/images/icon_warning.png" alt="">{{ $t('i18n.NO_USEFUL_NETWORKING_MODE' , {msg: 'DHCP'}) }}</h3>
      <div>
        <div>
          <p>{{ $t('i18n.DHCP_ERROR_REASON') }}</p>
          <p>{{ $t('i18n.DHCP_ERROR_TIP') }}</p>
        </div>
        <div class="btn">
          <router-link to="/check-networking"><PrimartButton>{{$t('i18n.RETEST')}}</PrimartButton></router-link>
        </div>
        <div class="btn">
          <router-link to="/set-static-ip"><PrimartButton>{{$t('i18n.SET_STATIC_IP')}}</PrimartButton></router-link>
        </div>
      </div>
    </div>
    <div v-if="state == 1">
      <h3><img src="../../../assets/images/icon_warning.png" alt="">{{$t('i18n.LIANJIBAO_NO_NETWORK')}}</h3>
      <div>
        <div>
          <p>{{$t('i18n.POSSIBLE_REASONS')}}：</p>
          <ul>
            <li>{{$t('i18n.NO_CONNECTION')}}</li>
            <li>{{$t('i18n.WIFI_SIGNAL_NEARBY_IS_WEAK')}}</li>
          </ul>
        </div>
        <div class="btn">
          <router-link to="/check-networking"><PrimartButton>{{$t('i18n.RETEST')}}</PrimartButton></router-link>
        </div>
        <div class="btn">
          <router-link to="/set-static-ip"><PrimartButton>{{$t('i18n.SET_STATIC_IP')}}</PrimartButton></router-link>
        </div>
    </div>
  </div>
</div>
</template>

<script>
import PrimartButton from '../../../common/components/buttons/primary-button'
export default {
  name: 'NotFoundNetworkingView',
  components: {
    PrimartButton
  },
  data() {
    return {
      state: this.$route.params.state
    }
  },
  created() {
    console.log(this.state)
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
    padding-top: rem(60px);
    padding-bottom: 1px;
    h3{
      font-size: rem(30px);
      line-height: rem(42px);
      color: #3A3848;
      margin-bottom: rem(60px);
      img{
        vertical-align: middle;
        width: rem(40px);
        height: rem(40px);
        margin-right: rem(20px);
        position: relative;
        top: - rem(2px);
      }
    }
    >div>div{
      width: rem(590px);
      margin: 0 auto;
      text-align: left;
      >div:first-child{
        background-color: rgba(255, 255, 255, 0.5);
        padding: rem(40px);
        border-radius: rem(8px);
        line-height: rem(40px);
        margin-bottom: rem(60px);
        ul{
          list-style: inside;
          color: #3A3848;
          margin-top: rem(20px);
          li{
            font-size: rem(28px);
            line-height: rem(40px);
          }
        }
        p{
          font-size: rem(28px);
        }
        p:last-child{
          margin-bottom: rem(60px);
        }
        ul:last-child{
          margin-bottom: rem(40px);
        }
      }
      .btn{
        margin-bottom: rem(20px);
      }
    }
  }
</style>
