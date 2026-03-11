<template>
	<div>
		<div class="title1">酷狗音乐</div>
		<div class="title2">温馨提示：【公司的网听不了歌，要听歌连热点，高品质音频请注意流量消耗】</div>
		<div class="all">
			<div class="search">
				<el-form :model="dataForm" @submit.native.prevent ref="dataForm" label-width="160px">
					<el-row :gutter="24">
						<el-col :span="6">
							<el-form-item label="歌手名/歌曲名：">
								<el-input v-model.trim="dataForm.msg" placeholder="请输入歌手名或歌曲名"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-form-item label="音频质量：">
								<el-select v-model="dataForm.quality" placeholder="请选择音频质量">
									<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="6" prop="num">
							<el-form-item label="搜索结果条目数：">
								<el-input v-model="dataForm.num" placeholder="请输入正整数"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="6">
							<el-button type="primary" @click="query">搜索</el-button>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<div class="content">
				<el-table :data="tableData" style="width: 100%">
					<el-table-column prop="n" label="歌曲id"></el-table-column>
					<el-table-column prop="title" label="歌曲名"></el-table-column>
					<el-table-column prop="singer" label="歌手名"></el-table-column>
					<!-- <el-table-column label="歌曲封面">
						<template slot-scope="scope">
							<img src="http://imge.kugou.com/stdmusic/400/20230920/20230920142503632013.jpg" alt="歌曲封面" style="max-width: 50px; max-height: 50px;" />
						</template>
					</el-table-column> -->
					<el-table-column label="按钮">
                        <template slot-scope="scope">
                            <div class="playArea">
                                <i class="el-icon-video-play" @click="playAudio(scope.row, scope.$index)"></i>
                            </div>   
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div>
				<div>
					<el-dialog title="播放弹窗" :visible.sync="dialogVisible" width="60%">
						<!-- <div class="musicImg">
						<img :src="coverImgSrc" alt="歌曲封面" />
					</div> -->
						<div class="audio">
							<audio id="audioPlayer" :src="audioSrc" ref="audioPlayer" @ended="onAudioEnded" @error="handleError" @loadeddata="handleLoadedData" controls></audio>
						</div>
					</el-dialog>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import axios from "axios";
export default {
	data() {
		return {
			dataForm: {
				msg: "周杰伦", // 歌手名 or 歌曲名
				quality: "flac", // 歌曲质量 128/320/flac/vipe
				num: 10 // 展示多少条 默认30
			},
			options: [
				{
					label: "128",
					value: "128"
				},
				{
					label: "320",
					value: "320"
				},
				{
					label: "flac",
					value: "flac"
				},
				{
					label: "vipe",
					value: "vipe"
				}
			],
			tableData: [],
			audioSrc: "",
			dialogVisible: false
		};
	},
	methods: {
		query() {
			if (/^\+?(0|[1-9]\d*)$/.test(this.dataForm.num)) {
				this.queryMusic();
			} else {
				this.$message.warning("搜索结果条目数应该为正整数");
			}
		},
		queryMusic(n = null, index = null) {
			let { msg, quality, num } = this.dataForm;
			let url;
			if (n) {
				url = `/longzhu?type=json&&msg=${msg}&num=${20}&n=${n}&key=DragonF51D6A15D46B71E3841B79481C714093`;
			} else {
				url = `/longzhu?type=json&&msg=${msg}&num=${20}&key=DragonF51D6A15D46B71E3841B79481C714093`;
			}
			axios
				.get(url)
				.then(res => {
					console.log("res === ", res);
					if (n) {
						this.tableData[index].cover = res.data.cover;
						this.audioSrc = res.data.music_url;
						this.dialogVisible = true;
						setTimeout(() => {
							this.handleAudio();
						}, 2000);
					} else {
						this.tableData = res.data.data;
						this.tableData.forEach(item => {
							this.$set(item, "cover", "");
						});
					}
				})
				.catch(err => {
					this.btnLoding = false;
					this.$message.warning("请选择其他歌曲");
					console.log("err === ", err);
				});
		},
		playAudio(row, index) {
			console.log("row === ", row);
			console.log("index === ", index);
			this.queryMusic(row.n, index);
		},
		handleAudio() {
            console.log('this.audioSrc === ', this.audioSrc)
            const audio = this.$refs.audioPlayer;
			// 监听播放开始事件
			audio.addEventListener("play", () => {
				console.log("开始播放");
			});

			// 监听暂停事件
			audio.addEventListener("pause", () => {
				console.log("暂停播放");
			});

			// 监听播放结束事件
			audio.addEventListener("ended", () => {
				console.log("播放结束");
			});
		},
		onAudioEnded() {
			// 当音频结束时调用此方法
			this.isPlaying_qq = false;
		},
		handleError(event) {
			console.error("音频加载失败:", event);
			// 可以在这里提供用户反馈，比如显示错误信息
			this.$message.warning("很抱歉，音频加载失败，请点击按钮切换其他歌曲");
		},
		handleLoadedData() {
			this.$message.success("音频加载完成");
			console.log("音频加载完成");
		}
	}
};
</script>

<style>
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
.all {
	padding: 20px;
	min-height: calc(calc(100vh - 50px - 38px - 30px));
}
.search {
	margin-top: 50px;
}
.playArea {
	cursor: pointer;
	font-size: 24px;
}
</style>
