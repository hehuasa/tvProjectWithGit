import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Divider,
  Popconfirm,
} from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import { commonData } from '../../../../mock/commonData';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ rule, loading, accountInfo, typeCode, userList }) => ({
  rule,
  loading: loading.models.rule,
  accountInfo,
  typeCode,
  userList,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    // 搜索栏是否展开
    expandForm: false,
    selectedRows: this.props.selectedRows,
    formValues: {},
  };
  componentDidMount() {
    const { dispatch } = this.props;
    // 请求搜索的账户类型
    dispatch({
      type: 'typeCode/accountType',
      payload: '100',
    });
    this.page(commonData.pageInitial);
  }
  // 获取分页数据
  page=(page) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountInfo/page',
      payload: { ...page },
    });
  };
  // 初始化表格数据
  initData=() => {
    const tableTitles = [
      {
        title: '部门',
        dataIndex: 'baseUserInfo',
        isExport: false,
        isTableItem: true,
        width: '20%',
        key: 'baseUserInfo',
        render: (text) => {
          return text ? text.orgnizationName : '';
        },
      },
      {
        title: '姓名',
        dataIndex: 'userName',
        isExport: false,
        isTableItem: true,
        width: '10%',
        key: 'userName',
        render: (text, record) => {
          return record.baseUserInfo ? record.baseUserInfo.userName : '';
        },
      },
      {
        title: '账号',
        dataIndex: 'loginAccount',
        isExport: true,
        isTableItem: true,
        width: '10%',
        key: 'loginAccount',
      },
      {
        title: '用户类型',
        dataIndex: 'accountTypeName',
        isExport: true,
        isTableItem: true,
        width: '10%',
        key: 'accountType',
      },
      {
        title: '用户状态',
        dataIndex: 'accountState',
        isExport: true,
        isTableItem: true,
        width: '10%',
        key: 'accountState',
        render: (text) => {
          return text === 1 ? <span color="blue">已启用</span> : <span color="red">已停用</span>;
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        isExport: true,
        isTableItem: true,
        width: '35%',
        key: 'remark',
      },
    ];
    return tableTitles;
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'accountInfo/page',
      payload: params,
    });
  };
  // 重置搜索条件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'accountInfo/page',
      payload: commonData.pageInitial,
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleMenuClick = (e) => {
  };

  handleSelectRows = (rows, selectedRowKeys) => {
    if (this.props.selectedRowKeys) {
      this.props.selectedRowKeys(selectedRowKeys);
    }
    this.setState({
      selectedRows: rows,
    });
  };
  // 搜索函数
  handleSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const search = JSON.stringify(fieldsValue) === '{}' ? {} : {
        fuzzy: true,
        isQuery: true,
      };
      Object.assign(search, commonData.pageInitial, fieldsValue);
      // 防止将空作为查询条件
      for (const obj in search) {
        if (search[obj] === '' || search[obj] === undefined || search[obj] === null) {
          delete search[obj];
        }
      }
      this.page(search);
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="账号">
              {getFieldDecorator('loginAccount')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="账户类型">
              {getFieldDecorator('accountType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">请选择</Option>
                  {this.props.typeCode.accountTypeList.map(type =>
                    <Option key={type.codeID} value={type.code}>{type.codeName}</Option>
                  )}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  renderForm() {
    return this.renderSimpleForm();
  }
  render() {
    const { loading, accountInfo: { data }, accountInfo: { account } } = this.props;
    const { selectedRows } = this.state;
    const columns = this.initData();
    return (
      <PageHeaderLayout title="账户列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              checkedble
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey="accountID"
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
