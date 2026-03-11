<template>
  <div class="call-time-config-container">
    <div class="config-panel">
      <div class="panel-header">
        <h3>任务设置</h3>
        <div class="task-id">ID: 45678900-8</div>
      </div>

      <div class="panel-body">
        <div class="section">
          <div class="section-title">基本信息</div>
          <div class="form-group">
            <label>呼叫时间</label>
            <div class="forbidden-time-hint">
              <span class="hint-icon">⏰</span>
              <span class="hint-text">禁止时段：21:00-08:00</span>
              <span class="hint-note">（系统固定设置，不可修改）</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">呼叫时间配置</div>

          <!-- 时间矩阵容器 -->
          <!-- 时间轴 -->
          <div class="time-axis">
            <div class="day-label-empty"></div>
            <div v-for="(time, index) in timeSlotsPoint" :key="index" class="time-label">
              <span class="hour-text">{{formatHour(time)}}</span>
            </div>
          </div>
          <div class="time-matrix-container">


            <!-- 矩阵主体 -->
            <div v-for="(day, dayIndex) in weekDays" :key="day" class="matrix-row">
              <div class="day-label">
                {{ day }}
              </div>

              <div v-for="(time, timeIndex) in timeSlots" :key="time" class="time-cell" :class="{
                'selected': selectedMatrix[dayIndex][timeIndex],
                'hour-border': time.endsWith(':00'),
                'first-cell': timeIndex === 0,
                'last-cell': timeIndex === timeSlots.length - 1
              }" :title="`${day} ${getTimeRange(timeIndex)}`" @mousedown="handleMouseDown(dayIndex, timeIndex, $event)"
                @mouseenter="handleMouseEnter(dayIndex, timeIndex)" @mouseup="handleMouseUp(dayIndex, timeIndex)">
                <div v-if="selectedMatrix[dayIndex][timeIndex]" class="selected-indicator">
                  ✓
                </div>
              </div>
            </div>
          </div>
          <!-- 时间轴底部 -->
            <div class="time-axis-bottom">
              <div class="day-label-empty"></div>
              <div class="time-labels-bottom">
                <div v-for="(time, index) in timeSlotsPoint" :key="index" class="time-label-bottom">
                  <span class="hour-text">{{formatHour(time)}}</span>
                </div>
              </div>
            </div>
          <div class="selection-info">
            <div class="summary-item">
              <span class="summary-label">已选时段：</span>
              <span class="summary-value">{{ selectedCount }} 个半小时段</span>
            </div>
          </div>

          <div class="selection-hint">
            <div class="hint-item">
              <div class="color-sample selected-sample"></div>
              <span>已选时段（允许外呼）</span>
            </div>
            <div class="hint-item">
              <div class="color-sample unselected-sample"></div>
              <span>未选时段</span>
            </div>
            <div class="hint-item">
              <div class="color-sample forbidden-sample"></div>
              <span>禁止时段（21:00-08:00）</span>
            </div>
          </div>

          <!-- 快捷操作按钮 -->
          <div class="quick-actions">
            <button class="quick-btn" @click="selectAll">全选</button>
            <button class="quick-btn" @click="clearAll">全不选</button>
            <button class="quick-btn" @click="selectWeekdays">选择工作日</button>
            <button class="quick-btn" @click="selectWeekends">选择周末</button>
          </div>

          <!-- 数据预览 -->
          <div class="data-preview" v-if="showDataPreview">
            <div class="preview-header">
              <h4>生成的数据格式预览</h4>
              <button class="preview-toggle" @click="toggleDataPreview">{{ showDataPreview ? '隐藏' : '显示' }}</button>
              <button class="preview-toggle" @click="copyResult">复制</button>
            </div>
            <pre class="preview-content" v-if="showDataPreview">{{ formatScheduledTimeForPreview() }}</pre>
          </div>
        </div>

        <div class="section">
          <div class="section-title">重呼设置</div>
          <div class="retry-settings">
            <div class="retry-option">
              <input type="checkbox" id="enableRetry" v-model="enableRetry">
              <label for="enableRetry">启用重呼功能</label>
            </div>
            <div class="retry-params" v-if="enableRetry">
              <div class="param-group">
                <label>重呼次数：</label>
                <input type="number" v-model.number="retryCount" min="1" max="5" class="param-input">
              </div>
              <div class="param-group">
                <label>重呼间隔：</label>
                <input type="number" v-model.number="retryInterval" min="5" max="60" class="param-input">
                <span class="param-unit">分钟</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-footer">
        <div class="button-group">
          <button class="btn btn-cancel" @click="handleCancel">
            取消
          </button>
          <button class="btn btn-submit" @click="handleSubmit">
            提交创建
          </button>
          <button class="btn btn-submit-call" @click="handleSubmitAndCall">
            提交并外呼
          </button>
        </div>
      </div>
    </div>

    <!-- 操作提示 -->
    <div v-if="showHelp" class="help-tooltip">
      <div class="help-content">
        <h4>操作提示</h4>
        <ul>
          <li>点击单个格子可选中/取消选中（代表半小时段）</li>
          <li>按住鼠标左键拖拽可批量选择</li>
          <li>每个格子代表半小时：如8:00格表示8:00-8:30</li>
          <li>连续选中的时段会自动合并为完整时间段</li>
          <li>禁止时段（21:00-08:00）为系统固定设置</li>
        </ul>
        <button class="btn-help-close" @click="showHelp = false">知道了</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CallTimeConfig',
  props: {
    // 可传入初始配置
    initialConfig: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // 生成时间槽：8:00到21:00，每半小时一格
    const generateTimeSlots = () => {
      const slots = [];
      for (let hour = 8; hour <= 20; hour++) {
        // 整点
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        // 半点（21:00不生成，因为20:30格子的结束时间是21:00）
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
      // 添加21:00作为最后一个时间点，但实际不会显示为可选的格子
      // 因为21:00是禁止时段的开始
      return slots;
    };

    // 初始化矩阵数据
    const initMatrix = () => {
      return Array(7).fill().map(() => Array(generateTimeSlots().length).fill(false));
    };

    return {
      weekDays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      timeSlots: generateTimeSlots(),
      timeSlotsPoint: ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'],
      selectedMatrix: initMatrix(),

      // 选择状态
      isSelecting: false,
      selectionStart: null,
      selectionEnd: null,
      selectionMode: null, // 'add' 或 'remove'

      // 重呼设置
      enableRetry: false,
      retryCount: 3,
      retryInterval: 30,

      // 帮助提示
      showHelp: false,

      // 数据预览
      showDataPreview: true,

      // 鼠标移动状态
      lastProcessedCell: null
    };
  },
  // 在 computed 部分修复 selectedCount
  computed: {
    // 计算选中的格子数量
    selectedCount() {
      let count = 0;
      // 修复：使用正确的循环范围
      for (let day = 0; day < this.selectedMatrix.length; day++) {
        for (let time = 0; time < this.selectedMatrix[day].length; time++) {
          if (this.selectedMatrix[day][time]) count++;
        }
      }
      return count;
    }
  },
  mounted() {
    // 应用初始配置（如果有）
    if (this.initialConfig && this.initialConfig.scheduledTime) {
      this.applyConfig(this.initialConfig.scheduledTime);
    }

    // 设置示例数据（周一至周五 09:00-20:30）
    // this.setExampleData();

    // 添加全局鼠标事件监听
    document.addEventListener('mouseup', this.handleGlobalMouseUp);

    // 显示帮助提示（首次使用）
    setTimeout(() => {
      this.showHelp = true;
    }, 500);
  },
  beforeDestroy() {
    // 移除全局事件监听
    document.removeEventListener('mouseup', this.handleGlobalMouseUp);
  },
  methods: {
    // 格式化小时显示
    formatHour(time) {
      const hour = parseInt(time.split(':')[0]);
      return `${hour}时`;
    },

    // 获取时间段描述
    getTimeRange(timeIndex) {
      const startTime = this.timeSlots[timeIndex];
      const endTime = this.calculateEndTime(startTime);
      return `${startTime}-${endTime}`;
    },

    // 处理鼠标按下
    handleMouseDown(dayIndex, timeIndex, event) {
      // 只响应左键点击
      if (event.button !== 0) return;

      this.isSelecting = true;
      this.selectionStart = { dayIndex, timeIndex };
      this.selectionEnd = { dayIndex, timeIndex };
      this.lastProcessedCell = `${dayIndex}-${timeIndex}`;

      // 确定选择模式：当前单元格已选中则是移除模式，否则是添加模式
      this.selectionMode = this.selectedMatrix[dayIndex][timeIndex] ? 'remove' : 'add';

      // 切换当前单元格
      this.toggleCell(dayIndex, timeIndex);

      event.preventDefault();
    },

    // 处理鼠标进入单元格
    handleMouseEnter(dayIndex, timeIndex) {
      if (this.isSelecting) {
        const cellKey = `${dayIndex}-${timeIndex}`;

        // 避免重复处理同一个单元格
        if (this.lastProcessedCell === cellKey) return;

        this.selectionEnd = { dayIndex, timeIndex };
        this.lastProcessedCell = cellKey;
        this.updateSelectionArea();
      }
    },

    // 处理鼠标松开
    handleMouseUp(dayIndex, timeIndex) {
      // 如果是简单的点击（没有拖拽），确保处理当前单元格
      if (this.isSelecting &&
        this.selectionStart &&
        this.selectionStart.dayIndex === dayIndex &&
        this.selectionStart.timeIndex === timeIndex &&
        this.selectionEnd &&
        this.selectionEnd.dayIndex === dayIndex &&
        this.selectionEnd.timeIndex === timeIndex) {
        // 这是一个简单的点击，已经在handleMouseDown中处理过了
        // 这里确保状态正确结束
      }

      this.endSelection();
    },

    // 全局鼠标松开处理
    handleGlobalMouseUp() {
      this.endSelection();
    },

    // 结束选择
    endSelection() {
      if (this.isSelecting) {
        this.isSelecting = false;
        this.selectionStart = null;
        this.selectionEnd = null;
        this.selectionMode = null;
        this.lastProcessedCell = null;
      }
    },

    // 更新选择区域
    // 同时需要修改 updateSelectionArea 方法中的赋值操作
    updateSelectionArea() {
      if (!this.selectionStart || !this.selectionEnd) return;

      const startDay = Math.min(this.selectionStart.dayIndex, this.selectionEnd.dayIndex);
      const endDay = Math.max(this.selectionStart.dayIndex, this.selectionEnd.dayIndex);
      const startTime = Math.min(this.selectionStart.timeIndex, this.selectionEnd.timeIndex);
      const endTime = Math.max(this.selectionStart.timeIndex, this.selectionEnd.timeIndex);

      // 更新区域内的所有单元格
      for (let day = startDay; day <= endDay; day++) {
        for (let time = startTime; time <= endTime; time++) {
          // 根据选择模式设置单元格状态，使用 $set 确保响应式更新
          if (this.selectionMode === 'add') {
            this.$set(this.selectedMatrix[day], time, true);
          } else if (this.selectionMode === 'remove') {
            this.$set(this.selectedMatrix[day], time, false);
          }
        }
      }

      // 不再需要 $forceUpdate
    },

    // 切换单个单元格状态（用于点击）
    // 修改 toggleCell 方法，确保响应式更新
    toggleCell(dayIndex, timeIndex) {
      // 使用 Vue.set 确保响应式更新
      this.$set(this.selectedMatrix[dayIndex], timeIndex, !this.selectedMatrix[dayIndex][timeIndex]);
      // 不再需要 $forceUpdate，因为 $set 会触发响应式更新
    },

    // 设置示例数据（周一至周五 09:00-20:30）
    setExampleData() {
      // 找到09:00和20:30的索引
      const startIndex = this.timeSlots.findIndex(t => t === '09:00');
      const endIndex = this.timeSlots.findIndex(t => t === '20:00'); // 20:00格子代表20:00-20:30

      // 周一至周五（索引0-4）设置09:00-20:30
      for (let day = 0; day < 5; day++) {
        for (let time = startIndex; time <= endIndex; time++) {
          this.selectedMatrix[day][time] = true;
        }
      }

      // 周六日（索引5-6）设置09:00-18:00
      const endIndexWeekend = this.timeSlots.findIndex(t => t === '17:30'); // 17:30格子代表17:30-18:00
      for (let day = 5; day <= 6; day++) {
        for (let time = startIndex; time <= endIndexWeekend; time++) {
          this.selectedMatrix[day][time] = true;
        }
      }

      this.$forceUpdate();
    },

    // 应用配置 - 修复回显多一个格子的问题
    // 修改 applyConfig 方法中的赋值操作
    applyConfig(scheduledTime) {
      // 清空当前选择 - 这里创建新数组，所以是响应式的
      this.selectedMatrix = this.selectedMatrix.map(row => row.map(() => false));

      // 应用新的配置
      if (scheduledTime && Array.isArray(scheduledTime)) {
        scheduledTime.forEach(item => {
          if (item.dayOfWeeks && item.times) {
            item.dayOfWeeks.forEach(dayOfWeek => {
              // 将dayOfWeek转换为索引（1=周一，7=周日，转换为0-6）
              const dayIndex = dayOfWeek - 1;
              if (dayIndex >= 0 && dayIndex < 7) {
                // 处理每个时间段
                item.times.forEach(timeRange => {
                  const startTime = this.formatTimeString(timeRange.startTime);
                  const endTime = this.formatTimeString(timeRange.endTime);

                  // 找到开始时间的索引
                  const startIndex = this.timeSlots.findIndex(t => t === startTime);

                  if (startIndex >= 0) {
                    // 计算需要选中的格子数量
                    // 每个格子代表半小时，所以需要计算从startTime到endTime包含多少个半小时段
                    const timeSlotsCount = this.calculateTimeSlotsCount(startTime, endTime);

                    // 选中从startIndex开始的timeSlotsCount个格子
                    for (let i = 0; i < timeSlotsCount; i++) {
                      const timeIndex = startIndex + i;
                      if (timeIndex < this.timeSlots.length) {
                        // 使用 $set 确保响应式更新
                        this.$set(this.selectedMatrix[dayIndex], timeIndex, true);
                      }
                    }
                  } else {
                    console.warn(`开始时间 ${startTime} 不在可选时间范围内`);
                  }
                });
              }
            });
          }
        });
      }

      // 不再需要 $forceUpdate
    },
    // 格式化时间字符串，确保为两位格式（如：9:00 -> 09:00）
    formatTimeString(timeStr) {
      if (!timeStr) return timeStr;

      // 如果已经是正确的格式，直接返回
      if (/^\d{2}:\d{2}$/.test(timeStr)) {
        return timeStr;
      }

      // 格式化时间，确保小时和分钟都是两位
      const parts = timeStr.split(':');
      if (parts.length === 2) {
        const hour = parts[0].padStart(2, '0');
        const minute = parts[1].padStart(2, '0');
        return `${hour}:${minute}`;
      }

      return timeStr;
    },
    // 计算从startTime到endTime包含的半小时段数量
    calculateTimeSlotsCount(startTime, endTime) {
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);

      // 计算总分钟数
      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;

      // 计算差值（以半小时为单位）
      const diffMinutes = endTotalMinutes - startTotalMinutes;
      return diffMinutes / 30;
    },

    // 获取选中的时间段（格式化输出为scheduledTime格式）
    getScheduledTime() {
      // 第一步：收集每一天的时间段
      const dayTimeRanges = [];

      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const timeRanges = [];
        let currentRange = null;
        let currentRangeEndIndex = -1;

        for (let timeIndex = 0; timeIndex < this.timeSlots.length; timeIndex++) {
          const isSelected = this.selectedMatrix[dayIndex][timeIndex];

          if (isSelected) {
            if (currentRange === null) {
              // 开始新的时间段
              currentRange = {
                start: this.timeSlots[timeIndex],
                startIndex: timeIndex
              };
              currentRangeEndIndex = timeIndex;
            } else if (timeIndex === currentRangeEndIndex + 1) {
              // 连续选中，更新结束索引
              currentRangeEndIndex = timeIndex;
            } else {
              // 不连续，结束当前时间段并开始新的时间段
              // 计算结束时间
              const endTime = this.calculateEndTimeForIndex(currentRangeEndIndex);

              timeRanges.push({
                startTime: currentRange.start,
                endTime: endTime
              });

              // 开始新的时间段
              currentRange = {
                start: this.timeSlots[timeIndex],
                startIndex: timeIndex
              };
              currentRangeEndIndex = timeIndex;
            }
          }
        }

        // 处理最后一个时间段
        if (currentRange !== null) {
          const endTime = this.calculateEndTimeForIndex(currentRangeEndIndex);
          timeRanges.push({
            startTime: currentRange.start,
            endTime: endTime
          });
        }

        if (timeRanges.length > 0) {
          dayTimeRanges.push({
            dayIndex,
            timeRanges
          });
        }
      }

      // 第二步：合并相同时间段的日期
      const scheduledTime = [];
      const timeRangeMap = new Map(); // key: 时间段字符串, value: {dayOfWeeks: [], times: []}

      dayTimeRanges.forEach(({ dayIndex, timeRanges }) => {
        // 将时间段数组转换为字符串作为key
        const timeRangesKey = JSON.stringify(timeRanges);

        if (!timeRangeMap.has(timeRangesKey)) {
          timeRangeMap.set(timeRangesKey, {
            dayOfWeeks: [dayIndex + 1], // dayOfWeeks从1开始（1=周一）
            times: timeRanges
          });
        } else {
          const existing = timeRangeMap.get(timeRangesKey);
          existing.dayOfWeeks.push(dayIndex + 1);
          // 保持dayOfWeeks排序
          existing.dayOfWeeks.sort((a, b) => a - b);
        }
      });

      // 将Map转换为数组
      timeRangeMap.forEach(value => {
        scheduledTime.push(value);
      });

      // 按dayOfWeeks的第一个值排序
      scheduledTime.sort((a, b) => a.dayOfWeeks[0] - b.dayOfWeeks[0]);

      return scheduledTime;
    },

    // 根据索引计算结束时间
    calculateEndTimeForIndex(endIndex) {
      if (endIndex < 0 || endIndex >= this.timeSlots.length) {
        return this.timeSlots[this.timeSlots.length - 1];
      }

      const endSlot = this.timeSlots[endIndex];
      return this.calculateEndTime(endSlot);
    },

    // 计算结束时间（当前时间+30分钟）
    calculateEndTime(startTime) {
      const [hour, minute] = startTime.split(':').map(Number);

      // 计算结束时间（半小时后）
      let endHour = hour;
      let endMinute = minute + 30;

      if (endMinute >= 60) {
        endHour += 1;
        endMinute -= 60;
      }

      // 对于20:30这个特殊情况，结束时间应该是21:00
      if (endHour > 21 || (endHour === 21 && endMinute > 0)) {
        return "21:00";
      }

      // 格式化为HH:mm
      return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
    },

    // 获取完整配置数据
    getConfigData() {
      return {
        scheduledTime: this.getScheduledTime(),
        retryConfig: this.enableRetry ? {
          enabled: true,
          retryCount: this.retryCount,
          retryInterval: this.retryInterval
        } : { enabled: false },
        forbiddenTime: "21:00-08:00" // 固定值
      };
    },

    // 格式化scheduledTime用于预览
    formatScheduledTimeForPreview() {
      const scheduledTime = this.getScheduledTime();
      return JSON.stringify(scheduledTime, null, 2);
    },

    // 切换数据预览显示
    toggleDataPreview() {
      this.showDataPreview = !this.showDataPreview;
    },

    // 快捷操作：全选
    selectAll() {
      this.selectedMatrix = this.selectedMatrix.map(row => row.map(() => true));
      this.$forceUpdate();
    },

    // 快捷操作：全不选
    clearAll() {
      this.selectedMatrix = this.selectedMatrix.map(row => row.map(() => false));
      this.$forceUpdate();
    },

    // 快捷操作：选择工作日（周一至周五）
    selectWeekdays() {
      // 清空所有选择
      this.selectedMatrix = this.selectedMatrix.map(row => row.map(() => false));

      // 找到09:00和20:00的索引（20:00代表20:00-20:30）
      const startIndex = this.timeSlots.findIndex(t => t === '09:00');
      const endIndex = this.timeSlots.findIndex(t => t === '20:00');

      // 周一至周五（索引0-4）设置09:00-20:30
      for (let day = 0; day < 5; day++) {
        for (let time = startIndex; time <= endIndex; time++) {
          this.$set(this.selectedMatrix[day], time, true);
        }
      }

      // 不再需要 $forceUpdate
    },


    // 快捷操作：选择周末（周六、周日）
    selectWeekends() {
      // 清空所有选择
      this.selectedMatrix = this.selectedMatrix.map(row => row.map(() => false));

      // 找到09:00和17:30的索引（17:30代表17:30-18:00）
      const startIndex = this.timeSlots.findIndex(t => t === '09:00');
      const endIndex = this.timeSlots.findIndex(t => t === '17:30');

      // 周六日（索引5-6）设置09:00-18:00
      for (let day = 5; day <= 6; day++) {
        for (let time = startIndex; time <= endIndex; time++) {
          this.$set(this.selectedMatrix[day], time, true);
        }
      }

      // 不再需要 $forceUpdate
    },

    // 处理取消
    handleCancel() {
      if (confirm('确定要取消吗？未保存的更改将会丢失。')) {
        this.$emit('cancel');
      }
    },

    // 处理提交
    handleSubmit() {
      const config = this.getConfigData();
      console.log('提交配置:', config);
      this.$emit('submit', config);

      // 显示成功消息
      alert('任务配置已提交成功！');
    },

    // 处理提交并外呼
    handleSubmitAndCall() {
      const config = this.getConfigData();
      console.log('提交并外呼:', config);
      this.$emit('submit-and-call', config);

      // 显示成功消息
      alert('任务配置已提交，外呼任务已开始！');
    },
    copyResult() {
      navigator.clipboard.writeText(this.formatScheduledTimeForPreview())
        .then(() => {
          this.$message.success('身份证号已复制到剪贴板');
        })
        .catch(err => {
          console.error('复制失败:', err);
          this.$message.error('复制失败，请手动复制');
        });
    }
  }
};
</script>

<style scoped>
.call-time-config-container {
  font-family: 'Microsoft YaHei', 'Segoe UI', Arial, sans-serif;
  background-color: #f8f9fa;
  min-height: 100vh;
  padding: 20px;
  position: relative;
}

.config-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  max-width: 1400px;
  margin: 0 auto;
}

.panel-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.task-id {
  font-size: 14px;
  opacity: 0.9;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
}

.panel-body {
  padding: 24px;
}

.section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #eef0f3;
}

.section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.section-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 16px;
  background: #409eff;
  border-radius: 2px;
  margin-right: 8px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #606266;
  margin-bottom: 8px;
}

.forbidden-time-hint {
  background: #f0f7ff;
  border: 1px solid #d4e6ff;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
}

.hint-icon {
  font-size: 18px;
  margin-right: 10px;
  color: #409eff;
}

.hint-text {
  font-weight: 500;
  color: #409eff;
  margin-right: 8px;
}

.hint-note {
  font-size: 13px;
  color: #909399;
}

/* 时间矩阵样式 */
.time-matrix-container {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  /* margin-bottom: 20px; */
  background: white;
}

.time-axis {
  display: flex;
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

.time-axis-bottom {
  display: flex;
  background: #f5f7fa;
  border-top: 1px solid #e4e7ed;
}

.day-label-empty {
  width: 80px;
  min-width: 80px;
  background: #f5f7fa;
}

.day-label {
  width: 80px;
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: #303133;
  background: #f5f7fa;
  border-right: 1px solid #e4e7ed;
  padding: 12px 8px;
}

.matrix-row {
  display: flex;
  border-bottom: 1px solid #f0f2f5;
  transition: background-color 0.2s;
}

.matrix-row:hover {
  background-color: #fafbfc;
}

.matrix-row:last-child {
  border-bottom: none;
}

.time-label {
  flex: 1;
  min-width: 30px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 1px solid #e8eef7;
}

.time-label.hour-mark {
  background: #fafbfc;
  border-right: 1px solid #e4e7ed;
}

.time-labels-bottom {
  display: flex;
  flex: 1;
}

.time-label-bottom {
  flex: 1;
  min-width: 30px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 1px solid #e8eef7;
}

.hour-text {
  font-size: 12px;
  color: #606266;
  font-weight: 500;
}

.half-hour-line {
  display: block;
  width: 1px;
  height: 10px;
  background: #dcdfe6;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.time-cell {
  flex: 1;
  min-width: 30px;
  height: 56px;
  border-right: 1px solid #f0f2f5;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.time-cell:hover {
  background-color: #f0f7ff;
  z-index: 1;
}

.time-cell.selected {
  background-color: #ffd8a6;
  border-color: #ffb143;
  z-index: 2;
}

.time-cell.hour-border {
  border-right-color: #e4e7ed;
}

.time-cell.first-cell {
  border-left: 1px solid #e4e7ed;
}

.time-cell.last-cell {
  border-right: 1px solid #e4e7ed;
}

.selected-indicator {
  color: #e67e22;
  font-size: 14px;
  font-weight: bold;
}

/* 选择信息 */
.selection-info {
  margin: 16px 0;
  padding: 12px 16px;
  background: #f0f7ff;
  border-radius: 8px;
  border: 1px solid #d4e6ff;
}

.summary-item {
  display: flex;
  align-items: center;
}

.summary-label {
  font-weight: 500;
  color: #409eff;
  margin-right: 8px;
}

.summary-value {
  font-weight: 600;
  color: #303133;
}

/* 选择提示 */
.selection-hint {
  display: flex;
  gap: 24px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.hint-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.color-sample {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.selected-sample {
  background-color: #ffd8a6;
  border-color: #ffb143;
}

.unselected-sample {
  background-color: white;
}

.forbidden-sample {
  background-color: #f5f5f5;
  border-color: #ddd;
}

/* 快捷操作按钮 */
.quick-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.quick-btn {
  padding: 8px 16px;
  background: #f0f7ff;
  color: #409eff;
  border: 1px solid #c6e2ff;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-btn:hover {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

/* 数据预览 */
.data-preview {
  margin-top: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

.preview-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.preview-toggle {
  padding: 4px 12px;
  background: #f0f7ff;
  color: #409eff;
  border: 1px solid #c6e2ff;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.preview-toggle:hover {
  background: #409eff;
  color: white;
}

.preview-content {
  margin: 0;
  padding: 16px;
  background: #fafbfc;
  font-size: 12px;
  line-height: 1.5;
  max-height: 600px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  color: #606266;
}

/* 重呼设置 */
.retry-settings {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

.retry-option {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.retry-option input[type="checkbox"] {
  margin-right: 8px;
  width: 16px;
  height: 16px;
}

.retry-option label {
  font-weight: 500;
  color: #303133;
  cursor: pointer;
}

.retry-params {
  display: flex;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px dashed #dcdfe6;
}

.param-group {
  display: flex;
  align-items: center;
}

.param-group label {
  margin-right: 8px;
  white-space: nowrap;
}

.param-input {
  width: 80px;
  padding: 6px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  text-align: center;
}

.param-unit {
  margin-left: 8px;
  color: #909399;
}

/* 按钮组 */
.panel-footer {
  padding: 20px 24px;
  background: #fafbfc;
  border-top: 1px solid #eef0f3;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
}

.btn-cancel {
  background: white;
  color: #606266;
  border: 1px solid #dcdfe6;
}

.btn-cancel:hover {
  background: #f5f7fa;
  color: #409eff;
  border-color: #c6e2ff;
}

.btn-submit {
  background: #409eff;
  color: white;
}

.btn-submit:hover {
  background: #66b1ff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.btn-submit-call {
  background: #67c23a;
  color: white;
}

.btn-submit-call:hover {
  background: #85ce61;
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
}

/* 帮助提示 */
.help-tooltip {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 280px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  border: 1px solid #e4e7ed;
}

.help-content {
  padding: 20px;
}

.help-content h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 16px;
}

.help-content ul {
  margin: 0 0 16px 0;
  padding-left: 20px;
}

.help-content li {
  margin-bottom: 8px;
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
}

.btn-help-close {
  width: 100%;
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-help-close:hover {
  background: #66b1ff;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .time-cell {
    min-width: 25px;
    height: 50px;
  }

  .day-label {
    width: 70px;
    min-width: 70px;
  }

  .day-label-empty {
    width: 70px;
    min-width: 70px;
  }
}

@media (max-width: 768px) {
  .panel-body {
    padding: 16px;
  }

  .selection-hint {
    flex-direction: column;
    gap: 12px;
  }

  .retry-params {
    flex-direction: column;
    gap: 12px;
  }

  .quick-actions {
    flex-direction: column;
  }

  .button-group {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .help-tooltip {
    width: calc(100% - 40px);
    right: 20px;
    left: 20px;
  }

  .data-preview {
    margin-top: 16px;
  }

  .preview-content {
    font-size: 10px;
    padding: 12px;
  }
}
</style>