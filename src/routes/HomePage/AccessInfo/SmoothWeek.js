import React, { PureComponent } from 'react';
import { Chart, Axis, Geom, Tooltip, Legend } from 'bizcharts';
import styles from './index.less';

const textColor = '#c0c0c0';
const lineColor1 = '#6dc3ea';
const lineColor2 = '#00e600';

const scale = {
  num: {
    alias: '今日在场人数',
  },
};

export default class SmoothWeek extends PureComponent {
  componentDidMount() {
  }
  render() {
    const { countByTime, style } = this.props;
    const { height, width } = style;
    const data = countByTime.sort((a, b) => {
      if (a.time > b.time) {
        return 1;
      } else {
        return -1;
      }
    });
    return (
      <div className={styles.chart}>
        <Chart
          height={height - 86}
          data={data}
          width={width - 32}
          scale={scale}
          padding={[20, 24, 100, 44]}
        >
          <Legend />
          <Axis
            name="hour"
            label={{
                  textStyle: {
                    textAlign: 'center', // 文本对齐方向，可取值为： start center end
                    // rotate: 30,
                    fill: textColor,
                  },
                  formatter: (text, item, index) => {
                    if (index % 2 === 0) {
                      return text;
                    } else {
                      return '';
                    }
                  },
                }
                }
          />
          <Axis
            name="num"
            // title={{
            //   offset: 2
            // }}
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
          <Geom type="line" position="hour*num" size={2} color={['type', `${lineColor1}-${lineColor2}`]} />
          <Geom type="point" position="hour*num" size={4} shape="circle" color="type" style={{ stroke: '#fff', lineWidth: 1 }} />
        </Chart>
      </div>
    );
  }
}

