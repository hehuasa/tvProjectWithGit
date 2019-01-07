import {
  selectByCodeByCode, getGroup, getParentOrgByQuotaGroupCode, getOrgByQuotaGroupCode, getByQuotaGroupCode, getAllQuota,
  findHistory
} from '../services/api';

export default {
  namespace: 'historyData',

  state: {
    allProfessionList: [],
    targetAll: [],
    departmentList: [],
    subsectionList: [],
    resourceList: [],
    target: [],

    list: [],
  },

  effects: {
    // 请求专业系统
    *queryAllProfessionList({ payload }, { call, put }) {
      const response = yield call(selectByCodeByCode, payload);
      yield put({
        type: 'selectByCode',
        payload: response.data,
      });
    },
    // 请求监测指标组  
    *queryTargetAll({ payload }, { call, put }) {
      const response = yield call(getGroup, payload);
      yield put({
        type: 'targetAllList',
        payload: response.data,
      });
    },
    // 请求部门
    *querydepartment({ payload }, { call, put }) {
      const response = yield call(getParentOrgByQuotaGroupCode, payload);
      yield put({
        type: 'departmentList',
        payload: response.data,
      });
    },
    // 请求分部
    *querySubsection({ payload }, { call, put }) {
      const response = yield call(getOrgByQuotaGroupCode, payload);
      yield put({
        type: 'subsectionList',
        payload: response.data,
      });
    },
    // 请求资源点位
    *queryResource({ payload }, { call, put }) {
      const response = yield call(getByQuotaGroupCode, payload);
      yield put({
        type: 'resourceList',
        payload: response.data,
      });
    },
    // 请求检测指标
    *queryAllQuota({ payload }, { call, put }) {
      const response = yield call(getAllQuota, payload);
      yield put({
        type: 'allQuotaList',
        payload: response.data,
      });
    },
    // 请求历史列表
    *queryHistory({ payload }, { call, put }) {
      const response = yield call(findHistory, payload);
      yield put({
        type: 'historyList',
        payload: response.data,
      });
    },
  },

  reducers: {
    selectByCode(state, action) {
      return {
        ...state,
        allProfessionList: action.payload,
      };
    },
    targetAllList(state, action) {
      return {
        ...state,
        targetAll: action.payload,
      };
    },
    departmentList(state, action) {
      return {
        ...state,
        departmentList: action.payload,
      };
    },
    subsectionList(state, action) {
      return {
        ...state,
        subsectionList: action.payload,
      };
    },
    resourceList(state, action) {
      return {
        ...state,
        resourceList: action.payload,
      };
    },
    allQuotaList(state, action) {
      return {
        ...state,
        target: action.payload,
      };
    },

    historyList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },

  },
};
