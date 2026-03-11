<!--
 * @Author: yangJianWei yangjianwei@chexiao.co
 * @Date: 2026-02-05 16:51:41
 * @LastEditors: yangJianWei yangjianwei@chexiao.co
 * @LastEditTime: 2026-02-10 11:37:56
 * @FilePath: \vue-demo-myself\src\views\musicPlayer_qq_free\index.vue
 * @Description: 可以用的听歌接口
-->

<template>
	<div>
		<div class="title1">QQ音乐库_Free_2026(有歌词，不支持分页，只能搜索到20条)</div>
		<div class="all">
			<div class="content">
				<div class="search">
					<div class="musicInput">
						<el-input v-model="musicStr" placeholder="请输入歌手名/歌曲名" @keyup.enter.native="searchMusic('reset')"></el-input>
					</div>
					<div class="musicBtn">
						<el-button @click="searchMusic('reset')" type="primary" :loading="btnLoding">搜索</el-button>
						<el-button @click="reset()" :loading="btnLoding">清空</el-button>
						<el-button @click="openDrawer" :loading="btnLoding" type="primary">打开播放列表</el-button>
					</div>
				</div>
				<div class="tableArea">
					<el-table :data="tableList" style="width: 100%" v-loading="btnLoding">
						<el-table-column prop="name" label="歌曲名"></el-table-column>
						<el-table-column prop="artists" label="歌手名"></el-table-column>
						<el-table-column label="歌曲封面">
							<template slot-scope="scope">
								<img :src="scope.row.cover" alt="歌曲封面" @error="e => setDefaultImage(e, scope.row, scope.$index)"
									style="max-width: 50px; max-height: 50px;" />
							</template>
						</el-table-column>
						<el-table-column label="按钮">
							<template slot-scope="scope">
								<div class="playArea">
									<el-tooltip content="播放" placement="top" v-if="!scope.row.isPlaying">
										<i class="el-icon-video-play" @click="playAudio(scope.row, scope.$index, true, 'tableList')"></i>
									</el-tooltip>
									<el-tooltip content="暂停" placement="top" v-if="scope.row.isPlaying">
										<i class="el-icon-video-pause" @click="playAudio(scope.row, scope.$index, false, 'tableList')"></i>
									</el-tooltip>
									<el-tooltip content="添加到播放列表" placement="top">
										<i class="el-icon-plus" @click="addPlayList(scope.row, scope.$index)"></i>
									</el-tooltip>
								</div>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
			<div class="title2">

				<div v-if="showInfo" class="playerTips">正在播放：{{ name }} ------ {{ artist }}</div>
				<img :src="coverImgSrc" alt="歌曲封面" @error="e => setDefaultImage(e)" />
				<div class="playerChoose">
					<div>
						<el-button type="primary" @click="changeMusic('prev')">上一曲</el-button>
					</div>
					<div>
						<audio id="audioPlayer" :src="audioSrc" ref="audioPlayer" @ended="onAudioEnded" @error="handleError"
							@loadeddata="handleLoadedData" @timeupdate="onTimeUpdate" controls></audio>
					</div>
					<div>
						<el-button type="primary" @click="changeMusic('next')">下一曲</el-button>
					</div>
				</div>
				<!-- 下面是歌词部分 -->
				<template>
					<div v-if="Array.isArray(lyricsArray) && lyricsArray.length">
						<div v-for="(item, index) in lyricsArray" :key="index">
							<div :class="{ highlight: textIndex === index }">{{ item.text }}</div>
						</div>
					</div>
					<div v-else>
						<span class="highlight">暂无歌词</span>
					</div>
				</template>

				<!-- 下面是抽屉部分 -->
				<el-drawer title="播放列表" :visible.sync="drawer" :direction="direction" :size="drawerWidth">
					<div class="playListArea">
						<div>
							<el-button type="primary" @click="useDefaultList('first')">使用默认的播放列表</el-button>
							<el-button type="primary" @click="useDefaultList('second')">使用默认的播放列表yuexin</el-button>
						</div>
						<div class="optionClass">
							<div class="left">
								<span>播放模式：</span>
								<el-select v-model="playMode" placeholder="请选择播放模式">
									<el-option v-for="item in playModeOptions" :key="item.value" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</div>
							<div class="right">
								<el-button type="primary" @click="refreshAllMusic"
									:disabled="refreshDisabled">一键更新播放列表所有歌曲链接</el-button>
							</div>
						</div>
						<div class="tableArea">
							<el-table :data="playList" style="width: 100%" ref="playListRef" id="table_count" stripe
								highlight-current-row v-loading="btnLoding">
								<el-table-column prop="name" label="歌曲名"></el-table-column>
								<el-table-column prop="artists" label="歌手名"></el-table-column>
								<el-table-column label="歌曲封面">
									<template slot-scope="scope">
										<img :src="scope.row.cover" alt="歌曲封面" @error="e => setDefaultImage(e, scope.row, scope.$index)"
											style="max-width: 50px; max-height: 50px;" />
									</template>
								</el-table-column>
								<el-table-column label="按钮">
									<template slot-scope="scope">
										<div class="playArea">
											<el-tooltip content="播放" placement="top" v-if="!scope.row.isPlaying">
												<i class="el-icon-video-play" @click="playAudio(scope.row, scope.$index, true, 'playList')"></i>
											</el-tooltip>
											<el-tooltip content="暂停" placement="top" v-if="scope.row.isPlaying">
												<i class="el-icon-video-pause"
													@click="playAudio(scope.row, scope.$index, false, 'playList')"></i>
											</el-tooltip>
											<el-tooltip content="删除" placement="top">
												<i class="el-icon-delete-solid" @click="deleteRow(scope.row, scope.$index, false)"></i>
											</el-tooltip>
										</div>
									</template>
								</el-table-column>
								<el-table-column label="拖动排序">
									<template slot-scope="scope">
										<div class="rank">
											<el-tooltip content="鼠标按下可以拖动" placement="top">
												<i class="el-icon-rank handle"></i>
											</el-tooltip>
											<el-tooltip content="点击置顶" placement="top">
												<i class="el-icon-top" @click="toTop(scope.row, scope.$index)"></i>
											</el-tooltip>
											<span class="icon-refresh">
												<el-tooltip content="如果播放失败，获取最新音乐链接" placement="top">
													<i class="el-icon-sort" @click="refreshURL(scope.row, scope.$index)"></i>
												</el-tooltip>
											</span>
										</div>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
				</el-drawer>
			</div>
		</div>
	</div>
</template>
<script>
import axios from "axios";
import Sortable from "sortablejs";
import _ from "lodash";
import OpenCC from "opencc-js"; // 将繁体字转化为简体字，用于歌词的转化
import { getAllMusicListInfo } from "./index";
import musicListJSON from '@/views/musicPlayer_qq_free/info.js';
import musicListJSON_yuexin from '@/views/musicPlayer_qq_free/info_yuexin.js';

export default {
	data() {
		return {
			musicStr: "周杰伦",
			musicStrCopy: "",
			musicIndex: "",
			musicObj: "",
			btnLoding: false,
			tableList: [],
			audioSrc: "", // 音频路径
			// coverImgSrc: "https://cn.bing.com//th?id=OHR.MonoTufa_ZH-CN4998806540_1920x1080.jpg&amp;rf=LaDigue_1920x1080.jpg&amp;pid=hp", // 歌曲封面url
			coverImgSrc: "https://bing.img.run/uhd.php", // 歌曲封面url
			name: "", // 歌曲名
			artist: "", // 歌手名
			showInfo: false,
			playList: [], // 播放列表
			playMode: 3,
			playModeOptions: [
				{
					value: 1,
					label: "单曲循环"
				},
				{
					value: 2,
					label: "列表循环"
				},
				{
					value: 3,
					label: "随机播放"
				}
			],
			clickArea: "", // tableList：点击了搜索列表   playList: 点击了播放列表
			currentIndex: "", // 当前播放歌曲在 playList 中的索引值
			audioRef: {},
			tableDataClone: [],
			direction: "rtl",
			drawer: false,
			drawerWidth: "50%",
			lyricsArray: [], // 歌词列表
			adjustTime: 0, // 毫秒数，为正数，歌词往歌曲前调节，为负数，歌词往歌曲后调节
			textIndex: 0, // 歌曲播放过程中对应歌词列表的歌词索引
			sortType: 1,
			bingSrc: '', // 默认图片
			refreshDisabled: false,
			retryCount: 0, // 当前重试次数
			maxRetryCount: 5, // 最大重试次数
			isRetrying: false, // 是否正在重试中
			retryTimer: null, // 重试定时器
		};
	},
	async mounted() {
		await this.getBingPictureUHD()
		this.handleAudio();
		if (this.musicStr) {
			this.searchMusic("reset");
		}
		// 如果播放列表有缓存，则取缓存，没有缓存，则设置缓存,请不定期更新json数据
		try {
			this.playList = [];
			this.playList = JSON.parse(localStorage.getItem("playList_qq_free")) || [];
		} catch (error) {
			this.playList = [];
			console.error("Error parsing data from localStorage: playList_qq_free:", error);
		}
	},
	beforeDestroy() {
		// 清理重试定时器
		if (this.retryTimer) {
			clearTimeout(this.retryTimer);
		}
	},
	methods: {
		useDefaultList(type) {
			if (type === 'first') {
				localStorage.setItem("playList_qq_free", JSON.stringify(musicListJSON));
			} else if (type === 'second') {
				localStorage.setItem("playList_qq_free", JSON.stringify(musicListJSON_yuexin));
			}
			this.playList = JSON.parse(localStorage.getItem("playList_qq_free")) || [];
		},
		searchMusic() {
			this.btnLoding = true;
			if (!this.musicStr) this.btnLoding = false;
			this.musicStrCopy = this.musicStr;
			// https://cyapi.top/API/qq_music.php?apikey=62ccfd8be755cc5850046044c6348d6cac5ef31bd5874c1352287facc06f94c4&type=json&msg=%E5%91%A8%E6%9D%B0%E4%BC%A6
			let url = `/cyapi?apikey=${this.globalConfig.apiKey_qq_free}&type=json&msg=${this.musicStrCopy}`;
			axios
				.get(url)
				.then(res => {
					this.tableList = res.data.list;
					// 处理表格数据 是否正在播放该歌曲的属性 isPlaying, 默认是false
					this.tableList.forEach((item, index) => {
						item.isPlaying = false;
						item.keyWord = this.musicStrCopy;
						item.n = index + 1;
					});
					this.musicIndex = "";

					this.btnLoding = false;
				})
				.catch(err => {
					this.btnLoding = false;
					this.$message.warning("请重新查询");
					console.log("err === ", err);
				});
		},
		async playAudio(row, index = null, type = null, area = null) {
			// 重置重试状态
			if (this.isRetrying) {
				this.resetRetry();
			}

			this.btnLoding = true;
			let clickItem = row;

			// 如果有URL，先检查是否为短版试听（1分钟或30秒）
			if (row.url) {
				try {
					const durationInfo = await this.checkMusicDuration(row.url);
					if (durationInfo.isShort && !durationInfo.error) {
						const durationType = durationInfo.isOneMinute ? '1分钟' : '30秒';
						this.$message.warning(`当前歌曲为${durationType}试听版，正在重新获取完整版...`);

						// 重新获取歌曲信息
						let result = await this.getAllMusicInfo(row);
						let musicUrl = result.musicUrl;
						let musicLyric = result.musicLyric;
						let musicImg = result.musicImg;

						// 检查新获取的是否还是短版
						const newDurationInfo = await this.checkMusicDuration(musicUrl);
						if (newDurationInfo.isShort && !newDurationInfo.error) {
							const newDurationType = newDurationInfo.isOneMinute ? '1分钟' : '30秒';
							this.$message.warning(`重新获取的歌曲仍为${newDurationType}试听版`);
						}

						this.tableList.splice(index, 1, { ...this.tableList[index], cover: musicImg, url: musicUrl, lyric: musicLyric });
						clickItem = this.tableList[index];
					}
				} catch (error) {
					console.log("检查歌曲时长时出错:", error);
				}
			}

			// 如果没有播放链接
			if (!clickItem.url) {
				try {
					let result = await this.getAllMusicInfo(row);

					// 歌曲链接
					let musicUrl = result.musicUrl;
					// 歌词
					let musicLyric = result.musicLyric;
					// 歌曲封面
					let musicImg = result.musicImg;
					this.tableList.splice(index, 1, { ...this.tableList[index], cover: musicImg, url: musicUrl, lyric: musicLyric });
					clickItem = this.tableList[index];
				} catch (error) {
					console.log("error === ", error);
				}
			} else {
				clickItem = row;
			}
			this.btnLoding = false;
			// 处理歌词
			this.lyricsArray = this.parseLyrics(clickItem.lyric);
			this.musicObj = clickItem;
			this.artist = clickItem.artists;
			this.name = clickItem.name;
			this.coverImgSrc = clickItem.cover;
			if (area) {
				this.clickArea = area;
			}
			if (this.audioSrc == clickItem.url) {
				if (type) {
					this.audioRef.play(); // 开始播放
					clickItem.isPlaying = true;
				} else {
					this.audioRef.pause();
					clickItem.isPlaying = false;
				}
			} else {
				this.currentTime = 0;
				this.audioRef.currentTime = this.currentTime;
				this.textIndex = 0;
				this.audioSrc = clickItem.url;
				clickItem.isPlaying = true;

				this.$nextTick(() => {
					this.audioRef.play(); // 开始播放
				});
			}
			setTimeout(() => {
				if (type) {
					this.drawer = false;
				}
				this.playerHandle(this.musicObj, type, area);
				this.currentIndex = this.playList.findIndex(item => item.url === this.audioSrc);
			}, 200);
		},
		async getAllMusicInfo(row) {
			// 通过n获取歌曲链接 默认是128标准音质，因为高品质音乐网络卡
			let url = `/cyapi?apikey=${this.globalConfig.apiKey_qq_free}&type=json&msg=${row.keyWord}&n=${row.n}`;
			let req = axios.get(url);
			const resAll = await Promise.all([req]);
			// 歌曲链接
			let musicUrl = resAll[0].data.url;
			// 歌词
			let musicLyric = resAll[0].data.lyric.text;
			// 歌曲封面
			let musicImg = resAll[0].data.cover.large;
			return { musicUrl, musicLyric, musicImg };

		},
		handleAudio() {
			this.audioRef = this.$refs.audioPlayer;
			// 监听播放开始事件
			this.audioRef.addEventListener("play", () => {
				console.log("开始播放");
				this.playerHandle(this.musicObj, true);
				this.showInfo = true;
			});

			// 监听暂停事件
			this.audioRef.addEventListener("pause", () => {
				console.log("暂停播放");
				this.playerHandle(this.musicObj, false);
				this.showInfo = true;
			});

			// 监听播放结束事件
			this.audioRef.addEventListener("ended", () => {
				console.log("播放结束");
				// 首先判断播放列表有歌曲 且 当前点击播放的区域是playList

				if (this.playList.length && this.clickArea === "playList") {
					// 如果正在播放的音乐 和 播放列表的歌曲相匹配
					if (this.playList.some(item => item.url === this.audioSrc)) {
						// 按照播放模式继续播放歌曲
						// 如果是 单曲循环 继续播放
						if (this.playMode === 1) {
							this.audioRef.play();
							return;
						} else if (this.playMode === 2) {
							// 如果是列表循环
							this.currentIndex = (this.currentIndex + 1) % this.playList.length;
						} else if (this.playMode === 3) {
							// 如果是随机播放
							this.currentIndex = Math.floor(Math.random() * this.playList.length);
						}
						setTimeout(() => {
							if (this.playList.length) {
								if (this.playList[this.currentIndex]) {
									this.playAudio(this.playList[this.currentIndex], null, true, this.clickArea);
								} else {
									// 如果出现循环问题，统一从第一个开始播放
									this.playAudio(this.playList[0], null, true, this.clickArea);
								}
							} else {
								this.audioRef.pause();
							}
						}, 2000);
					}
				}
			});
		},
		changeMusic(param) {

			if (this.playList.length && this.clickArea === "playList") {
				this.btnLoding = true
				// 如果正在播放的音乐 和 播放列表的歌曲相匹配
				if (this.playList.some(item => item.url === this.audioSrc)) {
					// 按照播放模式继续播放歌曲
					// 如果是 单曲循环 继续播放
					if (this.playMode === 1 || this.playMode === 2) {
						// 如果点了下一曲
						if (param === "next") {
							this.currentIndex = (this.currentIndex + 1) % this.playList.length;
						} else if (param === "prev") {
							this.currentIndex = (this.currentIndex - 1 + this.playList.length) % this.playList.length;
						}
					} else if (this.playMode === 3) {
						// 如果是随机播放
						this.currentIndex = Math.floor(Math.random() * this.playList.length);
					}
					setTimeout(() => {
						if (this.playList.length) {
							if (this.playList[this.currentIndex]) {
								this.playAudio(this.playList[this.currentIndex], null, true, this.clickArea);
							} else {
								// 如果出现循环问题，统一从第一个开始播放
								this.playAudio(this.playList[0], null, true, this.clickArea);
							}
						} else {
							this.audioRef.pause();
						}
						this.btnLoding = false
					}, 2000);
				}
			}
		},
		onAudioEnded() {
			// 当音频结束时调用此方法
		},
		handleError(event) {
			if (this.audioSrc) {
				console.error("音频加载失败:", event);
				this.showInfo = false;
				this.playerHandle(this.musicObj, false);

				// 如果正在重试中，不重复触发
				if (this.isRetrying) return;

				// 开始重试获取音乐信息
				this.startRetryGetMusic();
			}
		},
		// 检查歌曲是否为1分钟整或30秒
		checkMusicDuration(url) {
			return new Promise((resolve) => {
				const audio = new Audio();
				audio.src = url;

				const checkTimeout = setTimeout(() => {
					audio.removeEventListener('loadedmetadata', onLoaded);
					audio.removeEventListener('error', onError);
					resolve({
						duration: 0,
						isShort: false,
						isOneMinute: false,
						isThirtySeconds: false,
						error: true
					});
				}, 10000); // 10秒超时

				const onLoaded = () => {
					clearTimeout(checkTimeout);

					// 检查时长是否为60秒（1分钟）或30秒
					const duration = audio.duration;
					// 考虑小数误差，59.5-60.5之间都认为是1分钟，29.5-30.5之间都认为是30秒
					const isOneMinute = duration >= 59.5 && duration <= 60.5;
					const isThirtySeconds = duration >= 29.5 && duration <= 30.5;
					const isShort = isOneMinute || isThirtySeconds;

					console.log(`歌曲时长: ${duration}秒, 是否为1分钟: ${isOneMinute}, 是否为30秒: ${isThirtySeconds}`);
					resolve({
						duration,
						isShort,
						isOneMinute,
						isThirtySeconds,
						error: false
					});

					// 清理音频对象
					audio.src = '';
					audio.load();
				};

				const onError = () => {
					clearTimeout(checkTimeout);
					resolve({
						duration: 0,
						isShort: false,
						isOneMinute: false,
						isThirtySeconds: false,
						error: true
					});
				};

				audio.addEventListener('loadedmetadata', onLoaded);
				audio.addEventListener('error', onError);

				audio.load();
			});
		},
		// 开始重试获取音乐信息
		async startRetryGetMusic() {
			if (this.retryCount >= this.maxRetryCount) {
				this.$message.warning("重试次数已达上限，请手动切换歌曲");
				this.resetRetry();
				return;
			}

			this.isRetrying = true;
			this.retryCount++;

			try {
				// 获取当前播放的歌曲信息
				const currentMusic = this.musicObj;

				if (!currentMusic) {
					this.resetRetry();
					return;
				}

				this.$message.info(`正在尝试重新获取歌曲链接(第${this.retryCount}次)...`);

				// 重新查询音乐信息
				const result = await this.getAllMusicInfo(currentMusic);

				// 检查新获取的歌曲是否为1分钟或30秒试听版
				const durationInfo = await this.checkMusicDuration(result.musicUrl);

				if (durationInfo.isShort && !durationInfo.error) {
					if (this.retryCount < this.maxRetryCount) {
						const durationType = durationInfo.isOneMinute ? '1分钟' : '30秒';
						this.$message.warning(`获取的歌曲为${durationType}试听版，${3}秒后重新获取...`);

						// 延迟3秒后重试
						this.retryTimer = setTimeout(() => {
							this.startRetryGetMusic();
						}, 3000);

						return;
					} else {
						this.$message.warning("已达到最大重试次数，使用当前获取的链接");
					}
				} else if (durationInfo.error) {
					if (this.retryCount < this.maxRetryCount) {
						this.$message.warning(`歌曲链接不可用，${5}秒后重新尝试...`);

						this.retryTimer = setTimeout(() => {
							this.startRetryGetMusic();
						}, 5000);
						return;
					} else {
						this.$message.warning("已达到最大重试次数，使用当前获取的链接");
					}
				}

				// 更新音乐信息
				const updatedMusic = {
					...currentMusic,
					cover: result.musicImg,
					url: result.musicUrl,
					lyric: result.musicLyric
				};

				// 更新对应列表中的数据
				this.updateMusicInfoInLists(updatedMusic);

				// 如果是当前播放的歌曲，则更新播放器
				if (this.musicObj && this.musicObj.url === currentMusic.url) {
					this.musicObj = updatedMusic;
					this.audioSrc = result.musicUrl;
					this.lyricsArray = this.parseLyrics(result.musicLyric);

					this.$nextTick(() => {
						this.audioRef.load(); // 重新加载音频
						setTimeout(() => {
							this.audioRef.play();
						}, 500);
					});
				}

				this.$message.success("歌曲链接已更新");
				this.resetRetry();

			} catch (error) {
				console.error("重试获取音乐信息失败:", error);

				if (this.retryCount < this.maxRetryCount) {
					this.$message.warning(`获取失败，${5}秒后重新尝试...`);

					this.retryTimer = setTimeout(() => {
						this.startRetryGetMusic();
					}, 5000);
				} else {
					this.$message.error("重试失败，请检查网络或手动操作");
					this.resetRetry();
				}
			}
		},
		// 更新音乐信息在列表中的位置
		updateMusicInfoInLists(updatedMusic) {
			// 更新播放列表
			this.playList.forEach((item, index) => {
				if (item.url === this.musicObj.url ||
					(item.artists === this.musicObj.artists && item.name === this.musicObj.name)) {
					this.playList.splice(index, 1, { ...item, ...updatedMusic });
				}
			});

			// 更新搜索列表
			this.tableList.forEach((item, index) => {
				if (item.url === this.musicObj.url ||
					(item.artists === this.musicObj.artists && item.name === this.musicObj.name)) {
					this.tableList.splice(index, 1, { ...item, ...updatedMusic });
				}
			});

			// 更新localStorage缓存
			this.saveToLocalStorage();
		},
		// 重置重试状态
		resetRetry() {
			this.retryCount = 0;
			this.isRetrying = false;
			if (this.retryTimer) {
				clearTimeout(this.retryTimer);
				this.retryTimer = null;
			}
		},
		handleLoadedData() {
			this.$message.success("音频加载完成");
			console.log("音频加载完成");
			this.showInfo = true;
			this.audioRef.currentTime = this.currentTime;
			this.audioRef.play(); // 开始播放
		},
		// 获取播放时间
		onTimeUpdate(event) {
			this.currentTime = event.target.currentTime;
			if (this.duration === 0 && !isNaN(event.target.duration)) {
				this.duration = event.target.duration;
			}
			this.updateCurrentLyric();
		},
		reset() {
			this.musicStr = "";
		},
		// row: 行信息  type：播放true 暂停 flase  area: tableList  playList
		playerHandle(row, type = null, area = null) {
			let musicUrl = row.url;
			// 处理搜索列表 tableList 的播放按钮
			if (this.tableList.length) {
				this.tableList.forEach((item, index) => {
					item.isPlaying = false;
					if (item.url === musicUrl) {
						this.tableList.splice(index, 1, { ...this.tableList[index], isPlaying: type });
					}
				});
			}
			// 处理播放列表 playList
			if (this.playList.length) {
				this.playList.forEach((item, index) => {
					item.isPlaying = false;
					if (item.url === musicUrl) {
						this.playList.splice(index, 1, { ...this.playList[index], isPlaying: type });
					}
				});
			}
		},
		// 添加到播放列表
		async addPlayList(row, index) {
			this.btnLoding = true;
			let targetItem;
			// 通过mucic_url判断这首歌信息有没有全部拿到，没拿到的话调用接口查询全部信息
			if (!row.url) {
				try {
					// {musicUrl, musicLyric, musicImg};
					let result = await this.getAllMusicInfo(row);
					this.tableList.splice(index, 1, { ...this.tableList[index], cover: result.musicImg, url: result.musicUrl, lyric: result.musicLyric });
					targetItem = this.tableList[index];
				} catch (error) {
					console.log("error === ", error);
					retrun;
				}
			} else {
				targetItem = row;
			}
			this.btnLoding = false;
			// 将歌曲信息全部查询到之后，再添加
			// 如果有重复的，不让添加
			let hasResult = false;
			if (this.playList.length) {
				hasResult = this.playList.some(item => item.url === targetItem.url || (item.artists === targetItem.artists && item.name === targetItem.name));
				if (targetItem.id) {
					hasResult = this.playList.some(item => item.id === targetItem.id);
				}
			} else {
				hasResult = false;
			}

			if (!this.playList.length || !hasResult) {
				this.playList.push(targetItem);
				this.$message.success("添加成功");
				setTimeout(() => {
					this.drawer = true;
				}, 1500);
			} else {
				return this.$message.warning("该歌曲已经添加至播放列表，请勿重复添加");
			}
			// 将数组对象序列化为 JSON 字符串并存储
			this.saveToLocalStorage();
		},
		deleteRow(row, index) {
			this.playList.splice(index, 1); // 删除1个元素
			this.saveToLocalStorage();
		},
		// 将播放列表的数据保存到localStorage中
		saveToLocalStorage() {
			let playListDeepClone = _.cloneDeep(this.playList);
			if (playListDeepClone.length) {
				playListDeepClone.forEach(item => {
					item.isPlaying = false;
				});
				localStorage.setItem("playList_qq_free", JSON.stringify(playListDeepClone));
			} else {
				localStorage.setItem("playList_qq_free", null);
			}
		},
		rowDrop() {
			const el = document.querySelector("#table_count .el-table__body-wrapper tbody");
			new Sortable(el, {
				animation: 150,
				handle: ".handle", // 想要直接整行拖动，需要去掉 new Sortable中 handle配置项，其中第一个参数为需要拖拽的HTML元素节点
				ghostClass: "blue-background-class",
				onEnd: evt => {
					// 使用 Vue 的数组变更方法来保证响应式
					const oldIndex = evt.oldIndex;
					const newIndex = evt.newIndex;
					this.dragSortWay(oldIndex, newIndex);
					// 最佳方案
					// this.playList = [];
					// this.$nextTick(()=>{
					//     this.$set(this, "playList", this.tableDataClone)
					// })
				}
			});
		},
		// 点击置顶icon的方法
		toTop(row, index) {
			this.dragSortWay(index, 0);
		},
		dragSortWay(oldIndex, newIndex) {
			if (oldIndex === newIndex) return;
			this.tableDataClone = _.cloneDeep(this.playList);
			// 移除旧位置元素并保存到临时变量
			const [movedItem] = this.tableDataClone.splice(oldIndex, 1);

			// 插入到新位置
			this.tableDataClone.splice(newIndex, 0, movedItem);

			// 确保 DOM 更新完成后再打印
			this.$nextTick(() => {
				this.playList = [];
				setTimeout(() => {
					this.playList = _.cloneDeep(this.tableDataClone);
					this.saveToLocalStorage();
					// 如果这首歌正在播放currentIndex 为新索引值
					this.playList.forEach((item, index) => {
						if (item.url == this.audioSrc) {
							this.currentIndex = index;
						}
					});
					// 这里添加滚动条定位的方法
					this.findRowById(this.playList[newIndex].url);
				}, 100);
			});
		},
		// 滚动条定位
		findRowById(url) {
			const targetRow = this.playList.find(row => row.url == url);
			if (targetRow) {
				let res = this.$refs.playListRef.setCurrentRow(targetRow);
				this.$nextTick(() => {
					const el = this.$refs.playListRef.$el.querySelector(`.current-row`);
					if (el) {
						el.scrollIntoView({ behavior: "smooth" });
					}
				});
			} else {
				console.log("未找到对应ID的行");
			}
		},
		// 打开抽屉
		openDrawer() {
			this.drawer = true;
			// 初始化拖动效果
			setTimeout(() => {
				this.rowDrop();
			}, 800);
		},
		// 下面是处理歌词的相关方法
		parseLyrics(lyricStr) {
			// 替换转义换行符并分割为行数组
			const lines = lyricStr.replace(/\\n/g, '\n').split('\n');
			const result = [];

			lines.forEach(line => {
				// 匹配时间标签和歌词内容
				const match = line.match(/^\[(\d{2}):(\d{2})\.(\d{2})\](.*)/);
				if (!match) return;

				// 解析时间（转换为秒）
				const minutes = parseInt(match[1]);
				const seconds = parseInt(match[2]);
				const milliseconds = parseInt(match[3]);
				const time = minutes * 60 + seconds + milliseconds / 100;

				// 清理歌词文本（移除首尾空格和特殊字符）
				let text = match[4].trim().replace(/\s{2,}/g, ' ');                   // 合并多余空格

				// 跳过空文本行
				if (!text) return;

				result.push({
					time: parseFloat(time.toFixed(2)),
					text: text
				});
			});

			return result;
		},
		updateCurrentLyric() {
			for (let i = 0; i < this.lyricsArray.length; i++) {
				if (this.currentTime >= this.lyricsArray[i].time && (i === this.lyricsArray.length - 1 || this.currentTime < this.lyricsArray[i + 1].time)) {
					this.currentLyric = this.lyricsArray[i].text;
					this.textIndex = i;
					break;
				}
			}
		},
		async refreshURL(row, index) {
			this.btnLoding = true;
			try {
				let res_url = await this.queryMusicUrl(row);
				if (res_url) {
					// 检查新获取的URL是否为短版试听（1分钟或30秒）
					const durationInfo = await this.checkMusicDuration(res_url);
					if (durationInfo.isShort && !durationInfo.error) {
						const durationType = durationInfo.isOneMinute ? '1分钟' : '30秒';
						this.$message.warning(`获取的歌曲为${durationType}试听版`);
					}

					row.url = res_url;
					row.isPlaying = false;
					// 将数组对象序列化为 JSON 字符串并存储
					this.saveToLocalStorage();
					this.$message.success("更新成功");
					this.btnLoding = false;
				} else {
					row.isPlaying = false;
					throw new Error("查询失败");
				}
			} catch (error) {
				this.btnLoding = false;
				console.log("error === ", error);
			}
		},
		// 通过n值和关键词查询歌曲url,
		queryMusicUrl(row) {
			let url = `/cyapi?apikey=${this.globalConfig.apiKey_qq_free}&type=json&msg=${row.keyWord}&n=${row.n}`;
			return new Promise((resolve, reject) => {
				axios
					.get(url)
					.then(res => {
						let url = res.data.url;
						resolve(url);
					})
					.catch(err => {
						reject(err);
					});
			});
		},
		// 图片加载失败，显示默认图片
		setDefaultImage(e, row = null, index = null) {
			// 设置 event.target.src 为默认图片路径
			// e.target.src = "https://www.yumus.cn/api/?target=img&brand=bing&ua=uhd";
			e.target.src = this.bingSrc;
		},
		async refreshAllMusic() {
			this.btnLoding = true;
			this.refreshDisabled = true;
			setTimeout(() => {
				this.btnLoding = false;
				this.$message.success("正在更新，每首歌需要5秒");
			}, 5000);
			this.playList = await getAllMusicListInfo(this.playList);
			this.$message.success("播放列表所有歌曲音频链接更新成功");
			this.refreshDisabled = false
			// 将数组对象序列化为 JSON 字符串并存储
			this.saveToLocalStorage();
		},
		getBingPictureUHD() {
			axios
				.get(`/bing/?resolution=UHD&format=json&index=0&mkt=zh-CN`)
				.then(res => {
					this.bingSrc = res.data.url
				})
				.catch(err => {
					console.log("err === ", err);
				});
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

.all {
	display: flex;
	overflow-y: auto;
	/* 当内容超过最大高度时，显示垂直滚动条 */
	overflow-x: hidden;

	/* 不显示横向滚动条 */
	.title2 {
		width: 50%;
		text-align: center;
		font-size: 16px;
		font-weight: 500;
		color: #000000;
		margin-left: 100px;

		img {
			width: 600px;
			height: 400px;
			object-fit: cover;
		}

		.playerTips {
			color: #149ef4;
			margin-top: 20px;
			margin-bottom: 20px;
			font-size: 20px;
			font-weight: bold;
		}

		.highlight {
			color: red;
			font-size: 24px;
			font-weight: bold;
		}

		.playerChoose {
			width: 100%;
			display: flex;
			justify-content: space-around;

			div {
				width: 45%;
			}
		}
	}

	.content {
		width: 40%;
		text-align: center;

		.search {
			width: 600px;
			display: flex;
			justify-content: space-between;

			.musicInput {
				width: 220px;
			}

			.musicBtn {
				width: 350px;
			}
		}
	}
}

.musicInput {
	width: 300px;
}

.playArea {

	.el-icon-video-play,
	.el-icon-video-pause,
	.el-icon-plus,
	.el-icon-delete-solid {
		cursor: pointer;
	}

	.el-icon-plus {
		margin-left: 20px;
	}

	.el-icon-delete-solid {
		margin-left: 20px;
	}

	font-size: 36px;
	display: flex;
	text-align: left;
	// justify-content: space-around; /* 水平居中 */
	align-items: center;
	/* 垂直居中 */
}

.rank {
	display: flex;
	justify-content: space-around;

	.el-icon-rank {
		font-size: 30px;
		cursor: pointer;
	}

	.el-icon-top {
		font-size: 30px;
		margin-left: 15px;
		cursor: pointer;
	}

	.icon-refresh {
		margin-left: 20px;

		.el-icon-sort {
			font-size: 30px;
			cursor: pointer;
		}
	}
}

.playListArea {
	text-align: left;
	margin-left: 20px;

	.playTitle {
		color: #149ef4;
		font-weight: 32px;
		font-weight: bold;
	}

	.optionClass {
		display: flex;
		justify-content: space-between;
	}
}
</style>