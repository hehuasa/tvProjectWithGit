import { notification, message, Modal } from 'antd';
import moment from 'moment';
import { commonData } from '../../mock/commonData';
import { mapConstants } from '../services/mapConstant';
import { getBordStyle } from './mapService';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - (day * oneDay);

    return [moment(beginTime), moment(beginTime + ((7 * oneDay) - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}


function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!');  //  eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    //  是否包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    //  去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(routePath =>
    routePath.indexOf(path) === 0 && routePath !== path);
  //  Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  //  Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  //  Conversion and stitching parameters
  const renderRoutes = renderArr.map((item) => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
      exact,
    };
  });
  return renderRoutes;
}


/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}
// 获取浏览器宽高
export const getBrowserStyle = () => {
  let winHeight = 0;
  let winWidth = 0;
  // if (window.innerHeight) {
  //   winHeight = window.innerHeight;
  //   winWidth = window.innerWidth;
  // } else if ((document.body) && (document.body.clientHeight)) {
  winHeight = document.body.clientHeight;
  winWidth = document.body.clientWidth;
  // }
  // if (document.documentElement && document.documentElement.clientHeight) {
  //   winHeight = document.documentElement.clientHeight;
  //   winWidth = document.documentElement.clientWidth;
  // }
  return { winHeight, winWidth };
};
// 获取浏览器滚动值
export const getBrowserScroll = () => {
  let scrollTop; let scrollLeft;
  if (document.body.scrollTop === 0 && document.body.scrollLeft === 0) {
    scrollTop = document.documentElement.scrollTop;
    scrollLeft = document.documentElement.scrollLeft;
  } else {
    scrollTop = document.body.scrollTop;
    scrollLeft = document.body.scrollLeft;
  }
  return { scrollTop, scrollLeft };
};
// 自动定高
export const autoContentHeight = (domType, changingType) => {
  const header = 90; const points = 64; const evrVideo = 0; const footer = 0;
  const map = 275; const space = 8; const tabs = 50;
  let height;
  let chengingHeight;
  // 获取浏览器窗口高度
  let { winHeight } = getBrowserStyle();
  console.log('winHeightwinHeight', winHeight);
  switch (domType) {
    case 'page':
      winHeight = winHeight - header - points;
      break;
    case 'content':
      winHeight = winHeight - header - points - footer;
      break;
    case 'map':
      winHeight = winHeight - header - space - points - footer - tabs;
      break;
    case 'rightSide':
      winHeight = winHeight - header - footer - points - space - tabs;
      break;
    case 'sideZoom':
      winHeight = winHeight - footer - tabs - points - header - space;
      break;
    default: break;
  }
  switch (changingType) {
    case 'auto': chengingHeight = '100%'; break;
    case 'header': chengingHeight = header; break;
    case 'evrVideo': chengingHeight = footer; break;
    case 'content': chengingHeight = header + footer; break;
    case 'footer': chengingHeight = footer; break;
    case 'map': chengingHeight = map; break;
    case 'sideZoom': chengingHeight = map + 35 + 2; break;
    default: chengingHeight = 0; break;
  }
  if (chengingHeight === '100%') {
    winHeight = '100%';
  } else {
    winHeight += chengingHeight;
  }
  console.log('winHeight', winHeight);
  console.log('domType', domType);
  return winHeight;
};
// 判断返回的code状态
export const checkCode = (response) => {
  if (response.code === 1001) {
    message.success(commonData.statusCode[response.code]);
    return true;
  } else if (response.code === 1020) {
    Modal.error({
      title: '服务器返回错误信息',
      content: response.data,
      okText: '确定',
    });
  } else {
    message.error(commonData.statusCode[response.code]);
    return false;
  }
};
const compareUp = (propertyName) => { // 升序排序
  return function (object1, object2) { // 属性值为数字
    const value1 = object1[propertyName];
    const value2 = object2[propertyName];
    return value1 - value2;
  };
};
// 计算字符串长度
export const getStrLength = (item) => {
  if (item === null) {
    return { cnLength: 0, enLength: 0 };
  }
  const cnChar = item.match(/[^\x00-\x80]/g);// 利用match方法检索出中文字符并返回一个存放中文的数组
  const entryLen = cnChar === null ? 0 : cnChar.length;// 算出实际的字符长度
  return { cnLength: entryLen, enLength: item.length - entryLen };
};
// 处理部门树形数据
export const makeTree = (treeList, parent) => {
  let filters = [];
  if (parent) {
    filters = treeList.filter(c => c.parentOrgnization === parent);
  } else {
    filters = treeList.filter(c => c.parentOrgnization === '' || c.parentOrgnization === null || c.parentOrgnization === undefined);
  }
  filters.sort(compareUp('sortIndex'));
  if (filters.length) {
    filters.forEach((c) => {
      c.children = makeTree(treeList, c.orgnizationCode);
    });
  }
  return filters;
};
// 时间装换
export const FormatDuring = () => {
  return (alarmTime) => {
    const mss = new Date().getTime() - Number(alarmTime);
    const days = parseInt(mss / (1000 * 60 * 60 * 24), 0);
    const hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60), 0);
    const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60), 0);
    const seconds = parseInt((mss % (1000 * 60)) / 1000, 0);
    return `${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒 `;
  };
};
export const formatDuring = (nowTime, alarmTime) => {
  const mss = nowTime - Number(alarmTime);
  const days = parseInt(mss / (1000 * 60 * 60 * 24), 0);
  const hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60), 0);
  const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60), 0);
  const seconds = parseInt((mss % (1000 * 60)) / 1000, 0);
  return `${days} 天 ${hours} 小时 ${minutes} 分钟 ${seconds} 秒 `;
};
// 报警状态
export const alarmStatus = (status) => {
  let statuName = '';
  switch (status) {
    case 1: statuName = '未处理'; break;
    case 2: statuName = '已处理'; break;
    case 3: statuName = '已恢复'; break;
    case 4: statuName = '已生成应急事件'; break;
    case 5: statuName = '非应急报警'; break;
    case 6: statuName = '已关闭'; break;
    default: statuName = status;
  }
  return statuName;
};
// 判断变量是数组、还是对象
export const isObjArr = (value) => {
  if (Object.prototype.toString.call(value) === '[object Array]') {
    console.log('value是数组');
  } else if (Object.prototype.toString.call(value) === '[object Object]') { // 这个方法兼容性好一点
    console.log('value是对象');
  } else {
    console.log('value不是数组也不是对象');
  }
};
// 指令类型 通知还是指令
export const commandType = (status) => {
  let statuName = '';
  switch (status) {
    case 1: statuName = '指令'; break;
    case 2: statuName = '通知'; break;
    default: statuName = status;
  }
  return statuName;
};
export const getUUID = () => {
  const arr = [];
  const hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    arr[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  arr[14] = '4';
  arr[19] = hexDigits.substr((arr[19] & 0x3) | 0x8, 1);
  arr[8] = arr[13] = arr[18] = arr[23] = '-';
  const uuid = arr.join('');
  return uuid;
};
// 返回首页（不关闭设备监测逻辑图等）
export const returnHome = (that) => {
  return new Promise((resolve) => {
    const { dispatch, tabs } = that.props;
    if (tabs.activeKey === '/homePage') {
      resolve();
      return;
    }
    dispatch({
      type: 'tabs/active',
      payload: { key: '/homePage' },
    }).then(() => {
      const { video, videoFooterHeight, rightCollapsed, accessControlShow } = that.props;
      const { position } = video;
      const { view, accessInfoExtent } = mapConstants;
      changeVideoPosition('homePage', rightCollapsed, position, dispatch);
      // 恢复看板
      if (rightCollapsed) {
        dispatch({
          type: 'global/changeRightCollapsed',
          payload: false,
        }).then(() => {
          changeVideoSize(videoFooterHeight, dispatch, 'show');
          resetAccessStyle(accessControlShow, dispatch, accessInfoExtent).then(() => {
            resolve();
          });
        });
      } else {
        resetAccessStyle(accessControlShow, dispatch, accessInfoExtent).then(() => {
          resolve();
        });
      }
    });
  });
};
// 视频栏隐藏与显示
export const switchVideo = (videoFooterHeight, dispatch) => {
  // 视频栏是否隐藏，没有的话执行隐藏
  if (videoFooterHeight.current !== 0) {
    dispatch({
      type: 'video/switch',
      payload: {
        CmdCode: 'Hide',
      },
    });
    dispatch({
      type: 'homepage/getVideoFooterHeight',
      payload: { current: 0, cache: videoFooterHeight.current },
    });
    dispatch({
      type: 'homepage/getMapHeight',
      payload: { domType: 'map', changingType: 'evrVideo' },
    });
  }
};
// 修改视频坐标
export const changeVideoPosition = (key, rightCollapsed, position, dispatch) => {
  let x;
  // 即将跳转的页签是否在首页
  if (key.indexOf('homePage') === -1) {
    // 不在首页，且右边栏未折叠，x右移230
    if (!rightCollapsed) {
      x = position.x + 230;
      dispatch({
        type: 'video/reposition',
        payload: {
          CmdCode: '10002',
          Point: { x, y: position.y },
        },
      });
    }
  } else {
    // 右边栏是否折叠
    if (!rightCollapsed) {
      return;
    }
    x = position.x - 230;
    dispatch({
      type: 'video/reposition',
      payload: {
        CmdCode: '10002',
        Point: { x, y: position.y },
      },
    });
  }
};
// 修改视频尺寸
export const changeVideoSize = (videoFooterHeight, dispatch, type) => {
  if (type === 'hide') {
    if (videoFooterHeight.current !== 0) {
      dispatch({
        type: 'video/switch',
        payload: {
          CmdCode: 'Hide',
        },
      });
      dispatch({
        type: 'homepage/getVideoFooterHeight',
        payload: { current: 0, cache: videoFooterHeight.current },
      });
      dispatch({
        type: 'homepage/getMapHeight',
        payload: { domType: 'map', changingType: 'evrVideo' },
      });
    }
  } else {
    if (videoFooterHeight.current !== 0) {
      return;
    }
    dispatch({
      type: 'homepage/getMapHeight',
      payload: { domType: 'map' },
    });
    dispatch({
      type: 'video/switch',
      payload: {
        CmdCode: 'Show',
      },
    });
    dispatch({
      type: 'homepage/getVideoFooterHeight',
      payload: { current: videoFooterHeight.cache, cache: videoFooterHeight.current },
    });
  }
};
// 重设门禁展示的坐标
export const resetAccessStyle = (accessControlShow, dispatch, accessInfoExtent) => {
  return new Promise((resolve) => {
    // if (accessControlShow) {
    if (accessInfoExtent.xmax) {
      const a = setInterval(() => {
        const { view } = mapConstants;
        if (view.goTo) {
          clearInterval(a);
          view.goTo({ extent: accessInfoExtent }).then(() => {
            getBordStyle(view).then((style) => {
              dispatch({
                type: 'accessControl/queryStyle',
                payload: style,
              });
              resolve();
            });
          });
        }
      }, 500);
    } else {
      resolve();
    }


    // }
  });
};
// 重置地图标注的坐标
export const resetMapMark = (nodes) => {
  const newNodes = [...nodes];
  for (const node of newNodes) {
    if (node.geometrys) {
      node.points = [];
      // 线条单独处理
      for (const geometry of node.geometrys) {
        const point = mapConstants.view.toScreen(geometry);
        node.points.push([point.x, point.y]);
      }
    } else {
      const { box } = node;
      const point = mapConstants.view.toScreen(node.geometry);
      box.minX = point.x;
      box.minY = point.y;
    }
  }
  return newNodes;
};
// 随机id
export const generateMixed = (n) => {
  const charts = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'a', 'b', 'c', 'd', 'e', 'f', 'g'];
  let res = '';
  for (let i = 0; i < n; i += 1) {
    const id = Math.ceil(Math.random() * 17);
    res += charts[id];
  }
  return res;
};
// 地图标注对象克隆
export const cloneMarkObj = (obj) => {
  const newObj = {};
  for (const [index, item] of Object.entries(obj)) {
    if (index === 'geometry') {
      newObj[index] = item.clone();
    } else {
      newObj[index] = JSON.parse(JSON.stringify(item));
    }
  }
  return newObj;
};
