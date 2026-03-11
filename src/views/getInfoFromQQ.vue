<template>
	<div>
		<div class="title1">通过QQ号查询用户信息</div>
		<div class="title2"></div>
		<div style="width: 100%; text-align: center;">
			<div class="form">
				<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
					<el-form-item label="QQ号码" prop="qq">
						<el-input v-model.number="ruleForm.qq" @input="handleInput" :maxlength="12" :minlength="5"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button :loading="btnLoding" type="primary" @click="submitForm('ruleForm')">提交</el-button>
						<el-button :loading="btnLoding" @click="resetForm('ruleForm')">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="content" v-if="showContent">
				<div>QQ号：{{ infoObj.qq }}</div>
				<div>昵称：{{ infoObj.nickname }}</div>
				<div>性别：{{ infoObj.sex }}</div>
				<div>个性签名：{{ infoObj.sign }}</div>
				<div>等级：{{ infoObj.level }}</div>
				<div>注册时间：{{ infoObj.reg_time }}</div>
				<div class="logo">
					<img :src="logoURL" alt="头像" />
				</div>
			</div>
			<div>
				<el-button type="primary" :loading="btnLoding" @click="getMusicInfo">点击随机获取一首歌（点击太多会被限制）</el-button>
			</div>
			<div class="musicContent" v-if="showMusic">
				<div>歌曲名：{{ musicObj.name }}</div>
				<div>歌手名：{{ musicObj.artistsname }}</div>
				<audio id="audio" :src="musicObj.url" ref="audio" @ended="onAudioEnded" @error="handleError" @loadeddata="handleLoadedData" @timeupdate="onTimeUpdate" controls></audio>
				<div class="progress">
					<input type="range" min="0" max="100" v-model="progress" @change="seek" />
				</div>
				<el-button @click="togglePlayPause">
					{{ isPlaying ? "暂停" : "播放" }}
				</el-button>
				<div class="musicImg">
					<img :src="musicObj.picurl" alt="歌曲海报" />
				</div>
				<div>接口信息：{{ musicObj }}</div>
			</div>
			<div class="sweet">
				<el-button @click="getSweetWords" type="primary">获取土味情话（点击太多会被限制）</el-button>
				<div class="sweetContent">{{ sweetWords }}</div>
			</div>
			<div class="sweet">
				<span>
					请输入歌曲名称：
				</span>
				<div class="musicInput">
					<el-input v-model="musicStr" @keyup.enter.native="searchMusic('reset')"></el-input>
				</div>
				<el-button :lodaing="btnLoding" type="primary" @click="searchMusic('reset')">搜索</el-button>
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
							<span @click="playAudio(scope.row)">点击打开播放弹窗</span>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30]" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
			</div>
			<div>
				<el-dialog title="播放弹窗" :visible.sync="dialogVisible" width="60%">
                    <div class="musicImg">
                        <img :src="coverImgSrc" alt="歌曲封面">
                    </div>
					<div class="audio">
						<audio id="audio_qq" :src="audioSrc_qq" ref="audio_qq" @ended="onAudioEnded_qq" @error="handleError_qq" @loadeddata="handleLoadedData_qq" controls></audio>
						<el-button @click="togglePlayPause_qq">
							{{ isPlaying_qq ? "暂停" : "播放" }}
						</el-button>
					</div>
				</el-dialog>
			</div>
		</div>
	</div>
</template>
<script>
import axios from "axios";
export default {
	data() {
		return {
			ruleForm: {
				qq: ""
			},
			showContent: false,
			btnLoding: false,
			rules: {
				qq: [
					{ required: true, message: "请输入QQ号码", trigger: "change" },
					{ pattern: /^[0-9]\d{4,11}$/, message: "QQ号码必须为5到12位的数字", trigger: "change" }
				]
			},
			infoObj: {
				qq: "", // 查询的QQ号
				nickname: "", // 昵称
				sex: "", // 性别
				sign: "", // 个性签名
				level: "", // QQ等级
				reg_time: "" // 注册时间
			},
			showMusic: false,
			musicObj: {
				name: "", // 歌曲名
				artistsname: "", // 歌手名
				picurl: "", // 歌曲海报
				url: "" // 歌曲播放地址
			},
			isPlaying: false, // 控制音频播放状态
			progress: 0, // 音乐播放进度条
			duration: 0,
			logoURL: "", // qq头像
			sweetWords: "",
			musicStr: "",
			// 表格相关数据 ===================
			tableData: [],
			total: 0, // 总条目数
			currentPage: 1, // 当前页
			pageSize: 10, // 每页显示条目数
			currentAudioUrl: "", // 当前播放的url
			dialogVisible: false,
			audioSrc_qq: "",
			audioSrc_qq_copy: "",
            isPlaying_qq: false,
            coverImgSrc: ''
		};
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.queryInfo(this.ruleForm.qq);
				} else {
					return false;
				}
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
		handleInput(value) {
			// 使用正则表达式移除非数字字符
			let cleanedValue = value.replace(/[^0-9]/g, "");
			// 如果输入以0开头，且长度大于1，则只保留第一个0
			// if (cleanedValue.startsWith("0") && cleanedValue.length > 1) {
			// 	cleanedValue = cleanedValue[0];
			// }
			this.ruleForm.qq = cleanedValue;
		},
		queryInfo(params) {
			this.showContent = false;
			this.btnLoding = true;
			// 获取QQ头像
			// https://q2.qlogo.cn/headimg_dl?spec=100&dst_uin=1064988869
			this.logoURL = `https://q2.qlogo.cn/headimg_dl?spec=100&dst_uin=${params}`;
			axios
				.get(`/sss?uin=${params}`)
				.then(res => {
					console.log("res === ", res);
					let data = res.data.data;
					this.infoObj.qq = data.uin;
					this.infoObj.nickname = data.nickname;
					this.infoObj.sex = data.sex;
					this.infoObj.sign = data.sign;
					this.infoObj.level = data.level;
					this.infoObj.reg_time = data.reg_time;
					this.showContent = true;
					this.btnLoding = false;
				})
				.catch(err => {
					this.btnLoding = false;
					this.showContent = false;
					console.log("err === ", err);
				});
		},
		getMusicInfo() {
			// /bbb?format=json
			// https://api.uomg.com/api/rand.music?format=json
			this.btnLoding = true;
			axios
				.get("http://api.uomg.com/api/rand.music?format=json")
				.then(res => {
					let data = res.data.data;
					console.log("res === ", res);
					this.musicObj.name = data.name;
					this.musicObj.artistsname = data.artistsname;
					this.musicObj.picurl = data.picurl;
					this.musicObj.url = data.url;
					console.log("this.musicObj.url === ", this.musicObj.url);
					this.btnLoding = false;
					this.showMusic = true;
					this.progress = 0;
				})
				.catch(err => {
					this.progress = 0;
					this.btnLoding = false;
					this.$message.warning("请重新点击获取资源");
					console.log("err === ", err);
				});
		},
		getSweetWords() {
			// 获取土味情话
			// https://api.uomg.com/api/rand.qinghua?format=json
			// /ddd?format=json
			this.btnLoding = true;
			axios
				.get("http://api.uomg.com/api/rand.qinghua?format=json")
				.then(res => {
					this.sweetWords = res.data.content;
					console.log("res === ", res);
					console.log("this.sweetWords === ", this.sweetWords);
					this.btnLoding = false;
				})
				.catch(err => {
					this.btnLoding = false;
					this.$message.warning("请重新点击获取情话");
					console.log("err === ", err);
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
		togglePlayPause_qq() {
			const audio = this.$refs.audio_qq;
			if (this.isPlaying_qq) {
				audio.pause(); // 暂停播放
			} else {
				audio.play(); // 开始播放
			}
			this.isPlaying_qq = !this.isPlaying_qq; // 切换播放状态
            this.audioSrc_qq =  this.audioSrc_qq_copy
		},
        playAudio(row){
            console.log('row === ', row)
            this.dialogVisible = true
            this.audioSrc_qq_copy = row.url
            this.coverImgSrc = row.cover
            const audio = this.$refs.audio_qq;
            audio.pause()
        },
		onAudioEnded() {
			// 当音频结束时调用此方法
			this.isPlaying = false;
		},
		onAudioEnded_qq() {
			// 当音频结束时调用此方法
			this.isPlaying_qq = false;
		},
		handleError(event) {
			console.error("音频加载失败:", event);
			// 可以在这里提供用户反馈，比如显示错误信息
			this.$message.warning("很抱歉，音频加载失败，请点击按钮切换其他歌曲");
		},
		handleError_qq(event) {
			console.error("音频加载失败:", event);
			// 可以在这里提供用户反馈，比如显示错误信息
			this.$message.warning("很抱歉，音频加载失败，请点击按钮切换其他歌曲");
		},
		handleLoadedData() {
			this.$message.success("音频加载完成");
			console.log("音频加载完成");
			// 可以在这里执行其他操作，如自动播放等
		},
        handleLoadedData_qq(){
            this.$message.success("音频加载完成");
			console.log("音频加载完成");
        },
		onTimeUpdate(event) {
			const audio = event.target;
			this.progress = (audio.currentTime / audio.duration) * 100;
			this.duration = audio.duration;
		},
        
		seek(event) {
			const audio = this.$refs.audio;
			const targetProgress = event.target.value / 100;
			audio.currentTime = targetProgress * this.duration;
		},
		searchMusic(type=null) {
            if(type === 'reset') {
                this.currentPag = 1
            }
			if (!this.musicStr) return;
			let url = `https://zj.v.api.aa1.cn/api/qqmusic/demo.php?type=1&q=${this.musicStr}&p=${this.currentPage}&n=${this.pageSize}`;
			axios
				.get(url)
				.then(res => {
					console.log("res === ", res);
					this.tableData = res.data.list;
					this.total = res.data.count;
					this.btnLoding = false;
				})
				.catch(err => {
					this.btnLoding = false;
					this.$message.warning("请重新查询");
					console.log("err === ", err);
				});
		},
		handleSizeChange(newSize) {
			this.pageSize = newSize;
			this.searchMusic();
		},
		handleCurrentChange(newPage) {
			this.currentPage = newPage;
			this.searchMusic();
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
.form {
	width: 300px;
}
.content {
	font-size: 20px;
	font-weight: bold;
	line-height: 30px;
	color: #6ba037;
	text-align: center;
	.logo {
		text-align: center;
		img {
			width: 100px;
			height: 100px;
		}
	}
}
.audio {
	margin-left: 600px;
}
.musicImg {
	width: 750px;
	height: 465px;
	img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
}
input[type="range"] {
	width: 100%;
	margin-top: 10px;
}
.progress {
	width: 600px;
}
.sweet {
	width: 100%;
	margin-top: 20px;
	text-align: center;
	.sweetContent {
		font-size: 20px;
		font-weight: bolder;
		color: #3401ff;
	}
	.musicInput {
		width: 300px;
		margin: 0 auto; /* 水平居中 */
	}
}
</style>
