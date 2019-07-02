<template>
  <div class="subared-wrapper" ref="subaredWrapper">
    <div class="subared-list" v-show="subaredList.length && !waitingGetNodeList">
      <div class="list-item"
      v-for="(item, index) in subaredList"
      :key="'subared' + index"
      :class="{'active': item.servername === accNode.nodeZone }"
      @click="setSpeedConfig(item)">
        <div class="subared-info">
          <span class="subared-status"></span>
          <span class="subared-name">{{ item.servername }}</span>
        </div>
        <div class="subared-ping">{{ item.ping }}<span v-if="item.ping">ms</span></div>
      </div>
    </div>
    <div v-if="!subaredList.length && !waitingGetNodeList" class="error-info">{{ errorText }}</div>
    <div v-if="waitingGetNodeList" class="loading-wrapper">
      <loading :msg="loadingTips.msg" :show="waitingGetNodeList"></loading>
    </div>
  </div>
</template>

<script>
import Bscroll from 'better-scroll'
import PrimaryButton from '../../../../common/components/buttons/primary-button'
import Loading from '../../../../common/components/loadings/loading-wait'

import { mapGetters, mapMutations } from 'vuex'

import { accNodeList, accConfigGet } from '../../../../api/speed-manage-api'
export default {
  name: 'SpeedSubared',
  props: {
    refresh: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      subaredList: [],
      errorText: '',
      waitingGetNodeList: true,
      loadingTips: {
        msg: this.$t('i18n.GETTING_NODE_LIST')
      }
    }
  },
  computed: {
    ...mapGetters(['accNode'])
  },
  components: {
    PrimaryButton,
    Loading
  },
  mounted() {
    this.getAccConfig()
  },
  methods: {
    /**
     * refresh 是否刷新节点, 0不刷新，1刷新
     */
    getSubaredList(refresh = 0) {
      this.waitingGetNodeList = true
      accNodeList({refresh})
        .then(res => {
          this.waitingGetNodeList = false
          if (res.node_list.length) {
            let AutoSubared = [
              {
                servername: this.$t('i18n.SPEED_MOD_LIST.MOD0'),
                ping: ''
              }
            ]
            let tempSubaredList = [].concat(AutoSubared, res.node_list)
            this.subaredList = tempSubaredList
            this.$nextTick(() => {
              this.scroll = new Bscroll(this.$refs.subaredWrapper, {
                click: true
              })
              this.$emit('handleRefresh')
            })
          }
        })
        .catch(e => {
          // console.log(e)
          this.waitingGetNodeList = false
          this.errorText = e.msg
          this.$emit('handleRefresh')
        })
    },
    setSpeedConfig(item) { // 加速配置
      const tempSpeedSubared = Object.assign({}, this.accNode)
      tempSpeedSubared.nodeId = item.nid
      tempSpeedSubared.nodeZone = item.servername
      this.setAccNode(tempSpeedSubared)
    },
    getAccConfig() { // 获取加速配置
      if (this.accNode.nodeZone) { // 如果store中没有accNode则调用API获取一次
        this.getSubaredList()
        return null
      }
      accConfigGet()
        .then(res => {
          this.setAccNode(res)
          this.getSubaredList()
        })
    },
    ...mapMutations({
      'setAccNode': 'SET_ACC_NODE'
    })
  },
  watch: {
    refresh(newVal, oldVal) {
      if (newVal) {
        this.getSubaredList(1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../common/scss/_utils';
@import '../../../../common/scss/_mixin';
.subared-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 19;
  .subared-list {
    width: 100%;
    padding-bottom: rem(110px);
    .list-item {
      position: relative;
      width: 100%;
      height: rem(114px);
      display: flex;
      justify-content: space-between;
      align-content: center;
      padding: 0 rem(40px);
      &::after {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        background:#e6e6e7;
        content: '';
      }
      &.active {
        background:linear-gradient(-90deg,rgba(0,159,232,0),rgba(0,159,232,.1));
        &::after {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 1px;
          background:linear-gradient(-90deg,rgba(0,159,232,0),rgba(0,159,232,1));
          content: '';
        }
        .subared-info {
          .subared-status {
            display: block;
            width: rem(24px);
            height: rem(24px);
            background: rgba(6, 244, 32, 1);
            border: rem(2px) solid white;
            box-shadow: 0px rem(6px) rem(18px) 0px rgba(53, 255, 182, 0.7);
            opacity: 1;
          }
        }
      }
      .subared-info {
        display: flex;
        align-items: center;
        .subared-status {
          width: rem(24px);
          height: rem(24px);
          margin-right: rem(30px);
          background:rgba(158,157,159,1);
          border-radius: 50%;
          opacity:0.2;
        }
        .subared-name {
          font-size: rem(30px);
          color: rgba(58, 56, 72, 1);
        }
      }
      .subared-ping {
        font-size: rem(28px);
        line-height: rem(114px);
        color: rgba(58, 56, 72, 1);
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
