import {
  BroadcastOptByArea, BroadcastOptByResourceID, changePASystem, fetchPASystem, getBroadcastState,
  getResourceByArea,
} from '../services/api';

export default {
  namespace: 'paSystem',

  state: {
    currentArea: [],
    allAreas: [],
    devices: [],
    deviceStatus: [],
    paSystemInfo: [],
    paLayer: {},
  },

  effects: {
    * fetchCurrentAreaInfo({ payload }, { call, put }) {
      const { data } = yield call(getResourceByArea, payload);
      yield put({
        type: 'saveCurrentArea',
        payload: data,
      });
    },
    // 获取扩音设备
    * fetchAllDevice({ payload }, { call, put }) {
      const { data } = yield call(getResourceByArea, payload);
      yield put({
        type: 'savePADevice',
        payload: data,
      });
    },
    // 获取设备状态
    * fetchDeviceStatus(_, { call, put }) {
      const { data } = yield call(getBroadcastState);
      yield put({
        type: 'queryDeviceStatus',
        payload: data,
      });
    },
    // 请求扩音分区信息
    * fetchPASystem(_, { call, put }) {
      const { data } = yield call(fetchPASystem);
      yield put({
        type: 'queryPASystemInfo',
        payload: data,
      });
    },
    * changePASystem({ payload }, { call, put }) {
      const { data } = yield call(BroadcastOptByResourceID, payload);
      yield put({
        type: 'queryPASystemInfo',
        payload: data,
      });
    },
  },

  reducers: {
    saveCurrentArea(state, { payload }) {
      return {
        ...state,
        currentArea: payload,
      };
    },
    // 所有设备
    savePADevice(state, { payload }) {
      return {
        ...state,
        devices: payload,
      };
    },
    // 所有设备的状态
    queryDeviceStatus(state, { payload }) {
      return {
        ...state,
        deviceStatus: payload,
      };
    },

    // 扩音对讲的popup
    queryPASystemInfo(state, { payload }) {
      return {
        ...state,
        paSystemInfo: payload,
      };
    },
    queryPALayer(state, { payload }){
      return {
        ...state,
        paLayer: payload,
      };
    },
    // 扩音对讲的popup
    queryPAPopup(state, { payload }) {
      return {
        ...state,
        paPopup: payload,
      };
    },
    // 扩音对讲的资源窗
    queryPABordInfo(state, { payload }) {
      return {
        ...state,
        paBordInfo: payload,
      };
    },
  },
};
