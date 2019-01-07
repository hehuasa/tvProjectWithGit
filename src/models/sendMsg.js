import {
  sendList, addSend, deleteSend, getSend, updateSend, sendPage, selectByResult, sendMsgs,
} from '../services/api';
import { commonData } from '../../mock/commonData';
import { checkCode } from '../utils/utils';

export default {
  namespace: 'sendMsg',
  state: {
    data: {
      data: [],
      pagination: {},
    },
    sends: {
      data: {},
    },
    sendLists: [],
  },
  effects: {
    * fetch(_, { call, put }) {
      const response = yield call(sendList);
      if (response.code === 1001) {
        yield put({
          type: 'saveList',
          payload: response.data,
        });
      }
    },
    * page(payload, { call, put }) {
      const response = yield call(sendPage, payload.payload);
      // 排序
      const listSort = (propertyName, type) => {
        return function (object1, object2) {
          const value1 = object1[propertyName];
          const value2 = object2[propertyName];
          const tag = value1 > value2;
          switch (type) {
            case 'ascend':
              return tag;
            case 'descend':
              return !tag;
            default:
              return 0;
          }
        };
      };
      if (response.code === 1001) {
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
      }
    },
    * add(payload, { call, put }) {
      const response = yield call(addSend, payload.payload);
      checkCode(response);
      if (response.code === 1001) {
        const values = {
          sendResult: 0,
        };
        const search = {};
        Object.assign(search, commonData.pageInitial, values);
        const sendLists = yield call(sendPage, search);
        yield put({
          type: 'save',
          payload: sendLists,
        });
      }
    },
    * delete(payload, { call, put }) {
      const response = yield call(deleteSend, payload.payload);
      checkCode(response);
      if (response.code === 1001) {
        const sendLists = yield call(sendPage, commonData.pageInitial);
        yield put({
          type: 'save',
          payload: sendLists,
        });
      }
    },
    * get(payload, { call, put }) {
      const response = yield call(getSend, payload.payload);
      if (response.code === 1001) {
        yield put({
          type: 'sends',
          payload: response,
        });
      }
    },
    * update(payload, { call, put }) {
      const response = yield call(updateSend, payload.payload);
      checkCode(response);
      if (response.code === 1001) {
        const values = {
          sendResult: 0,
        };
        const search = {};
        Object.assign(search, commonData.pageInitial, values);
        const sendLists = yield call(sendPage, search);
        yield put({
          type: 'save',
          payload: sendLists,
        });
      }
    },
    * sendMsgs(payload, { call, put }) {
      const response = yield call(sendMsgs, payload.payload);
      checkCode(response);
      if (response.code === 1001) {
        const values = {
          sendResult: 0,
        };
        const search = {};
        Object.assign(search, commonData.pageInitial, values);
        const sendLists = yield call(sendPage, search);
        yield put({
          type: 'save',
          payload: sendLists,
        });
      }
    },
    * selectByResult(payload, { call, put }) {
      const response = yield call(selectByResult, payload.payload);
      checkCode(response);
      if (response.code === 1001) {
        const values = {
          sendResult: 0,
        };
        const search = {};
        Object.assign(search, commonData.pageInitial, values);
        const sendLists = yield call(sendPage, search);
        yield put({
          type: 'save',
          payload: sendLists,
        });
      }
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
        sendLists: action.payload,
      };
    },
    sends(state, action) {
      return {
        ...state,
        sends: action.payload,
      };
    },
  },
};
