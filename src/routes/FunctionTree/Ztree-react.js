import React, { PureComponent } from 'react';
import $ from 'jquery';
import { connect } from 'dva';
import '../../components/Ztree/jquery.ztree.all.min';

@connect(({ sysFunction }) => {
  return {
    ztreeObj: sysFunction.ztreeObj,
  };
})
export default class ReactZtree extends PureComponent {
  componentDidMount() {
    this.renderZtreeDom();
  }
  componentWillUnmount() {
    if (this.props.ztreeObj.destroy) { this.props.ztreeObj.destroy(); }
  }
  getTreeSetting() {
    const { treeId, treeObj, async, data, edit, view, callback, check } = this.props.setting;
    return {
      treeId,
      treeObj,
      async,
      callback,
      data,
      edit,
      view,
      check,
    };
  }
  renderZtreeDom() {
    const obj = $.fn.zTree.init($('#functionTree'), this.getTreeSetting(), this.props.nodes);
    this.props.dispatch({
      type: 'sysFunction/queryZtreeObj',
      payload: obj,
    });
  }
  render() {
    return (
      <div className="ztree" id="functionTree" ref={ref => this.ztree = ref} />
    );
  }
}
