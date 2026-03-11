<template>
  <div>
    <div class="title1">子组件</div>
    <el-button @click="changeFather()">子组件的按钮</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
     
    };
  },
  methods: {
    changeFather(){
      console.log('点击了子组件的按钮')
      let name = 'lisi'
      this.$emit('changData', name)
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