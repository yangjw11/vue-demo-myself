<template>
	<div>
		<div class="title1"></div>
		<div class="title2"></div>
		<div style="width: 100%; text-align: center;"></div>
		<el-button type="primary" @click="fetchData">点击一下</el-button>
	</div>
</template>
<script>
import axios from "axios";
export default {
	data() {
		return {
			arr: [
				"101010300",
				"101010600",
				"101020700",
				"101020900",
				"101051305",
				"101060703",
				"101060906",
				"101060907",
				"101070402",
				"101070604",
				"101071004",
				"101071105",
				"101080105",
				"101080706",
				"101081109",
				"101090118",
				"101090222",
				"101090223",
				"101090224",
				"101090225",
				"101090512",
				"101090716",
				"101100606",
				"101110413",
				"101110604",
				"101110912",
				"101111004",
				"101111101",
				"101120107",
				"101121202",
				"101130202",
				"101130203",
				"101130911",
				"101130912",
				"101131011",
				"101140105",
				"101140106",
				"101140107",
				"101140108",
				"101140208",
				"101140209",
				"101140210",
				"101140211",
				"101140212",
				"101140213",
				"101140214",
				"101140216",
				"101140217",
				"101140218",
				"101140219",
				"101140220",
				"101140309",
				"101140310",
				"101140311",
				"101140312",
				"101140313",
				"101140314",
				"101140405",
				"101140406",
				"101140407",
				"101140508",
				"101140509",
				"101140510",
				"101140511",
				"101140602",
				"101140608",
				"101140609",
				"101140706",
				"101140707",
				"101140708",
				"101140709",
				"101140710",
				"101150305",
				"101150901",
				"101150902",
				"101161106",
				"101161107",
				"101161401",
				"101180508",
				"101180911",
				"101181705",
				"101181706",
				"101190204",
				"101191104",
				"101191305",
				"101200106",
				"101200302",
				"101200407",
				"101200510",
				"101200604",
				"101200605",
				"101200606",
				"101201108",
				"101201109",
				"101201404",
				"101201405",
				"101201406",
				"101210610",
				"101210611",
				"101210612",
				"101210613",
				"101210808",
				"101210809",
				"101211006",
				"101220403",
				"101230404",
				"101230405",
				"101230406",
				"101230407",
				"101230510",
				"101231001",
				"101240213",
				"101240312",
				"101240718",
				"101240803",
				"101240903",
				"101240904",
				"101240905",
				"101240906",
				"101250105",
				"101250512",
				"101250608",
				"101251104",
				"101251212",
				"101251213",
				"101251411",
				"101260109",
				"101260110",
				"101260111",
				"101260215",
				"101260708",
				"101270608",
				"101271202",
				"101271805",
				"101280210",
				"101280211",
				"101280804",
				"101281008",
				"101281009",
				"101281010",
				"101281109",
				"101281206",
				"101281308",
				"101281406",
				"101281503",
				"101281803",
				"101281804",
				"101281905",
				"101282006",
				"101290313",
				"101290608",
				"101290901",
				"101291011",
				"101300406",
				"101300607",
				"101300906",
				"101301211",
				"101330102",
				"101330103",
				"101340103",
				"101340104",
				"101340402",
				"101340403",
				"101340404",
				"101340405",
				"101340406"
			],
			cityInfo: [],
			errorCode: [],
			currentIndex: 0,
			// 下面是查询不到的code记录
			note: ["101080706", "101090222", "101090512", "101111101", "101120107", "101130202", "101130203", "101140313", "101140508", "101140609", "101150901", "101150902", "101180911", "101181706", "101201406", "101231001", "101240213", "101251411", "101260109", "101282006", "101330102", "101330103"],
			// 下面是处理好的数据
      noteCity: [
				{
					cityName: "朝阳区",
					cityCode: "101010300"
				},
				{
					cityName: "通州区",
					cityCode: "101010600"
				},
				{
					cityName: "金山区",
					cityCode: "101020700"
				},
				{
					cityName: "松江区",
					cityCode: "101020900"
				},
				{
					cityName: "友谊县",
					cityCode: "101051305"
				},
				{
					cityName: "东辽县",
					cityCode: "101060703"
				},
				{
					cityName: "抚松县",
					cityCode: "101060906"
				},
				{
					cityName: "江源区",
					cityCode: "101060907"
				},
				{
					cityName: "新宾满族自治县",
					cityCode: "101070402"
				},
				{
					cityName: "东港市",
					cityCode: "101070604"
				},
				{
					cityName: "弓长岭区",
					cityCode: "101071004"
				},
				{
					cityName: "调兵山市",
					cityCode: "101071105"
				},
				{
					cityName: "清水河县",
					cityCode: "101080105"
				},
				{
					cityName: "科尔沁右翼前旗",
					cityCode: "101081109"
				},
				{
					cityName: "鹿泉区",
					cityCode: "101090118"
				},
				{
					cityName: "定兴县",
					cityCode: "101090223"
				},
				{
					cityName: "清苑区",
					cityCode: "101090224"
				},
				{
					cityName: "博野县",
					cityCode: "101090225"
				},
				{
					cityName: "沧县",
					cityCode: "101090716"
				},
				{
					cityName: "泽州县",
					cityCode: "101100606"
				},
				{
					cityName: "榆阳区",
					cityCode: "101110413"
				},
				{
					cityName: "商州区",
					cityCode: "101110604"
				},
				{
					cityName: "陈仓区",
					cityCode: "101110912"
				},
				{
					cityName: "耀州区",
					cityCode: "101111004"
				},
				{
					cityName: "河口区",
					cityCode: "101121202"
				},
				{
					cityName: "疏附县",
					cityCode: "101130911"
				},
				{
					cityName: "疏勒县",
					cityCode: "101130912"
				},
				{
					cityName: "奎屯市",
					cityCode: "101131011"
				},
				{
					cityName: "堆龙德庆区",
					cityCode: "101140105"
				},
				{
					cityName: "曲水县",
					cityCode: "101140106"
				},
				{
					cityName: "达孜区",
					cityCode: "101140107"
				},
				{
					cityName: "墨竹工卡县",
					cityCode: "101140108"
				},
				{
					cityName: "仲巴县",
					cityCode: "101140208"
				},
				{
					cityName: "萨嘎县",
					cityCode: "101140209"
				},
				{
					cityName: "吉隆县",
					cityCode: "101140210"
				},
				{
					cityName: "昂仁县",
					cityCode: "101140211"
				},
				{
					cityName: "定结县",
					cityCode: "101140212"
				},
				{
					cityName: "萨迦县",
					cityCode: "101140213"
				},
				{
					cityName: "谢通门县",
					cityCode: "101140214"
				},
				{
					cityName: "岗巴县",
					cityCode: "101140216"
				},
				{
					cityName: "白朗县",
					cityCode: "101140217"
				},
				{
					cityName: "亚东县",
					cityCode: "101140218"
				},
				{
					cityName: "康马县",
					cityCode: "101140219"
				},
				{
					cityName: "仁布县",
					cityCode: "101140220"
				},
				{
					cityName: "乃东区",
					cityCode: "101140309"
				},
				{
					cityName: "桑日县",
					cityCode: "101140310"
				},
				{
					cityName: "洛扎县",
					cityCode: "101140311"
				},
				{
					cityName: "措美县",
					cityCode: "101140312"
				},
				{
					cityName: "曲松县",
					cityCode: "101140314"
				},
				{
					cityName: "工布江达县",
					cityCode: "101140405"
				},
				{
					cityName: "朗县",
					cityCode: "101140406"
				},
				{
					cityName: "墨脱县",
					cityCode: "101140407"
				},
				{
					cityName: "江达县",
					cityCode: "101140509"
				},
				{
					cityName: "察雅县",
					cityCode: "101140510"
				},
				{
					cityName: "贡觉县",
					cityCode: "101140511"
				},
				{
					cityName: "尼玛县",
					cityCode: "101140602"
				},
				{
					cityName: "巴青县",
					cityCode: "101140608"
				},
				{
					cityName: "札达县",
					cityCode: "101140706"
				},
				{
					cityName: "噶尔县",
					cityCode: "101140707"
				},
				{
					cityName: "日土县",
					cityCode: "101140708"
				},
				{
					cityName: "革吉县",
					cityCode: "101140709"
				},
				{
					cityName: "措勤县",
					cityCode: "101140710"
				},
				{
					cityName: "黄南藏族自治州",
					cityCode: "101150305"
				},
				{
					cityName: "东乡族自治县",
					cityCode: "101161106"
				},
				{
					cityName: "积石山保安族东乡族撒拉族自治县",
					cityCode: "101161107"
				},
				{
					cityName: "嘉峪关市",
					cityCode: "101161401"
				},
				{
					cityName: "石龙区",
					cityCode: "101180508"
				},
				{
					cityName: "义马市",
					cityCode: "101181705"
				},
				{
					cityName: "锡山区",
					cityCode: "101190204"
				},
				{
					cityName: "武进区",
					cityCode: "101191104"
				},
				{
					cityName: "宿豫区",
					cityCode: "101191305"
				},
				{
					cityName: "东西湖区",
					cityCode: "101200106"
				},
				{
					cityName: "梁子湖区",
					cityCode: "101200302"
				},
				{
					cityName: "孝昌县",
					cityCode: "101200407"
				},
				{
					cityName: "团风县",
					cityCode: "101200510"
				},
				{
					cityName: "铁山区",
					cityCode: "101200604"
				},
				{
					cityName: "下陆区",
					cityCode: "101200605"
				},
				{
					cityName: "西塞山区",
					cityCode: "101200606"
				},
				{
					cityName: "茅箭区",
					cityCode: "101201108"
				},
				{
					cityName: "张湾区",
					cityCode: "101201109"
				},
				{
					cityName: "掇刀区",
					cityCode: "101201404"
				},
				{
					cityName: "沙洋县",
					cityCode: "101201405"
				},
				{
					cityName: "临海市",
					cityCode: "101210610"
				},
				{
					cityName: "椒江区",
					cityCode: "101210611"
				},
				{
					cityName: "黄岩区",
					cityCode: "101210612"
				},
				{
					cityName: "路桥区",
					cityCode: "101210613"
				},
				{
					cityName: "松阳县",
					cityCode: "101210808"
				},
				{
					cityName: "景宁畲族自治县",
					cityCode: "101210809"
				},
				{
					cityName: "衢江区",
					cityCode: "101211006"
				},
				{
					cityName: "潘集区",
					cityCode: "101220403"
				},
				{
					cityName: "涵江区",
					cityCode: "101230404"
				},
				{
					cityName: "秀屿区",
					cityCode: "101230405"
				},
				{
					cityName: "荔城区",
					cityCode: "101230406"
				},
				{
					cityName: "城厢区",
					cityCode: "101230407"
				},
				{
					cityName: "石狮市",
					cityCode: "101230510"
				},
				{
					cityName: "玉山县",
					cityCode: "101240312"
				},
				{
					cityName: "赣县区",
					cityCode: "101240718"
				},
				{
					cityName: "浮梁县",
					cityCode: "101240803"
				},
				{
					cityName: "上栗县",
					cityCode: "101240903"
				},
				{
					cityName: "安源区",
					cityCode: "101240904"
				},
				{
					cityName: "芦溪县",
					cityCode: "101240905"
				},
				{
					cityName: "湘东区",
					cityCode: "101240906"
				},
				{
					cityName: "望城区",
					cityCode: "101250105"
				},
				{
					cityName: "苏仙区",
					cityCode: "101250512"
				},
				{
					cityName: "津市市",
					cityCode: "101250608"
				},
				{
					cityName: "武陵源区",
					cityCode: "101251104"
				},
				{
					cityName: "中方县",
					cityCode: "101251212"
				},
				{
					cityName: "洪江市",
					cityCode: "101251213"
				},
				{
					cityName: "云岩区",
					cityCode: "101260110"
				},
				{
					cityName: "南明区",
					cityCode: "101260111"
				},
				{
					cityName: "红花岗区",
					cityCode: "101260215"
				},
				{
					cityName: "黔西市",
					cityCode: "101260708"
				},
				{
					cityName: "达川区",
					cityCode: "101270608"
				},
				{
					cityName: "东兴区",
					cityCode: "101271202"
				},
				{
					cityName: "九龙县",
					cityCode: "101271805"
				},
				{
					cityName: "浈江区",
					cityCode: "101280210"
				},
				{
					cityName: "武江区",
					cityCode: "101280211"
				},
				{
					cityName: "高明区",
					cityCode: "101280804"
				},
				{
					cityName: "坡头区",
					cityCode: "101281008"
				},
				{
					cityName: "霞山区",
					cityCode: "101281009"
				},
				{
					cityName: "麻章区",
					cityCode: "101281010"
				},
				{
					cityName: "江海区",
					cityCode: "101281109"
				},
				{
					cityName: "东源县",
					cityCode: "101281206"
				},
				{
					cityName: "清新区",
					cityCode: "101281308"
				},
				{
					cityName: "云安区",
					cityCode: "101281406"
				},
				{
					cityName: "潮安区",
					cityCode: "101281503"
				},
				{
					cityName: "阳东区",
					cityCode: "101281803"
				},
				{
					cityName: "阳西县",
					cityCode: "101281804"
				},
				{
					cityName: "揭东区",
					cityCode: "101281905"
				},
				{
					cityName: "河口瑶族自治县",
					cityCode: "101290313"
				},
				{
					cityName: "富宁县",
					cityCode: "101290608"
				},
				{
					cityName: "普洱市",
					cityCode: "101290901"
				},
				{
					cityName: "水富市",
					cityCode: "101291011"
				},
				{
					cityName: "合山市",
					cityCode: "101300406"
				},
				{
					cityName: "长洲区",
					cityCode: "101300607"
				},
				{
					cityName: "兴业县",
					cityCode: "101300906"
				},
				{
					cityName: "大化瑶族自治县",
					cityCode: "101301211"
				},
				{
					cityName: "新竹",
					cityCode: "101340103"
				},
				{
					cityName: "宜兰",
					cityCode: "101340104"
				},
				{
					cityName: "苗栗",
					cityCode: "101340402"
				},
				{
					cityName: "彰化",
					cityCode: "101340403"
				},
				{
					cityName: "南投",
					cityCode: "101340404"
				},
				{
					cityName: "花莲",
					cityCode: "101340405"
				},
				{
					cityName: "云林",
					cityCode: "101340406"
				}
			]
		};
	},
	mounted() {},
	methods: {
		getInfo(item) {
			axios
				.get(`/api/${item}`)
				.then(res => {
					console.log("res === ", res);
					if (res.data.status === 200) {
						this.cityInfo = res.data.cityInfo;
						let obj = {
							cityName: res.data.cityInfo.city,
							cityCode: res.data.cityInfo.citykey
						};
						this.cityInfo.push(obj);
						// this.yesterdayInfo = res.data.data.yesterday;
						// this.queryInfoList = res.data.data.forecast;
						// this.todayAirObj = {
						// 	ganmao: res.data.data.ganmao,
						// 	pm10: res.data.data.pm10,
						// 	pm25: res.data.data.pm25,
						// 	quality: res.data.data.quality,
						// 	shidu: res.data.data.shidu,
						// 	wendu: res.data.data.wendu
						// };
					} else {
						this.$message({
							message: res.data.message,
							type: "error"
						});
					}
				})
				.catch(err => {
					console.log("err === ", err);
					this.showResult = false;
					this.cityInfo = null;
				});
		},
		dealCityInfo() {
			this.arr.forEach(item => {
				this.getInfo(item);
			});
		},
		// ====================================================================
		async fetchData() {
			try {
				const response = await axios.get(`/api/${this.arr[this.currentIndex]}`);
				let obj = {
					cityName: response.data.cityInfo.city,
					cityCode: response.data.cityInfo.citykey
				};
				this.cityInfo.push(obj);
				// 模拟处理数据
				// 先生成 1000 到 4000 的随机值
				let num = 8000 + Math.floor(Math.random() * (4000 - 1000 + 1)) + 1000;
				// 等待 5 秒后继续调用下一个接口
				await new Promise(resolve => setTimeout(resolve, num));
				this.nextRequest();
			} catch (error) {
				console.error("查询不到的code === ", this.arr[this.currentIndex]);
				this.errorCode.push(this.arr[this.currentIndex]);
				console.log("this.errorCode === ", this.errorCode);
				this.nextRequest();
			}
		},
		nextRequest() {
			this.currentIndex++;
			if (this.currentIndex < this.arr.length) {
				this.fetchData();
				console.log("this.cityInfo 111=== ", this.cityInfo);
			} else {
				console.log("this.cityInfo 222=== ", this.cityInfo);
				console.log("All requests have been completed.");
			}
		}
	}
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
