<template>
  <div id="app" ref="app">
    <div class="update-tip" @click="toFirmwareFn()" v-show="isShowUpdateTip">升级提醒</div>
    <router-view></router-view>
  </div>
</template>

<script>
import Bscroll from 'better-scroll'
import utils from '@/common/service/utils'
import { sysFirmwareInfo, sysFirmwareCheck } from '@/api/system-manage-api'
import { mapMutations } from 'vuex'
export default {
  name: 'App',
  data: function () {
    return {
      isShowUpdateTip: false,
      newVer: null,
      currVer: null,
      forceUpdate: null,
      compatibleVer: null
    }
  },
  methods: {
    toFirmwareFn: function () {
      this.$router.push('/firmware')
    },
    getVersionInfoFn: function () {
      sysFirmwareInfo()
        .then((res) => {
          this.currVer = res.version
          this.currVersion(this.currVer)
          sysFirmwareCheck()
            .then(res => {
              console.log(res)
              this.sysUpdateInfoFn(res)
              this.newVer = res.version
              this.forceUpdate = parseInt(res.force_upgrade)
              this.compatibleVer = res.compatible_version || '0.0.0'
              this.checkForceUpdateFn()
            })
        })
    },
    checkForceUpdateFn: function () {
      // 检测是否强制升级
      let result = utils.compareVersion(this.compatibleVer, this.currVer)
      if (this.forceUpdate === 1 || result) {
        // 需要强制升级
        this.$router.push('/force-update')
      } else {
        // 不需要强制升级
        // this.compareVersionFn()
        // this.$router.push('/force-update')
      }
    },
    compareVersionFn: function () {
      // 检测是否需要显示提醒升级的按钮
      // let result = utils.compareVersion(this.currentVer, this.newVer)
    },
    ...mapMutations({
      'sysUpdateInfoFn': 'SYS_UPDATE_INFO',
      'currVersion': 'CURR_VERSION'
    })
  },
  created () {
    this.getVersionInfoFn()
  },
  mounted () {
    // this.$refs.app.style.height = document.body.clientHeight + 'px'
    this.$nextTick(() => {
      this.scroll = new Bscroll(this.$refs.app, {click: true})
    })
  }
}
</script>

<style lang="scss" scoped>
@import './common/scss/_utils';
#app {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  & > .update-tip {
    position: fixed;
    z-index: 12;
    border: 1px solid red;
  }
}
</style>
