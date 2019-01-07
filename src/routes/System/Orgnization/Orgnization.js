import React, { PureComponent } from 'react';
import { Tree, Form, Input, Row, Col, Button, Icon, Select, Radio, Popconfirm, Transfer, Modal } from 'antd';
import { connect } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './Organization.less';
import TreeContextMenu from './ContextMenu/TreeContextMenu';
import ConfigPosition from './ConfigPosition';

const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

class TreeTitle extends PureComponent {
  render() {
    const { title, addOrg, deleteOrg } = this.props;
    return (
      <div>
        <span>{title}</span>
        <Icon type="plus-circle-o" onClick={addOrg} style={{ marginLeft: 20 }} />
        <Popconfirm title="确定删除？" onConfirm={deleteOrg}>
          <Icon type="delete" style={{ marginLeft: 10 }} />
        </Popconfirm>
      </div>
    );
  }
}

@connect(({ organization, typeCode, resourceTree }) => ({
  organization,
  entityPostion: organization.entityPostion,
  emgcPostion: organization.emgcPostion,
  emgcOrgTree: organization.emgcOrgTree,
  orgObj: organization.orgObj,
  functionMenus: organization.functionMenus,
  typeCode,
  resourceTree,
}))
@Form.create()
export default class Orgnization extends PureComponent {
  state = {
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
    isAdd: false,
    isEmergency: true,
    mockData: [],
    targetKeys: [],
    visible: false, // 弹窗可见
    selectedRowKeys: [], // 应急岗位配置的实体岗位
    postionID: null, // 配置岗位ID
    emgcPosition: {}, // 应急岗位的配置信息
  };
  componentDidMount() {
    const { dispatch } = this.props;
    this.getFunctionMenus();
    // 请求部门数据
    dispatch({
      // type: 'organization/list',
      type: 'organization/getEmgcOrgTree',
    });
    // 请求机构类别数据
    // dispatch({
    //   type: 'typeCode/orgType',
    //   payload: 101,
    // });
    // 请求应急级别
    dispatch({
      type: 'organization/getEmgcLevelList',
    });
    // // 请求实体岗位列表
    // dispatch({
    //   type: 'organization/selectEntityPostion',
    // }).then(() => {
    //   this.getMock([], false);
    // });
    // 请求应急岗位列表
    dispatch({
      type: 'organization/selectEmgcPostion',
    });
  }
  getMock = (targetKeys, isEmergency) => {
    let mockData = [];
    // if (isEmergency) {
    //   mockData = this.props.emgcPostion;
    // } else {
    //   mockData = this.props.entityPostion;
    // }
    mockData = this.props.emgcPostion;
    this.setState({ mockData, targetKeys });
  };
  // 穿梭框变化
  handleChange = (targetKeys) => {
    this.setState({ targetKeys });
  };
  // 打开应急岗位配置实体岗位
  modleChange = (e, postion) => {
    e.stopPropagation();
    const { emgcPosition } = this.state;
    // 选中已勾选
    this.props.dispatch({
      type: 'organization/selectEntityPostion',
      payload: {
        pageNum: 1,
        pageSize: 5,
        isConnected: 1,
        targetPostionID: postion.postionID,
        // targetPostionID: postion.orgPositionID,
        orgID: this.props.orgObj.orgID,
      },
    });
    this.setState({
      visible: true,
      postionID: postion.postionID,
      selectedRowKeys: emgcPosition[postion.postionID] || [],
    });
  };
  renderItem = (item) => {
    const customLabel = (
      <span className="custom-item">
        {item.postionName}
      </span>
    );
    const emgcLabel = (
      <span className="custom-item">
        {item.postionName} - <a href="#" onClick={e => this.modleChange(e, item)}>关联岗位</a>
      </span>
    );
    const arr = this.state.targetKeys.filter(target => target === item.postionID);
    return {
      label: arr.length > 0 && this.state.isEmergency ? emgcLabel : customLabel, // for displayed item
      value: item.postionName, // for title and filter matching
    };
  }
  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  onSelect = (selectedKeys, info) => {
    const { dispatch, form } = this.props;
    if (info.selectedNodes.length > 0) {
      dispatch({
        type: 'organization/get',
        payload: info.selectedNodes[0].key,
      }).then(() => {
        const obj = this.props.organization.orgObj;
        delete obj.children;
        form.resetFields();
        const emgcPostionList = JSON.parse(obj.emgcPostionIDs);
        const targetKeys = [];
        const emgcPosition = {};
        emgcPostionList.forEach((item) => {
          targetKeys.push(item.postionID);
          emgcPosition[item.postionID] = item.entityIDs;
        });
        this.setState({
          isEmergency: true,
          emgcPosition,
        });
        this.getMock(targetKeys, true);
        form.setFieldsValue({
          orgID: obj.orgID || '',
          orgnizationCode: obj.orgnizationCode || '',
          parentOrgnization: obj.parentOrgnization || '',
          parentOrganizationName: obj.parentOrganizationName || '',
          orgnizationName: obj.orgnizationName || '',
          queryKey: obj.queryKey || '',
          shortName: obj.shortName || '',
          orginaztionType: obj.orginaztionType || '',
          enabled: obj.enabled || '',
          sortIndex: obj.sortIndex || '',
          address: obj.address || '',
          remark: obj.remark || '',
          otherCode: obj.otherCode || '',
          orgnizationLevel: obj.orgnizationLevel || '',
          virtual: obj.virtual || '',
          emgcLevelID: obj.emgcLevelID || '',
        });
      });
      this.setState({ isAdd: false });
    }
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (this.state.isAdd) {
        this.doAdd(fieldsValue);
      } else {
        this.doUpdate(fieldsValue);
      }
    });
  };
  // 添加部门
  addOrg = () => {
    const { form } = this.props;
    this.setState({ isAdd: true, targetKeys: [] });
    const parentOrgnization = this.props.organization.selectedNodes[0].orgnizationCode;
    const parentOrganizationName = this.props.organization.selectedNodes[0].orgnizationName;
    form.resetFields();
    form.setFieldsValue({ parentOrgnization, parentOrganizationName });
  };
  // 删除部门
  deleteOrg = () => {
    const { dispatch, form } = this.props;
    dispatch({
      type: 'organization/delete',
      payload: this.props.organization.selectedNodes[0].orgID,
    });
    form.resetFields();
  };
  // 新增根节点
  addNewRootNode = () => {
    const { form } = this.props;
    this.setState({ isAdd: true, targetKeys: [] });
    form.resetFields();
  };
  doAdd = (values) => {
    const { dispatch, form } = this.props;
    let entityPostionIDs = [];
    if (this.state.isEmergency) {
      const { emgcPosition, targetKeys } = this.state;
      targetKeys.forEach((item) => {
        const obj = {};
        obj.postionID = item;
        obj.entityIDs = emgcPosition[item] || [];
        entityPostionIDs.push(obj);
      });
      const emgcPostionIDs = JSON.stringify(entityPostionIDs);
      dispatch({
        type: 'organization/add',
        payload: { ...values, emgcPostionIDs },
      });
    } else {
      entityPostionIDs = this.state.targetKeys;
      dispatch({
        type: 'organization/add',
        payload: { ...values, entityPostionIDs },
      });
    }
    form.resetFields();
  };
  doUpdate = (values) => {
    const { dispatch } = this.props;
    let entityPostionIDs = [];
    if (this.state.isEmergency) {
      const { emgcPosition, targetKeys } = this.state;
      targetKeys.forEach((item) => {
        const obj = {};
        obj.postionID = item;
        obj.entityIDs = emgcPosition[item] || [];
        entityPostionIDs.push(obj);
      });
      const emgcPostionIDs = JSON.stringify(entityPostionIDs);
      dispatch({
        type: 'organization/update',
        payload: { ...values, emgcPostionIDs },
      });
    } else {
      entityPostionIDs = this.state.targetKeys;
      dispatch({
        type: 'organization/update',
        payload: { ...values, entityPostionIDs },
      });
    }
  };
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.getMock([], false);
  };
  handleRightClick = ({ event, node }) => {
    // if (!node.props.dataRef.treeMenu) {
    //   return;
    // }
    this.setState(node.props.dataRef);
    const position = { top: event.clientY, left: event.clientX };
    this.props.dispatch({
      type: 'organization/getContext',
      payload: { position, data: node.props.dataRef.treeMenu, show: true },
    });
    this.props.dispatch({
      type: 'organization/selectedNodes',
      payload: [node.props.dataRef],
    });
  };
  handleContextMenu = (e) => {
    e.preventDefault();
  };
  handleClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'organization/getContext',
      payload: { show: false },
    });
  };
  // 组织机构类型改变 如是应急机构 则显示应急等级选项
  orgTypeChange = (value) => {
    if (value === '101.102') {
      this.setState({
        isEmergency: true,
      });
      this.getMock([], true);
    } else {
      this.setState({
        isEmergency: false,
      });
      this.getMock([], false);
    }
  };
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode
            title={item.orgnizationName}
            key={item.orgID}
            dataRef={item}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.orgnizationName} key={item.orgID} />;
    });
  };
  // 关闭弹窗
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  // 应急岗位选择实体岗位
  onChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  };
  // 配置应急岗位与实体岗位关联关系
  handleOk = () => {
    const obj = this.state.emgcPosition;
    this.state.targetKeys.forEach((item) => {
      if (item === this.state.postionID) {
        obj[item] = this.state.selectedRowKeys;
      }
    });
    this.setState({
      emgcPosition: obj,
      selectedRowKeys: [],
      visible: false,
    });
  };
  // 获取页面功能权限
  getFunctionMenus = () => {
    const { dispatch, functionInfo } = this.props;
    dispatch({
      type: 'organization/getFunctionMenus',
      payload: { parentCode: functionInfo.functionCode },
    });
  };
  // 判断是否有该功能权限
  judgeFunction = (functionName) => {
    const { functionMenus } = this.props;
    const arr = functionMenus.filter(item => item.functionName === functionName);
    return arr.length > 0;
  };
  render() {
    const { searchValue, expandedKeys, autoExpandParent, isAdd } = this.state;
    const { emgcOrgTree } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { orgTypeList } = this.props.typeCode;
    const { contextMenu, selectedNodes, emgcLevelList } = this.props.organization;
    const { dispatch, form } = this.props;
    return (
      <div className={styles.main} onClick={this.handleClick} onContextMenu={this.handleContextMenu}>
        <div className={styles.content}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={6} sm={8} className={styles.nopd}>
              <Scrollbars style={{ width: '100%', height: 768, marginBottom: 50 }}>
                <div className={styles.tree}>
                  {this.judgeFunction('新增权限') ? (
                    <div className={styles.addNewTree} onClick={this.addNewRootNode}>
                      <Button type="dashed">添加新的机构树</Button>
                    </div>
                  ) : null}
                  <Tree
                    onExpand={this.onExpand}
                    onSelect={this.onSelect}
                    expandedKeys={expandedKeys}
                    autoExpandParent={autoExpandParent}
                    onRightClick={this.handleRightClick}
                  >
                    {this.renderTreeNodes(emgcOrgTree)}
                  </Tree>
                  {this.judgeFunction('新增权限') ? (
                    <TreeContextMenu
                      contextMenu={contextMenu}
                      addOrg={this.addOrg}
                      deleteOrg={this.deleteOrg}
                      selectedNodes={selectedNodes}
                      dispatch={dispatch}
                    />) : null
                  }
                </div>
              </Scrollbars>
            </Col>
            <Col md={18} sm={16}>
              <div className={styles.form}>
                <Form onSubmit={this.handleSubmit} layout="inline">
                  <FormItem>
                    {getFieldDecorator('orgID')(
                      <Input type="hidden" placeholder="请输入" />
                    )}
                    {getFieldDecorator('parentOrgnization')(
                      <Input type="hidden" placeholder="请输入" />
                    )}
                  </FormItem>
                  <Row>
                    <Col md={8} sm={12}>
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label="应急级别"
                      >
                        {form.getFieldDecorator('emgcLevelID', {
                          rules: [{ required: true, message: '应急级别必填' }],
                        })(
                          <Select placeholder="请选择" style={{ width: '100%' }}>
                            <Option value="">请选择</Option>
                            {emgcLevelList.map(type => (
                              <Option
                                key={type.emgcLevelID}
                                value={type.emgcLevelID}
                              >{type.levelName}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={8} sm={12}>
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label="上级机构"
                      >
                        {form.getFieldDecorator('parentOrganizationName', {
                        })(
                          <Input disabled placeholder="上级机构名称" />
                        )}
                      </FormItem>
                    </Col>
                    <Col md={8} sm={12}>
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label="机构名称"
                      >
                        {getFieldDecorator('orgnizationName', {
                          rules: [
                            { require: true, message: '机构名必填' },
                          ],
                        })(
                          <Input placeholder="请输入" />
                        )}
                      </FormItem>
                    </Col>
                    <Col md={8} sm={12}>
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label="名称拼音"
                      >
                        {getFieldDecorator('queryKey', {
                          rules: [
                            { pattern: /^[A-Za-z]+$/, message: '只能由英文字母组成' },
                          ],
                        })(
                          <Input placeholder="请输入" />
                        )}
                      </FormItem>
                    </Col>
                    <Col md={8} sm={12}>
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label="机构简称"
                      >
                        {getFieldDecorator('shortName')(
                          <Input placeholder="请输入" />
                        )}
                      </FormItem>
                    </Col>
                    <Col md={8} sm={12}>
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label="是否有效"
                      >
                        {getFieldDecorator('enabled')(
                          <RadioGroup name="enabled">
                            <Radio value>是</Radio>
                            <Radio value={false}>否</Radio>
                          </RadioGroup>
                        )}
                      </FormItem>
                    </Col>
                    <Col md={8} sm={12}>
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label="排序序号"
                      >
                        {getFieldDecorator('sortIndex', {
                          rules: [
                            { type: 'integer', message: '请输入正确的数字', transform(value) { if (value) { return Number(value); } } },
                          ],
                        })(
                          <Input placeholder="请输入" />
                        )}
                      </FormItem>
                    </Col>
                    <Col md={8} sm={12}>
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label="机构地址"
                      >
                        {getFieldDecorator('address')(
                          <Input placeholder="请输入" />
                        )}
                      </FormItem>
                    </Col>
                    <Col md={8} sm={12}>
                      <FormItem
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label="机构介绍"
                      >
                        {getFieldDecorator('remark')(
                          <TextArea placeholder="请输入" />
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={20} offset={2} className={styles.postInfo}>
                      <FormItem label="岗位信息">
                        <Transfer
                          dataSource={this.state.mockData}
                          showSearch
                          titles={['未选择', '已选择']}
                          listStyle={{
                            width: 280,
                            height: 280,
                          }}
                          rowKey={record => record.postionID}
                          targetKeys={this.state.targetKeys}
                          onChange={this.handleChange}
                          render={this.renderItem}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginTop: 16 }} align="bottom">
                    <Col sm={6} offset={9}>
                      <span className={styles.submitButtons}>
                        {(this.judgeFunction('新增权限') && isAdd) || (this.judgeFunction('修改权限') && !isAdd) ?
                          <Button type="primary" htmlType="submit">保存</Button> : null
                          }
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                      </span>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </div>
        <Modal
          title="关联实体岗位"
          visible={this.state.visible}
          width="80%"
          destroyOnClose
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <ConfigPosition
            entityPostion={this.props.entityPostion}
            selectedRowKeys={this.state.selectedRowKeys}
            postionID={this.state.postionID}
            orgID={this.props.orgObj.orgID}
            onChange={this.onChange}
          />
        </Modal>
      </div>
    );
  }
}
