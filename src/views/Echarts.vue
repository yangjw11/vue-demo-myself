<template>
  <div :id="chartId" :style="{width: width, height: height}"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name:'chart',
  props: {
    chartId: {
      type: String,
      default: "chart",
    },
    option: {
      type: Object,
      default: () => ({}),
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '120%'
    }
  },
  mounted() {
    setTimeout(() => {
      this.chart = echarts.init(document.getElementById(this.chartId));
      this.chart.setOption(this.option);
      window.addEventListener("resize", function () {
        this.chart.resize();
      });
    }, 10);
  },
  beforeDestroy() {
    this.chart.dispose();
  },
};
</script>
