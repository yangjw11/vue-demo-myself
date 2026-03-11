<template>
	<div>
		<div style="width: 500px">
			<editor :height="500" v-model="yourContent"></editor>
			<!-- 通过传值的方式改变富文本编辑器的高度 -->
		</div>
		<div>
			<el-button @click="print()" type="primary">点击打印值</el-button>
			<el-button @click="changeToString()" type="primary">转换字符串</el-button>
			<el-button @click="changeToArray()" type="primary">转换字符串</el-button>
		</div>
	</div>
</template>

<script>
import Editor from "../components/tinymce.vue";
export default {
	components: {
		Editor
	},
	data() {
		return {
			yourContent: "",
			newNumber: "111111111"
		};
	},
	watch: {
		yourContent(newValue, oldValue) {
			if (newValue) {
				this.saveOnLocalstorage();
			}
		}
	},
	created() {
		this.yourContent = sessionStorage.getItem("yourContent");
	},
	mounted() {},
	methods: {
		print() {
			console.log("this.yourContent === ", this.yourContent);
		},
		changeToString() {
			let str = this.yourContent;
			const numbers = str.match(/\d/g);
			// 如果没有找到任何数字，则返回空字符串
			if (!numbers) return "";
			// 否则，将数字数组连接成一个字符串并返回
			let newNumber = numbers.join("");
			this.newNumber = newNumber;
      console.log('this.newNumber === ', this.newNumber)
		},
		saveOnLocalstorage() {
			sessionStorage.setItem("yourContent", this.yourContent);
		},
		changeToArray() {
			let result = [];
			for (let i = 0; i < this.newNumber.length; i += 9) {
				result.push(this.newNumber.substring(i, i + 9));
			}
			console.log('result === ', result)
		}
	}
};
</script>

<style scoped></style>
