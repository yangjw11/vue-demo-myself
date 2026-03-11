<template>
  <div class="all">
    <!-- 饼状图pie -->
    <div>
      <pie/>
    </div>
    <!-- 柱状图 -->
    <div>
      <bar/>
    </div>
    <!-- 折线图堆叠 -->
    <div>
      <stackedLine/>
    </div>
  </div>
</template>
<script>
import pie from './pie.vue'
import bar from './bar.vue'
import stackedLine from "./stackedLine.vue"
export default {
  components:{
    pie,
    bar,
    stackedLine
  },
  data() {
    return {};
  },
 
  mounted() {
    
  },
  methods: {
    
  }
};
</script>
<style scoped>
  .all{
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-around;
    flex-direction:column
  }
</style>

