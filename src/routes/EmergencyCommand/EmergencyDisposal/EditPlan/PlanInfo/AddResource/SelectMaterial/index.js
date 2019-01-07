import React, { PureComponent } from 'react';
import { Row, Col, Modal, Form, Input, Radio, Table, Button, Select } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
@connect(({ emergency }) => ({
  resourcePage: emergency.resourcePage,
  areaList: emergency.areaList,
  resMaterialPage: emergency.resMaterialPage,
}))
@Form.create()
export default class SelectMaterial extends PureComponent {
  state = {
    selectedRow: {},
  };
  componentDidMount() {
    if (this.props.resourceType === 1) {
      this.props.dispatch({
        type: 'emergency/getAreaList',
      });
    }
  }
  resourcePage = (pageNum, pageSize) => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.props.dispatch({
        type: 'emergency/resourcePage',
        payload: {
          pageNum,
          pageSize,
          isQuery: true,
          fuzzy: true,
          ...fieldsValue,
        },
      });
    });
  };
  resMaterialPage = (pageNum, pageSize) => {
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.props.dispatch({
        type: 'emergency/resMaterialPage',
        payload: {
          pageNum,
          pageSize,
          isQuery: true,
          fuzzy: true,
          ...fieldsValue,
        },
      });
    });
  };
  // 重置搜索条件
  handleFormReset = () => {
    const { form, dispatch, resourceType } = this.props;
    form.resetFields();
    if (resourceType === 1) {
      dispatch({
        type: 'emergency/resourcePage',
        payload: {
          pageNum: 1,
          pageSize: 5,
          isQuery: true,
          fuzzy: true,
        },
      });
    } else if (resourceType === 2) {
      dispatch({
        type: 'emergency/resMaterialPage',
        payload: { pageNum: 1,
          pageSize: 5,
          isQuery: true,
          fuzzy: true,
        },
      });
    }
  };
  // 搜索函数
  handleSearch = (e) => {
    e.preventDefault();
    const { form, dispatch, resourceType } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (resourceType === 1) {
        dispatch({
          type: 'emergency/resourcePage',
          payload: {
            pageNum: 1,
            pageSize: 5,
            isQuery: true,
            fuzzy: true,
            ...fieldsValue },
        });
      } else if (resourceType === 2) {
        dispatch({
          type: 'emergency/resMaterialPage',
          payload: { pageNum: 1,
            pageSize: 5,
            isQuery: true,
            fuzzy: true,
            ...fieldsValue },
        });
      }
    });
  };
  onChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRow: selectedRows[0],
    });
  }
  render() {
    const { visible, add, handleCancel, form, resMaterialPage, name, resourceType, areaList, resourcePage } = this.props;
    const { getFieldDecorator } = form;
    const materialCols = [
      {
        title: '物资编号',
        dataIndex: 'materialCode',
        width: 100,
        key: 'materialCode',
        // render: (text, record) => {
        //   return record.planFeatureInfo.featureCode || '';
        // },
      }, {
        title: '物资名称',
        dataIndex: 'materialName',
        width: 100,
        key: 'materialName',
        // render: (text, record) => {
        //   return record.planFeatureInfo.featureCode || '';
        // },
      }];
    const resourceCols = [
      {
        title: '资源编号',
        dataIndex: 'resourceCode',
        width: 100,
        key: 'resourceCode',
        // render: (text, record) => {
        //   return record.planFeatureInfo.featureCode || '';
        // },
      }, {
        title: '资源名称',
        dataIndex: 'resourceName',
        width: 100,
        key: 'resourceName',
        // render: (text, record) => {
        //   return record.planFeatureInfo.featureCode || '';
        // },
      }, {
        title: '资源分区',
        dataIndex: 'areaName',
        width: 100,
        key: 'areaName',
        render: (text, record) => {
          return record.area ? (record.area.areaName || '') : '';
        },
      }];
    return (
      <Modal
        title="搜索物资"
        cancelText="取消"
        okText="保存"
        visible={visible}
        mask={false}
        maskClosable={false}
        destroyOnClose
        width="60%"
        onOk={() => add(this.state.selectedRow)}
        onCancel={handleCancel}
      >
        <div className={styles.search}>
          { resourceType === 2 ? (
            <Form onSubmit={this.handleSearch} layout="inline">
              <Row type="flex">
                <Col md={6} sm={24}>
                  <FormItem label="物资名称">
                    {getFieldDecorator('materialName', {
                      initialValue: name,
                    })(
                      <Input placeholder="请输入物资名称" />
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={24}>
                  <span className={styles.submitButtons}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                  </span>
                </Col>
              </Row>
            </Form>
          ) : (
            <Form onSubmit={this.handleSearch} layout="inline">
              <Row type="flex">
                <Col md={6} sm={24}>
                  <FormItem label="资源名称">
                    {getFieldDecorator('resourceName', {
                      initialValue: name,
                    })(
                      <Input placeholder="请输入资源名称" />
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={24}>
                  <FormItem label="资源分区">
                    {getFieldDecorator('areaID')(
                      <Select placeholder="请选择" style={{ width: 180 }}>
                        <Option value="">请选择</Option>
                        {areaList.map(type =>
                          <Option key={type.areaID} value={type.areaCode}>{type.areaName}</Option>
                        )}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={24}>
                  <span className={styles.submitButtons}>
                    <Button type="primary" htmlType="submit">查询</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                  </span>
                </Col>
              </Row>
            </Form>
          )
          }
        </div>
        {resourceType === 1 ? (
          <Table
            columns={resourceCols}
            rowSelection={{ type: 'radio', onChange: this.onChange }}
            dataSource={resourcePage.data}
            pagination={{
              ...resourcePage.pagination,
              onChange: this.resourcePage,
            }}
          />
        ) : (
          <Table
            columns={materialCols}
            rowSelection={{ type: 'radio', onChange: this.onChange }}
            dataSource={resMaterialPage.data}
            pagination={{
              ...resourcePage.pagination,
              onChange: this.resMaterialPage,
            }}
          />
        )
        }
      </Modal>
    );
  }
}
