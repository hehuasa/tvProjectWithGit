import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { lineData } from '../../../../../utils/Panel';
import CommonLine from '../commonLine/CommonLine';
import CommonLineTable from '../commonLine/CommonLineTable';

@connect(({ combustibleGas, panelBoard }) => {
  return {
    commonLine: lineData({ obj: combustibleGas.refresh.gas.data }),
    panelBoard,
  };
})

export default class QualityMonitoring extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      indeterminate: false, // 判断是否已经被全选
      checkAll: true, // 判断是否选择全部
      plainOptions: this.props.commonLine.dot,
      checkedList: this.props.commonLine.dot,
      target: this.props.commonLine.target,
      targetCheckedList: this.props.commonLine.target,
      targetIndeterminate: false, // 判断是否已经被全选
      targetCheckAll: true, // 判断是否选择全部
    };
  }
  onChangeTime = (value) => {
    const { gas } = this.props.constantlyData
    gas.time = value;
    this.props.dispatch({
      type: 'constantlyData/updataGas',
      payload: gas,
    });
  }
  onChange = (onChangeCheckedList) => {
    const { plainOptions } = this.state;
    this.setState({
      checkedList: onChangeCheckedList,
      indeterminate: !!onChangeCheckedList.length && (onChangeCheckedList.length < plainOptions.length),
      checkAll: onChangeCheckedList.length === plainOptions.length,
    });
  }
  onCheckAllChange = (e) => {
    this.setState({
      checkedList: e.target.checked ? this.state.plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }
  onChange1 = (onChangeCheckedList) => {
    const { target } = this.state;
    this.setState({
      targetCheckedList: onChangeCheckedList,
      targetIndeterminate: !!onChangeCheckedList.length && (onChangeCheckedList.length < target.length),
      targetCheckAll: onChangeCheckedList.length === target.length,
    });
  }
  onCheckAllChange1 = (e) => {
    this.setState({
      targetCheckedList: e.target.checked ? this.state.target : [],
      targetIndeterminate: false,
      targetCheckAll: e.target.checked,
    });
  }
  components = (key) => {
    switch (key) {
      case 'table':
        return <CommonLineTable queryLineData={this.props.commonLine} />;
      case 'bar':
        return;
      case 'pie':
        return;
      case 'line':
        return <CommonLine onChangeTime={this.onChangeTime} onChange={this.onChange} onChange1={this.onChange1} onCheckAllChange={this.onCheckAllChange} onCheckAllChange1={this.onCheckAllChange1} queryLineData={this.props.commonLine} {...this.state} />;
      default:
        return <CommonLine onChangeTime={this.onChangeTime} onChange={this.onChange} onChange1={this.onChange1} onCheckAllChange={this.onCheckAllChange} onCheckAllChange1={this.onCheckAllChange1} queryLineData={this.props.commonLine} {...this.state} />;
    }
  }
  render() {
    const { expandKeys, toggleContent } = this.props.panelBoard;
    return (
      <div>
        {(expandKeys.indexOf(toggleContent.QualityMonitoring.name) === -1) ? null : this.components(toggleContent.QualityMonitoring.type)}
      </div>
    );
  }
}
