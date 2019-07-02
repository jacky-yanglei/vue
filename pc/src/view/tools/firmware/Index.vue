<template>
  <div class="firmware-update-recovery">
    <div class="left">
      <div class="tab" :class="{'active': currentTab === 'firmwareUpdate'}" @click="changeTab('firmwareUpdate')">
        <div class="wrapper">
          <span>{{ $t('i18n.LOCAL_UPGRADE') }}</span>
          <i class="arrow-wrapper">
            <arrow-incon position="right" color="blue"></arrow-incon>
          </i>
        </div>
      </div>
      <div class="tab" :class="{'active': currentTab === 'onlineUpdate'}" @click="changeTab('onlineUpdate')">
        <div class="wrapper">
          <span>{{ $t('i18n.ONLINE_UPDATE') }}</span>
          <i class="arrow-wrapper">
            <arrow-incon position="right" color="blue"></arrow-incon>
          </i>
        </div>
      </div>
    </div>
    <div class="component-wrapper">
      <transition name="fade" enter-active-class="animated fadeIn">
        <component :is="currentComponent" @disableClick="disableClick"></component>
      </transition>
    </div>
  </div>
</template>

<script>
import { ArrowIncon } from '@/common/components/icons'
import firmwareUpdate from './components/FirmwareUpdate'
import onlineUpdate from './components/OnlineUpdate'

export default {
  name: 'FirmwareUpdateRecovery',
  data() {
    return {
      currentTab: 'firmwareUpdate',
      disableClickStatus: false
    }
  },
  computed: {
    currentComponent() {
      return this.currentTab
    }
  },
  methods: {
    changeTab(tab) {
      if (this.disableClickStatus) {
        return null
      }
      this.currentTab = tab
    },
    disableClick(status) {
      this.disableClickStatus = status
    }
  },
  components: {
    ArrowIncon,
    firmwareUpdate,
    onlineUpdate
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_mixin';
@import '../../../common/sass/_constant';

.firmware-update-recovery {
  width: 840px;
  margin: 0 auto;
  // display: flex;
  // justify-content: center;
  position: relative;
  .left {
    width: 220px;
    height: 200px;
    float: left;
    background: linear-gradient(
      180deg,
      rgba(240, 243, 247, 1),
      rgba(255, 255, 255, 1)
    );
    box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.15);
    border-radius: 6px;
    margin-right: 20px;
    display: flex;
    flex-direction: column;
    padding-bottom: 50px;
    .tab {
      position: relative;
      top: 6px;
      width: 220px;
      height: 70px;
      font-size: 16px;
      cursor: pointer;
      &:hover,
      &.active {
        box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.5);
        border-radius: 2px;
        &::before {
          position: absolute;
          top: -3px;
          left: -3px;
          content: '';
          width: 226px;
          height: 76px;
          background: linear-gradient(
            -90deg,
            rgba(57, 193, 255, 1),
            rgba(0, 159, 232, 1)
          );
          border-radius: 6px;
          display: block;
        }
        .wrapper {
          background: white;
          border-radius: 2px;
          span {
            color: rgba(58, 56, 72, 1);
          }
        }
      }
      &.active {
        .wrapper {
          .arrow-wrapper {
            display: block;
          }
        }
      }
      &:nth-of-type(1) {
        top: 0;
      }
      .wrapper {
        position: relative;
        z-index: 9;
        width: 100%;
        height: 100%;
        color: rgba(131, 137, 161, 1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px 30px;
        span {
          font-size: 16px;
          color: rgba(131, 137, 161, 1);
        }
        .arrow-wrapper {
          width: 8px;
          height: 10px;
          display: none;
        }
      }
    }
  }
  .component-wrapper {
    float: left;
    width: 600px;
    border-radius: 6px;
  }
}
</style>
