exports.install = function (Vue, options) {
  Vue.prototype.$globalClick = function () {
    console.log('调用了在main.js注册的js文件的全局方法')
  }
  Vue.prototype.$globalClick2 = function () {
    console.log('继续调用了在main.js注册的js文件的全局方法')
  }
  Vue.prototype.$checkElInput = function (e) {
    var keynum = window.event ? e.keyCode : e.which; // 获取键盘码
    if (keynum == 189 || keynum == 190 || keynum == 109 || keynum == 110) {
      this.$message.warning('禁⽌输⼊⼩数以及负数hahahahaha');
      e.target.value = '';
    }
  }
  // Vue.prototype.$debounce = function (fn, wait = 1000) {
  //   let timer;
  //   let aaa = true;
  //   return function () {
  //     let _this = this;
  //     let args = arguments;
  //     if (aaa) {
  //       fn.apply(_this, args);
  //     }
  //     aaa = false
  //     if (timer) clearTimeout(timer);
  //     timer = setTimeout(() => {
  //       aaa = true
  //     }, wait)
  //   }
  // }
}