import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Scrollbars from 'react-custom-scrollbars';
import { Table, Select, Row, Col, DatePicker } from 'antd';
import Progress from '../../components/Progress/Progress';
import RawInfoTrend from './chart/RawInfoTrend';
import { bgColor, progressColor } from './color/color';
import styles from './index.less';

const { Option } = Select;
@connect(({ productionDaily, homepage }) => ({
  rawMaterial: productionDaily.rawMaterial,
  timeUsePre: productionDaily.timeUsePre,
  videoFooterHeight: homepage.videoFooterHeight,
}))
export default class DissociationInfo extends PureComponent {
  state = {
    dateTimes: null,
    showChart: false,
    sortIndex: 0,
    chartName: '',
  };
  componentDidMount() {
    this.getTimeProcess(moment());
    this.props.dispatch({
      type: 'productionDaily/getRawMaterial',
    }).then(() => {
      this.getStartTime(this.props.rawMaterial);
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
  // 按时间获取装置信息
  onChange = (date) => {
    const startDate = date.valueOf();
    this.getTimeProcess(startDate);
    this.setState({
      dateTimes: startDate,
    });
    this.props.dispatch({
      type: 'productionDaily/getRawMaterial',
      payload: { startDate },
    });
  };
  // 点击行
  rawClick = (record) => {
    this.setState({
      showChart: !this.state.showChart,
      sortIndex: record.sortIndex,
      chartName: record.rawName,
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
    const { videoFooterHeight } = this.props;
    const { current } = videoFooterHeight;
    const cols = [
      {
        title: '原料及中间产品',
        dataIndex: 'rawName',
        width: '20%',
        render: (text, record) => {
          return text ? (
            <a
              href="#"
              title="点击查看图表"
              className={styles.rawName}
              onClick={() => this.rawClick(record)}
            >{text}
            </a>
          ) : '/';
        },
      }, {
        title: '罐存',
        dataIndex: 'trunckCount',
        width: '20%',
        render: (text) => {
          return text || '/';
        },
      }, {
        title: '罐存率',
        dataIndex: 'trunckCountPre',
        width: '60%',
        render: (text, record) => {
          return text === null ?
            '/' : (
              <Row gutter={16}>
                <Col span={Number(text) > 120 ? 24 : 20}>
                  <Progress percent={Number(text)} bgColor={bgColor} progressColor={progressColor} />
                </Col>
                <Col span={Number(text) > 120 ? 24 : 4}>
                  <span>{`${text} %`}</span>
                </Col>
              </Row>
            );
        },
      },
    ];
    const { showChart, sortIndex, chartName, dateTimes } = this.state;
    return (
      <div className={styles.warp}>
        <div className={styles.title}>
          <div className={styles.left} />
          <div className={styles.text}>{`${this.props.title}(吨）`}</div>
          <div className={styles.left} />
        </div>
        <div className={styles.dataSource}>数据来源: 生产日报导入</div>
        { showChart ? <RawInfoTrend click={this.rawClick} sortIndex={sortIndex} name={chartName} dateTimes={dateTimes} /> : (
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
                dataSource={this.props.rawMaterial}
                columns={cols}
                rowKey={record => record.rawInfoID}
                pagination={false}
                rowClassName={(record, index) => {
              return index % 2 === 0 ? styles.blue : styles.blueRow;
            }}
                scroll={{ y: current === 0 ? 620 : 430 }}
                bordered
              />
            </Scrollbars>
          </div>
)}
      </div>
    );
  }
}
