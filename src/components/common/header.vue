<template>
  <div>
    <h1>header in here</h1>
    <div>子组件的年龄是：{{age}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      age: 17,
    };
  },
  mounted(){
    console.log('子组件的mounted打印')
  },
  methods: {
    changeAge(val) {
      this.age = val
    },
    changeOther() {
      console.log('调用了子组件的其他方法')
    }
  },
};
</script>