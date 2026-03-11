<!--
 * @Author: yangJianWei yangjianwei@chexiao.co
 * @Date: 2026-01-30 10:15:49
 * @LastEditors: yangJianWei yangjianwei@chexiao.co
 * @LastEditTime: 2026-03-11 13:54:12
 * @FilePath: \vue-demo-myself\src\App.vue
 * @@Description: 
-->
<template>
  <div>
    <el-button type="primary" v-if='showBackButton' @click="goToHome">回到首页</el-button>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  computed: {
    showBackButton() {
      // 从Vuex store中获取showBackButton状态
      return this.$store.state.showBackButton && this.$route.path !== '/';
    }
  },
  methods: {
    goToHome() {
      this.$router.push('/')
    }
  }
}
</script>



<style></style>