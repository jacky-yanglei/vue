<template>
<div class="ping" @click="backGo()">
  <div class="ljb-blur-wifi">
    <div class="ljb-blur-box">
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
          <div class="table-body" v-for="(wifi, index) in wifiList" :key="index">
            <table>
              <tbody>
                <tr>
                  <td>{{ wifi.name }}</td>
                  <td>{{ wifi.safeMode }}</td>
                  <td>{{ wifi.signal }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="buttons">
        <span class="button">{{ $t('i18n.RETESTING_WIRED_NETWORK_TIP') }}</span>
        <span class="button">{{ $t('i18n.REFRESH_THE_LIST') }}</span>
      </div>
    </div>
    <div class="cover" :class="{'op0': isIeBrowser}"></div>
  </div>
  <ljb-footer></ljb-footer>
</div>
</template>

<script>
import InconAlert from '@/common/components/icons/icon-alert'
import LjbFooter from '../ljb-footer/Index'
export default {
  name: 'LjbBlurWifi',
  data() {
    return {
      wifiList: [
        {
          name: 'qeeyou01',
          safeMode: 'WPA2-PSK',
          signal: '100'
        },
        {
          name: 'qeeyou02',
          safeMode: 'WPA2-PSK',
          signal: '100'
        },
        {
          name: 'qeeyou02',
          safeMode: 'WPA2-PSK',
          signal: '100'
        }
      ],
      isIeBrowser: false,
      couldClick: true
    }
  },
  components: {
    InconAlert,
    LjbFooter
  },
  methods: {
    checkBrowserType: function() {
      // 检查浏览器的类型
      let type
      let userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
      let isOpera = userAgent.indexOf('Opera') > -1
      let browsers = navigator.appName
      var bVersion = navigator.appVersion
      let version = bVersion.split(';')
      let trimVersion = (version[1]) ? version[1].replace(/[ ]/g, '') : version[0].replace(/[ ]/g, '')
      if (userAgent.indexOf('Opera') > -1) {
        type = 'Opera'
      } else if (userAgent.indexOf('Firefox') > -1) {
        type = 'FF'
      } else if (userAgent.indexOf('Chrome') > -1) {
        type = 'Chrome'
      } else if (userAgent.indexOf('Safari') > -1) {
        type = 'Safari'
      } else if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
        type = 'IE'
      } else if (browsers === 'Netscape' && trimVersion === 'WOW64') {
        type = 'IE'
      }
      this.toggleBlurAndCover(type)
    },
    toggleBlurAndCover: function(type) {
      if (type === 'IE') {
        this.isIeBrowser = true
      } else {
        this.isIeBrowser = false
      }
    },
    checkRoute: function() {
      this.checkBrowserType()
    },
    backGo: function() {
      if (this.couldClick) {
        this.$router.push('/wifi') // 路由向后退一步
      }
    }
  },
  watch: {
    $route: 'checkRoute'
  },
  created() {
    this.checkBrowserType()
    this.$root.Bus.$on('maskClick', val => {
      this.couldClick = val
    })
  },
  beforeDestroy() {
    this.$root.Bus.$off('maskClick')
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_constant.scss';
@import '../../../common/sass/_mixin.scss';
.ping {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.ljb-blur-wifi {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // border: 1px solid red;
  z-index: 0;
  padding-top: 7.625%;
  -webkit-filter: blur(10px);
  -moz-filter: blur(10px);
  -ms-filter: blur(10px);
  filter: blur(10px);

  filter: progid:DXImageTransform.Microsoft.Blur(
      PixelRadius=10,
      MakeShadow=false
    );
  opacity: 1;
  & > .cover {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: transparent;
    opacity: 0.7;
  }
  & > .op0 {
    background-color: #808080;
  }
}
.ljb-blur-box {
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
    background: #dfe2e8;
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
          width: 100%;
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
            }
          }
        }
      }
      .table-body {
        width: 100%;
        height: 56px;
        border-radius: 3px;
        position: relative;
        cursor: pointer;
        table {
          width: 100%;
          table-layout: fixed;
          tr {
            height: 56px;
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
  }
}
</style>
