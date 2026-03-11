<template>
  <div class="child-demo">
    <!-- 头部区域：具名插槽 'header' -->
    <header class="header">
      <slot name="header">
        <h3>🔵 默认标题（来自子组件）</h3>
      </slot>
    </header>

    <!-- 主体区域：默认插槽 -->
    <main class="main">
      <slot>
        <p>📄 默认插槽的后备内容，没有任何提供时显示此段文字。</p>
      </slot>
    </main>

    <!-- 列表区域：遍历父组件传入的 items -->
    <div class="item-list">
      <h4>📋 项目列表（使用作用域插槽自定义渲染）</h4>
      <ul>
        <li v-for="(item, index) in items" :key="item.id">
          <!-- 作用域插槽，将当前项和索引暴露给父组件 -->
          <slot name="item" v-bind:item="item" :index="index">
            <!-- 后备内容：当父组件未提供 item 插槽时，使用默认样式显示 -->
            <span>🍏 {{ item.name }} (默认项样式)</span>
          </slot>
        </li>
      </ul>
    </div>

    <!-- 底部区域：具名插槽 'footer' -->
    <footer class="footer">
      <slot name="footer">
        <small>🔚 默认底部信息</small>
      </slot>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Child',
  props: {
    // 定义 items 属性，类型为数组，默认值设为空数组（防止未传值时报错）
    items: {
      type: Array,
      default: () => [
        // 可选：提供一个默认的示例数据，以便在父组件未传值时仍有展示
        { id: 1, name: '苹果', price: 5 },
        { id: 2, name: '香蕉', price: 3 },
        { id: 3, name: '樱桃', price: 8 }
      ]
    }
  }
}
</script>

<style scoped>
.child-demo {
  border: 1px solid #ccc;
  border-radius: 8px;
  margin: 16px 0;
  padding: 16px;
  background-color: #fafafa;
}
.header {
  background-color: #e3f2fd;
  padding: 8px;
  margin: -16px -16px 16px -16px;
  border-radius: 8px 8px 0 0;
}
.footer {
  background-color: #e0e0e0;
  padding: 8px;
  margin: 16px -16px -16px -16px;
  border-radius: 0 0 8px 8px;
}
.item-list {
  margin: 16px 0;
}
ul {
  padding-left: 20px;
}
li {
  margin-bottom: 4px;
}
</style>