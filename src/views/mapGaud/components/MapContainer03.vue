<template>
	<div class="amap-page-container">
		<div class="input-search" style="width: 500px">
			<el-input class="inpu" placeholder="请输入你要定位的地址" @input="onQueryChange" v-model="address">
				<i slot="prefix" class="el-input__icon el-icon-search"></i>
			</el-input>
			<el-button type="primary" @click="searchMap()" style="height: 40px">定位</el-button>
			<ul v-if="suggestions.length && showOptions" class="tips">
				<li v-for="(suggestion, index) in suggestions" :key="index" class="tipsItem" @click="selectSuggestion(suggestion)">
					{{ suggestion.name }}
				</li>
			</ul>
		</div>

		<el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="center" :zoom="zoom" :events="events">
			<!-- 点击显示标记 -->
			<el-amap-marker v-for="(marker, index) in markers" :key="marker.index" :position="marker.position" :icon="marker.icon" :title="marker.title" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable" :vid="index"></el-amap-marker>
		</el-amap>
		<div class="dis-tan ju-cen"></div>
	</div>
</template>

<script>
import _ from "lodash";
export default {
	name: "mapviewthree",
	props: {},
	data() {
		let self = this;
		return {
			tishi: "",
			//从这里下去是地图有关的
			address: "", //获取的位置
			suggestions: [], // 输入框输入后弹出的提示词列表
			showOptions: false,
			zoom: 13, // 地图缩放
			center: [122.59996, 26.197646], // 初始中心
			myHomeCenter: [97.804802, 24.188289], // 老家的坐标：云南省德宏州陇川县新苑小区57号
			lng: 0, //经纬度
			lat: 0,
			loaded: false,
			mapInstance: {}, // 地图实例
			// 点击显示的标记默认的定位
			markers: [],
			//  自动定位到当前位置
			plugin: [
				{
					timeout: 1000, //超过10秒后停止定位，默认：无穷大
					panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
					zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：f
					pName: "Geolocation",
					showMarker: true,
					events: {
						init(o) {
							self.mapInstance = o;
							// o 是高德地图定位插件实例
							o.getCurrentPosition((status, result) => {
								if (result && result.position) {
									self.address = result.formattedAddress;
									self.lng = result.position.lng;
									self.lat = result.position.lat;
									self.center = [self.lng, self.lat];
									self.markers = [
										{
											position: self.center
										}
									];
									self.loaded = true;
									self.$nextTick();
								} else {
									o.getCityInfo((status, result) => {
										if (result && result.center) {
											// self.address = result.formattedAddress;
											// myHomeCenter:[97.804802, 24.188289],
											// 更换地址
											self.lng = 97.804802;
											self.lat = 24.188289;
											self.center = [97.804802, 24.188289];
											self.markers = [
												{
													position: [97.804802, 24.188289]
												}
											];

											// 下面是源码
											// self.lng = result.center[0];
											// self.lat = result.center[1];
											// self.center = result.center;
											// self.markers = [{
											//   position: self.center,
											// }]
											self.loaded = true;
											self.$nextTick();
										}
									});
								}
							});
						}
					}
				}
			],
			// 点击地图获取当前位置并显示标记
			events: {
				click(e) {
					console.log("e ===", e);
					self.showOptions = false;
					self.chaadd(e.lnglat);
				}
			}
		};
	},
	created() {
		console.log(this.address);
	},
	mounted() {
		setTimeout(() => {
			let params = {
				// Q: 24.173099199697752,
				// R: 97.82299784123893,
				lng: 97.804802,
				lat: 24.188289
				// Q: 24.049967,
				// R: 101.582738,
				// lng: 101.582738,
				// lat: 101.582738
			};
			this.chaadd(params);
		}, 3000);
	},
	methods: {
		searchMap() {
			console.log("searchMap方法执行");
			let that = this;
			let address = this.address;
			var geocoder = new AMap.Geocoder({
				city: "" //城市设为北京，默认：“全国”
			});
			geocoder.getLocation(address, function(status, result) {
				if (status === "complete" && result.geocodes.length) {
					var lnglat = result.geocodes[0].location;
					that.center = [lnglat.lng, lnglat.lat];
					that.lng = lnglat.lng;
					that.lat = lnglat.lat;
					that.markers = [
						{
							position: that.center
						}
					];
					let data = {
						lng: that.lng,
						lat: that.lat
					};
					that.$emit("mapDing", data);
				} else {
					console.log("根据地址查询位置失败");
				}
			});
		},
		chaadd(e) {
			console.log("chaadd 方法传参 e === ", e);
			let self = this;
			let { lng, lat } = e;
			self.lng = lng;
			self.lat = lat;
			self.center = [self.lng, self.lat];
			self.loaded = true;
			self.markers = [
				{
					position: self.center
				}
			];
			var geocoder = new AMap.Geocoder({
				radius: 1000 //范围，默认：500
			});
			var marker = new AMap.Marker();

			function regeoCode() {
				var lnglat = [lng, lat];
				geocoder.getAddress(lnglat, function(status, result) {
					if (status === "complete" && result.regeocode) {
						self.address = result.regeocode.formattedAddress;
						// 将self.address传递给父组件
						let obj = {
							coordinate: e,
							address: result
						};
						self.$emit("clickAddressSon", obj);
					} else {
						let obj = {
							coordinate: {
								lng: "未知",
								lat: "未知"
							},
							address: {
								regeocode: {
									formattedAddress: "根据经纬度查询地址失败"
								}
							}
						};
						self.$emit("clickAddressSon", obj);
						console.log("根据经纬度查询地址失败");
					}
				});
			}
			regeoCode();
		},
		// 输入事件使用防抖，防止无用的查询。因为查询次数每天有限制
		onQueryChange: _.debounce(function() {
			if (this.address.length > 0) {
				this.fetchSuggestions(this.address);
			} else {
				this.suggestions = [];
			}
		}, 1500),
		// 新增的方法
		fetchSuggestions: _.debounce(function(query) {
			this.suggestions = [];
			var _this = this;
			// axios.get(`https://restapi.amap.com/v3/assistant/inputtips`, {
			//   params: {
			//     key: 'c5a44d6c8c0b06827652341562d0708f',
			//     keywords: query,
			//     city: '', // 可以指定城市
			//   },
			// })
			// .then(response => {
			//   if (response.data.tips) {
			//     this.suggestions = response.data.tips.filter(tip => tip.location);
			//   }
			// })
			// .catch(error => {
			//   console.error('Error fetching suggestions:', error);
			// });
			AMap.plugin("AMap.Autocomplete", function() {
				// 实例化Autocomplete
				var autoOptions = {
					//city 限定城市，默认全国
					city: "全国"
				};
				var autoComplete = new AMap.Autocomplete(autoOptions);

				autoComplete.search(query, function(status, result) {
					// 搜索成功时，result即是对应的匹配数据
					console.log("搜索框接口返回result === ", result);
					let str = result.info;
					if (typeof result !== "string") {
						_this.suggestions = result.tips.filter(item => item.location);
						// _this.suggestions = result.tips
					} else {
						_this.suggestions = [];
					}
					if (Array.isArray(_this.suggestions) && (_this.suggestions.length || str === "OK")) {
						_this.showOptions = true;
						if (!_this.suggestions.length) {
							_this.$message({
								message: "没有找到可以直接定位的地址，可以试试缩小搜索范围",
								type: "warning",
								duration: 5000
							});
						}
					} else {
						_this.$message({
							message: "当天调用查询接口次数已到上限，请更换秘钥或明天再继续调用",
							type: "error",
							duration: 5000
						});
					}
				});
			});
		}, 1500),
		selectSuggestion(suggestion) {
			console.log("suggestion === ", suggestion);
			if (suggestion.location) {
				let lng = suggestion.location?.lng;
				let lat = suggestion.location.lat;
				let Q = suggestion.location.Q || null;
				let R = suggestion.location.R;
				let params = {
					Q: Q,
					R: R,
					lng: lng,
					lat: lat
				};
				this.chaadd(params);
				this.showOptions = false;
			}
		},
		locateCurrentS() {
			if (this.mapInstance) {
				AMap.plugin("AMap.Geolocation", () => {
					let geolocation = new AMap.Geolocation({
						enableHighAccuracy: true, // 是否使用高精度定位
						timeout: 10000, // 超过10秒后停止定位
						buttonPosition: "RB", // 定位按钮停靠位置
						zoomToAccuracy: true // 定位成功后是否自动调整地图视野到定位点
					});
					geolocation.getCurrentPosition((status, result) => {
						if (status === "complete") {
							this.onComplete(result);
						} else {
							this.onError(result);
						}
					});
				});
			}
		},
		onComplete(data) {
			// 定位成功后的处理
			console.log("定位成功", data);
			const position = [data.position.getLng(), data.position.getLat()];
			this.mapInstance.setCenter(position);
		},
		onError(error) {
			// 定位失败后的处理
			console.error("定位失败", error);
		}
	}
};
</script>

<style scoped lang="scss">
.amap-page-container {
	height: 800px;
	margin-top: 20px;
	position: relative;
	.tips {
		width: 100%;
		position: absolute;
		top: 27px;
		left: 0;
		z-index: 999;
		background-color: #fff;
	}
}

.input-search {
	width: 500px;
	display: flex;
	justify-content: space-around;
	position: absolute;
	top: 0px;
	right: 0px;
	z-index: 5;
}

.inpu {
	width: calc(100% - 110px);
	margin-right: 20px;
	margin-bottom: 20px;
	margin-left: 20px;
}
.el-button--medium {
	height: 34px;
}

.wan {
	margin-top: 20px;
}
.tipsItem {
	cursor: pointer;
}
.tipsItem:hover {
	color: aqua;
}
</style>
