<template>
	<div>
		<div class="title1"></div>
		<div class="title2"></div>
		<el-button type="primary" @click="fetchData">点击按钮，测试公共请求</el-button>
	</div>
</template>
<script>
export default {
	data() {
		return {};
	},
	methods: {
		fetchData() {
            let dateStr = '2025-02-24'
			// 使用.then()和.catch()来处理请求结果
			this.$http
				.get(`/aaa?c=dailysentence&m=getdetail&title=${dateStr}`)
				.then(response => {
					// 成功时的操作
					console.log('response === ', response)
				})
				.catch(error => {
					// 错误时的操作
					console.error("There was an error fetching the data!", error);
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
</style>
