import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Scrollbars from 'react-custom-scrollbars';
import moment from 'moment';
import { Table, DatePicker } from 'antd';
import Waterfall from './chart/Waterfall';
import styles from './index.less';

const render = (value) => {
  return value ? <span>{value.value}</span> : '/';
};
const cols = [
  { title: '蒸汽等级', dataIndex: 'itemName', width: 110, render },
  { title: <div className={styles.center}><span>热电联产</span><br /><span> 外送量</span></div>, name: '热电联产外送量', dataIndex: 'hotElectricity', width: 100, render },
  { title: <div className={styles.center}><span>减温减压器</span><br /><span> (转换输入)</span></div>, name: '减温减压器(转换输入)', dataIndex: 'desuperheatInput', width: 100, render },
  { title: <div className={styles.center}><span>减温减压器</span><br /><span> (转换输出)</span></div>, name: '减温减压器(转换输出)', dataIndex: 'desuperheatOut', width: 100, render },
  { title: <div className={styles.center}><span>乙烯及裂解</span><br /><span> 汽油加氢</span></div>, name: '乙烯及裂解汽油加氢', dataIndex: 'ethylene', width: 100, render },
  { title: 'C5', dataIndex: 'carbon', width: 80, render },
  { title: 'EO/EG', dataIndex: 'eoeg', width: 100, render },
  { title: '丁二烯', dataIndex: 'butadiene', width: 100, render },
  { title: '芳烃抽提', dataIndex: 'aromatics', width: 120, render },
  { title: 'MTBE/丁烯-1', dataIndex: 'mtbe', width: 160, render },
  { title: 'HDPE', dataIndex: 'hdpe', width: 100, render },
  { title: 'LLDPE', dataIndex: 'lldpe', width: 100, render },
  { title: 'STPP/JPP', dataIndex: 'stpp', width: 120, render },
  { title: '一循/三循', dataIndex: 'recycle', width: 120, render },
  { title: '空分', dataIndex: 'air', width: 80, render },
  { title: '鲁华', dataIndex: 'luhua', width: 80, render },
  { title: '其他', dataIndex: 'other', width: 80, render },
  { title: '平衡差量', dataIndex: 'balance', width: 100, render },
];
@connect(({ productionDaily, loading, homepage }) => ({
  steamBalance: productionDaily.steamBalance,
  timeUsePre: productionDaily.timeUsePre,
  videoFooterHeight: homepage.videoFooterHeight,
  loading,
}))
export default class SteamBalance extends PureComponent {
  state = {
    dataSource: [],
    scrollX: 2080,
    showChart: false,
    record: {},
    dateTimes: null,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    this.getTimeProcess(moment());
    // 请求动力消耗
    dispatch({
      type: 'productionDaily/getSteamBalance',
    }).then(() => {
      this.dealData(this.props.steamBalance);
      this.getStartTime(this.props.steamBalance.superPressure || []);
    });
  }
  // 获取制表时间
  getStartTime = (dataArr) => {
    if (dataArr && dataArr.length > 0) {
      this.setState({ dateTimes: dataArr[0].startDate });
    }
  };
  // 处理表格数据
  dealData = (data) => {
    if (!data.superPressure.length > 0) {
      this.setState({
        dataSource: [],
      });
      return;
    }
    const rawName = [
      { property: '超高压蒸汽', value: 'superPressure' },
      { property: '高压蒸汽', value: 'highPressure' },
      { property: '中压蒸汽', value: 'mediumPressure' },
      { property: '低压蒸汽', value: 'lowPressure' },
    ];
    const arr = [];
    const dataArr = cols.slice(1, cols.length - 1);
    rawName.forEach((item, index) => {
      const obj = {};
      const temp = data[item.value];
      for (const [index1, value] of dataArr.entries()) {
        obj[value.dataIndex] = {};
        obj[value.dataIndex].title = value.name || value.title;
        obj[value.dataIndex].value = temp[index1] ? temp[index1].collectValue : '';
      }
      obj.key = index;
      obj.itemName = { value: item.property };
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
      type: 'productionDaily/getSteamBalance',
      payload: { startDate },
    }).then(() => {
      this.dealData(this.props.steamBalance);
      this.getStartTime(this.props.steamBalance.superPressure || []);
    });
  };
  // 点击行
  rawClick = (record) => {
    this.setState({
      showChart: !this.state.showChart,
      record,
    });
  };
  render() {
    const { videoFooterHeight } = this.props;
    const { current } = videoFooterHeight;
    const { showChart, record } = this.state;
    const { title } = this.props;
    return (
      <div className={styles.warp}>
        <div className={styles.title}>
          <div className={styles.left} />
          <div className={styles.text}>全厂蒸汽平衡表（吨/时）</div>
          <div className={styles.left} />
        </div>
        <div className={styles.dataSource}>数据来源: 生产日报导入</div>
        {showChart ? <Waterfall title={title} data={record} click={this.rawClick} name={record.itemName} /> : (
          <div className={styles.content}>
            <div className={styles.timeArea}>
              <div className={styles.timeProcess}>时间进度: {this.state.timeUsePre ? `${this.state.timeUsePre} %` : '' }</div>
              <div className={styles.creatTime}>制表时间:
                <DatePicker
                  defaultValue={this.state.dateTimes ? moment(this.state.dateTimes) : moment()}
                  allowClear={false}
                  onChange={this.onChange}
                />
              </div>
            </div>
            <Scrollbars className={styles.scrollbarsStyle}>
              <Table
                onRow={(item) => {
                return {
                  onClick: () => this.rawClick(item),
                };
              }}
                dataSource={this.state.dataSource}
                columns={cols}
                pagination={false}
                scroll={{ x: this.state.scrollX, y: current === 0 ? 620 : 430 }}
                rowClassName={(_, index) => {
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
