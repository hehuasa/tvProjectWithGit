import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Scrollbars from 'react-custom-scrollbars';
import { Table, Select, DatePicker } from 'antd';
import styles from './index.less';

@connect(({ productionDaily, homepage }) => ({
  solidDefects: productionDaily.solidDefects,
  timeUsePre: productionDaily.timeUsePre,
  videoFooterHeight: homepage.videoFooterHeight,
}))
export default class DissociationInfo extends PureComponent {
  state = {
    dateTimes: null,
    showChart: false,
  };
  componentDidMount() {
    this.getTimeProcess(moment());
    this.props.dispatch({
      type: 'productionDaily/getSolidDefects',
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
    this.props.dispatch({
      type: 'productionDaily/getSolidDefects',
      payload: { startDate },
    });
  };
  // 点击行
  rawClick = (record) => {
    console.log(123, record);
  };
  render() {
    const { videoFooterHeight } = this.props;
    const { current } = videoFooterHeight;
    const cols = [
      {
        title: '信息',
        dataIndex: 'info',
        width: '100%',
        render: (text) => {
          return text || '/';
        },
      },
    ];
    return (
      <div className={styles.warp}>
        <div className={styles.title}>
          <div className={styles.left} />
          <div className={styles.text}>{`${this.props.title}`}</div>
          <div className={styles.left} />
        </div>
        <div className={styles.dataSource}>数据来源: 生产日报导入</div>
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
              dataSource={this.props.solidDefects}
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
      </div>
    );
  }
}
