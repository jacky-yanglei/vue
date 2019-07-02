<template>
  <div id="ljb-main-warm-tip" class="">
    <div class="warm-tip-title">{{ $t('i18n.WARM_TIP') }}</div>
    <div class="warm-tip-txt" id="warm-tip-txt">
      <div class="box-txt">
        <h3 style="font-weight: bold;">P2P节点更适合P2P类的游戏，例如：</h3>
        <p>使命召唤系列、荣耀战魂、看门狗2、FIFA系列、Warframe、幽灵行动荒野、街霸5、铁拳7、命运系列、NBA2K系列、怪物猎人世界、黑魂系列、血缘诅咒、仁王、孤岛惊魂系列、龙珠斗士z、消逝的光芒、刺客信条大革命、毁灭战士、美国末日、马里奥网球等等</p>
        <br>
        <h3 style="font-weight: bold;">日服节点适合玩儿日服，例如：</h3>
        <p>使命召唤系列日服、花园战争亚服、高达OL、龙珠超宇宙、龙珠斗士Z、高达破坏者等等</p>
        <br>
        <h3 style="font-weight: bold;">abc分区为通用型节点，适合游戏：</h3>
        <p>绝地求生、泰坦陨落、星球大战2、全境封锁、彩虹六号、坦克世界、光环5、战争机器4、极限竞速地平线3、极限竞速7、盗贼之海等等</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WarmTip',
  mounted() {
    this.$nextTick(() => {
      new this.$geminiScrollbar({
        element: document.getElementById('warm-tip-txt')
      }).create()
    })
  }
}
</script>

<style lang="scss" scoped>
@mixin component-center {
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
}
#ljb-main-warm-tip {
  width: 560px;
  height: 536px;
  overflow: auto;
  background: linear-gradient(
    180deg,
    rgba(240, 243, 247, 1),
    rgba(255, 255, 255, 1)
  );
  box-shadow: 0px 20px 60px 0px rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  @include component-center;
  & > .warm-tip-title {
    width: 100%;
    height: 76px;
    color: rgba(58, 56, 72, 1);
    font-size: 20px;
    font-weight: bold;
    line-height: 76px;
    text-align: center;
    background-color: #fff;
    border-radius: 6px 6px 0 0;
  }
  .warm-tip-txt {
    width: 560px;
    height: 460px;
  }
  .box-txt {
    padding: 30px 40px 60px!important;
    line-height: 25px;
    letter-spacing: 1px;
    & > h3 {
      margin-bottom: 10px;
    }
    & > p {
      color: #75738B;
      text-indent: 25px;
      line-height: 22px;
    }
  }
}
</style>
