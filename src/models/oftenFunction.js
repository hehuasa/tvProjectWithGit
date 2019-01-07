import {
  sysFunctionList, findFunctionsByRoleID, addRoleFunctions, findFunctionsByUserID,
  addOftenFunction, findOftenFuncs, deleteOften, isOften, resourceTree,
} from '../services/api';
import { commonData } from '../../mock/commonData';
import { checkCode, isUrl } from '../utils/utils';

export default {
  namespace: 'oftenFunction',
  state: {
    contextMenu: { show: false },
    // 是否已经是常用功能
    isOften: false,
    // 功能树数据
    treeData: [],
    // 功能树ztree对象
    ztreeObj: {},
  },
  effects: {
    // 查询常用功能
    *findOftenFunction(payload, { call, put }) {
      const response = yield call(findOftenFuncs, payload.payload);
      response.data.map((item, index) => {
        item.name = item.functionName;
        return item;
      });
      yield put({
        type: 'queryList',
        payload: response.data,
      });
    },
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
  },
};
