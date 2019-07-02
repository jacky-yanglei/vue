<template>
  <div class="item" :class="{'active': devInfo.wl == 1}">
    <div class="left-content">
      <div class="device-type" :class="typeClass"></div>
      <div class="content">
        <div class="device-name">{{ devInfo.name }}<span v-if="devInfo.self == 1">（{{$t('i18n.LOCAL_DEVICE')}}）</span></div>
        <div class="ip">{{ devInfo.ip }}</div>
      </div>
    </div>
    <div class="right-content">
      <app-switch @handleChecked="toogleChecked" :checked="devInfo.wl == 1"></app-switch>
    </div>
  </div>
</template>

<script>
import AppSwitch from '../../../../common/components/switch/switch'

export default {
  name: 'SwitchItem',
  props: {
    devInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    typeClass() {
      return {
        'pc': parseInt(this.devInfo.dt) === 1,
        'mobile': parseInt(this.devInfo.dt) === 2,
        'ps': parseInt(this.devInfo.dt) === 3,
        'xobx': parseInt(this.devInfo.dt) === 4,
        'ns': parseInt(this.devInfo.dt) === 5,
        'speed': parseInt(this.devInfo.wl) === 1
      }
    }
  },
  data () {
    return {
      checked: false
    }
  },
  methods: {
    toogleChecked() {
      this.$emit('handleSwitchChange')
    }
  },
  components: {
    AppSwitch
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../common/scss/_utils';
@import '../../../../common/scss/_mixin';
.item {
  position: relative;
  width: 100%;
  height: rem(110px);
  padding: 0 rem(40px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  &.active {
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      content: '';
      width: 100%;
      height: 100%;
      background: linear-gradient(
        -90deg,
        rgba(0, 159, 232, 0),
        rgba(0, 159, 232, 1)
      );
      opacity: 0.1;
    }
    &:after {
      position: absolute;
      left: 0;
      bottom: 0;
      content: '';
      width: 100%;
      height: 1px;
      background: linear-gradient(
        -90deg,
        rgba(0, 159, 232, 0),
        rgba(0, 159, 232, 1)
      );
      opacity: 0.4;
    }
  }
  .left-content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .device-type {
      width: rem(46px);
      height: rem(46px);
      &.ps {
        @include bgImg('../icons/icon_PS4_normal.png');
        &.speed {
          @include bgImg('../icons/icon_PS4_focused.png');
        }
      }
      &.xobx {
        @include bgImg('../icons/icon_XBOX_normal.png');
        &.speed {
          @include bgImg('../icons/icon_XBOX_focused.png');
        }
      }
      &.ns {
        @include bgImg('../icons/icon_NS_normal.png');
        &.speed {
          @include bgImg('../icons/icon_NS_focused.png');
        }
      }
      &.pc {
        @include bgImg('../icons/icon_PC_normal.png');
        &.speed {
          @include bgImg('../icons/icon_PC_focused.png');
        }
      }
      &.mobile {
        @include bgImg('../icons/icon_Phone_normal.png');
        &.speed {
          @include bgImg('../icons/icon_Phone_focused.png');
        }
      }
    }
    .content {
      max-width: rem(355px);
      color: #3a3848;
      margin-left: rem(30px);
      > div {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .device-name {
        font-size: rem(26px);
        span {
          font-size: rem(26px);
        }
      }
      .ip {
        font-size: rem(24px);
        color: #75738b;
      }
    }
  }
}
</style>
