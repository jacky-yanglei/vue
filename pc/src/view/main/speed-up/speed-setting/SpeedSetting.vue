<template>
  <div id="speed-up-setting">
    <div class="speed-up-setting-title">
      {{ $t('i18n.SPEED_NODE') }}
      <a href="javascript:;" class="update-btn" :class="{'update-bg': addClassUpdateBg}" ref="UpdateBtn" @click="clickUpdateBtn()">1</a>
    </div>
    <ul class="speed-up-setting-lists" ref="NodeLists" :class="{'overflow-auto': isMac}">
      <a href="javascript:;" class="setting-list" @click="clickSpeedSetting(key, item)" v-for="(item, key) in nodeInfo" :key="key">
        <div class="line" v-if="key !== 0"></div>
        <i :class="{'i-heightlight': newKey === key ? true : false}"></i>
        <p>{{item.servername}}
          <em v-if="item.ping !== ''">{{item.ping}}ms</em>
        </p>
      </a>
      <div class="loading-wrapper" v-show="isShowLoading">
        <loading class="loading"></loading>
        <p>{{ txtLoadingTip }}</p>
      </div>
    </ul>
  </div>
</template>

<script>
import { accNodeList, accConfigGet } from '@/api/speed-manage-api'
import Loading from '@/common/components/loading/loading'
import utils from '@/common/service/utils'
export default {
  name: 'SpeedSetting',
  data: function() {
    return {
      newKey: null,
      nodeInfo: [{ servername: this.$t('i18n.AUTO'), ping: '', index: 0 }],
      start: 0,
      addClassUpdateBg: false,
      isUpdte: false,
      stopUpdateBtn: '',
      myNode: '',
      isShowLoading: false, // 是否显示loading状态
      txtLoadingTip: `${this.$t('i18n.TXT_LOADING_TIP')}`,
      isCanClick: true,
      stopUpdateRunning: null,
      isMac: false
    }
  },
  components: {
    Loading
  },
  methods: {
    clickSpeedSetting: function(key, item) {
      // 切换选中按钮
      this.newKey = key
      this.saveNodeInfo(item)
    },
    saveNodeInfo: function(data) {
      // 传递nodeinfo数据给indexspeedup组件
      this.$root.Bus.$emit('busNodeInfo', data)
    },
    clickUpdateBtn: function() {
      // 点击更新按钮
      if (this.isCanClick) {
        this.apiAccNodeListFn()
        this.addClassUpdateBg = true
        this.isCanClick = false
        this.isShowLoading = true // 显示loading状态
        this.txtLoadingTip = this.$t('i18n.TXT_LOADING_TIP')
      }
    },
    updateRunning: function() {
      // 调用按钮旋转的方法
      this.start = this.start + 5.5
      if (this.$refs.UpdateBtn) {
        this.$refs.UpdateBtn.style.transform = `rotate(${this.start}deg)`
        this.stopUpdateRunning = window.requestAnimationFrame(this.updateRunning)
        // 添加update-bg类名
        this.addClassUpdateBgFn(1)
        if (this.stopUpdateBtn === 0 && this.start > 500) {
          // 当返回的数据成功时，结束旋转
          window.cancelAnimationFrame(this.stopUpdateRunning)
          this.start = 0
          // 取消updaate-bg类名
          this.addClassUpdateBgFn(0)
          // 还原isUpdate
          this.isUpdte = false
          this.isCanClick = true
        }
      }
    },
    addClassUpdateBgFn: function(flag) {
      if (flag === 1) {
        this.addClassUpdateBg = true
      } else if (flag === 0) {
        this.addClassUpdateBg = false
      }
    },
    apiAccNodeListFn: function() {
      this.newKey = null
      // 点击刷新按钮时，调用接口
      let apiData = {
        refresh: '1'
      }
      accNodeList(apiData)
        .then(data => {
          this.isShowLoading = false // 隐藏loading状态
          this.txtLoadingTip = this.$t('i18n.TXT_LOADING_TIP')
          // 更新相关数据，并渲染到页面
          let isArr = Array.isArray(data.node_list)
          if (isArr) {
            let NODE_INDEX = data.node_list.findIndex((val) => {
              return val.servername === this.myNode.nodeZone
            })
            if (NODE_INDEX === -1) {
              this.newKey = 0
            } else {
              this.newKey = NODE_INDEX + 1
            }
            // 更新相关数据，并渲染到页面
            this.nodeInfo = [{ servername: this.$t('i18n.AUTO'), ping: '', index: 0 }]
            this.nodeInfo = this.nodeInfo.concat(data.node_list)
          } else {
            this.isShowLoading = false // 隐藏loading状态
            this.txtLoadingTip = this.$t('i18n.TXT_LOADING_TIP')
          }
          // 对成功进行提醒
          // 返回data.ret === 0 这个值，停止刷新按钮的旋转
          this.isCanClick = true
          this.addClassUpdateBg = false
          this.stopUpdateBtn = data.ret
          let sys = utils.checkSysTyle()
          this.isMac = false
          if (sys.mac) {
            this.isMac = true
          } else {
            this.isMac = false
          }
          // 渲染出滚动条
          if (this.bar) {
            this.bar.update()
          } else {
            this.createBar()
          }
          this.isShowLoading = false // 隐藏loading状态
          this.txtLoadingTip = this.$t('i18n.TXT_LOADING_TIP')
        })
        .catch(e => {
          // 对错误进行处理
          this.isShowLoading = true
          this.txtLoadingTip = `${this.$t('i18n.TXT_LOADING_ERROR_TIP')}`
          // 当返回的数据成功时，结束旋转
          this.isCanClick = true
          this.addClassUpdateBg = false
          // this.start = 0
          // window.cancelAnimationFrame(this.stopUpdateRunning)
        })
    },
    apiInitAccNodeListFn: function() {
      // 页面初始化时，调用接口
      let apiData = {
        refresh: '0'
      }
      accNodeList(apiData)
        .then(data => {
          this.isShowLoading = false // 隐藏loading状态
          this.txtLoadingTip = this.$t('i18n.TXT_LOADING_TIP')
          // 更新相关数据，并渲染到页面
          let isArr = Array.isArray(data.node_list)
          if (isArr) {
            let NODE_INDEX = data.node_list.findIndex((val) => {
              return val.servername === this.myNode.nodeZone
            })
            if (NODE_INDEX === -1) {
              this.newKey = 0
            } else {
              this.newKey = NODE_INDEX + 1
            }
            this.nodeInfo = this.nodeInfo.concat(data.node_list)
          } else {
            this.isShowLoading = false // 隐藏loading状态
            this.txtLoadingTip = this.$t('i18n.TXT_LOADING_TIP')
          }
          let sys = utils.checkSysTyle()
          this.isMac = false
          if (sys.mac) {
            this.isMac = true
          } else {
            this.isMac = false
          }
          // 渲染出滚动条
          if (this.bar) {
            this.bar.update()
          } else {
            this.createBar()
          }
        })
        .catch(e => {
          this.isShowLoading = true
          this.txtLoadingTip = `${this.$t('i18n.TXT_LOADING_ERROR_TIP')}`
        })
    },
    createBar() {
      const ele = this.$refs.NodeLists
      this.$nextTick(() => {
        this.bar = new this.$geminiScrollbar({
          element: ele
        }).create()
      })
    },
    getConfit() {
      this.isShowLoading = true // 显示loading状态
      this.txtLoadingTip = this.$t('i18n.TXT_LOADING_TIP')
      accConfigGet()
        .then(res => {
          this.myNode = res
          this.apiInitAccNodeListFn()
        })
        .catch((e) => {
          this.isShowLoading = true
          this.txtLoadingTip = `${this.$t('i18n.TXT_LOADING_ERROR_TIP')}`
        })
    }
  },
  created() {
    this.getConfit()
  },
  mounted() {
    let sys = utils.checkSysTyle()
    this.isMac = false
    if (sys.mac) {
      this.isMac = true
    } else {
      this.isMac = false
    }
  }
}
</script>

<style lang="scss" scoped>
#speed-up-setting {
  margin-left: 240px;
  width: 560px;
  height: 626px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.06);
  transform: translate(0);
  & > .speed-up-setting-title {
    width: 100%;
    height: 76px;
    line-height: 76px;
    background-color: #fff;
    padding-left: 30px;
    font-weight: bold;
    font-size: 20px;
    color: #3A3848;
    border-radius: 6px 6px 0 0;
    & > .update-btn {
      float: right;
      margin-right: 30px;
      width: 28px;
      height: 28px;
      margin-top: 29px;
      font-size: 0;
      background: url('../../../../assets/images/icon/icon_refresh_normal.png')
        no-repeat;
      background-size: cover;
      cursor: pointer;
      &:hover {
        width: 28px;
        height: 28px;
        background: url('../../../../assets/images/icon/icon_refresh_hover.png')
          no-repeat;
        background-size: cover;
      }
      &:focus {
        width: 28px;
        height: 28px;
        background: url('../../../../assets/images/icon/icon_refresh_hover.png')
          no-repeat;
        background-size: cover;
      }
    }
    & > .update-bg {
      background: url('../../../../assets/images/icon/icon_refresh_hover.png')
        no-repeat;
      background-size: cover;
      animation: update-btn .8s linear infinite;
      @keyframes update-btn {
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
  .loading-wrapper {
    padding-top: 30%;
    text-align: center;
    & > .loading {
      margin: 0 auto;
    }
    & > p {
      margin-top: 10px;
      color: #808080;
      font-size: 12px;
    }
  }
  & > .speed-up-setting-lists {
    width: 100%;
    height: 550px;
    overflow: hidden;
    &.overflow-auto {
      overflow: auto;
    }
    margin-bottom: 20px;
    background: linear-gradient(
      180deg,
      rgba(240, 243, 247, 1),
      rgba(255, 255, 255, 1)
    );
    box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.06);
    border-radius: 0 0 6px 6px;
  }
  .setting-list {
    width: 99%;
    // margin: 0 auto;
    height: 70px;
    line-height: 70px;
    border: 3px solid transparent;
    position: relative;
    transition: box-shadow 0.3s, border-color 0.3s;
    cursor: pointer;
    & > i {
      width: 12px;
      height: 12px;
      float: left;
      margin-top: 30px;
      margin-left: 30px;
      border-radius: 100%;
      background: rgba(158, 157, 159, 1);
      opacity: 0.2;
    }
    // 选中时 高亮
    .i-heightlight {
      background: rgba(6, 244, 32, 1);
      box-shadow: 0px 2px 8px 0px rgba(53, 255, 182, 1);
      opacity: 1;
    }
    &:hover {
      border: 3px solid #05a2ea;
      box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.5);
      border-radius: 5px;
      background-color: #fff;
      .line {
        background-color: transparent;
      }
      & + a {
        .line {
          background-color: transparent;
        }
      }
    }
    & > p {
      // display: inline-block;
      font-size: 16px;
      color: rgba(58, 56, 72, 1);
      padding-left: 60px;
      padding-right: 30px;
      & > em {
        float: right;
      }
    }
    &:focus {
      border: 3px solid #05a2ea;
      box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.5);
      border-radius: 5px;
      background-color: #fff;
      .line {
        background-color: transparent;
      }
      & + a {
        .line {
          background-color: transparent;
        }
      }
    }
  }
  .line {
    height: 1px;
    background-color: #E6E6E7;
    margin-left: 30px;
  }
}
</style>
