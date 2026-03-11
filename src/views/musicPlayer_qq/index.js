import axios from "axios";

let sortType = 1;
export function getAllMusicListInfo(musicArr) {
	console.log("musicArr === ", musicArr);
	let promiseChain = Promise.resolve();
	musicArr.forEach(async item => {
		// 通过 歌曲名 title 查询， 找到 歌手名 singer 对应列表 title 的 n 值, 更新这条数据的 音乐链接music_url 歌词lyric 封面cover
		let song_singer = item.song_singer; // 歌手名
		let song_title = item.song_title; // 歌曲名
		let res_n = "";
		let res_url = "";
		// 判断是否是黄家驹的长城，只有这首歌有id值，是的话用另外一个接口查询
		promiseChain = promiseChain.then(async () => {
			if (item.id) {
				let baseURL = "https://music-api.gdstudio.xyz/";
				let url = `/rrr?types=url&source=spotify&id=${item.id}&br=320`;
				axios
					.get(url)
					.then(res => {
						if (res.status !== 200) {
							throw new Error("接口报错");
						}
						item.music_url = baseURL + res.data.url;
						item.isPlaying = false;
					})
					.catch(err => {
						console.log("err === ", err);
					});
			} else {
				// 通过歌曲名发起请求搜索。如果找到 歌曲名和歌手名都符合的项，用对应的 n 再次发起请求 更新 music_url
				try {
					res_n = await queryMusic_n(song_title, song_singer, item.cover, sortType);
					if (res_n == 0 || res_n) {
						res_url = await queryMusicUrl(song_title, song_singer, res_n, sortType);
						if (res_url) {
							item.music_url = res_url;
							item.isPlaying = false;
						} else {
							item.isPlaying = false;
							throw new Error("通过优先级一更新失败");
						}
					}
					// 关键：每次成功处理后延迟2秒
					await delay(2500);
				} catch (error) {
					console.log("error === ", error);
				}
			}
		});
	});
	return promiseChain.then(() => musicArr);
}

// 添加一个通用的延迟函数, 该接口10s内只能调用5次，超过之后就会被封锁
function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
// title：歌曲名/歌手名, 查询歌曲的n
function queryMusic_n(title, singer, cover, type) {
	// 歌曲名/歌手名需要去除空格
	let titleStr = title.toString().replace(/\s/g, "");
	let singerStr = singer.toString().replace(/\s/g, "");
	let url1 = `/QQmusic?type=json&msg=${type === 1 ? titleStr : singerStr}&key=DragonF51D6A15D46B71E3841B79481C714093`;
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
				findItem = arr.find(item => item.song_title.includes(title)&& item.song_singer === singer);
				console.log("findItem === ", findItem);
				if (findItem) {
					resolve(findItem.n);
				} else {
					if (type === 2) {
						sortType = 1;
						reject(`找不到对应的歌曲,歌曲信息；${titleStr} ---${singerStr}`);
						return;
					} else {
						sortType = 2;
						resolve(queryMusic_n(title, singer, cover, sortType));
					}
				}
			})
			.catch(err => {
				reject(err);
			});
	});
}

// 通过n值查询歌曲url等其他信息,
function queryMusicUrl(title, singer, n, type) {
	// 歌曲名/歌手名需要去除空格
	let titleStr = title.toString().replace(/\s/g, "");
	let singerStr = singer.toString().replace(/\s/g, "");
	let url2 = `/QQmusic?type=json&msg=${type === 1 ? titleStr : singerStr}&n=${n}&key=DragonF51D6A15D46B71E3841B79481C714093`;
	return new Promise((resolve, reject) => {
		axios
			.get(url2)
			.then(res => {
				if (res.status !== 200) {
					throw new Error("接口报错");
				}
				console.log("res === ", res);
				let url = res.data.data.music_url;
				resolve(url);
			})
			.catch(err => {
				reject(err);
			});
	});
}
