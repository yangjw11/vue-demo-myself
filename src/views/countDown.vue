<template>
  <div>
    <div class="title1">倒计时功能</div>
     <h2 v-html>{{msg.toFixed(2)}}</h2>
    <button @click="change1" :disabled="flag">开始计时</button>
    <button @click="stop1" :disabled="!flag">暂停计时</button>
</template>
<script>
export default {
  data() {
    return {
     
    };
  },
  methods: {
   
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