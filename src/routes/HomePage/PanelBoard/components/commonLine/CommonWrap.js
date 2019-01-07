import React, { PureComponent } from 'react';
import { connect } from 'dva';
import CommonLine from './CommonLine';
import CommonLineTable from './CommonLineTable';
import { getRealData } from '../../../../../utils/Panel';
import { constantlyPanelModal, constantlyConditionCalc } from '../../../../../services/constantlyModal';
import { mapConstants } from '../../../../../services/mapConstant';

const { view } = mapConstants;

@connect(({ constantlyData, panelBoard }) => {
  return {
    // commonLinData: lineData({ lineData: constantlyPanelModal.combustibleGas }),
    constantlyData,
    panelBoard,
    mapView: view,
  };
})

export default class Combustible extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      keys: this.props.keys,
    };
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      getRealData(this.props.dispatch, this.state.keys, this.props.panelBoard);
    }, 30000);
  }

  informUpdata = () => {
    const uniqueKey = Math.random() * new Date().getTime();
    for (const activeItem of this.props.panelBoard.activeKeys) {
      if (activeItem.keys === this.state.keys) {
        activeItem.uniqueKey = uniqueKey;
        this.props.dispatch({
          type: 'panelBoard/alterUniqueKey',
          payload: this.props.panelBoard.activeKeys,
        });
        break;
      }
    }
  };

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  onChangeTime = (value) => {
    constantlyPanelModal[this.state.keys].timeRange = value;
    getRealData(this.props.dispatch, this.state.keys, this.props.panelBoard);
  }
  onChange = (onChangeCheckedList) => {
    constantlyPanelModal[this.state.keys].checkedList = onChangeCheckedList;
    constantlyPanelModal[this.state.keys].indeterminate = (!!onChangeCheckedList.length && (onChangeCheckedList.length < constantlyPanelModal[this.state.keys].plainOptions.length));
    constantlyPanelModal[this.state.keys].checkAll = (onChangeCheckedList.length === constantlyPanelModal[this.state.keys].plainOptions.length);
    this.informUpdata();
  }
  onCheckAllChange = (e) => {
    constantlyPanelModal[this.state.keys].checkedList = (e.target.checked ? constantlyPanelModal[this.state.keys].plainOptions : []);
    constantlyPanelModal[this.state.keys].indeterminate = false;
    constantlyPanelModal[this.state.keys].checkAll = e.target.checked;
    this.informUpdata();

  }
  onChange1 = (onChangeCheckedList) => {
    constantlyPanelModal[this.state.keys].targetCheckedList = onChangeCheckedList;
    constantlyPanelModal[this.state.keys].targetIndeterminate = (!!onChangeCheckedList.length && (onChangeCheckedList.length < constantlyPanelModal[this.state.keys].target.length));
    constantlyPanelModal[this.state.keys].targetCheckAll = (onChangeCheckedList.length === constantlyPanelModal[this.state.keys].target.length);
    this.informUpdata();

  }
  onCheckAllChange1 = (e) => {
    constantlyPanelModal[this.state.keys].targetCheckedList = (e.target.checked ? constantlyPanelModal[this.state.keys].target : []);
    constantlyPanelModal[this.state.keys].targetIndeterminate = false;
    constantlyPanelModal[this.state.keys].targetCheckAll = (e.target.checked);
    this.informUpdata();

  }

  components = (key) => {
    switch (key) {
      case 'table':
        return (
          <CommonLineTable
            activeKeys={this.props.panelBoard}
            queryLineData={constantlyPanelModal[this.state.keys]}
            mapView={this.props.mapView}
            dispatch={this.props.dispatch}
          />
        );
      case 'bar':
        return;
      case 'pie':
        return;
      case 'line':
        return (
          <CommonLine
            activeKeys={this.props.panelBoard}
            onChangeTime={this.onChangeTime}
            onChange={this.onChange}
            onChange1={this.onChange1}
            onCheckAllChange={this.onCheckAllChange}
            onCheckAllChange1={this.onCheckAllChange1}
            queryLineData={constantlyPanelModal[this.state.keys]}
            mapView={this.props.mapView}
            dispatch={this.props.dispatch}
            constantlyConditionCalc={constantlyConditionCalc}
          />
        );
      default:
        return (
          <CommonLine
            activeKeys={this.props.panelBoard}
            onChangeTime={this.onChangeTime}
            onChange={this.onChange}
            onChange1={this.onChange1}
            onCheckAllChange={this.onCheckAllChange}
            onCheckAllChange1={this.onCheckAllChange1}
            queryLineData={constantlyPanelModal[this.state.keys]}
            mapView={this.props.mapView}
            dispatch={this.props.dispatch}
            constantlyConditionCalc={constantlyConditionCalc}
          />
        );
    }
  }
  render() {
    // const { expandKeys, toggleContent } = this.props.panelBoard;
    // return (
    //   <div>
    //     {(expandKeys.indexOf(toggleContent[this.state.keys].name) === -1) ? null : this.components(toggleContent[this.state.keys].type)}
    //   </div>
    // );
    const type = this.props.type;
    return (
      <div>
        {this.components(type)}
      </div>
    );
  }
}
