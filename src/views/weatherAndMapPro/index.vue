<template>
	<div class="weather-container">
		<div class="title-main">点击地图获取当地（县或市）级的天气信息</div>
		<div class="title-sub">请在地图上点击选择位置</div>
		<div class="map-section">
			<mapGau @getLat_long="getLat_long" @getAddress="getAddress" />
		</div>

		<div class="weather-content" v-if="currentWeather['体感']">
			<!-- 标题 -->
			<div class="content-header">
				<h1 class="location-title">
					<i class="icon-location"></i>
					{{ address }}
				</h1>
				<div class="update-time">更新时间：{{ upDateTime }}</div>
			</div>

			<!-- 当前天气卡片 -->
			<div class="weather-card current-weather">
				<div class="card-header">
					<h2><i class="icon-sun"></i> 当前天气</h2>
				</div>
				<div class="current-weather-grid">
					<div class="weather-item main-weather">
						<div class="weather-icon-large">
							{{ getWeatherIcon(currentWeather["天气"]) }}
						</div>
						<div class="temp-display">{{ currentWeather["温度"] }}</div>
						<div class="weather-desc">{{ currentWeather["天气"] }}</div>
					</div>

					<div class="weather-details">
						<div class="detail-row">
							<div class="detail-item">
								<span class="detail-label"><i class="icon-feel"></i> 体感温度</span>
								<span class="detail-value">{{ currentWeather["体感"] }}</span>
							</div>
							<div class="detail-item">
								<span class="detail-label"><i class="icon-pressure"></i> 大气压</span>
								<span class="detail-value">{{ currentWeather["大气压"] }}</span>
							</div>
						</div>

						<div class="detail-row">
							<div class="detail-item">
								<span class="detail-label"><i class="icon-humidity"></i> 湿度</span>
								<span class="detail-value">{{ currentWeather["湿度"] }}</span>
							</div>
							<div class="detail-item">
								<span class="detail-label"><i class="icon-uv"></i> 紫外线指数</span>
								<span class="detail-value">{{ currentWeather["紫外线指数"] }}</span>
							</div>
						</div>

						<div class="detail-row wind-info">
							<div class="detail-item">
								<span class="detail-label"><i class="icon-wind"></i> 风速</span>
								<span class="detail-value">{{ currentWeather["风速"] }}</span>
							</div>
							<div class="detail-item">
								<span class="detail-label"><i class="icon-direction"></i> 风向</span>
								<span class="detail-value">{{ windDirection["风向"] }}</span>
							</div>
							<div class="detail-item">
								<span class="detail-label"><i class="icon-angle"></i> 角度</span>
								<span class="detail-value">{{ windDirection["角度"] }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 空气质量卡片 -->
			<div class="weather-card air-quality" :class="getAirQualityClass(airQuality['质量'])">
				<div class="card-header">
					<h2><i class="icon-air"></i> 空气质量</h2>
					<div class="air-quality-level">{{ airQuality["质量"] }}</div>
				</div>
				<div class="air-desc">{{ airQuality["desc"] }}</div>
				<div class="air-indexes">
					<div class="air-index-item">
						<div class="index-label">AQI</div>
						<div class="index-value">{{ airQuality["aqi"] }}</div>
					</div>
					<div class="air-index-item">
						<div class="index-label">PM2.5</div>
						<div class="index-value">{{ airQuality["pm25"] }}</div>
					</div>
					<div class="air-index-item">
						<div class="index-label">PM10</div>
						<div class="index-value">{{ airQuality["pm10"] }}</div>
					</div>
					<div class="air-index-item">
						<div class="index-label">CO</div>
						<div class="index-value">{{ airQuality["co"] }}</div>
					</div>
					<div class="air-index-item">
						<div class="index-label">NO₂</div>
						<div class="index-value">{{ airQuality["no2"] }}</div>
					</div>
					<div class="air-index-item">
						<div class="index-label">O₃</div>
						<div class="index-value">{{ airQuality["o3"] }}</div>
					</div>
					<div class="air-index-item">
						<div class="index-label">SO₂</div>
						<div class="index-value">{{ airQuality["so2"] }}</div>
					</div>
				</div>
			</div>

			<!-- 降雨预报 -->
			<div class="weather-card rainfall-forecast" v-if="isShowFainfallForecast">
				<div class="card-header">
					<h2><i class="icon-rain"></i> 降雨预报</h2>
				</div>
				<div class="rainfall-content">
					<div class="rainfall-item highlight">
						<i class="icon-suggestion"></i>
						<span class="rainfall-label">出行建议：</span>
						<span class="rainfall-value">{{ rainfallForecast["出行建议"] }}</span>
					</div>
					<div class="rainfall-item">
						<i class="icon-probability"></i>
						<span class="rainfall-label">最大概率：</span>
						<span class="rainfall-value">{{ rainfallForecast["最大概率"] }}</span>
					</div>
					<div class="rainfall-item">
						<i class="icon-forecast"></i>
						<span class="rainfall-label">预测：</span>
						<span class="rainfall-value">{{ rainfallForecast["预测"] }}</span>
					</div>
					<div class="rainfall-item">
						<i class="icon-update"></i>
						<span class="rainfall-label">更新时间：</span>
						<span class="rainfall-value">{{ rainfallForecast["更新时间"] }}</span>
					</div>
				</div>
			</div>

			<!-- 预警信息 -->
			<template v-if="Array.isArray(warnMsgList) && warnMsgList.length">
				<div class="weather-card warning-card" v-for="(item, index) in warnMsgList" :key="index">
					<div class="warning-header" :class="getWarningClass(item['等级'])">
						<div class="warning-title">
							<i class="icon-warning"></i>
							{{ item["标题"] }}
						</div>
						<div class="warning-meta">
							<span class="warning-level">{{ item["等级"] }}</span>
							<span class="warning-type">{{ item["类型"] }}</span>
							<span class="warning-time">{{ item["发布时间"] }}</span>
						</div>
					</div>
					<div class="warning-content">
						{{ item["内容"] }}
					</div>
				</div>
			</template>

			<!-- 小时预报 -->
			<div class="weather-card hour-forecast">
				<div class="card-header">
					<h2><i class="icon-hour"></i> 小时预报</h2>
				</div>
				<div class="hour-list">
					<div v-for="(item, index) in hourList" :key="item.key" class="hour-item">
						<template v-if="index < hourList.length - 1">
							<div class="hour-time">{{ item.key }}点</div>
							<div class="hour-weather">{{ item.value["天气"] }}</div>
							<div class="hour-temp">{{ item.value["温度"] }}</div>
							<div class="hour-wind">
								<div class="wind-direction">{{ item.value["风向"] }}</div>
								<div class="wind-speed">{{ item.value["风速"] }}</div>
							</div>
							<div class="hour-angle">{{ item.value["风向度数"] }}°</div>
						</template>
					</div>
				</div>
			</div>
			<!-- 未来天气 -->
			<div class="weather-card future-forecast">
				<div class="card-header">
					<h2><i class="icon-future"></i> 未来天气</h2>
				</div>
				<div class="future-list">

					<div v-for="(item, index) in futureWeatherList" :key="item.key" class="future-item">
						<template v-if="index < futureWeatherList.length - 1">
							<div class="future-date">{{ item.key }}日</div>
							<div class="future-weather">{{ item.value["天气"] }}</div>
							<div class="future-sun">
								<div class="sunrise">日出 {{ item.value["日出"] }}</div>
								<div class="sunset">日落 {{ item.value["日落"] }}</div>
							</div>
							<div class="future-temp">
								<div class="temp-low">{{ item.value["最低温度"] }}</div>
								<div class="temp-high">{{ item.value["最高温度"] }}</div>
							</div>
							<div class="future-air">
								<div class="air-quality-label">{{ item.value["空气质量"] }}</div>
								<div class="air-aqi">AQI: {{ item.value["aqi"] }}</div>
							</div>
						</template>
					</div>
				</div>
			</div>

			<!-- 单位说明 -->
			<div class="weather-card units-card">
				<div class="card-header">
					<h2><i class="icon-unit"></i> 单位说明</h2>
				</div>
				<div class="units-list">
					<div class="unit-item">
						<span class="unit-label">气压单位：</span>
						<span class="unit-value">{{ ATMOS }}</span>
					</div>
					<div class="unit-item">
						<span class="unit-label">温度单位：</span>
						<span class="unit-value">{{ temperatureUnit }}</span>
					</div>
					<div class="unit-item">
						<span class="unit-label">湿度单位：</span>
						<span class="unit-value">{{ humidityUnit }}</span>
					</div>
					<div class="unit-item">
						<span class="unit-label">风速单位：</span>
						<span class="unit-value">{{ windSpeedUnit }}</span>
					</div>
				</div>
			</div>

			<!-- 数据来源 -->
			<div class="data-source">
				<i class="icon-source"></i>
				数据来源：{{ airQuality["数据来源"] }}
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
			hourList: [],
			futureWeatherList: [],
			currentWeather: {},
			airQuality: {},
			rainfallForecast: {},
			isShowFainfallForecast: false,
			warnMsgList: [],
			windSpeedUnit: "",
			address: "",
			mapAddress: "",
			upDateTime: "",
			windDirection: {},
			ATMOS: "",
			temperatureUnit: "",
			humidityUnit: "",
			windSpeedUnit: ""
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
		getWeatherInfo: _.debounce(function () {
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
						this.currentWeather = data["现在"];
						this.windDirection = this.currentWeather["风向"];
						this.hourList = this.changeToArray(data["小时预报"]);
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
		},

		// 获取天气图标
		getWeatherIcon(weather) {
			const icons = {
				'晴': '☀️',
				'多云': '⛅',
				'阴': '☁️',
				'雨': '🌧️',
				'雪': '❄️',
				'雷阵雨': '⛈️',
				'雾': '🌫️',
				'风': '💨'
			};
			for (let key in icons) {
				if (weather.includes(key)) {
					return icons[key];
				}
			}
			return '🌤️';
		},

		// 空气质量样式
		getAirQualityClass(level) {
			const map = {
				'优': 'excellent',
				'良': 'good',
				'轻度污染': 'light',
				'中度污染': 'moderate',
				'重度污染': 'heavy',
				'严重污染': 'severe'
			};
			return map[level] || 'default';
		},

		// 预警样式
		getWarningClass(level) {
			const map = {
				'红色': 'red',
				'橙色': 'orange',
				'黄色': 'yellow',
				'蓝色': 'blue'
			};
			return map[level] || 'default';
		}
	}
};
</script>

<style scoped lang="scss">
.weather-container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
	font-family: 'Microsoft YaHei', 'Segoe UI', Arial, sans-serif;
	background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
	min-height: 100vh;
}

.title-main {
	text-align: center;
	font-size: 28px;
	font-weight: 600;
	color: #2c3e50;
	margin-bottom: 8px;
	padding: 15px;
	background: white;
	border-radius: 12px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title-sub {
	text-align: center;
	font-size: 16px;
	color: #666;
	margin-bottom: 30px;
}

.map-section {
	background: white;
	border-radius: 12px;
	padding: 15px;
	margin-bottom: 30px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.weather-content {
	.weather-card {
		background: white;
		border-radius: 12px;
		padding: 20px;
		margin-bottom: 20px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transition: transform 0.3s ease;

		&:hover {
			transform: translateY(-2px);
			box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
		}
	}
}

.content-header {
	background: white;
	border-radius: 12px;
	padding: 20px;
	margin-bottom: 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

	.location-title {
		margin: 0;
		font-size: 24px;
		color: #2c3e50;
		display: flex;
		align-items: center;

		.icon-location {
			margin-right: 10px;
			color: #e74c3c;
		}
	}

	.update-time {
		color: #7f8c8d;
		font-size: 14px;
	}
}

// 当前天气样式
.current-weather-grid {
	display: grid;
	grid-template-columns: 1fr 2fr;
	gap: 30px;

	.main-weather {
		text-align: center;
		padding: 20px;

		.weather-icon-large {
			font-size: 48px;
			margin-bottom: 10px;
		}

		.temp-display {
			font-size: 48px;
			font-weight: 700;
			color: #e74c3c;
			margin-bottom: 10px;
		}

		.weather-desc {
			font-size: 18px;
			color: #34495e;
		}
	}
}

.weather-details {
	.detail-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
		margin-bottom: 15px;

		&.wind-info {
			grid-template-columns: 1fr 1fr 1fr;
		}

		.detail-item {
			display: flex;
			flex-direction: column;
			padding: 15px;
			background: #f8f9fa;
			border-radius: 8px;

			.detail-label {
				font-size: 14px;
				color: #7f8c8d;
				margin-bottom: 5px;
				display: flex;
				align-items: center;

				i {
					margin-right: 5px;
				}
			}

			.detail-value {
				font-size: 18px;
				font-weight: 600;
				color: #2c3e50;
			}
		}
	}
}

// 空气质量卡片样式
.air-quality {
	&.excellent {
		border-left: 4px solid #27ae60;
	}

	&.good {
		border-left: 4px solid #2ecc71;
	}

	&.light {
		border-left: 4px solid #f39c12;
	}

	&.moderate {
		border-left: 4px solid #e67e22;
	}

	&.heavy {
		border-left: 4px solid #e74c3c;
	}

	&.severe {
		border-left: 4px solid #c0392b;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;

		.air-quality-level {
			font-size: 24px;
			font-weight: 700;
			padding: 8px 20px;
			border-radius: 25px;
			color: white;

			.excellent & {
				background: #27ae60;
			}

			.good & {
				background: #2ecc71;
			}

			.light & {
				background: #f39c12;
			}

			.moderate & {
				background: #e67e22;
			}

			.heavy & {
				background: #e74c3c;
			}

			.severe & {
				background: #c0392b;
			}
		}
	}

	.air-desc {
		font-size: 16px;
		color: #34495e;
		margin-bottom: 20px;
		padding: 15px;
		background: #f8f9fa;
		border-radius: 8px;
	}

	.air-indexes {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
		gap: 15px;

		.air-index-item {
			text-align: center;
			padding: 15px;
			background: #f8f9fa;
			border-radius: 8px;
			transition: transform 0.3s ease;

			&:hover {
				transform: translateY(-3px);
				background: #e8f4fc;
			}

			.index-label {
				font-size: 14px;
				color: #7f8c8d;
				margin-bottom: 8px;
			}

			.index-value {
				font-size: 20px;
				font-weight: 700;
				color: #2c3e50;
			}
		}
	}
}

// 降雨预报样式
.rainfall-content {
	.rainfall-item {
		display: flex;
		align-items: center;
		padding: 12px 0;
		border-bottom: 1px solid #eee;

		&:last-child {
			border-bottom: none;
		}

		&.highlight {
			.rainfall-value {
				color: #e74c3c;
				font-weight: 600;
			}
		}

		i {
			margin-right: 10px;
			color: #3498db;
		}

		.rainfall-label {
			font-size: 16px;
			color: #34495e;
			min-width: 100px;
		}

		.rainfall-value {
			font-size: 16px;
			color: #2c3e50;
			flex: 1;
		}
	}
}

// 预警信息样式
.warning-card {
	padding: 0;
	overflow: hidden;

	.warning-header {
		padding: 15px 20px;
		color: white;

		&.red {
			background: linear-gradient(135deg, #ff6b6b, #c0392b);
		}

		&.orange {
			background: linear-gradient(135deg, #ffa726, #f57c00);
		}

		&.yellow {
			background: linear-gradient(135deg, #ffee58, #fbc02d);
			color: #333;
		}

		&.blue {
			background: linear-gradient(135deg, #29b6f6, #0288d1);
		}

		&.default {
			background: linear-gradient(135deg, #78909c, #546e7a);
		}

		.warning-title {
			font-size: 18px;
			font-weight: 600;
			margin-bottom: 10px;
			display: flex;
			align-items: center;

			i {
				margin-right: 10px;
			}
		}

		.warning-meta {
			display: flex;
			gap: 20px;
			font-size: 14px;

			.warning-level {
				background: rgba(255, 255, 255, 0.2);
				padding: 2px 10px;
				border-radius: 12px;
			}
		}
	}

	.warning-content {
		padding: 20px;
		font-size: 16px;
		line-height: 1.6;
		color: #2c3e50;
		background: #f8f9fa;
	}
}

// 小时预报样式
.hour-list {
	display: flex;
	overflow-x: auto;
	gap: 15px;
	padding: 10px 0;

	.hour-item {
		flex: 0 0 auto;
		width: 140px;
		padding: 15px;
		background: #f8f9fa;
		border-radius: 8px;
		text-align: center;
		transition: all 0.3s ease;

		&:hover {
			background: #e8f4fc;
			transform: translateY(-3px);
		}

		.hour-time {
			font-size: 18px;
			font-weight: 600;
			color: #2c3e50;
			margin-bottom: 10px;
		}

		.hour-weather {
			font-size: 14px;
			color: #34495e;
			margin-bottom: 8px;
		}

		.hour-temp {
			font-size: 20px;
			font-weight: 700;
			color: #e74c3c;
			margin-bottom: 10px;
		}

		.hour-wind {
			font-size: 14px;
			color: #7f8c8d;

			.wind-speed {
				margin-top: 4px;
			}
		}

		.hour-angle {
			font-size: 12px;
			color: #95a5a6;
			margin-top: 8px;
		}
	}
}

// 未来天气样式
.future-list {
	.future-item {
		display: grid;
		grid-template-columns: 1fr 1fr 2fr 2fr 2fr;
		gap: 15px;
		padding: 15px;
		border-bottom: 1px solid #eee;
		align-items: center;

		&:last-child {
			border-bottom: none;
		}

		&:hover {
			background: #f8f9fa;
			border-radius: 8px;
		}

		.future-date {
			font-size: 18px;
			font-weight: 600;
			color: #2c3e50;
		}

		.future-weather {
			font-size: 16px;
			color: #34495e;
		}

		.future-sun {
			display: flex;
			flex-direction: column;
			gap: 5px;
			font-size: 14px;
			color: #7f8c8d;
		}

		.future-temp {
			display: flex;
			gap: 15px;

			.temp-low {
				color: #3498db;
				font-weight: 600;
			}

			.temp-high {
				color: #e74c3c;
				font-weight: 600;
			}
		}

		.future-air {
			.air-quality-label {
				font-size: 14px;
				color: #34495e;
				margin-bottom: 5px;
			}

			.air-aqi {
				font-size: 12px;
				color: #7f8c8d;
			}
		}
	}
}

// 单位说明样式
.units-list {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 15px;

	.unit-item {
		display: flex;
		justify-content: space-between;
		padding: 12px 15px;
		background: #f8f9fa;
		border-radius: 8px;

		.unit-label {
			color: #7f8c8d;
		}

		.unit-value {
			font-weight: 600;
			color: #2c3e50;
		}
	}
}

// 数据来源
.data-source {
	text-align: center;
	color: #7f8c8d;
	font-size: 14px;
	padding: 15px;
	background: white;
	border-radius: 8px;
	margin-top: 20px;

	.icon-source {
		margin-right: 8px;
		color: #3498db;
	}
}

// 图标样式
[class^="icon-"] {
	font-style: normal;
	display: inline-flex;
	align-items: center;
	justify-content: center;

	&:before {
		content: "•";
		font-size: 20px;
	}
}

.icon-location:before {
	content: "📍";
}

.icon-sun:before {
	content: "☀️";
}

.icon-feel:before {
	content: "🌡️";
}

.icon-pressure:before {
	content: "⚖️";
}

.icon-humidity:before {
	content: "💧";
}

.icon-uv:before {
	content: "☀️";
}

.icon-wind:before {
	content: "💨";
}

.icon-direction:before {
	content: "↗️";
}

.icon-angle:before {
	content: "📐";
}

.icon-air:before {
	content: "🌬️";
}

.icon-rain:before {
	content: "🌧️";
}

.icon-suggestion:before {
	content: "💡";
}

.icon-probability:before {
	content: "📊";
}

.icon-forecast:before {
	content: "🔮";
}

.icon-update:before {
	content: "🕒";
}

.icon-warning:before {
	content: "⚠️";
}

.icon-hour:before {
	content: "🕐";
}

.icon-future:before {
	content: "📅";
}

.icon-unit:before {
	content: "📏";
}

.icon-source:before {
	content: "📡";
}

// 响应式设计
@media (max-width: 768px) {
	.weather-container {
		padding: 10px;
	}

	.title-main {
		font-size: 20px;
		padding: 12px;
	}

	.current-weather-grid {
		grid-template-columns: 1fr;
		gap: 20px;
	}

	.weather-details .detail-row {
		grid-template-columns: 1fr;
		gap: 10px;

		&.wind-info {
			grid-template-columns: 1fr;
		}
	}

	.air-indexes {
		grid-template-columns: repeat(2, 1fr) !important;
	}

	.future-item {
		grid-template-columns: 1fr !important;
		gap: 10px !important;
		padding: 15px 10px !important;

		>div {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}

	.hour-item {
		width: 120px !important;
	}

	.content-header {
		flex-direction: column;
		gap: 10px;
		text-align: center;
	}
}
</style>