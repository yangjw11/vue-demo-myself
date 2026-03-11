<template>
  <!-- A 组件 -->
  <!-- npm install vue-bus --save -->
  <div class="wrap">
    <div>
      这里是组件B的区域
      <child1></child1>
    </div>
    <button @click="sendMsg">触发</button>
  </div>
</template>

<script>
import child1 from "./child1.vue";
export default {
  components: {
    child1
  },
  data() {
    return {
      Amsg: "我是来自A组件的信息",
    };
  },
  methods: {
    sendMsg() {
      this.$bus.emit("changeMsg", this.Amsg);
      this.$bus.emit("doOnce", "我只会触发一次");
    },
  },
};
</script>
