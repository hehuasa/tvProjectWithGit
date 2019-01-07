import {
  getFlowData, getFlowDataList, saveFlowData, resourceTreeByCtrlType, getByClassifyType,
  getGraphiceDatas, getFunctionMenus
} from '../services/api';

export default {
  namespace: 'flow',
  state: {
    list: [],
    graphicList: [],
    currentData: {},
    classifyType: [],
    GraphiceDatas: {},
    currentFlow: {
      show: false,
      data: { graphicsName: '' },
      treeNode: {},
    },
    currentFlows: [],
    functionMenus: [], // 页面功能权限
  },

  effects: {
    // 获取抽象资源（组态）列表
    *fetchGraphicList({ payload }, { call, put }) {
      const response = yield call(resourceTreeByCtrlType, payload);
      yield put({
        type: 'queryGraphicList',
        payload: response.data,
      });
    },
    // 获取组态图列表
    *fetchList({ payload }, { call, put }) {
      const response = yield call(getFlowDataList);
      yield put({
        type: 'queryList',
        payload: response.data,
      });
      // yield put({
      //   type: 'queryCurrentFlow',
      //   payload: { show: true, data: response.data.find(value => value.resourceID === payload) },
      // });
    },
    // 获取单个
    *fetch({ payload }, { call, put }) {
      const response = yield call(getFlowData, payload);
      yield put({
        type: 'queryCurrentFlow',
        payload: { show: true, data: response.data, treeNode: payload.treeNode },
      });
    },
    // 获取单个（设备监测）
    *fetchDeviceOption({ payload }, { call, put }) {
      const response = yield call(getFlowData, payload);
      yield put({
        type: 'queryCurrentFlow',
        payload: { show: false, data: response.data },
      });
    },
    // 获取多个（设备监测）
    *fetchDeviceOptions({ payload }, { call, put }) {
      const datas = [];
      for (const resourceID of payload.resourceIDs) {
        const { data } = yield call(getFlowData, { resourceID });
        datas.push(data);
      }
      yield put({
        type: 'queryCurrentFlow',
        payload: { show: false, data: {}, treeNode: payload.treeNode },
      });
      yield put({
        type: 'queryCurrentDevices',
        payload: { show: false, data: datas },
      });
    },
    // 保存
    *save({ payload }, { call }) {
      yield call(saveFlowData, payload);
    },
    // 获取各类图下的设备
    *getByClassifyType({ payload }, { call, put }) {
      const response = yield call(getByClassifyType, payload);
      yield put({
        type: 'queryClassifyType',
        payload: response.data,
      });
    },
    *getGraphiceDatas({ payload }, { call, put }) {
      const response = yield call(getGraphiceDatas, payload);
      yield put({
        type: 'queryGraphiceDatas',
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
    queryData(state, { payload }) {
      return {
        ...state,
        currentData: payload,
      };
    },
    queryList(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
    queryGraphicList(state, { payload }) {
      return {
        ...state,
        graphicList: payload,
      };
    },
    queryClassifyType(state, { payload }) {
      return {
        ...state,
        classifyType: payload,
      };
    },
    // 当前展示的组态图
    queryCurrentFlow(state, { payload }) {
      return {
        ...state,
        currentFlow: payload,
      };
    },
    // 当前展示的设备监测图(多个)
    queryCurrentDevices(state, { payload }) {
      return {
        ...state,
        currentFlows: payload,
      };
    },
    // 实时数据
    queryGraphiceDatas(state, { payload }) {
      return {
        ...state,
        GraphiceDatas: payload,
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
