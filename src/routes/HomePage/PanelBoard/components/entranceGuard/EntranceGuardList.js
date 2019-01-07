import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
import { searchByAttr } from '../../../../../utils/mapService';

const columns = [{
  title: '门禁区域',
  dataIndex: 'areaName',
  key: 'areaName',
  fixed: 'left',
}, {
  title: '进入区域人次',
  dataIndex: 'inNum',
  key: 'inNum',
}, {
  title: '离开区域人次',
  dataIndex: 'outNum',
  key: 'outNum',
}];

const updatatime = 3000;
let time = null;
class EntranceGuardListContent extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // time = setInterval(() => {
      this.props.dispatch({
        type: 'entranceGuard/allAreaQuery',
      });
    // }, updatatime)
  }
  componentWillUnmount() {
    clearInterval(time);
  }
  handleClick = (record) => {
    const { mapView } = this.props;
    searchByAttr({ searchText: record.gISCode, searchFields: ['ObjCode'] }).then(
      (res) => {
        if (res.length > 0) {
          mapView.goTo({ center: res[0].feature.geometry, scale: 7000 }).then(() => {
            this.props.dispatch({
              type: 'resourceTree/selectByGISCode',
              payload: { pageNum: 1, pageSize: 1, isQuery: true, fuzzy: false, gISCode: record.gISCode },
            });
          });
        }
      }
    );
  };
  render() {
    return (
      <Table
        columns={columns}
        bordered
        dataSource={this.props.entranceGuard.allAreaList}
        size="small"
        scroll={{ x: 450 }}
        pagination={{ pageSize: 5 }}
        rowKey={record => record.areaId}
        onRow={(record) => {
          return {
            onClick: () => this.handleClick(record), // 点击行
          };
        }}
      />
    );
  }
}

const EntranceGuardList = connect(
  ({ entranceGuard, map }) => ({ entranceGuard, mainMap: map.mainMap })
)(EntranceGuardListContent);

export default EntranceGuardList;
