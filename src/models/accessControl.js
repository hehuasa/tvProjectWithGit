import moment from 'moment';
import { queryCountByTime, queryDoorOrgCount, queryCountByDay, queryDoorPage, getAllDoorCountArea, getAllDoorCount } from '../services/api';
import { addDoorIcon } from '../utils/mapService';

export default {
  namespace: 'accessControl',

  state: {
    show: false,
    allDoorCountArea: [],
    allDoorCount: [],
    doorOrgCount: [], // 部门
    doorCount: [],
    countByTime: [],
    countByDay: [],
    style: {},
    spaceTime: 30000,
  },

  effects: {
    // 门禁区域统计
    *getAllDoorCountArea({ payload }, { call, put }) {
      const response = yield call(getAllDoorCountArea, payload);
      response.data.dateTimes = moment().format('HH:mm:ss');
      yield put({
        type: 'queryAllDoorCountArea',
        payload: response.data,
      });
    },
    // 门禁统计
    *getAllDoorCount({ payload }, { call, put, select }) {
      const { data } = yield call(getAllDoorCount, payload);
      const { map, view, graphics, dispatch } = payload;
      yield put({
        type: 'queryAllDoorCount',
        payload: data,
      });
      const show = yield select(({ accessControl }) => {
        return accessControl.show;
      });
      if (show) {
        yield addDoorIcon({ map, view, data, graphics, dispatch });
      }
    },
    // 各部门人员分布情况
    *getDoorOrgCount({ payload }, { call, put }) {
      const response = yield call(queryDoorOrgCount, payload);
      // 处理数据
      const array = response.data;
      for (const item of array) {
        const { numMap } = item;
        if (numMap) {
          item.productCount = numMap['227'];
          item.officeCount = numMap['226'];
        }
      }
      yield put({
        type: 'queryDoorOrgCount',
        payload: array,
      });
    },
    // 人员进出实时情况
    *getDoorPage({ payload }, { call, put }) {
      const response = yield call(queryDoorPage, payload);
      yield put({
        type: 'queryDoorPage',
        payload: response.data.result,
      });
    },
    // 今日在场人数
    *getCountByTime(_, { call, put }) {
      const response = yield call(queryCountByTime);
      const { data } = response;
      const array = [];
      for (const [index, item] of Object.entries(data)) {
        let type;
        switch (Number(index)) {
          case 226: type = '办公区'; break;
          case 227: type = '生产厂区'; break;
          default: break;
        }
        for (const [index1, item1] of Object.entries(item)) {
          const hour = moment(index1).format('HH:mm:ss');
          const time = moment(index1).valueOf();
          array.push({
            time, type, num: item1, hour,
          });
        }
      }
      yield put({
        type: 'queryCountByTime',
        payload: array,
      });
    },
    // 每日入场人数
    *getCountByDay({ payload }, { call, put }) {
      const response = yield call(queryCountByDay, payload);
      const { data } = response;
      const array = [];
      for (const [index, item] of Object.entries(data)) {
        let type;
        switch (Number(index)) {
          case 226: type = '办公区'; break;
          case 227: type = '生产厂区'; break;
          default: break;
        }
        for (const [index1, item1] of Object.entries(item)) {
          const day = moment(index1).format('L');
          array.push({
            day, type, num: item1,
          });
        }
      }
      yield put({
        type: 'queryCountByDay',
        payload: array,
      });
    },
  },

  reducers: {
    switch(state, { payload }) {
      return {
        ...state,
        show: payload,
      };
    },
    queryAllDoorCountArea(state, { payload }) {
      return {
        ...state,
        allDoorCountArea: payload,
      };
    },
    queryAllDoorCount(state, { payload }) {
      return {
        ...state,
        allDoorCount: payload,
      };
    },
    queryDoorOrgCount(state, { payload }) {
      return {
        ...state,
        doorOrgCount: payload,
      };
    },
    queryDoorPage(state, { payload }) {
      return {
        ...state,
        doorCount: payload,
      };
    },
    queryCountByTime(state, { payload }) {
      return {
        ...state,
        countByTime: payload,
      };
    },
    queryCountByDay(state, { payload }) {
      return {
        ...state,
        countByDay: payload,
      };
    },
    queryStyle(state, { payload }) {
      return {
        ...state,
        style: payload,
      };
    },
    // 请求时间
    querySpaceTime(state, { payload }) {
      return {
        ...state,
        spaceTime: payload,
      };
    },
  },
};
