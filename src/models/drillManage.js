import { routerRedux } from 'dva/router';
import { query as queryUsers, queryCurrent } from '../services/user';
import { checkCode, getUUID } from '../utils/utils';
import {
  addDrill, deleteAnnex, deleteDrill, deleteDrillAnnex, getAreaList, getDrillAnnex, getDrillInfo,
  getDrillList, getDrillPage, getFunctionMenus,
  getMaterialList, getPlanInfoPage,
  getResourceList, linkPlan, planManagementInfoPage, selectDrillAddAnnex, updateDrill,
} from '../services/api';

export default {
  namespace: 'drillManage',

  state: {
    drillPage: {
      data: [],
      pagination: {},
    },
    planPage: { // 预案列表
      data: [],
      pagination: {},
    },
    drillInfo: {},
    orgList: [ // 应急演练参演部门
      {
        id: getUUID(),
        orgID: null,
        userCount: 0,
        resource: [
          // { id: getUUID(), resourceID: null, useCount: 0 },
        ],
        rawMaterial: [
          // { id: getUUID(), toolMaterialInfoID: null, useCount: 0 },
        ],
      },
    ],
    materialPage: {
      data: [],
      pagination: {},
    }, // 物资信息
    resourcePage: {
      data: [],
      pagination: {
        pageNum: 1,
        pageSize: 5,
      },
    }, // 资源信息
    areaList: [], // 资源选择的 区域列表
    drillStepAnnex: [], // 演练步奏附件列表
    summarizeAnnex: [], // 演练总结附件列表
    assessmentAnnex: [], // 演练考核附件列表
    otherAnnex: [], // 演练考核附件列表
    functionMenus: [], // 演练考核附件列表
  },

  effects: {
    // 演练page接口
    *drillPage({ payload }, { call, put }) {
      const response = yield call(getDrillPage, payload);
      const pagination = {
        current: response.data.pageNum,
        pageSize: response.data.pageSize,
        total: response.data.sumCount,
      };
      const data = response.data.result;
      yield put({
        type: 'saveDrillPage',
        payload: {
          pagination,
          data,
        },
      });
    },
    // get演练信息
    *getDrill({ payload }, { call, put }) {
      const response = yield call(getDrillInfo, payload);
      yield put({
        type: 'saveDrillInfo',
        payload: response.data,
      });
    },
    // 新增演练信息
    *addDrill({ payload }, { call }) {
      const response = yield call(addDrill, payload);
      checkCode(response);
    },
    // 修改演练信息
    *updateDrill({ payload }, { call }) {
      yield call(updateDrill, payload);
    },
    // 删除演练信息
    *deleteDrill({ payload }, { call }) {
      const response = yield call(deleteDrill, payload);
      checkCode(response);
    },
    // 模糊查询物资列表
    * getMaterialPage({ payload }, { call, put }) {
      const response = yield call(getMaterialList, payload);
      yield put({
        type: 'saveMaterialList',
        payload: response.data,
      });
    },
    // 模糊查询资源列表
    * geResourcePage({ payload }, { call, put }) {
      const response = yield call(getResourceList, payload);
      yield put({
        type: 'saveResourceList',
        payload: response.data,
      });
    },
    * getAreaList({ payload }, { call, put }) {
      const response = yield call(getAreaList, payload);
      yield put({
        type: 'saveAreaList',
        payload: response.data,
      });
    },
    * deleteDrillAnnex({ payload }, { call }) {
      yield call(deleteDrillAnnex, payload);
    },
    // 修改时获取演练步奏相关附件
    * getDrillStepAnnex({ payload }, { call, put }) {
      const response = yield call(getDrillAnnex, payload);
      yield put({
        type: 'saveDrillStepAnnex',
        payload: response.data,
      });
    },
    // 修改时获取演练总结相关附件
    * getDrillSummarizeAnnex({ payload }, { call, put }) {
      const response = yield call(getDrillAnnex, payload);
      yield put({
        type: 'saveDrillSummarizeAnnex',
        payload: response.data,
      });
    },
    // 修改时获取演练考核相关附件
    * getDrillAssessmentAnnex({ payload }, { call, put }) {
      const response = yield call(getDrillAnnex, payload);
      yield put({
        type: 'saveDrillAssessmentAnnex',
        payload: response.data,
      });
    },
    // 修改时获取其他相关附件
    * getOtherAnnex({ payload }, { call, put }) {
      const response = yield call(getDrillAnnex, payload);
      yield put({
        type: 'saveOtherAnnex',
        payload: response.data,
      });
    },
    // 新增时获取演练步奏相关附件
    * getDrillAddStepAnnex({ payload }, { call, put }) {
      const response = yield call(selectDrillAddAnnex, payload);
      yield put({
        type: 'saveDrillStepAnnex',
        payload: response.data,
      });
    },
    // 新增时获取演练总结相关附件
    * getDrillAddSummarizeAnnex({ payload }, { call, put }) {
      const response = yield call(selectDrillAddAnnex, payload);
      yield put({
        type: 'saveDrillSummarizeAnnex',
        payload: response.data,
      });
    },
    // 新增时获取演练考核相关附件
    * getDrillAddAssessmentAnnex({ payload }, { call, put }) {
      const response = yield call(selectDrillAddAnnex, payload);
      yield put({
        type: 'saveDrillAssessmentAnnex',
        payload: response.data,
      });
    },
    // 新增时获其他相关附件
    * getOtherAddAnnex({ payload }, { call, put }) {
      const response = yield call(selectDrillAddAnnex, payload);
      yield put({
        type: 'saveOtherAnnex',
        payload: response.data,
      });
    },
    // 删除演练考核相关附件
    * deleteAnnex({ payload }, { call }) {
      const response = yield call(deleteAnnex, payload);
      checkCode(response);
    },
    *getPlanPage(payload, { call, put }) {
      const response = yield call(planManagementInfoPage, payload.payload);
      yield put({
        type: 'savePlanPage',
        payload: response.data,
      });
    },
    // 关联预案
    * linkPlan({ payload }, { call }) {
      const response = yield call(linkPlan, payload);
      checkCode(response);
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
    saveDrillPage(state, { payload }) {
      return {
        ...state,
        drillPage: payload,
      };
    },
    saveDrillInfo(state, { payload }) {
      return {
        ...state,
        drillInfo: payload,
      };
    },
    saveOrgList(state, { payload }) {
      return {
        ...state,
        orgList: payload,
      };
    },
    saveMaterialList(state, { payload }) {
      return {
        ...state,
        materialPage: {
          data: payload.result,
          pagination: {
            current: payload.pageNum,
            pageSize: payload.pageSize,
            total: payload.sumCount,
          },
        },
      };
    },
    saveResourceList(state, { payload }) {
      return {
        ...state,
        resourcePage: {
          data: payload.result,
          pagination: {
            current: payload.pageNum,
            pageSize: payload.pageSize,
            total: payload.sumCount,
          },
        },
      };
    },
    saveAreaList(state, { payload }) {
      return {
        ...state,
        areaList: payload,
      };
    },
    saveDrillStepAnnex(state, { payload }) {
      return {
        ...state,
        drillStepAnnex: payload,
      };
    },
    saveDrillSummarizeAnnex(state, { payload }) {
      return {
        ...state,
        summarizeAnnex: payload,
      };
    },
    saveDrillAssessmentAnnex(state, { payload }) {
      return {
        ...state,
        assessmentAnnex: payload,
      };
    },
    saveOtherAnnex(state, { payload }) {
      return {
        ...state,
        otherAnnex: payload,
      };
    },
    savePlanPage(state, { payload }) {
      return {
        ...state,
        planPage: {
          data: payload.result,
          pagination: {
            current: payload.pageNum,
            pageSize: payload.pageSize,
            total: payload.sumCount,
          },
        },
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
