<template>
  <div>
    <el-button
      v-bind:class="{grey:isGrey,blue:!isGrey}"
      v-bind:disabled="dis"
      type="primary"
      @click="getCode"
    >
      点击按钮
    </el-button>
    <span v-if="show">发送验证码</span>
    <span v-else>重新发送({{count}}s)</span>
  </div>
</template>
<script>
export default {
  name: 'finalTime',
  data() {
    return {
      dis: false,
      show: true,
      isGrey: false, //按钮样式
      timer: null, //设置计时器,
      count: "",
      beginTime: 20
    };
  },
  created(){
    this.getCount()
  },
  watch:{
    count(newVal, oldVal) {
      if (newVal) {
        localStorage.setItem('count', this.count)
      }
    }
  },
  methods: {
    getCode() {
      let TIME_COUNT = this.beginTime;
      if (!this.timer) {
        // 在这里发送接口
        // =============
        this.count = TIME_COUNT;
        this.isGrey = true;
        this.show = false;
        this.dis = true;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.dis = false;
            this.isGrey = false;
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    },
    getCount(){
      let TIME_COUNT = localStorage.getItem('count')
      this.count = TIME_COUNT
      if(this.count >1) {
        this.isGrey = true;
        this.show = false;
        this.dis = true;
        this.timer = setInterval(() => {
          if (this.count > 0 && this.count <= TIME_COUNT) {
            this.count--;
          } else {
            this.dis = false;
            this.isGrey = false;
            this.show = true;
            clearInterval(this.timer);
            this.timer = null;
          }
        }, 1000);
      }
    }
  },
};
</script>

<style scoped>
.grey {
  background-color: #edeef1;
  border-color: #edeef1;
  color: #666;
}
.blue {
  background-color: #64a0dd;
  border-color: #64a0dd;
}
</style>