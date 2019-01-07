import { queryVOCSAreaList, getAllPlanByArea, getAllPlanByID, getVocsMap, queryVOCSDoorList } from '../services/api';

export default {
  namespace: 'vocs',

  state: {
    // 地图所点击的areaId
    areaCode: '',
    // vocs 装置检测计划列表
    inspectionPlan: [],
    // 检测计划详请
    planInfo: [],
    // vocs map 对象
    map: {},

    toggleTable: null,
    planName: {
      name: '',
      id: '',
    },
    list: [],
    pagination: {},

    allAreaList: [],
    areasSelectList: [],
    doorSelectList: [],
    type: 0,
  },

  effects: {
    *mapQuery(_, { call, put }) {
      const response = yield call(getVocsMap);
      yield put({
        type: 'queryMap',
        payload: response.data,
      });
    },
    *areaQuery({ payload }, { call, put }) {
      const response = yield call(queryVOCSAreaList, payload);
      yield put({
        type: 'saveQueryAreaList',
        payload: response.data,

      });
    },
    *stageDoorQuery({ payload }, { call, put }) {
      const response = yield call(getAllPlanByID, {
        planId: payload.planName.planId,
        // pageNum: payload.pagination.pageNum,
        // pageSize: payload.pagination.pageSize,
        // isQuery: payload.pagination.isQuery,
        // fuzzy: payload.pagination.fuzzy,
      });
      yield put({
        type: 'saveQueryDoorList',
        payload: {
          toggleTable: payload.toggleTable,
          planName: payload.planName,
          data: response.data,
        }
      });
    },
    // 根据areaCode 获取计划列表
    *getAllPlanByArea({ payload }, { call, put }) {
      const response = yield call(getAllPlanByArea, payload);
      yield put({
        type: 'saveAllPlan',
        payload: response.data,
      });
    },
    // 根据计划ID  获取计划详情
    *getAllPlanByID({ payload }, { call, put }) {
      const response = yield call(getAllPlanByID, payload);
      yield put({
        type: 'savePlanInfo',
        payload: response.data,
      });
    },


  },

  reducers: {
    toggleArea(state, { payload }) {
      return {
        ...state,
        toggleTable: payload.toggleTable,
      };
    },
    saveQueryDoorList(state, { payload }) {
      return {
        ...state,
        list: payload.data.result,
        toggleTable: payload.toggleTable,
        planName: payload.planName,
        pagination: {
          current: payload.data.pageNum,
          pageSize: payload.data.pageSize,
          total: payload.data.sumCount,
        },
      };
    },
    saveQueryAreaList(state, { payload }) {
      return {
        ...state,
        list: payload.result,
        pagination: {
          current: payload.pageNum,
          pageSize: payload.pageSize,
          total: payload.sumCount,
        },
      };
    },
    saveAreaCode(state, { payload }) {
      return {
        ...state,
        areaCode: payload,
      };
    },
    queryMap(state, { payload }) {
      return {
        ...state,
        map: payload,
      };
    },
    saveAllPlan(state, { payload }) {
      return {
        ...state,
        inspectionPlan: payload,
      };
    },
    savePlanInfo(state, { payload }) {
      return {
        ...state,
        planInfo: payload,
      };
    },
  },
};
