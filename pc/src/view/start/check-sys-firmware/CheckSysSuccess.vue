<template>
  <transition enter-active-class="animated bounceInDown">
    <div class="welcome-view start-pd">
      <div class="welcome-container">
        <div class="logo"></div>
        <p class="dis">{{ $t('i18n.IS_NEW_SYS') }}</p>
      </div>
      <button type="button" class="begain-btn" @click="toIndexPage()">
        {{ $t('i18n.START_NOW') }}
        <span class="arrow"></span>
      </button>
      <oval></oval>
    </div>
  </transition>
</template>

<script>
import Oval from '@/common/components/oval/oval'
import { getInitStatusApi } from '../../../api/login-api'
export default {
  name: 'CheckSysSuccess',
  components: {
    Oval
  },
  data() {
    return {
      // isInit: false
    }
  },
  mounted() {
    getInitStatusApi()
      .then(res => {
        if (Number.parseInt(res)) {
          window.sessionStorage.setItem('init_status', 1)
          this.isInit = true
        } else {
          this.$router.push('/welcome')
        }
      })
  },
  methods: {
    toIndexPage: function() {
      if (this.isInit) {
        this.$router.push('/')
      }
    }
  },
  created() {
    this.$root.Bus.$emit('HiddenAppLoading')
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_constant.scss';
@import '../../../common/sass/_mixin.scss';

.welcome-view {
  width: $startContentWidth;
  margin: 0 auto;
  .welcome-container {
    width: 100%;
    height: 238px;
    padding-top: 60px;
    background: rgba(255, 255, 255, 1);
    border-radius: $startContentRaduis;
    text-align: center;
    .logo {
      width: 46px;
      height: 46px;
      background-image: url('../../../assets/images/icon/icon_prompt1.png');
      background-size: 100%;
      margin: 0 auto;
    }
    .welcome-use {
      font-size: 28px;
      color: rgba(58, 56, 72, 1);
      line-height: 40px;
      text-align: center;
      margin: 0;
      margin-top: 20px;
    }
    .dis {
      font-size: 16px;
      color: rgba(58, 56, 72, 1);
      line-height: 20px;
      margin-top: 30px;
    }
  }
  .begain-btn {
    position: relative;
    @include startBtn-primary;
    width: 100%;
    height: 56px;
    margin-top: 30px;
    &:hover {
      box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.5);
      &::before {
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
    .arrow {
      vertical-align: middle;
      display: inline-block;
      width: 9px;
      height: 15px;
      // background-image: url('../../../assets/images/icon/icon_button_arrow.png');
      background-size: 100;
      margin-left: 5px;
    }
  }
}
</style>
