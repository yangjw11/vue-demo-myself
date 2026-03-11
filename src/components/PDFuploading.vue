<template>
  <div class="PDFuploading">
    <el-upload
      ref="upload"
      class="upload-demo"
      :action="actionsUrl"
      :on-success="successFn"
      :on-exceed="onExceed"
      :before-upload="beforeUpload"
      :before-remove="beforeRemove"
      :on-change="onChangeFn"
      :auto-upload="false"
      :file-list="fileLists"
      :on-error="onErrorFn"
      :accept="fileFormat"
      :limit="limitQuantity"
      drag
      multiple
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" style="font-size: 14px" slot="tip">
        只能上传 {{ strString }} 文件，一次性最多上传
        {{ limitQuantity }} 个文件，每个文件不得超过 {{ sizeLimit }}MB
      </div>
    </el-upload>
  </div>
</template>

<script>
import { debounce } from "../utils/antiShake";
export default {
  data() {
    return {
      fileList: [], // 图片路径列表
      fileIdList: [], // 存储上传图片后的id值
      fileSize: 2097152, // 上传文件最大值 2MB=2097152  5MB=5242880
      limitList: [], // 选中的文件
      errList: [], //上传失败
      strString: "",
      fileLists: [], // 选中列表文件
    };
  },
  watch: {
    isTrue(item, item1) {
      console.log("清除上传图片");
      this.fileList = [];
      this.fileIdList = [];
      this.limitList = [];
      this.fileLists = [];
    },
    upLoads(item, items) {
      if (!this.fileLists.length) {
        this.$message({ type: "error", message: "请选择上传的文件" });
      }
      this.$refs.upload.submit();
    },
  },
  props: {
    // 上传路径 默认是系统设置里面的路径
    actionsUrl: {
      type: String,
      require: false,
      default:"www.baidu.com",//上传路径
    },
    // 判断弹框是否关闭清空数据
    isTrue: {
      type: Boolean,
      require: false,
      default: "false",
    },
    // 图片宽度大小
    isWidth: {
      type: String,
      require: false,
    },
    // 这个状态改变的时候就是上传图片所以是必填
    upLoads: {
      type: Boolean,
      require: true,
    },
    // 文件格式
    fileFormat: {
      type: String,
      require: false,
      default: ".jpg,.mp4,.gif,.pdf,.JPG,.MP4,.GIF,.PDF",
    },
    // 限制数量
    limitQuantity: {
      type: Number,
      require: false,
      default: 5,
    },
    // 文件大小限制
    sizeLimit: {
      type: Number,
      require: false,
      default: 2,
    },
  },
  mounted() {
    // 图片上传宽度
    if (this.isWidth !== undefined) {
      let PDFuploading = document.querySelector(".PDFuploading");
      PDFuploading.style.width = this.isWidth;
    }
  },
  created() {
    let str = this.fileFormat.split(",");
    this.strString = str.join(" ");
    // console.log(this.FileFormat);
    let num = this.sizeLimit * 1024 * 1024;
    this.fileSize = num;
  },
  methods: {
    // 选中的图片
    onChangeFn(e, fileList) {
      console.log(e);
      this.limitList = fileList;
      this.fileLists = this.fileLists.length ? this.fileLists : [];
      // this.limitList.push(e);
      this.limitFn();
    },

    // 文件列表删除效果
    beforeRemove(file, fileList) {
      console.log(file, fileList);
      let list = fileList.filter((res) => {
        return res.name !== file.name;
      });
      this.fileLists = list;
    },

    // 文件上传之前的钩子
    beforeUpload(file) {
      console.log(file);
    },

    // 图片上传成功时的钩子
    successFn(response, file, fileList) {
      // console.log(response, file, fileList);
      this.fileIdList = fileList;
      this.fileLsitfn();
    },

    // 文件上传失败时的钩子
    onErrorFn(err, file, fileList) {
      if (err.type === "error") {
        this.errList.push(file);
      }
      this.errorFn();
    },

    // 上传失败
    errorFn: debounce(function () {
      let errArr = [];
      this.errList.map((res) => {
        errArr.push(res.name);
      });
      this.$message({
        type: "error",
        message: `${errArr.map((res) => {
          return res + "/";
        })}上传失败`,
      });
    }, 500),

    limitFn: debounce(function () {
      let list = [],
        testList = [];
      // console.log(this.limitList);
      this.limitList.map((res) => {
        let name = res.name.substr(-4, 4);
        // 获取传递过来的文件要求
        let arr = this.fileFormat.split(",");
        let index = arr.map((item) => {
          return name !== item;
        });
        // 文件限制2MB和文件要求
        if (
          res.size < this.fileSize &&
          !index.every((items) => {
            return items === true;
          })
        ) {
          testList.push(res);
        } else {
          list.push(res);
        }
      });
      if (list.length)
        this.$message({
          type: "error",
          message: `只能上传  ${this.strString}  文件，每张不得超过 ${this.sizeLimit}MB,`,
        });
      // console.log(testList);
      this.fileLists = testList;
    }, 500),

    // 上传完之后添加列表
    fileLsitfn: debounce(function () {
      let list = [];
      this.fileIdList.map((res) => {
        // console.log(res);
        list.push({
          status: res.status,
          name: res.name,
          url: res.response.data[0].fileId,
        });
      });
      this.fileList = list;
      this.$emit("fileId", this.fileList);
    }, 500),

    // 上传超过限制的提示
    onExceed(files, fileList) {
      this.$message({
        type: "error",
        message: `上传的图片超过最大限制，一次性最多上传${this.limitQuantity}张`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.PDFuploading {
  // width: 80%;
  ::v-deep .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
    }
  }
}
</style>
