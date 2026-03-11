<template>
  <div>
    <div class="title1">正则表达式</div>
    <div class="title2">正则表达式demo</div>
    <div style="width: 50%; text-align: center;margin-left: 500px;margin-top: 20px;">
      <el-form label-width="100px" label-position="left">
        <el-form-item label="请输入内容">
          <el-input v-model="info"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="checkPhone()">正则校验（点击校验手机号码是否正确）</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      info: "",
    };
  },
  methods: {
    // this.$message.warning('禁⽌输⼊⼩数以及负数');
    checkPhone() {
      var pattern = /0?(13|14|15|17|18|19)[0-9]{9}/;
      if (pattern.test(this.info)) {
        this.$message.success('手机号码格式正确');
      } else {
        this.$message.warning('请输入正确的手机号码');
      }
    },
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