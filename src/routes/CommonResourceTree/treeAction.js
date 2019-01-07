import {
  addItem, addPolygonItem, delPolygonItem, addLayer, delItem, delLayer, searchByAttr, transToPoint, clustering, addConstructIcon,
  solidWarehouseDetail, paSystemDetail, addMapAlarms, getBordStyle, resourceClustering,
} from '../../utils/mapService';
import { constantlyModal, infoConstantly, infoPopsModal } from '../../services/constantlyModal';
import { mapConstants, mapLayers } from '../../services/mapConstant';
import { func, func1 } from './fuction';

const loopObj = {};
export const handleClick = (event, treeId, treeNode, d, that) => {
  const openBoard = (boardType, param, name, nameKeys) => {
    const { expandKeys, activeKeys } = that.props.panelBoard;
    const newArr = [];
    for (const arr of activeKeys) {
      newArr.push(arr.keys);
    }
    if (newArr.indexOf(`${boardType}`) === -1) {
      expandKeys.push(`${nameKeys || boardType}`);
      that.props.dispatch({
        type: 'panelBoard/queryList',
        payload: {
          expandKeys,
          activeKeys: [
            { name, uniqueKey: 0, keys: `${nameKeys || boardType}`, param },
            ...activeKeys,
          ],
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
      that.props.dispatch({
        type: 'global/changeRightCollapsed',
        payload: false,
      }).then(() => {
        const { view, extent } = mapConstants;
        if (view.height) {
          view.goTo({ extent }).then(() => {
            getBordStyle(view).then((style) => {
              dispatch({
                type: 'accessControl/queryStyle',
                payload: style,
              });
            });
          });
        }
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
export const handleSelected = (treeId, treeNode, d, that) => {
  const { dispatch, popupScale, ztreeObj } = that.props;
  const { gISCode, resourceCode } = treeNode;
  const { view } = mapConstants;
  const obj = document.getElementById(`${treeNode.tId}`);
  let parent;
  // 生产监测 特殊处理
  if (treeNode.checkClickFunTemplate === 'StatusGraphics' || treeNode.checkClickFunTemplate === 'DeviceMonitor') {
    const inputs = document.getElementsByName('StatusGraphics&DeviceMonitor');
    for (const input of inputs) {
      if (input.checked) {
        const node = ztreeObj.getNodeByTId(input.title);
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
          const node = ztreeObj.getNodeByTId(input.title);
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
      payload: { pageNum: 1, pageSize: 1, isQuery: true, fuzzy: false, gISCode, isRes: true },
    }).then(() => {
      // 同步存树节点信息
      that.props.dispatch({
        type: 'commonResourceTree/saveTreeNode',
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
          view.goTo({ center: newGeometry, scale: popupScale - 100 }).then(() => {
            const screenPoint = view.toScreen(newGeometry);
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
          });
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
  console.log('commonTree', treeNode);
  const { dispatch, ztreeObj, scale, popupScale, resourceGroupByArea, videoFooterHeight, video } = that.props;
  const { mainMap, view, baseLayer } = mapConstants;
  const deviceArrayIndex = treeNode.checkClickFunTemplate + treeNode.treeID;
  const { treeID } = treeNode;
  // 隐藏视频
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
  // 存储被checked的node，以及关联expand的node
  if (treeNode.checked) {
    // const para = treeNode.resourceID || treeNode.name;
    // checkedNodesObj.checked.push(para);
    // getCheckedParten(treeNode, ztreeObj);
    // dispatch({
    //   type: 'resourceTree/saveCheckedNode',
    //   payload: checkedNodesObj,
    // });
    // 逐级展开
    const loop = (node) => {
      if (node.children !== undefined || node.isParent) {
        // 展开node
        ztreeObj.expandNode(node, true, false, false, true);
        if (treeNode.checkClickFunTemplate !== 'ResourceClusterPopup') {
          const getChildren = setInterval(() => {
            if (node.children) {
              if (node.children.length > 0) {
                clearInterval(getChildren);
                for (const child of node.children) {
                  if (!child.checked) {
                    ztreeObj.checkNode(child, true, false, true);
                  }
                }
              }
            }
          }, 50);
        }
      }
    };
    if (!that.state.isRecovery) {
      loop(treeNode);
    }
  } else {
    // 关闭资源信息窗
    dispatch({
      type: 'resourceTree/saveCtrlResourceType',
      payload: '',
    });
    // 关闭pop
    const { infoPops } = that.props;
    const index1 = infoPops.findIndex(value => value.key === 'deviceInfo');
    if (index1 !== -1) {
      infoPops.splice(index1, 1);
      delete infoPopsModal.deviceInfo;
      dispatch({
        type: 'mapRelation/queryInfoPops',
        payload: infoPops,
      });
    }
    const loop = (node) => {
      if (node.children !== undefined || node.isParent) {
        // 展开node
        const parentNode = ztreeObj.getNodeByTId(node.parentTId);
        // if (node.parentNode.checked) {
        //   ztreeObj.checkNode(child, false, false, true);
        // }
        ztreeObj.expandNode(node, false, false, false, true);
        if (treeNode.checkClickFunTemplate !== 'ResourceClusterPopup') {
          const getChildren = setInterval(() => {
            if (node.children) {
              if (node.children.length > 0) {
                clearInterval(getChildren);
                for (const child of node.children) {
                  if (child.checked) {
                    ztreeObj.checkNode(child, false, false, true);
                  }
                }
              }
            }
          }, 50);
        }
      }
    };
    if (!that.state.isRecovery) {
      loop(treeNode);
    }
  }

  const layers = [];
  for (const layer of treeNode.resResourceTreeMapLayers) {
    layers.push(layer.layerInfo.mapLayerName);
  }
  // 判断节点的功能码
  const subLayers = [];
  // 获取资源树对应的图层
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
    case 'ConstantlyMap': // 实时数据图
      {
        const searchFields = ['ObjCode'];
        const { ctrlResourceType } = treeNode;
        if (treeNode.ctrlResourceType === '') {
          return false;
        }
        const { constantlyComponents } = that.props;
        let spaceTime;
        treeNode.checkFunctionCode < 3000 ? spaceTime = 3000 : spaceTime = Number(treeNode.checkFunctionCode);
        func({
          treeNode,
          searchFields,
          baseLayer,
          ctrlResourceType,
          dispatch,
          mainMap,
          scale: popupScale,
          view,
          constantlyComponents,
          spaceTime,
          loopObj,
        });
      }
      return false;
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
      // 资源聚合
    case 'ResourceClusterPopup': // 聚合
      if (treeNode.checked) {
        const { overviewShow, clusterRes } = that.props;
        if (!clusterRes.find(value => value.ctrlType === treeNode.checkFunctionCode)) {
          clusterRes.push({ ctrlType: treeNode.checkFunctionCode, name: treeNode.name });
          that.props.dispatch({
            type: 'resourceTree/getClusterRes',
            payload: clusterRes,
          }).then(() => {
            // 聚合图标
            const subLayer = baseLayer.findSublayerById(mapLayers.FeatureLayers.find(value => value.isArea).id);
            subLayer.visiable = true;
            const query = subLayer.createQuery();
            query.outFields = ['*'];
            subLayer.queryFeatures(query).then((res) => {
              resourceClustering({
                view,
                dispatch,
                graphics: res.features,
                overviewShow,
                clusterRes,
                popupScale,
                resourceGroupByArea,
              });
            });
          }
          );
        }
      } else {
        const { overviewShow, clusterRes } = that.props;
        clusterRes.splice(clusterRes.findIndex(value => value.ctrlType === treeNode.checkFunctionCode), 1);
        that.props.dispatch({
          type: 'resourceTree/getClusterRes',
          payload: clusterRes,
        }).then(() => {
          const subLayer = baseLayer.findSublayerById(mapLayers.FeatureLayers.find(value => value.isArea).id);
          const query = subLayer.createQuery();
          query.outFields = ['*'];
          subLayer.queryFeatures(query).then((res) => {
            resourceClustering({ view, dispatch, alarms: that.props.groupByOverview.list, graphics: res.features, overviewShow, clusterRes, popupScale, resourceGroupByArea });
          });
        }
        );
      }
      return false;
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
                    payload: { map: mainMap, view, layer: subLayers[0], graphics },
                  });
                  loopObj[deviceArrayIndex] = setInterval(() => {
                    dispatch({
                      type: 'accessControl/getAllDoorCount',
                      payload: { map: mainMap, view, layer: subLayers[0], graphics },
                    });
                  }, spaceTime);
                }
              }, 100);
            });
          });
        } else {
          delLayer(mainMap, ['门禁专题图'], dispatch);
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
          addConstructIcon({ map: mainMap, layer: subLayers[0], scale: popupScale, list });
        });
      } else {
        addConstructIcon({ map: mainMap, dispatch });
      }
      break;
      // 设备监测
    case 'DeviceMonitor':
      if (treeNode.checked) {
        dispatch({
          type: 'flow/fetchDeviceOption',
          payload: { resourceID: treeNode.checkFunctionCode },
        }).then(() => {
          dispatch({
            type: 'homepage/queryModalType',
            payload: 'deviceMonitor',
          });
          dispatch({
            type: 'homepage/queryDeviceMonitor',
            payload: { show: true, devicesName: treeNode.name, ctrlResourceType: treeNode.ctrlResourceType },
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
        clearInterval(loopObj[deviceArrayIndex]);
        delLayer(mainMap, ['环保专题图'], dispatch);
      }
      break;
    // VOCs治理专题图
    case 'VocConstantly':
      if (treeNode.checked) {
        let layerId;
        for (const layer of mapLayers.FeatureLayers) {
          if (layer.mapLayerName === layers[0]) {
            const index = layer.layerAddress.indexOf('MapServer/');
            layerId = layer.layerAddress.substr(index + 10);
            break;
          }
        }
        constantlyModal[deviceArrayIndex] = { data: [], mapData: [] };
        dispatch({
          type: 'vocs/mapQuery',
        }).then(() => {
          const { constantlyComponents } = that.props;
          if (constantlyComponents.findIndex(value => value.type === deviceArrayIndex) === -1) {
            constantlyComponents.push({ type: deviceArrayIndex });
          }
          const devices = [];
          const domType = 'VocConstantly';
          for (const [key, value] of Object.entries(that.props.vocsMap)) {
            searchByAttr({ searchText: key, layerIds: [layerId], searchFields: ['区域编码'] }).then((res) => {
              devices.push({ device: res[0], attributes: { areaCode: key, value } });
              constantlyInfo(mainMap, view, dispatch, devices, deviceArrayIndex, constantlyComponents, domType, popupScale);
            });
          }
        });
      } else {
        delLayer(mainMap, [`${treeNode.checkClickFunTemplate + treeNode.treeID}专题图`], dispatch);
        // 清除实时专题组件及数据
        const { constantlyComponents } = that.props;
        const index = constantlyComponents.findIndex(value => value.type === treeNode.checkClickFunTemplate + treeNode.treeID);
        if (index !== -1) {
          constantlyComponents.splice(index, 1);
        }
        dispatch({
          type: 'constantlyData/queryConstantlyComponents',
          payload: constantlyComponents,
        });
        delete constantlyModal[treeNode.checkClickFunTemplate + treeNode.treeID];
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
          dispatch({ type: 'paSystem/fetchDeviceStatus' }).then(() => {
            const array = [];
            const { devices, deviceStatus } = that.props.paSystem;
            for (const device of devices) {
              const status = deviceStatus.find(value => value.resourceID === device.resourceID);
              const index = array.findIndex(value => value.areaGISCode === device.area.gISCode);
              if (index === -1) {
                array.push({ areaGISCode: device.area.gISCode, area: device.area, devices: [{ device, state: status ? status.state : 'none' }] });
              } else {
                array[index].devices.push({ device, state: status ? status.state : 'none' });
              }
            }
            dispatch({
              type: 'paSystem/queryPASystemInfo',
              payload: array,
            });
            paSystemDetail({ map: mainMap, view, layer: subLayer, dispatch, paData: array });
          });
        });
        loopObj.PAsystem = setInterval(() => {
          // 请求资源
          dispatch({
            type: 'paSystem/fetchAllDevice',
            payload: { ctrlType: treeNode.ctrlResourceType },
          }).then(() => {
            // 请求状态
            dispatch({ type: 'paSystem/fetchDeviceStatus' }).then(() => {
              const array = [];
              const { devices, deviceStatus } = that.props.paSystem;
              for (const device of devices) {
                const status = deviceStatus.find(value => value.resourceID === device.resourceID);
                const index = array.findIndex(value => value.areaGISCode === device.area.gISCode);
                if (index === -1) {
                  array.push({ areaGISCode: device.area.gISCode, area: device.area, devices: [{ device, state: status ? status.state : 'none' }] });
                } else {
                  array[index].devices.push({ device, state: status ? status.state : 'none' });
                }
              }
              dispatch({
                type: 'paSystem/queryPASystemInfo',
                payload: array,
              });
              paSystemDetail({ map: mainMap, view, layer: subLayer, dispatch, paData: array });
            });
          });
        }, 3000);
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
    case 'WaterConstantly': // 水专题图
      {
        const searchFields = ['ObjCode'];
        const ctrlResourceType = '103.101.201';
        const { constantlyComponents } = that.props;
        const spaceTime = 3000;
        func1({
          treeNode,
          view,
          searchFields,
          ctrlResourceType,
          dispatch,
          mainMap,
          scale: popupScale,
          constantlyComponents,
          spaceTime,
        });
      }
      return false;
    case 'ElectricConstantly': // 电专题图
      {
        const searchFields = ['ObjCode'];
        const ctrlResourceType = '103.101.203.101';
        const { constantlyComponents } = that.props;
        const spaceTime = 3000;
        func({
          treeNode,
          view,
          searchFields,
          ctrlResourceType,
          dispatch,
          mainMap,
          scale: popupScale,
          constantlyComponents,
          spaceTime,
        });
      }
      return false;
    case 'HigherSteamConstantly': // 超高压蒸汽专题图
      {
        const searchFields = ['ObjCode'];
        const ctrlResourceType = '103.101.203.102';
        const { constantlyComponents } = that.props;
        const spaceTime = 3000;
        func({
          treeNode,
          view,
          searchFields,
          ctrlResourceType,
          dispatch,
          scale: popupScale,
          mainMap,
          constantlyComponents,
          spaceTime,
        });
      }
      return false;
    case 'HighSteamConstantly': // 高压蒸汽专题图
      {
        const searchFields = ['ObjCode'];
        const ctrlResourceType = '103.101.203.102';
        const { constantlyComponents } = that.props;
        const spaceTime = 3000;
        func({
          treeNode,
          view,
          searchFields,
          ctrlResourceType,
          dispatch,
          scale: popupScale,
          mainMap,
          constantlyComponents,
          spaceTime,
        });
      }
      return false;
    case 'MiddleSteamConstantly': // 中压蒸汽专题图
      {
        const searchFields = ['ObjCode'];
        const ctrlResourceType = '103.101.203.103';
        const { constantlyComponents } = that.props;
        const spaceTime = 3000;
        func({
          treeNode,
          view,
          searchFields,
          ctrlResourceType,
          dispatch,
          scale: popupScale,
          mainMap,
          constantlyComponents,
          spaceTime,
        });
      }
      return false;
    case 'LowSteamConstantly': // 低压蒸汽专题图
      {
        const searchFields = ['ObjCode'];
        const ctrlResourceType = '103.101.203.104';
        const { constantlyComponents } = that.props;
        const spaceTime = 3000;
        func({
          treeNode,
          view,
          searchFields,
          ctrlResourceType,
          dispatch,
          scale: popupScale,
          mainMap,
          constantlyComponents,
          spaceTime,
        });
      }
      return false;
    case 'WindConstantly': // 风专题图
      if (treeNode.checked) {
        // 打开水专题图
        let electricLayer;
        const testData = [ // 用电量，电流
          { gISCode: 10381, temp: 60, pressure: 76, level: 44, flow: 35 },
          { gISCode: 10382, temp: 22, pressure: 15, level: 16, flow: 90 },
          { gISCode: 10383, temp: 45, pressure: 15, level: 27, flow: 79 },
          { gISCode: 10384, temp: 123, pressure: 14, level: 68, flow: 89 },
        ];
        if (!mainMap.findLayerById('洗眼器')) {
          addLayer(mainMap, ['洗眼器'], dispatch).then((res) => {
            electricLayer = res['洗眼器'];
          });
        } else {
          electricLayer = mainMap.findLayerById('洗眼器');
        }
        // 获取门禁的地理信息
        const getLayer = mainMap.on('layer-add-result', () => {
          getLayer.remove();
          // 请求门禁实时数据,将门禁地理信息合并
          dispatch({
            type: 'homepage/getConstantlyData',
            payload: { type: 'gasConstantlyData', param: { ctrlResourceType: '102.102.101' } },
          }).then(() => {
            thematicMaping({ type: 'Wind', deviceArray: testData, searchText: 'gISCode', searchFields: ['ObjCode'], layerIds: [electricLayer.layerId], scale });
          });
          loopObj.WindConstantly = setInterval(() => {
            dispatch({
              type: 'homepage/getConstantlyData',
              payload: { type: 'gasConstantlyData', param: { ctrlResourceType: '102.102.101' } },
            }).then(() => {
              thematicMaping({ type: 'Wind', deviceArray: testData, searchText: 'gISCode', searchFields: ['ObjCode'], layerIds: [electricLayer.layerId], scale });
            });
          }, 60000);
        });
      } else {
        delLayer(mainMap, ['洗眼器', '风实时数据专题图'], dispatch);
        clearInterval(loopObj.WindConstantly);
        dispatch({
          type: 'map/windConstantlyInfo',
          payload: { show: false, data: [] },
        });
      }
      return false;
    // 裂解炉专题图
    case 'CrackingConstantly':
      {
        const searchFields = ['ObjCode'];
        const ctrlResourceType = '103.101.101';
        const { constantlyComponents } = that.props;
        const spaceTime = 3000;
        func({
          treeNode,
          searchFields,
          ctrlResourceType,
          dispatch,
          mainMap,
          scale,
          view,
          constantlyComponents,
          spaceTime,
        });
      }
      return false;
    // 锅炉专题图
    case 'BoilerConstantly':
      {
        const searchFields = ['ObjCode'];
        const ctrlResourceType = '103.101.102';
        const { constantlyComponents } = that.props;
        const spaceTime = 3000;
        func({
          treeNode,
          searchFields,
          ctrlResourceType,
          dispatch,
          mainMap,
          scale,
          view,
          constantlyComponents,
          spaceTime,
        });
      }
      return false;
    // 发电机专题图
    case 'GeneratorConstantly':
      {
        const searchFields = ['ObjCode'];
        const ctrlResourceType = '103.101.103';
        const { constantlyComponents } = that.props;
        const spaceTime = 3000;
        func({
          treeNode,
          searchFields,
          ctrlResourceType,
          dispatch,
          mainMap,
          scale,
          view,
          constantlyComponents,
          spaceTime,
        });
      }
      return false;
    // 大机组专题图
    case 'LargeUnitConstantly':
      {
        const searchFields = ['ObjCode'];
        const ctrlResourceType = '103.101.104';
        const { constantlyComponents } = that.props;
        const spaceTime = 3000;
        func({
          treeNode,
          searchFields,
          ctrlResourceType,
          dispatch,
          mainMap,
          scale,
          view,
          constantlyComponents,
          spaceTime,
        });
      }
      return false;
    default: break;
  }
  // 处理图层/ 资源等
  switch (Number(treeNode.treeType)) {
    case 3:
      // 获取需要添加的图层
      if (treeNode.checked) {
        if (treeNode.gISCode) {
          addItem({ map: mainMap, baseLayer, layers: subLayers, device: treeNode, id: treeNode.ctrlResourceType, scale: popupScale });
        }
      } else {
        delItem({ map: mainMap, device: treeNode, id: treeNode.ctrlResourceType, dispatch });
      }
      break;
    case 4:
      if (treeNode.checked) {
        if (treeNode.gISCode) {
          addPolygonItem({ map: mainMap, baseLayer, layers: subLayers, device: treeNode, id: treeNode.ctrlResourceType, scale: popupScale });
        }
      } else {
        delPolygonItem({ map: mainMap, device: treeNode, id: treeNode.ctrlResourceType, dispatch });
      }
      break;
    case 7:
      // 获取需要添加的图层

      // if (treeNode.checked) {
      // for (const layer of subLayers) {
      //   layer.visible = true;
      // }
      // } else {
      //   for (const layer of subLayers) {
      //     layer.visible = false;
      //   }
      // }
      if (treeNode.checked) {
        addLayer(mainMap, layers, dispatch);
      } else {
        delLayer(mainMap, layers, dispatch);
      }
      break;
    default: break;
  }
};
export const handleBeforeAsync = (treeId, parentNode) => {
  if (parentNode) {
    switch (Number(parentNode.subLinkType)) {
      case 1:
        ajaxParam = {
          param: ['parentOrgCode=orgCode', 'ctrlResourceType=ctrlType'],
          asyncUrl: 'emgc/resource/resourceInfo/selectByCtrlType',
        };
        break;
      case 2:
        ajaxParam = {
          param: ['areaCode=areaCode', 'ctrlResourceType=ctrlType'],
          asyncUrl: 'emgc/resource/resourceInfo/selectByCtrlTypeAndArea',
        };
        break;
      case 3:
        ajaxParam = {
          param: ['treeID=treeID'],
          asyncUrl: 'emgc/resource/resourceInfo/selectByGroup',
        };
        break;
      default:
        if (parentNode.loadResource) {
          let params; let asyncUrl;
          // if (parentNode.parentOrgCode) {
          //   params = ['parentOrgCode=orgCode', 'ctrlResourceType=ctrlType'];
          //   asyncUrl = 'emgc/resource/resourceInfo/selectByCtrlType';
          // }
          // if (parentNode.areaCode) {
          //   params = ['areaCode=areaCode', 'ctrlResourceType=ctrlType'];
          //   asyncUrl = 'emgc/resource/resourceInfo/selectByCtrlTypeAndArea';
          // }
          ajaxParam = {
            param: ['ctrlResourceType=ctrlType'],
            asyncUrl: 'emgc/resource/resourceInfo/selectByCtrlType',
          };
          // else {
          //   that.setState({
          //     treeName: 'resourceName',
          //     param: ['ctrlResourceType=ctrlType'],
          //     asyncUrl: 'emgc/resource/resourceInfo/selectByCtrlType',
          //   });
          // }
        } else {
          ajaxParam = {
            param: ['treeID=parentTreeID'],
            asyncUrl: 'emgc/resource/resourceTree/getByParentTree',
          };
        }
    }
    // if (Number(parentNode.subLinkType) === 1) {
    //   // 有orgCode 字段， 请求 组织机构
    //   ajaxParam = {
    //     param: ['orgCode=parentCode', 'ctrlResourceType=ctrlType'],
    //     asyncUrl: 'emgc/system/organization/getOrgByParentCode',
    //   };
    // }
    // if (Number(parentNode.subLinkType) === 2) {
    //   // 有orgCode 字段， 请求 组织机构
    //   ajaxParam = {
    //     param: ['areaCode=areaCode', 'ctrlResourceType=ctrlType'],
    //     asyncUrl: 'emgc/resource/resourceInfo/selectByCtrlTypeAndArea',
    //   };
    // } else { // 无orgCode 字段， 判断是否请求资源
    //   if (parentNode.loadResource) {
    //     let params; let asyncUrl;
    //     // if (parentNode.parentOrgCode) {
    //     //   params = ['parentOrgCode=orgCode', 'ctrlResourceType=ctrlType'];
    //     //   asyncUrl = 'emgc/resource/resourceInfo/selectByCtrlType';
    //     // }
    //     // if (parentNode.areaCode) {
    //     //   params = ['areaCode=areaCode', 'ctrlResourceType=ctrlType'];
    //     //   asyncUrl = 'emgc/resource/resourceInfo/selectByCtrlTypeAndArea';
    //     // }
    //     ajaxParam = {
    //       param: ['ctrlResourceType=ctrlType'],
    //       asyncUrl: 'emgc/resource/resourceInfo/selectByCtrlType',
    //     };
    //     // else {
    //     //   that.setState({
    //     //     treeName: 'resourceName',
    //     //     param: ['ctrlResourceType=ctrlType'],
    //     //     asyncUrl: 'emgc/resource/resourceInfo/selectByCtrlType',
    //     //   });
    //     // }
    //   } else {
    //     ajaxParam = {
    //       param: ['treeID=parentTreeID'],
    //       asyncUrl: 'emgc/resource/resourceTree/getByParentTree',
    //     };
    //   }
    // }
  }
};

