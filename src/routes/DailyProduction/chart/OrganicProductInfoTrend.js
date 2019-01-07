import React, { PureComponent } from 'react';
import { Button, Card } from 'antd';
import moment from 'moment';
import { Chart, Axis, Geom, Tooltip, Legend } from 'bizcharts';
import { connect } from 'dva';
import { DataSet } from '@antv/data-set';
import { textColor, lineColor1, lineColor2, titleColor } from '../color/color';
// import MonthPick from './MonthPick';

import styles from './index.less';

const monthOutCountTitle = '出厂量';
const trunkCountTitle = '罐存';

const cols = {
  dateFormat: {
    alias: '日期',
    range: [0, 1],
    tickCount: 6,
  },
  value: {
    alias: '单位：吨',
    range: [0, 1],
  },
};
const transData = (data, type) => {
  let key;
  if (type === 0) {
    key = trunkCountTitle;
    for (const item of data) {
      item.dateFormat = moment(item.startDate).format('l');
      item[trunkCountTitle] = item.trunkCount;
      data.sort((a, b) => {
        return a.startDate - b.startDate;
      });
    }
  } else {
    key = monthOutCountTitle;
    for (const item of data) {
      item.dateFormat = moment(item.startDate).format('l');
      item[monthOutCountTitle] = item.monthOutCount;
      data.sort((a, b) => {
        return a.startDate - b.startDate;
      });
    }
  }
  const ds = new DataSet();
  const dv = ds.createView().source(data);
  dv.transform({
    type: 'fold',
    fields: [key], // 展开字段集
    key: 'date', // key字段
    value: 'value', // value字段
  });
  return dv;
};

@connect(({ productionDaily, homepage }) => {
  return {
    history: productionDaily.history,
    height: homepage.mapHeight,
  };
})
export default class OrganicProductInfoTrend extends PureComponent {

  componentDidMount() {
    const { dispatch, sortIndex, dateTimes } = this.props;
    dispatch({
      type: 'productionDaily/getOrganicProductHistoryData',
      payload: {
        sortIndex,
        dateTimes,
      },
    });
  }
  render() {
    const { history, name, height } = this.props;
    const chartHeight = Number(height) / 2 - 100;
    const newData0 = transData(history, 0);
    const newData1 = transData(history, 1);
    return (
      <div className={styles.warp}>
        <Card title={name}>
          <Chart
            padding={['auto', 50, 'auto', 'auto']}
            height={chartHeight}
            data={newData0}
            scale={cols}
            forceFit
          >
            <Legend />
            <Axis
              name="dateFormat"
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
              position="dateFormat*value"
              size={2}
              color={['date', [lineColor1, lineColor2]]}
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
              position="dateFormat*value"
              size={4}
              shape="circle"
              color={['date', [lineColor1, lineColor2]]}
              tooltip={null}
            />
          </Chart>
          <Chart
            padding={['auto', 50, 'auto', 'auto']}
            height={chartHeight}
            data={newData1}
            scale={cols}
            forceFit
          >
            <Legend />
            <Axis
              name="dateFormat"
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
              position="dateFormat*value"
              size={2}
              color={['date', [lineColor1, lineColor2]]}
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
              position="dateFormat*value"
              size={4}
              shape="circle"
              color={['date', [lineColor1, lineColor2]]}
              tooltip={null}
            />
          </Chart>
          <div className={styles.footer}>
            <Button onClick={() => { this.props.click({ startDate: this.props.dateTimes }); }}>关闭</Button>
          </div>
        </Card>
      </div>
    );
  }
}

