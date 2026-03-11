import http from "./http";
export default {
	/**
	 * 函数防抖
	 * 触发事件立即执行，如果n秒内又触发事件，则重新计算时间
	 */
	debounce(fn, wait = 1000) {
		console.log("公共防抖");
		let timer;
		let aaa = true;
		return function() {
			let _this = this;
			let args = arguments;
			if (aaa) {
				fn.apply(_this, args);
			}
			aaa = false;
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => {
				aaa = true;
			}, wait);
		};
	},

	/**
	 * 函数节流
	 * 触发事件立即执行，但在n秒内连续触发则不执行
	 */
	throttle(fn, wait = 1000) {
		let timer;
		return function() {
			if (timer != null) return;
			let _this = this;
			let args = arguments;
			fn.apply(_this, args);
			timer = setTimeout(() => {
				timer = null;
			}, wait);
		};
	},
	// http.js 中扩展
	upload(url, file) {
		const formData = new FormData();
		formData.append("file", file);
		return http.post(url, formData, {
			headers: { "Content-Type": "multipart/form-data" }
		});
	}
};
