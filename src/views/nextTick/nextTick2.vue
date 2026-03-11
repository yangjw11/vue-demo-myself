<template>
  <div>
    <div class="title1">防抖和节流</div>
    <div class="title2">（连续点击按钮查看效果）</div>
    <div class="btn_item">
      <el-button class="item" type="primary" @click="btnDebounce('函数','防抖')">函数防抖</el-button>
      <el-button class="item" type="primary" @click="btnThrottle('函数','节流')">函数节流</el-button>
      <el-button class="item" type="primary" @click="btnDebounce2('函数2','防抖2')">函数防抖2</el-button>
    </div>
  </div>
</template>
<script>
import globalFunction from "@/utils/globalFunction.js";
export default {
  name: "test",
  methods: {
    btnDebounce: globalFunction.debounce(function (str1, str2) {
      console.log(str1, str2);
    }, 1000),

    btnThrottle: globalFunction.throttle(function (str1, str2) {
      console.log(str1, str2);
    }, 1000),

    btnDebounce2: globalFunction.debounce(function (str1, str2) {
      console.log(str1, str2);
    }, 1000),
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
.btn_item {
  display: flex;
  /* 让按钮区域自动换行 */
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 50px;
  width: 100%;
  text-align: center;
}
.btn_Item .item {
  margin-left: 10px;
  margin-top: 20px;
}
</style>