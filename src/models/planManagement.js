import { message } from 'antd';
import {
  addMajorInfo, deleteMajorInfo, majorInfoPage, updateMajorrInfo, majorInfoPageList,
  planManagementInfoPage, getPlanInfo, getEventFeatures, getResourceContent, getFeaturePlan,
  addFeaturePlan, updateFeaturePlan, delFeaturePlan, getEventFeaturePlan, selectByTypeParent,
  addPlanCommand, updatePlanCommand, deletePlanCommand, findPlanCommand, planCommandPage,
  planLevel, getPlanCommand, planExecutePosition, getFlowList, getPlanResource, findPlanResource,
  addPlanResource, updatePlanResource, addPlanInfo, updatePlanInfo, getPublisher, selectPlanCode,
  getOrgImages, materialDelete, materialAdd, materialUpdate, materialGet, materialPage,
  emgcReportPage, exportReport, getCommandStatusList, ifFromPlan, annexPage, annexDelete,
  getPlanAnnexPage, deletePlanAnnex, getDealCard, deletePlanManagementInfo, changePlanStatu,
  deletePlanResourceInfo,
  judgeMaterialCode, getFunctionMenus, checkFeature, deleteOrgAnnex,
} from '../services/api';
import { commonData } from '../../mock/commonData';
import { checkCode } from '../utils/utils';

export default {
  namespace: 'planManagement',
  state: {
    data: {
      data: [],
      pagination: {},
    },
    list: {
      data: [],
    },
    toggle: true,
    planCodeToggle: '', // 是否可用字段1001可用，1010已存在
    planBasicInfo: {}, // 基本信息
    eventFeatures: [], // 事件特征
    resourceContent: [], // 预案资源接
    featurePlan: [], // 获取预案管理特征
    eventFeaturePlan: {}, // 预案事件特征数据
    featureType: [], // 码表557-特征类型
    eventType: [], // 码表556-事件类型
    preplanType: [], // 码表558-预案类型
    publisher: [], // 获取 编制部门就是发布机构
    planLevelData: [], // 预案级别
    planCommandPage: {}, // 指令分页对象
    planCommandInfo: {}, // 指令信息
    planCommand: [], // 预案下所有指令
    flowNodeList: [], // 流程节点信息
    checkedUser: [], // 选中的指令接收人员ID
    planResource: {
      data: [],
      pageNum: 1,
      pageSize: 10,
    }, // 预案资源
    executePosition: [], // 预案指令执行人员
    resourceInfo: {}, // 预案资源信息
    materialInfo: {}, // 物料基本信息 get查询
    materialPage: {
      data: [],
      pagination: {},
    }, // 物料基本信息 page查询
    emgcReport: {
      data: [],
      pagination: {},
    }, // 应急报告管理
    annexPage: {
      pageNum: 1,
      // 每页显示条数
      pageSize: 5,
      result: [],
    }, // 预案附件列表分页对象
    dealCardList: [], // 处置卡信息
    orgAnnexList: [], // 组织机构信息
    emgcAnnex: [], // 应急流程信息
    dataType: '', // 数据类型
    materialCodeExist: false, // 物料编码是否存在
    functionMenus: [], // 页面功能权限
    emgcReportMenus: [], // 应急报告管理页面功能权限
    materialMenus: [], // 物料维护页面功能权限
    checkResult: false, // 检测特征在当前预案是否存在
  },
  effects: {
    // ok 获取分页
    *page(payload, { call, put }) {
      const response = yield call(planManagementInfoPage, payload.payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add(payload, { call, put }) {
      const response = yield call(addMajorInfo, payload.payload);
      const toggle = checkCode(response);
      const data = yield call(majorInfoPage, commonData.pageInitial);
      yield put({
        type: 'save',
        payload: data,
        toggle,
      });
    },
    *delete({ payload }, { call }) {
      const response = yield call(deletePlanManagementInfo, payload);
      checkCode(response);
    },
    *update(payload, { call, put }) {
      const response = yield call(updateMajorrInfo, payload.payload);
      const toggle = checkCode(response);
      const data = yield call(majorInfoPage, commonData.pageInitial);
      yield put({
        type: 'save',
        payload: data,
        toggle,
      });
    },
    *queryMajorContent(_, { call, put }) {
      const list = yield call(majorInfoPageList);
      yield put({
        type: 'saveList',
        payload: list,
      });
    },
    // 获取基本信息 11
    *getPlanInfo(payload, { call, put }) {
      const data = yield call(getPlanInfo, payload.payload);
      yield put({
        type: 'savePlanInfo',
        payload: data.data,
      });
    },
    // 获取预案事件特征 11
    *getEventFeatures(payload, { call, put }) {
      const data = yield call(getEventFeatures, payload.payload);
      yield put({
        type: 'saveEventFeatures',
        payload: data.data,
      });
    },
    // 获取预案资源接口 11
    *getResourceContent(payload, { call, put }) {
      const data = yield call(getResourceContent, payload.payload);
      yield put({
        type: 'saveResourceContent',
        payload: data.data,
      });
    },
    // 获取已有的特征
    *getFeaturePlan(payload, { call, put }) {
      const data = yield call(getFeaturePlan);
      yield put({
        type: 'saveFeaturePlan',
        payload: data.data,
      });
    },
    // add保存预案基本信息
    *addPlanInfo({ payload }, { call, put }) {
      const response = yield call(addPlanInfo, payload);
      const info = yield call(getPlanInfo, { id: response.data });
      checkCode(info);
      yield put({
        type: 'savePlanInfo',
        payload: info.data,
      });
    },
    // update保存预案基本信息
    *updatePlanInfo({ payload }, { call, put }) {
      const response = yield call(updatePlanInfo, payload);
      const toggle = checkCode(response);
      const data = yield call(getPlanInfo, { id: payload.planInfoID });
      yield put({
        type: 'savePlanInfo',
        payload: data.data,
      });
    },
    // 筛选预案编码
    *selectPlanCode({ payload }, { call, put }) {
      const response = yield call(selectPlanCode, payload);
      yield put({
        type: 'saveSelectPlanCode',
        payload: response.data,
      });
    },
    // 新增事件特征  修改事件特征  删除事件特征  查询单个事件特征
    *addFeaturePlan(payload, { call, put }) {
      const data = yield call(addFeaturePlan, payload.payload);
      const toggle = checkCode(data);
      const response = yield call(getEventFeatures, { planInfoID: payload.payload.planInfoID });
      yield put({
        type: 'saveEventFeatures',
        payload: response.data,
      });
    },
    *updateFeaturePlan(payload, { call, put }) {
      const data = yield call(updateFeaturePlan, payload.payload);
      checkCode(data);
      const response = yield call(getEventFeatures, { planInfoID: payload.payload.planInfoID });
      yield put({
        type: 'saveEventFeatures',
        payload: response.data,
      });
    },
    *delFeaturePlan(payload, { call, put }) {
      const data = yield call(delFeaturePlan, {
        panRedirectFeatureID: payload.payload.panRedirectFeatureID,
        isDelete: payload.payload.isDelete,
      });
      const toggle = checkCode(data);
      const response = yield call(getEventFeatures, { planInfoID: payload.payload.planInfoID });
      yield put({
        type: 'saveEventFeatures',
        payload: response.data,
      });
    },
    *getEventFeaturePlan(payload, { call, put }) {
      const data = yield call(getEventFeaturePlan, payload.payload);
      yield put({
        type: 'saveEventFeaturePlan',
        payload: data.data,
      });
    },
    // 编制部门就是发布机构
    *getPublisher(payload, { call, put }) {
      const response = yield call(getPublisher);
      const arr = response.data.map((org) => {
        org.id = org.orgnizationCode;
        org.pId = org.parentOrgnization;
        org.rootPId = null;
        return org;
      });
      yield put({
        type: 'savePublisher',
        payload: arr,
      });
    },
    *selectByTypeParent(payload, { call, put }) {
      const feature = yield call(selectByTypeParent, 557);
      const event = yield call(selectByTypeParent, 556);
      yield put({
        type: 'saveSelectByTypeParent',
        payload: {
          feature: feature.data,
          event: event.data,
        },
      });
    },
    *planLevelData(payload, { call, put }) {
      const response = yield call(planLevel);
      yield put({
        type: 'savePlanLevel',
        payload: response.data,
      });
    },
    *preplanType(payload, { call, put }) {
      const response = yield call(selectByTypeParent, 558);
      yield put({
        type: 'savePreplanType',
        payload: response.data,
      });
    },

    // 新增指令
    *addPlanCommand({ payload }, { call }) {
      const response = yield call(addPlanCommand, payload);
      checkCode(response);
    },
    // 删除指令
    *deletePlanCommand({ payload }, { call }) {
      const response = yield call(deletePlanCommand, payload);
      checkCode(response);
    },
    // 修改指令
    *updatePlanCommand({ payload }, { call, put }) {
      const response = yield call(updatePlanCommand, payload);
      checkCode(response);
    },
    // 获取单个指令
    *findPlanCommand({ payload }, { call, put }) {
      const response = yield call(findPlanCommand, payload);
      const obj = response.data[0] || {};
      obj.executePostion = [];
      if (obj.excutePostionList) {
        obj.excutePostionList.forEach((position) => {
          if (position) {
            obj.executePostion.push(position.orgPostionID);
          }
        });
      }
      yield put({
        type: 'savePlanCommandInfo',
        payload: obj,
      });
    },
    // 获取分页指令
    *planCommandPage({ payload }, { call, put }) {
      const response = yield call(planCommandPage, payload);
      yield put({
        type: 'savePlanCommandPage',
        payload: response.data,
      });
    },
    // 查询预案的指令
    *getPlanCommand({ payload }, { call, put }) {
      const res = yield call(getPlanCommand, payload);
      yield put({
        type: 'savePlanCommand',
        payload: res.data,
      });
    },
    //  模糊查询指令接收人列表
    *planExecutePosition({ payload }, { call, put }) {
      const response = yield call(planExecutePosition, payload);
      yield put({
        type: 'savePlanExecutePosition',
        payload: response.data,
      });
    },
    //  获取流程几点信息
    *getFlowNodeList({ payload }, { call, put }) {
      const response = yield call(getFlowList, payload);
      yield put({
        type: 'saveFlowNodeList',
        payload: response.data,
      });
    },
    // 查询预案的应急资源
    *getPlanResource({ payload }, { call, put }) {
      const res = yield call(getPlanResource, payload);
      yield put({
        type: 'savePlanResource',
        payload: res.data,
      });
    },
    //  get获取应急资源信息
    *getResourceInfo({ payload }, { call, put }) {
      const response = yield call(findPlanResource, payload);
      yield put({
        type: 'saveResourceInfo',
        payload: response.data,
      });
    },
    //  预案维护 新增预案资源
    *addPlanResource({ payload }, { call }) {
      const response = yield call(addPlanResource, payload);
      checkCode(response);
    },
    //  预案维护 修改预案资源
    *updatePlanResource({ payload }, { call }) {
      const response = yield call(updatePlanResource, payload);
      checkCode(response);
    },
    //  删除预案某个应急资源
    *deleteResourceInfo({ payload }, { call }) {
      const response = yield call(deletePlanResourceInfo, payload);
      checkCode(response);
    },
    //  物料维护 新增
    *materialAdd({ payload }, { call }) {
      const response = yield call(materialAdd, payload);
      checkCode(response);
    },
    //  物料维护 删除
    *materialDelete({ payload }, { call }) {
      const response = yield call(materialDelete, payload);
      checkCode(response);
    },
    //  物料维护 get
    *materialGet({ payload }, { call, put }) {
      const response = yield call(materialGet, payload);
      yield put({
        type: 'saveMaterialInfo',
        payload: response.data,
      });
    },
    //  物料维护 update
    *materialUpdate({ payload }, { call }) {
      const response = yield call(materialUpdate, payload);
      checkCode(response);
    },
    //  物料维护 page
    *materialPage({ payload }, { call, put }) {
      const response = yield call(materialPage, payload);
      yield put({
        type: 'saveMaterialPage',
        payload: response,
      });
    },
    // 应急报告列表
    *emgcReportPage({ payload }, { call, put }) {
      const response = yield call(emgcReportPage, payload);
      yield put({
        type: 'saveEmgcReportPage',
        payload: response,
      });
    },
    // 应急报告下载
    *exportReport({ payload }, { call, put }) {
      yield call(exportReport, payload);
    },
    //  扩大应急 编辑实时方案 选择实施方案
    *getIfFromPlan({ payload }, { call, put }) {
      const response = yield call(ifFromPlan, payload);
      yield put({
        type: 'saveIfFromPlan',
        payload: response.data,
      });
    },
    //  获取指令状态列表
    *getCommandStatus({ payload }, { call, put }) {
      const response = yield call(getCommandStatusList, payload);
      yield put({
        type: 'saveCommandStatus',
        payload: response,
      });
    },
    //  预案管理 获取附件列表
    *getAnnexPage({ payload }, { call, put }) {
      const response = yield call(getPlanAnnexPage, payload);
      yield put({
        type: 'saveAnnexPage',
        payload: response.data,
      });
    },
    //  预案管理 删除附件
    *deleteAnnex({ payload }, { call }) {
      const response = yield call(deletePlanAnnex, payload);
      checkCode(response);
    },
    //  获取处置卡信息
    *getDealCard({ payload }, { call, put }) {
      const response = yield call(getDealCard, payload);
      yield put({
        type: 'saveDealCard',
        payload: response.data,
      });
    },
    //  获取组织结构信息
    *getOrgAnnex({ payload }, { call, put }) {
      const response = yield call(getOrgImages, payload);
      yield put({
        type: 'saveOrgAnnex',
        payload: response.data,
      });
    },
    //  获取应急流程
    *getEmgcProcess({ payload }, { call, put }) {
      const response = yield call(getDealCard, payload);
      yield put({
        type: 'saveEmgcProcess',
        payload: response.data,
      });
    },
    //  改变预案状态
    *changePlanStatu({ payload }, { call }) {
      const response = yield call(changePlanStatu, payload);
      checkCode(response);
    },
    //  物料编码是否重复
    *materialCodeExist({ payload }, { call, put }) {
      const response = yield call(judgeMaterialCode, payload);
      yield put({
        type: 'saveMaterialCode',
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
    * getEmgcReportMenus({ payload }, { call, put }) {
      const res = yield call(getFunctionMenus, payload);
      yield put({
        type: 'saveEmgcReportMenus',
        payload: res.data,
      });
    },
    * getMaterialMenus({ payload }, { call, put }) {
      const res = yield call(getFunctionMenus, payload);
      yield put({
        type: 'saveMaterialMenus',
        payload: res.data,
      });
    },
    * checkFeature({ payload }, { call, put }) {
      const res = yield call(checkFeature, payload);
      yield put({
        type: 'saveResult',
        payload: res,
      });
    },
    * deleteOrgAnnex({ payload }, { call }) {
      const res = yield call(deleteOrgAnnex, payload);
      checkCode(res);
    },
  },

  reducers: {
    saveSelectPlanCode(state, { payload }) {
      return {
        ...state,
        planCodeToggle: payload,
      };
    },
    savePublisher(state, { payload }) {
      return {
        ...state,
        publisher: payload,
      };
    },
    savePreplanType(state, { payload }) {
      return {
        ...state,
        preplanType: payload,
      };
    },
    savePlanLevel(state, action) {
      return {
        ...state,
        planLevelData: action.payload,
      };
    },
    addIsDeleteData(state) {
      return {
        ...state,
        planBasicInfo: {},
        eventFeatures: [],
        resourceContent: [],
      };
    },
    saveSelectByTypeParent(state, action) {
      return {
        ...state,
        featureType: action.payload.feature,
        eventType: action.payload.event,
      };
    },
    saveEventFeaturePlan(state, action) {
      return {
        ...state,
        eventFeaturePlan: action.payload,
      };
    },
    saveFeaturePlan(state, action) {
      return {
        ...state,
        featurePlan: action.payload,
      };
    },
    saveResourceContent(state, action) {
      return {
        ...state,
        resourceContent: action.payload,
      };
    },
    saveEventFeatures(state, action) {
      return {
        ...state,
        eventFeatures: action.payload,
      };
    },
    savePlanInfo(state, action) {
      return {
        ...state,
        planBasicInfo: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        data: {
          data: action.payload.data.result,
          pagination: {
            current: action.payload.data.pageNum,
            pageSize: action.payload.data.pageSize,
            total: action.payload.data.sumCount,
          },
        },
        toggle: action.toggle,
      };
    },
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    savePlanCommandInfo(state, { payload }) {
      return {
        ...state,
        planCommandInfo: payload,
      };
    },
    savePlanCommandPage(state, { payload }) {
      return {
        ...state,
        planCommandPage: payload,
      };
    },
    // user(state, action) {
    //   return {
    //     ...state,
    //     user: action.payload,
    //   };
    // },
    savePlanCommand(state, { payload }) {
      return {
        ...state,
        planCommand: payload,
      };
    },
    savePlanExecutePosition(state, { payload }) {
      return {
        ...state,
        executePosition: payload,
      };
    },
    saveFlowNodeList(state, { payload }) {
      return {
        ...state,
        flowNodeList: payload,
      };
    },
    saveCheckedUser(state, { payload }) {
      return {
        ...state,
        checkedUser: payload,
      };
    },
    savePlanResource(state, { payload }) {
      return {
        ...state,
        planResource: {
          data: payload.result,
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          total: payload.sumCount,
        },
      };
    },
    saveResourceInfo(state, { payload }) {
      return {
        ...state,
        resourceInfo: payload,
      };
    },
    saveMaterialInfo(state, { payload }) {
      return {
        ...state,
        materialInfo: payload,
      };
    },
    saveMaterialPage(state, { payload }) {
      return {
        ...state,
        materialPage: {
          data: payload.data.result,
          pagination: {
            current: payload.data.pageNum,
            pageSize: payload.data.pageSize,
            total: payload.data.sumCount,
          },
        },
      };
    },
    saveEmgcReportPage(state, { payload }) {
      return {
        ...state,
        emgcReport: {
          data: payload.data.result,
          pagination: {
            current: payload.data.pageNum,
            pageSize: payload.data.pageSize,
            total: payload.data.sumCount,
          },
        },
      };
    },
    saveAnnexPage(state, { payload }) {
      return {
        ...state,
        annexPage: {
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          result: payload.result,
          total: payload.sumCount,
        },
      };
    },
    saveDealCard(state, { payload }) {
      return {
        ...state,
        dealCardList: payload,
      };
    },
    saveOrgAnnex(state, { payload }) {
      return {
        ...state,
        orgAnnexList: payload,
      };
    },
    saveEmgcProcess(state, { payload }) {
      return {
        ...state,
        emgcAnnex: payload,
      };
    },
    saveDataType(state, { payload }) {
      return {
        ...state,
        dataType: payload,
      };
    },
    saveMaterialCode(state, { payload }) {
      return {
        ...state,
        materialCodeExist: payload,
      };
    },
    saveFunctionMenus(state, { payload }) {
      return {
        ...state,
        functionMenus: payload,
      };
    },
    saveEmgcReportMenus(state, { payload }) {
      return {
        ...state,
        emgcReportMenus: payload,
      };
    },
    saveMaterialMenus(state, { payload }) {
      return {
        ...state,
        materialMenus: payload,
      };
    },
    saveResult(state, { payload }) {
      return {
        ...state,
        checkResult: payload,
      };
    },
  },
};
