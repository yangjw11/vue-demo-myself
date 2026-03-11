<template>
  <div>
    <div class="title1"></div>
    <div class="title2"></div>
    <div style="width: 100%; text-align: center;">
      <!-- 儿子：{{value}} -->
      儿子：{{value}}
      <button @click="change">v-model修改</button>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    value:{
      type: Number,
      default: 1
    }
  },
  data() {
    return {
     
    };
  },
  methods: {
    change (){
      this.$emit('input', 300)
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