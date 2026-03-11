<template>
  <div>
    <div class="title1">vue组件通信demo</div>
    <div class="title2">（如果建新项目，记得配置路由）</div>
    <div class="btn_item">
      <el-button class="item" type="primary" @click="goRouter('parent1')">【01-props + $emit()】</el-button>
      <el-button class="item" type="primary" @click="goRouter('parent2')">【02-通过回调函数（callback）】</el-button>
      <el-button class="item" type="primary" @click="goRouter('parent3')">【03- $parent + $children】</el-button>
      <el-button class="item" type="primary" @click="goRouter('parent4')">【04- provide + inject】</el-button>
      <el-button class="item" type="primary" @click="goRouter('parent5')">【05- $attrs + $listeners】</el-button>
      <el-button class="item" type="primary" @click="goRouter('parent6')">【06- ref + $refs】</el-button>
      <el-button class="item" type="primary" @click="goRouter('parent7')">【07-兄弟组件之间:子传值到父，再由父传值到子】</el-button>
      <el-button class="item" type="primary" @click="goRouter('parent8')">【08-兄弟组件之间:事件总线】</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    goRouter(name) {
      if (name == "parent1") {
        this.$router.push({
          path: "/parent1",
        });
      } else if (name == "parent2") {
        this.$router.push({
          path: "/parent2",
        });
      } else if (name == "parent3") {
        this.$router.push({
          path: "/parent3",
        });
      } else if (name == "parent4") {
        this.$router.push({
          path: "/parent4",
        });
      } else if (name == "parent5") {
        this.$router.push({
          path: "/parent5",
        });
      } else if (name == "parent6") {
        this.$router.push({
          path: "/parent6",
        });
      } else if (name == "parent7") {
        this.$router.push({
          path: "/parent7",
        });
      }else if (name == "parent8") {
        this.$router.push({
          path: "/parent8",
        });
      }
    },
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
.btn_item {
  display: flex;
  /* 让按钮区域自动换行 */
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin-top: 50px;
  width: 100%;
  text-align: center;
}
.btn_item .item {
  display: inline-block;
  margin-top: 30px;
}
</style>