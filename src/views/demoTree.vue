<template>
  <!-- 注册管理 页面 -->
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="表主键（id）" width="180"></el-table-column>
      <el-table-column prop="app_name" label="应用名称（app_name）" width="180"></el-table-column>
      <el-table-column prop="system_name" label="系统名称（system_name）"></el-table-column>
      <el-table-column prop="sub_system_name" label="子系统名称（sub_system_name）"></el-table-column>
      <el-table-column prop="eng_abbreviation" label="英文简称（eng_abbreviation）"></el-table-column>
      <el-table-column prop="description" label="系统简介（description）"></el-table-column>
      <el-table-column prop="del_flag" label="是否失效（del_flag 0失效 1有效）">
        <template v-slot="{row}">{{ row.del_flag | formatDel_flag }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" prop="auditStatus" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="large" @click="modify(scope.row,scope.$index)">修改</el-button>
          <el-button type="text" size="large" @click="delet(scope.row,scope.$index)">删除</el-button>
          <el-button type="text" size="large" @click="assignMenu(scope.row,scope.$index)">分配菜单</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 下面是点击修改出现修改弹窗的部分 -->
    <el-dialog title="修改" :visible.sync="dialogVisible" width="50%">
      <!-- 下面是修改数据的表单 -->
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="表主键" v-if="showAdd">
          <el-input v-model.trim="form.id"></el-input>
        </el-form-item>
        <el-form-item label="应用名称">
          <el-input v-model.trim="form.app_name"></el-input>
        </el-form-item>
        <el-form-item label="系统名称">
          <el-input v-model.trim="form.system_name"></el-input>
        </el-form-item>
        <el-form-item label="子系统名称">
          <el-input v-model.trim="form.sub_system_name"></el-input>
        </el-form-item>
        <el-form-item label="英文简称">
          <el-input v-model.trim="form.eng_abbreviation"></el-input>
        </el-form-item>
        <!-- description -->
        <el-form-item label="系统简介">
          <el-input v-model.trim="form.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="define()" v-if="!showAdd">确 定</el-button>
        <el-button type="primary" @click="defineAdd()" v-if="showAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: "hahaha",
      // 下面是模拟的表格的数据
      tableData: [
        {
          id: "001",
          app_name: "应用名称1",
          system_name: "系统名称1",
          sub_system_name: "子系统名称1",
          eng_abbreviation: "英文简称1",
          description: "系统简介1",
          del_flag: "0",
        },
        {
          id: "002",
          app_name: "应用名称2",
          system_name: "系统名称2",
          sub_system_name: "子系统名称2",
          eng_abbreviation: "英文简称2",
          description: "系统简介2",
          del_flag: "1",
        },
        {
          id: "003",
          app_name: "应用名称3",
          system_name: "系统名称3",
          sub_system_name: "子系统名称3",
          eng_abbreviation: "英文简称3",
          description: "系统简介3",
          del_flag: "1",
        },
        {
          id: "004",
          app_name: "应用名称4",
          system_name: "系统名称4",
          sub_system_name: "子系统名称4",
          eng_abbreviation: "英文简称4",
          description: "系统简介4",
          del_flag: "0",
        },
        {
          id: "005",
          app_name: "应用名称5",
          system_name: "系统名称5",
          sub_system_name: "子系统名称5",
          eng_abbreviation: "英文简称5",
          description: "系统简介5",
          del_flag: "1",
        },
      ],
      // 修改行的数组索引值
      indexTag: "",
      // 控制修改弹窗的出现和隐藏
      dialogVisible: false,
      // 下面是修改表单的数据
      form: {
        id: "",
        app_name: "",
        system_name: "",
        sub_system_name: "",
        eng_abbreviation: "",
        description: "",
        del_flag: "",
      },
      // 点击添加时候的表单数据
      formAdd: {
        id: "",
        app_name: "",
        system_name: "",
        sub_system_name: "",
        eng_abbreviation: "",
        description: "",
        del_flag: "1",
      },
      showAdd: false,
    };
  },
  filters: {
    formatDel_flag(value) {
      // console.log("value === ", value);
      if (value == "0") {
        return "失效";
      } else if (value == "1") {
        return "有效";
      } else {
        return "非法数据，请联系管理员";
      }
    },
  },
  methods: {
    modify(row, index) {
      console.log(row);
      console.log(index);
      // 隐藏主键
      this.showAdd = false;
      // 显示修改的弹窗
      this.dialogVisible = true;
      // 深拷贝这一行的数据
      this.form = JSON.parse(JSON.stringify(row));
      this.indexTag = index;
    },
    delet(row, index) {
      console.log(row);
      console.log(index);
    },
    // 点击确定的方法
    define() {
      // 关闭添加的确定
      this.showAdd = false;
      // 这里需要发送接口，现在是模拟数据
      this.tableData.splice(this.indexTag, 1, this.form);
      // 关闭弹窗
      this.dialogVisible = false;
    },
    // 点击取消，关闭弹窗
    cancel() {
      this.dialogVisible = false;
    },
    // 点击添加的方法，默认添加到第一个
    add() {
      // 打开弹窗
      this.dialogVisible = true;
      // 打开添加的确定
      this.showAdd = true;
      this.form = this.formAdd;
    },
    // 新增时候点击确定的方法
    defineAdd() {
      this.showAdd = true;
      // 这里需要发送接口，现在是模拟数据
      this.tableData.splice(0, 1, this.form);
      this.dialogVisible = false;
    },
    // ceshiTest(){
    //   ceshi(this.tokon).then(res => {
    //     console.log('res === ', res)
    //   }).catch(err =>{
    //     console.log('错误err === ', err)
    //   })
    // },
    assignMenu(row, index) {
      console.log("分配菜单的row === ", row);
      console.log("分配菜单的index === ", index);
      // 将该行的数据id值存储在idsessionStorage中
      sessionStorage.setItem("id", row.id);
      // 跳转到树形控件页面
      this.$router.push({path:'/demoTreeDetail'})
    },
  },
};
</script>

<style scoped>
.searchIpt {
  width: 200px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid #000;
  margin-right: 20px;
  outline: none;
  text-indent: 5px;
}
</style>
