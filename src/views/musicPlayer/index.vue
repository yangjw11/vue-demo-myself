<template>
	<div>
		<div class="title1">高品质QQ音乐库(有歌词)</div>
		<div class="all">
			<div class="content">
				<div class="search">
					<div class="musicInput">
						<el-input v-model="musicStr" placeholder="请输入歌手名/歌曲名" @keyup.enter.native="searchMusic('reset')"></el-input>
					</div>
					<div class="musicBtn">
						<el-button @click="searchMusic('reset')" type="primary" :loading="btnLoding">搜索</el-button>
						<el-button @click="reset()" :loading="btnLoding">清空</el-button>
						<el-button @click="openDrawer" type="primary">打开播放列表</el-button>
					</div>
				</div>
				<div class="tableArea">
					<el-table :data="tableList" style="width: 100%">
						<el-table-column prop="song_title" label="歌曲名"></el-table-column>
						<el-table-column prop="song_singer" label="歌手名"></el-table-column>
						<el-table-column label="歌曲封面">
							<template slot-scope="scope">
								<img :src="scope.row.cover" alt="歌曲封面" style="max-width: 50px; max-height: 50px;" />
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
				<div>
					<audio id="audioPlayer" :src="audioSrc" ref="audioPlayer" @ended="onAudioEnded" @error="handleError" @loadeddata="handleLoadedData" @timeupdate="onTimeUpdate" controls></audio>
				</div>
				<div v-if="showInfo" class="playerTips">正在播放：{{ song_title }} ------ {{ song_singer }}</div>
				<img :src="coverImgSrc" alt="歌曲封面" />
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
						<div class="playTitle">
							播放列表
						</div>
						<div>
							<span>播放模式：</span>
							<el-select v-model="playMode" placeholder="请选择播放模式">
								<el-option v-for="item in playModeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
							</el-select>
						</div>
						<div class="tableArea">
							<el-table :data="playList" style="width: 100%" ref="playListRef" id="table_count" stripe highlight-current-row>
								<el-table-column prop="song_title" label="歌曲名"></el-table-column>
								<el-table-column prop="song_singer" label="歌手名"></el-table-column>
								<el-table-column label="歌曲封面">
									<template slot-scope="scope">
										<img :src="scope.row.cover" alt="歌曲封面" style="max-width: 50px; max-height: 50px;" />
									</template>
								</el-table-column>
								<el-table-column label="按钮">
									<template slot-scope="scope">
										<div class="playArea">
											<el-tooltip content="播放" placement="top" v-if="!scope.row.isPlaying">
												<i class="el-icon-video-play" @click="playAudio(scope.row, scope.$index, true, 'playList')"></i>
											</el-tooltip>
											<el-tooltip content="暂停" placement="top" v-if="scope.row.isPlaying">
												<i class="el-icon-video-pause" @click="playAudio(scope.row, scope.$index, false, 'playList')"></i>
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
			song_title: "", // 歌曲名
			song_singer: "", // 歌手名
			showInfo: false,
			playList: [],
			playMode: 2,
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
			adjustTime: 50, // 毫秒数，为正数，歌词往歌曲前调节，为负数，歌词往歌曲后调节
			textIndex: 0, // 歌曲播放过程中对应歌词列表的歌词索引
			drapId: null //
		};
	},
	mounted() {
		this.handleAudio();
		if (this.musicStr) {
			this.searchMusic("reset");
		}
		// 如果播放列表有缓存，则取缓存
		try {
			this.playList = [];
			this.playList = JSON.parse(localStorage.getItem("playList_qq_quality")) || [];
		} catch (error) {
			this.playList = [];
			console.error("Error parsing data from localStorage: playList_qq_quality:", error);
		}
	},
	methods: {
		searchMusic(type = null) {
			this.btnLoding = true;
			if (!this.musicStr) return (this.btnLoding = false);
			this.musicStrCopy = this.musicStr;
			let url = `https://www.hhlqilongzhu.cn/api/dg_qqmusic_SQ.php?msg=${this.musicStrCopy}&type=json&num=60`;
			axios
				.get(url)
				.then(res => {
					this.tableList = res.data.data;
					// 给tableData增加一个 是否正在播放该歌曲的属性 isPlaying, 默认是false
					this.tableList.forEach(item => {
						item.isPlaying = false;
						item.cover = "https://bing.img.run/uhd.php";
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
			// 判断点击的是播放列表还是搜索列表
			let clickItem;
			if (area !== "playList") {
				try {
					let result = await this.getAllMusicInfo(this.musicStrCopy, row.n);
					let { data } = result.data;
					this.tableList.splice(index, 1, { ...this.tableList[index], cover: data.cover, music_url: data.music_url, lyric: data.lyric });
					console.log("this.lyricsArray === ", this.lyricsArray);
					console.log("this.tableList === ", this.tableList);
					clickItem = this.tableList[index];
					console.log("clickItem === ", clickItem);
				} catch (error) {
					console.log("error === ", error);
				}
			} else {
				clickItem = row;
			}
			console.log("clickItem === ", clickItem);
			// 处理歌词
			this.lyricsArray = this.parseLyrics(clickItem.lyric);
			this.musicObj = clickItem;
			this.song_singer = clickItem.song_singer;
			this.song_title = clickItem.song_title;
			this.coverImgSrc = clickItem.cover;
			if (area) {
				this.clickArea = area;
			}
			if (this.audioSrc == clickItem.music_url) {
				if (type) {
					this.audioRef.play(); // 开始播放
					clickItem.isPlaying = true;
				} else {
					this.audioRef.pause();
					clickItem.isPlaying = false;
				}
			} else {
				this.audioSrc = clickItem.music_url;
				clickItem.isPlaying = true;
				this.audioRef.play(); // 开始播放
			}
			setTimeout(() => {
				console.log("clickItem ==== ", clickItem);
				if (type) {
					this.drawer = false;
				}
				this.playerHandle(this.musicObj, type, area);
				this.currentIndex = this.playList.findIndex(item => item.music_url === this.audioSrc);
				console.log("this.currentIndex === ", this.currentIndex);
			}, 200);
			// this.song_title = row.song_title;
			// this.coverImgSrc = row.cover;
			// this.musicObj = row;
		},
		getAllMusicInfo(str, n) {
			let url = `https://www.hhlqilongzhu.cn/api/dg_qqmusic_SQ.php?msg=${str}&type=json&num=60&n=${n}`;
			return axios.get(url);
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
					if (this.playList.some(item => item.music_url == this.audioSrc)) {
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
		onAudioEnded() {
			// 当音频结束时调用此方法
		},
		handleError(event) {
			if (this.audioSrc) {
				console.error("音频加载失败:", event);
				this.showInfo = false;
				this.playerHandle(this.musicObj, false);
				// 可以在这里提供用户反馈，比如显示错误信息
				this.$message.warning("很抱歉，音频加载失败，请点击按钮切换其他歌曲");
			}
		},
		handleLoadedData() {
			this.$message.success("音频加载完成");
			console.log("音频加载完成");
			this.showInfo = true;
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
			let musicUrl = row.music_url;
			// 处理搜索列表 tableList 的播放按钮
			if (this.tableList.length) {
				this.tableList.forEach((item, index) => {
					item.isPlaying = false;
					if (item.music_url === musicUrl) {
						this.tableList.splice(index, 1, { ...this.tableList[index], isPlaying: type });
					}
				});
			}
			// 处理播放列表 playList
			if (this.playList.length) {
				this.playList.forEach((item, index) => {
					item.isPlaying = false;
					if (item.music_url === musicUrl) {
						this.playList.splice(index, 1, { ...this.playList[index], isPlaying: type });
					}
				});
			}
		},
		// 添加到播放列表
		async addPlayList(row, index) {
			let targetItem;
			// 通过mucic_url判断这首歌信息有没有全部拿到，没拿到的话调用接口查询全部信息
			if (!row.music_url) {
				try {
					let result = await this.getAllMusicInfo(this.musicStrCopy, row.n);
					// 顺便更新一下tableList列表
					let { data } = result.data;
					this.tableList.splice(index, 1, { ...this.tableList[index], cover: data.cover, music_url: data.music_url, lyric: data.lyric, id: this.generateId() });
					targetItem = this.tableList[index];
				} catch (error) {
					console.log("error === ", error);
					retrun;
				}
			} else {
				targetItem = row;
			}

			// 将歌曲信息全部查询到之后，再添加
			// 如果有重复的，不让添加
			let addUrl = targetItem.music_url;
			let hasResult = false;
			if (this.playList.length) {
				hasResult = this.playList.some(item => item.music_url == addUrl);
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
				localStorage.setItem("playList_qq_quality", JSON.stringify(playListDeepClone));
			} else {
				localStorage.setItem("playList_qq_quality", null);
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
			console.log("row === ", row);
			console.log("index === ", index);
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
					console.log("Updated tableDataClone:", JSON.parse(JSON.stringify(this.tableDataClone)));
					this.playList = _.cloneDeep(this.tableDataClone);
					this.saveToLocalStorage();
					// 更新当前播放的歌曲为新索引值
					this.playList.forEach((item, index) => {
						if (item.music_url == this.audioSrc) {
							this.currentIndex = index;
						}
					});
					// 这里添加滚动条定位的方法
					this.findRowById(this.playList[newIndex].id);
				}, 100);
			});
		},
		// 滚动条定位
		findRowById(id) {
			console.log("id === ", id);
			const targetRow = this.playList.find(row => row.id.toString() === id);
			if (targetRow) {
				this.$refs.playListRef.setCurrentRow(targetRow);
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
		parseLyrics(lyrics) {
			const lines = lyrics.split("\\n");
			const lyricsArray = [];
			lines.forEach(line => {
				const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.*)/);
				if (match) {
					const minutes = parseInt(match[1], 10);
					const seconds = parseInt(match[2], 10);
					const milliseconds = parseInt(match[3], 10) - this.adjustTime;
					const time = minutes * 60 + seconds + milliseconds / 100;
					const text = match[4];
					lyricsArray.push({ time, text });
				}
			});
			return lyricsArray;
		},
		// 更新实时歌词
		updateCurrentLyric() {
			for (let i = 0; i < this.lyricsArray.length; i++) {
				if (this.currentTime >= this.lyricsArray[i].time && (i === this.lyricsArray.length - 1 || this.currentTime < this.lyricsArray[i + 1].time)) {
					this.currentLyric = this.lyricsArray[i].text;
					this.textIndex = i;
					break;
				}
			}
		},
		// 随机生成id
		generateId() {
			return (
				"id_" +
				Math.random()
					.toString(36)
					.slice(2, 9)
			);
		},
		async refreshURL(row, index) {
			console.log("row === ", row);
			console.log("index === ", index);
			this.btnLoding = true;
			let song_singer = row.song_singer; // 歌手名
			let song_title = row.song_title; // 歌曲名
			let res_n = "";
			let res_url = "";
			// 优先级一：通过歌曲名发起请求搜索。如果找到 歌曲名和歌手名都符合的项，用对应的 n 再次发起请求 更新 music_url
			try {
				res_n = await this.queryMusic_n(song_title, song_singer, row.cover, 1);
				if (res_n == 0 || res_n) {
					res_url = await this.queryMusicUrl(song_title, res_n);
					if (res_url) {
						row.music_url = res_url;
                        row.isPlaying = false;
                        this.audioRef.pause()
                        this.audioSrc = row.music_url
                        // 将数组对象序列化为 JSON 字符串并存储
						this.saveToLocalStorage();
						this.$message.success("更新成功");
					} else {
						row.isPlaying = false;
						throw new Error("通过优先级一更新失败");
					}
				}
			} catch (error) {
				this.btnLoding = false;
				console.log("error === ", error);
			}

			// 优先级二：如果优先级一找不到， 则 通过 歌手名 发起请求 ，如果找到 歌曲名和歌手名都符合的项，用对应的 n 再次发起请求 更新 music_url

			// 优先级一、二 如果都没找到对应的歌曲，弹窗提示 "更新音乐链接失败，请从播放列表删除该歌曲，检索后重新添加到播放列表中"
		},
		// title：歌曲名/歌手名, 查询歌曲的n
		queryMusic_n(title, singer, cover, type) {
			let url1 = `https://www.hhlqilongzhu.cn/api/dg_qqmusic_SQ.php?msg=${type === 1 ? title : singer}&type=json&num=60`;
			return new Promise((resolve, reject) => {
				axios
					.get(url1)
					.then(res => {
						if (res.status !== 200) {
							throw new Error("接口报错");
						}
						console.log("res === ", res);
						let arr = res.data.data;
						let findItem = null;
						findItem = arr.find(item => item.song_title === title && item.song_singer === singer);
						console.log("findItem === ", findItem);

						if (findItem) {
							resolve(findItem.n);
							// 加一个查询条件n
							// this.queryMusicUrl(song_title, n);
						} else {
							if (type === 2) {
								reject("找不到对应的歌曲");
							}
                            this.queryMusic_n(title, singer, cover, 2);
						}
						this.btnLoding = false;
					})
					.catch(err => {
						this.btnLoding = false;
						this.$message.warning("请重新查询");
						reject(err);
					});
			});
		},
		// 通过n值查询歌曲url,
		queryMusicUrl(title, n) {
			let url2 = `https://www.hhlqilongzhu.cn/api/dg_qqmusic_SQ.php?msg=${title}&type=json&num=60&n=${n}`;
			return new Promise((resolve, reject) => {
				axios
					.get(url2)
					.then(res => {
						if (res.status !== 200) {
							throw new Error("接口报错");
						}
						console.log(res);
						let url = res.data.data.music_url;
						resolve(url);
					})
					.catch(err => {
						reject(err);
					});
			});
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
.all {
	display: flex;
	overflow-y: auto; /* 当内容超过最大高度时，显示垂直滚动条 */
	overflow-x: hidden; /* 不显示横向滚动条 */
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
	align-items: center; /* 垂直居中 */
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
	margin-left: 20px;
	text-align: left;
	.playTitle {
		color: #149ef4;
		font-size: 32px;
		font-weight: bold;
	}
}
</style>
