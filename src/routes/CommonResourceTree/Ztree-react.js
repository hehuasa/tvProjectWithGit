import React, { PureComponent, Component } from 'react';
import $ from 'jquery';
import { connect } from 'dva';
import '../../components/Ztree/jquery.ztree.all.min';

@connect(({ commonResourceTree }) => {
  return {
    ztreeObj: commonResourceTree.ztreeObj,
  };
})
export default class ReactZtree extends Component {
  componentDidMount() {
    this.renderZtreeDom();
  }
  componentWillUnmount() {
    if (this.props.ztreeObj.destroy) {
      this.props.ztreeObj.destroy();
      this.props.dispatch({
        type: 'commonResourceTree/queryZtreeObj',
        payload: null,
      });
      this.props.dispatch({
        type: 'commonResourceTree/queryList',
        payload: null,
      });
      this.props.dispatch({
        type: 'commonResourceTree/saveAjaxParam',
        payload: {
          param: ['treeID=parentTreeID'],
          asyncUrl: 'emgc/resource/resourceTree/getResourceInfo',
        },
      });
    }
  }
  getTreeSetting() {
    const { treeId, treeObj, async, check, data, edit, view, callback } = this.props.setting();
    return {
      treeId,
      treeObj,
      async,
      callback,
      check,
      data,
      edit,
      view,
    };
  }
  renderZtreeDom() {
    const obj = $.fn.zTree.init($(this.ztree), this.getTreeSetting(), this.props.nodes);
    this.props.dispatch({
      type: 'commonResourceTree/queryZtreeObj',
      payload: obj,
    });
  }
  render() {
    return (
      <div className="ztree" id="ztree" ref={(ref) => { this.ztree = ref; }} />
    );
  }
}
