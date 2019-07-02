<template>
  <transition name="fade">
    <div class="login-status">
      <div class="login-success" v-if="alreadyGetUserInfo">
        <i class="login-status-icon" v-if="alreadyGetUserInfo"></i>
        <p>{{ vipName }}</p>
      </div>
      <a href='javascript:;' class="login-btn" v-if="!isLogin && !isGetUserInfo" @click="memberLogin">
        {{ $t('i18n.LOGIN') }}
      </a>
    </div>
  </transition>
</template>

<script>
import { getUserDetailsApi } from '@/api/user-manger-api'
export default {
  name: 'LoginStatus',
  data: function() {
    return {
      vipName: '',
      isLogin: true, // 是否登录
      isGetUserInfo: true, // 是否在获取用户信息
      alreadyGetUserInfo: false // 是否已经获取到用户信息
    }
  },
  methods: {
    getLoginStatus: function() {
      // 获取用户的登录状态
      this.toggleLoginStatusView()
    },
    toggleLoginStatusView: function() {
      // 切换用户在不同登录状态下的视图
    },
    memberLogin() {
      this.$router.push('/member-login')
    },
    memberLoginOkFn: function() {
      getUserDetailsApi()
        .then(data => {
          this.isGetUserInfo = true
          this.isLogin = true
          this.alreadyGetUserInfo = true
          this.vipName = data.userName
          this.$emit('expirationTime', data.userExpire)
        })
        .catch(e => {
          let aa = setTimeout(() => {
            this.memberLoginOkFn()
            clearTimeout(aa)
          }, 500)
        })
    }
  },
  created() {
    this.$root.Bus.$on('memberLoginOut', () => { // 注销登录d
      this.vipName = ''
      this.isLogin = false
      this.isGetUserInfo = false
      this.alreadyGetUserInfo = false
      this.$root.Bus.$emit('busMgr128', false)
    })
    this.$root.Bus.$on('memberLoginSuccess', (res) => {
      this.isGetUserInfo = true
      this.isLogin = true
      this.alreadyGetUserInfo = true
      this.vipName = res.userName
      this.$emit('expirationTime', res.userExpire)
      this.$root.Bus.$emit('busMgr128', true)
    })
    this.$root.Bus.$on('memberLoginOkSuccess', () => {
      getUserDetailsApi()
        .then(data => {
          this.isGetUserInfo = true
          this.isLogin = true
          this.alreadyGetUserInfo = true
          this.vipName = data.userName
          this.$emit('expirationTime', data.userExpire)
        })
      this.$root.Bus.$emit('busMgr128', true)
    })
  },
  beforeDestroy() {
    this.$root.Bus.$off('memberLoginOut')
    this.$root.Bus.$off('memberLoginSuccess')
    this.$root.Bus.$off('memberLoginOkSuccess')
  }
}
</script>

<style lang="scss" scoped>
.login-status {
  height: 36px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  line-height: 36px;
  right: 96px;
  font-size: 14px;
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.5s;
  & > .login-success {
    float: left;
    & > .login-status-icon {
      float: left;
      width: 36px;
      height: 36px;
      border-radius: 100%;
      background-color: tomato;
      margin-right: 10px;
      background: url(../../../assets/images/icon/icon_default_avatar_normal.png)
        no-repeat;
      background-size: 100%;
    }
    & > p {
      display: inline-block;
      font-size: 14px;
    }
  }
  & > .login-btn {
    width: 80px;
    height: 36px;
    line-height: 32px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 6px 20px 0px rgba(0, 0, 0, 0.06);
    border-radius: 18px;
    text-align: center;
    font-size: 14px;
    color: rgba(58, 56, 72, 1);
    cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.3s, box-shadow 0.3s;
    &:focus, &:hover {
      border-color: #f0f3f7;
      box-shadow: 0px 6px 20px 0px rgba(0, 159, 232, 0.7);
      background-color: #1caff3;
      color: #fff;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
