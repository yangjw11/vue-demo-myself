<template>
  <div>
    <div class="title1">【父子组件通过v-model传值】</div>
    <div class="title2"></div>
    <div style="width: 100%; text-align: center;">
     father组件:{{prize}}
    </div>
    <Son :value="prize" @input="prize => this.prize = prize"/>
  </div>
</template>
<script>
import Son from './son.vue'
export default {
  components:{
    Son
  },
  data() {
    return {
     prize: 10
    };
  },
  methods: {
    changePrize(params){

      this.prize = params
    }
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