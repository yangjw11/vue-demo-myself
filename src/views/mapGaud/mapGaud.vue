<template>
	<div class="all">
		<div class="mainMap">
			<mapviewthree ref="mapviewthree" @mapDing="getCoordinate" @clickAddressSon="clickAddressFather"></mapviewthree>
		</div>
		<div style="margin-left: 20px">
			<h3>点击位置：</h3>
			<h5>{{ addressInfo }}</h5>
			<h4>经纬度</h4>
			<h5>E------{{ coordinateLng }}</h5>
			<h5>N------{{ coordinateLat }}</h5>
			<hr />
			<h3>个性化功能</h3>
			<el-button type="primary" @click="locateCurrentF()">定位当前位置(不可用)</el-button>
		</div>
	</div>
</template>
<script>
import mapviewthree from "./components/MapContainer03.vue";
export default {
	name: "mapGaud",
	components: {
		mapviewthree
	},
	data: function() {
		return {
			keyWord: "",
			addressInfo: "默认", // 地址信息
			coordinateLng: "默认", // 经度
			coordinateLat: "默认" // 纬度
		};
	},
	methods: {
		getCoordinate(data) {
			console.log("getCoordinate:", data);
		},
		clickAddressFather(param) {
			console.log("param === ", param);
			this.addressObj = {
				district: param.address.regeocode.addressComponent.district,
				city: param.address.regeocode.addressComponent.city
			};
			let addressStr = param.address.regeocode.formattedAddress
			// 重庆市特殊处理
			if (!this.addressObj.city && param.address.regeocode.addressComponent.province === "重庆市") {
				this.addressObj.city = "重庆";
			}
			this.addressInfo = param.address.regeocode.formattedAddress;
			this.coordinateLng = param.coordinate.lng;
			this.coordinateLat = param.coordinate.lat;
			// 将县的名称给父组件
			this.$emit("getDistrict", this.addressObj);
			// 将经度和维度传给父组件
			let accurateAddressObj = {
				lat: param.coordinate.lat,
				lng: param.coordinate.lng
			};
			this.$emit("getLat_long", accurateAddressObj);
			this.$emit("getAddress", addressStr);
		},
		locateCurrentF() {
			this.$refs.mapviewthree.locateCurrentS();
			// this.$refs.childComponent.childMethod();
		}
	}
};
</script>

<style scoped>
.all {
	display: flex;
	width: 100%;
	height: 1000px;
}
.mainMap {
	width: 1200px;
	height: 1000px;
}
</style>
