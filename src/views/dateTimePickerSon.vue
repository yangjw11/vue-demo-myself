<template>
  <div>
    isopen: {{ isOpen }}
    {{ info }}
    <el-button type="primary" @click="updateISOpen()" style="margin-top: 20px;">updateISOpen</el-button>
    <el-button type="primary" @click="updateISOpenq()" style="margin-top: 20px;">updateISOpen2</el-button>
    <el-button type="primary" @click="updateISOpen3()" style="margin-top: 20px;">updateISOpen3</el-button>
    <el-button type="primary" @click="updateInfo()" style="margin-top: 20px;">info</el-button>

  </div>
</template>
<script>
export default {
  props: ['isOpen', 'info'],
  data() {
    return {

    };
  },
  methods: {
    updateISOpen() {
      this.$emit('update:isOpen', true)
    },
    updateISOpenq() {
      this.$emit('setIsOpen')
    },
    updateISOpen3() {
      this.$parent.isOpen = !this.$parent.isOpen
    },
    updateInfo() {
      this.info.name = "lisi"
    }
  },
};
</script>