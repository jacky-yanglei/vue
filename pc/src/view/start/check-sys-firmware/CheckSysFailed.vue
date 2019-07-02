<template>
  <div class="dhcp-not-found-view start-pd">
    <div class="dhcp-not-found-content">
      <div class="error-tip">
        <error-tips :msg="msg" :show="true"></error-tips>
      </div>
      <p class="sys-tip">
        <span class="current-sys">{{ $t('i18n.CURRENT_VERSION') }}: {{ currentSys }}</span>
        <span class="new-sys">{{ $t('i18n.LATEST_VERSION') }}: {{ newSys }}</span>
      </p>
      <div class="reason">
        <h3>{{ newSys }}{{ $t('i18n.SYS_UPDATE_CONTENT') }}：</h3>
        <div class="update-info" id="update-infoes">
          <div v-html="updateInfo"></div>
        </div>
      </div>
    </div>
    <fade-tips :msg="tips.msg" :show="tips.show" :type="tips.type" @hide="tips.show = false">
    </fade-tips>
    <primary-button @btnClicked="onlineUpdate()" :disabled="updateing" :loading="updateing" :text="text"></primary-button>
    <a href="javascript:;" v-if="isShowToIndexBtn" class="jump" @click="toIndex()">{{ $t('i18n.JUMP_UPDATE_START') }}</a>
    <oval></oval>
  </div>
</template>

<script>
import Oval from '@/common/components/oval/oval'
import ErrorTips from '@/common/components/error-tips/error-tips'
import { getInitStatusApi } from '../../../api/login-api'
import { sysFirmwareCheck, sysOnlineUpgradeFirmware, sysFirmwareInfo } from '@/api/system-manage-api'
import { PrimaryButton } from '../../../common/components/buttons/index'
import FadeTips from '../../../common/components/fade-tips/FadeTips'

import { compareVersion } from '../../../common/service/utils'
import getNetTypeAndWifiSsidService from '../../../common/service/getNetTypeAndWifiSsid'

export default {
  name: 'CheckSysFailed',
  data: function() {
    return {
      currentSys: '',
      newSys: '',
      lastSys: '',
      forceUpdate: '0', // 0 : 不强制升级； 1： 强制升级
      msg: this.$t('i18n.TIP_SYS_LOW_UPDATE'),
      updateInfo: '',
      isShowToIndexBtn: false, // 是否显示跳转到首页的按钮,默认显示
      saveConfig: 0,
      waiting: {
        msg: this.$t('i18n.FIRMWARE_UPDATE_TIPS'),
        show: true
      },
      tips: {
        msg: '',
        type: 'success',
        show: false
      },
      updateing: false,
      checkVersionOk: false,
      text: this.$t('i18n.UPDATE_NOW'),
      updateIntervalTime: null,
      versionType: null,
      isNoForceUpdate: true, // 是否不需要升级；通过当前版本与最低兼容版本比较，true:不要升级；false:需要升级
      urlT: null
    }
  },
  components: {
    ErrorTips,
    Oval,
    PrimaryButton,
    FadeTips
  },
  methods: {
    apiSysFirmwareCheckFn: function() {
      sysFirmwareCheck()
        .then(data => {
          this.newSys = data.version
          this.updateInfo = data.changlog
          this.updateInfo = this.updateInfo.replace(/\r\n/g, '<br>')
          this.updateInfo = this.updateInfo.replace(/\n/g, '<br>')
          this.saveConfig = data.save_config
          this.checkVersionOk = true
          this.versionType = data.version_type
          this.lastSys = data.compatible_version || '0.0.0' // 获取允许兼容的最低版本
          // 通过最低兼容版本判断是否强制升级
          this.checkIsForceUpdateFn()
          // 产生滚动条
          this.createBar()
          // 是否强制升级字段
          this.forceUpdate = parseInt(data.force_upgrade) // 1:强制升级；0，不一定强制升级
        })
        .catch(e => {
          this.tips.show = true
          this.tips.type = 'error'
          this.tips.msg = `${this.$t('i18n.FAILED_UPDATE_SYS_INFO')}`
        })
    },
    apiSysFirmwareInfoFn: function() {
      // 获取当前固件信息
      sysFirmwareInfo()
        .then(data => {
          this.currentSys = data.version
          this.apiSysFirmwareCheckFn()
        })
        .catch(e => {
          this.tips.show = true
          this.tips.type = 'error'
          this.tips.msg = `${this.$t('i18n.FAILED_CURRENT_SYS_INFO')}`
          this.apiSysFirmwareCheckFn()
        })
    },
    createBar() {
      this.$nextTick(() => {
        new this.$geminiScrollbar({
          element: document.getElementById('update-infoes')
        }).create()
      })
    },
    toIndex: function() {
      window.sessionStorage.setItem('init_status', 1)
      // 跳转到首页
      this.$router.push('/')
    },
    checkCompleted() {
      // 如果是保存配置在线升级
      this.updateIntervalTime = setInterval(() => {
        getInitStatusApi().then(res => {
          if ('' + res.ret) {
            this.$router.push('/check-sys-success')
            this.waiting.show = false
            this.$root.Bus.$emit('waitingMaskShow', this.waiting)
          }
        })
      }, 4000)
    },
    onlineUpdateFirmware() {
      sysOnlineUpgradeFirmware({
        image_type: this.versionType
      })
        .then(res => {
          if (Number.parseInt(res.ret) === 0) {
            this.checkCompleted() // 轮询查询是否升级完成
          } else {
            return Promise.reject(res.msg)
          }
        })
        .catch(e => {
          // 固件升级失败
          this.updateing = false
          this.tips.show = true
          this.tips.type = 'error'
          this.tips.msg = e
          this.waiting.msg = this.$t('i18n.FIRMWARE_UPDATE_TIPS')
          this.waiting.show = false
          this.$root.Bus.$emit('waitingMaskShow', this.waiting)
        })
    },
    onlineUpdate() {
      if (!this.checkVersionOk) {
        return null
      }
      getNetTypeAndWifiSsidService() // 获取本机联网信息
        .then(res => {
          this.updateing = true
          const ssid = res.wifiSsid
          const defaultSsid = res.defaultWifiSsid
          const network = res.network
          if (network === 2) {
            this.waiting.msg =
              this.$t('i18n.USE_WIFI_SERVER_UPDATE') +
              (this.saveConfig === 1 ? ssid : defaultSsid)
          }
          this.$root.Bus.$emit('waitingMaskShow', this.waiting)
          this.onlineUpdateFirmware() // 开始在线升级固件
        })
        .catch(e => {
          // 获取本机联网信息失败
          this.tips.show = true
          this.tips.type = 'error'
          this.tips.msg = `${this.$t('i18n.FAILED_GET_NET')}`
        })
    },
    dealViewFn: function() {
      if (this.forceUpdate === 1 || !this.isNoForceUpdate) {
        this.isShowToIndexBtn = false
      } else {
        this.isShowToIndexBtn = true
      }
    },
    checkIsForceUpdateFn: function() {
      let result = compareVersion(this.lastSys, this.currentSys) // true: 不需要升级，false:需要升级
      this.isNoForceUpdate = result
      this.dealViewFn() // 控制视图
    }
  },
  created() {
    // alert(123)
    // this.currentSys = this.$route.params.currentVer
    this.apiSysFirmwareInfoFn()
    this.$root.Bus.$emit('HiddenAppLoading')
    this.urlT = window.location.protocol + '//' + window.location.host
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_constant.scss';
@import '../../../common/sass/_mixin.scss';

.dhcp-not-found-view {
  margin: 0 auto;
  width: $startContentWidth;
  overflow: visible;
  .title {
    margin-bottom: 30px;
    color: rgba(58, 56, 72, 1);
    text-align: center;
    font-size: 18px;
    line-height: 25px;
    .alert {
      margin-top: 3px;
      margin-right: 10px;
    }
  }
  .dhcp-not-found-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: $startContentRaduis;
    background: white;
    height: 364px;
    position: relative;
    & > .sys-tip {
      padding-top: 10px;
      padding-left: 30px;
      padding-right: 30px;
      color: rgba(58, 56, 72, 1);
      font-size: 14px;
      & > .new-sys {
        float: right;
      }
    }
    & > .error-tip {
      position: absolute;
      width: 100%;
      height: 20px;
      top: 0px;
      font-size: 14px;
    }
    .reason {
      box-sizing: border-box;
      margin: 0 auto;
      padding: 20px 0px 30px 30px;
      width: 372px;
      // height: 186px;
      border-radius: $startContentRaduis;
      background: rgba(241, 193, 68, 0.1);
      color: rgba(58, 56, 72, 1);
      font-size: 14px;
      line-height: 28px;
      margin-top: 30px;
      & > h3 {
        font-size: 14px;
      }
      & > .update-info {
        width: 100%;
        height: 164px;
        // border: 1px solid red;
        li {
          margin-right: 5px;
          line-height: 20px;
          font-family: PingFangSC-Regular;
          padding-top: 5px;
        }
      }
    }
  }
  .buttons {
    @include startBtn-primaryHover;
    width: 432px;
    height: 56px;
    line-height: 56px;
    margin-top: 30px;
  }
  .jump {
    display: block;
    width: 100%;
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Regular;
    color: rgba(117, 115, 139, 1);
    line-height: 22px;
    text-align: center;
    // margin-top: 30px;
    position: relative;
    top: 30px;
    &:hover,
    &:focus {
      color: rgba(0, 159, 232, 1);
      text-decoration: underline;
    }
  }
}
</style>
