<template>
	<div>
		<div class="title1">【vue中 transition标签的使用】</div>
		<div class="title2"></div>
		<div style="width: 100%; text-align: center">
			<button @click="bol = !bol">隐藏/显示</button>
			<!-- Vue 的内置动画标签 transition -->
			<transition>
				<!-- 只能包含 1 个元素 -->
				<h1 v-show="bol">组件动画效果</h1>
				<!-- 需要设置 v-show / v-if 属性控制元素的显示 -->
			</transition>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			bol: true
		};
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
/* 进入动画 */
.v-enter-active {
	animation: move 1s;
}

/* 离开动画 */
.v-leave-active {
	animation: move 1s reverse;
}

@keyframes move {
	from {
		transform: translateX(-100%);
	}
	to {
		transform: translate(0);
	}
}
</style>
