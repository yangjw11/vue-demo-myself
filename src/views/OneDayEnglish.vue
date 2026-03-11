<!--
 * @Author: yangJianWei yangjianwei@chexiao.co
 * @Date: 2026-01-08 17:10:16
 * @LastEditors: yangJianWei yangjianwei@chexiao.co
 * @LastEditTime: 2026-03-11 09:50:54
 * @FilePath: \vue-demo-myself\src\views\OneDayEnglish.vue
 * @@Description: 
-->
<template>
	<div>
		<div class="title1">【每日英语】</div>
		<div class="block">
			<span class="demonstration">选择日期</span>
			<el-date-picker v-model="choseDate" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions"
				@change="changeDate"> </el-date-picker>
			<div class="audio">
				<audio id="audio" :src="audioSrc" ref="audio" @ended="onAudioEnded"></audio>
			</div>
			<el-button type="primary" @click="getWord" :loading="btnLoading">随机获取一个单词</el-button>
			<div class="word" v-show="showWord">
				<h2>{{ word }}</h2>
				<div>
					<span class="tip1">音标：</span>
					<span>{{ accent }}</span>
				</div>
				<div>
					<span class="tip1">中文释义：</span>
					<span>{{ mean_cn }}</span>
				</div>
				<div>
					<span class="tip1">英文释义：</span>
					<span>{{ mean_en }}</span>
				</div>
				<div>
					<span class="tip1">造句：</span>
					<span> {{ sentenceWord }}</span>
				</div>
				<div>
					<span class="tip1">造句翻译：</span>
					<span> {{ sentence_trans }}</span>
				</div>
				<div>
					<span class="tip1">词源：</span>
					<span> {{ word_etyma || "--" }}</span>
				</div>
			</div>
			<div class="content">
				<div>
					<el-button @click="togglePlayPause">
						{{ isPlaying ? "暂停" : "播放" }}
					</el-button>
					<span class="sentence">{{ sentence }}</span>
				</div>
				<div>
					{{ note }}
				</div>
			</div>
			<div class="imgArea">
				<img :src="picture" alt="" />
				<img :src="picture3" alt="" />
				<img :src="picture2" alt="" />
			</div>
		</div>
		<div class="bing">
			<div v-if="isShowChoseDateImg">
				<h1>{{ bingTitle }}({{ choseDate }})</h1>
				<img :src="choseBingSrc" alt="" />
			</div>
			<!-- <h1>必应每日图片({{ currentDate }})</h1>
			<img src="https://www.yumus.cn/api/?target=img&brand=bing&ua=pc" alt="" /> -->
			<h1>{{ currentTitle }}（4K高清）({{ currentDate }})</h1>
			<!-- <img src="https://www.yumus.cn/api/?target=img&brand=bing&ua=uhd" alt="" /> -->
			<img :src="bingSrc" alt="" />
		</div>
	</div>
</template>
<script>
import axios from "axios";
import copy from "copy-to-clipboard";
import _ from "lodash";

import { calculateDays, getFormattedDateTime, getFormattedDate,formatDate_ } from "@/utils/index.js";
export default {
	created() {
		this.choseDate = getFormattedDate();
		this.getSentence(this.choseDate);
		// this.getPicture();
		this.getBingPicture(0, formatDate_(new Date()));
		this.getBingPictureUHD()
	},
	mounted() {
		console.log("choseDate === ", this.choseDate);
	},
	data() {
		return {
			sentence: "",
			audioSrc: "", // 音频文件的路径
			isPlaying: false, // 控制音频播放状态
			textToCopy: null,
			note: "", // 译文
			choseDate: "", // 默认日期是
			choseBingSrc: "", // 选中日期的bing图片地址
			bingTitle: "", // 选中日期的bing图片描述
			currentTitle: "", // 当前日期的bing图片描述
			isShowChoseDateImg: false, // 是否显示选中日期的bing图片
			currentDate: getFormattedDateTime().ymd,
			picture: "",
			picture2: "",
			picture3: "",
			pickerOptions: {
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
				shortcuts: [
					{
						text: "今天",
						onClick(picker) {
							picker.$emit("pick", new Date());
						}
					},
					{
						text: "昨天",
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24);
							picker.$emit("pick", date);
						}
					},
					{
						text: "一周前",
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit("pick", date);
						}
					}
				]
			},
			word: "", // 随机生成的英文单词和翻译
			mean_cn: "", // 单词的中文释义
			mean_en: "", // 单词的英文释义
			sentenceWord: "", // 单词的英文造句
			sentence_trans: "", // 单词的英文造句的中文翻译
			word_etyma: "", // 单词的词源
			accent: '', // 音标
			btnLoading: false,
			showWord: false,
			bingSrc: "", // 必应每日图片4k高清图片地址
			queryTimes: 0, // 请求次数
		};
	},
	methods: {
		getSentence(params) {
			axios
				.get(`/aaa?c=dailysentence&m=getdetail&title=${params}`)
				.then(res => {
					console.log("res === ", res);
					this.audioSrc = res.data.tts;
					this.textToCopy = JSON.stringify(res.data.result);
					this.sentence = res.data.content;
					this.picture = res.data.picture;
					this.picture2 = res.data.picture2;
					this.picture3 = res.data.picture3;
					this.note = res.data.note;
					// this.copyToClipboard() // 复制插件没生效
					this.copyToClipboard();
					// 新增自动播放逻辑
					this.$nextTick(() => {
						const audio = this.$refs.audio;
						if (audio) {
							audio.play().catch(error => {
								console.error('自动播放失败:', error);
								// 可选：提示用户点击播放
								// this.showPlayButton = true;
							});
						}
					});
				})
				.catch(err => {
					console.log("err === ", err);
					this.imgSentenceUrl = "https://staticedu-wps.cache.iciba.com/image/1a427648f5dbb73165d75b4b041ea09b.png";
					this.audioSrc = "https://staticedu-wps.cache.iciba.com/audio/c19bd9ebbba647670055a93689467862.mp3";
					this.textToCopy = null;
				});
		},
		togglePlayPause() {
			const audio = this.$refs.audio;
			if (this.isPlaying) {
				audio.pause(); // 暂停播放
			} else {
				audio.play(); // 开始播放
			}
			this.isPlaying = !this.isPlaying; // 切换播放状态
		},
		onAudioEnded() {
			// 当音频结束时调用此方法
			this.isPlaying = false;
		},
		async copyToClipboard() {
			if (this.textToCopy) {
				try {
					await navigator.clipboard.writeText(this.textToCopy);
					alert("文本已复制到剪贴板");
				} catch (err) {
					console.error("无法复制文本: ", err);
				}
			}
			// window.open("https://www.sojson.com/", "_blank");
		},
		// 将这个方法改为公共方法
		// getFormattedDate(paramsDate = null) {
		// 	let date;
		// 	if (paramsDate) {
		// 		date = new Date(paramsDate);
		// 	} else {
		// 		date = new Date();
		// 	}
		// 	var year = date.getFullYear();
		// 	var month = ("0" + (date.getMonth() + 1)).slice(-2); // 加1是因为月份是从0开始的
		// 	var day = ("0" + date.getDate()).slice(-2);
		// 	return year + "-" + month + "-" + day;
		// },
		changeDate(e) {
			console.log("e === ", e);
			this.choseDate = getFormattedDate(e);
			this.getSentence(this.choseDate);
			this.onAudioEnded();
			let num = calculateDays(e);
			let date = formatDate_(e)
			this.getBingPicture(num, date);
			this.getBingPictureUHD()
		},
		// getPicture() {
		// 	axios
		// 		.get(`/bbb?target=img&brand=bing&ua=pc`)
		// 		.then(res => {
		// 			console.log("res === ", res);
		// 		})
		// 		.catch(err => {
		// 			console.log("err === ", err);
		// 		});
		// },
		// 处理bing图片拼接url
		addHttpsPrefix(url) {
			const strUrl = String(url || '');
			return strUrl.startsWith('https://')
				? strUrl
				: `https://www.bing.com${strUrl}`;
		},
		getBingPicture(num,date) {
			this.isShowChoseDateImg = false;
			// https://raw.githubusercontent.com/Zhu-junwei/bing-wallpaper-archive/master/2026/03/10.json
			axios
				.get(`https://raw.githubusercontent.com/Zhu-junwei/bing-wallpaper-archive/master/${date}.json`)
				.then(res => {
					this.queryTimes += 1;
					console.log("res 新的接口 === ", res);
					this.choseBingSrc = this.addHttpsPrefix(res.data.images[0].url);
					console.log("this.choseBingSrc === ", this.choseBingSrc)
					this.bingTitle = res.data.images[0].title + "——" + res.data.images[0].copyright;
					if (this.queryTimes === 1) {
						this.currentTitle = this.bingTitle;
					}
					this.isShowChoseDateImg = true;
				})
				.catch(err => {
					console.log("err === ", err);
					this.getBingPictureAnother(num)
				});
		},
		getBingPictureUHD() {
			// 
			axios
				.get(`/bing/?resolution=UHD&format=json&index=0&mkt=zh-CN`)
				.then(res => {
					console.log('bing的4k高清图片 res === ', res)
					this.bingSrc = res.data.url
				})
				.catch(err => {
					console.log("err === ", err);
				});
		},
		getBingPictureAnother(num) {
			this.isShowChoseDateImg = false;
			// `/uuu?format=js&idx=${num}&n=1&mkt=zh-CN`
			axios
				.get(`/uuu?format=js&idx=${num}&n=1&mkt=zh-CN`)
				.then(res => {
					console.log("res bing === ", res);
					this.choseBingSrc = "https://cn.bing.com/" + res.data.images[0].url
					this.bingTitle = res.data.images[0].title + "——" + "   " + res.data.images[0].copyright; // 图片标题
					if (num === 0) {
						this.currentTitle = this.bingTitle;
					}
					this.isShowChoseDateImg = true;
				})
				.catch(err => {
					console.log("err === ", err);
				});
		},
		getWord: _.debounce(function () {
			this.btnLoading = true
			let url1 = "/ppp";
			axios.get(url1).then(res1 => {
				console.log("res1 === ", res1);
				console.log("res1.data === ", res1.data);
				let word = res1.data.replace(/[\n\t]+/g, " ").trim();
				let firstWord = this.handleContent(word);
				console.log("firstWord === ", firstWord);
				try {
					let url2 = `/ooo?word=${firstWord}`;
					axios.get(url2).then(res2 => {
						console.log("res2 === ", res2);
						let { data } = res2.data;
						this.word = data.word;
						this.mean_cn = data.mean_cn;
						this.mean_en = data.mean_en;
						this.sentenceWord = data.sentence;
						this.sentence_trans = data.sentence_trans;
						this.word_etyma = data.word_etyma;
						this.accent = `[ ${data.accent} ]`
						this.btnLoading = false
						this.showWord = true
					});

					// this.finallyResult = allres.data.data[0].translations[0].text;
					// this.showFinally = true;
				} catch (error) {
					this.showFinally = false;
					console.log(error);
				}
			});
		}, 1000),

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
		}
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

img {
	height: 90vh;
	object-fit: contain;
}

.imgArea {
	img {
		width: 300px;
		height: 100%;
		object-fit: contain;
	}

	img:nth-last-child(1) {
		width: 800px;
	}
}

.content {
	font-size: 20px;
	color: rgb(42, 175, 12);
	line-height: 50px;
	text-align: center;
}

.audio {
	margin-left: 600px;
}

.bing {
	width: 100%;
	text-align: center;
}

.sentence {
	margin-left: 50px;
}

.word {
	.tip1 {
		font-size: 20px;
		font-weight: bold;
	}
}
</style>
