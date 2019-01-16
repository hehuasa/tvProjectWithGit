import React, { PureComponent } from 'react';
import { Button, Card } from 'antd';
import moment from 'moment';
import { Chart, Axis, Geom, Tooltip, Legend } from 'bizcharts';
import { connect } from 'dva';
import { textColor, lineColor1, lineColor2, titleColor } from '../color/color';
import { getDatesData } from './unit';
import styles from './index.less';

const cols = {
  value: {
    alias: '单位： 吨',
    range: [0, 1],
  },
  date: {
    alias: '日期',
    range: [0, 1],
    tickCount: 6,
  },
};
const transData = (data, dateTimes) => {
  const newData = [];
  const array = getDatesData(dateTimes);
  for (const item of array) {
    const item1 = data.find(value => value.startDate === moment(item).valueOf());
    if (item1) {
      newData.push({
        type: '月完成',
        value: item1.monthOver,
        date: item,
      });
    } else {
      newData.push({
        date: item,
      });
    }
  }
  if (data.length > 0) {
    newData.push(
      {
        value: data[0].monthPlan,
        type: '月计划',
        date: array[0],
      },
      {
        value: 0,
        type: '月计划',
        date: array[array.length - 1],
      },
    );
  }
  newData.sort((a, b) => {
    return moment(a.date).valueOf() > moment(b.date).valueOf();
  });
  return newData;
};

@connect(({ productionDaily, homepage }) => {
  return {
    history: productionDaily.history,
    height: homepage.height,
  };
})
export default class Trend extends PureComponent {
  componentDidMount() {
    const { dispatch, sortIndex, dateTimes } = this.props;
    dispatch({
      type: 'productionDaily/getEquipmentProductInfoHistoryData',
      payload: {
        sortIndex,
        dateTimes,
      },
    });
  }
  render() {
    const { history, name, height, click, dateTimes } = this.props;
    const newData = transData(history, dateTimes);
    return (
      <div className={styles.warp}>
        <Card title={name}>
          <Chart
            padding={['auto', 50, 'auto', 'auto']}
            height={height}
            data={newData}
            scale={cols}
            forceFit
          >
            <Legend />
            <Axis
              name="date"
              title={{ position: 'end',
                textStyle: {
                    fontSize: '16',
                    textAlign: 'right',
                    fill: titleColor,
                    rotate: 0,
                },
            }}
            />
            <Tooltip crosshairs={{ type: 'y' }} />
            <Axis
              title={{ position: 'end',
                  textStyle: {
                      fontSize: '16',
                      textAlign: 'right',
                      fill: titleColor,
                      rotate: 0,
                  },
              }}
              name="value"
              line={{
                          lineWidth: 1, // 设置线的宽度
                          stroke: textColor, // 设置线的颜色
                      }}
              grid={{
                          type: 'line', // 网格的类型
                          lineStyle: {
                              lineWidth: 0.1,
                              stroke: '#333', // 网格线的颜色
                          } }}
            />
            <Geom
              type="line"
              position="date*value"
              size={2}
              color={['type', [lineColor1, lineColor2]]}
              // tooltip={['type*date*value', (type, day, value) => {
              //             return {
              //                 // 自定义 tooltip 上显示的 title 显示内容等。
              //                 title: null,
              //                 name: type,
              //                 value: type === '月完成' ? history[0] ? value : history[0].monthPlan : '',
              //             };
              //         }]}
            />
            <Geom
              type="point"
              position="date*value"
              size={4}
              shape="circle"
              color={['type', [lineColor1, lineColor2]]}
              tooltip={null}
            />
          </Chart>
          <div className={styles.footer}>
            <Button onClick={() => click({ startDate: dateTimes })}>关闭</Button>
          </div>
        </Card>
      </div>
    );
  }
}

