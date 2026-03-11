<template>
  <div>
    <el-table
      :data="tableData"
      :row-style="getRowStyle"
      style="width: 100%;"
      ref="table"
    >
      <el-table-column prop="name" label="姓名" width="180">
        <template slot-scope="scope">
          <div class="cell-content">{{ scope.row.name }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄" width="180">
        <template slot-scope="scope">
          <div class="cell-content">{{ scope.row.age }}</div>
        </template>
      </el-table-column>
      <!-- 空列作为拖拽手柄容器 -->
      <el-table-column width="10" label="">
        <template slot-scope="scope">
          <div
            class="resize-handle"
            @mousedown="handleMouseDown(scope.$index, $event)"
          ></div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        { name: '张三', age: 20, height: 40 },
        { name: '李四', age: 25, height: 40 },
        { name: '王五', age: 30, height: 40 },
      ],
      resizingIndex: -1,
      startY: 0,
      startHeight: 0,
    };
  },
  methods: {
    getRowStyle({ rowIndex }) {
      const row = this.tableData[rowIndex];
      return {
        height: `${row.height}px`,
        minHeight: `${row.height}px`,
      };
    },

    handleMouseDown(index, event) {
      // 阻止默认行为（比如选中文本）
      event.preventDefault();

      this.resizingIndex = index;
      this.startY = event.clientY;
      this.startHeight = this.tableData[index].height;

      // 使用箭头函数或绑定 this
      this.handleMouseMove = (e) => {
        if (this.resizingIndex === -1) return;
        const deltaY = e.clientY - this.startY;
        const newHeight = this.startHeight + deltaY;
        if (newHeight >= 30) {
          this.$set(this.tableData[this.resizingIndex], 'height', newHeight);
        }
      };

      this.handleMouseUp = () => {
        this.resizingIndex = -1;
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        // 释放引用
        this.handleMouseMove = null;
        this.handleMouseUp = null;
      };

      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('mouseup', this.handleMouseUp);
    },
  },
  beforeDestroy() {
    // 确保清理事件
    if (this.handleMouseMove || this.handleMouseUp) {
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseup', this.handleMouseUp);
    }
  },
};
</script>

<style scoped>
/* 使用 ::v-deep 穿透 scoped 样式 */
::v-deep .el-table .cell {
  position: relative !important;
  overflow: visible !important;
  padding: 0 !important;
}

/* 修复内容样式 */
.cell-content {
  padding: 5px 0;
  display: block;
}

/* 拖拽手柄：覆盖整行底部 */
.resize-handle {
  position: absolute;
  bottom: 0;
  left: -100%;
  right: -100%;
  height: 5px;
  background: transparent;
  cursor: ns-resize;
  z-index: 10;
  /* 可选：显示为一条细线 */
  border-bottom: 1px solid #ddd;
}

/* 鼠标悬停时显示手柄（可选） */
::v-deep .el-table tbody tr:hover .resize-handle {
  background: transparent;
  border-bottom-color: #409eff;
}
</style>