<template>
	<div>
		<div class="title1">看控制台打印</div>
		<div class="title2"></div>
		<div style="width: 100%; text-align: center;"></div>
		<el-button type="primary" @click="btnClick()">点击看结合代码看执行顺序</el-button>
	</div>
</template>
<script>
import axios from "axios";
export default {
	data() {
		return {
			num: 123
		};
	},
	created() {},
	mounted() {},
	methods: {
		async btnClick() {
			console.log("1");
			console.log("2");
			console.log("3");
			console.log("4");
			// 第一种写法，会答应后面的5,6,7 ================================================
			// this.verfyNum(this.num);

			// 第二种写法，不会打印后面的5,6,7 ======================================
			// let res = this.verfyNum(this.num)
			// if(!res) return
			// console.log("5");
			// console.log("6");
			// console.log("7");

			// 第三种写法，promise改造 =========================================
			// this.verfyNum(this.num).then(() => {
			// 	console.log("5");
			// 	console.log("6");
			// 	console.log("7");
			// });

			// 使用async/await改造 注意async书写的位置 =============================================================

			try {
				let res;
				res = await this.verfyNum(this.num);
				if (res) {
					console.log("5");
					console.log("6");
					console.log("7");
				} else {
					throw new Error("fffffff");
				}
			} catch (error) {
				console.log("error === ", error);
				console.log("hahahahaha");
			}
		},
		// 校验数字 第一种写法和第二种写法
		// verfyNum(num) {
		// 	return new Promise((resolve, reject) => {
		// 		if (num < 10) {
		// 			resolve(true);
		// 		} else {
		// 			reject(false);
		// 		}
		// 	});
		// },
		verfyNum(num) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					if (num < 10) {
						resolve(true);
					} else {
						reject("数字大于10");
					}
				}, 3000);
			});
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
