<template>
  <div>
    <div class="title1">点击按钮即可跳转到对应的项目demo</div>
    <div class="title2">（如果建新项目，记得配置路由）</div>
    <div style="width: 100px;height: 100px;background: red; display:none">
      <skin />
    </div>
    <div class="btn_item">
      <el-button class="item" type="primary" @click="goRouter('/antiShake')">【防抖节流demo】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/cascader')">【级联选择器demo】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/dateTimePicker')">【时间日期选择器】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/nextTick')">【vue中的nextTick方法】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/computed')">【vue中的computed属性】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/globalMethods')">【vue中封装公共方法】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/compHome')">【vue中组件通信】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/vuex/vuexHome')">【vuex的使用】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/directive')">【vue自定义指令】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/inputCheck')">【vue简单输入框校验】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/animation')">【vue简单动画效果】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/commonCopt')">【vue公共组件的封装】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/commonCopt1')">【vue公共组件的封装1】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/regularExpress')">【正则表达式的学习】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/richTextEditor')">【富文本编辑器】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/elSwitch')">【elementUI的switch开关】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/dragDrop')">【vue的拖曳功能】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/elTableCellStyle')">【vue动态改变elementUI的单元格样式】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/keyboardEvent')">【vue的键盘事件】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/slotUseA')">【vue插槽slot的使用】</el-button>
      <el-button class="item" type="primary" @click="goRouter('canvas')">【vue中canvas画布的使用】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/interfaceDemo')">【vue接口练习demo】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/treeTable')">【表格中树形控件】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/shortComing2.0')">【vue2.x版本响应式原理存在的问题】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/elementUI_filter')">【elementUI表格过滤器的使用】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/elementUI_tree')">【elementUI树形控件】</el-button>
      <el-button class="item" type="primary" @click="goRouter('vueTreeselect')">【vue-treeselect插件的使用】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/demoTree')">【CBB项目树形控件练习】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/globalStyle')">【全局样式页使用】</el-button>
      <el-button class="item" type="primary" @click="goRouter('/vmfatherSon')">【父子组件使用v-model传值】</el-button>
      <!-- skinPeeler -->
      <el-button class="item" type="primary" @click="goRouter('/skinPeeler')">【换肤功能】</el-button>
      <!-- EchartsTest -->
      <el-button class="item" type="primary" @click="goRouter('/EchartsTest')">【Echarts图表示例】</el-button>
      <!-- uploadPDF -->
      <el-button class="item" type="primary" @click="goRouter('/uploadPDF')">【PDF上传下载预览】</el-button>
      <!-- selfCall -->
      <el-button class="item" type="primary" @click="goRouter('/selfCall')">【组件自己调用自己】</el-button>
      <!-- elementUIMenu -->
      <el-button class="item" type="primary" @click="goRouter('/elementUIMenu')">【elementUI菜单组件】</el-button>
      <!-- finalTime -->
      <el-button class="item" type="primary" @click="goRouter('/finalTime')">【点击按钮倒计时功能】</el-button>
      <!-- rate elementUI的评分功能 -->
      <el-button class="item" type="primary" @click="goRouter('/rate')">【elementUI的Rate评分】</el-button>
      <!-- 通过axios获取免费接口数据 -->
      <el-button class="item" type="primary" @click="goRouter('/axiosFree')">【axios调用免费接口】</el-button>
      <!-- iframe -->
      <el-button class="item" type="primary" @click="goRouter('/iframe')">【iframe嵌套外部页面】</el-button>
      <!-- this.$set使用详解 11111-->
      <el-button class="item" type="primary" @click="goRouter('/duoleSet')">【this.$set使用详解】</el-button>
      <!-- dragDialog -->
      <el-button class="item" type="primary" @click="goRouter('/dragDialog')">【弹窗拖动，双击放大功能】</el-button>
      <!-- 高德地图组件  -->
      <el-button class="item" type="primary" @click="goRouter('/mapGaud')">【高德地图练习】</el-button>
      <!-- 百度地图组件 mapBaidu-->
      <el-button class="item" type="primary" @click="goRouter('/mapBaidu')">【百度地图练习】</el-button>
      <!-- 测试父子组件 -->
      <el-button class="item" type="primary" @click="goRouter('/testCom')">【测试父子组件传值】</el-button>
      <!-- 锚点定位功能anchorPoint -->
      <el-button class="item" type="primary" @click="goRouter('/anchorPoint')">【锚点定位功能】</el-button>
      <!-- EchartCom 将Echarts图表封装成公共组件使用 -->
      <el-button class="item" type="primary" @click="goRouter('/EchartCom')">【Echarts图表在vue中封装成公共组件】</el-button>
      <!-- 合并单元格 -->
      <el-button class="item" type="primary" @click="goRouter('/merge_cell')">【elementUI合并单元格】</el-button>
      <!-- Echarts图标练习  -->
      <el-button class="item" type="primary" @click="goRouter('/scatterPlot')">【Echarts散点图demo】</el-button>
      <!-- heatMap -->
      <el-button class="item" type="primary" @click="goRouter('/heatMap')">【Echarts热力图demo】</el-button>
      <!-- elementUI 可以筛选的表格 filter_el_table-->
      <el-button class="item" type="primary" @click="goRouter('/filter_el_table')">【elementUI 可以筛选的表格】</el-button>
      <!-- render方法的使用 -->
      <el-button class="item" type="primary" @click="goRouter('/render')">【render方法的使用】</el-button>
      <!-- selectQuarter -->
      <el-button class="item" type="primary" @click="goRouter('/selectQuarter')">【季度选择器】</el-button>
      <!-- vue中.sync修饰符 -->
      <el-button class="item" type="primary" @click="goRouter('/sync')">【vue中.sync修饰符】</el-button>
      <!-- 淘宝放大镜功能 magnifier-->
      <el-button class="item" type="primary" @click="goRouter('/magnifier')">【vue中实现淘宝放大镜功能】</el-button>
      <!-- 获取美女图片 girlAxiosFree-->
      <el-button class="item" type="primary" @click="goRouter('/girlAxiosFree')">【获取美女图片】</el-button>
      <!-- 放大镜拆分 testMagnifier-->
      <el-button class="item" type="primary" @click="goRouter('/testMagnifier')">【放大镜功能拆分】</el-button>
      <!-- 直接将页面生成pdf文件 uploadPDF2-->
      <el-button class="item" type="primary" @click="goRouter('/uploadPDF2')">【页面生成pdf文件】</el-button>
      <!-- 草稿练习页面 -->
      <el-button class="item" type="primary" @click="goRouter('/zzz')">【草稿练习页】</el-button>
      <!-- 日历轮子 calendarWheel-->
      <el-button class="item" type="primary" @click="goRouter('/calendarWheel')">【日历组件】</el-button>
      <!-- 测试组件标签的 is 关键字 compUseIs -->
      <el-button class="item" type="primary" @click="goRouter('/compUseIs')">【组件标签中的 is 关键字】</el-button>
      <!-- elementUI 日历组件的使用 -->
      <!-- <el-button class="item" type="primary" @click="goRouter('/calendar')">【elementUI 日历组件calendar的使用】</el-button> -->
    </div>
  </div>
</template>
<script>
export default {
  components: {
    skin: () => import('./skinPeeler.vue')
  },
  data() {
    return {};
  },
  created() { },
  methods: {
    goRouter(name) {
      this.$router.push({
        path: name,
      });
    },
  },
};
</script>

<style scoped>
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

.btn_item {
  display: flex;
  /* 让按钮区域自动换行 */
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin-top: 50px;
  width: 100%;
  text-align: center;
}

.btn_item .item {
  display: inline-block;
  margin-top: 30px;
}
</style>