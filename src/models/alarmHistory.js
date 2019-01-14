import { alarmQuery } from '../services/api';

export default {
  namespace: 'alarmHistory',

  state: {
    data: [],
    pagination: { sumCount: 0, pageNum: 1, pageSize: 5 },
  },
  effects: {
    // 获取报警类型
    *fetch({ payload }, { call, put }) {
      const { data } = yield call(alarmQuery, payload);
      // 报警列表（原始数值）
      const { result, sumCount, pageNum, pageSize } = data;
      yield put({
        type: 'queryList',
        payload: result,
      });
      yield put({
        type: 'queryPagination',
        payload: { sumCount, pageNum, pageSize },
      });
    },
  },
  reducers: {
    queryList(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
    queryPagination(state, { payload }) {
      return {
        ...state,
        pagination: payload,
      };
    },
  },
};
