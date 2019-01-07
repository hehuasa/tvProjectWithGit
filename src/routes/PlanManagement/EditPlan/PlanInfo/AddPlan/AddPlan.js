import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal, Form, Input, Select, TreeSelect } from 'antd';
import styles from './AddPlan.less';

const Option = Select.Option;
const FormItem = Form.Item;
const { TreeNode } = TreeSelect;
const { TextArea } = Input;

let timeout;

const planStatu = [{
  name: '启用',
  key: 0,
}, {
  name: '停用',
  key: 1,
}, {
  name: '草稿',
  key: 3,
}];

@connect(({ planManagement, organization }) => ({
  planLevelList: planManagement.planLevelData,
  planBasicInfo: planManagement.planBasicInfo,
  preplanType: planManagement.preplanType,
  publisher: planManagement.publisher,
  planCodeToggle: planManagement.planCodeToggle,
  orgTreeData: organization.orgTree,
  emgcOrgTree: organization.emgcOrgTree,
}))
@Form.create()
export default class AddPlan extends PureComponent {
  state = {
    feature: null,
  };

  componentDidMount() {
    // 请求预案级别
    this.props.dispatch({
      type: 'planManagement/planLevelData',
    });

    // 请求预案类型
    this.props.dispatch({
      type: 'planManagement/preplanType',
    });

    // 编制部门就是发布机构
    this.props.dispatch({
      type: 'organization/getOrgTree',
    });
  }
  // Function({ fieldName: { value: any, errors: Error } })

  fake = (value) => {
    const payload = {
      userPlanCode: value,
      planInfoID: this.props.planBasicInfo.planInfoID,
    };
    if (!payload.planInfoID) {
      delete payload.planInfoID;
    }
    this.props.dispatch({
      type: 'planManagement/selectPlanCode',
      payload,
    });
  };
  fetch = (value, callback) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => this.fake(value), 500);
  };

  render() {
    const { add, handleCancel, visible, form, isAdd, planBasicInfo,
      planLevelList, preplanType, orgTreeData } = this.props;
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
    const renderEmgecTreeNodes = (data) => {
      return data.map((item) => {
        if (item.children) {
          return (
            <TreeNode
              title={item.orgnizationName}
              key={item.orgID}
              value={item.orgID}
            >
              {renderEmgecTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode title={item.orgnizationName} key={item.orgID} value={item.orgID} />;
      });
    };
    return (
      <Modal
        title={isAdd ? '新增预案基本信息' : '修改预案基本信息'}
        cancelText="取消"
        okText="保存"
        visible={visible}
        mask={false}
        maskClosable={false}
        destroyOnClose
        onOk={() => add(this.props.form)}
        onCancel={handleCancel}
      >
        <Row type="flex" className={styles.add}>
          {form.getFieldDecorator('flowID', {
            initialValue: isAdd ? null : planBasicInfo.flowID,
          })(
            <Input type="hidden" />
          )}
          {form.getFieldDecorator('version', {
            initialValue: isAdd ? null : planBasicInfo.version,
            rules: [],
          })(
            <Input type="hidden" />
          )}
          {form.getFieldDecorator('statu', {
            initialValue: isAdd ? null : planBasicInfo.statu,
            rules: [],
          })(
            <Input type="hidden" />
          )}
          <Col md={24}>
            <FormItem
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 0 }}
              label="预案id"
            >
              {form.getFieldDecorator('planInfoID', {
                initialValue: isAdd ? null : planBasicInfo.planInfoID,
              })(
                <Input placeholder="请输入预案名称" />
              )}
            </FormItem>
          </Col>

          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="预案名称"
            >
              {form.getFieldDecorator('planName', {
                initialValue: isAdd ? null : planBasicInfo.planName,
                rules: [
                  { required: true, message: '预案名称不能为空' },
                ],
              })(
                <Input placeholder="请输入预案名称" />
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="预案编码"
            >
              {form.getFieldDecorator('userPlanCode', {
                initialValue: isAdd ? null : planBasicInfo.userPlanCode,
                rules: [
                  { required: true, message: '预案编码不能为空' },
                ],
              })(
                <Input
                  placeholder="请输入预案编码"
                />
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="预案类型"
            >
              {form.getFieldDecorator('planType', !isAdd ? {
                initialValue: planBasicInfo.planType,
              } : {})(
                <Select
                  placeholder="请选择预案类型"
                  style={{ width: '100%' }}
                >
                  {
                    preplanType.map(item => (
                      <Option key={item.code} value={item.code} >{item.codeName}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="预案等级"
            >
              {form.getFieldDecorator('planLevelID', !isAdd ? {
                initialValue: `${planBasicInfo.planLevelID}`,
              } : {})(
                <Select
                  placeholder="请选择预案等级"
                  style={{ width: '100%' }}
                >
                  {
                    planLevelList.map(item => (
                      <Option key={`${item.emgcLevelID}`} value={`${item.emgcLevelID}`} >{item.levelName}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="应急组织"
            >
              {form.getFieldDecorator('emgcOrgID', {
                initialValue: isAdd ? null : `${planBasicInfo.emgcOrgID}`,
                rules: [
                  { required: true, message: '应急组织必选' },
                ],
              })(
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择应急机构"
                  treeNodeFilterProp="title"
                  allowClear
                >
                  {renderEmgecTreeNodes(this.props.emgcOrgTree)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="适用对象"
            >
              {form.getFieldDecorator('applyObjectName', {
                initialValue: isAdd ? null : planBasicInfo.applyObjectName,
                rules: [],
              })(
                <Input placeholder="请输入适用对象" />
              )}
            </FormItem>
          </Col>
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="编制部门"
            >
              {form.getFieldDecorator('orgID', {
                initialValue: isAdd ? null : `${planBasicInfo.orgID}`,
                rules: [],
              })(
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
          <Col md={24}>
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="注意事项"
            >
              {form.getFieldDecorator('attention', {
                initialValue: isAdd ? null : planBasicInfo.attention,
                rules: [],
              })(
                <TextArea autosize={{ minRows: 2, maxRows: 6 }} placeholder="请输入注意事项" />
              )}
            </FormItem>
          </Col>
        </Row>
      </Modal>
    );
  }
}
