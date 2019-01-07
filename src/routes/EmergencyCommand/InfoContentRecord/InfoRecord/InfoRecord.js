import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form, Tabs, Button, Row, Col, Input, Icon, Card, Table } from 'antd';
import EventContent from './EventContent';
import Casualties from './Casualties';
import styles from './InfoRecord.less';
import {emgcIntervalInfo} from "../../../../services/constantlyData";

const { TabPane } = Tabs;
const columns = [{
  title: '发生时间',
  dataIndex: 'occurTime',
  width: '15%',
  render: (val) => {
    if (!val) {
      return '';
    }
    return moment(val).format('YYYY-MM-DD HH:mm:ss');
  },
}, {
  title: '录入人',
  dataIndex: 'userName',
  width: '15%',
}, {
  title: '内容',
  dataIndex: 'recordContent',
  width: '60%',
}];

@connect(({ emergency }) => ({
  emergency,
}))
export default class InfoRecord extends PureComponent {
  componentDidMount() {
    // 查询事件信息记录内容
    this.queryEventInfo();
    // 刷新事件信息记录内容
    emgcIntervalInfo.infoRecord.forEach((item) => {
      clearInterval(item);
    });
    this.intervalID = setInterval(this.queryEventInfo, emgcIntervalInfo.timeSpace);
    emgcIntervalInfo.infoRecord.push(this.intervalID);
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }
  queryEventInfo = () => {
    this.props.dispatch({
      type: 'emergency/queryEventInfo',
      payload: {
        eventID: this.props.emergency.eventId,
      },
    });
  };
  render() {
    return (
      <div style={{ padding: '16px 8px' }} >
        <Card
          bodyStyle={{ padding: 0 }}
          style={{ width: '100%' }}
        >
          <div>
            <Tabs
              defaultActiveKey="1"
              tabPosition="left"
              style={{ height: 230 }}
              className={styles.planInfo}
            >
              <TabPane tab="事件内容" key="1">
                <EventContent />
              </TabPane>
              <TabPane tab="伤亡人数" key="2">
                <Casualties />
              </TabPane>
            </Tabs>
          </div>
        </Card>
        <Table
          columns={columns}
          dataSource={this.props.emergency.infoRecordList}
          rowKey={record => record.eventProcessID}
          style={{ paddingTop: 16 }}
          className={styles.tableStyle}
        />
      </div>
    );
  }
}
// type="card"
