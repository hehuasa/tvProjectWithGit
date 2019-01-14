import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Icon, Button, Select } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import { commonData } from '../../../mock/commonData';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ template, typeCode }) => ({
  template,
  loading: template.loading,
  orgTree: template.orgTree,
  orgUsers: template.orgUsers,
  checkedUsers: template.checkedUsers,
  customUsers: template.customUsers,
  msgGroup: template.msgGroup,
  msgGroupInfo: template.msgGroupInfo,
  templateList: template.templateList,
  msgGroupUsers: template.msgGroupUsers,
  msgPage: template.msgPage,
  typeCode,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    // 搜索栏是否展开
    expandForm: false,
    selectedRows: [],
  };

  componentDidMount() {
    // 获取短信管理分页数据
    this.page(commonData.pageInitial);
  }

  // 获取分页数据
  page = (page) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'template/msgPage',
      payload: page,
    });
  };
  // 初始化表格数据
  initData = () => {
    const tableTitles = [];
    commonData.columns.msg.attributes.forEach((item) => {
      if (item.isTableItem) {
        tableTitles.push(item);
      }
    });
    return tableTitles;
  };
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, form } = this.props;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    form.validateFields(['msgContent', 'sendStatu', 'acceptNumber'], (err, fieldsValue) => {
      if (err) return;
      const params = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        fuzzy: true,
        isQuery: true,
        ...fieldsValue,
        ...filters,
      };
      if (sorter.field) {
        const { field, order } = sorter;
        params.sorter = { field, order };
      }
      dispatch({
        type: 'template/msgPage',
        payload: params,
      });
    });
  };
  // 重置搜索条件
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.page(commonData.pageInitial);
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };
  // 搜索函数
  handleSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      const search = {};
      Object.assign(search, { ...commonData.pageInitial, isQuery: true, fuzzy: true }, values);
      this.page(search);
    });
  };
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="短信内容">
              {getFieldDecorator('msgContent')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="短信状态">
              {getFieldDecorator('sendStatu')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">请选择</Option>
                  {commonData.msgStatus.map(type =>
                    <Option key={type.id} value={type.value}>{type.text}</Option>
                  )}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="接收号码">
              {getFieldDecorator('acceptNumber', {
                rules: [
                  { pattern: /^[0-9]*$/, message: '只能输入数字' },
                ],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="短信内容">
              {getFieldDecorator('msgContent')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="短信状态">
              {getFieldDecorator('sendStatu')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">请选择</Option>
                  {commonData.msgStatus.map(type =>
                    <Option key={type.id} value={type.value}>{type.text}</Option>
                  )}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="接收号码">
              {getFieldDecorator('acceptNumber', {
                rules: [
                  { pattern: /^[0-9]*$/, message: '只能输入数字' },
                ],
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                发送短信
            </Button>
            <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { msgPage } = this.props;
    const { selectedRows } = this.state;
    const columns = this.initData();
    return (
      <PageHeaderLayout title="短信分组列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              discheckeble
              data={msgPage}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey="shortMsgUserGroupID"
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
