import React, { PureComponent } from 'react';
import { Form, Row, Col, Input, Select, Modal, Table, message, Button } from 'antd';
import { connect } from 'dva';
import { alarmStatus } from '../../../../utils/utils';
import styles from './InfoContent.less';

const { TextArea } = Input;
const { Option } = Select;
const FormItem = Form.Item;
const { Search } = Input;
const columns = [
  {
    title: '用户名字',
    dataIndex: 'userName',
    width: 200,
  }, {
    title: '拼音',
    dataIndex: 'queryKey',
    width: 120,
  }, {
    title: '性别',
    dataIndex: 'sex',
    width: 100,
  }, {
    title: '手机号码',
    dataIndex: 'mobile',
    width: 200,
  }, {
    title: '短号',
    dataIndex: 'shortNumber',
    width: 120,
  }, {
    title: '电话号码',
    dataIndex: 'phoneNumber',
    width: 120,
  }, {
    title: '邮箱',
    dataIndex: 'eMail',
    width: 200,
  }, {
    title: '办公地址',
    dataIndex: 'officeAddr',
    width: 200,
  }];

@connect(({ alarmDeal, emergency, alarm }) => ({
  alarmDeal,
  eventID: emergency.eventId,
  emergency,
  alarm,
}))
export default class HandAlarmDeal extends PureComponent {
  state = {
    selectedRows: [], // 报警人选择的数据
    alarmPersonVisible: false, // 报警人弹框显示
    searchPerson: null, // 查询输入值
    personRowSelection: {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows,
        });
      },
    },
  };
  // componentDidMount() {
  //   const {  eventID } = this.props;
  //   this.props.dispatch({
  //     type: 'emergency/queryEventInfoReport',
  //     payload: {
  //       id: eventID,
  //     },
  //   })
  // }
  // 选择查询
  onSearchUser = (value) => {
    this.props.dispatch({
      type: 'emergency/searchPersonInfo',
      payload: {
        pageNum: 1,
        pageSize: 10,
        userName: value,
        isQuery: true,
        fuzzy: true,
      },
    });
    this.setState({
      alarmPersonVisible: true,
    });
  };
  // 报警人分页
  onhandleTableChange = (pagination, filtersArg, sorter) => {
    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      isQuery: true,
      fuzzy: true,
    };
    this.props.form.validateFields(['userName', 'queryKey'], (err, values) => {
      if (err) return;
      Object.assign(params, values);
      for (const obj in params) {
        if (params[obj] === undefined || params[obj] === '' || params[obj] === null) {
          delete params[obj];
        }
      }
      this.props.dispatch({
        type: 'emergency/searchPersonInfo',
        payload: params,
      });
    });
  };
  // 搜索人员
  onSearchPerson = (e) => {
    e.preventDefault();
    const params = {
      pageNum: 1,
      pageSize: 10,
      isQuery: true,
      fuzzy: true,
    };
    this.props.form.validateFields(['userName', 'queryKey'], (err, values) => {
      if (err) return;
      Object.assign(params, values);
      for (const obj in params) {
        if (params[obj] === undefined || params[obj] === '' || params[obj] === null) {
          delete params[obj];
        }
      }
      this.props.dispatch({
        type: 'emergency/searchPersonInfo',
        payload: params,
      });
    });
  };
  // 重置
  handleReset = () => {
    this.props.form.resetFields(['userName', 'queryKey']);
    this.props.dispatch({
      type: 'emergency/searchPersonInfo',
      payload: { pageNum: 1, pageSize: 10 },
    });
  };
  // 确认
  onPersonHandleOk = () => {
    const row = this.state.selectedRows;
    if (row.length > 0) {
      const { form } = this.props;
      form.setFieldsValue({
        alarmPerson: row[0].userName,
        telPhone: row[0].mobile,
      });
      this.setState({
        alarmPersonVisible: false,
      });
    } else {
      message.info('请选择一条数据');
    }
  };
  // 关闭
  onPersonHandleCancel = (e) => {
    this.setState({
      alarmPersonVisible: false,
    });
  };

  render() {
    const { form, emergency } = this.props;
    const { eventInfoReport } = this.props.emergency;

    return (
      <div className={styles.alarmDeal}>
        <Row type="flex" >
          <Col>
            <FormItem
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 0 }}
            >
              {form.getFieldDecorator('probeResource', {
                initialValue: eventInfoReport.probeResource ? eventInfoReport.probeResource.resourceID : null,
              })(
                <Input placeholder="监测器具" />
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 0 }}
            >
              {form.getFieldDecorator('resResourceInfo', {
                initialValue: eventInfoReport.resResourceInfo ? eventInfoReport.resResourceInfo.resourceID : null,
              })(
                <Input placeholder="事发设备" />
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 0 }}
            >
              {form.getFieldDecorator('rawMaterialIds', {
                initialValue: eventInfoReport.resRawMaterialInfos && eventInfoReport.resRawMaterialInfos[0] ? eventInfoReport.resRawMaterialInfos[0].rawMaterialID : null,
              })(
                <Input placeholder="事件物质" />
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 0 }}
            >
              {form.getFieldDecorator('organization', {
                initialValue: eventInfoReport.organization ? eventInfoReport.organization.orgID : null,
              })(
                <Input placeholder="事发部门" />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="事件名称"
            >
              {form.getFieldDecorator('eventName', {
                initialValue: eventInfoReport.eventName,
              })(
                <Input disabled />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            />
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="事发位置"
            >
              {form.getFieldDecorator('place', {
                initialValue: eventInfoReport.eventPlace,
              })(
                <Input disabled />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="报警类型"
            >
              {form.getFieldDecorator('alarmTypeId', {
                initialValue: eventInfoReport.alarmType ? eventInfoReport.alarmType.alarmTypeID : '',
              })(
                <Select disabled style={{ width: '100%' }} >
                  {
                    this.props.alarm.alarmTypeList.map(item => (
                      <Option key={item.alarmTypeID} value={item.alarmTypeID}>{item.alarmTypeName}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="事发部门"
            >
              {form.getFieldDecorator('organization1', {
                initialValue: eventInfoReport.organization ? eventInfoReport.organization.orgnizationName : null,
              })(
                <Input disabled />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="报警现状"
            >
              {form.getFieldDecorator('alarmStatuInfo', {
                initialValue: alarmStatus(eventInfoReport.alarmStatuInfo),
              })(
                <Input disabled />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="监测器具"
            >
              {form.getFieldDecorator('probeResourceID1', {
                initialValue: eventInfoReport.probeResource ? eventInfoReport.probeResource.resourceName : null,
              })(
                <Input disabled />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="事发原因"
            >
              {form.getFieldDecorator('incidentReason', {
                initialValue: eventInfoReport.incidentReason,
              })(
                <Input disabled />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="事发设备"
            >
              {form.getFieldDecorator('resResourceInfo1', {
                initialValue: eventInfoReport.resResourceInfo ? eventInfoReport.resResourceInfo.resourceName : null,
              })(
                <Input disabled />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="设备位置"
            >
              {form.getFieldDecorator('installPosition', {
                initialValue: eventInfoReport.resResourceInfo ? eventInfoReport.resResourceInfo.installPosition : null,
              })(
                <Input disabled />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="事件物质"
            >
              {form.getFieldDecorator('rawMaterialIds1', {
                initialValue: eventInfoReport.resRawMaterialInfos && eventInfoReport.resRawMaterialInfos[0] ? eventInfoReport.resRawMaterialInfos[0].rawMaterialName : null,
              })(
                <Input disabled />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="报警人"
            >
              {form.getFieldDecorator('acceptAlarmUserID ', {
                initialValue: eventInfoReport.alarmPerson,
              })(
                <Input disabled />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="事发部位"
            >
              {form.getFieldDecorator('accidentPostion', {
                initialValue: eventInfoReport.accidentPostion,
              })(
                <Input disabled />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="联系电话"
            >
              {form.getFieldDecorator('telPhone', {
                initialValue: eventInfoReport.telPhone,
              })(
                <Input disabled />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="警情摘要"
            >
              {form.getFieldDecorator('alarmDes', {
                initialValue: eventInfoReport.alarmDes,
              })(
                <TextArea rows={3} disabled />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="已采取措施"
            >
              {form.getFieldDecorator('adoptMeasure', {
                initialValue: eventInfoReport.adoptMeasure,
              })(
                <TextArea rows={3} disabled />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="处警说明"
            >
              {form.getFieldDecorator('extendAlarmDes', {
                initialValue: eventInfoReport.extendAlarmDes,
              })(
                <TextArea rows={3} disabled />
              )}
            </FormItem>
          </Col>
        </Row>
        <Modal
          title="选择人员"
          visible={this.state.alarmPersonVisible}
          onOk={this.onPersonHandleOk}
          onCancel={this.onPersonHandleCancel}
          width="60%"
          bodyStyle={{ maxHeight: 600, overflow: 'auto' }}
          zIndex="1003"
        >
          <Row gutter={24}>
            <Form
              className={styles.formSearch}
              onSubmit={this.onSearchPerson}
            >
              <Row gutter={24}>
                <Col span={8}>
                  <FormItem
                    label="姓名"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                  >
                    {form.getFieldDecorator('userName', {
                      rules: [],
                    })(
                      <Input placeholder="请输入姓名" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    label="拼音"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                  >
                    {form.getFieldDecorator('queryKey', {
                      rules: [],
                    })(
                      <Input placeholder="请输入拼音" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <Button type="primary" htmlType="submit">搜索</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                    重置
                  </Button>
                </Col>
              </Row>
            </Form>
          </Row>
          <Table
            pagination={emergency.personPagination}
            rowSelection={this.state.personRowSelection}
            columns={columns}
            dataSource={emergency.personList}
            onChange={this.onhandleTableChange}
            rowKey={record => record.userID}
            scroll={{ x: 800, y: 600 }}
          />
        </Modal>
      </div>
    );
  }
}
