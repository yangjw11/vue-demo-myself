<template>
  <div class="all">
    <div style="padding: 50px;">
      <!-- 最简单的 popover 示例 -->
      <el-popover placement="top" title="提示" width="200" trigger="hover" content="这是一个简单的提示内容">
        <el-button slot="reference">鼠标悬停查看提示</el-button>
      </el-popover>
    </div>
    <div style="padding: 50px;">
      <el-popover placement="bottom" width="200" trigger="hover"
      :offset="20" content="这个弹窗向右平移了80px">
        <el-button slot="reference">悬停查看</el-button>
      </el-popover>
    </div>
  </div>

</template>

<script>
export default {
  // 不需要任何逻辑，最简单的组件
}
</script>

<style scoped>
  .all{
    width: 100vw;
    height: 100vh;
    padding: 50px;
    text-align: right;
  }

</style>