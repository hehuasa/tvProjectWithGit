// 资源树组装
import {addBorder, addConstantItem} from "../../utils/mapService";
import {constantlyModal} from "../../services/constantlyModal";

export const ajaxDataFilter = (treeId, parentNode, responseData) => {
  if (!treeAjax) {
    treeAjax = true;
  }
  if (responseData === '') {
    responseData = [];
  }
  if (responseData) {
    if (responseData.data.length > 0 && responseData.data[0].sortIndex) {
      responseData.data.sort((a, b) => {
        return a.sortIndex - b.sortIndex;
      });
    }
    for (const node of responseData.data) {
      node.name = node.treeName || node.resourceName || node.orgnizationName || node.areaName;
      //  继承图层信息,treeType属性
      if (parentNode) {
        node.treeType = node.treeType || parentNode.treeType;
        if (node.resResourceTreeMapLayers === undefined || node.resResourceTreeMapLayers === null || node.resResourceTreeMapLayers.length === 0) {
          node.resResourceTreeMapLayers = parentNode.resResourceTreeMapLayers;
        }
      }

      if (parentNode != null) {
        node.loadResource = node.loadResource || parentNode.loadResource;
        node.treeID = node.treeID || parentNode.treeID;
        // node.subLinkType = node.subLinkType || parentNode.subLinkType;
        node.parentOrgCode =
          node.orgCode ||
          node.orgnizationCode ||
          parentNode.orgCode ||
          parentNode.orgnizationCode ||
          parentNode.parentOrgCode;
      }
      node.leftClickFunTemplate = node.leftClickFunTemplate ? node.leftClickFunTemplate : (parentNode ? parentNode.leftClickFunTemplate : '');
      // 判断树节点类型
      node.chkDisabled = (Number(node.haveCheckBox) === 0);
      switch (Number(node.treeType)) {
        case 1: // 专题图层
          node.isParent = false;
          break;
        case 2: // 普通
          node.isParent = true;
          break;
        case 3: // 资源图层
          node.isParent = true;
          break;
        case 4: // 区域图元
          node.isParent = true;
          break;
        case 5: // 资源图元
          node.isParent = false;
          node.chkDisabled = true;
          break;
        case 6: // 看板
          node.isParent = false;
          break;
        case 7: // 图层
          node.isParent = false;
          if (['铁路', '建筑物', '道路', '厂区围墙', '植被', '道路中心线'].indexOf(node.treeName) !== -1) {
            node.checked = true;
          }
          break;
        default: break;
      }
      if (node.resourceID) {
        node.isParent = false;
        if (node.processNumber !== null) {
          node.name = `${node.processNumber}_${node.name}`;
        }
      }
      // 判断分区与组织，若有,修改相应属性
      if (node.areas || node.baseOrganizations) {
        if (node.areas) {
          if (node.areas.length > 0) {
            node.children = node.areas;
            const loop = (data) => {
              data.chkDisabled = true;
              data.isParent = true;
              data.children = [];
              data.name = data.areaName;
              data.subLinkType = node.subLinkType;
              data.treeID = data.treeID || node.treeID; // 继承treeId
              data.ctrlResourceType = node.ctrlResourceType || parentNode.ctrlResourceType; // 继承ctrlResourceType
              data.loadResource = data.loadResource || node.loadResource; // 继承loadResource
              // data.subLinkType = data.subLinkType || node.subLinkType;
              data.leftClickFunTemplate = node.leftClickFunTemplate; // 继承leftClickFunTemplate subLinkType
              if (data.children) {
                if (data.children.length === 0) {
                  delete data.children;
                } else {
                  for (const child of data.children) {
                    loop(child);
                  }
                }
              }
            };
            for (const area of node.children) {
              loop(area);
            }
            node.children = node.areas;
          }
        }
        if (node.baseOrganizations) {
          if (node.baseOrganizations.length > 0) {
            const loop = (data) => {
              data.isParent = true;
              data.treeType = node.treeType;
              data.resResourceTreeMapLayers = node.resResourceTreeMapLayers;
              // data.chkDisabled = true;
              data.subLinkType = node.subLinkType;
              data.name = data.orgnizationName;
              data.treeID = data.treeID || node.treeID; // 继承treeId
              data.ctrlResourceType = node.ctrlResourceType || parentNode.ctrlResourceType; // 继承ctrlResourceType
              data.parentOrgCode = data.orgCode || data.orgnizationCode || node.orgCode || parentNode.orgnizationCode; // 继承parentOrgCode
              data.loadResource = data.loadResource || node.loadResource; // 继承loadResource
              // data.subLinkType = data.subLinkType || node.subLinkType;
              data.leftClickFunTemplate = node.leftClickFunTemplate; // 继承leftClickFunTemplate
              if (data.children) {
                if (data.children.length === 0) {
                  delete data.children;
                } else {
                  for (const child of data.children) {
                    loop(child);
                  }
                }
              }
            };
            for (const org of node.baseOrganizations) {
              loop(org);
            }
            node.children = node.baseOrganizations;
          }
        }
      }
      // 组织信息继承属性
      if (node.orgID) {
        const loop = (data) => {
          if (data.sub) {
            if (data.sub.length > 0) {
              data.children = data.sub;
            }
            if (data.children.length === 0) {
              delete data.children;
            }
            data.isParent = true;
            data.chkDisabled = true;
            data.name = data.orgnizationName;
            data.treeID = data.treeID || node.treeID; // 继承treeId
            data.ctrlResourceType = parentNode.ctrlResourceType; // 继承ctrlResourceType
            data.parentOrgCode = data.orgCode || data.orgnizationCode || node.orgCode || node.orgnizationCode; // 继承parentOrgCode
            data.loadResource = data.loadResource || node.loadResource; // 继承loadResource
            // data.subLinkType = data.subLinkType || node.subLinkType;
            data.leftClickFunTemplate = node.leftClickFunTemplate; // 继承leftClickFunTemplate
            delete data.sub;
            if (data.children) {
              for (const child of data.children) {
                loop(child);
              }
            }
          }
        };
        loop(node);
      }
    }
  }
  return responseData.data;
};
// 实时专题图
export const func = ({ treeNode, mapView, baseLayer, searchFields, ctrlResourceType, dispatch, mainMap, constantlyComponents, spaceTime, scale }) => {
  mapView.goTo({ center: mapView.center, scale: scale - 100 });
  const layers = [];
  const layerNames = [];
  for (const layer of treeNode.resResourceTreeMapLayers) {
    layers.push({ layer: layer.layerInfo.mapLayerName, type: layer.processType, id: layer.mapLayerID });
    layerNames.push(layer.layerInfo.mapLayerName);
  }
  if (treeNode.checked) {
    const deviceArrayIndex = treeNode.checkClickFunTemplate + treeNode.treeID;
    constantlyModal[treeNode.checkClickFunTemplate + treeNode.treeID] = { data: [], mapData: [] };
    addConstantItem({ baseLayer, layers: treeNode.resResourceTreeMapLayers }).then((graphics) => {
      dispatch({
        type: 'constantlyData/getConstantlyData',
        payload: { type: deviceArrayIndex, view: mapView, param: { ctrlResourceType }, searchText: 'gISCode', searchFields, graphics, constantlyComponents, map: mainMap, dispatch, scale },
      });
      loopObj[treeNode.checkClickFunTemplate + treeNode.treeID] = setInterval(() => {
        dispatch({
          type: 'constantlyData/getConstantlyData',
          payload: { type: deviceArrayIndex, view: mapView, param: { ctrlResourceType }, searchText: 'gISCode', searchFields, graphics, constantlyComponents, map: mainMap, dispatch, scale },
        });
      }, spaceTime);
    });
    // for (const layer of layers) {
    //   const subId = layer.layerInfo.mapLayerID;
    //   const subLayer = baseLayer.findSublayerById(subId);
    // }
    // // if (!mainMap.findLayerById(layerNames[0])) {
    // addLayer(mainMap, layerNames, dispatch).then((res) => {
    //   let layerAddResult = {};
    //   const updateEnd = (e, layer) => {
    //     graphics.push(...e);
    //     layerAddResult[layer] = true;
    //   };
    //   for (const layer of layerNames) {
    //     mapView.whenLayerView(res[layer]).then((layerView) => {
    //       layerView.watch('updating', (loding) => {
    //         if (!loding) {
    //           layerView.queryFeatures().then((results) => {
    //             updateEnd(results, layer);
    //           });
    //         }
    //       });
    //     });
    //   }
    //   const a = setInterval(() => {
    //     let allAdds;
    //     for (const layer of layerNames) {
    //       if (layerAddResult[layer] === undefined) {
    //         layerAddResult = {};
    //         break;
    //       } else {
    //         allAdds = layerAddResult[layer];
    //       }
    //     }
    //     if (allAdds) {
    //       clearInterval(a);
    //       dispatch({
    //         type: 'constantlyData/getConstantlyData',
    //         payload: { type: deviceArrayIndex, view: mapView, param: { ctrlResourceType }, searchText: 'gISCode', searchFields, graphics, constantlyComponents, map: mainMap, dispatch, scale },
    //       });
    //       loopObj[treeNode.checkClickFunTemplate + treeNode.treeID] = setInterval(() => {
    //         dispatch({
    //           type: 'constantlyData/getConstantlyData',
    //           payload: { type: deviceArrayIndex, view: mapView, param: { ctrlResourceType }, searchText: 'gISCode', searchFields, graphics, constantlyComponents, map: mainMap, dispatch, scale },
    //         });
    //       }, spaceTime);
    //     }
    //   }, 100);
    // });
    // }
    // else {
    //   for (const layer of layerNames) {
    //     graphics.push(...mainMap.findLayerById(layer).graphics);
    //   }
    //   dispatch({
    //     type: 'constantlyData/getConstantlyData',
    //     payload: { type: deviceArrayIndex, param: { ctrlResourceType }, searchText: 'gISCode', searchFields, graphics, constantlyComponents, map: mainMap, dispatch, scale },
    //   });
    //   loopObj[treeNode.checkClickFunTemplate + treeNode.treeID] = setInterval(() => {
    //     dispatch({
    //       type: 'constantlyData/getConstantlyData',
    //       payload: { type: deviceArrayIndex, param: { ctrlResourceType }, searchText: 'gISCode', searchFields, graphics, constantlyComponents, map: mainMap, dispatch, scale },
    //     });
    //   }, spaceTime);
    // }
  } else {
    clearInterval(loopObj[treeNode.checkClickFunTemplate + treeNode.treeID]);
    loopObj[treeNode.checkClickFunTemplate + treeNode.treeID] = null;
    delLayer(mainMap, [...layerNames, `${treeNode.checkClickFunTemplate + treeNode.treeID}专题图`], dispatch);
    // 清除实时专题组件及数据
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
};
// 实时专题图（需显示所属区域）
export const func1 = ({ treeNode, mapView, searchFields, ctrlResourceType, dispatch, mainMap, constantlyComponents, spaceTime, scale }) => {
  mapView.goTo({ center: mapView.center, scale: scale - 100 });
  const layers = [];
  const layerNames = [];
  for (const layer of treeNode.resResourceTreeMapLayers) {
    layers.push({ layer: layer.layerInfo.mapLayerName, type: layer.processType });
    layerNames.push(layer.layerInfo.mapLayerName);
  }
  if (treeNode.checked) {
    const deviceArrayIndex = treeNode.checkClickFunTemplate + treeNode.ctrlResourceType;
    constantlyModal[treeNode.checkClickFunTemplate + treeNode.treeID] = { data: [], mapData: [] };
    const graphics = [];
    if (!mainMap.findLayerById(layerNames[0])) {
      addLayer(mainMap, layerNames, dispatch).then((res) => {
        let layerAddResult = {};
        const updateEnd = (results, layer) => {
          graphics.push(...results);
          layerAddResult[layer] = true;
        };
        for (const layer of layers) {
          mapView.whenLayerView(res[layer.layer]).then((layerView) => {
            layerView.watch('updating', (loding) => {
              if (!loding) {
                layerView.queryFeatures().then((results) => {
                  updateEnd(results, layer.layer);
                });
                if (Number(layer.type) === 2) {
                  mapView.goTo({
                    extent: res[layer.layer].fullExtent,
                  });
                }
              }
            });
          });
        }
        const a = setInterval(() => {
          let allAdds;
          for (const layer of layerNames) {
            if (layerAddResult[layer] === undefined) {
              layerAddResult = {};
              break;
            } else {
              allAdds = layerAddResult[layer];
            }
          }
          if (allAdds) {
            clearInterval(a);
            // 搜索设备所属区域，添加边框
            const array = []; let index = 1;
            const newGraphics = graphics.filter(value => value.attributes['区域编码']);
            for (const graphic of newGraphics) {
              searchByAttr({ searchText: graphic.attributes['区域编码'], layerIds: [70], searchFields: ['区域编码'] }).then((areas) => {
                array.push(...areas);
                index += 1;
                if (index === newGraphics.length) {
                  for (const area of array) {
                    addBorder(mainMap, area.feature.geometry, deviceArrayIndex);
                  }
                }
              });
            }
            dispatch({
              type: 'constantlyData/getConstantlyData',
              payload: { type: deviceArrayIndex, view: mapView, param: { ctrlResourceType }, searchText: 'gISCode', searchFields, graphics, constantlyComponents, map: mainMap, dispatch, scale },
            });
            loopObj[treeNode.checkClickFunTemplate + treeNode.treeID] = setInterval(() => {
              dispatch({
                type: 'constantlyData/getConstantlyData',
                payload: { type: deviceArrayIndex, view: mapView, param: { ctrlResourceType }, searchText: 'gISCode', searchFields, graphics, constantlyComponents, map: mainMap, dispatch, scale },
              });
            }, spaceTime);
          }
        }, 100);
      });
    } else {
      for (const layer of layerNames) {
        graphics.push(...mainMap.findLayerById(layer).graphics);
      }
      mainMap.setExtent(res[layerNames[0]].fullExtent);
      dispatch({
        type: 'constantlyData/getConstantlyData',
        payload: { type: deviceArrayIndex, param: { ctrlResourceType }, searchText: 'gISCode', searchFields, graphics, constantlyComponents, map: mainMap, dispatch, scale },
      });
      loopObj[treeNode.checkClickFunTemplate + treeNode.treeID] = setInterval(() => {
        dispatch({
          type: 'constantlyData/getConstantlyData',
          payload: { type: deviceArrayIndex, param: { ctrlResourceType }, searchText: 'gISCode', searchFields, graphics, constantlyComponents, map: mainMap, dispatch, scale },
        });
      }, spaceTime);
    }
  } else {
    clearInterval(loopObj[treeNode.checkClickFunTemplate + treeNode.treeID]);
    loopObj[treeNode.checkClickFunTemplate + treeNode.treeID] = null;
    delLayer(mainMap, [...layerNames, `${treeNode.checkClickFunTemplate + treeNode.treeID}专题图`, `${treeNode.checkClickFunTemplate + treeNode.treeID}边框图`], dispatch);
    // 清除实时专题组件及数据
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
};
