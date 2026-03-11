<template>
  <el-dialog
    title="选择部门"
    :visible.sync="dialogVisible"
    width="400px"
    append-to-body
    :before-close="handleClose">
    
    <div class="tree-container">
      <!-- 搜索框 -->
      <el-input
        v-model="filterText"
        placeholder="输入部门名称搜索"
        clearable
        prefix-icon="el-icon-search"
        style="margin-bottom: 10px;"
      />
      
      <!-- 部门树 -->
      <el-tree
        ref="deptTree"
        :data="deptTreeData"
        :props="treeProps"
        :filter-node-method="filterNode"
        node-key="id"
        :check-strictly="true"
        show-checkbox
        highlight-current
        @check="handleTreeCheck"
        empty-text="暂无部门数据">
        
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
    
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'DeptTreeDialog',
  props: {
    // 控制弹窗显示/隐藏
    visible: {
      type: Boolean,
      default: false
    },
    // 部门树数据
    deptData: {
      type: Array,
      default: () => []
    },
    // 当前选中的部门ID（用于回显）
    selectedDeptId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: true,
      filterText: '',
      selectedNode: null,
      treeProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    // 部门树数据，可接收外部传入或使用默认数据
    deptTreeData() {
      return this.deptData.length > 0 ? this.deptData : this.getDefaultDeptData()
    }
  },
  watch: {
    // 搜索过滤
    filterText(val) {
      this.$refs.deptTree.filter(val)
    }
  },
  created() { 
    
  },
  methods: {
    // 获取默认部门数据（可替换为API调用）
    getDefaultDeptData() {
      return [
        {
          id: '1',
          label: '总裁办',
          children: [
            {
              id: '101',
              label: '总裁办公室',
              children: [
                { id: '1001', label: '行政组' },
                { id: '1002', label: '秘书组' }
              ]
            }
          ]
        },
        {
          id: '2',
          label: '技术部',
          children: [
            {
              id: '201',
              label: '前端开发部',
              children: [
                { id: '2001', label: 'Vue小组' },
                { id: '2002', label: 'React小组' }
              ]
            },
            {
              id: '202',
              label: '后端开发部',
              children: [
                { id: '2003', label: 'Java组' },
                { id: '2004', label: 'Go组' }
              ]
            }
          ]
        }
      ]
    },
    
    // 树节点搜索过滤
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    
    // 树节点选中事件
    handleTreeCheck(data, { checkedNodes }) {
      this.selectedNode = checkedNodes.length > 0 ? checkedNodes[0] : null
    },
    
    // 根据ID查找节点
    findNodeById(treeData, id) {
      for (const node of treeData) {
        if (node.id === id) {
          return node
        }
        if (node.children && node.children.length > 0) {
          const found = this.findNodeById(node.children, id)
          if (found) return found
        }
      }
      return null
    },
    
    // 确认选择
    handleConfirm() {
      if (this.selectedNode) {
        this.$emit('dept-selected', {
          id: this.selectedNode.id,
          label: this.selectedNode.label
        })
        this.dialogVisible = false
        this.$emit('close')
      } else {
        this.$message.warning('请选择一个部门')
      }
    },
    
    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false
      this.$emit('close')
    },
    // 打开弹窗
    open() { 
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>
.tree-container {
  max-height: 400px;
  overflow-y: auto;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.dialog-footer {
  text-align: right;
}
</style>