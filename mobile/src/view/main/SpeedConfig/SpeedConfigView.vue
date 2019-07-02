<template>
  <div class="config-wrapper">
    <div class="tips">
      <span></span>{{ $t('i18n.CHANGE_RESTART_SAVE') }}
    </div>
    <div class="config-tab">
      <div class="back" @click="linkToIndex"></div>
      <div class="tabs">
        <span class="tab" @click="chooseTab('SpeedSubared')" :class="{'active': currentTabComponent === 'SpeedSubared'}">{{ $t('i18n.SPEED_SUBAREA') }}</span>
        <span class="line"></span>
        <span class="tab" @click="chooseTab('SpeedMod')" :class="{'active': currentTabComponent === 'SpeedMod'}">{{ $t('i18n.SPEED_MOD') }}</span>
      </div>
      <div class="refresh"
      :class="{'show': currentTabComponent === 'SpeedSubared', 'refreshing': refreshing}"
      @click="refreshNodeList()"></div>
    </div>
    <div class="component-wrapper">
      <component
      :is="currentTabComponent"
      :refresh="refreshing"
      @handleRefresh="dealRefresh"></component>
    </div>
    <primary-button
    class="save-config"
    :disabled="disabledBtn"
    :loading="loading"
    @buttonClicked="saveConfig"
    >保存并应用</primary-button>
  </div>
</template>

<script>
import SpeedSubared from './components/speed-subared'
import SpeedMod from './components/speed-mod'
import PrimaryButton from '../../../common/components/buttons/primary-button'

import { accConfigGet, accConfigSet, accControlAction } from '../../../api/speed-manage-api'

import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'SpeedConfigView',
  data () {
    return {
      currentTabComponent: 'SpeedSubared',
      originalSpeedConfigInfo: null, // 从服务器获取的用户加速信息
      disabledBtn: true,
      refreshing: false,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['accNode'])
  },
  created() {
    this.getSpeedConfig()
  },
  methods: {
    chooseTab(component) {
      this.currentTabComponent = component
    },
    linkToIndex() {
      this.$emit('handleHidenMainConfig', {type: 'mainConfig', speedAgain: false})
      this.$router.push('/')
    },
    getSpeedConfig() {
      if (parseInt(this.accNode.ret) === 0) {
        this.originalSpeedConfigInfo = Object.assign({}, this.accNode)
        return null
      }
      accConfigGet()
        .then(res => {
          this.originalSpeedConfigInfo = Object.assign({}, res)
          this.setAccNode(res)
        })
    },
    saveConfig() {
      this.loading = true
      this.disabledBtn = true
      const dataParmas = Object.assign({}, this.accNode)
      if (dataParmas.nodeZone === '自动' || dataParmas.nodeZone === '' || parseInt(dataParmas.nodeZone) === 0) {
        dataParmas.nodeZone = ''
      }
      accConfigSet(dataParmas)
        .then(res => {
          this.SpeedAgian()
        })
    },
    SpeedAgian() {
      accControlAction({'action': 'restart'})
        .then(res => {
          this.loading = false
          this.disabledBtn = false
          this.$emit('handleHidenMainConfig', {type: 'mainConfig', speedAgain: true})
          this.$router.push('/')
        })
        .catch(() => {
          this.loading = false
          this.disabledBtn = false
          this.$emit('handleHidenMainConfig', {type: 'mainConfig', speedAgain: true})
          this.$router.push('/')
        })
    },
    refreshNodeList() {
      this.refreshing = true
    },
    dealRefresh() {
      this.refreshing = false
    },
    ...mapMutations({
      'setAccNode': 'SET_ACC_NODE'
    })
  },
  components: {
    SpeedSubared,
    SpeedMod,
    PrimaryButton
  },
  watch: {
    accNode() {
      const copyOriginalSpeedConfigInfo = Object.assign({}, this.originalSpeedConfigInfo)
      const copyAccNode = Object.assign({}, this.accNode)

      // 处理自动相关操作
      if (copyOriginalSpeedConfigInfo.nodeZone === '' || copyOriginalSpeedConfigInfo.nodeZone === '自动' || parseInt(copyOriginalSpeedConfigInfo.nodeZone) === 0) {
        copyOriginalSpeedConfigInfo.nodeZone = ''
      }
      if (copyOriginalSpeedConfigInfo.mode === '' || copyOriginalSpeedConfigInfo.mode === '自动' || parseInt(copyOriginalSpeedConfigInfo.mode) === 0) {
        copyOriginalSpeedConfigInfo.mode = ''
      }

      if (copyAccNode.nodeZone === '' || copyAccNode.nodeZone === '自动' || parseInt(copyAccNode.nodeZone) === 0) {
        copyAccNode.nodeZone = ''
      }
      if (copyAccNode.mode === '' || copyAccNode.mode === '自动' || parseInt(copyAccNode.mode) === 0) {
        copyAccNode.mode = ''
      }

      if (copyOriginalSpeedConfigInfo.nodeZone === ('' + copyAccNode.nodeZone) && copyOriginalSpeedConfigInfo.mode === ('' + copyAccNode.mode)) {
        this.disabledBtn = true
      } else {
        this.disabledBtn = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/scss/_mixin';
@import '../../../common/scss/_utils';
  .config-wrapper {
    z-index: 12;
    display: flex;
    flex-direction: column;
    width: rem(750px);
    height: 100%;
    background:linear-gradient(180deg,rgba(255,255,255,1), rgba(238,239,242,1));
    .tips {
      width: 100%;
      height: rem(70px);
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      background:rgba(239,241,243,1);
      font-size: rem(26px);
      color:rgba(117,115,139,1);
      flex-shrink: 0;
      span {
        width: rem(36px);
        height: rem(36px);
        background-size: 100%;
        background-repeat: no-repeat;
        background-image: url('../../../assets/images/icon_warning.png');
        margin-right: rem(20px);
      }
    }
    .config-tab {
      width: 100%;
      height: rem(112px);
      display: flex;
      justify-content: space-between;
      padding: 0 rem(30px);
      align-items: center;
      background: white;
      flex-shrink: 0;
      .back {
        width: rem(40px);
        height: rem(40px);
        background-repeat: no-repeat;
        background-size: 100%;
        background-image: url('../../../assets/images/icon_topbar_back.png');
      }
      .tabs {
        display: flex;
        align-items: center;
        font-size: rem(36px);
        color:rgba(179,179,179,1);
        .tab {
          &.active {
            color:rgba(58,56,72,1);
          }
        }
        .line {
          display: inline-block;
          height: rem(46px);
          width: 1px;
          background:rgba(0,0,0,1);
          opacity:0.1;
          margin: 0 rem(40px);
        }
      }
      .refresh {
        width: rem(40px);
        height: rem(40px);
        background-repeat: no-repeat;
        background-size: 100%;
        &.show {
          background-image: url('../../../assets/images/icon_refresh.png');
        }
        &.refreshing {
          background-image: url('../../../assets/images/icon_refresh_hover.png');
          animation: rotate 2s linear;
          animation-iteration-count: infinite;
        }
        @keyframes rotate {
          0% {
            transform: rotate(0deg)
          }
          25% {
            transform: rotate(90deg)
          }
          50% {
            transform: rotate(180deg)
          }
          75% {
            transform: rotate(270deg)
          }
          100% {
            transform: rotate(360deg)
          }
        }
      }
    }
    .component-wrapper {
      flex: 1;
      flex-shrink: 0;
      overflow: auto;
    }
    .save-config {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 20;
      border-radius: 0;
    }
  }
</style>
