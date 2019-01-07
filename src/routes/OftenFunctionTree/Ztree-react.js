import React, { PureComponent } from 'react';
import $ from 'jquery';
import { connect } from 'dva';
import '../../components/Ztree/jquery.ztree.all.min';

@connect(({ sysFunction }) => {
  return {
    oftenZtreeObj: sysFunction.oftenZtreeObj,
  };
})
export default class ReactZtree extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.renderZtreeDom();
  }
  componentWillUnmount() {
    if (this.props.oftenZtreeObj.destroy) { this.props.oftenZtreeObj.destroy(); }
  }
  getTreeSetting() {
    const { treeId, treeObj, async, data, edit, view, callback } = this.props.setting;
    return {
      treeId,
      treeObj,
      async,
      callback,
      data,
      edit,
      view,
    };
  }
  renderZtreeDom() {
    const obj = $.fn.zTree.init($('#oftenFunctionTree'), this.getTreeSetting(), this.props.nodes);
    this.props.dispatch({
      type: 'sysFunction/queryOftenZtreeObj',
      payload: obj,
    });
  }
  render() {
    return (
      <div className="ztree" id="oftenFunctionTree" ref={ref => this.ztree = ref} />
    );
  }
}
