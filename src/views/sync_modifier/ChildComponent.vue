<template>
  <div>
    <!-- 子组件使用v-model绑定自身的value属性 -->
    <input v-model="childValue" />
    <!-- 通过$emit方法触发update:value事件传递数据给父组件 -->
    <button @click="$emit('update:value', childValue)">更新父组件的值</button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      childValue: this.value,
    };
  },
};
</script>