import React, { PureComponent } from 'react';
import AlarmEventInfo from './AlarmEventInfo';
import AddTemplate from '../AddTemplate/index';

export default class AlarmInfo extends PureComponent {
  componentDidMount() {
    const { alarmId } = this.props.alarmInfo;
    if (alarmId) {
      this.props.dispatch({
        type: 'alarmDeal/getAlarmConten',
        payload: {
          alarmId,
        },
      });
    }
  }

  render() {
    const { form, alarmDeal, isEvent } = this.props;
    return (
      <div>
        <AlarmEventInfo isEvent={isEvent} alarmInfoConten={alarmDeal.alarmInfoConten} form={form} />
        { isEvent ? <AddTemplate casualtiesData={alarmDeal.alarmInfoConten.casualtys} form={form} /> : null}
      </div>
    );
  }
}
