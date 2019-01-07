import React, { PureComponent } from 'react';
import $ from 'jquery';
import { connect } from 'dva';
import '../../components/Ztree/jquery.ztree.all.min';
import '../../components/Ztree/css/zTreeStyle.css';

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
    console.log(this.props.ztreeObj);
    this.renderZtreeDom();
  }
  componentWillUnmount() {
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
    console.log(this.ztree);
    const obj = $.fn.zTree.init($(this.ztree), this.getTreeSetting(), this.props.nodes);
    console.log(obj);
    this.props.dispatch({
      type: 'resourceTree/queryZtreeObj',
      payload: obj,
    });
  }
  render() {
    return (
      <div className="ztree" ref={ref => this.ztree = ref} />
    );
  }
}
