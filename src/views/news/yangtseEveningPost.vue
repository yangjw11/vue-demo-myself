<template>
  <div class="pdf-layout-container">
    <!-- 左侧标题列表 -->
    <div class="left-panel">
      <div class="panel-header">
        <h3>扬子晚报电子版</h3>
      </div>
      <div class="title-list">
        <div v-for="item in pdfData" :key="item.pdf_url" class="title-item"
          :class="{ active: activePdf === item.pdf_url }" @click="togglePdf(item.pdf_url, item.title)">
          <span class="title-text">{{ item.title }}</span>
          <span class="icon">{{ activePdf === item.pdf_url ? '▶' : '' }}</span>
        </div>
      </div>
    </div>

    <!-- 右侧PDF预览区域 -->
    <div class="right-panel">
      <div class="preview-header">
        <h3>{{ currentTitle || '请选择PDF文档' }}</h3>
        <button v-if="activePdf" class="download-btn" @click="downloadPdf">
          下载PDF
        </button>
      </div>

      <div class="preview-content">
        <div v-if="!activePdf" class="empty-state">
          <div class="empty-icon">📄</div>
          <p>请从左侧列表选择一个PDF文档进行预览</p>
        </div>

        <transition name="fade" mode="out-in">
          <div v-if="activePdf" class="pdf-viewer">
            <object :data="activePdf" type="application/pdf" width="100%" height="100%">
              <div class="pdf-fallback">
                <p>无法加载PDF文档。请<a :href="activePdf" target="_blank">点击这里</a>下载查看。</p>
              </div>
            </object>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      activePdf: null, // 当前激活的PDF链接
      currentTitle: '', // 当前PDF标题
      pdfData: []/* 用户提供的JSON数据 */
    }
  },
  created() {
    this.getNewsInfo()
  },
  methods: {
    togglePdf(url, title) {
      if (this.activePdf === url) {
        // 点击相同标题时关闭PDF
        this.activePdf = null
        this.currentTitle = ''
      } else {
        this.activePdf = url
        this.currentTitle = title
      }
    },

    downloadPdf() {
      if (this.activePdf) {
        const link = document.createElement('a')
        link.href = this.activePdf
        link.download = this.currentTitle || 'document.pdf'
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    },

    getNewsInfo() {
      axios
        .get(`/yyy/v1/yangzi/news?token=${this.globalConfig.token_news}`)
        .then(res => {
          console.log('扬子晚报接口res === ', res)
          if (Array.isArray(res.data.data) && res.data.data.length) {
            this.pdfData = res.data.data
          } else {
            this.pdfData = []
          }
        })
        .catch(err => {
          console.log("err === ", err);
          this.$message({
            message: err.response.data.message || "获取数据失败",
            type: "error"
          });
        });
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

body {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4efe9 100%);
  color: #333;
  line-height: 1.6;
  min-height: 100vh;
}

.pdf-layout-container {
  display: flex;
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
  background: white;
}

/* 左侧面板样式 */
.left-panel {
  width: 220px;
  background: linear-gradient(to bottom, #1e88e5, #1565c0);
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.panel-header {
  padding: 25px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.1);
}

.panel-header h3 {
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: 1px;
}

.title-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
}

.title-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.title-item:hover {
  background: rgba(255, 255, 255, 0.1);
  border-left-color: #ffca28;
}

.title-item.active {
  background: rgba(255, 255, 255, 0.15);
  border-left-color: #ffca28;
  font-weight: 600;
}

.title-text {
  font-size: 0.95rem;
  flex: 1;
}

.icon {
  font-weight: bold;
  color: #ffca28;
}

/* 右侧面板样式 */
.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #e8eaec;
}

.preview-header h3 {
  color: #1e88e5;
  font-size: 1.5rem;
  font-weight: 600;
}

.download-btn {
  background: #43a047;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.download-btn:hover {
  background: #388e3c;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.preview-content {
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #78909c;
  text-align: center;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 20px;
  opacity: 0.7;
}

.empty-state p {
  font-size: 1.2rem;
}

.pdf-viewer {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.pdf-viewer object {
  flex: 1;
  border: none;
}

.pdf-fallback {
  padding: 30px;
  text-align: center;
  color: #78909c;
}

.pdf-fallback a {
  color: #1e88e5;
  text-decoration: none;
  font-weight: 600;
}

.pdf-fallback a:hover {
  text-decoration: underline;
}

/* 过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .pdf-layout-container {
    flex-direction: column;
    max-width: 100%;
  }

  .left-panel {
    width: 100%;
    max-height: 300px;
  }

  .title-list {
    display: flex;
    overflow-x: auto;
    padding: 10px;
  }

  .title-item {
    min-width: 200px;
    border-left: none;
    border-bottom: 4px solid transparent;
    margin-right: 10px;
    border-radius: 5px;
  }

  .title-item.active {
    border-left: none;
    border-bottom-color: #ffca28;
  }
}

@media (max-width: 576px) {
  .preview-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
  }

  .preview-header h3 {
    margin-bottom: 10px;
    font-size: 1.3rem;
  }

  .preview-content {
    padding: 15px;
  }
}
</style>