<template>
  <div class="current-datetime" :style="mergedStyle">
    {{ formattedDateTime }} {{ weekDay }}
  </div>
</template>

<script>
export default {
  name: 'CurrentDateTime',
  props: {
    // 接收父组件传递的样式对象 [1,2](@ref)
    customStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      currentTime: new Date(),
      weekDays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      timer: null
    };
  },
  computed: {
    formattedDateTime() {
      const date = this.currentTime;
      return `${date.getFullYear()}年${this.padZero(date.getMonth() + 1)}月${this.padZero(date.getDate())}日 ${this.padZero(date.getHours())}:${this.padZero(date.getMinutes())}:${this.padZero(date.getSeconds())}`;
    },
    weekDay() {
      return this.weekDays[this.currentTime.getDay()];
    },
    mergedStyle() {
      return { ...this.defaultStyle, ...this.customStyle };
    }
  },
  methods: {
    padZero(num) {
      return num < 10 ? '0' + num : num;
    },
    updateTime() {
      this.currentTime = new Date();
    }
  },
  mounted() {
    this.updateTime();
    this.timer = setInterval(this.updateTime, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style scoped>
/* 移除固定样式，仅保留必要结构 */
.current-datetime {
  display: inline-block;
}
</style>