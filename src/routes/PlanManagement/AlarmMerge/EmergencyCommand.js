import React, { PureComponent } from 'react';
import { Form, Table, Row, Col, Input, Button, Modal } from 'antd';
import moment from 'moment';
import styles from './alarmMerge.less';

const columns = [{
  title: '事件名称',
  dataIndex: 'eventName',
  width: 200,
},
{
  title: '涉事部门',
  dataIndex: 'organization',
  width: 200,
  render: (val) => {
    if (val) {
      return val.orgnizationName;
    }
  },
}, {
  title: '涉事设备',
  dataIndex: 'resResourceInfo',
  width: 200,
  render: (val) => {
    if (val) {
      return val.resourceName;
    }
  },
}, {
  title: '报警人',
  dataIndex: 'alarmPerson',
  width: 200,
}, {
  title: '报警电话',
  dataIndex: 'telPhone',
  width: 200,
  // render: (val) => {
  // if (!val) {
  //   return '';
  // }
  // return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>;
  // },
}, {
  title: '人员编号',
  dataIndex: 'personCode',
  width: 200,
}, {
  title: '警情摘要',
  dataIndex: 'alarmDes',
  width: 200,
}, {
  title: '事生原因',
  dataIndex: 'incidentReason',
  width: 200,
}, {
  title: '报警方式',
  dataIndex: 'alarmWay',
  width: 200,
}, {
  title: '事发部门',
  dataIndex: 'accidentPostion',
  width: 200,
}, {
  title: '事件类型',
  dataIndex: 'eventType',
  width: 200,
}, {
  title: '是否演练',
  dataIndex: 'isDrill',
  width: 200,
}, {
  title: '事件状态',
  dataIndex: 'eventStatu',
  width: 200,
}, {
  title: '受伤人数',
  dataIndex: 'injured',
  width: 200,
}, {
  title: '死亡人数',
  dataIndex: 'death',
  width: 200,
}, {
  title: '失踪人数',
  dataIndex: 'disappear',
  width: 200,
}, {
  title: '事发位置',
  dataIndex: 'eventPlace',
  width: 200,
}, {
  title: '报警现状',
  dataIndex: 'alarmStatuInfo',
  width: 200,
}, {
  title: '探测设备',
  dataIndex: 'probeResourceID',
  width: 200,
}];

export default class EmergencyCommand extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  onhandleTableChange = (pagination, filtersArg, sorter) => {
    // const params = {
    //   pageNum: pagination.current,
    //   pageSize: pagination.pageSize,
    //   alarmEvenInfoVO: {
    //     eventStatu: 0
    //   },
    // };
    this.props.dispatch({
      type: 'emergency/undoneEventList',
      // payload: params,
    });
  }

  render() {
    const { title, visible, onHandleOk, onHandleCancel, eventSelection, emergency } = this.props;
    // onOk={onHandleOk}

    return (
      <Modal
        title={title}
        visible={visible}
        onCancel={onHandleCancel}
        destroyOnClose
        width="60%"
        okText="归并确定"
        bodyStyle={{ maxHeight: 600 }}
        onOk={onHandleOk}
      >
        <div className={styles.eventTable}>
          <Table
            scroll={{ x: 2000, y: 320 }}
            columns={columns}
            dataSource={emergency.undoneEventList}
            rowSelection={eventSelection}
            rowKey={record => record.eventID}
          />
        </div>
      </Modal>
    );
  }
}
// pagination={emergency.undoneEventPagination}
