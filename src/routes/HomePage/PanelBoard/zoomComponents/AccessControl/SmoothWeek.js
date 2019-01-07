import React, { PureComponent } from 'react';
// import { DataSet } from '@antv/data-set';
import { Chart, Axis, Geom, Tooltip, Legend } from 'bizcharts';
import styles from './index.less';

const cols = {
  num: {
    type: 'linear',
    min: 0,
    tickCount: 3,
  },
};

export default class SmoothWeek extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'accessControl/getCountByTime',
    });
  }
  render() {
    const { name, countByTime } = this.props;
    return (
      <div className={styles.warp}>
        <h2>{name}</h2>
        <Chart
          height={400}
          data={countByTime}
          scale={cols}
          forceFit
        >
          <Legend />
          <Axis name="time" />
          <Axis
            name="num"
            grid={{
                  type: 'line', // 网格的类型
                  lineStyle: {
                    stroke: '#333', // 网格线的颜色
                  } }}
          />
          <Tooltip crosshairs={{ type: 'y' }} label={{ formatter: val => `${val}人` }} />
          <Geom type="line" position="time*num" size={2} color="type" />
          <Geom type="point" position="time*num" size={4} shape="circle" color="type" style={{ stroke: '#fff', lineWidth: 1 }} />
        </Chart>
      </div>
    );
  }
}

