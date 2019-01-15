import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, Table, TreeSelect, Modal, Popconfirm } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './index.less';
import { commonData } from '../../../../mock/commonData';

const FormItem = Form.Item;
const { Option } = Select;
const { TreeNode } = TreeSelect;
// 新增 修改页
const CreateForm = Form.create()((props) => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const { isAdd } = props;
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
      title={isAdd ? '新增系统编码' : '修改系统编码'}
      visible={modalVisible}
      onOk={okHandle}
      width="60%"
      onCancel={() => handleModalVisible()}
    >
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 10 }}
            label="编码名称"
          >
            {form.getFieldDecorator('codeName', {
              rules: [
                { required: true, message: '编码名称不能为空' },
                ],
            })(
              <Input placeholder="请输入编码名称" />
            )}
          </FormItem>
        </Col>
        <Col sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 10 }}
            label="显示名称"
          >
            {form.getFieldDecorator('codeCaption', {
              rules: [
                { required: true, message: '显示名称不能为空' },
                ],
            })(
              <Input placeholder="请输入显示名称" />
            )}
          </FormItem>
        </Col>
      </Row>

    </Modal>
  );
});

@connect(({ typeCode }) => ({
  codeTypeList: typeCode.codeTypeList,
  codeInfoList: typeCode.codeInfoList,
  selectedCode: typeCode.selectedCode,
  functionMenus: typeCode.functionMenus,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    // 弹框的显示控制
    modalVisible: false,
    // 搜索栏是否展开
    expandForm: false,
    selectedRows: [],
    //  修改还是新增
    isAdd: true,
    pagenation: {}, // 列表参数
  };
  componentDidMount() {
    const { dispatch } = this.props;
    this.getFunctionMenus();
    dispatch({
      type: 'typeCode/codeTypeList',
    }).then(() => {
      const { codeTypeList } = this.props;
      this.page(codeTypeList[0].code);
      // 保存所选择的码表类型
      dispatch({
        type: 'typeCode/saveSelectedCode',
        payload: codeTypeList[0].code,
      });
    });
  }
  // 获取页面功能权限
  getFunctionMenus = () => {
    const { dispatch, functionInfo } = this.props;
    dispatch({
      type: 'typeCode/getFunctionMenus',
      payload: { parentCode: functionInfo.functionCode },
    });
  };
  // 判断是否有该功能权限
  judgeFunction = (functionName) => {
    const { functionMenus } = this.props;
    const arr = functionMenus.filter(item => item.functionName === functionName);
    return arr.length > 0;
  };
  // 获取分页数据
  page = (codeTypeCode) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'typeCode/getCodeInfoList',
      payload: codeTypeCode,
    });
  };
  // 初始化表格数据
  initData = () => {
    const tableTitles = [];
    commonData.columns.typeCode.attributes.forEach((item) => {
      if (item.isTableItem) {
        tableTitles.push(item);
      }
    });
    // 操作列
    tableTitles.push({
      title: '操作',
      width: '20%',
      render: (text, record) => {
        // 获取该行的id，可以获取的到，传到函数里的时候打印直接把整个表格所有行id全部打印了
        return this.judgeFunction('删除权限') ? (
          <Fragment>
            <Popconfirm title="确定删除？" onConfirm={() => this.delete(record)}>
              <a href="#">删除</a>
            </Popconfirm>
          </Fragment>
        ) : null;
      },
    });
    return tableTitles;
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
  // 执行新增
  doAdd = (fields) => {
    this.props.dispatch({
      type: 'typeCode/addSystemCode',
      payload: { ...fields, codeTypeCode: this.props.selectedCode },
    }).then(() => {
      this.setState({
        modalVisible: false,
      });
      this.page(this.props.selectedCode);
    });
  };
  // 修改函数
  doUpdate = (fields) => {
    this.props.dispatch({
      type: 'planManagement/materialUpdate',
      payload: fields,
    }).then(() => {
      this.setState({
        modalVisible: false,
      });
      this.page(this.state.pagenation);
    });
  };
  // 执行删除函数
  delete = (record) => {
    this.props.dispatch({
      type: 'typeCode/deleteSystemCode',
      payload: { id: [record.codeID] },
    }).then(() => {
      this.page(this.props.selectedCode);
    });
  };
  // 导出函数
  export = () => {
    const para = commonData.pageInitial;
    delete para.pageNum;
    delete para.pageSize;
    para.showJson = [];
    commonData.columns.typeCode.attributes.forEach((item) => {
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
    this.state.selectedRows.forEach((rawMaterial) => {
      userIds.push(rawMaterial.rawMaterialID);
    });
    this.props.dispatch({
      type: 'planManagement/materialDelete',
      payload: { id: userIds },
    }).then(() => {
      this.page(this.state.pagenation);
    });
  };
  update = (record) => {
    this.setState({
      modalVisible: !this.state.modalVisible,
      isAdd: false,
    });
    this.props.dispatch({
      type: 'planManagement/materialGet',
      payload: { id: record.rawMaterialID },
    });
  };
  // 码表类型发布
  typeChange = (codeTypeCode) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'typeCode/getCodeInfoList',
      payload: codeTypeCode,
    });
    dispatch({
      type: 'typeCode/saveSelectedCode',
      payload: codeTypeCode,
    });
  };
  render() {
    const { loading, codeInfoList } = this.props;
    const { modalVisible } = this.state;
    const columns = this.initData();
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <PageHeaderLayout title="码表维护">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={8} sm={24}>
                    <FormItem label="编码类型">
                      {this.props.form.getFieldDecorator('selectedCode', {
                        initialValue: this.props.selectedCode,
                      })(
                        <Select
                          placeholder="请选择"
                          style={{ width: '100%' }}
                          onChange={this.typeChange}
                        >
                          <Option value="">请选择</Option>
                          {this.props.codeTypeList.map(type =>
                            <Option key={type.code} value={type.code}>{type.codeName}</Option>
                          )}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  {this.judgeFunction('新增权限') ? (
                    <Col md={8} sm={24}>
                      <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                        新增
                      </Button>
                    </Col>
                  ) : null}
                </Row>
              </Form>
            </div>
            <Table
              // selectedRows={selectedRows}
              loading={loading}
              dataSource={codeInfoList}
              columns={columns}
              // onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey="codeID"
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          isAdd={this.state.isAdd}
        />
      </PageHeaderLayout>
    );
  }
}
