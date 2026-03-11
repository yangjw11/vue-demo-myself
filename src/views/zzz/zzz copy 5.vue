<template>
  <div>
    <div v-for="id in ids" :key="id">
      <el-input v-model="values[id]" @blur="formatDecimal(id)" placeholder="请输入数字"></el-input>
    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      ids: [1, 2, 3], // 输入框ID集合
      values: {}      // 用对象存储各输入框的值
    };
  },
  created() {
    // 初始化所有值为空字符串
    this.ids.forEach(id => {
      this.$set(this.values, id, '');
    });
  },
  methods: {
    formatDecimal(id) {
      const rawValue = this.values[id];
      if (!rawValue && rawValue !== 0) return;

      const num = parseFloat(rawValue);
      if (isNaN(num)) {
        this.$message.warning(`ID为${id}的输入框：请输入有效数字`);
        this.$set(this.values, id, '');
        return;
      }

      this.$set(this.values, id, num.toFixed(2));
    }
  }
};
</script>