import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import ReactZtree from './Ztree-react';
import TreeContextMenu from './ContextMenu/TreeContextMenu';
import EmergencyCommand from './EmergencyCommand';

import styles from './index.less';
import { ajaxDataFilter } from './fuction';
import { handleClick, handleCheck, handleSelected } from './treeAction';

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
@connect(({ sysFunction, user, accessControl, loading, tabs, resourceTree, vocsMonitor, emergency, panelBoard, homepage, video, alarm, map, constructMonitor, paSystem, global, mapRelation }) => {
  return {
    disabled: sysFunction.oftenTreeDisabled,
    treeData: sysFunction.treeData,
    contextMenu: sysFunction.contextMenu,
    isOften: sysFunction.isOften,
    ztreeObj: sysFunction.ztreeObj,
    currentUser: user.currentUser,
    videoFooterHeight: homepage.videoFooterHeight,
    rightCollapsed: global.rightCollapsed,
    resourceGroupByArea: resourceTree.resourceGroupByArea,
    clusterRes: resourceTree.clusterRes,
    groupByArea: alarm.groupByArea,
    alarmDrawing: alarm.drawing,
    groupByOverview: alarm.groupByOverview,
    overviewShow: alarm.overviewShow,
    alarmIconObj: alarm.iconObj,
    list: alarm.list,
    listWithFault: alarm.listWithFault,
    scale: map.scale,
    popupScale: map.popupScale,
    alarmTypeList: alarm.alarmTypeList,
    constantlyValue: map.constantlyValue,
    searchDeviceArray: map.searchDeviceArray,
    load: map.load,
    infoPops: mapRelation.infoPops,
    alarmIconData: mapRelation.alarmIconData,
    vocsMonitor,
    fetchingAlarm: loading.effects['alarm/fetch'],
    loading,
    tabs,
    video,
    paSystem,
    constructMonitor,
    accessControlShow: accessControl.show,
    videoPosition: video.position,
    videoShow: video.show,
    emergency,
    panelBoard,
  };
})
export default class Trees extends PureComponent {
  constructor(prop) {
    super(prop);
    this.state = {
      visible: false,
      key: null,
      title: null,
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
      payload: {},
    }).then(() => {
      const { accountID } = this.props.currentUser;
      dispatch({
        type: 'sysFunction/fetch',
        payload: { accountID },
      }).then(() => {
        // 选中报警预览
        const getAlarmCount = setInterval(() => {
          if (!this.props.fetchingAlarm && this.props.load && this.props.ztreeObj.getNodeByParam) {
            const { ztreeObj } = this.props;
            if (ztreeObj.getNodes().length > 0) {
              clearInterval(getAlarmCount);
              const node = this.props.ztreeObj.getNodeByParam('checkClickFunTemplate', 'AlarmMapingP');
              ztreeObj.expandNode(node, true, false, false, true);
              const a = setInterval(() => {
                if (node.children && node.children.length > 0) {
                  clearInterval(a);
                  // alarmDrawing
                  let index = 0;
                  const loop = () => {
                    if (index === node.children.length) {
                      return false;
                    }
                    if (!this.props.alarmDrawing) {
                      ztreeObj.checkNode(node.children[index], true, false, true);
                      index += 1;
                      setTimeout(() => {
                        loop();
                      }, 500);
                    } else {
                      setTimeout(() => {
                        loop();
                      }, 100);
                    }
                  };
                  loop();
                  this.setState({
                    isInit: true,
                  });
                }
              }, 200);
              // getAlarmCount = null;
              // const subLayer = this.props.baseLayer.findSublayerById(49);
              // // subLayer.visiable = true;
              // const query = subLayer.createQuery();
              // query.outFields = ['*'];
              // subLayer.queryFeatures(query).then((res) => {
              //   clustering({ view: mapView, dispatch, alarms: this.props.groupByOverview.list, graphics: res.features, overviewShow: this.props.overviewShow, popupScale, resourceGroupByArea });
              // });s;
              // if (checkedNodesObj !== null) {
              //   // 展开存储的node
              //   let index = 0;
              //   // checkedNodesObj.expand 的键值（level）即为每一级node的标识
              //   const expandTree = () => {
              //     this.setState({ isRecovery: true });
              //     return new Promise((resolve) => {
              //       let countPara = 0; // 用于判断数组每一项是否完成加载下级
              //       if (checkedNodesObj.expand[index]) {
              //         for (const item of checkedNodesObj.expand[index].nodes) {
              //           const node = ztreeObj.getNodesByFilter((node1) => {
              //             return (node1.name === item.name && node1.treeID === item.treeID);
              //           }, true);
              //           if (node !== null) {
              //             // 展开node
              //             ztreeObj.expandNode(node, true, false, false, true);
              //             const getChildren = setInterval(() => {
              //               if (node.children) {
              //                 if (node.children.length > 0) {
              //                   clearInterval(getChildren);
              //                   countPara += 1;
              //                   if (countPara === checkedNodesObj.expand[index].nodes.length) {
              //                     index += 1;
              //                     if (index < checkedNodesObj.expand.length) {
              //                       expandTree();
              //                     } else {
              //                       // 勾选node
              //                       for (const [index1, item2] of checkedNodesObj.checked.entries()) {
              //                         const getNode = setInterval(() => {
              //                           let node2 = ztreeObj.getNodeByParam('resourceID', item2, null);
              //                           if (node2 === null) {
              //                             node2 = ztreeObj.getNodeByParam('name', item2, null);
              //                           }
              //                           if (node2 !== null) {
              //                             clearInterval(getNode);
              //                             ztreeObj.checkNode(node2, true, false, true);
              //                             if (index1 === checkedNodesObj.checked.length - 1) {
              //                               this.setState({ isRecovery: false });
              //                             }
              //                           }
              //                         }, 50);
              //                       }
              //                     }
              //                   }
              //                 }
              //               }
              //             }, 50);
              //           }
              //         }
              //       } else {
              //         // 第一级树单独判断
              //         if (checkedNodesObj.checked.length > 0) {
              //           // 勾选node
              //           for (const [index1, item2] of checkedNodesObj.checked.entries()) {
              //             const getNode = setInterval(() => {
              //               let node2 = ztreeObj.getNodeByParam('name', item2, null);
              //               if (node2 === null) {
              //                 node2 = ztreeObj.getNodeByParam('resourceID', item2, null);
              //               }
              //               if (node2 !== null) {
              //                 clearInterval(getNode);
              //                 if (index1 === checkedNodesObj.checked.length - 1) {
              //                   resolve();
              //                 }
              //                 ztreeObj.checkNode(node2, true, false, true);
              //               }
              //             }, 50);
              //           }
              //         }
              //       }
              //     });
              //   };
              //   expandTree().then(() => {
              //     this.setState({ isRecovery: false });
              //   });
              //   if (checkedNodesObj.checked.length === 0) {
              //     this.setState({ isRecovery: false });
              //   }
              // }
            }
          }
        }, 50);
      });
    });
  }
  // 禁用无法点击
  setDisabled = (value) => {
    this.setState({
      disabled: value
    })
  };
  // 右键点击函数
  onRightClick = (e, treeId, treeNode) => {
    e.preventDefault();
    const position = { top: e.clientY, left: e.clientX };
    if (treeNode && !treeNode.isParent) {
      // 获取accountID
      const { funID } = treeNode;
      const { accountID } = this.props.currentUser;
      this.props.dispatch({
        type: 'sysFunction/checkIsOften',
        payload: { accountID, funID },
      }).then(() => {
        const { isOften } = this.props;
        this.props.dispatch({
          type: 'sysFunction/getContext',
          payload: { position, show: true, cancel: isOften, funID },
        });
      });
    }
  };
  setting = () => {
    return {
      callback: {
        onClick: (event, treeId, treeNode) => {
          if (treeNode.treeType) {
            handleClick(event, treeId, treeNode, this);
          } else {
            this.handleClick(event, treeId, treeNode);
          }
        },
        onRightClick: this.onRightClick,
        onSelected: (treeId, treeNode) => { handleSelected(treeId, treeNode, this); },
        onCheck: (event, treeId, treeNode) => { handleCheck(event, treeId, treeNode, this); },
      },
      check: {
        enable: true,
        autoCheckTrigger: true,
        chkboxType: { Y: '', N: '' },
      },
      data: {
        simpleData: {
          enable: true,
          idKey: 'functionCode',
          pIdKey: 'parentCode',
          rootPId: '0',
        },
      },
      view: {
        showIcon: false,
        addDiyDom: this.addDiyDom,
      },
      async: {
        enable: true,
        type: 'get',
        url: 'emgc/resource/resourceTree/getByParentTree',
        autoParam: ['treeID=parentTreeID'],
        dataFilter: ajaxDataFilter,
      },
    };
  };
  getURL = (treeNode) => {
    let url = treeNode.visitURL;
    while (treeNode.getParentNode()) {
      treeNode = treeNode.getParentNode();
      url = `${treeNode.visitURL}/${url}`;
    }
    return url;
  }
  // 点击函数
  handleClick = (event, treeId, treeNode) => {
    if (treeNode.leafMenu) {
      const title = treeNode.name;
      const key = this.getURL(treeNode);
      this.changeTabs(key, title, treeNode);
    }
  };
  // 打开应急指挥modle
  onShowModal = (key, title) => {
    this.setState({
      visible: true,
      key,
      title,
    });
  }
  // 更改事件状态
  confirm = (row, eventStatu, key, title) => {
    const storage = window.localStorage;
    storage.eventID = row.eventID;
    const { userID } = this.props.currentUser.baseUserInfo;
    const { dispatch } = this.props;
    if (row.eventStatu === 0) {
      dispatch({
        type: 'emergency/updateProcessNode',
        payload: { eventID: row.eventID, eventStatu, userID },
      }).then(() => {
        dispatch({
          type: 'emergency/saveCurrent',
          payload: eventStatu,
        });
        dispatch({
          type: 'emergency/saveViewNode',
          payload: eventStatu,
        });
        dispatch({
          type: 'emergency/selectNodeType',
          payload: { eventID: row.eventID, eventStatu },
        });
        this.cancelSvaeKey(row, key, title);
      });
    } else {
      this.cancelSvaeKey(row, key, title);
    }
  };
  // 关闭model, 打开标签页
  cancelSvaeKey = (row, key, title) => {
    const { dispatch, saveHeaderSelectText } = this.props;
    saveHeaderSelectText(row.eventName);
    if (this.state.visible) {
      this.setState({
        visible: false,
      });
    }
    dispatch({
      type: 'emergency/saveEventId',
      payload: {
        eventId: row.eventID,
        tableId: `/${key}`,
      },
    });
    dispatch({
      type: 'tabs/addTabs',
      payload: { key: `/${key}`, title, functionInfo: row },
    });
    this.openBoardList();
  };

  // 确定应急指挥modle
  onHandleOk = (record) => {
    this.confirm(record, 1, this.state.key, this.state.title);
  };
  // 关闭应急指挥modle
  onHandleCancel = (e) => {
    this.setState({
      visible: false,
      key: null,
      title: null,
    });
    this.props.dispatch({
      type: 'alarmDeal/resetSearchList',
    });
  }


  openBoardList = () => {
    const { expandKeys, activeKeys } = this.props.panelBoard;
    const openBoard = (boardType) => {
      const newArr = [];
      for (const arr of activeKeys) {
        newArr.push(arr.keys);
      }
      if (newArr.indexOf(boardType) === -1) {
        expandKeys.push(boardType);
        this.props.dispatch({
          type: 'panelBoard/queryList',
          payload: {
            expandKeys,
            activeKeys: [
              { name: boardType, uniqueKey: 0, keys: boardType, param: { title: '事件信息' } },
              ...activeKeys,
            ],
          },
        });
      } else if (expandKeys.indexOf(boardType) === -1) {
        expandKeys.push(boardType);
        this.props.dispatch({
          type: 'panelBoard/queryList',
          payload: {
            expandKeys,
            activeKeys,
          },
        });
      }
    };
    openBoard('EventInfo');
  }
  // 处理点击事件，处理tabs
  changeTabs = (key, title, treeNode) => {
    const { tabs, dispatch } = this.props;
    // if (title !== '应急事件') {
    //   const { video, videoFooterHeight, rightCollapsed, accessControlShow } = this.props;
    //   const { position } = video;
    // // 折叠
    //   changeVideoPosition(key, rightCollapsed, position, dispatch);
    //   dispatch({
    //     type: 'global/changeRightCollapsed',
    //     payload: true,
    //   }).then(() => {
    //       const { view, accessInfoExtent } = mapConstants;
    //       resetAccessStyle(accessControlShow, dispatch, accessInfoExtent);
    //       changeVideoSize(videoFooterHeight, dispatch, 'hide');
    //   });
    // }
    dispatch({
      type: 'sysFunction/getContext',
      payload: { show: false },
    });
    // if (title === '应急演练事件') {
    //   dispatch({
    //     type: 'emergency/undoneDrillList',
    //   });
    // } else if (title === '演练接报') {
    //   dispatch({
    //     type: 'emergency/undoneDrillList',
    //     payload: {
    //       eventStatu: 1,
    //     },
    //   });
    // } else if (title === '演练研判') {
    //   dispatch({
    //     type: 'emergency/undoneDrillList',
    //     payload: {
    //       eventStatu: 2,
    //     },
    //   });
    // } else if (title === '演练预警') {
    //   dispatch({
    //     type: 'emergency/undoneDrillList',
    //     payload: {
    //       eventStatu: 3,
    //     },
    //   });
    // } else if (title === '演练启动') {
    //   dispatch({
    //     type: 'emergency/undoneDrillList',
    //     payload: {
    //       eventStatu: 4,
    //     },
    //   });
    // } else if (title === '演练处理') {
    //   dispatch({
    //     type: 'emergency/undoneDrillList',
    //     payload: {
    //       eventStatu: 5,
    //     },
    //   });
    // } else if (title === '演练终止') {
    //   dispatch({
    //     type: 'emergency/undoneDrillList',
    //     payload: {
    //       eventStatu: 6,
    //     },
    //   });
    // }
    if (tabs.tabs.find(value => value.key === `/${key}`)) {
      // 更新tabs的title
      dispatch({
        type: 'tabs/update',
        payload: { key: `/${key}`, title },
      });
      // 激活已有的tabs
      dispatch({
        type: 'tabs/active',
        payload: { key: `/${key}` },
      });
    } else {
      dispatch({
        type: 'tabs/addTabs',
        payload: { key: `/${key}`, title, functionInfo: treeNode },
      });
    }
  };
  // 自定义树节点
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
  };
  render() {
    const { treeData, contextMenu, selectedNodes, loading, disabled } = this.props;
    // treeData.sort((a, b) => {
    //   return a.sortIndex - b.sortIndex;
    // });
    // treeData.sort((a, b) => {
    //   return a.newSortIndex - b.newSortIndex;
    // });
    return (
      !loading.effects['sysFunction/fetch'] ? (
        <div className={styles.warp}>
          <Spin spinning={disabled}>
          <ReactZtree nodes={treeData} ref={ref => this.ztree = ref} setting={this.setting()} />
          <TreeContextMenu
            dispatch={this.props.dispatch}
            contextMenu={contextMenu}
          />
          <EmergencyCommand
            title="应急指挥事件"
            visible={this.state.visible}
            emergency={this.props.emergency}
            dispatch={this.props.dispatch}
            onHandleOk={this.onHandleOk}
            onHandleCancel={this.onHandleCancel}
          />
          </Spin>
        </div>
      ) : <Spin className={styles.spin} />);
  }
}

