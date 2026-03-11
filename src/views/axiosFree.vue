<template>
  <div>
    <div>
      <el-button @click="getPhotos()" type="primary">点击获取照片列表</el-button>
      <el-button @click="getPosts()" type="primary">获取100篇文章数据</el-button>
      <el-button @click="getCat()" type="primary">得到十张猫的图片</el-button>
      <el-button @click="getDog()" type="primary">得到十张狗的图片</el-button>
    </div>
    <div>
      <h1>猫的图片</h1>
      <div style="display:flex">
        <div style="width: 500px" v-for="(item, index) in imgCatlist" :key="item.id">
          <img :src="item.url" alt="猫的图片" style="width: 200px; height: auto" />
        </div>
      </div>
      <h1>狗的图片</h1>
      <div style="display:flex">
        <div style="width: 500px" v-for="(item, index) in imgDogList" :key="item">
          <img :src="item" alt="狗的图片" style="width: 200px; height: auto" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
export default {
  created() {
    axios.defaults.baseURL = "http://jsonplaceholder.typicode.com";
    this.getCat();
    this.getDog();
  },
  data() {
    return {
      imgCatUrl: "",
      imgDogUrl: "",
      imgCatlist: [],
      imgDogList: []
    };
  },
  methods: {
    getPhotos() {
      axios
        .get("/photos")
        .then((res) => {
          console.log("res === ", res);
        })
        .catch((err) => {
          cosole.log("err === ", err);
        });
    },
    getPosts() {
      axios
        .get("/posts")
        .then((res) => {
          console.log("res === ", res);
        })
        .catch((err) => {
          cosole.log("err === ", err);
        });
    },
    getCat() {
      axios.defaults.baseURL =
        "https://api.thecatapi.com/v1/images/search?limit=2";
      axios
        .get()
        .then((res) => {
          console.log("res === ", res);
          this.imgCatlist = res.data;
        })
        .catch((err) => {
          cosole.log("err === ", err);
        });
    },
    getDog() {
      axios.defaults.baseURL = "https://dog.ceo/api/breeds/image/random/10";
      axios
        .get()
        .then((res) => {
          console.log(" dog res === ", res);
          this.imgDogList = res.data.message;
        })
        .catch((err) => {
          cosole.log("err === ", err);
        });
    },
  },
};
</script>

<style>
</style>