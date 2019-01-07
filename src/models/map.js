import { searchByAttr, searchByAttrBySorting, space } from '../utils/mapService';
import { selectByGISCode, getMonitorResourceObj, getMonitorResource, getMapLayer } from '../services/api';
import { mapLayers } from '../services/mapConstant';
// 计算地图弹窗的箭头方向，宽高等
const getInfoWindowStyle = ({ type, mapStyle, screenPoint, arrowDirection }) => {
  const arrowLength = 7;
  let style;
  let arrowStyle;
  let arrowDirection1;
  const getArrowDirection = () => {
    if (mapStyle.height - screenPoint.y > style.height && screenPoint.y > style.height) {
      if (mapStyle.width - screenPoint.x > style.width) {
        arrowDirection1 = 'left';
      } else {
        arrowDirection1 = 'right';
      }
    } else if (mapStyle.height - screenPoint.y < style.height) {
      arrowDirection1 = 'bottom';
    } else {
      arrowDirection1 = 'top';
    }
  };
  // 判断弹窗类型，确定样式
  switch (type) {
    case 'deviceInfo':
      style = {
        width: 400,
        height: 230,
      };
      break;
    case 'trueMap':
      style = {
        width: 120,
        height: 30,
      };
      arrowDirection1 = 'bottom';
      style.bottom = mapStyle.height - screenPoint.y + arrowLength + 10;
      style.left = screenPoint.x - (style.width / 2) - 1;
      return { style, arrowDirection: arrowDirection1 };
    case 'simpleInfo':
      style = {
        // width: 120,
        // height: 45,
      };
      arrowDirection1 = 'bottom';
      style.bottom = mapStyle.height - screenPoint.y + arrowLength + 5;
      style.left = screenPoint.x;
      return { style, arrowDirection: arrowDirection1 };
    default: return null;
  }
  // 确定象限
  if (arrowDirection) {
    arrowDirection1 = arrowDirection;
  } else {
    getArrowDirection();
  }
  // 确定弹窗位置及箭头位置
  switch (arrowDirection1) {
    case 'left':
      style.top = screenPoint.y - (style.height / 2);
      style.left = screenPoint.x + arrowLength;
      arrowStyle = {
        left: -30,
        top: style.height / 2 - 10,
      };
      break;
    case 'right':
      style.top = screenPoint.y - (style.height / 2);
      style.right = mapStyle.width - screenPoint.x + arrowLength;
      arrowStyle = {
        right: -30,
        top: style.height / 2 - 10,
      };
      break;
    case 'bottom':
      style.bottom = mapStyle.height - screenPoint.y + arrowLength;
      style.left = screenPoint.x - (style.width / 2);
      arrowStyle = {
        left: style.width / 2 - 10,
        bottom: -30,
      };
      break;
    case 'top':
      style.top = screenPoint.y + arrowLength;
      style.left = screenPoint.x - (style.width / 2);
      arrowStyle = {
        left: style.width / 2 - 10,
        top: -30,
      };
      break;
    default: return null;
  }
  return { style, arrowDirection: arrowDirection1, arrowStyle };
};
// 存储、获取本地历史存储（搜索历史）
const saveSearchText = async (text) => {
  let history = localStorage.getItem('searchHistory');
  // 新增
  if (history === null || history === '') {
    const array = [];
    localStorage.setItem('searchHistory', JSON.stringify(array));
    history = JSON.parse(localStorage.getItem('searchHistory'));
  } else {
    history = JSON.parse(history);
  }
  const editHistory = (value) => {
    // 去重
    if (history.find(item => item === value)) {
      return false;
    }
    history.push(value);
    if (history.length > 5) {
      history.shift();
    }
    localStorage.setItem('searchHistory', JSON.stringify(history));
  };
  if (text) {
    editHistory(text);
  }

  return history;
};


export default {
  namespace: 'map',
  state: {
    mainMap: '',
    mapView: '',
    load: false,
    isDraw: false,
    stopPropagation: false, // 停止地图行动
    legend: { loaded: false, show: false },
    center: [114.53302201076804, 30.642714242082587],
    scale: 0,
    popupScale: 0,
    extent: {},
    baseLayer: {},
    searchHistory: [],
    tooslBtnIndex: -1,
    legendLayer: {},
    layerIds: [], // 已加载图层的layerId
    FeatureLayersIds: [], // 已加载图层的Id
    trueMapShow: false,
    mapPoint: {},
    screenPoint: { x: 0, y: 0 },
    screenBeforePoint: { x: 0, y: 0 },
    searchDeviceArray: null,
    searchText: '', // 仅用于地图搜索框
    searchResult: '', // 仅用于地图搜索框
    startBreath: false,
    breath: {
      x: 100,
      y: 100,
      show: false,
    },
    infoWindow: {
      type: '',
      isPanning: false,
      show: false,
      load: false,
      style: {},
      arrowDirection: '',
      attributes: [],
      resourceType: '',
    },
    contextPosition: {
      left: 0,
      top: 0,
      show: false,
    },
    mapBoardShow: {
      // searchResult: false,
      // resourceInfo: false,
      // alarmBoard: false,
      // environmental: false,
      // production: false,
      // 是否显示 返回地图搜索结果面板
      backResult: false,
    },
    alarmBoardData: [],
    isRecenter: false, // 地图是否需要进行缩放或重定位
    centerRadius: 50,
    constantlyComponents: {},
    // 扩音分区
    paSystemInfo: [],
    paBordInfo: {},
    resourceInfo: {}, // 报警对应的资源信息
  },
  effects: {
    // 呼吸灯动画开始
    * startBreath(payload, { put }) {
      yield put({
        type: 'breathStart',
        payload: payload.payload,
      });
    },
    // 地图搜索（属性）
    * searchDeviceByAttr({ payload }, { call, put }) {
      const response = yield call(searchByAttr, payload);// 搜索设备
      yield put({
        type: 'getDeviceArray',
        payload: response,
      });
    },
    // 地图搜索（属性 + 排序）
    * searchDeviceByAttrSorting({ payload }, { call, put }) {
      const response = yield call(searchByAttrBySorting, payload);// 搜索设备
      yield put({
        type: 'getDeviceArray',
        payload: response,
      });
    },
    // 地图搜索（空间）
    * searchDeviceBySpace({ payload }, { call, put }) {
      const response = yield call(space, payload);// 搜索设备
      yield put({
        type: 'getDeviceArray',
        payload: response,
      });
    },
    // 呼吸灯动画位置切换
    * breath({ payload }, { put }) {
      yield put({
        type: 'changePosition',
        payload,
      });
    },
    * toggle(payload, { put }) {
      yield put({
        type: 'toggleAnimation',
        payload: payload.payload,
      });
    },
    * editSearchText({ payload }, { call, put }) {
      const data = yield call(saveSearchText, payload);
      yield put({
        type: 'querySearchText',
        payload: data,
      });
    },
    // 地图右键
    * contextMenu({ payload }, { put }) {
      yield put({
        type: 'toggleContextMenu',
        payload,
      });
    },
    // 地图弹窗
    * showInfoWindow({ payload }, { put }) {
      // 判断是否在拖动中，是则不改变窗口相对位置只修改坐标
      const { style, arrowDirection, arrowStyle } = getInfoWindowStyle(payload);
      yield put({
        type: 'infoWindowOnPan',
        payload: {
          show: payload.show,
          load: payload.load,
          type: payload.type,
          style,
          arrowDirection: payload.arrowDirection || arrowDirection,
          arrowStyle: payload.arrowStyle || arrowStyle,
          attributes: payload.attributes,
        },
      });
    },
    // 报警统计图层弹窗
    * addAlarmCounts({ payload }, { put }) {
      const { style, attributes, data, show, id, currentStyle } = payload;
      data.push({ style, attributes, id, currentStyle });
      yield put({
        type: 'queryAlarmCounts',
        payload: {
          show,
          data,
        },
      });
    },
    * delAlarmCounts({ payload }, { put }) {
      const { style, attributes, data } = getInfoWindowStyle(payload);
      data.push({ style, attributes });
      yield put({
        type: 'queryAlarmCounts',
        payload: {
          data,
        },
      });
    },
    * selectByGISCode({ payload }, { call, put }) {
      const response = yield call(selectByGISCode, payload);
      const resourceInfo = response.data.result[0] || {};
      // 根据resourceID取检测对象
      const monitorResponse = yield call(getMonitorResourceObj, {
        resourceID: resourceInfo.resourceID,
      });
      const monitorObjs = monitorResponse.data;
      // 根据resourceID取被检测对象
      const beMonitorResponse = yield call(getMonitorResource, {
        resourceID: resourceInfo.resourceID,
      });
      const beMonitorObjs = beMonitorResponse.data.result;
      // 保存取到的资源信息
      yield put({
        type: 'saveResourceInfo',
        payload: { ...resourceInfo, monitorObjs, beMonitorObjs },
      });
    },
    // 请求地图图层
    * fetchLayers(_, { call }) {
      const response = yield call(getMapLayer);
      for (const layer of response.data) {
        const index = layer.layerAddress.indexOf('MapServer/');
        layer.id = Number(layer.layerAddress.substr(index + 10));
        switch (Number(layer.layerType)) {
          // case 5: mapLayers.tileLayer = layer; break;
          case 1: mapLayers.baseLayer = layer; break;
          case 5:
            layer.isBaseLayer = true;
            mapLayers.FeatureLayers.push(layer);
            break;
          case 6:
            layer.isArea = true;
            mapLayers.FeatureLayers.push(layer);
            mapLayers.AreaLayers.push(layer);
            break;
          case 7:
            layer.isPic = true;
            mapLayers.RasterLayers.push(layer);
            break;
          case 8:
            mapLayers.FrontLayers.push(layer);
            break;
          case 21:
            layer.isAlarmLayer = true;
            mapLayers.FeatureLayers.push(layer);
            break;
          case 22:
            layer.isAlarmLayer = true;
            mapLayers.FeatureLayers.push(layer);
            break;
          case 24:
            layer.isAlarmLayer = true;
            mapLayers.FeatureLayers.push(layer);
            break;
          case 27:
            layer.isAlarmLayer = true;
            mapLayers.FeatureLayers.push(layer);
            break;
          default:
            if (typeof layer.id === 'number') {
              mapLayers.FeatureLayers.push(layer);
            }
        }
      }
    },
  },
  reducers: {
    load(state, { payload }) {
      return {
        ...state,
        load: payload,
      };
    },
    getMap(state, { payload }) {
      return {
        ...state,
        mainMap: payload,
      };
    },
    getBaseLayer(state, { payload }) {
      return {
        ...state,
        baseLayer: payload,
      };
    },
    getLegendLayer(state, { payload }) {
      return {
        ...state,
        legendLayer: payload,
      };
    },
    getMapView(state, { payload }) {
      return {
        ...state,
        mapView: payload,
      };
    },
    mapScale(state, { payload }) {
      return {
        ...state,
        scale: payload,
      };
    },
    mapPopupScale(state, { payload }) {
      return {
        ...state,
        popupScale: payload,
      };
    },
    // 图例
    mapExtent(state, { payload }) {
      return {
        ...state,
        extent: payload,
      };
    },
    getLegend(state, { payload }) {
      return {
        ...state,
        legend: payload,
      };
    },
    getDeviceArray(state, { payload }) {
      return {
        ...state,
        searchDeviceArray: payload,
      };
    },
    infoWindow(state, { payload }) {
      return {
        ...state,
        infoWindow: payload,
      };
    },
    infoWindowOnPan(state, { payload }) {
      return {
        ...state,
        infoWindow: payload,
      };
    },
    breathStart(state, { payload }) {
      return {
        ...state,
        startBreath: payload,
      };
    },
    changePosition(state, { payload }) {
      return {
        ...state,
        breath: payload,
      };
    },
    toggleAnimation(state, { payload }) {
      return {
        ...state,
        toggle: payload,
      };
    },
    toggleContextMenu(state, { payload }) {
      return {
        ...state,
        contextPosition: payload,
      };
    },
    toggleLayer(state, { payload }) {
      return {
        ...state,
        show: !payload,
      };
    },
    mapPoint(state, { payload }) {
      return {
        ...state,
        mapPoint: payload,
      };
    },
    screenPoint(state, { payload }) {
      return {
        ...state,
        screenPoint: payload,
        screenBeforePoint: payload,
      };
    },
    screenBeforePoint(state, { payload }) {
      return {
        ...state,
        screenBeforePoint: payload,
      };
    },
    trueMapShow(state, { payload }) {
      return {
        ...state,
        trueMapShow: payload,
      };
    },
    addLayers(state, { payload }) {
      state.layerIds.push(payload);
      return {
        ...state,
        layerIds: state.layerIds,
      };
    },
    addFeatureLayersIds(state, { payload }) {
      state.FeatureLayersIds.push(payload);
      return {
        ...state,
        FeatureLayersIds: state.FeatureLayersIds,
      };
    },
    delLayers(state, { payload }) {
      state.layerIds.splice(state.layerIds.findIndex(value => value === payload), 1);
      return {
        ...state,
        layerIds: state.layerIds,
      };
    },
    // 保存搜索历史
    querySearchText(state, { payload }) {
      return {
        ...state,
        searchHistory: payload,
      };
    },
    mapBoardShow(state, { payload }) {
      return {
        ...state,
        mapBoardShow: payload,
      };
    },
    alarmBoardData(state, { payload }) {
      return {
        ...state,
        alarmBoardData: payload,
      };
    },
    // 判断是否需要缩放地图
    getRecenter(state, { payload }) {
      return {
        ...state,
        isRecenter: payload,
      };
    },
    // 地图搜索半径
    centerRadius(state, { payload }) {
      return {
        ...state,
        centerRadius: payload,
      };
    },
    // 报警 对应的资源信息
    saveResourceInfo(state, { payload }) {
      return {
        ...state,
        resourceInfo: payload,
      };
    },
    queryIsDraw(state, { payload }) {
      return {
        ...state,
        isDraw: payload,
      };
    },
    // 获取环保地图数据
    queryEnvData(state, { payload }) {

    },
    // 停止地图事件
    queryStopPropagation(state, { payload }) {
      return {
        ...state,
        stopPropagation: payload,
      };
    },
  },
};

