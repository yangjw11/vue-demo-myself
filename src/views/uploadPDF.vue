<template>
  <div class="app-container">
    <!-- 上传 -->
    <div class="UploadBox">
      <PDFuploading
        @fileId="fileListFn"
        :is-width="'80%'"
        :is-true="istrue"
        :up-loads="upLoads"
        :limitQuantity="1"
        @disabledBtn="disFn"
        file-format=".pdf,.PDF"
      />
    </div>
  </div>
</template>
    
    <script>
import PDFuploading from "../components/PDFuploading.vue";
export default {
  name: "PagePermission",
  components: { PDFuploading },
  data() {
    return {
      istrue: false,
      upLoads: true
    };
  },

  methods: {
    // 文件大于5mb禁用按钮
    disFn(res) {
      // console.log(res);
      this.disisTrue = res;
    },
    // 图片上传返回的列表
    fileListFn(fileList) {
      this.fileList = fileList;
      // 在上传图片下
      if (this.fileList.length == 1) {
        let imgList = [];
        this.fileList.map((res) => {
          imgList.push(res.url);
        });
		//接口位置
        this.fileList = [];
        this.istrue = true;
      } else {
        this.$message({ type: "error", message: "请先上传文件" });
      }
    },
  },
};
</script>
   

