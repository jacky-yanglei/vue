<template>
  <div class="main-config-container">
    <div class="speed-config-wrapper">
      <div class="speed-config-container">
        <div class="speed-subarea speed-item">
          <span class="item-name">{{ $t('i18n.SPEED_SUBAREA') }}：</span>
          <span v-if="userInfo.userName">{{ subareaName }}</span>
          <span v-if="!userInfo.userName">{{ $t('i18n.PLEASE_LOGIN') }}</span>
        </div>
        <div class="speed-mode speed-item">
          <span class="item-name">{{ $t('i18n.SPEED_MOD') }}：</span>
          <span v-if="userInfo.userName">{{ modName }}</span>
          <span v-if="!userInfo.userName">{{ $t('i18n.PLEASE_LOGIN') }}</span>
        </div>
      </div>
      <div class="edit-speed-config" @click="linkToSpeedConfig"></div>
    </div>
    <div class="devices-wrapper">
      <div class="title-wrapper">
        <span class="title">{{ $t('i18n.MAINFRAME_DEVICES') }}（{{ speedDevNum }}）</span>
        <span class="tips">{{ $t('i18n.HOW_TO_SPEED_DEVICES') }}</span>
      </div>
      <div class="lists-wrapeer" ref="listWrapper">
        <div v-show="!getDevLoading && !speedDeving">
          <device-item v-for="(item, index) in devList" :key="'dev' + index" :devInfo="item" @handleSwitchChange="dealSwitchChange(item)" />
        </div>
        <div v-if="getDevLoading || speedDeving" class="loading-wrapper">
          <loading-wait :msg="loadingInfo.msg" :show="loadingInfo.show"></loading-wait>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DeviceItem from './device-item'
import Bscroll from 'better-scroll'
import LoadingWait from '../../../../common/components/loadings/loading-wait'

import { mapGetters, mapMutations } from 'vuex'

import { devListGet, devTunSet, accConfigGet } from '../../../../api/speed-manage-api'
export default {
  name: 'MainConfig',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    accState: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'accNode'])
  },
  data () {
    return {
      devList: [],
      bscroll: null,
      speedDevList: [],
      copySpeedDevList: [], // 拷贝的处于加速通道中的设备列表
      intervalTime: null,
      loadingInfo: {
        msg: this.$t('i18n.GETTING_DEV_LIST'),
        show: true,
        showMask: false
      },
      getDevLoading: true,
      speedDeving: false, // 设备正在加速中
      speedDevNum: 0, // 加速设备数量
      subareaName: this.$t('i18n.IS_PULLING'), // 加速分区
      modName: this.$t('i18n.IS_PULLING'), // 加速模式
      speedItem: {} // 待改变加速状态的设备
    }
  },
  mounted () {
    this.getDevList()
    this.getSpeedConfig()
    this.intervalGetDevList()
  },
  components: {
    DeviceItem,
    LoadingWait
  },
  methods: {
    linkToSpeedConfig() {
      if (parseInt(this.accNode.ret) === 0) {
        this.$router.push('/speed-config')
      }
    },
    /**
     * artificial 是否是手动调用接口
     */
    getDevList(artificial = false) { // 获取加速设备列表
      this.speedDevList = []
      devListGet({refresh: 0})
        .then(res => {
          this.devList = [...(res.dev_list)]
          this.speedDevNum = this.devList.length
          for (let i = 0; i < this.devList.length; i++) {
            if (parseInt(this.devList[i].wl) === 1) {
              this.speedDevList.push(this.devList[i])
              if (this.speedDevList.length >= 2) {
                break
              }
            }
          }
          this.copySpeedDevList = [].concat(this.speedDevList)
          this.getDevLoading = false
          if (this.bscroll) {
            this.$nextTick(() => {
              this.bscroll.refresh()
            })
          } else {
            this.$nextTick(() => {
              this.bscroll = new Bscroll(this.$refs.listWrapper, {
                click: false
              })
            })
          }
        })
    },
    getSpeedConfig() { // 获取加速设置
      accConfigGet()
        .then(res => {
          this.subareaName = this.computedNodeZone(res.nodeZone)
          this.modName = this.computedModName(res.mode)
          this.setAccNode(res)
        })
        .catch(e => {
          this.subareaName = this.$t('i18n.PULL_FAILED_RESTART_PULL')
          this.modName = this.$t('i18n.PULL_FAILED_RESTART_PULL')
        })
    },
    computedNodeZone(nodeZone) {
      if (nodeZone === '' || nodeZone === '自动') {
        return `自动（${this.accState.accNodeZone}）`
      }
      return nodeZone
    },
    computedModName(mode) {
      if (parseInt(mode) === 0 || mode === '' || mode === '自动') {
        return this.$t('i18n.SPEED_MOD_LIST.MOD0')
      }
      const tempObj = {
        '1': this.$t('i18n.SPEED_MOD_LIST.MOD1'),
        '2': this.$t('i18n.SPEED_MOD_LIST.MOD2'),
        '3': this.$t('i18n.SPEED_MOD_LIST.MOD3'),
        '4': this.$t('i18n.SPEED_MOD_LIST.MOD4')
      }
      return tempObj[mode]
    },
    intervalGetDevList() { // 轮询获取加速设备列表
      this.intervalTime = setInterval(() => {
        if (!this.speedDeving) {
          this.getDevList()
        }
        this.getSpeedConfig()
      }, 3000)
    },
    dealSwitchChange(devItem) { // 处理点击加速
      // 设备超过两个的话，进行弹窗提示
      if (this.copySpeedDevList.indexOf(devItem) < 0 && this.copySpeedDevList.length >= 2) {
        const res = window.confirm(this.$t('i18n.EXCEED_TWO_DEVICES_TIPS'))
        if (!res) {
          return null
        }
      }
      parseInt(devItem.wl) === 1 ? devItem.wl = 0 : devItem.wl = 1
      this.speedItem = {
        enable: parseInt(devItem.wl),
        mac: devItem.mac,
        bow: 'white'
      }
      this.speedDeving = true // 加速中
      if (!this.getDevLoading) {
        this.getDevLoading = true
        this.getDevList()
      }
    },
    SpeedDev(devItem) { // 加速设备
      devTunSet(devItem)
        .then(res => {
          this.speedDeving = false
          this.getDevLoading = true
          // this.speedDeving = false // 取消加速中的状态
        })
        .catch(() => {
          this.speedDeving = false
          this.getDevLoading = true
          // this.speedDeving = false // 取消加速中的状态
        })
    },
    watchRouter() {
      if (this.$route.name !== 'Index') {
        clearInterval(this.intervalTime)
      }
    },
    ...mapMutations({
      'setAccNode': 'SET_ACC_NODE'
    })
  },
  beforeDestroy() {
    clearInterval(this.intervalTime)
  },
  watch: {
    getDevLoading(newVal, oldVal) {
      if (!newVal && this.speedDeving) {
        this.SpeedDev(this.speedItem)
      }
    },
    '$route': 'watchRouter'
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../common/scss/_mixin';
@import '../../../../common/scss/_utils';
.main-config-container {
  width: 100%;
  height: rem(717px);
  background: white;
  .speed-config-wrapper {
    position: relative;
    padding: rem(60px) rem(40px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    &::after {
      position: absolute;
      left: 0;
      bottom: 0;
      content: '';
      width: 100%;
      height: 1px;
      background: rgba(0, 0, 0, 1);
      opacity: 0.1;
    }
    .speed-config-container {
      max-width: rem(500px);
      .speed-item {
        font-size: rem(30px);
        color: #2c2a38;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .item-name {
          color: #6f7592;
        }
        &.speed-subarea {
          margin-bottom: rem(30px);
        }
      }
    }
    .edit-speed-config {
      width: rem(60px);
      height: rem(60px);
      @include bgImg('../icons/icon_edit_setting.png');
    }
  }
  .devices-wrapper {
    width: 100%;
    .title-wrapper {
      padding: rem(30px) rem(40px) rem(40px) rem(40px);
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: rem(30px);
        color: #3a3848;
      }
      .tips {
        font-size: rem(24px);
        color: #b3b3b3;
      }
    }
    .lists-wrapeer {
      position: relative;
      width: 100%;
      height: rem(350px);
      overflow: auto;
      .loading-wrapper {
        position: absolute;
        top: 0;
        width: 100%;
      }
    }
  }
}
</style>
