<template>
  <div href="javascript:;" class="vip-time-end">
    <div class="end-tip">{{ $t('i18n.TIP_RENEW') }}</div>
    <a href="javascript:;" class="speed-up-circle1" @click="buyVipTime()" v-focus="focusStatus">
      <div class="speed-up-circle2">
        <div class="speed-up-circle3">
          <h3>{{ $t('i18n.RENEW_NOW') }}</h3>
        </div>
      </div>
      <div class="speed-up-running" ref="running"></div>
    </a>
  </div>
</template>

<script>
export default {
  name: 'VipTimeEnd',
  data: function() {
    return {
      focusStatus: true
    }
  },
  methods: {
    buyVipTime: function() {
      window.open('http://www.qeeyou.cn/#/member/opening')
    }
  }
}
</script>

<style lang="scss" scoped>
.vip-time-end {
  width: 100%;
  height: 628px;
  float: left;
  background-color: #fff;
  border-radius: 6px;
  .end-tip {
    font-size: 14px;
    line-height: 50px;
    color: rgba(58, 56, 72, 1);
    width: 704px;
    height: 50px;
    background: linear-gradient(
      90deg,
      rgba(241, 68, 102, 0.1),
      rgba(241, 68, 102, 0)
    );
    border-radius: 6px 6px 0px 0px;
    position: absolute;
    // top: 0;
    text-align: center;
    color: rgba(241, 68, 102, 1);
  }
  .speed-up-circle1 {
    width: 260px;
    height: 260px;
    border: 5px solid rgba(241, 68, 102, 0.06);
    border-radius: 1000px;
    margin: 0 auto;
    margin-top: 184px;
    transition: box-shadow 0.3s, border-color 0.3s, margin-top 0.5s;
    cursor: pointer;
    position: relative;
    display: block;
    &:hover {
      box-shadow: 0px 4px 20px 0px rgba(241,68,102,0.5);
      border-color: rgba(241, 68, 102, 0.5);
    }
    &:focus {
      box-shadow: 0px 4px 20px 0px rgba(241,68,102,0.5);
      border-color: rgba(241, 68, 102, 0.5);
      .speed-up-circle2 {
        background: linear-gradient(
          0deg,
          rgba(255, 147, 147, 1),
          rgba(241, 68, 102, 1)
        );
      }
    }
  }
  .speed-up-circle2 {
    width: 200px;
    height: 200px;
    border-radius: 1000px;
    margin: 26px auto 0;
    padding-top: 1px;
    opacity: 0.7;
    background: linear-gradient(
      0deg,
      rgba(255, 147, 147, 0.7),
      rgba(241, 68, 102, 0.7)
    );
    // background-color: rgba(241, 68, 102, 1);
    filter: progid:DXImageTransform.Microsoft.gradient(
        startColorstr=rgba(255, 147, 147, 0.7),
        endColorstr=rgba(241, 68, 102, 0.7),
        GradientType=0
      );
    transition: background-color linear 0.5s;
    &:hover {
      background: linear-gradient(
        0deg,
        rgba(255, 147, 147, 1),
        rgba(241, 68, 102, 1)
      );
    }
  }
  .speed-up-circle3 {
    width: 168px;
    height: 168px;
    background-color: #fff;
    border-radius: 1000px;
    margin: 15px auto 16px;
    text-align: center;
    line-height: 192px;
    & > h3 {
      line-height: 25px;
      padding-top: 73px;
      color: rgba(58, 56, 72, 1);
      font-size: 18px;
    }
  }
}
@media screen and (max-width: 1366px) {
  .vip-time-end {
    position: relative;
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .end-tip {
      position: absolute;
      top: 0;
    }
    .speed-up-circle1 {
      margin-top: 0;
    }
  }
}
</style>
