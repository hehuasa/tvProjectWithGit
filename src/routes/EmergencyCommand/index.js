import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Steps, Icon, Button } from 'antd';
import EmergencyProcess from './EmergencyProcess/index';
import InfoJudgment from './InfoJudgment/index';
import EmergencyStart from './EmergencyStart/index';
import EarlyWarning from './EarlyWarning/index';
import EmergencyDisposal from './EmergencyDisposal/index';
import EmergencyStop from './EmergencyStop/index';
import InfoContentRecord from './InfoContentRecord/InfoContentRecord';
import { emgcIntervalInfo } from '../../services/constantlyData';

@connect(({ emergency, user, panelBoard }) => ({
  current: emergency.current,
  viewNode: emergency.viewNode,
  eventID: emergency.eventId,
  currentUser: user.currentUser,
  panelBoard,
}))
export default class EmergencyCommand extends PureComponent {
  componentWillMount() {
    this.getFunctionMenus();
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'user/fetchCurrent',
    });
    // 请求事件信息
    this.getEventInfo();
    this.intervalID = setInterval(this.getEventInfo, emgcIntervalInfo.timeSpace);
    emgcIntervalInfo.intervalIDs.push(this.intervalID);
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
    const closePanel = (keys) => {
      const { expandKeys, activeKeys } = this.props.panelBoard;
      const expandNames = expandKeys.filter(item => item !== keys);
      const activeNames = activeKeys.filter(item => item.keys !== keys);
      this.props.dispatch({
        type: 'panelBoard/queryList',
        payload: { expandKeys: expandNames, activeKeys: activeNames },
      });
    };
    closePanel('EventInfo');
  }
  // 请求事件信息
  getEventInfo = () => {
    this.props.dispatch({
      type: 'emergency/queryEventFeatures',
      payload: {
        eventID: this.props.eventID,
      },
    });
  };
  nodeClick = (viewNode, viewNodeType) => {
    this.props.dispatch({
      type: 'emergency/saveViewNode',
      payload: viewNode,
    });
    this.props.dispatch({
      type: 'emergency/saveViewNodeType',
      payload: viewNodeType,
    });
  };
  // 获取页面功能权限
  getFunctionMenus = () => {
    const { dispatch, functionInfo } = this.props;
    dispatch({
      type: 'emergency/getProcessFuncMenus',
      payload: { parentCode: functionInfo.functionCode },
    });
  };
  render() {
    const { current, viewNode } = this.props;
    return (
      <div>
        <EmergencyProcess onClick={this.nodeClick} current={current} viewNode={viewNode} />
        {viewNode === 1 ? <InfoContentRecord /> : null}
        {viewNode === 2 ? <InfoJudgment /> : null}
        {viewNode === 3 ? <EarlyWarning /> : null}
        {viewNode === 4 ? <EmergencyStart /> : null}
        {viewNode === 5 ? <EmergencyDisposal /> : null}
        {viewNode === 6 ? <EmergencyStop /> : null}
      </div>
    );
  }
}
