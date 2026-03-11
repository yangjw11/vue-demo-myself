<template>
  <div class="fdj" @mousemove="mousemove">
    <div class="small" ref="small">
      <img :src="girlUrl" alt="" />
      <div v-show="showMask" class="mask" :style="{ 'left': left + 'px', 'top': top + 'px', }" ref="mask"></div>
    </div>
    <div class="big" ref="big">
      <img ref="bigimg" :src="girlUrl" alt=""
        :style="{ 'left': imgX + 'px', 'top': imgY + 'px', }" />
    </div>
  </div>
</template>
 
<script>
export default {
  props:['girlUrl'],
  data() {
    return {
      top: '',
      left: '',
      imgX: '',
      imgY: '',
      showMask: false,
    }
  },
  methods: {
    mousemove(e) {
      let small = this.$refs.small
      let mask = this.$refs.mask
      let big = this.$refs.big
      let bigimg = this.$refs.bigimg

      // console.log('small.offsetLeft === ', small.offsetLeft)
      // console.log('small.offsetTop === ', small.offsetTop)
      // 第一步获取鼠标中点位置
      let maskX = e.pageX - small.offsetLeft
      let maskY = e.pageY - small.offsetTop
      
      // console.log('e.pageX === ', e.pageX)
      // console.log('e.pageY === ', e.pageY)
      // console.log('small.offsetWidth === ', small.offsetWidth)
      // console.log('small.offsetHeight === ', small.offsetHeight)
      // if (e.pageX > small.offsetWidth || e.pageY > small.offsetHeight) { 
      //   this.showMask = false
      //   return 
      // } 
      this.showMask = true
      // 让鼠标出现在mask的中心点 
      maskX = maskX - mask.offsetWidth / 2;
      maskY = maskY - mask.offsetHeight / 2;






      // 把mask限制到box中
      maskX = maskX < 0 ? 0 : maskX;
      maskY = maskY < 0 ? 0 : maskY;

      maskX = maskX > small.offsetWidth - mask.offsetWidth ? small.offsetWidth - mask.offsetWidth : maskX;
      maskY = maskY > small.offsetHeight - mask.offsetHeight ? small.offsetHeight - mask.offsetHeight : maskY;



      // console.log('e.pageX === ', e.pageX)
      // console.log('e.pageY === ', e.pageY)
      // console.log('maskx === ', maskX)
      // console.log('masky === ', maskY)
      //遮挡层的移动距离/大图的移动距离=遮挡层的最大移动距离/大图的最大移动距离
      //大图的移动距离=遮挡层的移动距离*大图的最大移动距离/遮挡层的最大移动距离

      // 注意：
      // 遮罩层的面积/盒子的面积 == 大图展示盒子的面积/大图图片的面积
      // 一定要是等比例的才行严格控制样式

      let bigImgX = maskX * (big.offsetWidth - bigimg.offsetWidth) / (small.offsetWidth - mask.offsetWidth);
      let bigImgY = maskY * (big.offsetHeight - bigimg.offsetHeight) / (small.offsetHeight - mask.offsetHeight)

      this.left = maskX
      this.top = maskY
      this.imgX = bigImgX
      this.imgY = bigImgY
    }
  }
}
</script>
 
<style>
/* 新建的项目  去一下默认样式 */
body,
html {
  padding: 0;
  margin: 0;
}
</style>
<style leng="less" scoped>
.fdj{
  display: flex;
}
.small {
  width: 400px;
  height: 400px;
  position: relative;
}

.small img {
  width: 100%;
  height: 100%;
}

.big {
  width: 400px;
  height: 400px;
  /* position: absolute; */
  bottom: 0;
  left: 410px;
  overflow: hidden;
}

.big img {
  position: absolute;
  width: 800px;
  height: 800px;
  left: 0;
  top: 0;
}

.mask {
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 0, 0.4);
  position: absolute;
  top: 0px;
  left: 0px;
  cursor: move;
}
</style>
 