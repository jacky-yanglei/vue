<template>
  <div>
    <div class="background" :class="childRoute ? 'filter' : ''">
      <div class="fix-header">
        <img src="../../../assets/images/icon_warning.png" alt="">{{$t('i18n.WIRED_NETWORK_ERROR_TIP')}}
      </div>
      <div class="fix-footer">
        <div class="btn">
          <router-link to="/check-networking"><primary-button>{{$t('i18n.RETEST_NETWORK_TIP')}}</primary-button></router-link>
        </div>
        <div class="btn">
          <primary-button @buttonClicked="getWifiList">{{$t('i18n.REFRESH_LIST')}}</primary-button>
        </div>
      </div>
      <div ref="wrapper" style="position: relative;height: 100vh;">
        <div class="wrapper">
          <h3>{{$t('i18n.SELECT_NETWORKS_FOR_LIANJIBAO')}}</h3>
          <div class="table">
            <div class="thead">
              <div>
                <div>{{$t('i18n.NAME')}}</div>
                <div>{{$t('i18n.SECURITY_MODE')}}</div>
                <div>{{$t('i18n.SIGNAL')}}</div>
              </div>
            </div>
            <div class="tbody">
              <div v-for="item in list" :key="item.index" @click="navTo(item)">
                <div>{{item.ssid}}</div>
                <div>{{item.encrypt}}</div>
                <div>{{item.signal}}</div>
              </div>
            </div>
          </div>
          <loading-wait :show="list.length == 0" :msg="''"></loading-wait>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import PrimaryButton from '@/common/components/buttons/primary-button'
import Bscroll from 'better-scroll'
import { netRepeaterScan } from '@/api/network-check-api.js'
import LoadingWait from '@/common/components/loadings/loading-wait'

export default {
  name: 'ChoiceWIFIView',
  data() {
    return {
      list: [],
      childRoute: false// 是不是子路由中  对应毛玻璃效果是否开启
    }
  },
  components: {
    PrimaryButton,
    LoadingWait
  },
  watch: {
    '$route'(to, from) {
      this.getRouteStatus()
    }
  },
  mounted() {
    this.getRouteStatus()
    this.$nextTick(() => {
      this.scroll = new Bscroll(this.$refs.wrapper, {})
    })
    this.getWifiList()
  },
  created() {
  },
  methods: {
    getRouteStatus() { // 获取路由状态 对应毛玻璃效果是否开启
      if (this.$route.name === 'ChoiceWIFI') {
        this.childRoute = false
      } else {
        this.childRoute = true
      }
    },
    navTo(WifiInfo) {
      // 将wifi的信息传入全局
      this.$root.Bus.WifiInfo = WifiInfo
      // 避免用户在输入wifi密码时刷新页面再存入sessionStorage备份
      window.sessionStorage.setItem('WifiInfo', JSON.stringify(WifiInfo))
      this.$router.push('/choice-wifi/input-wifi')
    },
    // 获取wifi列表
    getWifiList() {
      let that = this
      that.list = []
      netRepeaterScan().then(res => {
        that.list = res.list
      }).catch(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../common/scss/mixin';
  @import '../../../common/scss/utils';
  .fix-header{
    position: fixed;
    z-index: 10;
    top: 0;
    width: 100%;
    text-align: center;
    font-size: rem(26px);
    line-height: rem(42px);
    color: #75738B;
    margin-bottom: rem(60px);
    padding-top: rem(16px);
    padding-bottom: rem(17px);
    background-color: rgba(255, 255, 255, 0.5);
    img{
      width: rem(40px);
      vertical-align: middle;
      margin-right: rem(20px);
      position: relative;
      top: - rem(2px);
    }
  }
  .fix-footer{
    position: fixed;
    width: 100%;
    bottom: 0;
    padding-bottom: rem(20px);
    padding-top: rem(20px);
    background:linear-gradient(-180deg,rgba(238,239,242,1),rgba(216,218,225,1));
    z-index: 10;
    .btn{
      width: rem(670px);
      margin: 0 auto rem(20px);
    }
  }
  .background{
    background:linear-gradient(-180deg,rgba(238,239,242,1),rgba(216,218,225,1));
  }
  .wrapper{
    width: 100%;
    min-height: 100vh;
    text-align: center;
    padding-top: rem(110px);
    padding-bottom: rem(410px);
    position: relative;
    z-index: 2;
    h3{
      font-size:rem(30px);
      color:rgba(58,56,72,1);
      line-height:rem(42px);
      margin-bottom: rem(32px);
    }
    .table{
      .thead>div{
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        color: #8389A1;
        padding: rem(18px) rem(40px);
      }
      .tbody>div{
        border-bottom: 1px solid rgba(0, 0, 0, 0.03);
        &:hover,&:active{
          background:linear-gradient(-90deg,rgba(57,193,255,1),rgba(0,159,232,1));
          color: white;
        }
        >div{
          padding: rem(29px) rem(40px) rem(30px);
        }
      }
      .thead>div,.tbody>div{
        >div{
          float: left;
          font-size: rem(26px);
          width: 33.333%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &:first-child{
            text-align: left;
          }
          &:last-child{
            text-align: right;
          }
        }
        &:after{
          content: "";
          display: block;
          clear: both;
        }
      }
    }
  }
  .filter{
    filter: blur(10px);
    height: 100vh;
    overflow: hidden;
  }
</style>
