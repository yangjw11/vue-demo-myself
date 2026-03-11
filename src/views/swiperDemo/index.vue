<template>
	<div>
		<div class="title1">【swiper插件练习】</div>
		<div class="title2">点击按钮切换两个练习</div>
		<div style="width: 100%; text-align: center;">
			<el-button type="primary">练习一</el-button>
			<el-button type="primary">练习二</el-button>
		</div>
		<div class="demo">
			<div class="swiper-container">
				<swiper :options="swiperOption" ref="mySwiper" class="my-swiper-container">
					<swiper-slide>I'm Slide 1</swiper-slide>
					<swiper-slide>I'm Slide 2</swiper-slide>
					<swiper-slide>I'm Slide 3</swiper-slide>
					<div class="swiper-pagination" slot="pagination"></div>
				</swiper>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: "MySwiperComponent",
	data() {
		return {
			swiperOption: {
				loop: true,
				autoplay: {
					delay: 3000,
					stopOnLastSlide: false,
					disableOnInteraction: false
				},
        speed: 2000,
				pagination: {
					el: ".swiper-pagination",
					type: "fraction",
					clickable: true
				}
			}
		};
	},
	methods: {}
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

.my-swiper-container {
	width: 600px;
	height: 300px;
	position: relative;
	.swiper-slide,
	.swiper-slide-active {
		text-align: center;
		width: 138px;
		// height: 355px;
		// background-color: #c2781e;
		margin: 5px 0; /* 每个子元素的上下边距 */
		// padding: 10px; /* 子元素内边距 */
		position: relative;
	}
	.swiper-slide {
		border: 1px solid #000;
	}
	.swiper-slide-active {
		border: 1px solid #0090f0;
		background-color: #b9b9b9;
		box-shadow: 2px 2px 2px 2px #1a4bb1;
	}
	.itemImg {
		width: 138px;
		height: 100%;
		position: absolute;
		top: 0px;
		left: 0px;
	}
	.desc {
		position: absolute;
		bottom: 0;
	}
}
</style>
