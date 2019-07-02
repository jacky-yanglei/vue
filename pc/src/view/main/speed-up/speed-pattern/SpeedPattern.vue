<template>
  <div id="speed-up-pattern">
    <div class="speed-up-pattern-title">
      {{ $t('i18n.SPEED_PATTERN') }}
      <i class="update-btn" :class="{'update-bg': addClassUpdateBg}" ref="UpdateBtn" @click="clickUpdateBtn()">1</i>
      </div>
    <ul class="speed-up-pattern-lists">
      <a href="javascript:;" class="pattern-list" @click="clickSpeedPattern(key, item)" v-for="(item, key) in patternInfo" :key="key">
        <i :class="{'i-heightlight': newKey === key ? true : false}"></i>
        <div class="line" v-if="key !== 0"></div>
        <p>{{item.patternname}}</p>
      </a>
    </ul>
  </div>
</template>

<script>
import { accConfigGet } from '@/api/speed-manage-api'
export default {
  name: 'SpeedPattern',
  data: function() {
    return {
      newKey: null,
      patternInfo: [
        { patternname: this.$t('i18n.AUTO'), index: 0 },
        { patternname: this.$t('i18n.PATTERN_MODE_ONE'), index: 1 },
        { patternname: this.$t('i18n.PATTERN_MODE_TWO'), index: 2 },
        { patternname: this.$t('i18n.PATTERN_MODE_THREE'), index: 3 },
        { patternname: this.$t('i18n.PATTERN_MODE_FOUR'), index: 4 }
      ],
      start: 0,
      addClassUpdateBg: false,
      isUpdte: false
    }
  },
  methods: {
    clickSpeedPattern: function(key, item) {
      this.newKey = key
      // 传递patternInfo给this.savePatternInfo()方法
      this.savePatternInfoFn(item)
    },
    savePatternInfoFn: function(data) {
      this.$root.Bus.$emit('busPatternInfo', data)
    },
    clickUpdateBtn: function() {
      this.isUpdte = !this.isUpdte
      if (this.isUpdte) {
        window.requestAnimationFrame(this.updateRunning)
      }
    },
    updateRunning: function() {
      let stop
      this.start = this.start + 5.5
      if (this.$refs.UpdateBtn) {
        this.$refs.UpdateBtn.style.transform = `rotate(${this.start}deg)`
        stop = window.requestAnimationFrame(this.updateRunning)

        // 调用刷新的相关接口的方法

        // 添加update-bg类名
        this.addClassUpdateBgFn(1)

        if (this.start > 1000 || this.isUpdte === false) {
          // 判断在怎样的情况下停止加速？ 加速成功，加速失败；
          window.cancelAnimationFrame(stop)
          this.start = 0
          this.isUpdte = false
          // 取消updaate-bg类名
          this.addClassUpdateBgFn(0)
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
    apiGetConfigFn: function() {
      accConfigGet()
        .then(data => {
          let mode = data.mode
          if (mode === '') {
            mode = 0
          }
          this.newKey = parseInt(mode)
        })
    }
  },
  created() {
    this.apiGetConfigFn()
  }
}
</script>

<style lang="scss" scoped>
#speed-up-pattern {
  margin-left: 240px;
  width: 560px;
  height: 626px;
  background-color: #fff;
  border-radius: 6px;
  overflow: auto;
  box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.06);
  & > .speed-up-pattern-title {
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
      background: url('../../../../assets/images/icon/icon_refresh_normal.png') no-repeat;
      background-size: cover;
      cursor: pointer;
      &:hover {
        width: 28px;
        height: 28px;
        background: url('../../../../assets/images/icon/icon_refresh_hover.png') no-repeat;
        background-size: cover;
      }
    }
    & > .update-bg {
      background: url('../../../../assets/images/icon/icon_refresh_hover.png') no-repeat;
      background-size: cover;
    }
  }
  & > .speed-up-pattern-lists {
    width: 100%;
    min-height: 550px;
    background: linear-gradient(
      180deg,
      rgba(240, 243, 247, 1),
      rgba(255, 255, 255, 1)
    );
    box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.06);
    border-radius: 0 0 6px 6px;
  }
  .pattern-list {
    height: 70px;
    line-height: 70px;
    border: 3px solid transparent;
    position: relative;
    cursor: pointer;
    transition: box-shadow 0.3s, border-color 0.3s;
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
