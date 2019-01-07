import React, { PureComponent } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach((column) => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: this.props.selectedRows,
      needTotalList,
    };
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      this.setState({
        selectedRowKeys: [],
        needTotalList,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let needTotalList = [...this.state.needTotalList];
    needTotalList = needTotalList.map((item) => {
      return {
        ...item,
        total: selectedRows.reduce((sum, val) => {
          return sum + parseFloat(val[item.dataIndex], 10);
        }, 0),
      };
    });

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows, selectedRowKeys);
    }

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };
  changeRowHeight = (record, rowkey) => {
    // 动态同步固定列的行高
    const { rowKey } = this.props;
    const leftWarp = document.getElementById(rowKey);
    // const leftWarp = this.table.getElementsByClassName('ant-table-scroll')[0];
    const leftTbody = leftWarp.getElementsByClassName('ant-table-tbody')[0];
    const rightWarp = document.getElementsByClassName('ant-table-fixed-right')[0];
    if (!rightWarp) {
      return false;
    }
    const rightTbody = rightWarp.getElementsByClassName('ant-table-tbody')[0];
    let leftTr; let rightTr;
    if (leftTr) {
      for (const item of leftTbody.childNodes) {
        if (Number(item.dataset.rowKey) === Number(record[rowkey])) {
          leftTr = item;
        }
      }
    }
    if (rightTr) {
      for (const item of rightTbody.childNodes) {
        if (Number(item.dataset.rowKey) === Number(record[rowkey])) {
          rightTr = item;
        }
      }
      rightTr.style.height = `${leftTr.clientHeight}px`;
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }
  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const { data: { data, pagination }, loading, columns, rowKey, scroll, checkedble, components } = this.props;
    for (const item of columns) {
      item.onCell = (record) => {
        return {
          onMouseEnter: () => {
            this.changeRowHeight(record, rowKey); // 鼠标移入行
          },
        };
      };
    }
    const dataSource = data.map((item, index) => {
      const key = index;
      return { ...item, key };
    });
    const paginationProps = {
      showSizeChanger: true,
      pageSizeOptions: ['5', '10', '20', '30'],
      showQuickJumper: true,
      ...pagination,
    };

    const rowSelection = checkedble ? {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    } : null;

    return (
      <div
        className={styles.standardTable}
        ref={(ref) => { this.table = ref; }}
        id={rowKey}
      >
        <Table
          loading={loading}
          rowKey={record => record[rowKey]}
          rowSelection={rowSelection}
          dataSource={dataSource}
          components={components}
          columns={columns}
          scroll={scroll}
          onRow={(record) => {
            return {
              onMouseLeave: () => {
                this.changeRowHeight(record, rowKey); // 鼠标移入行
              },
            };
          }}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default StandardTable;
// 头部统计区
// {discheckeble ? null : (
//   <div className={styles.tableAlert}>
//     <Alert
//       message={(
//         <div>
//           已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
//           {
//             needTotalList.map(item => (
//                 <span style={{ marginLeft: 8 }} key={item.dataIndex}>{item.title}总计&nbsp;
//                   <span style={{ fontWeight: 600 }}>
//                           {item.render ? item.render(item.total) : item.total}
//                         </span>
//                       </span>
//               )
//             )
//           }
//           <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
//         </div>
//       )}
//       type="info"
//       showIcon
//     />
//   </div>
// )}
