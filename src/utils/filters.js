// 自定义全局过滤器
//全局封装性别类型展示
export function getSex (sexStatus)  {
  let  sexName = ''
  if (sexStatus != null) {
      switch (sexStatus) {
          case '0': sexName = "男"
              break;
          case '1': sexName = "女"
              break;
          default: sexName = "未知"
      }
  } else {
      sexName = "未知"
  }

  return sexName;
}