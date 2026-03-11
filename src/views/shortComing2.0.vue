<template>
  <div>
    <h1>我是vue2写的效果</h1>
    <h2 v-show="person.name">姓名：{{person.name}}</h2>
    <h2>年龄：{{person.age}}</h2>
    <h2 v-show="person.sex">性别：{{person.sex}}</h2>
    <h2>爱好：{{person.hobby[0]}}</h2>
    <button @click="addSex()">添加一个sex属性</button>
    <button @click="deleteName()">删除name属性</button>
    <button @click="updateHobby()">修改第一个爱好的名字</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      person: {
        name: "张三",
        age: 18,
        hobby: ["学习", "吃饭"],
      },
    };
  },
  methods: {
    addSex() {
      // 下面的方式修改属性不生效
      // this.$nextTick(()=>{
      //   this.person.sex = '女'
      // })
      this.$set(this.person, "sex", "女");

      console.log("thie.person === ", this.person);
    },
    deleteName() {
      console.log(this.person.name);
      delete this.person.name;
      console.log(this.person.name);
      this.$delete(this.person, "name");
    },
    updateHobby() {
      // 下面这种方式修改不生效，要使用this.$set方法
      // this.person.hobby[0] = '逛街';
      // 用下面的方法
      this.$set(this.person.hobby, 0, "逛街");
      // 或者用数组替换的方法
      // this.person.hobby.splice(0, 1, "逛街");
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