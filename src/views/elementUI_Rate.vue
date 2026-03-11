<template>
  <div>
    <div>
      <span class="demonstration">默认不区分颜色</span>
      <el-rate v-model="value1"></el-rate>
      <el-button @click="clear()">清空</el-button>
    </div>
    <div>
      <span class="demonstration">区分颜色</span>
      <el-rate v-model="value2" :colors="colors"></el-rate>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value1: null,
      value2: null,
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"], // 等同于 { 2: '#99A9BF', 4: { value: '#F7BA2A', excluded: true }, 5: '#FF9900' }
    };
  },
  watch: {
    value1(newValue, oldValue) {
      console.log('newValue === ', newValue)
    }
  },
  methods: {
    clear() {
      this.value1 = 0
    }
  },
};
</script>

<style>
</style>