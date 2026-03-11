<template>
    <div style="width: 96vw; height: 96vh">
      <iframe
        :src="iframeSrc"
        width="100%"
        height="100%"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        iframeSrc: 'https://learngitbranching.js.org/?demo=&locale=zh_CN' // 替换为你需要嵌套的网页地址
      };
    }
  };
  </script>
  
  <style scoped>
  /* 可以根据需要添加样式 */
  iframe {
    border: 1px solid #ccc;
    margin-top: 20px;
  }
  </style>