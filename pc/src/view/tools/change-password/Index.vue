<template>
  <div class="change-password-view">
    <error-tips :msg="tips.msg" :show="tips.show"></error-tips>
    <div class="container">
      <h5 class="title">{{ $t('i18n.CHANGE_ADMIN_PASSWORD') }}</h5>
      <div class="wrapper">
        <label>
          <input type="password" :placeholder="$t('i18n.NEW_PASSWORD')" :class="{'error': !pass.vaildTrue}" @blur="passwordChange()" @focus="inputFocus('psw')" @keyup.enter="changePass()" v-model="pass.value">
          <div class="input-error" v-if="!pass.vaildTrue">{{ $t('i18n.PASSWORD_RULE') }}</div>
        </label>
        <label>
          <input type="password" :placeholder="$t('i18n.CONFIRM_NEW_PASSWORD')" :class="{'error': !confirmPass.vaildTrue}" @blur="confirmPswChange()" @focus="inputFocus('confirm')" @keyup.enter="changePass()" v-model="confirmPass.value">
          <div class="input-error" v-if="!confirmPass.vaildTrue">{{ $t('i18n.PASSWORDMISMATCH') }}</div>
        </label>
        <primary-button class="button" :text="text" @btnClicked="changePass()" :disabled="changing" :loading="changing">
        </primary-button>
        <p class="dis">{{ $t('i18n.ADMIN_LOGIN_TIPS_A') }}</p>
      </div>
    </div>
    <fade-tips :msg="fadeTips.msg" :show="fadeTips.show" :type="fadeTips.type" @hide="fadeTips.show = false"></fade-tips>
  </div>
</template>

<script>
import { PrimaryButton } from '../../../common/components/buttons/index'
import FadeTips from '@/common/components/fade-tips/FadeTips'
import ErrorTips from '@/common/components/error-tips/error-tips'

import regular from '../../../common/service/regular'
import { changePassword } from '../../../api/system-manage-api'
import { netWlanSet } from '../../../api/network-check-api'

export default {
  name: 'ChangePassword',
  data() {
    return {
      msg: '',
      pass: {
        value: '',
        vaildTrue: true
      },
      confirmPass: {
        value: '',
        vaildTrue: true
      },
      changing: false,
      text: this.$t('i18n.SAVE_EFFECT'),
      tips: {
        msg: this.$t('i18n.PASSWORD_RULE'),
        show: true
      },
      fadeTips: {
        msg: '',
        show: false,
        type: 'tip'
      }
    }
  },
  components: {
    PrimaryButton,
    FadeTips,
    ErrorTips
  },
  methods: {
    passwordChange() {
      this.pass.vaildTrue = regular.password(this.pass.value, 8, 32)
    },
    confirmPswChange() {
      this.confirmPass.vaildTrue = regular.confirmPassword(
        this.pass.value,
        this.confirmPass.value
      )
    },
    inputFocus(type) {
      if (type === 'psw') {
        this.pass.vaildTrue = true
      } else if (type === 'confirm') {
        this.confirmPass.vaildTrue = true
      }
    },
    changePass() {
      this.passwordChange()
      this.confirmPswChange()
      if (this.pass.vaildTrue && this.confirmPass.vaildTrue) {
        this.changing = true
        this.$root.Bus.$emit('maskClick', false)
        changePassword({
          password1: this.pass.value,
          password2: this.confirmPass.value
        })
          .then(res => {
            if (res) {
              netWlanSet({
                password: this.pass.value
              }).then(res => {
                this.changing = false
                this.$root.Bus.$emit('maskClick', true)
                this.$router.push('/login')
              }).catch(e => {
                this.fadeTips.msg = this.$t('i18n.CHEANGE_WIFI_PSD_FAILED')
                this.fadeTips.type = 'error'
                this.fadeTips.show = true
                this.changing = false
                this.$root.Bus.$emit('maskClick', true)
              })
            }
          })
          .catch(e => {
            switch (e) {
              case -1:
                this.fadeTips.msg = this.$t('i18n.PASSWORD_CANNOT_BE_EMPTY')
                break
              case -2:
                this.fadeTips.msg = this.$t('i18n.PSD_WRITE_NO_COMMON')
                break
              case -3:
                this.fadeTips.msg = this.$t('i18n.PSD_LONG_FAILED')
                break
              case -4:
                this.fadeTips.msg = this.$t('i18n.SETTING_ADMIN_PSD_FAILED')
                break
              default:
                this.fadeTips.msg = e
            }
            this.fadeTips.type = 'tip'
            this.fadeTips.show = true
            this.changing = false
            this.$root.Bus.$emit('maskClick', true)
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../common/sass/_mixin';
@import '../../../common/sass/_constant';

.change-password-view {
  position: relative;
  width: 600px;
  margin: 0 auto;
  .container {
    width: 100%;
    border-radius: $startContentRaduis;
    background: linear-gradient(
      180deg,
      rgba(240, 243, 247, 1),
      rgba(255, 255, 255, 1)
    );
    box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.15);
    .title {
      width: 100%;
      height: 76px;
      text-align: center;
      background: rgba(255, 255, 255, 1);
      border-radius: 6px 6px 0px 0px;
      line-height: 76px;
      font-size: 20px;
      color: rgba(58, 56, 72, 1);
      font-weight: bold;
    }
    .wrapper {
      padding: 60px;
      display: flex;
      flex-direction: column;
      label {
        position: relative;
        width: 100%;
        height: 52px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        line-height: 50px;
        color: rgba(58, 56, 72, 1);
        font-size: 16px;
        @include inputWarnTip;
        margin-bottom: 20px;
      }
      .button {
        margin-bottom: 30px;
      }
      .dis {
        text-align: center;
        font-size: 14px;
        color: rgba(179, 179, 179, 1);
      }
    }
  }
}
</style>
