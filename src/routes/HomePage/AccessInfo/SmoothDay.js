import React, { PureComponent } from 'react';
import { Chart, Axis, Geom, Tooltip, Legend } from 'bizcharts';
import styles from './index.less';

const textColor = '#c0c0c0';
const lineColor1 = '#6dc3ea';
const lineColor2 = '#00e600';

export default class SmoothDay extends PureComponent {
  render() {
    const { countByDay, style } = this.props;
    const { height, width } = style;
    return (
      <div className={styles.chart}>
        <Chart height={height - 86} data={countByDay} width={width - 32} padding={[20, 40, 100, 60]}>
          <Legend />
          <Axis
            name="day"
            label={{
                  textStyle: {
                    textAlign: 'center', // 文本对齐方向，可取值为： start center end
                    // rotate: 30,
                    fill: textColor,
                  } }
                }
          />
          <Axis
            name="num"
            line={{
                  lineWidth: 1, // 设置线的宽度
                  stroke: textColor, // 设置线的颜色
                }}
            label={{
                  textStyle: {
                  textAlign: 'end', // 文本对齐方向，可取值为： start center end
                  fill: textColor,
                } }
                }
            grid={{
                  type: 'line', // 网格的类型
                  hideLastLine: true,
                  lineStyle: {
                    lineWidth: 0.1,
                    stroke: textColor, // 网格线的颜色
                    lineDash: [4, 4],
                  } }}
          />
          <Tooltip crosshairs={{ type: 'y' }} label={{ formatter: val => `${val}人` }} />
          <Geom type="line" position="day*num" size={2} color={['type', `${lineColor1}-${lineColor2}`]} />
          <Geom type="point" position="day*num" size={4} shape="circle" color="type" style={{ stroke: '#fff', lineWidth: 1 }} />
        </Chart>
      </div>
    );
  }
}

