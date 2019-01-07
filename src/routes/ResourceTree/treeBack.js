// import React, { PureComponent } from 'react';
// import { Spin } from 'antd';
// import { connect } from 'dva';
// import ReactZtree from './Ztree-react';
// import { searchByAttr, addLayer, delLayer, locateDevice } from '../../utils/mapService';
// import TreeContextMenu from './ContextMenu/TreeContextMenu';
// import styles from './index.less';
//
// const ajaxDataFilter = (treeId, parentNode, responseData) => {
//   if (responseData) {
//     for (const node of responseData.data) {
//       node.name = node.treeName || node.resourceName;
//       node.isParent = true;
//     }
//   }
//   return responseData.data;
// };
// @connect(({ resourceTree, map, sidebar, loading }) => {
//   return {
//     treeData: resourceTree.treeData,
//     appendData: resourceTree.appendData,
//     contextMenu: resourceTree.contextMenu,
//     selectedNodes: resourceTree.selectedNodes,
//     mainMap: map.mainMap,
//     baseLayer: map.baseLayer,
//     visiblePanel: sidebar.visiblePanel,
//     ztreeObj: resourceTree.ztreeObj,
//     loading,
//   };
// })
// export default class Trees extends PureComponent {
//   constructor(prop) {
//     super(prop);
//     this.state = {
//       param: ['treeID=parentTreeID'],
//       asyncUrl: 'http://192.168.0.14:4000/resource/resourceTree/getByParentTree',
//     };
//     this.getAutoParam = this.getAutoParam.bind(this);
//   }
//   componentDidMount() {
//     const { dispatch } = this.props;
//     dispatch({
//       type: 'resourceTree/fetch',
//       payload: { ztree: true },
//     });
//   }
//   getAutoParam = (treeId, treeNode) => {
//     return this.state.param;
//   };
//   getAsyncUrl= () => {
//     return this.state.asyncUrl;
//   };
//   handleClick = (event, treeId, treeNode) => {
//     console.log(treeNode);
//     console.log(this.ztree.ztreeObj.getCheckedNodes());
//   };
//   handleCheck = (event, treeId, treeNode) => {
//     console.log(treeNode);
//   };
//   handleBeforeAsync = (treeId, parentNode) => {
//     if (parentNode) {
//       if (parentNode.loadResource) {
//         this.setState({
//           treeName: 'resourceName',
//           param: ['ctrlResourceType=ctrlType'],
//           asyncUrl: 'http://192.168.0.14:4000/resource/resourceInfo/selectByCtrlType',
//         });
//       }
//     }
//   };
//   onAsyncSuccess = () => {
//     const { dispatch, ztreeObj } = this.props;
//     const data = ztreeObj.getNodes();
//     dispatch({
//       type: 'resourceTree/queryList',
//       payload: data,
//     });
//   };
//   onAsyncSuccess = () => {
//     const { dispatch, ztreeObj } = this.props;
//     const data = ztreeObj.getNodes();
//     dispatch({
//       type: 'resourceTree/queryList',
//       payload: data,
//     });
//   };
//   setting = () => {
//     return {
//       callback: {
//         onClick: (event, treeId, treeNode) => { this.handleClick(event, treeId, treeNode); },
//         onCheck: (event, treeId, treeNode) => { this.handleCheck(event, treeId, treeNode); },
//         beforeAsync: (treeId, treeNode) => { this.handleBeforeAsync(treeId, treeNode); },
//         onAsyncSuccess: () => { this.onAsyncSuccess(); },
//         onRightClick: () => { this.onRightClick(); },
//       },
//       data: {
//         // key: {
//         //   name: this.state.treeName,
//         // },
//       },
//       view: {
//         showIcon: false,
//       },
//       check: {
//         enable: true,
//       },
//       async: {
//         enable: true,
//         type: 'post',
//         url: this.getAsyncUrl,
//         autoParam: this.getAutoParam,
//         dataFilter: ajaxDataFilter,
//         //   (treeId, parentNode, responseData) => {this.state.asyncType
//         //   ajaxDataFilter(treeId, parentNode, responseData, this);
//         // },
//       },
//     };
//   };
//
//   onExpand = (expandedKeys) => {
//     this.props.dispatch({
//       type: 'resourceTree/getContext',
//       payload: { show: false },
//     });
//   };
//   onCheck = (_, { checkedNodes }) => {
//     const { mainMap, dispatch } = this.props;
//     const addLayers = [];
//     const delLayers = [];
//     // let visibleLayer = [];
//     for (const node of checkedNodes) {
//       const treeType = node.props.treeType || node.props.dataRef.treeType;
//       const treeName = node.props.treeName || node.props.dataRef.treeName;
//       if (treeType === 'layer') {
//         // 获取需要添加的图层
//         if (!mainMap.findLayerById(treeName)) {
//           addLayers.push(treeName);
//         }
//       }
//     }
//     // 获取需要删除的图层
//     for (const layerId of mainMap.graphicsLayerIds) {
//       if (!checkedNodes.find((value) => {
//           const treeName = value.props.treeName || value.props.dataRef.treeName;
//           return treeName === layerId;
//         })) {
//         delLayers.push(mainMap.findLayerById(layerId));
//       }
//     }
//     addLayer(mainMap, addLayers, dispatch);
//     delLayer(mainMap, delLayers, dispatch);
//     setTimeout(() => {
//       this.props.dispatch({
//         type: 'resourceTree/getContext',
//         payload: { show: false },
//       });
//     });
//   };
//   onSelect = (_, { selectedNodes }) => {
//     const { mainMap, baseLayer, dispatch } = this.props;
//     this.props.dispatch({
//       type: 'resourceTree/getContext',
//       payload: { show: false },
//     });
//     this.setState({ selectedNodes });
//     locateDevice(mainMap, baseLayer, selectedNodes[0].props.GISCode, dispatch).then((res) => {
//       mainMap.centerAndZoom(res[0].feature.geometry).then(() => {
//         const screenPoint = mainMap.toScreen(res[0].feature.geometry);
//         dispatch({
//           type: 'map/showInfoWindow',
//           payload: { show: true, type: 'demo', screenPoint, mapStyle: { width: mainMap.width, height: mainMap.height }, attributes: res[0].feature.attributes },
//         });
//       });
//     });
//   };
//   handleRightClick =({ event, node }) => {
//     if (!node.props.dataRef.treeMenu) {
//       return;
//     }
//     const position = { top: event.clientY, left: event.clientX };
//     this.props.dispatch({
//       type: 'resourceTree/getContext',
//       payload: { position, data: node.props.dataRef.treeMenu, show: true },
//     });
//     this.props.dispatch({
//       type: 'resourceTree/selectedNodes',
//       payload: [node],
//     });
//   };
//   render() {
//     const { treeData, mainMap, baseLayer, dispatch, contextMenu, selectedNodes, visiblePanel, loading } = this.props;
//     return (
//       !loading.effects['resourceTree/fetch'] ? (
//         <div>
//           <ReactZtree nodes={treeData} ref={ref => this.ztree = ref} setting={this.setting()} />
//           <TreeContextMenu visiblePanel={visiblePanel} contextMenu={contextMenu} locateDevice={locateDevice} searchByAttr={searchByAttr} mainMap={mainMap} baseLayer={baseLayer} selectedNodes={selectedNodes} dispatch={dispatch} />
//         </div>
//       ) : <Spin className={styles.spin} />);
//   }
// }
//
