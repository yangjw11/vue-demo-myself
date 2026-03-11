<template>
  <div>
    <!-- <div class="block">
      <span class="demonstration">起始日期时刻为 12:00:00</span>
      <el-date-picker
        v-model="value1"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['12:00:00']"
      ></el-date-picker>
    </div>-->
    <div class="block">
      <el-date-picker v-model="value2" type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期"
        :default-time="['12:00:00', '08:00:00']"></el-date-picker>
    </div>

    <el-button type="primary" @click="printTime()" style="margin-top: 20px;">点击查看时间</el-button>
    <el-button type="primary" @click="changeTime()" style="margin-top: 20px;">点击更改时间</el-button>
    <div>parentISOPen:{{ isOpen }}</div>
    <div>info:{{ info }}</div>
    <el-dialog :isOpen.sync="isOpen" :info="info" @setIsOpen="setIsOpen">
      <div>asdadasd</div>
    </el-dialog>
  </div>
</template>
<script>
import dateTimePickerSon from './dateTimePickerSon.vue'
export default {
  components: {
    elDialog: dateTimePickerSon
  },
  data() {
    return {
      value1: "",
      value2: "",
      isOpen: false,
      info: { name: 'zhagsan' }
    };
  },
  methods: {
    setIsOpen() {
      this.isOpen = !this.isOpen
    },
    printTime() {
      console.log("this.value2===", this.value2);
      var beginDate = this.value2[0];
      var endDate = this.value2[1];
      var beginTime = this.getDateString(beginDate);
      var endTime = this.getDateString(endDate);
      console.log("开始时间beginTime ===", beginTime);
      console.log("结束时间endTime ===", endTime);
    },
    changeTime() {
      var time1 = "2022-08-01 12:00:00";
      var time2 = "2022-08-31 08:00:00";
      this.value2 = [time1, time2];
    },
    getDateString(choseDate) {
      var now = new Date(choseDate);
      var yy = now.getFullYear(); //年
      var mm = now.getMonth() + 1; //月
      var dd = now.getDate(); //日
      var hh = now.getHours(); //时
      var ii = now.getMinutes(); //分
      var ss = now.getSeconds(); //秒
      var time = yy + "-";
      if (mm < 10) time += "0";
      time += mm + "-";
      if (dd < 10) time += "0";
      time += dd + " ";
      if (hh < 10) time += "0";
      time += hh + ":";
      if (ii < 10) time += "0";
      time += ii + ":";
      if (ss < 10) time += "0";
      time += ss;
      return time;
    },
  },
};
</script>