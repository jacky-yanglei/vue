<template>
  <div class="mod-wrapper">
    <div class="mod-list" v-if="userInfo.userName">
      <div class="mod-item" v-for="(item, index) in mods"
      :key="'mod' + index"
      :class="{'active': item.modeNum == accNode.mode}"
      @click="setSpeedConfig(item)">
        <div class="icon"></div>
        <div class="mod-name">{{ item.name }}</div>
      </div>
    </div>
    <div v-if="!userInfo.userName" class="error-info">{{ errorText }}</div>
  </div>
</template>

<script>
import PrimaryButton from '../../../../common/components/buttons/primary-button'

import { mapGetters, mapMutations } from 'vuex'

import { accConfigGet } from '../../../../api/speed-manage-api'

export default {
  name: 'SpeedMod',
  data () {
    return {
      mods: [
        {
          modeNum: 0,
          active: true,
          name: this.$t('i18n.SPEED_MOD_LIST.MOD0')
        },
        {
          modeNum: 1,
          active: false,
          name: this.$t('i18n.SPEED_MOD_LIST.MOD1')
        },
        {
          modeNum: 2,
          active: false,
          name: this.$t('i18n.SPEED_MOD_LIST.MOD2')
        },
        {
          modeNum: 3,
          active: false,
          name: this.$t('i18n.SPEED_MOD_LIST.MOD3')
        },
        {
          modeNum: 4,
          active: false,
          name: this.$t('i18n.SPEED_MOD_LIST.MOD4')
        }
      ],
      errorText: this.$t('i18n.SPEED_MOD_PULL_FAIL')
    }
  },
  computed: {
    ...mapGetters(['accNode', 'userInfo'])
  },
  mounted () {
    if (this.userInfo.userName) {
      this.getSpeedConfig()
    }
  },
  methods: {
    getSpeedConfig() {
      if ('' + this.accNode.mode) {
        return null
      }
      accConfigGet()
        .then(res => {
          this.setAccNode(res)
        })
    },
    setSpeedConfig(item) {
      const modeNum = item.modeNum
      const tempSotreAccNode = Object.assign({}, this.accNode)
      tempSotreAccNode.mode = modeNum
      this.setAccNode(tempSotreAccNode)
    },
    ...mapMutations({
      'setAccNode': 'SET_ACC_NODE'
    })
  },
  components: {
    PrimaryButton
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../common/scss/_mixin';
@import '../../../../common/scss/_utils';

.mod-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 19;
  .mod-list {
    width: 100%;
    .mod-item {
      position: relative;
      width: 100%;
      height: rem(114px);
      display: flex;
      align-items: center;
      padding-left: rem(40px);
      font-size: rem(28px);
      color: rgba(58, 56, 72, 1);
      .icon {
        width: rem(24px);
        height: rem(24px);
        background: rgba(158, 157, 159, 1);
        opacity: 0.2;
        margin-right: rem(30px);
        border-radius: 50%;
      }
      &.active {
        background: linear-gradient(
          -90deg,
          rgba(0, 159, 232, 0),
          rgba(0, 159, 232, 0.1)
        );
        &::after {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(
            -90deg,
            rgba(0, 159, 232, 0),
            rgba(0, 159, 232, 1)
          );
          content: '';
        }
        .icon {
          border: rem(2px) solid white;
          background: rgba(6, 244, 32, 1);
          box-shadow: 0px rem(6px) rem(18px) 0px rgba(53, 255, 182, 0.7);
          opacity: 1;
        }
      }
    }
  }
  .error-info {
    width: 100%;
    height: rem(70px);
    text-align: center;
    font-size: rem(26px);
    color:rgba(241,68,102,1);
    line-height: rem(70px);
    background:linear-gradient(90deg,rgba(241,68,102,0.1),rgba(241,68,102,0));
  }
}
</style>
