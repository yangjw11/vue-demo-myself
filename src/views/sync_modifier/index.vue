<!-- vue中.sync修饰符的使用 -->
<template>
  <div>
    <!-- 父组件使用子组件并绑定子组件的value属性 -->
    <ChildComponent :value.sync="parentValue" />
    <!-- 显示父组件的value属性 -->
    <p>父组件的值：{{ parentValue }}</p>
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue'
export default {
  components: {
    ChildComponent,
  },
  data() {
    return {
      parentValue: '',
    };
  },
};
</script>