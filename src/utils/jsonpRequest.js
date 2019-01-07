import fetchJsonp from 'fetch-jsonp';
// import fetchJsonp from './fetchJsonp';
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
const jsonpFetch = (url) => {
  // const paramSt = JSON.stringify(pram);
  return fetchJsonp(url)
    // .then((res) => {
    //   return res.json();
    // });
    // .then((res) => {
    //   return res.json();
    // }).then((res1) => {
    //   console.log(res1);
    // });
};
export default jsonpFetch;
