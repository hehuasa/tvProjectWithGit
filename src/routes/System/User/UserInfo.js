import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, TreeSelect, DatePicker, Modal, Divider, Popconfirm } from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import { commonData } from '../../../../mock/commonData';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
// 新增 修改页
const CreateForm = Form.create()((props) => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const { codeList, ranksList, specialList, userTypeList, user, isAdd, depList } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };
  const renderDeptTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode
            title={item.orgnizationName}
            key={item.orgID}
            value={item.orgID}
          >
            {renderDeptTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.orgnizationName} key={item.orgID} value={item.orgID} />;
    });
  };
  // 关闭后销毁子元素
  const destroyOnClose = true;
  return (
    <Modal
      destroyOnClose={destroyOnClose}
      title={isAdd ? '新增用户' : '修改用户'}
      visible={modalVisible}
      onOk={okHandle}
      width="80%"
      onCancel={() => handleModalVisible()}
    >
      <Row gutter={{ md: 8, lg: 24, xl: 48 }} type="flex">
        <FormItem>
          {form.getFieldDecorator('userID', {
            initialValue: isAdd ? '' : user.userID,
            rules: [],
          })(
            <Input type="hidden" />
          )}
        </FormItem>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="用户编码"
          >
            {form.getFieldDecorator('userCode', {
              getFieldDecorator: isAdd ? '' : user.userCode,
              rules: [
                { required: true, message: '用户编码不能为空' },
                { pattern: /^[A-Za-z0-9_]+$/, message: '只能由英文、数字、下划线组成' },
                ],
            })(
              <Input placeholder="请输入用户编码" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="用户名称"
          >
            {form.getFieldDecorator('userName', {
              initialValue: isAdd ? '' : user.userName,
              rules: [
                { required: true, message: '用户名称不能为空' },
                { pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/, message: '只能由中文、英文、数字、下划线组成' },
                ],
            })(
              <Input placeholder="请输入用户名称" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="名称拼音"
          >
            {form.getFieldDecorator('queryKey', {
              initialValue: isAdd ? '' : user.queryKey,
              rules: [
                { pattern: /^[A-Za-z]+$/, message: '只能由英文字母组成' },
              ],
            })(
              <Input placeholder="请输入用户名称拼音" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="所属部门"
          >
            {form.getFieldDecorator('orgID', {
              initialValue: isAdd ? '' : user.orgID,
              rules: [],
            })(
              <TreeSelect
                showSearch
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择所属部门"
                allowClear
                treeNodeFilterProp="title"
                onChange={this.onChange}
              >
                {renderDeptTreeNodes(depList)}
              </TreeSelect>
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="用户类型"
          >
            {form.getFieldDecorator('userType', {
              initialValue: isAdd ? '' : user.userType,
              rules: [{ required: true, message: '用户类型不能为空' }],
            })(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                <Option value="">请选择</Option>
                {userTypeList.map(item => (
                  <Option
                    key={item.codeID}
                    value={item.code}
                  >{item.codeName}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="性别"
          >
            {form.getFieldDecorator('sex', {
              initialValue: isAdd ? '' : user.sex,
              rules: [],
            })(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                <Option value="">请选择</Option>
                {commonData.sex.map(item => (
                  <Option key={item.id} value={item.value}>{item.text}</Option>
                )
                )}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="电话"
          >
            {form.getFieldDecorator('phoneNumber', {
              initialValue: isAdd ? '' : user.phoneNumber,
              rules: [
                { pattern: /\d{3}-\d{8}|\d{4}-\d{7}/, message: '输入正确的电话(eg:010-25688695)' },
              ],
            })(
              <Input placeholder="请输入电话" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="手机"
          >
            {form.getFieldDecorator('mobile', {
              initialValue: isAdd ? '' : user.mobile,
              rules: [
                { pattern: /^(17[0-9]|13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/, message: '请输入正确的手机号码' },
              ],
            })(
              <Input placeholder="请输入手机号" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="短号"
          >
            {form.getFieldDecorator('shortNumber', {
              initialValue: isAdd ? '' : user.shortNumber,
              rules: [
                { pattern: /^[0-9]*$/, message: '请输入有效数字' },
              ],
            })(
              <Input placeholder="请输入短号" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="邮箱"
          >
            {form.getFieldDecorator('eMail', {
              initialValue: isAdd ? '' : user.eMail,
              rules: [
                {
                  type: 'email', message: '请输入正确的邮箱地址',
                },
              ],
            })(
              <Input placeholder="请输入邮箱" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="办公地址"
          >
            {form.getFieldDecorator('officeAddr', {
              initialValue: isAdd ? '' : user.officeAddr,
              rules: [],
            })(
              <Input placeholder="请输入办公地址" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="家庭地址"
          >
            {form.getFieldDecorator('familyAddr', {
              initialValue: isAdd ? '' : user.familyAddr,
              rules: [],
            })(
              <Input placeholder="请输入家庭地址" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="学历"
          >
            {form.getFieldDecorator('formalSchooling', {
              initialValue: isAdd ? '' : user.formalSchooling,
              rules: [],
            })(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                <Option value="">请选择</Option>
                {codeList.map(item => (
                  <Option
                    key={item.codeID}
                    value={item.code}
                  >{item.codeName}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="专业"
          >
            {form.getFieldDecorator('speciality', {
              initialValue: isAdd ? '' : user.speciality,
              rules: [],
            })(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                <Option value="">请选择</Option>
                {specialList.map(item => (
                  <Option
                    key={item.codeID}
                    value={item.code}
                  >{item.codeName}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="职称"
          >
            {form.getFieldDecorator('professionalRanks', {
              initialValue: isAdd ? '' : user.professionalRanks,
              rules: [],
            })(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                <Option value="">请选择</Option>
                {ranksList.map(item => (
                  <Option
                    key={item.codeID}
                    value={item.code}
                  >{item.codeName}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="是否在职"
          >
            {form.getFieldDecorator('working', {
              initialValue: isAdd ? '' : user.working,
              rules: [],
            })(
              <Select placeholder="请选择" style={{ width: '100%' }}>
                <Option value="">请选择</Option>
                {commonData.boolNum.map(item => (
                  <Option
                    key={item.id}
                    value={item.value}
                  >{item.text}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="说明"
          >
            {form.getFieldDecorator('remark', {
              initialValue: isAdd ? '' : user.remark,
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

@connect(({ userList, typeCode, organization }) => ({
  userList,
  typeCode,
  organization,
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
  };
  componentDidMount() {
    const { dispatch } = this.props;
    // 请求搜索的用户类型
    dispatch({
      type: 'typeCode/type',
      payload: '553',
    });
    this.page(commonData.pageInitial);
  }
  // 获取分页数据
  page = (page) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userList/page',
      payload: page,
    });
  };
  // 初始化表格数据
  initData = () => {
    const tableTitles = [];
    commonData.columns.user.attributes.forEach((item) => {
      if (item.isTableItem) {
        tableTitles.push(item);
      }
    });
    // 操作列
    tableTitles.push({
      title: '操作',
      render: (text, record) => {
        // 获取该行的id，可以获取的到，传到函数里的时候打印直接把整个表格所有行id全部打印了
        return (
          <Fragment>
            <Popconfirm title="确定删除？" onConfirm={() => this.delete(record)}>
              <a href="#">删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href="javascript: void(0)" onClick={() => this.update(record)}>修改</a>
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
      // params.sorter = `${sorter.field}_${sorter.order}`;
      const { field, order } = sorter;
      params.sorter = { field, order };
    }

    dispatch({
      type: 'userList/page',
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
      type: 'userList/page',
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
      const values = {
        ...fieldsValue,
        createTimes: fieldsValue.createTime ? fieldsValue.createTime.format('YYYY-MM-DD') : undefined,
      };
      if (values.createTime) { delete values.createTime; }
      // 防止将空作为查询条件
      for (const obj in values) {
        if (values[obj] === '' || values[obj] === undefined) {
          delete values[obj];
        }
      }
      const search = {};
      Object.assign(search, commonData.pageInitial, values);
      this.page(search);
    });
  };

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
      isAdd: true,
    });
    // 码表 获取学历
    this.props.dispatch({
      type: 'typeCode/fetch',
      payload: '550',
    });
    // 码表 获取所属专业
    this.props.dispatch({
      type: 'typeCode/speciality',
      payload: '552',
    });
    // 码表 获取职称
    this.props.dispatch({
      type: 'typeCode/ranks',
      payload: '551',
    });
    // 用户类型
    this.props.dispatch({
      type: 'typeCode/type',
      payload: '553',
    });
    // 请求部门数据
    this.props.dispatch({
      type: 'organization/list',
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
      type: 'userList/add',
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
      type: 'userList/update',
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
      type: 'userList/delete',
      payload: [record.userID],
    });
  };
  // 导出函数
  export = () => {
    const para = commonData.pageInitial;
    delete para.pageNum;
    delete para.pageSize;
    para.showJson = [];
    commonData.columns.user.attributes.forEach((item) => {
      if (item.isExport) {
        para.showJson.push({ en: item.dataIndex, cn: item.title });
      }
    }
    );
    para.showJson = JSON.stringify(para.showJson);
    this.props.dispatch({
      type: 'userList/export',
      payload: para,
    });
  };
  deleteAll = () => {
    const userIds = [];
    this.state.selectedRows.forEach((user) => {
      userIds.push(user.userID);
    });
    this.props.dispatch({
      type: 'userList/delete',
      payload: userIds,
    });
  };
  update = (record) => {
    this.setState({
      modalVisible: !this.state.modalVisible,
      isAdd: false,
    });
    this.props.dispatch({
      type: 'userList/get',
      payload: record.userID,
    });
    // 获取学历
    this.props.dispatch({
      type: 'typeCode/fetch',
      payload: '550',
    });
    // 码表 所属专业
    this.props.dispatch({
      type: 'typeCode/speciality',
      payload: '552',
    });
    // 码表 职称
    this.props.dispatch({
      type: 'typeCode/ranks',
      payload: '551',
    });
    // 码表 请求用户类型
    this.props.dispatch({
      type: 'typeCode/type',
      payload: '553',
    });
    // 请求部门数据
    this.props.dispatch({
      type: 'organization/list',
    });
  };
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户编号">
              {getFieldDecorator('userCode')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户类型">
              {getFieldDecorator('userType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">请选择</Option>
                  {this.props.typeCode.userTypeList.map(type =>
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
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
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
          <Col md={8} sm={24}>
            <FormItem label="用户编码">
              {getFieldDecorator('userCode')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户名称">
              {getFieldDecorator('userName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户类型">
              {getFieldDecorator('userType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">请选择</Option>
                  {this.props.typeCode.userTypeList.map(type =>
                    <Option key={type.codeID} value={type.code}>{type.codeName}</Option>
                  )}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="性别">
              {getFieldDecorator('sex')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">请选择</Option>
                  {commonData.sex.map(type =>
                    <Option key={type.id} value={type.value}>{type.text}</Option>
                  )}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator('createTime')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="手机">
              {getFieldDecorator('mobile')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
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
    const { loading, userList: { data }, userList: { user } } = this.props;
    const { specialList, ranksList, userTypeList, codeList } = this.props.typeCode;
    const { list } = this.props.organization;
    const { selectedRows, modalVisible } = this.state;
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
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新增
              </Button>
              <Button icon="export" type="primary" onClick={() => this.export()}>
                导出
              </Button>
              {
                selectedRows.length > 0 && (
                <Popconfirm title="确定删除？" onConfirm={() => this.deleteAll()}>
                  <Button>批量删除</Button>
                </Popconfirm>
                )
              }
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey="userID"
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          specialList={specialList}
          ranksList={ranksList}
          codeList={codeList}
          userTypeList={userTypeList}
          user={user.data}
          isAdd={this.state.isAdd}
          depList={list}
        />
      </PageHeaderLayout>
    );
  }
}
