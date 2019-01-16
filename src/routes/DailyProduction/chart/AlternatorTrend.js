import React, { PureComponent } from 'react';
import { Button, Card } from 'antd';
import moment from 'moment';
import { Chart, Axis, Geom, Tooltip, Legend } from 'bizcharts';
import { connect } from 'dva';
import { textColor, lineColor1, lineColor2, titleColor } from '../color/color';
import { toolTipTheme, axisTextStyle, labelTextStyle } from './unit';
import styles from './index.less';

const { DataSet } = new window.DataSet();
const cotTitle = '进汽量（t/h）';
const loadValueTitle = '发电量（MW）';

const cols = {
  dateFormat: {
    alias: '日期',
    range: [0, 1],
    tickCount: 6,
  },
  value0: {
    alias: '单位： MW',
    range: [0, 1],
    tickCount: 5,
  },
  value1: {
    alias: '单位： t/h',
    range: [0, 1],
    tickCount: 5,
  },
};
const transData = (data, type) => {
  let key;
  let value;
  if (type === 0) {
    key = loadValueTitle;
    value = 'value0';
    for (const item of data) {
      item.dateFormat = moment(item.startDate).format('l');
      item[loadValueTitle] = item.electricityCount;
    }
  } else {
    key = cotTitle;
    value = 'value1';
    for (const item of data) {
      item.dateFormat = moment(item.startDate).format('l');
      item[cotTitle] = item.inGasCount;
    }
  }
  const ds = new DataSet();
  const dv = ds.createView().source(data);
  dv.transform({
    type: 'fold',
    fields: [key], // 展开字段集
    key: 'date', // key字段
    value, // value字段
  });
  return dv;
};

@connect(({ productionDaily, homepage }) => {
  return {
    history: productionDaily.history,
    height: homepage.mapHeight,
  };
})
export default class AlternatorTrend extends PureComponent {
  componentDidMount() {
    const { dispatch, sortIndex, dateTimes } = this.props;
    dispatch({
      type: 'productionDaily/getRptAlternatorHistoryData',
      payload: { sortIndex, dateTimes },
    });
  }
  render() {
    const { history, name, height, dateTimes, click } = this.props;
    console.log('history', history);
    const chartHeight = Number(height) / 2 - 100;
    const newData0 = transData(history, 0);
    const newData1 = transData(history, 1);
    return (
      <div className={styles.warp}>
        <Card title={name}>
          <div className={styles.title}>
            {cols.value0.alias}
          </div>
          <Chart
            padding={['auto', 50, 'auto', 50]}
            height={chartHeight}
            data={newData0}
            scale={cols}
            forceFit
          >
            <Legend />
            <Axis
              name="dateFormat"
              title={{ position: 'end', textStyle: axisTextStyle }}
              label={{ textStyle: axisTextStyle }}
            />
            <Tooltip crosshairs={{ type: 'y' }} {...toolTipTheme} />
            <Axis
              // title={{ position: 'end', textStyle: axisTextStyle }}
              name="value0"
              label={{ textStyle: labelTextStyle, offset: 20 }}
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
              position="dateFormat*value0"
              size={2}
              color={['date', [lineColor1, lineColor2]]}
            />
            <Geom
              type="point"
              position="dateFormat*value0"
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
                  textStyle: axisTextStyle,
              }}
              label={{ textStyle: axisTextStyle }}
            />
            <Tooltip crosshairs={{ type: 'y' }} {...toolTipTheme} />
            <Axis
              title={{ position: 'end',
                  textStyle: labelTextStyle,
              }}
              label={{ textStyle: axisTextStyle }}
              name="value1"
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
              position="dateFormat*value1"
              size={2}
              color={['date', [lineColor1, lineColor2]]}
            />
            <Geom
              type="point"
              position="dateFormat*value1"
              size={4}
              shape="circle"
              color={['date', [lineColor1, lineColor2]]}
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

