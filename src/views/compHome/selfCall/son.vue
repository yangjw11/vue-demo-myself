<template>
  <div class="chart-layout">
    <div class="chart-main">
      <div>{{chartData.nameCN}}</div>
      <div class="chart-en">{{chartData.nameEN}}</div>
      <div class="chart-remarks">{{chartData.remarks}}</div>
    </div>
    <moduleSun :chartData="item" v-for="(item,index) in chartData.children" :key="index" />
  </div>
</template>
 
<script>
export default {
  name: "moduleSun",
  props: {
    chartData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
};
</script>
 
<style lang="less" scoped>
.chart-main {
  width: 100px;
  border: 1px solid #000;

  > div {
    margin-top: 5px;
  }
}
</style>