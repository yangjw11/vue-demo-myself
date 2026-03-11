<template>
	<div>
		<div class="title1">QQ音乐库(项目暂不可用，接口坏了)</div>
		<div class="all">
			<div class="content">
				<div class="search">
					<div class="musicInput">
						<el-input v-model="musicStr" placeholder="请输入歌手名/歌曲名" @keyup.enter.native="searchMusic('reset')"></el-input>
					</div>
					<div class="musicBtn">
						<el-button @click="searchMusic('reset')" type="primary" :loading="btnLoding">搜索</el-button>
						<el-button @click="reset()" :loading="btnLoding">清空</el-button>
					</div>
				</div>
				<div class="tableArea">
					<el-table :data="tableList" style="width: 100%">
						<el-table-column prop="name" label="歌曲名"></el-table-column>
						<el-table-column prop="singer" label="歌手名"></el-table-column>
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
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
				</div>
				<!-- <div>
					<el-dialog title="播放弹窗" :visible.sync="dialogVisible" width="60%">
						<div class="musicImg">
							<img :src="coverImgSrc" alt="歌曲封面" />
						</div>
						<div class="audio">
						<audio id="audioPlayer" :src="audioSrc" ref="audioPlayer" @ended="onAudioEnded" @error="handleError" @loadeddata="handleLoadedData" controls></audio>
					</div>
					</el-dialog>
				</div> -->
			</div>
			<div class="title2">
				<div v-if="showInfo" class="playerTips">正在播放：{{ singer }} ------ {{ name }}</div>
				<img :src="coverImgSrc" alt="歌曲封面" />
				<div>
					<audio id="audioPlayer" :src="audioSrc" ref="audioPlayer" @ended="onAudioEnded" @error="handleError" @loadeddata="handleLoadedData" controls></audio>
				</div>
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
						<el-table :data="playList" style="width: 100%" id="table_count" stripe>
							<el-table-column prop="name" label="歌曲名"></el-table-column>
							<el-table-column prop="singer" label="歌手名"></el-table-column>
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
									</div>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</div>
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
			musicIndex: "",
			musicObj: "",
			btnLoding: false,
			tableList: [],
			total: 0,
			currentPage: 1,
			pageSize: 10,
			// dialogVisible: false,
			audioSrc: "", // 音频路径
			coverImgSrc: "https://cn.bing.com//th?id=OHR.MonoTufa_ZH-CN4998806540_1920x1080.jpg&amp;rf=LaDigue_1920x1080.jpg&amp;pid=hp", // 歌曲封面url
			name: "", // 歌曲名
			singer: "", // 歌手名
			showInfo: false,
			playList: [],
			playMode: 1,
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
			tableDataClone: []
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
			this.playList = JSON.parse(localStorage.getItem("playList_qq")) || [];
		} catch (error) {
			this.playList = [];
			console.error("Error parsing data from localStorage: playList_qq:", error);
		}
		// 初始化拖动效果
		this.rowDrop();
	},
	methods: {
		searchMusic(type = null) {
			this.btnLoding = true;
			if (type === "reset") {
				this.currentPage = 1;
			}
			if (!this.musicStr) return (this.btnLoding = false);
			let url = `https://zj.v.api.aa1.cn/api/qqmusic/demo.php?type=1&q=${this.musicStr}&p=${this.currentPage}&n=${this.pageSize}`;
			axios
				.get(url)
				.then(res => {
					console.log("res === ", res);
					this.tableList = res.data.list;
					// 给tableData增加一个 是否正在播放该歌曲的属性 isPlaying, 默认是false
					this.tableList.forEach(item => {
						item.isPlaying = false;
					});
					this.musicIndex = "";
					this.total = res.data.count;
					this.btnLoding = false;
				})
				.catch(err => {
					this.btnLoding = false;
					this.$message.warning("请重新查询");
					console.log("err === ", err);
				});
		},
		playAudio(row, index = null, type = null, area = null) {
			this.singer = row.singer;
			this.name = row.name;
			this.coverImgSrc = row.cover;
			this.musicObj = row;

			if (area) {
				this.clickArea = area;
			}
			if (this.audioSrc == row.url) {
				if (type) {
					this.audioRef.play(); // 开始播放
					row.isPlaying = true;
				} else {
					this.audioRef.pause();
					row.isPlaying = false;
				}
			} else {
				this.audioSrc = row.url;
				row.isPlaying = true;
				this.audioRef.play(); // 开始播放
			}

			setTimeout(() => {
				this.playerHandle(this.musicObj, type, area);
				this.currentIndex = this.playList.findIndex(item => item.url === this.audioSrc);
			}, 200);
		},
		handleAudio() {
			this.audioRef = this.$refs.audioPlayer;
			console.log("this.audioRef 111 === ", this.audioRef);
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
				console.log("this.audioRef === ", this.audioRef);
				// 首先判断播放列表有歌曲 且 当前点击播放的区域是playList

				if (this.playList.length && this.clickArea === "playList") {
					console.log("1111111111");
					console.log("this.playMode === ", this.playMode);
					// 如果正在播放的音乐 和 播放列表的歌曲相匹配
					if (this.playList.some(item => item.url == this.audioSrc)) {
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
							console.log("this.playList[this.currentIndex] === ", this.playList[this.currentIndex]);
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
		handleSizeChange(newSize) {
			this.pageSize = newSize;
			this.searchMusic();
		},
		handleCurrentChange(newPage) {
			this.currentPage = newPage;
			this.searchMusic();
		},
		reset() {
			this.musicStr = "";
		},
		// row: 行信息  type：播放true 暂停 flase  area: tableList  playList
		playerHandle(row, type = null, area = null) {
			console.log("row === ", row);
			console.log("type === ", type);
			console.log("area === ", area);

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
		addPlayList(row) {
			console.log("row === ", row);
			// 如果有重复的，不让添加
			let addUrl = row.url;
			let hasResult = false;
			console.log("this.playList === ", this.playList);
			if (this.playList.length) {
				hasResult = this.playList.some(item => item.url == addUrl);
			} else {
				hasResult = false;
			}
			if (!this.playList.length || !hasResult) {
				this.playList.push(row);
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
			console.log("this.playList === ", this.playList);
			let playListDeepClone = _.cloneDeep(this.playList);

			if (playListDeepClone.length) {
				playListDeepClone.forEach(item => {
					item.isPlaying = false;
				});
				localStorage.setItem("playList_qq", JSON.stringify(playListDeepClone));
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
            this.dragSortWay(index, 0)
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
				}, 100);
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
	}
	.content {
		width: 40%;
		text-align: center;
		.search {
			margin: 0 auto;
			width: 500px;
			display: flex;
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
	.el-icon-rank {
		font-size: 30px;
		cursor: pointer;
	}
	.el-icon-top {
		font-size: 30px;
		margin-left: 15px;
		cursor: pointer;
	}
}
.playListArea {
	text-align: left;
	.playTitle {
		color: #149ef4;
		font-weight: 24px;
		font-weight: bold;
	}
}
</style>
