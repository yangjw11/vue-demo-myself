/*
 * @Author: yangJianWei yangjianwei@chexiao.co
 * @Date: 2026-02-05 13:53:28
 * @LastEditors: yangJianWei yangjianwei@chexiao.co
 * @LastEditTime: 2026-02-10 16:08:59
 * @FilePath: \vue-demo-myself\src\views\musicPlayer_qq_free\index.js
 * @Description: 批量更新歌曲链接的方法
 */
import axios from "axios";
import { config as globalConfig } from "@/config";
export function getAllMusicListInfo(musicArr) {
	console.log("musicArr === ", musicArr);
	let promiseChain = Promise.resolve();

	musicArr.forEach(item => {
		promiseChain = promiseChain.then(async () => {
			try {
				console.log(`开始处理歌曲: ${item.keyWord}`);

				// 情况1：如果歌曲已经有URL，先检查这个URL是否可用且不是1分钟或30秒
				if (item.url) {
					console.log(`歌曲 ${item.keyWord} 已有URL，正在检查可用性...`);

					try {
						const isCurrentUrlValid = await checkDuration(item.url);

						if (isCurrentUrlValid !== false) {
							// 检查通过，URL可用
							const isOneMinute = Math.abs(isCurrentUrlValid - 60) < 0.5;
							const isThirtySeconds = Math.abs(isCurrentUrlValid - 30) < 0.5;

							if (!isOneMinute && !isThirtySeconds) {
								// 当前URL不是1分钟也不是30秒，直接使用
								console.log(`当前URL可用且不是1分钟/30秒，无需重新请求`);
								item.isPlaying = false;
								console.log(`等待3秒后处理下一首歌...`);
								await delay(3000);
								return;
							} else {
								console.log(`当前URL是${isOneMinute ? '1分钟' : '30秒'}，需要重新获取`);
							}
						} else {
							console.log(`当前URL不可用，需要重新获取`);
						}
					} catch (error) {
						console.log(`检查当前URL时出错: ${error.message}，需要重新获取`);
					}
				}

				// 情况2：需要重新获取URL
				console.log(`开始重新获取歌曲URL: ${item.keyWord}`);

				// 最多尝试5次获取合适的URL
				let finalUrl = null;
				let isOneMinute = true;
				let isThirtySeconds = true;

				for (let attempt = 1; attempt <= 5; attempt++) {
					console.log(`第${attempt}次尝试获取歌曲URL`);

					try {
						// 获取歌曲URL
						const musicUrl = await queryMusicUrl(item);

						if (!musicUrl) {
							console.log(`第${attempt}次查询失败，无有效URL`);
							// 等待5秒后继续下一次尝试
							if (attempt < 5) await delay(5000);
							continue;
						}

						// 检查歌曲时长是否为1分钟或30秒
						const duration = await checkDuration(musicUrl);

						if (duration === false) {
							console.log(`第${attempt}次获取的URL不可用`);
							// 等待5秒后继续下一次尝试
							if (attempt < 5) await delay(5000);
							continue;
						}

						isOneMinute = Math.abs(duration - 60) < 0.5;
						isThirtySeconds = Math.abs(duration - 30) < 0.5;

						if (!isOneMinute && !isThirtySeconds) {
							console.log(`第${attempt}次获取的歌曲时长不是1分钟/30秒，使用此URL`);
							finalUrl = musicUrl;
							break;
						} else {
							console.log(`第${attempt}次获取的歌曲时长为${isOneMinute ? '1分钟' : '30秒'}`);
							finalUrl = musicUrl;

							// 如果不是最后一次尝试，等待5秒后继续
							if (attempt < 5) {
								console.log(`等待5秒后进行第${attempt + 1}次尝试...`);
								await delay(5000);
							}
						}
					} catch (error) {
						console.log(`第${attempt}次尝试失败:`, error.message);
						// 等待5秒后继续下一次尝试
						if (attempt < 5) await delay(5000);
					}
				}

				if (finalUrl) {
					item.url = finalUrl;
					item.isPlaying = false;
					
					// 获取最终URL的时长信息用于日志
					const finalDuration = await checkDuration(finalUrl);
					if (finalDuration !== false) {
						const isFinalOneMinute = Math.abs(finalDuration - 60) < 0.5;
						const isFinalThirtySeconds = Math.abs(finalDuration - 30) < 0.5;
						let durationType = '正常时长';
						if (isFinalOneMinute) durationType = '1分钟';
						if (isFinalThirtySeconds) durationType = '30秒';
						
						console.log(`歌曲 ${item.keyWord} 处理完成，最终时长为${durationType}`);
					} else {
						console.log(`歌曲 ${item.keyWord} 处理完成，但无法获取最终时长`);
					}
				} else {
					console.log(`歌曲 ${item.keyWord} 5次尝试均失败`);
				}

				// 每首歌处理完后延迟3秒，防止接口限制
				console.log(`等待3秒后处理下一首歌...`);
				await delay(3000);

			} catch (error) {
				console.log(`处理歌曲 ${item.keyWord} 出错:`, error.message);
			}
		});
	});

	return promiseChain.then(() => musicArr);
}

// 检查歌曲时长，返回时长数值或false（如果不可用）
function checkDuration(audioUrl) {
	return new Promise((resolve) => {
		const audio = new Audio();

		// 设置超时，避免加载时间过长
		const timeout = setTimeout(() => {
			console.log("音频加载超时");
			resolve(false);
		}, 10000);

		audio.addEventListener('loadedmetadata', () => {
			clearTimeout(timeout);
			console.log(`歌曲时长: ${audio.duration} 秒`);
			// 返回实际的时长数值
			resolve(audio.duration);

			// 清理音频对象
			audio.src = '';
		});

		audio.addEventListener('error', () => {
			clearTimeout(timeout);
			// console.log("音频加载失败");
			resolve(false);
		});

		audio.src = audioUrl;
	});
}

// 通用的延迟函数
function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// 通过n值查询歌曲url等其他信息
function queryMusicUrl(item) {
	let url2 = `/cyapi?apikey=${globalConfig.apiKey_qq_free}&type=json&msg=${item.keyWord}&n=${item.n}`;

	return new Promise((resolve, reject) => {
		axios
			.get(url2)
			.then(res => {
				if (res.status !== 200) {
					throw new Error("接口报错");
				}
				console.log("查询歌曲URL成功");
				let url = res.data.url;
				resolve(url);
			})
			.catch(err => {
				reject(err);
			});
	});
}