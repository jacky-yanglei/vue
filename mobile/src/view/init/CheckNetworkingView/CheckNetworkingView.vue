<template>
    <div class="wrapper">
      <p v-if="state==0">{{ $t('i18n.CHECKING_THE_NETWORKING_MODE')}}...</p>
      <p v-if="state==1">
        {{ $t('i18n.NETWORKING_MODE_IS', {msg: tool}) }}
        <br>
        {{ $t('i18n.INITIALIZATION_SETTING_RUNNING') }}
        <br>
        ...
      </p>
      <p v-if="state==2">
        {{ $t('i18n.NO_USEFUL_NETWORKING_MODE',{msg: tool})}}
      </p>
      <div class="loading-block">
        <LoadingBall></LoadingBall>
      </div>
    </div>
</template>

<script>
import LoadingBall from '../../../common/components/loadings/loading-ball'
import { checkNetTypeApi, netBootprotoCheckApi } from '@/api/network-check-api.js'
export default {
  components: {
    LoadingBall
  },
  data() {
    return {
      state: 0,
      tool: ''
    }
  },
  created() {
    this.stateChange()
    let that = this // 用that 指代当前组件本身
    // 联网方式
    checkNetTypeApi().then(res => {
      if (res.ret === 0) {
        console.log('联网方式为:' + res.nettype)
        // 如果是有线就去检测是否为DHCP连接方式
        if (res.nettype === 'ethernet') {
          // 检测是否为DHCP连接方式 接口
          netBootprotoCheckApi().then(res => {
            if (res.ret === 0) {
              // console.log('互联网连接方式为:' + res.bootproto.toLocaleUpperCase())
              this.tool = res.bootproto.toLocaleUpperCase()
              if (this.tool === 'DHCP') {
                // 如果是DHCP 连接方式自动初始化
                this.state = 1
                setTimeout(function () {
                  that.$router.push('set-success')
                }, 2000)
              } else {
                // 如果不是DHCP 连接方式 就跳转到找不到网络连接的页面
                this.state = 2
                setTimeout(function () {
                  that.$router.push({name: 'NotFoundNetworking', params: {state: 0}})
                }, 2000)
              }
            } else {
              console.log(res.msg)
            }
          }).catch(data => {
            console.log(data)
          })
        } else {
          // 如果是无线就跳转到无线连接列表
          that.$router.push('/choice-wifi')
        }
      } else {
        console.log(res.msg)
      }
    }).catch(data => {
      console.log(data)
    })
  },
  methods: {
    stateChange() {
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../../common/scss/mixin';
  @import '../../../common/scss/utils';
  .wrapper{
    width: 100%;
    min-height: 100vh;
    background:linear-gradient(-180deg,rgba(238,239,242,1),rgba(216,218,225,1));
    text-align: center;
    padding-top: rem(100px);
    p{
      font-family: PingFangSC-Regular;
      font-size: rem(36px);
      color:#3A3848;
      line-height: rem(50px);
    }
    .loading-block{
      position: absolute;
      top: rem(517-141px);
      width: 100%;
    }
    .test-success{
      position: fixed;
      background-color: black;
      color: white;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%) translateY(-30px);
    }
    .test-failed{
      position: fixed;
      background-color: black;
      color: white;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>
