<template>
	<div>
		<div v-show="!showFullScreen">
			<el-button @click="getGirlBtn">切换美女图片1</el-button>
			<el-button @click="getGirlListBtn">切换美女图片2</el-button>
			<el-button @click="getDog">切换狗狗图片</el-button>
			<el-button @click="getCat">切换猫的图片</el-button>
			<el-button @click="getSpecifySizeImgBtn">获取指定尺寸的图片</el-button>
			<el-button @click="getTypeImgBtn">获取不同类型图片</el-button>
			<el-button @click="getImgBingBtn">获取bing图片</el-button>
			<el-button @click="getImgTreeBtn">获取图片树</el-button>
		</div>
		<div class="all" v-show="!showFullScreen">
			<div class="item" ref="small3" @mouseleave="handleMouseLeave3"
				@mousemove.stop="handleMouseMove($event, 'small3', 'mask3')">
				<img :src="firstImg" alt="" />
				<div @dblclick="fullScreen(1)" v-show="showMask3" class="mask"
					:style="{ left: left + 'px', top: top + 'px', width: maskWidth + 'px', height: maskHeight + 'px' }"
					ref="mask3"></div>
			</div>
			<div class="item" ref="small1" @mouseleave="handleMouseLeave1"
				@mousemove.stop="handleMouseMove($event, 'small1', 'mask1')">
				<img :src="dogImg" alt="" />
				<div @dblclick="fullScreen(2)" v-show="showMask1" class="mask"
					:style="{ left: left + 'px', top: top + 'px', width: maskWidth + 'px', height: maskHeight + 'px' }"
					ref="mask1"></div>
			</div>
			<div class="item" ref="small2" @mouseleave="handleMouseLeave2"
				@mousemove.stop="handleMouseMove($event, 'small2', 'mask2')">
				<img :src="catImg" alt="" />
				<div @dblclick="fullScreen(3)" v-show="showMask2" class="mask"
					:style="{ left: left + 'px', top: top + 'px', width: maskWidth + 'px', height: maskHeight + 'px' }"
					ref="mask2"></div>
			</div>
			<!-- 图片放大区域 -->
			<div class="item item4" ref="big">
				<img v-show="showBigImg" ref="bigImg" :src="imgUrl" alt="" :style="{ left: imgX + 'px', top: imgY + 'px' }" />
			</div>
		</div>
		<!-- 图片放大为全屏 -->
		<div v-show="showFullScreen" class="allScreen" @dblclick="showFullScreen = false">
			<h2 v-if="showBingImgInfo">{{ bingTitle }}</h2>
			<img :src="bigImgUrl" alt="" @dblclick="showSmall" />
		</div>
		<!-- 设置指定图片大小弹窗 -->
		<el-dialog title="请设置图片大小（px）" :visible.sync="dialogVisible" width="30%">
			<el-form :model="dataForm" @submit.native.prevent ref="ruleForm" :rules="rules" label-width="100px">
				<el-form-item prop="width" label="图片宽">
					<el-input v-model.trim="dataForm.width" placeholder="请输入图片宽度(px)"></el-input>
				</el-form-item>
				<el-form-item prop="height" label="图片高">
					<el-input v-model.trim="dataForm.height" placeholder="请输入排序数字(px)"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :loading="loading" @click="submitForm('ruleForm')">确定</el-button>
					<el-button @click="resetForm('ruleForm')" :loading="loading">重置</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 设置360壁纸不同类型弹窗 -->
		<el-dialog title="请选择图片类型" :visible.sync="dialogVisibleType" width="30%">
			<el-form :model="dataFormType" @submit.native.prevent ref="ruleFormType" :rules="rulesType" label-width="150px">
				<el-form-item prop="url1" label="第一张图片类型">
					<el-select v-model="dataFormType.url1" placeholder="请选择图片类型">
						<el-option v-for="item in imgTypeList" :key="item.id" :label="item.label" :value="item.value"> </el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="url2" label="第二张图片类型">
					<el-select v-model="dataFormType.url2" placeholder="请选择图片类型">
						<el-option v-for="item in imgTypeList" :key="item.id" :label="item.label" :value="item.value"> </el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="url3" label="第三张图片类型">
					<el-select v-model="dataFormType.url3" placeholder="请选择图片类型">
						<el-option v-for="item in imgTypeList" :key="item.id" :label="item.label" :value="item.value"> </el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :loading="loading" @click="submitFormType('ruleFormType')">确定</el-button>
					<el-button @click="dialogVisibleType = fasle" :loading="loading">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 选择bing指定日期图片 -->
		<el-dialog title="请选择时间" :visible.sync="dialogVisibleBing" width="30%">
			<el-form :model="dataFormBing" @submit.native.prevent ref="dataFormBing" :rules="rulesBing" label-width="150px">
				<el-form-item prop="day1" label="第一张图片时间">
					<el-date-picker v-model="dataFormBing.day1" type="date" placeholder="选择日期"
						:picker-options="pickerOptions"></el-date-picker>
				</el-form-item>
				<el-form-item prop="day2" label="第二张图片时间">
					<el-date-picker v-model="dataFormBing.day2" type="date" placeholder="选择日期"
						:picker-options="pickerOptions"></el-date-picker>
				</el-form-item>
				<el-form-item prop="day3" label="第三张图片时间">
					<el-date-picker v-model="dataFormBing.day3" type="date" placeholder="选择日期"
						:picker-options="pickerOptions"></el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :loading="loading" @click="submitFormBing('dataFormBing')">确定</el-button>
					<el-button @click="dialogVisibleBing = fasle" :loading="loading">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 选择图片树的弹窗 -->
		<el-dialog title="请选择图片" :visible.sync="dialogVisibleTree" width="40%">
			<el-form :model="dataFormTree" @submit.native.prevent ref="dataFormTree" label-width="150px">
				<el-form-item prop="day1" label="第一张图片">
					<el-cascader style="width: 300px" :options="treeOptions" :show-all-levels="false"
						v-model="dataFormTree.url1"></el-cascader>
				</el-form-item>
				<el-form-item prop="day2" label="第二张图片">
					<el-cascader style="width: 300px" :options="treeOptions" :show-all-levels="false"
						v-model="dataFormTree.url2"></el-cascader>
				</el-form-item>
				<el-form-item prop="day3" label="第三张图片">
					<el-cascader style="width: 300px" :options="treeOptions" :show-all-levels="false"
						v-model="dataFormTree.url3"></el-cascader>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :loading="loading" @click="submitFormTree()">确定</el-button>
					<el-button @click="dialogVisibleTree = fasle" :loading="loading">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>
<script>
import catImg from "@/assets/images/cat.jpg";
import dogImg from "@/assets/images/dog.jpg";
import firstDog from "@/assets/images/firstDog.jpg";
import videoPath from "@/assets/videos/neimeng.mp4";
import axios from "axios";
import { specialUrlList, imgTypeList, treeOptions } from "./data.js";
import { calculateDays, truncateToLastChineseChar, formatDate_, delay } from "@/utils/index.js";
export default {
	name: "test",
	data() {
		return {
			// D:\Study_Hard\LiuYingshare\practice\02_vue_begin\100-vue项目router配置\src\assets\videos\neimeng.mp4
			top: "",
			left: "",
			imgX: "",
			imgY: "",
			showMask1: false,
			showMask2: false,
			showMask3: false,
			maskWidth: "",
			maskHeight: "",
			imgUrl: "",
			dogImg: dogImg,
			catImg: catImg,
			firstImg: firstDog,
			eSmall: {},
			eAll: {},
			showBigImg: false,
			imgGirlList: [],
			videoUrl: videoPath,
			imgCatlist: [],
			imgDogList: [],
			bigImgUrl: "",
			showBigImg: false,
			dialogVisible: false,
			dialogVisibleType: false,
			dialogVisibleBing: false,
			dialogVisibleTree: false,
			dataForm: {
				width: 3600,
				height: 2000
			},
			showFullScreen: false,
			dataFormType: {
				// 默认是4K专区的图片
				url1: "https://www.yumus.cn/api?target=img&brand=360&type=0",
				url2: "https://www.yumus.cn/api?target=img&brand=360&type=0",
				url3: "https://www.yumus.cn/api?target=img&brand=360&type=0"
			},
			dataFormTree: {
				// 默认链接
				url1: "https://api.r10086.com/樱道随机图片api接口.php?图片系列=风景系列1",
				url2: "https://api.r10086.com/樱道随机图片api接口.php?图片系列=风景系列2",
				url3: "https://api.r10086.com/樱道随机图片api接口.php?图片系列=风景系列3"
			},
			showBingImgInfo: false,
			bingTitle1: "",
			bingTitle2: "",
			bingTitle3: "",
			bingTitle: "",
			dataFormBing: {
				// 默认是当天,昨天，前天的图片
				day1: new Date(),
				day2: new Date(),
				day3: new Date()
			},
			pickerOptions: {
				disabledDate(time) {
					const today = new Date();
					const minDate = new Date("2016-03-05");
					// 不允许选择2016年03月05日之前的日期
					// 不允许选择今天的日期之后的日期
					return time.getTime() < minDate.getTime() - 8.64e7 || time.getTime() > today.getTime();
				}
			},
			loading: false,
			rules: {
				width: [
					{
						required: true,
						message: "图片宽度不能为空",
						trigger: "change"
					},
					{
						pattern: /^[1-9]\d*$/,
						message: "请输入正整数"
					}
				],
				height: [
					{
						required: true,
						message: "图片高度不能为空",
						trigger: "change"
					},
					{
						pattern: /^[1-9]\d*$/,
						message: "请输入正整数"
					}
				]
			},
			rulesType: {
				url1: [
					{
						required: true,
						message: "请选择",
						trigger: "change"
					}
				],
				url2: [
					{
						required: true,
						message: "请选择",
						trigger: "change"
					}
				],
				url3: [
					{
						required: true,
						message: "请选择",
						trigger: "change"
					}
				]
			},
			rulesBing: {
				day1: [
					{
						required: true,
						message: "请选择",
						trigger: "change"
					}
				],
				day2: [
					{
						required: true,
						message: "请选择",
						trigger: "change"
					}
				],
				day3: [
					{
						required: true,
						message: "请选择",
						trigger: "change"
					}
				]
			},
			imgTypeList: imgTypeList,
			treeOptions: treeOptions
		};
	},
	created() {
		let obj = this.getYesterdayAndBeforeYesterdayTimestamp();
		console.log("obj === ", obj);
		this.dataFormBing.day2 = obj.yesterday;
		this.dataFormBing.day1 = obj.beforeYesterday;
	},
	mounted() {
		this.initMask();
		window.addEventListener("resize", this.initMask);
	},
	methods: {
		handleMouseMove(e, refName, maskName) {
			this.showBigImg = true;
			let small = this.$refs[`${refName}`];
			let mask = this.$refs[`${maskName}`];
			let big = this.$refs.big;
			let bigImg = this.$refs.bigImg;
			// console.log('small.offsetLeft === ', small.offsetLeft)
			// console.log('small.offsetTop === ', small.offsetTop)
			// 第一步获取鼠标中点位置
			let maskX = e.pageX - small.offsetLeft;
			let maskY = e.pageY - small.offsetTop;

			// if (e.pageX > small.offsetWidth || e.pageY > small.offsetHeight) {
			//   this.showMask = false
			//   return
			// }
			if (maskName == "mask1") {
				this.showMask1 = true;
				this.showMask2 = false;
				this.showMask3 = false;
				this.imgUrl = this.imgGirlList.length ? this.imgGirlList[0] : this.dogImg;
			} else if (maskName == "mask2") {
				this.showMask1 = false;
				this.showMask2 = true;
				this.showMask3 = false;
				this.imgUrl = this.imgGirlList.length ? this.imgGirlList[1] : this.catImg;
			} else if (maskName == "mask3") {
				this.showMask1 = false;
				this.showMask2 = false;
				this.showMask3 = true;
				this.imgUrl = this.imgGirlList.length ? this.imgGirlList[2] : this.firstImg;
			}
			// 让鼠标出现在mask的中心点
			maskX = maskX - mask.offsetWidth / 2;
			maskY = maskY - mask.offsetHeight / 2;
			// 把mask限制到box中
			maskX = maskX < 0 ? 0 : maskX;
			maskY = maskY < 0 ? 0 : maskY;
			maskX = maskX > small.offsetWidth - mask.offsetWidth ? small.offsetWidth - mask.offsetWidth : maskX;
			maskY = maskY > small.offsetHeight - mask.offsetHeight ? small.offsetHeight - mask.offsetHeight : maskY;

			//遮挡层的移动距离/大图的移动距离=遮挡层的最大移动距离/大图的最大移动距离
			//大图的移动距离=遮挡层的移动距离*大图的最大移动距离/遮挡层的最大移动距离

			// 注意：
			// 遮罩层的面积/盒子的面积 == 大图展示盒子的面积/大图图片的面积
			// 一定要是等比例的才行严格控制样式

			let bigImgX = (maskX * (big.offsetWidth - bigImg.offsetWidth)) / (small.offsetWidth - mask.offsetWidth);
			let bigImgY = (maskY * (big.offsetHeight - bigImg.offsetHeight)) / (small.offsetHeight - mask.offsetHeight);

			this.left = maskX;
			this.top = maskY;
			this.imgX = bigImgX;
			this.imgY = bigImgY;
		},
		initMask() {
			let small = this.$refs.small1;
			this.maskWidth = small.offsetWidth / 2;
			this.maskHeight = small.offsetHeight / 2;
			// console.log('this.maskWidth === ', this.maskWidth)
			// console.log('this.maskHeight ===', this.maskHeight)
		},
		handleMouseLeave1() {
			this.showBigImg = false;
			this.showMask1 = false;
		},
		handleMouseLeave2() {
			this.showBigImg = false;
			this.showMask2 = false;
		},
		handleMouseLeave3() {
			this.showBigImg = false;
			this.showMask3 = false;
		},
		getGirl() {
			// https://www.juhe.cn/docs/api/id/63
			return axios.get("http://3650000.xyz/api/?type=json&mode=1,2,3,5,7,8,9");
			// .then((res) => {
			//   console.log(" gire res === ", res);
			//   this.imgGirlList.push(res.data.imgurl);
			// })
			// .catch((err) => {
			//   console.log("err === ", err);
			// });
		},
		getGirlBtn() {
			this.showBingImgInfo = false;
			let arr = [];
			for (let i = 0; i < 3; i++) {
				arr.push(this.getGirl());
			}

			Promise.all(arr).then(result => {
				console.log("result === ", result);
				// result.forEach(val => {
				//   this.imgGirlList.push(val.data.imgurl)
				// })
				// this.imgGirlList = result.map(val => {
				//   return val.data.imgurl
				// })
				this.dogImg = result[0].data.url;
				this.catImg = result[1].data.url;
				this.firstImg = result[2].data.url;
			});
		},
		getGirlListBtn() {
			this.showBingImgInfo = false;
			axios
				.get("https://api.unmz.net/free/api/images/girl/getRandomGirlUrl?size=3")
				.then(res => {
					console.log("res === ", res);
					let data = res.data.data;
					this.dogImg = data[0];
					this.catImg = data[1];
					this.firstImg = data[2];
				})
				.catch(err => {
					console.log("err === ", err);
				});
		},
		getCat() {
			this.showBingImgInfo = false;
			axios
				.get("https://api.thecatapi.com/v1/images/search?limit=2")
				.then(res => {
					console.log("res === ", res);
					this.imgCatlist = res.data;
					this.dogImg = this.imgCatlist[0].url;
					this.catImg = this.imgCatlist[1].url;
					this.firstImg = this.imgCatlist[2].url;
				})
				.catch(err => {
					console.log("err === ", err);
				});
		},
		getDog() {
			this.showBingImgInfo = false;
			axios
				.get("https://dog.ceo/api/breeds/image/random/10")
				.then(res => {
					console.log(" dog res === ", res);
					this.imgDogList = res.data.message;
					this.dogImg = this.imgDogList[0];
					this.catImg = this.imgDogList[1];
					this.firstImg = this.imgDogList[2];
				})
				.catch(err => {
					console.log("err === ", err);
				});
		},
		// 双击更改样式为全屏展示
		fullScreen(param) {
			// 两个新闻的url
			let specialUrl = ["https://api.03c3.cn/api/zb", "https://zj.v.api.aa1.cn/api/60s-v2/"];
			if (param === 1) {
				this.bigImgUrl = this.firstImg;
				this.bingTitle = this.bingTitle1;
			} else if (param === 2) {
				this.bigImgUrl = this.dogImg;
				this.bingTitle = this.bingTitle2;
			} else if (param === 3) {
				this.bigImgUrl = this.catImg;
				this.bingTitle = this.bingTitle3;
			}
			// 获取去除了参数的url
			let urlObj = new URL(this.bigImgUrl);
			urlObj.search = "";
			let resUrl = urlObj.toString();
			if (specialUrl.includes(resUrl)) {
				window.open(this.bigImgUrl, "_blank");
				return;
			}
			this.showFullScreen = true;
			// 在全屏模式下隐藏返回按钮
			this.$store.commit('setShowBackButton', false);
		},
		// 双击大图还原
		showSmall() {
			this.showFullScreen = false;
			// 退出全屏模式时恢复返回按钮的显示状态
			this.$store.commit('setShowBackButton', true);
		},

		// 获取指定大小图片
		getSpecifySizeImgBtn() {
			this.dialogVisible = true;
			this.loading = false;
		},
		// 弹窗的确定
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.showBingImgInfo = false;
					this.loading = true;
					this.fetchData();
					// // 接口请求
					// axios
					// 	.get(`https://picsum.photos/500/300`, { responseType: "blob" })
					// 	.then(res => {
					// 		// 方法一
					// 		// let blob = new Blob([res.data], { type: "image/jpeg;charset-UTF-8" });
					// 		// this.imageUrl = URL.createObjectURL(blob);
					// 		// 方法二
					// 		// 创建一个 URL 对象
					// 		// this.imageUrl = URL.createObjectURL(res.data);
					// 	})
					// 	.catch(err => {
					// 		console.log("err === ", err);
					// 	});
				} else {
				}
			});
		},
		// 弹窗的重置
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		async fetchData() {
			try {
				let url = `https://picsum.photos/${this.dataForm.width}/${this.dataForm.height}`;
				// 定义三个请求
				const res1 = axios.get(url, { responseType: "blob" });
				const res2 = axios.get(url, { responseType: "blob" });
				const res3 = axios.get(url, { responseType: "blob" });

				// 使用 Promise.all 同时发送请求
				const resAll = await Promise.all([res1, res2, res3]);
				console.log("resAll === 123123123 ", resAll);
				// 处理响应结果
				this.firstImg = URL.createObjectURL(resAll[0].data);
				this.dogImg = URL.createObjectURL(resAll[1].data);
				this.catImg = URL.createObjectURL(resAll[2].data);
				this.loading = false;
				this.dialogVisible = false;
			} catch (error) {
				this.error = "请求失败，请稍后再试。";
				console.error("Error fetching data:", error);
				// this.dialogVisible = false;
				this.loading = false;
				this.$message({ type: "error", message: "请求失败，请更换图片尺寸或稍后重试" });
			} finally {
				this.dialogVisible = false;
				this.loading = false;
				this.loading = false;
			}
		},
		// 点击图片类型的按钮，显示图片类型的弹窗
		getTypeImgBtn() {
			this.dialogVisibleType = true;
		},
		// 弹窗的确定
		submitFormType(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.showBingImgInfo = false;
					this.loading = true;
					this.fetchDataType();
				} else {
				}
			});
		},

		// 切换图片类型后点击确定
		fetchDataType() {
			this.firstImg = "";
			this.dogImg = "";
			this.catImg = "";
			this.loading = true;
			let t = Date.now();
			console.log("t === ", t);
			// 处理第一张图片
			setTimeout(() => {
				if (specialUrlList.includes(this.dataFormType.url1)) {
					this.firstImg = `${this.dataFormType.url1}?t=${t + 1}`;
				} else {
					this.firstImg = `${this.dataFormType.url1}&t=${t + 1}`;
				}
			}, 2000);

			// 处理第二张图片
			setTimeout(() => {
				if (specialUrlList.includes(this.dataFormType.url2)) {
					this.dogImg = `${this.dataFormType.url2}?t=${t + 2}`;
				} else {
					this.dogImg = `${this.dataFormType.url2}&t=${t + 2}`;
				}
			}, 4000);

			// 处理第三张图片
			setTimeout(() => {
				if (specialUrlList.includes(this.dataFormType.url3)) {
					this.catImg = `${this.dataFormType.url3}?t=${t + 3}`;
				} else {
					this.catImg = `${this.dataFormType.url3}&t=${t + 3}`;
				}
				this.dialogVisibleType = false;
				this.loading = false;
			}, 6000);
		},
		// bing
		getImgBingBtn() {
			this.dialogVisibleBing = true;
		},
		submitFormBing(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.loading = true;
					this.fetchDataBing();
				} else {
				}
			});
		},
		// 处理bing图片拼接url
		addHttpsPrefix(url) {
			const strUrl = String(url || '');
			return strUrl.startsWith('https://')
				? strUrl
				: `https://www.bing.com${strUrl}`;
		},
		async fetchDataBing() {
			try {
				let dayFirst = formatDate_(this.dataFormBing.day1);
				let secondFirst = formatDate_(this.dataFormBing.day2);
				let thirdFirst = formatDate_(this.dataFormBing.day3);
				// .get(`https://raw.githubusercontent.com/Zhu-junwei/bing-wallpaper-archive/master/${dayFirst}.json`)
				// .get(`https://raw.githubusercontent.com/Zhu-junwei/bing-wallpaper-archive/master/${secondFirst}.json`)
				// .get(`https://raw.githubusercontent.com/Zhu-junwei/bing-wallpaper-archive/master/${thirdFirst}.json`)
				let url1 = `https://raw.githubusercontent.com/Zhu-junwei/bing-wallpaper-archive/master/${dayFirst}.json`;
				let url2 = `https://raw.githubusercontent.com/Zhu-junwei/bing-wallpaper-archive/master/${secondFirst}.json`;
				let url3 = `https://raw.githubusercontent.com/Zhu-junwei/bing-wallpaper-archive/master/${thirdFirst}.json`;
				// 定义三个请求
				const res1 = await axios.get(url1);
				await delay(1000);
				const res2 = await axios.get(url2);
				await delay(1000);
				const res3 = await axios.get(url3);
				// 使用 Promise.all 同时发送请求

				
				const resAll = [res1, res2, res3];
		    console.log("最新的接口 ============== ", resAll)
				// 处理响应结果
				this.firstImg = this.addHttpsPrefix(resAll[0].data.images[0].url);
				this.dogImg = this.addHttpsPrefix(resAll[1].data.images[0].url);
				this.catImg = this.addHttpsPrefix(resAll[2].data.images[0].url);
				console.log("this.firstImg === ", this.firstImg)
				console.log("this.dogImg === ", this.dogImg)
				console.log("this.catImg === ", this.catImg)
				this.bingTitle1 = resAll[0].data.images[0].title + "——" + resAll[0].data.images[0].copyright + `（${resAll[0].data.images[0].enddate}）`;
				this.bingTitle2 = resAll[1].data.images[0].title + "——" + resAll[1].data.images[0].copyright + `（${resAll[1].data.images[0].enddate}）`;
				this.bingTitle3 = resAll[2].data.images[0].title + "——" + resAll[2].data.images[0].copyright + `（${resAll[2].data.images[0].enddate}）`;
				console.log("this.bingTitle1 === ", this.bingTitle1)
				console.log("this.bingTitle2 === ", this.bingTitle2)
				console.log("this.bingTitle3 === ", this.bingTitle3)
				this.loading = false;
				this.dialogVisibleBing = false;
				this.showBingImgInfo = true;
			} catch (error) {
				this.error = "请求失败，请稍后再试。";
				console.error("Error fetching data:", error);
				this.loading = false;
				this.$message({ type: "error", message: "请求失败，请稍后再试。" });
				this.anotherBing()
			} finally {
				this.dialogVisibleBing = false;
				this.loading = false;
			}
		},
		async anotherBing() {
			// 之前的接口，时好时坏，通常是好的 =======================================================
			try {
				let baseURL = "https://cn.bing.com/";
				let dayFirst = calculateDays(this.dataFormBing.day1);
				let secondFirst = calculateDays(this.dataFormBing.day2);
				let thirdFirst = calculateDays(this.dataFormBing.day3);
				//  https://cn.bing.com/HPImageArchive.aspx?format=js&idx=${dayFirst}&n=1&mkt=zh-CN
				//  https://cn.bing.com/HPImageArchive.aspx?format=js&idx=${secondFirst}&n=1&mkt=zh-CN
				//  https://cn.bing.com/HPImageArchive.aspx?format=js&idx=${thirdFirst}&n=1&mkt=zh-CN
				let url1 = `/uuu?format=js&idx=${dayFirst}&n=1&mkt=zh-CN`;
				let url2 = `/uuu?format=js&idx=${secondFirst}&n=1&mkt=zh-CN`;
				let url3 = `/uuu?format=js&idx=${thirdFirst}&n=1&mkt=zh-CN`;
				// 定义三个请求
				const res1 = axios.get(url1);
				const res2 = axios.get(url2);
				const res3 = axios.get(url3);
				// 使用 Promise.all 同时发送请求
				const resAll = await Promise.all([res1, res2, res3]);
				console.log("resAll === 另外一个 ", resAll);
				// 处理响应结果
				this.firstImg = baseURL + resAll[0].data.images[0].url
				this.dogImg = baseURL + resAll[1].data.images[0].url
				this.catImg = baseURL + resAll[2].data.images[0].url
				this.bingTitle1 = resAll[0].data.images[0].title + "——" + "  " + resAll[0].data.images[0].copyright;
				this.bingTitle2 = resAll[1].data.images[0].title + "——" + "  " + resAll[1].data.images[0].copyright;
				this.bingTitle3 = resAll[2].data.images[0].title + "——" + "  " + resAll[2].data.images[0].copyright;
				this.loading = false;
				this.dialogVisibleBing = false;
				this.showBingImgInfo = true;
			} catch (error) {
				this.error = "请求失败，请稍后再试。";
				console.error("Error fetching data:", error);
				this.loading = false;
				this.$message({ type: "error", message: "请求失败，请稍后再试。" });
			} finally {
				this.dialogVisibleBing = false;
				this.loading = false;
			}
		},
		// 将此方法封装为公共方法
		// 计算选中日期是当前日期的前第几天，当天是第0天，不允许选今天之后的日期,value: 时间戳毫秒数
		// calculateDays(value) {
		//     console.log('calculateDays(value) === ', value)
		// 	if (value) {
		// 		const currentDate = new Date();
		// 		const selectedDate = new Date(value);
		// 		const diffTime = currentDate - selectedDate; // 时间差（毫秒）
		// 		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1; // 转换为天数
		// 		return diffDays;
		// 	} else {
		// 		return 0;
		// 	}
		// },
		// 点击图片树按钮
		getImgTreeBtn() {
			this.dialogVisibleTree = true;
		},
		// 图片树的确定
		submitFormTree() {
			this.showBingImgInfo = false;
			let t = Date.now();
			this.loading = true;
			let url1 = this.formatValue(this.dataFormTree.url1);
			let url2 = this.formatValue(this.dataFormTree.url2);
			let url3 = this.formatValue(this.dataFormTree.url3);
			setTimeout(() => {
				if (!specialUrlList.includes(url1)) {
					this.firstImg = url1 + `&t=${t + 1}`;
				} else {
					this.firstImg = url1 + `?t=${t + 1}`;
				}
			}, 2000);

			setTimeout(() => {
				if (!specialUrlList.includes(url2)) {
					this.dogImg = url2 + `&t=${t + 2}`;
				} else {
					this.dogImg = url2 + `?t=${t + 2}`;
				}
			}, 5000);
			setTimeout(() => {
				if (!specialUrlList.includes(url3)) {
					this.catImg = url3 + `&t=${t + 3}`;
				} else {
					this.catImg = url3 + `?t=${t + 3}`;
				}
				this.dialogVisibleTree = false;
				this.loading = false;
			}, 8000);
		},
		// 判断级联选择器
		formatValue(data) {
			if (Array.isArray(data)) {
				return data[data.length - 1];
			} else {
				return data;
			}
		},
		// 获取当前日期昨天、前天的时间戳
		getYesterdayAndBeforeYesterdayTimestamp() {
			const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
			const now = new Date(); // 当前时间

			// 昨天的时间戳
			const yesterday = new Date(now - oneDay);
			const yesterdayTimestamp = yesterday.getTime();

			// 前天的时间戳
			const beforeYesterday = new Date(now - oneDay * 2);
			const beforeYesterdayTimestamp = beforeYesterday.getTime();

			return {
				yesterday: yesterdayTimestamp,
				beforeYesterday: beforeYesterdayTimestamp
			};
		}
		// 将此方法封装为公共方法
		// truncateToLastChineseChar(str) {
		// 	// 定义一个正则表达式来匹配所有的中文字符
		// 	const chineseCharRegex = /[\u4e00-\u9fa5]/g;
		// 	// 使用 matchAll 来获取所有匹配项的迭代器
		// 	let matchesIterator = str.matchAll(chineseCharRegex);
		// 	let lastMatch = null;

		// 	// 遍历所有匹配项，记录最后的一个匹配
		// 	for (const match of matchesIterator) {
		// 		lastMatch = match;
		// 	}
		// 	// 如果没有找到任何中文字符，则返回空字符串或根据需要处理
		// 	if (!lastMatch) return "";
		// 	// 截取从字符串开始到最后一个中文字符的位置（包括该字符）
		// 	return str.slice(0, lastMatch.index + lastMatch[0].length);
		// }
	}
};
</script>

<style scoped lang="less">
.all {
	background-color: aquamarine;
	margin: 1vh;
	height: 96vh;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
}

.allScreen {
	width: 100vw;
	// height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	h1 {
		text-align: center;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		box-sizing: border-box;
	}

	img {
		max-width: 100%;
		max-height: calc(100vh - 115px); /* 留出空间给标题 */
		object-fit: contain;
		flex-shrink: 0;
	}
}


.item {
	width: 49%;
	height: 49%;
	background-color: #2cbc4b;

	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
}

.item:nth-child(1) {
	border-bottom: 2% solid #000;
	position: relative;

	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
}

.item:nth-child(2) {
	border-bottom: 2% solid #000;
	position: relative;

	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
}

.item:nth-child(3) {
	border-right: 2% solid #000;
	position: relative;

	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
}

.item4 {
	position: relative;
	overflow: hidden;

	img {
		width: 200%;
		height: 200%;
		position: absolute;
		object-fit: contain;
	}
}

// ============================
.mask {
	background: rgba(255, 255, 0, 0.4);
	position: absolute;
	top: 0px;
	left: 0px;
	cursor: move;
}
</style>
