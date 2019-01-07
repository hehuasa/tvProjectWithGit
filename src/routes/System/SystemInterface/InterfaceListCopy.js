import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Select, Table } from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import { commonData } from '../../../../mock/commonData';

const columns = [
  { title: '序号', width: 80, dataIndex: 'index', key: 'index' },
  { title: '接口名', width: 160, dataIndex: 'pluginCaption', key: 'pluginCaption' },
  { title: '接口编码', width: 100, dataIndex: 'pluginCode', key: 'pluginCode' },
  { title: '接口状态', width: 100, dataIndex: 'pluginState', key: 'pluginState', render: text => (text ? '已连接' : '未连接') },
  { title: '接口来源', dataIndex: 'remark', key: 'remark' },
];

@connect(({ system }) => ({
  system,
  pluginList: system.pluginList,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/fetch',
    });
  }

  render() {
    const { loading, pluginList } = this.props;
    const dataSource = pluginList.map((item, index) => {
      return { ...item, index: index + 1 };
    });
    return (
      <PageHeaderLayout title="系统接口列表">
        <div className={styles.tableTitle}>
          <Card bordered={false} title="系统接口列表">
            <div className={styles.tableList}>
              <Table
                loading={loading}
                dataSource={dataSource}
                columns={columns}
                pagination={{
                pageSize: 10,
              }}
                rowKey={record => record.pluginID}
              />
            </div>
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
