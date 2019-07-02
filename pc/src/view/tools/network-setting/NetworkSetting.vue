<template>
  <div class="network-setting">
    <div class="network-setting-title">
      {{ $t('i18n.NETWORK_SETTING') }}
    </div>
    <div class="network-component-wrapper">
      <div class="network-loading-wrapper" v-show="!isReady">
        <loading class="index-loading"></loading>
        <p>{{ txtLoadingTip }}...</p>
      </div>
      <component :is="currentComponent" v-show="isReady"></component>
    </div>
    <fade-tips
      :msg="tips.msg"
      :show="tips.show"
      :type="tips.type"
      @hide="tips.show = false"></fade-tips>
  </div>
</template>

<script>
import WiredNetwork from './wired-network/WiredNetwork'
import WifiNetwork from './wifi-network/WifiNetwork'
import { netTypeGetApi, checkNetTypeApi } from '@/api/network-check-api'
import Loading from '@/common/components/loading/loading'
import FadeTips from '@/common/components/fade-tips/FadeTips'
export default {
  name: 'NetworkSetting',
  data: function() {
    return {
      isShow: 'wifi',
      isReady: false,
      currentComponent: '',
      arrComponent: ['WiredNetwork', 'WifiNetwork'],
      errNum: 1,
      tips: {
        msg: '',
        type: 'success',
        show: false
      },
      txtLoadingTip: this.$t('i18n.GETTING_USER_CONFIGURATION')
    }
  },
  components: {
    WiredNetwork,
    WifiNetwork,
    Loading,
    FadeTips
  },
  methods: {
    apiNetTypeGetFn: function() {
      netTypeGetApi()
        .then((data) => {
          if (data === 'nil') {
            // 未初始化，调用初始化接口
            this.apiCheckNetTypeApiFn()
          }
          if (data === 'ethernet') {
            this.currentComponent = this.arrComponent[0]
            setTimeout(() => {
              this.isReady = true
            }, 0)
          }
          if (data === 'wifi') {
            this.currentComponent = this.arrComponent[1]
            setTimeout(() => {
              this.isReady = true
            }, 0)
          }
        })
        .catch(e => {
          this.isReady = false
          this.errNum++
          if (this.errNum <= 2) {
            this.apiNetTypeGetFn()
          } else {
            this.errNum = 1
            this.tips.msg = this.$t('i18n.GET_INFI_FAILED')
            this.tips.type = 'error'
            this.tips.show = true
            this.txtLoadingTip = this.$t('i18n.GET_INFI_FAILED')
          }
        })
    },
    apiCheckNetTypeApiFn: function() {
      checkNetTypeApi()
        .then(data => {
          if (data === 'wifi') {
            this.currentComponent = this.arrComponent[1]
          } else if (data === 'ethernet') {
            this.currentComponent = this.arrComponent[0]
          }
          setTimeout(() => {
            this.isReady = true
          }, 0)
        })
        .catch(e => {
          this.isReady = false
          this.tips.msg = this.$t('i18n.GET_INFI_FAILED')
          this.tips.type = 'error'
          this.tips.show = true
          this.txtLoadingTip = this.$t('i18n.GET_INFI_FAILED')
        })
    },
    toggleNetTypeFn: function(data) {
      if (data === 'wifi') {
        this.currentComponent = this.arrComponent[1]
      } else if (data === 'ethernet') {
        this.currentComponent = this.arrComponent[0]
      }
    }
  },
  created() {
    this.apiNetTypeGetFn()
    this.$root.Bus.$on('busToggleNetType', data => {
      this.toggleNetTypeFn(data)
    })
  },
  beforeDestroy() {
    this.$root.Bus.$off('busToggleNetType')
  }
}
</script>

<style lang="scss" scoped>
.network-setting {
  position: relative;
  width:600px;
  background:linear-gradient(180deg,rgba(240,243,247,1),rgba(255,255,255,1));
  box-shadow: 0px 20px 60px 0px rgba(0,0,0,0.15);
  border-radius: 6px;
  margin: 0 auto;
  margin-bottom: 100px;
  & > .network-setting-title {
    width: 100%;
    height: 76px;
    font-size: 20px;
    font-weight: bold;
    line-height: 76px;
    text-align: center;
    background-color: #fff;
    border-radius: 6px 6px 0 0;
  }
  .network-loading-wrapper {
    padding: 200px 0;
    text-align: center;
    & > .index-loading {
      margin: 0 auto 20px;
    }
  }
}
</style>
