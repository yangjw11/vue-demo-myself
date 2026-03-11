<template>
<!-- v-upper-text是全局的自定义指令，v-lower-text是局部自定义指(令vue自定义指令) -->
  <div>
    <div class="title1">vue自定义指令</div>
    <div class="title2">详情看官方文档</div>
    <div style="width: 100%; text-align: center;">
      <p v-upper-text="name"></p>转大写
      <p v-lower-text="name"></p>转小写
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: "jack,JACK",
    };
  },
  methods: {},
  // 注意自定义指令和data、methods在同一级
  // 转大写的自定义指令我们在全局注册，详情请看debounce.js中，并且在main.js中注册了
  directives: {
    //定义局部指令
    // el:指令属性所在的标签对象
    // binding包含指令相关信息数据的对象
    "lower-text": function (el, binding) {
      console.log('小写el ===', el)
      console.log('小写binding === ', binding)
      el.textContent = binding.value.toLowerCase();
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
</style>