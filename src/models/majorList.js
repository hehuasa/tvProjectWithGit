import {
  addMajorInfo, deleteMajorInfo, majorInfoPage, updateMajorrInfo, majorInfoPageList,
  majorInfoChangeIndex, getFunctionMenus
} from '../services/api';
import { checkCode } from '../utils/utils';

export default {
  namespace: 'majorList',
  state: {
    data: {
      data: [],
      pagination: {},
    },
    list: {
      data: [],
    },
    toggle: true,
    sortSuccess: false,
    functionList: [],
    functionMenus: [], // 页面功能权限
  },
  effects: {
    * page(payload, { call, put }) {
      const response = yield call(majorInfoPage, payload.payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    * add(payload, { call }) {
      const response = yield call(addMajorInfo, payload.payload);
      checkCode(response);
    },
    * delete(payload, { call }) {
      const response = yield call(deleteMajorInfo, { id: payload.payload });
      checkCode(response);
    },
    * reSort({ payload }, { call, put }) {
      const response = yield call(majorInfoChangeIndex, payload);
      if (response.code === 1001) {
        yield put({
          type: 'querySortSuccess',
          payload: true,
        });
      } else {
        yield put({
          type: 'querySortSuccess',
          payload: false,
        });
      }
    },
    // *get(payload, { call, put }) {
    //   const response = yield call(getUserInfo, payload.payload);
    //   if (response.code === 1001) {
    //     yield put({
    //       type: 'user',
    //       payload: response,
    //     });
    //   }
    // },
    * update(payload, { call, put }) {
      const response = yield call(updateMajorrInfo, payload.payload);
      checkCode(response);
    },
    * queryMajorContent(_, { call, put }) {
      const list = yield call(majorInfoPageList);
      yield put({
        type: 'saveList',
        payload: typeof list.data === 'object' ? list : { data: [] },
      });
    },
    * getFunctionMenus({ payload }, { call, put }) {
      const res = yield call(getFunctionMenus, payload);
      yield put({
        type: 'saveFunctionMenus',
        payload: res.data,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          data: action.payload.data.result,
          pagination: {
            current: action.payload.data.pageNum,
            pageNum: action.payload.data.pageNum,
            pageSize: action.payload.data.pageSize,
            total: action.payload.data.sumCount,
          },
        },
        toggle: action.toggle,
      };
    },
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    querySortSuccess(state, { payload }) {
      return {
        ...state,
        sortSuccess: payload,
      };
    },
    saveFunctionMenus(state, { payload }) {
      return {
        ...state,
        functionMenus: payload,
      };
    },
    // user(state, action) {
    //   return {
    //     ...state,
    //     user: action.payload,
    //   };
    // },
  },
};

