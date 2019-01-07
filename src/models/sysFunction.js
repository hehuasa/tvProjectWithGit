import {
  sysFunctionList, findFunctionsByRoleID, addRoleFunctions, findFunctionsByUserID,
  addOftenFunction, findOftenFuncs, deleteOften, isOften, resourceTree, dataPowerAdd,
} from '../services/api';
import { commonData } from '../../mock/commonData';
import { checkCode, isUrl } from '../utils/utils';

export default {
  namespace: 'sysFunction',
  state: {
    // 系统功能导航菜单数据
    sysFunctionList: [],
    // 常用功能菜单
    oftenFunctions: [],
    roleFunction: {
      roleID: null,
      checkedKeys: [],
    },
    //  当前登录用户  拥有的功能菜单
    currentFunctions: [],
    contextMenu: { show: false },
    // 是否已经是常用功能
    isOften: false,
    // 功能树数据
    treeData: [],
    // 功能树ztree对象
    ztreeObj: {},
    // 常用功能树数据
    oftenTreeData: [],
    // 常用功能树ztree对象
    oftenZtreeObj: {},
    // 功能树禁用
    oftenTreeDisabled: false,
    activeKey: 1,
  },
  effects: {
    // 获取当前用户具有的导航菜单
    *fetch({ payload }, { call, put }) {
      const response = yield call(findFunctionsByUserID, payload);
      const response1 = yield call(resourceTree);
      response.data.map((item) => {
        item.name = item.functionName;
        item.nocheck = true;
        return item;
      });
      response.data.sort((a, b) => {
        return a.sortIndex - b.sortIndex;
      });
      const trees = response1.data.filter(value => Number(value.treeType) === 1);
      trees.map((item) => {
        item.name = item.treeName;
        item.isParent = true;
        item.nocheck = true;
        // item.newSortIndex = item.sortIndex;
        return item;
      });
      const menuArr = response.data.filter(item => item.menu);
      yield put({
        type: 'queryList',
        payload: [...trees, ...menuArr],
      });
    },
    // 获取当前用户的常用功能
    *findOftenFunction(payload, { call, put }) {
      const response = yield call(findOftenFuncs, payload.payload);
      response.data.map((item) => {
        item.name = item.functionName;
        return item;
      });
      yield put({
        type: 'saveOftenFunctionList',
        payload: response.data,
      });
    },
    *list(payload, { call, put }) {
      const response = yield call(sysFunctionList);
      yield put({
        type: 'save',
        payload: response.data,
      });
    },
    *findFunctions(payload, { call, put }) {
      yield put({
        type: 'saveRoleID',
        payload: payload.payload,
      });
      const response = yield call(findFunctionsByRoleID, payload.payload);
      const keys = response.data.map(item => item.baseSystemFunction.funID);
      yield put({
        type: 'saveCheckedFunctions',
        payload: keys,
      });
    },
    *checkedKeys(payload, { call, put }) {
      yield put({
        type: 'saveRoleFunction',
        payload: payload.payload,
      });
    },
    *addRoleFunctions({ payload }, { call, put }) {
      const { roleID, funIDs, powerData } = payload;
      yield call(addRoleFunctions, { roleID, funIDs });
      const res = yield call(dataPowerAdd, { ...powerData });
      checkCode(res);
    },
    //  通过当前用户  获取导航菜单
    *findByUserID(payload, { call, put }) {
      const response = yield call(findFunctionsByUserID, payload.payload);
      // const response = yield call(sysFunctionList);
      // mene.js 中的formatter函数
      const formatter = (data, parentPath = '', parentAuthority) => {
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
      };
      // 生成树形节点
      const makeTree = (treeList, parent) => {
        const filters = treeList.filter(c => (c.menu && c.parentCode === parent));
        filters.sort(compareUp('sortIndex'));
        if (filters.length) {
          filters.forEach((c) => {
            c.children = makeTree(treeList, c.functionCode);
          });
        }
        return filters;
      };
      // 功能菜单排序
      const compareUp = (propertyName) => { // 升序排序
        return function (object1, object2) { // 属性值为数字
          const value1 = object1[propertyName];
          const value2 = object2[propertyName];
          return value1 - value2;
        };
      };
      const dataList = response.data.map((item) => {
        return {
          name: item.functionName,
          path: item.visitURL,
          functionCode: item.functionCode,
          parentCode: item.parentCode,
          sortIndex: item.sortIndex,
          menu: item.menu,
          funID: item.funID,
        };
      });
      const treeData = makeTree(dataList, '0');
      const formatData = formatter(treeData);
      yield put({
        type: 'saveCurrentFunctions',
        payload: formatData,
      });
    },
    // 查询常用功能
    // *findOftenFunction(payload, { call, put }) {
    //   const response = yield call(findOftenFuncs, payload.payload);
    //   response.data.push({ functionCode: '0', functionName: '常用功能', leafFunction: false, menu: true, parentCode: '-1', visitURL: '' });
    //   const formatter = (data, parentPath = '', parentAuthority) => {
    //     return data.map((item) => {
    //       let { path } = item;
    //       if (!isUrl(path)) {
    //         path = parentPath + item.path;
    //       }
    //       const result = {
    //         ...item,
    //         path,
    //         authority: item.authority || parentAuthority,
    //       };
    //       if (item.children) {
    //         result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    //       }
    //       return result;
    //     });
    //   };
    //   // 生成树形节点
    //   const makeTree = (treeList, parent) => {
    //     const filters = treeList.filter(c => (c.menu && c.parentCode === parent));
    //     filters.sort(compareUp('sortIndex'));
    //     if (filters.length) {
    //       filters.forEach((c) => {
    //         c.children = makeTree(treeList, c.functionCode);
    //       });
    //     }
    //     return filters;
    //   };
    //   // 功能菜单排序
    //   const compareUp = (propertyName) => { // 升序排序
    //     return function (object1, object2) { // 属性值为数字
    //       const value1 = object1[propertyName];
    //       const value2 = object2[propertyName];
    //       return value1 - value2;
    //     };
    //   };
    //   const dataList = response.data.map((item) => {
    //     return {
    //       name: item.functionName,
    //       path: item.visitURL,
    //       functionCode: item.functionCode,
    //       parentCode: item.parentCode,
    //       sortIndex: item.sortIndex,
    //       menu: item.menu,
    //       funID: item.funID,
    //     };
    //   });
    //   const treeData = makeTree(dataList, '-1');
    //   const formatData = formatter(treeData);
    //   yield put({
    //     type: 'saveOftenFunctions',
    //     payload: formatData,
    //   });
    // },
    *addOftenFunction(payload, { call, put }) {
      const response = yield call(addOftenFunction, payload.payload);
      checkCode(response);
    },
    *deleteOftenFunction(payload, { call, put }) {
      const response = yield call(deleteOften, payload.payload);
      checkCode(response);
    },
    *checkIsOften(payload, { call, put }) {
      const response = yield call(isOften, payload.payload);
      yield put({
        type: 'saveIsOften',
        payload: response.data,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        sysFunctionList: action.payload,
      };
    },
    saveRoleFunction(state, action) {
      const data = action.payload;
      return {
        ...state,
        roleFunction: { ...data },
      };
    },
    saveRoleID(state, action) {
      return {
        ...state,
        roleFunction: { ...state.roleFunction, roleID: action.payload },
      };
    },
    saveCheckedFunctions(state, action) {
      return {
        ...state,
        roleFunction: { ...state.roleFunction, checkedKeys: action.payload },
      };
    },
    saveCurrentFunctions(state, action) {
      return {
        ...state,
        currentFunctions: action.payload,
      };
    },
    getContext(state, { payload }) {
      return {
        ...state,
        contextMenu: payload,
      };
    },
    saveOftenFunctions(state, action) {
      return {
        ...state,
        oftenFunctions: action.payload,
      };
    },
    saveIsOften(state, action) {
      return {
        ...state,
        isOften: action.payload,
      };
    },
    queryList(state, { payload }) {
      return {
        ...state,
        treeData: payload,
      };
    },
    queryZtreeObj(state, { payload }) {
      return {
        ...state,
        ztreeObj: payload,
      };
    },
    saveOftenFunctionList(state, { payload }) {
      return {
        ...state,
        oftenTreeData: payload,
      };
    },
    queryOftenZtreeObj(state, { payload }) {
      return {
        ...state,
        oftenZtreeObj: payload,
      };
    },
    saveActiveKey(state, { payload }) {
      return {
        ...state,
        activeKey: payload,
      };
    },
    queryOftenTreeDisabled(state, { payload }) {
      return {
        ...state,
        oftenTreeDisabled: payload,
      }
    }
  },
};
