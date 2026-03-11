<template>
  <div>
    <div class="header">
      <div class="title-container">
        <div class="logo">新</div>
        <div class="title">新华日报电子版</div>
      </div>
      <div class="date-info">
        <current-date-time></current-date-time>
      </div>
    </div>

    <div class="main-container">
      <div class="sidebar">
        <div class="issue-list">
          <div v-for="(issue, index) in issues" :key="index" class="issue-item"
            :class="{ active: activeIssueIndex === index }" @click="selectIssue(index)">
            <div class="issue-icon">{{ index + 1 }}</div>
            <div>{{ issue.title }}</div>
          </div>
        </div>

        <div class="page-hint">
          选择版面可查看详细内容
        </div>
      </div>

      <div class="content-area">
        <div class="preview-container">
          <div v-if="loading" class="loading-indicator">
            <div class="loading-spinner"></div>
            <p>正在加载PDF，请稍候...</p>
          </div>

          <embed v-if="!loading && currentIssue.pdf_url" :src="currentIssue.pdf_url" type="application/pdf"
            class="pdf-viewer" :style="{ zoom: zoomLevel }">

          <div v-if="!loading && !currentIssue.pdf_url" class="pdf-placeholder">
            <div class="placeholder-content">
              <i class="material-icons" style="font-size: 48px; color: #c50000;">picture_as_pdf</i>
              <h3 style="margin: 15px 0;">{{ currentIssue.title }}</h3>
              <p>暂无PDF内容可供预览</p>
              <p style="margin-top: 5px; font-size: 0.9rem; color: #999;">
                请尝试选择其他版面或稍后再试
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import axios from "axios";
import CurrentDateTime from './components/CurrentDateTime.vue';
export default {
  components: {
    CurrentDateTime
  },
  data() {
    return {
      activeIssueIndex: 0,
      issues: [],
      zoomLevel: 1,
      loading: false
    };
  },
  computed: {
    currentIssue() {
      return this.issues.length > 0 ? this.issues[this.activeIssueIndex] : {};
    }
  },
  mounted() {
    this.getNewsInfo();
  },
  methods: {
    getNewsInfo() {
      axios
        .get(`/yyy/v1/xinhua/news?token=${this.globalConfig.token_news}`)
        .then(res => {
          console.log('南方日报接口res === ', res)
          if (Array.isArray(res.data.data) && res.data.data.length) {
            this.issues = res.data.data
          } else {
            this.issues = []
          }
        })
        .catch(err => {
          console.log("err === ", err);
          this.$message({
            message: err.response.data.message || "获取数据失败",
            type: "error"
          });
        });
    },
    selectIssue(index) {
      this.activeIssueIndex = index;
    },
    downloadPdf(url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = `新华日报-${this.currentIssue.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Noto Serif SC', 'Microsoft YaHei', serif;
}

body {
  background: linear-gradient(135deg, #f5f7fa 0%, #e6e9f0 100%);
  color: #333;
  padding: 20px;
  min-height: 100vh;
}

.newspaper-app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
}

.header {
  background: #c50000;
  color: white;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
}

.title-container {
  display: flex;
  align-items: center;
}

.logo {
  width: 60px;
  height: 60px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  font-weight: bold;
  font-size: 1.8rem;
  color: #c50000;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.date-info {
  font-size: 1.1rem;
  opacity: 0.92;
}

.stats {
  display: flex;
  align-items: center;
  padding: 15px 30px;
  background: #fff;
  color: #555;
  border-bottom: 1px solid #eee;
  font-size: 0.95rem;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
}

.stats-item {
  margin-right: 30px;
  display: flex;
  align-items: center;
}

.stats-item i {
  margin-right: 8px;
  color: #c50000;
}

.main-container {
  display: flex;
  margin-top: 20px;
  gap: 20px;
}

.sidebar {
  flex: 0 0 260px;
  background: white;
  border-radius: 8px;

  padding: 20px 0;
 
}

.section-title {
  padding: 0 20px 15px;
  font-size: 1.3rem;
  font-weight: 600;
  color: #c50000;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.section-title i {
  margin-right: 10px;
}

.issue-list {
  padding: 10px 0;
}

.issue-item {
  padding: 14px 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.issue-item:hover {
  background: #f8f9fd;
}

.issue-item.active {
  background: #fef1f1;
  border-left-color: #c50000;
  color: #c50000;
  font-weight: 500;
}

.issue-icon {
  width: 36px;
  height: 36px;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  font-size: 0.95rem;
}

.issue-item.active .issue-icon {
  background: #c50000;
  color: white;
}

.content-area {
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.preview-header {
  padding: 20px 25px;
  background: #f8f9fd;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.issue-title {
  font-size: 1.6rem;
  color: #222;
  font-weight: 600;
}

.preview-tools {
  display: flex;
  gap: 10px;
}

.tool-btn {
  padding: 8px 16px;
  background: #f1f1f1;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.tool-btn:hover {
  background: #e0e0e0;
}

.tool-btn i {
  margin-right: 5px;
}

.preview-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.pdf-viewer {
  flex: 1;
  width: 100%;
  min-height: 65vh;
  border: none;
}

.pdf-placeholder {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9f9f9;
  border-radius: 8px;
  border: 2px dashed #eee;
  text-align: center;
  color: #666;
  padding: 30px;
  transition: all 0.3s ease;
}

.pdf-placeholder:hover {
  border-color: #c50000;
}

.placeholder-content {
  max-width: 400px;
}

.pdf-actions {
  margin-top: 25px;
  display: flex;
  justify-content: center;
  gap: 15px;
}

.pdf-btn {
  padding: 12px 24px;
  background: #c50000;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  box-shadow: 0 3px 8px rgba(197, 0, 0, 0.3);
}

.pdf-btn:hover {
  background: #a90000;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(197, 0, 0, 0.4);
}

.pdf-btn.secondary {
  background: white;
  color: #333;
  border: 1px solid #ddd;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.pdf-btn.secondary:hover {
  background: #f8f8f8;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.pdf-btn i {
  margin-right: 8px;
  font-size: 1.2rem;
}

.loading-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 10;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #c50000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.footer {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 0.9rem;
  background: #f9f9f9;
  border-top: 1px solid #eee;
  margin-top: 30px;
  border-radius: 0 0 12px 12px;
}

.page-hint {
  text-align: center;
  margin-top: 20px;
  font-size: 0.95rem;
  color: #777;
}

@media (max-width: 900px) {
  .main-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .header {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }

  .title-container {
    justify-content: center;
  }

  .stats {
    justify-content: center;
    flex-wrap: wrap;
  }

  .stats-item {
    margin-bottom: 10px;
  }

  .preview-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .preview-tools {
    width: 100%;
    justify-content: center;
  }
}
</style>