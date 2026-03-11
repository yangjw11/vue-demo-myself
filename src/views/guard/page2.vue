<template>
  <div>
    <div class="title1">这是page2页面</div>
    <div class="title2"></div>
    <div v-if="showDlg">
      这是弹窗
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showDlg: false
    };
  },
  beforeRouteEnter (to, from, next) {
    if(true) {
      next(vm=>{
        vm.showDlg = true
      })
    } else {
      next(false)
    }
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