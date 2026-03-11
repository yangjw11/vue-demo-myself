<template>
  <div class="id-card-container">
    <div class="header">
      <h1 class="page-title">身份证号补全查询系统</h1>
      <p class="page-subtitle">根据脱敏身份证号和性别生成所有可能的合规身份证号</p>
    </div>

    <div class="main-content">
      <!-- 输入区域 -->
      <el-card class="input-card" shadow="hover">
        <div slot="header" class="card-header">
          <span class="card-title">输入查询条件</span>
          <el-tag type="info" size="small">精确匹配</el-tag>
        </div>

        <div class="input-form">
          <el-form ref="form" :model="formData" :rules="formRules" label-width="120px">
            <el-form-item label="脱敏身份证号" prop="idCardMasked">
              <el-input v-model="formData.idCardMasked" placeholder="请输入18位身份证号，脱敏部分用*代替" clearable :maxlength="18"
                class="id-input" @input="formatIdCard">
                <template slot="prepend">
                  <i class="el-icon-edit"></i>
                </template>
                <template slot="append">
                  <span class="length-indicator">{{ formData.idCardMasked.length }}/18</span>
                </template>
              </el-input>
              <div class="input-hint">
                <p><i class="el-icon-info"></i> 格式说明：前6位必须为具体数字，其余部分可用*脱敏，例如：11010119900101123*</p>
                <div class="example-list">
                  <span class="example-label">示例：</span>
                  <el-button v-for="example in examples" :key="example.id" type="text" size="mini"
                    @click="setExample(example.id)">
                    {{ example.text }}
                  </el-button>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="性别筛选" prop="gender">
              <el-radio-group v-model="formData.gender">
                <el-radio-button :label="null">不限性别</el-radio-button>
                <el-radio-button :label="1">男性</el-radio-button>
                <el-radio-button :label="0">女性</el-radio-button>
              </el-radio-group>
              <div class="gender-hint">
                <i class="el-icon-warning"></i>
                性别筛选基于身份证号第17位（奇数为男性，偶数为女性）
              </div>
            </el-form-item>

            <el-form-item label="结果限制" prop="limit">
              <el-slider v-model="formData.limit" :min="100" :max="5000" :step="100" show-stops show-input
                :format-tooltip="formatLimit"></el-slider>
              <div class="limit-hint">
                当可能结果过多时，限制显示数量以提升性能。当前限制：最多显示 {{ formData.limit }} 条结果
              </div>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :loading="loading" @click="handleQuery" class="query-button"
                :disabled="!formData.idCardMasked">
                <i class="el-icon-search"></i> 开始查询
              </el-button>
              <el-button @click="handleReset">
                <i class="el-icon-refresh"></i> 重置
              </el-button>
              <el-button type="info" plain @click="showHelp = !showHelp">
                <i class="el-icon-question"></i> {{ showHelp ? '隐藏' : '显示' }}帮助
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <!-- 帮助信息 -->
      <el-collapse-transition>
        <el-card v-show="showHelp" class="help-card" shadow="never">
          <div slot="header" class="help-header">
            <span><i class="el-icon-info"></i> 使用说明</span>
          </div>
          <div class="help-content">
            <p><strong>身份证号格式规则：</strong></p>
            <ul>
              <li>身份证号必须为18位，前6位为地区代码，必须为具体数字</li>
              <li>脱敏部分使用*号表示，可以是任意位置、任意数量的*</li>
              <li>例如：<code>11010119900101123*</code> 表示最后一位不确定</li>
              <li>例如：<code>11010119900101***1</code> 表示第15-17位不确定</li>
              <li>例如：<code>110101*******1231</code> 表示第7-14位（出生日期）不确定</li>
            </ul>
            <p><strong>算法说明：</strong></p>
            <ul>
              <li>系统会验证身份证号的地区码、出生日期和校验码</li>
              <li>性别筛选基于身份证号第17位（奇数为男性，偶数为女性）</li>
              <li>生成结果会排除无效的出生日期（如2月30日）</li>
            </ul>
          </div>
        </el-card>
      </el-collapse-transition>

      <!-- 结果展示区域 -->
      <el-card class="result-card" shadow="hover" v-if="results.length > 0">
        <div slot="header" class="result-header">
          <span class="card-title">查询结果</span>
          <el-badge :value="totalResults" :max="9999" class="result-badge">
            <el-tag :type="getResultType" size="medium">
              {{ getResultText }}
            </el-tag>
          </el-badge>
        </div>

        <!-- 结果统计 -->
        <div class="result-stats">
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-label">脱敏位数</div>
                <div class="stat-value">{{ maskedCount }}</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-label">可能组合</div>
                <div class="stat-value">{{ totalPossibleCombinations.toLocaleString() }}</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-label">合规数量</div>
                <div class="stat-value">{{ totalResults.toLocaleString() }}</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-label">显示数量</div>
                <div class="stat-value">{{ results.length.toLocaleString() }}</div>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 结果表格 -->
        <div class="result-table">
          <el-table :data="results" stripe border height="400" style="width: 100%"
            :default-sort="{ prop: 'idCard', order: 'ascending' }">
            <el-table-column prop="index" label="序号" width="80" align="center">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="idCard" label="身份证号" sortable>
              <template slot-scope="scope">
                <div class="id-card-display">
                  <span class="id-card-prefix">{{ scope.row.idCard.substring(0, 6) }}</span>
                  <span class="id-card-birth">{{ scope.row.idCard.substring(6, 14) }}</span>
                  <span class="id-card-seq">{{ scope.row.idCard.substring(14, 17) }}</span>
                  <span class="id-card-check">{{ scope.row.idCard.substring(17) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="gender" label="性别" width="100" align="center">
              <template slot-scope="scope">
                <el-tag :type="scope.row.gender === '男' ? 'primary' : 'danger'" size="small">
                  {{ scope.row.gender }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="birthDate" label="出生日期" width="120" sortable>
              <template slot-scope="scope">
                {{ formatBirthDate(scope.row.birthDate) }}
              </template>
            </el-table-column>
            <el-table-column prop="age" label="年龄" width="80" align="center" sortable>
              <template slot-scope="scope">
                <span>{{ scope.row.age }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="copyIdCard(scope.row.idCard)">
                  复制
                </el-button>
                <el-button type="text" size="small" @click="showDetail(scope.row)">
                  详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 分页 -->
        {{ totalResults }} ------ {{ formData.limit }}
        <div class="result-pagination">
          <el-pagination background layout="prev, pager, next" :page-size="pageSize" :total="totalResults"
            :current-page="currentPage" @current-change="handlePageChange">
          </el-pagination>
          <div class="pagination-hint">
            由于结果数量较多，已限制显示最多前 {{ formData.limit }} 条。如需查看更多结果，请调整查询条件。
          </div>
        </div>

        <!-- 导出功能 -->
        <div class="result-actions">
          <el-button type="success" plain @click="exportToTxt" :disabled="results.length === 0">
            <i class="el-icon-download"></i> 导出为TXT
          </el-button>
          <el-button type="warning" plain @click="exportToCSV" :disabled="results.length === 0">
            <i class="el-icon-download"></i> 导出为CSV
          </el-button>
          <el-button type="info" plain @click="results = []">
            <i class="el-icon-delete"></i> 清空结果
          </el-button>
        </div>
      </el-card>

      <!-- 结果为空提示 -->
      <el-card class="empty-card" shadow="hover"
        v-if="!loading && formData.idCardMasked && results.length === 0 && hasSearched">
        <div class="empty-content">
          <i class="el-icon-search" style="font-size: 60px; color: #909399;"></i>
          <h3>未找到符合条件的身份证号</h3>
          <p>请检查输入的身份证号格式或调整查询条件</p>
          <el-button type="primary" plain @click="showHelp = true">
            查看使用帮助
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 详情对话框 -->
    <el-dialog title="身份证详情" :visible.sync="detailDialogVisible" width="500px">
      <div class="detail-content" v-if="currentDetail">
        <div class="detail-row">
          <span class="detail-label">完整号码：</span>
          <span class="detail-value">{{ currentDetail.idCard }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">地区代码：</span>
          <span class="detail-value">{{ currentDetail.idCard.substring(0, 6) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">出生日期：</span>
          <span class="detail-value">{{ formatBirthDate(currentDetail.birthDate) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">性别：</span>
          <span class="detail-value">
            <el-tag :type="currentDetail.gender === '男' ? 'primary' : 'danger'" size="small">
              {{ currentDetail.gender }}
            </el-tag>
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">年龄：</span>
          <span class="detail-value">{{ currentDetail.age }} 岁</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">顺序码：</span>
          <span class="detail-value">{{ currentDetail.idCard.substring(14, 17) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">校验码：</span>
          <span class="detail-value">{{ currentDetail.idCard.substring(17) }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="copyIdCard(currentDetail.idCard)">复制号码</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 引入身份证生成公共方法
import { generatePossibleIDCards, validateSingleIDCard } from './idCardUtils';

export default {
  name: 'IdCardCompletion',

  data() {
    // 身份证号验证规则
    const validateIdCard = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入身份证号'));
      } else if (value.length !== 18) {
        callback(new Error('身份证号必须为18位'));
      } else if (!/^\d{6}[\d*]{12}$/.test(value)) {
        callback(new Error('前6位必须为数字，后面12位可以是数字或*'));
      } else if (value.substring(0, 6).includes('*')) {
        callback(new Error('前6位地区代码不能包含*号'));
      } else if (!value.includes('*')) {
        callback(new Error('身份证号应包含至少一个*号用于脱敏'));
      } else {
        callback();
      }
    };

    return {
      // 表单数据
      formData: {
        idCardMasked: '',
        gender: null,
        limit: 1000
      },

      // 表单验证规则
      formRules: {
        idCardMasked: [
          { required: true, validator: validateIdCard, trigger: 'blur' }
        ]
      },

      // 示例数据
      examples: [
        { id: 1, text: '11010119900101123*', desc: '最后一位不确定' },
        { id: 2, text: '11010119900101***1', desc: '第15-17位不确定' },
        { id: 3, text: '110101*******1231', desc: '出生日期不确定' },
        { id: 4, text: '1101011990*****123', desc: '月日不确定' }
      ],

      // 查询结果
      results: [],
      totalResults: 0,
      allResults: [], // 存储所有结果用于分页

      // 分页相关
      currentPage: 1,
      pageSize: 50,

      // 状态控制
      loading: false,
      showHelp: false,
      hasSearched: false,

      // 详情对话框
      detailDialogVisible: false,
      currentDetail: null,

      // 身份证生成工具方法
      idCardUtils: { generatePossibleIDCards, validateSingleIDCard }
    };
  },

  computed: {
    // 脱敏位数
    maskedCount() {
      if (!this.formData.idCardMasked) return 0;
      return (this.formData.idCardMasked.match(/\*/g) || []).length;
    },

    // 可能的组合总数（10的脱敏位数次方）
    totalPossibleCombinations() {
      return Math.pow(10, this.maskedCount);
    },

    // 结果标签类型
    getResultType() {
      if (this.totalResults === 0) return 'info';
      if (this.totalResults <= 100) return 'success';
      if (this.totalResults <= 1000) return 'warning';
      return 'danger';
    },

    // 结果标签文本
    getResultText() {
      if (this.totalResults === 0) return '无结果';
      if (this.totalResults > this.formData.limit) return `部分结果 (${this.formData.limit}+)`;
      return `${this.totalResults} 个结果`;
    }
  },

  methods: {
    // 格式化身份证号输入，自动转大写并过滤非法字符
    formatIdCard(value) {
      this.formData.idCardMasked = value
        .toUpperCase()
        .replace(/[^\d*]/g, '')
        .substring(0, 18);
    },

    // 设置示例
    setExample(id) {
      const example = this.examples.find(e => e.id === id);
      if (example) {
        this.formData.idCardMasked = example.text;
        this.$nextTick(() => {
          this.$refs.form.clearValidate('idCardMasked');
        });
      }
    },

    // 格式化限制提示
    formatLimit(value) {
      return `最多显示 ${value} 条`;
    },

    // 格式化出生日期
    formatBirthDate(birthStr) {
      if (!birthStr || birthStr.length !== 8) return '';
      const year = birthStr.substring(0, 4);
      const month = birthStr.substring(4, 6);
      const day = birthStr.substring(6, 8);
      return `${year}-${month}-${day}`;
    },

    // 计算年龄
    calculateAge(birthStr) {
      if (!birthStr || birthStr.length !== 8) return 0;
      const birthYear = parseInt(birthStr.substring(0, 4));
      const birthMonth = parseInt(birthStr.substring(4, 6)) - 1;
      const birthDay = parseInt(birthStr.substring(6, 8));

      const today = new Date();
      const birthDate = new Date(birthYear, birthMonth, birthDay);

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age;
    },

    // 处理查询
    handleQuery() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.executeQuery();
        } else {
          this.$message.error('请检查输入格式');
          return false;
        }
      });
    },

    // 执行查询
    async executeQuery() {
      this.loading = true;
      this.hasSearched = true;

      try {
        // 使用身份证生成工具
        const allIds = this.idCardUtils.generatePossibleIDCards(
          this.formData.idCardMasked,
          this.formData.gender
        );

        // 限制结果数量
        const limitedIds = allIds.slice(0, this.formData.limit);

        // 转换为结果格式
        this.allResults = limitedIds.map((id, index) => {
          const birthDate = id.substring(6, 14);
          const genderCode = parseInt(id.substring(16, 17));
          return {
            index: index + 1,
            idCard: id,
            birthDate: birthDate,
            gender: genderCode % 2 === 1 ? '男' : '女',
            age: this.calculateAge(birthDate)
          };
        });

        this.totalResults = limitedIds.length;
        this.currentPage = 1;
        this.updateDisplayResults();

        // 显示成功消息
        if (limitedIds.length > 0) {
          this.$message.success(`找到 ${limitedIds.length} 个可能的身份证号`);
        } else {
          this.$message.warning('未找到符合条件的身份证号');
        }
      } catch (error) {
        console.error('查询出错:', error);
        this.$message.error('查询过程中出现错误，请检查输入格式');
      } finally {
        this.loading = false;
      }
    },

    // 更新显示结果（分页）
    updateDisplayResults() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.results = this.allResults.slice(start, end);
    },

    // 处理分页变化
    handlePageChange(page) {
      this.currentPage = page;
      this.updateDisplayResults();
    },

    // 重置表单
    handleReset() {
      this.$refs.form.resetFields();
      this.results = [];
      this.allResults = [];
      this.totalResults = 0;
      this.hasSearched = false;
      this.currentPage = 1;
    },

    // 复制身份证号
    copyIdCard(idCard) {
      const textarea = document.createElement('textarea');
      textarea.value = idCard;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      this.$message.success('已复制到剪贴板');
    },

    // 显示详情
    showDetail(item) {
      this.currentDetail = item;
      this.detailDialogVisible = true;
    },

    // 导出为TXT
    exportToTxt() {
      console.log("this.allResults.map(item => item.idCard).length ===", this.allResults.map(item => item.idCard).length)
      const content = this.allResults.map((item, index) => `第${index + 1}个 => ${item.idCard}`).join('\n');
      this.downloadFile(content, '身份证号列表.txt', 'text/plain');
      this.$message.success('导出成功');
    },

    // 导出为CSV
    exportToCSV() {
      const headers = ['序号', '身份证号', '出生日期', '性别', '年龄'];
      const rows = this.allResults.map(item => [
        item.index,
        item.idCard,
        this.formatBirthDate(item.birthDate),
        item.gender,
        item.age
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      this.downloadFile(csvContent, '身份证号列表.csv', 'text/csv');
      this.$message.success('导出成功');
    },

    // 下载文件
    downloadFile(content, fileName, mimeType) {
      const blob = new Blob([content], { type: mimeType });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>

<style scoped>
.id-card-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.page-title {
  color: #303133;
  font-size: 28px;
  margin-bottom: 10px;
}

.page-subtitle {
  color: #606266;
  font-size: 16px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

.input-card,
.result-card,
.help-card,
.empty-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
}

.id-input {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  letter-spacing: 1px;
}

.length-indicator {
  color: #909399;
  font-size: 14px;
}

.input-hint {
  margin-top: 8px;
  color: #909399;
  font-size: 14px;
}

.input-hint i {
  margin-right: 5px;
}

.example-list {
  margin-top: 8px;
}

.example-label {
  color: #606266;
  margin-right: 10px;
}

.gender-hint,
.limit-hint {
  margin-top: 8px;
  color: #909399;
  font-size: 14px;
}

.gender-hint i {
  margin-right: 5px;
  color: #e6a23c;
}

.query-button {
  padding: 12px 30px;
  font-size: 16px;
}

.help-card {
  background-color: #f0f9ff;
  border-color: #e4e7ed;
}

.help-header {
  color: #409eff;
  font-weight: 600;
}

.help-content {
  line-height: 1.6;
}

.help-content ul {
  margin: 10px 0;
  padding-left: 20px;
}

.help-content code {
  background-color: #f4f4f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-badge {
  margin-right: 10px;
}

.result-stats {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.stat-item {
  text-align: center;
  padding: 10px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.id-card-display {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  letter-spacing: 1px;
}

.id-card-prefix {
  color: #409eff;
  font-weight: 600;
}

.id-card-birth {
  color: #e6a23c;
}

.id-card-seq {
  color: #67c23a;
}

.id-card-check {
  color: #f56c6c;
  font-weight: 600;
}

.result-pagination {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pagination-hint {
  margin-top: 10px;
  color: #909399;
  font-size: 14px;
  text-align: center;
}

.result-actions {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.empty-content {
  text-align: center;
  padding: 60px 0;
}

.empty-content h3 {
  margin: 20px 0 10px;
  color: #303133;
}

.empty-content p {
  color: #909399;
  margin-bottom: 20px;
}

.detail-content {
  line-height: 2;
}

.detail-row {
  display: flex;
  margin-bottom: 10px;
}

.detail-label {
  width: 100px;
  font-weight: 600;
  color: #303133;
}

.detail-value {
  flex: 1;
  color: #606266;
}

@media (max-width: 768px) {
  .main-content {
    padding: 0 10px;
  }

  .stat-item {
    margin-bottom: 10px;
  }

  .id-input {
    font-size: 14px;
  }
}
</style>