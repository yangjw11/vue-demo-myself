<template>
	<div>
		<div class="title1">音乐功能大全</div>
		<div class="all">
			<div class="content">
				<div class="search">
					<div class="musicInput">
                        <el-form :model="dataForm" @submit.native.prevent ref="dataForm">
                            <el-row :gutter="24">
                                <el-col :span="6">
                                    <el-form-item label="歌曲来源">

                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
						<el-input v-model="musicStr" @keyup.enter.native="searchMusic('reset')"></el-input>
					</div>
					<div class="musicBtn">
						<el-button @click="searchMusic('reset')" type="primary" :loading="btnLoding">搜索</el-button>
						<el-button @click="reset()" :loading="btnLoding">清空</el-button>
					</div>
				</div>
				<div class="tableArea">
					<el-table :data="tableData" style="width: 100%">
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
									<!-- 值：{{ scope.row.isPlaying }} -->
									<i v-if="!scope.row.isPlaying" class="el-icon-video-play" @click="playAudio(scope.row, scope.$index, true)"></i>
									<i v-if="scope.row.isPlaying" class="el-icon-video-pause" @click="playAudio(scope.row, scope.$index, false)"></i>
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
				<div>
					<audio id="audioPlayer" :src="audioSrc" ref="audioPlayer" @ended="onAudioEnded" @error="handleError" @loadeddata="handleLoadedData" controls></audio>
				</div>
				<div v-if="showInfo" class="playerTips">正在播放：{{ singer }} ------ {{ name }}</div>
				<img :src="coverImgSrc" alt="歌曲封面" />
			</div>
		</div>
	</div>
</template>
<script>
import axios from "axios";
export default {
	data() {
		return {
			musicStr: "周杰伦",
			musicIndex: "",
			btnLoding: false,
			tableData: [],
			total: 0,
			currentPage: 1,
			pageSize: 10,
			// dialogVisible: false,
			audioSrc: "", // 音频路径
			coverImgSrc: "https://cn.bing.com//th?id=OHR.MonoTufa_ZH-CN4998806540_1920x1080.jpg&amp;rf=LaDigue_1920x1080.jpg&amp;pid=hp", // 歌曲封面url
			name: "", // 歌曲名
			singer: "", // 歌手名
			showInfo: false,
            musicUrlOptions:[
                {

                },
                {

                },
            ],
            testUrl:'https://rc-sycdn.kuwo.cn/980634157174250359d9636fb50544e0/6752671f/resource/s1/1/15/995917246.flac?from=bodian'
		};
	},
	mounted() {
		this.handleAudio();
		if (this.musicStr) {
			this.searchMusic("reset");
		}
	},
	methods: {
		searchMusic(type = null) {
			this.btnLoding = true;
			if (type === "reset") {
				console.log("123123123123");
				this.currentPage = 1;
			}
			if (!this.musicStr) return (this.btnLoding = false);
			let url = `https://zj.v.api.aa1.cn/api/qqmusic/demo.php?type=1&q=${this.musicStr}&p=${this.currentPage}&n=${this.pageSize}`;
			axios
				.get(url)
				.then(res => {
					console.log("res === ", res);
					this.tableData = res.data.list;
					// 给tableData增加一个 是否正在播放该歌曲的属性 isPlaying, 默认是false
					this.tableData.forEach(item => {
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
		playAudio(row, index, type = null) {
			this.showInfo = false;
			// 处理上一个的播放按钮
			this.playerHandle(this.musicIndex, false);
			console.log("row === ", row);
			this.singer = row.singer;
			this.name = row.name;
			this.coverImgSrc = row.cover;
			const audio = this.$refs.audioPlayer;
			if (this.audioSrc == row.url) {
				if (type) {
					audio.play(); // 开始播放
					console.log(111);
					row.isPlaying = true;
				} else {
					audio.pause();
					console.log(222);
					row.isPlaying = false;
				}
			} else {
				this.audioSrc = row.url;
				// this.audioSrc = this.testUrl;
				row.isPlaying = true;
			}

			setTimeout(() => {
				// this.tableData.splice(index, 1, row);
				this.musicIndex = index;
				// this.$set(row, isPlaying, true); // 这种写法可以考虑
				this.playerHandle(this.musicIndex, row.isPlaying);
			}, 300);
		},
		handleAudio() {
			const audio = this.$refs.audioPlayer;
			// 监听播放开始事件
			audio.addEventListener("play", () => {
				console.log("开始播放");
				this.playerHandle(this.musicIndex, true);
			});

			// 监听暂停事件
			audio.addEventListener("pause", () => {
				console.log("暂停播放");
				this.playerHandle(this.musicIndex, false);
			});

			// 监听播放结束事件
			audio.addEventListener("ended", () => {
				console.log("播放结束");
			});
		},
		onAudioEnded() {
			// 当音频结束时调用此方法
		},
		handleError(event) {
			if (this.audioSrc) {
				console.error("音频加载失败:", event);
				// 可以在这里提供用户反馈，比如显示错误信息
				this.$message.warning("很抱歉，音频加载失败，请点击按钮切换其他歌曲");
			}
		},
		handleLoadedData() {
			this.$message.success("音频加载完成");
			console.log("音频加载完成");
			this.showInfo = true;
			const audio = this.$refs.audioPlayer;
			audio.play(); // 开始播放
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
		playerHandle(index, type) {
			if (index || index == 0) {
				const updatedItem = { ...this.tableData[index], isPlaying: type };
				this.$set(this.tableData, index, updatedItem);
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
		width: 50%;
		text-align: center;
		.search {
			margin: 0 auto;
			width: 500px;
			display: flex;
		}
	}
}

.musicInput {
	width: 100%;
}
.playArea {
	cursor: pointer;
	font-size: 24px;
}
</style>
