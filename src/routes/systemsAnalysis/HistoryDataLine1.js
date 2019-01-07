import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { DatePicker, Form, Row, Col, Button, Select, Card } from 'antd';
import moment from 'moment';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import HistoryLineInfo from './HistoryDataLineInfo';
import HistoryDataLineControl from './HistoryDataLineControl';


import styles from './historyData.less';

const FormItem = Form.Item;
const Option = Select.Option;
// formatter: value => (moment(parseFloat(value)).format('YYYY-MM-DD HH:mm:ss')), // 格式化文本内容

const anewHistoryLine = (historyLine) => {
  for (const item of historyLine.subsectionList) {
    item.subsectionCode = item.orgnizationCode;
  }
  historyLine.newTarget = []
  for (const itemObj of Object.keys(historyLine.target)) {
    historyLine.newTarget.push({
      target: itemObj, id: Math.random(), name: historyLine.target[itemObj]
    })
  }
  return historyLine;
}

@connect(({ historyLine }) => ({
  historyLine: anewHistoryLine(historyLine)
}))
@Form.create()

export default class HistoryLine extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      selectStart: null,
      selectEnd: null,
      dateLength: 1,

      beginTime: null,
      endTime: null,

      quotaGroupCode: null,
      visible: false, // 弹框的显示控制
      dotValue: [],
    };
  }

  // onChange = (value) => {
  //   console.log('onChange ', value, arguments);
  //   this.setState({ value });
  // }
  componentDidMount() {
    this.props.dispatch({
      type: 'historyLine/queryAllProfessionList',
      payload: {
        codeTypeCode: 107,
      }
    });
  }
  onProfessionAlsystem = (value) => {
    this.props.dispatch({
      type: 'historyLine/queryTargetAll',
      payload: {
        profession: value,
      },
    });
    this.props.form.setFieldsValue({
      monitorQuotaGroupID: '',
    });

  }
  onTargetAll = (value, option) => {
    this.props.dispatch({
      type: 'historyLine/querydepartment',
      payload: {
        quotaGroupCode: option.ref,
      },
    });
    this.setState({
      quotaGroupCode: option.ref,
    })
  }
  onSelectDepartment = (value) => {
    const { getFieldsValue } = this.props.form;
    this.props.dispatch({
      type: 'historyLine/querySubsection',
      payload: {
        quotaGroupCode: this.state.quotaGroupCode,
        parentOrganization: value,
      },
    });
  }
  onSelectSubsection = (value) => {
    const { getFieldsValue } = this.props.form;
    this.props.dispatch({
      type: 'historyLine/queryResource',
      payload: {
        quotaGroupCode: this.state.quotaGroupCode,
        organizationCode: value,
      },
    });
  }
  onSelectResource = (value) => {
    this.props.dispatch({
      type: 'historyLine/queryAllQuota',
      payload: {
        resourceID: value,
      },
    });
  }

  handleSearch = (e) => {
    e.preventDefault();
    const { form, historyLine } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const queryData = {
        // beginTime: fieldsValue.time[0].format('MM-DD HH:mm:ss'),
        // endTime: fieldsValue.time[1].format('MM-DD HH:mm:ss'),
        groupId: fieldsValue.monitorQuotaGroupID,
        resourceId: fieldsValue.resourceID,
        quotaIds: fieldsValue.monitorQuotaID,
        list: historyLine.list,
      }

      this.props.dispatch({
        type: 'historyLine/queryHistory',
        payload: queryData,
      });

    });
  };
  onCalendarChange = (value) => {
    if (value.length === 1) {
      this.setState({
        selectStart: moment(value[0]).subtract(7, 'days'),
        selectEnd: moment(value[0]).add(7, 'days'),
        dateLength: value.length,
      });
    } else {
      this.setState({
        dateLength: value.length,
      });
    }
  };
  disabledDate = (current) => {
    if (this.state.dateLength === 1 && this.state.selectEnd && this.state.selectStart) {
      if (current < moment(this.state.selectEnd) && current > moment(this.state.selectStart)) {
        return false;
      } else {
        return true;
      }
    }
  };
  onOpenChangeTime = (status) => {
    if (!status) {
      this.setState({
        dateLength: 0,
      });
    }
  };
  onhandleFormReset = () => {
    this.props.form.setFieldsValue({
      time: [moment().startOf('day'), moment().endOf('day')],
    });
  };
  onChange = () => {

  }
  onChange1 = () => {

  }
  onCheckAllChange = () => {

  }
  onCheckAllChange1 = () => {

  }
  // 打开
  onSelectedPoint = () => {
    this.setState({
      visible: true,
    });
  };
  //确定
  onHandleOk = () => {
    this.setState({
      visible: false,
    });
  }
  //取消
  onhandleCancel = () => {
    this.setState({
      visible: false,
    });
  };
  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { allProfessionList, targetAll, departmentList, subsectionList, resourceList, target, } = this.props.historyLine;

    return (
      <Form onSubmit={this.handleSearch} layout="inline" >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>

          <Col md={8} sm={24}>
            <FormItem label="专业系统">
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '专业系统不能为空' }],
              })(
                <Select
                  onSelect={this.onProfessionAlsystem}
                  placeholder="请选择"
                  style={{ width: '100%' }}
                >
                  {allProfessionList.map(item => (
                    <Option
                      key={item.code}
                      value={item.code}
                    >{item.codeName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="监测指标组">
              {getFieldDecorator('monitorQuotaGroupID', {
                rules: [{ required: true, message: '监测指标组不能为空' }],
              })(
                <Select
                  onSelect={this.onTargetAll}
                  placeholder="请选择"
                  style={{ width: '100%' }}
                >
                  {targetAll.map(item => (
                    <Option
                      ref={item.quotaGroupCode}
                      key={item.monitorQuotaGroupID}
                      value={item.monitorQuotaGroupID}
                    >{item.quotaGroupName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="部门">
              {getFieldDecorator('orgnizationCode', {
                rules: [{ required: true, message: '部门不能为空' }],
              })(
                <Select
                  onSelect={this.onSelectDepartment}
                  placeholder="请选择"
                  style={{ width: '100%' }}>
                  {departmentList.map(item => (
                    <Option
                      key={item.orgID}
                      value={item.orgnizationCode}
                    >{item.orgnizationName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="分部">
              {getFieldDecorator('subsectionCode', {
                rules: [{ required: true, message: '分部不能为空' }],
              })(
                <Select
                  onSelect={this.onSelectSubsection}
                  placeholder="请选择"
                  style={{ width: '100%' }}
                >
                  {subsectionList.map(item => (
                    <Option
                      key={item.orgID}
                      value={item.subsectionCode}
                    >{item.orgnizationName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="资源">
              {getFieldDecorator('resourceID', {
                rules: [{ required: true, message: '资源点位不能为空' }],
              })(
                <Select
                  onSelect={this.onSelectResource}
                  placeholder="请选择"
                  style={{ width: '100%' }}>
                  {resourceList.map(item => (
                    <Option
                      key={item.resourceID}
                      value={`${item.resourceID}&${item.processNumber}`}
                    >{item.processNumber}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="监测指标">
              {getFieldDecorator('monitorQuotaID', {
                rules: [{ required: true, message: '监测指标不能为空' }],
                initialValue: [],
              })(
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                >
                  {target.map((item, index) => (
                    <Option
                      key={item.monitorQuotaID}
                      value={item.monitorQuotaID}
                    >{item.quotaName}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24} >
            <FormItem label="日期" >
              {getFieldDecorator('time', {
                initialValue: [moment().startOf('day'), moment().endOf('day')],
              })(
                <DatePicker.RangePicker
                  style={{ width: '100%' }}
                  showTime={{ format: 'HH:mm' }}
                  format="MM-DD HH:mm"
                  placeholder={['开始日期', '结束日期']}
                  allowClear={false}
                  onCalendarChange={this.onCalendarChange}
                  disabledDate={this.disabledDate}
                  onOpenChange={this.onOpenChangeTime}
                />
              )}
            </FormItem>
          </Col>

          <Col span={8} >
            <span>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.onhandleFormReset}>重置</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.onSelectedPoint}>查看已选点位</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {

    return (

      <PageHeaderLayout>
        <Card bordered={false}>

          <div className={styles.tableListForm}>
            {this.renderForm()}
          </div>
          <HistoryDataLineControl
            historyLine={this.props.historyLine}
            onChange={this.onChange}
            onChange1={this.onChange1}
            onCheckAllChange={this.onCheckAllChange}
            onCheckAllChange1={this.onCheckAllChange1}
            dispatch={this.props.dispatch}

          />
        </Card>
        <HistoryLineInfo
          visible={this.state.visible}
          onHandleOk={this.onHandleOk}
          onhandleCancel={this.onhandleCancel}
          dotValue={this.state.dotValue}
        />
      </PageHeaderLayout>



    );
  }
}


// okHandle={this.okHandle}
// modalVisible={this.state.modalVisible}
// onhandleCancel={this.onhandleCancel}
