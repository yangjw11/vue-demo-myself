<template>
  <div class="iss-tracker">
    <div class="header">
      <h1>国际空间站实时位置追踪</h1>
      <div class="controls">
        <div class="button-group">
          <button @click="fetchIssPosition" :disabled="loading" class="btn refresh-btn">
            <span v-if="loading">获取中...</span>
            <span v-else>手动刷新位置</span>
          </button>
          <button @click="toggleAutoRefresh" :class="['btn', autoRefresh ? 'auto-refresh-active' : 'auto-refresh-btn']">
            {{ autoRefresh ? '停止自动刷新' : '自动刷新(60秒)' }}
          </button>
          <button @click="clearHistory" class="btn clear-btn">
            清除历史轨迹
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
          <div class="status-item">
            <span class="label">轨迹线段:</span>
            <span class="value">{{ trajectorySegments }}</span>
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
        <p v-if="historyPositions.length > 0">已记录 {{ historyPositions.length }} 个位置点，轨迹被分割为 {{ trajectorySegments }} 个线段
        </p>
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
        longitude: 0,
        timestamp: null
      },
      lastUpdateTime: '未更新',
      historyPositions: [], // 存储格式: [{ lng, lat, time }, ...]
      maxHistoryPoints: 2000,
      pointsTrajectoryInfo: [],
      testData: [
        [71.3183, -32.6285],
        [71.3967, -32.563],
        [75.0475, -29.333],
        [79.7316, -24.6539],
        [84.7984, -18.9112],
        [89.4928, -13.0096],
        [93.9999, -6.9309],
        [98.2916, -0.9235],
        [102.6231, 5.1681],
        [105.1685, 8.6833],
        [107.3897, 11.6764],
        [109.6849, 14.6737],
        [117.9436, 24.4182],
        [123.584, 30.0108],
        [130.4191, 35.6415],
        [133.0114, 37.4732],
        [136.7257, 39.8333],
        [144.0426, 43.6689],
        [153.4063, 47.2567],
        [164.041, 49.8938],
        [171.2825, 50.9649],
        [177.1485, 51.4504],
        [-176.8998, 51.6121],
        [-170.8988, 51.4431],
        [-164.9898, 50.9454],
        [-154.3799, 49.1653],
        [-148.2387, 47.5499],
        [-142.1324, 45.447],
        [-133.4781, 41.4593],
        [-126.4054, 37.1395],
        [-120.5279, 32.681],
        [-114.5927, 27.269],
        [-108.6646, 20.8934],
        [-105.9471, 17.6535]
      ]
    }
  },
  computed: {
    latitude() {
      return this.issPosition.latitude ? parseFloat(this.issPosition.latitude).toFixed(4) : '0.0000'
    },
    longitude() {
      return this.issPosition.longitude ? parseFloat(this.issPosition.longitude).toFixed(4) : '0.0000'
    },
    trajectorySegments() {
      const result = this.generateTrajectoryData()
      return result.lines.length
    }
  },
  mounted() {
    this.initChart()
    this.fetchIssPosition()
  },
  beforeDestroy() {
    this.clearTimers()
    if (this.chartInstance) {
      this.chartInstance.dispose()
      this.chartInstance = null
    }
  },
  methods: {
    // 格式化时间的辅助方法
    formatTime(timestamp) {
      if (!timestamp) return '未知时间'
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')
      return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`
    },

    loadTestData() {
      // 为测试数据添加时间戳（模拟实时数据）
      const now = Date.now()
      this.historyPositions = this.testData.map((point, index) => ({
        lng: point[0],
        lat: point[1],
        time: new Date(now - (this.testData.length - index - 1) * 60000).getTime() // 每分钟一个点
      }))

      const lastPoint = this.historyPositions[this.historyPositions.length - 1]
      this.issPosition = {
        latitude: lastPoint.lat,
        longitude: lastPoint.lng,
        timestamp: lastPoint.time
      }
      this.lastUpdateTime = this.formatTime(lastPoint.time)
      this.updateChart()
    },

    initChart() {
      echarts.registerMap('world', worldJson)
      this.chartInstance = echarts.init(this.$refs.mapChart)

      const option = {
        backgroundColor: '#0a1a2a',
        title: {
          text: '国际空间站实时位置',
          subtext: 'International Space Station',
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
          formatter: function (params) {
            if (params.seriesType === 'scatter') {
              if (params.seriesName === '国际空间站') {
                const data = params.data
                const lng = data.value ? data.value[0] : (data.value ? data.value[0] : 0)
                const lat = data.value ? data.value[1] : (data.value ? data.value[1] : 0)
                let tooltip = `国际空间站<br/>纬度: ${lat.toFixed(4)}<br/>经度: ${lng.toFixed(4)}`
                if (data.time) {
                  const date = new Date(data.time)
                  const year = date.getFullYear()
                  const month = (date.getMonth() + 1).toString().padStart(2, '0')
                  const day = date.getDate().toString().padStart(2, '0')
                  const hours = date.getHours().toString().padStart(2, '0')
                  const minutes = date.getMinutes().toString().padStart(2, '0')
                  const seconds = date.getSeconds().toString().padStart(2, '0')
                  tooltip += `<br/>时间: ${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`
                }
                return tooltip
              } else if (params.seriesName === '轨迹点') {
                const data = params.data
                const lng = data.value[0]
                const lat = data.value[1]
                let tooltip = `轨迹点<br/>纬度: ${lat.toFixed(4)}<br/>经度: ${lng.toFixed(4)}`

               

                if (data.lineIndex !== undefined && data.pointIndex !== undefined) {
                  tooltip += `<br/>轨迹线段: ${data.lineIndex + 1}<br/>线段中的点: ${data.pointIndex + 1}`
                }
                 if (data.time) {
                  const date = new Date(data.time)
                  const year = date.getFullYear()
                  const month = (date.getMonth() + 1).toString().padStart(2, '0')
                  const day = date.getDate().toString().padStart(2, '0')
                  const hours = date.getHours().toString().padStart(2, '0')
                  const minutes = date.getMinutes().toString().padStart(2, '0')
                  const seconds = date.getSeconds().toString().padStart(2, '0')
                  tooltip += `<br/>时间: ${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`
                }
                return tooltip
              }
            } else if (params.seriesType === 'lines') {
              return '空间站轨迹<br/>鼠标悬停在线段上查看'
            }
            return params.name
          },
          backgroundColor: 'rgba(10, 26, 42, 0.9)',
          borderColor: '#1a3a6a',
          textStyle: {
            color: '#fff'
          }
        },
        geo: {
          map: 'world',
          roam: true,
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
          tooltip: {
            show: true,
            formatter: function (params) {
              return params.name
            }
          }
        }
      }

      this.chartInstance.setOption(option)
      this.mapLoading = false
      window.addEventListener('resize', this.handleResize)
    },

    async fetchIssPosition() {
      this.loading = true
      try {
        const response = await fetch('http://api.open-notify.org/iss-now.json')
        const data = await response.json()

        if (data.message === 'success') {
          const currentTime = Date.now()

          this.issPosition = {
            latitude: data.iss_position.latitude,
            longitude: data.iss_position.longitude,
            timestamp: currentTime
          }

          this.lastUpdateTime = this.formatTime(currentTime)

          // 存储位置点信息，包括时间
          this.historyPositions.push({
            lng: parseFloat(data.iss_position.longitude),
            lat: parseFloat(data.iss_position.latitude),
            time: currentTime
          })

          if (this.historyPositions.length > this.maxHistoryPoints) {
            this.historyPositions.shift()
            this.pointsTrajectoryInfo.shift()
          }

          this.updateChart()
        }
      } catch (error) {
        console.error('获取国际空间站位置失败:', error)
        if (typeof this.$message !== 'undefined') {
          this.$message.error('获取数据失败，请检查网络连接')
        } else {
          alert('获取数据失败，请检查网络连接')
        }
      } finally {
        this.loading = false
      }
    },

    updateChart() {
      if (!this.chartInstance) return

      const trajectoryData = this.generateTrajectoryData()
      const lineColors = [
        '#00ccff', '#00ffcc', '#ffcc00', '#ff6699',
        '#9966ff', '#66ff99', '#ff6666', '#6699ff'
      ]

      const seriesArray = []

      // 添加轨迹点系列（用于展示所有历史点）
      if (this.historyPositions.length > 0) {
        const scatterData = this.historyPositions.map((point, index) => {
          const trajectoryInfo = this.pointsTrajectoryInfo[index] || {}
          return {
            name: '轨迹点',
            value: [point.lng, point.lat],
            time: point.time,
            lineIndex: trajectoryInfo.lineIndex,
            pointIndex: trajectoryInfo.pointIndex,
            originalIndex: index + 1
          }
        })

        seriesArray.push({
          name: '轨迹点',
          type: 'scatter',
          coordinateSystem: 'geo',
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: '#00ffcc',
            borderColor: '#fff',
            borderWidth: 1,
            shadowBlur: 8,
            shadowColor: '#00ffcc'
          },
          zlevel: 5,
          emphasis: {
            itemStyle: {
              color: '#ff0000',
              scale: 1.5,
              shadowBlur: 15,
              shadowColor: '#ff0000'
            }
          },
          data: scatterData,
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              const data = params.data
              const lng = data.value[0]
              const lat = data.value[1]
              let tooltip = `轨迹点${data.originalIndex}<br/>纬度: ${lat.toFixed(4)}<br/>经度: ${lng.toFixed(4)}`
              if (data.lineIndex !== undefined && data.pointIndex !== undefined) {
                tooltip += `<br/>轨迹线段: ${data.lineIndex + 1}<br/>线段中的点: ${data.pointIndex + 1}`
              }
              if (data.time) {
                tooltip += `<br/>时间: ${this.formatTime(data.time)}`
              }
              return tooltip
            }
          }
        })
      }

      // 添加轨迹线系列
      trajectoryData.lines.forEach((lineData, index) => {
        if (lineData.length >= 2) {
          const lineCoords = lineData.map(point => [point[0], point[1]])

          seriesArray.push({
            name: `轨迹${index + 1}`,
            type: 'lines',
            coordinateSystem: 'geo',
            zlevel: 1,
            polyline: true,
            silent: false,
            effect: {
              show: true,
              period: 6,
              trailLength: 0.7,
              color: '#00ffcc',
              symbolSize: 3
            },
            lineStyle: {
              color: lineColors[index % lineColors.length],
              width: 1,
              opacity: 0.6,
              curveness: 0.2
            },
            showSymbol: false,
            data: [{
              coords: lineCoords,
              lineStyle: {
                color: lineColors[index % lineColors.length]
              }
            }],
            tooltip: {
              trigger: 'item',
              formatter: function (params) {
                return `${params.seriesName}<br/>共${params.data.coords.length}个点`
              }
            }
          })
        }
      })

      // 添加空间站当前位置
      if (this.issPosition.latitude && this.issPosition.longitude) {
        seriesArray.push({
          name: '国际空间站',
          type: 'scatter',
          coordinateSystem: 'geo',
          symbol: 'pin',
          symbolSize: 50,
          zlevel: 10,
          itemStyle: {
            color: '#ff9900',
            borderColor: '#fff',
            borderWidth: 2
          },
          emphasis: {
            scale: true,
            scaleSize: 15,
            itemStyle: {
              color: '#ff3300',
              borderColor: '#fff',
              borderWidth: 3,
              shadowBlur: 20,
              shadowColor: '#ff3300'
            }
          },
          label: {
            show: true,
            formatter: 'ISS',
            position: 'right',
            color: '#fff',
            fontSize: 14,
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: [4, 8],
            borderRadius: 4
          },
          data: [{
            name: '国际空间站',
            value: [
              parseFloat(this.issPosition.longitude),
              parseFloat(this.issPosition.latitude)
            ],
            time: this.issPosition.timestamp
          }],
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              const data = params.data
              const lng = data.value[0]
              const lat = data.value[1]
              let tooltip = `国际空间站<br/>纬度: ${lat.toFixed(4)}<br/>经度: ${lng.toFixed(4)}`

              if (data.time) {
                tooltip += `<br/>时间: ${this.formatTime(data.time)}`
              }
              return tooltip
            }
          }
        })
      }

      const option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'click|mousemove',
          alwaysShowContent: false,
          formatter: (params) => {
            if (params.componentType === 'series') {
              if (params.seriesType === 'scatter') {
                if (params.seriesName === '国际空间站') {
                  const data = params.data
                  const lng = data.value[0]
                  const lat = data.value[1]
                  let tooltip = `国际空间站<br/>纬度: ${lat.toFixed(4)}<br/>经度: ${lng.toFixed(4)}`

                  if (data.time) {
                    tooltip += `<br/>时间: ${this.formatTime(data.time)}`
                  }
                  return tooltip
                } else if (params.seriesName === '轨迹点') {
                  const data = params.data
                  const lng = data.value[0]
                  const lat = data.value[1]
                  let tooltip = `轨迹点${data.originalIndex}<br/>纬度: ${lat.toFixed(4)}<br/>经度: ${lng.toFixed(4)}`
                  if (data.lineIndex !== undefined && data.pointIndex !== undefined) {
                    tooltip += `<br/>轨迹线段: ${data.lineIndex + 1}<br/>线段中的点: ${data.pointIndex + 1}`
                  }
                  if (data.time) {
                    tooltip += `<br/>时间: ${this.formatTime(data.time)}`
                  }
                  return tooltip
                }
              } else if (params.seriesType === 'lines') {
                return '空间站轨迹<br/>鼠标悬停在线段上查看'
              }
            }
            return params.name
          },
          backgroundColor: 'rgba(10, 26, 42, 0.9)',
          borderColor: '#1a3a6a',
          textStyle: {
            color: '#fff'
          },
          extraCssText: 'pointer-events: none;'
        },
        geo: {
          map: 'world',
          roam: true,
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
          }
        },
        series: seriesArray
      }

      this.chartInstance.setOption(option, true)
    },

    generateTrajectoryData() {
      if (this.historyPositions.length < 2) {
        this.pointsTrajectoryInfo = []
        return { lines: [], pointsInfo: [] }
      }

      const lines = []
      const pointsInfo = []
      let currentLine = []
      let currentLineIndex = 0
      let pointIndexInLine = 0

      for (let i = 0; i < this.historyPositions.length; i++) {
        const point = this.historyPositions[i]

        if (i === 0) {
          currentLine.push([point.lng, point.lat])
          pointsInfo.push({
            lineIndex: currentLineIndex,
            pointIndex: pointIndexInLine
          })
          pointIndexInLine++
          continue
        }

        const prevPoint = this.historyPositions[i - 1]
        const prevLng = prevPoint.lng
        const currentLng = point.lng
        const lngDiff = Math.abs(currentLng - prevLng)

        if (lngDiff > 180) {
          if (currentLine.length >= 2) {
            lines.push([...currentLine])
          }
          currentLine = [[point.lng, point.lat]]
          currentLineIndex++
          pointIndexInLine = 0
        } else {
          if (currentLine.length === 0) {
            currentLine.push([prevLng, prevPoint.lat])
            pointsInfo[i - 1] = {
              lineIndex: currentLineIndex,
              pointIndex: pointIndexInLine
            }
            pointIndexInLine++
          }
          currentLine.push([point.lng, point.lat])
        }

        pointsInfo[i] = {
          lineIndex: currentLineIndex,
          pointIndex: pointIndexInLine
        }
        pointIndexInLine++
      }

      if (currentLine.length >= 2) {
        lines.push([...currentLine])
      }

      this.pointsTrajectoryInfo = pointsInfo

      return {
        lines: lines,
        pointsInfo: pointsInfo
      }
    },

    toggleAutoRefresh() {
      this.autoRefresh = !this.autoRefresh

      if (this.autoRefresh) {
        this.startAutoRefresh()
      } else {
        this.stopAutoRefresh()
      }
    },

    startAutoRefresh() {
      this.countdown = 60
      this.clearTimers()

      this.countdownTimer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          this.countdown = 60
          this.fetchIssPosition()
        }
      }, 1000)
    },

    stopAutoRefresh() {
      this.clearTimers()
      this.countdown = 60
    },

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

    clearHistory() {
      this.historyPositions = []
      this.pointsTrajectoryInfo = []
      this.updateChart()
      if (typeof this.$message !== 'undefined') {
        this.$message.success('已清除历史轨迹')
      } else {
        alert('已清除历史轨迹')
      }
    },

    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize()
      }
    }
  }
}
</script>

<style scoped>
/* 样式保持不变 */
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

.clear-btn {
  background-color: #ff9800;
  color: white;
}

.auto-refresh-btn:hover,
.auto-refresh-active:hover,
.clear-btn:hover {
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
  min-height: 0;
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

  .button-group {
    flex-wrap: wrap;
  }

  .btn {
    padding: 8px 16px;
    font-size: 14px;
  }
}

.el-loading-spinner {
  margin-top: -20px;
}
</style>