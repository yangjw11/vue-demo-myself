<template>
	<div>
		<el-cascader :options="options" :show-all-levels="false" @change="handleChange"></el-cascader>
		<div style="width: 96vw; height: 96vh">
			<iframe :src="iframeSrc" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			iframeSrc: "https://api.r10086.com/PPT/PPT.php?PPT=龙珠&参数=樱花特效",
			options: [
				{
					value: "2",
					label: "赛马娘系列",
					children: [
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=赛马娘",
							label: "赛马娘自适应PPT"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=赛马娘&参数=樱花特效",
							label: "赛马娘自适应PPT带樱花特效"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=赛马娘&参数=雪花特效",
							label: "赛马娘自适应PPT带雪花特效"
						}
					]
				},
				{
					value: "3",
					label: "东京食尸鬼系列",
					children: [
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=东京食尸鬼",
							label: "东京食尸鬼自适应PPT"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=东京食尸鬼&参数=樱花特效",
							label: "东京食尸鬼自适应PPT带樱花特效"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=东京食尸鬼&参数=雪花特效",
							label: "东京食尸鬼自适应PPT带雪花特效"
						}
					]
				},
				{
					value: "4",
					label: "Fate系列",
					children: [
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=Fate",
							label: "Fate自适应PPT"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=Fate&参数=樱花特效",
							label: "Fate自适应PPT带樱花特效"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=Fate&参数=雪花特效",
							label: "Fate自适应PPT带雪花特效"
						}
					]
				},
				{
					value: "5",
					label: "为美好世界献上祝福系列",
					children: [
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=为美好世界献上祝福",
							label: "为美好世界献上祝福自适应PPT"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=为美好世界献上祝福&参数=樱花特效",
							label: "为美好世界献上祝福自适应PPT带樱花特效"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=为美好世界献上祝福&参数=雪花特效",
							label: "为美好世界献上祝福自适应PPT带雪花特效"
						}
					]
				},
				{
					value: "6",
					label: "某科学的超电磁炮系列",
					children: [
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=某科学的超电磁炮",
							label: "某科学的超电磁炮自适应PPT"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=某科学的超电磁炮&参数=樱花特效",
							label: "某科学的超电磁炮自适应PPT带樱花特效"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=某科学的超电磁炮&参数=雪花特效",
							label: "某科学的超电磁炮自适应PPT带雪花特效"
						}
					]
				},
				{
					value: "7",
					label: "原神系列",
					children: [
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=原神",
							label: "原神自适应PPT"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=原神&参数=樱花特效",
							label: "原神自适应PPT带樱花特效"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=原神&参数=雪花特效",
							label: "原神自适应PPT带雪花特效"
						}
					]
				},
				{
					value: "9",
					label: "神奇宝贝系列",
					children: [
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=神奇宝贝",
							label: "神奇宝贝自适应PPT"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=神奇宝贝&参数=樱花特效",
							label: "神奇宝贝自适应PPT带樱花特效"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=神奇宝贝&参数=雪花特效",
							label: "神奇宝贝自适应PPT带雪花特效"
						}
					]
				},
				{
					value: "10",
					label: "龙珠系列",
					children: [
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=龙珠",
							label: "龙珠自适应PPT"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=龙珠&参数=樱花特效",
							label: "龙珠自适应PPT带樱花特效"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=龙珠&参数=雪花特效",
							label: "龙珠自适应PPT带雪花特效"
						}
					]
				},
				{
					value: "11",
					label: "罪恶王冠系列",
					children: [
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=罪恶王冠",
							label: "罪恶王冠自适应PPT"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=罪恶王冠&参数=樱花特效",
							label: "罪恶王冠自适应PPT带樱花特效"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=罪恶王冠&参数=雪花特效",
							label: "罪恶王冠自适应PPT带雪花特效"
						}
					]
				},
				{
					value: "12",
					label: "鬼灭之刃系列",
					children: [
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=鬼灭之刃",
							label: "鬼灭之刃自适应PPT"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=鬼灭之刃&参数=樱花特效",
							label: "鬼灭之刃自适应PPT带樱花特效"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=鬼灭之刃&参数=雪花特效",
							label: "鬼灭之刃自适应PPT带雪花特效"
						}
					]
				},
				{
					value: "13",
					label: "火影忍者系列",
					children: [
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=火影忍者",
							label: "火影忍者自适应PPT"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=火影忍者&参数=樱花特效",
							label: "火影忍者自适应PPT带樱花特效"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=火影忍者&参数=雪花特效",
							label: "火影忍者自适应PPT带雪花特效"
						}
					]
				},
				{
					value: "14",
					label: "海贼王系列",
					children: [
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=海贼王",
							label: "海贼王自适应PPT"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=海贼王&参数=樱花特效",
							label: "海贼王自适应PPT带樱花特效"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=海贼王&参数=雪花特效",
							label: "海贼王自适应PPT带雪花特效"
						}
					]
				},
				{
					value: "15",
					label: "进击的巨人系列",
					children: [
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=进击的巨人",
							label: "进击的巨人自适应PPT"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=进击的巨人&参数=樱花特效",
							label: "进击的巨人自适应PPT带樱花特效"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=进击的巨人&参数=雪花特效",
							label: "进击的巨人自适应PPT带雪花特效"
						}
					]
				},
				{
					value: "16",
					label: "从零开始的异世界生活系列",
					children: [
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=从零开始的异世界生活",
							label: "从零开始的异世界生活自适应PPT"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=从零开始的异世界生活&参数=樱花特效",
							label: "从零开始的异世界生活自适应PPT带樱花特效"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=从零开始的异世界生活&参数=雪花特效",
							label: "从零开始的异世界生活自适应PPT带雪花特效"
						}
					]
				},
				{
					value: "17",
					label: "刀剑神域系列",
					children: [
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=刀剑神域",
							label: "刀剑神域自适应PPT"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=刀剑神域&参数=樱花特效",
							label: "刀剑神域自适应PPT带樱花特效"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=刀剑神域&参数=雪花特效",
							label: "刀剑神域自适应PPT带雪花特效"
						}
					]
				},
				{
					value: "18",
					label: "钢之炼金术师系列",
					children: [
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=钢之炼金术师",
							label: "钢之炼金术师自适应PPT"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=钢之炼金术师&参数=樱花特效",
							label: "钢之炼金术师自适应PPT带樱花特效"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=钢之炼金术师&参数=雪花特效",
							label: "钢之炼金术师自适应PPT带雪花特效"
						}
					]
				},
				{
					value: "19",
					label: "妖精的尾巴系列",
					children: [
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=妖精的尾巴",
							label: "妖精的尾巴自适应PPT"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=妖精的尾巴&参数=樱花特效",
							label: "妖精的尾巴自适应PPT带樱花特效"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=妖精的尾巴&参数=雪花特效",
							label: "妖精的尾巴自适应PPT带雪花特效"
						}
					]
				},
				{
					value: "20",
					label: "缘之空系列",
					children: [
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=缘之空",
							label: "缘之空自适应PPT"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=缘之空&参数=樱花特效",
							label: "缘之空自适应PPT带樱花特效"
						},
						{
							value: "https://api.r10086.com/PPT/PPT.php?PPT=缘之空&参数=雪花特效",
							label: "缘之空自适应PPT带雪花特效"
						}
					]
				}
			]
		};
	},
	methods: {
		handleChange(value) {
			const lastValue = value[value.length - 1];
			console.log("最后一级的 value:", lastValue);
            this.iframeSrc = lastValue
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
</style>
