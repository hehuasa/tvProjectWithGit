import esriLoader from 'esri-loader';
// import { Notification } from 'antd';
import { mapConstants, mapLayers } from '../services/mapConstant';
import { groupingByOverview } from '../utils/alarmService';
import measureLabel from '../assets/map/tools/measureLabel.png';
import pull from '../assets/map/pull.png';
import door from '../assets/map/door.png';
import doorInfo from '../assets/map/doorInfo2.png';
import closePic from '../assets/map/tools/close.png';
import locateHover from '../assets/map/search/locate-hover.png';
import videoLegend from '../assets/map/search/video.png';
import videoLegendHover from '../assets/map/search/videoHover.png';
import video from '../assets/map/truemap/video.png';
import locate from '../assets/map/search/locate.png';
import { mapLegendList, mapLegendListWithAlarm } from '../services/mapLegendList';
import legend from '../assets/map/lengend/01.png';
import eventIcon from '../assets/map/event/eventIcon.png';
import { constantlyModal, infoPopsModal } from '../services/constantlyModal';
import moment from 'moment';
import { notification } from 'antd';

// 地图图标
export const getLayerIds = () => {
  const array = [];
  if (mapLayers.FeatureLayers.length > 0) {
    for (const layer of mapLayers.FeatureLayers) {
      const index = layer.layerAddress.indexOf('MapServer/');
      if (index !== -1) {
        const order = layer.layerAddress.substr(index + 10);
        array.push(order);
      }
    }
  }
  return array;
};
const angle = 0; // 各种符号的偏移角度
// 图例
export const addLegend = async ({ view, container, legendLayer, dispatch }) => {
  esriLoader.loadModules(
    ['esri/widgets/Legend']).then(([Legend]) => {
    const legend = new Legend({
      view,
      container,
      layerInfos: [{
        layer: legendLayer,
        title: '图例',
      }],
    });
    legend.render();
    dispatch({
      type: 'map/getLegend',
      payload: { loaded: true, show: true },
    });
  });
};
// 根据属性查询设备
export const searchByAttrBySorting = async ({ searchText, layerIds = getLayerIds(), searchFields = ['设备名称', 'ObjCode'] }) => {
  return new Promise(resolve =>
    esriLoader.loadModules(
      [
        'esri/tasks/FindTask',
        'esri/tasks/support/FindParameters',
      ]).then(([FindTask, FindParameters]) => {
      // 搜索完成的回调
      const newExtent = mapConstants.spaceQueryPolygon.type ? mapConstants.spaceQueryPolygon : mapConstants.currentExtent.expand(1.2); // 由于地图旋转的原因，范围有误差。故放大一些
      const ShowFindResult = (findTaskResult) => {
        const results = findTaskResult.results.filter(value => newExtent.contains(value.feature.geometry));
        results.sort((a, b) => {
          if (a.feature && b.feature) {
            if (a.feature.attributes && b.feature.attributes) {
              const nameA = a.feature.attributes['设备名称'] !== '空' ? a.feature.attributes['设备名称'] : a.feature.attributes['设备类型'];
              const nameB = b.feature.attributes['设备名称'] !== '空' ? b.feature.attributes['设备名称'] : b.feature.attributes['设备类型'];
              return nameA.localeCompare(nameB, 'zh');
            } else {
              return 1;
            }
          } else {
            return 1;
          }
        });
        resolve(results);
      };
      // 创建属性查询对象
      const findTask = new FindTask(mapLayers.baseLayer.layerAddress);
      // 创建属性查询参数
      const findParams = new FindParameters();
      // 返回几何信息
      findParams.returnGeometry = true;
      // 对哪一个图层进行属性查询,筛选基础图层
      findParams.layerIds = layerIds === 'all' ? getLayerIds() : layerIds;
      // 查询的字段
      findParams.searchFields = searchFields;
      findParams.searchText = searchText;
      // 执行查询对象
      findTask.execute(findParams, ShowFindResult).then(ShowFindResult);
    })
  );
};
export const searchByAttr = async ({ searchText, layerIds = getLayerIds(), searchFields = ['设备名称', 'ObjCode'] }) => {
  return new Promise(resolve =>
    esriLoader.loadModules(
      [
        'esri/tasks/FindTask',
        'esri/tasks/support/FindParameters',
      ]).then(([FindTask, FindParameters]) => {
      // 搜索完成的回调
      const ShowFindResult = (findTaskResult) => {
        resolve(findTaskResult.results);
      };
      // 创建属性查询对象
      const findTask = new FindTask(mapLayers.baseLayer.layerAddress);
      // 创建属性查询参数
      const findParams = new FindParameters();
      // 返回几何信息
      findParams.returnGeometry = true;
      // 对哪一个图层进行属性查询,筛选基础图层
      const layerIdArray = [];
      for (const id of layerIdArray) {
        const index = layerIds.indexOf(id);
        if (index !== -1) {
          layerIds.splice(index, 1);
        }
      }
      findParams.layerIds = layerIds === 'all' ? getLayerIds() : layerIds;
      // 查询的字段
      findParams.searchFields = searchFields;
      findParams.searchText = searchText;
      // 执行查询对象
      findTask.execute(findParams, ShowFindResult).then(ShowFindResult);
    })
  );
};
// 根据属性查询设备(不需要 loadModules)
export const searchByAttrNoLoadModules = async ({ searchText, layerIds = getLayerIds(), searchFields = ['ObjCode'], FindTask, FindParameters }) => {
  return new Promise((resolve) => {
    // 搜索完成的回调
    const ShowFindResult = (findTaskResult) => {
      resolve(findTaskResult.results);
    };
      // 创建属性查询对象
    const findTask = new FindTask(mapLayers.baseLayer.layerAddress);
    // 创建属性查询参数
    const findParams = new FindParameters();
    // 返回几何信息
    findParams.returnGeometry = true;
    findParams.contains = false;
    // 对哪一个图层进行属性查询,筛选基础图层
    const layerIdArray = [];
    for (const id of layerIdArray) {
      const index = layerIds.indexOf(id);
      if (index !== -1) {
        layerIds.splice(index, 1);
      }
    }
    findParams.layerIds = layerIds === 'all' ? getLayerIds() : layerIds;
    // 查询的字段
    findParams.searchFields = searchFields;
    findParams.searchText = searchText;
    // 执行查询对象
    findTask.execute(findParams, ShowFindResult).then(ShowFindResult);
  }
  );
};
// 空间查询
export const space = ({ view, geometry, ids = getLayerIds(), searchFields = ['设备名称', '设备位置', '所在单元', '分部名称', '主项名称', '装置名称'], searchText }) => {
  return new Promise((resolve) => {
    esriLoader.loadModules([
      'esri/tasks/IdentifyTask',
      'esri/tasks/support/IdentifyParameters',
    ]).then(([IdentifyTask, IdentifyParameters]) => {
      // 存储该空间查询的extent，用于地图搜索
      mapConstants.spaceQueryPolygon = geometry; // 地图旋转及坐标系转换造成的偏差
      // 通过此函数处理查询之后的信息
      const showQueryResult = ({ results }) => {
        if (results.length > 0) {
          // 根据条件图层列表和搜索关键字筛选结果
          const array = results.filter((result) => {
            // 筛选图层
            if (ids.find(value => Number(value) === result.layerId) === undefined) {
              return false;
            }
            // 筛选关键字
            if (result.feature.attributes[searchFields[0]]) {
              if (result.feature.attributes[searchFields[0]].indexOf(searchText) !== -1) {
                return true;
              }
            }
            if (result.feature.attributes[searchFields[1]]) {
              if (result.feature.attributes[searchFields[1]].indexOf(searchText) !== -1) {
                return true;
              }
            }
          });
          resolve(array);
        } else {
          resolve(results);
        }
      };
      const MapServer = mapLayers.baseLayer;
      // 定义空间查询对象，参数是整个地图服务
      const identifyTask = new IdentifyTask(MapServer.layerAddress);
      // 定义空间查询参数对象
      const params = new IdentifyParameters();
      // 容差
      params.tolerance = 5;
      // params.returnFieldName = true;
      // 是否返回几何信息
      params.returnGeometry = true;
      params.layerIds = ids;
      params.layerOption = 'all';
      // 空间查询的条件
      params.width = view.width;
      params.height = view.height;
      params.spatialReference = view.spatialReference;
      // 空间查询的几何对象
      params.geometry = geometry;
      params.mapExtent = view.extent;
      // 执行空间查询
      identifyTask.execute(params).then(showQueryResult);
    });
  });
};
// 根据地理信息查询设备
export const searchByQuery = ({ layerIds, geometry }) => {
  return new Promise((resolve) => {
    esriLoader.loadModules(['esri/tasks/IdentifyTask', 'esri/tasks/support/IdentifyParameters']).then(([IdentifyTask, IdentifyParameters]) => {
      const task = new IdentifyTask(mapLayers.baseLayer.layerAddress);
      const param = new IdentifyParameters();
      param.layerIds = layerIds;
      param.geometry = geometry;
      param.tolerance = 3;
      param.mapExtent = mapConstants.extent;
      task.execute(param).then(({ results }) => {
        resolve(results);
      });
    });
  });
};
// 添加图层
export const addLayer = async (map, ids, dispatch, maxScale, minScale) => {
  return new Promise((resolve) => {
    esriLoader.loadModules(['esri/layers/FeatureLayer']).then(([FeatureLayer]) => {
      const addLayers = [];
      const resolveLayers = {};
      for (const layer of mapLayers.FeatureLayers) {
        for (const id of ids) {
          if (id === layer.mapLayerName && map.findLayerById(id) === undefined) {
            const index = layer.layerAddress.indexOf('MapServer/');
            const order = layer.layerAddress.substr(index + 10);
            const resolveLayer = new FeatureLayer(layer.layerAddress, {
              id: layer.mapLayerName,
              maxScale: maxScale ? maxScale + 10 : 0,
              minScale: minScale || 0,
              outFields: ['*'],
            });
            addLayers.push(resolveLayer);
            resolveLayers[layer.mapLayerName] = resolveLayer;
            if (dispatch) {
              dispatch({
                type: 'map/addLayers',
                payload: layer.mapLayerName,
              });
              dispatch({
                type: 'map/addFeatureLayersIds',
                payload: id, // order属性恰好也是该图层的layerId 属性
              });
            }
            break;
          }
        }
      }
      resolve(resolveLayers);
      map.addMany(addLayers);
    });
  });
};
// 删除图层
export const delLayer = async (map, delLayers, dispatch) => {
  for (const layer of delLayers) {
    const id = layer.id || layer;
    if (id.indexOf('报警动画') === -1) {
      if (layer.id) {
        map.remove(layer);
        dispatch({
          type: 'map/delLayers',
          payload: id,
        });
      } else {
        const Layer = map.findLayerById(layer);
        if (Layer) {
          map.remove(Layer);
          if (dispatch) {
            dispatch({
              type: 'map/delLayers',
              payload: id,
            });
          }
        }
      }
    }
  }
};
// 根据popup重新查询元素返回完整的属性信息
export const queryPopupItem = async ({ layer, geometry, callBack }) => {
  return new Promise((resolve) => {
    const query = layer.createQuery();
    query.outFields = ['*'];
    query.geometry = geometry;
    layer.queryFeatures(query).then((res) => {
      resolve(res.features);
      if (callBack) {
        callBack(res.features);
      }
    });
  });
};
// 资源树在地图添加元素（新）
export const addItem = async ({ map, layers, device, id, scale }) => {
  esriLoader.loadModules([
    'esri/layers/GraphicsLayer',
    'esri/Graphic',
  ]).then(([GraphicsLayer, Graphic]) => {
    // 遍历资源树节点的关联图层节点，获取到sublayer
    let cacheLayer = map.findLayerById(id);
    if (cacheLayer === undefined) {
      cacheLayer = new GraphicsLayer({
        id,
        minScale: scale,
      });
      map.add(cacheLayer);
    }
    for (const subLayer of layers) {
      // 地图图标
      const legendObj = mapLegendList.find(value => subLayer.title.indexOf(value.name) !== -1);
      const url = legendObj ? legendObj.url : legend;
      const renderSy = {
        type: 'picture-marker',
        url,
        angle,
        width: legendObj ? '18px' : '8px',
        height: legendObj ? '18px' : '8px',
      };
      const query = subLayer.createQuery();
      query.outFields = ['*'];
      // query.text = "分部名称 like '公用%'";
      query.where = `ObjCode =${device.gISCode}`;
      subLayer.queryFeatures(query).then((res) => {
        // const renderItems = res.features.filter((value) => {
        //   return devices.find(value2 => Number(value.attributes.ObjCode) === Number(value2)) !== undefined;
        // });
        // for (const item of res.features) {
        const item = res.features[0];
        item.attributes.name = device.name;
        item.attributes.设备名称 = device.name;
        const graphic = new Graphic(item.geometry, renderSy, item.attributes);
        // graphics.push(graphic);
        // }
        cacheLayer.graphics.add(graphic);
      });
    }
  });
};
// 资源树在地图删除元素（新）
export const delItem = async ({ map, device, id, dispatch }) => {
  // 删掉对应的资源，如果资源删除完毕，则删掉图层
  const cacheLayer = map.findLayerById(id);
  if (cacheLayer) {
    const { graphics } = cacheLayer;
    const graphic = graphics.items.find(value => value.attributes.ObjCode === Number(device.gISCode));
    cacheLayer.remove(graphic);
    if (graphics.length === 0) {
      delLayer(map, [id], dispatch);
    }
  }
};
// 资源树在地图添加元素（线、面元素）（新）
export const addPolygonItem = async ({ map, layers, device, id, scale }) => {
  esriLoader.loadModules([
    'esri/layers/GraphicsLayer',
    'esri/Graphic',
  ]).then(([GraphicsLayer, Graphic]) => {
    // 遍历资源树节点的关联图层节点，获取到sublayer
    let cacheLayer = map.findLayerById(id);
    if (cacheLayer === undefined) {
      cacheLayer = new GraphicsLayer({
        id,
        minScale: scale,
      });
      map.add(cacheLayer);
    }
    for (const subLayer of layers) {
      // 地图图标
      const renderSy = {
        type: 'simple-line',
        color: '#eaf660',
        width: '2px',
        angle,
        style: 'solid',
      };
      const query = subLayer.createQuery();
      query.outFields = ['*'];
      query.where = `ObjCode =${device.gISCode}`;
      subLayer.queryFeatures(query).then((res) => {
        const item = res.features[0];
        item.attributes.name = device.name;
        item.attributes.设备名称 = device.name;
        const graphic = new Graphic(item.geometry, renderSy, item.attributes);
        cacheLayer.graphics.add(graphic);
      });
    }
  });
};
// 资源树在地图删除元素（线、面元素）（新）
export const delPolygonItem = async ({ map, device, id, dispatch }) => {
  // 删掉对应的资源，如果资源删除完毕，则删掉图层
  const cacheLayer = map.findLayerById(id);
  if (cacheLayer) {
    const { graphics } = cacheLayer;
    const graphic = graphics.items.find(value => value.attributes.ObjCode === Number(device.gISCode));
    cacheLayer.remove(graphic);
    if (graphics.length === 0) {
      delLayer(map, [id], dispatch);
    }
  }
};
// 实时专题图添加元素
export const addConstantItem = async ({ baseLayer, layers }) => {
  return new Promise((resolve) => {
    const graphics = [];
    let index = 0;
    // 遍历资源树节点的关联图层节点，获取到sublayer
    for (const layer of layers) {
      const subId = layer.layerInfo.mapLayerID;
      const subLayer = baseLayer.findSublayerById(subId);
      const query = subLayer.createQuery();
      query.outFields = ['*'];
      subLayer.queryFeatures(query).then((res) => {
        graphics.push(...res.features);
        index += 1;
        if (index === layers.length) {
          resolve(graphics);
        }
      });
    }
  });
};
// 选择（框选圈选）
export const spaceQuery = async ({ map, view, searchText, ids, dispatch, point, radius }) => {
  esriLoader.loadModules([
    'esri/widgets/Sketch/SketchViewModel',
    'esri/views/2d/draw/Draw',
    'esri/geometry/Circle',
    'esri/geometry/Polyline',
    'esri/geometry/geometryEngine',
    'esri/Graphic',
    'esri/geometry/Point',
    'esri/layers/GraphicsLayer',
    'esri/geometry/support/webMercatorUtils',
  ]).then(([SketchViewModel, Draw, Circle, Polyline, geometryEngine, Graphic, Point, GraphicsLayer, WebMercatorUtils]) => {
    // if (map.findLayerById('空间查询')) {
    //   return false;
    // }
    // const measureLayer = new GraphicsLayer({ id: '空间查询' });
    const center = { point: {}, cachePoint: {}, radius, originPoint: {} };
    // 关闭按钮
    const createCloseSy = () => {
      return {
        type: 'picture-marker', // autocasts as new SimpleMarkerSymbol()
        url: closePic,
        width: '16px',
        height: '16px',
        xoffset: 20,
        yoffset: -20,
        angle,
      };
    };
    // const copy = (data) => {
    //   return JSON.parse(JSON.stringify(data));
    // };
    // const dragPoint = {
    //   point: {},
    //   cachePoint: {},
    // }; // 拖动按钮的中心点
    // const edit = new Draw({ view });
    // const editAction = edit.create('multipoint');
    // const drawing = (x, y) => {
    //   const movePoint = WebMercatorUtils.webMercatorToGeographic(
    //     new Point({ x, y, spatialReference: view.spatialReference }));
    //     // 获取鼠标移动的偏移量，改变圆心与拖动按钮坐标
    //   const delta = { x: movePoint.latitude - center.originPoint.latitude, y: movePoint.longitude - center.originPoint.longitude };
    //   let centerX = copy(center.cachePoint.latitude); let centerY = copy(center.cachePoint.longitude); let dragX = copy(dragPoint.cachePoint.latitude); let dragY = copy(dragPoint.cachePoint.longitude);
    //   centerX += delta.x;
    //   centerY += delta.y;
    //   dragX += delta.x;
    //   dragY += delta.y;
    //   center.point.latitude = centerX;
    //   center.point.longitude = centerY;
    //   dragPoint.point.latitude = dragX;
    //   dragPoint.point.longitude = dragY;
    //
    //   createSpace();
    // };
    // editAction.on('draw-complete', (e) => {
    //   console.log('draw-complete, 已触发');
    // });
    // editAction.on('cursor-update', (e) => {
    //   if (btnDrag.isStart) {
    //     createSpace(e, 'edit');
    //   } else
    //   if (btnDrag.circleMove) {
    //     // 获取鼠标移动的偏移量，改变圆心与拖动按钮坐标
    //     drawing(e.vertices[e.vertices.length - 1][0], e.vertices[e.vertices.length - 1][1]);
    //   }
    // });
    // const pullSy = { type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
    //   url: pull,
    //   width: '47px',
    //   height: '27px',
    //   numberOfPoints: 120,
    //   angle,
    // };
    // const btnDrag = { isStart: false, isCreate: false, circleMove: false, circleLastMove: false, pointerDownFun: undefined, pointerMoveFun: undefined, pointerUpFun: undefined, dragFun: undefined };
    // // 鼠标按钮抬起事件
    // btnDrag.pointerUpFun = view.on('pointer-up', (e) => {
    //   if (btnDrag.circleMove) {
    //     btnDrag.circleMove = false;
    //     btnDrag.circleLastMove = true;
    //     const point = view.toMap(e);
    //     drawing(point.x, point.y);
    //     btnDrag.isStart = false;
    //     btnDrag.circleMove = false;
    //     dragPoint.cachePoint = dragPoint.point.clone();
    //     center.cachePoint = center.point.clone();
    //     view.hitTest(view.toScreen(center.point)).then((upResults) => {
    //       const { graphic } = upResults.results.filter((result) => {
    //         return result.graphic.attributes.isCircle === true;
    //       })[0];
    //       view.goTo({ extent: graphic.geometry.extent.expand(1.6) });
    //       dispatch({
    //         type: 'resourceTree/saveCtrlResourceType',
    //         payload: '',
    //       });
    //       dispatch({
    //         type: 'map/getRecenter',
    //         payload: true,
    //       });
    //       dispatch({
    //         type: 'map/searchDeviceBySpace',
    //         payload: { view, geometry: graphic.geometry, ids, searchText },
    //       }).then(() => {
    //         dispatch({
    //           type: 'resourceTree/saveCtrlResourceType',
    //           payload: 'searchResult',
    //         });
    //       });
    //     });
    //   }
    //   if (btnDrag.isCreate && btnDrag.isStart) {
    //     btnDrag.isStart = false;
    //     btnDrag.circleMove = false;
    //     dragPoint.cachePoint = dragPoint.point.clone();
    //     center.cachePoint = center.point.clone();
    //     view.hitTest(view.toScreen(center.point)).then((upResults) => {
    //       const { graphic } = upResults.results.filter((result) => {
    //         return result.graphic.attributes.isCircle === true;
    //       })[0];
    //       view.goTo({ extent: graphic.geometry.extent.expand(1.6) });
    //       dispatch({
    //         type: 'resourceTree/saveCtrlResourceType',
    //         payload: '',
    //       });
    //       dispatch({
    //         type: 'map/getRecenter',
    //         payload: true,
    //       });
    //       dispatch({
    //         type: 'map/searchDeviceBySpace',
    //         payload: { view, geometry: graphic.geometry, ids, searchText },
    //       }).then(() => {
    //         dispatch({
    //           type: 'resourceTree/saveCtrlResourceType',
    //           payload: 'searchResult',
    //         });
    //       });
    //     });
    //     // }
    //   }
    // });
    // // 鼠标按下事件
    // btnDrag.pointerDownFun = view.on('pointer-down', (evt) => {
    //   view.hitTest(evt).then(({ results }) => {
    //     if (results.length > 0) {
    //       // 拖动按钮
    //       const dragBtn = results.filter((result) => {
    //         return result.graphic.attributes.resizeCircle === true;
    //       })[0];
    //       if (dragBtn) {
    //         if (dragBtn.graphic) {
    //           if (!btnDrag.isStart) {
    //             btnDrag.isStart = true;
    //           }
    //           // evt.stopPropagation();
    //         }
    //       }
    //       // 拖动圆圈
    //       const circle = results.filter((result) => {
    //         return result.graphic.attributes.isCircle === true;
    //       })[0];
    //       if (circle) {
    //         if (circle.graphic) {
    //           center.originPoint = view.toMap({ x: evt.x, y: evt.y });
    //           if (!btnDrag.circleMove) {
    //             btnDrag.circleMove = true;
    //           }
    //           evt.stopPropagation();
    //         }
    //       }
    //       // 关闭按钮
    //       const close = results.filter((result) => {
    //         return result.graphic.attributes.close;
    //       })[0];
    //       if (close) {
    //         // 触发关闭
    //         delLayer(map, ['空间查询', '地图搜索结果'], dispatch);
    //         mapConstants.spaceQueryPolygon = {};
    //         dispatch({
    //           type: 'mapRelation/queryToolsBtnIndex',
    //           payload: -1,
    //         });
    //         dispatch({
    //           type: 'map/getDeviceArray',
    //           payload: [],
    //         });
    //         dispatch({
    //           type: 'map/infoWindow',
    //           payload: { show: false, load: false },
    //         });
    //         // 关闭搜索结果面板
    //         dispatch({
    //           type: 'resourceTree/saveCtrlResourceType',
    //           payload: '',
    //         });
    //         evt.stopPropagation();
    //       }
    //     }
    //   });
    // });
    // // 地图拖动事件，阻止默认事件冒泡
    // btnDrag.dragFun = view.on('drag', (evt) => {
    //   // 开始画图时禁止拖动
    //   if (btnDrag.isStart || btnDrag.circleMove) {
    //     evt.stopPropagation();
    //   }
    // });
    // let measureGraphic;
    // const createSpace = (evt, type) => {
    //   let circle;
    //   if (type === 'add') {
    //     const addPoint = evt;
    //     btnDrag.isCreate = true;
    //     center.point = addPoint;
    //     center.cachePoint = center.point.clone();
    //     // 计算偏移后的按钮坐标（拖动按钮）
    //     circle = createCircle();
    //     // circle.radius = circle.extent.xmax - circle.center.x; // 半径
    //     dragPoint.point = new Point({ x: circle.radius * Math.cos((2 * Math.PI / 360) * (360 - angle)) + evt.x,
    //       y: circle.radius * Math.sin((2 * Math.PI / 360) * (360 - angle)) + evt.y,
    //       spatialReference: view.spatialReference,
    //     });
    //     dragPoint.cachePoint = dragPoint.point.clone();
    //   } else {
    //     if (evt) {
    //       const polyline = new Polyline({
    //         paths: [[[center.point.x, center.point.y], [evt.vertices[evt.vertices.length - 1][0], evt.vertices[evt.vertices.length - 1][1]]]],
    //         spatialReference: view.spatialReference,
    //       });
    //       const length = geometryEngine.geodesicLength(polyline, 'meters') / 0.857509464888563;
    //       if (Math.round(length) < 50) {
    //         return false;
    //       }
    //       dragPoint.point = new Point({ x: evt.vertices[evt.vertices.length - 1][0], y: evt.vertices[evt.vertices.length - 1][1], spatialReference: view.spatialReference });
    //     }
    //     const polyline = new Polyline({
    //       paths: [[[center.point.x, center.point.y], [dragPoint.point.x, dragPoint.point.y]]],
    //       spatialReference: view.spatialReference,
    //     });
    //     center.radius = geometryEngine.geodesicLength(polyline, 'meters') / 0.857509464888563;
    //     measureLayer.graphics.removeAll();
    //     circle = createCircle();
    //   }
    //   measureGraphic = new Graphic(circle, {
    //     type: 'simple-fill', // autocasts as new SimpleFillSymbol()
    //     color: [255, 1, 5, 0.2],
    //     style: 'solid',
    //     outline: { // autocasts as new SimpleLineSymbol()
    //       color: [255, 1, 5, 1],
    //       width: 1,
    //     },
    //   }, { isCircle: true });
    //   const length = Math.round(center.radius);
    //   const btn = new Graphic(dragPoint.point, pullSy, { resizeCircle: true });
    //   const close = new Graphic(
    //     dragPoint.point, createCloseSy(), { close: true });
    //   const textSy = {
    //     type: 'text', // autocasts as new TextSymbol()
    //     color: 'rgba(116, 194, 235, 1)',
    //     haloColor: 'black',
    //     haloSize: '1px',
    //     text: `${length > 50 ? length : 50}米`,
    //     xoffset: 40,
    //     yoffset: 0,
    //     angle,
    //     font: { // autocast as new Font()
    //       size: 12,
    //       family: 'sans-serif',
    //       weight: 'bold',
    //     },
    //   };
    //   const lengthGraph = new Graphic(dragPoint.point, textSy, { });
    //
    //   measureLayer.graphics.add(measureGraphic);
    //   measureLayer.graphics.add(btn);
    //   measureLayer.graphics.add(close);
    //   measureLayer.graphics.add(lengthGraph);
    //   if (type === 'add') {
    //     console.log('circle', circle);
    //     view.goTo({ extent: circle.extent.expand(1.6) });
    //     dispatch({
    //       type: 'resourceTree/saveCtrlResourceType',
    //       payload: '',
    //     });
    //     dispatch({
    //       type: 'map/getRecenter',
    //       payload: true,
    //     });
    //     dispatch({
    //       type: 'map/searchDeviceBySpace',
    //       payload: { view, geometry: circle, ids, searchText },
    //     }).then(() => {
    //       dispatch({
    //         type: 'resourceTree/saveCtrlResourceType',
    //         payload: 'searchResult',
    //       });
    //     });
    //   }
    // };
    // // 鼠标指针移动事件，改变鼠标样式
    // btnDrag.pointerMoveFun = view.on('pointer-move', (evt) => {
    //   view.hitTest(evt).then(({ results }) => {
    //     if (results.length > 0) {
    //       const resultM = results.filter((result) => {
    //         return result.graphic.attributes.resizeCircle === true;
    //       })[0];
    //       if (!btnDrag.isOnBtn) {
    //         if (resultM) {
    //           evt.native.target.style.cursor = 'pointer';
    //         } else {
    //           evt.native.target.style.cursor = 'default';
    //         }
    //       }
    //     } else {
    //       evt.native.target.style.cursor = 'default';
    //     }
    //   });
    // });
    // // 画圆
    // const createCircle = () => {
    //   return new Circle({
    //     center: center.point,
    //     radius: center.radius > 50 ? center.radius : 50,
    //     radiusUnit: 'meters',
    //     // geodesic: true,
    //     spatialReference: view.spatialReference,
    //   });
    // };
    if (map.findLayerById('空间查询')) {
      return false;
    }
    const spaceLayer = new GraphicsLayer({ id: '空间查询' });
    let sketchViewModel, centerGraphic, edgeGraphic, polylineGraphic, bufferGraphic,
      centerGeometryAtStart, labelGraphic;
    let unit = 'meters';
    const onMove = (event) => {
      // If the edge graphic is moving, keep the center graphic
      // at its initial location. Only move edge graphic
      if (event.toolEventInfo && event.toolEventInfo.mover.attributes) {
        const toolType = event.toolEventInfo.type;
        console.log('toolType', toolType);
        if (toolType === "move-stop") {
                dispatch({
                  type: 'resourceTree/saveCtrlResourceType',
                  payload: '',
                });
                dispatch({
                  type: 'map/getRecenter',
                  payload: true,
                });
                dispatch({
                  type: 'map/searchDeviceBySpace',
                  payload: { view, geometry: bufferGraphic.geometry, ids, searchText },
                }).then(() => {
                  dispatch({
                    type: 'resourceTree/saveCtrlResourceType',
                    payload: 'searchResult',
                  });
                });
        }
        if (event.toolEventInfo.mover.attributes.edge) {
          if (toolType === "move-start") {
            centerGeometryAtStart = centerGraphic.geometry;
          }
          // keep the center graphic at its initial location when edge point is moving
          else if (toolType === "move" || toolType === "move-stop") {
            centerGraphic.geometry = centerGeometryAtStart;
          }
        }
      }
      // the center or edge graphic is being moved, recalculate the buffer
      const vertices = [
        [centerGraphic.geometry.x, centerGraphic.geometry.y],
        [edgeGraphic.geometry.x, edgeGraphic.geometry.y]
      ];

      // client-side stats query of features that intersect the buffer
      calculateBuffer(vertices);

      // user is clicking on the view... call update method with the center and edge graphics
      if ((event.state === "cancel" || event.state === "complete")) {
        sketchViewModel.update([edgeGraphic, centerGraphic], {
          tool: "move"
        });
      }
    };
    const labelLength = (geom, length) => {
      return new Graphic({
        geometry: geom,
        symbol: {
          type: "text",
          color: "#FFEB00",
          text: length.toFixed(2) + " kilometers",
          xoffset: 50,
          yoffset: 10,
          font: { // autocast as Font
            size: 14,
            family: "sans-serif"
          }
        }
      });
    };
    const calculateBuffer = (vertices) => {
      // Update the geometry of the polyline based on location of edge and center points
      polylineGraphic.geometry = new Polyline({
        paths: vertices,
        spatialReference: view.spatialReference
      });
      // Recalculate the polyline length and buffer polygon
      const length = geometryEngine.geodesicLength(polylineGraphic.geometry,
        unit);
      const buffer = geometryEngine.geodesicBuffer(centerGraphic.geometry,
        length, unit);
      // Update the buffer polygon
      bufferGraphic.geometry = buffer;

      // Query female and male age groups of the census tracts that intersect
      // the buffer polygon on the client
      // Update label graphic to show the length of the polyline
      labelGraphic.geometry = edgeGraphic.geometry;
      labelGraphic.symbol = {
        type: "text",
        color: 'rgba(116, 194, 235, 1)',
        text: length.toFixed(2) + " 米",
            haloColor: 'black',
            haloSize: '1px',
        xoffset: 50,
        yoffset: 10,
        font: {
          size: 12,
          family: "sans-serif",
          weight: 'bold',
        }
      }
    };
    const drawBufferPolygon = (spaceLayer) => {
      const centerPoint = point;
      const buffer = geometryEngine.geodesicBuffer(centerPoint, radius,
        unit);
      const ring = buffer.rings[0];
      const edgePoint = new Point(ring[23][0], ring[23][1], view.spatialReference);

      // Store updated vertices
      const vertices = [
        [centerPoint.x, centerPoint.y],
        [edgePoint.x, edgePoint.y]
      ];

      // Create center, edge, polyline and buffer graphics for the first time
      if (!centerGraphic) {
        const polyline = new Polyline({
          paths: vertices,
          spatialReference: view.spatialReference
        });
        // Create the graphics representing the line and buffer
        const pointSymbol = {
          type: "simple-marker",
          style: "circle",
          size: 10,
          color: [0, 255, 255, 0.5]
        };
        centerGraphic = new Graphic({
          geometry: centerPoint,
          symbol: pointSymbol,
          attributes: {
            center: "center"
          }
        });

        edgeGraphic = new Graphic({
          geometry: edgePoint,
          symbol: pointSymbol,
          attributes: {
            edge: "edge"
          }
        });

        polylineGraphic = new Graphic({
          geometry: polyline,
          symbol: {
            type: "simple-line",
            color: 'red',
            width: 2.5
          }
        });
        bufferGraphic = new Graphic({
          geometry: buffer,
          symbol: {
            type: "simple-fill",
            color: [255, 1, 5, 0.2],
            outline: {
              color: [255, 1, 5, 1],
              width: 1,
            }
          }
        });
        labelGraphic = labelLength(edgePoint, radius);
        view.goTo({ extent: buffer.extent.expand(1.6)}).then(() => {
          // Add graphics to layer
          spaceLayer.addMany([centerGraphic, edgeGraphic]);
          // once center and edge point graphics are added to the layer,
          // call sketch's update method pass in the graphics so that users
          // can just drag these graphics to adjust the buffer
          setTimeout(function() {
            sketchViewModel.update([edgeGraphic, centerGraphic], {
              tool: "move"
            });
          }, 1000);

          spaceLayer.addMany([bufferGraphic, polylineGraphic,
            labelGraphic
          ]);
          dispatch({
            type: 'resourceTree/saveCtrlResourceType',
            payload: '',
          });
          dispatch({
            type: 'map/getRecenter',
            payload: true,
          });
          dispatch({
            type: 'map/searchDeviceBySpace',
            payload: { view, geometry: bufferGraphic.geometry, ids, searchText },
          }).then(() => {
            dispatch({
              type: 'resourceTree/saveCtrlResourceType',
              payload: 'searchResult',
            });
          });
        })

      }
      // Move the center and edge graphics to the new location returned from search
      else {
        centerGraphic.geometry = centerPoint;
        edgeGraphic.geometry = edgePoint;
      }

      // Query features that intersect the buffer
      calculateBuffer(vertices);
    }
    spaceLayer.on('layerview-create', () => {
      sketchViewModel = new SketchViewModel({
        view: view,
        layer: spaceLayer,
      });
      // sketchViewModel.updateOnGraphicClick = false;
      drawBufferPolygon(spaceLayer);
      sketchViewModel.on("update", onMove);
    });
    // spaceLayer.on('layerview-destroy', () => {
    //   // editAction.complete();
    //   // editAction.destroy();
    //   // edit.complete();
    //   // edit.destroy();
    //   // 立即清除鼠标事件，会导致鼠标样式的设置一起丢失。所以延时清除（arcgis的bug）
    //   setTimeout(() => {
    //     // btnDrag.pointerMoveFun.remove();
    //     // btnDrag.pointerUpFun.remove();
    //     // btnDrag.pointerDownFun.remove();
    //     // if (btnDrag.dragFun) { btnDrag.dragFun.remove(); }
    //   }, 5000);
    // });
    map.add(spaceLayer);
  });
};
// 选择（框选圈选）
export const select = async ({ map, view, dispatch }) => {
  esriLoader.loadModules([
    'esri/views/2d/draw/Draw',
    'esri/Graphic',
    'esri/geometry/Point',
    'esri/layers/GraphicsLayer',
  ]).then(([Draw, Graphic, Point, GraphicsLayer]) => {
    let action;
    const measureLayer = new GraphicsLayer({ id: '圈选' });
    measureLayer.on('layerview-create', () => {
      const labeling = (poinT) => {
        const graphic = new Graphic(
          poinT,
          {
            type: 'text',
            color: 'red',
            haloColor: 'black',
            haloSize: '1px',
            text: '点击确定搜索中心与筛选范围',
            xoffset: '-20px',
            yoffset: '-20px',
            angle,
            font: {
              size: 12,
              family: 'sans-serif',
            },
          }, { isText: true }
        );
        measureLayer.graphics.add(graphic);
      };
      const toolBar = new Draw({ view });
      // 激活绘图工具(根据参数决定图形)
      view.focus();
      action = toolBar.create('polygon');
      action.on('cursor-update', (e) => {
        measureLayer.graphics.removeAll();
        const point = new Point({
          x: e.vertices[e.vertices.length - 1][0],
          y: e.vertices[e.vertices.length - 1][1],
          spatialReference: view.spatialReference,
        });
        labeling(point);
      });
      action.on('vertex-add', (e) => {
        const point = new Point({
          x: e.vertices[e.vertices.length - 1][0],
          y: e.vertices[e.vertices.length - 1][1],
          spatialReference: view.spatialReference,
        });
        const screenPoint = view.toScreen(point);
        map.remove(measureLayer);
        dispatch({
          type: 'mapRelation/setSpaceQuery',
          payload: { load: true, show: true, style: { left: screenPoint.x, top: screenPoint.y }, point, screenPoint },
        });
        action.complete();
        action.destroy();
      });
    });
    measureLayer.on('layerview-destroy', () => {
      action.complete();
      action.destroy();
    });
    map.add(measureLayer);
  });
};
// 测量
export const measure = async (map, view, para, dispatch, handleMeasure) => {
  esriLoader.loadModules([
    'esri/widgets/Sketch/SketchViewModel',
    'esri/views/2d/draw/Draw',
    'esri/geometry/Polyline',
    'esri/geometry/geometryEngine',
    'esri/Graphic',
    'esri/geometry/Point',
    'esri/geometry/Polygon',
    'esri/layers/GraphicsLayer',
  ]).then(([SketchViewModel, Draw, Polyline, geometryEngine, Graphic, Point, Polygon, GraphicsLayer]) => {
    if (map.findLayerById('测量')) {
      return false;
    }
    const closeSy = {
      type: 'simple-marker',
      color: 'rgba(0,0,0,0)',
      size: 5,
      outline: null
    };
    const measureLayer = new GraphicsLayer({ id: '测量' });
    let close = new Graphic(
      view.center.clone(), closeSy, { close: true }
      );
    measureLayer.add(close);
    // 关闭按钮
    const closeMeasure = view.on('click', (e) => {
      view.hitTest(e).then(({ results }) => {
        console.log(measureLayer.graphics);
        if (results[0]) {
          if (results[0].graphic) {
            if (results[0].graphic.attributes) {
              if (results[0].graphic.attributes.close) {
                clearLayer(map, dispatch);
                handleMeasure('showMeasure', '');
                closeMeasure.remove();
                dispatch({
                  type: 'mapRelation/queryToolsBtnIndex',
                  payload: -1,
                });
              }
            }
          }
        }
      });
    });
    view.focus();
    measureLayer.on('layerview-create', () => {
      // 定义绘图对象
      const toolBar = new SketchViewModel({
        layer: measureLayer,
        view,
      });
      toolBar.updateOnGraphicClick = false;
      toolBar.create(para, { mode: "click" });
      toolBar.polylineSymbol = {
        type: "simple-line",
        color: 'red',
        width: 2
      };
      toolBar.polygonSymbol = {
        type: 'simple-fill',
        color: 'rgba(247,126,75, 0.6)',
        style: 'solid',
        outline: {
          color: 'red',
          width: 1,
        },
      };
      // 画图与测量
      switch (para) {
        case 'polyline':
          toolBar.on("create", function(event) {
            switch (event.state) {
              case 'start':
              break;
              case 'active':
              {
                const { toolEventInfo } = event;
                const { type }  = toolEventInfo;
                if (type === 'vertex-add') {
                  const lineLength = Math.round(geometryEngine.geodesicLength(event.graphic.geometry, 'meters'));
                  handleMeasure('meters',`${lineLength}米`);
                }
              }
                break;
              case 'complete':
              {
                const { geometry } = event.graphic;
                close.geometry = new Point(geometry.paths[0][geometry.paths[0].length - 1][0], geometry.paths[0][geometry.paths[0].length - 1][1], view.spatialReference);
                close.symbol = {
                  type: 'picture-marker',
                  url: closePic,
                  width: '16px',
                  height: '16px',
                  yoffset: '-12px',
                  xoffset: '-12px',
                  angle,
                };
                toolBar.cancel();
              }
              break;
            }
          });
          break;
        case 'polygon':
          toolBar.on("create", function(event) {
            switch (event.state) {
              case 'start':
                break;
              case 'active':
              {
                const { toolEventInfo } = event;
                const { added, type }  = toolEventInfo;
                if (type === 'vertex-add') {
                  const area = geometryEngine.geodesicArea(event.graphic.geometry, 'square-meters');
                  handleMeasure('areas',`${area}平米`);
                }
              }
                break;
              case 'complete':
              {
                const { geometry } = event.graphic;
                close.geometry = new Point(geometry.rings[0][geometry.rings[0].length - 1][0], geometry.rings[0][geometry.rings[0].length - 1][1], view.spatialReference);
                close.symbol = {
                  type: 'picture-marker',
                  url: closePic,
                  width: '16px',
                  height: '16px',
                  yoffset: '-12px',
                  xoffset: '-12px',
                  angle,
                };
                toolBar.cancel();
              }
                break;
            }
          });
      }
    });
    mapConstants.mainMap.add(measureLayer);
  });
};
// 周边查询
export const perimeter = async (map, point, ids, centerRadius, dispatch) => {
  esriLoader.loadModules([
    'esri/geometry/Circle',
    'esri/layers/GraphicsLayer', 'esri/Graphic',
    'esri/symbols/SimpleFillSymbol', 'esri/symbols/SimpleLineSymbol', 'esri/Color',
  ]).then(([Circle, GraphicsLayer, Graphic, SimpleFillSymbol, SimpleLineSymbol, Color]) => {
    let perimeterLayer = map.findLayerById('周边查询');
    if (perimeterLayer === undefined) {
      perimeterLayer = new GraphicsLayer({ id: '周边查询' });
    } else {
      perimeterLayer.clear();
    }
    const cirlce = new Circle(point, {
      radius: centerRadius });
    const fill = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
      new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
        new Color([116, 194, 235]), 0.5), new Color([184, 198, 227, 0.5])
    );
    const graphic = new Graphic(cirlce, fill, {});
    perimeterLayer.add(graphic);
    map.add(perimeterLayer);
    space(map, cirlce, ids).then((res) => {
      dispatch({
        type: 'map/getRecenter',
        payload: true,
      });
      map.setExtent(cirlce.extent.expand(1.5)).then(() => {
        dispatch({
          type: 'map/mapBoardShow',
          payload: { searchResult: true, resourceInfo: false, alarmBoard: false },
        });
        dispatch({
          type: 'map/getDeviceArray',
          payload: res,
        });
        dispatch({
          type: 'resourceTree/saveCtrlResourceType',
          payload: 'searchResult',
        });
      }
      );
    });
  });
};
// 查询设备并定位
export const locateDevice = async (map, baseLayer, searchText) => {
  return new Promise((resolve) => {
    searchByAttr({ baseLayer: baseLayer.layerAddress, searchText, layerIds: [52] }).then((res) => {
      resolve(res);
    });
  });
};
// 报警总览图层鼠标效果
export const areaEvents = async (map, geometry, attr, scale) => {
  esriLoader.loadModules([
    'esri/layers/GraphicsLayer',
    'esri/Graphic',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleFillSymbol',
    'esri/Color']).then(([GraphicsLayer, Graphic, SimpleLineSymbol, SimpleFillSymbol, Color]) => {
    // 添加临时图层，显示装置分区的高亮效果、聚合信息等
    let areaLayer = map.findLayerById('分区聚合');
    if (!areaLayer) {
      areaLayer = new GraphicsLayer({ id: '分区聚合', maxScale: scale + 10 });
      map.add(areaLayer);
    }
    areaLayer.graphics.removeAll();
    // 创建线符号
    const lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([254, 1, 0]), 1);
    // 创建面符号
    const fill = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, lineSymbol, new Color([245, 225, 221]));
    const hoverGraphic = new Graphic(geometry, fill, attr);
    areaLayer.graphics.add(hoverGraphic);
  });
};
// 报警总览图层报警统计弹窗
export const alarmCounting = async (map, view, dispatch, alarms, layer, graphics, alarmTypeList) => {
  // 找到装置分区图层 的各个装置，添加一个 统计弹窗
  esriLoader.loadModules([
    'esri/Graphic',
    'esri/layers/GraphicsLayer',
  ]).then(([Graphic, GraphicsLayer]) => {
    const countingLayer = new GraphicsLayer({ id: '报警统计标识', maxScale: layer.maxScale, minScale: layer.minScale });
    const countingDetailLayer = new GraphicsLayer({ id: '报警统计详情', maxScale: layer.maxScale, minScale: layer.minScale });
    map.add(countingLayer);
    map.add(countingDetailLayer);
    const countingLayerMove = view.on('pointer-move', (e) => {
      view.hitTest(e).then((a) => {
        if (a.results.length > 0) {
          const counting = a.results.filter((result) => {
            return result.graphic.layer === countingLayer;
          })[0];
          if (counting) {
            countingDetailLayer.graphics.removeAll();
            const textGraphic = new Graphic(
              counting.mapPoint,
              {
                type: 'text', // autocasts as new SimpleMarkerSymbol()
                haloColor: 'black',
                haloSize: '1px',
                color: 'blue',
                size: '40px', // pixels
                angle,
                xoffset: '-25px',
                yoffset: '-25px',
                text: `火灾： ${counting.graphic.attributes.fire} 气体： ${counting.graphic.attributes.gas} 其他： ${counting.graphic.attributes.other} `,
                font: {
                  size: 12,
                  family: 'sans-serif',
                  weight: 'bolder',
                },
              },
            );
            countingDetailLayer.graphics.add(textGraphic);
          } else {
            countingDetailLayer.graphics.removeAll();
          }
        } else {
          countingDetailLayer.graphics.removeAll();
        }
      });
    });
    const countingLayerClick = view.on('click', (e) => {
      view.hitTest(e).then((a) => {
        if (a.results.length > 0) {
          const { graphic } = a.results.filter((result) => {
            return result.graphic.layer === countingLayer;
          })[0];
          if (graphic) {
            view.goTo({ extent: graphic.attributes.extent });
          }
        }
        e.stopPropagation();
      });
    });
    const data = [];
    for (const [key, value] of Object.entries(alarms)) {
      for (const graphic of graphics) {
        if (Number(graphic.attributes.ObjCode) === Number(value[0].areaGisCode)) {
          const deviceName = graphic.attributes['装置区名称'];
          const geometry = graphic.geometry.centroid;
          const extent = graphic.geometry.extent;
          const attributes = { deviceName, fire: 0, gas: 0, other: 0, total: value.length, geometry, extent };
          // 获取报警统计数量
          for (const alarm of value) {
            const item = alarmTypeList.find(value2 => value2.profession === alarm.alarmType.profession);
            if (item) {
              if (item.alarmTypeName.indexOf('火') !== -1) {
                attributes.fire += 1;
              } else
              if (item.alarmTypeName.indexOf('气') !== -1) {
                attributes.gas += 1;
              } else {
                attributes.other += 1;
              }
            }
            // switch (alarm.alarmType.profession) {
            //   case '101.101.100': attributes.fire += 1; break;
            //   case '101.107.101': attributes.gas += 1; break;
            //   default: attributes.other += 1; break;
            // }
          }
          const screenPoint = view.toScreen(geometry);
          const style = { left: screenPoint.x, top: screenPoint.y };
          const id = Math.random(new Date().getTime()) * Math.random();
          data.push({ style, currentStyle: style, id, attributes });
          // 添加统计标识
          const PointGraphic = new Graphic(
            geometry,
            {
              type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
              style: 'circle',
              color: 'red',
              size: '40px', // pixels
              outline: { // autocasts as new SimpleLineSymbol()
                color: 'red',
                width: 1, // points
              },
            },
            attributes
          );
          const NumGraphic = new Graphic(
            geometry,
            {
              type: 'text', // autocasts as new SimpleMarkerSymbol()
              haloColor: 'black',
              haloSize: '1px',
              color: 'white',
              size: '40px', // pixels
              angle,
              xoffset: '-5px',
              yoffset: '-3px',
              text: value.length,
              font: {
                size: 12,
                family: 'sans-serif',
                weight: 'bolder',
              },
            },
            attributes
          );
          countingLayer.graphics.add(PointGraphic);
          countingLayer.graphics.add(NumGraphic);
        }
      }
    }
    countingLayer.on('layerview-destroy', () => {
      countingLayerMove.remove();
      countingLayerClick.remove();
    });
  });
};
// 聚合
export const clustering = async ({ view, dispatch, alarms, graphics, overviewShow, clusterRes, popupScale, resourceGroupByArea }) => {
  // 按区域将设备统计信息转为对象,并做统计
  const deviceObj = {};
  if (clusterRes.length > 0) {
    for (const item of resourceGroupByArea) {
      // const type = deviceCtrlType[item.ctrlType];
      const type = clusterRes.find(value => value.ctrlType === item.ctrlType);
      if (type) {
        if (deviceObj[item.gISCode]) {
          deviceObj[item.gISCode].count += item.num;
          deviceObj[item.gISCode].data.push({
            name: type.name,
            value: item.num,
          });
        } else {
          deviceObj[item.gISCode] = { count: 0, data: [] };
          deviceObj[item.gISCode].count += item.num;
          deviceObj[item.gISCode].data.push({
            name: type.name,
            value: item.num,
          });
        }
      }
    }
  }
  const data = [];
  for (const graphic of graphics) {
    // 位置、地理信息
    const geometry = graphic.geometry.centroid;
    const { extent } = graphic.geometry;
    const screenPoint = view.toScreen(geometry);
    const style = { left: screenPoint.x - 20, top: screenPoint.y - 20 };
    const key = Math.random() * new Date().getTime();
    const attributes = { geometry, extent, style, key, uniqueKey: key };
    // 报警统计信息筛查
    const areaAlarms = alarms.filter((value) => {
      return Number(value.areaGisCode) === Number(graphic.attributes.ObjCode);
    });
    attributes.alarms = {};
    attributes.alarms.count = areaAlarms.length;
    if (attributes.alarms.count > 0) {
      const { count } = groupingByOverview({ para: overviewShow, alarms: areaAlarms });
      attributes.alarms.data = [{ name: '安全报警', value: count.safetyCount }, { name: '环保报警', value: count.envCount }, { name: '故障报警', value: count.faultCount }];
    } else {
      attributes.alarms.data = [];
    }
    // 设备信息筛查
    // 取出该区域的设备
    attributes.devices = deviceObj[Number(graphic.attributes.ObjCode)] || { count: 0, data: [] };
    data.push(attributes);
  }
  dispatch({
    type: 'map/queryClusterPopup',
    payload: { show: (view.scale > popupScale), load: true, data },
  });
};
// 报警聚合
export const alarmClustering = async ({ view, dispatch, alarms, graphics, overviewShow, popupScale }) => {
  const data = [];
   for (const graphic of graphics) {
    const obj = {};
    // 位置、地理信息
    const geometry = graphic.geometry.centroid;
    const { extent } = graphic.geometry;
    const screenPoint = mapConstants.view.toScreen(geometry);
    const style = { left: screenPoint.x, top: screenPoint.y };
    const key = Math.random() * new Date().getTime();
    obj.attributes = { geometry, extent, style, key, uniqueKey: key, area: graphic.geometry };
    // 报警统计信息筛查
    const areaAlarms = alarms.filter((value) => {
      return Number(value.areaGisCode) === Number(graphic.attributes.ObjCode);
    });
    obj.attributes.alarms = {};
    obj.attributes.alarms.count = areaAlarms.length;
    if (obj.attributes.alarms.count > 0) {
      const { count } = groupingByOverview({ para: overviewShow, alarms: areaAlarms });
      obj.attributes.alarms.data = [{ name: '安全报警', value: count.safetyCount }, { name: '环保报警', value: count.envCount }, { name: '故障报警', value: count.faultCount }];
      data.push(obj);
    }
  }
  await dispatch({
    type: 'mapRelation/addClusterPopup',
    payload: { type: 'alarmClusterPopup', data: { show: (mapConstants.view.scale > popupScale), load: true, data } },
  });
};
// 资源聚合
export const resourceClustering = async ({ view, dispatch, graphics, clusterRes, popupScale, resourceGroupByArea }) => {
  // 按区域将设备统计信息转为对象,并做统计
  const deviceObj = {};
  if (clusterRes.length > 0) {
    for (const item of resourceGroupByArea) {
      // const type = deviceCtrlType[item.ctrlType];
      const type = clusterRes.find(value => value.ctrlType === item.ctrlType);
      if (type) {
        if (deviceObj[item.gISCode]) {
          deviceObj[item.gISCode].count += item.num;
          deviceObj[item.gISCode].data.push({
            name: type.name,
            value: item.num,
          });
        } else {
          deviceObj[item.gISCode] = { count: 0, data: [] };
          deviceObj[item.gISCode].count += item.num;
          deviceObj[item.gISCode].data.push({
            name: type.name,
            value: item.num,
          });
        }
      }
    }
  }
  const data = [];
  for (const graphic of graphics) {
    // 取出该区域的设备
    if (deviceObj[Number(graphic.attributes.ObjCode)]) {
      // 位置、地理信息
      const obj = {};
      const geometry = graphic.geometry.centroid;
      const { extent } = graphic.geometry;
      const screenPoint = view.toScreen(geometry);
      const style = { left: screenPoint.x, top: screenPoint.y };
      const key = Math.random() * new Date().getTime();
      obj.attributes = { geometry, extent, style, key, uniqueKey: key, area: graphic.geometry };
      obj.attributes.devices = deviceObj[Number(graphic.attributes.ObjCode)];
      data.push(obj);
    }
  }
  dispatch({
    type: 'mapRelation/addClusterPopup',
    payload: { type: 'resourceClusterPopup', data: { show: (view.scale > popupScale), load: true, data } },
  });
};
// 实时专题图
// export const constantlyInfo = async (map, view, dispatch, devices, type, constantlyComponents, domType, scale, disablePop) => {
//   esriLoader.loadModules([
//     'esri/layers/GraphicsLayer',
//     'esri/symbols/PictureMarkerSymbol',
//     'esri/symbols/SimpleFillSymbol',
//     'esri/symbols/SimpleLineSymbol',
//     'esri/Color',
//     'esri/Graphic',
//   ]).then(([GraphicsLayer, PictureMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, Color, Graphic]) => {
//     // 找到装置分区图层 的各个装置，添加一个 统计弹窗
//     let constantlyLayer; let pictureMarkerSymbol;
//     const addConstantlyLayer = (_type, noIcon) => {
//       let height;
//       if (noIcon) {
//         height = 0;
//       } else {
//         height = '40px';
//       }
//       pictureMarkerSymbol = new PictureMarkerSymbol({ url: noAlarm, width: '25px', height, angle });
//       constantlyLayer = map.findLayerById(`${_type}专题图`);
//       if (!constantlyLayer) {
//         constantlyLayer = new GraphicsLayer({ id: `${_type}专题图`, minScale: scale });
//         map.add(constantlyLayer);
//         view.on('click', (e) => {
//           view.hitTest(e).then(({ results }) => {
//             if (results.length > 0) {
//               const { graphic } = results.filter((result) => {
//                 return result.graphic.layer === constantlyLayer;
//               })[0];
//               if (graphic) {
//                 dispatch({
//                   type: 'resourceTree/selectByGISCode',
//                   payload: { pageNum: 1, pageSize: 1, isQuery: true, fuzzy: false, gISCode: graphic.attributes.gISCode },
//                 });
//               }
//             }
//           });
//         });
//       } else {
//         constantlyLayer.graphics.removeAll();
//       }
//     };
//     switch (domType) {
//       case 'constantly':
//         addConstantlyLayer(type);
//         break;
//       case 'GasConstantly':
//         addConstantlyLayer(type);
//         break;
//       case 'EnvConstantly':
//         addConstantlyLayer(type);
//         break;
//       case 'GuardAreaConstantly':
//         addConstantlyLayer(type, true);
//         break;
//       case 'GuardDoorConstantly':
//         pictureMarkerSymbol = new PictureMarkerSymbol({ url: door, width: '25px', height: '40px', angle });
//         constantlyLayer = map.findLayerById(`${type}专题图`);
//         if (!constantlyLayer) {
//           constantlyLayer = new GraphicsLayer({ id: `${type}专题图`, minScale: 10000 });
//           map.add(constantlyLayer);
//           view.on('click', (e) => {
//             view.hitTest(e).then(({ results }) => {
//               if (results.length > 0) {
//                 const { graphic } = results.filter((result) => {
//                   return result.graphic.layer === constantlyLayer;
//                 })[0];
//                 if (graphic) {
//                   dispatch({
//                     type: 'resourceTree/saveCtrlResourceType',
//                     payload: '101.104',
//                   });
//                   dispatch({
//                     type: 'resourceTree/saveSelectResourceGisCode',
//                     payload: { gISCode: graphic.attributes.gISCode, type },
//                   });
//                   e.stopPropagation();
//                 }
//               }
//             });
//           });
//         } else {
//           constantlyLayer.graphics.removeAll();
//         }
//         break;
//       case 'VocConstantly':
//         pictureMarkerSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
//           new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
//             new Color([255, 255, 0]), 2), new Color([255, 255, 0])
//         );
//         constantlyLayer = map.findLayerById(`${type}专题图`);
//         if (!constantlyLayer) {
//           constantlyLayer = new GraphicsLayer({ id: `${type}专题图` });
//           map.add(constantlyLayer);
//           view.on('click', (e) => {
//             view.hitTest(e).then(({ results }) => {
//               if (results.length > 0) {
//                 const { graphic } = results.filter((result) => {
//                   return result.graphic.layer === constantlyLayer;
//                 })[0];
//                 if (graphic) {
//                   dispatch({
//                     type: 'vocs/saveAreaCode',
//                     payload: graphic.attributes.areaCode,
//                   });
//                   dispatch({
//                     type: 'resourceTree/saveCtrlResourceType',
//                     payload: 'vocs',
//                   });
//                 }
//               }
//             });
//             e.stopPropagation();
//           });
//         } else {
//           constantlyLayer.graphics.removeAll();
//         }
//         break;
//       case 'WaterConstantly':
//         addConstantlyLayer(type);
//         break;
//       case 'Electric':
//         addConstantlyLayer(type);
//         break;
//       case 'Steam':
//         addConstantlyLayer(type);
//         break;
//       case 'Wind':
//         addConstantlyLayer(type);
//         break;
//       case 'Cracking':
//         constantlyLayer = map.findLayerById('裂解炉实时数据专题图');
//         if (!constantlyLayer) {
//           constantlyLayer = new GraphicsLayer({ id: '裂解炉实时数据专题图' });
//           map.add(constantlyLayer);
//         } else {
//           constantlyLayer.clear();
//         }
//         break;
//       case 'Generator':
//         pictureMarkerSymbol = new PictureMarkerSymbol(gas0, 20, 30);
//         constantlyLayer = map.findLayerById('发电机实时数据专题图');
//         if (!constantlyLayer) {
//           constantlyLayer = new GraphicsLayer({ id: '发电机实时数据专题图' });
//           map.add(constantlyLayer);
//         } else {
//           constantlyLayer.clear();
//         }
//         break;
//       case 'LargeUnit':
//         pictureMarkerSymbol = new PictureMarkerSymbol(gas0, 20, 30);
//         constantlyLayer = map.findLayerById('大机组实时数据专题图');
//         if (!constantlyLayer) {
//           constantlyLayer = new GraphicsLayer({ id: '大机组实时数据专题图' });
//           map.add(constantlyLayer);
//         } else {
//           constantlyLayer.clear();
//         }
//         break;
//       case 'Boiler':
//         pictureMarkerSymbol = new PictureMarkerSymbol(gas0, 20, 30);
//         constantlyLayer = map.findLayerById('锅炉实时数据专题图');
//         if (!constantlyLayer) {
//           constantlyLayer = new GraphicsLayer({ id: '锅炉实时数据专题图' });
//           map.add(constantlyLayer);
//         } else {
//           constantlyLayer.clear();
//         }
//         break;
//       default: break;
//     }
//     const data = [];
//     const editDom = (domText, attributes) => {
//       for (const item of attributes.valueArry) {
//         domText.push(`${item.dataTypeName}：${item.value} `);
//       }
//       return domText;
//     };
//     for (const device of devices) {
//       const { attributes } = device;
//       const { geometry } = device.device.feature || device.device;
//       let pointGeometry = geometry;
//       // 如果地理信息不为点，先做一个转换
//       switch (pointGeometry.type) {
//         case 'point': break;
//         case 'polygon': pointGeometry = pointGeometry.centroid; break;
//         case 'polyline': pointGeometry = device.feature.geometry.extent.center; break;
//         default: break;
//       }
//       let constantGraphic;
//       constantGraphic = new Graphic(pointGeometry, pictureMarkerSymbol, { gISCode: attributes.gISCode });
//       // constantGraphic = new Graphic({ geometry: pointGeometry, attributes: { gISCode: attributes.gISCode }});
//       const screenPoint = view.toScreen(pointGeometry);
//       const style = { left: screenPoint.x, top: screenPoint.y };
//       const currentStyle = { left: screenPoint.x, top: screenPoint.y };
//       let domText = []; let domTitle = '';
//       // 统一修改展示的dom信息
//       switch (domType) {
//         case 'constantly':
//           domText = editDom(domText, attributes);
//           break;
//         case 'GasConstantly':
//           domText = editDom(domText, attributes);
//           break;
//         case 'EnvConstantly':
//           domText = editDom(domText, attributes);
//           break;
//         case 'GuardAreaConstantly':
//           domTitle = `${attributes.areaName}进出人数统计`;
//           domText.push(`进：${attributes.inNum}人   出${attributes.outNum}人`);
//           break;
//         case 'GuardDoorConstantly':
//           domTitle = `${attributes.doorName}进出人数统计`;
//           domText.push(`进：${attributes.inNum}人   出${attributes.outNum}人`);
//           break;
//         case 'VocConstantly':
//           {
//             const attr = { areaCode: attributes.areaCode };
//             constantGraphic = new Graphic(geometry, pictureMarkerSymbol, attr);
//             domTitle = `${device.device.feature.attributes['装置区名称']}检测计划统计`;
//             domText.push(`检测计划总数：${attributes.value}`);
//           }
//           break;
//         case 'WaterConstantly':
//           for (const item of attributes.valueArry) {
//             domText.push(`${item.dataTypeName}：${item.value} `);
//           }
//           break;
//         case 'Electric':
//           domTitle = `${device.device.feature.attributes['设备名称']}用电统计`;
//           domText = `用电量：${attributes.level}电流：${attributes.flow}`;
//           break;
//         case 'Steam':
//           for (const item of attributes.valueArry) {
//             domText.push(`${item.dataTypeName}：${item.value} `);
//           }
//           break;
//         case 'Wind':
//           domTitle = `${device.device.feature.attributes['设备名称']}实时数据`;
//           domText = `风压：${attributes.pressure}用量：${attributes.flow}`;
//           break;
//         case 'Cracking':
//           switch (attributes.type) {
//             case 0: pictureMarkerSymbol = new PictureMarkerSymbol(cracking0, 40, 40); break;
//             case 1: pictureMarkerSymbol = new PictureMarkerSymbol(cracking1, 40, 40); break;
//             case 2: pictureMarkerSymbol = new PictureMarkerSymbol(cracking2, 40, 40); break;
//             case 3: pictureMarkerSymbol = new PictureMarkerSymbol(cracking3, 40, 40); break;
//             default: break;
//           }
//           domText = `${device.device.feature.attributes['点位号']}`;
//           break;
//         default:
//           constantGraphic = new Graphic(pointGeometry, pictureMarkerSymbol);
//           break;
//       }
//       constantlyLayer.graphics.add(constantGraphic);
//       data.push({ screenPoint, attributes, currentStyle, style, geometry: pointGeometry, domText, domTitle });
//     }
//     // if (domType !== 'VocConstantly') {
//     constantlyModal[type].mapData = data;
//     if (!disablePop) {
//       const array = constantlyComponents;
//       array[array.findIndex(value => value.type === type)].uniqueKey = Math.random() * new Date().getTime();
//       array[array.findIndex(value => value.type === type)].show = true;
//       dispatch({
//         type: 'constantlyData/queryConstantlyComponents',
//         payload: array,
//       });
//     }
//   });
// };
// 添加门禁图标
export const addDoorIcon = async ({ map, view, data, graphics, dispatch }) => {
  esriLoader.loadModules([
    'esri/geometry/Point',
    'esri/layers/GraphicsLayer',
    'esri/Graphic',
  ]).then(([Point, GraphicsLayer, Graphic]) => {
    let doorInfoIndex = 0;
    let doorLayer = map.findLayerById('门禁专题图');
    if (!doorLayer) {
      doorLayer = new GraphicsLayer({ id: '门禁专题图' });
      map.add(doorLayer);
      const a = view.on('pointer-move', (evt) => {
        view.hitTest(evt).then(({ results }) => {
          const { graphic } = results.filter(value => value.graphic.layer === doorLayer)[0];
          const { index } = doorLayer.graphics.items.find(value => value === graphic).attributes;
          if (index < doorInfoIndex) {
            const graphics = doorLayer.graphics.items.filter(value => value.attributes.index === index);
            doorInfoIndex += 1;
            const array = [];
            for (const item of graphics) {
              const newItem = item.clone();
              newItem.attributes.index = doorInfoIndex;
              array.push(newItem);
            }
            doorLayer.graphics.removeMany(graphics);
            doorLayer.graphics.addMany(array);
          }
        });
      });
    } else {
      doorLayer.graphics.removeAll();
    }
    const symbolDoor = { type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
      url: door,
      angle,
      width: '24px',
      height: '24px' };
    const symbolBox = {
      type: 'picture-marker', // autocasts as new PictureMarkerSymbol()
      url: doorInfo,
      angle,
      width: '80px',
      height: '55px',
      yoffset: 10.5,
      xoffset: 26.5,
    };
    const symbolTextDoorName = {
      type: 'text', // autocasts as new TextSymbol()
      color: '#02e2f4',
      text: '',
      angle,
      yoffset: 38.5,
      xoffset: 22.5,

      horizontalAlignment: 'left',
      font: { // autocast as new Font()
        // size: 7,
        family: '微软雅黑',
        // weight: "bold"
      },
    };
    const symbolTextIn = {
      type: 'text', // autocasts as new TextSymbol()
      color: 'white',
      // haloColor: "black",
      // haloSize: "1px",
      text: '进100',
      angle,
      yoffset: 34,
      xoffset: 13.5,

      horizontalAlignment: 'left',
      font: { // autocast as new Font()
        // size: 7,
        family: '微软雅黑',
        // weight: "bold"
      },
    };
    const symbolTextOut = {
      type: 'text', // autocasts as new TextSymbol()
      color: 'white',
      // haloColor: "black",
      // haloSize: "1px",
      angle,
      horizontalAlignment: 'left',
      text: '出20',
      yoffset: 30.5,
      xoffset: 4.5,

      font: { // autocast as new Font()
        // size: 7,
        family: '微软雅黑',
        // weight: "bold"
      },
    };
    const datas = [];
    for (const item of graphics) {
      const doorData = data.find(value => Number(value.gisCode) === Number(item.attributes.ObjCode));
      if (doorData) {
        doorInfoIndex += 1;
        // symbolTextIn.text = `进${doorData.inNUm}`;
        // symbolTextOut.text = `出${doorData.outNum}`;
        // symbolTextDoorName.text = doorData.doorName;
        const screenPoint = view.toScreen(item.geometry);
        const accessPop = {
          data: {
            in_: `进${doorData.inNUm}`,
            out: `出${doorData.outNum}`,
            name: doorData.doorName,
            index: doorInfoIndex,
            geometry: item.geometry,
            style: { left: screenPoint.x, top: screenPoint.y - 48 },
          },
          uniqueKey: new Date().getTime() * Math.random(),
        };
        datas.push(accessPop);
        // const e = new Graphic(point, symbolDoor, {});
        // const a = new Graphic(point, symbolBox, { index: doorInfoIndex });
        // const b = new Graphic(point, symbolTextIn, { index: doorInfoIndex });
        // const c = new Graphic(point, symbolTextOut, { index: doorInfoIndex });
        // const f = new Graphic(point, symbolTextDoorName, { gISCode: item.attributes.ObjCode, index: doorInfoIndex, isBox: true });
        // doorLayer.graphics.addMany([a, b, c, f]);
      }
    }
    dispatch({
      type: 'mapRelation/addClusterPopup',
      payload: { type: 'accessPops', data: { show: true, load: true, data: datas } },
    });
  });
};
// 作业监控专题
export const addConstructIcon = ({ layer, list, dispatch }) => {
  const { view } = mapConstants;
  const graphics = [];
  const query = layer.createQuery();
  query.outFields = ['*'];
  layer.queryFeatures(query).then((res) => {
    graphics.push(...res.features);
    const data = [];
    for (const graphic of graphics) {
      const item = list.find(value => Number(value.gisCode) === Number(graphic.attributes.ObjCode));
      if (item) {
        const keys = []; // map 循环时用的key
        for (const data of item.data) {
          keys.push(String(data.jobMonitorID));
        }
        const point = graphic.geometry.centroid;
        const obj = {};
        const geometry = point;
        const { extent } = graphic.geometry;
        const screenPoint = view.toScreen(geometry);
        const style = { left: screenPoint.x, top: screenPoint.y };
        const key = Math.random() * new Date().getTime();
        const { area } = item;
        obj.attributes = { geometry, extent, style, key, uniqueKey: key, area: graphic.geometry, data: { list: item.data, area, keys } };
        data.push(obj);
      }
    }
    dispatch({
      type: 'mapRelation/addClusterPopup',
      payload: { type: 'constructMonitorClusterPopup', data: { show: true, load: true, data } },
    });
  });
};
// Vocs监控
export const addVocsIcon = ({ map, layer, list, dispatch }) => {
  esriLoader.loadModules([
    'esri/layers/GraphicsLayer',
  ]).then(([GraphicsLayer]) => {
    if (map.findLayerById('Vocs监控专题图')) {
      delLayer(map, ['Vocs监控专题图'], dispatch);
      return false;
    }
    const vocsLayer = new GraphicsLayer({ id: 'Vocs监控专题图' });
    map.add(vocsLayer);
    const graphics = [];
    const query = layer.createQuery();
    query.outFields = ['*'];
    const data = []; // 用于popup展示
    layer.queryFeatures(query).then((res) => {
      graphics.push(...res.features);
      for (const graphic of graphics) {
        const item = list.find(value => Number(value.gisCode) === Number(graphic.attributes.ObjCode));
        const keys = [];
        if (item) {
          const { maintNumbers, alreadyMaintNumbers, notMaintNumbers, waitMaintNumbers, gisCode } = item;
          const obj = { count: maintNumbers, data: { maintNumbers, alreadyMaintNumbers, notMaintNumbers, waitMaintNumbers }, gisCode, uniqueKey: new Date() * Math.random(), keys, areaName: graphic.attributes['分区名称'] };
          const screenPoint = mapConstants.view.toScreen(graphic.geometry.centroid);
          const style = { left: screenPoint.x, top: screenPoint.y };
          obj.attributes = { geometry: graphic.geometry.centroid, area: graphic.geometry, style };
          data.push(obj);
        }
      }
      dispatch({
        type: 'mapRelation/addClusterPopup',
        payload: { type: 'vocsPopup', data: { show: true, load: true, data } },
      });
    });
  });
};
// Vocs监控--鼠标进入效果
export const addPopupHover = (geometry, color) => {
  esriLoader.loadModules([
    'esri/layers/GraphicsLayer',
    'esri/Graphic',
  ]).then(([GraphicsLayer, Graphic]) => {
    const map = mapConstants.mainMap;
    let vocsLayer = map.findLayerById('聚合气泡窗监控鼠标效果');
    if (!vocsLayer) {
      vocsLayer = new GraphicsLayer({ id: '聚合气泡窗监控鼠标效果', maxScale: mapConstants.popupScale });
      map.add(vocsLayer);
    }
    const hoverSy = {
      type: 'simple-fill',
      color: 'rgba(255, 255, 255, 0.8)',
      style: 'solid',
      outline: {
        color,
        width: 1,
      },
    };
    vocsLayer.graphics.removeAll();
    if (geometry) {
      const hoverGraphic = new Graphic(geometry, hoverSy);
      vocsLayer.add(hoverGraphic);
    }
  });
};
// 固体仓库专题图
export const solidWarehouseDetail = ({ map, layer, dispatch }) => {
  esriLoader.loadModules([
    'esri/layers/GraphicsLayer',
  ]).then(([GraphicsLayer]) => {
    if (map.findLayerById('固体仓库专题图')) {
      delLayer(map, ['固体仓库专题图'], dispatch);
      return false;
    }

    const textSymbol = {
      type: 'text', // autocasts as new TextSymbol()
      color: 'white',
      haloColor: 'black',
      haloSize: '1px',
      text: '',
      angle,
      font: { // autocast as new Font()
        size: 12,
        family: 'sans-serif',
        weight: 'bold',
      },
    };

    const simpleFillSymbol = {
      type: 'simple-fill', // autocasts as new SimpleMarkerSymbol()
      color: '#27afff',
      style: 'solid',
      outline: { // autocasts as new SimpleLineSymbol()
        color: '#fff',
        width: 1, // points
      },
    };
    const solidWarehouseLayer = new GraphicsLayer({ id: '固体仓库专题图' });
    map.add(solidWarehouseLayer);
    const query = layer.createQuery();
    query.outFields = ['*'];
    query.where = 'ObjCode = 11641 OR ObjCode = 11642';
    layer.queryFeatures(query).then((res) => {
      for (const graphic of res.features) {
        const { ObjCode } = graphic.attributes;
        const warpGraphic = {
          geometry: graphic.geometry,
          symbol: simpleFillSymbol,
          attributes: { id: 0 },
        };
        let graphic1; let graphic2;
        if (ObjCode === 11641) {
          const textSymbol1 = JSON.parse(JSON.stringify(textSymbol));
          textSymbol1.text = 'HDPE: 25';
          textSymbol1.xoffset = 7.75;
          textSymbol1.yoffset = -1.25;
          const textSymbol2 = JSON.parse(JSON.stringify(textSymbol));
          textSymbol2.text = 'stpp: 25';
          textSymbol2.xoffset = '-15px';
          textSymbol2.yoffset = '-8px';
          graphic1 = {
            geometry: graphic.geometry,
            symbol: textSymbol1,
            attributes: { id: 1 },
          };
          graphic2 = {
            geometry: graphic.geometry,
            symbol: textSymbol2,
            attributes: { id: 2 },
          };
        } else {
          const textSymbol1 = JSON.parse(JSON.stringify(textSymbol));
          textSymbol1.text = 'jpp: 25';
          textSymbol1.xoffset = 4.75;
          textSymbol1.yoffset = 8.25;
          const textSymbol2 = JSON.parse(JSON.stringify(textSymbol));
          textSymbol2.text = 'iidpes: 25';
          textSymbol2.xoffset = '-15px';
          textSymbol2.yoffset = '-8px';
          graphic1 = {
            geometry: graphic.geometry,
            symbol: textSymbol1,
            attributes: { id: 3 },
          };
          graphic2 = {
            geometry: graphic.geometry,
            symbol: textSymbol2,
            attributes: { id: 4 },
          };
        }
        solidWarehouseLayer.graphics.addMany([warpGraphic, graphic1, graphic2]);
      }
    });
  });
};
// 扩音对讲专题图
export const paSystemDetail = ({ view, map, layer, dispatch, paData }) => {
  esriLoader.loadModules([
    'esri/layers/GraphicsLayer',
  ]).then(([GraphicsLayer]) => {
    let paLayer = map.findLayerById('扩音对讲专题图');
    let paTextLayer = map.findLayerById('扩音对讲标注专题图');
    const simpleFillSymbol = {
      type: 'simple-fill',
      color: 'rgba(255, 255, 255, 0.8)',
      style: 'solid',
      angle,
      outline: {
        color: '#1890ff',
        width: 1, // points
      },
    };
    const simpleTextSymbol1 = {
      type: 'text',
      color: '#005dff',
      text: '',
      angle,
      font: {
        size: 8,
        family: 'sans-serif',
      },
    };


    view.on('click', (e) => {
      view.hitTest(e).then(({ results }) => {
        const { graphic } = results.filter(value => value.graphic.layer === paLayer)[0];
        dispatch({
          type: 'paSystem/saveCurrentArea',
          payload: graphic.attributes,
        });
        dispatch({
          type: 'resourceTree/saveCtrlResourceType',
          payload: 'paSystem',
        });
        e.stopPropagation();
      });
    });
    // 新建popup， 利用popup 获取点击事件
    const setContentInfo = (feature) => {
      view.popup.visible = false; // 关闭弹出窗口
      dispatch({
        type: 'paSystem/saveCurrentArea',
        payload: feature.graphic.attributes,
      });
      dispatch({
        type: 'resourceTree/saveCtrlResourceType',
        payload: 'paSystem',
      });
      //   .then(() => {
      //   dispatch({
      //     type: 'paSystem/queryPABordInfo',
      //     payload: feature.graphic.attributes,
      //   });
      //   dispatch({
      //     type: 'resourceTree/saveCtrlResourceType',
      //     payload: 'paSystem',
      //   });
      // });

      return false;
    };
    // 显示对应图层

    const popupTemplate = {
      title: '',
      content: setContentInfo,
    };

    if (!paLayer) {
      paLayer = new GraphicsLayer({ id: '扩音对讲专题图' });
      map.add(paLayer);
    } else {
      paLayer.graphics.removeAll();
    }
    if (!paTextLayer) {
      paTextLayer = new GraphicsLayer({ id: '扩音对讲标注专题图' });
      map.add(paTextLayer);
    }
    const query = layer.createQuery();
    query.outFields = ['*'];
    const data = [];
    layer.queryFeatures(query).then((res) => {
      // 加上标注
      if (paTextLayer.graphics.length === 0) {
        for (const graphic of res.features) {
          // 找到该分区对应的业务数据
          const sysInfo = paData.find(value => Number(value.areaGISCode) === Number(graphic.attributes.ObjCode));
          const attributes = { ...graphic.attributes, sysInfo, layer };
          simpleTextSymbol1.text = graphic.attributes['分区名称'];
          const newGraphicText = { geometry: graphic.geometry, symbol: simpleTextSymbol1, attributes };
          paTextLayer.graphics.add(newGraphicText);
        }
      }
      for (const graphic of res.features) {
        // 找到该分区对应的业务数据
        const sysInfo = paData.find(value => Number(value.areaGISCode) === Number(graphic.attributes.ObjCode));
        const attributes = { ...graphic.attributes, sysInfo, layer };
        if (sysInfo) {
          const isSound = (() => {
            let isSounding = false;
            for (const item of sysInfo.devices) {
              const { state } = item;
              if (state === 'open') {
                isSounding = true;
                break;
              }
            }
            return isSounding;
          })();
          // 判断是否加上扩音
          if (isSound) {
            const { centroid, extent } = graphic.geometry;
            const length = extent.width / 2;
            const screenPoint = view.toScreen(centroid);
            data.push({
              uniqueKey: Math.random() * new Date().getTime(),
              data: {
                geometry: centroid,
                extent,
                attributes,
                style: { left: screenPoint.x, top: screenPoint.y, width: length, height: length, lineHeight: `${length}px` },
              },
            });
          }
        }
        const newGraphic = { geometry: graphic.geometry, symbol: simpleFillSymbol, attributes };
        paLayer.graphics.add(newGraphic);
      }
      dispatch({
        type: 'map/queryPAPopup',
        payload: { show: true, load: true, data },
      });
    });
  });
};
// 环保地图
// export const envMap = ({ view, map, graphics }) => {
//   esriLoader.loadModules([
//     'esri/layers/GraphicsLayer',
//   ]).then(([GraphicsLayer]) => {
//     let denvInfoIndex = 0;
//     let envLayer = map.findLayerById('环保专题图');
//     if (envLayer) {
//       envLayer.graphics.removeAll();
//     } else {
//       envLayer = new GraphicsLayer({ id: '环保专题图' });
//       map.add(envLayer);
//       const a = view.on('pointer-move', (evt) => {
//         view.hitTest(evt).then(({ results }) => {
//           const { graphic } = results.filter(value => value.graphic.layer === envLayer)[0];
//           const { index } = envLayer.graphics.items.find(value => value === graphic).attributes;
//           if (index < denvInfoIndex) {
//             const graphics = envLayer.graphics.items.filter(value => value.attributes.index === index);
//             denvInfoIndex += 1;
//             const array = [];
//             for (const item of graphics) {
//               const newItem = item.clone();
//               newItem.attributes.index = denvInfoIndex;
//               array.push(newItem);
//             }
//             envLayer.graphics.removeMany(graphics);
//             envLayer.graphics.addMany(array);
//           }
//         });
//       });
//     }
//
//     // view.on('click', (e) => {
//     //   view.hitTest(e).then(({ results }) => {
//     //     const { graphic } = results.filter(value => value.graphic.layer === envLayer)[0];
//     //     dispatch({
//     //       type: 'resourceTree/selectByGISCode',
//     //       payload: { pageNum: 1, pageSize: 1, isQuery: true, fuzzy: false, gISCode: graphic.attributes.ObjCode || graphic.attributes['唯一编码'] || graphic.attributes.resourceGisCode },
//     //     });
//     //     e.stopPropagation();
//     //   });
//     // });
//     const array = [16008, 15875, 15876, 15811]; //  国控点，特殊处理，做个偏移 74c01f
//     const simpleMarkerSymbol = {
//       type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
//       style: 'circle',
//       color: 'blue',
//       // angle,
//       xoffset: 2.5,
//       yoffset: 1,
//       size: '35px', // pixels
//       outline: {
//         color: '#fff',
//         width: 0.5,
//       },
//     };
//     const simpleTextSymbol1 = {
//       type: 'text', // autocasts as new TextSymbol()
//       color: '#fff',
//       text: '',
//       angle,
//       font: { // autocast as new Font()
//         // size: 8,
//         family: 'sans-serif',
//       },
//     };
//     // 遍历数据画图
//     for (const item of graphics) {
//       const obj = constantlyModal.env.data[item.attributes.ObjCode];
//       if (obj) {
//         for (const [_, data] of Object.entries(obj)) {
//           if (data.baseConditionExpressShowInfoVOS) {
//             denvInfoIndex += 1;
//             // data.value = datas.findIndex(value => value.gISCode === data.gISCode);
//             // console.log('data.value', data.value);
//             const isInRange = data.value > parseFloat(data.baseConditionExpressShowInfoVOS[0].startValue) && data.value < parseFloat(data.baseConditionExpressShowInfoVOS[0].endValue);
//             simpleMarkerSymbol.color = isInRange ? '#e6111d' : '#2dc12d';
//             // simpleMarkerSymbol.color = '#d12b2b';
//             simpleTextSymbol1.text = parseFloat(data.value).toFixed(2);
//             // simpleTextSymbol1.color = isInRange ? '#d12b2b' : '#74c01f';
//             // 国控点，特殊处理，做个偏移
//             const index = array.findIndex(value => value === item.attributes.ObjCode);
//             if (index !== -1) {
//               switch (item.attributes.ObjCode) {
//                 case 15811:
//                   simpleMarkerSymbol.xoffset = -8;
//                   simpleMarkerSymbol.yoffset = 17;
//                   simpleTextSymbol1.xoffset = -8;
//                   simpleTextSymbol1.yoffset = 17;
//                   break;
//                 case 15875:
//                   simpleMarkerSymbol.xoffset = 8.5;
//                   simpleMarkerSymbol.yoffset = 22;
//                   simpleTextSymbol1.xoffset = 8.5;
//                   simpleTextSymbol1.yoffset = 22;
//                   break;
//                 case 15876:
//                   simpleMarkerSymbol.xoffset = -7;
//                   simpleMarkerSymbol.yoffset = 24;
//                   simpleTextSymbol1.xoffset = -10;
//                   simpleTextSymbol1.yoffset = 23.5;
//                   break;
//                 case 16008:
//                   simpleMarkerSymbol.xoffset = 8.5;
//                   simpleMarkerSymbol.yoffset = 13;
//                   simpleTextSymbol1.xoffset = 8.5;
//                   simpleTextSymbol1.yoffset = 13;
//                   break;
//                 case 15810:
//                   simpleMarkerSymbol.xoffset = 2.5;
//                   simpleMarkerSymbol.yoffset = -10;
//                   simpleTextSymbol1.xoffset = 2.5;
//                   simpleTextSymbol1.yoffset = -10;
//                   break;
//                 default: break;
//               }
//             } else {
//               simpleMarkerSymbol.xoffset = 0;
//               simpleMarkerSymbol.yoffset = 0;
//               simpleTextSymbol1.xoffset = 0;
//               simpleTextSymbol1.yoffset = 0;
//             }
//             const graphic1 = { geometry: item.geometry, symbol: simpleMarkerSymbol, attributes: { ...item.attributes, index: denvInfoIndex } };
//             const graphic2 = { geometry: item.geometry, symbol: simpleTextSymbol1, attributes: { ...item.attributes, index: denvInfoIndex } };
//             envLayer.graphics.addMany([graphic1, graphic2]);
//           }
//
//         }
//       }
//       // const data = datas.find(value => Number(item.attributes.ObjCode) === Number(value.gISCode) ); 74c01f
//       // for (const )
//       // if (data) {
//       //   denvInfoIndex += 1;
//       //   // data.value = datas.findIndex(value => value.gISCode === data.gISCode);
//       //   // console.log('data.value', data.value);
//       //   const isInRange = data.value > data.range.start && data.value < data.range.end;
//       //   simpleMarkerSymbol.color = isInRange ? '#d12b2b' : '#74c01f';
//       //   simpleTextSymbol1.text = data.value;
//       //   // simpleTextSymbol1.color = isInRange ? '#d12b2b' : '#74c01f';
//       //   const graphic1 = { geometry: item.geometry, symbol: simpleMarkerSymbol, attributes: { ...item.attributes, index: denvInfoIndex } };
//       //   const graphic2 = { geometry: item.geometry, symbol: simpleTextSymbol1, attributes: { ...item.attributes, index: denvInfoIndex } };
//       //   envLayer.graphics.addMany([graphic1, graphic2]);
//       // }
//     }
//   });
// };
// 环保地图
export const envMap = ({ view, map, graphics, dispatch }) => {
  esriLoader.loadModules([
    'esri/layers/GraphicsLayer',
    'esri/geometry/Extent',
    'esri/geometry/Point',
    'esri/geometry/Polyline',
  ]).then(([GraphicsLayer, Extent, Point, Polyline]) => {
    let denvInfoIndex = 0;
    let envLayer = map.findLayerById('环保专题图');
    if (envLayer) {
      envLayer.removeAll();
    } else {
      envLayer = new GraphicsLayer({ id: '环保专题图' });
      map.add(envLayer);
      const inIn = false;
      let currentG;
      const a = view.on('pointer-move', (evt) => {
        view.hitTest(evt).then(({ results }) => {
          const { graphic } = results.filter(value => value.graphic.layer === envLayer)[0];
          const { index } = envLayer.graphics.items.find(value => value === graphic).attributes;
          if (index < denvInfoIndex) {
            const graphics = envLayer.graphics.items.filter(value => value.attributes.index === index);
            denvInfoIndex += 1;
            const array = [];
            for (const item of graphics) {
              const newItem = item.clone();
              newItem.attributes.index = denvInfoIndex;
              array.push(newItem);
            }
            envLayer.graphics.removeMany(graphics);
            envLayer.graphics.addMany(array);
          }
        });
      });
      // const e = view.on('pointer-down', (evt) => {
      //   inIn = false;
      //   currentG = undefined;
      //   view.hitTest(evt).then(({ results }) => {
      //     const { graphic } = results.filter(value => value.graphic.layer === envLayer)[0];
      //     const { index } = envLayer.graphics.items.find(value => value === graphic).attributes;
      //     const Graphics = envLayer.graphics.items.filter(value => value.attributes.index === index);
      //     if (graphic) {
      //       inIn = true;
      //       currentG = Graphics;
      //     }
      //   });
      // });
      // const a = view.on('pointer-move', (evt) => {
      //   if (currentG && inIn) {
      //     const newPoint = mapConstants.view.toMap(evt.x, evt.y);
      //     const array = [];
      //     for (const item of currentG) {
      //       const newItem = item.clone();
      //       newItem.geometry = newPoint;
      //       array.push(newItem);
      //       envLayer.add(newItem);
      //     }
      //     envLayer.removeMany(currentG);
      //     currentG = array;
      //     evt.stopPropagation();
      //   }
      // });
      // const c = view.on('pointer-up', () => {
      //   if (currentG) {
      //     bigA[currentG[0].attributes.ObjCode] = { x: currentG[0].geometry.x, y: currentG[0].geometry.y };
      //     console.log('bigA', JSON.stringify(bigA));
      //     inIn = false;
      //     currentG = undefined;
      //   }
      // });
    }
    const leftExtent = new Extent({
      xmax: 12749714.755840002,
      xmin: 12749157.149759999,
      ymax: 3588055.5851000017,
      ymin: 3587486.9323000023,
      spatialReference: mapConstants.view.spatialReference,
    });
    const leftPoints = {
      15738: { x: 12749302.775659999, y: 3587258.741658028 },
      15740: { x: 12749168.970643476, y: 3587612.8937117383 },
      15741: { x: 12749728.60724107, y: 3587365.1708837096 },
      15742: { x: 12749615.958671067, y: 3587435.636938765 },
      15743: { x: 12749637.07781314, y: 3587906.2191598383 },
      15748: { x: 12749206.350515949, y: 3587516.678077131 },
      15749: { x: 12749225.368658649, y: 3587306.6655892637 },
      15750: { x: 12749704.628193203, y: 3587484.200200677 },
      15751: { x: 12749603.782121116, y: 3587992.671246805 },
      15756: { x: 12749261.614190165, y: 3587439.415396176 },
      15757: { x: 12749909.088552024, y: 3587543.9158274783 },
      15758: { x: 12749778.827738822, y: 3587546.7865356226 },
      15759: { x: 12749003.946189651, y: 3587733.1504433104 },
      15769: { x: 12749877.212701797, y: 3587633.829846468 },
      15770: { x: 12749776.703377299, y: 3587901.529813211 },
      15771: { x: 12749339.866891684, y: 3587368.901234322 },
      15772: { x: 12749434.934243033, y: 3587354.176781514 },
      15773: { x: 12749753.253504213, y: 3587642.2045768593 },
      15777: { x: 12749809.954102475, y: 3587410.6710102847 },
      15779: { x: 12749384.840983428, y: 3587227.106341793 },
      15783: { x: 12749085.691847742, y: 3587784.5533888177 },
      15784: { x: 12749038.262926789, y: 3587644.2574694334 },
      15785: { x: 12749714.054993255, y: 3587729.0554605117 },
      15786: { x: 12749475.77604753, y: 3587256.5413051094 },
      15788: { x: 12749129.373335833, y: 3587693.8417764576 },
      15789: { x: 12749529.331239156, y: 3587382.191903033 },
      15790: { x: 12749679.73825612, y: 3587817.9484343887 },
      15791: { x: 12749164.202165501, y: 3587384.327066904 },
      15793: { x: 12749843.294761347, y: 3587728.6256392775 },
      15794: { x: 12749809.999069324, y: 3587815.0777262445 },
      15796: { x: 12749738.92470814, y: 3587991.842628886 },
      15797: { x: 12749701.257764852, y: 3588075.0321821724 },
      15798: { x: 12749080.923369767, y: 3587555.986743984 },
      15799: { x: 12749117.680993814, y: 3587468.114815219 },
      15851: { x: 12749560.808292698, y: 3587286.375065111 },
      15853: { x: 12749649.701266576, y: 3587320.6918022474 },
      15855: { x: 12749883.356054721, y: 3587461.451707365 },
      15810: { x: 12748677.635482492, y: 3587265.3977947324 },
      15811: { x: 12748641.898903558, y: 3587350.828836587 },
      15874: { x: 12750263.290469984, y: 3585168.2422865005 },
      15875: { x: 12750269.67121695, y: 3585262.687389423 },
      15876: { x: 12750216.226181217, y: 3585349.3148213336 },
      16008: { x: 12748604.742482826, y: 3587432.7979464186 },
      16009: { x: 12748639.045277663, y: 3587062.8352057408 },
      16010: { x: 12748734.4633189, y: 3587088.409440349 },
      16011: { x: 12748709.910129404, y: 3587181.3865946755 },
    };
    const simpleMarkerSymbol = {
      type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
      style: 'circle',
      color: 'blue',
      // angle,
      xoffset: 2.5,
      yoffset: 1,
      size: '35px', // pixels
      outline: {
        color: '#fff',
        width: 1,
      },
    };
    const simpleTextSymbol1 = {
      type: 'text',
      color: '#fff',
      text: '',
      angle,
      xoffset: 2.5,
      yoffset: 1,
      font: {
        family: 'sans-serif',
      },
    };
    const simpleLineSy = {
      type: 'simple-line',
      color: 'lightblue',
      width: '2px',
      style: 'solid',
    };
    // 遍历数据画图
    const linArray = [];
    const dataArray = [];
    let index = 0;
    for (const item of graphics) {
      const obj = constantlyModal.env.data[item.attributes.ObjCode];
      index += 1;
      if (obj) {
        for (const [_, data] of Object.entries(obj)) {
          if (data.baseConditionExpressShowInfoVOS) {
            denvInfoIndex += 1;
            const point = leftPoints[item.attributes.ObjCode];
            if (point) {
              const newPoint = new Point({ x: point.x, y: point.y, spatialReference: mapConstants.view.spatialReference });
              simpleMarkerSymbol.color = data.alarm ? '#e6111d' : '#2dc12d';
              simpleLineSy.color = simpleMarkerSymbol.color;
              const lineGeometry = new Polyline({
                hasZ: false,
                hasM: true,
                paths: [[item.geometry.x, item.geometry.y], [newPoint.x, newPoint.y]],
                spatialReference: mapConstants.view.spatialReference,
              });
              const { x, y } = view.toScreen(newPoint);
              const attr = {
                style: { top: y, left: x },
                geometry: newPoint,
                value: parseFloat(data.value).toFixed(2),
                isAlarm: data.alarm,
                resourceName: item.attributes['设备名称'],
                gISCode: item.attributes.ObjCode,
              };
              dataArray.push(attr);
              simpleTextSymbol1.text = parseFloat(data.value).toFixed(2);
              const graphic3 = { geometry: lineGeometry, symbol: JSON.parse(JSON.stringify(simpleLineSy)), attributes: { ...item.attributes, index: denvInfoIndex } };
              // const graphic1 = { geometry: newPoint, symbol: JSON.parse(JSON.stringify(simpleMarkerSymbol)), attributes: { ...item.attributes, index: denvInfoIndex } };
              // const graphic2 = { geometry: newPoint, symbol: JSON.parse(JSON.stringify(simpleTextSymbol1)), attributes: { ...item.attributes, index: denvInfoIndex } };
              linArray.push(graphic3);
            }
          }
        }
      }
      if (index === graphics.length) {
        envLayer.addMany(linArray);
        dispatch({
          type: 'mapRelation/queryEnvIconData',
          payload: dataArray,
        })
      }
    }
  });
};
// 统一渲染与闪烁报警图标
export const switchAlarmIcon = ({ layer }) => {
  let graphicArray = [];
  let index = 0;
  const emptySy = {
    type: 'simple-marker',
    style: 'circle',
    color: 'rgba(0, 0, 0, 0)',
    size: '32px',
    outline: null,
  };
  const changeIcon = () => {
    for (const graphic of mapConstants.alarmGraphics) {
      if (!graphic.attributes.isEvent) {
        const alarmGraphicClone = graphic.clone();
        const newSy = alarmGraphicClone.attributes.symbolObj.clone();
        if (index === 0) {
          alarmGraphicClone.symbol = emptySy;
          graphic.symbol = emptySy;
        } else {
          alarmGraphicClone.symbol = newSy;
          graphic.symbol = newSy;
        }
        graphicArray.push(alarmGraphicClone);
      }
      layer.graphics.addMany(graphicArray);
    }
  };
  const timer = setInterval(() => {
    index = index === 0 ? 1 : 0;
    layer.graphics.removeAll();
    graphicArray = [];
    changeIcon();
  }, 500);
};
// 删除警图标
export const delAlarmAnimation = async (alarmIconData, alarm, dispatch) => {
  const index = alarmIconData.find(value => value.alarm.resourceGisCode === alarm.resourceGisCode);
  alarmIconData.splice(index, 1);
  dispatch({
    type: 'mapRelation/queryAlarmIconData',
    payload: alarmIconData,
  });
  // // 获取报警动画图层
  // const alarmLayer = map.findLayerById('报警动画');
  // // 删除报警 图标
  // if (alarmLayer) {
  //   // for (const graphic of mapConstants.alarmGraphics) {
  //   const index = mapConstants.alarmGraphics.findIndex(value => value.attributes.resourceGisCode === attr.resourceGisCode);
  //   if (index !== -1) {
  //     mapConstants.alarmGraphics.splice(index, 1);
  //   }
  //   // if (graphic.attributes.alarmCode === attr.alarmCode) {
  //   //   alarmLayer.remove(graphic);
  //   //   // 删除报警图标的定时事件
  //   //   clearInterval(iconObj[attr.alarmCode]);
  //   //   if (iconObj[attr.alarmCode]) {
  //   //     delete iconObj[attr.alarmCode];
  //   //   }
  //   //   dispatch({
  //   //     type: 'alarm/queryIconObj',
  //   //     payload: iconObj,
  //   //   });
  //   // }
  //   // }
  // }
};
// 新建报警图标
export const alarmAnimation = async ({ alarm, geometry, alarmIconData, dispatch }) => {
  // esriLoader.loadModules([
  //   'esri/symbols/PictureMarkerSymbol',
  //   'esri/Graphic']).then(([PictureMarkerSymbol, Graphic]) => {
    const point = mapConstants.view.toScreen(geometry);
    const style = { left: point.x, top: point.y };
    alarmIconData.push({ alarm, geometry, style });
    dispatch({
      type: 'mapRelation/queryAlarmIconData',
      payload: alarmIconData,
    });
    // const legendLayer = mapLayers.FeatureLayers.find(value => value.mapIcon === alarm.ctrlResourceType);
    // let normalIconObj = mapLegendList.find(value => legendLayer.mapLayerName.indexOf(value.name) !== -1);
    // let layerName = '';
    // try {
    //   layerName = legendLayer.mapLayerName + alarm.alarmType.dangerCoefficient;
    // } catch (e) {
    // }
    // if (legendLayer) {
    //   normalIconObj = mapLegendListWithAlarm.find(value => layerName.indexOf(value.name) !== -1);
    // }
    // const pictureMarkerSymbol = new PictureMarkerSymbol({ url: normalIconObj.url, width: '32px', height: '32px', angle });
    // const alarmGraphic = new Graphic(geometry, pictureMarkerSymbol, { ...alarm, symbolObj: pictureMarkerSymbol });
    // // 新建报警图标
    // mapConstants.alarmGraphics.push(alarmGraphic);
  // });
};
// 新建事件图标
export const addEventIcon = (events, dispatch) => {
  // esriLoader.loadModules([
  //   'esri/layers/GraphicsLayer', 'esri/Graphic']).then(([GraphicsLayer, Graphic]) => {
    // const { mainMap } = mapConstants;
    // let eventLayer = mainMap.findLayerById('事件专题图');
    // if (!eventLayer) {
    //   eventLayer = new GraphicsLayer({ id: '事件专题图', minScale: mapConstants.popupScale });
    //   mainMap.add(eventLayer);
    // }
    const eventSy = {
      type: 'picture-marker',
      url: eventIcon,
      width: '32px',
      height: '32px',
      angle,
    };
    // 有报警探测的图层
    const alarmLayerIds = [];
    const eventArray = [];
    let eventIndex = 0;
    const layers = mapLayers.FeatureLayers.filter(value => value.isAlarmLayer);
    for (const item of layers) {
      alarmLayerIds.push(item.id);
    }
    for (const event of events) {
      if (event.gISCode !== null) {
        searchByAttr({ searchText: event.gISCode, searchFields: ['ObjCode'], layerIds: alarmLayerIds }).then((res) => {
          if (res[0]) {
            // 在报警列表里做一个标记
            const index = mapConstants.alarmGraphics.findIndex(value => value.attributes.resourceGisCode === event.gISCode);
            if (index !== -1) {
              mapConstants.alarmGraphics[index].attributes.isEvent = true;
            }
            const newGeo = transToPoint(res[0].feature.geometry);
            const { x, y } = mapConstants.view.toScreen(newGeo);
            // const eventGraphic = new Graphic(newGeo, eventSy, { ...res[0].feature.attributes, event, isEvent: true });
            // eventLayer.graphics.add(eventGraphic);
            eventArray.push({
              event: { ...res[0].feature.attributes, event, isEvent: true }, geometry: newGeo, style: { top: y, left: x },
            });
            eventIndex += 1;
            if (eventIndex === events.length) {
              dispatch({
                type: 'mapRelation/queryEventIconData',
                payload: eventArray,
              });
            }
          } else {
            eventIndex += 1;
            if (eventIndex === events.length) {
              dispatch({
                type: 'mapRelation/queryEventIconData',
                payload: eventArray,
              });
            }
          }
        });
      } else {
        eventIndex += 1;
        if (eventIndex === events.length) {
          dispatch({
            type: 'mapRelation/queryEventIconData',
            payload: eventArray,
          });
        }
      }
    }
  // });
};
// 新建报警图标(传入PictureMarkerSymbol, Graphic)
export const addAlarmAnimation = async ({ alarm, geometry, layer, PictureMarkerSymbol, Graphic }) => {
  const legendLayer = mapLayers.FeatureLayers.find(value => value.mapIcon === alarm.ctrlResourceType);
  let normalIconObj = mapLegendList.find(value => legendLayer.mapLayerName.indexOf(value.name) !== -1);
  let layerName = '';
  try {
    layerName = `${legendLayer.mapLayerName}${alarm.alarmType.dangerCoefficient === 0 ? 1 : alarm.alarmType.dangerCoefficient}`;
  } catch (e) {
  }
  if (legendLayer) {
    normalIconObj = mapLegendListWithAlarm.find(value => layerName.indexOf(value.name) !== -1);
    if (normalIconObj === undefined) {
      normalIconObj = mapLegendList.find(value => legendLayer.mapLayerName.indexOf(value.name) !== -1);
    }
  }
  const pictureMarkerSymbol = new PictureMarkerSymbol({ url: normalIconObj.url, width: '32px', height: '32px', angle });
  const alarmGraphic = new Graphic(geometry, pictureMarkerSymbol, { ...alarm, symbolObj: pictureMarkerSymbol });
  mapConstants.alarmGraphics.push(alarmGraphic);
};
// 报警图标选中
export const hoveringAlarm = ({ geometry, alarm, infoPops, dispatch, iconData, iconDataType, iconIndex }) => {
  if (alarm) {
    const newIconData = [...iconData];
    const dispatchType = (
      () => {
        switch (iconDataType) {
          case 'alarm': return 'mapRelation/queryAlarmIconData';
          case 'event': return 'mapRelation/queryEventIconData';
          case 'env': return 'mapRelation/queryEnvIconData';
          default: break;
        }
      })();
    for (const item of newIconData) {
      item.isSelected = false;
    }
    dispatch({
      type: dispatchType,
      payload: newIconData,
    });
    const newG = transToPoint(geometry);
    const screenPoint = mapConstants.view.toScreen(newG);
    // 添加弹窗(地图单击产生的弹窗为唯一，所以key固定)
    const index = infoPops.findIndex(value => value.key === 'mapClick');
    const index1 = infoPops.findIndex(value => Number(value.resourceCode) === Number(alarm.resourceCode));
    const pop = {
      show: true,
      key: 'mapClick',
      resourceCode: alarm.resourceCode,
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
      screenPoint, screenPointBefore: screenPoint, mapStyle: { width: mapConstants.view.width, height: mapConstants.view.height }, attributes: alarm, geometry: newG, name: alarm.resourceName || alarm.resResourceInfo.resourceName,
    };
    dispatch({
      type: 'mapRelation/queryInfoPops',
      payload: infoPops,
    });
    // const iconIndex = newIconData.findIndex(value => value.alarm.alarmCode === alarm.alarmCode);
    newIconData[iconIndex].isSelected = true;
    // const obj = mapConstants.alarmGraphics.find(value => value.attributes.resourceCode === alarm.resourceCode);
    // let iconObj = {};
    // if (obj) {
    //   iconObj = obj.attributes.symbolObj; 'mapRelation/queryAlarmIconData'
    // }
    // const hoverSy = {
    //   type: 'picture-marker', // autocasts as new SimpleMarkerSymbol()
    //   url: iconObj.url,
    //   width: '32px',
    //   height: '32px',
    //   angle,
    // };
    // const hoverGraphic = new Graphic(newG, iconObj, alarm);
    // layer.graphics.add(hoverGraphic);
    // console.log('screenPoint', screenPoint);
    // const { x, y } = screenPoint;

    dispatch({
      type: dispatchType,
      payload: newIconData,
    });
    dispatch({
      type: 'mapRelation/querySelectIconShow',
      payload: { type: iconDataType, show: true },
    });
  }
};
// 批量增删改报警图标
export const addMapAlarms = ({ alarmIconData, iconObj, dispatch, scale, alarms, historyList }) => {
  dispatch({
    type: 'alarm/queryDrawing',
    payload: true,
  });
  return new Promise((resolve) => {
    esriLoader.loadModules([
      'esri/tasks/FindTask',
      'esri/tasks/support/FindParameters',
    ]).then(([FindTask, FindParameters]) => {
      // 需要新增的图标
      const newAlarms = []; // 去重
      const newHistoryList = [];
      console.log('alarms', alarms);
      console.log('historyList', historyList);
      for (const item of alarms) {
        if (item.resourceGisCode === '783') {
          debugger;
        }
        if (!newAlarms.find(value => value.resourceGisCode === item.resourceGisCode)) {
          newAlarms.push(item);
        }
      }
      console.log('newAlarms', newAlarms);
      for (const item of historyList) {
        if (!newHistoryList.find(value => value.resourceGisCode === item.resourceGisCode)) {
          newHistoryList.push(item);
        }
      }
      const addArray = newAlarms.filter(value =>
        newHistoryList.find(value1 =>
          value1.resourceGisCode === value.resourceGisCode
        ) === undefined);
        // 需要删除的图标
      const delArray = newHistoryList.filter(value =>
        newAlarms.find(value1 =>
          value1.resourceGisCode === value.resourceGisCode
        ) === undefined);
        // 删除图标
      for (const item of delArray) {
        const index = alarmIconData.find(value => value.alarm.resourceGisCode === item.resourceGisCode);
        // const index = mapConstants.alarmGraphics.find(value => value.attributes.resourceGisCode === item.resourceGisCode);
        // if (index !== -1) {
        //   mapConstants.alarmGraphics.splice(index, 1);
        // }
        // delAlarmAnimation(map, item, iconObj, dispatch);
        alarmIconData.splice(index, 1);
      }
      if (addArray.length === 0) {
        dispatch({
          type: 'alarm/queryDrawing',
          payload: false,
        });
        resolve();
      }
      let index = 0;

      // 有报警探测的图层
      const alarmLayerIds = [];
      const layers = mapLayers.FeatureLayers.filter(value => value.isAlarmLayer);
      for (const item of layers) {
        alarmLayerIds.push(item.id);
      }

      // 创建属性查询对象
      const findTask = new FindTask(mapLayers.baseLayer.layerAddress);
      // 创建属性查询参数
      const findParams = new FindParameters();
      // 返回几何信息
      findParams.returnGeometry = true;
      findParams.contains = false;
      findParams.layerIds = alarmLayerIds;
      // 查询的字段
      findParams.searchFields = ['ObjCode'];

      // 新建或获取报警动画图层
      // const alarmLayer = mapConstants.mainMap.findLayerById('报警动画');
      for (const alarm of addArray) {
        if (alarm.resourceGisCode) {
          findParams.searchText = alarm.resourceGisCode;
          const ShowFindResult = (findTaskResult) => {
            const res = findTaskResult.results;
            if (res.length > 0) {
              index += 1;
              // if (addArray.length === 1) {
              //   view.goTo({ center: res[0].feature.geometry, scale: scale - 10 }).then(() => {
              //     addAlarmAnimation({ PictureMarkerSymbol, Graphic, map, geometry: res[0].feature.geometry, alarm, iconObj, scale, layer: alarmLayer, dispatch }).then(() => {
              //     });
              //   });
              // } else {
              const point = mapConstants.view.toScreen(res[0].feature.geometry);
              const style = { left: point.x, top: point.y };
              alarmIconData.push({ alarm, geometry: res[0].feature.geometry, style });
              // addAlarmAnimation({ PictureMarkerSymbol, Graphic, map, geometry: res[0].feature.geometry, alarm, iconObj, scale, layer: alarmLayer, dispatch });
              // }
              if (index === addArray.length) {
                dispatch({
                  type: 'alarm/queryDrawing',
                  payload: false,
                });
                dispatch({
                  type: 'mapRelation/queryAlarmIconData',
                  payload: alarmIconData,
                });
                resolve();
              }
            } else {
              index += 1;
              if (index === addArray.length) {
                dispatch({
                  type: 'mapRelation/queryAlarmIconData',
                  payload: alarmIconData,
                });
                dispatch({
                  type: 'alarm/queryDrawing',
                  payload: false,
                });
                resolve();
              }
            }
          };
          findTask.execute(findParams).then(ShowFindResult);
        } else {
          index += 1;
          if (index === addArray.length) {
            dispatch({
              type: 'mapRelation/queryAlarmIconData',
              payload: alarmIconData,
            });
            dispatch({
              type: 'alarm/queryDrawing',
              payload: false,
            });
            resolve();
          }
        }
      }
    });
  });
};
// 高亮报警图标
export const highlight = (map, geometry, attr, symbol, scale) => {
  esriLoader.loadModules([
    'esri/layers/GraphicsLayer',
    'esri/symbols/PictureMarkerSymbol',
    'esri/Graphic']).then(([GraphicsLayer, PictureMarkerSymbol, Graphic]) => {
    const highlightLayer = new GraphicsLayer({ id: '高亮元素', minScale: scale });
    map.add(highlightLayer);
    const pictureMarkerSymbol = new PictureMarkerSymbol({ url: symbol.url, width: '35px', height: '40px', angle });
    const alarmGraphic = new Graphic(geometry, pictureMarkerSymbol, attr);
    highlightLayer.add(alarmGraphic);
  });
};
// 新建填充图层（实景定位）
export const trueMapLocate = async (map, view, roadLine, dispatch) => {
  esriLoader.loadModules([
    'esri/layers/GraphicsLayer', 'esri/Graphic',
    'esri/symbols/SimpleFillSymbol', 'esri/symbols/SimpleLineSymbol', 'esri/Color']).then(([GraphicsLayer, Graphic, SimpleFillSymbol, SimpleLineSymbol, Color]) => {
    let changeCursor; // 监听鼠标事件
    let trueMapLayer; let cursorMapLayer;
    let roadLinelayer = map.findLayerById(roadLine);
    // 鼠标的替代符号，计算的正余弦有偏差
    const xOffset = 20 * Math.sin(angle * (2 * Math.PI / 360)) - 1;
    const yOffset = 20 * Math.cos(angle * (2 * Math.PI / 360)) - 3;
    const trueMapSy = {
      type: 'picture-marker',
      url: video,
      angle,
      width: '25px',
      xoffset: `${xOffset}px`,
      yoffset: `${yOffset}px`,
      height: '40px',
    };
    if (roadLinelayer) {
      delLayer(map, [roadLine, '实景地图', '鼠标示意'], dispatch);
    } else {
      addLayer(map, [roadLine], dispatch).then((res) => {
        roadLinelayer = res[roadLine];
        view.whenLayerView(roadLinelayer).then((layerView) => {
          changeCursor = view.on('pointer-move', (e) => {
            // 添加假的鼠标指针
            view.hitTest(e).then(({ results }) => {
              if (results.length > 0) {
                const resultM = results.filter((result) => {
                  return result.graphic.layer === trueMapLayer;
                })[0];
                if (resultM) {
                  e.native.target.style.cursor = 'none';
                  const trueMapGraphic = new Graphic(resultM.mapPoint, trueMapSy, { isCursor: true });
                  cursorMapLayer.removeAll();
                  cursorMapLayer.graphics.add(trueMapGraphic);
                } else {
                  e.native.target.style.cursor = 'default';
                  cursorMapLayer.removeAll();
                }
              } else {
                e.native.target.style.cursor = 'default';
                cursorMapLayer.removeAll();
              }
            });
          });
          layerView.watch('updating', (loding) => {
            if (!loding) {
              roadLinelayer.queryFeatures().then((graphics) => {
                // 实景地图示意图层
                trueMapLayer = new GraphicsLayer({ id: '实景地图' });
                cursorMapLayer = new GraphicsLayer({ id: '鼠标示意' });
                const trueMapFill = {
                  type: 'simple-line', // autocasts as new SimpleLineSymbol()
                  color: 'rgba(116, 194, 235, 1)',
                  width: '10px',
                  style: 'solid',
                };
                map.add(trueMapLayer);
                map.add(cursorMapLayer);
                for (const road of graphics.features) {
                  trueMapLayer.graphics.add(new Graphic(road.geometry, trueMapFill));
                }
              });
            }
          });
        });
        // 移除监听事件
        roadLinelayer.on('layerview-destroy', () => {
          // 立即清除鼠标事件，会导致鼠标样式的设置一起丢失。所以延时清除（arcgis的bug）
          setTimeout(() => {
            changeCursor.remove();
          }, 5000);
        });
      });
    }
  });
};
// 实景图定位点示意
export const trueMapTem = async (map, view, geometry, dispatch) => {
  esriLoader.loadModules([
    'esri/geometry/Point']).then(([Point]) => {
    // 新建图层
    const screenPoint = view.toScreen(new Point(geometry.X, geometry.Y));
    // 实景地图切换回来后居中
    if (map.findLayerById('实景地图')) {
      for (const layer of mapLayers.FeatureLayers) {
        if (Number(layer.layerType) === 4) {
          // 取出道路图
          map.remove(map.findLayerById('实景地图'));
          map.remove(map.findLayerById(layer.mapLayerName));
          break;
        }
      }
    }
    dispatch({
      type: 'map/showInfoWindow',
      payload: { show: true, load: true, type: 'simpleInfo', screenPoint, mapStyle: { width: view.width, height: view.height }, attributes: { 设备名称: '刚才在这里' } },
    });
  });
};
// 地图搜索后添加定位图标
export const addSearchIcon = async (map, view, devices, dispatch, isRecenter) => {
  esriLoader.loadModules([
    'esri/layers/GraphicsLayer',
    'esri/symbols/PictureMarkerSymbol',
    'esri/Graphic']).then(([GraphicsLayer, PictureMarkerSymbol, Graphic]) => {
    // 新建或获取报警动画图层
    let resultLayer = map.findLayerById('地图搜索结果');
    if (!resultLayer) {
      resultLayer = new GraphicsLayer({ id: '地图搜索结果' });
      map.add(resultLayer);
    }
    resultLayer.removeAll();
    // 新建定位图标
    for (const [index, device] of devices.entries()) {
      const pictureMarkerSymbol = new PictureMarkerSymbol({ url: locate, width: '25px', height: '40px', angle });
      // 如果地理信息不为点，先做一个转换
      let { geometry } = device.feature;
      switch (device.feature.geometry.type) {
        case 'point': break;
        case 'polygon': geometry = device.feature.geometry.centerid; break;
        case 'polyline': geometry = device.feature.geometry.extent.center; break;
        default: break;
      }
      const resultGraphic = new Graphic(geometry, pictureMarkerSymbol, Object.assign(device.feature.attributes, { resultId: index }));
      resultLayer.add(resultGraphic);
      // 只有一个图标，则不添加序号标识
      if (devices.length > 1) {
        const testGraphic = new Graphic(geometry, {
          type: 'text',
          color: 'white',
          haloColor: 'black',
          haloSize: '1px',
          text: index + 1,
          angle,
          font: {
            size: 10,
            family: 'sans-serif',
          },
        }, Object.assign(device.feature.attributes, { resultId: index }));
        resultLayer.add(testGraphic);
      }
      view.on('click', (e) => {
        view.hitTest(e).then(({ results }) => {
          if (results) {
            const { graphic } = results.filter((result) => {
              return result.graphic.layer === resultLayer;
            })[0];
            dispatch({
              type: 'map/alarmBoardData',
              payload: graphic.attributes,
            });
          }
        });
      });
    }
    // if (!isRecenter) {
    //   multipointExtent(map, view, devices);
    // }
  });
};
// 视频搜索定位
export const addVideoIcon = async (map, view, checkedVideos, dispatch) => {
  esriLoader.loadModules([
    'esri/layers/GraphicsLayer',
    'esri/symbols/PictureMarkerSymbol',
    'esri/Graphic']).then(([GraphicsLayer, PictureMarkerSymbol, Graphic]) => {
    // 新建或获取图层
    let videoLayer = map.findLayerById('视频搜索结果');
    if (!videoLayer) {
      videoLayer = new GraphicsLayer({ id: '视频搜索结果' });
      map.add(videoLayer);
    }
    videoLayer.removeAll();
    // 清空搜索图标图层（因图标一样）
    const resultLayer = map.findLayerById('地图搜索结果');
    if (resultLayer) {
      resultLayer.removeAll();
    }
    const pictureMarkerSymbol = new PictureMarkerSymbol({ url: videoLegend, width: '32px', height: '32px', angle });
    const multipoint = []; // 居中;
    let index = 0;
    for (const video of checkedVideos) {
      searchByAttr({ searchText: video.gISCode, searchFields: ['ObjCode'] }).then((res) => {
        index += 1;
        const device = res[0];
        if (device === undefined) {
          return false;
        }
        // 如果地理信息不为点，先做一个转换
        let { geometry } = device.feature;
        switch (device.feature.geometry.type) {
          case 'point': break;
          case 'polygon': geometry = device.feature.geometry.centerid; break;
          case 'polyline': geometry = device.feature.geometry.extent.center; break;
          default: break;
        }
        const resultGraphic = new Graphic(geometry, pictureMarkerSymbol, Object.assign(device.feature.attributes, { sort: video.sort }));
        videoLayer.add(resultGraphic);
        multipoint.push(device);
        // 添加序号标识
        // const testGraphic = new Graphic(geometry, {
        //   type: 'text',
        //   color: 'white',
        //   haloColor: 'black',
        //   haloSize: '1px',
        //   text: video.sort,
        //   angle,
        //   font: {
        //     size: 10,
        //     family: 'sans-serif',
        //   },
        // }, Object.assign(device.feature.attributes, { sort: video.sort }));
        // videoLayer.add(testGraphic);
        if (index === checkedVideos.length) {
          multipointExtent(map, view, multipoint);
        }
      });
    }
    // 新建定位图标
    view.on('click', (e) => {
      view.hitTest(e).then(({ results }) => {
        if (results) {
          const { graphic } = results.filter((result) => {
            return result.graphic.layer === resultLayer;
          })[0];
          dispatch({
            type: 'map/alarmBoardData',
            payload: graphic.attributes,
          });
        }
      });
    });
  });
};
// 定位图标切换
export const changeIcon = async (map, id, searchText, searchFields, url, width, height) => {
  esriLoader.loadModules([
    'esri/symbols/PictureMarkerSymbol',
  ]).then(([PictureMarkerSymbol]) => {
    const imgObj = {
      locate,
      locateHover,
      videoLegend,
      videoLegendHover,
    };
    // 新建或获取报警动画图层
    const layer = map.findLayerById(id);
    if (layer === undefined) {
      return false;
    }
    const pictureMarkerSymbol = new PictureMarkerSymbol({ url: imgObj[url], width: width || '25px', height: height || '40px', angle });
    for (const graphic of layer.graphics.items) {
      if (graphic.attributes[searchFields] === searchText) {
        graphic.symbol = pictureMarkerSymbol;
        break;
      }
    }
  });
};
// 多点居中（设置显示范围）
export const multipointExtent = async (map, view, devices) => {
  esriLoader.loadModules([
    'esri/geometry/Multipoint',
  ]).then(([Multipoint]) => {
    // 新建多点，取得extent
    const multiPoint = new Multipoint(view.spatialReference);
    const points = [];
    for (const device of devices) {
      // 如果地理信息不为点，先做一个转换
      let { geometry } = device.feature;
      switch (device.feature.geometry.type) {
        case 'point': break;
        case 'polygon': geometry = device.feature.geometry.centroid; break;
        case 'polyline': geometry = device.feature.geometry.extent.center; break;
        default: break;
      }
      points.push([geometry.x, geometry.y]);
    }
    multiPoint.points = points;
    view.goTo({ extent: multiPoint.extent.expand(1.5) });
  });
};
// 处理报警（消除闪烁）
export const clearTwinkle = async (dispatch, payload) => {
  dispatch({
    type: 'alarm/clearTwinkle',
    payload: { alarmCode: payload.alarmCode, showTrip: false },
  });
};
// 为指定区域添加边框
export const addBorder = async (map, geometry, type) => {
  esriLoader.loadModules([
    'esri/layers/GraphicsLayer', 'esri/Graphic',
    'esri/symbols/SimpleFillSymbol', 'esri/symbols/SimpleLineSymbol', 'esri/Color']).then(([GraphicsLayer, Graphic, SimpleFillSymbol, SimpleLineSymbol, Color]) => {
    // 查找道路图层
    let areaBorderLayer;
    if (map.findLayerById(`${type}边框图`)) {
      areaBorderLayer = map.findLayerById(`${type}边框图`);
    } else {
      areaBorderLayer = new GraphicsLayer({ id: `${type}边框图` });
      map.add(areaBorderLayer);
    }
    const fill = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
      new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
        new Color([220, 20, 60]), 1), new Color([116, 194, 235, 0])
    );
    const border = new Graphic(geometry, {
      type: 'simple-fill',
      color: [220, 20, 6, 0.2],
      style: 'solid',
      outline: { // autocasts as new SimpleLineSymbol()
        color: 'blue',
        width: 1,
      },
    }, {});
    areaBorderLayer.graphics.add(border);
  });
};
// 将面、线等转为点
export const transToPoint = (geometry) => {
  let newGeometry;
  switch (geometry.type) {
    case 'point': newGeometry = geometry; break;
    case 'polygon': newGeometry = geometry.centroid; break;
    case 'polyline': newGeometry = geometry.extent.center; break;
    default: break;
  }
  return newGeometry;
};
// 转换坐标系
export const transUnit = (geometry, type) => {
  return new Promise((resolve) => {
    esriLoader.loadModules([
      'esri/geometry/support/webMercatorUtils',
      'esri/geometry/Point',
    ]).then(([WebMercatorUtils, Point]) => {
      let newGeometry;
      let newPoint;
      if (!geometry.type) {
        newPoint = new Point(geometry.X, geometry.Y);
      } else {
        newPoint = geometry;
      }
      // type为0， 经纬度转摩卡托， type为1，反之
      if (type === 0) {
        newGeometry = WebMercatorUtils.webMercatorToGeographic(newPoint);
      } else {
        newGeometry = WebMercatorUtils.geographicToWebMercator(newPoint);
      }
      resolve(newGeometry);
    });
  });
};
// 门禁看板计算坐标
export const getBordStyle = (view) => {
  return new Promise((resolve) => {
    esriLoader.loadModules(['esri/geometry/Point']).then(([Point]) => {
      const points = mapConstants.accessBordPoints;
      const mapPoint = {
        0: new Point({ x: points[0].x, y: points[0].y, spatialReference: view.spatialReference }),
        1: new Point({ x: points[1].x, y: points[1].y, spatialReference: view.spatialReference }),
        2: new Point({ x: points[2].x, y: points[2].y, spatialReference: view.spatialReference }),
      };
      const viewPoint = {
        0: view.toScreen(mapPoint[0]),
        1: view.toScreen(mapPoint[1]),
        2: view.toScreen(mapPoint[2]),
      };
      const left = viewPoint[0].x;
      const top = viewPoint[0].y;
      const width = viewPoint[2].x - viewPoint[0].x;
      const height = viewPoint[1].y - viewPoint[0].y;
      resolve({ left, top, width, height });
    });
  });
};
// 新建范围
export const createExtent = (obj) => {
  return new Promise((resolve) => {
    esriLoader.loadModules(['esri/geometry/Extent']).then(([Extent]) => {
      const { xmax, ymax, xmin, ymin } = obj;
      const extent = new Extent({
        xmax,
        ymax,
        xmin,
        ymin,
        spatialReference: mapConstants.view.spatialReference,
      });
      resolve(extent);
    });
  }

  );
};
// 地图标绘
export const mapMarking = ({ type, nodes, layerType }) => {
  esriLoader.loadModules(['esri/layers/GraphicsLayer', 'esri/Graphic']).then(([GraphicsLayer, Graphic]) => {
    const map = mapConstants.mainMap;
    let markLayer = map.findLayerById('地图标注');
    if (!markLayer) {
      markLayer = new GraphicsLayer({ id: '地图标注' });
      map.add(markLayer);
    }
    switch (type) {
      case 'edit': // 增删改node
        markLayer.graphics.removeAll();
        for (const node of nodes) {
          if (node.shape === 'customLine') {
            const paths = [];
            for (const geometry of node.geometrys) {
              paths.push([geometry.x, geometry.y]);
            }
            const polyline = {
              type: 'polyline',
              paths: [paths],
              spatialReference: mapConstants.view.spatialReference,
            };
            const polylineSymbol = {
              type: 'simple-line',
              color: 'rgba(0, 0, 0, 0)',
              width: 1.2,
            };
            const graphic = new Graphic({ geometry: polyline, symbol: polylineSymbol, attributes: { layerType: node.layerType, stroke: node.stroke } });
            markLayer.graphics.add(graphic);
          }
        }
        break;
      case 'switch':
        {
          const shows = [];
          for (const graphic of markLayer.graphics.items) {
            const newGraphic = graphic.clone();
            if (layerType.indexOf(graphic.attributes.layerType) !== -1) {
              newGraphic.symbol.color = newGraphic.attributes.stroke;
            } else {
              newGraphic.symbol.color = 'rgba(0, 0, 0, 0)';
            }
            shows.push(newGraphic);
          }
          markLayer.graphics.removeAll();
          markLayer.graphics.addMany(shows);
        }
        break;
      default: break;
    }
  });
};
// 地图测试
export const maptesting = () => {
  esriLoader.loadModules([
    'esri/Graphic',
    'esri/layers/GraphicsLayer',
  ]).then(([Graphic, GraphicsLayer]) => {
    const test = new GraphicsLayer({ id: 'test' });
    mapConstants.mainMap.add(test);
    const a = mapConstants.view.on('pointer-down', (e) => {
      const point = mapConstants.view.toMap(e);
      const pointGraphic = new Graphic(
        point, {
          type: 'simple-marker',
          color: 'white',
          size: 5,
          outline: {
            width: 1,
            color: 'red',
          } }, { isMeasure: true }
      );
      const textGraphic = new Graphic(
        point, {
          type: 'text',
          color: 'black',
          haloColor: 'grey',
          haloSize: '1px',
          text: 'im a test',
          xoffset: 3,
          yoffset: 3,
          angle,
          font: {
            size: 8,
            family: 'sans-serif',
            weight: 'bolder',
          },
        }, { isMeasure: true }
      );
      test.addMany([pointGraphic, textGraphic]);
    });
  });
};
// 相关图层清空

export const clearLayer = (map, dispatch) => {
  const layers = ['地图搜索结果', '周边查询', '空间查询', '测量', '标注', '圈选'];
  for (const name of layers) {
    const layer = map.findLayerById(name);
    if (layer) {
      map.remove(layer);
    }
  }
  dispatch({
    type: 'map/getDeviceArray',
    payload: null,
  });
};
