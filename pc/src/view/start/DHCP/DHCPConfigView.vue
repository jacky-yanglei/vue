<template>
  <div class="dhcp-config-view start-pd">
    <div class="dhcp-config-content">
      <p class="title">{{ $t('i18n.SETUP_COMPLETE') }}</p>
      <div class="config-item">
        <span>{{ $t('i18n.IP_ADDRESS') }}：</span>
        <span>{{ ip }}</span>
      </div>
      <div class="config-item">
        <span>{{ $t('i18n.DEFAULT_WIFI_NAME') }}：</span>
        <span>{{ ssid }}</span>
      </div>
      <div class="config-item">
        <span>{{ $t('i18n.DEFAULT_PASSWORD') }}：</span>
        <span>{{ pass }}</span>
      </div>
      <p class="tip">{{ $t('i18n.ADMIN_PASSWORD_AND_WIFI_PASSWORD_TIP') }}</p>
    </div>
    <button type="button" class="use-btn" @click="toIndex">
      {{ $t('i18n.NEXT_STEP') }}
      <span class="arrow"></span>
    </button>
    <oval></oval>
  </div>
</template>

<script>
import Oval from '@/common/components/oval/oval'

import { getInitNetInfoApi } from '../../../api/network-check-api'

export default {
  name: 'DHCPConfigView',
  data() {
    return {
      ssid: '',
      pass: '',
      ip: '',
      infoDone: false,
      errNum: 1
    }
  },
  components: {
    Oval
  },
  mounted() {
    this.getInitNetInfo()
    this.$root.Bus.$emit('HiddenAppLoading')
  },
  methods: {
    getInitNetInfo() {
      getInitNetInfoApi()
        .then(res => {
          this.ip = res.ip
          this.ssid = res.ssid
          this.pass = res.password
          this.infoDone = true
          this.errNum = 1
        })
        .catch(e => {
          this.errNum++
          if (this.errNum <= 2) {
            this.getInitNetInfo()
          }
        })
    },
    toIndex() {
      if (this.infoDone) {
        this.$router.push('/check-sys-firmware')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_constant.scss';
@import '../../../common/sass/_mixin.scss';

.dhcp-config-view {
  width: $startContentWidth;
  margin: 0 auto;
  .dhcp-config-content {
    position: relative;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-bottom: 20px;
    border-radius: $startContentRaduis;
    .title {
      font-size: 18px;
      color: rgba(58, 56, 72, 1);
      line-height: 25px;
      text-align: center;
      margin-top: 40px;
      margin-bottom: 16px;
    }
    .config-item {
      height: 46px;
      width: 312px;
      line-height: 46px;
      border-bottom: 1px solid #EEE;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: rgba(58, 56, 72, 1);
      margin: 0 auto;
      margin-bottom: 10px;
    }
    .tip {
      font-size: 14px;
      color: rgba(179, 179, 179, 1);
      text-align: center;
      margin-top: 30px;
    }
  }
}
.use-btn {
  position: relative;
  @include startBtn-primary();
  width: 100%;
  height: 56px;
  line-height: 56px;
  margin-top: 30px;
  &:hover {
    box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.5);
    &::after {
      position: absolute;
      top: -3px;
      left: -3px;
      content: '';
      display: block;
      width: 432px;
      height: 56px;
      border: 3px solid white;
      border-radius: $startContentRaduis;
    }
  }
}
</style>
