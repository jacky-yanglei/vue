<template>
  <div>
    <div class="tools-wrapper-main firmware" :class="{'blur': isShowBlur}">
      <public-header :headerTxt="headerTxt"></public-header>
      <div class="mg-40 tools-wrapper-max">
        <div class="toggle-btn">
          <span :class="{'selected-online': isOnlineUpdate}" @click="selectedOnlineFn()">{{$t('i18n.ONLINE_UPDATE')}}</span>
          <span :class="{'selected-local': isLocalUpdate}" @click="selectedLocalFn()">{{$t('i18n.LOCAL_UPDATE')}}</span>
        </div>
        <div class="firmware-wrapper" v-show="isOnlineUpdate">
          <div class="sys-tip">
            <span class="current-sys">{{$t('i18n.CURRENT_VERSION')}}：{{ currSys }}</span>
            <span class="new-sys">{{$t('i18n.LATEST_VERSION')}}：{{ leastSys }}</span>
          </div>
          <div class="update-con-tip">
            <h3>{{$t('i18n.UPDATE_CONTENT')}}：</h3>
            <div class="change-log" ref="ChangLog">
              <p v-html="changLog"></p>
            </div>
          </div>
          <div class="tools-bottom">
            <primart-button :disabled="disabled"
              :loading="loading"
              @buttonClicked="checkUpdateBtnFn()"
              v-show="isShowCheckSysBtn">{{ txtCheckSys }}</primart-button>
            <primart-button :disabled="disabled"
              :loading="loading"
              @buttonClicked="onlineUpdateBtnFn()"
              v-show="!isShowCheckSysBtn">{{ txtUpdateSys }}</primart-button>
          </div>
        </div>
        <div class="firmware-wrapper" v-show="isLocalUpdate">
          <div class="sys-tip bdr-btm0">
            <span class="current-sys">{{$t('i18n.CURRENT_VERSION')}}：{{ currSys }}</span>
            <span class="new-sys">{{$t('i18n.SAVE_THE_CURRENT_CONFIGURATION')}}：
              <i class="check-btn" :class="{'checked': isChecked}" @click="clickCheckedFn()"></i>
            </span>
          </div>
          <div class="seclect-wrapper">
            <span class="select-file" @click="selectFileFn()">{{$t('i18n.CHOOSE_FILE')}}</span>
            <span class="file-tip">{{ txtFileTip }}</span>
            <input type="file" name="image" hidden ref="inputFile" @change="showFileNameFn($event)">
          </div>
          <div class="tools-bottom">
            <primary-button :disabled="disabled"
              :loading="loading"
              @buttonClicked="manualUploadBtnFn()"
              v-show="isShowUploadBtn">{{ txtManualUpload }}</primary-button>
            <primary-button :disabled="disabled"
              :loading="loading"
              @buttonClicked="manualUpdateFn()"
              v-show="!isShowUploadBtn">{{ txtUpdateSys }}</primary-button>
          </div>
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
import PublicHeader from '@/common/components/public-header/public-header'
import PrimaryButton from '@/common/components/buttons/primary-button'
import FadeTips from '@/common/components/fade-tips/fade-tips'
import utils from '@/common/service/utils'
import getNetTypeAndWifiSsidService from '@/common/service/getNetTypeAndWifiSsid'
import LoadingMask from '@/common/components/loadings/loading-mask'
import { getInitStatusApi } from '@/api/login-api'
import {
  sysFirmwareInfo,
  sysFirmwareCheck,
  sysOnlineUpgradeFirmware,
  uploadFirmwareApi,
  updateFirmwareApi
} from '@/api/system-manage-api'
import jsonp from '@/plugin/jsonp'
import Bscroll from 'better-scroll'
export default {
  name: 'Firmware',
  data: function () {
    return {
      headerTxt: this.$t('i18n.FIRMWARE_UPDATE_AND_RESTORE'),
      disabled: false,
      loading: false,
      isOnlineUpdate: true,
      isLocalUpdate: false,
      isChecked: true,
      txtFileTip: this.$t('i18n.NO_FILES_SELECTED'),
      file: null,
      currSys: null,
      leastSys: null,
      changLog: null,
      isShowBlur: false,
      txtCheckSys: this.$t('i18n.VERSION_CHECK'),
      isShowCheckSysBtn: true, // 是否显示版本检测按钮
      txtUpdateSys: this.$t('i18n.UPGRADE_NOW'),
      versionType: null,
      txtManualUpload: this.$t('i18n.MANUAL_UPDATE'),
      isShowUploadBtn: true, // 是否显示固件升级按钮
      complete: 0,
      saveConfig: 1, // 0 - 不保存配置 | 1 - 保存配置
      url: null,
      stopInterval: null,
      isCanSelectFile: true,
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
    PublicHeader,
    PrimaryButton,
    FadeTips,
    LoadingMask
  },
  methods: {
    checkUpdateBtnFn: function () {
      // 在线检测升级
      this.disabled = true
      this.loading = true
      this.apiCheckSysFn() // 版本检测
    },
    manualUploadBtnFn: function () {
      // 手动升级
      this.disabled = true
      this.loading = true
      this.isShowUploadBtn = true
      this.txtManualUpload = this.$t('i18n.UPLOAD_FIRMWARE')
      this.isCanSelectFile = false
      this.apiUploadSysFn()
    },
    selectedOnlineFn: function () {
      if (!this.disabled) {
        this.isOnlineUpdate = true
        this.isLocalUpdate = false
        this.disabled = false
        this.loading = false
      }
    },
    selectedLocalFn: function () {
      if (!this.disabled) {
        this.isLocalUpdate = true
        this.isOnlineUpdate = false
        this.isShowUploadBtn = true
        this.saveConfig = 1
        this.isChecked = true
        this.disabled = false
        this.loading = false
      }
    },
    clickCheckedFn: function () {
      this.isChecked = !this.isChecked
      if (this.isChecked) {
        this.saveConfig = 1
      } else {
        this.saveConfig = 0
      }
    },
    selectFileFn: function () {
      if (this.isCanSelectFile) {
        this.$refs.inputFile.click()
        this.isShowUploadBtn = true
      } else {
        this.tip.msg = this.$t('i18n.UPLOAD_FIRMWARE')
        this.tip.show = true
        this.tip.type = 'tip'
        this.isShowBlur = true
      }
    },
    showFileNameFn: function (e) {
      // 显示文件名称
      let target
      if (e.srcElement) {
        target = e.srcElement.files
      }
      if (e.target) {
        target = e.target.files
      }
      if (target.length) {
        this.txtFileTip = target[0].name
      } else {
        this.txtFileTip = this.$t('i18n.NO_FILES_SELECTED')
      }
      this.file = target[0]
    },
    hideFadeTipsFn: function (data) {
      this.tip.show = data
      this.isShowBlur = data
    },
    apiGetCurrSysFn: function () {
      sysFirmwareInfo()
        .then(res => {
          this.currSys = res.version
          this.versionType = res.version_type
          this.apiCheckLeastSysFn()
        })
        .catch(e => {
          this.tip.msg = this.$t('i18n.FAILED_GET_NETWORK_INFO')
          this.tip.show = true
          this.tip.type = 'error'
          this.isShowBlur = true
          this.disabled = false
          this.loading = false
        })
    },
    apiCheckLeastSysFn: function () {
      sysFirmwareCheck()
        .then(res => {
          this.leastSys = res.version
          this.versionType = res.version_type
          let log = res.changlog.replace(/\r\n/g, '<br>')
          log = res.changlog.replace(/\n/g, '<br>')
          this.changLog = log
        })
        .catch(e => {
          this.tip.msg = this.$t('i18n.FAILED_GET_NETWORK_INFO')
          this.tip.show = true
          this.tip.type = 'error'
          this.isShowBlur = true
          this.disabled = false
          this.loading = false
        })
    },
    apiCheckSysFn: function () {
      // 版本检测
      sysFirmwareCheck()
        .then(res => {
          this.leastSys = res.version
          this.versionType = res.version_type
          this.tip.msg = this.$t('i18n.VERSION_CHECK_SUCCESS')
          this.tip.show = true
          this.tip.type = 'success'
          this.isShowBlur = true
          let aa = setTimeout(() => {
            this.disabled = false
            this.loading = false
            clearTimeout(aa)
          }, 100)
          this.compareVersionFn()
        })
        .catch(e => {
          this.tip.msg = this.$t('i18n.VERSION_CHECK_FAILED')
          this.tip.show = true
          this.tip.type = 'error'
          this.isShowBlur = true
          this.disabled = false
          this.loading = false
        })
    },
    compareVersionFn: function () {
      // let result = utils.compareVersion(this.leastSys, this.currSys)
      let result = utils.compareVersion(this.currSys, this.leastSys)
      if (result) {
        // 需要升级，显示立即升级按钮
        this.isShowCheckSysBtn = false
      } else {
        // 不需要升级，显示版本检测按钮
        this.isShowCheckSysBtn = true
      }
    },
    onlineUpdateBtnFn: function () {
      // 在线升级
      this.disabled = true
      this.loading = true
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
    },
    apiUploadSysFn: function () {
      // 上传固件
      if (this.file) {
        const config = {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: progressEvent => {
            let complete =
              ((progressEvent.loaded / progressEvent.total * 100) | 0) + '%'
            this.complete = complete
          }
        }
        const param = new FormData()
        param.append('image', this.file)
        if (this.file.size > 0) {
          uploadFirmwareApi(param, config)
            .then(res => {
              this.tip.msg = this.$t('i18n.FIRMWARE_UPLOAD_SUCCESS')
              this.tip.type = 'success'
              this.tip.show = true
              this.isShowBlur = true
              this.txtManualUpload = this.$t('i18n.MANUAL_UPDATE')
              this.isShowUploadBtn = false
              let aa = setTimeout(() => {
                this.disabled = false
                this.loading = false
                this.isCanSelectFile = true
                clearTimeout(aa)
              }, 100)
            })
            .catch(e => {
              let msg = this.apiErrorDealFn(e)
              this.tip.msg = msg
              this.tip.type = 'error'
              this.tip.show = true
              this.isShowBlur = true
              this.isShowUploadBtn = true
              let aa = setTimeout(() => {
                this.disabled = false
                this.loading = false
                this.isCanSelectFile = true
                clearTimeout(aa)
              }, 100)
            })
        }
      } else {
        this.tip.msg = this.$t('i18n.PLEASE_ADD_FIRMWARE')
        this.tip.type = 'tip'
        this.tip.show = true
        this.isShowBlur = true
        this.disabled = false
        this.loading = false
        this.txtManualUpload = this.$t('i18n.MANUAL_UPDATE')
      }
    },
    manualUpdateFn: function () {
      // 本地升级
      this.disabled = true
      this.loading = true
      getNetTypeAndWifiSsidService()
        .then(res => {
          const ssid = res.wifiSsid
          const defaultSsid = res.defaultWifiSsid
          let str = `${this.$t('i18n.DO_NOT_OFF_POWSER')},${this.$t('i18n.UPGRADE_PROCESS')}${this.$t('i18n.NETWORK_WILL_DISCONNENTION_PLEASE_CHECK_INTERNET')}`
          this.loadingMaskObj.msg = str + (this.saveConfig === 1 ? ssid : defaultSsid)
          this.loadingMaskObj.show = true
          this.loadingMaskObj.showMask = true
          this.isShowBlur = true
          this.apiUpdateFirmwareFn()
        })
        .catch(e => {
          this.tip.msg = this.$t('i18n.MANUAL_UPGRADE_FAILED')
          this.tip.show = true
          this.tip.type = 'error'
          this.isShowBlur = true
          this.disabled = false
          this.loading = false
        })
    },
    apiUpdateFirmwareFn: function () {
      updateFirmwareApi({ 'save_config': this.saveConfig })
        .then(res => {
          this.checkCurrUrlFn()
        })
        .catch(e => {
          this.tip.msg = this.$t('i18n.MANUAL_UPGRADE_FAILED')
          this.tip.show = true
          this.tip.type = 'error'
          this.isShowBlur = true
          this.disabled = false
          this.loading = false
        })
    },
    checkCurrUrlFn: function () {
      const host = window.location.host
      let result = host === 't.qeeyou.cn' || host === '192.168.8.1'
      if (result || this.saveConfig === 1) {
        this.checkNetStatusWithManualFn()
      } else {
        this.stopInterval = setInterval(() => {
          this.checkInternetFn()
        }, 5000)
      }
    },
    checkInternetFn: function () {
      // 检查网络是否连接（通过jsonp判断是否正确联网）
      const url = `${this.url}/cgi-bin/luci/sys_init_get`
      jsonp(url, {}, { format: 'jsonp' })
        .then(res => {
          window.clearInterval(this.stopInterval)
          window.sessionStorage.removeItem('token')
          window.location.href = window.location.protocol + '//192.168.8.1'
        })
        .catch(e => {
          window.clearInterval(this.stopInterval)
          window.sessionStorage.removeItem('token')
          window.location.href = window.location.protocol + '//192.168.8.1'
        })
    },
    checkNetStatusWithManualFn: function () {
      // 通过sys_init_get接口检测联网状态
      let aa = setTimeout(() => {
        getInitStatusApi()
          .then(res => {
            clearTimeout(aa)
            this.loadingMaskObj.msg = ''
            this.loadingMaskObj.show = false
            this.loadingMaskObj.showMask = false
            this.isShowBlur = false
            this.disabled = false
            this.loading = false
            window.sessionStorage.removeItem('token')
            window.location.href = this.url
          })
          .catch(e => {
            clearTimeout(aa)
            this.checkNetStatusWithManualFn()
          })
      }, 3000)
    }
  },
  created () {
    this.apiGetCurrSysFn()
  },
  mounted () {
    const randNum = Math.random() * 1000
    this.url = window.location.protocol + '//' + window.location.host + window.location.pathname + `?updateNum=${randNum}/`
    this.$nextTick(() => {
      this.scroll = new Bscroll(this.$refs.ChangLog, {})
    })
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../common/scss/_mixin';
  @import '../../../common/scss/_utils';
  @import '../../../common/scss/tools';
  .firmware {
    .toggle-btn {
      width: 100%;
      height: rem(80px);
      background: rgba(255,255,255,1);
      border-radius: rem(8px);
      border: rem(2px) solid rgba(0,159,232,1);
      & > span {
        font-size: rem(30px);
        line-height: rem(77px);
        width: 50%;
        float: left;
        color:rgba(117,115,139,1);
        text-align: center;
        &.selected-local {
          background: linear-gradient(-90deg,rgba(57,193,255,1),rgba(0,159,232,1));
          color: rgba(255,255,255,1);
        }
        &.selected-online {
          background: linear-gradient(-90deg,rgba(57,193,255,1),rgba(0,159,232,1));
          color: rgba(255,255,255,1);
        }
      }
    }
    .sys-tip {
      padding-top: rem(60px);
      overflow: hidden;
      padding-bottom: rem(20px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      & > span {
        font-size: rem(30px);
        color: rgba(58,56,72,1);
        &.current-sys {
          float: left;
        }
        &.new-sys {
          float: right;
        }
      }
      .check-btn {
        float: right;
        width: rem(46px);
        height: rem(46px);
        position: relative;
        top: rem(-4px);
        background: url(../../../assets/images/icon_check_normal.png);
        background-size: cover;
        &.checked {
          background: url(../../../assets/images/icon_check_checked.png);
          background-size: cover;
        }
      }
      &.bdr-btm0 {
        border-bottom: none;
      }
    }
    .update-con-tip {
      overflow: hidden;
      position: fixed;
      left: rem(40px);
      right: rem(40px);
      bottom: rem(150px);
      top: rem(380px);
      padding-bottom: rem(60px);
      & > h3 {
        line-height: rem(42px);
        padding-bottom: rem(20px);
      }
      & > .change-log {
        overflow: hidden;
        height: 100%;
      }
      p {
        color: rgba(58, 56, 72, 1);
        font-size: rem(30px);
        line-height: rem(42px);
      }
    }
    .seclect-wrapper {
      & > .select-file {
        display: block;
        font-size: rem(30px);
        color: rgba(117,115,139,1);
        width: 100%;
        height: rem(80px);
        background: linear-gradient(180deg,rgba(255,255,255,1),rgba(245,245,245,1));
        box-shadow: 0px rem(2px) 0px 0px rgba(255,255,255,1);
        border-radius: rem(8px);
        border: 1px solid rgba(216,216,216,1);
        text-align: center;
        line-height: rem(80px);
        margin-top: rem(82px);
      }
      & > .file-tip {
        display: block;
        font-size: rem(28px);
        color: rgba(58,56,72,1);
        padding-top: rem(20px);
      }
    }
  }
</style>
