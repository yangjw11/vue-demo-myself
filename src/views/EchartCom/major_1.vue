<template>
  <div>
    <h1>示例1</h1>
    <echarts :chartId="chartId" :option="option" />
    <div>
      <el-button @click="goRouter()">跳转到示例2</el-button>
    </div>
  </div>
</template>

<script>
import Echarts from "@/components/Echarts.vue";

export default {
  components: {
    Echarts,
  },
  data() {
    return {
      chartId: "chart",
      option: {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
          },
        ],
      },
    };
  },
  methods: {
    goRouter() {
      this.$router.push({
        path: "/EchartCom2",
      });
    },
  },
};
</script>
