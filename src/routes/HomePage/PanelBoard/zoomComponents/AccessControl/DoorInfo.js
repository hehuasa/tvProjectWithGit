import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Form, Input, Button, Select } from 'antd';
import styles from './index.less';


const { Option } = Select;
const FormItem = Form.Item;

const columns = [{
  title: '姓名',
  dataIndex: 'userName',
  key: 'userName',
},
{
  title: '卡号',
  dataIndex: 'cardReaderCode',
  key: 'cardReaderCode',
}, {
  title: '部门',
  dataIndex: 'organizationName',
  key: 'organizationName',
}, {
  title: '门禁区域',
  dataIndex: 'areaName',
  key: 'areaName',
}, {
  title: '门禁名称',
  dataIndex: 'doorPlace',
  key: 'doorPlace',
},
{
  title: '进出类别',
  dataIndex: 'type',
  key: 'type',
  render: (value) => {
    return Number(value) === 1 ? '出' : '进';
  },
},
{
  title: '时间',
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
              {getFieldDecorator('areaID')(
                <Select defaultValue="" dropdownMatchSelectWidth placeholder="筛选区域" style={{ width: 150 }}>
                  <Option value="">全部区域</Option>
                  <Option value={9213}>生产区域</Option>
                  <Option value={9214}>管理区域</Option>
                </Select>
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('doorPlace')(
                <Input placeholder="输入门禁名称" />
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
      <Table className={styles.table} size="small" dataSource={doorCount.result} columns={columns} scroll={{ x: 450 }} bordered pagination={ { onChange: this.handlePageChange } } />
      </div>
    );
  }
}
const DoorInfo = Form.create()(FromComponent);
export default DoorInfo;

