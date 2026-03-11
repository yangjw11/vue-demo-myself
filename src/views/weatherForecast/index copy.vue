<template>
	<div>
		<div class="title1">【天气预报】更新时间：{{ upDatetime }}</div>
		<div class="title2">输入框中选择你查询城市的名称，支持模糊搜索</div>
		<div>*敏感人群：老人、小孩、呼吸道疾病患者等</div>
		<div class="content">
			<div class="search">
				<el-input type="text" v-model="searchQuery" @input="filterCities" placeholder="搜索城市" />
				<ul v-show="showResult">
					<li class="search-li" v-for="(city, index) in filteredCities" :key="index" @click="query(city, 'input')">{{ city.cityName }} - {{ city.cityCode }}</li>
				</ul>
			</div>
			<div class="line"></div>
			<div class="cards">
				<template v-if="cityInfo">
					<div class="topTip">
						<h1>{{ cityInfo.parent }}——{{ cityInfo.city }}</h1>
						<h3>更新时间：{{ cityInfo.updateTime }}</h3>
					</div>
					<h1>查询结果</h1>
					<div class="cityTip">
						<h3>今日【{{ cityInfo.city }}】温馨提示：</h3>
						<span>温度：{{ todayAirObj.wendu }}℃</span>
						<span>湿度：{{ todayAirObj.shidu }}</span>
						<span>PM10：{{ todayAirObj.pm10 }}</span>
						<span>PM25：{{ todayAirObj.pm25 }}</span>
						<span>空气质量：{{ todayAirObj.quality }}</span>
						<span>综合评价：{{ todayAirObj.ganmao }}</span>
					</div>
					<div class="cardItemAll">
						<!-- queryInfoList -->
						<div class="cardItem" v-for="(item, index) in queryInfoList" :key="index">
							<div>
								<span>{{ item.ymd }}————</span>
								<span>{{ item.week }}</span>
							</div>
							<div>
								<span>天气：{{ item.type }}</span>
							</div>
							<div>
								<span>{{ item.high }}</span>
							</div>
							<div>
								<span>{{ item.low }}</span>
							</div>
							<div>
								<span>日出时间：{{ item.sunrise }}</span>
							</div>
							<div>
								<span>日落时间：{{ item.sunset }}</span>
							</div>
							<div>
								<span>风向：{{ item.fx }}</span>
							</div>
							<div>
								<span>风力：{{ item.fl }}</span>
							</div>
							<div>
								<span>aqi: {{ item.aqi }}</span>
							</div>
							<div>
								<span>{{ item.desc }}</span>
							</div>
							<div>
								<span>{{ item.notice }}</span>
							</div>
						</div>
					</div>
					<h1>昨日天气</h1>
					<div class="cardItemAll">
						<div class="cardItem">
							<div>
								<span>{{ yesterdayInfo.ymd }}————</span>
								<span>{{ yesterdayInfo.week }}</span>
							</div>
							<div>
								<span>天气：{{ yesterdayInfo.type }}</span>
							</div>
							<div>
								<span>{{ yesterdayInfo.high }}</span>
							</div>
							<div>
								<span>{{ yesterdayInfo.low }}</span>
							</div>
							<div>
								<span>日出时间：{{ yesterdayInfo.sunrise }}</span>
							</div>
							<div>
								<span>日落时间：{{ yesterdayInfo.sunset }}</span>
							</div>
							<div>
								<span>风向：{{ yesterdayInfo.fx }}</span>
							</div>
							<div>
								<span>风力：{{ yesterdayInfo.fl }}</span>
							</div>
							<div>
								<span>aqi: {{ yesterdayInfo.aqi }}</span>
							</div>
							<div>
								<span>{{ yesterdayInfo.desc }}</span>
							</div>
							<div>
								<span>{{ yesterdayInfo.notice }}</span>
							</div>
						</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>
<script>
import { cityInfoList } from "./index.js";
import { specialList } from "./specialList";
import axios from "axios";
import _ from "lodash";
export default {
	name: "weatherForecast",
	created() {
		this.cityList = cityInfoList;
		let myHometown = {
			cityName: "陇川",
			cityCode: "101291503"
		};
		this.query(myHometown);
	},
	data() {
		return {
			searchQuery: "",
			cityList: [],
			filteredCities: [],
			showResult: false,
			weatherInfoList: [],
			cityInfo: null,
			yesterdayInfo: {},
			queryInfoList: [],
			todayAirObj: {},
			district: "", // 县或县级市的名称
			city: "", // 市的名称
			errTimes: 1, // 错误次数
			upDatetime: "" // 更新时间
		};
	},
	methods: {
		filterCities() {
			if (this.searchQuery) {
				this.filteredCities = this.cityList.filter(city => {
					return city.cityName.includes(this.searchQuery.replace(/ /g, ""));
				});
			} else {
				this.filteredCities = [];
				this.showResult = false;
			}
			if (this.filteredCities.length) {
				this.showResult = true;
			}
		},
		query: _.debounce(function(city, type = null) {
			console.log("看看防抖执行情况");
			this.searchQuery = city.cityName;
			axios
				.get(`/api/${city.cityCode}`)
				.then(res => {
					this.showResult = false;
					console.log("res === ", res);
					if (res.data.status === 200) {
						this.cityInfo = res.data.cityInfo;
						this.yesterdayInfo = res.data.data.yesterday;
						this.yesterdayInfo.desc = this.dealAqi(this.yesterdayInfo.aqi);
						this.queryInfoList = res.data.data.forecast;
						this.upDatetime = res.data.time;
						// 通过aqi判断空气质量
						this.queryInfoList.forEach(item => {
							item.desc = this.dealAqi(item.aqi);
						});
						console.log("this.queryInfoList === ", this.queryInfoList);
						this.todayAirObj = {
							ganmao: res.data.data.ganmao,
							pm10: res.data.data.pm10,
							pm25: res.data.data.pm25,
							quality: res.data.data.quality,
							shidu: res.data.data.shidu,
							wendu: res.data.data.wendu
						};
					} else {
						this.$message({
							message: city.cityName + "-" + res.data.message,
							type: "error"
						});
						if (type === "map") {
							this.errTimes += 1;
							console.log(`${this.searchQuery} —— 这个地方查不到,现查询上级行政单位 —— ${this.city}`);
							if (this.errTimes > 2) return;
							this.handleName(this.city);
						}
					}
				})
				.catch(err => {
					console.log("err === ", err);
					this.showResult = false;
					this.cityInfo = null;
				});
		}, 1000),
		// 根据名称匹配县的code并查询
		queryByName(obj) {
			console.log("queryByName obj === ", obj);
			this.district = obj.district;
			this.city = obj.city;
			if (!this.district) {
				this.handleName(this.city);
				return;
			}
			console.log("获取到的县名称 === ", this.district);
			this.handleName(this.district);
		},
		// 对名字进行特殊处理
		handleName(name) {
			if (specialList.includes(name)) {
				this.searchQuery = name;
			} else {
				// 特殊情况 张家界 永定区 和 福建省龙岩市永定区 重复，所以张家界永定区直接查 张家界市
				if (this.city === "张家界市" && this.district === "永定区") {
					let obj = {
						cityName: "张家界市",
						cityCode: "101251101"
					};
					this.query(obj, "map");
					console.log(`${this.searchQuery} —— 这个地方查不到,现查询上级行政单位 —— ${this.city}`);
					return;
				}
				// 特殊情况，六盘水市钟山区和钟山县需要区别一下
				if (this.city === "六盘水市" && this.district === "钟山区") {
					let obj = {
						cityName: "六盘水",
						cityCode: "101260801"
					};
					this.query(obj, "map");
					console.log(`${this.searchQuery} —— 这个地方查不到,现查询上级行政单位 —— ${this.city}`);
					return;
				}
				if (this.city === "攀枝花市" && this.district === "东区") {
					let obj = {
						cityName: "攀枝花市",
						cityCode: "101270201"
					};
					this.query(obj, "map");
					console.log(`${this.searchQuery} —— 这个地方查不到,现查询上级行政单位 —— ${this.city}`);
					return;
				}
				// 北京通州 和 南通通州要区分开
				if (this.district === "通州区") {
					let obj;
					if (this.city === "南通市") {
						obj = {
							cityName: "通州（南通）",
							cityCode: "101190509"
						};
					} else {
						obj = {
							cityName: "通州（北京）",
							cityCode: "101010600"
						};
					}
					this.query(obj, "map");
					return;
				}

				// 辽宁省 朝阳市 朝阳县 默认查询朝阳市
				if (this.district === "朝阳县") {
					let obj = {
						cityName: "朝阳市",
						cityCode: "101070901"
					};
					this.query(obj, "map");
					console.log(`${this.searchQuery} —— 这个地方查不到,现查询上级行政单位 —— ${this.city}`);
					return;
				}

				if (this.district === "清河门区") {
					let obj = {
						cityName: "阜新市",
						cityCode: "101071201"
					};
					this.query(obj, "map");
					console.log(`${this.searchQuery} —— 这个地方查不到,现查询上级行政单位 —— ${this.city}`);
					return;
				}

				// 郊区比较特殊

				if (this.city === "阳泉市" && (this.district === "郊区" || this.district === "城区")) {
					let obj = {
						cityName: "阳泉市",
						cityCode: "101100301"
					};
					this.query(obj, "map");
					console.log(`${this.searchQuery} —— 这个地方查不到,现查询上级行政单位 —— ${this.city}`);
					return;
				}

				if (this.city === "大庆市" && this.district === "大同区") {
					let obj = {
						cityName: "大庆",
						cityCode: "101050901"
					};
					this.query(obj, "map");
					console.log(`${this.searchQuery} —— 这个地方查不到,现查询上级行政单位 —— ${this.city}`);
					return;
				}

				// 天津市 滨海新区 特殊处理，查天津市
				// if (this.district === "滨海新区") {
				// 	let obj = {
				// 		cityName: "天津市",
				// 		cityCode: "101031100"
				// 	};
				// 	this.query(obj, "map");
				// 	return;
				// }

				if (name.length > 2) {
					// 如果县的名称大于2，就去了最后一个
					this.searchQuery = name.slice(0, -1).slice(0, 2);
				} else {
					this.searchQuery = name;
				}
			}
			// 通过名称查询到气象码
			this.filteredCities = this.cityList.filter(city => {
				return city.cityName.includes(this.searchQuery.replace(/ /g, ""));
			});
			console.log("this.filteredCities === ", this.filteredCities);
			if (this.filteredCities.length === 1) {
				// 通过气象码查询天气
				this.query(this.filteredCities[0], "map");
			} else if (this.filteredCities.length === 0) {
				// 如果匹配不到，查上一级
				if (this.city) {
					console.log(`${this.searchQuery} —— 这个地方查不到,现查询上级行政单位 —— ${this.city}`);
					this.searchQuery = this.city;
					this.handleName(this.city);
					this.$message({
						message: `当前区域【${this.district}】查询不到，现查询上级行政单位【${this.city}】`,
						type: "warning"
					});
				}
			} else {
				// 如 白朗县 和 朗县 这种匹配到两个，就全匹配
				this.filteredCities = this.cityList.filter(city => {
					return city.cityName === this.searchQuery;
				});
				this.query(this.filteredCities[0], "map");
			}
		},
		dealAqi(param) {
			let str;
			switch (true) {
				case param < 50:
					str = "参加户外活动呼吸新鲜空气";
					break;
				case param < 100:
					str = "可以正常进行室外活动";
					break;
				case param < 150:
					str = "敏感人群减少体力消耗大的户外活动";
					break;
				case param < 200:
					str = "对敏感人群影响较大";
					break;
				case param < 250:
					str = "所有人应适当减少室外活动";
					break;
				case param > 300:
					str = "尽量不要留在室外";
					break;
				default:
					str = "暂无";
			}
			return str;
		}
	}
};
</script>

<style scoped lang="scss">
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
.content {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-around;
	text-align: center;
	.search {
		width: 20vw;
		background-color: #90c889;
		.search-li {
			cursor: pointer;
			padding: 20px;
		}
		.search-li:hover {
			background-color: #63a5ad;
		}
	}
	.line {
		width: 1px;
		height: 100%;
		border: 1px solid #3b3737;
	}
	.cards {
		width: 75vw;
		height: 100%;
		background-color: #c8c298;
		text-align: center;
		.cityTip {
			display: flex;
			justify-content: space-around;
			span {
				display: inline-block;
				display: flex;
				align-items: center;
			}
		}
		.cardItemAll {
			display: flex;
			// justify-content: space-between;
			flex-wrap: wrap;
			.cardItem {
				margin: 10px;
				border: #000 solid 1px;
				width: 280px;
				height: 360px;
				background-color: aqua;
				div {
					margin: 10px 0;
				}
			}
		}
	}
}
</style>
