<template>
<!-- B 组件 -->
  <div>
    <h3>{{Bmsg}}</h3>
  </div>
</template>

<script>
export default {
  data(){
    return {
      Bmsg:'我是B组件',
    }
  },
  methods:{
    getMsg(msg){
      this.Bmsg = msg;
      console.log(msg);
    }
  },
  created(){
    /*
    * 接收事件
    * 这种写法也体现了：A 组件调用 B 组件中的方法。如果只是传递数据，可参考如下简化写法：
    * this.$bus.on('changeMsg', (msg) => { this.Bmsg = msg });
	*/ 
    this.$bus.on('changeMsg', this.getMsg);
    // 此侦听器只会触发一次
    this.$bus.once('doOnce', (txt) => { console.log(txt) });
  },
  // 组件销毁时，移除EventBus事件监听
  beforeDestroy() {
    this.$bus.off('changeMsg', this.getMsg);
  },
}
</script>
