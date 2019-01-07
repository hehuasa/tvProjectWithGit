import { queryNotices, queryWeatherData, queryHydrology, getUrl, getPtzPower } from '../services/api';
import { autoContentHeight } from '../utils/utils';

const windType = [
  { type: '静风', start: 22.5, end: 67.5 },
  { type: '东北风', start: 67.5, end: 112.5 },
  { type: '东风', start: 112.5, end: 67.5 },
  { type: '静风', start: 22.5, end: 157.5 },
  { type: '东南风', start: 157.5, end: 202.5 },
  { type: '南风', start: 202.5, end: 247.5 },
  { type: '西南风', start: 247.5, end: 292.5 },
  { type: '西风', start: 292.5, end: 337.5 },
  { type: '西北风', start: 337.5, end: 360 },
  { type: '西北风', start: 0, end: 22.5 },
];

const switchWindDrection = (angle) => {
  for (const item of windType) {
    if (angle > item.start && angle <= item.end) {
      return item.type;
    }
  }
};


export default {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    serviceUrl: {
      mapApiUrl: '',
      socketUrl: '',
      mapDataUrl: '',
    },
    weather: {
      weather: {},
      hydropower: {},
    },
    carousel: [],
    contentHeight: 0,
    warpContentHeight: 0,
    rightCollapsed: false,
    ptzPower: false,
  },
  effects: {
    *fetchUrl(_, { call, put }) {
      const response = yield call(getUrl);
      yield put({
        type: 'saveServiceUrl',
        payload: response.data,
      });
    },
    *fetchNotices(_, { call, put }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
    *queryWeather(_, { call, put }) {
      const { data } = yield call(queryWeatherData);
      const Hydrology = yield call(queryHydrology);
      data.windDrection = switchWindDrection(data.windDrection);
      const weatherData = {
        weather: data,
        hydropower: Hydrology.data,
      };
      yield put({
        type: 'weatherQuery',
        weather: weatherData,
      });
    },
    *getWarpContentHeight(_, { put }) {
      const height = autoContentHeight('page');
      yield put(
        {
          type: 'warpContentHeight',
          payload: height,
        }
      );
    },
    *getContentHeight(_, { put }) {
      const height = autoContentHeight('content');
      yield put(
        {
          type: 'contentHeight',
          payload: height,
        }
      );
    },
    *changeRightCollapsed({ payload }, { call, put }) {
      yield put(
        {
          type: 'queryRightCollapsed',
          payload,
        }
      );
    },
    // 请求视频权限
    *getPtzPower(_, { call, put }) {
      const response = yield call(getPtzPower);
      if (Number(response.code) === 1001) {
        yield put({
          type: 'savePtzPower',
          payload: true,
        });
      }
    },

  },

  reducers: {
    saveServiceUrl(state, { payload }) {
      window.serviceUrl = { mapApiUrl: payload['map.Api.Address'],
        socketUrl: payload['websocket.Address'],
        mapDataUrl: payload['map.Data.Address'],
      };
      return {
        ...state,
        serviceUrl: {
          mapApiUrl: payload['map.Api.Address'],
          socketUrl: payload['websocket.Address'],
          mapDataUrl: payload['map.Data.Address'],
        },
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    weatherQuery(state, { weather }) {
      return {
        ...state,
        weather,
      };
    },
    textCarouselQuery(state, { carousel }) {
      return {
        ...state,
        carousel,
      };
    },
    contentHeight(state, { payload }) {
      return {
        ...state,
        contentHeight: payload,
      };
    },
    warpContentHeight(state, { payload }) {
      return {
        ...state,
        warpContentHeight: payload,
      };
    },
    queryRightCollapsed(state, { payload }) {
      return {
        ...state,
        rightCollapsed: payload,
      };
    },
    savePtzPower(state, { payload }) {
      return {
        ...state,
        ptzPower: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
