<template>
  <div class="upnp">
    <h5 class="title">{{ $t('i18n.UPNP') }}</h5>
    <div class="container" v-show="!isInitLoading">
      <div class="switch-row">
        <span class="switch-text">{{ $t('i18n.UPNP_SWITCH') }}：</span>
        <ljb-switch @changeChose="changeChose" :choose="choose"></ljb-switch>
      </div>
      <div class="table-head">
        <table>
          <thead>
            <tr>
              <th>{{ $t('i18n.APPLICATION_DESCRIPTION') }}</th>
              <th>{{ $t('i18n.EXTERNAL_PORT') }}</th>
              <th>{{ $t('i18n.PROTOCOL_TYPE') }}</th>
              <th>{{ $t('i18n.INTERNAL_PORT') }}</th>
              <th>{{ $t('i18n.IP_ADDRESS_UPPERCASE') }}</th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="table-body" id="table-body">
        <table>
          <tbody>
            <tr v-for="(item, index) in appLicationList" :key="index">
              <td>{{ item.descr }}</td>
              <td>{{ item.extport }}</td>
              <td>{{ item.proto }}</td>
              <td>{{ item.intport }}</td>
              <td>{{ item.intaddr }}</td>
            </tr>
          </tbody>
        </table>
        <div class="loading-wrapper" v-show="isLoading">
          <loading class="loading"></loading>
          <p>{{ $t('i18n.GETTING_UPNP_LIST') }}...</p>
        </div>
      </div>
    </div>
    <div class="container" v-show="isInitLoading">
      <div class="init-loading-wrapper">
        <loading class="init-loading"></loading>
        <p>{{ initTxtLoading }}...</p>
      </div>
    </div>
    <fade-tips
    :msg="tips.msg"
    :show="tips.show"
    :type="tips.type"
    @hide="tips.show = false"></fade-tips>
  </div>
</template>

<script>
import LjbSwitch from '@/common/components/switch/switch'
import FadeTips from '../../../common/components/fade-tips/FadeTips'
import { netUpnpGet, netUpnpSet } from '@/api/network-check-api'
import Loading from '@/common/components/loading/loading'
export default {
  name: 'UPnP',
  data() {
    return {
      appLicationList: [],
      choose: true,
      isLoading: false,
      isInitLoading: true,
      tips: {
        msg: '',
        type: 'success',
        show: false
      },
      initTxtLoading: this.$t('i18n.GETTING_UPNP_LIST')
    }
  },
  components: {
    LjbSwitch,
    Loading,
    FadeTips
  },
  methods: {
    changeChose(choose) {
      this.choose = !this.choose
      this.clickUpnpBtnFn(this.choose)
    },
    apiNetUpnpGetFn: function() {
      netUpnpGet()
        .then(data => {
          let o = typeof (data.list)
          this.isLoading = false
          if (data.ret === 0 && o === 'object') {
            this.dealNetUpnpGetFn(data.list)
          }
        })
        .catch(err => {
          this.isLoading = false
          this.tips.msg = err
          this.tips.show = true
          this.tips.type = 'error'
        })
    },
    apiNetUpnpSetFn: function(obj) {
      netUpnpSet(obj)
        .then(data => {
          if (data.ret === 0) {
            this.apiNetUpnpGetFn()
          }
        })
        .catch(e => {
          this.isLoading = false
          this.tips.show = true
          this.tips.msg = e
          this.tips.type = 'error'
        })
    },
    clickUpnpBtnFn: function(data) {
      if (data) {
        this.apiNetUpnpSetFn({ enable: '1' })
        this.isLoading = true
      } else {
        this.apiNetUpnpSetFn({ enable: '0' })
        this.isLoading = false
      }
    },
    dealNetUpnpGetFn: function(list) {
      this.appLicationList = list
      if (this.bar) {
        this.bar.update()
      } else {
        this.createBar()
      }
    },
    initLoadingFn: function() {
      this.apiInitNetUpnpGetFn()
      this.isLoading = true
    },
    apiInitNetUpnpGetFn: function() {
      netUpnpGet()
        .then(data => {
          this.isInitLoading = false
          if (data.ret === 0 && data.enable === 0) {
            this.choose = false
          } else if (data.ret === 0 && data.enable === 1) {
            this.choose = true
            let o = typeof (data.list)
            if (o === 'object') {
              this.dealNetUpnpGetFn(data.list)
            }
          }
          this.isLoading = false
        })
        .catch(e => {
          this.tips.show = true
          this.tips.msg = e
          this.tips.type = 'error'
          this.isInitLoading = true
          this.initTxtLoading = this.$t('i18n.GET_UPNP_LIST_FAILED')
        })
    },
    createBar() {
      this.$nextTick(() => {
        this.bar = new this.$geminiScrollbar({
          element: document.getElementById('table-body')
        }).create()
      })
    }
  },
  created() {
    this.initLoadingFn()
  }
}
</script>

<style lang="scss" scoped>
.upnp {
  margin: 0 auto;
  width: 890px;
  border-radius: 6px;
  background: linear-gradient(
    180deg,
    rgba(240, 243, 247, 1),
    rgba(255, 255, 255, 1)
  );
  box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.15);
  position: relative;
  .title {
    height: 76px;
    background: white;
    color: rgba(58, 56, 72, 1);
    text-align: center;
    font-size: 20px;
    line-height: 76px;
    font-weight: bold;
    border-radius: 6px 6px 0 0;
  }
  .container {
    padding: 40px 60px 60px 60px;
    .switch-row {
      padding: 0 20px;
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      .switch-text {
        margin-right: 30px;
      }
    }
    .table-head {
      width: 100%;
      height: 40px;
      border-radius: 4px;
      overflow: hidden;
      table {
        width: 100%;
        thead {
          background: rgba(240, 243, 247, 1);
          tr {
            height: 40px;
            border-radius: 4px;
            th {
              text-align: center;
              width: 116px;
              font-size: 14px;
              &:nth-child(5) {
                width: 161px;
                text-align: right;
                padding-right: 20px;
              }
              &:nth-child(1) {
                width: auto;
                text-align: left;
                padding-left: 20px;
              }
            }
          }
        }
      }
    }
    .table-body {
      height: 180px;
      table {
        width: 100%;
        tbody {
          background: transparent;
          tr {
            height: 56px;
            td {
              text-align: center;
              width: 116px;
              font-size: 14px;
              &:nth-child(5) {
                width: 161px;
                text-align: right;
                padding-right: 20px;
              }
              &:nth-child(1) {
                width: auto;
                text-align: left;
                padding-left: 20px;
              }
            }
          }
        }
      }
      .loading-wrapper {
        margin-top: 50px;
        text-align: center;
        & > p {
          margin-top: 20px;
        }
        & > .loading {
          margin: 0 auto;
        }
      }
    }
    .init-loading-wrapper {
      text-align: center;
      padding-top: 40px;
      padding-bottom: 40px;
      & > .init-loading {
        margin: 0 auto;
      }
      & > p {
        padding-top: 10px;
      }
    }
  }
}
</style>
