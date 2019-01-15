import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Select,
  Table, Modal,
} from 'antd';
import styles from './index.less';

const alarmStatus = [
  { alarmStatue: 1, alarmStatueName: '未处理' },
  { alarmStatue: 2, alarmStatueName: '已处理' },
  { alarmStatue: 3, alarmStatueName: '自动恢复' },
  { alarmStatue: 4, alarmStatueName: '已生成应急事件' },
  { alarmStatue: 5, alarmStatueName: '非应急报警' },
  { alarmStatue: 6, alarmStatueName: '已关闭' },
];

const FormItem = Form.Item;
const { Option } = Select;
@connect(({ alarmHistory, alarm, loading }) => ({
  data: alarmHistory.data,
  pagination: alarmHistory.pagination,
  alarmTypeList: alarm.alarmTypeList,
  loading: loading.effects['alarmHistory/fetch'],
}))
@Form.create()
export default class AlarmHistory extends PureComponent {
  state = {
    alarmStatue: ['2', '3', '5', '6'],
    // 弹框的显示控制
    modalVisible: false,
    alarmDetail: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'alarmHistory/fetch',
      payload: {
        pageSize: 5, pageNum: 1, alarmStatues: [2, 3, 5, 6],
      },
    });
  }
  columns = [
    {
      title: '事发位置',
      dataIndex: 'alarmExtendAlarmInfoVO.place',
      width: '20%',
    },
    {
      title: '报警类型',
      dataIndex: 'alarmType.alarmTypeName',
      width: '10%',
    },
    {
      title: '报警点位',
      dataIndex: 'resourceName',
      width: '20%',
    },
    {
      title: '报警状态',
      dataIndex: 'alarmStatue',
      width: '10%',
      render: val => (alarmStatus.find(value => value.alarmStatue === val) ? <span>{alarmStatus.find(value => value.alarmStatue === val).alarmStatueName}</span> : ''),
    },
    {
      title: '首报时间',
      dataIndex: 'alarmTime',
      width: '15%',
      render: (val) => {
        if (!val) {
          return '';
        }
        return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>;
      },
    },
    // {
    //   title: '报警人',
    //   dataIndex: 'alarmExtendAlarmInfoVO.alarmUserName',
    // },
    // {
    //   title: '末报时间',
    //   dataIndex: 'receiveTime',
    // },
    // {
    //   title: '处理人',
    //   dataIndex: 'title',
    // },
    // {
    //   title: '处理时间',
    //   dataIndex: 'DealTime',
    //   render: (val) => {
    //     if (!val) {
    //       return '';
    //     }
    //     return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>;
    //   },
    // },
    // {
    //   title: '处理结果',
    //   dataIndex: 'DealResault',
    // },
    // {
    //   title: '警情摘要',
    //   dataIndex: 'AlarmDes',
    // },
    {
      title: '操作',
      width: '10%',
      dataIndex: 'op',
      render: (text, record) => (
        <span>
          <a onClick={() => this.showDetail(record)}>详情</a>
        </span>
      ),
    },
  ];
  showDetail = (alarm) => {
    this.setState({ modalVisible: true, alarmDetail: alarm });
  };
  handleChange = ({ pageSize, pageNum }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'alarmHistory/fetch',
      payload: {
        pageSize, pageNum,
      },
    });
  };
  handleSubmit= () => {
    const { form, dispatch, pagination } = this.props;
    const value = form.getFieldsValue();
    // 去掉前后空格
    // for (const [index, item] of Object.entries(value)) {
    //   if (item) {
    //     value[index] = item.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    //   }
    // }
    dispatch({
      type: 'alarmHistory/fetch',
      payload: { ...pagination, isQuery: true, fuzzy: true, ...value },
    }).then(() => {
      this.setState({
        alarmStatue: [],
      });
    });
  };
  handleFormReset = () => {
    const { form, dispatch, pagination } = this.props;
    form.resetFields();
    form.setFieldsValue({ alarmStatues: [] });
    dispatch({
      type: 'alarmHistory/fetch',
      payload: { ...pagination, pageNum: 1 },
    });
  };
  handlePageChange = (pageNum, pageSize) => {
    const { form, dispatch } = this.props;
    const value = form.getFieldsValue();
    dispatch({
      type: 'alarmHistory/fetch',
      payload: { pageNum, pageSize, ...value },
    });
  };

  render() {
    const { data, form, pagination, alarmTypeList, loading, functionInfo } = this.props;
    const { getFieldDecorator } = form;
    const { modalVisible, alarmStatue, alarmDetail } = this.state;
    return (
      <div className={styles.warp}>
        <Card bordered={false} title={functionInfo.functionName}>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem label="报警类型">
                  {getFieldDecorator('alarmTypeName')(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                      {alarmTypeList.map(type =>
                        <Option key={type.alarmTypeName}>{type.alarmTypeName}</Option>
                      )}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <FormItem label="报警状态">
                  {getFieldDecorator('alarmStatues', { initialValue: alarmStatue })(
                    <Select mode="multiple" placeholder="请选择" style={{ width: '100%' }}>
                      {alarmStatus.map(type =>
                        <Option key={type.alarmStatue}>{type.alarmStatueName}</Option>
                      )}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col md={8} sm={24}>
                <Button type="primary" style={{ marginLeft: 8 }} htmlType="submit">查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset} htmlType="button">重置</Button>
              </Col>
            </Row>
          </Form>
          <Table
            dataSource={data}
            columns={this.columns}
            loading={loading}
            scroll={{ x: 1240 }}
            pagination={{ total: pagination.sumCount, current: pagination.pageNum, pageSize: pagination.pageSize, pageSizeOptions: ['5', '10', '20', '30'], onShowSizeChange: this.handlePageChange, onChange: this.handlePageChange, showSizeChanger: true, showQuickJumper: true }}
          />
        </Card>
        <Modal
          destroyOnClose
          title="报警详情"
          visible={modalVisible}
          width="80%"
          onCancel={() => this.setState({ modalVisible: false })}
          footer={null}
        >
          <Card>
            <Col span={4}>报警状态：</Col>
            <Col span={8}>{alarmStatus.find(value => value.alarmStatue === alarmDetail.alarmStatue) ? <span>{alarmStatus.find(value => value.alarmStatue === alarmDetail.alarmStatue).alarmStatueName}</span> : ''}</Col>
            <Col span={4}>首报时间：</Col>
            <Col span={8}>{alarmDetail.receiveTime ? moment(alarmDetail.receiveTime).format('YYYY-MM-DD HH:mm:ss') : '/'}</Col>
            <Col span={4}>报警位置：</Col><Col span={8}>{alarmDetail.areaName ? alarmDetail.areaName : '/'}</Col>
            <Col span={4}>所属装置：</Col><Col span={8}>{alarmDetail.orgName ? alarmDetail.orgName : '/'}</Col>
            <Col span={4}>报警类型：</Col><Col span={8}>{alarmDetail.alarmType ? alarmDetail.alarmType.alarmTypeName : '/'}</Col>
            <Col span={4}>报警级别：</Col><Col span={8}>{alarmDetail.alarmType ? alarmDetail.alarmType.dangerCoefficient : '/'}</Col>
            <Col span={4}>事发部位：</Col><Col span={8}>{alarmDetail.alarmExtendAlarmInfoVO ? alarmDetail.alarmExtendAlarmInfoVO.accidentPostion ? alarmDetail.alarmExtendAlarmInfoVO.accidentPostion : '/' : '/'}</Col>
            {/* <Col span={4}>监测器具：</Col><Col span={8}>{alarmDetail.alarmExtendAlarmInfoVO ? alarmDetail.alarmExtendAlarmInfoVO.accidentPostion : ''}</Col> */}
            {/* <Col span={4}>事件物质：</Col><Col span={8}>{alarmDetail.alarmExtendAlarmInfoVO ? alarmDetail.alarmExtendAlarmInfoVO.accidentPostion : ''}</Col> */}
            {/* <Col span={4}>事件物质：</Col><Col span={8}>{alarmDetail.alarmExtendAlarmInfoVO ? alarmDetail.alarmExtendAlarmInfoVO.accidentPostion : ''}</Col> */}
            <Col span={4}>事发原因：</Col><Col span={8}>{alarmDetail.alarmExtendAlarmInfoVO ? alarmDetail.alarmExtendAlarmInfoVO.incidentReason ? alarmDetail.alarmExtendAlarmInfoVO.incidentReason : '/' : '/'}</Col>
            <Col span={4}>事发位置：</Col><Col span={8}>{alarmDetail.alarmExtendAlarmInfoVO ? alarmDetail.alarmExtendAlarmInfoVO.place ? alarmDetail.alarmExtendAlarmInfoVO.place : '/' : '/'}</Col>
            <Col span={4}>警情摘要：</Col><Col span={8}>{alarmDetail.alarmDes ? alarmDetail.alarmDes : '/'}</Col>
            <Col span={4}>事发设备：</Col><Col span={8}>{alarmDetail.resourceName ? alarmDetail.resourceName : '/'}</Col>
            <Col span={4}>报警现状：</Col><Col span={8}>{alarmDetail.alarmExtendAlarmInfoVO ? alarmDetail.alarmExtendAlarmInfoVO.alarmStatuInfo ? alarmDetail.alarmExtendAlarmInfoVO.alarmStatuInfo : '/' : '/'}</Col>
            <Col span={4}>补充报警描述：</Col><Col span={8}>{alarmDetail.alarmExtendAlarmInfoVO ? alarmDetail.alarmExtendAlarmInfoVO.extendAlarmDes ? alarmDetail.alarmExtendAlarmInfoVO.extendAlarmDes : '/' : '/'}</Col>
            <Col span={4}>已采取措施：</Col><Col span={8}>{alarmDetail.alarmExtendAlarmInfoVO ? alarmDetail.alarmExtendAlarmInfoVO.adoptMeasure ? alarmDetail.alarmExtendAlarmInfoVO.adoptMeasure : '/' : '/'}</Col>
            <Col span={4}>处理人：</Col><Col span={8}>{alarmDetail.alarmAlarmDeal ? alarmDetail.alarmAlarmDeal.user ? alarmDetail.alarmAlarmDeal.user.userName : '/' : '/'}</Col>
            <Col span={4}>处理结束时间：</Col><Col span={8}>{alarmDetail.alarmAlarmDeal ? alarmDetail.alarmAlarmDeal.dealTime ? moment(alarmDetail.alarmAlarmDeal.dealTime).format('YYYY-MM-DD HH:mm:ss') : '/' : '/'}</Col>
            <Col span={4}>处理结果：</Col><Col span={8}>{alarmDetail.alarmAlarmDeal ? alarmDetail.alarmAlarmDeal.dealResult ? alarmDetail.alarmAlarmDeal.dealResult : '/' : '/'}</Col>
            <Col span={4}>处理说明：</Col><Col span={8}>{alarmDetail.alarmAlarmDeal ? alarmDetail.alarmAlarmDeal.remark ? alarmDetail.alarmAlarmDeal.remark : '/' : '/'}</Col>
          </Card>
        </Modal>
      </div>
    );
  }
}

