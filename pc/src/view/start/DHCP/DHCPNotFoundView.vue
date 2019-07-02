<template>
  <div class="dhcp-not-found-view start-pd">
    <div class="dhcp-not-found-content">
      <p class="title"><incon-alert class="alert"></incon-alert>{{ $t('i18n.DHCP_NOT_FOUND') }}</p>
      <div class="reason">
        {{$t('i18n.ROUTER_NO_OPEN_DHCP')}}<br> {{$t('i18n.CAN_RESTART_CHECK_OR_SET_IP')}}
      </div>
    </div>
    <div class="buttons">
      <span class="button" @click="resetCheck">{{ $t('i18n.RETESTING') }}</span>
      <span class="button" @click="toSetStaicIp">{{ $t('i18n.SET_STATIC_IP_ADDRESS') }}</span>
    </div>
    <oval></oval>
  </div>
</template>

<script>
import Oval from '@/common/components/oval/oval'
import { InconAlert } from '@/common/components/icons'

export default {
  name: 'notFoundDhcp',
  methods: {
    resetCheck() {
      this.$router.push('/network-check')
    },
    toSetStaicIp() {
      this.$router.push('/static-ip')
    }
  },
  components: {
    Oval,
    InconAlert
  },
  mounted() {
    this.$root.Bus.$emit('HiddenAppLoading')
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_constant.scss';
@import '../../../common/sass/_mixin.scss';

.dhcp-not-found-view {
  margin: 0 auto;
  width: $startContentWidth;
  .dhcp-not-found-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-bottom: 30px;
    border-radius: $startContentRaduis;
    background: white;
    .title {
      margin-top: 40px;
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
    .reason {
      box-sizing: border-box;
      margin: 0 auto;
      padding: 30px;
      width: 372px;
      height: 186px;
      border-radius: $startContentRaduis;
      background: rgba(241, 193, 68, 0.1);
      color: rgba(58, 56, 72, 1);
      font-size: 16px;
      line-height: 28px;
    }
  }
  .buttons {
    @include startButtons();
  }
}
</style>
