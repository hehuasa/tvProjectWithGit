import React, {PureComponent} from 'react';
import { Table ,Progress} from 'antd';

// In the fifth row, other columns are merged into first column
// by setting it's colSpan to be 0
const renderContent = (value, row, index) => {
  const obj = {
    children: value,
    props: {},
  };
  return obj;
};

const columns = [{
  title: '类别',
  dataIndex: 'type',
  fixed:'left',
  width:50,
  render: (value, row, index) => {
    const obj = {
      children: value,
      props: {},
    };
    switch (index){
      case 0: obj.props.rowSpan = 4;break;
      case 4: obj.props.rowSpan = 4;break;
      default:obj.props.rowSpan = 0;
    }
    return obj;
  },
}, {
  title: '物料',
  dataIndex: 'materiel',
  render: renderContent,
}, {
  title: '月计划',
  dataIndex: 'monthPlan',
  render: renderContent
}, {
  title: '日完成',
  dataIndex: 'dayFinish',
  render: renderContent,
}, {
  title: '月完成',
  dataIndex: 'monthFinish',
  render: renderContent,
},{
  title: '收率',
  dataIndex: 'yield',
  render: renderContent,
},{
  title: '月进度',
  width:70,
  dataIndex: 'monthProcess',
  fixed:'right',
  render: (value, row, index) => {
    const obj = {
      children:  <Progress percent={value} size="small" />,
      props: {},
    };
    return obj;
  },
}
];

export default class ProductTable extends PureComponent{
  render(){
    return (
      <Table columns={columns}  bordered={true} dataSource={this.props.data} style={{margin:'-4px -16px -16px',padding:0,textAlgin:"center"}} size="small" scroll={{ x: 450 }} pagination={false} />
    )
  }
}
