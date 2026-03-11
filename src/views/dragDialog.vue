<template>
  <div>
    <div class="title1">elementUI弹窗拖曳放大功能</div>
    <div class="title2">详情：src\utils\directive\el-dragDialog\index.js和main.js</div>
    <div style="width: 100%; text-align: center;">
      <el-button @click="open()" type="primary">点击按钮弹出弹窗</el-button>
      <el-dialog v-el-drag-dialog title="拖曳+双击放大" :visible.sync="dialogVisible" width="40%">
        <h1>这是弹窗，点击取消按钮关闭弹窗</h1>
        <el-button @click="close()">取消</el-button>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false
    };
  },
  methods: {
   open(){
     this.dialogVisible = true
   },
   close(){
     this.dialogVisible = false
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