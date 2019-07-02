<template>
  <div>
    <div class="wrapper">
      <p @click="popShow = true">{{$t('i18n.CHECKING_WHETHER_NEED_UPDATED_SYS')}}</p>
      <div class="loading-block">
        <LoadingBall></LoadingBall>
      </div>
    </div>
    <div class="pop-modal" :class="Upgrading?'filter':''" v-if="popShow">
      <!--最新版本成功-->
      <div class="success-view" v-if="UpgradeIndex === 0">
        <div>
          <div>
            <img src="@/assets/images/icon_right.png" alt="">
          </div>
          <p>{{$t('i18n.SYS_IS_THE_LATEST_VERSION')}}</p>
        </div>
        <div>
          <router-link to="/"><primary-button>{{ $t('i18n.GET_STARTED') }}</primary-button></router-link>
        </div>
      </div>
      <!--需要更新页面-->
      <div class="upgrading" v-if="UpgradeIndex !== 0">
        <div class="view">
          <div class="title" v-if="UpgradeIndex === 1 || UpgradeIndex === 2">
            <span><img src="@/assets/images/icon_warning.png" alt=""></span>
            <span>{{$t('i18n.CURRENT_VERSION_TOO_LOW_PLEASE_UPDATE')}}</span>
          </div>
          <div class="content">
            <div :style="UpgradeIndex === 3?'margin-top:0':''">
              <div>{{ $t('i18n.CURRENT_VERSION') }}:{{this.LocalVersionInfo.version}}</div>
              <div>{{ $t('i18n.LATEST_VERSION') }}:{{this.OnlineVersionInfo.version}}</div>
            </div>
            <div>
              <div>{{this.OnlineVersionInfo.version}}{{$t('i18n.VERSION_UPDATE_CONTENT')}}</div>
              <div v-html="this.OnlineVersionInfo.changlog"></div>
            </div>
            <primary-button @buttonClicked="UpgradingVersion">{{$t('i18n.UPGRADE_NOW')}}</primary-button>
          </div>
          <div class="jump" v-if="UpgradeIndex === 3">
            <router-link to="/"><span>{{$t('i18n.SKIP_UPGRADE_AND_START_USING')}}</span></router-link>
          </div>
        </div>
      </div>
    </div>
    <!--更新中的遮罩层-->
    <div class="loading" v-if="Upgrading">
      <loading-wait :show="Upgrading" :msg="$t('i18n.UPGRADE_PROCESS') + $t('i18n.NETWORK_WILL_DISCONNENTION_PLEASE_CHECK_INTERNET_1') + thisWifiSsid"></loading-wait>
    </div>
  </div>
</template>

<script>
import LoadingBall from '@/common/components/loadings/loading-ball'
import LoadingWait from '@/common/components/loadings/loading-wait'
import PrimaryButton from '@/common/components/buttons/primary-button'
import { sysFirmwareInfo, sysFirmwareCheck, sysOnlineUpgradeFirmware } from '@/api/system-manage-api'
import { getInitStatusApi } from '@/api/login-api'
import utils from '@/common/service/utils'
import getNetTypeAndWifiSsidService from '@/common/service/getNetTypeAndWifiSsid'

export default {
  components: {
    LoadingBall,
    PrimaryButton,
    LoadingWait
  },
  data() {
    return {
      LocalVersionInfo: {},
      OnlineVersionInfo: {},
      popShow: false, // 弹窗是否出现
      UpgradeIndex: 0, // 更新参数  0 代表不用更新 1代表强制更新 2代表版本最低更新 3代表软更新
      Upgrading: false, // 升级中...  状态
      thisWifiSsid: ''
    }
  },
  mounted() {
    this.getVersion()
    this.getVersionUpdate()
    getNetTypeAndWifiSsidService().then(res => {
      this.thisWifiSsid = res.wifiSsid
    })
  },
  created() {
    // 联网方式
  },
  methods: {
    getVersion () { // 获取版本信息
      sysFirmwareInfo().then(res => {
        this.LocalVersionInfo = res
        this.compareVersionMethods()
      })
    },
    getVersionUpdate() { // 获取最新版本信息
      sysFirmwareCheck().then(res => {
        this.OnlineVersionInfo = res
        this.compareVersionMethods()
      })
    },
    compareVersionMethods() { // 比较版本的方法
      if (this.OnlineVersionInfo.version && this.LocalVersionInfo.version) {
        this.OnlineVersionInfo.changlog = this.OnlineVersionInfo.changlog.replace(/\r\n/g, '<br>')
        if (this.OnlineVersionInfo.force_upgrade === 1) { // 如果是强制升级
          this.UpgradeIndex = 1
        } else {
          if (this.OnlineVersionInfo.compatible_version !== '') {
            this.UpgradeIndex = utils.compareVersion(this.LocalVersionInfo.version, this.OnlineVersionInfo.compatible_version) ? 2 : 0
          } else {
            this.UpgradeIndex = utils.compareVersion(this.LocalVersionInfo.version, this.OnlineVersionInfo.version) ? 3 : 0
          }
        }
        this.popShow = true
        if (this.UpgradeIndex === 0) {
          window.sessionStorage.setItem('init_status', 1)
        }
      }
    },
    UpgradingVersion() { // 在线升级固件
      this.Upgrading = true
      sysOnlineUpgradeFirmware({})
        .then(() => {
          this.checkCompleted()
        }).catch(e => {})
    },
    checkCompleted() {
      // 如果是保存配置在线升级
      this.updateIntervalTime = setInterval(() => {
        getInitStatusApi().then(res => {
          if ('' + res.ret) {
            this.UpgradeIndex = 0 // 升级成功状态
            this.Upgrading = false // 正在升级状态曲取消
            window.sessionStorage.setItem('init_status', 1)
          }
        })
      }, 4000)
    }
  },
  destroyed() {
    clearInterval(this.updateIntervalTime)
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
    padding-top: rem(100px);
    p{
      font-size: rem(36px);
      color:#3A3848;
      line-height: rem(50px);
    }
    .loading-block{
      position: absolute;
      top: rem(517-141px);
      width: 100%;
    }
    .test-success{
      position: fixed;
      background-color: black;
      color: white;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%) translateY(-30px);
    }
    .test-failed{
      position: fixed;
      background-color: black;
      color: white;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .pop-modal{
    position: fixed;
    width: 100%;
    min-height: 100vh;
    top: 0;
    left: 0;
    z-index: 2;
    background:linear-gradient(-180deg,rgba(238,239,242,1),rgba(216,218,225,1));
  }
  .success-view{
    div{
      width: rem(590px);
      margin: 0 auto;
    }
    >div:first-child{
      background-color: white;
      margin: rem(100px) auto rem(60px);
      text-align: center;
      padding-bottom: rem(60px);
      border-radius:rem(8px);
      >div:first-child{
        width: rem(100px);
        height: rem(100px);
        display: inline-block;
        margin-top: rem(60px);
        margin-bottom: rem(40px);
        img{
          width: 100%;
          height: 100%;
        }
      }
      >p{
        font-size: rem(28px);
        color: #3A3848;
      }
    }
  }
  .upgrading{
    color: #3A3848;
    > .view{
      width: rem(590px);
      margin: 0 auto;
      padding-top: rem(100px);
      .title{
          padding-left: rem(60px);
          position: relative;
          >span:first-child{
            position: absolute;
            width: rem(40px);
            height: rem(40px);
            left: 0;
            img{
              width: 100%;
              height: 100%;
            }
          }
          span{
            font-size: rem(30px);
            line-height: rem(42px);
          }
        }
      .content{
        >div:nth-child(1){
          margin-top: rem(60px);
          padding-bottom: rem(20px);
          &:after{
            content: "";
            display: block;
            clear: both;
          }
          >div{
            float: left;
            width: 50%;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            &:last-child{
              text-align: right;
            }
          }
        }
        >div:nth-child(2){
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: rem(8px);
          padding: rem(40px) rem(43px) rem(60px);
          margin-bottom: rem(60px);
          >div{
            &:first-child{
              margin-bottom: rem(20px);
            }
            line-height: rem(40px);
            font-size: rem(28px);
          }
        }
      }
      .jump{
        text-align: center;
        margin-top: rem(40px);
        margin-bottom: rem(40px);
        font-size: rem(32px);
        a{
          color: #75738B;
        }
      }
    }
  }
  .loading{
    position: fixed;
    z-index: 10;
    width: 100%;
    min-height: 100vh;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .filter{
    filter: blur(10px);
    height: 100vh;
    overflow: hidden;
  }
</style>
