import { message } from 'antd';
import {
  getEmgcResource, addEmgcResource, delEmgcResource, selectMaterialCode, getUserPage,
  getFunctionMenus, getEmgcResourceInfo, updateEmgcResource
} from '../services/api';

export default {
  namespace: 'emgcResource',
  state: {
    data: { result: [] },
    repeated: false,
    userData: { result: [] },
    emgcResourceInfo: {}, // 应急资源信息
    functionMenus: [], //  页面功能权限
  },

  effects: {
    // 获取分页数据
    *fetchEmgcResourcePage({ payload }, { call, put }) {
      const { data } = yield call(getEmgcResource, payload);
      yield put({
        type: 'queryEmgcResourcePage',
        payload: data,
      });
    },
    // 新增
    *addEmgcResource({ payload }, { call }) {
      const res = yield call(addEmgcResource, payload);
      if (Number(res.code) !== 1001) {
        message.error('操作失败');
      }
    },
    // 删除
    *delEmgcResource({ payload }, { call }) {
      const res = yield call(delEmgcResource, payload);
      if (Number(res.code) !== 1001) {
        message.error('操作失败');
      }
    },
    // 修改
    *updateEmgcResource({ payload }, { call }) {
      const res = yield call(updateEmgcResource, payload);
      if (Number(res.code) !== 1001) {
        message.error('操作失败');
      }
    },
    // 获取单个资源信息
    *getEmgcResourceInfo({ payload }, { call, put }) {
      const res = yield call(getEmgcResourceInfo, payload);
      yield put({
        type: 'saveEmgcResourceInfo',
        payload: res.data,
      });
    },
    // 查重
    *selectMaterialCode({ payload }, { call, put }) {
      const { data } = yield call(selectMaterialCode, payload);
      yield put({
        type: 'queryRepeated',
        payload: JSON.parse(data),
      });
    },
    // 查询用户
    *fetchUsers({ payload }, { call, put }) {
      const { data } = yield call(getUserPage, payload);
      yield put({
        type: 'queryUsers',
        payload: data,
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
    queryEmgcResourcePage(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
    queryRepeated(state, { payload }) {
      return {
        ...state,
        repeated: payload,
      };
    },
    queryUsers(state, { payload }) {
      return {
        ...state,
        userData: payload,
      };
    },
    saveFunctionMenus(state, { payload }) {
      return {
        ...state,
        functionMenus: payload,
      };
    },
    saveEmgcResourceInfo(state, { payload }) {
      return {
        ...state,
        emgcResourceInfo: payload,
      };
    },
  },
};
