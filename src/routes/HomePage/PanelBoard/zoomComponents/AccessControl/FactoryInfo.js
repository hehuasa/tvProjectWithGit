import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Form, Input, Button, Select } from 'antd';
import styles from './index.less';


const { Option } = Select;
const FormItem = Form.Item;

const columns = [
  {
    title: '部门',
    dataIndex: 'organizationName',
    key: 'organizationName',
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: '是否在生产区',
    dataIndex: 'areaName',
    key: 'areaName',
    render: (value) => {
      return value === '生产区域' ? '是' : '否';
    },
  }, {
    title: '是否在办公区',
    dataIndex: 'areaName',
    key: 'areaName1',
    render: (value) => {
      return value === '生产区域' ? '否' : '是';
    },
  },
  {
    title: '进厂时间',
    dataIndex: 'recordTime',
    key: 'recordTime',
    render: (value) => {
      return moment(Number(value)).format('YYYY-MM-DD HH:mm:ss');
    },
  },

];

class FromComponent extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'accessControl/getDoorPage',
      payload: { pageSize: 10, pageNum: 1 },
    });
  }
  handleSubmit= (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const value = form.getFieldsValue();
    dispatch({
      type: 'accessControl/getDoorPage',
      payload: { pageSize: 10, pageNum: 1, ...value },
    });
  };
  handlePageChange = (page) => {
    const { form, dispatch } = this.props;
    const value = form.getFieldsValue();
    dispatch({
      type: 'accessControl/getDoorPage',
      payload: { pageSize: 10, pageNum: page, ...value },
    });
  }
  render() {
    const { doorCount, form, hasErrors, name } = this.props;
    const { getFieldDecorator, getFieldsError } = form;
    return (
      <div className={styles.warp}>
        <h2>{name}</h2>
        <Form layout="inline" onSubmit={this.handleSubmit} className={styles.form}>
          <FormItem>
            {getFieldDecorator('organizationName')(
              <Input placeholder="输入部门" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('userName')(
              <Input placeholder="输入姓名" />
            )}
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              搜索
            </Button>
          </FormItem>
        </Form>
        <Table className={styles.table} size="small" dataSource={doorCount} columns={columns} scroll={{ x: 450 }} bordered pagination={{ onChange: this.handlePageChange }} />
      </div>
    );
  }
}
const FactoryInfo = Form.create()(FromComponent);
export default FactoryInfo;

