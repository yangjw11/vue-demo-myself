<template>
	<div>
		<el-tree :data="treeData" node-key="id" :props="defaultProps" :highlight-current="true" :expand-on-click-node="false" ref="tree">
			<template #default="{ node, data }">
				<!-- 使用默认的树节点内容 -->
				<span class="custom-tree-node" @mouseenter="handleMouseEnter(node, $event)" @mouseleave="handleMouseLeave(node)">
					{{ node.label }}
					<!-- 添加一个按钮，初始状态为隐藏 -->
					<button class="node-button" v-if="node.id===1" @click="handleButtonClick(node)">加号</button>
					<button class="node-button" v-else @click="handleButtonClick(node)">三个点</button>
				</span>
			</template>
		</el-tree>
	</div>
</template>
<script>
export default {
	data() {
		return {
			treeData: [
				// 这里是你的树形数据结构
				{
					id: 1,
					label: "父节点1",
					children: [
						{ id: 2, label: "子节点1" },
						{ id: 3, label: "子节点2" }
					]
				}
				// 更多节点...
			],
			defaultProps: {
				children: "children",
				label: "label"
			},
			isShowBtn: false,
			isShowPlus: false, // 显示加号
			isShowPoint: false // 显示三个点
		};
	},
	methods: {
		handleMouseEnter(node, event) {
			this.isShowBtn = true;
			if (node.id === 1) {
				this.isShowPlus = true;
				this.isShowPoint = false;
			} else {
				this.isShowPlus = false;
				this.isShowPoint = true;
			}
			console.log("handleMouseEnter 进入的 node === ", node);
		},
		handleMouseLeave(node) {
			// node.hover = false;
			this.isShowBtn = false;
			this.isShowPlus = false;
			this.isShowPoint = false;
			console.log("handleMouseEnter 出去的 node === ", node);
		},
		handleButtonClick(node) {
			console.log(`Clicked on button for node: ${node.data.label}`);
			// 在这里处理按钮点击后的逻辑
		}
	}
};
</script>

<style scoped lang="scss">
.custom-tree-node {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.node-button {
	display: inline-block;
}
</style>
