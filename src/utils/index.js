/*
 * @Author: yangJianWei yangjianwei@chexiao.co
 * @Date: 2026-03-10 21:04:20
 * @LastEditors: yangJianWei yangjianwei@chexiao.co
 * @LastEditTime: 2026-03-11 09:40:42
 * @FilePath: \vue-demo-myself\src\utils\index.js
 * @@Description: 
 */
// 将此方法封装为公共方法
// 计算选中日期是当前日期的前第几天，当天是第0天，不允许选今天之后的日期,value: 时间戳毫秒数
export function calculateDays(value) {
    if (value) {
        const currentDate = new Date();
        const selectedDate = new Date(value);
        const diffTime = currentDate - selectedDate; // 时间差（毫秒）
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1; // 转换为天数
        return diffDays;
    } else {
        return 0;
    }
}
// 将此方法封装为公共方法 截取字符串中开始位置到最后一个中文字符的位置
export function truncateToLastChineseChar(str) {
    // 定义一个正则表达式来匹配所有的中文字符
    const chineseCharRegex = /[\u4e00-\u9fa5]/g;
    // 使用 matchAll 来获取所有匹配项的迭代器
    let matchesIterator = str.matchAll(chineseCharRegex);
    let lastMatch = null;

    // 遍历所有匹配项，记录最后的一个匹配
    for (const match of matchesIterator) {
        lastMatch = match;
    }
    // 如果没有找到任何中文字符，则返回空字符串或根据需要处理
    if (!lastMatch) return "";
    // 截取从字符串开始到最后一个中文字符的位置（包括该字符）
    return str.slice(0, lastMatch.index + lastMatch[0].length);
}

// 获取当前日期，返回一个对象
// 示例 
//  {
//     ymd: "2024-12-16"
//     ymdhm: "2024-12-16 11:30"
//     ymdhms: "2024-12-16 11:30:00"
//  }
export function getFormattedDateTime() {
    const now = new Date();

    const year = now.getFullYear();
    let month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero based
    let day = now.getDate().toString().padStart(2, '0');

    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');
    return {
        ymd: `${year}-${month}-${day}`,
        ymdhm: `${year}-${month}-${day} ${hours}:${minutes}`,
        ymdhms: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    }
}

// 传时间戳，返回 yy-mm-dd, 如果不传时间戳，返回当前时间的 yy-mm-dd
export function getFormattedDate(paramsDate = null) {
    let date;
    if (paramsDate) {
        date = new Date(paramsDate);
    } else {
        date = new Date();
    }
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2); // 加1是因为月份是从0开始的
    var day = ("0" + date.getDate()).slice(-2);
    return year + "-" + month + "-" + day;
}


// 直接输入当前：某年某月某日 星期几
export function formatDate() {
    const date = new Date(); // 转换秒时间戳为毫秒
    const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 星期${weekDays[date.getDay()]}`;
}


// 得到格式 2026/03/10
export function formatDate_(date) {
  if (!date) return ''; // 处理空值或无效输入
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0'); // 月份补零
  const day = String(d.getDate()).padStart(2, '0'); // 日期补零
  return `${year}/${month}/${day}`;
}

// 通用的延迟函数
export function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}