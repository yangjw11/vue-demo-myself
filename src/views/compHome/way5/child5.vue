<template>
  <div>
    <h1>孩子</h1>
    <button @click="$listeners.changeName">按钮</button>
    <grand-child v-bind="$attrs"></grand-child>
  </div>
</template>
<script>
import grandChild from './grandChild.vue'
export default {
  components: {
    grandChild
  }
}
</script>