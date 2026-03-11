<template>
	<div>
		<div class="title1">音乐库(有歌词,可选品质，搜索时候请输入繁体字)</div>
		<div class="all">
			<div class="content">
				<div class="search">
					<div class="musicInput">
						<el-input v-model="musicStr" placeholder="请输入歌手名/歌曲名（繁体字更精准）" @keyup.enter.native="searchMusic('reset')"></el-input>
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
						<el-table-column prop="artist" label="歌手名"></el-table-column>
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
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" layout="total, sizes, prev, pager, next, jumper"> </el-pagination>
				</div>
			</div>
			<div class="title2">
				<div class="playerChoose">
					<div>
						<audio id="audioPlayer" :src="audioSrc" ref="audioPlayer" @ended="onAudioEnded" @error="handleError" @loadeddata="handleLoadedData" @timeupdate="onTimeUpdate" controls></audio>
					</div>
					<div>
						<el-tooltip class="item" effect="dark" content="点击将黄家驹的《长城》添加到播放列表" placement="top-start">
							<el-button type="primary" @click="addPlayList(beyondItem, 999)">致敬beyond，致敬 黄家驹</el-button>
						</el-tooltip>
					</div>
					<div>
						<el-select v-model="musicQuality" placeholder="请选择音质" @change="changeQuality" :loading="btnLoding">
							<el-option v-for="item in qualityOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
						</el-select>
					</div>
				</div>
				<div v-if="showInfo" class="playerTips">正在播放：{{ name }} ------ {{ artist }}</div>
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
							<el-table :data="playList" style="width: 100%" ref="playListRef" id="table_count" stripe highlight-current-row v-loading="btnLoding">
								<el-table-column prop="name" label="歌曲名"></el-table-column>
								<el-table-column prop="artist" label="歌手名"></el-table-column>
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
import OpenCC from "opencc-js"; // 将繁体字转化为简体字，用于歌词的转化
export default {
	data() {
		return {
			musicStr: "周杰倫",
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
			adjustTime: 0, // 毫秒数，为正数，歌词往歌曲前调节，为负数，歌词往歌曲后调节
			textIndex: 0, // 歌曲播放过程中对应歌词列表的歌词索引
			qualityOptions: [
				{
					value: "128",
					label: "普通音质"
				},
				{
					value: "192",
					label: "标准音质"
				},
				{
					value: "320",
					label: "HQ高品质"
				},
				{
					value: "740",
					label: "SQ无损音质"
				}
			],
			musicQuality: "128",
			// total: 0,
			currentPage: 1,
			pageSize: 10,
			targetId: "", // 当前播放音乐的id
			// 黄家驹的长城
			beyondItem: {
				id: "7rr7x93CJNAhQv5jXDjRe6",
				name: "长城",
				artist: "BEYOND",
				album: "继续革命",
				pic_id: "7rr7x93CJNAhQv5jXDjRe6",
				url_id: "7rr7x93CJNAhQv5jXDjRe6",
				lyric_id: "7rr7x93CJNAhQv5jXDjRe6",
				isPlaying: false,
				cover: "https://i.scdn.co/image/ab67616d0000b273a36aa47c57b7a21343bde2fb",
				music_url: "https://cy-sycdn.kuwo.cn/14ed0f582e431205da588919821d03e2/67a9b55f/resource/n2/8/26/1227591448.mp3?bitrate$128&format$mp3",
				lyric:
					"[00:59.28] 遙遠的東方 遼闊的邊疆\n[01:02.10] 還有遠古的破牆\n[01:05.30] 前世的滄桑 後世的風光\n[01:08.36] 萬里千山牢牢接壤\n[01:11.55] 圍著老去的國度\n[01:14.69] 圍著事實的真相\n[01:17.60] 圍著浩瀚的歲月\n[01:20.63] 圍著欲望與理想\n[01:23.50] ♪\n[01:29.81] 迷信的村莊 神秘的中央\n[01:32.67] 還有昨天的戰場\n[01:36.09] 皇帝的新衣 熱血的纓槍\n[01:39.17] 誰卻甘心流連塞上?\n[01:42.09] 圍著老去的國度\n[01:44.94] 圍著事實的真相\n[01:48.11] 圍著浩瀚的歲月\n[01:51.31] 圍著欲望與理想 叫嚷\n[01:56.10] 矇著耳朵 哪裡哪天不再聽到在呼號的人\n[02:05.31] Whoa, hoh-oh-oh\n[02:08.32] 矇著眼睛 再見往昔景仰的那樣一道疤痕\n[02:17.51] Whoa, hoh-oh-oh\n[02:20.34] 留在地殼頭上\n[02:23.14] ♪\n[02:35.56] 無冕的身軀 忘我的思想\n[02:38.61] 還有顯赫的破牆\n[02:41.63] 誰也衝不開 誰也拋不低\n[02:44.72] 誰要一生流離浪蕩?\n[02:47.85] 圍著老去的國度\n[02:50.72] 圍著事實的真相\n[02:53.87] 圍著浩瀚的歲月\n[02:57.00] 圍著欲望與理想 叫嚷\n[03:02.19] 矇著耳朵 哪裡哪天不再聽到在呼號的人\n[03:11.06] Whoa, hoh-oh-oh\n[03:14.28] 矇著眼睛 再見往昔景仰的那樣一道疤痕\n[03:23.60] Whoa, hoh-oh-oh\n[03:26.06] 留在地殼頭上\n[03:28.67] ♪\n[03:57.14] 矇著耳朵 哪裡哪天不再聽到在呼號的人\n[04:06.35] Whoa, hoh-oh-oh\n[04:09.24] 矇著眼睛 再見往昔景仰的那樣一道疤痕\n[04:18.54] Whoa, hoh-oh-oh\n[04:21.28] 留在地殼頭上\n[04:24.34] \n"
			}
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
			this.playList = JSON.parse(localStorage.getItem("playList_qq_quality_choose")) || [];
		} catch (error) {
			this.playList = [];
			console.error("Error parsing data from localStorage: playList_qq_quality_choose:", error);
		}
	},
	methods: {
		searchMusic(type = null) {
			this.btnLoding = true;
			if (!this.musicStr) this.btnLoding = false;
			if (type === "reset") {
				this.currentPage = 1;
			}
			this.musicStrCopy = this.musicStr;
			let url = `rrr?name=${this.musicStrCopy}&types=search&source=tidal&count=${this.pageSize}&pages=${this.currentPage}`;
			axios
				.get(url)
				.then(res => {
					console.log("res === ", res);
					this.tableList = res.data;
					// 处理表格数据 是否正在播放该歌曲的属性 isPlaying, 默认是false
					this.tableList.forEach(item => {
						item.artist = item.artist.join(",");
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
			// this.currentTime = 0
			this.btnLoding = true;
			this.targetId = row.id;
			this.musicQuality = "128"; // 默认是普通音质
			let clickItem;
			// 如果没有播放链接
			if (!row.music_url) {
				try {
					let result = await this.getAllMusicInfo(row.id);
					// 歌曲链接
					let musicUrl = result.musicUrl;
					// 歌词
					let musicLyric = result.musicLyric;
					// 歌曲封面
					let musicImg = result.musicImg;
					this.tableList.splice(index, 1, { ...this.tableList[index], cover: musicImg, music_url: musicUrl, lyric: musicLyric });
					console.log("this.tableList === ", this.tableList);
					clickItem = this.tableList[index];
					console.log("clickItem === ", clickItem);
				} catch (error) {
					console.log("error === ", error);
				}
			} else {
				clickItem = row;
			}
			this.btnLoding = false;
			console.log("clickItem === ", clickItem);
			// 处理歌词
			this.lyricsArray = await this.parseLyrics(clickItem.lyric);
			console.log("this.lyricsArray === ", this.lyricsArray);
			this.musicObj = clickItem;
			this.artist = clickItem.artist;
			this.name = clickItem.name;
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
				this.currentTime = 0;
				this.audioRef.currentTime = this.currentTime;
				this.textIndex = 0;
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
				this.currentIndex = this.playList.findIndex(item => item.id === this.targetId);
			}, 200);
			// this.name = row.name;
			// this.coverImgSrc = row.cover;
			// this.musicObj = row;
		},
		async getAllMusicInfo(id, type = null) {
			// 通过id获取歌曲链接 默认是128标准音质，因为高品质音乐网络卡
			let url1 = `rrr?types=url&source=tidal&id=${id}&br=${type ? this.musicQuality : "128"}`;
			// 通过id获取歌词
			let url2 = `rrr?types=lyric&source=tidal&id=${id}`;
			// 通过id获取歌曲封面
			let url3 = `rrr?types=pic&source=tidal&id=${id}&size=500`;
			// 发送请求

			if (!type) {
				let req1 = axios.get(url1);
				let req2 = axios.get(url2);
				let req3 = axios.get(url3);
				const resAll = await Promise.all([req1, req2, req3]);
				// 歌曲链接
				let musicUrl = resAll[0].data.url;
				// 歌词
				let musicLyric = resAll[1].data.lyric;
				// 歌曲封面
				let musicImg = resAll[2].data.url;
				return { musicUrl, musicLyric, musicImg };
			} else {
				let req1 = axios.get(url1);
				const resAll = await Promise.all([req1]);
				// 歌曲链接
				let musicUrl = resAll[0].data.url;
				return { musicUrl };
			}
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
					if (this.playList.some(item => item.id === this.targetId)) {
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
				// this.audioRef.currentTime = this.currentTime
				// setTimeout(()=>{
				//     this.audioRef.play()
				// },2000)
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
			console.log("row === ", row);
			this.btnLoding = true;
			let targetItem;
			// 通过mucic_url判断这首歌信息有没有全部拿到，没拿到的话调用接口查询全部信息
			if (!row.music_url) {
				try {
					// {musicUrl, musicLyric, musicImg};
					let result = await this.getAllMusicInfo(row.id);
					this.tableList.splice(index, 1, { ...this.tableList[index], cover: result.musicImg, music_url: result.musicUrl, lyric: result.musicLyric });
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
			let id = targetItem.id;
			let hasResult = false;
			if (this.playList.length) {
				hasResult = this.playList.some(item => item.id == id);
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
				localStorage.setItem("playList_qq_quality_choose", JSON.stringify(playListDeepClone));
			} else {
				localStorage.setItem("playList_qq_quality_choose", null);
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
					// 如果这首歌正在播放currentIndex 为新索引值
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
			const targetRow = this.playList.find(row => row.id.toString() == id);
			console.log("targetRow === ", targetRow);
			if (targetRow) {
				console.log("this.$refs.playListRef === ", this.$refs.playListRef);
				let res = this.$refs.playListRef.setCurrentRow(targetRow);
				console.log("res === ", res);
				this.$nextTick(() => {
					const el = this.$refs.playListRef.$el.querySelector(`.current-row`);
					console.log("el === ", el);
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
		async parseLyrics(lyrics) {
			let simplifiedStr;
			// ==============================================================================
			const converter = OpenCC.Converter({ from: "tw", to: "cn" });
			simplifiedStr = converter(lyrics);
			// ================================================================
			const lines = simplifiedStr.split("\n");
			console.log("lines === ", lines);
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
		updateCurrentLyric() {
			for (let i = 0; i < this.lyricsArray.length; i++) {
				if (this.currentTime >= this.lyricsArray[i].time && (i === this.lyricsArray.length - 1 || this.currentTime < this.lyricsArray[i + 1].time)) {
					this.currentLyric = this.lyricsArray[i].text;
					this.textIndex = i;
					break;
				}
			}
		},
		handleSizeChange(newSize) {
			this.pageSize = newSize;
			this.searchMusic("reset");
		},
		handleCurrentChange(newPage) {
			this.currentPage = newPage;
			this.searchMusic();
		},
		async changeQuality(e) {
			if (this.targetId === "7rr7x93CJNAhQv5jXDjRe6") return this.$message.warning("《长城》这首歌不可以切换音质");
			this.btnLoding = true;
			try {
				if (this.targetId) {
					let res = await this.getAllMusicInfo(this.targetId, true);
					console.log("res.musicUrl === ", res.musicUrl);

					const oldTime = this.currentTime;
					const wasPlaying = this.isPlaying;
					this.audioSrc = res.musicUrl; // 更新音乐链接
					this.$nextTick(() => {
						// 确保 DOM 已经更新
						this.audioRef.currentTime = oldTime; // 设置到之前的时间点
						if (wasPlaying) {
							this.audioRef.play(); // 如果之前是在播放，则继续播放
						}
					});
					this.btnLoding = false;
				}
			} catch (error) {
				console.log("error === ", error);
				this.btnLoding = false;
			}
			this.btnLoding = false;
		},
		refreshURL(row, index) {
			console.log("row === ", row);
			console.log("index === ", index);
			this.btnLoding = true;
			// 如果是黄家驹的长城
			if (row.id === "7rr7x93CJNAhQv5jXDjRe6") {
				let baseURL = "https://music-api.gdstudio.xyz/";
				let url = `/rrr?types=url&source=spotify&id=${row.id}&br=320`;
				axios
					.get(url)
					.then(res => {
						if (res.status !== 200) {
							throw new Error("接口报错");
						}
                        
						row.music_url = baseURL + res.data.url;
                        row.isPlaying = false;
                        this.audioRef.pause()
                        this.audioSrc = row.music_url
						this.btnLoding = false;
						// 将数组对象序列化为 JSON 字符串并存储
						this.saveToLocalStorage();
						this.$message.success("更新成功");
					})
					.catch(err => {
						this.btnLoding = false;
						this.$message.warning("请重新查询");
						console.log("err === ", err);
					});
			} else {
				let url1 = `/rrr?types=url&source=tidal&id=${row.id}&br=${this.musicQuality ? this.musicQuality : "128"}`;
				axios
					.get(url1)
					.then(res => {
						if (res.status !== 200) {
							throw new Error("接口报错");
						}
						row.music_url = res.data.url;
						this.btnLoding = false;
						// 将数组对象序列化为 JSON 字符串并存储
						this.saveToLocalStorage();
						this.$message.success("更新成功");
					})
					.catch(err => {
						this.btnLoding = false;
						this.$message.warning("请重新查询");
						console.log("err === ", err);
					});
			}
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
	text-align: left;
	margin-left: 20px;
	.playTitle {
		color: #149ef4;
		font-weight: 32px;
		font-weight: bold;
	}
}
</style>
