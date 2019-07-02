<template>
  <div class="wifi-list-view start-pd">
    <div class="wifi-list-alert">
      <incon-alert class="alert"></incon-alert>
      {{ $t('i18n.CHOOSE_WIFI_TIP') }}
    </div>
    <div class="wifi-list-container">
      <p class="title">{{ $t('i18n.CHOOSE_WIFI_TEXT') }}</p>
      <div class="list-table">
        <div class="table-head">
          <table>
            <thead>
              <tr>
                <th>{{ $t('i18n.NAME') }}</th>
                <th>{{ $t('i18n.SECURITY_MODE') }}</th>
                <th>{{ $t('i18n.SIGNAL') }}</th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="list-conatiner" id="list-conatiner">
          <button class="table-body" v-show="!isLoading" v-for="(wifi, index) in wifiList" :key="index" :class="{'last-item': index === (wifiList.length - 1)}" @click="wifiLogin(wifi)">
            <table>
              <tbody>
                <tr>
                  <td>{{ wifi.ssid }}</td>
                  <td>{{ wifi.encrypt }}</td>
                  <td>{{ wifi.signal }}</td>
                </tr>
              </tbody>
            </table>
          </button>
          <div class="loading-wrapper" v-show="isLoading">
            <loading class="wifi-loading"></loading>
            <p class="text">{{ $t('i18n.GET_WIFI_LISTS') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons">
      <button class="button" @click="checkNetWork">{{ $t('i18n.RETESTING_WIRED_NETWORK_TIP') }}</button>
      <button class="button" @click="refreshWifiList">{{ $t('i18n.REFRESH_THE_LIST') }}</button>
    </div>
  </div>
</template>

<script>
import { InconAlert } from '@/common/components/icons'
import Oval from '@/common/components/oval/oval'
import Loading from '../../../common/components/loading/loading'

import { netRepeaterScan } from '../../../api/network-check-api'
export default {
  name: 'wifiListView',
  data() {
    return {
      wifiList: [],
      isLoading: true
    }
  },
  mounted() {
    this.getWifiList()
    this.$root.Bus.$emit('HiddenAppLoading')
  },
  methods: {
    getWifiList() {
      this.isLoading = true
      netRepeaterScan().then(res => {
        this.wifiList = res.list
        this.isLoading = false
        if (this.bar) {
          this.bar.update()
        } else {
          this.createBar()
        }
      })
    },
    createBar() {
      this.$nextTick(() => {
        this.bar = new this.$geminiScrollbar({
          element: document.getElementById('list-conatiner')
        }).create()
      })
    },
    refreshWifiList() {
      if (!this.isLoading) {
        this.getWifiList()
      }
    },
    wifiLogin(wifi) {
      this.$root.Bus.WifiInfo = wifi
      this.$router.push({ name: 'WifiLogin' })
    },
    checkNetWork() {
      this.$router.push('/network-check')
    }
  },
  components: {
    InconAlert,
    Oval,
    Loading
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_constant.scss';
@import '../../../common/sass/_mixin.scss';

.wifi-list-view {
  width: 640px;
  margin: 0 auto;
  .wifi-list-alert {
    width: 100%;
    margin-bottom: 30px;
    text-align: center;
    font-size: 14px;
    color: rgba(58, 56, 72, 1);
    line-height: 20px;
    .alert {
      margin-top: 0;
      margin-right: 10px;
    }
  }
  .wifi-list-container {
    width: 100%;
    background: white;
    border-radius: $startContentRaduis;
    padding: 40px;
    .title {
      font-size: 18px;
      color: rgba(58, 56, 72, 1);
      line-height: 25px;
      font-weight: 500;
      text-align: center;
      margin-bottom: 20px;
    }
    .list-table {
      width: 100%;
      .table-head {
        width: 100%;
        background: rgba(240, 243, 247, 1);
        border-radius: 6px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: rgba(158, 157, 159, 1);
        table {
          width: 535px;
          margin: 0 auto;
          table-layout: fixed;
          th {
            text-align: center;
            &:nth-child(1) {
              padding-left: 30px;
              text-align: left;
            }
            &:nth-child(3) {
              padding-right: 30px;
              text-align: right;
              margin-left: -60px;
            }
          }
        }
      }
      .list-conatiner {
        position: relative;
        width: 560px;
        height: 224px;
        overflow: hidden;
        .loading-wrapper {
          text-align: center;
          margin-top: 78px;
          .wifi-loading {
            margin: 0 auto;
          }
          .text {
            margin-top: 30px;
            text-align: center;
          }
        }
      }
      .table-body {
        display: block;
        background: none;
        outline: none;
        border: none;
        width: 535px;
        height: 45px;
        border-radius: 3px;
        position: relative;
        margin: 0 auto;
        margin-top: 10px;
        cursor: pointer;
        @include listHover();
        &.last-item {
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          table-layout: fixed;
          tr {
            height: 45px;
            td {
              text-align: center;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              &:nth-child(1) {
                text-align: left;
                padding-left: 30px;
              }
              &:nth-child(3) {
                text-align: right;
                padding-right: 30px;
              }
            }
          }
        }
      }
    }
  }
  .buttons {
    @include startButtons();
    .button {
      outline: none;
      border: none;
      cursor: pointer;
    }
  }
}
</style>
