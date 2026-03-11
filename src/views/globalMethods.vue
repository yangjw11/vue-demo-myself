<template>
  <div>
    <div class="title1">公共方法实现表单输入框的校验</div>
    <div class="title2">（方法封装在main.js中）</div>
    <div>
      <el-input
        @keyup.native="checkOut($event)"
        type="number"
        min="0"
        v-model="input"
        placeholder="请输入内容"
      ></el-input>
      <input type="number" :min="0" onkeyup="value=value.replace(/[^\d.]/g,'')" placeholder="市场价" />
      <el-button type="primary" v-debounce:[3000]="$globalClick2">点击这里查看效果</el-button>
      <el-button type="primary" v-debounce:[1000]="print111()">点击这里查看公共防抖</el-button>
      <!-- 下面这个方法没有生效 -->
      <el-button type="primary" @click="print()">看看JS全局方法的防抖</el-button>
    </div>
  </div>
</template>
<script>
import { debounce } from "@/utils/antiShake.js";
export default {
  data() {
    return {
      input: "",
    };
  },
  methods: {
    print1() {
      console.log("111");
    },
    print111:()=> {
      console.log("输出防抖函数");
    },
    // 下面的print方法还没有实现防抖功能
    // print:this.$debounce(function(){
    //   console.log('fangdou')
    // },1000),
    print: debounce(function () {
      console.log("fangdou");
    }, 1000),
    // 校验输入框
    checkOut(e) {
      this.$checkElInput(e);
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