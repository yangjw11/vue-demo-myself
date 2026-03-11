const EventEmitter = require('events');
module.exports = {
	/* 部署应用包的基本URL */
	/* baseUrl 从 Vue CLI 3.3 起已弃用 ，请使用publicPath */
	//  baseUrl: process.env.NODE_ENV === "production" ? "./" : "./",
	publicPath: process.env.NODE_ENV === "production" ? "./" : "./",
	/* 生产环境构建文件的目录 defalut: dist */
	outputDir: "dist",
	/* 放置生成的静态文件目录（js css img） */
	assetsDir: "static",
	/* 指定生成的index.html 输出路径 相对 default: index.html */
	indexPath: "index.html",
	/* 指定生成文件名中包含hash default: true */
	filenameHashing: true,
	/* 是否保存时 lint 代码 */
	lintOnSave: process.env.NODE_ENV === "production",
	/* 是否使用编译器 default: false */
	runtimeCompiler: false,
	/* 默认babel-loader会忽略node_modules中的文件，你想显示的话在这个选项中列出来 */
	// transpileDependencies: [],
	/* 生产环境的source map */
	// 禁止console
	// drop_console: true,
	// 禁止debug语句
	// drop_debugger: true,
	productionSourceMap: true,
	// crossorigin: "",
	integrity: false,
	configureWebpack: {
		resolve: {
			alias: {
				assets: "@/assets",
				components: "@/components",
				views: "@/views"
			}
		}
	},
	// css相关配置
	css: {
		// 是否使用css分离插件 ExtractTextPlugin
		extract: true,
		// 开启 CSS source maps?
		sourceMap: false,
		// css预设器配置项
		loaderOptions: {},
		// 启用 CSS modules for all css / pre-processor files.
		modules: false
	},
	devServer: {
		port: 8086,
		host: "0.0.0.0",
		https: false,
		// 自动启动浏览器
		open: false,
		proxy: {
			"/api": {
				//代理路径 例如 https://baidu.com
				target: "http://t.weather.sojson.com/api/weather/city",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/api": ""
				}
			},
			"/aaa": {
				//代理路径 例如 https://baidu.com
				target: "http://sentence.iciba.com/index.php",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/aaa": ""
				}
			},
			"/bbb": {
				//代理路径 例如 https://baidu.com
				target: "https://api.uomg.com/api/rand.music",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/bbb": ""
				}
			},
			"/ccc": {
				//代理路径 例如 https://baidu.com
				target: "http://api.uomg.com/api/rand.music",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/ccc": ""
				}
			},
			"/ddd": {
				//代理路径 例如 https://baidu.com
				target: "https://api.uomg.com/api/rand.qinghua",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/ddd": ""
				}
			},
			"/eee": {
				//代理路径 例如 https://baidu.com
				target: "https://www.hhlqilongzhu.cn/api/dg_BDbdmusic.php",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/eee": ""
				}
			},
			"/fff": {
				//代理路径 例如 https://baidu.com
				target: "https://api.qqsuu.cn/api/dm-xjj2",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/fff": ""
				}
			},
			"/ggg": {
				//代理路径 例如 https://baidu.com
				target: "https://cn.bing.com/HPImageArchive.aspx",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/ggg": ""
				}
			},
			"/hhh": {
				//代理路径 例如 https://baidu.com
				target: "https://res.abeim.cn/api-bing_img",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/hhh": ""
				}
			},
			"/kkk": {
				//代理路径 例如 https://baidu.com
				target: "https://res.abeim.cn/api-weather",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/kkk": ""
				}
			},
			"/mmm": {
				//代理路径 例如 https://baidu.com
				target: "https://findmyip.net/api/translate.php",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/mmm": ""
				}
			},
			"/nnn": {
				//代理路径 例如 https://baidu.com
				target: "https://api.52vmy.cn/api/ai/fanyi",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/nnn": ""
				}
			},
			"/ooo": {
				//代理路径 例如 https://baidu.com
				target: "https://api.52vmy.cn/api/wl/word",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/ooo": ""
				}
			},
			"/ppp": {
				//代理路径 例如 https://baidu.com
				target: "http://47.120.68.44:999/cihui/",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/ppp": ""
				}
			},
			"/qqq": {
				//代理路径 例如 https://baidu.com
				target: "http://dict.youdao.com/suggest",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/qqq": ""
				}
			},
			"/rrr": {
				//代理路径 例如 https://baidu.com
				target: "https://music-api.gdstudio.xyz/api.php",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/rrr": ""
				}
			},
			"/sss": {
				//代理路径 例如 https://baidu.com
				target: "https://api.03c3.cn/api/qqName",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/sss": ""
				}
			},
			"/ttt": {
				//代理路径 例如 https://baidu.com
				target: "https://tucdn.wpon.cn/api-girl/index.php",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/ttt": ""
				}
			},
			"/uuu": {
				//代理路径 例如 https://baidu.com
				target: "https://cn.bing.com/HPImageArchive.aspx",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/uuu": ""
				}
			},
			"/vvv": {
				//代理路径 例如 https://baidu.com
				target: "https://api.52vmy.cn/api/query/fanyi",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/vvv": ""
				}
			},
			"/www": {
				//代理路径 例如 https://baidu.com
				target: "https://api.readhub.cn/news",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/www": ""
				},
			},
			"/xxx": {
				//代理路径 例如 https://baidu.com
				target: "https://postman-echo.com/post",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/xxx": ""
				}
			},
			"/yyy": {
				//代理路径 例如 https://baidu.com
				target: "https://api.istero.com/resource",
				// 将主机标头的原点更改为目标URL
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					"^/yyy": ""
				}
			},
			'/pdf-proxy': {  // 自定义代理路径
        target: 'https://epaper.yzwb.net', // PDF 所在域名
        changeOrigin: true, // 启用跨域
        pathRewrite: {
          '^/pdf-proxy': '' // 重写路径
        }
      },
			'/bing': {  // 自定义代理路径
        target: 'https://bing.biturl.top',
        changeOrigin: true, // 启用跨域
        pathRewrite: {
          '^/bing': '' // 重写路径
        }
      },
			'/longzhu': {  // 自定义代理路径
        target: 'https://sdkapi.hhlqilongzhu.cn/api/dgMusic_kugou/',
        changeOrigin: true, // 启用跨域
        pathRewrite: {
          '^/longzhu': '' // 重写路径
        }
      },
			'/QQmusic': {  // 自定义代理路径
        target: 'https://sdkapi.hhlqilongzhu.cn/api/QQmusic/',
        changeOrigin: true, // 启用跨域
        pathRewrite: {
          '^/QQmusic': '' // 重写路径
        }
      },
			'/shixin': {  // 自定义代理路径
        target: 'https://v2.xxapi.cn/api/shixin',
        changeOrigin: true, // 启用跨域
        pathRewrite: {
          '^/shixin': '' // 重写路径
        }
      },
			// 免费搜索歌曲的接口
			'/cyapi':{  // 自定义代理路径
        target: 'https://cyapi.top/API/qq_music.php',
        changeOrigin: true, // 启用跨域
        pathRewrite: {
          '^/cyapi': '' // 重写路径
        }
      },
		}
	}
};
EventEmitter.defaultMaxListeners = 30;