<template>
    <div>
      <quill-editor v-model="content" ref="myQuillEditor" :options="editorOption"></quill-editor>
      <p>字数: {{ wordCount }}</p>
    </div>
  </template>
  
  <script>
  import { QuillEditor } from '@vueup/vue-quill';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';
  
  export default {
    components: {
      QuillEditor
    },
    data() {
      return {
        content: '', // 富文本内容
        editorOption: {
          theme: 'snow',
          placeholder: '请输入内容...',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ header: 1 }, { header: 2 }],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ script: 'sub' }, { script: 'super' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ direction: 'rtl' }],
              [{ size: ['small', false, 'large', 'huge'] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ color: [] }, { background: [] }],
              [{ font: [] }],
              [{ align: [] }],
              ['clean'],
              ['image'] // 添加图片按钮
            ]
          }
        }
      };
    },
    computed: {
      wordCount() {
        // 将 HTML 内容转换为纯文本
        let text = this.content.replace(/<[^>]+>/g, '');
        // 计算纯文本的长度
        let count = text.length;
  
        // 计算图片的数量
        const images = this.content.match(/<img[^>]+>/g) || [];
        count += images.length;
  
        return count;
      }
    },
    methods: {
      onEditorBlur(quill) {
        console.log('editor blur!', quill);
      },
      onEditorFocus(quill) {
        console.log('editor focus!', quill);
      },
      onEditorReady(quill) {
        console.log('editor ready!', quill);
      }
    }
  };
  </script>
  
  <style scoped>
  /* 添加一些样式 */
  .quill-editor {
    height: 300px;
  }
  </style>