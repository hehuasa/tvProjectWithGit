// import { response } from '../../mock/vocsData';
import { vocsList, vocsTasks } from '../services/api';

export default {
  namespace: 'vocsMonitor',

  state: {
    list: [],
    mapSelectedList: { list: [], areaName: '', keys: [] },
  },

  effects: {
    // 获取聚合数据
    * fetchList({ payload }, { call, put }) {
      const { data } = yield call(vocsList, payload);
      const newData = data.filter(value => value.gisCode);
      yield put({
        type: 'queryList',
        payload: newData,
      });
    },
    // 获取列表
    * fetchVocsTasks({ payload }, { call, put }) {
      const { areaName, gisCode } = payload;
      const { data } = yield call(vocsTasks, { gisCode });
      const keys = [];
      for (const item of data) {
        keys.push(String(item.ldarSceneDetectID));
      }
      yield put({
        type: 'queryMapSelectedList',
        payload: { list: data, areaName, keys },
      });
    },
  },

  reducers: {
    queryList(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
    queryMapSelectedList(state, { payload }) {
      return {
        ...state,
        mapSelectedList: payload,
      };
    },
  },
};
