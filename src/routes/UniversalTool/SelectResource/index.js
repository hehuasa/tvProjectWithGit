import React, { PureComponent } from 'react';
import { Row, Col, Card, Form, Input, Radio, Table, Button, Select } from 'antd';
import { connect } from 'dva';
import { commonData } from '../../../../mock/commonData';
import styles from './index.less';

const FormItem = Form.Item;
const Option = Select.Option;
@connect(({ emergency, template }) => ({
  areaList: emergency.areaList,
  resourcePage: template.resourcePage,
  resourceIDs: template.resourceIDs,
  professionIDs: template.professionIDs,
  alarmRange: template.alarmRange,
}))
@Form.create()
export default class SelectResource extends PureComponent {
  state = {
    selectedRow: {},
  };
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
      type: 'template/resourcePage',
      payload: { pageNum, pageSize },
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
        type: 'template/resourcePage',
        payload: { ...fieldsValue, isQuery: true, fuzzy: true, pageNum: 1, pageSize: 5 },
      });
    });
  };
  onChange = (selectedRowKeys) => {
    this.props.dispatch({
      type: 'template/saveResourceIDs',
      payload: selectedRowKeys,
    });
    // 跟新报警类型
    this.props.dispatch({
      type: 'template/alarmTypePage',
      payload: {
        pageNum: 1,
        pageSize: 5,
        resourceIDs: selectedRowKeys,
        deviceSelectType: this.props.alarmRange,
      },
    });
  };

  render() {
    const { form, name, areaList, resourcePage, resourceIDs } = this.props;
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
    return (
      <div>
        <div className={styles.search}>
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
        </div>
        <Card>
          <Table
            columns={resourceCols}
            rowSelection={{
              onChange: this.onChange,
              selectedRowKeys: resourceIDs,
            }}
            dataSource={resourcePage.data}
            pagination={{
              ...resourcePage.pagination,
                onChange: this.page,
            }}
            rowKey={record => record.resourceID}
          />
        </Card>
      </div>
    );
  }
}
