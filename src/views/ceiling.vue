<template>
	<div>
		<div class="title1">【ElementUI固定列的表格吸顶表头】</div>
		<div class="title2">需求：吸顶之后还要固定列滚动</div>
		<div style="width: 50%; text-align: center;">
			<el-table :data="tableData" border style="width: 100%">
				<el-table-column fixed prop="date" label="日期" width="150"> </el-table-column>
				<el-table-column prop="name" label="姓名" width="120"> </el-table-column>
				<el-table-column prop="province" label="省份" width="120"> </el-table-column>
				<el-table-column prop="city" label="市区" width="120"> </el-table-column>
				<el-table-column prop="address" label="地址" width="300"> </el-table-column>
				<el-table-column prop="zip" label="邮编" width="120"> </el-table-column>
				<el-table-column fixed="right" label="操作" width="100">
					<template slot-scope="scope">
						<el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
						<el-button type="text" size="small">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			tableData: [
				{
					date: "2016-05-02",
					name: "王小虎",
					province: "上海",
					city: "普陀区",
					address: "上海市普陀区金沙江路 1518 弄",
					zip: 200333
				},
				{
					date: "2016-05-04",
					name: "王小虎",
					province: "上海",
					city: "普陀区",
					address: "上海市普陀区金沙江路 1517 弄",
					zip: 200333
				},
				{
					date: "2016-05-01",
					name: "王小虎",
					province: "上海",
					city: "普陀区",
					address: "上海市普陀区金沙江路 1519 弄",
					zip: 200333
				},
				{
					date: "2016-05-03",
					name: "王小虎",
					province: "上海",
					city: "普陀区",
					address: "上海市普陀区金沙江路 1516 弄",
					zip: 200333
				},
        {
					date: "2016-05-02",
					name: "王小虎",
					province: "上海",
					city: "普陀区",
					address: "上海市普陀区金沙江路 1518 弄",
					zip: 200333
				},
				{
					date: "2016-05-04",
					name: "王小虎",
					province: "上海",
					city: "普陀区",
					address: "上海市普陀区金沙江路 1517 弄",
					zip: 200333
				},
				{
					date: "2016-05-01",
					name: "王小虎",
					province: "上海",
					city: "普陀区",
					address: "上海市普陀区金沙江路 1519 弄",
					zip: 200333
				},
				{
					date: "2016-05-03",
					name: "王小虎",
					province: "上海",
					city: "普陀区",
					address: "上海市普陀区金沙江路 1516 弄",
					zip: 200333
				},
        {
					date: "2016-05-02",
					name: "王小虎",
					province: "上海",
					city: "普陀区",
					address: "上海市普陀区金沙江路 1518 弄",
					zip: 200333
				},
				{
					date: "2016-05-04",
					name: "王小虎",
					province: "上海",
					city: "普陀区",
					address: "上海市普陀区金沙江路 1517 弄",
					zip: 200333
				},
				{
					date: "2016-05-01",
					name: "王小虎",
					province: "上海",
					city: "普陀区",
					address: "上海市普陀区金沙江路 1519 弄",
					zip: 200333
				},
				{
					date: "2016-05-03",
					name: "王小虎",
					province: "上海",
					city: "普陀区",
					address: "上海市普陀区金沙江路 1516 弄",
					zip: 200333
				},
        {
					date: "2016-05-02",
					name: "王小虎",
					province: "上海",
					city: "普陀区",
					address: "上海市普陀区金沙江路 1518 弄",
					zip: 200333
				},
				{
					date: "2016-05-04",
					name: "王小虎",
					province: "上海",
					city: "普陀区",
					address: "上海市普陀区金沙江路 1517 弄",
					zip: 200333
				},
				{
					date: "2016-05-01",
					name: "王小虎",
					province: "上海",
					city: "普陀区",
					address: "上海市普陀区金沙江路 1519 弄",
					zip: 200333
				},
				{
					date: "2016-05-03",
					name: "王小虎",
					province: "上海",
					city: "普陀区",
					address: "上海市普陀区金沙江路 1516 弄",
					zip: 200333
				},
        {
					date: "2016-05-02",
					name: "王小虎",
					province: "上海",
					city: "普陀区",
					address: "上海市普陀区金沙江路 1518 弄",
					zip: 200333
				},
				{
					date: "2016-05-04",
					name: "王小虎",
					province: "上海",
					city: "普陀区",
					address: "上海市普陀区金沙江路 1517 弄",
					zip: 200333
				},
				{
					date: "2016-05-01",
					name: "王小虎",
					province: "上海",
					city: "普陀区",
					address: "上海市普陀区金沙江路 1519 弄",
					zip: 200333
				},
				{
					date: "2016-05-03",
					name: "王小虎",
					province: "上海",
					city: "普陀区",
					address: "上海市普陀区金沙江路 1516 弄",
					zip: 200333
				}
			]
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
</style>
