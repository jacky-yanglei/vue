<template>
  <div id="ljb-main-speed-up">
    <div class="tips-position">
      <error-tips :msg="tips.msg" :show="tips.show"></error-tips>
    </div>
    <ul class="speed-up-nav">
      <a href="javascript:;" class="speed-up-list" @click="changeComponent(0)" :class="{'speed-up-list-cur': addClassChecked === 0}">
        {{ $t('i18n.SPEED_NODE') }}
        <i></i>
      </a>
      <a href="javascript:;" class="speed-up-list" @click="changeComponent(1)" :class="{'speed-up-list-cur': addClassChecked === 1}">
        {{ $t('i18n.SPEED_PATTERN') }}
        <i></i>
      </a>
    </ul>
    <a href="javascript:;" class="save-speed-btn" @click="clickSaveBtn()">{{ $t('i18n.SAVE_APPLY') }}</a>
    <transition name="fade" mode="out-in" enter>
      <!-- <keep-alive> -->
      <component :is="currentComponent"></component>
      <!-- </keep-alive> -->
    </transition>
  </div>
</template>

<script>
import SpeedPattern from '@/view/main/speed-up/speed-pattern/SpeedPattern'
import SpeedSetting from '@/view/main/speed-up/speed-setting/SpeedSetting'
import ErrorTips from '@/common/components/error-tips/error-tips'
import { accConfigSet, accConfigGet } from '@/api/speed-manage-api'

export default {
  name: 'SpeedUp',
  data: function() {
    return {
      componentsArr: ['speed-setting', 'speed-pattern'],
      currentComponent: 'speed-setting',
      addClassChecked: 0,
      objSpeedInfo: {},
      mode: '',
      tips: {
        msg: this.$t('i18n.MODIFY_SPEEDUP_SETTING_TIPS'),
        show: false
      },
      currentSelect: { // 记录用户当前选择的节点和模式
        mode: '0',
        nodeZone: this.$t('i18n.AUTO')
      },
      isCanSave: true // 避免用户多次触发保存按钮，调用set接口
    }
  },
  components: {
    SpeedPattern,
    SpeedSetting,
    ErrorTips
  },
  methods: {
    changeComponent: function(i) {
      this.currentComponent = this.componentsArr[i]
      this.addClassChecked = i
    },
    clickSaveBtn: function() {
      // 需要调用相关接口
      if (this.isCanSave) {
        let modeC = parseInt(this.currentSelect.mode)
        let modeS = parseInt(this.objSpeedInfo.mode)
        if (this.objSpeedInfo.nodeZone === '') {
          this.objSpeedInfo.nodeZone = this.$t('i18n.AUTO')
        }
        if (this.currentSelect.nodeZone === '') {
          this.currentSelect.nodeZone = this.$t('i18n.AUTO')
        }
        let nameC = this.currentSelect.nodeZone
        let nameS = this.objSpeedInfo.nodeZone
        if (modeC !== modeS || nameC !== nameS) {
          this.apiAccConfigSetFn()
          this.isCanSave = false
        } else {
          this.tips.msg = this.$t('i18n.NOT_CHANGE_CONFIG')
          this.tips.show = true
          this.isCanSave = true
        }
      }
    },
    apiAccConfigSetFn: function() {
      accConfigSet(this.objSpeedInfo)
        .then(data => {
          // 返回成功，再调用重启加速的接口
          this.$root.Bus.$emit('busRestartSpeedUp')
          this.$router.push('/')
          this.$root.Bus.$emit('busSaveSpeedStatus', true)
          let aa = setTimeout(() => {
            this.isCanSave = true
            clearTimeout(aa)
          }, 200)
        })
        .catch(e => {
          this.$root.Bus.$emit('busSaveSpeedStatus', false)
          let aa = setTimeout(() => {
            this.isCanSave = true
            clearTimeout(aa)
          }, 200)
        })
    },
    getNodeInfoFn: function(data) {
      this.objSpeedInfo.nodeId = data.nid
      this.objSpeedInfo.nodeZone = data.servername
    },
    getPatternInfoFn: function(data) {
      this.objSpeedInfo.mode = data.index
    },
    apiInitAccConfigGetFn: function() {
      // 获取加速配置
      accConfigGet()
        .then(data => {
          if (data.nodeId === '') {
            data.nodeId = '0'
          }
          if (data.mode === '') {
            data.mode = '0'
          }
          this.objSpeedInfo.mode = data.mode
          this.objSpeedInfo.nodeId = data.nodeId
          this.objSpeedInfo.nodeZone = data.nodeZone
          this.objSpeedInfo.reconn = '1'
          this.currentSelect.nodeZone = data.nodeZone
          this.currentSelect.mode = data.mode
        })
        .catch(e => {
          let aa = setTimeout(() => {
            this.apiInitAccConfigGetFn()
            clearTimeout(aa)
          }, 5230)
        })
    }
  },
  created() {
    this.$root.Bus.$on('busNodeInfo', data => {
      // 从组件speed-setting获取节点信息
      this.getNodeInfoFn(data)
      this.tips.show = true
    })
    this.$root.Bus.$on('busPatternInfo', data => {
      // 从组件speed-pattern获取模式信息
      this.getPatternInfoFn(data)
      this.tips.show = true
    })
    this.apiInitAccConfigGetFn()
  },
  beforeDestroy() {
    this.$root.Bus.$off('busPatternInfo')
    this.$root.Bus.$off('busNodeInfo')
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_mixin.scss';
@mixin speed-up-list-checked {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.5);
  border-radius: 5px;
  color: #3A3848;
  border: 3px solid #05a2ea;
  transition: box-shadow 0.3s, border-color 0.3s;
  cursor: pointer;
  i {
    @include i-heightlight;
  }
}
@mixin i-heightlight {
  width: 0;
  height: 0;
  display: inline-block;
  border: 6px solid transparent;
  border-left: 8px solid rgba(0, 159, 232, 1);
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 12px;
}
@mixin component-center {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}
#ljb-main-speed-up {
  width: 800px;
  height: 626px;
  position: absolute;
  top: 0;
  @include component-center;
  & > .tips-position {
    position: absolute;
    width: 240px;
    left: 240px;
    top: -10px;
  }
  & > .speed-up-nav {
    float: left;
    width: 220px;
    height: 200px;
    background: linear-gradient(
      180deg,
      rgba(240, 243, 247, 1),
      rgba(255, 255, 255, 1)
    );
    box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.06);
    border-radius: 6px;
    box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.06);
    & > .speed-up-list {
      width: 220px;
      height: 70px;
      border-radius: 2px;
      border: 3px solid transparent;
      line-height: 60px;
      color: #8389A1;
      font-size: 16px;
      padding: 0 30px;
      position: relative;
      &:hover {
        @include speed-up-list-checked;
      }
      &:focus {
        @include speed-up-list-checked;
      }
    }
    & > .speed-up-list-cur {
      @include speed-up-list-checked;
    }
    // 选中时的效果
    & > .speed-up-list-checked {
      i {
        @include i-heightlight;
      }
    }
  }
  & > .save-speed-btn {
    @include startBtn-primaryHover;
    width: 220px;
    height: 56px;
    line-height: 56px;
    position: absolute;
    left: 0;
    margin-top: 240px;
  }
}
</style>
