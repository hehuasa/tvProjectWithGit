import React, { PureComponent } from 'react';
import { connect } from 'dva';
import AlarmCountingStatistics from './AlarmCountingStatistics';
import AlarmCountingRound from './AlarmCountingRound';


@connect(({ panelBoard, alarm, map }) => ({
  panelBoard,
  groupByType: alarm.groupByType,
  mainMap: map.mainMap,
  view: map.mapView,
  popupScale: map.popupScale,
}))
export default class AlarmCounting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
    };
  }
  components = (key) => {
    switch (key) {
      case 'table':
        return;
      case 'bar':
        return (
          <AlarmCountingStatistics
            alarmType={this.props.param.alarmType}
            groupByType={this.props.groupByType}
            mainMap={this.props.mainMap}
            view={this.props.view}
            scale={this.props.popupScale}
            dispatch={this.props.dispatch}
          />
        );
      case 'pie':
        return (
          <AlarmCountingRound
            alarmType={this.props.param.alarmType}
            groupByType={this.props.groupByType}
            mainMap={this.props.mainMap}
            view={this.props.view}
            scale={this.props.popupScale}
            dispatch={this.props.dispatch}
          />
        );
      case 'line':
        return;
      default:
        return (
          <AlarmCountingStatistics
            alarmType={this.props.param.alarmType}
            groupByType={this.props.groupByType}
            mainMap={this.props.mainMap}
            view={this.props.view}
            scale={this.props.popupScale}
            dispatch={this.props.dispatch}
          />
        );
    }
  }
  render() {
    const { toggleContent, expandKeys } = this.props.panelBoard;
    return (
      <div>
        {(expandKeys.indexOf(toggleContent[this.state.name].name) === -1) ? null : this.components(toggleContent[this.state.name].type)}
      </div>
    );
  }
}
