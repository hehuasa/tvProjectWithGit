import React, { PureComponent } from 'react';
import { Table } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import styles from '../panel.less';

// 罐名称、罐存液位、罐存率
const columns = [{
  title: '装置界区域',
  dataIndex: 'areaName',
  key: 'areaName',
}, {
  title: '检测计划名称',
  dataIndex: 'planName',
  key: 'planName',
}, {
  title: '检测点数',
  dataIndex: 'findDays',
  key: 'findDays',
}, {
  title: '检测截止日期',
  dataIndex: 'endTime',
  key: 'endTime',
},];

@connect(({ vocs }) => ({
  vocs,
}))
class LiquidPot extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'vocs/areaQuery',
      payload: {
        pageNum: 1,
        pageSize: 10,
        isQuery: true,
        fuzzy: false,
      },
    });
  }

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      isQuery: true,
      fuzzy: false,
    };
    dispatch({
      type: 'vocs/areaQuery',
      payload: params,
    });
  }
  render() {
    const { pagination } = this.props.vocs;
    const paginationProps = {
      ...pagination,
    };
    return (
      <Table
        columns={columns}
        bordered
        dataSource={this.props.vocs.list}
        scroll={{ x: 450 }}
        rowKey={record => record.vOCsCheckPlanID}
        onRow={(record) => {
          return {
            // onClick: () => console.log(record), // 点击行
          };
        }}
        pagination={paginationProps}
        loading={this.state.loading}
        onChange={this.handleTableChange}
      />
    );
  }
}

export default LiquidPot;

