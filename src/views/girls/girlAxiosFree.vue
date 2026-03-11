<template>
  <div>
    <div class="btn">
      <el-button @click="getGirlBtn()" type="primary" style="z-index: 99999">得到美女图片</el-button>
    </div>
    <div>
      <h1>美女图片</h1>
      <div style="display:flex">
        <div style="width: 500px" v-for="(item, index) in imgGirlList" :key="item">
          <img @click="getOneGirl(item, index)" :src="item" alt="美女图片" style="width: 200px; height: auto" />
        </div>
      </div>
    </div>
    <girlMagnifier :girlUrl="girlUrl"></girlMagnifier>
  </div>
</template>
<script>
import axios from "axios";
import girlMagnifier from './girlMagnifier';
export default {
  components: {
    girlMagnifier
  },
  created() {
    this.getGirlBtn()
  },
  data() {
    return {
      imgGirlList: [],
      girlUrl: ''
    };
  },
  methods: {

    getGirlBtn() {
      let arr = []
      for (let i = 0; i < 3; i++) {
        arr.push(this.getGirl())
      }

      Promise.all(arr).then(result => {
        console.log('result === ', result)
        // result.forEach(val => {
        //   this.imgGirlList.push(val.data.imgurl)
        // })
        this.getOneGirl(result[0].data.url)
        this.imgGirlList = result.map(val => {
          return val.data.url
        })

      })
    },
    getGirl() {
      axios.defaults.baseURL = "http://3650000.xyz/api/?type=json&mode=1,2,3,5,7,8,9";
      return axios
        .get()
      // .then((res) => {
      //   console.log(" gire res === ", res);
      //   this.imgGirlList.push(res.data.imgurl);
      // })
      // .catch((err) => {
      //   console.log("err === ", err);
      // });
    },
    getOneGirl(item) {
      this.girlUrl = item
    }
  },
};
</script>

<style scoped>
.btn{
  text-align: right;
}
</style>