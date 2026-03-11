<template>
  <div>
    <div class="title1">动态改变elementUI中某一单元格的属性</div>
    <div class="title2">百度一下</div>
    <div style="width: 100%; text-align: center;">
      <el-table :data="tableData" style="width: 100%" :cell-style="cellStyle">
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "北京",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "广州",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "深圳",
        },
      ],
    };
  },
  methods: {
    cellStyle(column) {
      console.log("column===", column);
      if (column.row.address == "北京") {
        return 'color: red'
      }
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