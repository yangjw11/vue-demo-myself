<template>
  <!-- props+$emit() -->
  <div>
    <div class="title1">组件通信1</div>
    <div class="title2">props+$emit()</div>
    <!-- =========== -->
    <div style="width: 100%; text-align: center;">
      <div>{{sex | getSex}}</div>
    </div>
    <!-- ========== -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      sex:'0'
    };
  },
  methods: {},
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