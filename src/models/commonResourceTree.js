import $ from 'jquery';
import {
  resourceTree, resourceTreeByCtrlType, addCommonResource, selectIfOften,
  selectByGISCode, getRawByResourceID, getMaterialHarmInfo, getMaterialFireControl, deleteCommon,
  selectByCode, getAllRiskByAreaCode, getAllSecurityByAreaCode, getResNums,
  getNewsData, getMonitorResourceObj, getMonitorResource, selectByPage, commonResourceTree,
} from '../services/api';
import { infoConstantly } from '../services/constantlyModal';
import { checkCode, formatDuring } from '../utils/utils';

export default {
  namespace: 'commonResourceTree',

  state: {
    contextMenu: { show: false },
    isOften: false,
    // 资源树数据
    treeData: [],
    // 常用资源树数据
    oftenTreeData: [],
    appendData: [],
    selectedNodes: [],
    ztreeObj: {},
    ztreeOftenObj: {},
    resourceInfo: {},
    resourceGroupByArea: [], // 聚合所需要的资源统计信息
    clusterRes: [], // 需要聚合的资源
    resInfo: {}, // 不做共享的资源信息
    rowInfo: {}, // 原料信息
    // 原料危害
    materialHarmInfo: [],
    // 原料消防信息
    materialFireControl: [],
    // 树节点信息
    treeNode: {},
    // 资源控制分类 用于控制不同类型显示不同资源
    ctrlResourceType: '',
    // 被选中的资源设备gisCode(门禁、门禁分区) {gisCode, type}
    selectResourceGisCode: {},
    // 地图点击的危险源和 安全风险ID
    riskID: '',
    // 危险源
    sourceOfRisk: [],
    // 安全风险
    securityRisk: [],
    //  用于实时数据刷新组件
    uniqueKey: {},
    // 报警信息
    alarmBoardData: {},
    // 报警持续时长的轮询ID
    alarmIntervalID: '',
    // 本次存储的资源树信息
    checkedNodesObj: { checked: [], expand: [] },
    clickedAlarmId: null, // 地图或则报警列表 点击的报警 用于资源窗某个资源有多个报警的选中问题
    ajaxParam: {
      param: ['treeID=parentTreeID'],
      asyncUrl: 'emgc/resource/resourceTree/getResourceInfo',
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      // 本地数据
      // const response = yield call(fakeResourceTree, payload);
      // 服务器数据
      const response = yield call(commonResourceTree, payload);
      if (payload.ztree) {
        response.data[0].isParent = true;
        response.data[0].name = response.data[0].treeName;
      }
      yield put({
        type: 'queryList',
        payload: response.data,
      });
    },
    // 聚合的资源统计信息
    *getResourceGroupByArea(_, { call, put }) {
      const response = yield call(getResNums);
      yield put({
        type: 'queryResourceGroupByArea',
        payload: response.data,
      });
    },
    // 修改需要聚合的资源类型
    *getClusterRes({ payload }, { put }) {
      yield put({
        type: 'queryClusterRes',
        payload,
      });
    },
    *append({ payload }, { call, put }) {
      const response = yield call(resourceTree, payload);
      yield put({
        type: 'appendList',
        payload: response.data,
      });
    },
    *appendDevice({ payload }, { call, put }) {
      const response = yield call(resourceTreeByCtrlType, payload);
      yield put({
        type: 'appendList',
        payload: response.data,
      });
    },
    *reload({ payload }, { put }) {
      yield put({
        type: 'queryList',
        payload,
      });
    },
    *addCommonResource({ payload }, { call, put }) {
      const response = yield call(addCommonResource, payload);
      checkCode(response);
      // 重新加载常用资源树
      const treeObj = $.fn.zTree.getZTreeObj('ztree');
      treeObj.reAsyncChildNodes(0, 'refresh');
    },
    *selectIfOften({ payload }, { call, put }) {
      const response = yield call(selectIfOften, payload);
      yield put({
        type: 'saveIfOftenRes',
        payload: response.data,
      });
    },
    *selectByGISCode({ payload }, { call, put }) {
      // 先关掉资源信息窗口
      yield put({
        type: 'saveCtrlResourceType',
        payload: '',
      });
      // 清空缓存的资源信息
      yield put({
        type: 'saveResourceInfo',
        payload: {},
      });
      // 清空缓存的实时数据
      infoConstantly.data = {};
      // 清空轮询
      clearInterval(infoConstantly.intervalID);
      let response;
      if (payload.gISCode) {
        response = yield call(selectByGISCode, { gisCode: payload.gISCode });
      } else {
        response = yield call(selectByPage, payload);
      }
      const resourceInfo = response.data || payload.attributes;
      if (resourceInfo.resourceStatu) {
        const status = yield call(selectByCode, resourceInfo.resourceStatu);
        resourceInfo.status = status.data[0] || {};
      }
      resourceInfo.ctrlResourceType = resourceInfo.ctrlResourceType || 'mapResOnly';
      // 保存取到的资源信息
      yield put({
        type: 'saveResourceInfo',
        payload: { ...resourceInfo, isRes: payload.isRes },
      });
      // 左侧打开相应的面板，通过ctrResourceType
      yield put({
        type: 'saveCtrlResourceType',
        payload: resourceInfo.ctrlResourceType,
      });
    },
    *selectEventByGISCode({ payload }, { call, put }) {
      // 先关掉资源信息窗口
      yield put({
        type: 'saveCtrlResourceType',
        payload: '',
      });
      // 清空缓存的资源信息
      yield put({
        type: 'saveResourceInfo',
        payload: {},
      });
      // 清空缓存的实时数据
      infoConstantly.data = {};
      // 清空轮询
      clearInterval(infoConstantly.intervalID);
      let response;
      if (payload.gISCode) {
        response = yield call(selectByGISCode, { gisCode: payload.gISCode });
      } else {
        response = yield call(selectByPage, payload);
      }
      const resourceInfo = response.data || {};
      if (resourceInfo.resourceStatu) {
        const status = yield call(selectByCode, resourceInfo.resourceStatu);
        resourceInfo.status = status.data[0] || {};
      }
      // 保存取到的资源信息
      yield put({
        type: 'saveResourceInfo',
        payload: { ...resourceInfo, event: payload.event },
      });
      // 左侧打开相应的面板，通过ctrResourceType
        yield put({
          type: 'saveCtrlResourceType',
          payload: 'event',
        });
    },
    // 只取资源信息不开面板
    *getResInfoByGISCode({ payload }, { call, put }) {
      let response;
      if (payload.gISCode) {
        response = yield call(selectByGISCode, { gisCode: payload.gISCode });
      } else {
        response = yield call(selectByPage, payload);
      }
      // 保存取到的资源信息
      yield put({
        type: 'saveResInfo',
        payload: response.data.result[0],
      });
    },
    *getByResourceID({ payload }, { call, put }) {
      const response = yield call(getRawByResourceID, payload);
      yield put({
        type: 'saveRawInfo',
        payload: response.data[0],
      });
    },
    *materialHarmInfo({ payload }, { call, put }) {
      const response = yield call(getMaterialHarmInfo, payload);
      yield put({
        type: 'saveMaterialHarmInfo',
        payload: response.data.result,
      });
    },
    // 原料消防信息
    *materialFireControl({ payload }, { call, put }) {
      const response = yield call(getMaterialFireControl, payload);
      yield put({
        type: 'saveMaterialFireControl',
        payload: response.data.result,
      });
    },
    // 删除常用资源
    *deleteCommonResource({ payload }, { call, put }) {
      const response = yield call(deleteCommon, payload);
      checkCode(response);
    },
    //  根据资源ID，请求监测该资源的对象
    *getBeMonitorsByResourceID({ payload }, { call, put }) {
      const response = yield call(getMonitorResource, payload);
      yield put({
        type: 'saveBeMonitors',
        payload: response.data,
      });
    },
    //  根据资源ID，请求该资源监测的对象
    *getMonitorsByResourceID({ payload }, { call, put }) {
      const response = yield call(getMonitorResourceObj, payload);
      yield put({
        type: 'saveMonitors',
        payload: response.data,
      });
    },
    // 请求危险源数据
    *getSourceOfRisk({ payload }, { call, put }) {
      const response = yield call(getAllRiskByAreaCode, payload);
      yield put({
        type: 'saveSourceOfRisk',
        payload: response.data,
      });
    },
    // 请求安全风险数据
    *getSecurityRisk({ payload }, { call, put }) {
      const response = yield call(getAllSecurityByAreaCode, payload);
      yield put({
        type: 'saveSecurityRisk',
        payload: response.data,
      });
    },
    //  资源窗请求实时数据
    *getRealData({ payload }, { call, put }) {
      const response = yield call(getNewsData, payload);
      infoConstantly.data.universalData = response.data === '' ? [] : response.data;
      // 刷新属性
      yield put({
        type: 'saveUniqueKey',
        payload: new Date().getTime(),
      });
    },
    // 保存资源树信息至本地
    *saveCheckedNode({ payload }, { put }) {
      // 将level排序
      const obj = payload;
      obj.expand = obj.expand.sort((a, b) => {
        return a.level > b.level;
      });
      localStorage.setItem('checkedNodesObj', JSON.stringify(obj));
      // 刷新属性
      yield put({
        type: 'queryCheckedNode',
        payload: '',
      });
    },
    // 处理报警数据
    *dealAlarmBoardData({ payload }, { put }) {
      // for (const alarm of payload) {
      //   if (alarm.receiveTime) {
      //     alarm.continueTime = new formatDuring();
      //   }
      // }
      // console.log('payload', payload);
      yield put({
        type: 'alarmBoardData',
        payload,
      });
    },
  },

  reducers: {
    queryZtreeObj(state, { payload }) {
      return {
        ...state,
        ztreeObj: payload,
      };
    },
    // 常用资源的树对象
    queryOftenZtreeObj(state, { payload }) {
      return {
        ...state,
        ztreeOftenObj: payload,
      };
    },
    queryList(state, { payload }) {
      return {
        ...state,
        treeData: payload,
      };
    },
    // 报存常用资源树的数据
    queryOftenList(state, { payload }) {
      return {
        ...state,
        oftenTreeData: payload,
      };
    },
    appendList(state, { payload }) {
      return {
        ...state,
        appendData: payload,
      };
    },
    getContext(state, { payload }) {
      return {
        ...state,
        contextMenu: payload,
      };
    },
    selectedNodes(state, { payload }) {
      return {
        ...state,
        selectedNodes: payload,
      };
    },
    saveIfOftenRes(state, { payload }) {
      return {
        ...state,
        isOften: payload,
      };
    },
    saveResourceInfo(state, { payload }) {
      clearInterval(state.alarmIntervalID);
      return {
        ...state,
        resourceInfo: payload,
      };
    },
    // 只请求做他用，不共享，不展示看板等
    saveResInfo(state, { payload }) {
      return {
        ...state,
        resInfo: payload,
      };
    },
    saveRawInfo(state, { payload }) {
      return {
        ...state,
        rowInfo: payload,
      };
    },
    saveMaterialHarmInfo(state, { payload }) {
      return {
        ...state,
        materialHarmInfo: payload,
      };
    },
    saveMaterialFireControl(state, { payload }) {
      return {
        ...state,
        materialFireControl: payload,
      };
    },
    saveTreeNode(state, { payload }) {
      return {
        ...state,
        treeNode: payload,
      };
    },
    saveRealEnvironmental(state, { payload }) {
      return {
        ...state,
        realData: {
          ...state.realData,
          environmental: payload,
        },
      };
    },
    saveGasData(state, { payload }) {
      return {
        ...state,
        realData: {
          ...state.realData,
          gasData: payload,
        },
      };
    },
    saveProductionDevice(state, { payload }) {
      return {
        ...state,
        realData: {
          ...state.realData,
          productionDevice: payload,
        },
      };
    },
    saveLargeUnit(state, { payload }) {
      return {
        ...state,
        realData: {
          ...state.realData,
          largeUnit: payload,
        },
      };
    },
    saveCtrlResourceType(state, { payload }) {
      return {
        ...state,
        ctrlResourceType: payload,
      };
    },
    saveSelectResourceGisCode(state, { payload }) {
      return {
        ...state,
        selectResourceGisCode: payload,
      };
    },
    saveBoardLoading(state, { payload }) {
      return {
        ...state,
        boardLoading: payload,
      };
    },
    saveBeMonitors(state, { payload }) {
      return {
        ...state,
        resourceInfo: {
          ...state.resourceInfo,
          beMonitorObjs: payload,
        },
      };
    },
    saveMonitors(state, { payload }) {
      return {
        ...state,
        resourceInfo: {
          ...state.resourceInfo,
          monitorObjs: payload,
        },
      };
    },
    saveIntervalID(state, { payload }) {
      return {
        ...state,
        intervalID: payload,
      };
    },
    clearRealData(state) {
      // 清除轮询
      clearInterval(state.intervalID);
      return {
        ...state,
        realData: {
          ...state.realData,
          environmental: [],
          gasData: [],
          water: [],
          electricity: [],
          steam: [],
          wind: [],
          productionDevice: [],
          largeUnit: [],
        },
      };
    },
    // 危险源、安全风险地图点击ID
    saveRiskID(state, { payload }) {
      return {
        ...state,
        riskID: payload,
      };
    },
    // 危险源
    saveSourceOfRisk(state, { payload }) {
      return {
        ...state,
        sourceOfRisk: payload,
      };
    },
    // 安全风险
    saveSecurityRisk(state, { payload }) {
      return {
        ...state,
        securityRisk: payload,
      };
    },
    saveWater(state, { payload }) {
      return {
        ...state,
        realData: {
          ...state.realData,
          water: payload,
        },
      };
    },
    saveElectricity(state, { payload }) {
      return {
        ...state,
        realData: {
          ...state.realData,
          electricity: payload,
        },
      };
    },
    saveSteam(state, { payload }) {
      return {
        ...state,
        realData: {
          ...state.realData,
          steam: payload,
        },
      };
    },
    saveWind(state, { payload }) {
      return {
        ...state,
        realData: {
          ...state.realData,
          wind: payload,
        },
      };
    },
    saveUniqueKey(state, { payload }) {
      return {
        ...state,
        uniqueKey: payload,
      };
    },
    alarmBoardData(state, { payload }) {
      return {
        ...state,
        alarmBoardData: payload,
      };
    },
    saveAlarmIntervalTime(state, { payload }) {
      return {
        ...state,
        alarmIntervalID: payload,
      };
    },
    // 保存资源树信息至本地
    queryCheckedNode(state) {
      return {
        ...state,
        checkedNodesObj: JSON.parse(localStorage.getItem('checkedNodesObj')),
      };
    },
    saveClickedAlarmId(state, { payload }) {
      return {
        ...state,
        clickedAlarmId: payload,
      };
    },
    // 聚合资源统计信息
    queryResourceGroupByArea(state, { payload }) {
      return {
        ...state,
        resourceGroupByArea: payload,
      };
    },
    // 聚合资源统计信息
    queryClusterRes(state, { payload }) {
      return {
        ...state,
        clusterRes: payload,
      };
    },
    // 保存异步参数
    saveAjaxParam(state, { payload }) {
      return {
        ...state,
        ajaxParam: payload,
      };
    },
  },
};
