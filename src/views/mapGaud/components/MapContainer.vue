<template>
  <!-- 子组件-地图组件 -->
  <div class="home_div">
    <div id="container"></div>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
export default {
  name: "Mapview",
  data() {
    return {
      map: null,
    };
  },
  created() {},
  mounted() {
    this.initAMap();
  },
  methods: {
    initAMap() {
      AMapLoader.load({
        key: "c5a44d6c8c0b06827652341562d0708f", //设置您的key
        version: "2.0", // 高德地图版本
        plugins: ["AMap.ToolBar", "AMap.Driving"], // 插件
        AMapUI: {
          // 高德地图UI组件库，可不写，内部提供了覆盖物标注点，以及部分模块的封装
          version: "1.1",
          plugins: [],
        },
        Loca: {
          // Loca版本(高性能地图数据可视化库) 可不写
          version: "2.0",
        },
      })
        .then((AMap) => {
          // container渲染的id
          this.map = new AMap.Map("container", {
            zoom: 5, // 当前缩放级别
            zooms: [2, 22], // 缩放级别范围
            center: [105.602725, 37.076636], // 中心点
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style scoped>
.home_div {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 100%;
  position: relative;
}
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
