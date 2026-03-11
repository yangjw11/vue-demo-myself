<template>
  <div id="app">
    <h1>父亲</h1>
    <p>{{message}}</p>
    <child :message="message" @changeMessage="message =$event"></child>
  </div>
</template>
 
<script>
import Child from "./child1.vue";
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