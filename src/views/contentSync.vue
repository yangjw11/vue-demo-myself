<template>
	<div>
		<div class="title1">仿【嵌套路由同步输入框内容】</div>
		<div class="title2">结合vuex,computed</div>
		<div style="width: 100%; text-align: center;">第一个：<el-input v-model="input1"></el-input> 第二个：<el-input v-model="input2"></el-input></div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			// input1: "",
			// input2: ""
		};
	},
	computed: {
		input1: {
			get() {
				return this.$store.getters.sharedInput;
			},
			set(value) {
				this.$store.dispatch("updateSharedInput", value);
			}
		},
		input2: {
			get() {
				return this.$store.getters.sharedInput;
			},
			set(value) {
				this.$store.dispatch("updateSharedInput", value);
			}
		}
	},
	methods: {}
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
