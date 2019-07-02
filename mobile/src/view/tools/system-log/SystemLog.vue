<template>
  <div class="wrapper" ref="w">
    <div class="tools-wrapper-main system-log" :class="{'blur': isShowBlur}">
      <public-header :headerTxt="headerTxt"></public-header>
      <div class="system-log-shade">
        <div class="mg-40 tools-wrapper-max sys-log-wrapper">
          <div class="log-wrapper" ref="wrapper">
            <button class="txt-sys-log" v-html="log"></button>
          </div>
          <div class="tools-bottom-wrapper">
            <div class="tools-bottom">
              <primart-button :disabled="disabled"
                :loading="loading"
                class="copy-log"
                @buttonClicked="copyLogFn()">
                {{$t('i18n.COPY_THE_LOG')}}</primart-button>
              <button class="tag-read" hidden
                @click="copy()"
                ref="copyButton"
                :data-clipboard-text="this.log"></button>
              <primart-button :disabled="disabled"
                :loading="loading"
                class="clear-log"
                @buttonClicked="clearLogFn()">
                {{$t('i18n.CLEAR_THE_LOG')}}</primart-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <fade-tips :msg="tip.msg" :show="tip.show" :type="tip.type" @hide="hideFadeTipsFn"></fade-tips>
  </div>
</template>

<script>
import PublicHeader from '@/common/components/public-header/public-header'
import PrimartButton from '@/common/components/buttons/primary-button'
import FadeTips from '@/common/components/fade-tips/fade-tips'
import { getSystemLogApi, cleanSystemLogApi } from '@/api/system-manage-api'
import Bscroll from 'better-scroll'
import Clipboard from 'clipboard'
export default {
  name: 'SystemLog',
  data: function () {
    return {
      headerTxt: this.$t('i18n.SYSTEM_LOG'),
      disabled: false,
      loading: false,
      tip: {
        msg: this.$t('i18n.COPY_LOG_SUCCESS'),
        show: false,
        type: 'success'
      },
      isShowBlur: false,
      log: null
    }
  },
  components: {
    PublicHeader,
    PrimartButton,
    FadeTips
  },
  methods: {
    copyLogFn: function () {
      this.$refs.copyButton.click()
    },
    copy: function () {
      let clipboard = new Clipboard('.tag-read')
      clipboard.on('success', e => {
        this.tip.msg = this.$t('i18n.COPY_LOG_SUCCESS')
        this.tip.show = true
        this.tip.type = 'success'
        this.isShowBlur = true
        // 释放内存
        clipboard.destroy()
      })
      clipboard.on('error', e => {
        // 不支持复制
        this.tip.show = true
        this.tip.msg = this.$t('i18n.BROWSER_NOT_SUPPORT_AUTO_COPY')
        this.isShowBlur = true
        this.tip.type = 'tip'
        // 释放内存
        clipboard.destroy()
      })
    },
    clearLogFn: function () {
      cleanSystemLogApi()
        .then(res => {
          this.tip.show = true
          this.tip.msg = this.$t('i18n.CLEAR_LOG_SUCCESS')
          this.isShowBlur = true
          this.tip.type = 'success'
          this.log = ''
        })
        .catch(e => {
          this.tip.show = true
          this.tip.msg = this.$t('i18n.CLEAR_LOG_FAILED')
          this.isShowBlur = true
          this.tip.type = 'error'
        })
    },
    hideFadeTipsFn: function (data) {
      this.tip.show = data
      this.isShowBlur = data
    },
    apiGetSystemLogFn: function () {
      // 获取系统日志
      getSystemLogApi()
        .then((res) => {
          let log = res.log.replace(/\r\n/g, '<br>')
          log = res.log.replace(/\n/g, '<br>')
          this.log = log
        })
    }
  },
  created () {
    this.apiGetSystemLogFn()
  },
  mounted () {
    this.$nextTick(() => {
      if (!this.scroll) {
        this.scroll = new Bscroll(this.$refs.wrapper, {preventDefault: false})
      } else {
        this.scroll.refresh()
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../common/scss/_mixin';
  @import '../../../common/scss/_utils';
  @import '../../../common/scss/tools';
  .system-log {
    .sys-log-wrapper {
      overflow: hidden;
      position: fixed;
      bottom: rem(260px);
      top: rem(112px);
    }
    .log-wrapper {
      position: relative;
      height: rem(1081px - 440px);
    }
    .txt-sys-log {
      color: rgba(58, 56, 72, 1);
      font-size: rem(28px);
      line-height: rem(40px);
    }
    .tools-bottom-wrapper {
      position: fixed;
      left: rem(0px);
      right: rem(0px);
      bottom: rem(0px);
      padding-left: rem(40px);
      padding-right: rem(40px);
      padding-bottom: rem(40px);
      background: linear-gradient(0deg, rgba(238,239,242,1), rgba(245,245,248,1));
      padding-top: rem(20px);
      height: rem(260px);
    }
    .copy-log {
      font-size: rem(32px);
      color: rgba(255,255,255,1);
    }
    .clear-log {
      font-size: rem(32px);
      color: rgba(117,115,139,1);
      margin-top: rem(20px);
      background: linear-gradient(180deg,rgba(255,255,255,1),rgba(245,245,245,1));
      box-shadow: 0px rem(2px) 0px 0px rgba(255,255,255,1);
      border: 1px solid rgba(216,216,216,1);
    }
    .system-log-shade {
      overflow: hidden;
    }
  }
</style>
