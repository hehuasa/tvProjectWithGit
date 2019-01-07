import React, { PureComponent } from 'react';
import { Chart, Axis, Tooltip, Geom, Legend } from 'bizcharts';
import { DataSet } from '@antv/data-set';
import Debounce from 'lodash-decorators/debounce';

// import { connect } from 'dva';

// @connect(({ sidebar, alarm }) => ({
//     sidebar, alarm
// }))
export default class WarningtHistogram extends PureComponent {
  render() {
    // 柱形图 
    const data5 = [
      { name: 'London', 'Jan': 18.9, 'Feb': 28.8, 'Mar': 39.3, 'Apr': 81.4, 'May': 47, 'Jun': 20.3, 'Jul': 24, 'Aug': 35.6 },
      { name: 'Berlin', 'Jan': 12.4, 'Feb': 23.2, 'Mar': 34.5, 'Apr': 99.7, 'May': 52.6, 'Jun': 35.5, 'Jul': 37.4, 'Aug': 42.4 },
      { name: 'china', 'Jan': 12.4, 'Feb': 23.2, 'Mar': 34.5, 'Apr': 99.7, 'May': 52.6, 'Jun': 35.5, 'Jul': 37.4, 'Aug': 42.4 },
    ];
    const ds = new DataSet();
    const dv = ds.createView().source(data5);
    dv.transform({
      type: 'fold',
      fields: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'], // 展开字段集
      key: '月份', // key字段
      value: '月均降雨量', // value字段
    });
    return (
      <div>
        <Chart height={400} data={dv} forceFit>
          <Legend />
          <Axis name="月份" />
          <Axis name="月均降雨量" />
          <Tooltip />
          <Geom type='intervalStack' position="月份*月均降雨量" color={['name', ['#ff0000', '#00ff00', '#0000ff']]} />
        </Chart>
      </div>
    )
  }
}
