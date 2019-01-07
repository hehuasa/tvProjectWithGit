import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Row, Col, Button } from 'antd';
import DashBord from '../DashBord/index';
import styles from './index.less';

const mapStateToProps = ({ resourceTree }) => {
  return {
    resourceTree,
  };
};
@connect(({ resourceTree }) => ({
  resourceTree,
}))
class Production extends PureComponent {
   columns = [
     { title: '',
       dataIndex: 'type',
       width: '16%',
       render: (value, row, index) => {
         const obj = {
           children: value,
           props: {},
         };
         if (index === 0) {
           obj.props.rowSpan = 4;
         }
         // These two are merged into above cell
         if (index > 0 && index < 4) {
           obj.props.rowSpan = 0;
         }
         if (index === 4) {
           obj.props.rowSpan = 4;
         }
         if (index > 4) {
           obj.props.rowSpan = 0;
         }
         return obj;
       } },
     { title: '物料名称', dataIndex: 'name', width: '21%' },
     { title: '物料来源', dataIndex: 'source', width: '21%' },
     { title: '物料进量', dataIndex: 'input', width: '21%' },
     { title: '物料流速', dataIndex: 'fide', width: '21%' },
   ];
   data = [
     { key: '1', type: '投入', name: '裂解汽油', source: '中间罐', input: '1624', fide: '10kg/秒' },
     { key: '2', type: '投入', name: '裂解汽油', source: '中间罐', input: '1624', fide: '10kg/秒' },
     { key: '3', type: '投入', name: '裂解汽油', source: '中间罐', input: '1624', fide: '10kg/秒' },
     { key: '4', type: '投入', name: '裂解汽油', source: '中间罐', input: '1624', fide: '10kg/秒' },
     { key: '5', type: '产出', name: '裂解汽油', source: '中间罐', input: '1624', fide: '10kg/秒' },
     { key: '6', type: '产出', name: '裂解汽油', source: '中间罐', input: '1624', fide: '10kg/秒' },
     { key: '7', type: '产出', name: '裂解汽油', source: '中间罐', input: '1624', fide: '10kg/秒' },
     { key: '8', type: '产出', name: '裂解汽油', source: '中间罐', input: '1624', fide: '10kg/秒' },
   ];
  handleClick = () => {
    this.props.dispatch({
      type: 'resourceTree/saveCtrlResourceType',
      payload: '',
    });
  }
  render() {
    const { resourceInfo } = this.props.resourceTree;
    return (
      <div className={styles.resourceInfo}>
        <div className={styles.header}>
          <div className={styles.name}>{resourceInfo.resourceCode}</div>
          <div className={styles.btn}>
            <Button type="primary" size="small" onClick={this.handleClick}> X </Button>
          </div>
        </div>
        <Table columns={this.columns} dataSource={this.data} pagination={{ pageSize: 10 }} scroll={{ y: 400 }} size="small" bordered />
      </div>);
  }
}
export default connect(mapStateToProps)(Production);
