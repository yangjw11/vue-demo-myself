<template>
  <div>
    <!-- 可以将整个页面下载为pdf页面， 在id为export-content标签里面的内容， id名称可以自定义 -->
    <div id="export-content">
      <EchartsTest></EchartsTest>
    </div>
    <!-- 其他组件内容 -->
    <button @click="exportPDF">导出PDF</button>
  </div>
</template>

<script>
import html2pdf from 'html2pdf.js'
import EchartsTest from '@/views/Echarts/EchartsTest.vue'
export default {
  components: {
    EchartsTest
  },  
  methods: {
    exportPDF() {
      const options = {
        filename: 'exported-document.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'A3', orientation: 'landscape' }
      }

      const element = document.getElementById('export-content')

      html2pdf().set(options).from(element).save()
    }
  }
}
</script>
