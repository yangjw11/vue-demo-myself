<template>
  <div>
    <div class="container" v-if="newsData.length">
      <div class="time-display">
        <i class="fas fa-clock"></i> 当前时间：{{ currentTime }}
      </div>

      <header>
        <h1><i class="fas fa-newspaper"></i> CCTV法治新闻</h1>
        <p>最新新闻资讯一览，点击卡片查看详情内容</p>
      </header>

      <div class="stats-bar">
        <div class="stat-item">
          <div class="number">{{ newsData.length }}</div>
          <div>新闻总数</div>
        </div>
        <div class="stat-item">
          <div class="number">{{ recentNewsCount }}</div>
          <div>今日更新</div>
        </div>
        <div class="stat-item">
          <div class="number">{{ keywordCount }}</div>
          <div>关键词总数</div>
        </div>
        <div class="stat-item">
          <div class="number">
            <current-date-time></current-date-time>
          </div>
          <div>最新数据</div>
        </div>
      </div>

      <div class="sort-container">
        <div class="sort-options">
          <select v-model="sortBy">
            <option value="newest">最新优先</option>
            <option value="oldest">最旧优先</option>
          </select>
        </div>
      </div>

      <div class="news-grid">
        <div v-for="(item, index) in filteredNews" :key="index" class="news-card" @click="openLink(item.url)">
          <div class="card-image">
            <div v-if="!item.poster" class="no-image">
              <div>
                <i class="fas fa-image"></i>
                <div>暂无新闻图片</div>
              </div>
            </div>
            <img v-else :src="item.poster" :alt="item.title">
            <div class="card-date">{{ formatDate(item.time) }}</div>
          </div>

          <div class="card-content">
            <h3>{{ item.title }}</h3>
            <p class="card-description">{{ item.description }}</p>

            <div class="card-keywords">
              <span v-for="(keyword, idx) in item.keywords.split(' ')" :key="idx" class="keyword">
                {{ keyword }}
              </span>
            </div>
          </div>

          <div class="card-footer">
            <div class="source">
              <i class="fas fa-external-link-alt"></i> {{ getSourceDomain(item.url) }}
            </div>
            <a href="#" class="read-more" @click.prevent="openLink(item.url)">
              阅读全文 <i class="fas fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>

      <footer>
        <p>数据更新时间: {{ currentTime }} | 共展示 {{ newsData.length }} 条新闻 | 系统版本 2.5.1</p>
      </footer>
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
      newsData: [],
      sortBy: 'newest',
      currentTime: ''
    };
  },
  computed: {
    filteredNews() {
      // 创建副本以避免修改原始数据
      let sorted = [...this.newsData];

      // 排序逻辑
      if (this.sortBy === 'newest') {
        sorted.sort((a, b) => new Date(b.time) - new Date(a.time));
      } else {
        sorted.sort((a, b) => new Date(a.time) - new Date(b.time));
      }

      return sorted;
    },
    recentNewsCount() {
      const now = new Date();
      const oneDayAgo = new Date(now);
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      return this.newsData.filter(item =>
        new Date(item.time) > oneDayAgo
      ).length;
    },
    keywordCount() {
      const allKeywords = new Set();
      this.newsData.forEach(item => {
        item.keywords.split(' ').forEach(keyword => {
          if (keyword.trim()) allKeywords.add(keyword.trim());
        });
      });
      return allKeywords.size;
    }
  },
  mounted() {
    this.getNewsInfo()
    this.updateCurrentTime();
    setInterval(this.updateCurrentTime, 60000); // 每分钟更新时间
  },
  methods: {
    openLink(url) {
      window.open(url, '_blank');
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const now = new Date();

      // 计算时间差（分钟）
      const diffMinutes = Math.floor((now - date) / (1000 * 60));

      // 如果是今天内的新闻，显示"X小时/分钟前"
      if (date.toDateString() === now.toDateString()) {
        if (diffMinutes < 60) {
          return `${diffMinutes}分钟前`;
        } else {
          const hours = Math.floor(diffMinutes / 60);
          return `${hours}小时前`;
        }
      }

      // 否则显示日期时间
      return date.toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '-');
    },
    getSourceDomain(url) {
      try {
        const domain = new URL(url).hostname;
        return domain.replace('www.', '').replace('.com', '');
      } catch (e) {
        return 'news.cctv.com';
      }
    },
    updateCurrentTime() {
      const now = new Date();
      this.currentTime = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    },
    getNewsInfo() {
      axios
        .get(`/yyy/v1/cctv/news/law?token=${this.globalConfig.token_news}`)
        .then(res => {
          console.log('cctv法治新闻res === ', res)
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
}

header {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px 0;
  background: rgba(255, 255, 255, 0.9);
  color: #1a3658;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #207cca, #1e5799, #207cca);
  animation: gradientFlow 10s infinite linear;
}

@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }

  100% {
    background-position: 200% 50%;
  }
}

header h1 {
  font-size: 2.8rem;
  margin-bottom: 10px;
  position: relative;
  display: inline-block;
}

header h1 i {
  margin-right: 15px;
  color: #207cca;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

header p {
  font-size: 1.2rem;
  color: #555;
  max-width: 600px;
  margin: 0 auto;
}

.stats-bar {
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  font-size: 1rem;
  color: #555;
  position: relative;
  overflow: hidden;
}

.stat-item {
  text-align: center;
  z-index: 1;
  position: relative;
  padding: 0 15px;
}

.stat-item::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: 40px;
  background: rgba(0, 0, 0, 0.1);
}

.stat-item:last-child::after {
  display: none;
}

.stat-item .number {
  font-size: 2rem;
  font-weight: bold;
  color: #207cca;
  margin-bottom: 5px;
  text-shadow: 0 2px 4px rgba(32, 124, 202, 0.3);
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-top: 20px;
}

.news-card {
  background: rgba(255, 255, 255, 0.97);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.news-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #207cca, #1e5799);
  opacity: 0;
  transition: opacity 0.3s;
}

.news-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
}

.news-card:hover::before {
  opacity: 1;
}

.card-image {
  height: 210px;
  overflow: hidden;
  position: relative;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.news-card:hover .card-image img {
  transform: scale(1.08);
}

.card-date {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(32, 124, 202, 0.85);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

.card-content {
  padding: 25px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-content h3 {
  font-size: 1.35rem;
  margin-bottom: 15px;
  color: #1a3658;
  transition: color 0.3s;
  line-height: 1.4;
}

.news-card:hover .card-content h3 {
  color: #207cca;
}

.card-description {
  color: #555;
  margin-bottom: 20px;
  flex-grow: 1;
  font-size: 0.98rem;
  line-height: 1.6;
}

.card-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.keyword {
  background: linear-gradient(to right, #e6f2ff, #c2e4ff);
  color: #207cca;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
}

.card-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding: 18px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(246, 249, 255, 0.7);
}

.read-more {
  background: linear-gradient(to right, #207cca, #1e5799);
  color: white;
  padding: 9px 22px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(32, 124, 202, 0.3);
}

.read-more:hover {
  transform: translateX(8px);
  box-shadow: 0 6px 20px rgba(32, 124, 202, 0.4);
}

.source {
  color: #777;
  font-size: 0.9rem;
  font-weight: 500;
}

.no-image {
  background: linear-gradient(135deg, #a1c4fd, #c2e9fb);
  height: 210px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
}

.no-image i {
  font-size: 2.5rem;
  margin-bottom: 15px;
  opacity: 0.8;
}

footer {
  text-align: center;
  margin-top: 60px;
  padding: 25px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sort-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 25px;
}

.sort-options select {
  padding: 12px 25px;
  border: none;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.95);
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s;
  outline: none;
  appearance: none;
  position: relative;
  color: #207cca;
  font-weight: 600;
  padding-right: 50px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23207cca' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 20px center;
}

.sort-options select:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-3px);
}

.time-display {
  text-align: center;
  margin-bottom: 20px;
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
  }

  header h1 {
    font-size: 2.2rem;
  }

  .stats-bar {
    flex-direction: column;
    gap: 20px;
  }

  .stat-item::after {
    display: none;
  }

  .sort-container {
    justify-content: center;
  }
}
</style>