import { stringify } from 'qs';
import { isUrl } from '../utils/utils';
import request from '../utils/request';

const menuData = [
  {
    name: '首页',
    icon: 'dashboard',
    path: 'homePage',
  },
  {
    name: '监控预警',
    icon: 'dashboard',
    path: 'monitorWarning',
    children: [{
      name: '环保',
      path: 'evr',
    }, {
      name: '列表',
      path: 'list',
    }, {
      name: 'Demo',
      path: 'demo',
    }, {
      name: '地图页',
      path: 'arcgis',
    }],
  },
  {
    name: '生产调度',
    icon: 'dashboard',
    path: 'productionDispatch',
    children: [{
      name: '子页面',
      path: 'part1',
    }, {
      name: '子页面',
      path: 'part2',
    }, {
      name: '子页面',
      path: 'part3',
    }],
  },
  {
    name: '应急指挥',
    icon: 'dashboard',
    path: 'command',
    children: [{
      name: '子页面',
      path: 'part1',
    }, {
      name: '子页面',
      path: 'part2',
    }, {
      name: '子页面',
      path: 'part3',
    }],
  },
  {
    name: '应急演练',
    icon: 'dashboard',
    path: 'exercise',
    children: [{
      name: '子页面',
      path: 'part1',
    }, {
      name: '子页面',
      path: 'part2',
    }, {
      name: '子页面',
      path: 'part3',
    }],
  },
  {
    name: '资源管理',
    icon: 'dashboard',
    path: 'resource',
    children: [{
      name: '子页面',
      path: 'part1',
    }, {
      name: '子页面',
      path: 'part2',
    }, {
      name: '子页面',
      path: 'part3',
    }],
  },
  {
    name: '通用工具',
    icon: 'dashboard',
    path: 'tools',
    children: [{
      name: '子页面',
      path: 'part1',
    }, {
      name: '子页面',
      path: 'part2',
    }, {
      name: '子页面',
      path: 'part3',
    }],
  },
  {
    name: '统计分析',
    icon: 'dashboard',
    path: 'analysis',
    children: [{
      name: '子页面',
      path: 'part1',
    }, {
      name: '子页面',
      path: 'part2',
    }, {
      name: '子页面',
      path: 'part3',
    }],
  },
  {
    name: '系统管理',
    icon: 'dashboard',
    path: 'system',
    children: [{
      name: '用户账号',
      icon: 'dashboard',
      path: 'list',
      children: [{
        name: '用户管理',
        path: 'user',
      }, {
        name: '账户管理',
        path: 'account',
      }, {
        name: '角色管理',
        path: 'role',
      }, {
        name: '测试',
        path: 'test',
      },
      ],
    }, {
      name: '部门管理',
      path: 'org',
    }, {
      name: '子页面',
      path: 'part3',
    }],
  },
//   {
//     name: 'dashboard',
//     icon: 'dashboard',
//     path: 'dashboard',
//     children: [{
//       name: '分析页',
//       path: 'analysis',
//       // authority: 'admin', // 配置准入权限
//     }, {
//       name: '监控页',
//       path: 'monitor',
//     }, {
//       name: '工作台',
//       path: 'workplace',
//       // hideInMenu: true,
//     }, {
//       name: '地图页',
//       path: 'arcgis'
//     }],
//   },
//   {
//   name: '表单页',
//   icon: 'form',
//   path: 'form',
//   children: [{
//     name: '基础表单',
//     path: 'basic-form',
//   }, {
//     name: '分步表单',
//     path: 'step-form',
//   }, {
//     name: '高级表单',
//     // authority: 'admin',
//     path: 'advanced-form',
//   }],
// }, {
//   name: '列表页',
//   icon: 'table',
//   path: 'list',
//   children: [{
//     name: '查询表格',
//     path: 'table-list',
//   }, {
//     name: '标准列表',
//     path: 'basic-list',
//   }, {
//     name: '卡片列表',
//     path: 'card-list',
//   }, {
//     name: '搜索列表',
//     path: 'search',
//     children: [{
//       name: '搜索列表（文章）',
//       path: 'articles',
//     }, {
//       name: '搜索列表（项目）',
//       path: 'projects',
//     }, {
//       name: '搜索列表（应用）',
//       path: 'applications',
//     }],
//   }],
// }, {
//   name: '详情页',
//   icon: 'profile',
//   path: 'profile',
//   children: [{
//     name: '基础详情页',
//     path: 'basic',
//   }, {
//     name: '高级详情页',
//     path: 'advanced',
//     // authority: 'admin',
//   }],
// }, {
//   name: '结果页',
//   icon: 'check-circle-o',
//   path: 'result',
//   children: [{
//     name: '成功',
//     path: 'success',
//   }, {
//     name: '失败',
//     path: 'fail',
//   }],
// }, {
//   name: '异常页',
//   icon: 'warning',
//   path: 'exception',
//   children: [{
//     name: '403',
//     path: '403',
//   }, {
//     name: '404',
//     path: '404',
//   }, {
//     name: '500',
//     path: '500',
//   }, {
//     name: '触发异常',
//     path: 'trigger',
//     hideInMenu: true,
//   }],
// }, {
//   name: '账户',
//   icon: 'user',
//   path: 'user',
//   // authority: 'guest',
//   children: [{
//     name: '登录',
//     path: 'login',
//   }, {
//     name: '注册',
//     path: 'register',
//   }, {
//     name: '注册结果',
//     path: 'register-result',
//   }],
// }
];
// let menuData = [];
// // 功能菜单排序
// const compareUp = (propertyName) => { // 升序排序
//   return function (object1, object2) { // 属性值为数字
//     const value1 = object1[propertyName];
//     const value2 = object2[propertyName];
//     return value1 - value2;
//   };
// };
// // 生成树形节点
// const makeTree = (treeList, parent) => {
//   const filters = treeList.filter(c => c.parentCode === parent);
//   filters.sort(compareUp('sortIndex'));
//   if (filters.length) {
//     filters.forEach((c) => {
//       c.children = makeTree(treeList, c.functionCode);
//     });
//   }
//   return filters;
// };
// function sysFunctionList() {
//   //  根据用户请求菜单信息
//   const cookieVal = decodeURIComponent(document.cookie);
//   // 获取当前登录用户ID
//   const userID = cookieVal.split(';')[1].split('=')[1];
//   const response = request('/system/sysFunction/list');
//   response.then((res) => {
//     const dataList = res.data.map((item) => {
//       return { name: item.functionName, path: item.visitURL, functionCode: item.functionCode, parentCode: item.parentCode };
//     });
//     const treeList = makeTree(dataList, '0');
//     menuData = treeList;
//     // console.log(menuData);
//   });
//   return response;
// }
// sysFunctionList();
function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = (data) => {
  if (data) {
    return formatter(data);
  } else {
    return formatter([]);
  }
};
