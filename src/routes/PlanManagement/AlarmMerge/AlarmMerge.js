import React, { PureComponent } from 'react';
import { Table, Form, Row, Col, Card, Input, Select, Icon, Button, Dropdown, Menu, TreeSelect, DatePicker, Modal, message, Divider, Popconfirm } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import StandardTable from '../../../components/StandardTable';
import { commonData } from '../../../../mock/commonData';
import EmergencyCommand from './EmergencyCommand';
import styles from './alarmMerge.less';

const FormItem = Form.Item;
const { TextArea } = Input;

const columns = [{
  title: '序号',
  dataIndex: 'sort',
  key: 'sort',
  width: '5%',
  render: (text, record, index) => {
    return index + 1;
  },
}, {
  title: '报警类型',
  dataIndex: 'alarmType.alarmTypeName',
  key: 'alarmType',
  width: '20%',
}, {
  title: '报警点位编号',
  dataIndex: 'alarmDes',
  key: 'alarmDes',
  width: '20%',
}, {
  title: '报警点位名称',
  dataIndex: 'resourceName',
  key: 'resourceName',
  width: '20&',
}, {
  title: '首报时间',
  dataIndex: 'receiveTime',
  key: 'receiveTime',
  width: '15%',
  render: (val) => {
    if (!val) {
      return '';
    }
    return <span>{moment(val).format('HH:mm:ss')}</span>;
  },
}];

@connect(({ alarm, emergency }) => ({
  alarm,
  emergency,
}))
@Form.create()
export default class AlarmMerge extends PureComponent {

  state = {
    visible: false,
    alarmRows: [], // 选择的报警
    eventRows: [], // 选择的事件
    alarmSelection: {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          alarmRows: selectedRows,
        })
      },
    },
    eventSelection: {
      type: 'radio',
      // 选择的数据
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          eventRows: selectedRows,
        });
      },
    },
  };
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="标题">
              {getFieldDecorator('title')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户类型">
              {getFieldDecorator('statu')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Select.Option value="">请选择</Select.Option>
                  {/* {statuData.map(item =>
                    <Select.Option key={item.id} value={item.value}>{item.text}</Select.Option>
                  )} */}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  //  点击 报警归并
  onHandleModalVisible = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergency/undoneEventList',
      // payload: {
      //   pageNum: 1,
      //   pageSize: 10,
      //   eventStatu: 0,
      // },
    });
    this.setState({
      visible: true,
    });
  }
  //  点击 归并
  onHandleOk = () => {
    if (this.state.eventRows.length === 0) {
      return message.warning('请选择事件');
    }
    const sendData = {
      eventID: this.state.eventRows[0].eventID,
      alarmIDs: [],
    }
    for (const item of this.state.alarmRows) {
      sendData.alarmIDs.push(item.alarmId)
    }
    // 合并
    const { dispatch } = this.props;
    dispatch({
      type: 'emergency/mergeAlarm',
      payload: sendData,
    }).then(() => {
      message.warning('成功归并报警');
      // 请求报警数据
      dispatch({
        type: 'alarm/fetch',
      });
      this.setState({
        visible: false,
        alarmRows: [],
        eventRows: [],
      });
    })
  }
  onHandleCancel = () => {
    this.setState({
      visible: false,
      eventRows: [],
    });
  }
  render() {
    const { alarm } = this.props;
    return (
      <PageHeaderLayout >
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>
              {this.renderForm()}
            </div> */}
            <div className={styles.tableListOperator}>
              <Button type="primary" disabled={this.state.alarmRows.length === 0} onClick={this.onHandleModalVisible}>
                归并事件
              </Button>
              {/* <Button icon="export" type="primary" onClick={() => console.log('导出')}>
                导出
              </Button> */}
            </div>
            <Table
              columns={columns}
              rowClassName={styles.cursorStyle}
              dataSource={alarm.list}
              scroll={{ x: 1000, y: 360 }}
              rowKey={record => record.alarmCode}
              rowSelection={this.state.alarmSelection}
            />
          </div>
          <EmergencyCommand
            title="应急指挥事件"
            visible={this.state.visible}
            eventSelection={this.state.eventSelection}
            emergency={this.props.emergency}
            dispatch={this.props.dispatch}
            onHandleOk={this.onHandleOk}
            onHandleCancel={this.onHandleCancel}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
