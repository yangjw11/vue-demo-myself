<template>
  <div id="app">
    <h1>父亲</h1>
    <p>{{message}}</p>
    <child :message="message" :changeMsgFn="changeMeaasge"></child>
  </div>
</template>
<script>
import Child from "./child2.vue";
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
    changeMeaasge() {
      this.message = "Bye";
    },
  },
};
</script>