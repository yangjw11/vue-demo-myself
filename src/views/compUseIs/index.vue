<template>
  <div>
    <div class="title1">练习 组件标签内的 is 关键字</div>
    <div class="title2"></div>
    <div style="width: 100%; text-align: center;">
      <component :is="compName" />
      <el-button @click="changeCompName">改变组件</el-button>
    </div>
  </div>
</template>
<script>
import son from './son.vue';
import girl from './girl.vue'
export default {
  components: {
    son,
    girl
  },
  data() {
    return {
      compName: 'son',
      isMan: true
    };
  },
  methods: {
    changeCompName() {
      this.isMan = !this.isMan
      if (this.isMan) {
        this.compName = 'son'
      } else {
        this.compName = 'girl'
      }
    }
  },
};
</script>

<style>
.title1 {
  width: 100%;
  text-align: center;
  font-size: 32px;
  font-weight: 500;
  color: #ff0000;
}

.title2 {
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #000000;
}
</style>