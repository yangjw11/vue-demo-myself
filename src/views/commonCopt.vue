 
 <template>
  <div>
    <h1>子组件</h1>
    <!-- //在需要使用的VUE文件中引入头部: -->
    <headerTopNav ref="child"></headerTopNav>
    <!-- ========================================================== -->
    <hr>
    <h1>父组件</h1>
    <el-button type="primary" @click="changeSonAge()">点击按钮让子组件的年龄改变</el-button>
    <hr>
  </div>
</template>

 <script>
import headerTopNav from "@/components/common/header"; //引入组件
export default {
  components: { headerTopNav }, //表示headerTopNav标签的内容被headerTopNav组件代替
  data () {
    return {
      age: 28
    }
  },
  mounted(){
    console.log('父组件mounted打印')
  },
  methods: {
    changeSonAge() {
      this.$refs.child.changeAge(18);
      debugger;
      this.$refs.child.changeOther();
    }
  }
};
</script>