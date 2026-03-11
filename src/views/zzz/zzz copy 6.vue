<template>
  <div class="iss-tracker">
    <div class="header">
      <h1>国际空间站（International Space Station）实时位置追踪</h1>
      <div class="controls">
        <div class="button-group">
          <button @click="fetchIssPosition" :disabled="loading" class="btn refresh-btn">
            <span v-if="loading">获取中...</span>
            <span v-else>手动刷新位置</span>
          </button>
          <button 
            @click="toggleAutoRefresh" 
            :class="['btn', autoRefresh ? 'auto-refresh-active' : 'auto-refresh-btn']"
          >
            {{ autoRefresh ? `停止自动刷新` : `自动刷新(${countdown}秒)` }}
          </button>
        </div>
        
        <div class="status-info">
          <div class="status-item">
            <span class="label">最后更新时间:</span>
            <span class="value">{{ lastUpdateTime }}</span>
          </div>
          <div class="status-item">
            <span class="label">经纬度:</span>
            <span class="value">{{ latitude }}, {{ longitude }}</span>
          </div>
          <div class="status-item" v-if="autoRefresh">
            <span class="label">自动刷新状态:</span>
            <span class="value auto-refresh-status">运行中 ({{ countdown }}秒后刷新)</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="map-container">
      <div class="echarts-map" ref="mapChart" v-loading="loading || mapLoading"></div>
    </div>
    
    <div class="footer">
      <div class="info">
        <p>数据来源: <a href="http://api.open-notify.org/iss-now.json" target="_blank">Open Notify API</a></p>
        <p>国际空间站大约每90分钟绕地球一圈，时速约27,600公里</p>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import worldJson from '@/assets/world.json'

export default {
  name: 'IssTracker',
  data() {
    return {
      loading: false,
      mapLoading: true,
      autoRefresh: false,
      timer: null,
      countdown: 60,
      countdownTimer: null,
      chartInstance: null,
      issPosition: {
        latitude: 0,
        longitude: 0
      },
      lastUpdateTime: '未更新',
      historyPositions: [] // 存储历史位置用于显示轨迹
    }
  },
  computed: {
    latitude() {
      return this.issPosition.latitude ? parseFloat(this.issPosition.latitude).toFixed(4) : '0.0000'
    },
    longitude() {
      return this.issPosition.longitude ? parseFloat(this.issPosition.longitude).toFixed(4) : '0.0000'
    }
  },
  mounted() {
    this.initChart()
    // 初始加载数据
    this.fetchIssPosition()
  },
  beforeDestroy() {
    // 清除定时器
    this.clearTimers()
  },
  methods: {
    // 初始化ECharts地图
    initChart() {
      // 注册世界地图
      echarts.registerMap('world', worldJson)
      
      // 初始化图表
      this.chartInstance = echarts.init(this.$refs.mapChart)
      
      // 初始配置
      const option = {
        backgroundColor: '#0a1a2a',
        title: {
          text: '',
          subtext: '',
          left: 'center',
          top: 10,
          textStyle: {
            color: '#fff',
            fontSize: 22
          },
          subtextStyle: {
            color: '#aaa',
            fontSize: 16
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            if (params.componentType === 'series' && params.seriesType === 'scatter') {
              return `国际空间站<br/>纬度: ${params.data[1]}<br/>经度: ${params.data[0]}`
            }
            return params.name
          }
        },
        geo: {
          map: 'world',
          roam: true, // 允许缩放和平移
          zoom: 1.2,
          center: [0, 20],
          itemStyle: {
            areaColor: '#14264c',
            borderColor: '#1a3a6a',
            borderWidth: 1
          },
          emphasis: {
            itemStyle: {
              areaColor: '#2a4a7a'
            }
          },
          silent: true // 地图本身不响应鼠标事件
        },
        series: [
          // 地图背景系列
          {
            type: 'map',
            map: 'world',
            geoIndex: 0,
            aspectScale: 0.75,
            zoom: 1.2,
            center: [0, 20]
          },
          // 空间站位置系列
          {
            name: '国际空间站',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'pin',
            symbolSize: 50,
            label: {
              show: true,
              formatter: '{b}',
              position: 'right',
              color: '#fff',
              fontSize: 14,
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: [4, 8],
              borderRadius: 4
            },
            itemStyle: {
              color: '#ff9900'
            },
            emphasis: {
              label: {
                show: true
              },
              itemStyle: {
                color: '#ffcc00',
                shadowColor: '#ffcc00',
                shadowBlur: 20
              }
            },
            data: []
          },
          // 轨迹线系列
          {
            name: '轨迹',
            type: 'lines',
            coordinateSystem: 'geo',
            zlevel: 1,
            effect: {
              show: true,
              period: 6,
              trailLength: 0.7,
              color: '#00ffcc',
              symbolSize: 3
            },
            lineStyle: {
              color: '#00ccff',
              width: 1,
              opacity: 0.6,
              curveness: 0.2
            },
            data: []
          }
        ]
      }
      
      this.chartInstance.setOption(option)
      this.mapLoading = false
      
      // 响应窗口大小变化
      window.addEventListener('resize', this.handleResize)
    },
    
    // 获取国际空间站位置
    async fetchIssPosition() {
      this.loading = true
      try {
        const response = await fetch('http://api.open-notify.org/iss-now.json')
        const data = await response.json()
        
        if (data.message === 'success') {
          this.issPosition = {
            latitude: data.iss_position.latitude,
            longitude: data.iss_position.longitude
          }
          
          // 更新时间显示
          const now = new Date()
          this.lastUpdateTime = now.toLocaleTimeString()
          
          // 添加历史位置（最多保存100个点）
          this.historyPositions.push([
            parseFloat(data.iss_position.longitude),
            parseFloat(data.iss_position.latitude)
          ])
          
          if (this.historyPositions.length > 100) {
            this.historyPositions.shift()
          }
          
          // 更新图表
          this.updateChart()
        }
      } catch (error) {
        console.error('获取国际空间站位置失败:', error)
        this.$message.error('获取数据失败，请检查网络连接')
      } finally {
        this.loading = false
      }
    },
    
    // 更新图表数据
    updateChart() {
      if (!this.chartInstance) return
      
      const option = {
        series: [
          {}, // 第一个series是地图，保持不变
          // 更新空间站位置
          {
            data: [[
              parseFloat(this.issPosition.longitude),
              parseFloat(this.issPosition.latitude),
              'ISS'
            ]]
          },
          // 更新轨迹线
          {
            data: this.generateTrajectoryData()
          }
        ]
      }
      
      this.chartInstance.setOption(option)
    },
    
    // 生成轨迹线数据
    generateTrajectoryData() {
      if (this.historyPositions.length < 2) return []
      
      const lines = []
      for (let i = 0; i < this.historyPositions.length - 1; i++) {
        lines.push({
          coords: [
            this.historyPositions[i],
            this.historyPositions[i + 1]
          ]
        })
      }
      
      return lines
    },
    
    // 切换自动刷新
    toggleAutoRefresh() {
      this.autoRefresh = !this.autoRefresh
      
      if (this.autoRefresh) {
        this.startAutoRefresh()
      } else {
        this.stopAutoRefresh()
      }
    },
    
    // 开始自动刷新
    startAutoRefresh() {
      this.countdown = 60
      // 清除之前的定时器
      this.clearTimers()
      
      // 启动倒计时定时器
      this.countdownTimer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          this.countdown = 60
          this.fetchIssPosition()
        }
      }, 1000)
    },
    
    // 停止自动刷新
    stopAutoRefresh() {
      this.clearTimers()
      this.countdown = 30
    },
    
    // 清除所有定时器
    clearTimers() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
        this.countdownTimer = null
      }
    },
    
    // 处理窗口大小变化
    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize()
      }
    }
  }
}
</script>

<style scoped>
.iss-tracker {
  font-family: 'Arial', 'Helvetica', sans-serif;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #0a1a2a;
  color: #fff;
}

.header {
  padding: 20px;
  background-color: rgba(10, 26, 42, 0.9);
  border-bottom: 1px solid #1a3a6a;
  flex-shrink: 0;
}

.header h1 {
  margin: 0 0 20px 0;
  text-align: center;
  color: #4fc3f7;
  font-size: 28px;
  text-shadow: 0 0 10px rgba(79, 195, 247, 0.5);
}

.controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.button-group {
  display: flex;
  gap: 15px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-btn {
  background-color: #1976d2;
  color: white;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #0d47a1;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.refresh-btn:disabled {
  background-color: #546e7a;
  cursor: not-allowed;
  opacity: 0.7;
}

.auto-refresh-btn {
  background-color: #388e3c;
  color: white;
}

.auto-refresh-active {
  background-color: #d32f2f;
  color: white;
}

.auto-refresh-btn:hover,
.auto-refresh-active:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.status-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  background-color: rgba(26, 58, 106, 0.5);
  padding: 15px;
  border-radius: 8px;
  min-width: 300px;
}

.status-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 14px;
  color: #aaa;
  margin-bottom: 4px;
}

.value {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.auto-refresh-status {
  color: #4caf50;
}

.map-container {
  flex: 1;
  padding: 20px;
  min-height: 0; /* 防止flex item溢出 */
}

.echarts-map {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
}

.footer {
  padding: 15px 20px;
  background-color: rgba(10, 26, 42, 0.9);
  border-top: 1px solid #1a3a6a;
  flex-shrink: 0;
}

.info {
  text-align: center;
  font-size: 14px;
  color: #aaa;
}

.info a {
  color: #4fc3f7;
  text-decoration: none;
}

.info a:hover {
  text-decoration: underline;
}

.info p {
  margin: 5px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .status-info {
    width: 100%;
  }
  
  .header h1 {
    font-size: 22px;
  }
  
  .btn {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>