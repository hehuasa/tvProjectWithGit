import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Upload from 'rc-upload';
import { Form, Row, Col, Card, Input, Select, Icon, Button, TreeSelect, message, DatePicker,
  Modal, Divider, Popconfirm, notification, Table } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import StandardTable from '../../components/StandardTable';
import PlanInfo from './EditPlan/index';
import ShowPlanInfo from './PlanInfo/index';
import { commonData } from '../../../mock/commonData';
import styles from './planManagement.less';


const FormItem = Form.Item;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const errCols = [
  { title: '错误项目', dataIndex: 'cellName', width: '20%' },
  { title: '错误信息', dataIndex: 'content', width: '80%' },
];


@connect(({ planManagement, organization, user, loading }) => ({
  planManagement,
  annexPage: planManagement.annexPage,
  planLevelList: planManagement.planLevelData,
  preplanType: planManagement.preplanType,
  planBasicInfo: planManagement.planBasicInfo,
  functionMenus: planManagement.functionMenus,
  orgTreeData: organization.orgTree,
  currentUser: user.currentUser,
  loading,
}))

@Form.create()
export default class Analysis extends PureComponent {
  state = {
    // 弹框的显示控制
    modalVisible: false,
    // 搜索栏是否展开
    expandForm: false,
    selectedRows: [],
    formValues: {},
    //  修改 还是 新增为null
    clickRow: null,
    planInfoVisible: false,
    planInfoID: null,
    planInfo: {},
  };
  componentDidMount() {
    this.page(commonData.pageInitial);
    this.getFunctionMenus();
    // 请求预案级别
    this.props.dispatch({
      type: 'planManagement/planLevelData',
    });
    // 请求应急组织机构树
    this.props.dispatch({
      type: 'organization/getEmgcOrgTree',
    });
    // 请求实体组织机构树
    this.props.dispatch({
      type: 'organization/getOrgTree',
    });
    // 请求预案类型
    this.props.dispatch({
      type: 'planManagement/preplanType',
    });
  }
  // 获取分页数据
  page = (page) => {
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        ...page,
      };
      // 防止将空作为查询条件
      for (const obj in values) {
        if (values[obj] === '' || values[obj] === undefined) {
          delete values[obj];
        }
      }
      const search = { isQuery: true, fuzzy: true };
      Object.assign(search, commonData.pageInitial, values);
      dispatch({
        type: 'planManagement/page',
        payload: search,
      });
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, form } = this.props;
    const { formValues } = this.state;
    form.validateFields((err, fieldsValue) => {
      const filters = Object.keys(filtersArg).reduce((obj, key) => {
        const newObj = { ...obj };
        newObj[key] = getValue(filtersArg[key]);
        return newObj;
      }, {});
      const params = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        isQuery: true,
        fuzzy: true,
        ...formValues,
        ...filters,
        ...fieldsValue,
      };
      if (sorter.field) {
        // params.sorter = `${sorter.field}_${sorter.order}`;
        const { field, order } = sorter;
        params.sorter = { field, order };
      }

      dispatch({
        type: 'planManagement/page',
        payload: params,
      });
    });
  };
  // 重置搜索条件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    form.setFieldsValue({
      statu: null,
    });
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'planManagement/page',
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
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        planName: fieldsValue.planName,
        statu: fieldsValue.statu,
        //   createTimes: fieldsValue.createTime ? fieldsValue.createTime.format('YYYY-MM-DD') : undefined,
      };
      // 防止将空作为查询条件
      for (const obj in values) {
        if (values[obj] === '' || values[obj] === undefined) {
          delete values[obj];
        }
      }
      const search = { isQuery: true, fuzzy: true };
      Object.assign(search, commonData.pageInitial, values);
      this.page(search);
    });
  };
  // 打开和关闭modal
  handleModalVisible = (flag) => {
    if (!flag) {
      this.props.dispatch({
        type: 'planManagement/addIsDeleteData',
      });
    }
    this.setState({
      modalVisible: !!flag,
      clickRow: null,
    });
  };

  // 新增
  handleAdd = (fields) => {
    if (this.state.clickRow) {
      this.doAdd(fields);
    } else {
      this.doUpdate(fields);
    }
  };
  doAdd = (fields) => {
    this.props.dispatch({
      type: 'planManagement/add',
      payload: fields,
    }).then(() => {
      if (this.props.planManagement.toggle) {
        this.setState({
          modalVisible: false,
        });
        this.page(commonData.pageInitial);
      }
    });
  };
  // 修改函数
  doUpdate = (fields) => {
  };
  // 执行删除函数
  delete = (id) => {
    this.props.dispatch({
      type: 'planManagement/delete',
      payload: { id },
    }).then(() => {
      const { data: { pagination: { current, pageSize } } } = this.props.planManagement;
      this.page({ current, pageSize });
    });
  };
  deleteAll = () => {
    const arr = [];
    this.state.selectedRows.forEach((user) => {
      arr.push(user.planInfoID);
    });
    this.props.dispatch({
      type: 'planManagement/delete',
      payload: { id: arr },
    }).then(() => {
      this.page(commonData.pageInitial);
    });
  };
  //  修改
  update = (record) => {
    // 请求预案信息
    this.props.dispatch({
      type: 'planManagement/getPlanInfo',
      payload: {
        id: record.planInfoID,
      },
    }).then(() => {
      this.setState({
        clickRow: record,
        modalVisible: true,
      });
    });
  };
  onFileChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功.`);
      this.handleFormReset();
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败.`);
    }
  };
  beforeUpload = (file) => {
    const isXls = file.name.endsWith('.xls');
    const isXlsx = file.name.endsWith('.xlsx');
    if (!isXls && !isXlsx) {
      message.error('格式错误！请上传正确的Excel表格');
    }
    return isXls || isXlsx;
  };
  onStart = (file) => {
    console.log('onStart', file.name);
    // this.refs.inner.abort(file);
  };
  onSuccess = (file) => {
    console.log('onSuccess', file);
    if (file.code === 1001) {
      message.success('上传成功');
      this.page(commonData.pageInitial);
    } else if (file.code === 1018) {
      Modal.error({
        centered: true,
        okText: '确定',
        width: 600,
        title: '上传失败',
        content: <Table
          size="small"
          columns={errCols}
          dataSource={file.data.map((item, key) => {
                              return { ...item, key };
        })}
        />,
      });
    }
  };
  onProgress = (step, file) => {
    console.log('onProgress', Math.round(step.percent), file.name);
  };
  onError = (err) => {
    message.error('上传时出错,请检查服务器或则网络配置');
  };
  //  复制预案
  copyPlan = (record) => {
    // 请求预案信息
    this.props.dispatch({
      type: 'planManagement/getPlanInfo',
      payload: {
        id: record.planInfoID,
      },
    }).then(() => {
      const { planBasicInfo } = this.props;
      const { baseUserInfo } = this.props.currentUser;
      const { userID } = baseUserInfo;
      this.props.dispatch({
        type: 'planManagement/updatePlanInfo',
        payload: {
          flowID: planBasicInfo.flowID,
          version: planBasicInfo.version,
          statu: planBasicInfo.statu,
          planInfoID: planBasicInfo.planInfoID,
          planName: planBasicInfo.planName,
          userPlanCode: planBasicInfo.userPlanCode,
          planType: planBasicInfo.planType,
          planLevelID: planBasicInfo.planLevelID,
          emgcOrgID: planBasicInfo.emgcOrgID,
          applyObjectName: planBasicInfo.applyObjectName,
          orgID: planBasicInfo.orgID,
          attention: planBasicInfo.attention,
          userID },
      }).then(() => {
        this.page(commonData.pageInitial);
      });
    });
  };
  okHandle = (flag) => {
    this.setState({
      modalVisible: false,
      clickRow: null,
    });
  };
  // 改变预案状态
  changeStatu = (planInfoID, statu) => {
    const { data } = this.props.planManagement;
    this.props.dispatch({
      type: 'planManagement/changePlanStatu',
      payload: { planInfoID, statu },
    }).then(() => {
      const pageNum = data.pagination.current;
      const { pageSize } = data.pagination;
      this.page({ pageNum, pageSize });
    });
  };
  // 获取页面功能权限
  getFunctionMenus = () => {
    const { dispatch, functionInfo } = this.props;
    dispatch({
      type: 'planManagement/getFunctionMenus',
      payload: { parentCode: functionInfo.functionCode },
    });
  };
  // 判断是否有该功能权限
  judgeFunction = (functionName) => {
    const { functionMenus } = this.props;
    const arr = functionMenus.filter(item => item.functionName === functionName);
    return arr.length > 0;
  };
  // 查看预案详情
  show = (record) => {
    const { planInfoID } = record;
    this.props.dispatch({
      type: 'planManagement/getPlanInfo',
      payload: {
        id: planInfoID,
      },
    }).then(() => {
      this.setState({
        clickRow: record,
        planInfoVisible: true,
      });
    });
  };
  // 关闭预案详情
  handleCancel = () => {
    this.setState({
      planInfoVisible: false,
    });
  };
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const { planLevelList, orgTreeData } = this.props;
    const renderDeptTreeNodes = (data) => {
      return data.map((item) => {
        if (item.children) {
          return (
            <TreeNode
              title={item.orgnizationName}
              key={item.orgID}
              value={`${item.orgID}`}
            >
              {renderDeptTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            title={item.orgnizationName}
            key={item.orgID}
            value={`${item.orgID}`}
          />
        );
      });
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="预案名称">
              {getFieldDecorator('planName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="预案状态">
              {getFieldDecorator('statu', {
                initialValue: 0,
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value={null}>请选择</Option>
                  <Option value={0}>启用</Option>
                  <Option value={1}>停用</Option>
                  <Option value={3}>导入</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          {this.judgeFunction('上传权限') ? (
            <Col md={2}>
              <Upload
                action="/emgc/plan/import/doExcel"
                onStart={this.onStart}
                beforeUpload={this.beforeUpload}
                onError={this.onError}
                onSuccess={this.onSuccess}
                onProgress={this.onProgress}
                style={{ marginLeft: 8 }}
              >
                <Button><Icon type="upload" /> 上传</Button>
              </Upload>
            </Col>
          ) : null}
          <Col md={10} sm={24}>
            <span className={styles.submitButtons}>
              {this.judgeFunction('新增权限') ? (
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新增
                </Button>
              ) : null}
              <Button type="primary" style={{ marginLeft: 8 }} htmlType="submit">查询</Button>
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
    const { planLevelList, orgTreeData, preplanType } = this.props;
    const renderDeptTreeNodes = (data) => {
      return data.map((item) => {
        if (item.children) {
          return (
            <TreeNode
              title={item.orgnizationName}
              key={item.orgID}
              value={`${item.orgID}`}
            >
              {renderDeptTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            title={item.orgnizationName}
            key={item.orgID}
            value={`${item.orgID}`}
          />
        );
      });
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col lg={6} md={12} sm={24}>
            <FormItem label="预案名称">
              {getFieldDecorator('planName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="预案状态">
              {getFieldDecorator('statu', {
                initialValue: 0,
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value={null}>请选择</Option>
                  <Option value={0}>启用</Option>
                  <Option value={1}>停用</Option>
                  <Option value={3}>导入</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <FormItem label="编制部门">
              {getFieldDecorator('orgID')(
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择所属部门"
                  treeNodeFilterProp="title"
                  allowClear
                  onChange={this.onChange}
                >
                  {renderDeptTreeNodes(orgTreeData)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col lg={6} md={12} sm={24}>
            <FormItem label="预案分类">
              {getFieldDecorator('planType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Select.Option value="">请选择</Select.Option>
                  { preplanType.map(item => (
                    <Select.Option key={item.code} value={item.code} >{item.codeName}</Select.Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <FormItem label="预案编码">
              {getFieldDecorator('userPlanCode')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          {this.judgeFunction('上传权限') ? (
            <Col md={2}>
              <Upload
                action="/emgc/plan/import/doExcel"
                onStart={this.onStart}
                beforeUpload={this.beforeUpload}
                onError={this.onError}
                onSuccess={this.onSuccess}
                onProgress={this.onProgress}
                style={{ marginLeft: 8 }}
              >
                <Button><Icon type="upload" /> 上传</Button>
              </Upload>
            </Col>
          ) : null}
          <Col lg={10} md={12} sm={24}>
            <span className={styles.submitButtons}>
              {this.judgeFunction('新增权限') ? (
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新增
                </Button>
              ) : null}
              <Button type="primary" style={{ marginLeft: 8 }} htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
  render() {
    const { data } = this.props.planManagement;
    const { loading } = this.props;
    const { selectedRows, modalVisible, clickRow } = this.state;
    const columns = [
      {
        title: '预案名称',
        dataIndex: 'planName',
        width: 220,
      },
      {
        title: '预案级别',
        dataIndex: 'planPlanLevel',
        width: 120,
        render: (text) => {
          return text ? text.levelName : '';
        },
      },
      {
        title: '编制部门',
        dataIndex: 'organizationName',
        width: 120,
      },
      {
        title: '应急组织',
        dataIndex: 'emgOrganization',
        width: 240,
        render: (text) => {
          return text ? text.orgnizationName : '';
        },
      },
      {
        title: '预案分类',
        dataIndex: 'planTypeName',
        width: 100,
      },
      {
        title: '预案编号',
        dataIndex: 'userPlanCode',
        width: 120,
      },
      {
        title: '版本',
        dataIndex: 'version',
        width: 60,
      },
      {
        title: '状态',
        dataIndex: 'statu',
        width: 60,
        render: (text) => {
          switch (text) {
            case 0: return '启用';
            case 1: return '停用';
            case 3: return '导入';
            default: return '未知';
          }
        },
      },
      {
        title: '记录维护人员',
        dataIndex: 'baseUserInfo',
        width: 150,
        render: (text) => {
          return text ? text.userName : '';
        },
      },
      {
        title: '发布时间',
        dataIndex: 'releaseTime',
        // width: 180,
        render: (val) => {
          if (!val) {
            return '';
          }
          return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: '操作',
        width: 260,
        fixed: 'right',
        render: (text, record) => {
          // 获取该行的id，可以获取的到，传到函数里的时候打印直接把整个表格所有行id全部打印了
          return (
            <Fragment>
              <a href="#" onClick={() => this.show(record)}>查看</a>
              {
                record.statu === 0 ? (this.judgeFunction('复制权限') ? (
                  <span>
                    <Divider type="vertical" />
                    <a href="#" onClick={() => this.copyPlan(record)}>复制</a>
                  </span>) : null) :
                  (this.judgeFunction('修改权限') ? (
                    <span>
                      <Divider type="vertical" />
                      <a href="#" onClick={() => this.update(record)}>修改</a>
                    </span>) : null)
              }
              { this.judgeFunction('启停用权限') ? (
                <span>
                  <Divider type="vertical" />
                  <Popconfirm title="确定将预案状态改为启用？" onConfirm={() => this.changeStatu(record.planInfoID, 0)}>
                    <a href="#">启用</a>
                  </Popconfirm>
                  <Divider type="vertical" />
                  <Popconfirm title="确定将预案状态改为停用？" onConfirm={() => this.changeStatu(record.planInfoID, 1)}>
                    <a href="#">停用</a>
                  </Popconfirm>
                </span>
              ) : null}
              { this.judgeFunction('删除权限') ? (
                <span>
                  <Divider type="vertical" />
                  <Popconfirm title="确定删除此预案？" onConfirm={() => this.delete(record.planInfoID)}>
                    <a href="#">删除</a>
                  </Popconfirm>
                </span>
              ) : null}
              {/* { this.judgeFunction('草稿权限') ? ( */}
              {/* <span> */}
              {/* <Divider type="vertical" /> */}
              {/* <Popconfirm title="确定将预案状态改为草稿？" onConfirm={() => this.changeStatu(record.planInfoID, 3)}> */}
              {/* <a href="#">草稿</a> */}
              {/* </Popconfirm> */}
              {/* </span> */}
              {/* ) : null} */}
            </Fragment>
          );
        },
      },
    ];
    // const parentMethods = {
    //   handleAdd: this.handleAdd,
    //   handleModalVisible: this.handleModalVisible,
    // };85c9c80a582641739aa68a2b3dbc66a6.png
    return (
      <PageHeaderLayout title="预案列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading.effects['plan/planPlanInfo/page']}
              discheckeble
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey="planInfoID"
              scroll={{ x: 1630 }}
            />
          </div>
        </Card>
        <Modal
          bodyStyle={{ height: 600 }}
          destroyOnClose
          confirmLoading={loading.global}
          title={clickRow ? '修改' : '新增'}
          visible={modalVisible}
          onOk={this.okHandle}
          width="80%"
          onCancel={() => this.handleModalVisible()}
        >
          <PlanInfo
            planInfoId={clickRow ? clickRow.planInfoID : null}
            handleModalVisible={this.handleModalVisible}
            hideFooter
          />
        </Modal>
        <Modal
          title="预案详情"
          cancelText="关闭"
          footer={false}
          width="80%"
          visible={this.state.planInfoVisible}
          mask={false}
          maskClosable={false}
          destroyOnClose
          onCancel={this.handleCancel}
        >
          <ShowPlanInfo isEdit={false} planInfo={this.state.planInfo} planInfoID={this.state.planInfoID} />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
