<template>
  <div class="employee-container">
    <el-card>
      <!-- 员工表格 -->
      <el-table 
        :data="employeeList" 
        stripe 
        style="width: 100%"
        v-loading="loading">
        <el-table-column prop="id" label="员工ID" width="100"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="gender" label="性别" width="80">
          <template slot-scope="scope">
            {{ scope.row.gender === '1' ? '男' : '女' }}
          </template>
        </el-table-column>
        <el-table-column prop="department" label="部门"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="130"></el-table-column>
        <el-table-column prop="position" label="职位"></el-table-column>
        <el-table-column prop="hireDate" label="入职日期" width="120"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button 
              size="mini" 
              type="primary" 
              @click="handleView(scope.row)">
              查看
            </el-button>
            <el-button 
              size="mini" 
              type="warning" 
              @click="handleEdit(scope.row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 员工详情/编辑弹窗 -->
    <employee-dialog
      ref="employeeDdialog"
      :employee-data="currentEmployee"
      :mode="dialogMode"
      @refresh="getEmployeeList">
    </employee-dialog>
  </div>
</template>

<script>
import EmployeeDialog from './components/EmployeeDialog.vue'

export default {
  name: 'EmployeeTable',
  components: {
    EmployeeDialog
  },
  data() {
    return {
      loading: false,
      employeeList: [],
      dialogMode: 'view', // 'view' 或 'edit'
      currentEmployee: null
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    // 获取员工列表[2](@ref)
    getEmployeeList() {
      this.loading = true
      // 模拟API调用，实际项目中替换为真实的API调用
      setTimeout(() => {
        this.employeeList = [
          {
            id: '001',
            name: '张三',
            gender: '1',
            department: '技术部',
            phone: '13800138001',
            position: '前端工程师',
            hireDate: '2023-01-15'
          },
          {
            id: '002',
            name: '李四',
            gender: '0',
            department: '人事部',
            phone: '13800138002',
            position: 'HR专员',
            hireDate: '2023-03-20'
          },
          {
            id: '003',
            name: '王五',
            gender: '1',
            department: '市场部',
            phone: '13800138003',
            position: '市场经理',
            hireDate: '2022-11-08'
          }
        ]
        this.loading = false
      }, 500)
    },

    // 查看员工信息[6](@ref)
    handleView(employee) {
      this.currentEmployee = { ...employee }
      this.dialogMode = 'view'
      this.$refs["employeeDdialog"].open()
    },

    // 编辑员工信息[6](@ref)
    handleEdit(employee) {
      this.currentEmployee = { ...employee }
      this.dialogMode = 'edit'
      this.$refs["employeeDdialog"].open()
    }
  }
}
</script>

<style scoped>
.employee-container {
  padding: 20px;
}
</style>