<template>
  <div>
    <!-- 文件上传组件 -->
    <el-upload
      ref="uploader"
      class="upload-demo"
      drag
      action="#"  
      :auto-upload="false"  
      :on-change="handleFileChange"
      :on-remove="handleRemove"
      :file-list="fileList"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或<em>点击选择</em>
      </div>
      <div class="el-upload__tip" slot="tip">
        单个文件不超过 10MB
      </div>
    </el-upload>

    <div style="margin-top: 20px">
      <el-button 
        size="small" 
        type="success"
        :disabled="!hasFile"
        @click="submitUpload"
      >
        手动上传
      </el-button>
      
      <!-- 新增：解析返回数据的按钮 -->
      <el-button 
        size="small" 
        type="primary"
        :disabled="!responseData"
        @click="parseResponseData"
        style="margin-left: 10px"
      >
        解析文件数据
      </el-button>
    </div>

    <!-- 新增：结果显示区域 -->
    <div v-if="responseData" style="margin-top: 20px">
      <el-collapse>
        <el-collapse-item title="返回数据详情">
          <pre>{{ JSON.stringify(responseData, null, 2) }}</pre>
        </el-collapse-item>
        
        <el-collapse-item 
          v-for="(data, filename) in parsedFiles" 
          :key="filename" 
          :title="filename"
        >
          <p>类型: {{ data.type }}</p>
          <p>大小: {{ formatSize(data.size) }}</p>
          <el-button 
            size="small" 
            @click="downloadFile(data.content, filename, data.type)"
          >
            下载文件
          </el-button>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: 'FileUpload',
  data() {
    return {
      fileList: [],         // 当前已选择的文件列表
      hasFile: false,       // 是否有文件
      responseData: null,   // 存储上传返回的JSON数据
      parsedFiles: {},      // 存储解析后的文件数据
    };
  },
  methods: {
    // 文件添加/改变回调
    handleFileChange(file, fileList) {
      // 10M 限制，10 * 1024 * 1024 = 10485760 字节
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过10MB!');
        this.hasFile = false
        return isLt10M; // 如果返回false，则停止上传
      }
      
      this.fileList = fileList;
      this.hasFile = fileList.length > 0;
    },

    // 文件移除回调
    handleRemove(file, fileList) {
      this.fileList = fileList;
      this.hasFile = fileList.length > 0;
    },

    // 手动上传
    submitUpload() {
      if (!this.hasFile) return;

      // 创建 FormData 对象准备上传
      const formData = new FormData();
      this.fileList.forEach(file => {
        formData.append('files', file.raw);
      });

      // 这里执行实际上传请求
      axios.post('/xxx', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: progressEvent => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // 这里可添加进度显示逻辑
          console.log(`上传进度: ${percent}%`);
        }
      }).then(response => {
        this.$message.success('上传成功！');
        
        // 存储返回数据
        this.responseData = response.data;
        this.parsedFiles = {}; // 清空之前解析的文件
        
      }).catch(error => {
        this.$message.error(`上传失败: ${error.message}`);
        this.responseData = null;
        this.parsedFiles = {};
      });
    },
    
    // 解析返回数据中的文件
    parseResponseData() {
      if (!this.responseData?.files) {
        this.$message.warning('返回数据中没有文件信息');
        return;
      }
      
      this.parsedFiles = {};
      
      // 处理files对象中的每个文件
      Object.entries(this.responseData.files).forEach(([filename, base64String]) => {
        try {
          // 解析DataURL
          const [header, data] = base64String.split(',');
          const mimeType = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
          
          // 解码Base64
          const byteString = atob(data);
          const byteNumbers = new Array(byteString.length);
          
          for (let i = 0; i < byteString.length; i++) {
            byteNumbers[i] = byteString.charCodeAt(i);
          }
          
          const byteArray = new Uint8Array(byteNumbers);
          
          // 存储解析结果
          this.parsedFiles[filename] = {
            type: mimeType,
            size: byteArray.length,
            content: byteArray
          };
          console.log('this.parsedFiles === ', this.parsedFiles)
        } catch (error) {
          this.$message.error(`解析文件 ${filename} 失败: ${error}`);
        }
      });
      
      if (Object.keys(this.parsedFiles).length > 0) {
        this.$message.success(`成功解析 ${Object.keys(this.parsedFiles).length} 个文件`);
      }
    },
    
    // 下载文件
    downloadFile(content, filename, mimeType) {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      // 清理
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    },
    
    // 格式化文件大小
    formatSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
  }
};
</script>

<style>
.upload-demo {
  margin-top: 20px;
}
.el-upload-dragger {
  width: 360px;
  height: 180px;
  padding: 20px;
}
</style>