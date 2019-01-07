import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import ReactZtree from './Ztree-react';
import { searchByAttr, addLayer, delLayer, locateDevice, alarmCounting } from '../../utils/mapService';
import TreeContextMenu from './ContextMenu/TreeContextMenu';
import { mapConstants } from '../../services/mapConstant';
import styles from './index.less';

const ajaxDataFilter = (treeId, parentNode, responseData) => {
  if (responseData) {
    if (responseData.data.length > 0 && responseData.data[0].sortIndex) {
      responseData.data.sort((a, b) => {
        return a.sortIndex - b.sortIndex;
      });
    }
    for (const node of responseData.data) {
      node.name = node.treeName || node.resourceName || node.orgnizationName;
      if (parentNode != null) {
        node.loadResource = node.loadResource || parentNode.loadResource;
        node.treeID = node.treeID || parentNode.treeID;
        node.parentOrgCode = node.orgCode || node.orgnizationCode || parentNode.orgCode || parentNode.orgnizationCode || parentNode.parentOrgCode;
      }
      node.leftClickFunTemplate = node.leftClickFunTemplate ? node.leftClickFunTemplate : (parentNode ? parentNode.leftClickFunTemplate : '');
      // 判断数据类型 分别处理（资源或组织机构）
      if (node.resourceID) {
        node.chkDisabled = true;
        node.isParent = false;
      } else {
        node.isParent = true;
      }
      if (node.orgID) {
        const loop = (data) => {
          if (data.sub) {
            if (data.sub.length > 0) {
              data.children = data.sub;
            }
            data.isParent = true;
            data.name = data.orgnizationName;
            data.treeID = data.treeID || parentNode.treeID;
            data.ctrlResourceType = parentNode.ctrlResourceType;
            data.parentOrgCode = data.orgCode || data.orgnizationCode || parentNode.orgCode || parentNode.orgnizationCode;
            data.leftClickFunTemplate = parentNode.leftClickFunTemplate;
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
@connect(({ resourceTree, map, sidebar, loading, alarm, user }) => {
  return {
    treeData: resourceTree.oftenTreeData,
    // appendData: resourceTree.appendData,
    contextMenu: resourceTree.contextMenu,
    isOften: resourceTree.isOften,
    selectedNodes: resourceTree.selectedNodes,
    resourceInfo: resourceTree.resourceInfo,
    scale: map.scale,
    baseLayer: map.baseLayer,
    visiblePanel: sidebar.visiblePanel,
    ztreeObj: resourceTree.ztreeOftenObj,
    groupByArea: alarm.groupByArea,
    list: alarm.list,
    loading,
    currentUser: user.currentUser,
  };
})
export default class Tree extends PureComponent {
  constructor(prop) {
    super(prop);
    // 获取当前登录用户ID
    const { accountID } = this.props.currentUser;
    this.state = {
      param: ['treeID=parentTreeID'],
      otherParam: ['accountID', accountID],
      keyChildren: 'children',
      // asyncUrl: 'http://192.168.0.14:4000/resource/resourceTree/getByParentTree',
      asyncUrl: 'emgc/resource/baseOftenResource/selectAccountID',
    };
    this.getAutoParam = this.getAutoParam.bind(this);
  }
  componentDidMount() {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'resourceTree/fetch',
    //   payload: { ztree: true },
    // });
    dispatch({
      type: 'user/fetchCurrent',
      payload: {},
    });
  }
  onAsyncSuccess = () => {
    const { dispatch, ztreeObj } = this.props;
    const data = ztreeObj.getNodes();
    dispatch({
      type: 'resourceTree/queryOftenList',
      payload: data,
    });
  };
  onRightClick = (e, treeId, treeNode) => {
    const { resourceID, treeID } = treeNode;
    const position = { top: e.clientY, left: e.clientX };
    // 树或则资源 才能取消
    if (resourceID || treeID) {
      this.props.dispatch({
        type: 'resourceTree/getContext',
        payload: { position, show: true, resourceID, treeID },
      });
    }
  };
  setting = () => {
    return {
      callback: {
        onClick: (event, treeId, treeNode) => { this.handleClick(event, treeId, treeNode); },
        onCheck: (event, treeId, treeNode) => { this.handleCheck(event, treeId, treeNode); },
        beforeAsync: (treeId, treeNode) => { this.handleBeforeAsync(treeId, treeNode); },
        onAsyncSuccess: () => { this.onAsyncSuccess(); },
        onRightClick: this.onRightClick,
      },
      data: {
      },
      key: {
        children: this.state.keyChildren,
      },
      view: {
        showIcon: false,
      },
      check: {
        enable: true,
      },
      async: {
        enable: true,
        type: 'get',
        url: this.getAsyncUrl,
        autoParam: this.getAutoParam,
        otherParam: this.state.otherParam,
        dataFilter: ajaxDataFilter,
      },
    };
  };
  getAutoParam = (treeId, treeNode) => {
    return this.state.param;
  };
  getAsyncUrl= () => {
    return this.state.asyncUrl;
  };
  handleClick = (event, treeId, treeNode) => {
    const { layerIds, dispatch } = this.props;
    const { mainMap, view } = mapConstants;
    const { gISCode, resourceCode, resourceID } = treeNode;
    if (resourceCode) {
      this.props.dispatch({
        type: 'resourceTree/selectByGISCode',
        payload: { pageNum: 1, pageSize: 1, isQuery: true, fuzzy: false, gISCode },
      }).then(() => {
        // if (this.props.resourceInfo.extendFields) {
        //   // const { extendFields } = resourceInfo;
        //   // 根据资源ID查询原料信息
        //   dispatch({
        //     type: 'resourceTree/getByResourceID',
        //     payload: resourceID,
        //   });
        // }
        // 报警资源 模板
        const alarmBoard = treeNode.leftClickFunTemplate === '1';
        // 设备资源 模板
        const resourceInfo = treeNode.leftClickFunTemplate === '2';
        // 环保资源 模板
        const environmental = treeNode.leftClickFunTemplate === '3';
        // 装置生产 模板 表格
        const production = treeNode.leftClickFunTemplate === '4';
        // 控制面板的打开与关闭
        this.props.dispatch({
          type: 'map/mapBoardShow',
          payload: { searchResult: false, resourceInfo, alarmBoard, environmental, production },
        });
        // 同步存树节点信息
        this.props.dispatch({
          type: 'resourceTree/saveTreeNode',
          payload: { ...treeNode },
        });
        searchByAttr({ searchText: gISCode, layerIds, searchFields: ['ObjCode'] }).then(
          (res) => {
            if (res.length > 0) {
              view.goTo({ center: res[0].feature.geometry, scale: 7000 }).then(() => {
                const screenPoint = mainMap.toScreen(res[0].feature.geometry);
                dispatch({
                  type: 'map/showInfoWindow',
                  payload: { show: true, type: 'simpleInfo', screenPoint, mapStyle: { width: mainMap.width, height: mainMap.height }, attributes: res[0].feature.attributes },
                });
              });
            }
          }
        );
      });
    }
  };
  handleCheck = (event, treeId, treeNode) => {
    const { mainMap, view } = mapConstants;
    const { dispatch, ztreeObj } = this.props;
    const that = this;
    // 报警总览 单独处理
    if (treeNode.treeName === '报警总览') {
      const alarmArea = mainMap.findLayerById('装置区');
      if (alarmArea) {
        mainMap.remove(alarmArea);
        dispatch({
          type: 'map/queryAlarmCounts',
          payload: { show: false, data: [] },
        });
      } else {
        addLayer(mainMap, ['装置区'], dispatch).then(() => {
          alarmCounting(mainMap, dispatch, this.props.groupByArea);
          const areaLayer1 = mainMap.findLayerById('装置区');
          if (areaLayer1) {
            areaLayer1.on('scale-visibility-change', ({ target }) => {
              if (!target.visibleAtMapScale) {
                dispatch({
                  type: 'map/queryAlarmCounts',
                  payload: { show: false, data: this.props.alarmCountsPopup.data },
                });
              } else {
                for (const count of that.props.alarmCountsPopup.data) {
                  const screenPoint = mainMap.toScreen(count.attributes.geometry);
                  count.style = { left: screenPoint.x, top: screenPoint.y };
                }
                dispatch({
                  type: 'map/queryAlarmCounts',
                  payload: { show: true, data: that.props.alarmCountsPopup.data },
                });
              }
            });
          }
          // 监听鼠标事件
          // mainMap.on('pan', ({ delta }) => {
          //   const alarmArea = mainMap.findLayerById('装置区');
          //   if (alarmArea) {
          //     if (alarmArea.visibleAtMapScale) {
          //       for (const count of that.props.alarmCountsPopup.data) {
          //         count.style = { left: count.currentStyle.left + delta.x, top: count.currentStyle.top + delta.y };
          //       }
          //       dispatch({
          //         type: 'map/queryAlarmCounts',
          //         payload: { show: true, data: that.props.alarmCountsPopup.data },
          //       });
          //     }
          //   }
          // });
          // mainMap.on('extent-change', () => {
          //   const areaLayer = mainMap.findLayerById('装置区');
          //   if (areaLayer) {
          //     if (areaLayer.visibleAtMapScale) {
          //       for (const count of that.props.alarmCountsPopup.data) {
          //         const screenPoint = mainMap.toScreen(count.attributes.geometry);
          //         count.style = { left: screenPoint.x, top: screenPoint.y };
          //         count.currentStyle = { left: screenPoint.x, top: screenPoint.y };
          //       }
          //       dispatch({
          //         type: 'map/queryAlarmCounts',
          //         payload: { show: true, data: that.props.alarmCountsPopup.data },
          //       });
          //     } else {
          //       dispatch({
          //         type: 'map/queryAlarmCounts',
          //         payload: { show: false, data: that.props.alarmCountsPopup.data },
          //       });
          //     }
          //   }
          // });
          // mainMap.on('pan-end', ({ delta }) => {
          //   const alarmArea = mainMap.findLayerById('装置区');
          //   if (alarmArea) {
          //     if (alarmArea.visibleAtMapScale) {
          //       for (const count of that.props.alarmCountsPopup.data) {
          //         count.style = { left: count.currentStyle.left + delta.x, top: count.currentStyle.top + delta.y };
          //         count.currentStyle = { left: count.currentStyle.left + delta.x, top: count.currentStyle.top + delta.y };
          //       }
          //       dispatch({
          //         type: 'map/queryAlarmCounts',
          //         payload: { show: true, data: that.props.alarmCountsPopup.data },
          //       });
          //     }
          //   }
          // });
        });
      }
    }
    // 选中后打开下级
    ztreeObj.expandNode(treeNode);
  };
  handleBeforeAsync = (treeId, parentNode) => {
    if (parentNode) {
      if (parentNode.orgCode) {
        // 有orgCode 字段， 请求 组织机构
        this.setState({
          param: ['orgCode=parentCode'],
          asyncUrl: 'emgc/system/organization/getOrgByParentCode',
        });
      } else { // 无orgCode 字段， 判断是否请求资源
        if (parentNode.loadResource) {
          let params;
          if (parentNode.parentOrgCode) {
            params = ['parentOrgCode=orgCode', 'ctrlResourceType=ctrlType'];
          } else {
            params = ['parentOrgCode=orgCode', 'ctrlResourceType=ctrlType'];
          }
          this.setState({
            treeName: 'resourceName',
            param: params,
            asyncUrl: 'emgc/resource/resourceInfo/selectByCtrlType',
          });
          // else {
          //   this.setState({
          //     treeName: 'resourceName',
          //     param: ['ctrlResourceType=ctrlType'],
          //     asyncUrl: 'emgc/resource/resourceInfo/selectByCtrlType',
          //   });
          // }
        } else {
          // 获取当前登录用户ID
          const { accountID } = this.props.currentUser;
          this.setState({
            treeName: 'resourceName',
            param: ['treeID=parentTreeID'],
            otherParam: ['accountID', accountID],
            asyncUrl: 'emgc/resource/baseOftenResource/selectAccountID',
          });
        }
      }
    }
  };

  onExpand = (expandedKeys) => {
    this.props.dispatch({
      type: 'resourceTree/getContext',
      payload: { show: false },
    });
  };
  onCheck = (_, { checkedNodes }) => {
    const { mainMap, dispatch, scale } = this.props;
    const addLayers = [];
    const delLayers = [];
    // let visibleLayer = [];
    for (const node of checkedNodes) {
      const treeType = node.props.treeType || node.props.dataRef.treeType;
      const treeName = node.props.treeName || node.props.dataRef.treeName;
      if (treeType === 'layer') {
        // 获取需要添加的图层
        if (!mainMap.findLayerById(treeName)) {
          addLayers.push(treeName);
        }
      }
    }
    // 获取需要删除的图层
    for (const layerId of mainMap.graphicsLayerIds) {
      if (!checkedNodes.find((value) => {
        const treeName = value.props.treeName || value.props.dataRef.treeName;
        return treeName === layerId;
      })) {
        delLayers.push(mainMap.findLayerById(layerId));
      }
    }
    addLayer(mainMap, addLayers, dispatch);
    delLayer(mainMap, delLayers, dispatch);
    setTimeout(() => {
      this.props.dispatch({
        type: 'resourceTree/getContext',
        payload: { show: false },
      });
    });
  };
  onSelect = (_, { selectedNodes }) => {
    const { mainMap, baseLayer, dispatch } = this.props;
    this.props.dispatch({
      type: 'resourceTree/getContext',
      payload: { show: false },
    });
    this.setState({ selectedNodes });
    locateDevice(mainMap, baseLayer, selectedNodes[0].props.GISCode, dispatch).then((res) => {
      mainMap.centerAndZoom(res[0].feature.geometry).then(() => {
        const screenPoint = mainMap.toScreen(res[0].feature.geometry);
        dispatch({
          type: 'map/showInfoWindow',
          payload: { show: true, type: 'demo', screenPoint, mapStyle: { width: mainMap.width, height: mainMap.height }, attributes: res[0].feature.attributes },
        });
      });
    });
  };
  // handleRightClick =({ event, node }) => {
  //   if (!node.props.dataRef.treeMenu) {
  //     return;
  //   }
  //   const position = { top: event.clientY, left: event.clientX };
  //   console.log(node.props.dataRef);
  //   this.props.dispatch({
  //     type: 'resourceTree/getContext',
  //     payload: { position, data: node.props.dataRef.treeMenu, show: true },
  //   });
  //   this.props.dispatch({
  //     type: 'resourceTree/selectedNodes',
  //     payload: [node],
  //   });
  // };
  render() {
    const { treeData, contextMenu, selectedNodes, loading, isOften } = this.props;
    return (
      !loading.effects['resourceTree/fetch'] ? (
        <div className={styles.warp}>
          { treeData.length > 0 ?
            <ReactZtree nodes={treeData} ref={(ref) => { this.ztree = ref; }} setting={this.setting()} /> : (
              <div className={styles.noData}>
                      无常用资源
                <div>(可尝试在资源树中,通过右键添加常用资源)</div>
              </div>
)}
          {/*<ReactZtree nodes={treeData} ref={(ref) => { this.ztree = ref; }} setting={this.setting()} />*/}
          <TreeContextMenu
            dispatch={this.props.dispatch}
            contextMenu={contextMenu}
            selectedNodes={selectedNodes}
            isOften={isOften}
          />
        </div>
      ) : <Spin className={styles.spin} />);
  }
}

