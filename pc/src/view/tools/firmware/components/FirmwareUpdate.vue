/*
 * @Author: Zhengxinglun
 * @Date: 2018-05-16 16:49:00
 * @Last Modified by: Zhengxinglun
 * @Last Modified time: 2018-06-29 10:12:46
 */

<template>
  <div class="firmware-update">
    <h5 class="title">{{ $t('i18n.LOCAL_UPGRADE_AND_RESER') }}</h5>
    <div class="container">
      <div class="version">
        <span>{{ $t('i18n.CURRENT_VERSION') }}：{{ version }}</span>
        <div class="version-right">
          <span class="dis">{{ $t('i18n.SAVE_THE_CURRENT_CONFIGURATION') }}：</span>
          <check @changCheck="changCheck"></check>
        </div>
      </div>
      <div class="upload-wrapper">
        <div class="upload-btn" @click="chooseFile">{{ $t('i18n.CHOOSE_FILE') }}</div>
        <input type="file" name="image" hidden ref="inputFile" @change="showFileName($event)">
        <span class="dis" :title="fileName">{{ fileName }}</span>
      </div>
      <primary-button
      :disabled="uploadingFile || updateing || fileName === $t('i18n.NO_FILES_ARE_SELECTED')"
      :loading="uploadingFile || updateing"
      :text="btnText"
      @btnClicked="update()">
      </primary-button>
      <fade-tips :msg="tips.msg" :show="tips.show" :type="tips.type" @hide="tips.show = false"></fade-tips>
    </div>
  </div>
</template>

<script>
import Check from '@/common/components/check/check'
import { PrimaryButton } from '../../../../common/components/buttons/index'
import FadeTips from '@/common/components/fade-tips/FadeTips'
import {
  uploadFirmwareApi,
  updateFirmwareApi,
  sysFirmwareInfo
} from '../../../../api/system-manage-api'
import { getInitStatusApi } from '../../../../api/login-api'
import jsonp from '../../../../plugin/jsonp'
import getNetTypeAndWifiSsidService from '../../../../common/service/getNetTypeAndWifiSsid'

export default {
  name: 'firmwareUpdate',
  data() {
    return {
      version: '1.3.1',
      fileName: this.$t('i18n.NO_FILES_ARE_SELECTED'),
      checked: true,
      file: '',
      complete: '0',
      uploadingFile: false,
      uploadFileComplate: false,
      updateing: false,
      btnText: this.$t('i18n.MANUAL_UPDATE'),
      checkIntervalTime: '',
      tips: {
        msg: '',
        type: 'success',
        show: false
      },
      waiting: {
        msg: this.$t('i18n.FIRMWARE_UPDATE_TIPS'),
        show: true
      },
      ssid: null,
      defaultSsid: null,
      network: null,
      url: null
    }
  },
  mounted() {
    const randNum = Math.random() * 1000
    this.url = window.location.protocol + '//' + window.location.host + window.location.pathname + `?updateNum=${randNum}/`
    sysFirmwareInfo()
      .then(res => {
        this.version = res.version
      })
      .catch(e => {
        if (!e.msg) {
          e.msg = e.message
        }
      })
  },
  methods: {
    chooseFile() {
      this.$refs.inputFile.click()
      this.btnText = this.$t('i18n.MANUAL_UPDATE')
      this.uploadFileComplate = false
    },
    showFileName(e) {
      let target
      if (e.srcElement) {
        target = e.srcElement.files
      }
      if (e.target) {
        target = e.target.files
      }
      if (target.length) {
        this.fileName = target[0].name
      } else {
        this.fileName = this.$t('i18n.NO_FILES_ARE_SELECTED')
      }
      this.file = target[0]
    },
    changCheck(checked) {
      this.checked = checked
    },
    update() {
      if (this.uploadFileComplate) {
        this.updateFirmware()
      } else {
        this.uploadFile()
      }
    },
    uploadFile() {
      // 上传文件
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: progressEvent => {
          let complete =
            ((progressEvent.loaded / progressEvent.total * 100) | 0) + '%'
          this.complete = complete
        }
      }
      this.$emit('disableClick', true) // 禁止点击切换升级类型
      this.$root.Bus.$emit('maskClick', false)
      const param = new FormData()
      param.append('image', this.file)
      if (this.file.size > 0) {
        this.uploadingFile = true
        this.btnText = this.$t('i18n.UPLOADING_FIRMWARE')
        uploadFirmwareApi(param, config)
          .then(res => {
            if (res) {
              this.tips.msg = this.$t('i18n.FILE_UPLOAD_SUCCESS')
              this.tips.type = 'success'
              this.tips.show = true
              this.uploadingFile = false
              this.btnText = this.$t('i18n.UPDATE_NOW')
              this.uploadFileComplate = true
              this.$root.Bus.$emit('maskClick', true)
              this.$emit('disableClick', false) // 解除禁止点击切换升级类型
            }
          })
          .catch(e => {
            this.tips.msg = e
            this.tips.type = 'error'
            this.tips.show = true
            this.uploadingFile = false
            this.uploadFileComplate = false
            this.btnText = this.$t('i18n.MANUAL_UPDATE')
            this.$root.Bus.$emit('maskClick', true)
            this.$emit('disableClick', false)
          })
      }
    },
    updateFirmware() {
      // 固件升级
      let saveConfig = 0
      if (this.checked) {
        saveConfig = 1
      } else {
        saveConfig = 0
      }
      this.updateing = true
      this.btnText = this.$t('i18n.UPDATEING_FIRMWARE')
      this.$emit('disableClick', true) // 禁止点击切换升级类型
      getNetTypeAndWifiSsidService().then(res => {
        this.ssid = res.wifiSsid
        this.defaultSsid = res.defaultWifiSsid
        this.network = res.network
        if (this.network === 2) {
          // 联网方式为WiFi
          this.waiting.msg =
            this.$t('i18n.USE_WIFI_SERVER_UPDATE') +
            (saveConfig === 1 ? this.ssid : this.defaultSsid)
        }
        this.$root.Bus.$emit('waitingMaskShow', this.waiting)
        updateFirmwareApi({ // 升级固件
          save_config: saveConfig
        })
          .then(res => {
            if (res) {
              this.$root.Bus.$emit('busStopLoopAccStateGet') // 禁止获取加速状态的轮询
              this.$root.Bus.$emit('clearDevListAutoRefresh') // 禁止获取加速设备的轮询
              this.checkInitStatus()
            }
          })
          .catch(e => {
            this.tips.msg = e
            this.tips.type = 'error'
            this.tips.show = true
            this.updateing = false
            this.btnText = this.$t('i18n.UPDATE_NOW')
            this.$emit('disableClick', false) // 解除禁止点击切换升级类型
          })
      }).catch(e => {
        this.waiting.msg = this.$t('i18n.FIRMWARE_UPDATE_TIPS')
        this.waiting.show = false
        this.$root.Bus.$emit('waitingMaskShow', this.waiting)
        this.tips.msg = this.$t('i18n.FAILED_GET_NET')
        this.tips.type = 'error'
        this.tips.show = true
        this.updateing = false
        this.btnText = this.$t('i18n.UPDATE_NOW')
        this.$emit('disableClick', false) // 解除禁止点击切换升级类型
      })
    },
    checkInitStatus() {
      const host = window.location.host
      if (
        (!this.checked && host !== '192.168.8.1') ||
        (host !== 't.qeeyou.cn' && !this.checked)
      ) {
        // 判断是否使用jsonp来跨域请求接口（如果用户修改过IP地址的话）
        // 如果域名改变
        this.checkIntervalTime = setInterval(() => {
          this.checkServers()
        }, 3000)
      } else {
        this.checkIntervalTime = setInterval(() => {
          getInitStatusApi().then(res => {
            if ('' + res.ret) {
              clearInterval(this.checkIntervalTime)
              this.waiting.show = false
              window.sessionStorage.removeItem('token')
              this.$emit('disableClick', false) // 解除禁止点击切换升级类型
              this.$root.Bus.$emit('waitingMaskShow', this.waiting)
              window.location.href = this.url
            }
          })
        }, 3000)
      }
    },
    checkServers() {
      // jsonp
      const url = `${this.url}/cgi-bin/luci/sys_init_get`
      jsonp(
        url,
        {},
        {
          format: 'jsonp'
        }
      )
        .then(res => {
          window.clearInterval(this.checkIntervalTime)
          window.location.href = this.url
        })
        .catch(e => {
          window.clearInterval(this.checkIntervalTime)
          window.location.href = this.url
        })
    }
  },
  components: {
    Check,
    PrimaryButton,
    FadeTips
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../common/sass/_constant';
@import '../../../../common/sass/_mixin';

.firmware-update {
  width: 100%;
  border-radius: $startContentRaduis;
  background: linear-gradient(
    180deg,
    rgba(240, 243, 247, 1),
    rgba(255, 255, 255, 1)
  );
  box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.15);
  .title {
    padding-left: 30px;
    height: 76px;
    color: rgba(58, 56, 72, 1);
    font-size: 20px;
    line-height: 76px;
    background: white;
    font-weight: bold;
    border-radius: $startContentRaduis $startContentRaduis 0 0;
  }
  .container {
    padding: 40px 60px 60px 60px;
    border-radius: $startContentRaduis;
    background: linear-gradient(
      180deg,
      rgba(240, 243, 247, 1),
      rgba(255, 255, 255, 1)
    );
    .version {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .version-right {
        display: flex;
        align-items: center;
        .dis {
          margin-right: 10px;
        }
      }
    }
    .upload-wrapper {
      display: flex;
      align-items: center;
      margin-top: 20px;
      .upload-btn {
        margin-right: 20px;
        width: 90px;
        height: 30px;
        border: 1px solid #d8d8d8;
        border-radius: 4px;
        background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 1),
          rgba(245, 245, 245, 1)
        );
        color: rgba(117, 115, 139, 1);
        text-align: center;
        font-size: 12px;
        line-height: 28px;
        cursor: pointer;
        &:hover {
          border: 1px solid #39c1ff;
          box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.5);
        }
      }
      .dis {
        overflow: hidden;
        max-width: 265px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
