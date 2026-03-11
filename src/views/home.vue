<template>
	<div>
		<div class="title1">点击按钮即可跳转到对应的项目demo</div>
		<div class="title2">（如果建新项目，记得配置路由）</div>
		<div style="width: 100px; height: 100px; background: red; display: none">
			<skin />
		</div>
		<div class="titleArea">
			<h1>特色项目</h1>
			<current-date-time></current-date-time>
		</div>
		<div class="btn_item">
			<!-- 每日英文  -->
			<el-button class="item" type="primary" @click="goRouter('/OneDayEnglish')">【每日英文】</el-button>
			<!-- 获取天文图片和图片的英文翻译 -->
			<el-button class="item" type="primary" @click="goRouter('/planetary')">【获取天文图片和图片的英文翻译】</el-button>
			<!-- 放大镜拆分 testMagnifier-->
			<el-button class="item" type="primary" @click="goRouter('/testMagnifier')">【放大镜功能拆分】</el-button>
			<!-- 地图和天气预报的结合 -->
			<el-button class="item" type="primary" @click="goRouter('/weatherAndMap')">【地图和天气预报结合】</el-button>
			<!-- 展示PPT -->
			<el-button class="item" type="primary" @click="goRouter('/iframePPT')">【展示PPT】</el-button>
			<!-- 获取小姐姐视频 -->
			<el-button class="item" type="primary" @click="goRouter('/getGirlVideo')">【小姐姐视频】</el-button>
			<!-- 每日新闻 -->
			<el-button class="item" type="primary" @click="goRouter('/dailyNews')">【每日新闻】</el-button>
			<!-- 扬子晚报 -->
			<el-button class="item" type="primary" @click="goRouter('/yangtseEveningPost')">【扬子晚报】</el-button>
			<!-- 南方日报 -->
			<el-button class="item" type="primary" @click="goRouter('/nanFangDaily')">【南方日报】</el-button>
			<!-- 新华日报 -->
			<el-button class="item" type="primary" @click="goRouter('/xinHuaDaily')">【新华日报】</el-button>
			<!-- 腾讯新闻 -->
			<el-button class="item" type="primary" @click="goRouter('/tencentNews')">【腾讯新闻】</el-button>
			<!-- cctv法治新闻 -->
			<el-button class="item" type="primary" @click="goRouter('/cctvLawNews')">【cctv法治新闻】</el-button>
			<!-- cctv科技新闻 -->
			<el-button class="item" type="primary" @click="goRouter('/cctvTechnologyNews')">【cctv科技新闻】</el-button>
			<!-- cctv国内新闻 -->
			<el-button class="item" type="primary" @click="goRouter('/cctvDomesticNews')">【cctv国内新闻】</el-button>
			<!-- cctv国际新闻 -->
			<el-button class="item" type="primary" @click="goRouter('/cctvInternationalNews')">【cctv国际新闻】</el-button>
			<!-- cctv社会新闻 -->
			<el-button class="item" type="primary" @click="goRouter('/cctvSocialNews')">【cctv社会新闻】</el-button>
			<!-- 全国失信人信息查询 -->
			<el-button class="item" type="primary" @click="goRouter('/judgmentDefaulter')">【全国失信人信息查询】</el-button>
			<!-- 推测老赖身份证号 -->
			<el-button class="item" type="primary" @click="goRouter('/inferredIdNumber')">【失信人身份证号推测】</el-button>
			<!-- 今日金价 -->
			<el-button class="item" type="primary" @click="goRouter('/todayGoldPrice')">【今日金价】</el-button>
			<!-- 国际空间站实时位置 -->
			<el-button class="item" type="primary" @click="goRouter('/live_position_ISS')">【国际空间站实时位置】</el-button>
			<!-- 最新的听QQ音乐 -->
			<el-button class="item" type="primary" @click="goRouter('/musicPlayer_qq_free')">【QQ音乐Free】</el-button>
		</div>
		<div class="titleArea">
			<h1>学习项目</h1>
		</div>
		<div class="btn_item">
			<!-- vue插槽的使用 -->
			<el-button class="item" type="primary" @click="goRouter('/slotUse')">【vue插槽slot的使用】</el-button>
			<!-- forceUpdate 使用示例 -->
			<el-button class="item" type="primary" @click="goRouter('/forceUpdate')">【forceUpdate 使用示例】</el-button>
			<!-- 配置任务允许外呼的具体时间段 -->
			<el-button class="item" type="primary" @click="goRouter('/callTimeMatrix')">【配置任务时间段】</el-button>
			<!-- 身份证号推测 -->
			<el-button class="item" type="primary" @click="goRouter('/idCardUtils')">【身份证号推测】</el-button>
			<!-- 地图和天气预报的结合经纬度 -->
			<el-button class="item" type="primary" @click="goRouter('/weatherAndMapPro')">【地图和天气预报结合经纬度】</el-button>
			<!-- 表格中的表单校验 /tabaleAndFormRules -->
			<el-button class="item" type="primary" @click="goRouter('/tabaleAndFormRules')">【表格中的表单校验】</el-button>
			<!-- 业务相关练习  -->
			<el-button class="item" type="primary" @click="goRouter('/business_demo')">【业务相关练习】</el-button>
			<!-- 上传文件练习  -->
			<el-button class="item" type="primary" @click="goRouter('/uploadFileDemo')">【文件上传，有开放接口练习】</el-button>
			<!-- 酷狗音乐播放器 -->
			<el-button class="item" type="primary" @click="goRouter('/musicPlayer_kugou')">【酷狗音乐播放器（有歌词）】</el-button>
			<!-- QQ音乐播放器 -->
			<el-button class="item" type="primary" @click="goRouter('/musicPlayer_qq')">【QQ音乐播放器（有歌词）】</el-button>
			<!-- 音乐播放器 -->
			<el-button class="item" type="primary" @click="goRouter('/musicPlayerChoose')">【可选音质音乐播放器（有歌词）】</el-button>
			<!-- 获取娱乐 · 婚宴请柬 -->
			<el-button class="item" type="primary" @click="goRouter('/weddingInvitation')">【娱乐 · 婚宴请柬】</el-button>
			<!-- 拖动练习 -->
			<el-button class="item" type="primary" @click="goRouter('/dragDemo')">【表格拖动功能，使用sortablejs】</el-button>
			<!-- Echarts图表练习  -->
			<el-button class="item" type="primary" @click="goRouter('/Echarts')">【Echarts铁科院demo】</el-button>
			<!-- 测试封装的公共请求 -->
			<el-button class="item" type="primary" @click="goRouter('/testHttp')">【测试封装的公共请求】</el-button>
			<!-- 通过QQ号查询用户信息 -->
			<el-button class="item" type="primary" @click="goRouter('/getInfoFromQQ')">【通过QQ号查询用户信息】</el-button>
			<!-- QQ音乐听歌 -->
			<el-button class="item" type="primary" @click="goRouter('/music')">【QQ音乐听歌】</el-button>
			<!-- 音乐播放器 -->
			<el-button class="item" type="primary" @click="goRouter('/musicPlayer')">【高音质音乐播放器（有歌词）】</el-button>
			<!-- 酷狗音乐 -->
			<el-button class="item" type="primary" @click="goRouter('/kuGouMusic')">【酷狗听歌】</el-button>
			<!-- 酷我音乐 -->
			<el-button class="item" type="primary" @click="goRouter('/kuwoMusic')">【酷我音乐】</el-button>
			<!-- 音乐播放器demo -->
			<el-button class="item" type="primary" @click="goRouter('/music_lyric_demo')">【音乐播放器demo（有歌词）】</el-button>
			<!-- elementUI 日历组件的使用 -->
			<!-- <el-button class="item" type="primary" @click="goRouter('/calendar')">【elementUI 日历组件calendar的使用】</el-button> -->
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
			<!-- Echarts图表练习  -->
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

			<!-- 直接将页面生成pdf文件 uploadPDF2-->
			<el-button class="item" type="primary" @click="goRouter('/uploadPDF2')">【页面生成pdf文件】</el-button>

			<!-- 日历轮子 calendarWheel-->
			<el-button class="item" type="primary" @click="goRouter('/calendarWheel')">【日历组件】</el-button>
			<!-- 测试组件标签的 is 关键字 compUseIs -->
			<el-button class="item" type="primary" @click="goRouter('/compUseIs')">【组件标签中的 is 关键字】</el-button>
			<!-- hardRules 复杂的表单校验 -->
			<el-button class="item" type="primary" @click="goRouter('/hardRules')">【复杂的表单校验】</el-button>
			<!-- transition 标签的使用 -->
			<el-button class="item" type="primary" @click="goRouter('/transition')">【transition 标签的使用】</el-button>
			<!-- lodash库 使用示例 -->
			<el-button class="item" type="primary" @click="goRouter('/lodashStudy')">【lodash库 使用示例】</el-button>
			<!-- 天气预报 -->
			<el-button class="item" type="primary" @click="goRouter('/weatherForecast')">【天气预报】</el-button>

			<!-- swiper插件练习 -->
			<el-button class="item" type="primary" @click="goRouter('/swiperDemo')">【swiper插件练习】</el-button>
			<!-- ElementUI表格固定列表头吸顶  -->
			<el-button class="item" type="primary" @click="goRouter('/ceiling')">ElementUI表格固定列表头吸顶</el-button>
			<!-- soul灵魂匹配 -->
			<el-button class="item" type="primary" @click="goRouter('/home1')">仿【soul灵魂匹配】菜单</el-button>
			<!-- soul 嵌套路由 -->
			<el-button class="item" type="primary" @click="goRouter('/contentSync')">仿【嵌套路由同步输入框】</el-button>
			<!-- git命令demo -->
			<el-button class="item" type="primary" @click="goRouter('/iframeGitStudy')">【git命令练习】</el-button>
			<!-- 音乐功能综合 -->
			<el-button class="item" type="primary" @click="goRouter('/MusicIntegration')">【音乐功能综合】</el-button>

			<!-- 草稿练习页面 -->
			<el-button class="item" type="primary" @click="goRouter('/page1')">【页面内守卫】</el-button>
			<el-button class="item" type="primary" @click="goRouter('/zzz')">【草稿练习页】</el-button>
		</div>
	</div>
</template>
<script>
import CurrentDateTime from '@/views/news/components/CurrentDateTime.vue';
export default {
	components: {
		skin: () => import("./skinPeeler.vue"),
		CurrentDateTime,
	},
	data() {
		return {};
	},
	created() { },
	methods: {
		goRouter(name) {
			this.$router.push({
				path: name
			});
		}
	}
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
	/* margin-top: 20px; */
	width: 100%;
	text-align: center;
}

.btn_item .item {
	display: inline-block;
	margin-top: 30px;
}

.titleArea {
	width: 100%;
	text-align: center;
}
</style>
