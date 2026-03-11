<template>
  <div class="news-dashboard">
    <div class="news-header">
      <div class="title-main">每日新闻</div>
      <div class="title-sub">整点每隔10分钟自动刷新一次，即每小时刷新6次</div>
    </div>

    <div class="news-container">
      <div class="news-card" v-for="(item, index) in news" :key="index" @click="openUrl(item.url)">
        <div class="card-top">
          <div class="news-title">
            <span class="title-tag" v-if="index % 4 === 0">紧急</span>
            <span class="title-tag blue-tag" v-else-if="index % 3 === 0">政策</span>
            <span class="title-tag green-tag" v-else-if="index % 5 === 0">科技</span>
            {{ item.title }}
          </div>
          <div class="news-date-time">
            <div class="publish-date">{{ formatDate(item.publishDate) }}</div>
            <div class="publish-time">{{ formatTime(item.publishDate) }}</div>
          </div>
        </div>

        <div class="news-summary">{{ item.summary }}</div>

        <div class="card-footer">
          <div class="source-info">
            <span class="source-icon">🏢</span>
            <span class="news-siteName">{{ item.siteName || '--' }}</span>
          </div>
          <div class="author-info">
            <span class="author-icon">👤</span>
            <span class="news-authorName">{{ item.authorName || '--' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      news: [],
      timer: null,         // 定时器对象
      nextRequestTime: ''  // 下一次请求时间的显示字符串
    };
  },
  created() {
    this.getNews();
  },
  mounted() {
    this.startScheduledRequests();
  },
  beforeDestroy() {
    // 组件销毁时清除定时器
    clearInterval(this.timer);
  },
  methods: {
    getNews() {
      axios
        .get("/www?pageSize=20")
        .then((res) => {
          console.log('res === ', res)
          this.news = res.data.data;
          console.log(this.news);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    formatDate(dateStr) {
      if (!dateStr) return '--';
      const date = new Date(dateStr);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    },
    formatTime(dateStr) {
      if (!dateStr) return '--';
      const date = new Date(dateStr);
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    openUrl(url) {
      window.open(url, '_blank')
    },
    startScheduledRequests() {
      // 1. 计算距离下一个整10分钟的时间差
      const now = new Date();
      const minutes = now.getMinutes();

      // 计算下一个整点（0,10,20,30,40,50分）
      // 如果当前分钟是0、10、20等，则使用当前时间（不需要加间隔）
      // 如果不是，则计算到下一个整10分钟的分钟数
      const nextMinutes = (Math.floor(minutes / 10) * 10) + 10;
      const nextTime = new Date(now);

      if (minutes % 10 === 0) {
        // 当前就是整10分钟，立即执行一次
        this.fetchData();
        nextTime.setMinutes(nextTime.getMinutes() + 10); // 下一个10分钟
      } else {
        nextTime.setMinutes(nextMinutes);
        nextTime.setSeconds(0);
        nextTime.setMilliseconds(0);
      }

      // 计算首次延迟时间（毫秒）
      const delay = nextTime - now;

      // 更新下一次请求时间的显示
      this.nextRequestTime = nextTime.toLocaleTimeString();

      // 2. 设置定时器（首次延迟执行，之后每隔10分钟执行一次）
      this.timer = setTimeout(() => {
        this.fetchData();  // 首次执行

        // 设置后续定时器（每10分钟执行一次）
        this.timer = setInterval(() => {
          this.fetchData();
          // 更新下一次请求时间显示
          this.updateNextRequestTime();
        }, 10 * 60 * 1000); // 10分钟间隔

      }, delay);
    },

    fetchData() {
      // 这里是实际的请求逻辑，示例中使用伪代码
      console.log('发送请求，当前时间:', new Date().toLocaleTimeString());
      this.getNews();
      // 实际发送请求示例：
      // axios.get('/api/data')
      //   .then(response => { /* 处理响应 */ })
      //   .catch(error => { /* 处理错误 */ });
    },

    updateNextRequestTime() {
      // 更新下一次请求时间显示
      const nextTime = new Date();
      nextTime.setMinutes(nextTime.getMinutes() + 10);
      this.nextRequestTime = nextTime.toLocaleTimeString();
    }
  }
};
</script>

<style scoped lang="scss">
.news-dashboard {
  max-width: 1280px;
  margin: 40px auto;
  padding: 0 30px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.news-header {
  margin-bottom: 40px;
  border-bottom: 2px solid #eaeff5;
  padding-bottom: 20px;

  .title-main {
    font-size: 42px;
    font-weight: 800;
    color: #1c3f6e;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
    position: relative;
    display: inline-block;

    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 80px;
      height: 5px;
      background: linear-gradient(90deg, #1a73e8, #34a853);
      border-radius: 3px;
    }
  }

  .title-sub {
    font-size: 18px;
    color: #5f6368;
    font-weight: 500;
    padding-left: 5px;
    margin-top: 30px;
    position: relative;

    &::before {
      content: '🕒';
      margin-right: 8px;
      font-size: 18px;
      vertical-align: middle;
    }
  }
}

.news-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(540px, 1fr));
  gap: 30px;
}

.news-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(28, 63, 110, 0.09);
  transition: all 0.3s ease;
  border-left: 5px solid #1a73e8;
  padding: 25px;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-7px);
    box-shadow: 0 12px 28px rgba(28, 63, 110, 0.18);
    border-left-color: #fbbc05;
  }
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 18px;
  border-bottom: 1px dashed #e8edf3;
  padding-bottom: 15px;
}

.news-title {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.45;
  color: #1c3f6e;
  flex: 1;

  .title-tag {
    display: inline-block;
    font-size: 13px;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 4px;
    background: #ea4335;
    color: white;
    margin-right: 12px;
    vertical-align: middle;
    transform: translateY(-2px);

    &.blue-tag {
      background: #1a73e8;
    }

    &.green-tag {
      background: #34a853;
    }
  }
}

.news-date-time {
  text-align: right;
  min-width: 120px;

  .publish-date {
    font-size: 16px;
    font-weight: 600;
    color: #1a73e8;
    margin-bottom: 4px;
  }

  .publish-time {
    font-size: 14px;
    color: #70757a;
    font-family: monospace;
  }
}

.news-summary {
  font-size: 17px;
  line-height: 1.75;
  color: #4d5156;
  margin-bottom: 25px;
  flex-grow: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 15px;
  border-top: 1px dashed #e8edf3;
  color: #5f6368;
  font-size: 15px;
}

.source-info,
.author-info {
  display: flex;
  align-items: center;

  .source-icon,
  .author-icon {
    font-size: 18px;
    margin-right: 8px;
    opacity: 0.7;
  }

  .news-siteName,
  .news-authorName {
    font-weight: 600;
    color: #1c3f6e;
  }
}
</style>