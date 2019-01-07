import React, { PureComponent } from 'react';
import { Card, Divider, Icon, Carousel } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import styles from './eventInfo.less';
import { emgcIntervalInfo } from '../../../../../services/constantlyData';
import { formatDuring } from '../../../../../utils/utils';

@connect(({ alarmDeal, emergency, homepage }) => ({
  alarmDeal,
  emergency,
  serverTime: homepage.serverTime,
}))
export default class EventInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      continueTime: null,
    };
  }
  componentDidMount() {
    const { eventInfoReport } = this.props.emergency;
    if (eventInfoReport.eventStatu !== -1 && eventInfoReport.eventStatu !== -2) {
      this.time = setInterval(() => {
        if (Object.keys(this.props.emergency.eventInfoReport).length !== 0) {
          this.getNewTime();
        }
      }, 1000);
      // 应急终止时清除 如果终止关闭事件信息窗则不需要这么做
      emgcIntervalInfo.intervalIDs.push(this.time);
    }
  }
  componentWillUnmount() {
    clearInterval(this.time);
  }

  getNewTime = () => {
    const { eventInfoReport } = this.props.emergency;
    const { serverTime } = this.props;
    const continueTime = formatDuring(serverTime, eventInfoReport.eventTime);
    const para = { ...eventInfoReport, continueTime };
    this.props.dispatch({
      type: 'emergency/continueTime',
      payload: para,
    });
  };
  getContinueTime = (eventInfoReport) => {
    if (eventInfoReport.eventStatu !== -1 && eventInfoReport.eventStatu !== -2) {
      return eventInfoReport.continueTime;
    } else if (eventInfoReport.eventStatu === -1 && eventInfoReport.emgcEndTime) {
      return formatDuring(eventInfoReport.emgcEndTime, eventInfoReport.eventTime);
    } else if (eventInfoReport.eventStatu === -3 && eventInfoReport.emgcCloseTime) {
      return formatDuring(eventInfoReport.emgcCloseTime, eventInfoReport.eventTime);
    }
  }
  render() {
    const { eventInfoReport } = this.props.emergency;
    return (
      <div className={styles.eventInfo}>
        <Card style={{ border: 0 }} bodyStyle={{ padding: '24px 8px' }}>
          <p className={styles.eventTitle}>{eventInfoReport.eventName}</p>
          <p className={styles.responseTitle}>响应时长：<span className={styles.responseTitleColor}>{this.getContinueTime(eventInfoReport)}</span></p>
          <p className={styles.incidentTitle}>事发时间：{eventInfoReport.eventTime ? moment(eventInfoReport.eventTime).format('YYYY-MM-DD HH:mm:ss') : null}</p>
          <p className={styles.incidentTitle}>事件级别：{eventInfoReport.emgcLevelName}</p>
          <p className={styles.incidentTitle}><Icon type="environment" style={{ margin: '0 3px', color: '#8080f1' }} />{eventInfoReport.eventPlace}</p>
          <div style={{ paddingLeft: 16 }}>
            {
              (eventInfoReport.injured || eventInfoReport.death) ?
                (
                  <div>
                    <em>伤{eventInfoReport.injured}人</em>
                    <em>死{eventInfoReport.death}人</em>
                  </div>
                ) :
                  <em>无伤亡人数</em>
            }
          </div>
          <Divider style={{ margin: '16px 0' }} />
          <div className={styles.carouselBox}>
            {
              this.props.emergency.infoRecordList.length < 4 ?
                (
                  this.props.emergency.infoRecordList.map((item, index) => (
                    <div key={`eventInfo${index}`} >{item.recordTime ? moment(item.recordTime).format('YYYY-MM-DD HH:mm:ss') : null}{item.recordContent}</div>
                  ))
                ) :
                (
                  <Carousel autoplay={this.props.emergency.infoRecordList.length > 2} vertical dots={false} >
                    {
                      this.props.emergency.infoRecordList.map((item, index) => (
                        <div key={`eventInfo${index}`} >{item.recordTime ? moment(item.recordTime).format('YYYY-MM-DD HH:mm:ss') : null}{item.recordContent}</div>
                      ))
                    }
                  </Carousel>
                )
            }

          </div>
        </Card>
      </div >
    );
  }
}

