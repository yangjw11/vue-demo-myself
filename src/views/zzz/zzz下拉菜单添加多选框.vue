<template>
    <div>
      <!-- 下拉按钮 -->
      <el-dropdown @command="handleCommand" ref="dropdown" :hide-on-click="false">
        <el-button type="primary">
          列设置<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <!-- 自定义下拉菜单内容 -->
        <el-dropdown-menu slot="dropdown">
          <el-checkbox-group v-model="selectedItems">
            <el-dropdown-item v-for="item in options" :key="item.value" :command="item.value">
              <el-checkbox :disabled="item.disabled" :label="item.value">{{ item.label }}</el-checkbox>
            </el-dropdown-item>
          </el-checkbox-group>
        </el-dropdown-menu>
      </el-dropdown>
  
      <p>已选择：{{ selectedItems.join(', ') || '无' }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        // 下拉菜单选项
        options: [
          { value: '选项1', label: '黄金糕', disabled: true},
          { value: '选项2', label: '双皮奶', disabled: false }, // 禁用此选项
          { value: '选项3', label: '蚵仔煎', disabled: false },
          { value: '选项4', label: '龙须面', disabled: false },
          { value: '选项5', label: '北京烤鸭', disabled: false }
        ],
        // 已选择的项
        selectedItems: []
      };
    },
    methods: {
      handleCommand(command) {
        // 这里可以添加额外的逻辑，例如当选项被选择时触发的动作
        console.log(`选择了 ${command}`);
      }
    }
  };
  </script>
  
  <style scoped>
  /* 添加必要的样式调整 */
  .el-dropdown-menu__item {
    padding-right: 30px; /* 确保复选框有足够空间显示 */
  }
  </style>