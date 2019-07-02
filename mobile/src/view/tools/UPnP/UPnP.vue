<template>
  <div>
    <div class="tools-wrapper-main upnp" :class="{'blur': isShowBlur}">
      <public-header :headerTxt="headerTxt"></public-header>
      <div class="mg-40 tools-wrapper-max">
        <div class="upnp-switch">
          <span class="switch-txt">{{$t('i18n.UPNP_SWITCH')}}：</span>
          <span class="switch-btn" :class="{'switch-open-btn': isOpenSwitch}" @click="toggleSwitchFn()">
            <i class="circle"></i>
          </span>
        </div>
        <div class="upnp-wrapper" ref="wrapper">
          <div>
            <div class="upnp-list" v-for="(item, key) in upnpList" :key="key" v-show="isOpenSwitch">
              <p>{{$t('i18n.IP_ADDRESS')}}：<span>{{ item.intaddr }}</span></p>
              <p>{{$t('i18n.EXTERNAL_PORT')}}：<span>{{ item.extport }}</span></p>
              <p>{{$t('i18n.PROTOCOL_TYPE')}}：<span>{{ item.proto }}</span></p>
              <p>{{$t('i18n.INTERNAL_PORT')}}：<span>{{ item.intport }}</span></p>
              <p>{{$t('i18n.PROTOCOL_TYPE')}}：<span>{{ item.descr }}</span></p>
            </div>
          </div>
          <loading-wait :msg="wait.msg" :show="wait.show" class="loading-waiting"></loading-wait>
        </div>
      </div>
    </div>
    <fade-tips :msg="tip.msg" :show="tip.show" :type="tip.type" @hide="hideFadeTipsFn"></fade-tips>
  </div>
</template>

<script>
import PublicHeader from '@/common/components/public-header/public-header'
import PrimartButton from '@/common/components/buttons/primary-button'
import SwitchUpnp from '@/common/components/switch/switch'
import { netUpnpGet, netUpnpSet } from '@/api/network-check-api'
import Bscroll from 'better-scroll'
import FadeTips from '@/common/components/fade-tips/fade-tips'
import LoadingWait from '@/common/components/loadings/loading-wait'
export default {
  name: 'UPnP',
  data: function () {
    return {
      headerTxt: 'UPNP',
      disabled: false,
      loading: false,
      isOpenSwitch: false, // 是否打开开关
      enable: null,
      isShowBlur: false,
      isCanClick: true,
      wait: {
        msg: '',
        show: false
      },
      upnpList: [
        {
          intaddr: '1234',
          extport: '1234',
          proto: 'asdfa',
          intport: 'asdfa',
          descr: 'asdfa'
        },
        {
          intaddr: '1234',
          extport: '1234',
          proto: 'asdfa',
          intport: 'asdfa',
          descr: 'asdfa'
        },
        {
          intaddr: '1234',
          extport: '1234',
          proto: 'asdfa',
          intport: 'asdfa',
          descr: 'asdfa'
        },
        {
          intaddr: '1234',
          extport: '1234',
          proto: 'asdfa',
          intport: 'asdfa',
          descr: 'asdfa'
        },
        {
          intaddr: '1234',
          extport: '1234',
          proto: 'asdfa',
          intport: 'asdfa',
          descr: 'asdfa'
        }
      ],
      tip: {
        msg: '',
        show: false,
        type: 'success'
      }
    }
  },
  components: {
    PublicHeader,
    PrimartButton,
    SwitchUpnp,
    FadeTips,
    LoadingWait
  },
  methods: {
    toggleSwitchFn: function () {
      if (this.isCanClick) {
        this.isOpenSwitch = !this.isOpenSwitch
        this.wait.show = true
        if (this.isOpenSwitch) {
          this.enable = 1
          this.wait.msg = this.$t('i18n.OPENING_UP')
        } else {
          this.enable = 0
          this.wait.msg = this.$t('i18n.CLOSING_DOWN')
        }
        this.isCanClick = false
        this.apiNetUpnpSetFn()
      }
    },
    apiNetUpnpGetFn: function () {
      netUpnpGet()
        .then(res => {
          let o = typeof (res.list)
          if (res.enable === '') {
            res.enable = 0
          }
          this.enable = parseInt(res.enable)
          if (o === 'object') {
            this.upnpList = res.list
          } else {
            this.upnpList = null
          }
          this.controlViewFn()
          this.isCanClick = true
          this.wait.show = false
          this.wait.msg = ''
        })
        .catch(e => {
          let msg = this.apiErrorDealFn(e)
          this.tip.msg = msg
          this.tip.show = true
          this.tip.type = 'error'
          this.isShowBlur = true
          this.isCanClick = true
          this.wait.show = false
          this.wait.msg = ''
        })
    },
    controlViewFn: function () {
      // 控制视图
      if (this.enable === 1) {
        this.isOpenSwitch = true
      } else {
        this.isOpenSwitch = false
      }
    },
    apiNetUpnpSetFn: function () {
      let apiData = {
        enable: this.enable
      }
      netUpnpSet(apiData)
        .then(res => {
          this.apiNetUpnpGetFn()
        })
        .catch(e => {
          let msg = this.apiErrorDealFn(e)
          this.tip.msg = msg
          this.tip.show = true
          this.tip.type = 'error'
          this.isShowBlur = true
          this.isCanClick = true
          this.wait.show = false
          this.wait.msg = ''
        })
    },
    hideFadeTipsFn: function (data) {
      this.tip.show = data
      this.isShowBlur = data
    }
  },
  created () {
    this.apiNetUpnpGetFn()
  },
  mounted () {
    this.$nextTick(() => {
      this.scroll = new Bscroll(this.$refs.wrapper, {})
    })
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../common/scss/_mixin';
  @import '../../../common/scss/_utils';
  @import '../../../common/scss/tools';
  .upnp {
    .loading-waiting {
      margin-top: rem(200px);
    }
    .upnp-switch {
      overflow: hidden;
    }
    .upnp-wrapper {
      overflow: hidden;
      position: fixed;
      margin-top: rem(250px);
      left: 0;
      top: 0;
      right: 0;
      bottom: rem(0px);
      padding-left: rem(40px);
      padding-right: rem(40px);
      padding-bottom: rem(40px);
      .upnp-list {
        &:nth-of-type(1) {
          margin-top: 0;
        };
        margin-top: rem(40px);
        margin-bottom: rem(40px);
        width: 100%;
        height: rem(380px);
        background: rgba(255,255,255,1);
        border-radius: rem(8px);
        border: 1px solid rgba(230,230,231,1);
        padding: rem(30px);
        & > p {
          height: rem(70px);
          color: rgba(111, 117, 146, 1);
          font-size: rem(28px);
          line-height: rem(40px);
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        span {
          color: rgba(44, 41, 57, 1);
        }
      }
    }
  }
</style>
