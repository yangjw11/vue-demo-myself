<template>
  <div id="app">
    <h1>父亲</h1>
    <p>name：{{name}}</p>
    <hr />
    <child11 :name="name" @ChildOneClick="handleParentClick" />
    <hr />
    <child22 :name="name" />
  </div>
</template>
 
<script>
import child11 from "./child11.vue";
import child22 from "./child22.vue";

export default {
  data() {
    return {
      name: "pipiwuyi",
    };
  },
  methods: {
    handleParentClick(name) {
      this.name = name;
    },
  },
  components: {
    child11,
    child22,
  },
};
</script>