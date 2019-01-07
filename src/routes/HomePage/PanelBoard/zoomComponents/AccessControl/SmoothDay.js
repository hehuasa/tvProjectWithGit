import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { Chart, Axis, Geom, Tooltip, Legend } from 'bizcharts';
import styles from './index.less';

const { Option } = Select;
const scale = {
  num: {
    type: 'linear',
    min: 0,
    tickCount: 4,
  },
};

export default class SmoothDay extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'accessControl/getCountByDay',
      payload: { days: 7 },
    });
  }
  handleChange = (e) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'accessControl/getCountByDay',
      payload: { days: e },
    });
  };
  render() {
    const { name, countByDay } = this.props;
    return (
      <div className={styles.warp}>
        <h2>{name}</h2>
        <div style={{ overflow: 'hidden'}}>
          <Select defaultValue={7} onChange={this.handleChange} className={styles.select}>
            <Option value={7}>近7日数据</Option>
            <Option value={14}>近14日数据</Option>
            <Option value={30}>近1月数据</Option>
          </Select>
        </div>
        <Chart height={400} data={countByDay} scale={scale} forceFit>
          <Legend />
          <Axis name="day" />
          <Axis name="num"
                grid={{
                  type: 'line', // 网格的类型
                  lineStyle: {
                    stroke: '#333', // 网格线的颜色
                  } }}
          />
          <Tooltip crosshairs={{ type: 'y' }} label={{ formatter: val => `${val}人` }} />
          <Geom type="line" position="day*num" size={2} color="type" />
          <Geom type="point" position="day*num" size={4} shape="circle" color="type" style={{ stroke: '#fff', lineWidth: 1 }} />
        </Chart>
      </div>
    );
  }
}

