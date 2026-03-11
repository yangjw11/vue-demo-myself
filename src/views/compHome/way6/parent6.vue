<template>
  <div id="app">
    <h1>父亲</h1>
    <child ref="childComp"></child>
    <button @click="changeName">按钮</button>
  </div>
</template>
<script>
import Child from "./child6.vue";
export default {
  components: {
    Child,
  },
  methods: {
    changeName() {
      debugger;
      console.log("点击前", this.$refs.childComp.age);
      this.$refs.childComp.changeAge();
      console.log("点击后", this.$refs.childComp.age);
    },
  },
};
</script>