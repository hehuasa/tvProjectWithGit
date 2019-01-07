import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { columnsList, dataSourceList } from '../../../../../utils/Panel';
import { searchByAttr } from "../../../../../utils/mapService";

class CommonLineTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  handleClick = (record) => {
    const gISCode = record.position.slice(record.position.lastIndexOf('&') + 1);
    const { mapView } = this.props;
    searchByAttr({ searchText: gISCode, searchFields: ['ObjCode'] }).then(
      (res) => {
        if (res.length > 0) {
          mapView.goTo({ center: res[0].feature.geometry, scale: 7000 }).then(() => {
            this.props.dispatch({
              type: 'resourceTree/selectByGISCode',
              payload: { pageNum: 1, pageSize: 1, isQuery: true, fuzzy: false, gISCode },
            });
          });
        }
      }
    );
  };
  render() {
    let { queryLineData } = this.props;
    if (!queryLineData) { queryLineData = {}; }
    const columns = columnsList({ combustibleGas: queryLineData.lineRealData });
    const sourceData = dataSourceList({ combustibleGas: queryLineData.lineRealData });
    return (
      <Table
        columns={columns}
        bordered
        dataSource={sourceData}
        size="small"
        scroll={{ x: 450 }}
        pagination={{ pageSize: 5 }}
        rowKey={record => record.key}
        onRow={(record) => {
          return {
            onClick: () => this.handleClick(record), // 点击行
          };
        }}
      />
    );
  }
}

export default CommonLineTable;
