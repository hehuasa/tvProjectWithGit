import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Scrollbars from 'react-custom-scrollbars';
import { Table } from 'antd';
import styles from '../../DailyProduction/index.less';
import { win8, win16, win15, win45, win3 } from '../../../utils/configIndex';

const columns = [
  { title: '序号', width: 80, dataIndex: 'index', key: 'index' },
  { title: '接口名', width: 160, dataIndex: 'pluginCaption', key: 'pluginCaption' },
  { title: '接口状态', width: 100, dataIndex: 'pluginState', key: 'pluginState', render: text => (text ? '已连接' : '未连接') },
  { title: '接口来源', dataIndex: 'remark', key: 'remark' },
];
@connect(({ system }) => ({
  system,
  pluginList: system.pluginList,
}))
export default class DissociationInfo extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/fetch',
    });
  }

  render() {
    const { pluginList } = this.props;
    const dataSource = pluginList.map((item, index) => {
      return { ...item, index: index + 1 };
    });
    return (
      <div className={styles.warp}>
        <div className={styles.title}>
          <div className={styles.left} />
          <div className={styles.text}>接口列表</div>
          <div className={styles.left} />
        </div>
        <div className={styles.content}>
          <Scrollbars className={styles.scrollbarsStyle}>
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              rowKey={record => record.pluginID}
              rowClassName={(record, index) => {
                return index % 2 === 0 ? styles.blue : styles.blueRow;
              }}
              bordered
              scroll={{ x: 500 + columns.length * win3 }}
            />
          </Scrollbars>
        </div>
      </div>
    );
  }
}
