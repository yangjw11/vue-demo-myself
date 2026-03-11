<template>
	<div class="main">
        <echarts
              ref="option_dsEchart_top"
              chartId="chartId_dsEchart_top"
              :option="option_dsEchart_top"
              :isChartClick="true"
              :mouse_over_out="true"
              :mouse_over_out_colorList = "['red', 'green']"
              @chartClick="chartClickDsEchart_top"
            />
    </div>
</template>

<script>
import Echarts from "@/components/Echarts.vue";
import { handleProcess1 } from "./index.js";
export default {
	components: {
		Echarts
	},
    created(){
        this.option_dsEchart_top = handleProcess1();
    },
	data() {
		return {
            option_dsEchart_top: {}
        };
	},
	methods: {
        chartClickDsEchart_top(params){
            console.log('params === ', params)
        }
    }
};
</script>

<style scoped lang="scss">
.main{
    width: 600px;
    height: 400px;
}

</style>
