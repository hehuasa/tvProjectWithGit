import React, { PureComponent } from 'react';
import { Tree, Form, Input, Row, Col, Button, Icon, Select, Radio, Popconfirm, Transfer, Modal, Layout, } from 'antd';
import { connect } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './Organization.less';
import TreeContextMenu from './ContextMenu/TreeContextMenu';
import ConfigPosition from './ConfigPosition';

import { } from 'antd';

const {
  Sider, Content,
} = Layout;
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
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    const { emgcOrgTree } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { orgTypeList } = this.props.typeCode;
    const { contextMenu, selectedNodes, emgcLevelList } = this.props.organization;
    const { dispatch, form } = this.props;
    return (

      <Layout className={styles.layoutContent}>
        <Sider
          width={300}
        >
          <div className={styles.leftContent}>
            




          </div>
        </Sider>
        <Content>

          


          

        </Content>
      </Layout>

    )
  }
}
