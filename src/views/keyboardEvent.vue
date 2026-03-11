<template>
  <div>
    <div class="title1">键盘事件</div>
    <div class="title2"></div>
    <div style="width: 100%; text-align: center;">
      <input type="text" placeholder="按下回车提示输入" @keyup="showInfo" />
      {{text || '数据有误'}}
      <span>{{Number(num) || '暂无数据'}}</span>
      <div>
        {{infoList[0]['name']}}
        {{infoList[1]['name']}}
      </div>
      
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      text: "",
      num: "",
      infoList: [
        {
          name: "张三",
        },
        {
          name: "李四",
        },
      ],
    };
  },
  methods: {
    showInfo(e) {
      // enter键的keyCode是13
      console.log("e===", e);
      console.log("e.keyCode===", e.keyCode);
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