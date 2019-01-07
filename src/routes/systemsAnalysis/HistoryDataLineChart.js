

import React, { PureComponent } from 'react';
import { Chart, Axis, Geom, Tooltip, Legend } from 'bizcharts';
import Slider from 'bizcharts-plugin-slider';
import { DataSet } from '@antv/data-set';
import { connect } from 'dva';
import styles from './historyData.less';

const data = [{
  "month": 1528420108759,
  "y453454yyx": 17,
  "vu31e": 72,
}, {
  "month": 1528421908759,
  "y453454yyx": 31,
  "vu31e": 44,
}, {
  "month": 1528423708759,
  "y453454yyx": 47,
  "vu31e": 102,
}, {
  "month": 1528425508759,
  "y453454yyx": 62,
  "vu31e": 29,
}, {
  "month": 1528427308759,
  "y453454yyx": 91,
  "vu31e": 62,
}, {
  "month": 1528429108759,
  "y453454yyx": 46,
  "vu31e": 50,
}, {
  "month": 1528430908759,
  "y453454yyx": 53,
  "vu31e": 59,
}, {
  "month": 1528432708759,
  "y453454yyx": 61,
  "vu31e": 11,
}, {
  "month": 1528434508759,
  "y453454yyx": 63,
  "vu31e": 33,
}, {
  "month": 1528436308759,
  "y453454yyx": 44,
  "vu31e": 100,
}, {
  "month": 1528438108759,
  "y453454yyx": 105,
  "vu31e": 50,
}, {
  "month": 1528439908759,
  "y453454yyx": 90,
  "vu31e": 74,
}, {
  "month": 1528441708759,
  "y453454yyx": 72,
  "vu31e": 45,
}, {
  "month": 1528443508759,
  "y453454yyx": 82,
  "vu31e": 85,
}, {
  "month": 1528445308759,
  "y453454yyx": 32,
  "vu31e": 33,
}, {
  "month": 1528447108759,
  "y453454yyx": 89,
  "vu31e": 89,
}, {
  "month": 1528448908759,
  "y453454yyx": 84,
  "vu31e": 104,
}, {
  "month": 1528450708759,
  "y453454yyx": 105,
  "vu31e": 11,
}, {
  "month": 1528452508759,
  "y453454yyx": 55,
  "vu31e": 88,
}, {
  "month": 1528454308759,
  "y453454yyx": 85,
  "vu31e": 46,
}
];

export default class HistoryDataLineChart extends PureComponent {

  render() {
    const {
      title = '点位',
      height = 400,
      padding = [60, 20, 40, 40],
      borderWidth = 2,
      data = [],
    } = this.props;

    // console.log(JSON.stringify(data))
    const wholeArr = [];
    for (let itemObj of Object.keys(data[0])) {
      if (itemObj !== 'month') {
        wholeArr.push(itemObj)
      }
    }

    data.sort((a, b) => a.month - b.month);

    let max;
    // if (data[0] && data[0].y1 && data[0].y2) {
    //   max = Math.max(
    //     [...data].sort((a, b) => b.y1 - a.y1)[0].y1,
    //     [...data].sort((a, b) => b.y2 - a.y2)[0].y2
    //   );
    // }
    for (let item of wholeArr) {
      const itemMax = [...data].sort((a, b) => b[item] - a[item])[0][item];
      if (itemMax > max) {
        max = itemMax;
      }
    }

    const ds = new DataSet({
      state: {
        start: data[0].month,
        end: data[data.length - 1].month,
      },
    });

    const dv = ds.createView();
    dv
      .source(data)
      .transform({
        type: 'filter',
        callback: obj => {
          const itemObj = obj.month;
          return itemObj <= ds.state.end && itemObj >= ds.state.start;
        },
      })
      .transform({
        type: 'map',
        callback(row) {
          const newRow = { ...row };
          // console.log(2, newRow)
          for (let item of wholeArr) {
            newRow[item] = row[item];
          }
          // newRow[titleMap.y1] = row.y1;
          // newRow[titleMap.y2] = row.y2;
          return newRow;
        },
      })
      .transform({
        type: 'fold',
        fields: wholeArr, // 展开字段集
        key: 'key', // key字段
        value: 'value', // value字段
      });

    const timeScale = {
      type: 'time',
      tickInterval: 60 * 60 * 1000,
      mask: 'YYYY-MM-DD HH:mm:ss',
      range: [0, 1],
    };

    const cols = {
      month: timeScale,
      value: {
        max,
        min: 0,
      },
    };

    const SliderGen = () => (
      <Slider
        padding={[0, padding[1] + 20, 0, padding[3]]}
        width="auto"
        height={26}
        xAxis="month"
        yAxis={wholeArr[0]} // 改
        scales={{ month: timeScale }}
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

    return (

      <div className={styles.timelineChart} style={{ height: height + 30 }}>
        <Chart height={height} padding={padding} data={dv} scale={cols} forceFit>
          <Axis name="month" />
          <Tooltip />
          <Legend name="key" position="top" />
          <Geom type="line" position="month*value" size={borderWidth} color="key" />
        </Chart>
        <div style={{ marginRight: -20 }}>
          <SliderGen />
        </div>
      </div>

    )
  }

}