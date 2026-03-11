<template>
  <div class="tree-demo">
    <!-- 模式切换按钮组 -->
    <el-radio-group v-model="isStrictMode" size="small" class="mode-switch">
      <el-radio-button :label="false">父子联动模式</el-radio-button>
      <el-radio-button :label="true">独立选择模式</el-radio-button>
    </el-radio-group>

    <!-- el-tree 组件 -->
    <el-tree
      ref="tree"
      :data="treeData"
      show-checkbox
      node-key="id"
      :check-strictly="isStrictMode"
      @check="handleCheck"
      class="tree"
    />

    <!-- 显示当前选中节点的 id 和 label -->
    <div class="selection-info">
      <p>当前选中的节点（仅显示 id 和 label）：</p>
      <ul v-if="checkedNodes.length > 0" class="node-list">
        <li v-for="node in checkedNodes" :key="node.id">
          id: {{ node.id }}, label: {{ node.label }}
        </li>
      </ul>
      <p v-else class="empty-text">暂无选中节点</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeDemo',
  data() {
    return {
      // 模式切换：false = 父子联动（默认），true = 独立选择
      isStrictMode: false,
      // 树形数据示例
      treeData: [
        {
          id: 1,
          label: '父节点 1',
          children: [
            { id: 11, label: '子节点 1-1' },
            { id: 12, label: '子节点 1-2' },
            {
              id: 13,
              label: '子节点 1-3',
              children: [
                { id: 131, label: '孙节点 1-3-1' },
                { id: 132, label: '孙节点 1-3-2' }
              ]
            }
          ]
        },
        {
          id: 2,
          label: '父节点 2',
          children: [
            { id: 21, label: '子节点 2-1' },
            { id: 22, label: '子节点 2-2' }
          ]
        }
      ],
      // 用于在切换模式时临时保存选中的节点 key
      savedCheckedKeys: [],
      // 用于展示当前选中的完整节点对象（后续模板只取 id 和 label）
      checkedNodes: []
    };
  },
  watch: {
    // 监听模式切换，保留当前选中的节点
    isStrictMode(newVal, oldVal) {
      if (newVal !== oldVal) {
        // 1. 保存当前选中的节点 key
        this.savedCheckedKeys = this.$refs.tree.getCheckedKeys();
        // 2. 等待 DOM 更新后重新设置选中状态
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(this.savedCheckedKeys);
        });
      }
    }
  },
  mounted() {
    // 组件挂载后获取一次选中节点（初始为空）
    this.updateCheckedNodes();
  },
  methods: {
    // 勾选事件处理：更新展示的选中节点列表
    handleCheck(data, checked, indeterminate) {
      this.updateCheckedNodes();
      // 可以根据需要在此处添加其他业务逻辑
    },
    // 更新选中节点展示（从 tree 实例中获取）
    updateCheckedNodes() {
      if (this.$refs.tree) {
        this.checkedNodes = this.$refs.tree.getCheckedNodes();
      }
    }
  }
};
</script>

<style scoped>
.tree-demo {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.mode-switch {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.tree {
  margin-bottom: 20px;
}

.selection-info {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.selection-info p {
  margin: 0 0 10px 0;
  font-weight: bold;
  color: #606266;
}

.node-list {
  margin: 0;
  padding-left: 20px;
  color: #303133;
}

.node-list li {
  margin: 5px 0;
  font-size: 14px;
}

.empty-text {
  margin: 0;
  color: #909399;
  font-style: italic;
}
</style>