import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Tree, Table, Modal, Divider, Popconfirm, Radio, Tabs, Checkbox, Switch } from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import ConfigRoleAccount from './ConfigRoleAccount';
import styles from './TableList.less';
import { commonData } from '../../../../mock/commonData';
import SelectResource from './SelectResource/index';

const FormItem = Form.Item;
const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const { TreeNode } = Tree;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

// 新增 修改页
const CreateForm = Form.create()((props) => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const { role, isAdd } = props;
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
      title={isAdd ? '新增角色' : '修改角色'}
      visible={modalVisible}
      onOk={okHandle}
      width="80%"
      onCancel={() => handleModalVisible()}
    >
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <FormItem>
          {form.getFieldDecorator('roleID', {
            initialValue: isAdd ? '' : role.roleID,
            rules: [],
          })(
            <Input type="hidden" />
          )}
        </FormItem>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            label="角色编码"
          >
            {form.getFieldDecorator('roleCode', {
              initialValue: isAdd ? '' : role.roleCode,
              rules: [
                { required: true, message: '角色编码不能为空' },
                { pattern: /^[A-Za-z0-9_]+$/, message: '只能由英文、数字、下划线组成' },
                { max: 30, message: '长度不能大于30' },
                ],
            })(
              <Input placeholder="请输入角色编码" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            label="角色名称"
          >
            {form.getFieldDecorator('roleName', {
              initialValue: isAdd ? '' : role.roleName,
              rules: [
                { required: true, message: '角色名称不能为空' },
                { pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/, message: '只能由中文、英文、数字、下划线组成' },
                { max: 30, message: '长度不能大于30' },
                ],
            })(
              <Input placeholder="请输入角色名称" />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            label="角色类型"
          >
            {form.getFieldDecorator('roleType', {
         initialValue: isAdd ? '' : role.roleType,
         rules: [{ required: true, message: '角色类型不能为空' }],
         })(
           <Select placeholder="请选择" style={{ width: '100%' }}>
             <Option value="">请选择</Option>
             {commonData.roleType.map(item => (
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
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            label="角色描述"
          >
            {form.getFieldDecorator('roleDes', {
              initialValue: isAdd ? '' : role.roleDes,
              rules: [
                { max: 300, message: '长度不能大于300' },
              ],
            })(
              <TextArea />
            )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            label="是否有效"
          >
            {form.getFieldDecorator('enabled', {
         initialValue: isAdd ? '' : role.enabled,
         rules: [],
         })(
           <RadioGroup name="enabled">
             <Radio value>是</Radio>
             <Radio value={false}>否</Radio>
           </RadioGroup>
         )}
          </FormItem>
        </Col>
        <Col md={8} sm={24}>
          <FormItem
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            label="不限权限"
          >
            {form.getFieldDecorator('allPower', {
              initialValue: isAdd ? '' : role.allPower,
              rules: [],
            })(
              <RadioGroup name="allPower">
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </RadioGroup>
         )}
          </FormItem>
        </Col>

      </Row>

    </Modal>
  );
});
// 角色配置功能
const SysFunction = Form.create()((props) => {
  const { treeList, modalShow, doChecked, handleModalShow, onExpand,
    onCheck, onSelect, form, checkedKeys } = props;
  const { onByOrgChange, orgTreeOnCheck, onByProfessionChange, onDeviceSelectTypeChange,
    professionRowChange, professionPageChange, onAlarmTypeChange, alarmTypeRowChange,
    alarmTypePageChange, includeChildrenChange, tabOnChange } = props;
  const { byOrg, checkedOrgIDs, orgTree, byProfession, deviceSelectType, alarmTypePage,
    professionIDs, professionPage, alarmType, alarmTypeIDs, activeKey, sysFunctionList,
    powerData, byAlarmType, includeObj } = props;
  const { msgRuleInfo, isAdd } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      doChecked(fieldsValue);
    });
  };
  const makeTree = (dataList, parentCode) => {
    const filters = dataList.filter(c => c.parentCode === parentCode);
    if (filters.length) {
      filters.forEach((c) => {
        c.children = makeTree(dataList, c.functionCode);
      });
    }
    return filters;
  };
  // 生成部门树
  const renderDeptTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode
            title={(
              <div className={styles.treeTitle}>
                <Row>
                  <Col span={8}><div>{item.orgnizationName}</div></Col>
                  <Col span={16}>
                    <div className={styles.includeChildren}>
                      <Switch
                        checked={includeObj[item.orgID]}
                        checkedChildren="包含下级"
                        unCheckedChildren="不含下级"
                        onChange={checked => includeChildrenChange(checked, item.orgID)}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            )}
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
          title={<treeTitle name={item.orgnizationName} />}
          dataRef={item}
          isLeaf
          key={item.orgID}
          value={item.orgID}
        />
      );
    });
  };
  // 生成功能树
  const renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode
            title={item.functionName}
            key={item.funID}
            value={item.funID}
            dataRef={item}
          >
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={item.functionName}
          dataRef={item}
          key={item.funID}
          value={item.funID}
        />
      );
    });
  };
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
  const rangeExtra = (
    <RadioGroup onChange={onDeviceSelectTypeChange} value={deviceSelectType}>
      {commonData.deviceSelectType.map((obj) => {
        return (
          <Radio key={obj.id} value={obj.value}>{obj.text}</Radio>
        );
      })}
    </RadioGroup>
  );
  return (
    <Modal
      title="配置权限"
      visible={modalShow}
      onOk={okHandle}
      width="60%"
      destroyOnClose
      onCancel={() => handleModalShow()}
    >
      <Scrollbars style={{ width: '100%', height: 500 }} className={styles.scrollbarsStyle}>
        <Tabs activeKey={`${activeKey}`} onChange={tabOnChange}>
          <TabPane tab="功能权限" key="1">
            <Tree
              checkable
              onExpand={onExpand}
              autoExpandParent
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              checkStrictly
            >
              {renderTreeNodes(makeTree(sysFunctionList, '0'))}
            </Tree>
          </TabPane>
          <TabPane tab="数据权限" key="2">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={10} sm={24}>
                <FormItem
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  label="权限名称"
                >
                  {form.getFieldDecorator('dataPowerName', {
                    initialValue: powerData.dataPowerName,
                    rules: [
                      // { required: true, message: '权限名称不允许为空' },
                    ],
                  })(
                    <Input placeholder="请输入权限名称" />
                  )}
                </FormItem>
              </Col>
              <Col md={10} sm={24}>
                <FormItem
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  label="权限说明"
                >
                  {form.getFieldDecorator('remark', {
                    initialValue: powerData.remark,
                    rules: [],
                  })(
                    <TextArea placeholder="请输入权限说明" />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Card title="设备选择类型" extra={rangeExtra}>
              {deviceSelectType === 1 ? (
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
                          // defaultExpandedKeys={checkedOrgIDs}
                          checkable
                        >
                          {renderDeptTreeNodes(orgTree)}
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
              {deviceSelectType === 2 ? (
                <SelectResource />
              ) : null}
              <Tabs defaultActiveKey="1">
                <TabPane tab="报警类型" key="1">
                  <RadioGroup onChange={onAlarmTypeChange} value={byAlarmType}>
                    {commonData.dataPowerByAlarmType.map((obj) => {
                  return (
                    <Radio key={obj.id} value={obj.value}>{obj.text}</Radio>
                  );
                })}
                  </RadioGroup>
                </TabPane>
              </Tabs>
            </Card>
          </TabPane>
        </Tabs>
      </Scrollbars>
    </Modal>
  );
});

// 角色配置账户
const RoleAccount = Form.create()((props) => {
  const { accountModalShow, form, handleAccountModalShow, addRoleAccounts, selectedAccounts, selectedRows } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      addRoleAccounts(fieldsValue);
    });
  };
  const selectedRowKeys = (keys) => {
    selectedAccounts(keys);
  };
  return (
    <Modal
      title="配置账户"
      visible={accountModalShow}
      onOk={okHandle}
      width="60%"
      onCancel={() => handleAccountModalShow()}
      destroyOnClose
    >
      <Scrollbars style={{ width: '100%', height: 600 }} className={styles.scrollbarsStyle}>
        <ConfigRoleAccount
          selectedRowKeys={selectedRowKeys}
          selectedRows={selectedRows}
        />
      </Scrollbars>
    </Modal>
  );
});

@connect(({ rule, loading, roleInfo, typeCode, sysFunction, user, organization }) => ({
  rule,
  loading: loading.models.rule,
  roleInfo,
  typeCode,
  sysFunction,
  sysFunctionList: sysFunction.sysFunctionList,
  orgTree: organization.orgTree,
  currentUser: user.currentUser,
  checkedOrgIDs: roleInfo.checkedOrgIDs,
  byOrg: roleInfo.byOrg,
  deviceSelectType: roleInfo.deviceSelectType,
  alarmTypePage: roleInfo.alarmTypePage,
  professionIDs: roleInfo.professionIDs,
  professionPage: roleInfo.professionPage,
  byProfession: roleInfo.byProfession,
  alarmType: roleInfo.alarmType,
  alarmTypeIDs: roleInfo.alarmTypeIDs,
  resourceIDs: roleInfo.resourceIDs,
  byResource: roleInfo.byResource,
  includeObj: roleInfo.includeObj,
  powerData: roleInfo.powerData,
  byAlarmType: roleInfo.byAlarmType,
  activeKey: sysFunction.activeKey,
  functionMenus: roleInfo.functionMenus,
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
    // 配置系统功能
    modalShow: false,
    // 角色配置账户 模态框
    accountModalShow: false,
    roleInfo: {},
  };

  componentDidMount() {
    this.page(commonData.pageInitial);
    this.getFunctionMenus();
    // 请求部门树
    this.props.dispatch({
      type: 'organization/getOrgTree',
    });
  }
  // 获取分页数据
  page = (page) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleInfo/page',
      payload: page,
    });
  };
  // 获取页面功能权限
  getFunctionMenus = () => {
    const { dispatch, functionInfo } = this.props;
    dispatch({
      type: 'roleInfo/getFunctionMenus',
      payload: { parentCode: functionInfo.functionCode },
    });
  };
  // 判断是否有该功能权限
  judgeFunction = (functionName) => {
    const { functionMenus } = this.props;
    const arr = functionMenus.filter(item => item.functionName === functionName);
    return arr.length > 0;
  };
  // 初始化表格数据
  initData = () => {
    const tableTitles = [];
    commonData.columns.role.attributes.forEach((item) => {
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
            {this.judgeFunction('修改权限') ? (
              <a href="javascript: void(0)" onClick={() => this.update(record)}>修改</a>
            ) : null}
            {this.judgeFunction('删除权限') ? (
              <span>
                <Divider type="vertical" />
                <Popconfirm title="确定删除？" onConfirm={() => this.delete(record)}>
                  <a href="#">删除</a>
                </Popconfirm>
              </span>
            ) : null}
            {this.judgeFunction('配置权限权限') ? (
              <span>
                <Divider type="vertical" />
                <a href="javascript: void(0)" onClick={() => this.configFunction(record)}>配置权限</a>
              </span>
            ) : null}
            {this.judgeFunction('配置账户权限') ? (
              <span>
                <Divider type="vertical" />
                <a href="javascript: void(0)" onClick={() => this.configAccountInfo(record)}>配置账户</a>
              </span>
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
      type: 'roleInfo/page',
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
      type: 'roleInfo/page',
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
      const { roleName, roleType } = fieldsValue;
      const search = {
        pageNum: 1,
        pageSize: 10,
        isQuery: true,
        fuzzy: true,
        roleName,
        roleType,
      };
      this.page(search);
    });
  };

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
      isAdd: true,
    });
  };
  handleModalShow = (flag) => {
    this.setState({
      modalShow: !!flag,
    });
    this.resetValue();
  };
  handleAccountModalShow = (flag) => {
    this.setState({
      accountModalShow: !!flag,
    });
  };
  onExpand = () => {
  };
  // 数据权限 设备选择类型
  onDeviceSelectTypeChange = (e) => {
    this.props.dispatch({
      type: 'roleInfo/saveDeviceSelectType',
      payload: parseInt(e.target.value, 0),
    });
  };
  // 权限功能树check函数
  onCheck = (checkedKeys, e) => {
    const { roleID } = this.props.sysFunction.roleFunction;
    // const { checked, halfChecked } = checkedKeys;
    this.props.dispatch({
      type: 'sysFunction/checkedKeys',
      payload: { checkedKeys: checkedKeys.checked, roleID },
    });
  };
  onSelect = (selectedKeys, info) => {
  };
  // 保存选择的系统功能
  doChecked = (fields) => {
    const { includeObj } = this.props;
    // 1. 保存功能权限
    const { roleID, checkedKeys } = this.props.sysFunction.roleFunction;
    // this.props.dispatch({
    //   type: 'sysFunction/addRoleFunctions',
    //   payload: { roleID, functionCode: checkedKeys },
    // }).then(() => {
    //   // 请求新的功能树
    //   const { dispatch } = this.props;
    //   dispatch({
    //     type: 'user/fetchCurrent',
    //     payload: {},
    //   }).then(() => {
    //     const { accountID } = this.props.currentUser;
    //     dispatch({
    //       type: 'sysFunction/fetch',
    //       payload: { accountID },
    //     });
    //   });
    //   this.setState({
    //     modalShow: !this.state.modalShow,
    //   });
    // });
    //  2.保存数据权限
    const { deviceSelectType, checkedOrgIDs, professionIDs, byOrg,
      byProfession, resourceIDs, alarmTypeIDs, byAlarmType, byResource } = this.props;
    const orgIDs = []; // 机构ID集合
    const includeSub = []; // 是否包含下级
    checkedOrgIDs.forEach((obj) => {
      orgIDs.push(obj);
      includeSub.push(includeObj[obj] ? 1 : 0);
      // return { orgID: parseInt(obj, 0), includeChild: includeObj[obj] !== false };
    });
    const orgData = deviceSelectType === 1 ? {
      orgIDs,
      includeSub,
      byOrg,
      professionSystemIDs: professionIDs,
      byProfession,
    } : {
      resourceIDs,
      byResource,
    };
    const powerData = {
      ...fields,
      roleID: this.state.roleInfo.roleID,
      deviceSelectType, // 报警选择范围
      // alarmTypeList: alarmTypeIDs, // 选择的报警类型
      byAlarmType, // 报警类型
      ...orgData, // 部门和专业
    };
    this.props.dispatch({
      type: 'sysFunction/addRoleFunctions',
      payload: { roleID, funIDs: checkedKeys, powerData },
    }).then(() => {
      // 请求新的功能树
      const { dispatch } = this.props;
      dispatch({
        type: 'user/fetchCurrent',
        payload: {},
      }).then(() => {
        const { accountID } = this.props.currentUser;
        dispatch({
          type: 'sysFunction/fetch',
          payload: { accountID },
        });
      });
      this.setState({
        modalShow: !this.state.modalShow,
      });
    });
  };
  // 新增修改时 重置参数
  resetValue = () => {
    const { dispatch } = this.props;
    // 默认选中部门+专业系统
    dispatch({
      type: 'roleInfo/saveAlarmRange',
      payload: 1,
    });
    // 默认选中 全部门
    dispatch({
      type: 'roleInfo/saveByOrg',
      payload: 1,
    });
    // 默认选中 全专业
    dispatch({
      type: 'roleInfo/saveByProfession',
      payload: 1,
    });
    // 默认选中 全类型
    dispatch({
      type: 'roleInfo/saveAlarmType',
      payload: 1,
    });
    // 清空选中的机构
    dispatch({
      type: 'roleInfo/saveCheckedOrgIDs',
      payload: [],
    });
    // 清空选中的专业系统
    dispatch({
      type: 'roleInfo/saveProfessionIDs',
      payload: [],
    });
    // 清空选中的点位
    dispatch({
      type: 'roleInfo/saveResourceIDs',
      payload: [],
    });
    // 清空资源类型
    dispatch({
      type: 'roleInfo/saveByResource',
      payload: 1,
    });
    // 清空选中报警类型
    dispatch({
      type: 'roleInfo/saveAlarmTypeID',
      payload: [],
    });
  };
  // 保存选择账户
  selectedAccounts = (keys) => {
    this.props.dispatch({
      type: 'roleInfo/accounts',
      payload: keys,
    });
  };
  // 添加角色账户
  addRoleAccounts = () => {
    this.props.dispatch({
      type: 'roleInfo/addRoleAccount',
      payload: this.props.roleInfo.roleAccount,
    }).then(() => {
      this.setState({
        accountModalShow: !this.state.accountModalShow,
      });
    });
  };
  // 新增角色
  handleAdd = (fields) => {
    if (this.state.isAdd) {
      this.doAdd(fields);
    } else {
      this.doUpdate(fields);
    }
  };
  // 保存新增
  doAdd = (fields) => {
    this.props.dispatch({
      type: 'roleInfo/add',
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
      type: 'roleInfo/update',
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
      type: 'roleInfo/delete',
      payload: [record.roleID],
    });
  };
  // 导出函数
  export = () => {
    const para = { ...commonData.pageInitial };
    delete para.pageNum;
    delete para.pageSize;
    para.showJson = [];
    commonData.columns.role.attributes.forEach((item) => {
      if (item.isExport) {
        para.showJson.push({ en: item.dataIndex, cn: item.title });
      }
    });
    para.showJson = JSON.stringify(para.showJson);
    this.props.dispatch({
      type: 'roleInfo/export',
      payload: para,
    });
  };
  deleteAll = () => {
    const roleIds = [];
    this.state.selectedRows.forEach((role) => {
      roleIds.push(role.roleID);
    });
    this.props.dispatch({
      type: 'roleInfo/delete',
      payload: roleIds,
    });
  };
  update = (record) => {
    this.setState({
      modalVisible: !this.state.modalVisible,
      isAdd: false,
    });
    this.props.dispatch({
      type: 'roleInfo/get',
      payload: record.roleID,
    });
  };
  configFunction = (record) => {
    this.setState({
      modalShow: !this.state.modalShow,
      roleInfo: record,
    });
    // 请求系统功能列表
    this.props.dispatch({
      type: 'sysFunction/list',
      payload: record.roleID,
    });
    //  请求角色拥有的功能
    this.props.dispatch({
      type: 'sysFunction/findFunctions',
      payload: record.roleID,
    });
    //  请求数据权限
    this.props.dispatch({
      type: 'roleInfo/getDataPower',
      payload: { roleID: record.roleID },
    });
  };
  // 请求账户信息
  configAccountInfo = (record) => {
    //  保存角色ID
    this.props.dispatch({
      type: 'roleInfo/roleID',
      payload: record.roleID,
    });
    //  获取属于该角色的所有账户
    this.props.dispatch({
      type: 'roleInfo/selectByRoleID',
      payload: record.roleID,
    }).then(() => {
      this.setState({
        accountModalShow: !this.state.accountModalShow,
      });
    });
  };
  // 数据权限 按部门的类型变化函数
  onByOrgChange = (e) => {
    this.props.dispatch({
      type: 'roleInfo/saveByOrg',
      payload: e.target.value,
    });
  };
  // 数据权限 按部门 保存选中的部门ID
  orgTreeOnCheck = (checkedKeys) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleInfo/saveCheckedOrgIDs',
      payload: checkedKeys,
    });
  };
  // 是否包含下级切换函数
    includeChildrenChange = (checked, orgID) => {
      const { includeObj } = this.props;
      let obj = {};
      obj = { ...includeObj };
      obj[orgID] = checked;
      this.props.dispatch({
        type: 'roleInfo/saveIncludeObj',
        payload: obj,
      });
    };
  // 数据权限 按专业系统的类型变化函数
  onByProfessionChange = (e) => {
    this.props.dispatch({
      type: 'roleInfo/saveByProfession',
      payload: e.target.value,
    });
    if (e.target.value === 2) {
      this.professionPage(1, 5);
    }
  };
  // 指定专业系统分页数据
  professionPage = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleInfo/professionPage',
      payload: { pageNum, pageSize },
    });
  };
  // 短信规则 按专业系统 保存选中的部门ID
  professionRowChange = (selectedRowKeys) => {
    const { dispatch, deviceSelectType } = this.props;
    dispatch({
      type: 'roleInfo/saveProfessionIDs',
      payload: selectedRowKeys,
    });
    // 跟新报警类型
    dispatch({
      type: 'template/alarmTypePage',
      payload: {
        pageNum: 1,
        pageSize: 5,
        professionSystemIDs: selectedRowKeys,
        deviceSelectType,
      },
    });
  };
  // 数据权限 报警类型变化函数
  onAlarmTypeChange = (e) => {
    this.props.dispatch({
      type: 'roleInfo/saveByAlarmType',
      payload: e.target.value,
    });
  };
  // 数据权限 报警类型
  alarmTypeRowChange = (selectedRowKeys) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'roleInfo/saveAlarmTypeID',
      payload: selectedRowKeys,
    });
  };
  // 报警类型 分页数据
  alarmTypePage = (pageNum, pageSize) => {
    const { dispatch, deviceSelectType, professionIDs, resourceIDs } = this.props;
    const data = deviceSelectType === 1 ? {
      professionSystemIDs: professionIDs,
    } : {
      resourceIDs,
    };
    dispatch({
      type: 'roleInfo/alarmTypePage',
      payload: { pageNum, pageSize, ...data, deviceSelectType },
    });
  };
  // 页签切换
  tabOnChange = (activeKey) => {
    this.props.dispatch({
      type: 'sysFunction/saveActiveKey',
      payload: activeKey,
    });
  };
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="角色名称">
              {getFieldDecorator('roleName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              {this.judgeFunction('新增权限') ? (
                <Button style={{ marginLeft: 8 }} icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新增
                </Button>) : null}
              { this.judgeFunction('导出权限') ? (
                <Button style={{ marginLeft: 8 }} icon="export" type="primary" onClick={() => this.export()}>
                  导出
                </Button>
              ) : null}
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
            <FormItem label="角色编码">
              {getFieldDecorator('roleCode')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="角色类型">
              {getFieldDecorator('roleType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">请选择</Option>
                  {commonData.roleType.map(type =>
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
    const { loading, roleInfo: { data }, roleInfo: { role } } = this.props;
    const { sysFunctionList } = this.props.sysFunction;
    const { checkedKeys } = this.props.sysFunction.roleFunction;
    const { specialList, ranksList, userTypeList, codeList } = this.props.typeCode;
    const { selectedRows, modalVisible, modalShow, accountModalShow } = this.state;
    const { accouts } = this.props.roleInfo.roleAccount;
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
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey="roleID"
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
          role={role.data}
          isAdd={this.state.isAdd}
        />
        <SysFunction
          modalShow={modalShow}
          handleModalShow={this.handleModalShow}
          treeList={sysFunctionList}
          onExpand={this.onExpand}
          onCheck={this.onCheck}
          onSelect={this.onSelect}
          doChecked={this.doChecked}
          checkedKeys={checkedKeys}
          orgTreeOnCheck={this.orgTreeOnCheck}
          onByOrgChange={this.onByOrgChange}
          onByProfessionChange={this.onByProfessionChange}
          onAlarmTypeChange={this.onAlarmTypeChange}
          onDeviceSelectTypeChange={this.onDeviceSelectTypeChange}
          professionRowChange={this.professionRowChange}
          professionPageChange={this.professionPage}
          alarmTypeRowChange={this.alarmTypeRowChange}
          tabOnChange={this.tabOnChange}
          byOrg={this.props.byOrg}
          checkedOrgIDs={this.props.checkedOrgIDs}
          orgTree={this.props.orgTree}
          byProfession={this.props.byProfession}
          alarmTypePageChange={this.props.alarmTypePage}
          deviceSelectType={this.props.deviceSelectType}
          alarmTypePage={this.props.alarmTypePage}
          professionIDs={this.props.professionIDs}
          professionPage={this.props.professionPage}
          alarmTypeIDs={this.props.alarmTypeIDs}
          alarmType={this.props.alarmType}
          activeKey={this.props.activeKey}
          sysFunctionList={this.props.sysFunctionList}
          powerData={this.props.powerData}
          byAlarmType={this.props.byAlarmType}
          includeObj={this.props.includeObj}
          includeChildrenChange={this.includeChildrenChange}
        />
        <RoleAccount
          accountModalShow={accountModalShow}
          handleAccountModalShow={this.handleAccountModalShow}
          selectedAccounts={this.selectedAccounts}
          addRoleAccounts={this.addRoleAccounts}
          selectedRows={accouts}
        />
      </PageHeaderLayout>
    );
  }
}
