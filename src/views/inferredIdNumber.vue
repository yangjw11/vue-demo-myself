<template>
  <div class="container">
    <!-- 头部保持不变 -->
    <div class="header">
      <h1 class="title">失信被执行人身份证号推测</h1>
      <div class="subtitle">身份证号格式必须为：<span class="example">5331241994****0929</span></div>
    </div>

    <div class="form-container">
      <div class="form-card">
        <el-form ref="formRef" :model="dataForm" :rules="rules" label-width="150px">
          <el-form-item label="请输入姓名：" prop="name">
            <el-input v-model="dataForm.name" placeholder="请输入失信人姓名" clearable :style="{ width: '300px' }">
              <template #prepend>
                <i class="el-icon-user"></i>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="请输入身份证号：" prop="idNumber">
            <el-input v-model="dataForm.idNumber" placeholder="格式示例：5331241994****0929" clearable
              :style="{ width: '300px' }" maxlength="18" show-word-limit>
              <template #prepend>
                <i class="el-icon-document"></i>
              </template>
            </el-input>
          </el-form-item>

          <div class="form-tips">
            <el-alert title="填写说明" type="info" :closable="false" description="请确保姓名准确，身份证号格式正确。系统将自动生成所有可能的身份证号进行查询。"
              show-icon />
          </div>
        </el-form>
      </div>
    </div>

    <div class="button-container">
      <el-button @click="query" type="primary" size="large" :loading="loading" class="query-button">
        <i class="el-icon-search"></i>
        {{ loading ? '查询中...' : '开始查询' }}
      </el-button>
    </div>

    <div class="result-container" v-if="showResultSection">
      <div class="result-card">
        <div class="result-header">
          <i class="el-icon-info" :class="{
            'success-icon': resultIdNumber,
            'loading-icon': loading,
            'warning-icon': !resultIdNumber && !loading && idNumberList.length > 0
          }"></i>
          <span class="result-title">{{ getResultTitle() }}</span>
        </div>

        <div class="result-content">
          <template v-if="loading">
            <div class="loading-section">
              <div class="loading-text">
                <i class="el-icon-loading"></i>
                正在查询，请稍候...
              </div>
              <div class="progress-info" v-if="currentIndex > 0">
                已查询 {{ currentIndex }} / {{ idNumberList.length }} 个身份证号
              </div>
              <el-progress :percentage="progressPercentage" :stroke-width="10" :show-text="false" class="progress-bar"
                v-if="idNumberList.length > 0" />
            </div>
          </template>

          <template v-else-if="resultIdNumber">
            <div class="success-section">
              <div class="success-icon-text">
                <i class="el-icon-success success-color"></i>
                <span>找到匹配的身份证号！</span>
              </div>
              <div class="result-display">
                <div class="result-label">姓名：</div>
                <div class="result-value">{{ dataForm.name }}</div>

                <div class="result-label">身份证号：</div>
                <div class="result-value highlight">{{ resultIdNumber }}</div>

                <div class="result-label">生成总数：</div>
                <div class="result-value">{{ idNumberList.length }} 个可能号码</div>
              </div>

              <el-button type="success" @click="copyResult" class="copy-button">
                <i class="el-icon-document-copy"></i>
                复制身份证号
              </el-button>
            </div>
          </template>

          <template v-else>
            <div class="no-result-section">
              <i class="el-icon-warning warning-color"></i>
              <span>未找到匹配的身份证号</span>
              <div class="no-result-tips">
                已尝试 {{ idNumberList.length }} 个可能的身份证号，均未查询到失信记录。
              </div>
            </div>
          </template>

          <!-- 身份证号列表，查询开始时就显示 -->
          <div class="id-list-container" v-if="idNumberList.length > 0">
            <div class="id-list-header">
              <h3>所有可能的身份证号（共 {{ idNumberList.length }} 个）</h3>
              <div class="id-list-subtitle">
                匹配的身份证号用<span class="highlight-tag">绿色背景</span>高亮显示
                <span v-if="loading" class="current-query-info">当前查询的用<span class="blue-tag">蓝色边框</span>高亮显示</span>
              </div>
            </div>

            <div class="id-list-wrapper">
              <div class="id-list-grid">
                <div v-for="(item, index) in idNumberList" :key="index"
                  :class="[
                    'id-number-item',
                    { 
                      'highlight-item': item.id === resultIdNumber, 
                      'querying-item': loading && currentQueryId === item.id,
                      'queried-item': !loading && item.status === 'queried' && item.id !== resultIdNumber,
                      'not-queried-item': !loading && item.status === 'not_queried'
                    }
                  ]">
                  <div class="id-number-index">#{{ index + 1 }}</div>
                  <div class="id-number-value">{{ item.id }}</div>
                  <div class="id-number-status">
                    <template v-if="item.id === resultIdNumber">
                      <i class="el-icon-check status-icon match-icon"></i>
                      <span>匹配</span>
                    </template>
                    <template v-else-if="loading && currentQueryId === item.id">
                      <i class="el-icon-loading status-icon querying-icon"></i>
                      <span>查询中</span>
                    </template>
                    <template v-else-if="item.status === 'queried'">
                      <i class="el-icon-close status-icon not-match-icon"></i>
                      <span>未匹配</span>
                    </template>
                    <template v-else>
                      <i class="el-icon-minus status-icon waiting-icon"></i>
                      <span>未查询</span>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <div class="id-list-summary">
              <div class="summary-item">
                <span class="summary-label">总计：</span>
                <span class="summary-value">{{ idNumberList.length }} 个</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">已查询：</span>
                <span class="summary-value">{{ queriedCount }} 个</span>
              </div>
              <div class="summary-item" v-if="resultIdNumber">
                <span class="summary-label">匹配：</span>
                <span class="summary-value highlight">{{ 1 }} 个</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">未匹配：</span>
                <span class="summary-value">{{ matchedCount }} 个</span>
              </div>
              <div class="summary-item" v-if="loading">
                <span class="summary-label">未查询：</span>
                <span class="summary-value waiting">{{ waitingCount }} 个</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="statistics" v-if="queryCount > 0">
        累计查询 {{ queryCount }} 次
      </div>
      <div class="footer-text">
        提示：每次查询间隔5秒，防止请求频率过高
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    // 自定义身份证号验证器（保持不变）
    const validateIdNumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入身份证号'));
        return;
      }

      if (value.length !== 18) {
        callback(new Error('身份证号必须是18位'));
        return;
      }

      const pattern = /^(\d{10})\*{4}(\d{3}[0-9Xx])$/;
      if (!pattern.test(value)) {
        callback(new Error('身份证号格式不正确，必须为：5331241994****0929'));
        return;
      }

      const middlePart = value.substring(10, 14);
      if (middlePart !== '****') {
        callback(new Error('月份和日期部分必须是****'));
        return;
      }

      const prefix = value.substring(0, 10);
      const suffix = value.substring(14, 18);

      if (!/^\d{10}$/.test(prefix)) {
        callback(new Error('身份证号前10位必须是数字'));
        return;
      }

      if (!/^\d{3}[0-9Xx]$/.test(suffix)) {
        callback(new Error('身份证号后4位格式不正确'));
        return;
      }

      callback();
    };

    return {
      idNumberList: [], // 改为对象数组，包含id和status
      dataForm: {
        name: "何祖记",
        idNumber: "5331241994****0929",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
          {
            min: 2,
            max: 20,
            message: "姓名长度在2到20个字符之间",
            trigger: "blur"
          }
        ],
        idNumber: [
          {
            required: true,
            message: "请输入身份证号",
            trigger: "blur",
          },
          {
            validator: validateIdNumber,
            trigger: "blur"
          }
        ],
      },
      resultIdNumber: "",
      loading: false,
      currentIndex: 0,
      queryCount: 0,
      currentQueryId: "", // 当前正在查询的身份证号
    };
  },
  computed: {
    progressPercentage() {
      if (this.idNumberList.length === 0) return 0;
      return Math.round((this.currentIndex / this.idNumberList.length) * 100);
    },
    showResultSection() {
      return this.resultIdNumber || this.loading || this.idNumberList.length > 0;
    },
    // 计算已查询的数量
    queriedCount() {
      return this.idNumberList.filter(item => item.status === 'queried' || item.id === this.resultIdNumber).length;
    },
    // 计算未匹配的数量（已查询但未匹配）
    matchedCount() {
      return this.idNumberList.filter(item => item.status === 'queried' && item.id !== this.resultIdNumber).length;
    },
    // 计算未查询的数量
    waitingCount() {
      return this.idNumberList.length - this.queriedCount;
    }
  },
  methods: {
    getResultTitle() {
      if (this.loading) return '查询中';
      if (this.resultIdNumber) return '查询结果';
      if (this.idNumberList.length > 0) return '查询完成';
      return '查询结果';
    },

    validateForm() {
      return new Promise((resolve, reject) => {
        if (!this.dataForm.name || this.dataForm.name.trim() === '') {
          this.$message.error('姓名不能为空');
          reject(new Error('姓名不能为空'));
          return;
        }

        const idNumber = this.dataForm.idNumber;

        if (!idNumber || idNumber.trim() === '') {
          this.$message.error('身份证号不能为空');
          reject(new Error('身份证号不能为空'));
          return;
        }

        if (idNumber.length !== 18) {
          this.$message.error('身份证号必须是18位');
          reject(new Error('身份证号必须是18位'));
          return;
        }

        const pattern = /^(\d{10})\*{4}(\d{3}[0-9Xx])$/;
        if (!pattern.test(idNumber)) {
          this.$message.error('身份证号格式不正确，必须为：5331241994****0929');
          reject(new Error('身份证号格式不正确'));
          return;
        }

        const middlePart = idNumber.substring(10, 14);
        if (middlePart !== '****') {
          this.$message.error('月份和日期部分必须是****');
          reject(new Error('月份和日期部分必须是****'));
          return;
        }

        const lastChar = idNumber.substring(17, 18);
        if (lastChar === 'x') {
          this.dataForm.idNumber = idNumber.substring(0, 17) + 'X';
        }

        resolve();
      });
    },

    calculateChecksum(id17) {
      const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      const checksums = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
      let sum = 0;
      for (let i = 0; i < 17; i++) {
        sum += parseInt(id17[i]) * factors[i];
      }
      const remainder = sum % 11;
      return checksums[remainder];
    },

    generateValidIDs(idPartial) {
      if (!idPartial || idPartial.length !== 18) {
        console.error('身份证号格式错误');
        return [];
      }

      const prefix = idPartial.substring(0, 10);
      const sequenceCode = idPartial.substring(14, 17);
      const givenChecksum = idPartial.substring(17, 18).toUpperCase();

      const validIDs = [];
      const year = parseInt(prefix.substring(6, 10));

      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

      for (let month = 1; month <= 12; month++) {
        const mm = month.toString().padStart(2, '0');
        let maxDays;
        if (month === 2) {
          maxDays = isLeapYear ? 29 : 28;
        } else if ([4, 6, 9, 11].includes(month)) {
          maxDays = 30;
        } else {
          maxDays = 31;
        }

        for (let day = 1; day <= maxDays; day++) {
          const dd = day.toString().padStart(2, '0');
          const mmdd = mm + dd;
          const first17 = prefix + mmdd + sequenceCode;
          const calculatedChecksum = this.calculateChecksum(first17);

          if (calculatedChecksum === givenChecksum) {
            validIDs.push({
              id: first17 + calculatedChecksum,
              status: 'not_queried' // 初始状态：未查询
            });
          }
        }
      }

      console.log(`生成了 ${validIDs.length} 个可能的身份证号`);
      return validIDs;
    },

    async query() {
      try {
        await this.validateForm();

        this.resultIdNumber = "";
        this.loading = true;
        this.currentIndex = 0;
        this.currentQueryId = "";
        this.queryCount++;

        console.log("开始查询");

        // 生成身份证号列表，初始状态为未查询
        this.idNumberList = this.generateValidIDs(this.dataForm.idNumber);

        if (this.idNumberList.length === 0) {
          this.$message.warning('未生成有效的身份证号，请检查输入格式');
          this.loading = false;
          return;
        }

        console.log("推测的身份证号可能 this.idNumberList === ", this.idNumberList);

        // 遍历查询所有身份证号
        for (let i = 0; i < this.idNumberList.length; i++) {
          const item = this.idNumberList[i];
          this.currentIndex = i + 1;
          this.currentQueryId = item.id; // 设置当前查询的身份证号

          try {
            let response = await axios.get(`/shixin?key=${this.globalConfig.apiKey_judgmentDefaulter}`, {
              params: {
                name: this.dataForm.name,
                code: item.id,
                page: 1,
                rows: 20
              }
            });
            console.log('response === ', response);

            // 更新当前身份证号的查询状态
            if (response.data.data.rows.length) {
              this.resultIdNumber = item.id;
              console.log("找到匹配的身份证号:", item.id);
              this.$message.success(`找到匹配的身份证号: ${item.id}`);
              // 找到匹配后跳出循环
              break;
            } else {
              // 未匹配，更新状态为已查询
              item.status = 'queried';
            }

            // 如果不是最后一个，延迟5秒
            if (i < this.idNumberList.length - 1) {
              await this.delay(5000);
            }
          } catch (error) {
            console.error(`身份证 ${item.id} 的请求失败:`, error);
            // 即使请求失败，也标记为已查询
            item.status = 'queried';
          }
        }

        if (this.resultIdNumber) {
          console.log("最终找到的身份证号:", this.resultIdNumber);
        } else {
          console.log("未找到匹配的身份证号");
          this.$message.info('未找到匹配的身份证号');
        }
      } catch (error) {
        console.error('表单验证失败:', error);
      } finally {
        this.loading = false;
        this.currentQueryId = "";
      }
    },

    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    copyResult() {
      if (!this.resultIdNumber) return;

      navigator.clipboard.writeText(this.resultIdNumber)
        .then(() => {
          this.$message.success('身份证号已复制到剪贴板');
        })
        .catch(err => {
          console.error('复制失败:', err);
          this.$message.error('复制失败，请手动复制');
        });
    }
  },
};
</script>

<style scoped lang="scss">
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);

  .title {
    color: #ff4d4f;
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 12px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  }

  .subtitle {
    font-size: 18px;
    color: #666;

    .example {
      color: #1890ff;
      font-weight: bold;
      font-family: monospace;
      background: #f0f8ff;
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px dashed #91d5ff;
    }
  }
}

.form-container {
  margin-bottom: 30px;

  .form-card {
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    :deep(.el-form-item) {
      margin-bottom: 28px;

      .el-form-item__label {
        font-size: 16px;
        font-weight: 500;
        color: #333;
      }
    }

    .form-tips {
      margin-top: 20px;
      max-width: 600px;

      :deep(.el-alert) {
        border: 1px solid #e6f7ff;
        background-color: #f6ffed;

        .el-alert__description {
          color: #666;
          font-size: 14px;
          line-height: 1.6;
        }
      }
    }
  }
}

.button-container {
  text-align: center;
  margin: 40px 0;

  .query-button {
    padding: 14px 40px;
    font-size: 18px;
    border-radius: 8px;
    background: linear-gradient(45deg, #409EFF, #1890ff);
    border: none;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(24, 144, 255, 0.3);
    }

    &:active {
      transform: translateY(0);
    }

    i {
      margin-right: 8px;
    }
  }
}

.result-container {
  margin-top: 30px;

  .result-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    border: 1px solid #e8e8e8;

    .result-header {
      background: linear-gradient(90deg, #f0f8ff, #e6f7ff);
      padding: 20px 30px;
      border-bottom: 1px solid #91d5ff;

      i {
        font-size: 20px;
        margin-right: 10px;

        &.success-icon {
          color: #52c41a;
        }

        &.loading-icon {
          color: #1890ff;
          animation: spin 1s linear infinite;
        }

        &.warning-icon {
          color: #faad14;
        }
      }

      .result-title {
        font-size: 20px;
        font-weight: 600;
        color: #333;
      }
    }

    .result-content {
      padding: 30px;

      .loading-section {
        text-align: center;

        .loading-text {
          font-size: 18px;
          color: #1890ff;
          margin-bottom: 20px;

          i {
            margin-right: 10px;
            animation: spin 1s linear infinite;
          }
        }

        .progress-info {
          color: #666;
          margin-bottom: 15px;
          font-size: 14px;
        }

        .progress-bar {
          max-width: 400px;
          margin: 0 auto;

          :deep(.el-progress-bar) {
            background-color: #f0f0f0;

            .el-progress-bar__inner {
              background: linear-gradient(90deg, #1890ff, #40a9ff);
            }
          }
        }
      }

      .success-section {
        .success-icon-text {
          display: flex;
          align-items: center;
          margin-bottom: 25px;

          i {
            font-size: 24px;
            margin-right: 12px;
          }

          span {
            font-size: 22px;
            font-weight: 600;
            color: #52c41a;
          }
        }

        .result-display {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 15px 20px;
          margin-bottom: 30px;
          padding: 20px;
          background: #f6ffed;
          border-radius: 8px;
          border: 1px solid #b7eb8f;

          .result-label {
            font-weight: 600;
            color: #666;
            font-size: 16px;
          }

          .result-value {
            color: #333;
            font-size: 16px;

            &.highlight {
              color: #1890ff;
              font-size: 20px;
              font-weight: bold;
              font-family: monospace;
              letter-spacing: 1px;
              background: #e6f7ff;
              padding: 5px 10px;
              border-radius: 4px;
              display: inline-block;
            }
          }
        }

        .copy-button {
          padding: 10px 30px;
          font-size: 16px;
          border-radius: 6px;

          i {
            margin-right: 8px;
          }
        }
      }

      .no-result-section {
        text-align: center;
        padding: 30px;

        i {
          font-size: 48px;
          margin-bottom: 20px;
          display: block;

          &.warning-color {
            color: #faad14;
          }
        }

        span {
          font-size: 20px;
          color: #666;
          display: block;
          margin-bottom: 15px;
        }

        .no-result-tips {
          color: #999;
          font-size: 14px;
          line-height: 1.6;
        }
      }

      /* 新增：身份证号列表样式 */
      .id-list-container {
        margin-top: 40px;
        padding-top: 30px;
        border-top: 1px solid #f0f0f0;

        .id-list-header {
          margin-bottom: 20px;

          h3 {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
          }

          .id-list-subtitle {
            color: #666;
            font-size: 14px;

            .highlight-tag {
              display: inline-block;
              background: #f6ffed;
              color: #52c41a;
              padding: 2px 6px;
              border-radius: 3px;
              margin: 0 4px;
              border: 1px solid #b7eb8f;
            }

            .blue-tag {
              display: inline-block;
              background: #e6f7ff;
              color: #1890ff;
              padding: 2px 6px;
              border-radius: 3px;
              margin: 0 4px;
              border: 1px solid #91d5ff;
            }

            .current-query-info {
              margin-left: 10px;
            }
          }
        }

        .id-list-wrapper {
          border: 1px solid #e8e8e8;
          border-radius: 8px;
          overflow: hidden;
          background: #fafafa;
          margin-bottom: 20px;
          max-height: 400px;
          overflow-y: auto;

          .id-list-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 12px;
            padding: 20px;
          }
        }

        .id-number-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: white;
          border: 1px solid #e8e8e8;
          border-radius: 6px;
          transition: all 0.3s ease;

          &:hover {
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            transform: translateY(-1px);
          }

          /* 匹配的身份证号 - 绿色背景 */
          &.highlight-item {
            background: #f6ffed;
            border-color: #b7eb8f;
            box-shadow: 0 2px 12px rgba(82, 196, 26, 0.2);

            .id-number-value {
              color: #52c41a;
              font-weight: bold;
            }

            .id-number-status {
              color: #52c41a;
            }
          }

          /* 正在查询的身份证号 - 蓝色边框 */
          &.querying-item {
            background: #e6f7ff;
            border: 2px solid #1890ff;
            box-shadow: 0 2px 12px rgba(24, 144, 255, 0.2);

            .id-number-value {
              color: #1890ff;
              font-weight: bold;
            }

            .id-number-status {
              color: #1890ff;
            }
          }

          /* 已查询但未匹配的身份证号 - 灰色背景 */
          &.queried-item {
            background: #f5f5f5;
            border-color: #d9d9d9;

            .id-number-value {
              color: #999;
            }

            .id-number-status {
              color: #999;
            }
          }

          /* 未查询的身份证号 - 默认样式 */
          &.not-queried-item {
            .id-number-value {
              color: #333;
            }

            .id-number-status {
              color: #666;
            }
          }

          .id-number-index {
            width: 40px;
            color: #999;
            font-size: 14px;
            font-weight: 500;
          }

          .id-number-value {
            flex: 1;
            font-family: monospace;
            font-size: 16px;
            letter-spacing: 1px;
          }

          .id-number-status {
            display: flex;
            align-items: center;
            font-size: 14px;

            .status-icon {
              margin-right: 4px;
              font-size: 14px;

              &.match-icon {
                color: #52c41a;
              }

              &.querying-icon {
                color: #1890ff;
                animation: spin 1s linear infinite;
              }

              &.not-match-icon {
                color: #ff4d4f;
              }

              &.waiting-icon {
                color: #999;
              }
            }
          }
        }

        .id-list-summary {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 20px;
          padding: 16px;
          background: #f0f8ff;
          border-radius: 8px;
          border: 1px solid #91d5ff;

          .summary-item {
            display: flex;
            align-items: center;
            gap: 8px;

            .summary-label {
              font-weight: 500;
              color: #666;
            }

            .summary-value {
              font-weight: 600;
              color: #333;
              font-size: 16px;

              &.highlight {
                color: #52c41a;
              }

              &.waiting {
                color: #1890ff;
              }
            }
          }
        }
      }
    }
  }
}

.footer {
  margin-top: 40px;
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;

  .statistics {
    margin-bottom: 10px;
    color: #666;
    font-weight: 500;
  }

  .footer-text {
    color: #999;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .header {
    padding: 20px 15px;

    .title {
      font-size: 24px;
    }

    .subtitle {
      font-size: 16px;
    }
  }

  .form-container .form-card {
    padding: 20px 15px;

    :deep(.el-form-item__label) {
      font-size: 14px;
    }

    :deep(.el-input) {
      width: 100% !important;
    }
  }

  .query-button {
    width: 100%;
    padding: 12px 20px !important;
  }

  .result-container .result-card .result-content {
    padding: 20px 15px;
  }

  .result-display {
    grid-template-columns: 1fr !important;
    gap: 10px !important;
  }

  /* 响应式：身份证号列表 */
  .id-list-wrapper .id-list-grid {
    grid-template-columns: 1fr !important;
    gap: 10px !important;
    padding: 15px !important;
  }

  .id-number-item {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 8px;

    .id-number-index {
      width: auto !important;
    }

    .id-number-value {
      width: 100%;
      overflow-x: auto;
    }
  }

  .id-list-summary {
    flex-direction: column;
    gap: 10px !important;
  }

  .id-list-subtitle {
    display: flex;
    flex-direction: column;
    gap: 5px;
    
    .current-query-info {
      margin-left: 0 !important;
    }
  }
}
</style>