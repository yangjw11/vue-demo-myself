<template>
  <div id="app">
    <h1>父亲</h1>
    <p>{{message}}</p>
    <button @click="changeChildNumber">按钮</button>
    <child></child>
  </div>
</template>
<script>
import Child from "./child3.vue";
export default {
  data() {
    return {
      message: "hello",
    };
  },
  components: {
    Child,
  },
  methods: {
    changeChildNumber() {
      console.log('父组件中的this.$children:', this.$children)
      this.$children[0].number = 50;
    },
  },
};
</script>