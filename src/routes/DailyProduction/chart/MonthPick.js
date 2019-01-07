import React, { PureComponent } from 'react';
import { DatePicker } from 'antd';

const { MonthPicker } = DatePicker;

export default class MonthPick extends PureComponent {
  render() {
    return (
      <MonthPicker placeholder="选择月份" />
    );
  }
}
