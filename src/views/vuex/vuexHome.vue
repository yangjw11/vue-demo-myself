<template>
	<div>
		<!-- <h2>{{ msg }}</h2>
		<hr />
		<h3>{{ $store.state.count }}</h3>
		<el-button type="primary" @click="$store.commit('add', 10)">+</el-button>
		<el-button type="primary" @click="reduce">-</el-button> -->
		<div style="margin-top: 20px">
			<el-button class="item" type="primary" @click="jump()">【跳转vuexHome1示例】</el-button>
		</div>
	</div>
</template>
<script>
// import store from "@/store";
// import { mapMutations } from "vuex";
export default {
	data() {
		return {
			msg: "Hello Vuex"
		};
	},
	// store,
	// computed: {
	// 	count() {
	// 		// 111
	// 		return (count = this.$store.getters.count);
	// 	}
	// },
	methods: {
		// ...mapMutations(["add", "reduce"]),
		jump() {
      console.log('11111111111')

			this.$router.push({
				path: "/vuex/another"
			});
		}
	}
};
</script>
