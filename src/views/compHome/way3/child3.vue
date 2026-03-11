<template>
  <div>
    <h1>孩子</h1>
    <p>{{number}}</p>
    <p>{{parentMessage}}</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      number: 10,
    };
  },
  computed: {
    parentMessage() {
      console.log('子组件中打印this.$parent:', this.$parent)
      return this.$parent.message;
    },
  },
};
</script>