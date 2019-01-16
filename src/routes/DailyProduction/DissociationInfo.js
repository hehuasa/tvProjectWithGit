import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Scrollbars from 'react-custom-scrollbars';
import { Table, DatePicker } from 'antd';
import styles from './index.less';
import DissociationInfoTrend from './chart/DissociationInfoTrend';

@connect(({ productionDaily, homepage }) => ({
  crackingFurnace: productionDaily.crackingFurnace,
  timeUsePre: productionDaily.timeUsePre,
  videoFooterHeight: homepage.videoFooterHeight,
}))
export default class DissociationInfo extends PureComponent {
  state={
    dateTimes: null,
    showChart: false,
    sortIndex: '',
    chartName: '',
  };
  componentDidMount() {
    this.getTimeProcess(moment());
    this.props.dispatch({
      type: 'productionDaily/getCrackingFurnace',
    }).then(() => {
      this.getStartTime(this.props.crackingFurnace);
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
    this.setState({
      dateTimes: startDate,
    });
    this.props.dispatch({
      type: 'productionDaily/getCrackingFurnace',
      payload: { startDate },
    });
  };
  // 点击行
  rawClick = (record) => {
    this.setState({
      showChart: !this.state.showChart,
      sortIndex: record.sortIndex,
      chartName: record.dissociationName,
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
        title: '炉号',
        dataIndex: 'dissociationName',
        width: '10%',
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
        title: '原料',
        dataIndex: 'rawName',
        width: '20%',
        render: (text) => {
          return text || '/';
        },
      }, {
        title: '天数',
        dataIndex: 'dayCount',
        width: '10%',
        render: (text) => {
          return text || '/';
        },
      }, {
        title: 'COT(℃)',
        dataIndex: 'cot',
        width: '20%',
        render: (text) => {
          return text || '/';
        },
      }, {
        title: '负荷(t/h)',
        dataIndex: 'loadValue',
        render: (text) => {
          return text || '/';
        },
      },
    ];
    const { showChart, sortIndex, chartName, dateTimes } = this.state;
    return (
      <div className={styles.warp}>
        <div className={styles.title}>
          <div className={styles.left} />
          <div className={styles.text}>{`${this.props.title}`}</div>
          <div className={styles.left} />
        </div>
        <div className={styles.dataSource}>数据来源: 生产日报导入</div>
        { showChart ? <DissociationInfoTrend click={this.rawClick} sortIndex={sortIndex} name={chartName} dateTimes={dateTimes} /> : (
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
                dataSource={this.props.crackingFurnace}
                columns={cols}
                rowKey={record => record.issociationInfoID}
                rowClassName={(record, index) => {
                return index % 2 === 0 ? styles.blue : styles.blueRow;
              }}
                pagination={false}
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
