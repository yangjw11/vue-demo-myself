<template>
  <div>
    <div class="title1">【this.$set方法的使用详解】</div>
    <div class="title2">【详情请看项目代码】</div>
    <div style="width: 100%; text-align: center;">
      <div class="text">
        <h5>展示对象</h5>
        <p>{{list}}</p>
        <button @click="add">age++</button>
      </div>
      <div class="text">
        <h5>展示数组</h5>
        <ul>
          <li v-for="(item, index) in arr" :key="index">{{item}}</li>
        </ul>
        <button @click="changeArr">将“杨二”改为“赵六”</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: { name: "张三" },
      arr: ["张三", "李四", "王五", "杨二"],
    };
  },
  methods: {
    add() {
      if (!this.list.age) {
        // 如果没有age属性就给它添加一个age属性
        // this.list.age = 18; // 这行代码不能响应式
        this.$set(this.list,'age',18)
      } else {
        this.list.age++;
      }
      console.log("this.list === ", this.list);
      console.log('this.list["name"] === ', this.list['name'])
    },
    changeArr() {
      // this.arr[3] = '赵六' // 这行代码不能响应式
      this.$set(this.arr, 3, "赵六");
      console.log("this.arr === ", this.arr);
    },
  },
};
</script>

<style>
.title1 {
  width: 100%;
  text-align: center;
  font-size: 32px;
  font-weight: 500;
  color: #ff0000;
}
.title2 {
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #000000;
}
</style>