<template>
  <div id="app">
    <h1>父亲</h1>
    <p>姓名：{{name}}</p>
    <p>年龄：{{age}}</p>
    <child :name="name" :age="age" @changeName="changeName"></child>
  </div>
</template>
<script>
import Child from "./child5.vue";
export default {
  components: {
    Child,
  },
  data() {
    return {
      name: "pipi",
      age: 1,
    };
  },
  methods: {
    changeName() {
      this.name = "wuyi";
    },
  },
};
</script>