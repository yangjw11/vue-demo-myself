<template>
  <div>
    <div class="title1">这是page1</div>
    <div class="title2"></div>
    <div style="width: 100%; text-align: center;">
      <el-button @click="goPage2">点击按钮跳转到page2</el-button>
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
    goPage2(){
      this.$router.push({
				path: "/page2"
			});
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