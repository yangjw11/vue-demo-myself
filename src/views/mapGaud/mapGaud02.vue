<template>
  <div style="width: 800px; height: 500px">
    <div style="margin-top: 15px">
      <el-form  size="small" label-width="140px">
        <el-form-item label="关键字：">
          <el-input style="width: 300px" v-model="keyWord" placeholder="请输入关键字" id="iptId_el_input"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <Mapview :iptId="iptId_el_input"></Mapview>
  </div>
</template>
<script>
import Mapview from "./components/MapContainer02.vue";
export default {
  components: {
    Mapview,
  },
  data: function () {
    return {
      keyWord:""
    };
  },
};
</script>

<style  scoped>
</style>
