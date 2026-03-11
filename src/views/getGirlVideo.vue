<template>
	<!-- 接口说明文档 https://www.free-api.com/doc/644 -->
	<div>
		<div class="title1">【点击按钮获取小姐姐视频】</div>
		<div class="title2"></div>
		<div style="width: 100%; text-align: center;">
			<!-- <el-button type="primary" @click="getGirlVideo_one">获取视频源一</el-button> -->
			<!-- <el-button type="primary" @click="getGirlVideo_two">获取视频源二</el-button> -->
			<el-button type="primary" @click="getGirlVideo_three">获取视频源三</el-button>
			<el-button type="primary" @click="getGirlVideo_four">随机视频不参与排序</el-button>
			<el-button type="primary" @click="getGirlVideo_five">摸鱼视频不参与排序</el-button>
			<el-button type="primary" @click="getGirlVideo_six">获取视频源六</el-button>
			<el-button type="primary" @click="getGirlVideo_seven">获取视频源七</el-button>
			<el-button type="primary" @click="getGirlVideo_eight">获取视频源八</el-button>
		</div>
		<div class="videoArea">
			<video class="video" ref="videoPlayer" :src="currentVideoSrc" @play="onPlay" @pause="onPause" @ended="onEnded" @canplay="onCanplay" controls></video>
		</div>
		<div class="btn">
			<el-button type="primary" @click="last">上一个</el-button>
			<el-button type="primary" @click="next">下一个</el-button>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import _ from "lodash";
const debounceTime = 1000; // 1000ms防抖时间
export default {
	data() {
		return {
			videoList: [],
			currentVideoSrc: "https://www.wudada.online/Api/NewSp",
			btnType: "1" // 判断点击的是第几个视频按钮，1,2,3
		};
	},
	mounted() {
		if (!currentVideoSrc) {
			this.getGirlVideo_three("next");
		}
	},
	methods: {
		// 还有其他url：
		// 直接返回视频：https://api.71xk.com/api/video/v1
		// 直接返回唱歌视频：https://api.71xk.com/api/video/v2
		// 直接返回视频：https://api.qqsuu.cn/api/dm-xjj2
		//     _.debounce(function () {
		//   console.log("这是插件一秒防抖功能");
		// }, debounceTime),
		getGirlVideo_one: _.debounce(function(type = null) {
			this.btnType = "1";
			axios
				.get("https://api.kuleu.com/api/xjj?type=json")
				.then(res => {
					if (type === "next" || type === null) {
						this.videoList.push(res.data.video);
					} else if (type === "last") {
						this.videoList.unshift(res.data.video);
					}
					this.currentVideoSrc = res.data.video;
					this.onCanplay();
				})
				.catch(err => {
					console.log("err === ", err);
				});
		}, debounceTime),
		getGirlVideo_one: _.debounce(function(type = null) {
			this.btnType = "1";
			axios
				.get("https://api.kuleu.com/api/xjj?type=json")
				.then(res => {
					if (type === "next" || type === null) {
						this.videoList.push(res.data.video);
					} else if (type === "last") {
						this.videoList.unshift(res.data.video);
					}
					this.currentVideoSrc = res.data.video;
					this.onCanplay();
				})
				.catch(err => {
					console.log("err === ", err);
				});
		}, debounceTime),
		getGirlVideo_two: _.debounce(function(type = null) {
			this.btnType = "2";
			axios
				.get("https://api.kuleu.com/api/MP4_xiaojiejie?type=json")
				.then(res => {
					if (type === "next" || type === null) {
						this.videoList.push(res.data.mp4_video);
					} else if (type === "last") {
						this.videoList.unshift(res.data.mp4_video);
					}
					this.currentVideoSrc = res.data.mp4_video;
					this.onCanplay();
				})
				.catch(err => {
					console.log("err === ", err);
				});
		}, debounceTime),
		getGirlVideo_three: _.debounce(function(type = null) {
			this.btnType = "3";
			axios
				.get("/fff?type=json")
				.then(res => {
					if (type === "next" || type === null) {
						this.videoList.push(res.data.video);
					} else if (type === "last") {
						this.videoList.unshift(res.data.video);
					}
					this.currentVideoSrc = res.data.video;
					this.onCanplay();
				})
				.catch(err => {
					console.log("err === ", err);
				});
		}, debounceTime),
		getGirlVideo_four: _.debounce(function(type = null) {
			this.btnType = "4";
			this.currentVideoSrc = `https://www.wudada.online/Api/NewSp?t=${new Date().getTime()}`;
		}, debounceTime),
		getGirlVideo_five: _.debounce(function(type = null) {
			axios
				.get("https://dayu.qqsuu.cn/moyuribaoshipin/apis.php?type=json")
				.then(res => {
					this.currentVideoSrc = res.data.data;
					this.onCanplay();
				})
				.catch(err => {
					console.log("err === ", err);
				});
		}, debounceTime),
		getGirlVideo_six: _.debounce(function(type = null) {
			this.btnType = "6";
			axios
				.get("https://www.wudada.online/Api/ScSp?type=json")
				.then(res => {
					if (type === "next" || type === null) {
						this.videoList.push(res.data.data);
					} else if (type === "last") {
						this.videoList.unshift(res.data.data);
					}
					this.currentVideoSrc = res.data.data;
					this.onCanplay();
				})
				.catch(err => {
					console.log("err === ", err);
				});
		}, debounceTime),
		getGirlVideo_seven: _.debounce(function(type = null) {
			this.btnType = "7";
			axios
				.get("https://v2.api-m.com/api/meinv")
				.then(res => {
					if (type === "next" || type === null) {
						this.videoList.push(res.data.data);
					} else if (type === "last") {
						this.videoList.unshift(res.data.data);
					}
					this.currentVideoSrc = res.data.data;
					this.onCanplay();
				})
				.catch(err => {
					console.log("err === ", err);
				});
		}, debounceTime),
		// 第八个https://tucdn.wpon.cn/api-girl/index.php?wpon=json
		getGirlVideo_eight: _.debounce(function(type = null) {
			this.btnType = "8";
			axios
				.get("/ttt?wpon=json")
				.then(res => {
					if (type === "next" || type === null) {
						this.videoList.push(res.data.mp4);
					} else if (type === "last") {
						this.videoList.unshift(res.data.mp4);
					}
					this.currentVideoSrc = res.data.mp4;
					this.onCanplay();
				})
				.catch(err => {
					console.log("err === ", err);
				});
		}, debounceTime),
		onPlay(event) {
			console.log("Video is playing");
		},
		onPause(event) {
			console.log("Video has paused");
		},
		onEnded(event) {
			console.log("Video has ended");
			this.getGirlVideo_four();
		},
		// 下一个
		next() {
			console.log("next");
			// 通过索引值判断
			let idx = this.videoList.indexOf(this.currentVideoSrc);
			if (idx === this.videoList.length - 1) {
				if (this.btnType === "1") {
					this.getGirlVideo_one("next");
				} else if (this.btnType === "2") {
					this.getGirlVideo_two("next");
				} else if (this.btnType === "3") {
					this.getGirlVideo_three("next");
				} else if (this.btnType === "6") {
					this.getGirlVideo_six("next");
				} else if (this.btnType === "7") {
					this.getGirlVideo_seven("next");
				} else if (this.btnType === "4") {
					this.getGirlVideo_four();
				}
			} else {
				this.currentVideoSrc = this.videoList[idx + 1];
			}
		},
		// 上一个
		last() {
			console.log("last");
			// 通过索引值判断
			let idx = this.videoList.indexOf(this.currentVideoSrc);
			if (idx === 0) {
				if (this.btnType === "1") {
					this.getGirlVideo_one("last");
				} else if (this.btnType === "2") {
					this.getGirlVideo_two("last");
				} else if (this.btnType === "3") {
					this.getGirlVideo_three("last");
				} else if (this.btnType === "6") {
					this.getGirlVideo_six("last");
				} else if (this.btnType === "7") {
					this.getGirlVideo_seven("last");
				} else if (this.btnType === "4") {
					this.getGirlVideo_four();
				}
			} else {
				this.currentVideoSrc = this.videoList[idx - 1];
			}
		},
		onCanplay() {
			console.log("this.currentVideoSrc === ", this.currentVideoSrc);
			this.$refs.videoPlayer.play().catch(error => {
				console.warn("自动播放失败:", error);
				// 处理自动播放失败的情况
			});
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
.videoArea {
	text-align: center;
	height: 800px;
	.video {
		width: 50%;
		height: 100%;
		border: 1px solid #ccc;
	}
}
.btn {
	text-align: center;
}
</style>
