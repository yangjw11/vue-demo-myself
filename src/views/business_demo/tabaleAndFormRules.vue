<template>
  <div>
    <el-form 
      ref="formRef" 
      :model="formData" 
      :rules="formRules"
      @submit.native.prevent
    >
      <el-table
        :data="tableData"
        style="width: 100%"
        border
      >
        <!-- 设备号列 -->
        <el-table-column prop="deviceNo" label="设备号" width="140">
          <template slot-scope="{ row }">
            <span>{{ row.deviceNo }}</span>
          </template>
        </el-table-column>
        
        <!-- 设备类型列 -->
        <el-table-column prop="deviceType" label="设备类型" width="120">
          <template slot-scope="{ row }">
            <span>{{ row.deviceType }}</span>
          </template>
        </el-table-column>
        
        <!-- 设备型号列 -->
        <el-table-column prop="deviceModel" label="设备型号" width="120">
          <template slot-scope="{ row }">
            <span>{{ row.deviceModel }}</span>
          </template>
        </el-table-column>
        
        <!-- 发货单号列 -->
        <el-table-column prop="invoiceNo" label="发货单号" width="180">
          <template slot-scope="{ row }">
            <span>{{ row.invoiceNo }}</span>
          </template>
        </el-table-column>
        
        <!-- 发货时间列 -->
        <el-table-column prop="sendTime" label="发货时间" width="150">
          <template slot-scope="{ row }">
            <span>{{ row.sendTime }}</span>
          </template>
        </el-table-column>
        
        <!-- 收货时间列 -->
        <el-table-column prop="receiveTime" label="收货时间" width="150">
          <template slot-scope="{ row }">
            <span>{{ row.receiveTime }}</span>
          </template>
        </el-table-column>
        
        <!-- 线上所在仓库列 -->
        <el-table-column prop="warehouse" label="线上所在仓库" width="250">
          <template slot-scope="{ row }">
            <span>{{ row.warehouse }}</span>
          </template>
        </el-table-column>
        
        <!-- 处理方式列（带下拉框和校验） -->
        <el-table-column prop="processMethod" label="处理方式" width="150">
          <template slot-scope="{ row, $index }">
            <el-form-item
              :prop="`tableData.${$index}.processMethod`"
              :rules="formRules.processMethod"
            >
              <el-select
                v-model="row.processMethod"
                placeholder="请选择"
                clearable
                @blur="handleSelectBlur($index)"
              >
                <el-option
                  v-for="item in processOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
      
      <div style="margin-top: 20px; text-align: right">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    // 校验规则
    const validateProcess = (rule, value, callback) => {
      if (!value) {
        callback(new Error('处理方式不能为空'));
      } else {
        callback();
      }
    };

    return {
      // 表格数据（使用英文key）
      tableData: [
        {
          deviceNo: '18507251119',
          deviceType: '普通有线',
          deviceModel: 'SQ-YX',
          invoiceNo: 'CX-FH20260107055',
          sendTime: '2026/1/7 18:05',
          receiveTime: '2026/1/9 11:05:20',
          warehouse: '广东省-卜国军正常库存',
          processMethod: ''
        },
        {
          deviceNo: '10213243217',
          deviceType: '断油电有线',
          deviceModel: 'CX-102-JD',
          invoiceNo: 'CX-FH20260107055',
          sendTime: '2026/1/7 18:05',
          receiveTime: '2026/1/9 11:05:20',
          warehouse: '广东省-卜国军正常库存',
          processMethod: ''
        },
        {
          deviceNo: '16507301398',
          deviceType: '普通无线',
          deviceModel: 'SQ-WX',
          invoiceNo: 'CX-FH20260107055',
          sendTime: '2026/1/7 18:05',
          receiveTime: '2026/1/9 11:05:20',
          warehouse: '广东省-韶关市-武江滨江区曲江-刘子华卜国军正常库存',
          processMethod: ''
        }
      ],
      
      // 处理方式选项
      processOptions: [
        { label: '维修', value: 'repair' },
        { label: '更换', value: 'replace' },
        { label: '退货', value: 'return' },
        { label: '其他', value: 'other' }
      ],
      
      // // 表单数据（用于校验）
      formData: {
        tableData: []
      },
      
      // 校验规则
      formRules: {
        processMethod: [
          { required: true, validator: validateProcess, trigger: 'blur' }
        ]
      }
    };
  },
  
  methods: {
    // 下拉框失焦事件
    handleSelectBlur(index) {
      // 触发单个校验
      this.$refs.formRef.validateField(`tableData.${index}.processMethod`);
    },
    
    // 提交按钮
    handleSubmit() {
      // 提交前，先同步数据到formData
      this.formData.tableData = this.tableData;
      
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          // 所有校验通过
          console.log('提交数据：', this.tableData);
          // 这里可以执行提交逻辑
          this.$message.success('提交成功！');
        } else {
          // 校验失败
          this.$message.error('请检查表单，有必填项未填写！');
          return false;
        }
      });
    }
  },
  
  mounted() {
    // 初始化formData
    this.formData.tableData = this.tableData;
  }
};
</script>

<style scoped>
/* 使表单错误信息显示在表格内部 */
.el-form-item {
  margin-bottom: 0;
}

::v-deep .el-form-item__error {
  position: relative;
  padding-top: 2px;
  line-height: 1;
  color: #f56c6c;
  font-size: 12px;
}

/* 表格样式调整 */
.el-table {
  margin-top: 20px;
}

::v-deep .el-table .cell {
  padding: 0 8px;
}

/* 下拉框样式 */
::v-deep .el-select {
  width: 100%;
}

/* 提交按钮样式 */
.el-button {
  min-width: 100px;
}
</style>