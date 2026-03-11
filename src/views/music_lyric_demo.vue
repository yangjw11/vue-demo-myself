<template>
	<div>
		<div class="title1">播放器</div>
		<div class="title2"></div>
		<div class="content">
			<el-button @click="getMusic" type="primary">点击获取歌曲——七里香</el-button>
			<div>
				<audio id="audio" :src="audioSrc" ref="audio" @ended="onAudioEnded" @error="handleError" @loadeddata="handleLoadedData" @timeupdate="onTimeUpdate" controls></audio>
			</div>
			<div class="lyrics">{{ currentLyric }}</div>
			<div>
				<img :src="cover ? cover : bingSrc" alt="" />
			</div>
			<div>
				<div v-for="(item, index) in lyricsTextArray" :key="index">
					<div :class="{ highlight: currentIdx === index }">{{ item }}</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import _ from "lodash";
export default {
	created() {},
	mounted() {},
	data() {
		return {
			audioSrc: "",
			lyricsArray: [], // 歌词列表，[时间：歌词]
			currentLyric: "", // 歌曲播放时，当前对应的歌词
			lyricsTextArray: [], // 歌词纯文本列表
			currentIdx: 0, // 歌词索引
			audio: null,
			currentTime: 0,
			duration: 0,
			cover: "", // 歌曲图片链接，默认是bing当日图片
			bingSrc: "https://bing.img.run/uhd.php",
            adjustTime: 50, // 毫秒数，为正数，歌词往歌曲前调节，为负数，歌词往歌曲后调节
		};
	},
	methods: {
		// 获取某一首歌
		getMusic() {
			let url = `https://www.hhlqilongzhu.cn/api/dg_qqmusic_SQ.php?msg=七里香&n=1&type=json`;
			axios
				.get(url)
				.then(res => {
					console.log("res === ", res);
					this.audioSrc = res.data.data.music_url;
                    // 处理歌词
					this.lyricsArray = this.parseLyrics(res.data.data.lyric).lyricsArray;
					this.lyricsTextArray = this.parseLyrics(res.data.data.lyric).lyricsTextArray;
					this.cover = res.data.data.cover;
				
				})
				.catch(err => {
					this.$message.warning("请重新查询");
					console.log("err === ", err);
				});
		},
		// 当音频结束时调用此方法
		onAudioEnded() {
			console.log("播放结束");
		},
		// 音频加载失败
		handleError(event) {
			if (this.lyricsArray.length) {
				console.error("音频加载失败:", event);
			}
		},
		handleLoadedData() {
			this.$message.success("音频加载完成");
			console.log("音频加载完成");
		},
		onTimeUpdate(event) {
			this.currentTime = event.target.currentTime;
			if (this.duration === 0 && !isNaN(event.target.duration)) {
				this.duration = event.target.duration;
			}
			this.updateCurrentLyric();
		},

		// 下面是处理歌词的相关方法
		parseLyrics(lyrics) {
			const lines = lyrics.split("\\n");
			const lyricsArray = [];
			const lyricsTextArray = [];
			lines.forEach(line => {
				const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.*)/);
				if (match) {
					const minutes = parseInt(match[1], 10);
					const seconds = parseInt(match[2], 10);
					const milliseconds = parseInt(match[3], 10) - this.adjustTime;
					const time = minutes * 60 + seconds + milliseconds / 100;
					const text = match[4];
					lyricsArray.push({ time, text });
					lyricsTextArray.push(text);
				}
			});
			return { lyricsArray, lyricsTextArray };
		},
		updateCurrentLyric() {
			for (let i = 0; i < this.lyricsArray.length; i++) {
				if (this.currentTime >= this.lyricsArray[i].time && (i === this.lyricsArray.length - 1 || this.currentTime < this.lyricsArray[i + 1].time)) {
					this.currentLyric = this.lyricsArray[i].text;
					this.currentIdx = i;
					break;
				}
			}
		},
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
	text-align: center;
}
.highlight {
	color: red;
	font-size: 24px;
	font-weight: bold;
}
</style>
