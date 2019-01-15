import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Modal, Form, Input, Select, TreeSelect } from 'antd';
import styles from './AddPlan.less';

const Option = Select.Option;
const FormItem = Form.Item;
const { TreeNode } = TreeSelect;
const { TextArea } = Input;

@connect(({ planManagement, organization }) => ({
  planBaseInfo: planManagement.planBaseInfo,
  orgTreeData: organization.orgTree,
  emgcOrgTree: organization.emgcOrgTree,
}))
export default class AddPlan extends PureComponent {
  componentDidMount() {
    // 获取应急组织
    this.props.dispatch({
      type: 'organization/getEmgcOrgTree',
    });
  }

  render() {
    const { add, handleCancel, visible, form } = this.props;
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
        title="修改"
        cancelText="取消"
        okText="保存"
        visible={visible}
        mask={false}
        maskClosable={false}
        onOk={() => add(this.props.form)}
        onCancel={handleCancel}
      >
        <div>
          <Row type="flex" className={styles.add}>
            <Col md={24}>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="预案名称"
              >
                {form.getFieldDecorator('planName', {
                rules: [
                  { required: true, message: '预案名称不能为空' },
                ],
              })(
                <Input disabled placeholder="请输入预案名称" />
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
                rules: [
                  { required: true, message: '预案编码不能为空' },
                ],
              })(
                <Input disabled placeholder="请输入预案编码" />
              )}
              </FormItem>
            </Col>
            <Col md={24}>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="预案类型"
              >
                {form.getFieldDecorator('planTypeName')(
                  <Input disabled placeholder="请输入预案类型" />
              )}
              </FormItem>
            </Col>
            <Col md={24}>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="预案等级"
              >
                {form.getFieldDecorator('planLevelName')(
                  <Input disabled placeholder="请输入预案等级" />
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
                {form.getFieldDecorator('applyObjectName')(
                  <Input disabled placeholder="请输入适用对象" />
              )}
              </FormItem>
            </Col>
            <Col md={24}>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="编制部门"
              >
                {form.getFieldDecorator('organizationName')(
                  <Input disabled placeholder="请输入编制部门" />
              )}
              </FormItem>
            </Col>
            <Col md={24}>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="注意事项"
              >
                {form.getFieldDecorator('attention')(
                  <TextArea disabled autosize={{ minRows: 2, maxRows: 6 }} placeholder="请输入注意事项" />
              )}
              </FormItem>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}
