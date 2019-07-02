<template>
  <div class="ljb-start-network-error start-pd">
    <div class="network-error-tip">
      <h3><i></i>{{ $t('i18n.LJB_NETWORK_CHECK_ERROR') }}</h3>
      <div class="error-tip">
        {{ $t('i18n.PROBABLE_REASON') }}：
        <ol>
          <li>{{ $t('i18n.WIFI_PASSWORD_FIELD') }}</li>
          <li>{{ $t('i18n.WIFI_SIGNAL_WEAK') }}</li>
        </ol>
      </div>
    </div>
    <div class="buttons">
      <a href="javascript:;" class="button" @click="scanWifi()">{{ $t('i18n.RETESTING') }}</a>
      <a href="javascript:;" class="button" @click="setStatic()">{{ $t('i18n.SET_STATIC_IP_ADDRESS') }}</a>
    </div>
    <oval></oval>
  </div>
</template>

<script>
import Oval from '@/common/components/oval/oval'
export default {
  name: 'LjbStartNetworkError',
  data: function() {
    return {}
  },
  components: {
    Oval
  },
  methods: {
    scanWifi() {
      this.$router.push('/wifi')
    },
    setStatic() {
      this.$router.push('static-ip')
    }
  },
  mounted() {
    this.$root.Bus.$emit('HiddenAppLoading')
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_constant.scss';
@import '../../../common/sass/_mixin.scss';

.ljb-start-network-error {
  width: 432px;
  height: 508px;
  margin: 0 auto;
  font-family: '微软雅黑';
  & > .network-error-tip {
    width: 432px;
    height: 311px;
    background: rgba(255, 255, 255, 1);
    border-radius: 6px;
    margin-bottom: 30px;
    & > h3 {
      font-size: 18px;
      color: rgba(58, 56, 72, 1);
      text-align: center;
      padding-top: 40px;
      margin-bottom: 30px;
    }
    i {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: url(../../../assets/images/icon/icon_alert.png) no-repeat;
      background-size: cover;
      position: relative;
      top: 4px;
      margin-right: 10px;
    }
  }
  .error-tip {
    width: 372px;
    height: 186px;
    background: rgba(241, 193, 68, 0.1);
    color: rgba(58, 56, 72, 1);
    border-radius: 6px;
    margin: 0 auto;
    padding: 30px;
    font-size: 16px;
    li {
      line-height: 26px;
    }
    ol {
      margin-top: 10px;
    }
  }
  .buttons {
    @include startButtons();
  }
}
</style>
