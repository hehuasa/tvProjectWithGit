import {alarmList, clearTwinkle, getAlarmType, getManualAlarmType} from '../services/api';
import { groupingByType, groupingByArea, groupingByOverview } from '../utils/alarmService';

export default {
  namespace: 'alarm',

  state: {
    count: 0,
    linkMap: 0,
    linkVideo: 0,
    alarmTypeList: [],
    manualAlarmType: [],
    overviewShow: {
      showSafety: false,
      showEnv: false,
      showFault: false,
    },
    list: [],
    listWithFault: [], // 业务需求，将有故障报警的列表单独列出来
    listByFault: [], // 故障报警列表
    groupByType: {},
    groupByArea: {},
    groupByOverview: { list: [], historyList: [] },
    iconObj: {}, // 报警图标的Interval 的Id 集合
    iconArray: [], // 缓存报警图标的Interval 的Id 集合
    drawing: false, // 是否在画图标
    socketAlarms: [],
  },
  effects: {
    // 获取报警类型
    *getAlarmType(_, { call, put }) {
      const response = yield call(getAlarmType);
      yield put({
        type: 'saveAlarmType',
        payload: response.data,
      });
    },
    // 获取手动报警类型
    *getManualAlarmType(_, { call, put }) {
      const response = yield call(getManualAlarmType);
      yield put({
        type: 'saveManualAlarmType',
        payload: response.data,
      });
    },
    *fetch({ payload }, { call, put }) {
      let response;
      if (payload.list) {
        response = payload.list;
      } else {
        response = yield call(alarmList);
      }
      const data = payload.list ? response : response.data;
      // 报警列表（原始数值）
      yield put({
        type: 'queryListWithFault',
        payload: data,
      });
      const list = data.filter((value) => {
        if (value.alarmType) {
          return (Number(value.alarmType.alarmLevel > 0 && value.alarmType.profession !== '107.901' && (Number(value.alarmStatue) !== 4 && Number(value.alarmStatue) !== 6)));
        } else {
          return false;
        }
      });
      const listByFault = data.filter((value) => {
        if (value.alarmType) {
          return (Number(value.alarmType.alarmLevel > 0 && value.alarmType.profession === '107.901'));
        } else {
          return false;
        }
      });
      const group = groupingByType({ alarms: list });
      const area = groupingByArea({ alarms: list });
      // 报警列表（原始数值-- 不包含故障）
      yield put({
        type: 'queryList',
        payload: { list, count: list.length },
      });
      // 报警列表（按报警类型分类）
      yield put({
        type: 'queryGroup',
        payload: group,
      });
      // 报警列表（按装置 分类）
      yield put({
        type: 'queryArea',
        payload: area,
      });
      // 报警列表（只包含故障）
      yield put({
        type: 'queryListByFault',
        payload: listByFault,
      });
    },
    *filter({ payload }, { put, select }) {
      const { list, groupByOverview, overviewShow } = yield select(({ alarm }) => {
        return alarm;
      });
      const overView = groupingByOverview({ para: overviewShow, alarms: list });
      overView.historyList = groupByOverview.list;
      // 报警列表（按总览分类）
      yield put({
        type: 'queryOverView',
        payload: overView,
      });
    },
    *add({ payload }, { put }) {
      const group = groupingByType({ alarms: payload.list });
      const area = groupingByArea({ alarms: payload.list });
      // 报警列表（原始数值）
      yield put({
        type: 'queryListWithFault',
        payload: payload.listWithFault,
      });
      yield put({
        type: 'queryList',
        payload: { list: payload.list, count: payload.list.length },
      });
      // 报警列表（按报警类型分类）
      yield put({
        type: 'queryGroup',
        payload: group,
      });
      // 报警列表（按装置分类）
      yield put({
        type: 'queryArea',
        payload: area,
      });
    },
    *del({ payload }, { put, select }) {
      const { list, listWithFault, listByFault } = yield select(({ alarm }) => {
        return alarm;
      });
      // 报警列表（原始数值-- 不包含故障）
      const listIndex = list.findIndex(value => value.alarmCode === payload.alarmCode);
      if (listIndex !== -1) {
        list.splice(listIndex, 1);
        const group = groupingByType({ alarms: list });
        const area = groupingByArea({ alarms: list });
        yield put({
          type: 'queryList',
          payload: { list, count: list.length },
        });
        // 报警列表（按报警类型分类）
        yield put({
          type: 'queryGroup',
          payload: group,
        });
        // 报警列表（按装置 分类）
        yield put({
          type: 'queryArea',
          payload: area,
        });
      }
      // 报警列表（原始数值包含故障）
      const listWithFaultIndex = listWithFault.findIndex(value => value.alarmCode === payload.alarmCode);
      if (listWithFaultIndex !== -1) {
        listWithFault.splice(listWithFaultIndex, 1);
        yield put({
          type: 'queryListWithFault',
          payload: listWithFault,
        });
      }
      // 报警列表（只包含故障）
      const listByFaultIndex = listByFault.findIndex(value => value.alarmCode === payload.alarmCode);
      if (listWithFaultIndex !== -1) {
        listByFault.splice(listByFaultIndex, 1);
        yield put({
          type: 'queryListByFault',
          payload: listByFault,
        });
      }
    },
    *clearTwinkle({ payload }, { call }) {
      const response = yield call(clearTwinkle, payload);
    },
    // *deal({ payload }, { put }){
    //
    // }
    *addSocketAlarms({ payload }, { put }) {

    }
  },
  reducers: {
    saveAlarmType(state, { payload }) {
      return {
        ...state,
        alarmTypeList: payload,
      };
    },
    saveManualAlarmType(state, { payload }) {
      return {
        ...state,
        manualAlarmType: payload,
      };
    },
    queryList(state, { payload }) {
      return {
        ...state,
        count: payload.count,
        list: payload.list,
      };
    },
    queryListWithFault(state, { payload }) {
      return {
        ...state,
        listWithFault: payload,
      };
    },
    queryListByFault(state, { payload }) {
      return {
        ...state,
        listByFault: payload,
      };
    },
    queryGroup(state, { payload }) {
      return {
        ...state,
        groupByType: payload,
      };
    },
    queryArea(state, { payload }) {
      return {
        ...state,
        groupByArea: payload,
      };
    },
    queryOverView(state, { payload }) {
      return {
        ...state,
        groupByOverview: payload,
      };
    },
    // 报警图标的Interval 的Id 集合
    queryIconObj(state, { payload }) {
      return {
        ...state,
        iconObj: payload,
      };
    },
    queryIconArray(state, { payload }) {
      return {
        ...state,
        iconArray: payload,
      };
    },
    // 报警是否联动地图
    linkMap(state, { payload }) {
      return {
        ...state,
        linkMap: payload,
      };
    },
    // 报警是否联动地图
    linkVideo(state, { payload }) {
      return {
        ...state,
        linkVideo: payload,
      };
    },
    queryDrawing(state, { payload }) {
      return {
        ...state,
        drawing: payload,
      };
    },
  },
};
