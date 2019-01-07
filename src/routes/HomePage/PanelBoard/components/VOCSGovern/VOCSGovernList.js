import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import { searchByAttr } from '../../../../../utils/mapService';
import { mapConstants } from '../../../../../services/mapConstant';
import styles from '../panel.less';

const { view } = mapConstants;

@connect(({ vocs }) => ({
  vocs,
}))
class VOCSGovernList extends PureComponent {
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

  handleClick = (record) => {
    searchByAttr({ searchText: record.resArea.gISCode, searchFields: ['ObjCode'] }).then(
      (res) => {
        if (res.length > 0) {
          view.goTo({ center: res[0].feature.geometry, scale: 7000 }).then(() => {
            this.props.dispatch({
              type: 'resourceTree/selectByGISCode',
              payload: { pageNum: 1, pageSize: 1, isQuery: true, fuzzy: false, gISCode: record.resArea.gISCode },
            })
          });
        }
      }
    );
  };

  render() {
    const { pagination } = this.props.vocs;
    // const paginationProps = {
    //   ...pagination,
    // };

    const columns = [{
      title: '装置',
      dataIndex: 'areaName',
      key: 'areaName',
      render: (text, row) => {
        if(row.resArea ){
           return <a onClick={() => this.handleClick(row)} style={{ color: '#004cff', textDecoration: 'none' }}>{row.resArea.areaName}</a>;
        }
      }
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
    return (
      <Table
        columns={columns}
        bordered
        dataSource={this.props.vocs.list}
        scroll={{ x: 450 }}
        rowKey={record => record.vOCsCheckPlanID}
        onRow={(record) => {
          return {
            // onClick: () => this.handleClick(record), // 点击行
          };
        }}
        pagination={pagination}
        loading={this.state.loading}
        onChange={this.handleTableChange}
      />
    );
  }
}

export default VOCSGovernList;

