<template>
  <div>
    <div class="container">
      <!-- 导航栏 -->
      <div class="navbar">
        <div class="logo">
          <div class="logo-icon">
            <i class="fas fa-newspaper"></i>
          </div>
          <div class="logo-text">每日热点资讯</div>
        </div>
        <div class="nav-info">
          <div class="info-card">
            <current-date-time></current-date-time>
          </div>
          <div class="info-card">
            <i class="fas fa-map-marker-alt"></i> 新闻聚合平台
          </div>
        </div>
      </div>

      <!-- 标题区域 -->
      <div class="header-section">
        <h1 class="section-title">今日要闻</h1>
        <p class="section-subtitle">为您精选24小时内最重要的新闻资讯</p>
      </div>

      <!-- 顶部新闻特别展示 -->
      <div class="top-news">
        <div class="top-news-card" v-for="news in topNews" :key="news.ranking" @click="openNews(news.url)">
          <div class="top-news-image">
            <img v-if="news.cover" :src="news.cover" :alt="news.title">
            <div v-else class="image-placeholder">
              <i class="fas fa-image"></i>
            </div>
          </div>
          <div class="top-news-content">
            <div class="source-badge">
              <i class="fas fa-check-circle"></i> {{ news.author ? news.author.name : '官方' }}
            </div>
            <h2 class="top-news-title">{{ news.longtitle || news.title }}</h2>
            <p class="news-time">
              <i class="far fa-clock"></i> {{ formatTime(news.time) }}
            </p>
            <p class="news-abstract">{{ news.abstract }}</p>
            <div class="top-news-stats">
              <div class="stat-item">
                <i class="far fa-eye"></i> <span class="read-count">{{ formatNumber(news.readCount) }}阅读</span>
              </div>
              <div class="stat-item">
                <i class="far fa-comment"></i> <span class="comments-count">{{ news.commentsCount }}评论</span>
              </div>
              <div class="stat-item">
                <i class="far fa-thumbs-up"></i> <span class="like-count">{{ news.likeCount }}点赞</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 新闻列表 -->
      <div class="news-container">
        <div class="news-card" v-for="news in sortedNews" :key="news.ranking" @click="openNews(news.url)">
          <div class="card-ranking" :class="{ 'top-1': news.ranking === 1, 'top-3': news.ranking <= 3 }">
            {{ news.ranking }}
          </div>

          <div class="image-container">
            <img v-if="news.cover" :src="news.cover" :alt="news.longtitle || news.title" class="news-image">
            <div v-else class="image-placeholder">
              <i class="fas fa-image"></i>
            </div>
          </div>

          <div class="news-content">
            <div class="news-source">
              <div class="source-badge">
                <i class="fas fa-check-circle"></i> {{ news.author ? news.author.name : '官方' }}
              </div>
            </div>

            <h3 class="news-title">
              {{ news.longtitle || news.title || "无标题新闻" }}
            </h3>

            <div class="news-time">
              <i class="far fa-clock"></i>
              <span>{{ formatTime(news.time) }}</span>
            </div>

            <p class="news-abstract">
              {{ news.abstract || '暂无摘要' }}
            </p>

            <div class="news-stats">
              <div class="stat-item">
                <i class="far fa-eye"></i>
                <span class="read-count">{{ formatNumber(news.readCount) }}</span>
              </div>
              <div class="stat-item">
                <i class="far fa-comment"></i>
                <span class="comments-count">{{ news.commentsCount }}</span>
              </div>
              <div class="stat-item">
                <i class="far fa-thumbs-up"></i>
                <span class="like-count">{{ news.likeCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 页脚 -->
      <div class="footer">
        <div class="footer-logo">
          <i class="fas fa-newspaper"></i> 每日热点资讯
        </div>
        <p>为您精选全天最重要新闻 · 点击新闻卡片可查看详情</p>

        <div class="footer-info">
          <div class="info-item">
            <i class="fas fa-database"></i>
            <span>共展示 {{ newsData.length }} 条新闻</span>
          </div>
          <div class="info-item">
            <i class="fas fa-sync-alt"></i>
            <span>最后更新: {{ formatTime(currentTime, 'full') }}</span>
          </div>
          <div class="info-item">
            <i class="fas fa-code"></i>
            <span>基于Vue2构建</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { formatDate } from "@/utils/index.js";
import CurrentDateTime from './components/CurrentDateTime.vue';
export default {
  components: {
    CurrentDateTime
  },
  data() {
    return {
      newsData: [],
      currentTime: ''
    };
  },
  computed: {
    // 排序后的新闻，按排名排序
    sortedNews() {
      return [...this.newsData].sort((a, b) => a.ranking - b.ranking);
    },
    // 获取前三名作为特别展示的新闻
    topNews() {
      return this.newsData.filter(news => news.ranking <= 3)
        .sort((a, b) => a.ranking - b.ranking);
    }
  },
  mounted() {
    this.getNewsInfo();
    this.currentTime = formatDate();
  },
  methods: {
    // 打开新闻链接
    openNews(url) {
      if (url) {
        window.open(url, '_blank');
      } else {
        alert('该新闻无链接信息');
      }
    },
    // 格式化时间显示
    formatTime(dateString, type = 'short') {
      if (!dateString) return '未知时间';

      const date = new Date(dateString);
      if (type === 'full') {
        return date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(/\//g, '-');
      }

      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      return `${month}月${day}日 ${hours}:${minutes}`;
    },
    // 格式化大数字显示
    formatNumber(num) {
      if (!num) return 0;
      if (num < 1000) return num;
      if (num < 10000) return (num / 1000).toFixed(1) + '千';
      return (num / 10000).toFixed(1) + '万';
    },
    getNewsInfo() {
      axios
        .get(`/yyy/v1/tencent/news/top?token=${this.globalConfig.token_news}`)
        .then(res => {
          console.log('腾讯新闻接口res === ', res)
          if (Array.isArray(res.data.data) && res.data.data.length) {
            this.newsData = res.data.data
          } else {
            this.newsData = []
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
  }

}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 导航栏样式 */
.navbar {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 18px 25px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-icon {
  font-size: 2.2rem;
  color: #2a5298;
  background: linear-gradient(to right, #3494E6, #2a5298);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-text {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(to right, #1a2a6c, #3a7bd5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-info {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 0.9rem;
  color: #555;
}

.info-card {
  padding: 8px 15px;
  background: rgba(245, 247, 250, 0.9);
  border-radius: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.info-card i {
  margin-right: 5px;
  color: #2a5298;
}

/* 标题区域 */
.header-section {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #1a2a6c;
  position: relative;
  display: inline-block;
}

.section-title:after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(to right, #3494E6, #2a5298);
  border-radius: 2px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #555;
  max-width: 700px;
  margin: 0 auto;
}

/* 新闻列表样式 */
.news-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 50px;
}

.news-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  cursor: pointer;
  transform: translateY(0);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.news-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
}

.news-card:hover .card-ranking {
  transform: scale(1.15);
}

.news-card:hover .news-image {
  transform: scale(1.03);
}

.card-ranking {
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(135deg, #ff5858, #f09819);
  color: white;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom-right-radius: 12px;
  font-weight: 700;
  font-size: 18px;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.top-3 {
  background: linear-gradient(135deg, #3494E6, #2a5298);
}

.top-1 {
  background: linear-gradient(135deg, #FF416C, #FF4B2B);
}

.image-container {
  height: 200px;
  overflow: hidden;
}

.news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
}

.image-placeholder {
  height: 200px;
  background: linear-gradient(110deg, #f5f7fa 25%, #e4ebf5 50%, #f5f7fa 65%);
  background-size: 400% 400%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0aec0;
  font-size: 2rem;
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.news-content {
  padding: 22px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.news-source {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.source-badge {
  padding: 5px 12px;
  background: rgba(42, 82, 152, 0.1);
  color: #2a5298;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.source-badge i {
  font-size: 0.8rem;
}

.news-title {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 15px;
  line-height: 1.4;
  color: #1a2a6c;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-time {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  color: #718096;
  margin-bottom: 18px;
  gap: 8px;
}

.news-time i {
  font-size: 1.1rem;
  color: #2a5298;
}

.news-abstract {
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex-grow: 1;
}

.news-stats {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #edf2f7;
  padding-top: 15px;
  margin-top: auto;
}

.stat-item {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #718096;
  gap: 6px;
}

.stat-item i {
  font-size: 1rem;
  color: #2a5298;
}

.read-count {
  color: #3182ce;
  font-weight: 600;
}

.comments-count {
  color: #38a169;
  font-weight: 600;
}

.like-count {
  color: #e53e3e;
  font-weight: 600;
}

/* 页脚样式 */
.footer {
  background: rgba(255, 255, 255, 0.9);
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  color: #555;
  font-size: 0.9rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.footer-logo {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #2a5298;
}

.footer-info {
  display: flex;
  justify-content: center;
  gap: 25px;
  margin-top: 15px;
  font-size: 0.85rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .news-container {
    grid-template-columns: 1fr;
  }

  .navbar {
    flex-direction: column;
    gap: 15px;
  }

  .section-title {
    font-size: 2rem;
  }

  .header-section {
    padding: 15px;
  }
}

/* 顶部新闻特别样式 */
.top-news {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.top-news-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
}

.top-news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.top-news-image {
  height: 220px;
  overflow: hidden;
}

.top-news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.top-news-card:hover .top-news-image img {
  transform: scale(1.03);
}

.top-news-content {
  padding: 25px;
}

.top-news-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 15px;
  color: #1a2a6c;
  line-height: 1.4;
}

.top-news-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #edf2f7;
}

@media (max-width: 992px) {
  .top-news {
    grid-template-columns: 1fr;
  }
}
</style>