import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, TreeSelect,
  DatePicker, Modal, message, Divider, Popconfirm, Radio, Tabs, Tree, Table, InputNumber } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import SelectResource from './SelectResource/index';
import { commonData } from '../../../mock/commonData';
import { getUUID } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
const RadioGroup = Radio.Group;
const { TabPane } = Tabs;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
// 新增 修改页
const CreateForm = Form.create()((props) => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const { onLoadData, onCheck, msgGroupRowChange, msgGroupPageChange, addCustomUser, closeCustom,
    customUsers, onAlarmRangeChange, onByOrgChange, onByProfessionChange, onAlarmTypeChange,
    professionPageChange, alarmTypePageChange, orgTreeOnCheck, professionRowChange, alarmTypeRowChange,
  } = props;
  const { orgTree, msgGroup, alarmRange, byOrg, byProfession, alarmType, professionPage,
    alarmTypePage, checkedOrgIDs, professionIDs, alarmTypeIDs, msgGroupIDs } = props;
  const { msgRuleInfo, isAdd } = props;
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
            dataRef={item}
          >
            {renderDeptTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={item.orgnizationName}
          dataRef={item}
          isLeaf
          key={item.orgID}
          value={item.orgID}
        />
      );
    });
  };
  // 短信分组人员
  const groupCols = [
    {
      title: '组名',
      dataIndex: 'groupName',
      key: 'groupName',
    }, {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    }];
  // 自定义人员表头
  const columns = [
    {
      title: '姓名',
      dataIndex: 'userName',
      key: 'userName',
    }, {
      title: '电话',
      dataIndex: 'mobile',
      key: 'mobile',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="javascript:;" onClick={() => closeCustom(record)}>移除</a>
        </span>
      ),
    }];
  // 专业系统表头
  const professionCols = [
    {
      title: '专业系统编码',
      dataIndex: 'professionSystemCode',
      width: '20%',
      key: 'professionSystemCode',
    }, {
      title: '专业系统名称',
      dataIndex: 'professionSystemName',
      width: '25%',
      key: 'professionSystemName',
    }, {
      title: '所属专业',
      dataIndex: 'professionType',
      width: '20%',
      key: 'professionType',
    }, {
      title: '说明',
      dataIndex: 'remark',
      width: '35%',
      key: 'remark',
    }];
  // 报警类型
  const alarmTypeCols = [
    {
      title: '类型名称',
      dataIndex: 'alarmTypeName',
      width: '20%',
      key: 'alarmTypeName',
    }, {
      title: '专业系统',
      dataIndex: 'professionSystemName',
      width: '20%',
      key: 'professionSystemName',
    }, {
      title: '报警级别',
      dataIndex: 'alarmLevel',
      width: '20%',
      key: 'alarmLevel',
    }, {
      title: '警情级别',
      dataIndex: 'dangerCoefficient',
      width: '20%',
      key: 'dangerCoefficient',
    }, {
      title: '分类',
      dataIndex: 'alarmTypeModel',
      width: '10%',
      key: 'alarmTypeModel',
    }];
  const rangeExtra = (
    <RadioGroup onChange={onAlarmRangeChange} value={alarmRange}>
      {commonData.deviceSelectType.map((obj) => {
        return (
          <Radio key={obj.id} value={obj.value}>{obj.text}</Radio>
        );
      })}
    </RadioGroup>
  );
  const actionExtra = (
    <Select defaultValue="" style={{ width: 120 }}>
      <Option value="">发送短信</Option>
    </Select>
  );

  return (
    <Modal
      destroyOnClose
      title={isAdd ? '新增规则' : '修改规则'}
      visible={modalVisible}
      onOk={okHandle}
      width="80%"
      onCancel={() => handleModalVisible()}
    >
      <Scrollbars
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        autoHeight
        autoHeightMin={600}
      >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <FormItem>
            {form.getFieldDecorator('dealRuleID', {
            initialValue: isAdd ? '' : msgRuleInfo.dealRuleID,
            rules: [],
          })(
            <Input type="hidden" />
          )}
          </FormItem>
          <Col md={8} sm={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="规则名称"
            >
              {form.getFieldDecorator('ruleName', {
                initialValue: isAdd ? '' : msgRuleInfo.ruleName,
              rules: [
                { required: true, message: '规则名不允许为空' },
              ],
            })(
              <Input placeholder="请输入规则名称" />
            )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="持续时间"
            >
              {form.getFieldDecorator('onTime', {
                initialValue: isAdd ? 0 : msgRuleInfo.onTime,
              rules: [],
            })(
              <InputNumber min={0} />
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
                initialValue: isAdd ? '' : msgRuleInfo.remark,
              rules: [],
            })(
              <TextArea placeholder="请输入说明" />
            )}
            </FormItem>
          </Col>
        </Row>
        <Card title="设备选择类型" extra={rangeExtra}>
          {alarmRange === 1 ? (
            <Tabs defaultActiveKey="1">
              <TabPane tab="按部门" key="1">
                <RadioGroup onChange={onByOrgChange} value={byOrg}>
                  {commonData.byOrg.map((obj) => {
                    return (
                      <Radio key={obj.id} value={obj.value}>{obj.text}</Radio>
                    );
                  })}
                </RadioGroup>
                { byOrg === 3 ? (
                  <div className={styles.tree}>
                    <Tree
                      onCheck={orgTreeOnCheck}
                      checkedKeys={checkedOrgIDs}
                      defaultExpandedKeys={checkedOrgIDs}
                      checkable
                    >
                      {renderDeptTreeNodes([orgTree])}
                    </Tree>
                  </div>
                ) : null
                }
              </TabPane>
              <TabPane tab="按专业系统" key="2">
                <RadioGroup onChange={onByProfessionChange} value={byProfession}>
                  {commonData.byProfession.map((obj) => {
                    return (
                      <Radio key={obj.id} value={obj.value}>{obj.text}</Radio>
                    );
                  })}
                </RadioGroup>
                { byProfession === 2 ? (
                  <Card style={{ marginTop: 8 }}>
                    <Table
                      style={{ marginTop: 8 }}
                      columns={professionCols}
                      rowSelection={{
                        onChange: professionRowChange,
                        selectedRowKeys: professionIDs,
                      }}
                      pagination={{
                        ...professionPage.pagination,
                        onChange: professionPageChange,
                      }}
                      dataSource={professionPage.data}
                      rowKey={record => record.professionSystemID}
                    />
                  </Card>
                ) : null
                }
              </TabPane>
            </Tabs>
          ) : null}
          {alarmRange === 2 ? (
            <SelectResource />
          ) : null}
          <Divider>报警类型</Divider>
          <RadioGroup onChange={onAlarmTypeChange} value={alarmType}>
            {commonData.byAlarmType.map((obj) => {
              return (
                <Radio key={obj.id} value={obj.value}>{obj.text}</Radio>
              );
            })}
          </RadioGroup>
          { alarmType === 2 ? (
            <Card style={{ marginTop: 8 }}>
              <Table
                style={{ marginTop: 8 }}
                columns={alarmTypeCols}
                rowSelection={{
                  onChange: alarmTypeRowChange,
                  selectedRowKeys: alarmTypeIDs,
                }}
                pagination={{
                  ...alarmTypePage.pagination,
                  onChange: alarmTypePageChange,
                }}
                dataSource={alarmTypePage.data}
                rowKey={record => record.alarmTypeID}
              />
            </Card>
          ) : null
          }
        </Card>
        <Card title="报警动作" style={{ marginTop: 8 }} extra={actionExtra}>
          <Tabs type="card">
            <TabPane tab="组织机构人员" key="1">
              <Tree
                loadData={onLoadData}
                onCheck={onCheck}
                checkable
              >
                {renderDeptTreeNodes([orgTree])}
              </Tree>
            </TabPane>
            <TabPane tab="短信分组" key="2">
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Table
                  columns={groupCols}
                  dataSource={msgGroup.data}
                  rowSelection={{
                    onChange: msgGroupRowChange,
                    selectedRowKeys: msgGroupIDs,
                }}
                  pagination={{
                  ...msgGroup.msgGroup,
                  onChange: msgGroupPageChange,
                }}
                  rowKey={record => record.shortMsgUserGroupID}
                />
              </Row>
            </TabPane>
            <TabPane tab="自定义接收人" key="3">
              <AddCustom
                addCustomUser={addCustomUser}
              />
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Table rowKey={record => record.id} columns={columns} dataSource={customUsers} />
              </Row>
            </TabPane>
          </Tabs>
        </Card>
      </Scrollbars>
    </Modal>
  );
});
const AddCustom = Form.create()((props) => {
  const { addCustomUser, form } = props;
  return (
    <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
      <Col md={9} sm={24}>
        <FormItem
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          label="姓名"
        >
          {form.getFieldDecorator('userName', {
            rules: [],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
      </Col>
      <Col md={9} sm={24}>
        <FormItem
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          label="电话"
        >
          {form.getFieldDecorator('mobile', {
            rules: [
              { pattern: /^1[3|4|5|7|8]\d{9}$/, message: '请输入正确的手机号' },
            ],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
      </Col>
      <Col md={6} sm={24}>
        <FormItem
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          label=""
        >
          <div className={styles.addBtn} onClick={() => addCustomUser(form)}>
            <Icon type="plus-circle" />
          </div>
        </FormItem>
      </Col>
    </Row>
  );
});
@connect(({ template }) => ({
  orgTree: template.orgTree,
  msgGroup: template.msgGroup,
  customUsers: template.customUsers,
  orgUsers: template.orgUsers,
  checkedUsers: template.checkedUsers,
  alarmRange: template.alarmRange,
  byOrg: template.byOrg,
  byProfession: template.byProfession,
  alarmType: template.alarmType,
  professionPage: template.professionPage,
  alarmTypePage: template.alarmTypePage,
  checkedOrgIDs: template.checkedOrgIDs,
  professionIDs: template.professionIDs,
  alarmTypeIDs: template.alarmTypeIDs,
  msgGroupIDs: template.msgGroupIDs,
  resourceIDs: template.resourceIDs,
  msgRulePage: template.msgRulePage,
  msgRuleInfo: template.msgRuleInfo,
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
    // 请求部门树
    dispatch({
      type: 'template/getOrgTree',
    });
    //  获取分组信息
    this.msgGroupPage(commonData.pageInitial);
    this.page(commonData.pageInitial);
  }
  // 获取分页数据
  page = (page) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'template/msgRulePage',
      payload: page,
    });
  };
  // 获取短信分页数据
  msgGroupPage = (page) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'template/msgGroupPage',
      payload: page,
    });
  };
  // 专业系统
  professionPage = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'template/professionPage',
      payload: { pageNum, pageSize },
    });
  };
  // 报警类型
  alarmTypePage = (pageNum, pageSize) => {
    const { dispatch, alarmRange, professionIDs, resourceIDs } = this.props;
    const data = alarmRange === 1 ? {
      professionSystemIDs: professionIDs,
    } : {
      resourceIDs,
    };
    dispatch({
      type: 'template/alarmTypePage',
      payload: { pageNum, pageSize, ...data, deviceSelectType: alarmRange },
    });
  };
  // 短信规则 按部门 保存选中的部门ID
  orgTreeOnCheck = (checkedKeys) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'template/saveCheckedOrgIDs',
      payload: checkedKeys,
    });
  };
  // 短信规则 按专业系统 保存选中的部门ID
  professionRowChange = (selectedRowKeys) => {
    const { dispatch, alarmRange } = this.props;
    dispatch({
      type: 'template/saveProfessionIDs',
      payload: selectedRowKeys,
    });
    // 跟新报警类型
    dispatch({
      type: 'roleInfo/alarmTypePage',
      payload: {
        pageNum: 1,
        pageSize: 5,
        professionSystemIDs: selectedRowKeys,
        deviceSelectType: alarmRange,
      },
    });
  };
  // 短信规则 报警类型 保存选中报警部门ID
  alarmTypeRowChange = (selectedRowKeys) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'template/saveAlarmTypeID',
      payload: selectedRowKeys,
    });
  };
  // 短信规则 报警动作 选中的接收组
  msgGroupRowChange = (selectedRowKeys) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'template/saveMsgGroupIDs',
      payload: selectedRowKeys,
    });
  };
  // 短信分组选中取消函数
  msgGroupPageChange = (pageNum, pageSize) => {
    this.msgGroupPage({ pageNum, pageSize });
  };
  // 初始化表格数据
  initData = () => {
    const tableTitles = [];
    commonData.columns.msgRule.attributes.forEach((item) => {
      if (item.isTableItem) {
        tableTitles.push(item);
      }
    });
    // 操作列
    tableTitles.push({
      title: '操作',
      width: 160,
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
      type: 'template/msgRulePage',
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
    this.resetValue();
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
    const { alarmRange, checkedOrgIDs, professionIDs, byOrg,
      byProfession, resourceIDs, alarmTypeIDs, alarmType,
      customUsers, checkedUsers, msgGroupIDs } = this.props;
    const orgList = checkedOrgIDs.map(obj => parseInt(obj, 0));
    const orgData = alarmRange === 1 ? {
      orgList,
      byOrg,
      professionList: professionIDs,
      byProfession,
    } : {
      dealPointList: resourceIDs,
    };
    const userInfoList = {
      userIDS: checkedUsers.map(user => user.userID),
      groupIDs: msgGroupIDs,
      customs: customUsers,
    };
    const data = {
      ...fields,
      deviceSelectType: alarmRange, // 报警选择范围
      alarmTypeList: alarmTypeIDs, // 选择的报警类型
      byAlarmType: alarmType, // 报警类型
      ...orgData, // 部门和专业
      userInfoList, // 报警短信接收人员
    };
    this.props.dispatch({
      type: 'template/msgRuleAdd',
      payload: { ruleJson: JSON.stringify(data) },
    }).then(() => {
      this.page(commonData.pageInitial);
      this.setState({
        modalVisible: false,
      });
    });
  };
  // 修改函数
  doUpdate = (fields) => {
    const { alarmRange, checkedOrgIDs, professionIDs, byOrg,
      byProfession, resourceIDs, alarmTypeIDs, alarmType,
      checkedUsers, msgGroupIDs, customUsers } = this.props;
    const orgList = checkedOrgIDs.map(obj => parseInt(obj, 0));
    const orgData = alarmRange === 1 ? {
      orgList,
      byOrg,
      professionList: professionIDs,
      byProfession,
    } : {
      dealPointList: resourceIDs,
    };
    const userInfoList = {
      userIDS: checkedUsers.map(user => user.userID),
      groupIDs: msgGroupIDs,
      customs: customUsers,
    };
    const data = {
      ...fields,
      deviceSelectType: alarmRange, // 报警选择范围
      alarmTypeList: alarmTypeIDs, // 选择的报警类型
      byAlarmType: alarmType, // 报警类型
      ...orgData, // 部门和专业
      userInfoList, // 报警短信接收人员
    };
    this.props.dispatch({
      type: 'template/msgRuleUpdate',
      payload: { ruleJson: JSON.stringify(data) },
    }).then(() => {
      this.page(commonData.pageInitial);
      this.setState({
        modalVisible: false,
      });
    });
  };
  // 执行删除函数
  delete = (record) => {
    this.props.dispatch({
      type: 'template/msgRuleDelete',
      payload: { id: [record.dealRuleID] },
    }).then(() => {
      this.page(commonData.pageInitial);
    });
  };
  // 导出函数
  export = () => {
    const para = commonData.pageInitial;
    delete para.pageNum;
    delete para.pageSize;
    para.showJson = [];
    commonData.columns.msgRule.attributes.forEach((item) => {
      if (item.isExport) {
        para.showJson.push({ en: item.dataIndex, cn: item.title });
      }
    }
    );
    para.showJson = JSON.stringify(para.showJson);
    this.props.dispatch({
      type: 'template/export',
      payload: para,
    });
  };
  deleteAll = () => {
    const userIds = [];
    this.state.selectedRows.forEach((user) => {
      userIds.push(user.dealRuleID);
    });
    this.props.dispatch({
      type: 'template/msgRuleDelete',
      payload: { id: userIds },
    }).then(() => {
      this.page(commonData.pageInitial);
    });
  };
  update = (record) => {
    this.setState({
      modalVisible: !this.state.modalVisible,
      isAdd: false,
    });
    this.props.dispatch({
      type: 'template/getMsgRule',
      payload: { id: record.dealRuleID },
    }).then(() => {
      this.alarmTypePage(1, 5);
    });
  };
  // 异步加载组织机构下的人员
  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children.length > 0) {
        resolve();
        return;
      }
      this.props.dispatch({
        type: 'template/getOrgUsers',
        payload: { orgID: treeNode.props.dataRef.orgID },
      }).then(() => {
        treeNode.props.dataRef.children = this.props.orgUsers;
        const arr = JSON.stringify(this.props.orgTree);
        this.props.dispatch({
          type: 'template/saveOrgTree',
          payload: JSON.parse(arr),
        });
        resolve();
      });
    });
  };
  // 点击复选框
  onCheck = (checkedKeys, { checked: bool, node: { props } }) => {
    const { dataRef } = props;
    if (props.isLeaf) {
      this.props.dispatch({
        type: 'template/saveCheckedUsers',
        payload: bool ? this.addReceptor(this.props.checkedUsers, dataRef) :
          this.deleteReceptor(this.props.checkedUsers, dataRef),
      });
    } else {
      this.props.dispatch({
        type: 'template/getOrgUsers',
        payload: { orgID: dataRef.orgID },
      }).then(() => {
        this.props.orgUsers.forEach((user) => {
          this.props.dispatch({
            type: 'template/saveCheckedUsers',
            payload: bool ? this.addReceptor(this.props.checkedUsers, user) :
              this.deleteReceptor(this.props.checkedUsers, user),
          });
        });
      });
    }
  };
  // 短信分组选中取消函数
  tableCheckChange = (selected, changeRows) => {
    changeRows.forEach((group) => {
      if (selected) {
        const arr = [...this.props.msgGroupUsers, ...group.userIDList, ...group.userList];
        this.props.dispatch({
          type: 'template/saveMsgGroupUsers',
          payload: arr,
        });
      } else {
        const arr = this.props.msgGroupUsers.filter(user => user.shortMsgUserGroupID !== group.shortMsgUserGroupID);
        this.props.dispatch({
          type: 'template/saveMsgGroupUsers',
          payload: arr,
        });
      }
    });
  };
  // 添加自定义人员
  addCustomUser = (form) => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { customUsers } = this.props;
      const arr = [...customUsers, { ...fieldsValue, id: getUUID() }];
      this.props.dispatch({
        type: 'template/saveCustomUsers',
        payload: arr,
      });
      form.resetFields();
    });
  };
  // 去掉自定义接收人
  closeCustom = (custom) => {
    const arr = this.props.customUsers.filter(user => user.id !== custom.id);
    this.props.dispatch({
      type: 'template/saveCustomUsers',
      payload: arr,
    });
  };
  addReceptor = (arr, obj) => {
    const array = arr.filter(item => item.userID === obj.userID);
    if (!array.length > 0) {
      return [...arr, obj];
    }
    return arr;
  };
  // 删除接收人
  deleteReceptor = (arr, obj) => {
    return arr.filter(temp => temp.userID !== obj.userID);
  };
  // 规则 报警范围变化变化函数
  onAlarmRangeChange = (e) => {
    this.props.dispatch({
      type: 'template/saveAlarmRange',
      payload: e.target.value,
    });
  };
  // 规则 按部门的类型变化函数
  onByOrgChange = (e) => {
    this.props.dispatch({
      type: 'template/saveByOrg',
      payload: e.target.value,
    });
  };
  // 规则 按专业系统的类型变化函数
  onByProfessionChange = (e) => {
    this.props.dispatch({
      type: 'template/saveByProfession',
      payload: e.target.value,
    });
    if (e.target.value === 2) {
      this.professionPage(1, 5);
    }
  };
  // 规则 报警类型变化函数
  onAlarmTypeChange = (e) => {
    if (e.target.value === 2) {
      this.alarmTypePage(1, 5);
    }
    this.props.dispatch({
      type: 'template/saveAlarmType',
      payload: e.target.value,
    });
  };
  // 新增修改时 重置参数
  resetValue = () => {
    const { dispatch } = this.props;
    // 默认选中部门+专业系统
    dispatch({
      type: 'template/saveAlarmRange',
      payload: 1,
    });
    // 默认选中 全部门
    dispatch({
      type: 'template/saveByOrg',
      payload: 1,
    });
    // 默认选中 全专业
    dispatch({
      type: 'template/saveByProfession',
      payload: 1,
    });
    // 默认选中 全类型
    dispatch({
      type: 'template/saveAlarmType',
      payload: 1,
    });
    // 清空选中的机构
    dispatch({
      type: 'template/saveCheckedOrgIDs',
      payload: [],
    });
    // 清空选中的专业系统
    dispatch({
      type: 'template/saveProfessionIDs',
      payload: [],
    });
    // 清空选中的点位
    dispatch({
      type: 'template/saveResourceIDs',
      payload: [],
    });
    // 清空选中报警类型
    dispatch({
      type: 'template/saveAlarmTypeID',
      payload: [],
    });
    // 清空选中短信分组
    dispatch({
      type: 'template/saveMsgGroupIDs',
      payload: [],
    });
    // 清空选中组织机构人员
    dispatch({
      type: 'template/saveCheckedUsers',
      payload: [],
    });
    // 清空自定义短信接收人员
    dispatch({
      type: 'template/saveCustomUsers',
      payload: [],
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('ruleName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="设备选择类型">
              {getFieldDecorator('deviceSelectType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">请选择</Option>
                  {commonData.deviceSelectType.map(type =>
                    <Option key={type.id} value={type.value}>{type.text}</Option>
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
            <FormItem label="规则名称">
              {getFieldDecorator('ruleName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="设备选择类型">
              {getFieldDecorator('deviceSelectType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">请选择</Option>
                  {commonData.deviceSelectType.map(type =>
                    <Option key={type.id} value={type.value}>{type.text}</Option>
                  )}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="按部门">
              {getFieldDecorator('byOrg')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">请选择</Option>
                  {commonData.byOrg.map(type =>
                    <Option key={type.id} value={type.value}>{type.text}</Option>
                  )}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="按专业系统">
              {getFieldDecorator('byProfession')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">请选择</Option>
                  {commonData.byProfession.map(type =>
                    <Option key={type.id} value={type.value}>{type.text}</Option>
                  )}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="报警类型">
              {getFieldDecorator('byAlarmType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">请选择</Option>
                  {commonData.byAlarmType.map(type =>
                    <Option key={type.id} value={type.value}>{type.text}</Option>
                  )}
                </Select>
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
    const { loading, msgRulePage } = this.props;
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
              data={msgRulePage}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey="dealRuleID"
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          isAdd={this.state.isAdd}
          orgTree={this.props.orgTree}
          msgGroup={this.props.msgGroup}
          customUsers={this.props.customUsers}
          alarmRange={this.props.alarmRange}
          byOrg={this.props.byOrg}
          byProfession={this.props.byProfession}
          alarmType={this.props.alarmType}
          professionPage={this.props.professionPage}
          alarmTypePage={this.props.alarmTypePage}
          checkedOrgIDs={this.props.checkedOrgIDs}
          professionIDs={this.props.professionIDs}
          alarmTypeIDs={this.props.alarmTypeIDs}
          msgGroupIDs={this.props.msgGroupIDs}
          msgRuleInfo={this.props.msgRuleInfo}
          onLoadData={this.onLoadData}
          tableCheckChange={this.tableCheckChange}
          msgGroupPageChange={this.msgGroupPageChange}
          addCustomUser={this.addCustomUser}
          closeCustom={this.closeCustom}
          onCheck={this.onCheck}
          onAlarmRangeChange={this.onAlarmRangeChange}
          onByOrgChange={this.onByOrgChange}
          onByProfessionChange={this.onByProfessionChange}
          onAlarmTypeChange={this.onAlarmTypeChange}
          professionPageChange={this.professionPage}
          alarmTypePageChange={this.alarmTypePage}
          orgTreeOnCheck={this.orgTreeOnCheck}
          professionRowChange={this.professionRowChange}
          alarmTypeRowChange={this.alarmTypeRowChange}
          msgGroupRowChange={this.msgGroupRowChange}
        />
      </PageHeaderLayout>
    );
  }
}
