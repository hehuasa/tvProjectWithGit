import React, { PureComponent } from 'react';
import { Table, DatePicker, Form, Row, Col, Button } from 'antd';
import moment from 'moment';
import styles from '../zoomComponents.less';

// const FormItem = Form.Item;
// @Form.create()
export default class VOCSGovernListOneLevel extends PureComponent {
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

  onEntranceGuard = (record) => {
    this.props.dispatch({
      type: 'vocs/stageDoorQuery',
      payload: {
        toggleTable: 'two',
        planName: {
          name: record.planName,
          planId: record.vOCsCheckPlanID,
        },
        // pagination: {
        //   pageNum: 1,
        //   pageSize: 10,
        //   isQuery: true,
        //   fuzzy: false,
        // }
      },
    });
  };


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
    const columns = [{
      title: '装置',
      dataIndex: 'resArea',
      key: 'resArea',
      render: (text, record) => {
        if (record.resArea) {
          return record.resArea.areaName;
        }
      },
    }, {
      title: '检测计划名称',
      dataIndex: 'planName',
      key: 'planName',
      render: (text, record) => {
        return <a onClick={() => this.onEntranceGuard(record)} style={{ color: '#afe0ff', textDecoration: 'none' }}>{text}</a>;
      },
    }, {
      title: '计划类型',
      dataIndex: 'planType',
      key: 'planType',
    }, {
      title: '计划检测点数',
      dataIndex: 'allDays',
      key: 'allDays',
    }, {
      title: '已检测点数',
      dataIndex: 'findDays',
      key: 'findDays',
    }, {
      title: '检测截止日期',
      dataIndex: 'endTime',
      key: 'endTime',
    }, {
      title: '剩余点数',
      dataIndex: 'remDays',
      key: 'remDays',
    }, {
      title: '泄漏点数',
      dataIndex: 'leakDays',
      key: 'leakDays',
    }, {
      title: '泄漏率',
      dataIndex: 'leakDays/findDays',
      key: 'leakDays/findDays',
    }];
    const paginationProps = {
      showQuickJumper: true,
      ...pagination,
    };
    return (
      <div className={styles.regionWarp} >
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
      </div>
    );
  }
}
