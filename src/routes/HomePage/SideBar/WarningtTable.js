import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';

const columns = [{
  title: '序号',
  dataIndex: 'sort',
  key: 'sort',
  render: (text, record, index) => {
    return text = index + 1;
    // return <div>{index + 1}</div>
  },
}, {
  title: '报警类型',
  dataIndex: 'alarmType',
  key: 'alarmType',
}, {
  title: '报警点位编号',
  dataIndex: 'alarmDes',
  key: 'alarmDes',
}, {
  title: '报警点位名称',
  dataIndex: 'alarmPoint',
  key: 'alarmPoint',
}, {
  title: '首报时间',
  dataIndex: 'startTime',
  key: 'startTime',
}];

@connect(({ sidebar, alarm }) => ({
  sidebar, alarm,
}))
class WarningtTable extends PureComponent {
  componentDidMount() {

  }

  rowSelection = () => {
    console.log(111);
  }


  render() {
    const { alarm } = this.props;
    return (
      <Table
        columns={columns}
        bordered
        dataSource={alarm.list}
        size="small"
        scroll={{ x: 450 }}
        pagination={{ pageSize: 5 }}
        rowKey={record => record.alarmCode}
        onRow={(record) => {
          return {
            onClick: () => { console.log(record); }, // 点击行
          };
        }}

      />

    );
  }
}

export default WarningtTable;

