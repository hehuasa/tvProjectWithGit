import React, { PureComponent } from 'react';
import $ from 'jquery';
import { connect } from 'dva';
import '../../components/Ztree/jquery.ztree.all.min';

@connect(({ resourceTree }) => {
  return {
    ztreeObj: resourceTree.ztreeObj,
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
    if(this.props.ztreeObj.destroy)
    this.props.ztreeObj.destroy();
  }
  getTreeSetting() {
    const { treeId, treeObj, async, check, data, edit, view, callback } = this.props.setting;
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
      type: 'resourceTree/queryOftenZtreeObj',
      payload: obj,
    });
  }
  render() {
    return (
      <div className="ztree" id="ztree" ref={ref => this.ztree = ref} />
    );
  }
}
