<template>
  <div class="blur-tools">
    <i class="icon-logo"></i>
    <div class="login-status">
      <i class="login-status-icon"></i>
      <p>738441903@qq.com</p>
    </div>
    <div class="tools-btn">
      <span>工具箱<i></i></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlurTools'
}
</script>

<style lang="scss" scoped>
.blur-tools {
  position: absolute;
  width: 1220px;
  margin-top: -3%;
  .icon-logo {
    width: 45px;
    height: 39px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 20px;
    background: url(../../../../assets/images/icon/icon_logo.png) no-repeat;
    background-size: 100% 100%;
  }
  .login-status {
    height: 36px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    line-height: 36px;
    right: 75px;
    cursor: pointer;
    opacity: 1;
    transition: opacity 0.5s;
    // border: 1px solid red;
    .login-status-icon {
        float: left;
        width:36px;
        height: 36px;
        border-radius: 100%;
        background-color: tomato;
        margin-right: 10px;
        background: url(../../../../assets/images/icon/icon_default_avatar_normal.png) no-repeat;
        background-size: 100%;
    }
    p {
        float: left;
    }
  }
  .tools-btn {
    width: 36px;
    height: 36px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 20px;
    border-radius: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 6px 20px 0px rgba(0, 0, 0, 0.06);
    background: url(../../../../assets/images/icon/icon_toolbox_normal.png) no-repeat;
    background-size: 100%;
    cursor: pointer;
    transition: box-shadow 0.3s, opacity 0.8s;
    opacity: 1;
    & > span {
      display: inline-block;
      border-radius: 2px;
      background-color: #fff;
      position: absolute;
      white-space: nowrap;
      padding: 2px 4px 3px 3px;
      top: -28px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 12px;
      opacity: 0;
      & > i {
        position: absolute;
        height: 0;
        width: 0;
        border: 4px solid transparent;
        border-top: 5px solid #ffffff;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
</style>
