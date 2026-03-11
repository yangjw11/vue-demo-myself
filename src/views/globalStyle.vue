<template>
  <div>
    <div class="title1">【使用公共样式】</div>
    <div class="title2"></div>
    <div style="width: 100%; text-align: center;">
      <span id="globalStyle">这行文字就是使用了公共样式</span>
    </div>
  </div>
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

<style scoped>
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