<template>
  <!-- 使用Vue实现一个基础的倒计时秒的组件，可以通过 <Timer from="60" /> 方式调用，显示效果是从 60 递减到 0，每秒减 1 -->
  <div>
    {{ time }}
  </div>
</template>
<script>
export default {
  props: ['from'],
  data() {
    return {
      time: '',
    };
  },
  created() {
    this.time = this.timeEnd(this.from)
  },
  // 页面销毁，清除定时器
  methods: {
    timeEnd(time = 60) {
      if (time > 0) {
        setInterval(() => {
          time -= 1
          return time
        }, 1000)
      } else { 
        time = 0
      }
      return time
    }
  },
};
</script>

<style></style>