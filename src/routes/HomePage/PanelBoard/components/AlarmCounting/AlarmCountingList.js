import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from '../panel.less';
import { searchByAttr } from '../../../../../utils/mapService';

const columns = [{
  title: '装置名称',
  dataIndex: 'device',
  key: 'device',
}, {
  title: '报警数量',
  dataIndex: 'count',
  key: 'count',
}];
export default class AlarmCountingList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick = (record) => {
    const { view } = this.props;
    searchByAttr({ searchText: record.val[0].areaGisCode, searchFields: ['ObjCode'] }).then(
      (res) => {
        if (res.length > 0) {
          view.goTo({
            extent: res[0].feature.geometry.extent,
          }).then(() => {
            this.props.dispatch({
              type: 'resourceTree/selectByGISCode',
              payload: { pageNum: 1, pageSize: 1, isQuery: true, fuzzy: false, gISCode: record.val[0].areaGisCode },
            });
          });
        }
      }
    );
  };
  render() {
    const { list } = this.props;
    return (
      <Table
        columns={columns}
        rowClassName={styles.cursorStyle}
        bordered
        dataSource={list}
        size="small"
        // scroll={{ x: 700 }}
        pagination={{ pageSize: 5 }}
        rowKey={record => record.alarmCode}
        onRow={(record) => {
          return {
            onClick: () => this.handleClick(record), // 点击行
          };
        }}
      />

    );
  }
}
