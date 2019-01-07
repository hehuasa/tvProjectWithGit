import fetch from 'dva/fetch';
import { notification, Modal } from 'antd';
// import { dispatch } from 'dva';
import { routerRedux } from 'dva/router';
import store from '../index';

import { switchCode } from '../services/statusCode';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
const parseJSON = (response) => {
  return response.json();
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if (response.status === 404) {
    try {
      const a = response.json();
      a.finally((resJson, b) => {
        console.log('resJson', resJson);
        console.log('b', b);
        if (resJson) {
          checkCode({ response, resJson });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
  const errortext = codeMessage[response.status] || response.statusText;
  // notification.error({
  //   message: `请求错误 ${response.status}: ${response.url}`,
  //   description: errortext,
  // });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

const checkCode = ({ response, resJson }) => {
  const { url } = response;
  const { code, data } = resJson;
  switch (Number(code)) {
    case 0:
      if (!window.isReset) {
        window.isReset = true;
        const error = new Error(0);
        error.name = response.status;
        error.response = response;
        throw error;
      } else {
        break;
      }
    case 1:
      Modal.error({
        title: '未授权',
        content: `功能未授权(${url})`,
        okText: '确定',
      });
      break;
    case 1001: break;
    case 1002:
      notification.info({
        description: data || `${switchCode(code)}`,
      });
      break;
    case 1005: break;
    case 1014: break;
    case 1015: break;
    // {
    //   const msg = switchCode(code);
    //   notification.info({
    //     description: `${msg}`,
    //   });
    //   const error = new Error(msg);
    //   error.name = response.status;
    //   error.response = response;
    //   throw error;
    // }

    default:
      // const msg = switchCode(code);
      // // notification.error({
      // //   message: `后台返回异常： ${url}`,
      // //   description: `错误原因： ${msg}`,
      // // });
      // const error = new Error(msg);
      // error.name = response.status;
      // error.response = response;
      // throw error;
      // Modal.error({
      //   title: '服务器返回错误信息',
      //   content: data,
      //   okText: '确定',
      // });
  }
};

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

/**/
export default function request(url, options, needParam) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  newOptions.mode = 'cors';
  // 判断是否序列化
  if (needParam) {
    if (!needParam.needParam) {
      newOptions.headers = {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    }
  } else if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = param(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        ...newOptions.headers,
      };
    }
  } else {
    // console.log(url);
  }
  // newOptions.mode = 'no-cors';
  let response,
    resJson;
  return fetch(url, newOptions)
    .then(checkStatus)
    .then((res) => {
      response = res;
      return response.json();
    })
    .then((res) => {
      resJson = res;
      checkCode({ response, resJson, url });
    })
    .then(() => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return new Promise((resolve) => {
        resolve(resJson);
      });
    });
  // .catch((e) => {
  //   const { dispatch } = store;
  //   const status = e.name;
  //   if (status === 401) {
  //     dispatch({
  //       type: 'login/logout',
  //     });
  //   }
  //   if (status === 403) {
  //     // dispatch(routerRedux.push('/exception/403'));
  //     return;
  //   }
  //   if (status <= 504 && status >= 500) {
  //     // dispatch(routerRedux.push('/exception/500'));
  //     return;
  //   }
  //   if (status >= 404 && status < 422) {
  //     // dispatch(routerRedux.push('/exception/404'));
  //   }
  // });
}
