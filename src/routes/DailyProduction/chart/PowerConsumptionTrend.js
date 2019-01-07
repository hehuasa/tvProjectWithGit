import React, { PureComponent } from 'react';
import { Button, Card } from 'antd';
import moment from 'moment';
import { Chart, Axis, Geom, Tooltip, Legend } from 'bizcharts';
import { connect } from 'dva';
import { DataSet } from '@antv/data-set';
import { textColor, lineColor1, lineColor2 } from '../color/color';
// import MonthPick from './MonthPick';

import styles from './index.less';

const cols = {
  date: {
    alias: '日期',
    range: [0, 1],
    tickCount: 6,
  },
};
const transData = (data, itemName) => {
  for (const item of data) {
    item.dateFormat = moment(item.startDate).format('l');
    item[itemName] = item.collectValue;
    data.sort((a, b) => {
      return a.startDate - b.startDate;
    });
  }
  const ds = new DataSet();
  const dv = ds.createView().source(data);
  dv.transform({
    type: 'fold',
    fields: [itemName], // 展开字段集
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
export default class RawInfoTrend extends PureComponent {
  componentDidMount() {
    const { dispatch, itemName, dateTimes } = this.props;
    dispatch({
      type: 'productionDaily/getRptPowerConsumeHistoryData',
      payload: {
        itemName,
        dateTimes,
      },
    });
  }
  render() {
    const { history, name, itemName } = this.props;
    const newData0 = transData(history, itemName);
    return (
      <div className={styles.warp}>
        <Card title={name}>
          <Chart
            padding={['auto', 50, 'auto', 'auto']}
            data={newData0}
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
                  fill: '#fff',
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
                  fill: '#fff',
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
            <Button
              onClick={() => { this.props.click({ startDate: this.props.dateTimes }); }}
            >关闭
            </Button>
          </div>
        </Card>
      </div>
    );
  }
}

