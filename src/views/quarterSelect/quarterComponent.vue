<template>
  <div class="time_quarter">
    <mark
      style="position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0);z-index:999;"
      v-show="showSeason"
      @click.stop="showSeason = false"
    ></mark>
    <el-input
      placeholder="请选择季度"
      v-model="showValue"
      style="width:100%;"
      class="elWidth"
      @focus="showSeason = true"
    >
      <i slot="prefix" class="el-input__icon el-icon-date"></i>
    </el-input>
    <el-card class="box-card" v-show="showSeason" style="width:100%">
      <div slot="header" class="clearfix" style="text-align:center;padding:0">
        <button
          type="button"
          aria-label="前一年"
          class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left"
          @click="prev"
        ></button>
        <span role="button" class="el-date-picker__header-label">{{ year }}年</span>
        <button
          type="button"
          aria-label="后一年"
          @click="next"
          :class="{ notallow: year == limitTime }"
          class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"
        ></button>
      </div>
      <div class="text item" style="text-align:center;">
        <el-button
          type="text"
          size="medium"
          style="width:40%;color: #606266;float:left;"
          @click="selectSeason(0)"
        >第一季度</el-button>
        <el-button
          type="text"
          size="medium"
          style="float:right;width:40%;color: #606266;"
          @click="selectSeason(1)"
        >第二季度</el-button>
      </div>
      <div class="text item" style="text-align:center;">
        <el-button
          type="text"
          size="medium"
          style="width:40%;color: #606266;float:left;"
          @click="selectSeason(2)"
        >第三季度</el-button>
        <el-button
          type="text"
          size="medium"
          style="float:right;width:40%;color: #606266;"
          @click="selectSeason(3)"
        >第四季度</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  props: {
    valueArr: {
      default: () => {
        return ["01-03", "04-06", "07-09", "10-12"];
      },
      type: Array,
    },
    getValue: {
      default: () => {},
      type: Function,
    },
    // 传入显示的时间
    defaultValue: {
      default: "",
      type: String,
    },
    // 限制的时间
    limitTime: {
      type: String,
      default: "",
      require: true,
    },
  },
  data() {
    return {
      showSeason: false,
      season: "",
      year: new Date().getFullYear(),
      showValue: "",
    };
  },
  computed: {},
  created() {
    if (this.defaultValue) {
      let value = this.defaultValue;
      let arr = value.split("-");
      this.year = arr[0].slice(0, 4);

      var myseason = arr[0].slice(5, 7);
      this.showValue = `${this.year}年${this.whitchQuarter(myseason)}季度`;
    } else {
        console.log("whitchQuarter", this.whitchQuarter(10));
    }
    
  },
  watch: {
    // defaultValue: function (value, oldValue) {
    //   let arr = value.split("-");
    //   this.year = arr[0].slice(0, 4);
    //   var myseason = arr[1];
    //   this.showValue = `${this.year}年${this.whitchQuarter(myseason)}季度`;
    // },
  },
  methods: {
    // 根据输入的月份判断是哪一个季节
    whitchQuarter(month) {
      let quarter = "";
      month = Number(month);
      switch (month) {
        case 1:
        case 2:
        case 3:
          quarter = "1";
          break;
        case 4:
        case 5:
        case 6:
          quarter = "2";
          break;
        case 7:
        case 8:
        case 9:
          quarter = "3";
          break;
        case 10:
        case 11:
        case 12:
          quarter = "4";
          break;
        default:
          console.error("The entered time is incorrect");
      }
      return quarter;
    },
    one() {
      this.showSeason = false;
    },
    prev() {
      this.year = this.year * 1 - 1;
    },
    next() {
      // 如果有时间限制的话会进行判断
      if (this.limitTime == "") {
        this.year = this.year * 1 + 1;
      } else if (this.limitTime != "" && this.year < this.limitTime) {
        this.year = this.year * 1 + 1;
      }
    },
    // 季度时间判定
    InitialTime(val) {
      let num = "";
      val = Number(val);
      switch (val) {
        case 1:
          num = "01";
          break;
        case 2:
          num = "04";
          break;
        case 3:
          num = "07";
          break;
        case 4:
          num = "10";
          break;
        default:
          console.error("时间格式有误！");
      }
      return num;
    },
    
    selectSeason(i) {
      let that = this;
      that.season = i + 1;
      let arr = that.valueArr[i].split("-");
      that.getValue(that.year + arr[0] + "-" + that.year + arr[1]);
      that.showSeason = false;
      this.showValue = `${this.year}年${this.season}季度`;
      var formatValue = `${this.year}-${this.InitialTime(this.season)}`;
      this.$emit("getTime", formatValue);
    },
  },
};
</script>
<style>
.notallow {
  cursor: not-allowed;
}
.time_box {
  position: relative;
}
.box-card {
  position: absolute;
  top: 40px;
  /* left: 22px; */
  padding: 0 3px 20px;
  z-index: 9999;
}
.time_quarter {
  width: 100%;
}
.time_quarter .el-input--small .el-input__inner {
  width: 82%;
}
</style>