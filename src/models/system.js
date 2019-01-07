import { getPluginList } from '../services/api';
import { commonData } from '../../mock/commonData';
import { checkCode } from '../utils/utils';

export default {
  namespace: 'system',
  state: {
    pluginList: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(getPluginList);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
  },

  reducers: {
    saveList(state, { payload }) {
      return {
        ...state,
        pluginList: payload,
      };
    },
  },
};
