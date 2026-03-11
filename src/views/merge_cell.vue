<template>
  <!--  -->
  <div>
    <el-table :data="tableData" :span-method="objectSpanMethod" border
      :header-cell-style="{ textAlign: 'center', backgroundColor: '#F5F7FA' }" cell-style="border: 1px solid #000">
      <el-table-column prop="sortNum" label="序号" align="center" :span-method="handleSpanMethod"></el-table-column>
      <el-table-column prop="date" label="统计年月" align="center" :span-method="handleSpanMethod"></el-table-column>
      <el-table-column prop="line" label="线路" align="center" :span-method="handleSpanMethod"/>
      <el-table-column prop="bugType" label="缺陷类型" align="center" />
      <el-table-column prop="c1Count" label="一级缺陷数量（个）" align="center" />
      <el-table-column prop="dealCount" label="整改数量（个）" align="center" />
      <el-table-column prop="bugAllCount" label="缺陷合计（个）" align="center" :span-method="handleSpanMethod" />
      <el-table-column prop="dealAllCount" label="整改合计（个）" align="center" :span-method="handleSpanMethod" />
      <el-table-column prop="dealRate" label="整改率(%)" align="center" :span-method="handleSpanMethod" />
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 表格数据
      tableData: [
        // 一年级
        {
          sortNum: "1",
          date: "2022-02",
          line: "京广高速",
          bugType: "接触线拉出值",
          c1Count: "1",
          dealCount: "1",
          bugAllCount: '12',
          dealAllCount: '12',
          dealRate: "80",
        },
        {
          sortNum: "1",
          date: "2022-02",
          line: "京广高速",
          bugType: "接触网高度",
          c1Count: "2",
          dealCount: "2",
          bugAllCount: '12',
          dealAllCount: '12',
          dealRate: "100",
        },
        {
          sortNum: "1",
          date: "2022-02",
          line: "京广高速",
          bugType: "一跨内接触网高差",
          c1Count: "3",
          dealCount: "3",
          bugAllCount: '12',
          dealAllCount: '12',
          dealRate: "100",
        },
        {
          sortNum: "1",
          date: "2022-02",
          line: "京广高速",
          bugType: "弓网接触力",
          c1Count: "4",
          dealCount: "4",
          bugAllCount: '12',
          dealAllCount: '12',
          dealRate: "100",
        },
        {
          sortNum: "1",
          date: "2022-02",
          line: "京广高速",
          bugType: "燃弧",
          c1Count: "4",
          dealCount: "4",
          bugAllCount: '12',
          dealAllCount: '12',
          dealRate: "100",
        },
        // ======================================================
        {
          sortNum: "2",
          date: "2022-02",
          line: "京沪高速",
          bugType: "接触线拉出值",
          c1Count: "1",
          dealCount: "1",
          bugAllCount: '15',
          dealAllCount: '12',
          dealRate: "99.99",
        },
        {
          sortNum: "2",
          date: "2022-02",
          line: "京沪高速",
          bugType: "接触线高度",
          c1Count: "2",
          dealCount: "2",
          bugAllCount: '15',
          dealAllCount: '12',
          dealRate: "99.99",
        },
        {
          sortNum: "2",
          date: "2022-02",
          line: "京沪高速",
          bugType: "一跨内接触线高度",
          c1Count: "3",
          dealCount: "3",
          bugAllCount: '15',
          dealAllCount: '12',
          dealRate: "99.99",
        },
        {
          sortNum: "2",
          date: "2022-02",
          line: "京沪高速",
          bugType: "硬点",
          c1Count: "4",
          dealCount: "4",
          bugAllCount: '15',
          dealAllCount: '12',
          dealRate: "99.99",
        },
        {
          sortNum: "2",
          date: "2022-02",
          line: "京沪高速",
          bugType: "弓网接触力",
          c1Count: "5",
          dealCount: "4",
          bugAllCount: '15',
          dealAllCount: '12',
          dealRate: "99.99",
        },
        {
          sortNum: "2",
          date: "2022-02",
          line: "京沪高速",
          bugType: "燃弧",
          c1Count: "1",
          dealCount: "1",
          bugAllCount: '15',
          dealAllCount: '12',
          dealRate: "99.99",
        },
      ],
    };
  },
  methods: {
    // 计算需要合并的行数
    getRowspan(field, columnIndex) {
      const rows = this.data;
      let rowspan = 1;

      for (let i = 1; i < rows.length; i++) {
        if (rows[i][field] === rows[i - 1][field]) {
          rowspan++;
        } else {
          break;
        }
      }
      return rowspan;
    },
    // 自定义合并单元格逻辑
    handleSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (
        columnIndex === 0 ||
        this.fieldNameArray.includes(column.property)
      ) {
        const rowspan = this.getRowspan(column.property, rowIndex);
        return {
          rowspan: rowspan,
          colspan: 1,
        };
      }
    }
   
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
.el-table {
  border: 1px solid #ccc;
  border-collapse: collapse;
}

.el-table th,
.el-table td {
  border: 1px solid #ccc;
}
</style>