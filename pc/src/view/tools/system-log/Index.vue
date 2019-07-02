<template>
<div class="mgb">
  <div class="system-log">
    <div class="container">
      <h5 class="title">{{ $t('i18n.SYSTEM_LOG') }}</h5>
      <div class="log-wrapper" ref="logWrapper">
        <p class="log" v-html="logShow"></p>
        <textarea type="text" ref="log" class="hide-textarea" v-model="log"></textarea>
      </div>
    </div>
    <div class="buttons">
      <button type="button"
      class="copy"
      @click="copyLog">{{ $t('i18n.COPY_LOG') }}</button>
      <button type="button"
      class="clean"
      @click="cleanLog">{{ $t('i18n.CLEAR_LOG') }}</button>
    </div>
    <fade-tips :msg="tips.msg" :show="tips.show" :type="tips.type" @hide="tips.show = false"></fade-tips>
  </div>
</div>
</template>

<script>
import { getSystemLogApi, cleanSystemLogApi } from '../../../api/system-manage-api'
import FadeTips from '@/common/components/fade-tips/FadeTips'

export default {
  name: 'SystemLog',
  data() {
    return {
      log: '',
      logShow: '',
      tips: {
        msg: '',
        type: 'success',
        show: false
      }
    }
  },
  mounted() {
    getSystemLogApi()
      .then(res => {
        if (Number.parseInt(res.ret) === 0) {
          this.log = res.log
          this.logShow = res.log
          this.logShow = this.logShow.replace(/\r\n/g, '<br>')
          this.logShow = this.logShow.replace(/\n/g, '<br>')
          this.createBar()
        } else {
          this.tips.msg = res.msg
          this.tips.type = 'error'
          this.tips.show = true
        }
      })
  },
  methods: {
    cleanLog() {
      cleanSystemLogApi()
        .then(res => {
          if (Number.parseInt(res.ret) === 0) {
            this.log = ''
            this.logShow = ''
            this.tips.msg = this.$t('i18n.CLEAR_SUCCESS')
            this.tips.type = 'success'
            this.tips.show = true
          } else {
            this.tips.msg = res.msg
            this.tips.type = 'error'
            this.tips.show = true
          }
        })
    },
    createBar() {
      this.$nextTick(() => {
        this.bar = new this.$geminiScrollbar({
          element: this.$refs.logWrapper
        }).create()
      })
    },
    copyLog() {
      const target = this.$refs.log
      target.value = this.log
      target.select()
      document.execCommand('Copy')
      this.tips.msg = this.$t('i18n.COPY_SUCCESS')
      this.tips.type = 'success'
      this.tips.show = true
    }
  },
  components: {
    FadeTips
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_mixin';
@import '../../../common/sass/_constant';

.system-log {
  margin: 0 auto;
  width: 560px;
  .container {
    width: 100%;
    border-radius: $startContentRaduis;
    background:linear-gradient(180deg,rgba(240,243,247,1),rgba(255,255,255,1));
    box-shadow: 0px 20px 60px 0px rgba(0,0,0,0.15);
    position: relative;
    z-index: 9;
    .title {
      width: 100%;
      height: 76px;
      background: white;
      color:rgba(58,56,72,1);
      text-align: center;
      font-weight: bold;
      font-size:20px;
      line-height:76px;
      border-radius: 6px 6px 0 0;
    }
    .log-wrapper {
      height: 484px;
      padding-bottom: 40px;
      box-sizing: border-box;
      overflow-y: auto;
      .log {
        color:rgba(58,56,72,1);
        font-size:14px;
        line-height: 24px;
        padding: 10px 40px;
      }
    }
    .hide-textarea {
      height: 0px;
      width: 0px;
      opacity: 0;
    }
  }
  .buttons {
    position: relative;
    z-index: 9;
    width: 100%;
    height: 56px;
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    button {
      @include startBtn-primaryHover();
      width: 270px;
      height: 56px;
      &.clean {
        background: white;
        color:rgba(58,56,72,1);
        &:hover {
          &::after {
            border-color: #31BCFC;
          }
        }
        &:focus {
          &::after {
            border-color: #31BCFC;
          }
        }
      }
    }
  }
}
</style>
