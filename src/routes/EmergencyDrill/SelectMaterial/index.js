import React, { PureComponent } from 'react';
import { Row, Col, Modal, Form, Input, Table, Button, Select } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
@connect(({ drillManage, loading }) => ({
  materialPage: drillManage.materialPage,
  areaList: drillManage.areaList,
  resourcePage: drillManage.resourcePage,
  loading,
}))
@Form.create()
export default class SelectMaterial extends PureComponent {
  state = {
    selectedRow: {},
    selectedRows: [], // 选中的行
  };
  componentDidMount() {
    if (this.props.resourceType === 1) {
      this.props.dispatch({
        type: 'drillManage/getAreaList',
      });
    }
  }
  // 重置搜索条件
  handleFormReset = () => {
    const { form, dispatch, resourceType } = this.props;
    form.resetFields();
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (resourceType === 1) {
        dispatch({
          type: 'drillManage/geResourcePage',
          payload: { pageNum: 1, pageSize: 5 },
        });
      } else if (resourceType === 2) {
        dispatch({
          type: 'drillManage/getMaterialPage',
          payload: { pageNum: 1, pageSize: 5 },
        });
      }
    });
  };
  // 搜索函数
  handleSearch = () => {
    const { form, dispatch, resourceType } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (resourceType === 1) {
        dispatch({
          type: 'drillManage/geResourcePage',
          payload: { ...fieldsValue, pageNum: 1, pageSize: 5, isQuery: true, fuzzy: true },
        });
      } else if (resourceType === 2) {
        dispatch({
          type: 'drillManage/getMaterialPage',
          payload: { ...fieldsValue, pageNum: 1, pageSize: 5, isQuery: true, fuzzy: true },
        });
      }
    });
  };
  onChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRow: selectedRows[0],
    });
  };
  // 选择行
  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  };
  // table变化
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    if (sorter.field) {
      // params.sorter = `${sorter.field}_${sorter.order}`;
      const { field, order } = sorter;
      params.sorter = { field, order };
    }
    const url = this.props.resourceType === 1 ?
      'drillManage/geResourcePage' : 'drillManage/getMaterialPage';
    this.props.form.validateFields((err, fieldsValue) => {
      const params = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...formValues,
        ...filters,
        ...fieldsValue,
      };
      dispatch({
        type: url,
        payload: params,
      });
    });
  };
  render() {
    const { visible, add, handleCancel, form, materialPage, name, resourceType, areaList, resourcePage } = this.props;
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
            <Form layout="inline">
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
                    <Button type="primary" onClick={this.handleSearch}>查询</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                  </span>
                </Col>
              </Row>
            </Form>
          ) : (
            <Form layout="inline">
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
                          <Option key={type.areaID} value={type.areaID}>{type.areaName}</Option>
                        )}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={24}>
                  <span className={styles.submitButtons}>
                    <Button type="primary" onClick={this.handleSearch}>查询</Button>
                    <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                  </span>
                </Col>
              </Row>
            </Form>
          )
          }
        </div>
        <Table
          columns={resourceType === 1 ? resourceCols : materialCols}
          rowSelection={{ type: 'radio', onChange: this.onChange }}
          dataSource={resourceType === 1 ? resourcePage.data : materialPage.data}
          onChange={this.handleStandardTableChange}
          pagination={
            resourceType === 1 ?
              { ...resourcePage.pagination } :
              { ...materialPage.pagination }
        }
        />

      </Modal>
    );
  }
}
