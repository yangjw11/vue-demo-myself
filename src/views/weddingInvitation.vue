<template>
  <div class="all">
    <div class="left">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="邀请嘉宾" prop="guestName">
          <el-input v-model="ruleForm.guestName"></el-input>
        </el-form-item>
        <el-form-item label="新婚人一" prop="marriedPersonOne">
          <el-input v-model="ruleForm.marriedPersonOne"></el-input>
        </el-form-item>
        <el-form-item label="新婚人二" prop="marriedPersonTwo">
          <el-input v-model="ruleForm.marriedPersonTwo"></el-input>
        </el-form-item>
        <el-form-item label="婚礼名称" prop="weddingName">
          <el-input v-model="ruleForm.weddingName"></el-input>
        </el-form-item>
        <el-form-item label="婚礼日期" prop="date">
          <el-date-picker v-model="ruleForm.date" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="婚礼时间" prop="time">
          <el-input v-model="ruleForm.time"></el-input>
        </el-form-item>
        <el-form-item label="婚礼地点" prop="location">
          <el-input v-model="ruleForm.location"></el-input>
        </el-form-item>
        <el-form-item label="父亲姓名" prop="fatherName">
          <el-input v-model="ruleForm.fatherName"></el-input>
        </el-form-item>
        <el-form-item label="母亲姓名" prop="matherName">
          <el-input v-model="ruleForm.matherName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="right" v-loading="loading">
      <div class="imgClass">
        <img :src="imgSrc" alt=""></img>
      </div>
    </div>
  </div>
</template>
<script>
import { set } from 'lodash';

export default {
  data() {
    return {
      imgSrc: 'https://api.52vmy.cn/api/img/tw/card?to=苏星河&date=20241127&head=苏小天|李冉&event=结婚典礼敬备喜宴&time=中午十二时恭候&place=明月大酒店&tail=苏大地|苏小天',
      rules: {
        guestName: [
          { required: true, message: '请输入嘉宾姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        marriedPersonOne: [
          { required: true, message: '请输入新婚人姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        marriedPersonTwo: [
          { required: true, message: '请输入新婚人姓名', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        weddingName: [
          { required: true, message: '请输入婚礼名称', trigger: 'blur' },
        ],
        date: [
          { required: true, message: '请选择婚礼日期', trigger: 'blur' },
        ],
        time: [
          { required: true, message: '请输入婚礼名称', trigger: 'blur' },
        ],
        location: [
          { required: true, message: '请输入婚礼地点', trigger: 'blur' },
        ],
        fatherName: [
          { required: true, message: '请输入父亲名称', trigger: 'blur' },
        ],
        matherName: [
          { required: true, message: '请输入母亲名称', trigger: 'blur' },
        ],
      },
      ruleForm: {
        guestName: '好兄弟', // 嘉宾姓名
        marriedPersonOne: '杨大伟', // 新婚人一
        marriedPersonTwo: '李大锤', // 新婚人二
        weddingName: '结婚典礼敬备喜宴', // 婚礼名称
        date: this.getDefaultDate(), // 婚礼日期
        time: '中午十二时恭候', // 婚礼时间
        location: '明月大酒店', // 婚礼地点
        fatherName: '杨大大', // 父亲姓名
        matherName: '段大大', // 母亲姓名
      },
      loading: false
    };
  },
  mounted() {
    this.submitForm('ruleForm')
  },
  methods: {
    submitForm(formName) {
      let dateCopy = this.ruleForm.date;
      dateCopy = this.formatDate(dateCopy)
      this.$refs[formName].validate((valid) => {
        let { guestName, marriedPersonOne, marriedPersonTwo, weddingName, time, location, fatherName, matherName } = this.ruleForm
        if (valid) {
          this.loading = true
          this.imgSrc = `https://api.52vmy.cn/api/img/tw/card?to=${guestName}&date=${dateCopy}&head=${marriedPersonOne}|${marriedPersonTwo}&event=${weddingName}&time=${time}&place=${location}&tail=${fatherName}|${matherName}`
          setTimeout(() => {
            this.loading = false
          }, 1000)
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}${month}${day}`;
    },
    // 默认日期，当前日期往后数15天，所在周的周六日期
    getDefaultDate() {
      // 1. 获取当前日期
      const today = new Date();

      // 2. 计算15天后的日期
      const dateAfter15Days = new Date(today);
      dateAfter15Days.setDate(today.getDate() + 15);

      // 3. 找到该日期所在周的周六
      const dayOfWeek = dateAfter15Days.getDay(); // 0(周日)到6(周六)
      const daysToSaturday = dayOfWeek === 6 ? 0 : (6 - dayOfWeek);

      const saturdayDate = new Date(dateAfter15Days);
      saturdayDate.setDate(dateAfter15Days.getDate() + daysToSaturday);

  
      return saturdayDate;
    }
  },
};
</script>

<style scoped lang="scss">
.all {
  width: 100vw;
  height: 100vh;
  display: flex;

  .left {
    width: 39vw;
    height: 100vh;
    background-color: #fff;
  }

  .right {
    width: 61vw;
    height: 100vh;
    background-color: #000;

    .imgClass {
      width: 900px;
      height: auto;

      img {
        width: 900px;
        height: auto;
      }
    }
  }
}
</style>