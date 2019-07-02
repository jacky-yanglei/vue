<template>
  <div class="restart">
    <div class="container">
      <error-tips :msg="msg" :show="show" @hide="show=false"></error-tips>
      <h5 class="title">{{ $t('i18n.RESTART_LIANJIBAO') }}</h5>
      <p class="tip">{{ $t('i18n.LIANJIBAO_WILL_RESTART_IMMEDIATELY') }}</p>
      <loading class="restart-loading" :class="{'show': waiting}"></loading>
      <p class="waiting" :class="{'show': waiting}">{{ $t('i18n.WAITING') }}</p>
      <primary-button height=46 class="button" :text="text" @btnClicked="restart()" :disabled="waiting" :loading="waiting"></primary-button>
    </div>
  </div>
</template>

<script>
import { restartApi } from '../../../api/system-manage-api'
import { getInitStatusApi } from '../../../api//login-api'
import Loading from '../../../common/components/loading/loading'
import { PrimaryButton } from '../../../common/components/buttons/index'
import ErrorTips from '@/common/components/error-tips/error-tips'

import getNetTypeAndWifiSsidService from '../../../common/service/getNetTypeAndWifiSsid'

export default {
  name: 'Restart',
  data() {
    return {
      msg: '',
      show: false,
      waiting: false,
      restartIntervalTime: '',
      text: this.$t('i18n.RESTART'),
      resartWaiting: {
        msg: `${this.$t('i18n.RESTART_TIP')}`,
        show: true
      },
      restsrtOk: false
    }
  },
  methods: {
    restart() {
      this.text = this.$t('i18n.RESTARTING')
      this.waiting = true
      getNetTypeAndWifiSsidService()
        .then(res => {
          const ssid = res.wifiSsid
          const network = res.network
          if (network === 2) {
            // 如果是无线网
            this.resartWaiting.msg =
              this.$t('i18n.USE_WIFI_SERVER_RESTART') + ssid
          }
          restartApi()
            .then(res => {
              this.resartWaiting.show = true
              this.$root.Bus.$emit('waitingMaskShow', this.resartWaiting)
              this.$root.Bus.$emit('busStopLoopAccStateGet') // 取消轮询获取加速状态
              this.$root.Bus.$emit('clearDevListAutoRefresh') // 取消轮询获取设备列表
              this.restartIntervalTime = setInterval(() => {
                this.checkComplete()
              }, 3000)
            })
            .catch(err => {
              this.show = true
              this.msg = err
              this.text = this.$t('i18n.RESTART')
              this.waiting = false
              this.resartWaiting.show = false
              this.$root.Bus.$emit('waitingMaskShow', this.resartWaiting)
            })
        })
        .catch(e => {
          this.text = this.$t('i18n.RESTART')
          this.waiting = false
          this.show = true
          this.msg = this.$t('i18n.FAILED_GET_NET')
          this.resartWaiting.msg = this.$t('i18n.RESTART_TIP')
          this.resartWaiting.show = false
        })
    },
    checkComplete() {
      getInitStatusApi().then(res => {
        if ('' + res) {
          clearInterval(this.restartIntervalTime)
          this.resartWaiting.show = false
          window.history.pushState(null, null, window.location.pathname + '#/')
          window.location.reload()
        }
      })
    }
  },
  components: {
    Loading,
    ErrorTips,
    PrimaryButton
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_mixin';
@import '../../../common/sass/_constant';

.restart {
  width: 400px;
  margin: 0 auto;
  .container {
    width: 100%;
    padding: 40px 60px;
    background: white;
    border-radius: $startContentRaduis;
    text-align: center;
    position: relative;
    z-index: 9;
    box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.15);
    .title {
      font-size: 22px;
      color: rgba(58, 56, 72, 1);
      margin-bottom: 10px;
    }
    .tip {
      font-size: 14px;
      color: rgba(131, 137, 161, 1);
    }
    .restart-loading {
      margin: 0 auto;
      margin-top: 30px;
      margin-bottom: 20px;
      opacity: 0;
      &.show {
        opacity: 1;
      }
    }
    .waiting {
      text-align: center;
      margin-bottom: 40px;
      font-size: 12px;
      color: rgba(131, 137, 161, 1);
      opacity: 0;
      &.show {
        opacity: 1;
      }
    }
    .button {
      height: 46px !important;
    }
  }
}
</style>
