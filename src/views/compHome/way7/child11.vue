<template>
  <div>
    <h1>孩子1</h1>
    <p>name:{{name}}</p>
    <button @click="handleChildOneClick">按钮</button>
  </div>
</template>
 
<script>
export default {
  props: ["name"],
  methods: {
    handleChildOneClick() {
      this.$emit("ChildOneClick", "hui");
    },
  },
};
</script>