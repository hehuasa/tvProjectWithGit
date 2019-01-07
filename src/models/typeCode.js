import {
  addSystemCode, codeTypeList, deleteSystemCode, getFunctionMenus,
  selectByTypeParent
} from '../services/api';
import { checkCode } from '../utils/utils';

// 码表管理
export default {
  namespace: 'typeCode',
  state: {
    // 学历
    codeList: [],
    // 专业
    specialList: [],
    // 职称
    ranksList: [],
    // 用户类型
    userTypeList: [],
    accountTypeList: [],
    orgTypeList: [],
    code: '',
    codeTypeList: [], // 编码类型列表
    codeInfoList: [], // 根据码表类型查询的结果
    selectedCode: '', // 选择的下拉码表类型
    functionMenus: [], // 页面功能权限
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(selectByTypeParent, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *speciality({ payload }, { call, put }) {
      const response = yield call(selectByTypeParent, payload);
      yield put({
        type: 'saveSpeciality',
        payload: response,
      });
    },
    *ranks({ payload }, { call, put }) {
      const response = yield call(selectByTypeParent, payload);
      yield put({
        type: 'saveRanks',
        payload: response,
      });
    },
    *type({ payload }, { call, put }) {
      const response = yield call(selectByTypeParent, payload);
      yield put({
        type: 'saveTypes',
        payload: response,
      });
    },
    *accountType({ payload }, { call, put }) {
      const response = yield call(selectByTypeParent, payload);
      yield put({
        type: 'saveAccountType',
        payload: response,
      });
    },
    *orgType({ payload }, { call, put }) {
      const response = yield call(selectByTypeParent, payload);
      yield put({
        type: 'saveOrgType',
        payload: response,
      });
    },
    // 系统编码类型
    *codeTypeList({ payload }, { call, put }) {
      const response = yield call(codeTypeList, payload);
      yield put({
        type: 'saveCodeTypeList',
        payload: response.data,
      });
    },
    // 根据编码类型新增信息
    *addSystemCode({ payload }, { call }) {
      const response = yield call(addSystemCode, payload);
      checkCode(response);
    },
    // 删除码表信息
    *deleteSystemCode({ payload }, { call }) {
      const response = yield call(deleteSystemCode, payload);
      checkCode(response);
    },
    // 根据系统码类型查询码表信息
    *getCodeInfoList({ payload }, { call, put }) {
      const response = yield call(selectByTypeParent, payload);
      yield put({
        type: 'saveCodeInfoList',
        payload: response.data,
      });
    },
    * getFunctionMenus({ payload }, { call, put }) {
      const res = yield call(getFunctionMenus, payload);
      yield put({
        type: 'saveFunctionMenus',
        payload: res.data,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        codeList: action.payload.data,
      };
    },
    saveSpeciality(state, action) {
      return {
        ...state,
        specialList: action.payload.data,
      };
    },
    saveRanks(state, action) {
      return {
        ...state,
        ranksList: action.payload.data,
      };
    },
    saveTypes(state, action) {
      return {
        ...state,
        userTypeList: action.payload.data,
      };
    },
    saveAccountType(state, action) {
      return {
        ...state,
        accountTypeList: action.payload.data,
      };
    },
    saveOrgType(state, action) {
      return {
        ...state,
        orgTypeList: action.payload.data,
      };
    },
    saveCodeTypeList(state, action) {
      return {
        ...state,
        codeTypeList: action.payload,
      };
    },
    saveCodeInfoList(state, action) {
      return {
        ...state,
        codeInfoList: action.payload,
      };
    },
    saveSelectedCode(state, { payload }) {
      return {
        ...state,
        selectedCode: payload,
      };
    },
    saveFunctionMenus(state, { payload }) {
      return {
        ...state,
        functionMenus: payload,
      };
    },
  },
};
