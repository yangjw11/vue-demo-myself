<template>
	<div>
		<div class="title1">点击地图获取当地（县或市）级的天气信息</div>
		<div class="title2"></div>
		<div style="width: 100%; text-align: center;">
			<mapGau @getDistrict="getDistrict" />
			<weather ref="weather"/>
		</div>
	</div>
</template>
<script>
import weather from "@/views/weatherForecast/index.vue";
import mapGau from "@/views/mapGaud/mapGaud.vue";
export default {
	name: "weatherAndMap",
	components: {
		weather,
		mapGau
	},
	data() {
		return {
			district: "陇川县"
		};
	},
	methods: {
		getDistrict(param) {
			this.district = param;
      this.$refs.weather.queryByName(param)
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
