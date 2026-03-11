<template>
  <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px" class="my-center-dialog"
    :before-close="handleClose">

    <el-form :model="form" :rules="rules" ref="employeeForm" label-width="100px">

      <el-form-item label="员工ID" prop="id">
        <el-input v-model="form.id" :disabled="mode === 'view'" placeholder="请输入员工ID"></el-input>
      </el-form-item>

      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" :disabled="mode === 'view'" placeholder="请输入姓名"></el-input>
      </el-form-item>

      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="form.gender" :disabled="mode === 'view'">
          <el-radio label="1">男</el-radio>
          <el-radio label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="form.departmentName" :disabled="mode === 'view'" placeholder="请选择部门" readonly
          @click.native="handleDeptInputClick">
          <i slot="suffix" class="el-icon-arrow-down el-input__icon"></i>
        </el-input>
        <input type="hidden" v-model="form.departmentId" />
      </el-form-item>

      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" :disabled="mode === 'view'" placeholder="请输入手机号"></el-input>
      </el-form-item>

      <el-form-item label="职位" prop="position">
        <el-input v-model="form.position" :disabled="mode === 'view'" placeholder="请输入职位"></el-input>
      </el-form-item>

      <el-form-item label="入职日期" prop="hireDate">
        <el-date-picker v-model="form.hireDate" type="date" placeholder="选择入职日期" :disabled="mode === 'view'"
          value-format="yyyy-MM-dd" style="width: 100%">
        </el-date-picker>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" v-if="mode === 'edit'">
        确 定
      </el-button>
    </div>
    <!-- 部门树组件 -->
    <dept-tree-dialog v-if="showEmployee" ref="deptTreeDialog" @close="closeDeptTreeDialog" :selected-dept-id="form.departmentId" @dept-selected="handleDeptSelected">
    </dept-tree-dialog>
  </el-dialog>
</template>

<script>
import DeptTreeDialog from './DeptTreeDialog.vue'
export default {
  name: 'EmployeeDialog',
  components: {
    DeptTreeDialog
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    employeeData: {
      type: Object,
      default: () => ({})
    },
    mode: {
      type: String,
      default: 'view' // 'view' 或 'edit'
    }
  },
  data() {
    // 手机号验证规则[1](@ref)
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      } else if (!/^1[3-9]\d{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号格式'))
      } else {
        callback()
      }
    }

    return {
      dialogVisible:false,
      showEmployee:false,
      form: {
        id: '',
        name: '',
        gender: '1',
        department: '',
        phone: '',
        position: '',
        hireDate: ''
      },
      // 表单验证规则[7](@ref)
      rules: {
        id: [
          { required: true, message: '请输入员工ID', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '姓名长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        departmentName: [
          { required: true, message: '请输入部门', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        position: [
          { required: true, message: '请输入职位', trigger: 'blur' }
        ],
        hireDate: [
          { required: true, message: '请选择入职日期', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.mode === 'view' ? '员工信息详情' : '编辑员工信息'
    }
  },
  watch: {
    employeeData: {
      handler(newVal) {
        if (newVal) {
          this.form = { ...newVal }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 关闭弹窗[6](@ref)
    handleClose() {
      this.dialogVisible = false
      this.showEmployee = false
      this.resetForm()
    },

    // 提交表单[1](@ref)
    handleSubmit() {
      this.$refs.employeeForm.validate((valid) => {
        if (valid) {
          // 表单验证通过，这里可以调用API保存数据
          this.$confirm('确定要保存修改吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 模拟API调用
            this.$message.success('员工信息更新成功')
            this.dialogVisible = false
            this.$emit('refresh') // 通知父组件刷新数据
          }).catch(() => {
            this.$message.info('已取消保存')
          })
        } else {
          this.$message.error('请完善表单信息')
          return false
        }
      })
    },

    // 重置表单[6](@ref)
    resetForm() {
      if (this.$refs.employeeForm) {
        this.$refs.employeeForm.clearValidate()
      }
      this.form = {
        id: '',
        name: '',
        gender: '1',
        department: '',
        phone: '',
        position: '',
        hireDate: ''
      }
    },
    open() {
      this.dialogVisible = true
    },
    // 接收部门选择结果
    handleDeptSelected(deptInfo) {
      this.form.departmentName = deptInfo.label
      this.form.departmentId = deptInfo.id
    },
    // 点击部门输入框
    handleDeptInputClick() {
      console.log("1111")
      if (this.mode === 'view') return
      this.$nextTick(() => {
        // this.$refs["deptTreeDialog"].open()
        this.showEmployee = true
      })

    },
    closeDeptTreeDialog() { 
      this.showEmployee = false
    }
  }
}
</script>

<style scoped>
/* 弹窗title居中 */
/* 将深度选择器与自定义类名结合，使样式作用更精确 */
.my-center-dialog ::v-deep .el-dialog__header {
  text-align: center;
}

.dialog-footer {
  text-align: right;
}
</style>