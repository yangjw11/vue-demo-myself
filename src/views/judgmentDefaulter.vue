<template>
  <div class="dishonest-container">
    <!-- 查询表单区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" ref="formRef" :model="form" @keyup.enter.native="handleSearch(true)"
        @submit.native.prevent="handleSearch(true)" :rules="formRules">
        <el-form-item label="被执行人姓名：" prop="name">
          <el-input v-model.trim="form.name" placeholder="请输入完整姓名" clearable style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码/组织机构代码：" prop="code">
          <el-input v-model="form.code" placeholder="请输入身份证号码/组织机构代码" clearable style="width: 600px"></el-input>
        </el-form-item>
        <el-form-item label="省份：" prop="areaid">
          <el-select v-model="form.areaid" placeholder="请选择省份" clearable>
            <el-option v-for="(item, index) in provinceOptions" :key="index" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch(true)">查询</el-button>
          <el-button type="primary" icon="el-icon-search" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 初始提示 -->
    <div v-if="showInitialPrompt" class="initial-prompt">
      <el-alert title="查询提示" type="info" show-icon :closable="false">
        <p>请输入失信人员姓名进行查询，支持精确查询</p>
        <p>查询结果将在中国执行信息公开网实时数据基础上展示</p>
      </el-alert>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <i class="el-icon-loading"></i>
      <span>数据加载中...</span>
    </div>

    <!-- 无数据提示 -->
    <div v-else-if="showEmpty" class="empty-container">
      <i class="el-icon-warning-outline"></i>
      <p>{{ emptyMessage }}</p>
    </div>

    <!-- 数据表格 -->
    <el-table v-else-if="showTable" :data="dishonestPersons" border stripe style="width: 100%" class="dishonest-table">
      <el-table-column prop="iname" label="姓名" width="100" fixed></el-table-column>
      <el-table-column prop="gender" label="性别" width="60"></el-table-column>
      <el-table-column prop="age" label="年龄" width="60"></el-table-column>
      <el-table-column prop="cardnum" label="身份证号" width="180"></el-table-column>
      <el-table-column prop="area_name" label="地区" width="80"></el-table-column>
      <el-table-column prop="gist_cid" label="生效案号" width="180"></el-table-column>
      <el-table-column prop="case_code" label="执行案号" width="180"></el-table-column>
      <el-table-column prop="court_name" label="执行法院" min-width="180"></el-table-column>

      <el-table-column prop="duty" label="法律义务" min-width="250" :show-overflow-tooltip="true"></el-table-column>

      <el-table-column prop="performance" label="履行情况" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.performance === '全部未履行' ? 'danger' : 'warning'" size="small">
            {{ scope.row.performance }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="disreput_type_name" label="失信行为" min-width="200"></el-table-column>

      <el-table-column prop="publish_date" label="公布日期" width="130" sortable></el-table-column>

      <!-- 操作列 -->
      <el-table-column label="操作" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="showDetail(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination style="margin-top: 20px; text-align: right;" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[5, 10, 20, 50]"
      :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 详情弹窗 -->
    <el-dialog :title="`失信人详情 - ${selectedRow.iname || ''}`" :visible.sync="dialogVisible" width="60%"
      :close-on-click-modal="false">
      <el-descriptions :column="2" border class="content-descriptions">
        <el-descriptions-item label="姓名">{{ selectedRow.iname }}</el-descriptions-item>
        <el-descriptions-item label="性别">{{ selectedRow.gender }}</el-descriptions-item>
        <el-descriptions-item label="年龄">{{ selectedRow.age }}</el-descriptions-item>
        <el-descriptions-item label="身份证号">{{ selectedRow.cardnum }}</el-descriptions-item>
        <el-descriptions-item label="地区">{{ selectedRow.area_name }}</el-descriptions-item>
        <el-descriptions-item label="执行案号">{{ selectedRow.case_code }}</el-descriptions-item>
        <el-descriptions-item label="执行法院" :label-style="{ width: '160px' }">{{ selectedRow.court_name
        }}</el-descriptions-item>
        <el-descriptions-item label="履行情况">
          <el-tag type="danger">{{ selectedRow.performance }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="失信行为" :label-style="{ width: '160px' }">{{ selectedRow.disreput_type_name
        }}</el-descriptions-item>
        <el-descriptions-item label="公布日期">{{ selectedRow.publish_date }}</el-descriptions-item>

        <el-descriptions-item label="法律义务" :label-style="{ width: '160px' }" :span="2">
          <div class="duty-content">{{ selectedRow.duty }}</div>
        </el-descriptions-item>
      </el-descriptions>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'DishonestPersonSearch',
  data() {
    return {
      form: {
        name: '', // 被执行人姓名/名称 必传
        code: '', // 身份证号码/组织机构代码 可选
        areaid: '', // 省份ID 可选
      },
      loading: false,
      dishonestPersons: [],
      emptyMessage: '',
      dialogVisible: false,
      selectedRow: {},
      name: '', // 查询姓名
      searched: false, // 是否已执行过查询
      content_style: {
        'min-width': '200px',      // 最小宽度防止挤压
        'word-break': 'break-all',  // 强制换行避免溢出
        'white-space': 'normal'     // 允许正常换行[4,7](@ref)
      },
      currentPage: 1,   // 当前页码
      pageSize: 10,     // 每页显示条数
      total: 1,        // 数据总数（从后端获取）
      provinceOptions: [
        { label: '全部', value: 0 },
        { label: '北京', value: 660 },
        { label: '天津', value: 661 },
        { label: '河北', value: 662 },
        { label: '山西', value: 663 },
        { label: '内蒙古', value: 664 },
        { label: '辽宁', value: 665 },
        { label: '吉林', value: 666 },
        { label: '黑龙江', value: 667 },
        { label: '上海', value: 668 },
        { label: '江苏', value: 669 },
        { label: '浙江', value: 670 },
        { label: '安徽', value: 671 },
        { label: '福建', value: 672 },
        { label: '江西', value: 673 },
        { label: '山东', value: 674 },
        { label: '河南', value: 675 },
        { label: '湖北', value: 676 },
        { label: '湖南', value: 677 },
        { label: '广东', value: 678 },
        { label: '广西', value: 679 },
        { label: '海南', value: 680 },
        { label: '重庆', value: 681 },
        { label: '四川', value: 682 },
        { label: '贵州', value: 683 },
        { label: '云南', value: 684 },
        { label: '西藏', value: 685 },
        { label: '陕西', value: 686 },
        { label: '甘肃', value: 687 },
        { label: '青海', value: 688 },
        { label: '宁夏', value: 689 },
        { label: '新疆', value: 690 },
        { label: '香港', value: 691 },
        { label: '澳门', value: 692 },
        { label: '台湾', value: 693 }
      ],
      formRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '用户名长度在 2 到 10 个字符', trigger: 'blur' },
          {
            pattern: /^[\u4E00-\u9FA5]{2,10}$/,
            message: '用户名必须为2-10个纯中文字符',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  computed: {
    // 初始提示状态（页面首次加载）
    showInitialPrompt() {
      return !this.searched && !this.loading;
    },
    // 是否显示空状态
    showEmpty() {
      return this.searched && (this.emptyMessage || this.dishonestPersons.length === 0);
    },
    // 是否显示表格
    showTable() {
      return this.searched && !this.loading && this.dishonestPersons.length > 0;
    }
  },
  mounted() {
    this.searched = true;
    this.loading = false;
    // this.showTable = true;
    // this.showEmpty = false;
    // 初始化页面时，显示提示信息
    this.dishonestPersons = [
      {
        "iname": "何祖记",
        "gender": "女",
        "age": "30",
        "cardnum": "5331241994****0929",
        "area_name": "云南",
        "case_code": "(2024)云3123执836号",
        "gist_cid": "(2023)云3123民初958号",
        "court_name": "盈江县人民法院",
        "duty": "请求人民法院依法强制执行被申请人何祖记归还申请人借款本金12114.67元及截止2023年5月24日的利息1014.87元、费用4100.37元，合计17229.91元；并支付自2023年5月25日起至信用卡透支本息、费用清偿之日止的 利息和费用（按《中国邮政储蓄银行信用卡(个人卡)领用合约》约定的利率计算）",
        "performance": "全部未履行",
        "disreput_type_name": "有履行能力而拒不履行生效法律文书确定义务",
        "publish_date": "2024年10月25日"
      }
    ];
  },
  methods: {
    // 执行查询
    async handleSearch(flag) {

      // 校验表单
      let res = await this.$refs.formRef.validate()
      if (!res) return;
      this.loading = true;
      this.searched = true;
      this.emptyMessage = '';

      try {
        this.dishonestPersons = [];
        if (flag) {
          this.currentPage = 1
          this.pageSize = 10
        }
        // 调用API查询（实际项目中应添加参数）
        const response = await axios.get(`/shixin?key=${this.globalConfig.apiKey_judgmentDefaulter}`, {
          params: {
            name: this.form.name,
            code: this.form.code,
            areaid: this.form.areaid,
            page: this.currentPage,
            rows: this.pageSize
          }
        });
        console.log('response === ', response);
        if (response.data.code === 200) {
          this.dishonestPersons = response.data.data.rows || [];
          // 处理性别
          this.dishonestPersons.forEach(item => {
            item.gender = this.getGenderFromID(item.cardnum);
            item.publish_date = this.formatDate(item.publish_date);
          });
          this.total = Number(response.data.data.total);
          if (this.dishonestPersons.length === 0) {
            this.emptyMessage = `未找到与"${this.name}"相关的失信人员信息`;
          }
        } else if (response.data.code === 400) {
          this.emptyMessage = response.data.message || '暂无相关失信人信息';
          this.dishonestPersons = [];
        }
      } catch (error) {
        console.error('数据获取失败: ======', error);
        this.$message.warning(`${error.response.data.message}`);
        this.emptyMessage = '数据加载失败，请稍后重试';
        this.dishonestPersons = [];
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.$refs.formRef.resetFields();
      this.$refs.formRef.clearValidate();
    },
    // 查看详情
    showDetail(row) {
      this.selectedRow = { ...row }; // 深拷贝避免数据污染
      this.dialogVisible = true;
    },
    // 通过身份证号判断性别, 
    getGenderFromID(idCard) {
      // 基础格式验证
      if (typeof idCard !== 'string' || idCard.length !== 18) {
        return '身份证号码应为18位字符串';
      }

      // 使用正则表达式验证基本格式（前17位为数字，最后一位为数字或X）,因为身份证没有脱敏，所以这里不进行验证
      // const idPattern = /^\d{17}[\dXx]$/;
      // if (!idPattern.test(idCard)) {
      //   return '身份证号码格式错误';
      // }

      // 判断最后一位是不是X
      let str = idCard.slice(-1)

      // 提取第17位并判断奇偶
      const genderCode = parseInt(idCard.charAt(16), 10); // 索引16对应第17位
      return genderCode % 2 === 0 ? '女' : '男';

    },
    // 转换日期，将20241010转换为2024年10月10日
    formatDate(date) {
      if (!date) return '';
      const year = date.slice(0, 4);
      const month = date.slice(4, 6);
      const day = date.slice(6, 8);
      return `${year}年${month}月${day}日`;
    },
    // 每页条数变化
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.currentPage = 1;
      this.handleSearch(false);
    },
    // 页码变化
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.handleSearch(false);
    }
  }
};
</script>

<style scoped>
.dishonest-container {
  padding: 20px;
  background: #fff;
  border-radius: 4px;
}

.search-card {
  margin-bottom: 20px;
  background-color: #f5f7fa;
}

.initial-prompt {
  margin: 20px 0;
  padding: 15px;
  background-color: #f4f4f5;
  border-radius: 4px;
}

.loading-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #909399;
}

.loading-container i {
  font-size: 40px;
  margin-bottom: 15px;
  animation: rotating 2s linear infinite;
}

.empty-container i {
  font-size: 60px;
  margin-bottom: 20px;
  color: #e6a23c;
}

.dishonest-table {
  margin-top: 20px;
}

/* 法律义务长文本样式 */
.duty-content {
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-line;
  padding: 10px 0px;
  background-color: #f8f8f8;
  border-radius: 4px;
}

.dialog-footer {
  text-align: right;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* ::v-deep .content-descriptions .el-descriptions-item__cell{
  max-width: 50px;
} */
</style>