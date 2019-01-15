import React, { PureComponent } from 'react';
import { message, Button } from 'antd';
import EsriLoaderReact from 'esri-loader-react';
import { connect } from 'dva';
import { constantlyModal, infoPopsModal } from '../../services/constantlyModal';
import { getBrowserStyle, resetMapMark } from '../../utils/utils';
import { mapLayers, mapConstants } from '../../services/mapConstant';
import styles from './index.less';
import { addEventIcon, addLayer, searchByQuery } from '../../utils/mapService';

const current = {};
let symboltt = {};
const mapModels = [
  'esri/layers/MapImageLayer',
  'esri/Map',
  'esri/views/MapView',
  'esri/geometry/Extent',
  'esri/geometry/SpatialReference',
  'esri/widgets/ScaleBar',
];
const mapStateToProps = ({ map, mapRelation, homepage, resourceTree, constantlyData, loading, tabs, emergency }) => {
  const { baseLayer, trueMapShow, stopPropagation } = map;
  const { infoPops, resourceClusterPopup, clusterPopups, spaceQueryPop, constructMonitorClusterPopup, vocsPopup, markShow, envIconShow, envIconData,
    alarmIconData, eventIconData, mapIconShow, selectIconShow, markData, alarmClusterPopup } = mapRelation;
  const data = [];
  for (const item of constantlyData.constantlyComponents) {
    data.push(item);
  }
  return {
    mapHeight: homepage.mapHeight,
    stopPropagation,
    baseLayer,
    trueMapShow,
    markShow,
    envIconShow,
    envIconData,
    alarmIconData,
    eventIconData,
    mapIconShow,
    selectIconShow,
    markData,
    constantlyComponents: data,
    infoPops,
    spaceQueryPop,
    clusterPopups,
    alarmClusterPopup,
    vocsPopup,
    resourceClusterPopup,
    constructMonitorClusterPopup,
    activeKey: tabs.activeKey,
    resourceInfo: resourceTree.resourceInfo,
    fetchingMapApi: loading.effects['global/fetchUrl'],
    undoneEventList: emergency.undoneEventList,
    fetchLayers: loading.effects['map/fetchLayers'],
  };
};

@connect(mapStateToProps)
export default class ArcgisMap extends PureComponent {
  constructor(props) {
    super(props);
    const timeStample = new Date().getTime();
    this.state = {
      mapDivId: `mapdiv${timeStample}`,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    // const getMapApi = setInterval(() => {
    //   if (!this.props.fetchLayers) {
    //     clearInterval(getMapApi);
    //     // 配置 dojoConfig
    //     const options = {
    //       dojoConfig: {
    //         has: {
    //           'esri-featurelayer-webgl': 1,
    //         },
    //       },
    //     };
    //     esriLoader.loadModules(
    //       ['esri/layers/MapImageLayer',
    //         'esri/layers/TileLayer',
    //         'esri/Map',
    //         'esri/views/MapView',
    //         'esri/geometry/Extent',
    //         'esri/geometry/SpatialReference',
    //         'esri/widgets/ScaleBar',
    //       ]
    //     ).then(
    //       ([MapImageLayer, TileLayer, Map, MapView, Extent, SpatialReference, ScaleBar]) => {
    //         // esriLoader.loadCss('/mapApi/esri/css/main.css');
    //         if (!this.props.fetchLayers) {
    //           // 找到底图图层
    //           const sublayers = [];
    //           const { winWidth } = getBrowserStyle();
    //           // 判断分辨率，确定初始显示比例，以及聚合信息显示比例（考虑性能，聚合显示比例比初始比例少4000）
    //           const scale = winWidth < 1700 ? 15000 : 10000;
    //           const popupScale = scale - 4000;
    //           // 需要特殊处理，放在上顶的图层
    //           for (const layer of mapLayers.FrontLayers) {
    //             sublayers.push({
    //               title: layer.mapLayerName,
    //               id: layer.id,
    //               visible: false,
    //             });
    //           }
    //           // 普通图层
    //           for (const layer of mapLayers.FeatureLayers) {
    //             sublayers.push({
    //               title: layer.mapLayerName,
    //               id: layer.id,
    //               visible: false,
    //               // visible: layer.isBaseLayer,
    //               maxScale: layer.isArea ? popupScale : 0, // 区域图层显示
    //             });
    //           }
    //           for (const layer of mapLayers.RasterLayers) {
    //             sublayers.push({
    //               title: layer.mapLayerName,
    //               id: layer.id,
    //               visible: false,
    //               // visible: layer.isBaseLayer,
    //               // maxScale: layer.isArea ? popupScale : 0, // 区域图层显示
    //             });
    //           }
    //           // 栅格图层
    //           // for (const layer of mapLayers.RasterLayers) {
    //           //   sublayers.push({
    //           //     title: layer.mapLayerName,
    //           //     id: layer.id,
    //           //     visible: true,
    //           //   });
    //           // }
    //           // 切片图层
    //           const baseTie = mapLayers.FeatureLayers.find(value => value.isBaseLayer);
    //           const tileLayer = new MapImageLayer({ url: baseTie.layerAddress, id: '底图' });
    //           sublayers.reverse();
    //           const baseLayer = new MapImageLayer({ url: mapLayers.baseLayer.layerAddress, id: mapLayers.baseLayer.mapLayerName, sublayers });
    //           mapConstants.mainMap = new Map({
    //             layers: [baseLayer, tileLayer],
    //           });
    //           mapConstants.baseLayer = baseLayer;
    //           const extent = new Extent({
    //             xmin: 12748163.571481707,
    //             xmax: 12751351.807024846,
    //             ymin: 3585571.3320610607,
    //             ymax: 3587299.0646831924,
    //             spatialReference: new SpatialReference(102100),
    //           });
    //           const accessInfoExtent = new Extent({
    //             xmin: 12748004.159704551,
    //             xmax: 12751511.218802001,
    //             ymin: 3585484.945429954,
    //             ymax: 3587385.451314299,
    //             spatialReference: new SpatialReference(102100),
    //           });
    //           dispatch({
    //             type: 'map/mapScale',
    //             payload: scale,
    //           });
    //           dispatch({
    //             type: 'map/mapPopupScale',
    //             payload: popupScale,
    //           });
    //           mapConstants.popupScale = popupScale;
    //           mapConstants.extent = extent;
    //           mapConstants.accessInfoExtent = accessInfoExtent;
    //           mapConstants.view = new MapView({
    //             container: this.state.mapDivId,
    //             ui: { components: [] },
    //             rotation: 292.7,
    //             padding: 320,
    //             extent,
    //             map: mapConstants.mainMap,
    //           });
    //           const scaleBar = new ScaleBar({
    //             container: this.scaleBarWap,
    //             view: mapConstants.view,
    //             style: 'line',
    //             unit: 'metric',
    //           });
    //           mapConstants.view.ui.add(
    //             scaleBar, {
    //               position: 'bottom-left',
    //             });
    //           mapConstants.view.when(() => {
    //             // 画事件图标
    //             const getEvent = setInterval(() => {
    //               if (this.props.undoneEventList.length > 0) {
    //                 clearInterval(getEvent);
    //                 addEventIcon(this.props.undoneEventList, dispatch);
    //               }
    //             }, 500);
    //             dispatch({
    //               type: 'map/load',
    //               payload: true,
    //             });
    //             mapConstants.view.on('click', (e) => {
    //               if (this.props.stopPropagation) {
    //                 e.stopPropagation();
    //                 return false;
    //               }
    //               // 存储被点击的点
    //               dispatch({
    //                 type: 'map/mapPoint',
    //                 payload: e.mapPoint,
    //               });
    //               // 首先清空报警选中
    //               const { selectIconShow, alarmIconData, eventIconData, infoPops } = this.props;
    //               if (selectIconShow.show) {
    //                 dispatch({
    //                   type: 'mapRelation/querySelectIconShow',
    //                   payload: false,
    //                 });
    //                 let newData;
    //                 let dispatchType;
    //                 switch (selectIconShow.type) {
    //                   case 'alarm': newData = [...alarmIconData]; dispatchType = 'mapRelation/queryAlarmIconData'; break;
    //                   case 'event': newData = [...eventIconData]; dispatchType = 'mapRelation/queryEventIconData'; break;
    //                   default: break;
    //                 }
    //                 for (const item of newData) {
    //                   item.isSelected = false;
    //                 }
    //                 dispatch({
    //                   type: dispatchType,
    //                   payload: newData,
    //                 });
    //                 const index = infoPops.findIndex(value => value.key === 'mapClick');
    //                 infoPops.splice(index, 1);
    //                 delete infoPopsModal.mapClick;
    //                 dispatch({
    //                   type: 'mapRelation/queryInfoPops',
    //                   payload: infoPops,
    //                 });
    //               }
    //
    //               // 获取当前点位，存储屏幕坐标及地理坐标
    //               const screenPoint = { x: e.x, y: e.y };
    //               dispatch({
    //                 type: 'map/screenPoint',
    //                 payload: screenPoint,
    //               });
    //               if (e.button === 2) {
    //                 // 判断右键，打开右键菜单,存储屏幕坐标及地理坐标
    //                 const rightScreenPoint = { x: e.x, y: e.y };
    //                 dispatch({
    //                   type: 'map/contextMenu',
    //                   payload: { left: rightScreenPoint.x, top: rightScreenPoint.y, show: true },
    //                 });
    //                 e.stopPropagation();
    //               } else { // 关闭右键菜单
    //                 dispatch({
    //                   type: 'map/contextMenu',
    //                   payload: { show: false },
    //                 });
    //               }
    //               // 圈选的弹窗
    //               const measureLayer = mapConstants.mainMap.findLayerById('圈选');
    //               if (measureLayer) {
    //                 mapConstants.mainMap.remove(measureLayer);
    //                 dispatch({
    //                   type: 'mapRelation/setSpaceQuery',
    //                   payload: { load: true, show: true, style: { left: e.screenPoint.x, top: e.screenPoint.y }, point: e.mapPoint, screenPoint: e.screenPoint },
    //                 });
    //               }
    //               // 本地图层的点击事件
    //               mapConstants.view.hitTest(e.screenPoint).then((obj) => {
    //                 const { infoPops } = this.props;
    //                 const { results } = obj;
    //                 if (results.length === 0) {
    //                   // 服务器图层点击事件
    //                   const areaLayerIds = [];
    //                   for (const layer of mapLayers.AreaLayers) {
    //                     areaLayerIds.push(layer.id);
    //                   }
    //                   searchByQuery({ geometry: e.mapPoint, layerIds: areaLayerIds }).then((res) => {
    //                     if (res[0] && res[0].feature && res[0].feature.attributes && res[0].feature.attributes.ObjCode) {
    //                       const gISCode = res[0].feature.attributes.ObjCode;
    //                       // 查询资源信息以及关联的物料信息
    //                       this.props.dispatch({
    //                         type: 'resourceTree/selectByGISCode',
    //                         payload: { gISCode },
    //                       });
    //                     }
    //                   });
    //                 }
    //                 current.graphic = results[0].graphic;
    //                 if (results.length > 0) {
    //                   const { graphic } = results[0];
    //                   // if (graphic.layer === mapConstants.mainMap.findLayerById('报警动画')) {
    //                   //   hoveringAlarm({ layer: mapConstants.mainMap.findLayerById('报警选中'), geometry: graphic.geometry, alarm: graphic.attributes, infoPops, screenPoint, dispatch });
    //                   // }
    //                   // 环保地图单独处理
    //                   if (graphic.layer === mapConstants.mainMap.findLayerById('环保专题图')) {
    //                     dispatch({
    //                       type: 'resourceTree/selectByGISCode',
    //                       payload: { gISCode: graphic.attributes.ObjCode || graphic.attributes['唯一编码'] || graphic.attributes.resourceGisCode },
    //                     });
    //                     e.stopPropagation();
    //                     return false;
    //                   }
    //
    //                   let name;
    //                   if (graphic) {
    //                     if (graphic.attributes) {
    //                       name = graphic.attributes['设备名称'] || graphic.attributes['建筑名称'] || graphic.attributes['罐区名称'] || graphic.attributes['区域名称'] || graphic.attributes['装置区名称'] || graphic.attributes['名称'];
    //                     }
    //                     // 判断实景图层是否加载
    //                     if (graphic.layer.id === '实景地图' || graphic.layer.id === '鼠标示意') {
    //                       // 切换至实景
    //                       dispatch({
    //                         type: 'map/trueMapShow',
    //                         payload: true,
    //                       });
    //                       return false;
    //                     } else if (name) {
    //                       // 添加弹窗(地图单击产生的弹窗为唯一，所以key固定)
    //                       const index = infoPops.findIndex(value => value.key === 'mapClick');
    //                       const index1 = infoPops.findIndex(value => Number(value.gISCode) === Number(graphic.attributes.ObjCode));
    //                       const pop = {
    //                         show: true,
    //                         key: 'mapClick',
    //                         gISCode: graphic.attributes.ObjCode,
    //                         uniqueKey: Math.random() * new Date().getTime(),
    //                       };
    //                       if (index1 !== -1) {
    //                         return false;
    //                       }
    //                       if (index === -1) {
    //                         infoPops.push(pop);
    //                       } else {
    //                         infoPops.splice(index, 1, pop);
    //                       }
    //                       infoPopsModal.mapClick = {
    //                         screenPoint, screenPointBefore: screenPoint, mapStyle: { width: mapConstants.view.width, height: mapConstants.view.height }, attributes: graphic.attributes, geometry: graphic.geometry, name,
    //                       };
    //                       dispatch({
    //                         type: 'mapRelation/queryInfoPops',
    //                         payload: infoPops,
    //                       });
    //                     }
    //                     if (graphic.attributes.ObjCode || graphic.attributes['唯一编码'] || graphic.attributes.resourceGisCode) {
    //                       if (graphic.attributes.isEvent) {
    //                         // 事件单独处理
    //                         this.props.dispatch({
    //                           type: 'resourceTree/selectEventByGISCode',
    //                           payload: { pageNum: 1, pageSize: 1, isQuery: true, fuzzy: false, gISCode: graphic.attributes.ObjCode || graphic.attributes['唯一编码'] || graphic.attributes.resourceGisCode, event: graphic.attributes.event },
    //                         }).then(() => {
    //                           if (this.props.resourceInfo === undefined) {
    //                             message.error('未请求到资源相关数据');
    //                           }
    //                         });
    //                       } else {
    //                         this.props.dispatch({
    //                           type: 'resourceTree/selectByGISCode',
    //                           payload: { gISCode: graphic.attributes.ObjCode || graphic.attributes['唯一编码'] || graphic.attributes.resourceGisCode },
    //                         }).then(() => {
    //                           if (this.props.resourceInfo === undefined) {
    //                             message.error('未请求到资源相关数据');
    //                           }
    //                         });
    //                       }
    //                     } else if (graphic.attributes.isConstructMonitor) {
    //                       const { list, area, keys } = graphic.attributes;
    //                       // 作业监控 单独处理
    //                       dispatch({
    //                         type: 'resourceTree/saveCtrlResourceType',
    //                         payload: '',
    //                       });
    //                       dispatch({
    //                         type: 'resourceTree/saveCtrlResourceType',
    //                         payload: 'constructMonitor',
    //                       });
    //                       dispatch({
    //                         type: 'constructMonitor/queryMapSelectedList',
    //                         payload: { list, area, keys },
    //                       });
    //                     } else if (graphic.attributes.isVocsMonitor) {
    //                       const { list, areaName, keys } = graphic.attributes;
    //                       // vocs 单独处理
    //                       dispatch({
    //                         type: 'resourceTree/saveCtrlResourceType',
    //                         payload: '',
    //                       });
    //                       dispatch({
    //                         type: 'resourceTree/saveCtrlResourceType',
    //                         payload: 'vocsMonitor',
    //                       });
    //                       dispatch({
    //                         type: 'vocsMonitor/queryMapSelectedList',
    //                         payload: { list, areaName, keys },
    //                       });
    //                     }
    //                   } else {
    //                     dispatch({
    //                       type: 'map/infoWindow',
    //                       payload: { show: false, load: false },
    //                     });
    //                   }
    //                 }
    //               });
    //             });
    //             // 禁止地图键盘事件
    //             mapConstants.view.on('key-down', (e) => {
    //               e.stopPropagation();
    //               return false;
    //             });
    //             mapConstants.view.on('drag', (evt) => {
    //               if (this.props.stopPropagation) {
    //                 evt.stopPropagation();
    //                 return false;
    //               }
    //               // 禁止鼠标旋转
    //               if (evt.button === 2) {
    //                 evt.stopPropagation();
    //               }
    //               switch (evt.action) {
    //                 case 'start': {
    //                   dispatch({
    //                     type: 'mapRelation/showPopup',
    //                     payload: false,
    //                   });
    //                 }
    //                   break;
    //                 default: break;
    //               }
    //             });
    //             mapConstants.view.on('mouse-wheel', (e) => {
    //               if (this.props.stopPropagation) {
    //                 e.stopPropagation();
    //                 return false;
    //               }
    //               if (e.deltaY > 0) {
    //                 mapConstants.view.scale += 1000;
    //               } else {
    //                 mapConstants.view.scale -= 1000;
    //               }
    //               e.stopPropagation();
    //             });
    //             mapConstants.view.watch('scale', (newScale) => {
    //               if (newScale > 13000) {
    //                 mapConstants.view.scale = 13000;
    //               } else if (newScale < 500) {
    //                 mapConstants.view.scale = 500;
    //               }
    //             });
    //             mapConstants.view.watch('stationary', (loading, stationary1, target, view) => {
    //               if (loading) {
    //                 if (mapConstants.mainMap.findLayerById('报警动画')) {
    //                   mapConstants.mainMap.reorder(mapConstants.mainMap.findLayerById('报警选中'), mapConstants.mainMap.allLayers.length - 1);
    //                   mapConstants.mainMap.reorder(mapConstants.mainMap.findLayerById('报警动画'), mapConstants.mainMap.allLayers.length - 2);
    //                 }
    //                 // 存储当前extent
    //                 if (this.props.activeKey.indexOf('homePage') !== -1) {
    //                   mapConstants.currentExtent = view.extent;
    //                 }
    //
    //                 // 弹窗处理
    //                 const { spaceQueryPop, clusterPopups, infoPops, markShow, markData, alarmIconData,
    //                   eventIconData, envIconData } = this.props;
    //                 // 弹窗
    //                 for (const item of infoPops) {
    //                   const screenPoint1 = mapConstants.view.toScreen(infoPopsModal[item.key].geometry);
    //                   infoPopsModal[item.key].screenPointBefore = screenPoint1;
    //                   infoPopsModal[item.key].screenPoint = screenPoint1;
    //                   item.uniqueKey = Math.random() * new Date().getTime();
    //                   item.show = true;
    //                 }
    //                 dispatch({
    //                   type: 'mapRelation/queryInfoPops',
    //                   payload: this.props.infoPops,
    //                 });
    //                 // 报警图标气泡
    //                 for (const item of alarmIconData) {
    //                   const { x, y } = mapConstants.view.toScreen(item.geometry);
    //                   item.style = { left: x, top: y };
    //                 }
    //                 dispatch({
    //                   type: 'mapRelation/queryAlarmIconData',
    //                   payload: alarmIconData,
    //                 });
    //                 // 事件图标气泡
    //                 for (const item of eventIconData) {
    //                   const { x, y } = mapConstants.view.toScreen(item.geometry);
    //                   item.style = { left: x, top: y };
    //                 }
    //                 dispatch({
    //                   type: 'mapRelation/queryEventIconData',
    //                   payload: eventIconData,
    //                 });
    //                 dispatch({
    //                   type: 'mapRelation/queryMapIconShow',
    //                   payload: mapConstants.view.scale < popupScale,
    //                 });
    //                 // 环保气泡窗
    //                 for (const item of envIconData) {
    //                   const { x, y } = mapConstants.view.toScreen(item.geometry);
    //                   item.style = { left: x, top: y };
    //                 }
    //                 dispatch({
    //                   type: 'mapRelation/queryEnvIconData',
    //                   payload: envIconData,
    //                 });
    //                 if (this.props.envIconShow) {
    //                   const envLayer = mapConstants.mainMap.findLayerById('环保专题图');
    //                   if (envLayer) {
    //                     envLayer.visible = true;
    //                   }
    //                 }
    //                 // 实时弹窗处理
    //                 for (const item of this.props.constantlyComponents) {
    //                   for (const device of constantlyModal[item.type].mapData) {
    //                     const screenPoint1 = mapConstants.view.toScreen(device.geometry);
    //                     device.currentStyle = { left: screenPoint1.x, top: screenPoint1.y };
    //                     device.style = { left: screenPoint1.x, top: screenPoint1.y };
    //                   }
    //                   item.uniqueKey = Math.random() * new Date().getTime();
    //                   item.show = true;
    //                 }
    //                 dispatch({
    //                   type: 'constantlyData/queryConstantlyComponents',
    //                   payload: this.props.constantlyComponents,
    //                 });
    //                 // 聚合弹窗统一更新坐标
    //                 for (const popup of clusterPopups) {
    //                   const obj = this.props[popup.type];
    //                   for (const item of obj.data) {
    //                     const screenPoint1 = mapConstants.view.toScreen(item.attributes.geometry);
    //                     item.attributes.style = { left: screenPoint1.x, top: screenPoint1.y };
    //                     item.attributes.uniqueKey = Math.random() * new Date().getTime();
    //                   }
    //                   const show = (mapConstants.view.scale > this.props.popupScale);
    //                   dispatch({
    //                     type: `mapRelation/${popup.type}`,
    //                     payload: { show, load: true, data: obj.data },
    //                   });
    //                 }
    //                 // 空间查询菜单
    //                 if (spaceQueryPop.load) {
    //                   const style = mapConstants.view.toScreen(spaceQueryPop.point);
    //                   dispatch({
    //                     type: 'mapRelation/setSpaceQuery',
    //                     payload: { load: true, show: true, style: { left: style.x, top: style.y }, point: spaceQueryPop.point, screenPoint: style },
    //                   });
    //                 }
    //                 dispatch({
    //                   type: 'mapRelation/showPopup',
    //                   payload: true,
    //                 });
    //                 // 地图标注
    //                 const newMarkData = resetMapMark(markData.data);
    //                 dispatch({
    //                   type: 'mapRelation/saveMarkData',
    //                   payload: { type: markData.type, data: newMarkData },
    //                 }).then(() => {
    //                   dispatch({
    //                     type: 'mapRelation/showMark',
    //                     payload: { show: markShow.show, load: true },
    //                   });
    //                 });
    //               } else {
    //                 dispatch({
    //                   type: 'mapRelation/showPopup',
    //                   payload: false,
    //                 });
    //                 dispatch({
    //                   type: 'mapRelation/showMark',
    //                   payload: { show: this.props.markShow.show, load: false },
    //                 });
    //                 if (this.props.envIconShow) {
    //                   const envLayer = mapConstants.mainMap.findLayerById('环保专题图');
    //                   if (envLayer) {
    //                     envLayer.visible = false;
    //                   }
    //                 }
    //               }
    //             });
    //           });
    //         }
    //       });
    //   }
    // }, 100);
    dispatch({
      type: 'homepage/getMapHeight',
      payload: { domType: 'map' },
    }
    );
  }
    test = (type) => {
      const layer = mapConstants.mainMap.findLayerById('地图标注');
      const graphic2 = layer.graphics.items.find(value => value.attributes.isTest);
      if (!graphic2) {
        return false;
      }
      // const { symbol } = graphic1;
      const { symbol } = graphic2;
      // const newGraphic1 = graphic1.clone();
      const newGraphic = graphic2.clone();
      // const g
      symbol.xoffset = symbol.xoffset || 0;
      symbol.yoffset = symbol.yoffset || 0;
      switch (type) {
        case 'x1':
          symbol.xoffset += 0.5;
          newGraphic.symbol = symbol;
          break;
        case 'x2':
          symbol.xoffset -= 0.5;
          newGraphic.symbol = symbol;
          break;
        case 'y1':
          symbol.yoffset += 0.5;
          newGraphic.symbol = symbol;
          break;
        case 'y2':
          symbol.yoffset -= 0.5;
          newGraphic.symbol = symbol;
          break;
        default: break;
      }
      symboltt = symbol;
      layer.graphics.remove(graphic2);
      // layer.graphics.remove(graphic1);
      layer.graphics.add(newGraphic);
      // layer.graphics.add(newGraphic1);
    };
  renderMap = ({ loadedModules: [MapImageLayer, Map, MapView, Extent, SpatialReference, ScaleBar], containerNode }) => {
    const { dispatch } = this.props;
    containerNode.style.height = '100%';
    // 找到底图图层
    const sublayers = [];
    const { winWidth } = getBrowserStyle();
    // 判断分辨率，确定初始显示比例，以及聚合信息显示比例（考虑性能，聚合显示比例比初始比例少4000）
    const scale = winWidth < 1700 ? 15000 : 10000;
    const popupScale = scale - 4000;
    // 需要特殊处理，放在上顶的图层
    for (const layer of mapLayers.FrontLayers) {
      sublayers.push({
        title: layer.mapLayerName,
        id: layer.id,
        visible: false,
      });
    }
    // 普通图层
    for (const layer of mapLayers.FeatureLayers) {
      sublayers.push({
        title: layer.mapLayerName,
        id: layer.id,
        visible: false,
        // visible: layer.isBaseLayer,
        maxScale: layer.isArea ? popupScale : 0, // 区域图层显示
      });
    }
    // 栅格图层
    for (const layer of mapLayers.RasterLayers) {
      sublayers.push({
        title: layer.mapLayerName,
        id: layer.id,
        visible: false,
        // visible: layer.isBaseLayer,
        // maxScale: layer.isArea ? popupScale : 0, // 区域图层显示
      });
    }
    // 切片图层
    const baseTie = mapLayers.FeatureLayers.find(value => value.isBaseLayer);
    const tileLayer = new MapImageLayer({ url: baseTie.layerAddress, id: '底图' });
    sublayers.reverse();
    const baseLayer = new MapImageLayer({ url: mapLayers.baseLayer.layerAddress, id: mapLayers.baseLayer.mapLayerName, sublayers });
    mapConstants.mainMap = new Map({
      layers: [baseLayer, tileLayer],
    });
    mapConstants.baseLayer = baseLayer;
    const extent = new Extent({
      xmin: 12748163.571481707,
      xmax: 12751351.807024846,
      ymin: 3585571.3320610607,
      ymax: 3587299.0646831924,
      spatialReference: new SpatialReference(102100),
    });
    const accessInfoExtent = new Extent({
      xmin: 12748004.159704551,
      xmax: 12751511.218802001,
      ymin: 3585484.945429954,
      ymax: 3587385.451314299,
      spatialReference: new SpatialReference(102100),
    });
    // dispatch({
    //   type: 'map/mapScale',
    //   payload: scale,
    // });
    // dispatch({
    //   type: 'map/mapPopupScale',
    //   payload: popupScale,
    // });
    mapConstants.popupScale = popupScale;
    mapConstants.extent = extent;
    mapConstants.accessInfoExtent = accessInfoExtent;
    mapConstants.view = new MapView({
      container: containerNode,
      ui: { components: [] },
      rotation: 292.7,
      padding: 320,
      extent,
      map: mapConstants.mainMap,
    });
    const scaleBar = new ScaleBar({
      container: this.scaleBarWap,
      view: mapConstants.view,
      style: 'line',
      unit: 'metric',
    });
    mapConstants.view.ui.add(
      scaleBar, {
        position: 'bottom-left',
      });
    mapConstants.view.when(() => {
      // 存储主项图层的地理信息（聚合需要用到）
      const area = mapLayers.AreaLayers[0];
      const subLayer = mapConstants.baseLayer.findSublayerById(area.id || null);
      const queryArea = subLayer.createQuery();
      queryArea.outFields = ['*'];
      subLayer.queryFeatures(queryArea).then((res) => {
        mapConstants.areaGraphics = res.features;
      });
      // 画事件图标
      const getEvent = setInterval(() => {
        if (this.props.undoneEventList.length > 0) {
          clearInterval(getEvent);
          addEventIcon(this.props.undoneEventList, dispatch);
        }
      }, 500);
      dispatch({
        type: 'map/load',
        payload: true,
      });
      mapConstants.view.on('click', (e) => {
        if (this.props.stopPropagation) {
          e.stopPropagation();
          return false;
        }
        // 存储被点击的点
        dispatch({
          type: 'map/mapPoint',
          payload: e.mapPoint,
        });
        // 首先清空报警选中
        const { selectIconShow, alarmIconData, eventIconData, infoPops, envIconData } = this.props;
        if (selectIconShow.show) {
          dispatch({
            type: 'mapRelation/querySelectIconShow',
            payload: false,
          });
          let newData;
          let dispatchType;
          switch (selectIconShow.type) {
            case 'alarm': newData = [...alarmIconData]; dispatchType = 'mapRelation/queryAlarmIconData'; break;
            case 'event': newData = [...eventIconData]; dispatchType = 'mapRelation/queryEventIconData'; break;
            case 'env': newData = [...envIconData]; dispatchType = 'mapRelation/queryEnvIconData'; break;
            default: break;
          }
          for (const item of newData) {
            item.isSelected = false;
          }
          dispatch({
            type: dispatchType,
            payload: newData,
          });
          const index = infoPops.findIndex(value => value.key === 'mapClick');
          infoPops.splice(index, 1);
          delete infoPopsModal.mapClick;
          dispatch({
            type: 'mapRelation/queryInfoPops',
            payload: infoPops,
          });
        }

        // 获取当前点位，存储屏幕坐标及地理坐标
        const screenPoint = { x: e.x, y: e.y };
        dispatch({
          type: 'map/screenPoint',
          payload: screenPoint,
        });
        if (e.button === 2) {
          // 判断右键，打开右键菜单,存储屏幕坐标及地理坐标
          const rightScreenPoint = { x: e.x, y: e.y };
          dispatch({
            type: 'map/contextMenu',
            payload: { left: rightScreenPoint.x, top: rightScreenPoint.y, show: true },
          });
          e.stopPropagation();
        } else { // 关闭右键菜单
          dispatch({
            type: 'map/contextMenu',
            payload: { show: false },
          });
        }
        // 圈选的弹窗
        const measureLayer = mapConstants.mainMap.findLayerById('圈选');
        if (measureLayer) {
          mapConstants.mainMap.remove(measureLayer);
          dispatch({
            type: 'mapRelation/setSpaceQuery',
            payload: { load: true, show: true, style: { left: e.screenPoint.x, top: e.screenPoint.y }, point: e.mapPoint, screenPoint: e.screenPoint },
          });
        }
        // 本地图层的点击事件
        mapConstants.view.hitTest(e.screenPoint).then((obj) => {
          const { infoPops } = this.props;
          const { results } = obj;
          if (results.length === 0) {
            // 服务器图层点击事件
            const areaLayerIds = [];
            for (const layer of mapLayers.AreaLayers) {
              areaLayerIds.push(layer.id);
            }
            searchByQuery({ geometry: e.mapPoint, layerIds: areaLayerIds }).then((res) => {
              if (res[0] && res[0].feature && res[0].feature.attributes && res[0].feature.attributes.ObjCode) {
                const gISCode = res[0].feature.attributes.ObjCode;
                // 查询资源信息以及关联的物料信息
                this.props.dispatch({
                  type: 'resourceTree/selectByGISCode',
                  payload: { gISCode },
                });
              }
            });
          }
          current.graphic = results[0].graphic;
          if (results.length > 0) {
            const { graphic } = results[0];
            // if (graphic.layer === mapConstants.mainMap.findLayerById('报警动画')) {
            //   hoveringAlarm({ layer: mapConstants.mainMap.findLayerById('报警选中'), geometry: graphic.geometry, alarm: graphic.attributes, infoPops, screenPoint, dispatch });
            // }
            // 环保地图单独处理
            if (graphic.layer === mapConstants.mainMap.findLayerById('环保专题图')) {
              dispatch({
                type: 'resourceTree/selectByGISCode',
                payload: { gISCode: graphic.attributes.ObjCode || graphic.attributes['唯一编码'] || graphic.attributes.resourceGisCode },
              });
              e.stopPropagation();
              return false;
            }

            let name;
            if (graphic) {
              if (graphic.attributes) {
                name = graphic.attributes['设备名称'] || graphic.attributes['建筑名称'] || graphic.attributes['罐区名称'] || graphic.attributes['区域名称'] || graphic.attributes['装置区名称'] || graphic.attributes['名称'];
              }
              // 判断实景图层是否加载
              if (graphic.layer.id === '实景地图' || graphic.layer.id === '鼠标示意') {
                // 切换至实景
                dispatch({
                  type: 'map/trueMapShow',
                  payload: true,
                });
                return false;
              } else if (name) {
                // 添加弹窗(地图单击产生的弹窗为唯一，所以key固定)
                const index = infoPops.findIndex(value => value.key === 'mapClick');
                const index1 = infoPops.findIndex(value => Number(value.gISCode) === Number(graphic.attributes.ObjCode));
                const pop = {
                  show: true,
                  key: 'mapClick',
                  gISCode: graphic.attributes.ObjCode,
                  uniqueKey: Math.random() * new Date().getTime(),
                };
                if (index1 !== -1) {
                  return false;
                }
                if (index === -1) {
                  infoPops.push(pop);
                } else {
                  infoPops.splice(index, 1, pop);
                }
                infoPopsModal.mapClick = {
                  screenPoint, screenPointBefore: screenPoint, mapStyle: { width: mapConstants.view.width, height: mapConstants.view.height }, attributes: graphic.attributes, geometry: graphic.geometry, name,
                };
                dispatch({
                  type: 'mapRelation/queryInfoPops',
                  payload: infoPops,
                });
              }
              if (graphic.attributes.ObjCode || graphic.attributes['唯一编码'] || graphic.attributes.resourceGisCode) {
                if (graphic.attributes.isEvent) {
                  // 事件单独处理
                  this.props.dispatch({
                    type: 'resourceTree/selectEventByGISCode',
                    payload: { pageNum: 1, pageSize: 1, isQuery: true, fuzzy: false, gISCode: graphic.attributes.ObjCode || graphic.attributes['唯一编码'] || graphic.attributes.resourceGisCode, event: graphic.attributes.event },
                  }).then(() => {
                    if (this.props.resourceInfo === undefined) {
                      message.error('未请求到资源相关数据');
                    }
                  });
                } else {
                  this.props.dispatch({
                    type: 'resourceTree/selectByGISCode',
                    payload: { gISCode: graphic.attributes.ObjCode || graphic.attributes['唯一编码'] || graphic.attributes.resourceGisCode },
                  }).then(() => {
                    if (this.props.resourceInfo === undefined) {
                      message.error('未请求到资源相关数据');
                    }
                  });
                }
              } else if (graphic.attributes.isConstructMonitor) {
                const { list, area, keys } = graphic.attributes;
                // 作业监控 单独处理
                dispatch({
                  type: 'resourceTree/saveCtrlResourceType',
                  payload: '',
                });
                dispatch({
                  type: 'resourceTree/saveCtrlResourceType',
                  payload: 'constructMonitor',
                });
                dispatch({
                  type: 'constructMonitor/queryMapSelectedList',
                  payload: { list, area, keys },
                });
              } else if (graphic.attributes.isVocsMonitor) {
                const { list, areaName, keys } = graphic.attributes;
                // vocs 单独处理
                dispatch({
                  type: 'resourceTree/saveCtrlResourceType',
                  payload: '',
                });
                dispatch({
                  type: 'resourceTree/saveCtrlResourceType',
                  payload: 'vocsMonitor',
                });
                dispatch({
                  type: 'vocsMonitor/queryMapSelectedList',
                  payload: { list, areaName, keys },
                });
              }
            } else {
              dispatch({
                type: 'map/infoWindow',
                payload: { show: false, load: false },
              });
            }
          }
        });
      });
      // 禁止地图键盘事件
      mapConstants.view.on('key-down', (e) => {
        e.stopPropagation();
        return false;
      });
      // 禁止地图双击事件
      mapConstants.view.on('double-click', (e) => {
        e.stopPropagation();
        return false;
      });
      mapConstants.view.on('drag', (evt) => {
        if (this.props.stopPropagation) {
          evt.stopPropagation();
          return false;
        }
        // 禁止鼠标旋转
        if (evt.button === 2) {
          evt.stopPropagation();
        }
        switch (evt.action) {
          case 'start': {
            dispatch({
              type: 'mapRelation/showPopup',
              payload: false,
            });
          }
            break;
          default: break;
        }
      });
      mapConstants.view.on('mouse-wheel', (e) => {
        if (this.props.stopPropagation) {
          e.stopPropagation();
          return false;
        }
        if (e.deltaY > 0) {
          mapConstants.view.scale += 1000;
        } else {
          mapConstants.view.scale -= 1000;
        }
        e.stopPropagation();
      });
      mapConstants.view.watch('scale', (newScale) => {
        if (newScale > 13000) {
          mapConstants.view.scale = 13000;
        } else if (newScale < 500) {
          mapConstants.view.scale = 500;
        }
      });
      mapConstants.view.watch('stationary', (loading, stationary1, target, view) => {
        if (loading) {
          if (mapConstants.mainMap.findLayerById('报警动画')) {
            mapConstants.mainMap.reorder(mapConstants.mainMap.findLayerById('报警选中'), mapConstants.mainMap.allLayers.length - 1);
            mapConstants.mainMap.reorder(mapConstants.mainMap.findLayerById('报警动画'), mapConstants.mainMap.allLayers.length - 2);
          }
          // 存储当前extent
          if (this.props.activeKey.indexOf('homePage') !== -1) {
            mapConstants.currentExtent = view.extent;
          }

          // 弹窗处理
          const { spaceQueryPop, clusterPopups, infoPops, markShow, markData, alarmIconData,
            eventIconData, envIconData } = this.props;
          // 弹窗
          for (const item of infoPops) {
            const screenPoint1 = mapConstants.view.toScreen(infoPopsModal[item.key].geometry);
            infoPopsModal[item.key].screenPointBefore = screenPoint1;
            infoPopsModal[item.key].screenPoint = screenPoint1;
            item.uniqueKey = Math.random() * new Date().getTime();
            item.show = true;
          }
          dispatch({
            type: 'mapRelation/queryInfoPops',
            payload: this.props.infoPops,
          });
          // 报警图标气泡
          for (const item of alarmIconData) {
            const { x, y } = mapConstants.view.toScreen(item.geometry);
            item.style = { left: x, top: y };
          }
          dispatch({
            type: 'mapRelation/queryAlarmIconData',
            payload: alarmIconData,
          });
          // 事件图标气泡
          for (const item of eventIconData) {
            const { x, y } = mapConstants.view.toScreen(item.geometry);
            item.style = { left: x, top: y };
          }
          dispatch({
            type: 'mapRelation/queryEventIconData',
            payload: eventIconData,
          });
          dispatch({
            type: 'mapRelation/queryMapIconShow',
            payload: mapConstants.view.scale < popupScale,
          });
          // 环保气泡窗
          for (const item of envIconData) {
            const { x, y } = mapConstants.view.toScreen(item.geometry);
            item.style = { left: x, top: y };
          }
          dispatch({
            type: 'mapRelation/queryEnvIconData',
            payload: envIconData,
          });
          if (this.props.envIconShow) {
            const envLayer = mapConstants.mainMap.findLayerById('环保专题图');
            if (envLayer) {
              envLayer.visible = true;
            }
          }
          // 实时弹窗处理
          for (const item of this.props.constantlyComponents) {
            for (const device of constantlyModal[item.type].mapData) {
              const screenPoint1 = mapConstants.view.toScreen(device.geometry);
              device.currentStyle = { left: screenPoint1.x, top: screenPoint1.y };
              device.style = { left: screenPoint1.x, top: screenPoint1.y };
            }
            item.uniqueKey = Math.random() * new Date().getTime();
            item.show = true;
          }
          dispatch({
            type: 'constantlyData/queryConstantlyComponents',
            payload: this.props.constantlyComponents,
          });
          // 聚合弹窗统一更新坐标
          for (const popup of clusterPopups) {
            const obj = this.props[popup.type];
            for (const item of obj.data) {
              const screenPoint1 = mapConstants.view.toScreen(item.attributes.geometry);
              item.attributes.style = { left: screenPoint1.x, top: screenPoint1.y };
              item.attributes.uniqueKey = Math.random() * new Date().getTime();
            }
            const show = (mapConstants.view.scale > popupScale);
            dispatch({
              type: `mapRelation/${popup.type}`,
              payload: { show, load: true, data: obj.data },
            });
          }
          // 空间查询菜单
          if (spaceQueryPop.load) {
            const style = mapConstants.view.toScreen(spaceQueryPop.point);
            dispatch({
              type: 'mapRelation/setSpaceQuery',
              payload: { load: true, show: true, style: { left: style.x, top: style.y }, point: spaceQueryPop.point, screenPoint: style },
            });
          }
          dispatch({
            type: 'mapRelation/showPopup',
            payload: true,
          });
          // 地图标注
          const newMarkData = resetMapMark(markData.data);
          dispatch({
            type: 'mapRelation/saveMarkData',
            payload: { type: markData.type, data: newMarkData },
          }).then(() => {
            dispatch({
              type: 'mapRelation/showMark',
              payload: { show: markShow.show, load: true },
            });
          });
        } else {
          dispatch({
            type: 'mapRelation/showPopup',
            payload: false,
          });
          dispatch({
            type: 'mapRelation/showMark',
            payload: { show: this.props.markShow.show, load: false },
          });
          if (this.props.envIconShow) {
            const envLayer = mapConstants.mainMap.findLayerById('环保专题图');
            if (envLayer) {
              envLayer.visible = false;
            }
          }
        }
      });
    });
  }
    render() {
      const { trueMapShow, fetchLayers, mapHeight } = this.props;
      const mapOptions = {
        url: '/mapApi/init.js',
      };
      const mapStyle = { height: mapHeight };
      return (
        !fetchLayers === '' ? null : (
          <div className={styles.warp} style={{ display: trueMapShow ? 'none' : '', height: mapHeight }} >
            <EsriLoaderReact
              options={mapOptions}
              modulesToLoad={mapModels}
              onReady={this.renderMap}
            />
            {/*<div*/}
              {/*id={this.state.mapDivId}*/}
              {/*style={mapStyle}*/}
              {/*className={styles.map}*/}
            {/*/>*/}
            <div className={styles.scalebar} ref={(ref) => { this.scaleBarWap = ref; }} />
          </div>
        ));
    }
}
