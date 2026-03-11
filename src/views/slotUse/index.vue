<template>
  <div class="parent">
    <h2>🚀 Vue2 插槽 + 父组件提供数据 演示</h2>

    <!-- 示例：使用父组件定义的列表数据 -->
    <h3>📌 父组件传递自定义列表数据，并通过作用域插槽渲染</h3>
    <!-- 第一个 -->
    <Child :items="fruitList">
      <!-- 具名插槽 header -->
      <template #header>
        <h2 style="color: #1976d2;">✨ 今日特价水果</h2>
      </template>

      <!-- 默认插槽 -->
      <template #default>
        <p>下面列表由父组件提供数据，子组件负责循环渲染：</p>
      </template>

      <!-- 作用域插槽 item：自定义每一项的显示方式 -->
      <template #item="{ item, index }">
        <span :style="{ color: item.price > 6 ? '#d32f2f' : '#2e7d32' }">
          {{ index + 1 }}. {{ item.name }} —— ￥{{ item.price }}
          <span v-if="item.price > 6"> 🔥 热卖</span>
        </span>
      </template>

      <!-- 底部插槽 -->
      <template #footer>
        <div style="font-style: italic;">🏷️ 限时优惠，欲购从速</div>
      </template>
    </Child>

    <!-- 第二个示例：使用另一组数据，且仅部分自定义插槽 -->
    <h3>📌 传递另一组数据，仅自定义 header 和 item 插槽</h3>
    <Child :items="snackList">
      <template #header>
        <h3 style="color: #c2185b;">🍿 休闲零食</h3>
      </template>
      <template #item="{ item }">
        <span>🍬 {{ item.name }} —— ￥{{ item.price }}</span>
      </template>
      <!-- 未提供 footer 和 default 插槽，将显示子组件的后备内容 -->
    </Child>
    <h3>📌 传递另一组数据，仅使用Child组件自己提供的</h3>
    <!-- 第三个 -->
    <Child></Child>
  </div>
</template>

<script>
import Child from './Child.vue'

export default {
  name: 'Parent',
  components: { Child },
  data() {
    return {
      // 父组件准备的两组不同数据
      fruitList: [
        { id: 101, name: '草莓', price: 12 },
        { id: 102, name: '芒果', price: 8 },
        { id: 103, name: '蓝莓', price: 15 }
      ],
      snackList: [
        { id: 201, name: '薯片', price: 6 },
        { id: 202, name: '巧克力', price: 10 },
        { id: 203, name: '坚果', price: 18 }
      ]
    }
  }
}
</script>

<style scoped>
.parent {
  max-width: 900px;
  margin: 0 auto;
  font-family: 'Segoe UI', Roboto, Arial, sans-serif;
  padding: 20px;
  background-color: #ffffff;
}

h2 {
  color: #333;
  border-bottom: 2px solid #42b983;
  padding-bottom: 8px;
}

h3 {
  margin-top: 32px;
  color: #444;
  background-color: #f0f9f0;
  padding: 6px 12px;
  border-radius: 20px;
  display: inline-block;
}
</style>