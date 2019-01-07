import React, { PureComponent } from 'react';
import { connect } from 'dva';
import AlarmCountingStatistics from './AlarmCountingStatistics';
import AlarmCountingRound from './AlarmCountingRound';
import AlarmCountingList from './AlarmCountingList';
import styles from '../panel.less';
import { groupingByArea } from '../../../../../utils/alarmService';
import { mapConstants } from '../../../../../services/mapConstant';

@connect(({ panelBoard, alarm }) => ({
  panelBoard,
  groupByType: alarm.groupByType,
  view: mapConstants.view,
}))
export default class AlarmCountingPanel extends PureComponent {
  components = (key, typeList) => {
    const { view, titleColor } = this.props;
    switch (key) {
      case 'table':
        return (
          <AlarmCountingList
            list={typeList}
            view={view}
            dispatch={this.props.dispatch}
          />
        );
      case 'bar':
        return (
          <AlarmCountingStatistics
            list={typeList}
            view={view}
            titleColor={titleColor}
            dispatch={this.props.dispatch}
          />
        );
      case 'pie':
        return (
          <AlarmCountingRound
            list={typeList}
            view={view}
            titleColor={titleColor}
            dispatch={this.props.dispatch}
          />
        );
      case 'line':
        return;
      default:
        return (
          <AlarmCountingStatistics
            list={typeList}
            view={view}
            titleColor={titleColor}
            mainMap={this.props.mainMap}
            dispatch={this.props.dispatch}
          />
        );
    }
  };
  render() {
    const { groupByType, param } = this.props;
    const convertData = groupingByArea({ alarms: groupByType[param.alarmType] });
    const list = [];
    for (const prop in convertData) {
      if (Object.prototype.hasOwnProperty.call(convertData, prop)) {
        list.push({ device: prop, count: convertData[prop].length, val: convertData[prop] });
      }
    }
    const { type } = this.props;
    return (
      <div>
        {list.length > 0 ? this.components(type, list) : <div className={styles.noData}>暂无数据</div> }
      </div>
    );
  }
}
