<template>
  <div>
    <moduleSun :chartData="item" v-for="(item,index) in chartData" :key="index" />
    <el-button @click="goSon()">点击查看子组件</el-button>
  </div>
</template>
 
<script>
import moduleSun from "./son.vue";
export default {
  components: { moduleSun },
  data() {
    return {
      chartData: [
        {
          nameCN: "111",
          nameEN: "en111",
          remarks: "我是111",
          children: [
            {
              nameCN: "222",
              nameEN: "en222",
              remarks: "我是222",
              children: [
                {
                  nameCN: "222-111",
                  nameEN: "en222-111",
                  remarks: "我是222-111",
                },
              ],
            },
            {
              nameCN: "333",
              nameEN: "en333",
              remarks: "我是333",
            },
          ],
        },
      ],
    };
  },
  methods:{
    goSon(){
      this.$router.push({path:'/selfCallson'})
    }
  }
};
</script>