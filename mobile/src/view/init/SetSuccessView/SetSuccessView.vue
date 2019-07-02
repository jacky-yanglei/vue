<template>
  <div class="wrapper">
    <h5>{{$t('i18n.SETUP_COMPLETE')}}</h5>
    <div class="input-group">
      <div>{{$t('i18n.IP_ADDRESS')}}:</div>
      <div>{{ip}}</div>
    </div>
    <div class="input-group">
      <div>{{$t('i18n.DEFAULT_WIFI_NAME')}}:</div>
      <div>{{ssid}}</div>
    </div>
    <div class="input-group">
      <div>{{$t('i18n.DEFAULT_PASSWORD')}}:</div>
      <div>{{password}}</div>
    </div>
    <div class="confirm-btn">
      <router-link to="/init-check-version"><PrimartButton>{{$t('i18n.GET_STARTED')}}</PrimartButton></router-link>
    </div>
    <p>
      {{$t('i18n.ADMIN_PASSWORD_IS_THE_SAME_AS_WIFI_PASSWORD_A')}}
      <br>
      {{$t('i18n.MODIFY_IN_THE_TOOLBOX')}}
    </p>
  </div>
</template>

<script>
import PrimartButton from '../../../common/components/buttons/primary-button'
import { getInitNetInfoApi } from '@/api/network-check-api'
export default {
  name: 'SetSuccessView',
  data() {
    return {
      ip: '',
      ssid: '',
      password: ''
    }
  },
  components: {
    PrimartButton
  },
  mounted() {
    this.getInitNetInfo()
  },
  methods: {
    getInitNetInfo() {
      getInitNetInfoApi()
        .then(res => {
          this.ip = res.ip
          this.ssid = res.ssid
          this.password = res.password
          this.infoDone = true
          this.errNum = 1
        })
        .catch(e => {
          this.errNum++
          if (this.errNum <= 2) {
            this.getInitNetInfo()
          }
        })
    }
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
    h5{
      font-size: rem(36px);
      color:#3A3848;
      line-height: rem(50px);
      margin-bottom: rem(40px);
    }
    p{
      font-size: rem(26px);
      color: #75738B;
      line-height: rem(37px);
    }
    .confirm-btn{
      width: rem(590px);
      margin: rem(60px) auto rem(40px);
    }
    .input-group{
      text-align: left;
      width: rem(590px);
      margin: 0 auto rem(30px);
      >div:first-child{
        font-size: rem(26px);
        color: #75738B;
        margin-bottom: rem(20px);
      }
      >div:last-child{
        background-color: white;
        padding: rem(24px) rem(30px);
        border-radius: rem(8px);
        font-size: rem(30px);
        color: #3A3848;
        line-height: rem(42px);
      }
    }
  }
</style>
