import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Scrollbars from 'react-custom-scrollbars';
import { Table, Row, Col, DatePicker } from 'antd';
import Progress from '../../components/Progress/Progress';
import { bgColor, progressColor } from './color/color';
import ResinReportInfoTrend from './chart/ResinReportInfoTrend';
import styles from './index.less';

@connect(({ productionDaily, homepage }) => ({
  resinProduct: productionDaily.resinProduct,
  solidDefects: productionDaily.solidDefects,
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
    // 请求树脂产品
    this.props.dispatch({
      type: 'productionDaily/getResinProduct',
    }).then(() => {
      this.getStartTime(this.props.resinProduct);
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
      type: 'productionDaily/getResinProduct',
      payload: { startDate },
    }).then(() => {
      this.getStartTime(this.props.resinProduct);
    });
  };
  // 点击行
  rawClick = (record) => {
    this.setState({
      showChart: !this.state.showChart,
      sortIndex: record.sortIndex,
      chartName: record.organicProductInfoName,
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
    const renderContent = (value, row) => {
      const obj = {
        children: value || '/',
        props: {},
      };
      return obj;
    };
    const cols = [
      {
        title: '产品名称',
        dataIndex: 'resinName',
        width: 140,
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
        dataIndex: 'factoryStockCount',
        width: 100,
        render: renderContent,
      }, {
        title: '厂内库存率',
        dataIndex: 'facotryStockPre',
        width: 300,
        render: (text) => {
          return {
            children: text === null ?
              '/' : (
                <Row gutter={16}>
                  <Col span={Number(text) > 120 ? 24 : 18}>
                    <Progress percent={Number(text)} bgColor={bgColor} progressColor={progressColor} />
                  </Col>
                  <Col span={Number(text) > 120 ? 24 : 6}>
                    <span>{`${text} %`}</span>
                  </Col>
                </Row>
              ),
          };
        },
      }, {
        title: '日入库',
        dataIndex: 'dayInStock',
        width: 100,
        render: renderContent,
      }, {
        title: '日出厂',
        dataIndex: 'dayOutStock',
        width: 100,
        render: renderContent,
      }, {
        title: '月出厂计划',
        dataIndex: 'monthOutPlan',
        width: 120,
        render: renderContent,
      }, {
        title: '月累计出厂',
        dataIndex: 'monthOutCount',
        width: 120,
        render: renderContent,
      }, {
        title: '月出厂进度',
        dataIndex: 'mouthOutPre',
        width: 300,
        render: (text, record, index) => {
          return {
            children: text === null ?
              '/' : (
                <Row gutter={16}>
                  <Col span={Number(text) > 120 ? 24 : 18}>
                    <Progress percent={Number(text)} bgColor={bgColor} progressColor={progressColor} />
                  </Col>
                  <Col span={Number(text) > 120 ? 24 : 6}>
                    <span style={{ color: text < this.state.timeUsePre ? 'red' : '' }}>{`${text} %`}</span>
                  </Col>
                </Row>
              ),
            // props: {
            //   colSpan: index === this.props.resinProduct.length - 1 ? 0 : 1,
            // },
          };
        },
      },
    ];
    const { showChart, sortIndex, chartName, dateTimes } = this.state;
    return (
      <div className={styles.warp}>
        <div className={styles.title}>
          <div className={styles.left} />
          <div className={styles.text}>{`${this.props.title}（吨）`}</div>
          <div className={styles.left} />
        </div>
        <div className={styles.dataSource}>数据来源: 生产日报导入</div>
        {showChart ? (
          <ResinReportInfoTrend
            click={this.rawClick}
            sortIndex={sortIndex}
            name={chartName}
            dateTimes={dateTimes}
          />
) : (
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
              onRow={(record) => {
              return {
                onClick: () => this.rawClick(record),
              };
            }}
              dataSource={this.props.resinProduct}
              columns={cols}
              rowKey={record => record.organicProductInfoID}
              pagination={false}
              rowClassName={(record, index) => {
                return index % 2 === 0 ? styles.blue : styles.blueRow;
              }}
              scroll={{ x: 1280, y: current === 0 ? 620 : 430 }}
              bordered
            />
          </Scrollbars>
        </div>
)}
      </div>
    );
  }
}
