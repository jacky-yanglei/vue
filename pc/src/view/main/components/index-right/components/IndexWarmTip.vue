<template>
  <button class="index-warm-tip" @click="toggleRouteForBlur()" :disabled="isDisabled">
    <div class="warm-tip-btn">
      <i></i>
    </div>
    <div class="warm-tip-txt">
      <h3>{{ $t('i18n.WARM_TIP') }}：</h3>
      <p class="p">{{ txt }}</p>
    </div>
    <div :class="{'cover': isShowCover}"></div>
  </button>
</template>

<script>
export default {
  name: 'IndexWarmTip',
  data: function() {
    return {
      txt: `${this.$t('i18n.WARM_TIP_TXT')}`,
      isShowCover: false,
      isDisabled: false
    }
  },
  methods: {
    toggleRouteForBlur: function() {
      if (!this.isShowCover) {
        this.$router.push('/warm-tip')
      }
    },
    getRouteFn: function() {
      // 获取当前路由
      const pathStr = this.$route.path
      if (pathStr === '/') {
        // 不禁止button的focus效果
        this.isDisabled = false
      } else {
        // 禁止button的focus效果
        this.isDisabled = true
      }
    }
  },
  created() {
    this.$root.Bus.$on('busShowCover', data => {
      this.isShowCover = data
    })
  },
  watch: {
    $route: 'getRouteFn'
  },
  beforeDestroy() {
    this.$root.Bus.$off('busShowCover')
  }
}
</script>

<style lang="scss" scoped>
@mixin a-focus {
  // border: none;
  background: linear-gradient(
    0deg,
    rgba(57, 193, 255, 1),
    rgba(0, 159, 232, 1)
  );
  box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.5);
  .warm-tip-txt {
    border: none;
    border-top: 3px solid rgba(0, 159, 232, 1);
    border-bottom: 3px solid rgba(57, 193, 255, 1);
    top: 0px;
    left: 3px;
    bottom: 0px;
    right: 39px;
  }
  .warm-tip-btn {
    i {
      transition: border-left-color 0.4s;
      border-left-color: #fff;
    }
  }
}
.index-warm-tip {
  width: 100%;
  height: 128px;
  background: rgba(240, 243, 247, 1);
  box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  position: relative;
  cursor: pointer;
  transition: box-shadow 0.5s;
  text-align: left;
  .warm-tip-txt {
    position: absolute;
    background-color: #fff;
    border-radius: 6px 0 0 6px;
    border-top: 3px solid #fff;
    border-left: 3px solid #fff;
    border-bottom: 3px solid #fff;
    top: 0;
    bottom: 0px;
    right: 39px;
    & > h3 {
      font-size: 14px;
      color: #3a3848;
      line-height: 20px;
      letter-spacing: 0;
      padding: 20px 30px 10px 30px;
    }
    & > p {
      font-size: 14px;
      color: #75738b;
      height: 48px;
      line-height: 24px;
      letter-spacing: 0;
      padding: 0 30px;
      padding-top: 0px;
      position: relative;
      &.p {
        overflow: hidden;
        // text-overflow: ellipsis;
        // display: -webkit-box;
        // -webkit-box-orient: vertical;
        // -webkit-line-clamp: 2;
        &::after {
          content: '...';
          // font-weight: bold;
          position: absolute;
          bottom: -2px;
          right: 0;
          padding: 0 30px 1px 45px;
        }
      }
    }
  }
  .warm-tip-btn {
    width: 39px;
    height: 142px;
    float: right;
    border-radius: 0 6px 6px 0;
    position: relative;
    & > i {
      width: 0;
      height: 0;
      display: inline-block;
      border: 6px solid transparent;
      border-left: 8px solid rgba(131, 137, 161, 1);
      position: absolute;
      left: 40%;
      top: 41%;
      transition: border-left-color 0.4s;
    }
  }
  &:hover {
    @include a-focus;
  }
  &:focus {
    @include a-focus;
  }
  & > .cover {
    position: absolute;
    // border: 1px solid red;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border-radius: 6px;
    z-index: 99;
  }
}
@media screen and (max-width: 1366px) {
  .index-warm-tip {
    height: 100px;
    .warm-tip-btn {
      height: 100px;
      i {
        top: 46%;
      }
    }
    .warm-tip-txt {
      h3 {
        padding: 10px 30px 10px 30px;
      }
    }
  }
}
</style>
