import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import $ from "jquery";
import { ajaxDataFilter } from './fuction';
import { handleCheck, handleSelected, handleClick } from './treeAction';
import ReactZtree from './Ztree-react';
import { addLayer, delLayer, locateDevice } from '../../utils/mapService';
import TreeContextMenu from './ContextMenu/TreeContextMenu';
import styles from './index.less';


// 自定义的 treeNode 设置属性
const setAttribute = (node, array) => {
  for (const item of array) {
    node.setAttribute(item[0], item[1]);
  }
};
// 自定义的 treeNode 设置style
const setStyle = (node, array) => {
  for (const item of array) {
    node.style[item[0]] = item[1];
  }
};
let ajaxParam = {
  param: ['treeID=parentTreeID'],
  asyncUrl: 'emgc/resource/resourceTree/getByParentTree',
};
const checkedNodesObj = { checked: [], expand: [] };
const expandNodesObj = {};
// 存储checked的node，以及关联的expand node
const saveNode = (node, type) => {
  // if (node.name === '21烯烃分部') {
  //
  // }
  //  没有下级的，不存储至expand
  if (node.isParent) {
    let obj;
    if (type === 'checked') {
      obj = checkedNodesObj;
    } else {
      obj = expandNodesObj;
    }
    const index = obj.expand.findIndex(value => value.level === node.level);
    if (index === -1) {
      obj.expand.push({ level: node.level, nodes: [{ tId: node.tId, expandNum: 1, name: node.name, treeID: node.treeID }] });
    } else {
      const index1 = obj.expand[index].nodes.findIndex(value => value.name === node.name);
      if (index1 === -1) {
        obj.expand[index].nodes.push({ tId: node.tId, expandNum: 1, name: node.name, treeID: node.treeID });
      } else {
        obj.expand[index].nodes[index1].expandNum += 1;
      }
    }
  }
};
// 删除checked的node，以及关联的expand node
const cancleNode = (node, type) => {
  if (node.children) {
    let obj;
    if (type === 'checked') {
      obj = checkedNodesObj;
    } else {
      obj = expandNodesObj;
    }
    const index = obj.expand.findIndex(value => value.level === node.level);
    if (index !== -1) {
      const index1 = obj.expand[index].nodes.findIndex(value => value.treeID === node.treeID);
      if (obj.expand[index].nodes[index1]) {
        obj.expand[index].nodes[index1].expandNum -= 1;
        if (obj.expand[index].nodes[index1].expandNum === 0) {
          obj.expand[index].nodes.splice(index1, 1);
          if (obj.expand[index].nodes.length === 0) {
            obj.expand.splice(index, 1);
          }
        }
      }
    }
  }
};
const getCheckedParten = (node, ztreeObj) => {
  saveNode(node, 'checked');
  if (node.parentTId !== null) {
    const parent = ztreeObj.getNodeByTId(node.parentTId);
    if (parent !== null) {
      saveNode(parent, 'checked');
      getCheckedParten(parent, ztreeObj);
    }
  }
  return checkedNodesObj;
};
const cancleCheckedParten = (node, ztreeObj) => {
  cancleNode(node, 'checked');
  if (node.parentTId !== null) {
    const parent = ztreeObj.getNodeByTId(node.parentTId);
    if (parent !== null) {
      cancleNode(parent, 'checked');
      cancleCheckedParten(parent, ztreeObj);
    }
  }
  return checkedNodesObj;
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
      default:
        if (parentNode.loadResource) {
          ajaxParam = {
            param: ['ctrlResourceType=ctrlType'],
            asyncUrl: 'emgc/resource/resourceInfo/selectByCtrlType',
          };
        } else {
          ajaxParam = {
            param: ['treeID=parentTreeID'],
            asyncUrl: 'emgc/resource/resourceTree/getByParentTree',
          };
        }
    }
  }
};
@connect(({ resourceTree, map, sidebar, loading, alarm, panelBoard, homepage, user, constantlyData, global, constructMonitor, paSystem, video, mapRelation }) => {
  return {
    treeData: resourceTree.treeData,
    appendData: resourceTree.appendData,
    contextMenu: resourceTree.contextMenu,
    selectedNodes: resourceTree.selectedNodes,
    resourceInfo: resourceTree.resourceInfo,
    resInfo: resourceTree.resInfo,
    resourceIDs: homepage.resourceIDs,
    videoFooterHeight: homepage.videoFooterHeight,
    refreshTime: resourceTree.refreshTime,
    checkedNodesObj: resourceTree.checkedNodesObj,
    resourceGroupByArea: resourceTree.resourceGroupByArea,
    clusterRes: resourceTree.clusterRes,
    load: map.load,
    visiblePanel: sidebar.visiblePanel,
    ztreeObj: resourceTree.ztreeObj,
    groupByArea: alarm.groupByArea,
    alarmDrawing: alarm.drawing,
    groupByOverview: alarm.groupByOverview,
    overviewShow: alarm.overviewShow,
    alarmIconObj: alarm.iconObj,
    list: alarm.list,
    listWithFault: alarm.listWithFault,
    scale: map.scale,
    video,
    alarmTypeList: alarm.alarmTypeList,
    constantlyValue: map.constantlyValue,
    searchDeviceArray: map.searchDeviceArray,
    guardAreaCounting: homepage.guardAreaCounting,
    guardDoorCounting: homepage.guardDoorCounting,
    constantlyComponents: constantlyData.constantlyComponents,
    infoPops: mapRelation.infoPops,
    paSystemInfo: map.paSystemInfo,
    paSystem,
    rightCollapsed: global.rightCollapsed,
    constructMonitor,
    loading,
    fetchingAlarm: loading.effects['alarm/fetch'],
    fetchLayers: loading.effects['map/fetchLayers'],
    panelBoard,
    currentUser: user.currentUser,
  };
})
export default class Trees extends PureComponent {
  constructor(prop) {
    super(prop);
    this.state = {
      isInit: false,
      keyChildren: 'children',
    };
    this.getAutoParam = this.getAutoParam.bind(this);
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
      payload: {},
    });
    dispatch({
      type: 'resourceTree/queryCheckedNode',
    });
    // // 选中报警预览
    // const getAlarmCount = setInterval(() => {
    //   if (!this.props.fetchingAlarm && this.props.load && this.props.ztreeObj.getNodeByParam) {
    //     const { ztreeObj } = this.props;
    //     if (ztreeObj.getNodes().length > 0) {
    //       clearInterval(getAlarmCount);
    //       const node = this.props.ztreeObj.getNodeByParam('checkClickFunTemplate', 'AlarmMapingP');
    //       ztreeObj.expandNode(node, true, false, false, true);
    //       const a = setInterval(() => {
    //         if (node.children && node.children.length > 0) {
    //           clearInterval(a);
    //           // alarmDrawing
    //           let index = 0;
    //           const loop = () => {
    //             if (index === node.children.length) {
    //               return false;
    //             }
    //             if (!this.props.alarmDrawing) {
    //               ztreeObj.checkNode(node.children[index], true, false, true);
    //               index += 1;
    //               setTimeout(() => {
    //                 loop();
    //               }, 500);
    //             } else {
    //               setTimeout(() => {
    //                 loop();
    //               }, 100);
    //             }
    //           };
    //           loop();
    //           this.setState({
    //             isInit: true,
    //           });
    //         }
    //       });
    //         // getAlarmCount = null;
    //         // const subLayer = this.props.baseLayer.findSublayerById(49);
    //         // // subLayer.visiable = true;
    //         // const query = subLayer.createQuery();
    //         // query.outFields = ['*'];
    //         // subLayer.queryFeatures(query).then((res) => {
    //         //   clustering({ view: mapView, dispatch, alarms: this.props.groupByOverview.list, graphics: res.features, overviewShow: this.props.overviewShow, popupScale, resourceGroupByArea });
    //         // });s;
    //         // if (checkedNodesObj !== null) {
    //         //   // 展开存储的node
    //         //   let index = 0;
    //         //   // checkedNodesObj.expand 的键值（level）即为每一级node的标识
    //         //   const expandTree = () => {
    //         //     this.setState({ isRecovery: true });
    //         //     return new Promise((resolve) => {
    //         //       let countPara = 0; // 用于判断数组每一项是否完成加载下级
    //         //       if (checkedNodesObj.expand[index]) {
    //         //         for (const item of checkedNodesObj.expand[index].nodes) {
    //         //           const node = ztreeObj.getNodesByFilter((node1) => {
    //         //             return (node1.name === item.name && node1.treeID === item.treeID);
    //         //           }, true);
    //         //           if (node !== null) {
    //         //             // 展开node
    //         //             ztreeObj.expandNode(node, true, false, false, true);
    //         //             const getChildren = setInterval(() => {
    //         //               if (node.children) {
    //         //                 if (node.children.length > 0) {
    //         //                   clearInterval(getChildren);
    //         //                   countPara += 1;
    //         //                   if (countPara === checkedNodesObj.expand[index].nodes.length) {
    //         //                     index += 1;
    //         //                     if (index < checkedNodesObj.expand.length) {
    //         //                       expandTree();
    //         //                     } else {
    //         //                       // 勾选node
    //         //                       for (const [index1, item2] of checkedNodesObj.checked.entries()) {
    //         //                         const getNode = setInterval(() => {
    //         //                           let node2 = ztreeObj.getNodeByParam('resourceID', item2, null);
    //         //                           if (node2 === null) {
    //         //                             node2 = ztreeObj.getNodeByParam('name', item2, null);
    //         //                           }
    //         //                           if (node2 !== null) {
    //         //                             clearInterval(getNode);
    //         //                             ztreeObj.checkNode(node2, true, false, true);
    //         //                             if (index1 === checkedNodesObj.checked.length - 1) {
    //         //                               this.setState({ isRecovery: false });
    //         //                             }
    //         //                           }
    //         //                         }, 50);
    //         //                       }
    //         //                     }
    //         //                   }
    //         //                 }
    //         //               }
    //         //             }, 50);
    //         //           }
    //         //         }
    //         //       } else {
    //         //         // 第一级树单独判断
    //         //         if (checkedNodesObj.checked.length > 0) {
    //         //           // 勾选node
    //         //           for (const [index1, item2] of checkedNodesObj.checked.entries()) {
    //         //             const getNode = setInterval(() => {
    //         //               let node2 = ztreeObj.getNodeByParam('name', item2, null);
    //         //               if (node2 === null) {
    //         //                 node2 = ztreeObj.getNodeByParam('resourceID', item2, null);
    //         //               }
    //         //               if (node2 !== null) {
    //         //                 clearInterval(getNode);
    //         //                 if (index1 === checkedNodesObj.checked.length - 1) {
    //         //                   resolve();
    //         //                 }
    //         //                 ztreeObj.checkNode(node2, true, false, true);
    //         //               }
    //         //             }, 50);
    //         //           }
    //         //         }
    //         //       }
    //         //     });
    //         //   };
    //         //   expandTree().then(() => {
    //         //     this.setState({ isRecovery: false });
    //         //   });
    //         //   if (checkedNodesObj.checked.length === 0) {
    //         //     this.setState({ isRecovery: false });
    //         //   }
    //         // }
    //     }
    //   }
    // }, 50);
  }
  // 异步请求完成后回调
  onAsyncSuccess = () => {
    const { dispatch, ztreeObj } = this.props;
    const data = ztreeObj.getNodes();
    dispatch({
      type: 'resourceTree/queryList',
      payload: data,
    });
  };
  // 获取某节点的第一个父级tree节点
  getTreeNode = (treeNode) => {
    if (treeNode.getParentNode() !== null && !treeNode.getParentNode().treeID) {
      return this.getTreeNode(treeNode.getParentNode());
    } else {
      return treeNode;
    }
  };
  // 右键点击函数
  onRightClick = (e, treeId, treeNode) => {
    if (!treeNode) {
      this.props.dispatch({
        type: 'resourceTree/getContext',
        payload: { show: false },
      });
      return;
    }
    const { treeID } = this.getTreeNode(treeNode);
    const { resourceID } = treeNode;
    // 获取当前登录用户ID
    const { accountID } = this.props.currentUser;
    // 判断当前资源是否已是常用资源
    if (resourceID) {
      this.props.dispatch({
        type: 'resourceTree/selectIfOften',
        payload: { resourceID, treeID, accountID },
      }).then(() => {
        const position = { top: e.clientY, left: e.clientX };
        // 子节点才能设为常用
        // if (!treeNode.isParent) {
        this.props.dispatch({
          type: 'resourceTree/getContext',
          payload: { position, show: true, resourceID, treeID, treeNode: treeNode.getParentNode() },
        });
        // }
      });
    } else {
      this.props.dispatch({
        type: 'resourceTree/getContext',
        payload: { show: false },
      });
    }
  };
  addDiyDom = (treeId, treeNode) => {
    if (treeNode.checkClickFunTemplate === 'StatusGraphics' || treeNode.checkClickFunTemplate === 'EnvMonitor' || treeNode.checkClickFunTemplate === 'DeviceMonitor')
    {
      // 添加radio
      const obj = document.getElementById(`${treeNode.tId}_a`);
      const parent = obj.parentNode;
      const input = document.createElement('input');
      const label = document.createElement('label');
      const span = document.createElement('span');
      setStyle(input, [
        // ['width', '13px'],
        // ['height', '13px'],
        // ['margin', '0 3px 0 0'],
        // ['vertical-align', 'middle'],
        ['display', 'none'],
      ]);
      setAttribute(span, [
        ['class', 'self-radio']
      ]);
      label.appendChild(input);
      label.appendChild(span);
      setAttribute(input, [
        ['type', 'radio'],
        ['name', treeNode.checkClickFunTemplate === 'StatusGraphics' || treeNode.checkClickFunTemplate === 'DeviceMonitor' ? 'StatusGraphics&DeviceMonitor' : treeNode.checkClickFunTemplate],
        ['id', `diyBtn_${treeNode.tId}`],
        ['tId', `${treeNode.tId}`],
        ['title', treeNode.tId],
      ]);
      // input.onchange = (event) => {
      //   treeNode.checked = event.target.checked;
      //   handleCheck(event, treeId, treeNode, this);
      // };
      input.onclick = (event) => {
        const inputs = document.getElementsByName(treeNode.checkClickFunTemplate === 'StatusGraphics' || treeNode.checkClickFunTemplate === 'DeviceMonitor' ? 'StatusGraphics&DeviceMonitor' : treeNode.checkClickFunTemplate);
        for (const input1 of inputs) {
          const node = this.props.ztreeObj.getNodeByTId(input1.title);
          if (`diyBtn_${treeNode.tId}` === input1.id && treeNode.checked) {
            event.target.checked = !event.target.checked;
            treeNode.checked = event.target.checked;
            handleCheck(event, treeId, treeNode, this);
          } else {
            node.checked = input1.checked;
            handleCheck({}, treeId, node, this);
          }
        }
      };
      parent.insertBefore(label, obj);
    }
  }
  setting = () => {
    return {
      callback: {
        onClick: (event, treeId, treeNode, d) => { handleClick(event, treeId, treeNode, d, this); },
        onSelected: (treeId, treeNode, d) => { handleSelected(treeId, treeNode, d, this); },
        // onUnSelected: (treeId, treeNode, d) => { this.handleUnSelected(treeId, treeNode, d); },
        // beforeClick: (treeId, treeNode, d) => { this.handleBeforeClick(treeId, treeNode, d); },
        onCheck: (event, treeId, treeNode) => { handleCheck(event, treeId, treeNode, this); },
        onExpand: (event, treeId, treeNode) => {
          // this.handleExpand(event, treeId, treeNode);
          // if (treeNode.checkClickFunTemplate !== 'StatusGraphics') {console.clear()};
        },
        beforeAsync: (treeId, treeNode) => { handleBeforeAsync(treeId, treeNode); },
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
        addDiyDom: this.addDiyDom,
      },
      check: {
        enable: true,
        autoCheckTrigger: true,
        chkboxType: { Y: '', N: '' },
      },
      async: {
        enable: true,
        type: 'get',
        url: this.getAsyncUrl,
        autoParam: this.getAutoParam,
        dataFilter: ajaxDataFilter,
      },
    };
  };
  // 获取ajax参数
  getAutoParam = () => {
    return ajaxParam.param;
  };
  // 获取ajaxUrl
  getAsyncUrl = () => {
    return ajaxParam.asyncUrl;
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
  render() {
    const { treeData, contextMenu, selectedNodes, loading } = this.props;
    return (
      !loading.effects['resourceTree/fetch'] ? (
        <div className={styles.warp}>
          <ReactZtree nodes={treeData} ref={(ref) => { this.ztree = ref; }} setting={this.setting()} />
          <TreeContextMenu
            dispatch={this.props.dispatch}
            contextMenu={contextMenu}
            selectedNodes={selectedNodes}
          />
        </div>
      ) : <Spin className={styles.spin} />);
  }
}

