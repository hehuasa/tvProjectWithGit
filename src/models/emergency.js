import { message } from 'antd';
import moment from 'moment';
import {
  getPlanList, queryInfoContent, seveEventContent, seveCasualties, queryEventEventInfo, getFeatures,
  getPlanCommand, getPlanResource, selectByCodeByCode, eventFeatures, delEventFeatures,
  queryEventFeatures,
  searchEventFeatures, copyPlan, getEventFeature, updateEventFeature, deleteEventFeature,
  getCommandInfo,
  updateCommandInfo, deleteCommandInfo, addCommandInfo, getResourceInfo, updateResourceInfo,
  deleteResourceInfo,
  updateProcessNode, addResourceInfo, getMaterialList, getAreaList, getCommandList,
  getPlanBaseInfo, getEmgcCommandByEventID, getEmgcResourceByEventID, getEmgcFeatureByEventID,
  alarmEvent,
  getPlanLevelList, getFlowNodeList, updateCommandStatus, selectByNodeType, clearPlan,
  updatePlanLevel,
  getOrgList, getOrgListByLevel, undoneEventList, getEventInfo, getFinishConditionList,
  getFlowNodeTemplateList,
  queryEventInfoReport, selectNodeType, emgcCommanderChange, emgcUserSignIn, selectExistCommand,
  emgcFinishConditionCheck, emgcFinishConditionUnCheck, getCheckedConditionList, getCommandReceiver,
  emgcReport,
  addHandAlarm, queryEventPosition, updateExecuteContent, updateExpandState, getExpandFeature,
  selectExpandState,
  commandModelList, getPlanInfoPage, selectByTypeParent, updateExpandLevel, expandSelectPlan,
  selectExecutePlanInfo, getPlanInfo, mergeAlarm, ifFromPlan, getCommandStatusList, annexPage,
  annexDelete, getPlanAnnexPage, getDealCard, getImplPicture, getExecuteList, resourcePage,
  materialPage, resMaterialPage,
  addFeature, getPlansByEventID, findUserPage, expandPlanPage, judgeAcceptUser, updateEmgcOrg,
  getFunctionMenus, historyEventPage, editAlarm, getImplOrgAnnex, getOrgImages,
} from '../services/api';
import { checkCode, formatDuring } from '../utils/utils';


export default {
  namespace: 'emergency',

  state: {
    eventId: window.localStorage.eventID, // 事件ID
    current: -1, // 用控制应急指挥现在所处的流程节点
    viewNode: -1, // 当前所查看的节点， 只能小于等于current
    tableId: null, // 打开标签页的id
    viewNodeType: '', // 当前节点的节点类型
    planInfoID: null, // 信息研判 选择的预案
    eventInfoReport: {}, // 信息接报 1
    infoContentList: {}, // 信息接报-事件特征，input框里面的数据（好像这个没用）
    infoRecordList: [], // 事件信息记录列表
    casualties: [], //  ,人员伤亡数据
    classificationList: [], // 查询特征分类
    eventFeaturesList: [], // 保存事件特征 1
    existEventFeaturesList: [], // 已有的事件特征
    pagination: {}, // 已有的事件特征分页
    personList: [], // 人员列表
    personPagination: {}, // 人员列表分页

    planList: [], // 预案列表
    planFeatures: [], // 预案事件特征
    planCommand: [], // 预案指令
    planResource: {
      data: [],
      pageNum: 1,
      pageSize: 10,
    }, // 预案应急资源
    eventFeature: {}, // 实施方案的事件特征
    commandInfo: {}, // 实施方案的某个指令信息
    resourceInfo: {}, // 实施方案的某个应急资源
    planBaseInfo: [], // 实施方案的预案基本信息
    emgcCommand: [], // 编辑实施方案  查询应急指令
    emgcResource: [], // 编辑实施方案  查询应急资源
    emgcFeature: [], // 编辑实施方案  查询事件特征
    planLevelList: [], // 预案等级列表
    flowNodeList: [], // 流程节点列表 生成预案后
    resMaterialPage: {}, // 应急资源选择的 物资列表
    resourcePage: {
      data: [],
      pagination: {},
    }, // 应急资源选择的 资源分页
    areaList: [], // 应急资源选择的 区域列表
    commandList: [], // 根据事件ID获取指令列表
    commandModel: [], // 码表获取指令分类列表
    isInsert: false, // 控制显示执行列表还是指令插入
    undoneEventList: [], // 未完成的事件列表
    // undoneEventPagination: {}, // 未完成的事件列表list分页
    orgUserList: {}, // 组织机构下的热应急人员分页信息
    emgcOrgList: [], // 通过应急等级获取机构列表
    eventInfo: {}, // 事件信息
    eventLevel: '', // 事件响应等级
    emgcOrgID: '', // 事件应急机构
    finishConditionList: [], // 应急终止条件
    flowNodeTemplateList: [], // 流程节点模板列表 用于显示应急指挥头部流程
    flowExcuteInfo: {}, // 根据事件ID获取流程执行情况（当前执行到那个节点了）
    existCommandPage: {}, // 已有指令 的分页信息
    expandCurrent: 3, // 扩大应急的当前流程节点
    checkedConditionList: [], // 已勾选的条件
    commandReceiver: [], // 指令接收人列表
    eventPosition: 0, // 是否可用信息处置与研判
    expandFeatureList: [], // 扩大应急阶段事件特征列表
    allCommandModelList: [], // 所有指令分类
    planInfoPage: {}, // 预案列表 分页信息
    planTypeList: [], // 预案类别列表 码表558
    checkedUser: [], // 指令选择的人员
    // 扩大应急
    executePlans: [], // 扩大应急 编辑实时方案 所有方案列表
    eventExecPlanID: '', // 选中的预案
    planInfo: {}, // 单个预案信息
    isFromPlan: false, // 实时方案是否来自预案
    commandStatus: {}, // 指令操作状态列表 需要循环对象
    disposalActiveKey: '2', // 应急处置的当前激活页签key
    annexPage: {
      pageNum: 1,
      // 每页显示条数
      pageSize: 5,
      result: [],
    }, // 实施方案附件列表分页对象
    planAnnexPage: {
      pageNum: 1,
      // 每页显示条数
      pageSize: 5,
      result: [],
    }, // 预案附件列表分页对象
    dealCardList: [], // 预案 处置卡信息
    orgAnnexList: [], // 预案 组织机构信息
    emgcAnnex: [], // 预案 应急流程信息
    implDealCardList: [], // 实施方案 处置卡信息
    implOrgAnnexList: [], // 实施方案 组织机构信息
    implEmgcAnnex: [], // 实施方案 应急流程信息
    executeList: [], // 实施方案列表
    eventPlanList: [], // 某事件已关联的预案信息
    templatePlanID: [], // 信息研判阶段设为模板的预案ID
    selectedRowKeys: [], // 信息研判选中的预案
    expandPlanPage: {
      result: [],
    }, // 扩大应急阶段的预案列表
    acceptUser: [], // 指令接收人 type：0 在白名单 1：不在白名单
    functionMenus: [], // 未处理事件列表个功能权限
    processFuncMenus: [], // 页面功能权限
    historyEventPage: { data: [], pagination: {} }, // 历史应急事件
    historyDrillPage: { data: [], pagination: {} }, // 历史演练事件
  },

  effects: {
    * getPlanList({ payload }, { call, put }) {
      const response = yield call(getPlanList, payload);
      yield put({
        type: 'savePlanList',
        payload: response.data,
      });
    },
    // 查询所有信息接报
    * queryInfoContent({ payload }, { call, put }) {
      const response = yield call(queryInfoContent);
      yield put({
        type: 'infoContentList',
        payload: response.data[0],
      });
    },

    // 保存伤亡人数 www
    *saveCasualties({ payload }, { call, put }) {
      yield call(seveCasualties, payload);
      const data = yield call(queryEventFeatures, {
        eventID: payload.eventID,
      });
      const eventData = yield call(queryEventEventInfo, {
        eventID: payload.eventID,
      });
      yield put({
        type: 'saveCasualtiesList',
        payload: {
          data: data.data,
          eventData: eventData.data,
        },
      });
    },
    // 保存事件内容
    *seveEventContent({ payload }, { call, put }) {
      yield call(seveEventContent, payload);
      const data = yield call(queryEventEventInfo, {
        eventID: payload.eventID,
      });
      const infoData = yield call(queryEventFeatures, {
        eventID: payload.eventID,
      });

      yield put({
        type: 'eventInfoRecordList',
        payload: {
          data: data.data,
          infoData: infoData.data.eventFeatureList,
        },
      });
      // queryEventFeatures
    },
    // 查询事件信息记录内容
    *queryEventInfo({ payload }, { call, put }) {
      const data = yield call(queryEventFeatures, payload);
      const eventData = yield call(queryEventEventInfo, payload);
      yield put({
        type: 'saveCasualtiesList',
        payload: {
          data: data.data,
          eventData: eventData.data,
        },
      });
      // const data = yield call(queryEventEventInfo, payload);
      // yield put({
      //   type: 'eventInfoRecordList',
      //   payload: data.data,
      // });
    },


    // 查询预案的事件特征
    *getFeatures({ payload }, { call, put }) {
      const res = yield call(getFeatures, payload);
      yield put({
        type: 'savePlanFeatures',
        payload: res.data,
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
    // 查询预案的应急资源
    *getPlanResource({ payload }, { call, put }) {
      const res = yield call(getPlanResource, payload);
      yield put({
        type: 'savePlanResource',
        payload: res.data,
      });
    },
    // 查询特征分类
    *queryClassification({ payload }, { call, put }) {
      const res = yield call(selectByTypeParent, payload);
      yield put({
        type: 'classificationList',
        payload: res.data,
      });
    },
    // 保存新增事件特征内容
    *seveEventFeatures({ payload }, { call, put }) {
      yield call(eventFeatures, payload);
      const res = yield call(queryEventFeatures, { eventID: payload.eventID });
      yield put({
        type: 'eventFeaturesList',
        payload: res.data.eventFeatureList,
      });
    },

    // add事件特征
    *addFeature({ payload }, { call, put }) {
      const response = yield call(addFeature, payload);
      checkCode(response);
      const res = yield call(queryEventFeatures, { eventID: payload.eventID });
      yield put({
        type: 'eventFeaturesList',
        payload: res.data.eventFeatureList,
      });
    },
    // 删除事件特征
    *delEventFeatures({ payload }, { call, put }) {
      yield call(delEventFeatures, { id: payload.id });
      const res = yield call(queryEventFeatures, { eventID: payload.eventID });
      yield put({
        type: 'eventFeaturesList',
        payload: res.data.eventFeatureList,
      });
    },
    // 信息接报，input框里面的数据
    *queryEventFeatures({ payload }, { call, put }) {
      const res = yield call(queryEventFeatures, payload);
      yield put({
        type: 'saveEventInfoReport',
        payload: res.data,
      });
      yield put({
        type: 'eventFeaturesList',
        payload: res.data.eventFeatureList,
      });
    },
    // 搜索事件特征
    *searchEventFeatures({ payload }, { call, put }) {
      const res = yield call(searchEventFeatures, payload);
      yield put({
        type: 'saveSearchEventFeatures',
        payload: res.data,
      });
    },
    // 拷贝预案作为实施方案模板
    *copyPlan({ payload }, { call, put }) {
      const response = yield call(copyPlan, payload);
      checkCode(response);
    },
    // 拷贝预案作为实施方案模板
    *copyEmptyPlan({ payload }, { call }) {
      yield call(copyPlan, payload);
    },
    //  获取实施方案单个事件特征
    *getEventFeature({ payload }, { call, put }) {
      const response = yield call(getEventFeature, payload);
      yield put({
        type: 'saveEventFeature',
        payload: response.data,
      });
    },
    //  修改实施方案单个事件特征
    *updateEventFeature({ payload }, { call, put }) {
      yield call(updateEventFeature, payload);
    },
    //  删除实施方案单个事件特征
    *deleteEventFeature({ payload }, { call, put }) {
      yield call(deleteEventFeature, payload);
    },
    //  获取实施方案单个指令信息
    *getCommandInfo({ payload }, { call, put }) {
      const response = yield call(getCommandInfo, payload);
      const obj = response.data[0] || {};
      obj.executePostion = [];
      obj.executeUser.forEach((user) => {
        obj.executePostion.push(user.userID);
      });
      yield put({
        type: 'saveCommandInfo',
        payload: obj,
      });
    },
    //  修改实施方案单个指令信息
    *updateCommandInfo({ payload }, { call }) {
      yield call(updateCommandInfo, payload);
    },
    //  删除实施方案单个指令信息
    *deleteCommandInfo({ payload }, { call }) {
      yield call(deleteCommandInfo, payload);
    },
    //  增加实施方案单个指令信息
    *addCommandInfo({ payload }, { call }) {
      yield call(addCommandInfo, payload);
    },
    //  获取实施方案单个应急资源
    *getResourceInfo({ payload }, { call, put }) {
      const response = yield call(getResourceInfo, payload);
      yield put({
        type: 'saveResourceInfo',
        payload: response.data,
      });
    },
    //  修改实施方案单个应急资源
    *updateResourceInfo({ payload }, { call, put }) {
      yield call(updateResourceInfo, payload);
    },
    //  删除实施方案单个应急资源
    *deleteResourceInfo({ payload }, { call, put }) {
      yield call(deleteResourceInfo, payload);
    },
    // 增加实施方案单个应急资源
    *addResourceInfo({ payload }, { call, put }) {
      yield call(addResourceInfo, payload);
    },
    //  进入流程下一个节点
    *updateProcessNode({ payload }, { call, put }) {
      yield call(updateProcessNode, payload);
    },
    //  根据事件ID 查询基本信息
    *getPlanBaseInfo({ payload }, { call, put }) {
      const response = yield call(getPlanBaseInfo, payload);
      yield put({
        type: 'savePlanBaseInfo',
        payload: response.data,
      });
    },
    //  根据事件ID 应急指令
    *getEmgcCommandByEventID({ payload }, { call, put }) {
      const response = yield call(getEmgcCommandByEventID, payload);
      yield put({
        type: 'saveEmgcCommandByEventID',
        payload: response.data,
      });
    },
    //  根据事件ID 应急资源
    * getEmgcResourceByEventID({ payload }, { call, put }) {
      const response = yield call(getEmgcResourceByEventID, payload);
      yield put({
        type: 'saveEmgcResourceByEventID',
        payload: response.data,
      });
    },
    //  根据事件ID 事件特征
    * getEmgcFeatureByEventID({ payload }, { call, put }) {
      const response = yield call(getEmgcFeatureByEventID, payload);
      yield put({
        type: 'saveEmgcFeature',
        payload: response.data,
      });
    },
    //  自动报警
    * getAlarmEvent({ payload }, { call }) {
      yield call(alarmEvent, payload);
    },
    // 获取预案等级list
    * getPlanLevelList({ payload }, { call, put }) {
      const response = yield call(getPlanLevelList, payload);
      yield put({
        type: 'savePlanLevelList',
        payload: response.data,
      });
    },
    // 获取流程节点list
    * getFlowNodeList({ payload }, { call, put }) {
      const response = yield call(getFlowNodeList, payload);
      yield put({
        type: 'saveFlowNodeList',
        payload: response.data,
      });
    },
    // 模糊查询物资列表
    * getMaterialList({ payload }, { call, put }) {
      const response = yield call(getMaterialList, payload);
      yield put({
        type: 'saveMaterialList',
        payload: response.data,
      });
    },
    // 物资分页
    *resMaterialPage({ payload }, { call, put }) {
      const response = yield call(resMaterialPage, payload);
      const data = {
        data: response.data.result,
        pagination: {
          current: response.data.pageNum,
          pageSize: response.data.pageSize,
          total: response.data.sumCount,
        },
      };
      yield put({
        type: 'saveResMaterialPage',
        payload: data,
      });
    },
    // 查询资源分页信息
    *resourcePage({ payload }, { call, put }) {
      const response = yield call(resourcePage, payload);
      const data = {
        data: response.data.result,
        pagination: {
          current: response.data.pageNum,
          pageSize: response.data.pageSize,
          total: response.data.sumCount,
        },
      };
      yield put({
        type: 'saveResourcePage',
        payload: data,
      });
    },
    * getAreaList({ payload }, { call, put }) {
      const response = yield call(getAreaList, payload);
      yield put({
        type: 'saveAreaList',
        payload: response.data,
      });
    },
    // 根据事件ID获取指令列表
    * getCommandList({ payload }, { call, put }) {
      const response = yield call(getCommandList, payload);
      yield put({
        type: 'saveCommandList',
        payload: response.data,
      });
    },
    // 修改指令执行状态
    * updateCommandStatus({ payload }, { call, put }) {
      yield call(updateCommandStatus, payload);
    },
    // 获取指令分类列表
    * getCommandModelList({ payload }, { call, put }) {
      const response = yield call(selectByNodeType, payload);
      yield put({
        type: 'saveCommandModelList',
        payload: response.data,
      });
    },
    // 根据事件ID 清空实时方案
    * clearPlan({ payload }, { call, put }) {
      yield call(clearPlan, payload);
    },
    // 修改实施方案的等级和机构
    * updatePlanLevel({ payload }, { call, put }) {
      yield call(updatePlanLevel, payload);
    },
    // 获取未完成的事件list
    * undoneEventList({ payload }, { call, put }) {
      const response = yield call(undoneEventList, payload);
      yield put({
        type: 'saveUndoneEventList',
        payload: response.data.filter(item => item.isDrill !== 1),
      });
    },
    // 获取未完成的演练list
    * undoneDrillList({ payload }, { call, put }) {
      const response = yield call(undoneEventList, payload);
      yield put({
        type: 'saveUndoneEventList',
        payload: response.data.filter(item => item.isDrill === 1),
      });
    },
    // 获取应急组织机构人员
    * getOrgList({ payload }, { call, put }) {
      const response = yield call(getOrgList, payload);
      yield put({
        type: 'saveOrgList',
        payload: response.data,
      });
    },
    // 通过应急等级获取组织结构列表
    * getOrgListByLevel({ payload }, { call, put }) {
      const response = yield call(getOrgListByLevel, payload);
      yield put({
        type: 'saveEmgcOrgList',
        payload: response.data,
      });
    },
    // 根据事件ID 获取事件信息
    * getEventInfo({ payload }, { call, put }) {
      const response = yield call(getEventInfo, payload);
      yield put({
        type: 'saveEventInfo',
        payload: response.data[0] || {},
      });
    },
    // 获取事事件结束条件
    * getFinishConditionList({ payload }, { call, put }) {
      const response = yield call(getFinishConditionList, payload);
      yield put({
        type: 'saveConditionList',
        payload: response.data,
      });
    },
    // 获取流程节点的模板列表
    * getFlowNodeTemplateList({ payload }, { call, put }) {
      const response = yield call(getFlowNodeTemplateList, payload);
      yield put({
        type: 'saveFlowNodeTemplateList',
        payload: response.data,
      });
    },
    // 获取单个事件信息
    * getFlowExcuteInfo({ payload }, { call, put }) {
      const response = yield call(queryEventInfoReport, payload);
      yield put({
        type: 'saveFlowExcuteInfo',
        payload: response.data,
      });
    },
    // 根据当前事件状态获取节点类型
    * selectNodeType({ payload }, { call, put }) {
      const response = yield call(selectNodeType, payload);
      yield put({
        type: 'saveViewNodeType',
        payload: response.data,
      });
    },
    // 签到
    * emgcUserSignIn({ payload }, { call }) {
      const response = yield call(emgcUserSignIn, payload);
      checkCode(response);
    },
    // 设为总指挥
    * emgcCommanderChange({ payload }, { call }) {
      const response = yield call(emgcCommanderChange, payload);
      checkCode(response);
    },
    // 查询已有指令
    * selectExistCommand({ payload }, { call, put }) {
      const response = yield call(selectExistCommand, payload);
      yield put({
        type: 'saveExistCommand',
        payload: response.data,
      });
    },
    //  应急终止条件的勾选
    * emgcFinishConditionCheck({ payload }, { call }) {
      yield call(emgcFinishConditionCheck, payload);
    },
    //  应急终止条件的去掉勾选
    * emgcFinishConditionUnCheck({ payload }, { call }) {
      yield call(emgcFinishConditionUnCheck, payload);
    },
    //  应急终止 已勾选的条件
    * getCheckedConditionList({ payload }, { call, put }) {
      const response = yield call(getCheckedConditionList, payload);
      yield put({
        type: 'saveCheckedConditionList',
        payload: response.data,
      });
    },
    //  模糊查询指令接收人列表
    * getCommandReceiverList({ payload }, { call, put }) {
      const response = yield call(getCommandReceiver, payload);
      yield put({
        type: 'saveCommandReceiver',
        payload: response.data,
      });
    },
    // 生成应急报告
    *saveEmgcReport({ payload }, { call, put }) {
      const response = yield call(emgcReport, payload);
      if (response.data === 1) {
        message.success('成功生成应急报告');
      } else if (response.data === 2) {
        message.success('已生成应急报告，数据保存成功');
      } else {
        message.success('生成应急报告失败');
      }
      const data = yield call(queryEventFeatures, {
        eventID: payload.eventID,
      });
      const eventData = yield call(queryEventEventInfo, {
        eventID: payload.eventID,
      });
      yield put({
        type: 'saveEventPositionData',
        payload: {
          stage: response.data,
          data: data.data,
          eventData: eventData.data,
        },
      });
    },
    // 保存手动报警
    *addHandAlarm({ payload }, { call, put }) {
      const response = yield call(addHandAlarm, payload);
    },
    // 获取报警时间
    *continueTime({ payload }, { call, put }) {
      // payload.continueTime = formatDuring(moment().valueOf(), payload.eventTime);
      yield put({
        type: 'saveEventInfoReportTime',
        payload,
      });
    },
    // 查询事件阶段
    *queryEventPosition({ payload }, { call, put }) {
      const response = yield call(queryEventPosition, payload);
      yield put({
        type: 'saveEventPosition',
        payload: response.data,
      });
    },
    // 修改指令执行情况 指令列表的文本输入
    *updateExecuteContent({ payload }, { call }) {
      yield call(updateExecuteContent, payload);
      message.success('操作成功');
    },
    // 搜索全部人员
    *searchPersonInfo({ payload }, { call, put }) {
      const response = yield call(findUserPage, payload);
      yield put({
        type: 'saveSearchPerson',
        payload: response.data,
      });
    },
    //  扩大应急状态更改
    *updateExpandState({ payload }, { call }) {
      yield call(updateExpandState, payload);
    },
    //  扩大应急阶段的事件特征列表
    *getExpandFeature({ payload }, { call, put }) {
      const response = yield call(getExpandFeature, payload);
      yield put({
        type: 'saveExpandFeature',
        payload: response.data,
      });
    },
    //  获取扩大应急所处的状态
    *selectExpandState({ payload }, { call, put }) {
      const response = yield call(selectExpandState, payload);
      yield put({
        type: 'saveExpandCurrent',
        payload: response.data,
      });
    },
    //  获取所有指令分类列表
    *allCommandModelList({ payload }, { call, put }) {
      const response = yield call(commandModelList, payload);
      yield put({
        type: 'saveAllCommandModelList',
        payload: response.data,
      });
    },
    //  获取预案分页列表
    *getPlanInfoPage({ payload }, { call, put }) {
      const response = yield call(getPlanInfoPage, payload);
      yield put({
        type: 'savePlanInfoPage',
        payload: response.data,
      });
    },
    //  获取预案类别 码表
    *getPlanTypeList({ payload }, { call, put }) {
      const response = yield call(selectByTypeParent, payload);
      yield put({
        type: 'savePlanTypeList',
        payload: response.data,
      });
    },
    //  更新事件等级
    *updateExpandLevel({ payload }, { call }) {
      yield call(updateExpandLevel, payload);
    },
    //  保存扩大应急选择的预案信息
    *expandSelectPlan({ payload }, { call }) {
      yield call(expandSelectPlan, payload);
    },
    //  扩大应急 编辑实时方案 选择实施方案
    *selectExecutePlanInfo({ payload }, { call, put }) {
      const response = yield call(selectExecutePlanInfo, payload);
      yield put({
        type: 'saveExecutePlan',
        payload: response.data,
      });
      yield put({
        type: 'saveEventExecPlanID',
        payload: response.data[0] ? response.data[0].eventExecPlanID : null,
      });
    },
    //  扩大应急 编辑实时方案 选择实施方案
    *getPlanInfo({ payload }, { call, put }) {
      const response = yield call(getPlanInfo, payload);
      yield put({
        type: 'savePlanInfo',
        payload: response.data,
      });
    },
    //  编辑实时方案 获取附件列表
    *getAnnexPage({ payload }, { call, put }) {
      const response = yield call(annexPage, payload);
      yield put({
        type: 'saveAnnexPage',
        payload: response.data,
      });
    },
    //  编辑实时方案 删除附件
    *deleteAnnex({ payload }, { call }) {
      const response = yield call(annexDelete, payload);
      checkCode(response);
    },
    // 获取预案附件列表
    *getPlanAnnexPage({ payload }, { call, put }) {
      const response = yield call(getPlanAnnexPage, payload);
      yield put({
        type: 'savePlanAnnexPage',
        payload: response.data,
      });
    },
    // 报警归并
    *mergeAlarm({ payload }, { call, put }) {
      const response = yield call(mergeAlarm, payload);
      console.log('报警归并', response);
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
        payload: response.data,
      });
    },
    //  获取预案处置卡信息
    *getDealCard({ payload }, { call, put }) {
      const response = yield call(getDealCard, payload);
      yield put({
        type: 'saveDealCard',
        payload: response.data,
      });
    },
    //  获取预案组织结构信息
    *getOrgAnnex({ payload }, { call, put }) {
      const response = yield call(getOrgImages, payload);
      yield put({
        type: 'saveOrgAnnex',
        payload: response.data,
      });
    },
    //  获取预案应急流程
    *getEmgcProcess({ payload }, { call, put }) {
      const response = yield call(getDealCard, payload);
      yield put({
        type: 'saveEmgcProcess',
        payload: response.data,
      });
    },
    //  获取方案处置卡信息
    *getImplDealCard({ payload }, { call, put }) {
      const response = yield call(getImplPicture, payload);
      yield put({
        type: 'saveImplDealCard',
        payload: response.data,
      });
    },
    //  获取方案组织结构信息
    *getImplOrgAnnex({ payload }, { call, put }) {
      const response = yield call(getImplOrgAnnex, payload);
      yield put({
        type: 'saveImplOrgAnnex',
        payload: response.data,
      });
    },
    //  获取方案应急流程
    *getImplEmgcProcess({ payload }, { call, put }) {
      const response = yield call(getImplPicture, payload);
      yield put({
        type: 'saveImplEmgcProcess',
        payload: response.data,
      });
    },
    //  请求实时方案列表
    *getExecuteList({ payload }, { call, put }) {
      const response = yield call(getExecuteList, payload);
      yield put({
        type: 'saveExecuteList',
        payload: response.data,
      });
    },
    //  扩大应急的方案列表
    *getExpandPlanPage({ payload }, { call, put }) {
      const response = yield call(getPlanInfoPage, payload);
      yield put({
        type: 'saveExpandPlanPage',
        payload: response.data,
      });
    },
    //  通过事件ID获取事件关联的所有预案信息
    *getPlansByEventID({ payload }, { call, put }) {
      const response = yield call(getPlansByEventID, payload);
      yield put({
        type: 'saveEventPlanList',
        payload: response.data,
      });
      yield put({
        type: 'saveTemplatePlanID',
        payload: response.data.map(obj => obj.planInfoID),
      });
    },
    //  判断指令接收人那些在白名单
    *judgeAcceptUser({ payload }, { call, put }) {
      const response = yield call(judgeAcceptUser, payload);
      yield put({
        type: 'saveAcceptUser',
        payload: response.data,
      });
    },
    //  判断指令接收人那些在白名单
    *updateEmgcOrg({ payload }, { call, put }) {
      const response = yield call(updateEmgcOrg, payload);
      checkCode(response);
    },
    // 请求未处理事件列表的功能权限
    * getFunctionMenus({ payload }, { call, put }) {
      const res = yield call(getFunctionMenus, payload);
      yield put({
        type: 'saveFunctionMenus',
        payload: res.data,
      });
    },
    // 请求事件执行过程的功能权限
    * getProcessFuncMenus({ payload }, { call, put }) {
      const res = yield call(getFunctionMenus, payload);
      yield put({
        type: 'saveProcessFuncMenus',
        payload: res.data,
      });
    },
    // 请求历史应急事件
    * historyEventPage({ payload }, { call, put }) {
      const res = yield call(historyEventPage, payload);
      yield put({
        type: 'saveEventPage',
        payload: res.data,
      });
    },
    // 请求历史演练事件
    * historyDrillPage({ payload }, { call, put }) {
      const res = yield call(historyEventPage, payload);
      yield put({
        type: 'saveDrillPage',
        payload: res.data,
      });
    },
    // 请求历史演练事件
    * editAlarm({ payload }, { call, put }) {
      const res = yield call(editAlarm, payload);
    },

  },
  reducers: {
    saveEventPositionData(state, { payload }) {
      return {
        ...state,
        casualties: payload.data.alarmEventCasualtyInfoVOS,
        infoRecordList: payload.eventData,
        eventPosition: payload.stage,
      };
    },
    saveCasualtiesList(state, { payload }) {
      return {
        ...state,
        casualties: payload.data.alarmEventCasualtyInfoVOS,
        infoRecordList: payload.eventData,
      };
    },
    saveSearchPerson(state, { payload }) {
      return {
        ...state,
        personList: payload.result,
        personPagination: {
          current: payload.pageNum,
          pageSize: payload.pageSize,
          total: payload.sumCount,
        },
      };
    },
    saveEventInfoReport(state, { payload }) {
      return {
        ...state,
        eventInfoReport: payload,
        casualties: payload.alarmEventCasualtyInfoVOS,
      };
    },
    saveEventInfoReportTime(state, { payload }) {
      return {
        ...state,
        eventInfoReport: payload,
      };
    },
    infoContentList(state, { payload }) {
      return {
        ...state,
        infoContentList: payload,
      };
    },
    saveCurrent(state, { payload }) {
      return {
        ...state,
        current: payload,
      };
    },
    saveViewNode(state, { payload }) {
      return {
        ...state,
        viewNode: payload,
      };
    },
    savePlanList(state, { payload }) {
      return {
        ...state,
        planList: payload,
      };
    },
    eventInfoRecordList(state, { payload }) {
      return {
        ...state,
        infoRecordList: payload.data,
        eventFeaturesList: payload.infoData,
      };
    },
    savePlanID(state, { payload }) {
      return {
        ...state,
        planInfoID: payload,
      };
    },
    savePlanFeatures(state, { payload }) {
      return {
        ...state,
        planFeatures: payload,
      };
    },
    savePlanCommand(state, { payload }) {
      return {
        ...state,
        planCommand: payload,
      };
    },
    savePlanResource(state, { payload }) {
      return {
        ...state,
        planResource: {
          pageNum: payload.pageNum,
          pageSize: payload.pageSize,
          total: payload.sumCount,
          data: payload.result,
        },
      };
    },
    classificationList(state, { payload }) {
      return {
        ...state,
        classificationList: payload,
      };
    },
    eventFeaturesList(state, { payload }) {
      return {
        ...state,
        eventFeaturesList: payload,
      };
    },
    saveSearchEventFeatures(state, { payload }) {
      return {
        ...state,
        existEventFeaturesList: payload.result,
        pagination: {
          current: payload.pageNum,
          pageSize: payload.pageSize,
          total: payload.sumCount,
        },
      };
    },
    saveEventFeature(state, { payload }) {
      return {
        ...state,
        eventFeature: payload,
      };
    },
    saveCommandInfo(state, { payload }) {
      return {
        ...state,
        commandInfo: payload,
      };
    },
    saveResourceInfo(state, { payload }) {
      return {
        ...state,
        resourceInfo: payload,
      };
    },
    savePlanBaseInfo(state, { payload }) {
      return {
        ...state,
        planBaseInfo: payload,
      };
    },
    saveEmgcCommandByEventID(state, { payload }) {
      return {
        ...state,
        emgcCommand: payload,
      };
    },
    saveEmgcResourceByEventID(state, { payload }) {
      return {
        ...state,
        emgcResource: payload,
      };
    },
    saveEmgcFeature(state, { payload }) {
      return {
        ...state,
        emgcFeature: payload,
      };
    },
    savePlanLevelList(state, { payload }) {
      return {
        ...state,
        planLevelList: payload,
      };
    },
    saveFlowNodeList(state, { payload }) {
      return {
        ...state,
        flowNodeList: payload,
      };
    },
    saveMaterialList(state, { payload }) {
      return {
        ...state,
        materialList: payload,
      };
    },
    saveResourcePage(state, { payload }) {
      return {
        ...state,
        resourcePage: payload,
      };
    },
    saveAreaList(state, { payload }) {
      return {
        ...state,
        areaList: payload,
      };
    },
    saveCommandList(state, { payload }) {
      return {
        ...state,
        commandList: payload,
      };
    },
    saveCommandModelList(state, { payload }) {
      return {
        ...state,
        commandModel: payload,
      };
    },
    saveIsInsert(state, { payload }) {
      return {
        ...state,
        isInsert: payload,
      };
    },
    saveOrgList(state, { payload }) {
      return {
        ...state,
        orgUserList: payload,
      };
    },
    saveEmgcOrgList(state, { payload }) {
      return {
        ...state,
        emgcOrgList: payload,
      };
    },
    saveUndoneEventList(state, { payload }) {
      return {
        ...state,
        undoneEventList: payload,
        // undoneEventPagination: {
        //   current: payload.pageNum,
        //   pageSize: payload.pageSize,
        //   total: payload.sumCount,
        // },
      };
    },
    saveEventId(state, { payload }) {
      return {
        ...state,
        eventId: payload.eventId,
        tableId: payload.tableId,
      };
    },
    saveEventInfo(state, { payload }) {
      return {
        ...state,
        eventInfo: payload,
      };
    },
    saveEventLevel(state, { payload }) {
      return {
        ...state,
        eventLevel: payload,
      };
    },
    saveEmgcOrgID(state, { payload }) {
      return {
        ...state,
        emgcOrgID: payload,
      };
    },
    saveConditionList(state, { payload }) {
      return {
        ...state,
        finishConditionList: payload,
      };
    },
    saveFlowNodeTemplateList(state, { payload }) {
      return {
        ...state,
        flowNodeTemplateList: payload,
      };
    },
    saveFlowExcuteInfo(state, { payload }) {
      return {
        ...state,
        flowExcuteInfo: payload,
      };
    },
    saveViewNodeType(state, { payload }) {
      return {
        ...state,
        viewNodeType: payload,
      };
    },
    saveExistCommand(state, { payload }) {
      return {
        ...state,
        existCommandPage: payload,
      };
    },
    saveExpandCurrent(state, { payload }) {
      return {
        ...state,
        expandCurrent: payload,
      };
    },
    saveCheckedConditionList(state, { payload }) {
      return {
        ...state,
        checkedConditionList: payload,
      };
    },
    saveCommandReceiver(state, { payload }) {
      return {
        ...state,
        commandReceiver: payload,
      };
    },
    saveEventPosition(state, { payload }) {
      return {
        ...state,
        eventPosition: payload,
      };
    },
    saveExpandFeature(state, { payload }) {
      return {
        ...state,
        expandFeatureList: payload,
      };
    },
    saveAllCommandModelList(state, { payload }) {
      return {
        ...state,
        allCommandModelList: payload,
      };
    },
    savePlanInfoPage(state, { payload }) {
      return {
        ...state,
        planInfoPage: payload,
      };
    },
    savePlanTypeList(state, { payload }) {
      return {
        ...state,
        planTypeList: payload,
      };
    },
    saveCheckedUser(state, { payload }) {
      return {
        ...state,
        checkedUser: payload,
      };
    },
    saveExecutePlan(state, { payload }) {
      return {
        ...state,
        executePlans: payload,
      };
    },
    saveEventExecPlanID(state, { payload }) {
      return {
        ...state,
        eventExecPlanID: payload,
      };
    },
    savePlanInfo(state, { payload }) {
      return {
        ...state,
        planInfo: payload,
      };
    },
    saveIfFromPlan(state, { payload }) {
      return {
        ...state,
        isFromPlan: payload,
      };
    },
    saveCommandStatus(state, { payload }) {
      return {
        ...state,
        commandStatus: payload,
      };
    },
    saveDisposalActiveKey(state, { payload }) {
      return {
        ...state,
        disposalActiveKey: payload,
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
    savePlanAnnexPage(state, { payload }) {
      return {
        ...state,
        planAnnexPage: {
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
    saveImplDealCard(state, { payload }) {
      return {
        ...state,
        implDealCardList: payload,
      };
    },
    saveImplOrgAnnex(state, { payload }) {
      return {
        ...state,
        implOrgAnnexList: payload,
      };
    },
    saveImplEmgcProcess(state, { payload }) {
      return {
        ...state,
        implEmgcAnnex: payload,
      };
    },
    saveExecuteList(state, { payload }) {
      return {
        ...state,
        executeList: payload,
      };
    },
    saveResMaterialPage(state, { payload }) {
      return {
        ...state,
        resMaterialPage: payload,
      };
    },
    saveEventPlanList(state, { payload }) {
      return {
        ...state,
        eventPlanList: payload,
      };
    },
    saveExpandPlanPage(state, { payload }) {
      return {
        ...state,
        expandPlanPage: payload,
      };
    },
    saveTemplatePlanID(state, { payload }) {
      return {
        ...state,
        templatePlanID: payload,
      };
    },
    saveSelectedRowKeys(state, { payload }) {
      return {
        ...state,
        selectedRowKeys: payload,
      };
    },
    saveAcceptUser(state, { payload }) {
      return {
        ...state,
        acceptUser: payload,
      };
    },
    saveFunctionMenus(state, { payload }) {
      return {
        ...state,
        functionMenus: payload,
      };
    },
    saveProcessFuncMenus(state, { payload }) {
      return {
        ...state,
        processFuncMenus: payload,
      };
    },
    saveEventPage(state, { payload }) {
      return {
        ...state,
        historyEventPage: {
          data: payload.result,
          pagination: {
            total: payload.sumCount,
            pageNum: payload.pageNum,
            pageSize: payload.pageSize,
          },
        },
      };
    },
    saveDrillPage(state, { payload }) {
      return {
        ...state,
        historyDrillPage: {
          data: payload.result,
          pagination: {
            total: payload.sumCount,
            pageNum: payload.pageNum,
            pageSize: payload.pageSize,
          },
        },
      };
    },
  },
};
