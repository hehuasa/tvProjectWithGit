import { autoContentHeight } from '../utils/utils';
import {getGuardCounting, getGuardDoorCounting, findByTime, getServerTime} from '../services/api';

export default {
  namespace: 'homepage',
  state: {
    mapHeight: 0,
    videoFooterHeight: { current: 190, cache: 190 },
    bottomCollapsed: false,
    modalType: '',
    // 门禁及区域实时值
    guardAreaCounting: [],
    guardDoorCounting: [],
    // 设备监测
    deviceMonitor: { show: false, ctrlResourceType: '', spaceTime: 0, devicesName: '' },
    serverTime: null, // 服务器时间
  },
  effects: {
    *getMapHeight({ payload }, { put }) {
      const { domType, changingType } = payload;
      const mapHeight = autoContentHeight(domType, changingType);
      yield put(
        {
          type: 'mapHeight',
          payload: mapHeight,
        }
      );
    },
    *getVideoFooterHeight({ payload }, { put }) {
      yield put(
        {
          type: 'VideoFooterHeight',
          payload: { current: payload.current, cache: payload.cache },
        }
      );
    },
    // 请求区域（门禁）信息
    *getGuardAreaCounting({ payload }, { call, put }) {
      const response = yield call(getGuardCounting, payload);
      yield put({
        type: 'saveGuardCounting',
        payload: response.data,
      });
    },
    *getGuardDoorCounting({ payload }, { call, put }) {
      const response = yield call(getGuardDoorCounting, payload);
      yield put({
        type: 'saveDoorCounting',
        payload: response.data,
      });
    },
    *getImmediateData({ payload }, { call, put }) {
      const response = yield call(findByTime, payload);
      yield put({
        type: payload.name,
        payload: response.data,
      });
    },
    *getServerTime({ payload }, { call, put }) {
      const response = yield call(getServerTime, payload);
      yield put({
        type: 'saveServerTime',
        payload: response,
      });
    },
  },
  reducers: {
    VideoFooterHeight(state, { payload }) {
      return {
        ...state,
        videoFooterHeight: payload,
      };
    },
    mapHeight(state, { payload }) {
      return {
        ...state,
        mapHeight: payload,
      };
    },
    queryDeviceMonitor(state, { payload }) {
      return {
        ...state,
        deviceMonitor: payload,
      };
    },
    // 首页弹窗显示顺序
    queryModalType(state, { payload }) {
      return {
        ...state,
        modalType: payload,
      };
    },
    // 保存服务器时间
    saveServerTime(state, { payload }) {
      return {
        ...state,
        serverTime: payload,
      };
    },
  },

};
