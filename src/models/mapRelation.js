
export default {
  namespace: 'mapRelation',
  state: {
    popupShow: true,
    markShow: { load: true, show: false }, // 标注工具编辑
    markType: [
      { type: 'env', name: '环保' },
      { type: 'fire', name: '消防' },
      { type: 'medical', name: '医疗' },
      { type: 'people', name: '人员' },
      { type: 'guard', name: '保卫' },
      { type: 'material', name: '物资' },
    ],
    markData: { type: ['env'], data: [] }, // 标注图形数据
    spaceQueryPop: {
      load: false,
      show: false,
      point: {},
      screenPoint: {},
      style: { left: 0, top: 0 },
    },
    toolsBtnIndex: -1,
    mapIconShow: false,
    alarmIconData: [], // 需要在地图渲染的报警（资源树上聚合开关选中的）
    eventIconData: [], // 需要在地图渲染的事件
    envIconShow: false,
    envIconData: [],  // 需要在地图渲染的环保实时气泡
    selectIconShow: { show: false, type: '' },
    infoPops: [],
    clusterPopups: [],
    clusterPopup: { show: false, load: false, data: [] },
    resourceClusterPopup: { show: false, load: false, data: [] },
    alarmClusterPopup: { show: false, load: false, data: [] },
    constructMonitorClusterPopup: { show: false, load: false, data: [] },
    paPopup: { show: false, load: false, data: [] },
    accessPops: { show: false, load: false, data: [] },
    vocsPopup: { show: false, load: false, data: [] },
  },
  effects: {
    // 增加地图聚合气泡窗
    *addClusterPopup({ payload }, { put, select }) {
      // 改变聚合气泡窗顺序
      const { type, data } = payload;
      const newMapRelation = yield select(({ mapRelation }) => mapRelation.clusterPopups);
      const index = newMapRelation.findIndex(value => value.type === type);
      if (index === -1) {
        newMapRelation.unshift({ type, index: newMapRelation.length });
      } else {
        newMapRelation.splice(index, 1);
        newMapRelation.unshift({ type, index: newMapRelation.length });
      }
      // newMapRelation.sort((a, b) => b.index - a.index);
      yield put({
        type: 'queryClusterPopups',
        payload: newMapRelation,
      });
      yield put({
        type,
        payload: data,
      });
    },
    *delClusterPopup({ payload }, { put, select }) {
      // 改变聚合气泡窗顺序
      const { type, data } = payload;
      const newMapRelation = yield select(({ mapRelation }) => mapRelation.clusterPopups);
      const index = newMapRelation.findIndex(value => value.type === type);
      if (index !== -1) {
        newMapRelation.splice(index, 1);
        // newMapRelation.sort((a, b) => b.index - a.index);
        yield put({
          type: 'queryClusterPopups',
          payload: newMapRelation,
        });
      }
      yield put({
        type,
        payload: data,
      });
    },
    *saveMarkData({ payload }, { put }) {
      yield put({
        type: 'queryMarkData',
        payload,
      });
    },
  },
  reducers: {
    // 统一控制气泡显示
    showPopup(state, { payload }) {
      return {
        ...state,
        popupShow: payload,
      };
    },
    // 标注工具显示
    showMark(state, { payload }) {
      return {
        ...state,
        markShow: payload,
      };
    },
    // 标注工具数据
    queryMarkData(state, { payload }) {
      return {
        ...state,
        markData: payload,
      };
    },
    // 弹窗组
    queryInfoPops(state, { payload }) {
      return {
        ...state,
        infoPops: payload,
      };
    },
    // 资源聚合的popup
    resourceClusterPopup(state, { payload }) {
      return {
        ...state,
        resourceClusterPopup: payload,
      };
    },
    // 门禁的popup
    accessPops(state, { payload }) {
      return {
        ...state,
        accessPops: payload,
      };
    },
    // 聚合的popup
    queryClusterPopup(state, { payload }) {
      return {
        ...state,
        clusterPopup: payload,
      };
    },
    // 报警聚合
    alarmClusterPopup(state, { payload }) {
      return {
        ...state,
        alarmClusterPopup: payload,
      };
    },
    // vocs的popup
    vocsPopup(state, { payload }) {
      return {
        ...state,
        vocsPopup: payload,
      };
    },
    // 作业监控popup
    constructMonitorClusterPopup(state, { payload }) {
      return {
        ...state,
        constructMonitorClusterPopup: payload,
      };
    },
    // 地图工具栏，控制点击样式与事件的index
    queryToolsBtnIndex(state, { payload }) {
      return {
        ...state,
        toolsBtnIndex: payload,
      };
    },
    // 周边查询
    setSpaceQuery(state, { payload }) {
      return {
        ...state,
        spaceQueryPop: payload,
      };
    },
    // 报警图标是否在地图显示
    queryMapIconShow(state, { payload }) {
      return {
        ...state,
        mapIconShow: payload,
      };
    },
    // 在地图显示的报警图标
    queryAlarmIconData(state, { payload }) {
      return {
        ...state,
        alarmIconData: payload,
      };
    },
    // 在地图显示的事件图标
    queryEventIconData(state, { payload }) {
      return {
        ...state,
        eventIconData: payload,
      };
    },
    // 在地图显示的被选中的图标
    querySelectIconShow(state, { payload }) {
      return {
        ...state,
        selectIconShow: payload,
      };
    },
    // 在地图显示的事件图标
    queryEnvIconData(state, { payload }) {
      return {
        ...state,
        envIconData: payload,
      };
    },
    // 在地图显示的被选中的图标
    queryEnvIconShow(state, { payload }) {
      return {
        ...state,
        envIconShow: payload,
      };
    },
  },
};

