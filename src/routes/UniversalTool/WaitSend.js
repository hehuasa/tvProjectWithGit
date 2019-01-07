import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
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
  Modal,
  Divider,
  Popconfirm,
} from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import {commonData} from '../../../mock/commonData';

const FormItem = Form.Item;
const {TextArea} = Input;
const {Option} = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

// 新增 修改页
const CreateForm = Form.create()((props) => {
  const {modalVisible, form, handleAdd, handleModalVisible} = props;
  const {sends, templateList, isAdd, list} = props;
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
      title={isAdd ? '新增短信' : '修改短信'}
      visible={modalVisible}
      onOk={okHandle}
      width="80%"
      onCancel={() => handleModalVisible()}
    >
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
          {form.getFieldDecorator('shortMsgID', {
            initialValue: isAdd ? '' : sends.shortMsgID,
            rules: [],
          })(
            <Input type="hidden"/>
          )}
        </FormItem>
        <FormItem
          label="短信模板"
          labelCol={{span: 5}}
          wrapperCol={{span: 12}}
        >
          {form.getFieldDecorator('gender', {
            initialValue: isAdd ? '' : '',
            rules: [{required: true, message: '短信模板不能为空'}],
          })(
            <Select placeholder="请选择" style={{width: '100%'}}>
              <Option value="">请选择</Option>
              {templateList.map(type => (
                <Option
                  key={type.shortMsgTemplateID}
                  value={type.templateTitle}
                >{type.templateTitle}
                </Option>
              ))}
            </Select>
          )
          }
        </FormItem>
        <FormItem
          label="接收人"
          labelCol={{span: 5}}
          wrapperCol={{span: 12}}
        >
          {form.getFieldDecorator('acceptNumber', {
            initialValue: isAdd ? '' : '',
            rules: [{required: true, message: '该用户没有电话号码'}],
          })(
            <Select placeholder="请选择" style={{width: '100%'}}>
              <Option value="">请选择</Option>
              {list.map(type => (
                <Option
                  key={type.userID}
                  value={type.mobile}
                >{type.userName}
                </Option>
              ))}
            </Select>
          )
          }
        </FormItem>
        <FormItem
          label="短信内容"
          labelCol={{span: 5}}
          wrapperCol={{span: 12}}
        >
          {form.getFieldDecorator('msgContent', {
            initialValue: isAdd ? '' : sends.msgContent,
            rules: [{required: true, message: '短信内容不能为空'}],
          })(
            <TextArea/>
          )}
        </FormItem>
      </Form>
    </Modal>
  );
});

@connect(({template, userList, sendMsg}) => ({
  template,
  userList,
  sendMsg,
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
    const {dispatch} = this.props;
    // 请求搜索的账户类型
    dispatch({
      type: 'template/fetch',
      payload: '',
    });
    dispatch({
      type: 'userList/fetch',
    });

    const values = {
      sendResult: 0,
    };
    const search = {};
    Object.assign(search, commonData.pageInitial, values);
    this.page(search);
  }

  // 获取分页数据
  page = (page) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'sendMsg/page',
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
    // 操作列
    tableTitles.push({
      title: '操作',
      render: (text, record) => {
        // 获取该行的id，可以获取的到，传到函数里的时候打印直接把整个表格所有行id全部打印了
        return (
          <Fragment>
            <a href="javascript: void(0)" onClick={() => this.update(record)}>修改</a>
            <Divider type="vertical"/>
            <a href="javascript: void(0)" onClick={() => this.send(record)}>发送</a>
          </Fragment>
        );
      },
    });
    return tableTitles;
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = {...obj};
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
      const {field, order} = sorter;
      params.sorter = {field, order};
    }

    dispatch({
      type: 'template/page',
      payload: params,
    });
  };
  // 重置搜索条件
  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'sendMsg/page',
      payload: commonData.pageInitial,
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };


  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  };
  // 搜索函数
  handleSearch = (e) => {
    e.preventDefault();
    const {form} = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        createTimes: fieldsValue.createTime ? fieldsValue.createTime.format('YYYY-MM-DD') : undefined,
      };
      if (values.createTime) {
        delete values.createTime;
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
      type: 'sendMsg/add',
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
      type: 'sendMsg/update',
      payload: fields,
    }).then(() => {
      this.setState({
        modalVisible: false,
      });
    });
  };
  // 导出函数
  /*  export = () => {
    const para = commonData.pageInitial;
    delete para.pageNum;
    delete para.pageSize;
    para.showJson = [];
    commonData.columns.account.attributes.forEach((item) => {
      if (item.isExport) {
        para.showJson.push({ en: item.dataIndex, cn: item.title });
      }
    }
    );
    para.showJson = JSON.stringify(para.showJson);
    this.props.dispatch({
      type: 'accountInfo/export',
      payload: para,
    });
  }; */
  // 执行删除函数
  delete = (record) => {
    this.props.dispatch({
      type: 'sendMsg/delete',
      payload: [record.shortMsgTemplateID],
    });
  };
  deleteAll = () => {
    const userIds = [];
    this.state.selectedRows.forEach((tem) => {
      userIds.push(tem.shortMsgTemplateID);
    });
    this.props.dispatch({
      type: 'sendMsg/delete',
      payload: userIds,
    });
  };

  // 修改函数
  update = (record) => {
    this.setState({
      modalVisible: !this.state.modalVisible,
      isAdd: false,
    });
    this.props.dispatch({
      type: 'sendMsg/get',
      payload: record.shortMsgID,
    });
  };
  // 发送短信
  send = (record) => {
    const createTimes = record.createTime;
    delete record.createTime;
    this.props.dispatch({
      type: 'sendMsg/sendMsgs',
      payload: {...record, createTimes},
    });
  }

  renderSimpleForm() {
    const {getFieldDecorator} = this.props.form;
    const {templateList} = this.props.template;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="短信模板">
              {getFieldDecorator('userType')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="">请选择</Option>
                  {templateList.map(type => (
                    <Option
                      key={type.shortMsgTemplateID}
                      value={type.templateTitle}
                    >{type.templateTitle}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
              <a style={{marginLeft: 8}} onClick={this.toggleForm}>
                展开 <Icon type="down"/>
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {getFieldDecorator} = this.props.form;
    const {templateList} = this.props.template;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem
              label="短信模板"
              labelCol={{span: 5}}
              wrapperCol={{span: 12}}
            >
              {getFieldDecorator('gender', {
                rules: [{required: true, message: '短信模板不能为空'}],
              })(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="">请选择</Option>
                  {templateList.map(type => (
                    <Option
                      key={type.shortMsgTemplateID}
                      value={type.templateTitle}
                    >{type.templateTitle}
                    </Option>
                  ))}
                </Select>
              )
              }
            </FormItem>
          </Col>
        </Row>
        <div style={{overflow: 'hidden'}}>
          <span style={{float: 'right', marginBottom: 24}}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
            <a style={{marginLeft: 8}} onClick={this.toggleForm}>
              收起 <Icon type="up"/>
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
    const {loading, sendMsg: {data}, sendMsg: {sends}} = this.props;
    const {templateList} = this.props.template;
    const {list} = this.props.userList;
    const {selectedRows, modalVisible} = this.state;
    const columns = this.initData();
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="待发送短信列表">
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
                  <span>
                    <Button onClick={() => this.deleteAll()}>批量删除</Button>
                    <Dropdown overlay={menu}>
                      <Button>
                        更多操作 <Icon type="down"/>
                      </Button>
                    </Dropdown>
                  </span>
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
              rowKey="shortMsgID"
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          sends={sends.data}
          isAdd={this.state.isAdd}
          list={list}
          templateList={templateList}
        />
      </PageHeaderLayout>
    );
  }
}
