/**
 * 根据脱敏身份证号和性别生成所有可能结果
 * @param {string} idCardMasked - 脱敏身份证号（18位，含*）
 * @param {number|null} gender - 性别：1=男，0=女，null=不指定
 * @param {number} limit - 结果数量限制
 * @returns {Array} 所有符合规则的身份证号数组
 */
export function generatePossibleIDCards(idCardMasked, gender = null, limit = 10000) {
  // 身份证校验码计算权重
  const WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const CHECK_CODES = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  
  // 结果数组
  const results = [];
  
  // 验证输入格式
  if (!idCardMasked || idCardMasked.length !== 18) {
    console.error('身份证号必须是18位');
    return results;
  }
  
  // 处理脱敏符号，统一为*号
  idCardMasked = idCardMasked.replace(/[xX*]/g, '*');
  
  // 解析脱敏位和已知位
  const positions = [];
  const fixedParts = [];
  
  for (let i = 0; i < 18; i++) {
    const char = idCardMasked[i];
    if (char === '*') {
      positions.push(i);
    } else {
      fixedParts[i] = char;
    }
  }
  
  // 如果没有脱敏位，直接验证原身份证号
  if (positions.length === 0) {
    if (validateIDCard(idCardMasked) && validateGender(idCardMasked, gender)) {
      results.push(idCardMasked);
    }
    return results;
  }
  
  // 优化生成逻辑：先填充非校验位，最后计算校验码
  const nonCheckPositions = positions.filter(pos => pos !== 17);
  const checkCodePosition = positions.includes(17) ? 17 : null;
  
  // 估计组合数量，避免过多
  const estimatedCombinations = Math.pow(10, nonCheckPositions.length);
  if (estimatedCombinations > limit * 10) {
    console.warn(`可能的组合数量过多 (${estimatedCombinations})，已进行优化处理`);
  }
  
  function generateNonCheckCombinations(current, depth) {
    // 如果已经达到限制，停止生成
    if (results.length >= limit) {
      return;
    }
    
    if (depth === nonCheckPositions.length) {
      // 非校验位组合完成，现在处理校验位
      processWithCheckCode(current);
      return;
    }
    
    const pos = nonCheckPositions[depth];
    
    // 第17位（索引16）需要根据性别筛选
    if (pos === 16 && gender !== null) {
      const start = gender === 1 ? 1 : 0;
      for (let i = start; i <= 9; i += 2) {
        generateNonCheckCombinations({...current, [pos]: i.toString()}, depth + 1);
        
        // 提前退出检查
        if (results.length >= limit) {
          return;
        }
      }
    } else {
      for (let i = 0; i <= 9; i++) {
        generateNonCheckCombinations({...current, [pos]: i.toString()}, depth + 1);
        
        // 提前退出检查
        if (results.length >= limit) {
          return;
        }
      }
    }
  }
  
  function processWithCheckCode(variableParts) {
    // 构建前17位
    let first17 = '';
    for (let i = 0; i < 17; i++) {
      if (fixedParts[i] !== undefined) {
        first17 += fixedParts[i];
      } else {
        first17 += variableParts[i] || '0';
      }
    }
    
    // 计算校验码
    const sum = WEIGHTS.reduce((total, weight, index) => {
      return total + parseInt(first17[index]) * weight;
    }, 0);
    
    const mod = sum % 11;
    const checkCode = CHECK_CODES[mod];
    
    // 检查校验位是否符合要求
    if (checkCodePosition !== null) {
      // 校验位是脱敏的，使用计算出的校验码
      const fullID = first17 + checkCode;
      if (validateIDCard(fullID) && validateGender(fullID, gender)) {
        results.push(fullID);
      }
    } else {
      // 校验位是固定的，检查是否匹配
      const fullID = first17 + fixedParts[17];
      if (fixedParts[17] === checkCode && validateIDCard(fullID) && validateGender(fullID, gender)) {
        results.push(fullID);
      }
    }
  }
  
  function validateIDCard(idCard) {
    // 检查前6位地区码
    if (!/^\d{6}/.test(idCard)) {
      return false;
    }
    
    // 检查出生日期
    const birthDateStr = idCard.substring(6, 14);
    const year = parseInt(birthDateStr.substring(0, 4));
    const month = parseInt(birthDateStr.substring(4, 6));
    const day = parseInt(birthDateStr.substring(6, 8));
    
    // 基本范围检查
    if (year < 1900 || year > new Date().getFullYear()) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    // 月份天数检查
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    // 闰年检查
    if (month === 2) {
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      if (day > (isLeapYear ? 29 : 28)) {
        return false;
      }
    } else if (day > daysInMonth[month - 1]) {
      return false;
    }
    
    // 检查顺序码（第15-17位）
    if (!/^\d{3}$/.test(idCard.substring(14, 17))) {
      return false;
    }
    
    // 计算校验码
    const sum = WEIGHTS.reduce((total, weight, index) => {
      return total + parseInt(idCard[index]) * weight;
    }, 0);
    
    const mod = sum % 11;
    const checkCode = CHECK_CODES[mod];
    
    // 最后一位校验
    const lastChar = idCard[17].toUpperCase();
    return lastChar === checkCode;
  }
  
  function validateGender(idCard, gender) {
    if (gender === null) return true;
    
    const genderCode = parseInt(idCard.substring(16, 17)); // 第17位
    const isMale = genderCode % 2 === 1;
    
    return (gender === 1 && isMale) || (gender === 0 && !isMale);
  }
  
  // 开始生成
  generateNonCheckCombinations({}, 0);
  
  // 去重并排序
  return [...new Set(results)].sort().slice(0, limit);
}

/**
 * 验证单个身份证号
 * @param {string} idCard - 身份证号
 * @returns {boolean} 是否有效
 */
export function validateSingleIDCard(idCard) {
  const WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const CHECK_CODES = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  
  if (!/^\d{17}[\dXx]$/.test(idCard)) return false;
  
  const sum = WEIGHTS.reduce((total, weight, index) => {
    return total + parseInt(idCard[index]) * weight;
  }, 0);
  
  const mod = sum % 11;
  return idCard[17].toUpperCase() === CHECK_CODES[mod];
}