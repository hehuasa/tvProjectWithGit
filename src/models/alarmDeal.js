import {
  alarmEvent, alarmDeal, queryEventInfoReport, getResourceQueryPage,
  getMonitorResourceObj, getByResourceIDs, getApparatus, getAlarmConten,
  selectByTypeParent, selectByCodeByCode, queryAreaListByAreaType, materialPage, getMonitorResource,
} from '../services/api';


export default {
  namespace: 'alarmDeal',
  state: {
    dealModel: { isDeal: false, alarmID: null }, // 报警处理弹窗是否显示
    alarmInfo: {}, // 报警信息
    // eventInfoReport: {}, // 信息接报
    searchList: [], // 搜索的list
    pagination: {}, // 搜索的list分页
    apparatusList: [], // 获取手动报警装置
    alarmInfoConten: {}, // 请求获取报警信息
    alarmDealTypeList: [], // 报警处理类型列表 码表104
    isDrill: 0, // 是否是应急演练
    professionList: [], // 所属专业
    areaList: [], // 区域list
  },

  effects: {
    // 报警生成事件
    *alarmEvent({ payload }, { call, put }) {
      yield call(alarmEvent, payload);
    },
    // 报警不生成事件
    *alarmNotEvent({ payload }, { call, put }) {
      yield call(alarmDeal, payload);
    },
    // 查询手动报警里面的搜索
    *getResourceQueryPage({ payload }, { call, put }) {
      const response = yield call(getResourceQueryPage, payload);
      yield put({
        type: 'saveSearchList',
        payload: response.data,
      });
    },
    // 查询事发设备list
    *getMonitorResourceObj({ payload }, { call, put }) {
      const response = yield call(getMonitorResourceObj, payload);
      yield put({
        type: 'saveSearchList',
        payload: {
          result: response.data,
          pagination: {},
        },
      });
    },
    // 查询事发设备对应的 监测器具list
    *getMonitorResource({ payload }, { call, put }) {
      const response = yield call(getMonitorResource, payload);
      yield put({
        type: 'saveSearchList',
        payload: {
          result: response.data,
          pagination: {},
        },
      });
    },
    // 查询事件物质list
    *getByResourceIDs({ payload }, { call, put }) {
      const response = yield call(getByResourceIDs, payload);
      yield put({
        type: 'saveSearchList',
        payload: {
          result: response.data,
          pagination: {},
        },
      });
    },
    // // 获取报警时间
    // *continueTime({ payload }, { call, put }) {
    //   payload.continueTime = formatDuring(payload.eventTime);
    //   yield put({
    //     type: 'saveEventInfoReport',
    //     payload,
    //   });
    // },
    // 获取报警装置
    *getApparatus({ }, { call, put }) {
      const response = yield call(getApparatus);
      yield put({
        type: 'saveApparatus',
        payload: response.data,
      });
    },

    // 获取报警详情信息
    *getAlarmConten({ payload }, { call, put }) {
      const response = yield call(getAlarmConten, payload);
      yield put({
        type: 'saveAlarmConten',
        payload: response.data,
      });
    },
    // 获取报警详情信息
    *getAlarmDealTypeList({ payload }, { call, put }) {
      const response = yield call(selectByTypeParent, payload);
      yield put({
        type: 'saveAlarmDealTypeList',
        payload: response.data,
      });
    },
    // 获取所属专业列表
    *professionList({ payload }, { call, put }) {
      const response = yield call(selectByCodeByCode, payload);
      yield put({
        type: 'saveProfessionList',
        payload: response.data,
      });
    },
    // 获取装置区域
    *getAreaList({ payload }, { call, put }) {
      const response = yield call(queryAreaListByAreaType, payload);
      yield put({
        type: 'saveAreaList',
        payload: response.data,
      });
    },
    // 获取事件物资
    *getMaterialPage({ payload }, { call, put }) {
      const response = yield call(materialPage, payload);
      yield put({
        type: 'saveSearchList',
        payload: response.data,
      });
    },
  },

  reducers: {
    saveDealModel(state, { payload }) {
      return {
        ...state,
        dealModel: payload,
      };
    },
    saveAlarmInfo(state, { payload }) {
      return {
        ...state,
        alarmInfo: payload,
      };
    },
    // saveEventInfoReport(state, { payload }) {
    //   return {
    //     ...state,
    //     eventInfoReport: payload,
    //   };
    // },
    saveSearchList(state, { payload }) {
      return {
        ...state,
        searchList: payload.result,
        pagination: {
          current: payload.pageNum,
          pageSize: payload.pageSize,
          total: payload.sumCount,
        },
      };
    },
    resetSearchList(state, { payload }) {
      return {
        ...state,
        searchList: [],
      };
    },
    saveApparatus(state, { payload }) {
      return {
        ...state,
        apparatusList: [payload],
      };
    },

    saveAlarmConten(state, { payload }) {
      return {
        ...state,
        alarmInfoConten: payload,
      };
    },
    saveAlarmDealTypeList(state, { payload }) {
      return {
        ...state,
        alarmDealTypeList: payload,
      };
    },
    saveIsDrill(state, { payload }) {
      return {
        ...state,
        isDrill: payload,
      };
    },
    saveProfessionList(state, { payload }) {
      return {
        ...state,
        professionList: payload,
      };
    },
    saveAreaList(state, { payload }) {
      return {
        ...state,
        areaList: payload,
      };
    },

  },
};
