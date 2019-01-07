import React, { PureComponent } from 'react';

import { Chart, Tooltip, Geom, Legend, Axis } from 'bizcharts';
import DataSet from '@antv/data-set';
import Slider from 'bizcharts-plugin-slider';
// import { connect } from 'dva';

// @connect(({ sidebar, alarm }) => ({
//     sidebar, alarm
// }))
export default class WarningtLine extends PureComponent {
  render() {
    const data1 = [
      { time: '9:11:00', '流量': 40.0 },
      { time: '9:11:05', '流量': 80.0 },
      { time: '9:11:10', '流量': 20.0 },
      { time: '9:11:15', '流量': 80.0 },
      { time: '9:11:20', '流量': 40.0 },
      { time: '9:11:25', '流量': 80.0 },
      { time: '9:11:30', '流量': 40.0 },
      { time: '9:11:35', '流量': 80.0 },
      { time: '9:11:40', '流量': 40.0 },
      { time: '9:11:45', '流量': 90.0 },
      // { time: '9:11:50', '流量': 50.0 },
      // { time: '9:11:55', '流量': 80.0 },
      // { time: '9:12:00', '流量': 30.0 },
      // { time: '9:12:05', '流量': 80.0 },
      // { time: '9:12:10', '流量': 50.0 },
      // { time: '9:12:15', '流量': 80.0 },
      // { time: '9:12:20', '流量': 60.0 },
      // { time: '9:12:25', '流量': 80.0 },
      // { time: '9:12:30', '流量': 60.0 },
      // { time: '9:12:35', '流量': 80.0 },
      // { time: '9:12:40', '流量': 60.0 },
      // { time: '9:12:45', '流量': 80.0 },
      // { time: '9:12:50', '流量': 60.0 },
      // { time: '9:12:55', '流量': 80.0 },
      // { time: '9:13:00', '流量': 40.0 },
      // { time: '9:13:05', '流量': 80.0 },
      // { time: '9:13:10', '流量': 90.0 },
      // { time: '9:13:15', '流量': 80.0 },
      // { time: '9:13:20', '流量': 20.0 },
      // { time: '9:13:25', '流量': 80.0 },
      // { time: '9:13:30', '流量': 50.0 },
      // { time: '9:13:35', '流量': 80.0 },
      // { time: '9:13:40', '流量': 60.0 },
      // { time: '9:13:45', '流量': 80.0 },
      // { time: '9:13:50', '流量': 40.0 },
      // { time: '9:13:55', '流量': 80.0 },
      // { time: '9:14:00', '流量': 60.0 },
    ];
    const cols1 = {
      '流量': { min: 0 },
      'time': { range: [0, 1] }
    };
    const SliderGen1 = () => (
      <Slider
        padding={[0, padding[1] + 20, 0, padding[3]]}
        width="auto"
        height={26}
        xAxis="x"
        yAxis="y1"
        scales={{ x: timeScale }}
        data={data}
        start={ds.state.start}
        end={ds.state.end}
        backgroundChart={{ type: 'line' }}
        onChange={({ startValue, endValue }) => {
          ds.setState('start', startValue);
          ds.setState('end', endValue);
        }}
      />
    );
    let g2Chart;
    return (
      <div style={{ height: 300 }}>
        <Chart height={300} data={data1} scale={cols1} forceFit onGetG2Instance={g2 => {
          g2Chart = g2
        }}
          onPlotClick={ev => {
            var point = {
              x: ev.x,
              y: ev.y
            };
            var items = g2Chart.getTooltipItems(point);
            console.log(items);
          }}
        >
          <Axis name="time" />
          <Axis name="流量" />
          <Tooltip crosshairs={{ type: "y" }} />
          <Geom type="line" position="time*流量" size={2} shape="smooth" />
        </Chart>
      </div>
    );
  }
}
