/*
 * @Author: Zhengxinglun
 * @Date: 2018-05-16 16:52:20
 * @Last Modified by: Zhengxinglun
 * @Last Modified time: 2018-06-29 14:27:30
 */

<template>
  <div class="online-update">
    <h5 class="title">{{ $t('i18n.ONLINE_UPDATE') }}</h5>
    <div class="container">
      <div class="version">
        <span>{{ $t('i18n.CURRENT_VERSION') }}：{{ currentVersion }}</span>
        <span>{{ $t('i18n.LATEST_VERSION') }}：{{ latestVersion }}</span>
      </div>
      <div class="update-log-wrapper" id="update-log-wrapper" v-if="updateLog">
        <div v-html="updateLog" class="update-log"></div>
      </div>
      <primary-button @btnClicked="onlineUpdate()" :disabled="updateing" :loading="updateing" :text="text"></primary-button>
      <fade-tips :msg="tips.msg" :show="tips.show" :type="tips.type" @hide="tips.show = false">
      </fade-tips>
    </div>
  </div>
</template>

<script>
import { PrimaryButton } from '../../../../common/components/buttons/index'
import FadeTips from '@/common/components/fade-tips/FadeTips'
import jsonp from '../../../../plugin/jsonp'
import getNetTypeAndWifiSsidService from '../../../../common/service/getNetTypeAndWifiSsid'
import { compareVersion } from '../../../../common/service/utils'

import {
  sysFirmwareInfo,
  sysFirmwareCheck,
  sysOnlineUpgradeFirmware
} from '../../../../api/system-manage-api'
import { getInitStatusApi } from '../../../../api/login-api'
export default {
  name: 'onlineUpdate',
  data() {
    return {
      currentVersion: '',
      latestVersion: '',
      text: this.$t('i18n.VERSION_CHECK'),
      hasNewVersion: false,
      updateIntervalTime: '',
      tips: {
        msg: '',
        type: 'success',
        show: false
      },
      updateing: false,
      waiting: {
        msg: this.$t('i18n.FIRMWARE_UPDATE_TIPS'),
        show: true
      },
      saveConfig: 0,
      ssid: null,
      defaultSsid: null,
      network: null,
      firstCheckVersion: true,
      updateLog: '',
      versionType: null,
      urlT: null
    }
  },
  mounted() {
    this.getCurrentVersion()
    const randNum = Math.random() * 1000
    this.urlT = window.location.protocol + '//' + window.location.host + window.location.pathname + `?updateNum=${randNum}/`
  },
  methods: {
    /**
     * 获取当前固件版本
     */
    getCurrentVersion() {
      sysFirmwareInfo().then(res => {
        if (Number.parseInt(res.ret) === 0) {
          this.currentVersion = res.version
          this.getLatestVersion()
        } else {
          return Promise.reject(res.msg)
        }
      })
    },
    /**
     * 创建自定义滚动条
     */
    createBar() {
      this.$nextTick(() => {
        this.bar = new this.$geminiScrollbar({
          element: document.getElementById('update-log-wrapper')
        }).create()
      })
    },
    /**
     * 显示升级日志
     */
    showUpdateLog(releaseNote) {
      this.updateLog = releaseNote
      this.updateLog = this.updateLog.replace(/\r\n/g, '<br>')
      this.updateLog = this.updateLog.replace(/\n/g, '<br>')
      if (this.bar) {
        this.$nextTick(() => {
          this.bar.update()
        })
      } else {
        this.createBar()
      }
    },
    /**
     * 获取版本信息
     */
    getLatestVersion() {
      return sysFirmwareCheck()
        .then(res => {
          if (Number.parseInt(res.ret) === 0) {
            this.latestVersion = res.version
            this.versionType = res.version_type
            const dealRes = compareVersion(
              this.currentVersion,
              this.latestVersion
            )
            if (dealRes) {
              // 新版本大于当前版本
              this.hasNewVersion = true
              this.showUpdateLog(res.changlog)
              this.text = this.$t('i18n.ONLINE_UPDATE')
              this.saveConfig = Number.parseInt(res.save_config) // 是否保存配置
              return Promise.resolve(true)
            } else {
              this.hasNewVersion = false
            }
            if (!this.firstCheckVersion) {
              // 不是自动检测 提示检测成功
              this.tips.msg = this.$t('i18n.CHECK_SYS_SUCCESS')
              this.tips.show = true
            }
            if (this.firstCheckVersion) {
              // 如果是第一次检测版本（进入组件会自动检测一次）
              this.firstCheckVersion = false
            }
          } else {
            return Promise.reject(res.msg)
          }
        })
        .catch(err => {
          if (!err) {
            err = err.message
          }
          this.tips.msg = err
          this.tips.show = true
          this.tips.type = 'error'
        })
    },
    /**
     * 在线升级
     */
    onlineUpdate() {
      if (this.hasNewVersion) {
        this.text = this.$t('i18n.UPDATEING_FIRMWARE')
        this.updateing = true
        this.getLatestVersion().then(res => {
          if (res) {
            this.$emit('disableClick', true) // 禁止点击切换升级类型
            getNetTypeAndWifiSsidService()
              .then(res => {
                this.ssid = res.wifiSsid
                this.defaultSsid = res.defaultWifiSsid
                this.network = res.network
                if (this.network === 2) { // 判断本机联网方式
                  this.waiting.msg =
                    this.$t('i18n.USE_WIFI_SERVER_UPDATE') +
                    (this.saveConfig === 1 ? this.ssid : this.defaultSsid)
                }
                this.$root.Bus.$emit('waitingMaskShow', this.waiting)
                sysOnlineUpgradeFirmware({
                  // 根据用户版本来升级测试版还是正式版
                  image_type: this.versionType
                })
                  .then(res => {
                    if (Number.parseInt(res.ret) === 0) {
                      this.checkCompleted()
                    } else {
                      return Promise.reject(res.msg)
                    }
                  })
                  .catch(e => {
                    this.text = this.$t('i18n.ONLINE_UPDATE')
                    this.updateing = false
                    this.tips.show = true
                    this.tips.type = 'error'
                    this.tips.msg = e
                    this.waiting.msg = this.$t('i18n.FIRMWARE_UPDATE_TIPS')
                    this.waiting.show = false
                    this.$root.Bus.$emit('waitingMaskShow', this.waiting)
                    this.$emit('disableClick', false) // 解除禁止点击切换升级类型
                  })
              })
              .catch(e => {
                // 获取升级前置网络信息失败
                this.text = this.$t('i18n.ONLINE_UPDATE')
                this.updateing = false
                this.tips.show = true
                this.tips.type = 'error'
                this.tips.msg = this.$t('i18n.FAILED_GET_NET')
                this.waiting.msg = this.$t('i18n.FIRMWARE_UPDATE_TIPS')
                this.waiting.show = false
                this.$root.Bus.$emit('waitingMaskShow', this.waiting)
                this.$emit('disableClick', false) // 解除禁止点击切换升级类型
              })
          }
        }).catch(e => {
          this.text = this.$t('i18n.ONLINE_UPDATE')
          this.updateing = false
        })
      } else {
        this.text = this.$t('i18n.CHECKING_LATEST_VERSION')
        this.updateing = true
        this.getLatestVersion()
          .then(res => {
            this.updateing = false
            this.text = this.$t('i18n.VERSION_CHECK')
          })
          .catch(e => {
            this.updateing = false
            this.text = this.$t('i18n.VERSION_CHECK')
          })
      }
    },
    /**
     * 检查是否完成升级(保存配置升级)
     */
    checkCompleted() {
      if (this.saveConfig === 1) {
        // 如果是保存配置在线升级
        this.updateIntervalTime = setInterval(() => {
          getInitStatusApi().then(res => {
            if ('' + res.ret) {
              this.waiting.show = false
              this.$emit('disableClick', false) // 解除禁止点击切换升级类型
              this.$root.Bus.$emit('waitingMaskShow', this.waiting)
              window.location.href = this.urlT
            }
          })
        }, 4000)
      } else {
        // 如果不是保存配置在线升级
        this.updateIntervalTime = setInterval(() => {
          this.checkServers()
        }, 4000)
      }
    },
    /**
     * 检测是否完成(不保存配置升级)
     */
    checkServers() {
      // jsonp
      const url = `${this.urlT}/cgi-bin/luci/sys_init_get`
      jsonp(
        url,
        {},
        {
          format: 'jsonp'
        }
      )
        .then(res => {
          window.clearInterval(this.updateIntervalTime)
          window.location.href = this.urlT
        })
        .catch(e => {
          window.clearInterval(this.updateIntervalTime)
          window.location.href = this.urlT
        })
    }
  },
  components: {
    PrimaryButton,
    FadeTips
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../common/sass/_constant';
@import '../../../../common/sass/_mixin';

.online-update {
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
    background: linear-gradient(
      180deg,
      rgba(240, 243, 247, 1),
      rgba(255, 255, 255, 1)
    );
    border-radius: $startContentRaduis;
    .version {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: rgba(58, 56, 72, 1);
    }
    .update-log-wrapper {
      width: 480px;
      height: 268px;
      background: rgba(255, 255, 255, 1);
      padding: 20px 0px 30px 30px;
      border-radius: 6px;
      margin-top: 20px;
      .update-log {
        width: 100%;
        font-size: 14px;
        color: rgba(58, 56, 72, 1);
        line-height: 20px;
        padding-right: 60px;
        padding-bottom: 30px;
      }
    }
    .check-btn {
      @include startBtn-primaryHover();

      margin-top: 40px;
      width: 100%;
      height: 56px;
    }
  }
}
</style>
