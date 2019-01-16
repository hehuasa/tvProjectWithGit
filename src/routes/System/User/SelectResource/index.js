import React, { PureComponent } from 'react';
import { Row, Col, Card, Form, Input, Radio, Table, Button, Select } from 'antd';
import { connect } from 'dva';
import { commonData } from '../../../../../mock/commonData';
import styles from './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
@connect(({ emergency, template, roleInfo }) => ({
  areaList: emergency.areaList,
  resourcePage: roleInfo.resourcePage,
  resourceIDs: roleInfo.resourceIDs,
  professionIDs: roleInfo.professionIDs,
  deviceSelectType: roleInfo.deviceSelectType,
  byResource: roleInfo.byResource,
}))
@Form.create()
export default class SelectResource extends PureComponent {
  componentDidMount() {
    // 请求区域
    this.props.dispatch({
      type: 'emergency/getAreaList',
    });
    // 请求资源
    this.page(1, 5);
  }
  page = (pageNum, pageSize) => {
    this.props.dispatch({
      type: 'roleInfo/resourcePage',
      payload: { pageNum, pageSize },
    });
  };
  // 表格翻页
  onPageChange = (pageNum, pageSize) => {
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'roleInfo/resourcePage',
        payload: { ...fieldsValue, isQuery: true, fuzzy: true, pageNum, pageSize },
      });
    });
  };
  // 重置搜索条件
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.page(1, 5);
  };
  // 搜索函数
  handleSearch = (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'roleInfo/resourcePage',
        payload: { ...fieldsValue, isQuery: true, fuzzy: true, pageNum: 1, pageSize: 5 },
      });
    });
  };
  onChange = (selectedRowKeys) => {
    this.props.dispatch({
      type: 'roleInfo/saveResourceIDs',
      payload: selectedRowKeys,
    });
    // 跟新报警类型
    this.props.dispatch({
      type: 'roleInfo/alarmTypePage',
      payload: {
        pageNum: 1,
        pageSize: 5,
        resourceIDs: selectedRowKeys,
        deviceSelectType: this.props.deviceSelectType,
      },
    });
  };
  onByResourceChange = (e) => {
    this.props.dispatch({
      type: 'roleInfo/saveByResource',
      payload: e.target.value,
    });
  };

  render() {
    const { form, name, areaList, resourcePage, resourceIDs, byResource } = this.props;
    const { getFieldDecorator } = form;
    const resourceCols = [
      {
        title: '资源编号',
        dataIndex: 'resourceCode',
        width: '10%',
        key: 'resourceCode',
      }, {
        title: '工艺位号',
        dataIndex: 'processNumber',
        width: '10%',
        key: 'processNumber',
      }, {
        title: '资源名称',
        dataIndex: 'resourceName',
        width: '20%',
        key: 'resourceName',
      }, {
        title: '资源分区',
        dataIndex: 'areaName',
        width: '20%',
        key: 'areaName',
        // render: (text, record) => {
        //   return record.area ? (record.area.areaName || '') : '';
        // },
      }, {
        title: '安装位置',
        dataIndex: 'installPostion',
        width: '20%',
        key: 'installPostion',
      }, {
        title: '说明',
        dataIndex: 'remark',
        width: '15%',
        key: 'remark',
      }];
    const rangeExtra = (
      <RadioGroup onChange={this.onByResourceChange} value={byResource}>
        {commonData.byResouece.map((obj) => {
          return (
            <Radio key={obj.id} value={obj.value}>{obj.text}</Radio>
          );
        })}
      </RadioGroup>
    );
    return (
      <div>
        <Card title="设备选择类型" extra={rangeExtra}>
          { byResource === 2 ? (
            <div>
              <div className={styles.search}>
                <Form onSubmit={this.handleSearch} layout="inline">
                  <Row type="flex">
                    <Col md={9} sm={24}>
                      <FormItem label="资源名称">
                        {getFieldDecorator('resourceName', {
                        initialValue: name,
                      })(
                        <Input placeholder="请输入资源名称" />
                      )}
                      </FormItem>
                    </Col>
                    <Col md={9} sm={24}>
                      <FormItem label="资源分区">
                        {getFieldDecorator('areaID')(
                          <Select placeholder="请选择" style={{ width: 160 }}>
                            <Option value="">请选择</Option>
                            {areaList.map(type =>
                              <Option key={type.areaID} value={type.areaCode}>{type.areaName}</Option>
                          )}
                          </Select>
                      )}
                      </FormItem>
                    </Col>
                    <Col md={4} sm={24}>
                      <span className={styles.submitButtons}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                      </span>
                    </Col>
                  </Row>
                </Form>
              </div>
              <Table
                columns={resourceCols}
                rowSelection={{
                  onChange: this.onChange,
                  selectedRowKeys: resourceIDs,
          }}
                dataSource={resourcePage.data}
                pagination={{
                  ...resourcePage.pagination,
                  onChange: this.onPageChange,
          }}
                rowKey={record => record.resourceID}
              />
            </div>
            ) : null
          }
        </Card>
      </div>
    );
  }
}
