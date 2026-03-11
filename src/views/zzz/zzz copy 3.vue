<template>
  <div>
    <el-table
      ref="myTable"
      :data="tableData"
      style="width: 100%;"
      height="400"
      border
      @scroll.native="handleElementScroll" 
    >
      <el-table-column
        v-for="(col, index) in columns"
        :key="index"
        :prop="col.prop"
        :label="col.label"
        width="200"
        fixed
      ></el-table-column>
    </el-table>

    <div v-if="scrollData" class="scroll-info">
      <p>横向滚动位置: {{ scrollData.scrollLeft }}px</p>
      <p>纵向滚动位置: {{ scrollData.scrollTop }}px</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scrollData: null,
      columns: [
        { prop: 'id', label: 'ID' },
        { prop: 'name', label: '姓名' },
        { prop: 'age', label: '年龄' },
        { prop: 'gender', label: '性别' },
        { prop: 'address', label: '地址' },
        { prop: 'phone', label: '电话' },
        { prop: 'email', label: '邮箱' },
        { prop: 'company', label: '公司' },
        { prop: 'position', label: '职位' },
        { prop: 'salary', label: '薪资' },
        { prop: 'status', label: '状态' },
        { prop: 'createTime', label: '创建时间' },
        { prop: 'updateTime', label: '更新时间' }
      ],
      tableData: []
    };
  },
  mounted() {
    this.generateMockData();
    this.$nextTick(() => {
      this.bindScrollListener();
    });
  },
  methods: {
    // 绑定滚动监听
    bindScrollListener() {
      const table = this.$refs.myTable;
      if (table) {
        // 获取表格的滚动容器
        const scrollWrapper = table.$el.querySelector('.el-table__body-wrapper');
        if (scrollWrapper) {
          this.scrollWrapper = scrollWrapper;
          scrollWrapper.addEventListener('scroll', this.handleElementScroll);
        }
      }
    },
    
    // 移除滚动监听
    removeScrollListener() {
      if (this.scrollWrapper) {
        this.scrollWrapper.removeEventListener('scroll', this.handleElementScroll);
      }
    },
    
    // 处理滚动事件
    handleElementScroll(event) {
      const scrollLeft = event.target.scrollLeft;
      const scrollTop = event.target.scrollTop;
      
      // 更新数据
      this.scrollData = {
        scrollLeft,
        scrollTop
      };
      
      console.log('监听了滚动事件', { scrollLeft, scrollTop });
    },
    
    generateMockData() {
      // 生成Mock数据
      const mock = [];
      for (let i = 1; i <= 50; i++) {
        mock.push({
          id: i,
          name: `用户${i}`,
          age: 20 + (i % 30),
          gender: i % 2 === 0 ? '男' : '女',
          address: `城市${i % 10}区${i}号`,
          phone: `138${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
          email: `user${i}@example.com`,
          company: `公司${i % 5}`,
          position: ['工程师', '经理', '主管', '总监'][i % 4],
          salary: (5000 + i * 500).toFixed(2),
          status: ['在职', '离职', '休假'][i % 3],
          createTime: `2023-${(i % 12 + 1).toString().padStart(2, '0')}-${(i % 28 + 1).toString().padStart(2, '0')}`,
          updateTime: `2024-${(i % 12 + 1).toString().padStart(2, '0')}-${(i % 28 + 1).toString().padStart(2, '0')}`
        });
      }
      this.tableData = mock;
    }
  }
};
</script>

<style scoped>
.scroll-info {
  margin-top: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  font-size: 14px;
}

/* 可选：增加列宽确保出现横向滚动 */
.el-table {
  width: 130%; /* 使表格宽度超出容器 */
}

/* 可选：固定左侧列 */
.el-table .el-table__fixed {
  height: auto !important;
}
</style>