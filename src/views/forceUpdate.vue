<!--
 * @Author: yangJianWei yangjianwei@chexiao.co
 * @Date: 2026-01-08 17:10:16
 * @LastEditors: yangJianWei yangjianwei@chexiao.co
 * @LastEditTime: 2026-03-10 15:15:35
 * @FilePath: \vue-demo-myself\src\views\forceUpdate.vue
 * @@Description: 
-->
<template>
	<div>
		<p>姓名：{{ userInfo.name }}</p>
		<p>年龄：{{ userInfo.age }}</p>
		<button @click="addAge">添加年龄属性</button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			userInfo: {
				name: '张三'
			}
		};
	},
	methods: {
		addAge() {
			// 方案1 =====================================================
			// 直接新增属性（Vue 无法自动检测）
			this.userInfo.age = 25;
			// 强制更新视图
			this.$forceUpdate(); // 如果没有这行代码，点击按钮后，年龄的值还是没有显示

			// 方案2 =====================================================
			// 推荐方式：Vue.set
			// this.$set(this.userInfo, 'age', 25);
		}
	}
};
</script>