<template>
	<div :id="chartId" :style="{ width: width, height: height }"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
	props: {
		chartId: {
			type: String,
			default: Date.now().toString()
		},
		option: {
			type: Object,
			default: () => ({})
		},
		width: {
			type: String,
			default: "100%"
		},
		height: {
			type: String,
			default: "100%"
		},
		isChartClick: {
			type: Boolean,
			default: false
		},
		showLoading: {
			type: Boolean,
			default: false
		},
		mouse_over_out: {
			type: Boolean,
			default: false
		},
		mouse_over_out_colorList: {
			type: Array,
			default: []
		}
	},
	watch: {
		showLoading: {
			handler(newVal, oldVal) {
				if (newVal) {
					this.chart.showLoading({
						text: "",
						color: "#2d9696",
						textColor: "#000",
						maskColor: "rgba(255,255,255,0.1)",
						zlevel: 0
					});
				} else {
					this.chart.hideLoading();
				}
			},
			immediate: false
		},
		option: {
			handler(newVal, oldVal) {
				if (newVal) {
					this.$nextTick(() => {
						this.updataCharts();
					});
				}
			},
			deep: true
		}
	},
	mounted() {
		this.chart = echarts.init(document.getElementById(this.chartId));
		this.isChartClick &&
			this.chart.on("click", params => {
				this.$emit("chartClick", params);
			});
		// 绑定 lengend 的点击切换事件
		this.chart.on("legendselectchanged", params => {
			this.$emit("legendselectchanged", params);
		});
		setTimeout(() => {
			this.chart.setOption(this.option);
			this.getResizeUpdata = () => {
				this.chart.resize();
			};
			window.addEventListener("resize", this.getResizeUpdata);
		}, 10);

		// 鼠标滑过改变legend文字样式
		if (this.mouse_over_out && this.mouse_over_out_colorList.length) {
			// 监听 mouseover 事件，当鼠标悬停在图例项上时触发
			this.chart.on("mouseover", function(params) {
				if (params.componentType === "legend") {
					// 改变当前悬停图例项的文本颜色为红色
					this.chart.setOption({
						legend: {
							textStyle: {
								color: function(name) {
									return name === params.name ? "red" : "#333";
								}
							}
						}
					});
				}
			});

			// 监听 mouseout 事件，当鼠标从图例项移开时触发
			this.chart.on("mouseout", function(params) {
				if (params.componentType === "legend") {
					// 将所有图例项的文本颜色恢复默认
					this.chart.setOption({
						legend: {
							textStyle: {
								color: "#333"
							}
						}
					});
				}
			});
		}
	},
	methods: {
		updataCharts() {
			// console.log(this.option, "=====this.option");
			this.$nextTick(() => {
				this.chart.setOption(this.option, true);
			});
		}
	},
	activated() {
		this.chart && this.chart.resize();
	},
	beforeDestroy() {
		this.chart && this.chart.dispose(); //释放图形资源
		window && window.removeEventListener("resize", this.getResizeUpdata);
	}
};
</script>
