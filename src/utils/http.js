// src/utils/http.js
import axios from "axios";
import { Message } from "element-ui"; // 若使用 ElementUI 的提示组件

// 创建 axios 实例
const http = axios.create({
	baseURL: process.env.VUE_APP_API_BASE_URL, // 从环境变量读取基础 URL
	timeout: 10000, // 请求超时时间
	headers: {
		"Content-Type": "application/json;charset=UTF-8"
	}
});

// 请求拦截器
http.interceptors.request.use(
	config => {
		// 在发送请求前做些什么（例如添加 token）
		// 打印请求的URL
		// console.log("Request URL: 请求拦截器", config.url);
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

// 响应拦截器
http.interceptors.response.use(
	response => {
        const res = response.data;
        let url; // 请求的url参数全
        let targetURL; // url基础部分
		// 获取并打印请求的URL
        url = response.config.url
		// console.log("Request URL 响应拦截器:", response.config.url);
		// 对响应数据做处理（例如提取 data 字段）
		console.log("公共请求的response.data(res) === ", response.data);
		// 由于接口都是网络上找的，不规范，所以请求成功之后的响应体也不一样，需要各自判断,下面只是一个例子，其它接口还得添加
        // 每日英文的接口 /aaa?c=dailysentence&m=getdetail&title=
        targetURL = "/aaa?c=dailysentence&m=getdetail&title="
        if(url.includes(targetURL)) {
            if(res.errmsg === "success") {
                return res
            } else {
                Promise.reject(res);
            }
        }
		if (res.code !== 200) {
			Message.error(res.message || "请求失败");
			return Promise.reject(res);
		}
		return res;
	},
	error => {
		// 对响应错误做处理（例如 401 跳转登录）
		if (error.response.status === 401) {
			Message.error("登录过期，请重新登录");
			router.push("/login");
		} else {
			Message.error(error.message || "服务器错误");
		}
		return Promise.reject(error);
	}
);

// 封装 GET/POST 等方法
export default {
	get(url, params) {
		return http.get(url, { params });
	},
	post(url, data) {
		return http.post(url, data);
	},
	put(url, data) {
		return http.put(url, data);
	},
	delete(url) {
		return http.delete(url);
	}
};
