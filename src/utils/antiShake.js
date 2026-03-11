/**
 * 函数防抖
 * 触发事件立即执行，如果n秒内又触发事件，则重新计算时间
 */
function debounce(fn, wait = 1500) {
	let timer;
	let aaa = true;
	return function() {
		let context = this;
		let args = arguments;
		if (aaa) {
			fn.apply(context, args);
		}
		aaa = false
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			aaa = true
		}, wait)
	}
};

/**
 * 函数节流
 * 触发事件立即执行，但在n秒内连续触发则不执行
 */
function throttle(fn, wait = 1000) {
	let timer;
	return function() {
		if (timer != null) return;
		let context = this;
		let args = arguments;
		fn.apply(context, args);
		timer = setTimeout(() => {
			timer = null;
		}, wait);
	}
};

module.exports = {
	debounce,
	throttle
}
