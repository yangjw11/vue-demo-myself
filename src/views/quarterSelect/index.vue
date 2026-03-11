<template>
	<div>
		<el-form>
			<el-form-item label="统计周期">
				<el-radio-group v-model="timeType">
					<el-radio :label="1">周</el-radio>
					<el-radio :label="2">月</el-radio>
					<el-radio :label="3">季</el-radio>
					<el-radio :label="4">年</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="统计时间">
				<el-date-picker v-if="timeType == 1" v-model="value2" type="week" format="yyyy 第 WW 周" placeholder="选择周" @change="changeTime"></el-date-picker>
				<el-date-picker v-if="timeType == 2" v-model="value2" type="month" placeholder="选择月" @change="changeTimeM"></el-date-picker>
				<el-date-picker v-if="timeType == 4" v-model="value2" type="year" placeholder="选择年" @change="changeTimeY"></el-date-picker>
				<quarter-component v-if="timeType == 3" @getTime="getmgTime" :defaultValue="defaultValue" />
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import quarterComponent from "./quarterComponent.vue";
export default {
	components: { quarterComponent },
	data() {
		return {
			// 查询参数
			timeType: 1, // 默认是周
			value2: new Date(new Date().valueOf()), // 给时间选择器赋值
			defaultValue: new Date().getFullYear() + "—" + (new Date().getMonth() + 1), // 季度子组件上传当前的时间
			queryParams: {
				startTime: undefined,
				endTime: undefined
			}
		};
	},
	created() {
		// 初始化时获取选择器为周时开始时间和结束时间
		this.queryParams.startTime = this.getMonday("s", 0) + "00:00:00";
		this.queryParams.endTime = this.getMonday("e", 0) + "23:59:59";
	},
	methods: {
		//获取周的开始时间和结束时间
		getMonday(type, dates) {
			var now = new Date();
			var nowTime = now.getTime();
			var day = now.getDay();
			var longTime = 24 * 60 * 60 * 1000;
			var n = longTime * 7 * (dates || 0);
			if (type == "s") {
				var dd = nowTime - (day - 1) * longTime + n;
			}
			if (type == "e") {
				var dd = nowTime + (7 - day) * longTime + n;
			}
			dd = new Date(dd);
			var y = dd.getFullYear();
			var m = dd.getMonth() + 1;
			var d = dd.getDate();
			m = m < 10 ? "0" + m : m;
			d = d < 10 ? "0" + d : d;
			var day = y + "-" + m + "-" + d;
			return day;
		},
		//周
		changeTime(data) {
			let date = new Date(data);
			let y = date.getFullYear();
			let m = date.getMonth();
			let d = date.getDate();
			let week = date.getDay();
			let start = new Date(y, m, d - week);
			let end = new Date(y, m, d - week + 6);
			this.queryParams.startTime = this.getCurrentTime(start, 0) + " 00:00:00";
			this.queryParams.endTime = this.getCurrentTime(end, 0) + " 23:59:59";
            console.log('this.queryParams === ', this.queryParams)
		},
		//月
		changeTimeM(data) {
			this.queryParams.startTime = this.getCurrentTime(data, 0) + " 00:00:00";
			this.queryParams.endTime = this.getCurrentTime(this.getCuurrentTimeM(data), 0) + " 23:59:59";
			console.log(this.queryParams);
		},
		//年
		changeTimeY(data) {
			this.queryParams.startTime = this.getCurrentTime(data, 0) + " 00:00:00";
			this.queryParams.endTime = this.getCurrentTime(this.getCuurrentTimeY(data), 0) + " 23:59:59";
			console.log(this.queryParams);
		},
		getCurrentTime(data, num) {
			let date = new Date(data);
			let Y = date.getFullYear();
			let M = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
			let D = date.getDate() + num < 10 ? "0" + (date.getDate() + num) : date.getDate() + num;
			date = Y + "-" + M + "-" + D;
			return date;
		},
		getCuurrentTimeM(data) {
			let date = new Date(data);
			let Y = date.getFullYear();
			let M = date.getMonth();
			return new Date(Y, M + 1, 0).toLocaleDateString();
		},
		getCuurrentTimeY(data) {
			let date = new Date(data);
			let Y = date.getFullYear();
			return new Date(Y, 11, 31).toLocaleDateString();
		},
		//获得某月的天数
		getMonthDays: function(nowYear, myMonth) {
			var monthStartDate = new Date(nowYear, myMonth, 1);
			var monthEndDate = new Date(nowYear, myMonth + 1, 1);
			var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
			return days;
		},
		//获得本季度的结束日期
		getQuarterEndDate(data) {
			let date = new Date(data);
			let nowYear = date.getFullYear();
			let M = date.getMonth();
			var quarterEndMonth = M + 2;
			var quarterStartDate = new Date(nowYear, quarterEndMonth, this.getMonthDays(nowYear, quarterEndMonth));
			return this.getAllDate(quarterStartDate, "yyyy-MM-dd");
		},
		//获得本季度的开始月份
		getQuarterStartMonth: function(nowMonth) {
			var quarterStartMonth = 0;
			if (nowMonth < 3) {
				quarterStartMonth = 0;
			}
			if (2 < nowMonth && nowMonth < 6) {
				quarterStartMonth = 3;
			}
			if (5 < nowMonth && nowMonth < 9) {
				quarterStartMonth = 6;
			}
			if (nowMonth > 8) {
				quarterStartMonth = 9;
			}
			return quarterStartMonth;
		},
		//获得日期
		getAllDate: function(date, fmt) {
			if (null == fmt || undefined == fmt || "" == fmt) fmt = "yyyy/MM/dd";
			var date = new Date(date);
			var o = {
				"M+": date.getMonth() + 1, //月份
				"d+": date.getDate() //日
			};
			if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
			for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			return fmt;
		},
		getmgTime(data) {
			let start = data + "-01";
			this.queryParams.startTime = start + " 00:00:00";
			let end = this.getQuarterEndDate(start);
			this.queryParams.endTime = end + " 23:59:59";
			console.log("this.queryParams === ", this.queryParams);
		}
	},
	watch: {
		//监听内容
		timeType() {
			if (this.timeType == 1) {
				//周
				this.value2 = new Date(new Date().valueOf());
				this.queryParams.startTime = this.getMonday("s", 0) + " 00:00:00";
				this.queryParams.endTime = this.getMonday("e", 0) + " 23:59:59";
			} else if (this.timeType == 2) {
				//月
				this.value2 = new Date().getFullYear() + "-" + (new Date().getMonth() + 1);
				this.changeTimeM(this.value2);
			} else if (this.timeType == 3) {
				//季度
				let date = new Date();
				let y = date.getFullYear();
				let M = date.getMonth();
				let quarterStartDate = new Date(y, this.getQuarterStartMonth(M), 1);
				let starts = this.getAllDate(quarterStartDate, "yyyy-MM-dd");
				let end = this.getQuarterEndDate(starts);
				this.queryParams.startTime = starts + " 00:00:00";
				this.queryParams.endTime = end + " 23:59:59";
			} else if (this.timeType == 4) {
				//年
				let date = new Date();
				let y = date.getFullYear();
				this.value2 = y.toString();
				this.changeTimeY(this.value2);
			}
		}
	}
};
</script>

<style></style>
