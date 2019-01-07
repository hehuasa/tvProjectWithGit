import { findUserList, addUserInfo, deleteUserInfo, getUserInfo, updateUserInfo, findUserPage, exportUserInfo } from '../services/api';
import { commonData } from '../../mock/commonData';
import { checkCode } from '../utils/utils';

export default {
  namespace: 'userList',
  state: {
    data: {
      data: [],
      pagination: {},
    },
    user: {
      data: {},
    },
    list: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(findUserList);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
    *page(payload, { call, put }) {
      const response = yield call(findUserPage, payload.payload);
      // 排序
      const listSort = (propertyName, type) => {
        return function (object1, object2) {
          const value1 = object1[propertyName];
          const value2 = object2[propertyName];
          const tag = value1 > value2;
          switch (type) {
            case 'ascend': return tag;
            case 'descend': return !tag;
            default: return 0;
          }
        };
      };
        // 列表页排序
      if (payload.payload.sorter) {
        const { field, order } = payload.payload.sorter;
        response.data.result = response.data.result.sort(listSort(field, order));
      }
      // 列表过滤
      if (payload.payload.sex) {
        response.data.result = response.data.result.filter(val => val.sex && val.sex.indexOf(payload.payload.sex) > -1);
      }
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add(payload, { call, put }) {
      const response = yield call(addUserInfo, payload.payload);
      checkCode(response);
      const userList = yield call(findUserPage, commonData.pageInitial);
      yield put({
        type: 'save',
        payload: userList,
      });
    },
    *delete(payload, { call, put }) {
      const response = yield call(deleteUserInfo, payload.payload);
      checkCode(response);
      if (response.code === 1001) {
        const userList = yield call(findUserPage, commonData.pageInitial);
        yield put({
          type: 'save',
          payload: userList,
        });
      }
    },
    *get(payload, { call, put }) {
      const response = yield call(getUserInfo, payload.payload);
      yield put({
        type: 'user',
        payload: response,
      });
    },
    *update(payload, { call, put }) {
      const response = yield call(updateUserInfo, payload.payload);
      checkCode(response);
      const userList = yield call(findUserPage, commonData.pageInitial);
      yield put({
        type: 'save',
        payload: userList,
      });
    },
    *export(payload, { call }) {
      yield call(exportUserInfo, payload.payload);
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
            pageSize: action.payload.data.pageSize,
            total: action.payload.data.sumCount,
          },
        },
      };
    },
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    user(state, action) {
      return {
        ...state,
        user: action.payload,
      };
    },
  },
};
