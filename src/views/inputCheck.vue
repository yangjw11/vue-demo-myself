<template>
  <div>
    <div class="title1">一些常用的input框的校验</div>
    <div class="title2">有el-input和原生input</div>
    <div style="width: 100%; text-align: center;">
      <el-form style="width:600px" label-width="150px">
        <div
          style="color: blue"
        >限制 只能输入数字，数字大小，长度，小数点后位数以及字母e的限制,保留6位小数 最后oninpt中 +7 表示小数点后保留6位， 如果是 +n 则保留n-1位</div>
        <el-form-item label="校验1: ">
          <!-- el-input 限制 只能输入数字，数字大小，长度，小数点后位数以及字母e的限制,保留6位小数 最后oninpt中  +7   表示小数点后保留6位，  如果是  +n 则保留n-1位-->
          <el-input
            v-model="num1"
            placeholder="请输入数字,最多是100，小数最多6位"
            type="number"
            min="0"
            max="100"
            @keyup.native="proving($event)"
            @input="editInput($event,'num1')"
            oninput="if(value>100)value=100;if(value<0)value=0;if(isNaN(value)) { value = parseFloat(value) } if(value.indexOf('.')>0){value=value.slice(0,value.indexOf('.')+5)}"
          ></el-input>
        </el-form-item>
        <el-form-item label="校验2">
          <el-input-number
            :min="0"
            :max="1"
            :step="0.0001"
            v-model="num2"
            :precision="4"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="校验3">
          <el-input
            placeholder="请输入手机号"
            @input="limitPhoneNum"
            type="number"
            v-model="num3"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="校验4">
          <el-input
            placeholder="请输入"
            maxlength="4"
            oninput="if(value.length > 6) value=value.slice(0, 6)"
            type="number"
            v-model="num4"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-button type="primary" @click="print()">校验</el-button>
      </el-form>
      <div style="margin-top: 20px">分割线 ==============================================</div>
      <el-form
        style="width:600px"
        label-width="300px"
        :model="formData"
        ref="adminForm"
        :rules="rules"
      >
        <el-form-item label="姓名：" prop="name">
          <el-input v-model.trim="formData.name" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="年龄：" prop="age">
          <el-input v-model.trim="formData.age" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone">
          <el-input v-model.trim="formData.phone" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="断言：" prop="path">
          <el-input
            v-model.trim="formData.path"
            @keydown.native="keydown($event)"
            style="width: 250px"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="checkForm()">校验</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      num1: "",
      num2: "",
      num3: "",
      num4: "",
      formData: {
        name: "张三",
        age: 18,
        phone: 15368959189,
        path: "/a/**",
      },
      rules: {
        name: [
          {
            required: true,
            message: "姓名不能为空",
            trigger: ["blur", "change"],
          },
        ],
        age: [
          {
            required: true,
            message: "年龄不能为空",
            trigger: ["blur", "change"],
          },
        ],
        phone: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: ["blur", "change"],
          },
        ],
        path: [
          {
            required: true,
            validator: this.checkSyspath,
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  methods: {
    proving(e) {
      var val = e.target.value;
      //限制只能输入一个小数点
      if (val.indexOf(".") != -1) {
        var str = val.substr(val.indexOf(".") + 1);
        if (str.indexOf(".") != -1) {
          val = val.substr(0, val.indexOf(".") + str.indexOf(".") + 1);
        }
      }
      e.target.value = val.replace(/[^\d^\.]+/g, "");
    },
    editInput(value, name) {
      // console.log('value===', value)
      name =
        ("" + value) // 第一步：转成字符串
          .replace(/[^\d^\.]+/g, "") // 第二步：把不是数字，不是小数点的过滤掉
          .replace(/^0+(\d)/, "$1") // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
          .replace(/^\./, "0.") // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
          .match(/^\d*(\.?\d{0,1})/g)[0] || ""; // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到2位小数
    },
    // 校验3的方法
    limitPhoneNum(value) {
      if (value.toString().length > 11) {
        this.num3 = this.num3.toString().slice(0, 11);
      }
    },
    print() {
      console.log("this.num1===", this.num1);
      console.log("this.num2===", this.num2);
    },
    // 校验下面的输入框
    checkForm() {
      this.$refs.adminForm.validate((valid) => {
        if (valid) {
          this.$message({
            message: "校验通过",
            type: "success",
          });
        } else {
          this.$message({
            message: "校验未通过",
            type: "error",
          });
          return false;
        }
      });
    },
    // 校验path
    checkSyspath(rule, value, callback) {
      if (!this.formData.path) {
        callback(new Error("path不能为空"));
        return false;
      }
      let str = this.formData.path;
      let str1 = str.substring(0, 1);
      let str2 = str.substring(str.length - 3, str.length);
      debugger;
      if (str1 != "/" || str2 != "/**") {
        debugger;
        callback(new Error("断言必须/开头，/**结尾"));
        return;
      }
      callback();
    },
    // 禁止输入空格
    keydown(e) {
      if (e.keyCode == 32) {
        e.returnValue = false;
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
