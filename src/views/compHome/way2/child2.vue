<template>
  <div>
    <h1>孩子</h1>
    <p>{{message}}</p>
    <button @click="changeMsgFn">按钮</button>
  </div>
</template>
<script>
export default {
  props: ["message", "changeMsgFn"],
};
</script>