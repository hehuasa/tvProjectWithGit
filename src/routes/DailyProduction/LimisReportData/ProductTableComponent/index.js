import React, { PureComponent } from 'react';
import { Table } from 'antd';
import styles from '../../index.less';

export default class ProductTableComponent extends PureComponent {
  render() {
    const { current } = this.props;
    const firstLine = (
      <div>
        <div className={styles.tdOne}>批号</div>
        <div className={styles.tdTwo}>{this.props.data.samplingPoint}</div>
        <div className={styles.tdThree}>等级</div>
        <div className={styles.tdFour}>/</div>
      </div>);
    const cols = [
      {
        title: <div className={styles.thDiv}>{this.props.data.sampleName}</div>,
        dataIndex: 'location',
        width: '100%',
        children: [
          {
            title: firstLine,
            dataIndex: 'fix',
            width: '100%',
            children: [
              {
                title: <div className={styles.thDiv}>分析项目</div>,
                dataIndex: 'nameContent',
                width: '50%',
              },
              {
                title: <div className={styles.thDiv}>指标</div>,
                dataIndex: 'mplDesc',
                width: '20%',
              },
              {
                title: <div className={styles.thDiv}>实测值</div>,
                dataIndex: 'textContent',
                width: '30%',
              },
            ],
          },
        ],
      },
    ];
    return (
      <div className={styles.productTable}>
        <Table
          dataSource={this.props.data.data}
          columns={cols}
          pagination={false}
          rowClassName={(record, index) => {
          return index % 2 === 0 ? styles.blue : styles.blueRow;
        }}
          bordered
          scroll={{ y: current === 0 ? 560 : 370 }}
        />
      </div>
    );
  }
}
