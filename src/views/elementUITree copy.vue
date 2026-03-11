<template>
  <div>
    <div class="title1">elementUI_tree的使用</div>
    <div class="title2">详情请参照elementUI官网</div>
    <div style="margin-left: 200px;width: 100%; text-align: center;">
      <el-tree
        :data="data"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="[5]"
        ref="tree"
        highlight-current
        :props="defaultProps"
        @node-click="handleNodeClick"
      ></el-tree>
      <div class="buttons">
        <el-button @click="getCheckedNodes">通过 node 获取</el-button>
        <el-button @click="getCheckedKeys">通过 key 获取</el-button>
        <el-button @click="setCheckedNodes">通过 node 设置</el-button>
        <el-button @click="setCheckedKeys">通过 key 设置</el-button>
        <el-button @click="setCurrentKeys">通过key设置当前选中节点</el-button>
        <el-button @click="getSelectedNodes">获取选中的节点数据</el-button>
        <el-button @click="getDom">获取选中的dom节点</el-button>
        <el-button @click="resetChecked">清空</el-button>
        <el-button @click="test">点击按钮选中对应节点并展开</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: [
        {
          id: 1,
          label: "一级 1",
          info: 'info111',
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1",
                },
                {
                  id: 10,
                  label: "三级 1-1-2",
                  info: 'hahaha'
                },
              ],
            },
          ],
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1",
            },
            {
              id: 6,
              label: "二级 2-2",
            },
          ],
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1",
            },
            {
              id: 8,
              label: "二级 3-2",
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  methods: {
    getCheckedNodes() {
      console.log(this.$refs.tree.getCheckedNodes());
    },
    getCheckedKeys() {
      console.log(this.$refs.tree.getCheckedKeys());
    },
    setCheckedNodes() {
      this.$refs.tree.setCheckedNodes([
        {
          id: 5,
          label: "二级 2-1",
        },
        {
          id: 9,
          label: "三级 1-1-1",
        },
      ]);
    },
    setCheckedKeys() {
      this.$refs.tree.setCheckedKeys([3])
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
    },
    setCurrentKeys(){
      this.$refs.tree.setCurrentKey(9)
      this.$refs.tree.store.nodesMap[9].expanded
    },
    // 点击按钮获取节点并展开对应节点
    test(){
      console.log('methods === ', this.$refs.tree.store.nodesMap[2])
      this.$refs.tree.store.nodesMap[2].expanded = true;
      debugger;
      // setCurrentKey
    },
    handleNodeClick(event){
      console.log('点击当前节点信息', event)
    },
    getDom(){
      console.log(document.querySelector('.is-current'))
    },
    getSelectedNodes() {
      const checkedNodes = this.$refs.tree.getCheckedNodes();
      console.log('Selected Nodes:', checkedNodes);
    }
  },
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



