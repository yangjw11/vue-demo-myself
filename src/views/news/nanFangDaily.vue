<template>
  <div>
    <div class="newspaper-viewer">
      <div class="header">
        <div class="title">
          <i class="material-icons">newspaper</i>
          南方日报电子版
        </div>
        <div class="date">{{ dateStr }}</div>
      </div>

      <div class="container">
        <div class="sidebar">
          <div v-for="(issue, index) in issues" :key="index" class="issue-item"
            :class="{ active: activeIssueIndex === index }" @click="activeIssueIndex = index">
            <span class="issue-badge">{{ issue.title.substring(0, 3) }}</span>
            <span>{{ issue.title }}</span>
          </div>
        </div>

        <div class="content-area">
          <div class="issue-title">
            <i class="material-icons">bookmark_border</i>
            {{ activeIssue.title }}
          </div>

          <div v-if="activeIssue.list && activeIssue.list.length" class="content-container">
            <div class="preview-container">
              <img :src="activeIssue.image_url" :alt="activeIssue.title" class="preview-image"
                @click="openPdf(activeIssue.pdf_url)">
              <div class="preview-actions">
                <button class="preview-btn" @click="openPdf(activeIssue.pdf_url)">
                  <i class="material-icons">picture_as_pdf</i> 查看PDF版
                </button>
              </div>
            </div>

            <div class="article-list">
              <div v-for="(article, idx) in activeIssue.list" :key="idx" class="article-item">
                <a :href="article.url" target="_blank" class="article-link">
                  <div class="article-title">{{ article.title }}</div>
                </a>
              </div>
            </div>
          </div>

          <div v-else class="empty-state">
            <i class="material-icons">article</i>
            <div>此版面暂时没有文章内容</div>
          </div>
        </div>
      </div>

      <div class="footer">
        {{ issues.providerName }}
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { formatDate } from "@/utils/index.js";

export default {
  data() {
    return {
      activeIssueIndex: 0,
      issues: [],
      dateStr:""
    };
  },
  computed: {
    activeIssue() {
      return this.issues[this.activeIssueIndex] || {};
    }
  },
  mounted() {
    // 在实际项目中，这里应该通过API获取数据
    // 现在直接使用提供的JSON数据
    this.getNewsInfo();
    this.dateStr = formatDate();
  },
  methods: {
    getNewsInfo() {
      axios
        .get(`/yyy/v1/nanfang/news?token=${this.globalConfig.token_news}`)
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
    openPdf(url) {
      window.open(url, '_blank');
    }
  }

}
</script>

<style scoped>
.newspaper-viewer {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: 85vh;
}

.header {
  background: #d12626;
  color: white;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
}

.title i {
  margin-right: 12px;
  font-size: 2rem;
}

.date {
  opacity: 0.9;
  font-size: 1.1rem;
}

.container {
  display: flex;
  min-height: 75vh;
}

.sidebar {
  width: 260px;
  background: #f0f3f8;
  border-right: 1px solid #e0e6ed;
  overflow-y: auto;
  padding: 15px 0;
  scrollbar-width: thin;
}

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.issue-item {
  padding: 15px 20px;
  cursor: pointer;
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.issue-item:hover {
  background: #e5eaf3;
}

.issue-item.active {
  background: #d5e3ff;
  border-left-color: #2d65f7;
  font-weight: 500;
}

.issue-badge {
  display: inline-block;
  width: 28px;
  height: 28px;
  background: #d12626;
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 28px;
  margin-right: 12px;
  font-size: 0.9rem;
}

.content-area {
  flex: 1;
  padding: 25px;
  display: flex;
  flex-direction: column;
}

.issue-title {
  font-size: 1.6rem;
  color: #d12626;
  padding-bottom: 15px;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.issue-title i {
  margin-right: 10px;
  color: #2d65f7;
}

.content-container {
  display: flex;
  gap: 30px;
  flex: 1;
  overflow: hidden;
}

.preview-container {
  flex: 0 0 45%;
  min-width: 0;
}

.preview-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e6e9ef;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.preview-image:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.preview-actions {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

.preview-btn {
  padding: 8px 20px;
  background: #2d65f7;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.preview-btn:hover {
  background: #1c52e0;
  box-shadow: 0 2px 8px rgba(45, 101, 247, 0.3);
}

.preview-btn i {
  margin-right: 8px;
}

.article-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}

.article-item {
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  border-left: 3px solid #d12626;
  background: #fdfdfd;
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
}

.article-item:hover {
  background: white;
  transform: translateX(3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  border-left-color: #2d65f7;
}

.article-title {
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.5;
}

.article-item:hover .article-title {
  color: #2d65f7;
}

.article-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.footer {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 0.9rem;
  background: #f9f9f9;
  border-top: 1px solid #eee;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #777;
  font-size: 1.2rem;
  flex-direction: column;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 20px;
  color: #ccc;
}

@media (max-width: 900px) {
  .container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid #e0e6ed;
  }

  .content-container {
    flex-direction: column;
  }

  .preview-container {
    margin-bottom: 30px;
  }
}
</style>