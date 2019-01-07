import { commonTreeList, deleteCommon } from '../services/api';
import { checkCode } from '../utils/utils';

export default {
  namespace: 'commonTree',

  state: {
    contextMenu: { show: false },
    commonTreeList: [],
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(commonTreeList, payload);
      const list = [];
      if (response.data.tree) {
        response.data.tree.forEach((item) => {
          if (item.loadResource === true) {
            const resourceList = response.data.child.filter(c => c.ctrlResourceType === item.ctrlResourceType);
            item.children = resourceList;
          }
          list.push(item);
        });
      }
      const compareUp = (propertyName) => { // 升序排序
        return function (object1, object2) { // 属性值为数字
          const value1 = object1[propertyName];
          const value2 = object2[propertyName];
          return value1 - value2;
        };
      };
      const makeTree = (treeList, parent) => {
        const filters = treeList.filter(c => c.parentTreeID === parent);
        filters.sort(compareUp('sortIndex'));
        if (filters.length) {
          filters.forEach((c) => {
            if (!c.loadResource) {
              c.children = makeTree(treeList, c.treeID);
            }
          });
        }
        return filters;
      };
      const treeData = makeTree(list, 0);
      yield put({
        type: 'queryList',
        payload: treeData,
      });
    },
    *deleteCommonResource({ payload }, { call, put }) {
      const response = yield call(deleteCommon, payload);
      checkCode(response);
    },
  },

  reducers: {
    queryList(state, { payload }) {
      return {
        ...state,
        commonTreeList: payload,
      };
    },
    getContext(state, { payload }) {
      return {
        ...state,
        contextMenu: payload,
      };
    },
  },
};
