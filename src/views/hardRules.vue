<template>
	<!-- 计算公式弹窗 -->
	<div id="box">
		<span style="margin-bottom: 50px">公式支持+-×÷/.()数字等数学符号，考核分数可作为参数参与公式计算；结果默认四舍五入保留2位小数</span>
		<el-form :model="dataForm" :rules="formRules" label-width="80px" label-position="left" ref="formRef">
			<el-form-item label="业务字段：" label-width="110px">
				<span style="cursor: pointer" v-for="item in dataForm.businessFieldsArr" :key="item" @click="dataForm.xishu += item">{{ item }}</span>
			</el-form-item>
			<el-form-item label="绩效系数：" prop="xishu" label-width="110px">
				<el-input v-model.trim="dataForm.xishu" style="width: 300px" placeholder="请输入2-30字符"></el-input>
			</el-form-item>
			<el-button type="info" @click="handleClose">取 消</el-button>
			<el-button type="primary" @click="handleSure">确 定</el-button>
		</el-form>
	</div>
</template>

<script>

export default {
	data() {
		return {
			dialogVisible: false, // 表单是否可见
			globalLoading: false, // 表单loading
			dataForm: { businessFieldsArr: ["考核分数", "考评分数"], xishu: "" }, // 表单绑定数据
			formRules: {
				xishu: [{ required: true, trigger: ["blur"], validator: this.verifyXishu }]
			} //表单校验
		};
	},
	methods: {
		// 括号中至少出现一个运算公式
		aFormulaInParentheses(str) {
			// 剔除空白符
			str = str.replace(/\s/g, "");

			// 判断是否存在空括号
			if (/\(\)/.test(str)) {
				return true;
			}

			// 错误情况：(后面是运算符
			if (/\(([+-×÷])/.test(str)) {
				return true;
			}

			// 错误情况：)前面是运算符
			if (/([+-×÷])\)/.test(str)) {
				return true;
			}

			// 错误情况：(前面不是运算符或空
			if (/((?!([+-×÷]|\s))\()/.test(str)) {
				return true;
			}

			// 错误情况：)后面不是运算符或空
			if (/(\)[+-×÷]?\s?)/.test(str)) {
				return true;
			}

			// 错误情况：运算符号不能在首末位
			if (/^([+-×÷.])|([+-×÷.]$)/.test(str)) {
				return true;
			}

			// 错误情况：运算符连续
			if (/([+-×÷]){2,}/.test(str)) {
				return true;
			}

			// 取出所有括号内容
			const bracketContents = str.match(/\((.+?)\)/g) || [];

			for (const content of bracketContents) {
				// 检查括号内容中是否至少有一个运算符
				if (!/[+-×÷]/.test(content)) {
					return true;
				}
			}
		},
		// 运算公式验证
		isValidFormula(formula) {
			// 验证规则：
			// 1. 运算符号不能在开头或结尾
			// 2. 括号成对出现
			// 3. 括号中至少一个运算公式（这里简化处理，只检查非空）
			// 4. (前面不是运算符或空，)后面不是运算符或空
			// 5. 不能两个运算符连续出现
			// 6. 数字最大支持5位，最多2位小数
			// 7. 中文或字母只能输入指标项数组（业务字段）中存在的
			// 规则1, 5: 运算符前后不能是运算符或字符串开头/结尾

			const operatorRegex1 = /[.+\-*/]/; // ***** 预处理：去除空格，简化处理 *****

			// ***** 规则1: 检查开头和结尾 *****
			let cleanedFormula = formula.replace(/\s+/g, "");
			if (operatorRegex1.test(cleanedFormula[0]) || operatorRegex1.test(cleanedFormula[cleanedFormula.length - 1])) return "符号不能在开头或结尾";

			// ***** 规则2, 3, 4: 括号检查 *****
			const stack = [];
			for (let char of cleanedFormula) {
				if (char === "(") {
					stack.push(char);
				} else if (char === ")") {
					if (stack.length === 0) {
						return "括号需成对出现"; // 没有匹配的左括号
					}
					stack.pop();
				}
			}
			if (stack.length !== 0) return "括号需成对出现";

			// ***** 规则5: 检查运算符连续 *****
			let outsideParentheses = cleanedFormula.replace(/\([^()]*\)/g, ""); // 5.1移除括号及其内容
			let consecutiveOperators = /([+\-*/.])\1/g; //5.2括号外不连续
			const isExistParam = this.dataForm.businessFieldsArr.map(v => v.toString());
			//  两种情况,括号外的不连续及括号内的不连续
			if (consecutiveOperators.test(outsideParentheses) || !this.checkConsecutiveOperators(cleanedFormula)) return "运算符及小数点不能连续";

			// ***** 规则6: 检查每个数字是否合法 *****
			if (!this.isValidPositiveIntegerExpression(cleanedFormula)) return "最多五位整数，两位小数";

			// ***** 规则7: 中文或字母只能输入指标项数组（业务字段）中存在的 *****
			let allowedArr = this.dataForm.businessFieldsArr;
			let replaceArr = cleanedFormula.replace(/[\d.()+\-*\/()]/g, "");
			for (let item of allowedArr) {
				replaceArr = replaceArr.replace(new RegExp(item, "g"), "");
			}
			if (replaceArr) {
				return "只能输入指标项业务字段中存在的指标项";
			}
			// ***** 最终统一校验 *****
			if (!this.finalValidate(cleanedFormula)) {
				return "公式错误，请重新修改";
			}
			// ***** 如果以上都通过，则认为公式合法 *****
			return "公式合法";
		},
		// ***** 规则5: 检查括号内运算符连续（校验函数） *****
		checkConsecutiveOperators(str) {
			// 检查整个字符串（不包括括号内）
			if (/([+\-*./])\1/g.test(str.replace(/\([^()]*\)/g, ""))) {
				return false; // 发现连续运算符
			}

			// 检查每个括号内的内容
			let match;
			const regex = /\([^()]*\)/g;
			while ((match = regex.exec(str)) !== null) {
				if (/([+\-*/])\1/g.test(match[0].slice(1, -1))) {
					return false; // 括号内发现连续运算符
				}
			}

			return true; // 没有发现连续运算符
		},
		// ***** 规则6: 检查每个数字是否合法（校验函数） *****
		isValidPositiveIntegerExpression(expr) {
			// 规则6: 数字的正则
			const numberRegex = /^(?:[1-9]\d{0,4}(\.\d{1,2})?|0(\.\d{1,2})?)$/;
			// 移除运算符和可能的空格
			let numsStr = expr.replace(/[-+\/*()\s]/g, "split");
			// 分割字符串为数组
			let nums = numsStr.split("split");
			// 检查每个字符是否都是数字，并且至少有一个数字
			for (let item of nums) {
				if (this.isNumber(item)) if (!numberRegex.test(item)) return false;
			}
			return true;
		},
		// ***** 最终校验: 将指标项转化为数字1，通过最后的表达式的计算结果是否合法判断式子是否正确 *****
		finalValidate(str) {
			// 将中文转化为1之后，判断数学表达式是否正确
			let allowedArr = this.dataForm.businessFieldsArr;
			let replaceStr = str;
			for (let item of allowedArr) {
				if (str.includes(item)) replaceStr = this.replaceAll(str, item, "1"); //将业务字段替换成'1'
			}
			console.log("rrrrr", replaceStr);
			let result = true;
			try {
				result = this.safeEvalMathExpression(replaceStr);
			} catch (e) {
				result = false;
			}

			if (!result) {
				return false;
			} else {
				return true;
			}
		},
		// 业务字段字符串-全部替换
		replaceAll(str, find, replacement) {
			return str.replace(new RegExp(find, "g"), replacement);
		},
		safeEvalMathExpression(expr) {
			// 使用沙箱环境，防止恶意代码执行
			const sandbox = {
				m: Math,
				n: 0,
				o: 0,
				p: 0,
				q: 0,
				r: 0,
				s: 0,
				t: 0,
				u: 0,
				v: 0,
				w: 0,
				x: 0,
				y: 0,
				z: 0
			};

			// 将字符串中的变量替换为沙箱中的对象属性
			let result = expr.replace(/[a-z]/gi, match => {
				return `sandbox['${match}']`;
			});

			return new Function("sandbox", `try { return ${result} } catch(e) { return 0 }`)(sandbox);
		},
		// 表单系数校验函数
		verifyXishu(rule, value, callback) {
			const regex1 = /^([a-zA-Z0-9\s\u4e00-\u9fff]|([.+\-*)(/]))*$/; //校验特殊符号
			if (!value) {
				callback(new Error("绩效系数不能为空"));
			} else if (!regex1.test(value)) {
				callback(new Error("只能输入加减乘除、数字、字母或中文"));
			} else if (this.isValidFormula(value) !== "公式合法") {
				callback(new Error(this.isValidFormula(value)));
			} else {
				callback();
			}
		},
		// 弹窗-取消
		handleClose() {
			if (this.dataForm.xishu)
				this.$confirm("绩效系数已经存在内容，确定关闭？", "关闭计算公式", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
					closeOnClickModal: false,
					closeOnPressEscape: false,
					showClose: false,
					center: true
				}).then(() => {
					this.dialogVisible = false;
				});
			else this.dialogVisible = false;
		},
    // 判断数字
		isNumber(val) {
			var regPos = /^((\d)|([1-9]\d+))(\.{1}\d+)?$/;
			var regNeg = /^\-{1}((\d)|([1-9]\d+))(\.{1}\d+)?$/;
			return Number.isFinite(Number(val)) && (regPos.test(val) || regNeg.test(val));
		},
		// 弹窗-确定
		handleSure() {}
	},
	watch: {
		route(v) {},
		dialogVisible(v) {
			if (!v) {
				this.dataForm = { businessFieldsArr: ["考核分数"], xishu: "" };
			}
		}
	},
	
	created() {},
	filters: {
		capitalize: function (value) {
			if (!value) return "";
			value = value.toString();
			return value;
		}
	}
};
</script>

<style lang="scss" scoped>
$baseColor: #fff; // 公共变量
.dpflex {
	display: flex;
	justify-content: center;
	align-items: center;
} // 公共样式
.class1 {
	border: 1px solid #ddd;
}
// .class2 {
//   @extend .class1;
//   font-size: 120%;
// }//继承变量
#box {
	width: 100%;
	height: 100%;
	// 需要显示省略号的class
	.ellipsis {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: inline-block;
	}
}
</style>
