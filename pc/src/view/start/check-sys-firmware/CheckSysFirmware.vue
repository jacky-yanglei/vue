<template>
  <div class="check-sys-firmware start-pd">
    <div class="network-check-view">
      <error-tips :msg="msg" :show="show"></error-tips>
      <p class="title">{{ $t('i18n.CHECK_NEW_SYS') }}</p>
      <diffusion-circle></diffusion-circle>
      <div class="sys-check-failed" :class="{'failed': isCheckSysFailed}">
        <button class="restart" @click="clickRestartCheckFn()">
          {{$t('i18n.RETESTING')}}
        </button>
        <button class="go-index" @click="toIndexFn()">
          {{$t('i18n.GO_INDEX')}}
        </button>
      </div>
    </div>
    <div class="blur-img">
      <oval></oval>
    </div>
  </div>
</template>

<script>
import DiffusionCircle from '@/common/components/diffusion-circle/diffusion-circle'
import ErrorTips from '@/common/components/error-tips/error-tips'
import Oval from '@/common/components/oval/oval'
import { sysFirmwareInfo, sysFirmwareCheck } from '@/api/system-manage-api'
import { compareVersion } from '@/common/service/utils'

export default {
  name: 'CheckSysFirmware',
  data() {
    return {
      status: 0, // 状态 0表示检测中， 1检测DHCP中， 2表示未找到DHCP
      show: false,
      msg: this.$t('i18n.SYS_CHECK_FAILED'),
      currentVer: null,
      newVer: null,
      isCheckSysFailed: false // 是否版本检查失败
    }
  },
  components: {
    DiffusionCircle,
    ErrorTips,
    Oval
  },
  methods: {
    getVersionInfoFn: function() {
      sysFirmwareInfo()
        .then(data => {
          // 获取当前版本
          this.currentVer = data.version
          this.isCheckSysFailed = false
          this.show = false
        })
        .then(() => {
          sysFirmwareCheck()
            .then(data => {
              // 获取最新版本
              this.newVer = data.version
              this.compareVersionFn()
              this.isCheckSysFailed = false
              this.show = false
            })
            .catch((e) => {
              let aa = setTimeout(() => {
                this.isCheckSysFailed = true
                this.show = true
                clearTimeout(aa)
              }, 4000)
            })
        })
        .catch((e) => {
          let aa = setTimeout(() => {
            this.isCheckSysFailed = true
            this.show = true
            clearTimeout(aa)
          }, 4000)
        })
    },
    compareVersionFn: function() {
      let result = compareVersion(this.currentVer, this.newVer)
      // 调用比较版本大小的方法，根据返回值决定页面跳转
      if (result) {
        // 需要版本更新
        this.$router.push({name: 'CheckSysFailed', params: {currentVer: this.currentVer}})
      } else {
        // 不需要版本更新
        this.$router.push({name: 'CheckSysSuccess', params: {currentVer: this.currentVer}})
      }
    },
    clickRestartCheckFn: function() {
      this.getVersionInfoFn()
    },
    toIndexFn: function() {
      this.$router.push('/')
    }
  },
  created() {
    this.getVersionInfoFn()
    this.$root.Bus.$emit('HiddenAppLoading')
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_constant.scss';
@import '../../../common/sass/_mixin.scss';
.check-sys-firmware {
  .blur-img {
    width: 432px;
    margin: 20px auto 0;
    padding-top: 20px;
  }
}
.network-check-view {
  position: relative;
  width: $startContentWidth;
  margin: 0 auto;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 60px;
  border-radius: $startContentRaduis;
  .title {
    font-size: 16px;
    color: rgba(58, 56, 72, 1);
    line-height: 22px;
    text-align: center;
    margin-top: 40px;
    margin-bottom: 62px;
  }
  & > .sys-check-failed {
    position: absolute;
    bottom: -80px;
    display: none;
    & > button {
      @include startBtn-primaryHover();
      width: 210px;
      &.go-index {
        background: white;
        color:rgba(58,56,72,1);
        margin-left: 7px;
        &:hover {
          &::after {
            border-color: #31BCFC;
          }
        }
        &:focus {
          &::after {
            border-color: #31BCFC;
          }
        }
      }
    }
    &.failed {
      display: block;
    }
  }
}
</style>
