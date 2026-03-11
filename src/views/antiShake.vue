<template>
  <div>
    <div class="title1">防抖和节流</div>
    <div class="title2">（打开控制台，连续点击按钮查看console）</div>
    <div class="btn_item">
      <el-button class="item" type="primary" @click="btnDebounce('函数','防抖')">函数防抖</el-button>
      <el-button class="item" type="primary" @click="btnThrottle('函数','节流')">函数节流</el-button>
      <el-button class="item" type="primary" @click="btnDebounce2('函数2','防抖2')">函数防抖2</el-button>
      <el-button class="item" type="primary" @click="btn1">使用防抖插件</el-button>
      <el-button class="item" type="primary" @click="btn2">使用节流插件</el-button>
      <el-form :rules="rules" label-width="150px" size="small">
        <el-form-item label="姓名：" prop="name">
          <el-input v-model.trim="name" style="width: 250px"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import globalFunction from "@/utils/globalFunction.js";
// 使用防抖节流插件，需要运行命令：npm i --save lodash，如果已执行，请忽略
import _ from "lodash";
export default {
  name: "test",
  data() {
    return {
      name: '',
      rules:{
        name:[
          {
            required: true,
            validator: this.checkName,
            trigger: ["blur", "change"],
          },
        ]
      }
    };
  },
  methods: {
    // 箭头函数写法
    btnDebounce: globalFunction.debounce( (str1, str2)=> {
      console.log(str1, str2);
    }, 1000),

    btnThrottle: globalFunction.throttle(function (str1, str2) {
      console.log(str1, str2);
    }, 1000),

    btnDebounce2: globalFunction.debounce(function (str1, str2) {
      console.log(str1, str2);
    }, 1000),
    btn1: _.debounce(function () {
      console.log("这是插件一秒防抖功能");
    }, 1000),
    btn2: _.throttle(function () {
      console.log("这是插件一秒节流功能");
    }, 1000),
    checkName:_.throttle(function(rule, value, callback){
      if(!this.name) {
        callback(new Error("姓名不能为空"));
        return false;
      }
      let reg = /^[A-Z]*$/;
      if (!reg.test(this.name)) {
        callback(new Error("名称必须全为大写字母"));
        return;
      }
    },1000)
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