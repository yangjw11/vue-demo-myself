<template>
	<div>
		<div class="title1">【lodash库的一些示例 并且结合】</div>
		<div class="title2">中文官网：https://www.lodashjs.com/</div>
		<div style="width: 100%; text-align: left">
			<div>
				<el-button @click="add()">_.add(augend, addend)</el-button>
				<span>控制台输出</span>
			</div>
		</div>
    <hr>
		<h1>Decimal.js 示例</h1>
		<p>计算结果: {{ result }}</p>
		<el-button @click="test()">看控制台输出</el-button>
	</div>
</template>
<script>
export default {
	data() {
		return {
			result: null
		};
	},
	created() {
		const num1 = new this.$Decimal(0.1);
		const num2 = new this.$Decimal(0.2);
		this.result = num1.plus(num2).toString(); // 结果应为 "0.3"
  //   console.log('打印8.12*100的结果', 8.12*100)
  //   console.log('打印9.12*100的结果', 9.12*100)
 
  //   let c = new this.$Decimal(8.12).mul(new this.$Decimal(100))
  //   let d = new this.$Decimal(9.12).mul(new this.$Decimal(100))
  //   console.log('c', c)
  //   console.log('d', d)
	},
	methods: {
		add() {
			let result = this._.sum([0.1, 0.2]);
			console.log("result === ", result);
		},
		test(){
			let res = this._.sum([1953283856313462786, 0]);
			console.log('res === ', res)
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
