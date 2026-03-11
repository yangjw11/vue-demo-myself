<template>
	<div>
		<div class="title1">随机一张天文图片和图片说明</div>
		<div class="title2"></div>
		<div class="content">
			<!-- 英文区域 -->
			<div class="enArea">
				<div>
					<el-button type="primary" @click="getImgInfo" :loading="btnLoading">点击随机获取一张天文图</el-button>
					<el-button type="primary" @click="changeToZh" :loading="btnLoading">切换为中文</el-button>
					<el-button type="primary" @click="changeToEn" :loading="btnLoading">切换为英文</el-button>
				</div>
				<div class="title">
					<h1 v-if="!showChinese">{{ imgTitle_en }}&nbsp;&nbsp;&nbsp;&nbsp; Picture date：{{ picDate }}</h1>
					<h1 v-else>{{ imgTitle_zh }}&nbsp;&nbsp;&nbsp;&nbsp; 拍摄日期：{{ picDate }}</h1>
				</div>
				<div class="detail">
					<div class="imgArea">
						<img :src="imgSrc" alt="天文图片" />
					</div>
					<div v-if="!showChinese" class="wordDsc">
						{{ imgDetail_en }}
						<div class="search">
							<div class="searchBtn">
								<el-button @click="getWordZh(wordEn)" type="primary" :loading="btnLoading">查询</el-button>
							</div>
							<div class="searchIpt">
								<el-input v-model="wordEn" placeholder="只能查询一个单词" @keyup.enter.native="getWordZh(wordEn)"></el-input>
							</div>
						</div>
						<!-- 下面是单词查询结果 -->
						<div class="translate" v-if="showOneWordTranslate">
							<h3>{{ word }}</h3>
							<h4>音标：{{ accent }}</h4>
							<h4>中文释义：{{ mean_cn }}</h4>
							<h4>英文释义：{{ mean_en }}</h4>
							<h4>造句：{{ sentence }}</h4>
							<h4>翻译：{{ sentence_trans }}</h4>
						</div>
						<div v-if="showFinally">
							<h2>{{ word }}</h2>
							<h2>{{ finallyResult }}</h2>
						</div>
					</div>
					<div v-else class="wordDsc">
						{{ imgDetail_zh }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import axios from "axios";
export default {
	created() {
		this.getImgInfo();
	},
	data() {
		return {
			imgSrc: "", // 图片地址
			imgDetail_en: "", // 图片英文说明
			imgDetail_zh: "", // 图片中文说明
			imgDate: "", // 图片日期
			imgTitle_en: "", // 图片英文标题
			imgTitle_zh: "", // 图片中文标题
			showChinese: false, // 是否显示翻译区域
			btnLoading: false,
			picDate: "", // 图片拍摄日期
			wordEn: "", // 需要查询的英语单词（输入框）
			word: "", // 需要查询的英语单词（查询结果）
			mean_cn: "", // 中文释义
			mean_en: "", // 英文释义
			sentence: "", // 英文造句
			sentence_trans: "", // 英文造句的中文翻译
			accent: "", // 查询的英语音标
			showOneWordTranslate: false, // 是否显示查询单个单词的查询结果
			showFinally: false, // 最终翻译结果
			finallyResult: ""
		};
	},
	methods: {
		getImgInfo() {
			this.btnLoading = true;
			this.showOneWordTranslate = false;
			this.showFinally = false;
			axios
				.get(`https://api.nasa.gov/planetary/apod?api_key=${this.globalConfig.apiKey_planetary}&count=1`)
				.then(res => {
					console.log("res === ", res);
					this.showChinese = false;
					this.imgSrc = res.data[0].hdurl; // 图片地址
					this.imgDetail_en = res.data[0].explanation;
					this.imgTitle_en = res.data[0].title;
					this.picDate = res.data[0].date;
					this.imgTitle_zh = "";
					this.imgDetail_zh = "";
					this.btnLoading = false;
				})
				.catch(err => {
					this.showChinese = false;
					this.btnLoading = false;
					console.log("err === ", err);
				});
		},
		async changeToZh() {
			this.btnLoading = true;
			if (this.imgDetail_zh || this.imgTitle_zh) {
				this.showChinese = true;
				this.btnLoading = false;
			} else {
				try {
					// let url1 = `https://v.api.aa1.cn/api/api-fanyi-yd/index.php?msg=${this.imgTitle_en}&type=2`;
					// let url2 = `https://v.api.aa1.cn/api/api-fanyi-yd/index.php?msg=${this.imgDetail_en}&type=2`
					// let url1 = `/nnn?msg=${this.imgTitle_en}`;
					// let url2 = `/nnn?msg=${this.imgDetail_en}`;
					let url1 = `https://api.lolimi.cn/API/qqfy/api?type=json&msg=${this.imgTitle_en}`
					let url2 = `https://api.lolimi.cn/API/qqfy/api?type=json&msg=${this.imgDetail_en}`
					// let url1 = `https://suapi.net/api/text/translate?to=zh&text[]=${this.imgTitle_en}&text[]=${this.imgDetail_en}`;
					// let url2 = `https://suapi.net/api/text/translate?to=zh&text[]=${this.imgTitle_en}&text[]=${this.imgDetail_en}`


					// let url1 = `/vvv?msg=${this.imgTitle_en}`
					// let url2 = `/vvv?msg=${this.imgDetail_en}`
					// let url2 = `https://v.api.aa1.cn/api/api-fanyi-yd/index.php?msg=${this.imgTitle_en}&type=2`
					// let url2 = `https://v.api.aa1.cn/api/api-fanyi-yd/index.php?msg=${this.imgDetail_en}&type=2`
					// const res1 = axios.get(url1);
					// const res2 = axios.get(url2);
					// const res2 = new Promise((resolve,reject)=>{
					//     setTimeout(()=>{
					//         resolve(axios.get(url2))
					//     },2000)
					// })
					// 翻译标题
					// let url1 = `https://v.api.aa1.cn/api/api-fanyi-yd/index.php?msg=${this.imgTitle_en}&type=2`
					// 翻译文本
					// let url2 = `https://v.api.aa1.cn/api/api-fanyi-yd/index.php?msg=${this.imgDetail_en}&type=2`
					let res1 = axios.get(url1);
					let res2 = axios.get(url2);
					// 使用 Promise.all 同时发送请求
					const resAll = await Promise.all([res1, res2]);
					console.log("resAll === ", resAll);
					this.imgTitle_zh = resAll[0].data.text
					this.imgDetail_zh = resAll[1].data.text
					this.showChinese = true;
					this.btnLoading = false;
				} catch (error) {
					this.showChinese = false;
					this.btnLoading = false;
					console.log("error === ", error);
				}
			}
		},
		changeToEn() {
			console.log(1111);
			this.showChinese = false;
		},
		// 将英语单词翻译为中文以及详细示意
		getWordZh(str) {
			let firstWord = this.handleContent(str);
			this.btnLoading = true;
			this.showFinally = false;
			axios
				.get(`/ooo?word=${firstWord}`)
				.then(res => {
					console.log("res === ", res);
					if (res.data.code === 200) {
						const { data } = res.data;
						console.log("data === ", data);
						this.word = data.word; // 查询的单词
						this.accent = `[${data.accent}]`; // 音标
						this.mean_cn = data.mean_cn; // 中文释义
						this.mean_en = data.mean_en; // 英文释义
						this.sentence = data.sentence; // 英文造句
						this.sentence_trans = data.sentence_trans; // 造句的中文翻译
						this.btnLoading = false;
						this.showOneWordTranslate = true;
						this.showFinally = false;
					} else {
						throw new Error(res.data.data);
					}
				})
				.catch(err => {
					this.btnLoading = false;
					this.showOneWordTranslate = false;
					this.transLateToCn(firstWord); // 再查一次
					this.$message.error(err);
				});
		},
		handleContent(str) {
			// 定义一个正则表达式来匹配所有的标点符号，包括单双引号
			const punctuationRegex = /[\u2000-\u206F\u3000-\u303F\uFF00-\uFFEF!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g;
			// 移除首尾空白字符
			str = str.trim();
			// 如果字符串被单引号或双引号包围，移除它们
			if ((str.startsWith("'") && str.endsWith("'")) || (str.startsWith('"') && str.endsWith('"'))) {
				str = str.substring(1, str.length - 1);
			}
			// 使用replace()方法和正则表达式移除所有标点符号
			const cleanedStr = str.replace(punctuationRegex, "");
			// 使用split()方法分割字符串为单词数组，并取第一个元素作为结果
			const firstWord = cleanedStr.split(/\s+/)[0];
			return firstWord;
		},
		async transLateToCn(str) {
			// surprisingly 这个单词在四六级接口查不到。用作测试，下面两个接口目前都可以用 digitally
			this.showFinally = false;
			// 第一个接口
			// try {
			// 	let url1 = `https://api.pearktrue.cn/api/word/english/parse.php?word=${str}`;
			// 	let allres = await axios.get(url1);
			// 	console.log("allres === ", allres);
			// 	this.finallyResult = allres.data.data[0].translations[0].text;
			// 	this.showFinally = true;
			// } catch (error) {
			// 	this.showFinally = false;
			// 	console.log(error);
			// }
			// 第二个接口
			try {
				let url1 = `https://api.pearktrue.cn/api/word/english/parse.php?word=${str}`;
				let allres = await axios.get(url1);
				console.log("allres === ", allres);
				if (allres.data.code === 200) {
					this.finallyResult = allres.data.definition;
					this.word = allres.data.word;
					this.showFinally = true;
				} else {
					throw new Error(allres.data.msg);
				}
			} catch (err) {
				this.showFinally = false;
                this.lastTranslate(str)
				console.log(err);
				this.$message.error(err);
			}
		},
        // 第三次翻译
        // digitally
        async lastTranslate(str){
            let url1 = `/qqq?q=${str}&num=1&doctype=json`;
            try {
				let res = await axios.get(url1);
				console.log("res === ", res);
                
				if (res.data.result.code === 200) {
					this.word = res.data.data.entries[0].entry
					this.finallyResult = res.data.data.entries[0].explain
					this.showFinally = true;
				} else {
					throw new Error(res.data.msg);
				}
			} catch (err) {
				this.showFinally = false;
				console.log(err);
				this.$message.error(err);
			}
        }
		// 下面的方法值得借鉴 =================================================
		// async changeToZh() {
		// 	// 如果有中文标题或中文详情，不走接口直接切换
		// 	if (this.imgDetail_zh || this.imgTitle_zh) {
		// 		this.showChinese = true;
		// 	} else {
		// 		try {
		// 			let detailList = this.imgDetail_en
		// 				.split(".")
		// 				.map(item => item.trim())
		// 				.filter(Boolean);
		// 			detailList.unshift(this.imgTitle_en)
		//             let resAll = await this.fetchItemsByIdsWithDelay(detailList, 1000)
		//             console.log('resAll === ', resAll)
		// 		} catch (error) {
		// 			this.showChinese = false;
		// 			console.log("error === ", error);
		// 		}
		// 	}
		// },
		// changToEn() {
		// 	this.showChinese = false;
		// },
		// async fetchItemsByIdsWithDelay(ids, delay = 1000) {
		// 	const results = [];
		// 	for (let i = 0; i < ids.length; i++) {
		// 		try {
		// 			// 发送请求并等待响应
		// 			const response = await this.fetchItemById(ids[i]);
		// 			results.push(response);

		// 			// 如果不是最后一个元素，则等待指定的延迟时间
		// 			if (i < ids.length - 1) {
		// 				await new Promise(resolve => setTimeout(resolve, delay));
		// 			}
		// 		} catch (error) {
		// 			console.error("An error occurred while fetching item:", error);
		// 			// 根据你的需求决定是否在遇到错误时停止执行或继续
		// 			// 这里选择继续执行剩余的请求
		// 		}
		// 	}
		// 	return results;
		// },
		// fetchItemById(item) {
		// 	// 模拟一个异步操作（例如：向服务器发送请求）
		// 	return axios.get(`/mmm?text=${item}&target_lang=zh`)
		// 		.then(response => {
		// 			if (!response.status == "200") {
		// 				throw new Error(`Network response was not ok for item: ${item}`);
		// 			}
		// 			// return response.json(); // 假设API返回的是JSON格式的数据
		//             console.log('response === ', response)
		//             return response
		// 		})
		// 		.catch(error => {
		// 			console.error("Fetch failed for item:", item, "Error:", error);
		// 			throw error; // 确保Promise链中的错误能够被fetchItemsByIdsWithDelay捕获
		// 		});
		// }
	}
};
</script>

<style scoped lang="scss">
.title1 {
	width: 100%;
	text-align: center;
	font-size: 32px;
	font-weight: 500;
	color: #ff0000;
}
.title2 {
	width: 100%;
	text-align: center;
	font-size: 16px;
	font-weight: 500;
	color: #000000;
}
.content {
	width: 100%;
}

.enArea {
	.title {
		// text-align: center;
	}
	.detail {
		width: 100%;
		display: flex;
		justify-content: space-between;
		.imgArea {
			width: 70%;
			img {
				width: 100%;
				object-fit: contain;
			}
		}
		.wordDsc {
			width: 28%;
			.search {
				margin-top: 20px;
				justify-content: space-around;
				width: 100%;
				display: flex;
				.searchBtn {
					width: 20%;
				}
				.searchIpt {
					width: 70%;
				}
			}
		}
	}
}
</style>
