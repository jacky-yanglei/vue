<template>
<div>
  <div class="force-update" :class="{'blur': isShowBlur}">
    <div class="view">
      <div class="title">
        <i></i>
        <span>{{$t('i18n.CURRENT_VERSION_TOO_LOW_PLEASE_UPDATE')}}</span>
      </div>
      <div class="content">
        <div class="version-info">
          <span class="curr-version">{{ $t('i18n.CURRENT_VERSION') }}:{{ currVersion }}</span>
          <span class="new-version">{{ $t('i18n.LATEST_VERSION') }}:{{ updateInfo.version }}</span>
        </div>
        <div class="update-info">
          <div>2.0.1{{$t('i18n.VERSION_UPDATE_CONTENT')}}</div>
          <div class="log-wrapper" ref="ChangLog">
            <p v-html="changLog"></p>
          </div>
        </div>
        <primary-button :disabled="disabled" :loading="loading" @buttonClicked="upgradingVersionFn">{{$t('i18n.UPGRADE_NOW')}}</primary-button>
      </div>
    </div>
  </div>
  <fade-tips :msg="tip.msg" :show="tip.show" :type="tip.type" @hide="hideFadeTipsFn"></fade-tips>
  <loading-mask :msg="loadingMaskObj.msg"
      :show="loadingMaskObj.show"
      :showMask="loadingMaskObj.showMask"></loading-mask>
</div>
</template>

<script>
import PrimaryButton from '@/common/components/buttons/primary-button'
import { mapGetters } from 'vuex'
import Bscroll from 'better-scroll'
import FadeTips from '@/common/components/fade-tips/fade-tips'
import getNetTypeAndWifiSsidService from '@/common/service/getNetTypeAndWifiSsid'
import LoadingMask from '@/common/components/loadings/loading-mask'
import { sysOnlineUpgradeFirmware } from '@/api/system-manage-api'
import { getInitStatusApi } from '@/api/login-api'
export default {
  name: 'ForceUpdate',
  data: function () {
    return {
      changLog: null,
      disabled: false,
      loading: false,
      url: null,
      isShowBlur: false,
      versionType: null,
      tip: {
        msg: '',
        type: 'success',
        show: false
      },
      loadingMaskObj: {
        msg: '',
        show: false,
        showMask: false
      }
    }
  },
  components: {
    PrimaryButton,
    FadeTips,
    LoadingMask
  },
  computed: {
    ...mapGetters({
      updateInfo: 'sysUpdataInfo',
      currVersion: 'currVersion'
    })
  },
  methods: {
    upgradingVersionFn: function () {
      getNetTypeAndWifiSsidService()
        .then(res => {
          const ssid = res.wifiSsid
          let str = `${this.$t('i18n.DO_NOT_OFF_POWSER')},${this.$t('i18n.UPGRADE_PROCESS')}${this.$t('i18n.NETWORK_WILL_DISCONNENTION_PLEASE_CHECK_INTERNET')}`
          this.loadingMaskObj.msg = str + ssid
          this.loadingMaskObj.show = true
          this.loadingMaskObj.showMask = true
          this.isShowBlur = true
          this.apiOnlineUpdateFn()
        })
        .catch(e => {
          this.tip.msg = this.$t('i18n.ONLINE_UPGRADE_FAILED')
          this.tip.show = true
          this.tip.type = 'error'
          this.isShowBlur = true
          this.disabled = false
          this.loading = false
        })
    },
    conversionFn: function () {
      let log = this.updateInfo.changlog.replace(/\r\n/g, '<br>')
      this.versionType = this.updateInfo.version_type
      log = this.updateInfo.changlog.replace(/\n/g, '<br>')
      this.changLog = log
    },
    bScrollFn: function () {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new Bscroll(this.$refs.ChangLog, {})
        } else {
          this.scroll.refresh()
        }
      })
    },
    hideFadeTipsFn: function (data) {
      this.tip.msg = data
      this.isShowBlur = data
    },
    apiOnlineUpdateFn: function () {
      sysOnlineUpgradeFirmware({ 'image_type': this.versionType }) // 根据用户版本来升级测试版还是正式版
        .then(res => {
          this.checkNetStatusFn()
        })
        .catch(e => {
          this.tip.msg = this.$t('i18n.ONLINE_UPGRADE_FAILED')
          this.tip.show = true
          this.tip.type = 'error'
          this.isShowBlur = true
          this.disabled = false
          this.loading = false
        })
    },
    checkNetStatusFn: function () {
      // 检查网络是否连接
      let aa = setTimeout(() => {
        getInitStatusApi()
          .then(res => {
            clearTimeout(aa)
            this.loadingMaskObj.msg = ''
            this.loadingMaskObj.show = false
            this.loadingMaskObj.showMask = false
            this.tip.msg = this.$t('i18n.ONLINE_CHECK_SUCCESS')
            this.tip.show = true
            this.tip.type = 'success'
            this.isShowBlur = true
            this.disabled = false
            this.loading = false
          })
          .catch(e => {
            clearTimeout(aa)
            this.checkNetStatusFn()
          })
      }, 3000)
    }
  },
  mounted () {
    this.conversionFn()
    this.bScrollFn()
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../common/scss/_mixin';
  @import '../../../common/scss/_utils';
  @import '../../../common/scss/tools';
  .force-update {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    padding-top: rem(100px);
    padding-left: rem(80px);
    padding-right: rem(80px);
    background:linear-gradient(0deg,rgba(238,239,242,1),rgba(216,218,225,1));
    & > .view {
      .title {
        padding-left: rem(60px);
        position: relative;
        padding-bottom: rem(62px);
        i {
          position: absolute;
          left: 0;
          width: rem(40px);
          height: rem(40px);
          background: url(../../../assets/images/icon_warning.png) no-repeat;
          background-size: cover;
          margin-right: rem(20px);
        }
        span {
          font-size: rem(30px);
          color: rgba(58,56,72,1);
        }
      }
      .version-info {
        overflow: hidden;
        margin-bottom: rem(20px);
        & > span {
          font-size: rem(30px);
          color: rgba(58, 56, 72, 1);
          &.curr-version {
            float: left;
          }
          &.new-version {
            float: right;
          }
        }
      }
      .update-info {
        width: 100%;
        height: rem(550px);
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: rem(8px);
        padding: rem(40px);
        margin-bottom: rem(60px);
        & > div {
          font-size: rem(28px);
          color: rgba(58, 56, 72, 1);
          margin-bottom: rem(20px);
        }
        & > .log-wrapper {
          height: rem(410px);
          overflow: hidden;
          margin-bottom: rem(100px);
        }
        p {
          font-size: rem(30px);
          color: rgba(58, 56, 72, 1);
        }
      }
    }
  }
</style>
