import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Scrollbars from 'react-custom-scrollbars';
import { Table, DatePicker } from 'antd';
import moment from 'moment';
import styles from './index.less';
import PowerConsumptionTrend from './chart/PowerConsumptionTrend';

@connect(({ productionDaily, homepage }) => ({
  powerConsumption: productionDaily.powerConsumption,
  recycledWater: productionDaily.recycledWater,
  timeUsePre: productionDaily.timeUsePre,
  videoFooterHeight: homepage.videoFooterHeight,
}))
export default class GasBalance extends PureComponent {
  state = {
    powerConsumption: [],
    recycledWater: [],
    scrollX: 0,
    showChart: false,
    dateTimes: null,
    itemName: '',
    chartName: '',
  };
  componentDidMount() {
    const { dispatch } = this.props;
    this.getTimeProcess(moment());
    // 请求动力消耗
    dispatch({
      type: 'productionDaily/getPowerConsumption',
    }).then(() => {
      this.dealPowerData(this.props.powerConsumption);
      this.getTime(this.props.powerConsumption[0] || {});
    });
    // 请求循环水
    dispatch({
      type: 'productionDaily/getRecycledWater',
    }).then(() => {
      this.dealWaterData(this.props.recycledWater);
    });
  }
  // 将后台传的动力消耗数据处理为表格需要的数据格式
  dealPowerData = (data) => {
    if (!data.length > 0) {
      this.setState({
        powerConsumption: arr,
      });
      return;
    }
    const arr = [];
    const rawName = ['用电量', '发电量', '外购电量', '天然气', '用煤', '卸煤', '煤库存'];
    rawName.forEach((title, index) => {
      const temp = data.filter(item => item.proRptPowerConsumeItem.itemName === title);
      const useObj = temp[0] || {};
      let mouthObj = {};
      if (title === '煤库存') {
        const obj = data.filter(item => item.proRptPowerConsumeItem.itemName === '煤库存率')[0] || {};
        mouthObj.unit = obj.collectValue ? `${(obj.collectValue * 100).toFixed(1)} %` : '/';
        mouthObj.collectValue = obj.itemName;
        mouthObj.key = index;
      } else {
        mouthObj = temp[1] || {};
      }
      arr.push({
        itemName: title,
        useCount: useObj.collectValue,
        useUnit: useObj.unit,
        mouthCount: mouthObj.collectValue,
        mouthUnit: mouthObj.unit,
        key: index,
      });
    });
    this.setState({
      powerConsumption: arr,
    });
  };
  // 处理循环水的数据
  dealWaterData = (data) => {
    if (!data.length > 0) {
      this.setState({
        recycledWater: [],
      });
      return;
    }
    const arr = [];
    const rawName = ['一循', '二循', '三循', '污水装置'];
    rawName.forEach((title, index) => {
      const temp = data.filter(item => item.proRptPowerConsumeItem.itemName === title);
      arr.push({
        itemName: title,
        useCount: temp[0] ? temp[0].collectValue : '',
        ph: temp[1] ? temp[1].collectValue : '',
        turbidity: temp[2] ? temp[2].collectValue : '',
        concentration: temp[3] ? temp[3].collectValue : '',
        alkali: temp[4] ? temp[4].collectValue : '',
        calcium: temp[5] ? temp[5].collectValue : '',
        molybdate: temp[6] ? temp[6].collectValue : '',
        key: index,
      });
    });
    this.setState({
      recycledWater: arr,
    });
  };
  // 获取默认时间
  getTime = (data) => {
    this.setState({
      dateTimes: data.startDate,
    });
  };
  // 点击事件
  rawClick = (record) => {
    this.setState({
      showChart: !this.state.showChart,
      itemName: record.itemName,
      chartName: record.itemName,
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
  // 按时间获取动力消耗信息
  onChange = (date) => {
    const startDate = date.valueOf();
    this.getTimeProcess(startDate);
    this.setState({
      dateTimes: startDate,
    });
    // 按时间请求动力消耗数据
    this.props.dispatch({
      type: 'productionDaily/getPowerConsumption',
      payload: { startDate },
    }).then(() => {
      this.dealPowerData(this.props.powerConsumption);
      this.getTime(this.props.powerConsumption[0] || {});
    });
    // 按时间获取水循环数据
    this.props.dispatch({
      type: 'productionDaily/getRecycledWater',
      payload: { startDate },
    }).then(() => {
      this.dealWaterData(this.props.recycledWater);
    });
  };
  render() {
    const { videoFooterHeight } = this.props;
    const { current } = videoFooterHeight;
    const { showChart, itemName, chartName, dateTimes } = this.state;
    const { title } = this.props;
    const renderContent = (value, width) => {
      const obj = {
        children: <div dangerouslySetInnerHTML={{ __html: value }} />,
        props: {},
      };
      obj.props.width = width;
      return obj;
    };
    const cols = [
      {
        title: '项目',
        dataIndex: 'itemName',
        width: '24%',
        render: (text, record) => {
          return (
            text ? (
              <a
                href="#"
                title="点击查看图表"
                className={styles.rawName}
                onClick={() => this.rawClick(record)}
              >{text}
              </a>
            ) : '/'
          );
        },
      }, {
        title: '用量',
        dataIndex: 'useCount',
        colSpan: 2,
        width: '24%',
        // render: value => renderContent(value),
      }, {
        title: '单位',
        colSpan: 0,
        dataIndex: 'useUnit',
        render: value => renderContent(value, '14%'),
      }, {
        title: '月累计',
        dataIndex: 'mouthCount',
        colSpan: 2,
        width: '24%',
        // render: (value) => renderContent(value),
      }, {
        title: '单位',
        colSpan: 0,
        dataIndex: 'mouthUnit',
        render: (value) => renderContent(value, '14%'),
      },
    ];
    const cycleCols = [
      {
        title: '项目',
        dataIndex: 'itemName',
        width: '10%',
      },
      {
        title: '用量(吨/时)',
        dataIndex: 'useCount',
        width: '14%',
      }, {
        title: 'PH值(7.2-9.0)',
        dataIndex: 'ph',
        width: '12%',
      }, {
        title: '浊度(≤10)',
        dataIndex: 'turbidity',
        width: '12%',
      }, {
        title: '浓缩倍数(≥4)',
        dataIndex: 'concentration',
        width: '14%',
      }, {
        title: '碱浓度(100-450)',
        dataIndex: 'alkali',
        width: '12%',
      }, {
        title: '钙硬度(<700)',
        dataIndex: 'calcium',
        width: '12%',
      }, {
        title: '钼酸根(0.8-1.5)',
        dataIndex: 'molybdate',
        width: '14%',
      },
    ];
    return (
      <div className={styles.warp}>
        <div className={styles.title}>
          <div className={styles.left} />
          <div className={styles.text}>{this.props.title}</div>
          <div className={styles.left} />
        </div>
        <div className={styles.dataSource}>数据来源: 生产日报导入</div>
        {showChart ? <PowerConsumptionTrend title={title} itemName={itemName} click={this.rawClick} name={chartName} dateTimes={dateTimes} /> : (
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
            <Scrollbars>
              <Table
                dataSource={this.state.powerConsumption}
                columns={cols}
                pagination={false}
                scroll={{ x: this.state.scrollX }}
                rowClassName={(record, index) => {
                  return index % 2 === 0 ? styles.blue : styles.blueRow;
                }}
                bordered
              />
              <div style={{ marginTop: -1 }}>
                <Table
                  dataSource={this.state.recycledWater}
                  columns={cycleCols}
                  pagination={false}
                  rowClassName={(record, index) => {
                  return index % 2 === 0 ? styles.blue : styles.blueRow;
                }}
                  scroll={{ y: current === 0 ? 620 : 430 }}
                  bordered
                />
              </div>
            </Scrollbars>
          </div>
)}
      </div>

    );
  }
}
