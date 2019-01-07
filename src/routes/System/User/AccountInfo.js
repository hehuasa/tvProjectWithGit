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
  Table,
  Button,
  Dropdown,
  Menu,
  Tag,
  TreeSelect,
  Modal,
  message,
  Divider,
  Popconfirm,
} from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import { commonData } from '../../../../mock/commonData';
import { accountEnable } from '../../../services/api';
import { win3, win20 } from '../../../configIndex';

const FormItem = Form.Item;
const { Option } = Select;
const { TreeNode } = TreeSelect;
const { TextArea } = Input;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

// 新增 修改页
const CreateForm = Form.create()((props) => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const { list, account, accountTypeList, isAdd } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };
  // 关闭后销毁子元素
  const destroyOnClose = true;
  return (
    <Modal
      destroyOnClose={destroyOnClose}
      title={isAdd ? '新增账户' : '修改账户'}
      visible={modalVisible}
      onOk={okHandle}
      width="80%"
      onCancel={() => handleModalVisible()}
    >
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <FormItem>
          {form.getFieldDecorator('accountID', {
                initialValue: isAdd ? '' : account.accountID,
                rules: [],
              })(
                <Input type="hidden" />
              )}
        </FormItem>
        <Col md={12} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="用户"
          >
            {form.getFieldDecorator('userID', {
                initialValue: isAdd ? '' : account.baseUserInfo.userID,
                rules: [{ required: true, message: '用户不能为空' }],
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">请选择</Option>
                  {list.map(item => (
                    <Option
                      key={item.userID}
                      value={item.userID}
                    >{item.userName}
                    </Option>
                  ))}
                </Select>
              )}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="登录账号"
          >
            {form.getFieldDecorator('loginAccount', {
              initialValue: isAdd ? '' : account.loginAccount,
              rules: [
                { required: true, message: '登录账号不能为空' },
                { pattern: /^[A-Za-z_]+$/, message: '只能由英文与下划线组成' },
                ],
            })(
              <Input placeholder="请输入登录账号" />
            )}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="账户类型"
          >
            {form.getFieldDecorator('accountType', {
                initialValue: isAdd ? '' : account.accountType,
                rules: [{ required: true, message: '账户类型不能为空' }],
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">请选择</Option>
                  {accountTypeList.map(item => (
                    <Option key={item.codeID} value={item.code}>{item.codeName}</Option>
                    )
                  )}
                </Select>
              )}
          </FormItem>
        </Col>
        <Col md={12} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="备注"
          >
            {form.getFieldDecorator('remark', {
                initialValue: isAdd ? '' : account.remark,
                rules: [],
              })(
                <TextArea />
              )}
          </FormItem>
        </Col>
      </Row>

    </Modal>
  );
});
// 账户配置角色
const ConfigRole = Form.create()((props) => {
  const { configRoleVisible, form, doRoleConfig, roleConfigVisible, rolePage } = props;
  const { account, onChange, onChecked, roleIDs, onSelectAll } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      doRoleConfig(fieldsValue.accountID);
    });
  };
  // 关闭后销毁子元素
  const destroyOnClose = true;
  const columns = [
    { title: '角色名称',
      dataIndex: 'roleName',
      isExport: true,
      isTableItem: true,
      width: '20%',
      key: 'roleName' },
    { title: '角色编码',
      dataIndex: 'roleCode',
      isExport: true,
      width: '15%',
      isTableItem: false,
      key: 'roleCode' },
    { title: '角色类型',
      dataIndex: 'roleType',
      isExport: true,
      width: '15%',
      isTableItem: false,
      render: (text) => {
        return text === 1 ? '功能角色' : '数据角色';
      },
      key: 'roleType' },
    { title: '角色描述',
      dataIndex: 'roleDes',
      isExport: true,
      isTableItem: true,
      width: '45%',
      key: 'roleDes' },
  ];
  return (
    <Modal
      destroyOnClose={destroyOnClose}
      title="配置角色"
      visible={configRoleVisible}
      onOk={okHandle}
      width="80%"
      onCancel={roleConfigVisible}
    >
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <FormItem>
          {form.getFieldDecorator('accountID', {
                initialValue: account.accountID,
                rules: [],
              })(
                <Input type="hidden" />
              )}
        </FormItem>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="部门"
          >
            {form.getFieldDecorator('orgnizationName', {
                initialValue: account.baseUserInfo.orgnizationName,
              })(
                <Input disabled />
              )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="姓名"
          >
            {form.getFieldDecorator('userName', {
                initialValue: account.baseUserInfo.userName,
              })(
                <Input disabled />
              )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="账号"
          >
            {form.getFieldDecorator('loginAccount', {
              initialValue: account.loginAccount,
            })(
              <Input disabled />
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col sm={20} offset={2}>
          <Table
            dataSource={rolePage.data}
            size="small"
            columns={columns}
            pagination={{
              ...rolePage.pagination,
              onChange,
            }}
            rowSelection={{
              onSelect: onChecked,
              onSelectAll,
              selectedRowKeys: roleIDs.map(item => item.roleID),
            }}
            rowKey={record => record.roleID}
          />
        </Col>
      </Row>
    </Modal>
  );
});

@connect(({ loading, accountInfo, typeCode, organization }) => ({
  loading: loading.effects['system/accountInfo/getAccounts'],
  accountInfo,
  roleIDs: accountInfo.roleIDs,
  functionMenus: accountInfo.functionMenus,
  orgTree: organization.orgTree,
  typeCode,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    // 弹框的显示控制
    modalVisible: false,
    // 搜索栏是否展开
    expandForm: false,
    selectedRows: [],
    formValues: {},
    //  修改还是新增
    isAdd: true,
    // 配置角色弹窗
    configRoleVisible: false,
    // 选中的角色
    selectedRowKeys: [],
  };
  componentDidMount() {
    const { dispatch } = this.props;
    this.getFunctionMenus();
    // 请求搜索的账户类型
    dispatch({
      type: 'typeCode/accountType',
      payload: '100',
    });
    // 请求部门树
    dispatch({
      type: 'organization/getOrgTree',
    });
    this.page(commonData.pageInitial);
  }
  // 获取分页数据
  page=(page) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'accountInfo/accountRolePage',
      payload: page,
    });
  };
  // 初始化表格数据
  initData=() => {
    const tableTitles = [];
    commonData.columns.account.attributes.forEach((item) => {
      if (item.isTableItem) {
        tableTitles.push(item);
      }
    });
    // 操作列
    tableTitles.push({
      title: '操作',
      width: win20,
      fixed: 'right',
      render: (text, record) => {
        // 获取该行的id，可以获取的到，传到函数里的时候打印直接把整个表格所有行id全部打印了
        return (
          <Fragment>
            { this.judgeFunction('启停用权限') ? (record.accountState === 1 ? (
              <Popconfirm title="确定停用该用户？" onConfirm={() => this.accountEnable(record, 0)}>
                <a href="#">停用</a>
              </Popconfirm>
            ) : (
              <Popconfirm title="确定启用该用户？" onConfirm={() => this.accountEnable(record, 1)}>
                <a href="#">启用</a>
              </Popconfirm>
            )) : null}
            <Divider type="vertical" />
            { record.accountType === '100.101' && this.judgeFunction('重置密码权限') ? (
              <span>
                <Popconfirm title="确定重置密码？" onConfirm={() => this.resetPwd(record)}>
                  <a href="#">重置密码</a>
                </Popconfirm>
                <Divider type="vertical" />
              </span>
            ) : null
            }
            { this.judgeFunction('配置角色权限') ? (
              <a href="javascript: void(0)" onClick={() => this.showRoleConfig(record)}>配置角色</a>
            ) : null}
          </Fragment>
        );
      },
    });
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
      type: 'accountInfo/accountRolePage',
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
      type: 'accountInfo/accountRolePage',
      payload: commonData.pageInitial,
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = (rows) => {
    console.log(rows);
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
      const search = {};
      Object.assign(search, commonData.pageInitial, fieldsValue);
      this.page(search);
    });
  };

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
      isAdd: true,
    });
    this.props.dispatch({
      type: 'userList/fetch',
    });
    // 账户类型
    this.props.dispatch({
      type: 'typeCode/accountType',
      payload: '100',
    });
  };

  handleAdd = (fields) => {
    if (this.state.isAdd) {
      this.doAdd(fields);
    } else {
      this.doUpdate(fields);
    }
  };
  doAdd = (fields) => {
    this.props.dispatch({
      type: 'accountInfo/add',
      payload: fields,
    }).then(() => {
      this.setState({
        modalVisible: false,
      });
    });
  };
  // 修改函数
  doUpdate = (fields) => {
    this.props.dispatch({
      type: 'accountInfo/update',
      payload: fields,
    }).then(() => {
      this.setState({
        modalVisible: false,
      });
    });
  };
  // 执行删除函数
  delete = (record) => {
    this.props.dispatch({
      type: 'accountInfo/delete',
      payload: [record.accountID],
    });
  };
  // 重置密码
  resetPwd = (record) => {
    this.props.dispatch({
      type: 'accountInfo/reset',
      payload: { accountID: record.accountID },
    });
  };
  // 启用停用账户
  accountEnable = (record, accountState) => {
    this.props.dispatch({
      type: 'accountInfo/accountEnable',
      payload: { accountState, accountID: record.accountID },
    }).then(() => {
      const { pagination } = this.props.accountInfo.accountRolePage;
      const page = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
      };
      this.page(page);
    });
  };
  // 修改请求数据
  update = (record) => {
    this.setState({
      modalVisible: !this.state.modalVisible,
      isAdd: false,
    });
    this.props.dispatch({
      type: 'accountInfo/get',
      payload: record.accountID,
    });
    this.props.dispatch({
      type: 'typeCode/accountType',
      payload: '100',
    });
  };
  // 配置角色 打开弹窗并请求角色信息
  showRoleConfig = (record) => {
    this.setState({
      configRoleVisible: true,
    });
    this.props.dispatch({
      type: 'accountInfo/get',
      payload: record.accountID,
    });
    this.props.dispatch({
      type: 'accountInfo/getRolesByAccountID',
      payload: { accountID: record.accountID },
    });
    this.rolePage(1, 10);
  };
  // 控制配置角色弹窗是否可见
  roleConfigVisible = () => {
    this.setState({
      configRoleVisible: !this.state.configRoleVisible,
    });
  };
  // 提交配置的角色
  doRoleConfig = (accountID) => {
    const { roleIDs } = this.props.accountInfo;
    this.props.dispatch({
      type: 'accountInfo/changeAccountRole',
      payload: { accountID, roleIDs: roleIDs.map(item => item.roleID) },
    }).then(() => {
      this.setState({
        configRoleVisible: false,
      });
    });
  };
  // 勾选的角色
  onChecked = (record, selected) => {
    const { roleIDs } = this.props;
    let array = [];
    if (selected) {
      array = roleIDs;
      array.push(record);
    } else {
      array = roleIDs.filter(item => item.roleID !== record.roleID);
    }
    this.props.dispatch({
      type: 'accountInfo/saveRoleIDs',
      payload: array,
    });
  };
  // 全选
  onSelectAll = (selected, selectedRows, changeRows) => {
    const { roleIDs } = this.props;
    let array = [];
    if (selected) {
      array = roleIDs.concat(changeRows);
    } else {
      array = roleIDs.filter(item => !changeRows.some(obj => obj.roleID === item.roleID));
    }
    this.props.dispatch({
      type: 'accountInfo/saveRoleIDs',
      payload: array,
    });
  }
  rolePage = (pageNum, pageSize) => {
    this.props.dispatch({
      type: 'accountInfo/rolePage',
      payload: { pageNum, pageSize },
    });
  };
  // 递归渲染
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.orgnizationName} key={item.orgID} value={`${item.orgID}`} >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.orgnizationName} key={item.orgID} value={`${item.orgID}`} />;
    });
  };
  // 获取页面功能权限
  getFunctionMenus = () => {
    const { dispatch, functionInfo } = this.props;
    dispatch({
      type: 'accountInfo/getFunctionMenus',
      payload: { parentCode: functionInfo.functionCode },
    });
  };
  // 判断是否有该功能权限
  judgeFunction = (functionName) => {
    const { functionMenus } = this.props;
    const arr = functionMenus.filter(item => item.functionName === functionName);
    return arr.length > 0;
  };
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="部门">
              {getFieldDecorator('orgID')(
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择事发部门"
                  treeNodeFilterProp="title"
                  allowClear
                  treeDefaultExpandAll
                >
                  {this.renderTreeNodes(this.props.orgTree)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('userName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="账号">
              {getFieldDecorator('loginAccount')(
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
  renderForm() {
    // return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    return this.renderSimpleForm();
  }
  render() {
    const { loading, accountInfo: { accountRolePage, rolePage, roleIDs }, accountInfo: { account } } = this.props;
    const { accountTypeList } = this.props.typeCode;
    const { selectedRows, modalVisible, configRoleVisible } = this.state;
    const columns = this.initData();
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <PageHeaderLayout title="用户列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={accountRolePage}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey="accountID"
              scroll={{x: 1200 + win3 * columns.length}}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          accountTypeList={accountTypeList}
          account={account}
          list={[]}
          isAdd={this.state.isAdd}
        />
        <ConfigRole
          configRoleVisible={configRoleVisible}
          account={account}
          rolePage={rolePage}
          roleIDs={roleIDs}
          onChange={this.rolePage}
          doRoleConfig={this.doRoleConfig}
          roleConfigVisible={this.roleConfigVisible}
          onChecked={this.onChecked}
          onSelectAll={this.onSelectAll}
        />
      </PageHeaderLayout>
    );
  }
}
