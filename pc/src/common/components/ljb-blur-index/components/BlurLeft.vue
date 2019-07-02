<template>
  <div class="blur-left">
    <div class="speed-up-circle1">
      <div class="speed-up-circle2">
        <div class="speed-up-circle3">一键加速</div>
      </div>
      <div class="speed-up-running" ref="running"></div>
    </div>
    <div class="delay-lost">
      <div class="delay">
        <i></i>
        <h4>延迟</h4>
        <p><em>5</em>ms</p>
      </div>
      <div class="lost">
        <i class="lost-icon"></i>
        <h4>丢包</h4>
        <p><em>0</em>%</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlurLeft'
}
</script>

<style lang="scss" scoped>
.blur-left {
  width: 704px;
  height: 704px;
  float: left;
  background-color: #fff;
  border-radius: 6px;
  .speed-up-circle1 {
    width: 300px;
    height: 300px;
    border: 5px solid rgba(0, 159, 232, 0.7);
    border-radius: 1000px;
    margin: 0 auto;
    margin-top: 110px;
    position: relative;
  }
  .speed-up-circle2 {
    width: 232px;
    height: 232px;
    border-radius: 1000px;
    margin: 30px auto 0;
    padding-top: 1px;
    opacity: 0.7;
    background: linear-gradient(
      0deg,
      rgba(137, 216, 255, 0.7),
      rgba(0, 175, 255, 0.7)
    );
    filter: progid:DXImageTransform.Microsoft.gradient(
        startColorstr=rgba(137, 216, 255, 0.7),
        endColorstr=rgba(0, 175, 255, 0.7),
        GradientType=0
      );
  }
  .speed-up-circle3 {
    width: 192px;
    height: 192px;
    background-color: #fff;
    border-radius: 1000px;
    margin: 19px auto 20px;
    text-align: center;
    line-height: 192px;
  }
  .delay-lost {
    width: 324px;
    height: 150px;
    margin: 60px auto 0;
    transition: height 0.5s;
    overflow: hidden;
    & > div {
      width: 150px;
      height: 150px;
      background: linear-gradient(
        180deg,
        rgba(240, 243, 247, 1),
        rgba(255, 255, 255, 1)
      );
      border-radius: 6px;
    }
    & > .delay {
      float: left;
      position: relative;
    }
    & > .lost {
      margin-left: 174px;
      position: relative;
    }
    i {
      display: inline-block;
      width: 24px;
      height: 4px;
      background: rgba(6, 244, 32, 1);
      box-shadow: 0px 2px 8px 0px rgba(53, 255, 182, 1);
      border-radius: 0px 0px 100px 100px;
      position: absolute;
      left: 50%;
      margin-left: -12px;
    }
    .lost-icon {
      background: rgba(255, 34, 34, 1);
      box-shadow: 0px 2px 6px 0px rgba(255, 53, 53, 1);
      border-radius: 0px 0px 100px 100px;
    }
    h4 {
      font-size: 18px;
      color: rgba(131, 137, 161, 1);
      line-height: 25px;
      text-align: center;
      padding-top: 30px;
    }
    p {
      padding-top: 20px;
      text-align: center;
      font-size: 18px;
      color: rgba(141, 139, 142, 1);
      & > em {
        font-size: 40px;
        letter-spacing: 0;
        line-height: 48px;
        color: rgba(44, 42, 56, 1);
      }
    }
  }
}
</style>
