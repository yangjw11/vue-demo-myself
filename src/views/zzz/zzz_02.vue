<template>
	<div>
		<div class="title1">看控制台打印</div>
		<div class="title2"></div>
		<div style="width: 100%; text-align: center;"></div>
		<el-button type="primary" @click="btnClick">点击看结合代码看执行顺序</el-button>
	</div>
</template>
<script>
import axios from "axios";
export default {
	data() {
		return {
            num: 10
        };
	},
	created() {},
	mounted() {},
	methods: {
		btnClick(){
            console.log('11111')
            console.log('22222')
            console.log('33333')
            console.log('44444')
            this.verfyNum(this.num)
            console.log('55555')
            console.log('66666')
            console.log('77777')
        },
        // 校验数字
        verfyNum(num){
            if(num < 10) {
                return false 
            }
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
