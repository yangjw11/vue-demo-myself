<template>
  <div id="app">
    <h1>父亲</h1>
    <child></child>
  </div>
</template>
<script>
import Child from "./child4.vue";
export default {
  components: {
    Child,
  },
  provide: {
    message: "Hello",
  },
};
</script>