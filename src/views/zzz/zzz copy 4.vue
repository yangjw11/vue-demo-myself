<template>
  <div style="padding: 20px;">
    <h3>无列依赖：鼠标悬停行底部 ↕️ 拖动调整行高</h3>
    <el-table :data="tableData" :row-style="getRowStyle" style="width: 100%; margin-top: 20px;" ref="table"
      class="table-with-resizable-rows">
      <!-- 正常列 -->
      <el-table-column prop="name" label="姓名" fixed="left" width="180">
        <template slot-scope="scope">
          <div class="cell-content" :data-index="0">{{ scope.row.name }}</div>
        </template>
      </el-table-column>
      <!-- 其他列 -->
      <el-table-column prop="age" label="年龄" width="500">
        <template slot-scope="scope">
          <div class="cell-content" :data-index="scope.$index">{{ scope.row.age }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="city" label="城市" width="500">
        <template slot-scope="scope">
          <div class="cell-content" :data-index="scope.$index">{{ scope.row.city }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="height" label="行高 (px)" width="120">
        <template slot-scope="scope">
          <div class="cell-content">{{ scope.row.height }}</div>
        </template>
      </el-table-column>
      <!-- 新增更多数据列 -->
      <el-table-column prop="gender" label="性别" width="100">
        <template slot-scope="scope">
          <div class="cell-content">{{ scope.row.gender }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="job" label="职业">
        <template slot-scope="scope">
          <div class="cell-content">{{ scope.row.job }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="hobby" label="爱好">
        <template slot-scope="scope">
          <div class="cell-content">{{ scope.row.hobby }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" fixed="right" width="220">
        <template slot-scope="scope">
          <div class="cell-content">{{ scope.row.email }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ResizableTableRowNoColumn',
  data() {
    return {
      tableData: [],
      resizingIndex: -1,
      startY: 0,
      startHeight: 0,
      handleMouseMove: null,
      handleMouseUp: null,
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

    // 为行元素绑定事件（在 mounted 中动态绑定）
    attachRowEvents() {
      this.$nextTick(() => {
        const rows = this.$refs.table.$el.querySelectorAll('.el-table tbody tr');
        rows.forEach((row, index) => {
          // 清理旧事件（防止重复绑定）
          row.onmouseenter = null;
          row.onmouseleave = null;
          row.onmousedown = null;

          // 鼠标进入：判断是否靠近底部
          row.addEventListener('mouseenter', (e) => {
            this.checkAndShowCursor(row, e);
          });

          row.addEventListener('mousemove', (e) => {
            this.checkAndShowCursor(row, e);
          });

          row.addEventListener('mouseleave', () => {
            row.style.cursor = '';
          });

          // 统一的 mousedown 监听
          row.addEventListener('mousedown', (e) => {
            if (this.isNearBottom(e, row)) {
              e.preventDefault();
              this.handleMouseDown(index, e);
            }
          });
        });
      });
    },

    // 判断鼠标是否在行底部 8px 区域内
    isNearBottom(event, row) {
      const rect = row.getBoundingClientRect();
      const offsetY = event.clientY - rect.top;
      const height = rect.height;
      return offsetY >= height - 8; // 底部 8px 为拖动区域
    },

    // 悬停时设置光标
    checkAndShowCursor(row, e) {
      if (this.isNearBottom(e, row)) {
        row.style.cursor = 'ns-resize';
      } else {
        row.style.cursor = '';
      }
    },

    // 处理拖动开始
    handleMouseDown(index, event) {
      let indexReal = index;
      if(index >= 2 * this.tableData.length) {
        indexReal = index - 2 * this.tableData.length;
      } else if(index >= this.tableData.length){
        indexReal = index -  this.tableData.length;
      }
      this.resizingIndex = indexReal;
      this.startY = event.clientY;
      this.startHeight = this.tableData[indexReal].height;
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
        this.handleMouseMove = null;
        this.handleMouseUp = null;
      };

      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('mouseup', this.handleMouseUp);
    },
    generateMockData(count) {
      const surnames = ['张', '王', '李', '赵', '陈', '刘', '黄', '周', '吴', '杨'];
      const names = ['伟', '芳', '娜', '秀英', '敏', '静', '磊', '洋', '勇', '军', '杰', '艳', '强', '鹏', '萍', '刚', '明', '兰'];
      const cities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安', '南京', '苏州', '天津', '重庆'];
      const jobs = ['教师', '医生', '工程师', '学生', '设计师', '自由职业', '公务员', '经理', '销售', '作家'];
      const hobbies = ['读书', '音乐', '运动', '旅游', '电影', '游戏', '烹饪', '摄影', '绘画', '编程'];

      const data = [];
      for (let i = 0; i < count; i++) {
        const surname = surnames[Math.floor(Math.random() * surnames.length)];
        const name = names[Math.floor(Math.random() * names.length)];
        data.push({
          name: surname + name,
          age: Math.floor(Math.random() * (65 - 18 + 1)) + 18,
          city: cities[Math.floor(Math.random() * cities.length)],
          height: Math.floor(Math.random() * (100 - 40 + 1)) + 40,
          gender: Math.random() > 0.5 ? '男' : '女',
          job: jobs[Math.floor(Math.random() * jobs.length)],
          hobby: hobbies[Math.floor(Math.random() * hobbies.length)],
          email: `user${i + 1}@example.com`, // 简单的邮箱生成
        });
      }
      return data;
    },
  },

  mounted() {
    this.tableData = this.generateMockData(10);
    // 初始绑定
    this.attachRowEvents();

    // 表格更新后重新绑定（比如数据刷新、分页）
    this.$watch(
      () => this.tableData.map(d => d.height),
      () => this.attachRowEvents(),
      { deep: true }
    );

    // 可选：监听 window resize 或表格变化
    this.$refs.table.$on('expand-change', this.attachRowEvents);
  },

  beforeDestroy() {
    if (this.handleMouseMove && this.handleMouseUp) {
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseup', this.handleMouseUp);
    }
  },
};
</script>

<style scoped>
/* 确保单元格支持相对定位 */
::v-deep .el-table .cell {
  position: relative !important;
  overflow: visible !important;
  padding: 6px 0 !important;
}

/* 可选：增强视觉反馈 */
::v-deep .el-table tbody tr {
  transition: background-color 0.1s;
}

/* 鼠标在底部时的样式提示（可选） */
.table-with-resizable-rows ::v-deep tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>