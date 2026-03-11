<template>
  <div>
    <div class="title1">父组件</div>
    <div >父组件的值 ------ {{name}}</div>
    <son @changData="changeMydata" />
  </div>
</template>
<script>
import Son from "./son.vue";
export default {
  components: {
    Son,
  },
  data() {
    return {
      name: 'zhangsan',
    };
  },
  methods: {
    changeMydata(val){
      console.log(val)
      this.name = val
    }
  },
};
</script>

<style>
.title1 {
  width: 100%;
  text-align: center;
  font-size: 32px;
  font-weight: 500;
  color: #ff0000;
}
.title2 {
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #000000;
}
</style>