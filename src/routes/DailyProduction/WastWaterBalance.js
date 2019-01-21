import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Scrollbars from 'react-custom-scrollbars';
import moment from 'moment';
import { Table, DatePicker } from 'antd';
import Waterfall from './chart/Waterfall';
import styles from './index.less';

const render = (value) => {
  return value === null ? '/' : value.value;
};
const cols = [
  { title: '空分', dataIndex: 'air', width: 80, render },
  { title: '污水处理', dataIndex: 'wasteWaterDeal', width: 100, render },
  { title: '乙烯装置', dataIndex: 'ethylene', width: 100, render },
  { title: '裂解汽油加氢', dataIndex: 'pyrolysis', width: 120, render },
  { title: 'C5', dataIndex: 'carbon', width: 80, render },
  { title: '原料中间罐区', dataIndex: 'rawMaterial', width: 120, render },
  { title: 'EO/EG', dataIndex: 'eoeg', width: 100, render },
  { title: '丁二烯', dataIndex: 'butadiene', width: 80, render },
  { title: '芳烃抽提', dataIndex: 'aromatics', width: 100, render },
  { title: 'MTBE/丁烯-1', dataIndex: 'mtbe', width: 120, render },
  { title: 'HDPE', dataIndex: 'hdpe', width: 80, render },
  { title: 'LLDPE', dataIndex: 'lldpe', width: 80, render },
  { title: 'STPP', dataIndex: 'stpp', width: 80, render },
  { title: 'JPP', dataIndex: 'jpp', width: 80, render },
  { title: '产品罐区', dataIndex: 'product', width: 100, render },
  { title: '鲁华', dataIndex: 'luhua', width: 80, render },
  { title: '平衡差量', dataIndex: 'balance', width: 100, render },
];
@connect(({ productionDaily, loading, homepage }) => ({
  wasteWater: productionDaily.wasteWater,
  timeUsePre: productionDaily.timeUsePre,
  videoFooterHeight: homepage.videoFooterHeight,
  loading,
}))
export default class WastWaterBalance extends PureComponent {
  state = {
    dataSource: [],
    scrollX: 1600,
    showChart: false,
    record: {},
    dateTimes: null,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    this.getTimeProcess(moment());
    // 请求动力消耗
    dispatch({
      type: 'productionDaily/getWasteWater',
    }).then(() => {
      this.dealData(this.props.wasteWater);
      this.getStartTime(this.props.wasteWater);
    });
  }
  // 获取制表时间
  getStartTime = (dataArr) => {
    if (dataArr.sewage && dataArr.sewage.length > 0) {
      this.setState({ dateTimes: dataArr.sewage[0].startDate });
    }
  };
  // 处理表格数据
  dealData = (data) => {
    if (!data.sewage.length > 0) {
      this.setState({
        dataSource: [],
      });
      return;
    }
    const rawName = [
      { property: '生产污水', value: 'sewage' },
      { property: '低压氮气', value: 'lowNitrogen' },
    ];
    const arr = [];
    rawName.forEach((item, index) => {
      const temp = data[item.value];
      const obj = {};
      for (const [index1, value] of cols.entries()) {
        obj[value.dataIndex] = {};
        obj[value.dataIndex].title = value.title;
        obj[value.dataIndex].value = temp[index1].collectValue;
      }
      obj.key = index;
      obj.itemName = item.property;
      arr.push(obj);
    });
    this.setState({
      dataSource: arr,
    });
  };
  // 获取时间进度
  getTimeProcess = (startDate) => {
    this.props.dispatch({
      type: 'productionDaily/getTimeUsePre',
      payload: { startDate },
    }).then(() => {
      this.setState({
        timeUsePre: this.props.timeUsePre,
      });
    });
  };
  // 按时间获取蒸汽平衡消耗信息
  onChange = (date) => {
    const startDate = date.valueOf();
    this.getTimeProcess(startDate);
    // 按时间请求蒸汽平衡数据
    this.props.dispatch({
      type: 'productionDaily/getWasteWater',
      payload: { startDate },
    }).then(() => {
      this.dealData(this.props.wasteWater);
      this.getStartTime(this.props.wasteWater);
    });
  };
  // 点击行
  rawClick = (record, a, b) => {
    this.setState({
      showChart: !this.state.showChart,
      record,
    });
  };
  render() {
    const { videoFooterHeight } = this.props;
    const { current } = videoFooterHeight;
    const { showChart, record, dataSource, dateTimes } = this.state;
    const { title } = this.props;
    return (
      <div className={styles.warp}>
        <div className={styles.title}>
          <div className={styles.left} />
          <div className={styles.text}>全厂生产污水（吨/时）和氮气（立方米/时）平衡表</div>
          <div className={styles.left} />
        </div>
        <div className={styles.dataSource}>数据来源: 生产日报导入</div>
        {showChart ? <Waterfall title={title} data={record} click={this.rawClick} name={record.itemName} /> : (
          <div className={styles.content}>
            <div className={styles.timeArea}>
              <div className={styles.timeProcess}>时间进度: {this.state.timeUsePre ? `${this.state.timeUsePre} %` : '' }</div>
              <div className={styles.creatTime}>制表时间:
                <DatePicker
                  defaultValue={dateTimes ? moment(dateTimes) : moment()}
                  allowClear={false}
                  onChange={this.onChange}
                />
              </div>
            </div>
            <Scrollbars className={styles.scrollbarsStyle}>
              <Table
                onRow={(item, b, c) => {
                  return {
                    onClick: () => this.rawClick(item, b, c),
                  };
                }}
                dataSource={dataSource}
                columns={cols}
                pagination={false}
                loading={this.props.loading.global}
                scroll={{ x: this.state.scrollX, y: current === 0 ? 620 : 430 }}
                rowClassName={(record, index) => {
                  return index % 2 === 0 ? styles.blue : styles.blueRow;
                }}
                bordered
              />
            </Scrollbars>
          </div>
        )}
      </div>

    );
  }
}
