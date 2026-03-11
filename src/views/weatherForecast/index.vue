<template>
	<div class="weather-container">
		<div class="weather-header">
			<div class="main-title">🌤️ 天气预报</div>
			<div class="update-time">更新时间：{{ upDatetime }}</div>
			<div class="subtitle">输入城市名称查询天气，支持模糊搜索</div>
			<div class="sensitive-tip">*敏感人群：老人、小孩、呼吸道疾病患者等</div>
		</div>

		<div class="weather-content">
			<div class="search-section">
				<div class="search-box">
					<el-input type="text" v-model="searchQuery" @input="filterCities" placeholder="请输入城市名称，如：北京、上海"
						class="search-input" size="large">
						<template #prefix>
							<i class="el-icon-search" style="margin-top: 13px;"></i>
						</template>
					</el-input>
					<ul v-show="showResult" class="search-results">
						<li v-for="(city, index) in filteredCities" :key="index" @click="query(city, 'input')" class="result-item">
							<span class="city-name">{{ city.cityName }}</span>
							<span class="city-code">{{ city.cityCode }}</span>
						</li>
					</ul>
				</div>

				<div class="search-tips">
					<div class="tip-item">💡 支持中文城市名搜索</div>
					<div class="tip-item">📍 点击搜索结果可查看详细天气</div>
				</div>
			</div>

			<div class="divider"></div>

			<div class="weather-display">
				<template v-if="cityInfo">
					<div class="city-header">
						<h1 class="city-title">{{ cityInfo.parent }} · {{ cityInfo.city }}</h1>
						<div class="update-info">更新时间：{{ cityInfo.updateTime }}</div>
					</div>

					<!-- 今日天气概况 -->
					<div class="today-overview">
						<h2 class="section-title">今日天气概况</h2>
						<div class="weather-summary">
							<div class="summary-item">
								<div class="summary-icon">🌡️</div>
								<div class="summary-content">
									<div class="summary-label">温度</div>
									<div class="summary-value">{{ todayAirObj.wendu }}℃</div>
								</div>
							</div>
							<div class="summary-item">
								<div class="summary-icon">💧</div>
								<div class="summary-content">
									<div class="summary-label">湿度</div>
									<div class="summary-value">{{ todayAirObj.shidu }}</div>
								</div>
							</div>
							<div class="summary-item">
								<div class="summary-icon">🌫️</div>
								<div class="summary-content">
									<div class="summary-label">空气质量</div>
									<div class="summary-value quality" :class="getQualityClass(todayAirObj.quality)">
										{{ todayAirObj.quality }}
									</div>
								</div>
							</div>
							<div class="summary-item">
								<div class="summary-icon">⚠️</div>
								<div class="summary-content">
									<div class="summary-label">温馨提示</div>
									<div class="summary-value">{{ todayAirObj.ganmao }}</div>
								</div>
							</div>
						</div>

						<div class="air-quality">
							<h3>空气质量指数</h3>
							<div class="aqi-details">
								<div class="aqi-item">
									<span class="aqi-label">PM2.5：</span>
									<span class="aqi-value">{{ todayAirObj.pm25 }}</span>
								</div>
								<div class="aqi-item">
									<span class="aqi-label">PM10：</span>
									<span class="aqi-value">{{ todayAirObj.pm10 }}</span>
								</div>
							</div>
						</div>
					</div>

					<!-- 未来天气预报 -->
					<div class="forecast-section">
						<h2 class="section-title">未来天气预测</h2>
						<div class="forecast-cards">
							<div v-for="(item, index) in queryInfoList" :key="index" class="forecast-card"
								:class="{ 'today-card': index === 0 }">
								<div class="card-header">
									<div class="date">{{ item.ymd }}</div>
									<div class="week">{{ item.week }}</div>
								</div>
								<div class="weather-type">{{ item.type }}</div>
								<div class="temperature">
									<span class="high">{{ item.high }}</span>
									<span class="low">{{ item.low }}</span>
								</div>
								<div class="weather-details">
									<div class="detail-item">
										<span class="detail-label">风向：</span>
										<span class="detail-value">{{ item.fx }}</span>
									</div>
									<div class="detail-item">
										<span class="detail-label">风力：</span>
										<span class="detail-value">{{ item.fl }}</span>
									</div>
									<div class="detail-item">
										<span class="detail-label">空气质量：</span>
										<span class="detail-value aqi-tag" :class="getAqiClass(item.aqi)">
											{{ item.aqi }}
										</span>
									</div>
									<div class="detail-item full-width">
										<span class="detail-label">建议：</span>
										<span class="detail-value">{{ item.notice }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- 昨日天气 -->
					<div class="yesterday-section">
						<h2 class="section-title">昨日天气回顾</h2>
						<div class="yesterday-card">
							<div class="yesterday-header">
								<div class="date">{{ yesterdayInfo.ymd }}</div>
								<div class="week">{{ yesterdayInfo.week }}</div>
							</div>
							<div class="yesterday-content">
								<div class="yesterday-item">
									<span class="label">天气状况：</span>
									<span class="value">{{ yesterdayInfo.type }}</span>
								</div>
								<div class="yesterday-item">
									<span class="label">温度：</span>
									<span class="value">{{ yesterdayInfo.high }} / {{ yesterdayInfo.low }}</span>
								</div>
								<div class="yesterday-item">
									<span class="label">日出日落：</span>
									<span class="value">{{ yesterdayInfo.sunrise }} - {{ yesterdayInfo.sunset }}</span>
								</div>
								<div class="yesterday-item">
									<span class="label">风向风力：</span>
									<span class="value">{{ yesterdayInfo.fx }} {{ yesterdayInfo.fl }}</span>
								</div>
								<div class="yesterday-item">
									<span class="label">空气质量：</span>
									<span class="value">{{ yesterdayInfo.aqi }}</span>
								</div>
								<div class="yesterday-item full-width">
									<span class="label">综合评价：</span>
									<span class="value">{{ yesterdayInfo.desc }}</span>
								</div>
							</div>
						</div>
					</div>
				</template>

				<!-- 初始状态 -->
				<div v-else class="empty-state">
					<div class="empty-icon">🌤️</div>
					<h3>选择城市查看天气</h3>
					<p>在左侧搜索框中输入城市名称，开始查询天气信息</p>
				</div>
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
			district: "",
			city: "",
			errTimes: 1,
			upDatetime: ""
		};
	},
	methods: {
		filterCities() {
			if (this.searchQuery) {
				this.filteredCities = this.cityList.filter(city => {
					return city.cityName.includes(this.searchQuery.replace(/ /g, ""));
				}).slice(0, 10); // 限制显示数量
			} else {
				this.filteredCities = [];
				this.showResult = false;
			}
			if (this.filteredCities.length) {
				this.showResult = true;
			}
		},
		query: _.debounce(function (city, type = null) {
			console.log("查询天气数据");
			this.searchQuery = city.cityName;
			axios
				.get(`/api/${city.cityCode}`)
				.then(res => {
					this.showResult = false;
					if (res.data.status === 200) {
						this.cityInfo = res.data.cityInfo;
						this.yesterdayInfo = res.data.data.yesterday;
						this.yesterdayInfo.desc = this.dealAqi(this.yesterdayInfo.aqi);
						this.queryInfoList = res.data.data.forecast;
						this.upDatetime = res.data.time;

						this.queryInfoList.forEach(item => {
							item.desc = this.dealAqi(item.aqi);
						});

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
		}, 500),
		queryByName(obj) {
			console.log("queryByName obj === ", obj);
			this.district = obj.district;
			this.city = obj.city;
			if (!this.district) {
				this.handleName(this.city);
				return;
			}
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
		},
		getQualityClass(quality) {
			if (!quality) return '';
			if (quality.includes('优')) return 'quality-excellent';
			if (quality.includes('良')) return 'quality-good';
			if (quality.includes('污染')) return 'quality-polluted';
			return '';
		},
		getAqiClass(aqi) {
			if (aqi < 50) return 'aqi-excellent';
			if (aqi < 100) return 'aqi-good';
			if (aqi < 150) return 'aqi-moderate';
			if (aqi < 200) return 'aqi-poor';
			return 'aqi-very-poor';
		}
	}
};
</script>

<style scoped lang="scss">
.weather-container {
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	min-height: 100vh;
	padding: 20px;
}

.weather-header {
	text-align: center;
	color: white;
	margin-bottom: 30px;
	padding: 20px;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 20px;
	backdrop-filter: blur(10px);
	border: 1px solid rgba(255, 255, 255, 0.2);

	.main-title {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 10px;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
	}

	.update-time {
		font-size: 1rem;
		opacity: 0.9;
		margin-bottom: 15px;
	}

	.subtitle {
		font-size: 1.1rem;
		margin-bottom: 10px;
		font-weight: 500;
	}

	.sensitive-tip {
		font-size: 0.9rem;
		opacity: 0.8;
		font-style: italic;
	}
}

.weather-content {
	display: flex;
	gap: 30px;
	max-width: 1400px;
	margin: 0 auto;

	@media (max-width: 1024px) {
		flex-direction: column;
	}
}

.search-section {
	flex: 0 0 300px;
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.search-box {
	position: relative;
}

.search-input {
	:deep(.el-input__wrapper) {
		background: rgba(255, 255, 255, 0.9);
		border: 2px solid transparent;
		border-radius: 12px;
		padding: 12px 20px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;

		&:hover {
			background: white;
			border-color: #667eea;
			box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
		}

		&.is-focus {
			background: white;
			border-color: #764ba2;
			box-shadow: 0 8px 25px rgba(118, 75, 162, 0.3);
		}
	}

	:deep(.el-input__inner) {
		font-size: 1rem;
		color: #333;
	}

	:deep(.el-input__prefix) {
		color: #667eea;
		margin-right: 10px;
	}
}

.search-results {
	position: absolute;
	top: calc(100% + 5px);
	left: 0;
	right: 0;
	background: white;
	border-radius: 12px;
	box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
	z-index: 1000;
	max-height: 400px;
	overflow-y: auto;
	padding: 10px 0;
	margin: 0;
	list-style: none;
	border: 1px solid #e4e7ed;
}

.result-item {
	padding: 12px 20px;
	cursor: pointer;
	display: flex;
	justify-content: space-between;
	align-items: center;
	transition: all 0.2s ease;
	border-bottom: 1px solid #f5f7fa;

	&:last-child {
		border-bottom: none;
	}

	&:hover {
		background: linear-gradient(90deg, #667eea15 0%, #764ba215 100%);
		transform: translateX(5px);
	}

	.city-name {
		font-size: 1rem;
		color: #333;
		font-weight: 500;
	}

	.city-code {
		font-size: 0.85rem;
		color: #667eea;
		background: #f0f2ff;
		padding: 2px 8px;
		border-radius: 10px;
	}
}

.search-tips {
	background: rgba(255, 255, 255, 0.9);
	border-radius: 12px;
	padding: 20px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

	.tip-item {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 10px;
		color: #666;
		font-size: 0.9rem;

		&:last-child {
			margin-bottom: 0;
		}
	}
}

.divider {
	flex: 0 0 1px;
	background: rgba(255, 255, 255, 0.2);
	margin: 0 10px;

	@media (max-width: 1024px) {
		width: 100%;
		height: 1px;
		margin: 20px 0;
	}
}

.weather-display {
	flex: 1;
	background: rgba(255, 255, 255, 0.95);
	border-radius: 20px;
	padding: 30px;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
	overflow: hidden;
}

.city-header {
	text-align: center;
	margin-bottom: 40px;
	padding-bottom: 20px;
	border-bottom: 2px solid #f0f2ff;

	.city-title {
		font-size: 2.2rem;
		color: #333;
		margin-bottom: 10px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.update-info {
		color: #666;
		font-size: 0.95rem;
	}
}

.section-title {
	font-size: 1.5rem;
	color: #333;
	margin: 30px 0 20px;
	padding-bottom: 10px;
	border-bottom: 2px solid #667eea;
	display: inline-block;
}

.today-overview {
	background: linear-gradient(135deg, #f6f8ff 0%, #f0f2ff 100%);
	border-radius: 16px;
	padding: 25px;
	margin-bottom: 30px;
}

.weather-summary {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 20px;
	margin-bottom: 25px;
}

.summary-item {
	display: flex;
	align-items: center;
	gap: 15px;
	padding: 20px;
	background: white;
	border-radius: 12px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
	transition: transform 0.3s ease;

	&:hover {
		transform: translateY(-5px);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
	}

	.summary-icon {
		font-size: 2rem;
	}

	.summary-content {
		flex: 1;

		.summary-label {
			font-size: 0.9rem;
			color: #666;
			margin-bottom: 5px;
		}

		.summary-value {
			font-size: 1.4rem;
			font-weight: 600;
			color: #333;

			&.quality {
				padding: 4px 12px;
				border-radius: 20px;
				font-size: 1rem;

				&.quality-excellent {
					background: #e8f5e9;
					color: #2e7d32;
				}

				&.quality-good {
					background: #fff3e0;
					color: #f57c00;
				}

				&.quality-polluted {
					background: #ffebee;
					color: #c62828;
				}
			}
		}
	}
}

.air-quality {
	background: white;
	border-radius: 12px;
	padding: 20px;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

	h3 {
		color: #333;
		margin-bottom: 15px;
		font-size: 1.1rem;
	}
}

.aqi-details {
	display: flex;
	gap: 30px;

	.aqi-item {
		display: flex;
		align-items: center;
		gap: 8px;

		.aqi-label {
			color: #666;
			font-size: 0.95rem;
		}

		.aqi-value {
			font-weight: 600;
			color: #333;
			background: #f0f2ff;
			padding: 4px 12px;
			border-radius: 10px;
		}
	}
}

.forecast-section {
	margin-bottom: 40px;
}

.forecast-cards {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
	gap: 20px;
}

.forecast-card {
	background: white;
	border-radius: 16px;
	padding: 20px;
	box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
	transition: all 0.3s ease;
	border: 2px solid transparent;

	&:hover {
		transform: translateY(-8px);
		box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
	}

	&.today-card {
		background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
		border-color: #667eea;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;
		padding-bottom: 10px;
		border-bottom: 1px solid #f0f2ff;

		.date {
			font-size: 1.1rem;
			font-weight: 600;
			color: #333;
		}

		.week {
			color: #667eea;
			font-weight: 500;
		}
	}

	.weather-type {
		font-size: 1.3rem;
		color: #333;
		margin-bottom: 15px;
		font-weight: 500;
	}

	.temperature {
		display: flex;
		justify-content: center;
		gap: 20px;
		margin-bottom: 15px;

		.high {
			color: #ff6b6b;
			font-size: 1.4rem;
			font-weight: 600;
		}

		.low {
			color: #4dabf7;
			font-size: 1.4rem;
			font-weight: 600;
		}
	}

	.weather-details {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;

		.detail-item {
			flex: 1 0 calc(50% - 10px);

			&.full-width {
				flex: 0 0 100%;
				margin-top: 10px;
			}

			.detail-label {
				color: #666;
				font-size: 0.9rem;
			}

			.detail-value {
				color: #333;
				font-weight: 500;

				&.aqi-tag {
					padding: 2px 8px;
					border-radius: 10px;
					font-size: 0.85rem;

					&.aqi-excellent {
						background: #e8f5e9;
						color: #2e7d32;
					}

					&.aqi-good {
						background: #f0f4ff;
						color: #667eea;
					}

					&.aqi-moderate {
						background: #fff3e0;
						color: #f57c00;
					}

					&.aqi-poor {
						background: #ffebee;
						color: #c62828;
					}

					&.aqi-very-poor {
						background: #e8eaf6;
						color: #3949ab;
					}
				}
			}
		}
	}
}

.yesterday-section {
	.yesterday-card {
		background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
		border-radius: 16px;
		padding: 25px;
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
	}

	.yesterday-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
		padding-bottom: 15px;
		border-bottom: 1px solid #dee2e6;

		.date,
		.week {
			font-size: 1.1rem;
			font-weight: 600;
			color: #495057;
		}
	}

	.yesterday-content {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 15px;
	}

	.yesterday-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 15px;
		background: white;
		border-radius: 10px;

		&.full-width {
			grid-column: 1 / -1;
		}

		.label {
			color: #666;
			font-size: 0.95rem;
		}

		.value {
			color: #333;
			font-weight: 500;
			text-align: right;
			flex: 1;
			margin-left: 10px;
		}
	}
}

.empty-state {
	text-align: center;
	padding: 60px 20px;

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 20px;
		opacity: 0.5;
	}

	h3 {
		color: #333;
		margin-bottom: 10px;
		font-size: 1.5rem;
	}

	p {
		color: #666;
		font-size: 1rem;
		max-width: 500px;
		margin: 0 auto;
		line-height: 1.6;
	}
}

/* 响应式调整 */
@media (max-width: 768px) {
	.weather-header {
		padding: 15px;

		.main-title {
			font-size: 2rem;
		}
	}

	.weather-content {
		padding: 10px;
	}

	.weather-display {
		padding: 20px;
	}

	.weather-summary {
		grid-template-columns: 1fr;
	}

	.forecast-cards {
		grid-template-columns: 1fr;
	}

	.aqi-details {
		flex-direction: column;
		gap: 15px;
	}

	.search-section {
		width: 100%;
	}
}

/* 滚动条美化 */
::-webkit-scrollbar {
	width: 6px;
	height: 6px;
}

::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 10px;
}

::-webkit-scrollbar-thumb {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
	background: linear-gradient(135deg, #5a6fd8 0%, #6a4092 100%);
}
</style>