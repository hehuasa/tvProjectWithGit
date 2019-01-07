export default function downLoad(url, params, suffix) {
  const paramData = { ...params };
  const xhr = new XMLHttpRequest();
  xhr.open('POST', url, true); // 也可以使用GET方式，根据接口
  xhr.responseType = 'blob'; // 返回类型blob
  // 传递参数
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
  // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
  xhr.onload = function () {
    // 请求完成
    if (this.status === 200) {
      // 返回200
      const blob = this.response;
      const reader = new FileReader();
      reader.readAsDataURL(blob); // 转换为base64，可以直接放入a表情href
      reader.onload = function (e) {
        // 转换完成，创建一个a标签用于下载
        const a = document.createElement('a');
        const { fileName } = params;
        a.download = suffix ? `${fileName || 'newFile'}.doc` : `${fileName || 'newFile'}.xlsx`;
        a.href = e.target.result;
        // $('body').append(a); // 修复firefox中无法触发click
        a.click();
        // $(a).remove();
      };
    }
  };
  // 发送ajax请求
  if (paramData.fileName) { delete paramData.fileName; }
  xhr.send(param(paramData));
}
// 序列化通信数据
const param = (obj) => {
  let query = '';
  for (const name in obj) {
    // 简单对象（单一数组）
    const value = obj[name];
    if (value instanceof Array && (typeof value[0] !== 'object')) {
      for (let i = 0; i < value.length; i += 1) {
        const subValue = value[i];
        const fullSubName = name;
        const innerObj = {};
        innerObj[fullSubName] = subValue;
        query += `${param(innerObj)}&`;
      }
    } else {
      // 复杂对象
      if (value instanceof Array) {
        for (let i = 0; i < value.length; i++) {
          const subValue = value[i];
          const fullSubName = `${name}[${i}]`;
          const innerObj = {};
          innerObj[fullSubName] = subValue;
          query += `${param(innerObj)}&`;
        }
      } else if (value instanceof Object) {
        for (const subName in value) {
          const subValue = value[subName];
          const fullSubName = `${name}.${subName}`;
          const innerObj = {};
          innerObj[fullSubName] = subValue;
          query += `${param(innerObj)}&`;
        }
      } else if (value !== undefined && value !== null) {
        query += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
      }
    }
  }
  return query.length ? query.substr(0, query.length - 1) : query;
};
