<template>
  <div class="blur-right">
    <div class="speed-up-info">
      <div class="speed-up-info-txt">
        <div v-for="(item,key) in infoTxt" :key="key" class="info-txt">
          <h2>{{item.h2}}</h2>
          <span>{{item.span}}</span>
        </div>
      </div>
      <div class="speed-up-info-img"></div>
    </div>
    <div class="host-device">
      <div class="host-device-title">主机设备（3）</div>
      <ul class="host-device-lists">
        <li class="device-list">
          <i></i>
          <span class="device-list-name">
            DESKTOP-9NPFECV
          </span>
        </li>
        <li class="device-list">
          <i></i>
          <span class="device-list-name">
            DESKTOP-9NPFECV
          </span>
        </li>
        <li class="device-list">
          <i></i>
          <span class="device-list-name">
            DESKTOP-9NPFECV
          </span>
        </li>
      </ul>
    </div>
    <div class="warm-tip">
      <div class="warm-tip-btn">
        <i></i>
      </div>
      <div class="warm-tip-txt">
        <h3>温馨提示：</h3>
        <p>《怪物猎人世界》组野队建议使用P2P节点，和国内好友联机建议使用...</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlurRight',
  data: function () {
    return {
      infoTxt: [
        { h2: 'P2P', span: '加速分区' },
        { h2: '自动', span: '加速模式' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.blur-right {
  margin-left: 724px;
  width: 496px;
  height: 704px;
  .speed-up-info {
    width: 100%;
    height: 192px;
    background-color: #fff;
    border-radius: 6px;
    margin-bottom: 20px;
    border: 3px solid transparent;
    .info-txt {
      width: 72px;
      text-align: center;
      padding-top: 56px;
      margin-left: 60px;
      float: left;
      & > h2 {
        font-size: 36px;
        color: rgba(58, 56, 72, 1);
        letter-spacing: 0px;
        line-height: 50px;
        transition: color 0.4s;
      }
      & > span {
        font-size: 16px;
        color: rgba(158, 157, 159, 1);
        letter-spacing: 0px;
        line-height: 22px;
        transition: color 0.4s;
      }
    }
    .info-txt:nth-of-type(2) {
      margin-left: 50px;
    }
    .speed-up-info-img {
      width: 162px;
      height: 100px;
      background: url(../../../../assets/images/icon/img_bar_chart_normal.png)
        no-repeat;
      background-size: 100% 100%;
      float: right;
      margin-right: 30px;
      margin-top: 46px;
    }
  }
  .host-device {
    width: 100%;
    height: 330px;
    background-color: #fff;
    border-radius: 6px;
    margin-bottom: 20px;
    .host-device-title {
      height: 62px;
      font-size: 16px;
      letter-spacing: 0px;
      line-height: 62px;
      padding-left: 24px;
      border-radius: 6px 6px 0px 0px;
    }
    .host-device-lists {
      height: 268px;
      background: linear-gradient(
        180deg,
        rgba(240, 243, 247, 1),
        rgba(255, 255, 255, 1)
      );
      border-radius: 0px 0px 6px 6px;
    }
    .device-list {
      height: 76px;
      line-height: 76px;
      padding-left: 25px;
      box-sizing: border-box;
      border: 3px solid transparent;
      cursor: pointer;
      transition: box-shadow 0.5s, border 0.3s;
      & > i {
        width: 24px;
        height: 24px;
        display: inline-block;
        background-color: #fff;
        position: relative;
        top: 7px;
      }
      &:nth-of-type(1) {
        i {
          background: url(../../../../assets/images/icon/icon_PS4_normal.png) no-repeat;
          background-size: 100% 100%;
        }
      }
      &:nth-of-type(2) {
        i {
          background: url(../../../../assets/images/icon/icon_XBOX_normal.png) no-repeat;
          background-size: 100% 100%;
        }
      }
      &:nth-of-type(3) {
        i {
          background: url(../../../../assets/images/icon/icon_NS_normal.png) no-repeat;
          background-size: 100% 100%;
        }
      }
      & > span {
        margin-left: 19px;
      }
    }
  }
  .warm-tip {
    width: 100%;
    height: 142px;
    background:rgba(240,243,247,1);
    box-shadow: 0px 20px 60px 0px rgba(0,0,0,0.06);
    border-radius: 6px;
    position: relative;
    cursor: pointer;
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
        font-size: 16px;
        color: rgba(58, 56, 72, 1);
        line-height: 22px;
        letter-spacing: 0;
        padding: 20px 24px;
      }
      & > p {
        font-size: 14px;
        color: rgba(58, 56, 72, 1);
        line-height: 20px;
        letter-spacing: 0;
        padding: 20px 24px;
        padding-top: 0px;
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
        top: 45%;
        transition: border-left-color 0.4s;
      }
    }
  }
}
</style>
