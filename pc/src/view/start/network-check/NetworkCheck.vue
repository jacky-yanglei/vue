<template>
  <div class="start-pd">
    <div class="network-check-view">
      <error-tips :msg="msg" :show="show"></error-tips>
      <p class="title" v-if="status===0">{{ $t('i18n.CHECKING_THE_NETWORKING_MODE') }}...</p>
      <p class="title" v-if="status===1">{{ $t('i18n.CHECKING_DHCP') }}...</p>
      <p class="title" v-if="status===2">{{ $t('i18n.DHCP_INITIALIZATION_START') }}...</p>
      <diffusion-circle></diffusion-circle>
    </div>
  </div>
</template>

<script>
import DiffusionCircle from '@/common/components/diffusion-circle/diffusion-circle'
import ErrorTips from '@/common/components/error-tips/error-tips'
import { checkNetTypeApi, checkBootprotoNetApi } from '@/api/network-check-api'

export default {
  name: 'NetworkCheck',
  data() {
    return {
      status: 0, // 状态 0表示检测中， 1检测DHCP中， 2表示未找到DHCP
      show: false,
      msg: ''
    }
  },
  mounted() {
    this.getNetType()
    this.$root.Bus.$emit('HiddenAppLoading')
  },
  methods: {
    getNetType() {
      this.msg = ''
      this.show = false
      checkNetTypeApi() // 检测联网方式
        .then(res => {
          if (res === 'ethernet') {
            this.status = 1
            this.checkBootprotoNet()
          } else {
            this.$router.push('/wifi')
          }
        })
        .catch(e => {
          this.msg = e
          this.show = true
        })
    },
    checkBootprotoNet() { // 检测DHCP
      this.msg = ''
      this.show = false
      checkBootprotoNetApi()
        .then(res => {
          if (res === 'dhcp') {
            this.status = 2
            this.setNetWan()
          }
          if (res === 'static') {
            this.$router.push('/dhcp-not-found')
          }
        })
        .catch(e => {
          this.msg = e
          this.show = true
        })
    },
    setNetWan() {
      window.setTimeout(() => {
        this.$router.push('/complate')
      }, 3000)
    }
  },
  components: {
    DiffusionCircle,
    ErrorTips
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_constant.scss';
@import '../../../common/sass/_mixin.scss';

.network-check-view {
  position: relative;
  width: $startContentWidth;
  margin: 0 auto;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 60px;
  border-radius: $startContentRaduis;
  .title {
    font-size: 16px;
    color: rgba(58, 56, 72, 1);
    line-height: 22px;
    text-align: center;
    margin-top: 40px;
    margin-bottom: 62px;
  }
}
</style>
