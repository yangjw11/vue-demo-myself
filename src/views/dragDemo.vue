<template>
	<div>
		<div class="title1">表格拖动功能，使用sortablejs</div>
		<div class="title2">官网：https://sortablejs.com/index.html</div>
		<div>
			<el-button type="primary" @click="updateTableData()">一键更新信息</el-button>
		</div>
		<div style="width: 100%; text-align: center;">
			<el-table :data="tableData" border id="table_count" stripe style="width: 100%">
				<el-table-column prop="date" label="日期" align="center" width="180"> </el-table-column>
				<el-table-column prop="name" label="姓名" align="center" width="180"> </el-table-column>
				<el-table-column prop="address" align="center" label="地址"> </el-table-column>
				<el-table-column prop="info" align="center" label="信息">
					<template slot-scope="scope">
						<div :class="{ 'highlight': scope.row.info === '新的111' }">
							{{ scope.row.info }}
						</div>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template>
						<i class="el-icon-rank handle"></i>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div>
			<el-button type="primary" @click="print()">打印表格数据</el-button>
		</div>
	</div>
</template>
<script>
import Sortable from "sortablejs";
import _ from "lodash";

export default {
	data() {
		return {
			oldList: [],
			tableData: [
				{
					date: "2016-05-01",
					name: "A",
					address: "东北那嘎达的",
					info: "旧的999"
				},
				{
					date: "2016-05-02",
					name: "B",
					address: "上海市普陀区金沙江路 1517 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-03",
					name: "C",
					address: "桃花岛",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "D",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "E",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "F",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "G",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "H",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "I",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "J",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "K",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "L",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "M",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "N",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "O",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "P",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "Q",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "R",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "S",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "T",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "U",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "V",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "W",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "X",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "Y",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				},
				{
					date: "2016-05-04",
					name: "Z",
					address: "西天大雷音寺1516 弄",
					info: "旧的999"
				}
			],
			tableDataClone: []
		};
	},
	mounted() {
		this.rowDrop();
		this.loadSakuraEffect()
	},
	beforeDestroy() {
		// 清除特效元素（根据实际生成的结构清理）
		const elements = document.querySelectorAll('.sakura-container, .sakura')
		debugger;
		elements.forEach(el => el.remove())
		window.sakuraEffectLoaded = false
	},
	methods: {
		rowDrop() {
			console.log(23);
			const el = document.querySelector("#table_count .el-table__body-wrapper tbody");
			new Sortable(el, {
				animation: 150,
				handle: ".handle",
				ghostClass: "blue-background-class",
				onEnd: evt => {
					this.tableDataClone = _.cloneDeep(this.tableData);
					// 使用 Vue 的数组变更方法来保证响应式
					const oldIndex = evt.oldIndex;
					const newIndex = evt.newIndex;

					if (oldIndex === newIndex) return;

					// 移除旧位置元素并保存到临时变量
					const [movedItem] = this.tableDataClone.splice(oldIndex, 1);

					// 插入到新位置
					this.tableDataClone.splice(newIndex, 0, movedItem);

					// 确保 DOM 更新完成后再打印
					// this.$nextTick(() => {

					// 	setTimeout(() => {
					// 		console.log("Updated tableDataClone:", JSON.parse(JSON.stringify(this.tableDataClone)));
					// 		this.tableData = _.cloneDeep(this.tableDataClone);
					// 	}, 100);
					// });


					setTimeout(() => {
						this.$nextTick(() => {
							this.tableData = [];
							console.log("Updated tableDataClone:", JSON.parse(JSON.stringify(this.tableDataClone)));
							this.tableData = _.cloneDeep(this.tableDataClone); Z
						})

					}, 0);


					// 最佳方案
					// this.tableData = [];
					// this.$nextTick(()=>{
					//     this.$set(this, "tableData", this.tableDataClone)
					// })
				}
			});
			// 想要直接整行拖动，需要去掉 new Sortable中 handle配置项，其中第一个参数为需要拖拽的HTML元素节点
		},
		print() {
			console.log("this.tableData === ", JSON.parse(JSON.stringify(this.tableData)));
		},
		// 一键更新所有信息
		updateTableData() {
			let promiseChain = Promise.resolve();
			this.tableData.forEach(item => {
				promiseChain = promiseChain.then(async () => {
					await this.changeInfo(item);
				});
			});
		},
		changeInfo(obj) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					obj.info = "新的111";
					resolve(true);
				}, 2000);
			});
		},
		loadSakuraEffect() {
			// 检查是否已加载
			if (window.sakuraEffectLoaded) return

			const script = document.createElement('script')
			script.src = 'https://api.vvhan.com/api/script/meihua'
			script.onload = () => {
				window.sakuraEffectLoaded = true
				console.log('樱花特效已加载')
			}
			document.body.appendChild(script)
		}
	}
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

/* 添加一些样式以提高用户体验 */
.el-table .sortable-ghost {
	opacity: 0.8;
	color: #fff !important;
	background: #42b983 !important;
}

.highlight {
	color: red;
	font-weight: bold;
}
</style>
