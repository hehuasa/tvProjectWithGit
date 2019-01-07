import React, { PureComponent } from 'react';
import { Radio, Form, Input, Row, Col, Button, Icon, Select, Card, Table, TreeSelect } from 'antd';
import { connect } from 'dva';
import styles from './Organization.less';
import { commonData } from '../../../../mock/commonData';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TreeNode } = TreeSelect;
@connect(({ organization }) => ({
  orgTree: organization.orgTree,
  entityPostion: organization.entityPostion,
}))
@Form.create()
export default class ConfigPosition extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'organization/getOrgTree',
    });
  }
  // 条件查询
  handleSearch = (form) => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        pageNum: 1,
        pageSize: 5,
        targetPostionID: this.props.postionID,
        orgID: this.props.orgID,
      };
      // 防止将空作为查询条件
      for (const obj in values) {
        if (values[obj] === '' || values[obj] === undefined) {
          delete values[obj];
        }
      }
      this.props.dispatch({
        type: 'organization/selectEntityPostion',
        payload: values,
      });
    });
  };
  // 分页函数
  onChange = (pageNum, pageSize) => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        targetPostionID: this.props.postionID,
        orgID: this.props.orgID,
        pageNum,
        pageSize,
      };
      // 防止将空作为查询条件
      for (const obj in values) {
        if (values[obj] === '' || values[obj] === undefined) {
          delete values[obj];
        }
      }
      this.props.dispatch({
        type: 'organization/selectEntityPostion',
        payload: values,
      });
    });
  };
  // 重置功能
  handleFormReset = () => {
    this.props.form.resetFields();
    const values = {
      isConnected: 1,
      targetPostionID: this.props.postionID,
      pageNum: 1,
      pageSize: 5,
      orgID: this.props.orgID,
    };
    this.props.dispatch({
      type: 'organization/selectEntityPostion',
      payload: values,
    });
  };

  render() {
    const columns = [{
      title: '所属部门',
      width: '20%',
      dataIndex: 'baseOrganization',
      render: (text) => {
        return text ? text.orgnizationName : '';
      },
    }, {
      title: '岗位名称',
      width: '20%',
      dataIndex: 'postionName',
    }, {
      title: '岗位职责',
      width: '60%',
      dataIndex: 'postionDuty',
    }];
    const rowSelection = {
      selectedRowKeys: this.props.selectedRowKeys,
      onChange: this.props.onChange,
    };
    const { getFieldDecorator } = this.props.form;
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
    const title = (
      <Row className={styles.searchRow}>
        <Form>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="岗位名称"
            >
              {getFieldDecorator('postionName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="所属部门"
            >
              {getFieldDecorator('searchOrgID')(
                <TreeSelect
                  showSearch
                  style={{ minWidth: 174 }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择所属部门"
                  allowClear
                  treeNodeFilterProp="title"
                >
                  {renderDeptTreeNodes(this.props.orgTree)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="查询已关联"
            >
              {getFieldDecorator('isConnected', {
                initialValue: 1,
              })(
                <RadioGroup>
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={() => this.handleSearch(this.props.form)}>查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Form>
      </Row>
    );
    return (
      <Card title={title}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={this.props.entityPostion.data}
          rowKey={record => record.orgPostionID}
          pagination={{
            ...this.props.entityPostion.pagination,
            onChange: this.onChange,
          }}
        />
      </Card>
    );
  }
}
