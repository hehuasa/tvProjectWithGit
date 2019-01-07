import React, { PureComponent } from 'react';
import { Table, Form, Input, Card, Row, Col, Button, Select } from 'antd';
import styles from "./index.less";

const FormItem = Form.Item;
const { Option } = Select;
const columns = [
  {
    title: '姓名',
    dataIndex: 'userName',
    width: 100,
    key: 'userName',
  }, {
    title: '部门',
    dataIndex: 'orgnizationName',
    width: 120,
    key: 'orgnizationName',
  }, {
    title: '类型',
    dataIndex: 'userTypeName',
    width: 120,
    key: 'userTypeName',
  },
];
const userTypes = [
  { userType: '553.101', userTypeName: '武汉乙烯人员' },
  { userType: '553.102', userTypeName: '第三方维护人员' },
];
@Form.create()
export default class UserPage extends PureComponent {
  state = {
    pagination: {
      pageSize: 5,
      pageNum: 1,
      isQuery: true,
      fuzzy: true,
    },
  };
  handleSelect = (record) => {
    this.props.saveData(record);
  };
  handleSubmit = () => {
    const { form, dispatch } = this.props;
    const { pagination } = this.state;
    const value = form.getFieldsValue();
    // 去掉前后空格
    for (const [index, item] of Object.entries(value)) {
      if (item) {
        value[index] = item.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      }
    }
    dispatch({
      type: 'emgcResource/fetchUsers',
      payload: { ...pagination, ...value },
    });
  };
  handlePageChange = (page) => {
    const { form, dispatch } = this.props;
    const { pagination } = this.state;
    pagination.pageNum = page;
    this.setState({ pagination });
    const value = form.getFieldsValue();
    dispatch({
      type: 'emgcResource/fetchUsers',
      payload: { ...pagination, ...value },
    });
  };
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { pagination } = this.state;
    form.resetFields();
    dispatch({
      type: 'emgcResource/fetchUsers',
      payload: pagination,
    });
  };
  render() {
    const { userData, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Card bordered={false} className={styles.warp}>
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem label="姓名">
                {getFieldDecorator('userName')(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem label="类别">
                {getFieldDecorator('userType')(
                  <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Option value="" disabled>请选择</Option>
                    {userTypes.map(item => (
                      <Option
                        key={item.userType}
                        value={item.userType}
                      >{item.userTypeName}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem>
                <Button type="primary" style={{ marginLeft: 8 }} htmlType="submit">查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset} htmlType="button">重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table
          dataSource={userData.result}
          rowSelection={{ type: 'radio', onSelect: this.handleSelect }}
          columns={columns}
          pagination={{
              total: userData.pageCount,
              pageSize: userData.pageSize,
              onChange: this.handlePageChange,
              showQuickJumper: true,
            }}
        />
      </Card>
    );
  }
}
