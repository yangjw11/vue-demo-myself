<!--
 * @Author: yangJianWei yangjianwei@chexiao.co
 * @Date: 2026-01-30 10:15:49
 * @LastEditors: yangJianWei yangjianwei@chexiao.co
 * @LastEditTime: 2026-02-10 15:01:54
 * @FilePath: \vue-demo-myself\src\views\zzz\zzz.vue
 * @@Description: 
-->
<template>
	<div>
		<div class="title1">接口返回图片文件流的展示</div>
		<div class="title2"></div>
		<div style="width: 100%; text-align: center;">
			<img :src="imageUrl" alt="图片" />
		</div>
		<el-button type="primary" @click="btnClick()">点击调用获取图片文件流接口</el-button>
    <el-button type="primary" @click="printBtn()">打印引入的内容</el-button>
	</div>
</template>
<script>
import axios from "axios";
import { config as globalConfig } from "@/config";
export default {
	data() {
		return {
			num: 123,
			imageUrl: ""
		};
	},
	created() {},
	mounted() {},
	methods: {
		btnClick() {
			axios
				.get(`https://picsum.photos/500/300`, { responseType: "blob" })
				.then(res => {
					let blob = new Blob([res.data], { type: "image/jpeg;charset-UTF-8" });
					let link = URL.createObjectURL(blob);
                    // window.open(link);
                    this.imageUrl = link
					console.log("this.imageUrl === ", this.imageUrl);
					// 创建一个 URL 对象
					// this.imageUrl = URL.createObjectURL(res.data);
				})
				.catch(err => {
					console.log("err === ", err);
				});
		},
    printBtn() {
      console.log("globalConfig === ", globalConfig)
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
