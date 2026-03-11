<template>
	<div>
		<div class="title1">点击地图获取当地（县或市）级的天气信息</div>
		<div class="title2"></div>
		<div>
			<mapGau @getLat_long="getLat_long" @getAddress="getAddress" />
		</div>
		<div class="partTwo" v-if="currentWeather['体感']">
			<h1 class="title">天气信息————{{ address }}</h1>
			<div class="now now1">
				当前天气————{{ currentWeather["天气"] }}&nbsp;&nbsp;&nbsp;&nbsp;
				<div>
					<span>体感：{{ currentWeather["体感"] }}</span>
				</div>
				<div>
					<span>大气压：{{ currentWeather["大气压"] }}</span>
				</div>
				<div>
					<span>温度：{{ currentWeather["温度"] }}</span>
				</div>
				<div>
					<span>湿度：{{ currentWeather["湿度"] }}</span>
				</div>
				<div>
					<span>紫外线指数：{{ currentWeather["紫外线指数"] }}</span>
				</div>
				<div>
					<span>风速：{{ currentWeather["风速"] }}</span
					>&nbsp;&nbsp;&nbsp;&nbsp; <span>风向：{{ windDirection["风向"] }}</span
					>&nbsp;&nbsp;&nbsp;&nbsp;
					<span>风向角度：{{ windDirection["角度"] }}</span>
				</div>
			</div>
			<!-- 空气质量 -->
			<div class="airNow">
				<div class="title">
					<span class="desc1">空气质量————&nbsp;{{ airQuality["质量"] }}</span>
				</div>
				<div>
					<span class="desc1">desc：{{ airQuality["desc"] }}</span>
				</div>
				<div class="airNow_item">
					<div class="item">
						<span>aqi：{{ airQuality["aqi"] }}</span>
					</div>
					<div class="item">
						<span>pm10：{{ airQuality["pm10"] }}</span>
					</div>
					<div class="item">
						<span>pm25：{{ airQuality["pm25"] }}</span>
					</div>
					<div class="item">
						<span>CO：{{ airQuality["co"] }}</span>
					</div>
					<div class="item">
						<span>NO2：{{ airQuality["no2"] }}</span>
					</div>
					<div class="item">
						<span>03：{{ airQuality["o3"] }}</span>
					</div>
					<div class="item">
						<span>SO2：{{ airQuality["so2"] }}</span>
					</div>
				</div>
			</div>
			<!-- 降雨预报 -->
			<div class="now" v-if="isShowFainfallForecast">
				降雨预报————
				<div>
					<span class="desc">出行建议：{{ rainfallForecast["出行建议"] }}</span>
				</div>
				<div>
					<span>最大概率：{{ rainfallForecast["最大概率"] }}</span>
				</div>
				<div>
					<span>预测：{{ rainfallForecast["预测"] }}</span>
				</div>
				<div>
					<span>更新时间：{{ rainfallForecast["更新时间"] }}</span>
				</div>
			</div>
			<template v-if="Array.isArray(warnMsgList) && warnMsgList.length">
				<!-- 预警信息 warnMsgList-->
				<div class="warning">
					<div v-for="(item, index) in warnMsgList" :key="index" class="warning_item">
						<div class="title">
							{{ item["标题"] }}&nbsp;&nbsp;&nbsp;&nbsp;<span>发布时间：{{ item["发布时间"] }}</span
							>&nbsp;&nbsp;&nbsp;&nbsp; <span>等级：{{ item["等级"] }}</span
							>&nbsp;&nbsp;&nbsp;&nbsp; <span>类型：{{ item["类型"] }}</span>
						</div>
						<div class="content">
							{{ item["内容"] }}
						</div>
					</div>
				</div>
			</template>
			<!-- 单位说明 -->
			<div class="now">
				单位说明：
				<div>
					<span>气压单位：{{ ATMOS }}</span>
				</div>
				<div>
					<span>温度单位：{{ temperatureUnit }}</span>
				</div>
				<div>
					<span>湿度单位：{{ humidityUnit }}</span>
				</div>
				<div>
					<span>风速单位：{{ windSpeedUnit }}</span>
				</div>
			</div>
			<!-- 小时预报 -->
			<div class="hour">
				<div class="title">
					小时预报
				</div>

				<div v-for="(item, index) in hourList" :key="item.key" class="hour_item">
					<template v-if="index < hourList.length - 1">
						<span>时间：{{ item.key }}点</span> &nbsp;&nbsp;&nbsp;&nbsp; <span>天气：{{ item.value["天气"] }}</span
						>&nbsp;&nbsp;&nbsp;&nbsp; <span>温度：{{ item.value["温度"] }}</span
						>&nbsp;&nbsp;&nbsp;&nbsp; <span>风向：{{ item.value["风向"] }}</span
						>&nbsp;&nbsp;&nbsp;&nbsp; <span>风向度数：{{ item.value["风向度数"] }}</span
						>&nbsp;&nbsp;&nbsp;&nbsp;
						<span>风速：{{ item.value["风速"] }}</span>
					</template>
				</div>
			</div>

			<hr />
			<!-- 未来天气 -->
			<div class="future">
				<div class="title">
					未来天气
				</div>
				<div v-for="(item, index) in futureWeatherList" :key="item.key" class="future_item">
					<template v-if="index < futureWeatherList.length - 1">
						<span>{{ item.key }}日</span> &nbsp;&nbsp;&nbsp;&nbsp; <span>天气：{{ item.value["天气"] }}</span
						>&nbsp;&nbsp;&nbsp;&nbsp; <span class="sunrise">日出：{{ item.value["日出"] }}</span
						>&nbsp;&nbsp;&nbsp;&nbsp; <span class="sunset">日落：{{ item.value["日落"] }}</span
						>&nbsp;&nbsp;&nbsp;&nbsp; <span>最低温度：{{ item.value["最低温度"] }}</span
						>&nbsp;&nbsp;&nbsp;&nbsp; <span>最高温度：{{ item.value["最高温度"] }}</span
						>&nbsp;&nbsp;&nbsp;&nbsp; <span>空气质量：{{ item.value["空气质量"] }}</span> &nbsp;&nbsp;&nbsp;&nbsp; <span>aqi：{{ item.value["aqi"] }}</span>
					</template>
				</div>
			</div>
			<div class="time">更新时间：{{ upDateTime }}</div>
			<div>
				<span>数据来源：{{ airQuality["数据来源"] }}</span>
			</div>
		</div>
	</div>
</template>
<script>
import mapGau from "@/views/mapGaud/mapGaud.vue";
import axios from "axios";
import _ from "lodash";
export default {
	name: "weatherAndMapPro",
	components: {
		mapGau
	},
	data() {
		return {
			district: "陇川县",
			accurateAddressObj: null,
			addressInfo: "",
			hourList: [], // 小时预报
			futureWeatherList: [], // 未来预报
			currentWeather: {}, // 当前天气
			airQuality: {}, // 空气质量
			rainfallForecast: {}, // 降雨预报
			isShowFainfallForecast: false,
			warnMsgList: [], // 预警信息
			windSpeedUnit: "", // 风速单位
			address: "", // 地址
			mapAddress: "",
			upDateTime: "", // 更新时间
			windDirection: {}, // 风向角度
			ATMOS: "", // 气压单位
			temperatureUnit: "", // 温度单位、
			humidityUnit: "", // 湿度单位
			windSpeedUnit: "" // 风速单位
		};
	},
	methods: {
		getLat_long(param) {
			console.log("经度纬度的param === ", param);
			this.accurateAddressObj = param;
			this.getWeatherInfo();
		},
		getAddress(param) {
			console.log("param === ", param);
			this.mapAddress = param;
		},
		getWeatherInfo: _.debounce(function() {
			this.isShowFainfallForecast = false;
			let { lng, lat } = this.accurateAddressObj;
			axios
				.get(`/kkk?lng=${lng}&lat=${lat}`)
				.then(res => {
					if (res.status === 200) {
						this.address = res.data["地址"] ? res.data["地址"] : this.mapAddress;
						this.upDateTime = res.data["更新时间"];
						let { data } = res.data;
						console.log("res === ", res);
						this.currentWeather = data["现在"]; // 当前天气
						this.windDirection = this.currentWeather["风向"];
						this.hourList = this.changeToArray(data["小时预报"]);
						// console.log("this.hourList === ", this.hourList);
						this.futureWeatherList = this.changeToArray(data["未来预报"]);
						console.log("this.futureWeatherList === ", this.futureWeatherList);
						this.airQuality = data["空气质量"];
						this.rainfallForecast = data["降雨预报"];
						let arr = ["出行建议", "更新时间", "最大概率", "预测"];
						arr.forEach(item => {
							if (this.rainfallForecast[item] && this.rainfallForecast[item].replace(/\s+/g, "")) {
								this.isShowFainfallForecast = true;
							}
						});
						if (Array.isArray(data["预警信息"]) && data["预警信息"].length) {
							this.warnMsgList = data["预警信息"];
						} else {
							this.warnMsgList = [];
						}
						this.ATMOS = data["气压单位"];
						this.temperatureUnit = data["温度单位"];
						this.humidityUnit = data["湿度单位"];
						this.windSpeedUnit = data["风速单位"];
					} else {
						throw new Error("接口报错");
					}
				})
				.catch(err => {
					console.log("err === ", err);
				});
		}, 2000),

		changeToArray(param) {
			let keys = Object.keys(param);
			let arr = [];
			keys.forEach(item => {
				let obj = {
					key: item,
					value: param[item]
				};
				arr.push(obj);
			});
			return arr;
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
.partTwo {
	.now {
		margin-top: 20px;
		margin-bottom: 20px;
		display: flex;
		font-size: 20px;
		margin-left: 20px;
		div {
			margin-right: 20px;
		}
	}
	.time {
		width: 20%;
		color: red;
		font-size: 20px;
		font-weight: bold;
	}
}
.hour {
	margin-left: 20px;
	.title {
		font-size: 20px;
		font-weight: bold;
	}
	.hour_item {
		span {
			display: inline-block;
			width: 10%;
		}

		.lastSpan {
			width: 20%;
			color: red;
			font-size: 20px;
			font-weight: bold;
		}
	}
	.hour_item:nth-child(even) {
		background-color: #e3e795;
	}
}
.future {
	margin-left: 20px;
	.title {
		font-size: 20px;
		font-weight: bold;
	}
	.future_item {
		.first {
			width: 30%;
		}
		span {
			display: inline-block;
			width: 8%;
		}

		.lastSpan {
			width: 20%;
			color: red;
			font-size: 20px;
			font-weight: bold;
		}
	}
	.future_item:nth-child(even) {
		background-color: #e3e795;
	}
}
.sunrise,
.sunset {
	width: 20% !important;
}
.desc {
	font-size: 20px;
	font-weight: bold;
	color: red;
	margin-left: 20px;
}
.desc1 {
	font-size: 20px;
	font-weight: bold;
	color: red;
}
.warning {
	margin-top: 20px;
	margin-bottom: 20px;
	.warning_item {
		background-color: #e3e795;
		.title {
			text-align: center;
			font-size: 20px;
			font-weight: bold;
			color: red;
		}
		.content {
			font-size: 18px;
			line-height: 25px;
			text-indent: 2em; /* 首行缩进两个字符的宽度 */
			padding-top: 10px;
			padding-bottom: 15px;
		}
	}
}
.airNow {
	margin-left: 20px;
	.airNow_item {
		display: flex;
		.item {
			width: 10%;
			text-align: center;
			font-size: 16px;
			font-weight: bold;
			margin-right: 20px;
		}
		.item:nth-child(1) {
			text-align: left;
		}
	}
}
.now1 {
	color: red;
}
</style>
