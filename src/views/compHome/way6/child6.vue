<template>
  <div>
    <h1>孩子</h1>
  </div>
</template>
<script>
export default {
  data() {
    return {
      age: 20,
    };
  },
  methods: {
    changeAge() {
      this.age = 50;
    },
  },
};
</script>