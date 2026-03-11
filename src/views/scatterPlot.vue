<template>
  <div>
    <div class="title1">Echarts散点图demo</div>
    <div style="width: 400px; height: 800px">
      <chart :chartId="chartId" :option="option" />
    </div>
  </div>
</template>
<script>
import chart from "./Echarts.vue";
import obj  from './scatterPlot.js'
export default {
  components: {
    chart,
  },
  data() {
    return {
      chartId: "chartId",
      option: {
        tooltip: {
          position: "",
        },
        title: "",
        singleAxis: "",
        series: "",
      },
      hours: [
        "1c",
        "2c",
        "3c",
        "4c",
        "5c",
        "6c"
      ],
      days: [
        "Saturday",
        "Friday",
        "Thursday",
      ],
      data: [
        [0, 0, 260],
        [0, 1, 784],
        [0, 2, 590],
        [0, 3, 1077],
        [0, 4, 5],
        [0, 5, 9],
        [1, 0, 190],
        [1, 1, 751],
        [1, 2, 505],
        [1, 3, 1054],
        [1, 4, 15],
        [1, 5, 20],
        [2, 0, 289],
        [2, 1, 837],
        [2, 2, 559],
        [2, 3, 1147],
        [2, 4, 6],
        [2, 5, 11],
      ],
      title: [],
      singleAxis: [],
      series: [],
    };
  },
  mounted() {
    this.init();
    console.log(obj,'aaaa')
  },
  methods: {
    init() {
      this.days.forEach((day, idx)=>{
        this.title.push({
          textBaseline: "middle",
          top: ((idx + 0.5) * 100) / 7 + "%",
          text: day,
        });
        this.singleAxis.push({
          left: 150,
          type: "category",
          boundaryGap: false,
          data: this.hours,
          top: (idx * 100) / 7 + 5 + "%",
          height: 100 / 7 - 10 + "%",
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        });
        this.series.push({
          singleAxisIndex: idx,
          coordinateSystem: "singleAxis",
          type: "scatter",
          data: [],
          symbolSize: function (dataItem) {
            if(dataItem[1] < 100){
              return (dataItem[1] / 10 + 10);
            }else if(dataItem[1] < 200){
               return (dataItem[1] / 20 + 12);
            }else if(dataItem[1] < 500){
               return (dataItem[1] / 30 + 14);
            }else if(dataItem[1] < 800){
               return (dataItem[1] / 50 + 16);
            }else if(dataItem[1] < 1000){
               return (dataItem[1] / 80 + 18);
            }else {
              return (dataItem[1] / 90 + 28);
            }
          },
        });
      });
      
      this.data.forEach(dataItem=>{
        this.series[dataItem[0]].data.push([dataItem[1], dataItem[2]]);
      });
      // this.option = obj
      this.option = {
        tooltip: {
          position: "top",
        },
        title: this.title,
        singleAxis: this.singleAxis,
        series: this.series,
      };
      console.log('this.option ===', this.option)
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