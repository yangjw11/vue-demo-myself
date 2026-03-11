<template>
  <div>
    <div class="title1">vue中的nextTick方法</div>
    <div class="title2">参照CSDN</div>
    <p id="msg">{{message}}</p>
    <button @click="change">更新</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      message: "Hello Vue!",
    };
  },
  methods: {
    change() {
      this.message = "This is new message!";
      console.log("this.message === ", this.message);
      console.log(
        "not nextTick() document === :",
        document.getElementById("msg").innerHTML
      );

      this.$nextTick(() => {
        console.log(
          "use nextTick():",
          document.getElementById("msg").innerHTML
        );
      });
      
      // 或者可以使用setTimeout
      setTimeout(() => {
        console.log(
          "use setTimeout():",
          document.getElementById("msg").innerHTML
        );
      });
    },
  },
};
</script>

<style scoped>
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
.btn_item {
  display: flex;
  /* 让按钮区域自动换行 */
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin-top: 50px;
  width: 100%;
  text-align: center;
}
.btn_Item .item {
  margin-left: 10px;
  margin-top: 20px;
}
.item1 {
  width: 100px;
  height: 50px;
  margin-left: 200px;
  margin-top: 100px;
  border-radius: 10px;
  background-color: #09b9ee;
}
.children {
  width: 1000px;
  height: 1000px;
  background-color: #caa452;
}
</style>