import React, { Component } from 'react';
import AlarmIcon from './AlarmIcon';
import EventIcon from './EventIcon';

export default class MapIcon extends Component {
  render() {
    const { mapIconData, resourceInfo, infoPops, dispatch } = this.props;
    const { alarmIconData, eventIconData } = mapIconData;
    return (
      <div>
        <AlarmIcon alarmIconData={alarmIconData} resourceInfo={resourceInfo} infoPops={infoPops} dispatch={dispatch} />
        <EventIcon eventIconData={eventIconData} resourceInfo={resourceInfo} infoPops={infoPops} dispatch={dispatch} />
      </div>

    );
  }
}
