import {
  addLayer, delLayer, addVocsIcon, transToPoint, addConstructIcon, alarmClustering,
  solidWarehouseDetail, paSystemDetail, addMapAlarms, getBordStyle,
} from '../../utils/mapService';
import { changeVideoPosition, changeVideoSize, resetAccessStyle, returnHome } from '../../utils/utils';
import { constantlyModal, infoConstantly, infoPopsModal } from '../../services/constantlyModal';
import { mapConstants, mapLayers } from '../../services/mapConstant';

const loopObj = {};
export const handleClick = (event, treeId, treeNode, that) => {
  const openBoard = (boardType, param, name, nameKeys) => {
    const { expandKeys, activeKeys } = that.props.panelBoard;
    const newArr = [];
    for (const arr of activeKeys) {
      newArr.push(arr.keys);
    }
    const newKey = boardType || name;
    if (!activeKeys.find(value => value.keys === newKey)) {
      activeKeys.unshift({ name, uniqueKey: 0, keys: newKey, param });
    }
    if (newArr.indexOf(`${nameKeys || boardType || name}`) === -1) {
      expandKeys.push(`${nameKeys || boardType || name}`);
      that.props.dispatch({
        type: 'panelBoard/queryList',
        payload: {
          expandKeys,
          activeKeys,
        },
      });
    }
  };
  const closePanel = (keys, nameKeys) => {
    const { expandKeys, activeKeys } = that.props.panelBoard;
    const expandNames = expandKeys.filter(item => item !== (nameKeys || keys));
    const activeNames = activeKeys.filter(item => item.keys !== (nameKeys || keys));
    that.props.dispatch({
      type: 'panelBoard/queryList',
      payload: { expandKeys: expandNames, activeKeys: activeNames },
    });
  };
  const openOrCloseBoard = (nameKeys) => {
    if (that.props.rightCollapsed) {
      const { video, dispatch, rightCollapsed } = that.props;
      const { position } = video;
      changeVideoPosition('homePage', rightCollapsed, position, dispatch);
      dispatch({
        type: 'global/changeRightCollapsed',
        payload: false,
      }).then(() => {
        const { videoFooterHeight, accessControlShow } = that.props;
        const { view, accessInfoExtent } = mapConstants;
        changeVideoSize(videoFooterHeight, dispatch, 'show');
        resetAccessStyle(accessControlShow, dispatch, accessInfoExtent);
        setTimeout(() => {
          const param = { alarmType: treeNode.checkFunctionCode, title: treeNode.name };
          openBoard(treeNode.checkFunctionCode, param, treeNode.checkClickFunTemplate, nameKeys);
        }, 400);
      });
    } else {
      const param = { alarmType: treeNode.checkFunctionCode, title: treeNode.name };
      openBoard(treeNode.checkFunctionCode, param, treeNode.checkClickFunTemplate, nameKeys);
    }
  };
  const { ztreeObj, dispatch } = that.props;
  const { resourceCode } = treeNode;
  // 清除轮询
  clearInterval(infoConstantly.intervalID);
  // 处理节点点击的情况。
  // const selectNodes = ztreeObj.getSelectedNodes();
  // if (selectNodes.find(value => value === treeNode)) {
  //   ztreeObj.cancelSelectedNode(treeNode);
  // } else {
  //   ztreeObj.selectNode(treeNode, true);
  // }
  if (!treeNode.chkDisabled) {
    if (!treeNode.checked) {
      ztreeObj.checkNode(treeNode, !treeNode.checked, false, true);
    } else if (resourceCode === undefined) {
      ztreeObj.checkNode(treeNode, !treeNode.checked, false, true);
    }
  }
  // 面板打开
  // 判断节点的功能码
  switch (treeNode.checkClickFunTemplate) {
    // 报警统计看板
    case 'AlarmCountingPanel':
      openOrCloseBoard();
      break;
    case 'AlarmList':
      openOrCloseBoard();
      break;
    case 'AlarmListByFault':
      openOrCloseBoard();
      break;
    // 门禁
    case 'EntranceGuard':
      // openOrCloseBoard('EntranceGuard');
      dispatch({
        type: 'sidebar/zoomIn',
        payload: {
          id: 4,
          title: treeNode.name,
        },
      });
      break;
    // VOCS
    case 'VOCSGovernList':
      openOrCloseBoard('VOCSGovernList');
      break;
    // 实时数据
    case 'realDataPanel':
      openOrCloseBoard();
      break;
    // 作业监控
    case 'ConstructMontiorPanel':
      openOrCloseBoard();
      break;
    default: break;
  }
};
export const handleSelected = (treeId, treeNode, that) => {
  const { dispatch, ztreeObj } = that.props;
  const { gISCode, resourceCode } = treeNode;
  const { view, popupScale } = mapConstants;
  const obj = document.getElementById(`${treeNode.tId}`);
  let parent;
  // 生产监测 特殊处理
  if (treeNode.checkClickFunTemplate === 'StatusGraphics' || treeNode.checkClickFunTemplate === 'DeviceMonitor') {
    const inputs = document.getElementsByName('StatusGraphics&DeviceMonitor');
    for (const input of inputs) {
      if (input.checked) {
        const node = ztreeObj.getNodeByTId(input.getAttribute('tId'));
        node.checked = false;
        handleCheck({}, treeId, node, that);
      }
    }
  } else {
    if (treeNode.parentTId !== null) {
      parent = document.getElementById(ztreeObj.getNodeByTId(treeNode.parentTId).tId);
    }
    if (parent) {
      const inputs = parent.getElementsByTagName('input');
      for (const input of inputs) {
        if (input.checked) {
          const node = ztreeObj.getNodeByTId(input.getAttribute('tId'));
          node.checked = false;
          handleCheck({}, treeId, node, that);
        }
      }
    }
  }

  const input = obj.getElementsByTagName('input')[0];
  if (input) {
    input.checked = !input.checked;
    treeNode.checked = input.checked;
    handleCheck({}, treeId, treeNode, that);
  }

  if (resourceCode) {
    // if (!treeNode.checked) {

    // 清除轮询
    clearInterval(infoConstantly.intervalID);
    // 获取资源
    dispatch({
      type: 'resourceTree/selectByGISCode',
      payload: { pageNum: 1, pageSize: 1, isQuery: true, fuzzy: false, gISCode },
    }).then(() => {
      // 同步存树节点信息
      that.props.dispatch({
        type: 'resourceTree/saveTreeNode',
        payload: { ...treeNode },
      });
      dispatch({
        type: 'map/searchDeviceByAttr',
        payload: { searchText: gISCode, searchFields: ['ObjCode'] },
      }).then(() => {
        const { searchDeviceArray } = that.props;
        if (searchDeviceArray.length > 0) {
          if (searchDeviceArray[0].feature.geometry === null) {
            return false;
          }
          const newGeometry = transToPoint(searchDeviceArray[0].feature.geometry);
          const screenPoint = view.toScreen(searchDeviceArray[0].feature.geometry);
          dispatch({
            type: 'map/screenPoint',
            payload: screenPoint,
          });
          dispatch({
            type: 'map/mapPoint',
            payload: newGeometry,
          });
          // 弹窗
          const { infoPops } = that.props;
          const index1 = infoPops.findIndex(value => value.key === 'deviceInfo');
          const pop = {
            show: true,
            key: 'deviceInfo',
            uniqueKey: Math.random() * new Date().getTime(),
          };
          if (index1 === -1) {
            infoPops.push(pop);
          } else {
            infoPops.splice(index1, 1, pop);
          }
          infoPopsModal.deviceInfo = {
            screenPoint, screenPointBefore: screenPoint, mapStyle: { width: view.width, height: view.height }, attributes: searchDeviceArray[0].feature.attributes, geometry: newGeometry, name: treeNode.name,
          };
          dispatch({
            type: 'mapRelation/queryInfoPops',
            payload: infoPops,
          });
          view.goTo({ center: newGeometry, scale: popupScale - 100 }).then(() => { });
        }
      }
      );
    });
    // }
    // else {
    //   const { resourceInfo } = that.props;
    //   // 如果关闭的是当前的资源，则关闭信息窗
    //   if (treeNode.resourceID === resourceInfo.resourceID) {
    //     // 关闭资源信息窗
    //     dispatch({
    //       type: 'resourceTree/saveCtrlResourceType',
    //       payload: '',
    //     });
    //     // 清除轮询
    //     clearInterval(infoConstantly.intervalID);
    //   }
    //   // 关闭pop
    //   const { infoPops } = that.props;
    //   const index = infoPops.findIndex(value => value.key === treeNode.gISCode);
    //   infoPops.splice(index, 1);
    //   delete infoPopsModal[treeNode.gISCode];
    //   dispatch({
    //     type: 'map/queryInfoPops',
    //     payload: infoPops,
    //   });
    // }
  }
};
export const handleCheck = (event, treeId, treeNode, that) => {
  const { dispatch, videoFooterHeight, video } = that.props;
  const { mainMap, view, baseLayer, popupScale } = mapConstants;
  const deviceArrayIndex = treeNode.checkClickFunTemplate + treeNode.treeID;
  const { treeID } = treeNode;
  // 返回首页
  returnHome(that).then(() => {
    // 隐藏视频
    if (that.state.isInit) {
      if (video.layout !== 'reset') {
        dispatch({
          type: 'video/switch',
          payload: {
            CmdCode: 'Hide',
          },
        });
        if (videoFooterHeight.current !== 0) {
          dispatch({
            type: 'homepage/getVideoFooterHeight',
            payload: { current: 0, cache: videoFooterHeight.current },
          });
          dispatch({
            type: 'homepage/getMapHeight',
            payload: { domType: 'map', changingType: 'evrVideo' },
          });
        }
      }
    }
    // 获取资源树对应的图层
    const layers = [];
    for (const layer of treeNode.resResourceTreeMapLayers) {
      layers.push(layer.layerInfo.mapLayerName);
    }
    // 判断节点的功能码
    const subLayers = [];
    for (const layer of treeNode.resResourceTreeMapLayers) {
      let layer1;
      layer1 = mapLayers.FeatureLayers.find(value => value.layerAddress === layer.layerInfo.layerAddress);
      if (layer1 === undefined) {
        layer1 = mapLayers.FrontLayers.find(value => value.layerAddress === layer.layerInfo.layerAddress);
      }
      const subId = layer1.id;
      const subLayer = baseLayer.findSublayerById(subId);
      subLayers.push(subLayer);
    }
    switch (treeNode.checkClickFunTemplate) {
      // 'AlarmCounting', '报警统计看板'
      case 'AlarmMaping': // 聚合
        if (treeNode.checkFunctionCode === '') {
          return false;
        }

        if (treeNode.checked) {
          const { overviewShow, alarmIconObj } = that.props;
          switch (Number(treeNode.checkFunctionCode)) {
            case 1:
              overviewShow.showSafety = true; break;
            case 2:
              overviewShow.showEnv = true; break;
            case 3:
              overviewShow.showFault = true; break;
            default: break;
          }
          that.props.dispatch({
            type: 'alarm/filter',
            payload: {
              historyList: that.props.groupByOverview.list,
              alarms: that.props.listWithFault,
              para: overviewShow,
            },
          }).then(() => {
            alarmClustering({ dispatch, alarms: that.props.groupByOverview.list, graphics: mapConstants.areaGraphics, overviewShow: that.props.overviewShow, popupScale });
            // 地图报警图标
            if (that.props.groupByOverview.list.length > 0) {
              // ztreeObj.setChkDisabled(treeNode, true);
              dispatch({
                type: 'sysFunction/queryOftenTreeDisabled',
                payload: true,
              });
            }
            addMapAlarms({ iconObj: alarmIconObj, dispatch, alarmIconData: that.props.alarmIconData, scale: popupScale, alarms: that.props.groupByOverview.list, historyList: that.props.groupByOverview.historyList }).then(() => {
              // ztreeObj.setChkDisabled(treeNode, false);
              // that.setDisabled(false);
              dispatch({
                type: 'sysFunction/queryOftenTreeDisabled',
                payload: false,
              });
            });
          }
          );
        } else {
          const { overviewShow, alarmIconObj } = that.props;
          switch (Number(treeNode.checkFunctionCode)) {
            case 1:
              overviewShow.showSafety = false; break;
            case 2:
              overviewShow.showEnv = false; break;
            case 3:
              overviewShow.showFault = false; break;
            default: break;
          }
          dispatch({
            type: 'alarm/filter',
            payload: {
              historyList: that.props.groupByOverview.list,
              alarms: that.props.listWithFault,
              para: overviewShow,
            },
          }).then(() => {
            alarmClustering({ view, dispatch, alarms: that.props.groupByOverview.list, graphics: mapConstants.areaGraphics, overviewShow: that.props.overviewShow, popupScale });
            // 地图报警图标
            if (that.props.groupByOverview.list.length > 0) {
              // ztreeObj.setChkDisabled(treeNode, true);
              // that.setDisabled(true)
              dispatch({
                type: 'sysFunction/queryOftenTreeDisabled',
                payload: true,
              });
            }
            addMapAlarms({ iconObj: alarmIconObj, dispatch, alarmIconData: that.props.alarmIconData, scale: popupScale, alarms: that.props.groupByOverview.list, historyList: that.props.groupByOverview.historyList }).then(() => {
              // ztreeObj.setChkDisabled(treeNode, false);
              // that.setDisabled(false);
              dispatch({
                type: 'sysFunction/queryOftenTreeDisabled',
                payload: false,
              });
            });
          }
          );
        }
        return false;
      // case 'ConstantlyMap': // 实时数据图
      //   {
      //     const searchFields = ['ObjCode'];
      //     const { ctrlResourceType } = treeNode;
      //     if (treeNode.ctrlResourceType === '') {
      //       return false;
      //     }
      //     const { constantlyComponents } = that.props;
      //     let spaceTime;
      //     treeNode.checkFunctionCode < 3000 ? spaceTime = 3000 : spaceTime = Number(treeNode.checkFunctionCode);
      //     func({
      //       treeNode,
      //       searchFields,
      //       baseLayer,
      //       ctrlResourceType,
      //       dispatch,
      //       mainMap,
      //       scale: popupScale,
      //       view,
      //       constantlyComponents,
      //       spaceTime,
      //       loopObj,
      //     });
      //   }
      //   return false;
      // 组态图
      case 'StatusGraphics':
        if (treeNode.checked) {
          dispatch({
            type: 'homepage/queryModalType',
            payload: 'currentFlow',
          });
          // dispatch({
          //   type: 'flow/queryCurrentFlow',
          //   payload: { show: false, data: {}, treeNode },
          // });
          setTimeout(() => {
            dispatch({
              type: 'flow/fetch',
              payload: { resourceID: Number(treeNode.checkFunctionCode), treeNode },
            });
          }, 100);
        } else {
          dispatch({
            type: 'flow/queryCurrentFlow',
            payload: { show: false, data: {} },
          });
        }
        break;
      // 门禁专题
      case 'AccessControlConstantly':
        {
          const spaceTime = Number(treeNode.checkFunctionCode);
          if (treeNode.checked) {
          // 关掉聚合图
            view.goTo({ extent: mapConstants.accessInfoExtent }).then(() => {
            // 停止地图事件
              dispatch({
                type: 'map/queryStopPropagation',
                payload: true,
              });
              // const obj = JSON.parse(JSON.stringify(that.props.clusterPopup));
              // dispatch({
              //   type: 'map/queryClusterPopup',
              //   payload: { show: obj.show, load: false, data: obj.data },
              // });
              dispatch({
                type: 'accessControl/switch',
                payload: true,
              });
              dispatch({
                type: 'accessControl/querySpaceTime',
                payload: spaceTime,
              });
              // 写死四个点，作为看板的坐标
              constantlyModal[treeNode.checkClickFunTemplate + treeNode.treeID] = { data: [], mapData: [] };
              const graphics = [];
              const graphicsLoad = { index: 0, loaded: false };
              // 获取看板的坐标
              getBordStyle(view).then((style) => {
                dispatch({
                  type: 'accessControl/queryStyle',
                  payload: style,
                });
                for (const subLayer of subLayers) {
                // subLayer.visible = true;
                // 找到图元
                  const query = subLayer.createQuery();
                  query.outFields = ['*'];
                  subLayer.queryFeatures(query).then((res) => {
                    const { features } = res;
                    graphics.push(...features);
                    graphicsLoad.loaded = true;
                  });
                }
                const a = setInterval(() => {
                  if (graphicsLoad.loaded) {
                    clearInterval(a);
                    dispatch({
                      type: 'accessControl/getAllDoorCount',
                      payload: { map: mainMap, view, layer: subLayers[0], graphics, dispatch },
                    });
                    // loopObj[deviceArrayIndex] = setInterval(() => {
                    //   dispatch({
                    //     type: 'accessControl/getAllDoorCount',
                    //     payload: { map: mainMap, view, layer: subLayers[0], graphics, dispatch },
                    //   });
                    // }, spaceTime);
                  }
                }, 100);
              });
            });
          } else {
            delLayer(mainMap, ['门禁专题图'], dispatch);
            dispatch({
              type: 'mapRelation/queryAccessPops',
              payload: { show: false, load: false, data: [] },
            });
            // 恢复地图事件
            dispatch({
              type: 'map/queryStopPropagation',
              payload: false,
            });
            dispatch({
              type: 'accessControl/switch',
              payload: false,
            });
            clearInterval(loopObj[treeNode.checkClickFunTemplate + treeNode.treeID]);
            loopObj[treeNode.checkClickFunTemplate + treeNode.treeID] = null;
            // 清除实时专题组件及数据
            delete constantlyModal[treeNode.checkClickFunTemplate + treeNode.treeID];
            dispatch({
              type: 'mapRelation/delClusterPopup',
              payload: { type: 'accessPops', data: { show: false, load: false, data: [] } },
            });
          }
        }
        return false;
      // 作业监控
      case 'ConstructMontior':
        if (treeNode.checked) {
          dispatch({
            type: 'constructMonitor/fetchOrgList',
          });
          dispatch({
            type: 'constructMonitor/fetchConstructMonitorList',
          }).then(() => {
            const list = that.props.constructMonitor.groupingList;
            addConstructIcon({ map: mainMap, layer: subLayers[0], scale: popupScale, list, dispatch });
          });
        } else {
          dispatch({
            type: 'mapRelation/delClusterPopup',
            payload: { type: 'constructMonitorClusterPopup', data: { show: false, load: false, data: [] } },
          });
        }
        break;
      // 设备监测
      case 'DeviceMonitor':
        if (treeNode.checked) {
          // 临时将ctrlResourceType与checkFunctionCode组成数组，
          const resourceIDs = treeNode.checkFunctionCode.split(',');
          const ctrlResourceTypes = treeNode.ctrlResourceType.split(',');
          const Monitors = [];
          for (const [index, item] of ctrlResourceTypes.entries()) {
            Monitors.push({ ctrlResourceType: item, resourceID: resourceIDs[index] });
          }
          dispatch({
            type: 'flow/fetchDeviceOptions',
            payload: { resourceIDs, treeNode },
          }).then(() => {
            dispatch({
              type: 'homepage/queryModalType',
              payload: 'deviceMonitor',
            });
            dispatch({
              type: 'homepage/queryDeviceMonitor',
              payload: { show: true, devicesName: treeNode.name, Monitors },
            });
          });
        } else {
          dispatch({
            type: 'homepage/queryDeviceMonitor',
            payload: { show: false, devicesName: '', ctrlResourceType: '' },
          });
          dispatch({
            type: 'flow/queryDeviceMonitor',
            payload: { show: false, ctrlResourceType: '', spaceTime: 0, devicesName: '' },
          });
        }
        break;
      // 环保监测
      case 'EnvMonitor':
        if (treeNode.checked) {
          // input check事件特殊处理
          setTimeout(() => {
            dispatch({
              type: 'mapRelation/queryEnvIconShow',
              payload: true,
            });
          }, 1000);

          constantlyModal.env = {};
          constantlyModal.env[treeID] = true; // 增加参数控制异步
          const query = subLayers[0].createQuery();
          query.outFields = ['*'];
          const { ctrlResourceType } = treeNode;
          subLayers[0].queryFeatures(query).then((res) => {
            loopObj[deviceArrayIndex] = setInterval(() => {
              if (treeNode.checkFunctionCode) {
                dispatch({
                  type: 'constantlyData/getNewsDataByGroup',
                  payload: { view, map: mainMap, graphics: res.features, dispatch, groupID: treeNode.checkFunctionCode, treeID },
                });
              } else {
                dispatch({
                  type: 'constantlyData/getNewsDataByCtrlResourceType',
                  payload: { view, map: mainMap, graphics: res.features, dispatch, ctrlResourceType, treeID },
                });
              }
            }, 30000);
            if (treeNode.checkFunctionCode) {
              dispatch({
                type: 'constantlyData/getNewsDataByGroup',
                payload: { view, map: mainMap, graphics: res.features, dispatch, groupID: treeNode.checkFunctionCode, treeID },
              });
            } else {
              dispatch({
                type: 'constantlyData/getNewsDataByCtrlResourceType',
                payload: { view, map: mainMap, graphics: res.features, dispatch, ctrlResourceType, treeID },
              });
            }
          });
        } else {
          if (constantlyModal.env) {
            constantlyModal.env[treeID] = false;
            constantlyModal.env.data = {};
          }
          dispatch({
            type: 'mapRelation/queryEnvIconShow',
            payload: false,
          });
          dispatch({
            type: 'mapRelation/queryEnvIconData',
            payload: [],
          });
          clearInterval(loopObj[deviceArrayIndex]);
          delLayer(mainMap, ['环保专题图'], dispatch);
        }
        break;
      // VOCs监测
      case 'VocsMonitor':
        if (treeNode.checked) {
          dispatch({
            type: 'vocsMonitor/fetchList',
          }).then(() => {
            const { list } = that.props.vocsMonitor;
            addVocsIcon({ map: mainMap, layer: subLayers[0], scale: popupScale, list, dispatch });
          });
        } else {
          addVocsIcon({ map: mainMap, dispatch });
          dispatch({
            type: 'mapRelation/delClusterPopup',
            payload: { type: 'vocsPopup', data: { show: false, load: false, data: [] } },
          });
        }
        break;
      // 危险源专题图
      case 'DangerSource':
        if (treeNode.checked) {
          addLayer(mainMap, layers, dispatch).then((res) => {
            const dangerLayer = res[layers[0]];
            view.whenLayerView(dangerLayer).then((layerView) => {
              layerView.watch('updating', (loding) => {
                if (!loding) {
                  view.goTo({ extent: layerView.fullExtent });
                }
              });
            });
            view.on('click', (e) => {
              view.hitTest(e).then(({ results }) => {
                if (results.length > 0) {
                  const { graphic } = results.filter((result) => {
                    return result.graphic.layer === dangerLayer;
                  })[0];
                  if (graphic) {
                    dispatch({
                      type: 'resourceTree/saveRiskID',
                      payload: graphic.attributes['区域编码'],
                    });
                  }
                }
              });
            });
          });
        } else {
          delLayer(mainMap, layers, dispatch);
        }
        return false;
      // 安全风险专题图
      case 'DangerRisk':
        if (treeNode.checked) {
          addLayer(mainMap, layers, dispatch).then((res) => {
            const dangerLayer = res[layers[0]];
            view.whenLayerView(dangerLayer).then((layerView) => {
              layerView.watch('updating', (loding) => {
                if (!loding) {
                  view.goTo({ extent: layerView.fullExtent });
                }
              });
            });
            view.on('click', (e) => {
              view.hitTest(e).then(({ results }) => {
                if (results.length > 0) {
                  const { graphic } = results.filter((result) => {
                    return result.graphic.layer === dangerLayer;
                  })[0];
                  if (graphic) {
                    dispatch({
                      type: 'resourceTree/saveRiskID',
                      payload: graphic.attributes['区域编码'],
                    });
                    // that.props.dispatch({
                    //   type: 'resourceTree/selectByGISCode',
                    //   payload: { pageNum: 1, pageSize: 1, isQuery: true, fuzzy: false, gISCode: graphic.attributes.ObjCode },
                    // });
                  }
                }
              });
            });
            // dangerLayer.on('click', (e) => {
            //   dispatch({
            //     type: 'resourceTree/saveRiskID',
            //     payload: e.graphic.attributes['区域编码'],
            //   });
            //   dispatch({
            //     type: 'resourceTree/securityRisk',
            //     payload: 'securityRisk',
            //   });
            //   e.preventDefault();
            //   e.stopPropagation();
            //   return false;
            // });
          });
        } else {
          delLayer(mainMap, layers, dispatch);
        }
        return false;
      // 扩音对讲专题图
      case 'PAsystem':
        if (treeNode.checked) {
          const subLayer = subLayers[0];
          dispatch({
            type: 'paSystem/queryPALayer',
            payload: subLayer,
          });
          // 请求资源
          dispatch({
            type: 'paSystem/fetchAllDevice',
            payload: { ctrlType: treeNode.ctrlResourceType },
          }).then(() => {
            // 请求状态
            const array = [];
            const { devices } = that.props.paSystem;
            // console.log('devices', devices);
            for (const device of devices) {
              // const status = deviceStatus.find(value => value.resourceID === device.resourceID);
              const index = array.findIndex(value => value.areaGISCode === device.area.gISCode);
              if (index === -1) {
                // array.push({ areaGISCode: device.area.gISCode, area: device.area, devices: [{ device, state: status ? status.state : 'none' }] });
                array.push({ areaGISCode: device.area.gISCode, area: device.area, devices: [{ device }] });
              } else {
                array[index].devices.push({ device });
              }
            }
            // console.log('array', array);
            dispatch({
              type: 'paSystem/queryPASystemInfo',
              payload: array,
            });
            paSystemDetail({ map: mainMap, view, layer: subLayer, dispatch, paData: array });
            // dispatch({ type: 'paSystem/fetchDeviceStatus' }).then(() => {
            //
            // });
          });
          // loopObj.PAsystem = setInterval(() => {
          //   // 请求资源
          //   dispatch({
          //     type: 'paSystem/fetchAllDevice',
          //     payload: { ctrlType: treeNode.ctrlResourceType },
          //   }).then(() => {
          //     // 请求状态
          //     dispatch({ type: 'paSystem/fetchDeviceStatus' }).then(() => {
          //       const array = [];
          //       const { devices, deviceStatus } = that.props.paSystem;
          //       for (const device of devices) {
          //         const status = deviceStatus.find(value => value.resourceID === device.resourceID);
          //         const index = array.findIndex(value => value.areaGISCode === device.area.gISCode);
          //         if (index === -1) {
          //           array.push({ areaGISCode: device.area.gISCode, area: device.area, devices: [{ device, state: status ? status.state : 'none' }] });
          //         } else {
          //           array[index].devices.push({ device, state: status ? status.state : 'none' });
          //         }
          //       }
          //       dispatch({
          //         type: 'paSystem/queryPASystemInfo',
          //         payload: array,
          //       });
          //       paSystemDetail({ map: mainMap, view, layer: subLayer, dispatch, paData: array });
          //     });
          //   });
          // }, 3000);
        } else {
          clearInterval(loopObj.PAsystem);
          delLayer(mainMap, ['扩音对讲专题图', '扩音对讲标注专题图'], dispatch);
          dispatch({
            type: 'map/queryPAPopup',
            payload: { show: false, load: false, data: [] },
          });
        }
        break;
      // 区域图层（禁止点击事件）
      case 'AreaLayer':
        if (treeNode.checked) {
          addLayer(mainMap, layers, dispatch).then((res) => {
            const layer = res[layers[0]];
            view.on('click', (e) => {
              mapConstants.view.hitTest(e.screenPoint).then(({ results }) => {
                const { graphic } = results.filter(value => value.graphic.layer === layer)[0];
                if (graphic) {
                  e.stopPropagation();
                }
              });
            });
          });
        } else {
          delLayer(mainMap, layers, dispatch);
        }
        break;
      // 固体仓库专题图
      case 'SolidWarehouse':
        solidWarehouseDetail({ map: mainMap, layer: subLayers[0], dispatch });
        break;
      // case 'WaterConstantly': // 水专题图
      //   {
      //     const searchFields = ['ObjCode'];
      //     const ctrlResourceType = '103.101.201';
      //     const { constantlyComponents } = that.props;
      //     const spaceTime = 3000;
      //     func1({
      //       treeNode,
      //       view,
      //       searchFields,
      //       ctrlResourceType,
      //       dispatch,
      //       mainMap,
      //       scale: popupScale,
      //       constantlyComponents,
      //       spaceTime,
      //     });
      //   }
      //   return false;
      // case 'ElectricConstantly': // 电专题图
      //   {
      //     const searchFields = ['ObjCode'];
      //     const ctrlResourceType = '103.101.203.101';
      //     const { constantlyComponents } = that.props;
      //     const spaceTime = 3000;
      //     func({
      //       treeNode,
      //       view,
      //       searchFields,
      //       ctrlResourceType,
      //       dispatch,
      //       mainMap,
      //       scale: popupScale,
      //       constantlyComponents,
      //       spaceTime,
      //     });
      //   }
      //   return false;
      // case 'HigherSteamConstantly': // 超高压蒸汽专题图
      //   {
      //     const searchFields = ['ObjCode'];
      //     const ctrlResourceType = '103.101.203.102';
      //     const { constantlyComponents } = that.props;
      //     const spaceTime = 3000;
      //     func({
      //       treeNode,
      //       view,
      //       searchFields,
      //       ctrlResourceType,
      //       dispatch,
      //       scale: popupScale,
      //       mainMap,
      //       constantlyComponents,
      //       spaceTime,
      //     });
      //   }
      //   return false;
      // case 'HighSteamConstantly': // 高压蒸汽专题图
      //   {
      //     const searchFields = ['ObjCode'];
      //     const ctrlResourceType = '103.101.203.102';
      //     const { constantlyComponents } = that.props;
      //     const spaceTime = 3000;
      //     func({
      //       treeNode,
      //       view,
      //       searchFields,
      //       ctrlResourceType,
      //       dispatch,
      //       scale: popupScale,
      //       mainMap,
      //       constantlyComponents,
      //       spaceTime,
      //     });
      //   }
      //   return false;
      // case 'MiddleSteamConstantly': // 中压蒸汽专题图
      //   {
      //     const searchFields = ['ObjCode'];
      //     const ctrlResourceType = '103.101.203.103';
      //     const { constantlyComponents } = that.props;
      //     const spaceTime = 3000;
      //     func({
      //       treeNode,
      //       view,
      //       searchFields,
      //       ctrlResourceType,
      //       dispatch,
      //       scale: popupScale,
      //       mainMap,
      //       constantlyComponents,
      //       spaceTime,
      //     });
      //   }
      //   return false;
      // case 'LowSteamConstantly': // 低压蒸汽专题图
      //   {
      //     const searchFields = ['ObjCode'];
      //     const ctrlResourceType = '103.101.203.104';
      //     const { constantlyComponents } = that.props;
      //     const spaceTime = 3000;
      //     func({
      //       treeNode,
      //       view,
      //       searchFields,
      //       ctrlResourceType,
      //       dispatch,
      //       scale: popupScale,
      //       mainMap,
      //       constantlyComponents,
      //       spaceTime,
      //     });
      //   }
      //   return false;
      // case 'WindConstantly': // 风专题图
      //   if (treeNode.checked) {
      //     // 打开水专题图
      //     let electricLayer;
      //     const testData = [ // 用电量，电流
      //       { gISCode: 10381, temp: 60, pressure: 76, level: 44, flow: 35 },
      //       { gISCode: 10382, temp: 22, pressure: 15, level: 16, flow: 90 },
      //       { gISCode: 10383, temp: 45, pressure: 15, level: 27, flow: 79 },
      //       { gISCode: 10384, temp: 123, pressure: 14, level: 68, flow: 89 },
      //     ];
      //     if (!mainMap.findLayerById('洗眼器')) {
      //       addLayer(mainMap, ['洗眼器'], dispatch).then((res) => {
      //         electricLayer = res['洗眼器'];
      //       });
      //     } else {
      //       electricLayer = mainMap.findLayerById('洗眼器');
      //     }
      //     // 获取门禁的地理信息
      //     const getLayer = mainMap.on('layer-add-result', () => {
      //       getLayer.remove();
      //       // 请求门禁实时数据,将门禁地理信息合并
      //       dispatch({
      //         type: 'homepage/getConstantlyData',
      //         payload: { type: 'gasConstantlyData', param: { ctrlResourceType: '102.102.101' } },
      //       }).then(() => {
      //         thematicMaping({ type: 'Wind', deviceArray: testData, searchText: 'gISCode', searchFields: ['ObjCode'], layerIds: [electricLayer.layerId], scale });
      //       });
      //       loopObj.WindConstantly = setInterval(() => {
      //         dispatch({
      //           type: 'homepage/getConstantlyData',
      //           payload: { type: 'gasConstantlyData', param: { ctrlResourceType: '102.102.101' } },
      //         }).then(() => {
      //           thematicMaping({ type: 'Wind', deviceArray: testData, searchText: 'gISCode', searchFields: ['ObjCode'], layerIds: [electricLayer.layerId], scale });
      //         });
      //       }, 60000);
      //     });
      //   } else {
      //     delLayer(mainMap, ['洗眼器', '风实时数据专题图'], dispatch);
      //     clearInterval(loopObj.WindConstantly);
      //     dispatch({
      //       type: 'map/windConstantlyInfo',
      //       payload: { show: false, data: [] },
      //     });
      //   }
      //   return false;
      // 裂解炉专题图
      // case 'CrackingConstantly':
      //   {
      //     const searchFields = ['ObjCode'];
      //     const ctrlResourceType = '103.101.101';
      //     const { constantlyComponents } = that.props;
      //     const spaceTime = 3000;
      //     func({
      //       treeNode,
      //       searchFields,
      //       ctrlResourceType,
      //       dispatch,
      //       mainMap,
      //       scale,
      //       view,
      //       constantlyComponents,
      //       spaceTime,
      //     });
      //   }
      //   return false;
      // // 锅炉专题图
      // case 'BoilerConstantly':
      //   {
      //     const searchFields = ['ObjCode'];
      //     const ctrlResourceType = '103.101.102';
      //     const { constantlyComponents } = that.props;
      //     const spaceTime = 3000;
      //     func({
      //       treeNode,
      //       searchFields,
      //       ctrlResourceType,
      //       dispatch,
      //       mainMap,
      //       scale,
      //       view,
      //       constantlyComponents,
      //       spaceTime,
      //     });
      //   }
      //   return false;
      // // 发电机专题图
      // case 'GeneratorConstantly':
      //   {
      //     const searchFields = ['ObjCode'];
      //     const ctrlResourceType = '103.101.103';
      //     const { constantlyComponents } = that.props;
      //     const spaceTime = 3000;
      //     func({
      //       treeNode,
      //       searchFields,
      //       ctrlResourceType,
      //       dispatch,
      //       mainMap,
      //       scale,
      //       view,
      //       constantlyComponents,
      //       spaceTime,
      //     });
      //   }
      //   return false;
      // // 大机组专题图
      // case 'LargeUnitConstantly':
      //   {
      //     const searchFields = ['ObjCode'];
      //     const ctrlResourceType = '103.101.104';
      //     const { constantlyComponents } = that.props;
      //     const spaceTime = 3000;
      //     func({
      //       treeNode,
      //       searchFields,
      //       ctrlResourceType,
      //       dispatch,
      //       mainMap,
      //       scale,
      //       view,
      //       constantlyComponents,
      //       spaceTime,
      //     });
      //   }
      //   return false;
      default: break;
    }
  });
};

