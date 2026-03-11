import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		component: () => import("@/views/home.vue")
	},
	{
		path: "/antiShake",
		component: () => import("@/views/antiShake.vue")
	},
	{
		path: "/cascader",
		component: () => import("@/views/cascader.vue")
	},
	{
		path: "/dateTimePicker",
		component: () => import("@/views/dateTimePicker.vue")
	},
	{
		path: "/nextTick",
		component: () => import("@/views/nextTick/nextTick.vue"),
		children: [
			{
				path: "/nextTick/nextTick1",
				component: () => import("@/views/nextTick/nextTick1.vue")
			},
			{
				path: "/nextTick/nextTick2",
				component: () => import("@/views/nextTick/nextTick2.vue")
			}
		]
	},
	{
		path: "/computed",
		component: () => import("@/views/computed/computed.vue")
	},
	{
		path: "/globalMethods",
		component: () => import("@/views/globalMethods.vue")
	},
	{
		path: "/vuex",
		component: () => import("@/views/vuex/vuexHome.vue")
	},
	{
		path: "/vuex/another",
		component: () => import("@/views/vuex/vuexHome1.vue")
	},
	{
		path: "/directive",
		component: () => import("@/views/directive.vue")
	},
	{
		path: "/filters",
		component: () => import("@/views/filters.vue")
	},
	{
		path: "/inputCheck",
		component: () => import("@/views/inputCheck.vue")
	},
	{
		path: "/animation",
		component: () => import("@/views/animation.vue")
	},
	{
		path: "/commonCopt",
		component: () => import("@/views/commonCopt.vue")
	},
	{
		path: "/commonCopt1",
		component: () => import("@/views/commonCopt1.vue"),
		redirect: "/commonCopt1/commonCopt2", // 这行代码可以使子路由页面默认显示，就不用点击触发按钮来显示了
		children: [
			{
				path: "/commonCopt1/commonCopt2",
				component: () => import("@/views/commonCopt2.vue")
			}
		]
	},
	{
		path: "/regularExpress",
		component: () => import("@/views/regularExpress.vue")
	},
	{
		path: "/richTextEditor",
		component: () => import("@/views/richTextEditor.vue")
	},
	{
		path: "/elSwitch",
		component: () => import("@/views/elSwitch.vue")
	},
	{
		path: "/elTableCellStyle",
		component: () => import("@/views/elTableCellStyle.vue")
	},
	{
		path: "/keyboardEvent",
		component: () => import("@/views/keyboardEvent.vue")
	},
	{
		path: "/slotUse",
		component: () => import("@/views/slotUse/index.vue")
	},
	{
		path: "/canvas",
		component: () => import("@/views/canvas.vue")
	},
	{
		path: "/compHome",
		component: () => import("@/views/compHome/compHome.vue")
	},
	{
		path: "/parent1",
		component: () => import("@/views/compHome/way1/parent1.vue")
	},
	{
		path: "/parent2",
		component: () => import("@/views/compHome/way2/parent2.vue")
	},
	{
		path: "/parent3",
		component: () => import("@/views/compHome/way3/parent3.vue")
	},
	{
		path: "/parent4",
		component: () => import("@/views/compHome/way4/parent4.vue")
	},
	{
		path: "/parent5",
		component: () => import("@/views/compHome/way5/parent5.vue")
	},
	{
		path: "/parent6",
		component: () => import("@/views/compHome/way6/parent6.vue")
	},
	{
		path: "/parent7",
		component: () => import("@/views/compHome/way7/parent7.vue")
	},
	{
		path: "/parent8",
		component: () => import("@/views/compHome/way8/parent8.vue")
	},
	{
		path: "/interfaceDemo",
		component: () => import("@/views/interfaceDemo.vue")
	},
	{
		path: "/treeTable",
		component: () => import("@/views/treeTable.vue")
	},
	{
		path: "/shortComing2.0",
		component: () => import("@/views/shortComing2.0.vue")
	},
	{
		path: "/elementUI_filter",
		component: () => import("@/views/elementUI_filter")
	},
	// elementUI_tree
	{
		path: "/elementUI_tree",
		component: () => import("@/views/elementUITree")
	},
	// vueTreeselect
	{
		path: "/vueTreeselect",
		component: () => import("@/views/vueTreeselect")
	},
	// demoTree
	{
		path: "/demoTree",
		component: () => import("@/views/demoTree")
	},
	{
		path: "/demoTreeDetail",
		component: () => import("@/views/demoTreeDetail")
	},
	{
		path: "/globalStyle",
		component: () => import("@/views/globalStyle")
	},
	{
		path: "/vmfatherSon",
		component: () => import("@/views/FS_v-model/father")
	},
	// skinPeeler
	{
		path: "/skinPeeler",
		component: () => import("@/views/skinPeeler")
	},
	// EchartsTest
	{
		path: "/EchartsTest",
		component: () => import("@/views/Echarts/EchartsTest")
	},
	{
		path: "/Echarts",
		component: () => import("@/views/Echarts/index.vue")
	},
	// uploadPDF
	{
		path: "/uploadPDF",
		component: () => import("@/views/uploadPDF")
	},
	// selfCall 02_vue_begin\100-vue项目router配置\src\views\compHome
	{
		path: "/selfCall",
		component: () => import("@/views/compHome/selfCall/father")
	},
	{
		path: "/selfCallson",
		component: () => import("@/views/compHome/selfCall/son")
	},
	// elementUIMenu
	{
		path: "/elementUIMenu",
		component: () => import("@/views/elementUIMenu")
	},
	// finalTime 02_vue_begin\100-vue项目router配置\src\views\finalTime
	{
		path: "/finalTime",
		component: () => import("@/views/finalTime/index.vue")
	},
	{
		path: "/rate",
		component: () => import("@/views/elementUI_Rate.vue")
	},
	// axiosFree
	{
		path: "/axiosFree",
		component: () => import("@/views/axiosFree.vue")
	},
	// iframe
	{
		path: "/iframe",
		component: () => import("@/views/iframe.vue")
	},
	// duoleSet
	{
		path: "/duoleSet",
		component: () => import("@/views/duoleSet.vue")
	},
	// dragDialog
	{
		path: "/dragDialog",
		component: () => import("@/views/dragDialog.vue")
	},
	// mapGaud
	{
		path: "/mapGaud",
		component: () => import("@/views/mapGaud/mapGaud.vue")
	},
	// mapBaidu
	{
		path: "/mapBaidu",
		component: () => import("@/views/mapBaidu/mapBaidu.vue")
	},
	// testCom
	{
		path: "/testCom",
		component: () => import("@/views/testFS/father.vue")
	},
	// anchorPoint
	{
		path: "/anchorPoint",
		component: () => import("@/views/anchorPoint.vue")
	},
	// EchartCom
	{
		path: "/EchartCom",
		component: () => import("@/views/EchartCom/major_1.vue")
	},
	{
		path: "/EchartCom2",
		component: () => import("@/views/EchartCom/major_2.vue")
	},
	// merge_cell
	{
		path: "/merge_cell",
		component: () => import("@/views/merge_cell.vue")
	},
	// scatterPlot 散点图
	{
		path: "/scatterPlot",
		component: () => import("@/views/scatterPlot.vue")
	},
	// heatMap
	{
		path: "/heatMap",
		component: () => import("@/views/heatMap.vue")
	},
	{
		path: "/filter_el_table",
		component: () => import("@/views/filter_el_table.vue")
	},
	{
		path: "/render",
		component: () => import("@/views/render/render.vue")
	},
	{
		path: "/selectQuarter",
		component: () => import("@/views/quarterSelect/index.vue")
	},
	// hardRules
	{
		path: "/hardRules",
		component: () => import("@/views/hardRules.vue")
	},
	{
		path: "/sync",
		component: () => import("@/views/sync_modifier/index.vue")
	},
	// magnifier
	{
		path: "/magnifier",
		component: () => import("@/views/magnifier.vue")
	},
	// girlAxiosFree
	{
		path: "/girlAxiosFree",
		component: () => import("@/views/girls/girlAxiosFree")
	},
	// testMagnifier
	{
		path: "/testMagnifier",
		component: () => import("@/views/testMagnifier/index")
	},
	// uploadPDF2
	{
		path: "/uploadPDF2",
		component: () => import("@/views/uploadPDF2")
	},
	// /zzz 修改zzz文件名，对应不同的demo
	{
		path: "/zzz",
		component: () => import("@/views/zzz/zzz.vue")
	},
	{
		path: "/calendarWheel",
		component: () => import("@/views/calendarWheel")
	},
	// compUseIs
	{
		path: "/compUseIs",
		component: () => import("@/views/compUseIs/index.vue")
	},
	{
		path: "/transition",
		component: () => import("@/views/transition")
	},
	{
		path: "/lodashStudy",
		component: () => import("@/views/lodashStudy")
	},
	{
		path: "/forceUpdate",
		component: () => import("@/views/forceUpdate")
	},
	{
		path: "/weatherForecast",
		component: () => import("@/views/weatherForecast/index.vue")
	},
	{
		path: "/getGirlVideo",
		component: () => import("@/views/getGirlVideo")
	},
	{
		path: "/swiperDemo",
		component: () => import("@/views/swiperDemo")
	},
	{
		path: "/weatherAndMap",
		component: () => import("@/views/weatherAndMap")
	},
	{
		path: "/weatherAndMapPro",
		component: () => import("@/views/weatherAndMapPro")
	},
	// 每日英语 /OneDayEnglish
	{
		path: "/OneDayEnglish",
		component: () => import("@/views/OneDayEnglish")
	},
	// 页面内守卫 /page1 src\views\guard\page1.vue
	{
		path: "/page1",
		component: () => import("@/views/guard/page1.vue")
	},
	{
		path: "/page2",
		component: () => import("@/views/guard/page2.vue")
	},
	{
		path: "/ceiling",
		component: () => import("@/views/ceiling")
	},
	{
		path: "/home1",
		component: () => import("@/views/home1.vue")
	},
	{
		path: "/contentSync",
		component: () => import("@/views/contentSync.vue")
	},
	{
		path: "/iframeGitStudy",
		component: () => import("@/views/iframeGitStudy.vue")
	},
	{
		path: "/getInfoFromQQ",
		component: () => import("@/views/getInfoFromQQ.vue")
	},
	{
		path: "/iframePPT",
		component: () => import("@/views/iframePPT.vue")
	},
	{
		path: "/music",
		component: () => import("@/views/music.vue")
	},
	{
		path: "/kuGouMusic",
		component: () => import("@/views/kuGouMusic.vue")
	},
	{
		path: "/kuwoMusic",
		component: () => import("@/views/kuwoMusic.vue")
	},
	// MusicIntegration
	{
		path: "/MusicIntegration",
		component: () => import("@/views/MusicIntegration.vue")
	},
	{
		path: "/dragDemo",
		component: () => import("@/views/dragDemo.vue")
	},
	{
		path: "/planetary",
		component: () => import("@/views/planetary.vue")
	},
	// 音乐播放器 demo
	{
		path: "/music_lyric_demo",
		component: () => import("@/views/music_lyric_demo.vue")
	},
	// 音乐播放器
	{
		path: "/musicPlayer",
		component: () => import("@/views/musicPlayer/index.vue")
	},
	{
		path: "/musicPlayerChoose",
		component: () => import("@/views/musicPlayerChoose/index.vue")
	},
	// 酷狗音乐有歌词
	{
		path: "/musicPlayer_kugou",
		component: () => import("@/views/musicPlayer_kugou/index.vue")
	},
	// QQ音乐有歌词 不能用了
	{
		path: "/musicPlayer_qq",
		component: () => import("@/views/musicPlayer_qq/index.vue")
	},
	// QQ音乐免费有歌词 可以用 普通音质
	{
		path: "/musicPlayer_qq_free",
		component: () => import("@/views/musicPlayer_qq_free/index.vue")
	},
	// 测试封装的公共请求方法 testHttp
	{
		path: "/testHttp",
		component: () => import("@/views/testHttp.vue")
	},
	// 婚宴请帖
	{
		path: "/weddingInvitation",
		component: () => import("@/views/weddingInvitation.vue")
	},
	// 每日新闻
	{
		path: "/dailyNews",
		component: () => import("@/views/dailyNews.vue")
	},
	{
		path: "/uploadFileDemo",
		component: () => import("@/views/uploadFileDemo.vue")
	},
	// 扬子晚报
	{
		path: "/yangtseEveningPost",
		component: () => import("@/views/news/yangtseEveningPost.vue")
	},
	// 南方日报
	{
		path: "/nanFangDaily",
		component: () => import("@/views/news/nanFangDaily.vue")
	},
	// 新华日报
	{
		path: "/xinHuaDaily",
		component: () => import("@/views/news/xinHuaDaily.vue")
	},
	// 腾讯日报
	{
		path: "/tencentNews",
		component: () => import("@/views/news/tencentNews.vue")
	},
	// CCTV法治新闻
	{
		path: "/cctvLawNews",
		component: () => import("@/views/news/cctvLawNews.vue")
	},
	// CCTV科技新闻
	{
		path: "/cctvTechnologyNews",
		component: () => import("@/views/news/cctvTechnologyNews.vue")
	},
	// CCTV国内新闻
	{
		path: "/cctvDomesticNews",
		component: () => import("@/views/news/cctvDomesticNews.vue")
	},
	// CCTV国际新闻
	{
		path: "/cctvInternationalNews",
		component: () => import("@/views/news/cctvInternationalNews.vue")
	},
	// CCTV社会新闻
	{
		path: "/cctvSocialNews",
		component: () => import("@/views/news/cctvSocialNews.vue")
	},
	// 失信被执行人查询
	{
		path: "/inferredIdNumber",
		component: () => import("@/views/inferredIdNumber.vue")
	},
	{
		path: "/judgmentDefaulter",
		component: () => import("@/views/judgmentDefaulter.vue")
	},
	// 业务练习
	{
		path: "/business_demo",
		component: () => import("@/views/business_demo/index.vue")
	},
	// 今日金价
	{
		path: "/todayGoldPrice",
		component: () => import("@/views/todayGoldPrice.vue")
	},
	// 国际空间站实时位置刷新
	{
		path: "/live_position_ISS",
		component: () => import("@/views/live_position_ISS.vue")
	},
	// 表格嵌套表单
	{
		path: "/tabaleAndFormRules",
		component: () => import("@/views/business_demo/tabaleAndFormRules.vue")
	},
	// 时间和星期列表
	{
		path: "/callTimeMatrix",
		component: () => import("@/views/callTimeMatrix/index.vue")
	},
	{
		path: "/idCardUtils",
		component: () => import("@/views/idCardUtils/index.vue")
	},
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes
});

export default router;
