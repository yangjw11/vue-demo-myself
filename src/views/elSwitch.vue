<template>
  <div>
    <div class="title1">elementUI 中的switch使用demo</div>
    <div class="title2"></div>
    <div style="width: 100%; text-align: center;">
      <el-switch @change="changePassWord" v-model="passWord" active-color="#2877FF" inactive-color="#cccccc"></el-switch>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      passWord: '1'
    };
  },
  methods: {
    changePassWord () {
      console.log('this.passWord', this.passWord)
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