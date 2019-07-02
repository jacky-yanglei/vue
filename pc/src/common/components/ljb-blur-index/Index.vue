<template>
<div class="ping" @click="backGo()">
  <div class="ljb-blur">
    <div class="w1220">
      <blur-tools/>
      <blur-left/>
      <blur-right/>
    </div>
    <div class="cover" :class="{'op0': isIeBrowser}"></div>
  </div>
</div>
</template>

<script>
import BlurLeft from './components/BlurLeft'
import BlurRight from './components/BlurRight'
import BlurTools from './components/BlurTools'

export default {
  name: 'LjbBlurIndex',
  data: function() {
    return {
      isIeBrowser: false
    }
  },
  components: {
    BlurLeft,
    BlurRight,
    BlurTools
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
      this.$router.push('/') // 路由向后退一步
    }
  },
  watch: {
    $route: 'checkRoute'
  },
  created() {
    this.checkBrowserType()
  }
}
</script>

<style lang="scss" scoped>
.ping {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.ljb-blur {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 7.6%;
  background: rgba(216, 218, 226, 1);
  -webkit-filter: blur(10px);
  -moz-filter: blur(10px);
  -ms-filter: blur(10px);
  filter: blur(10px);

  filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=10, MakeShadow=false);
  opacity: 0.7;
  &>.w1220 {
    width: 1220px;
    margin: 0 auto;
  }
  & > .cover {
    position: relative;
    height: 0;
    background-color: transparent;
    opacity: 0.7;
  }
  & > .op0 {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #808080;
  }
}
</style>
