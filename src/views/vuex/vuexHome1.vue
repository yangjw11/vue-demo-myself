<template>
  <div>
    <p>{{$store.state.name}}</p>
    <p>{{$store.state.age}}</p>
    <p>从created生命周期中获取的name：{{name1}}</p>
    <p>从created生命周期中获取age：{{age1}}</p>
    <p>辅助函数{{name + age}}</p>
    <p>辅助函数{{$store.state.sum}}</p>
    <el-button type="primary" @click="btnAdd">点我增加store仓库中的sum</el-button>
    <el-button type="primary" @click="btnReduce">点我减少store仓库中的sum</el-button>
    <el-button type="primary" @click="btnReduceWait">异步（actions）点我增加store仓库中的sum</el-button>
    <el-button type="primary" @click="print">打印自定义模块下的值</el-button>
    <el-button type="primary" @click="print1">触发自定义模块下的方法改变值</el-button>
    <el-button type="primary" @click="print2">触发自定义模块下的getters</el-button>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions} from "vuex";
export default {
  data() {
    return {
      age1: '',
      name1: '',
    };
  },
  computed: {
    ...mapState(['name', 'age', 'sum']),
  },
  methods: {
    ...mapMutations(['addSum', 'reduce']),
    ...mapActions(['asyncAdd']),
    btnAdd() {
      // this.$store.commit('addSum', 100)  // 每次加100
      this.addSum(100);
    },
    btnReduce() {
      this.$store.commit('reduceSum'); // 每次减1
    },
    btnReduceWait() {
      // this.$store.dispatch('asyncAdd');
      this.asyncAdd();
    },
    print() {
     console.log('this.$store.state.a.name===', this.$store.state.a.name);
     console.log('this.$store.getters.fullname===', this.$store.getters.fullname);
    },
    print1() {
     this.$store.commit("moduleAupdname")
     console.log('this.$store.state.helloName === ', this.$store.state.helloName)
     console.log('this.$store.state.a.name === ',this.$store.state.a.name);
    },
    print2(){
      var a = this.$store.getters.fullname1
      console.log("方法this.$store.getters.fullname1的返回值 === ", a)
    }
  },
  created() {
    this.age1 = this.$store.state.age;
    this.name1 = this.$store.state.name;
  },
};
</script>