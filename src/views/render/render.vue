<template>
  <div>
    <div class="title1">vue中render函数的使用</div>

    <Button type="danger" text="名字" size="mini"></Button>
    <Button type="warning" text="名字" size="small"></Button>
    <Button type="success" text="名字" size="mini"></Button>
    <Button type="danger" text="名字" size="medium"></Button>
    <Button type="success" text="名字" size="mini"></Button>
    <Button type="warning" text="名字" size="medium"></Button>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {},
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