import React, { PureComponent } from 'react';
import { connect } from 'dva';
import ReactZtree from './Ztree-react';

const ajaxDataFilter = (treeId, parentNode, responseData) => {
  if (responseData) {
    for (const node of responseData.data) {
      node.name = node.treeName || node.resourceName;
      node.isParent = true;
    }
  }
  return responseData.data;
};
@connect(({ resourceTree, map, sidebar, loading }) => {
  return {
    treeData: resourceTree.treeData,
    appendData: resourceTree.appendData,
    contextMenu: resourceTree.contextMenu,
    selectedNodes: resourceTree.selectedNodes,
    mainMap: map.mainMap,
    baseLayer: map.baseLayer,
    visiblePanel: sidebar.visiblePanel,
    ztreeObj: resourceTree.ztreeObj,
    loading,
  };
})
export default class Demo extends PureComponent {
  constructor(prop) {
    super(prop);
    this.state = {
      treeName: 'treeName',
      param: ['treeID=parentTreeID'],
      asyncType: 'post',
      asyncUrl: 'http://192.168.0.14:4000/resource/resourceTree/getByParentTree',
    };
    this.getAutoParam = this.getAutoParam.bind(this);
  }
  // state = {
  //   treeName: 'treeName',
  //   param: ['treeID=parentTreeID'],
  //   asyncType: 'post',
  //   asyncUrl: 'http://192.168.0.14:4000/resource/resourceTree/getByParentTree',
  // };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceTree/fetch',
      payload: {},
    });
  }
  getAutoParam = (treeId, treeNode) => {
    return this.state.param;
  };
  // getAsyncType= () => {
  //   return this.state.asyncType;
  // };
  getAsyncUrl= () => {
    return this.state.asyncUrl;
  };
  handleClick = (event, treeId, treeNode) => {
  };
  handleCheck = (event, treeId, treeNode) => {
  };
  handleBeforeAsync = (treeId, parentNode) => {
    if (parentNode) {
      if (parentNode.loadResource) {
        this.setState({
          treeName: 'resourceName',
          param: ['ctrlResourceType=ctrlType'],
          asyncUrl: 'http://192.168.0.14:4000/resource/resourceInfo/selectByCtrlType',
        });
      }
    }
  };
  onAsyncSuccess = () => {
    const { dispatch, ztreeObj } = this.props;
    const data = ztreeObj.getNodes();
    dispatch({
      type: 'resourceTree/queryList',
      payload: data,
    });
  }
  setting = () => {
    return {
      callback: {
        onClick: (event, treeId, treeNode) => { this.handleClick(event, treeId, treeNode); },
        onCheck: (event, treeId, treeNode) => { this.handleCheck(event, treeId, treeNode); },
        beforeAsync: (treeId, treeNode) => { this.handleBeforeAsync(treeId, treeNode); },
        onAsyncSuccess: () => { this.onAsyncSuccess(); },
      },
      data: {
        // key: {
        //   name: this.state.treeName,
        // },
      },
      view: {
        showIcon: false,
      },
      check: {
        enable: true,
      },
      async: {
        enable: true,
        type: 'post',
        url: this.getAsyncUrl,
        autoParam: this.getAutoParam,
        dataFilter: ajaxDataFilter,
        //   (treeId, parentNode, responseData) => {this.state.asyncType
        //   ajaxDataFilter(treeId, parentNode, responseData, this);
        // },
      },
    };
  };


  render() {
    const { treeData } = this.props;
    return (
      <div>
        <ReactZtree nodes={treeData} ref={ref => this.ztree = ref} setting={this.setting()} />
      </div>
    );
  }
}
