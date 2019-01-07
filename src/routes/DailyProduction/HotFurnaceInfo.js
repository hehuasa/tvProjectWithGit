import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Scrollbars from 'react-custom-scrollbars';
import { Table, DatePicker } from 'antd';
import HotFurnaceInfoTrend from './chart/HotFurnaceInfoTrend';
import styles from './index.less';
import AlternatorTrend from './chart/AlternatorTrend';

@connect(({ productionDaily, homepage }) => ({
  thermoelectricFurnace: productionDaily.thermoelectricFurnace,
  timeUsePre: productionDaily.timeUsePre,
  dynamotor: productionDaily.dynamotor,
  videoFooterHeight: homepage.videoFooterHeight,
}))
export default class HotFurnaceInfo extends PureComponent {
  state = {
    dataSource: [],
    dateTimes: null,
    chartType: '',
    sortIndex: '',
    chartName: '',
  };
  componentDidMount() {
    this.getTimeProcess(moment());
    // 请求热电锅炉运行状况
    this.props.dispatch({
      type: 'productionDaily/getThermoelectricFurnace',
    }).then(() => {
      this.getStartTime(this.props.thermoelectricFurnace);
    });
    // 请求发电机运行状况
    this.props.dispatch({
      type: 'productionDaily/getDynamotor',
    });
  }
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
  // 按时间获取列表信息
  onChange = (date) => {
    const startDate = date.valueOf();
    this.getTimeProcess(startDate);
    // 请求热电锅炉运行状况
    this.props.dispatch({
      type: 'productionDaily/getThermoelectricFurnace',
      payload: { startDate },
    });
    // 请求发电机运行状况
    this.props.dispatch({
      type: 'productionDaily/getDynamotor',
      payload: { startDate },
    });
  };
  // 点击行
  rawClick = (record, type) => {
    this.setState({
      chartType: type,
      sortIndex: record.sortIndex,
      chartName: record.hotFurnaceName || record.alternatorInfoName,
      dateTimes: record.startDate,
    });
  };
  // 获取制表时间
  getStartTime = (dataArr) => {
    if (dataArr && dataArr.length > 0) {
      this.setState({ dateTimes: dataArr[0].startDate });
    }
  };
  render() {
    // click={() => { this.setState({ chartType: '' }); }}
    const { videoFooterHeight } = this.props;
    const { current } = videoFooterHeight;
    const { chartType, sortIndex, chartName, dateTimes } = this.state;
    const cols = [
      {
        title: '炉号',
        dataIndex: 'hotFurnaceName',
        width: '10%',
        render: (text, record) => {
          // return text || '/';
          return (
            text ? (
              <a
                href="#"
                title="点击查看图表"
                className={styles.rawName}
                onClick={() => this.rawClick(record, 'hotFurnace')}
              >{text}
              </a>
            ) : '/'
          );
        },
      }, {
        title: '运行天数',
        dataIndex: 'runDay',
        width: '15%',
        render: (text) => {
          return text || '/';
        },
      }, {
        title: '产汽量(t/h)',
        dataIndex: 'gasCount',
        width: '20%',
        render: (text) => {
          return text || '/';
        },
      }, {
        title: '主汽温度(℃)',
        dataIndex: 'mainTemperature',
        width: '20%',
        render: (text) => {
          return text || '/';
        },
      },
    ];
    const alterCols = [
      {
        title: '发电机名称',
        dataIndex: 'alternatorInfoName',
        width: '15%',
        render: (text, record) => {
          // return text || '/';
          return (
            text ? (
              <a
                href="#"
                title="点击查看图表"
                className={styles.rawName}
                onClick={() => this.rawClick(record, 'dynamotor')}
              >{text}
              </a>
            ) : '/'
          );
        },
      }, {
        title: '运行天数',
        dataIndex: 'runDay',
        width: '20%',
        render: (text) => {
          return text || '/';
        },
      }, {
        title: '进汽量(t/h)',
        dataIndex: 'inGasCount',
        width: '20%',
        render: (text) => {
          return text || '/';
        },
      }, {
        title: '发电量(MW)',
        dataIndex: 'electricityCount',
        width: '20%',
        render: (text) => {
          return text || '/';
        },
      },
    ];
    return (
      <div className={styles.warp}>
        <div className={styles.title}>
          <div className={styles.left} />
          <div className={styles.text}>热电锅炉及发电机运行状况</div>
          <div className={styles.left} />
        </div>
        <div className={styles.dataSource}>数据来源: 生产日报导入</div>
        { chartType === 'hotFurnace' ?
          <HotFurnaceInfoTrend click={this.rawClick} sortIndex={sortIndex} name={chartName} dateTimes={dateTimes} /> :
          chartType === 'dynamotor' ? <AlternatorTrend click={this.rawClick} sortIndex={sortIndex} name={chartName} dateTimes={dateTimes} /> : (
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
                <div>
                  <div className={styles.leftTable}>
                    <Table
                      dataSource={this.props.thermoelectricFurnace}
                      columns={cols}
                      rowKey={record => record.hotFurnaceInfoID}
                      pagination={false}
                      rowClassName={(record, index) => {
                  return index % 2 === 0 ? styles.blue : styles.blueRow;
                }}
                      scroll={{ y: current === 0 ? 620 : 430 }}
                      bordered
                    />
                  </div>
                  <div className={styles.rightTable}>
                    <Table
                      dataSource={this.props.dynamotor}
                      columns={alterCols}
                      rowKey={record => record.alternatorInfoID}
                      pagination={false}
                      rowClassName={(record, index) => {
                  return index % 2 === 0 ? styles.blue : styles.blueRow;
                }}
                      scroll={{ y: current === 0 ? 620 : 430 }}
                      bordered
                    />
                  </div>
                </div>
              </Scrollbars>
            </div>
)}
      </div>
    );
  }
}
