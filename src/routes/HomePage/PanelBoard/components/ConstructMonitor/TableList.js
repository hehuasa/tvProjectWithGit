import React, { PureComponent } from 'react';
import { Table } from 'antd';

const columns = [{
  title: '作业流水号',
  dataIndex: 'serialNumber',
  key: 'serialNumber',
},
{
  title: '作业部门',
  dataIndex: 'org',
  key: 'org',
  render: (value) => {
    return value.orgName;
  },
}, {
  title: '作业类型',
  dataIndex: 'jobType',
  key: 'jobType',
},
];

const switchData = (data) => {
  const array = [];
  for (const item of data) {
    for (const item1 of item.data) {
      item1.org = item.org;
      array.push(item1);
    }
  }
  return array;
};
export default class TableList extends PureComponent {
  componentDidMount() {
  }
  render() {
    const { data } = this.props;
    const newData = switchData(data);
    return (
      <Table size="small" dataSource={newData} columns={columns} bordered pagination={{ pageSize: 5 }} />
    );
  }
}

