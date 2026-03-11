<template>
  <div>
    <button @click="scrollToItem3">跳转到第三项</button>
    <ul>
      <li class="item1 item">第一项</li>
      <li class="item2 item">第二项</li>
      <li class="item3 item">第三项</li>
      <li class="item4 item">第四项</li>
    </ul>
  </div>
</template>

<script>
export default {
  methods: {
    scrollToItem3() {
      const item3 = document.querySelector('.item3');
      item3.scrollIntoView();
    },
  },
};
</script>
<style scoped>
  .item {
    height: 500px;
  }
</style>