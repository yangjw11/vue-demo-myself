<template>
  <div :id="chartId" style="width:100%;height:400px;"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  props: {
    chartId: {
      type: String,
      default: "chart",
    },
    option: {
      type: Object,
      default: () => ({}),
    },
  },
  mounted() {
    debugger;
    this.chart = echarts.init(document.getElementById(this.chartId));
    this.chart.setOption(this.option);
  },
  beforeDestroy() {
    this.chart.dispose();
  },
};
</script>
