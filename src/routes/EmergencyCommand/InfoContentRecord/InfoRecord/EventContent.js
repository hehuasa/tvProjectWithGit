import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Col, Input, DatePicker, Select, Modal, Table, message, Radio } from 'antd';
import moment from 'moment';
import InfoRecord from './InfoRecord';
import { commonData } from '../../../../../mock/commonData';
import styles from './InfoRecord.less';
import { EDEADLK } from 'constants';

const FormItem = Form.Item;
const Search = Input.Search;
const Option = Select.Option;
const RadioGroup = Radio.Group;
// const { TextArea } = Input;

const pageInitial = {
  // 当前页
  pageNum: 1,
  // 每页显示条数
  pageSize: 5,
  isQuery: true,
  fuzzy: true,
};
const columns = [{
  title: '特征分类',
  dataIndex: 'featureTypeName',
  width: '20%',
}, {
  title: '特征名称',
  dataIndex: 'featureName',
  width: '70%',
}];

@connect(({ emergency, user }) => ({
  emergency,
  eventID: emergency.eventId,
  current: emergency.current,
  userId: user.currentUser.baseUserInfo.userID,
}))
@Form.create()
export default class EventContent extends PureComponent {
  state = {
    visible: false,
    rowSelection: {
      type: 'radio',
      // 选择的数据
      selectedRows: [],
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows,
        });
      },
    },
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'emergency/queryClassification',
      payload: 557,
    });
    this.props.dispatch({
      type: 'emergency/searchEventFeatures',
      payload: {
        pageNum: 1,
        pageSize: 5,
        eventID: this.props.eventID,
      },
    });
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  // 不同数据类型 不同特征规则 获取不同正则验证
  getPattern = () => {
    // dataType: 字符102.101 数字102.102 布尔102.104
    // featureExpresstion: > < = >= <= in
    const { dataType, featureExpresstion } = this.props.form.getFieldsValue(['dataType', 'featureExpresstion']);
    switch (dataType) {
      case '102.101':
        return featureExpresstion === 'in' ? /^[^,]+(?:,[^,]+)*$/ : null;
      case '102.102':
        return featureExpresstion === 'in' ? /^(-?(([1-9]+\d*|0)\.)?\d*)+(,(-?(([1-9]+\d*|0)\.)?\d*)+)$/ : /^-?(([1-9]+\d*|0)\.)?\d*$/;
      default: break;
    }
  };
  getMessage = () => {
    // dataType: 字符102.101 数字102.102 布尔102.104
    // featureExpresstion: > < = >= <= in
    const { dataType, featureExpresstion } = this.props.form.getFieldsValue(['dataType', 'featureExpresstion']);
    switch (dataType) {
      case '102.101':
        return featureExpresstion === 'in' ? '请输入正确格式,eg: 值1,值2,值3...' : null;
      case '102.102':
        return featureExpresstion === 'in' ? '请输入正确格式,eg: 0,100' : '请输入正确的数字';
      default:
        return '请输入特征值';
    }
  };
  handleOk = (e) => {
    const selectedRow = this.state.selectedRows;
    if (!selectedRow || selectedRow.length === 0) {
      return message.warning('请选择数据');
    }
    const { form } = this.props;
    form.setFieldsValue({
      featureType: selectedRow[0].featureType,
      dataType: selectedRow[0].dataType,
      featureID: selectedRow[0].featureID,
      eventFeature: selectedRow[0].featureName,
      eventFeatureDes: selectedRow[0].featureDes,
      featureExpresstion: selectedRow[0].featureExpresstion,
    });
    form.resetFields(['featureValue']);
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  // 下一页
  onhandleTableChange = (pagination, filtersArg, sorter) => {
    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      eventID: this.props.eventID,
      isQuery: true,
      fuzzy: true,
      featureValue: this.state.featureValue,
    };
    this.props.dispatch({
      type: 'emergency/searchEventFeatures',
      payload: params,
    });
  }
  // 搜索
  onSearchFeature = (val) => {
    this.props.dispatch({
      type: 'emergency/searchEventFeatures',
      payload: {
        ...pageInitial,
        eventID: this.props.eventID,
        featureName: val,
      },
    });
  }
  // 重置搜索条件
  handleFormReset = () => {
    this.props.dispatch({
      type: 'emergency/searchEventFeatures',
      payload: {
        pageNum: 1,
        pageSize: 10,
        eventID: this.props.eventID,
      },
    });
  };
  onSend = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const time = new Date(fieldsValue.occurTimes.format('YYYY-MM-DD HH:mm:ss'));
      fieldsValue.occurTimes = time.getTime();
      fieldsValue.eventID = this.props.emergency.eventId;
      fieldsValue.userID = this.props.userId;
      if (fieldsValue.featureID === undefined) {
        delete fieldsValue.featureID;
      }
      this.props.dispatch({
        // type: 'emergency/seveEventContent',
        type: 'emergency/addFeature',
        payload: fieldsValue,
      }).then(() => {
        // 请求事件信息记录
        this.props.dispatch({
          type: 'emergency/queryEventInfo',
          payload: { eventID: fieldsValue.eventID },
        });
        if (this.props.emergency.current === 5) {
          this.props.dispatch({
            type: 'emergency/getExpandFeature',
            payload: { eventID: fieldsValue.eventID },
          });
        }
        form.resetFields();
        this.setState({
          selectedRows: [],
        });
      });
    });
  }
  render() {
    const { form, emergency, current } = this.props;
    return (
      <div className={styles.eventContent}>
        <FormItem
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 0 }}
        >
          {form.getFieldDecorator('featureID')(
            <Input placeholder="事件id" />
          )}
        </FormItem>
        <Row type="flex" className={styles.rowPaddingRight}>
          <Col md={8} sm={24}>
            <FormItem
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              label="特征分类"
            >
              {form.getFieldDecorator('featureType', {
                rules: [
                  { required: true, message: '特征分类不能为空' },
                ],
              })(
                <Select
                  placeholder="请选择"
                  style={{ width: '100%' }}
                >
                  {this.props.emergency.classificationList.map(item => (
                    <Option
                      key={item.codeID}
                      value={item.code}
                    >{item.codeName}
                    </Option>
                  ))}
                </Select>

              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              label="发生时间"
            >
              {form.getFieldDecorator('occurTimes', {
                rules: [
                  { required: true, message: '时间不能为空' },
                ],
                initialValue: moment(),
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="请选择时间"
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24} >
            <FormItem
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              label="特征名称"
            >
              {form.getFieldDecorator('eventFeature', {
                rules: [
                  { required: true, message: '事件特征名称不能为空' },
                  { max: 100, message: '长度不超过100' },
                ],
              })(
                <Input placeholder="请输入事件特征名称" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24} >
            {form.getFieldValue('dataType') === '102.104' ? (
              <FormItem
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
                label="特征值"
              >
                {form.getFieldDecorator('featureValue', {
                  initialValue: true,
                })(
                  <RadioGroup>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            ) : (
                <FormItem
                  labelCol={{ span: 10 }}
                  wrapperCol={{ span: 14 }}
                  label="特征值"
                >
                  {form.getFieldDecorator('featureValue', {
                    rules: [
                      { pattern: this.getPattern(), message: this.getMessage() },
                    ],
                  })(
                    <Input placeholder={this.getMessage()} />
                  )}
                </FormItem>
              )}
          </Col>
          <Col md={8} sm={24} >
            <FormItem
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              label="描述"
            >
              {form.getFieldDecorator('eventFeatureDes', {
                initialValue: '',
                rules: [
                ],
              })(
                <Input placeholder="请输入事件描述" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col md={16} offset={8} sm={24} >
            <Button className={styles.eventButton} onClick={this.showModal}>查看特征库</Button>
            <Modal
              title="事件特征"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              style={{ position: 'absolute', left: 260 }}
              width="60%"
            // bodyStyle={{ maxHeight: 600, overflow: 'auto' }}
            >
              <Row gutter={24} >
                <Col className={styles.search}>
                  <Search
                    style={{ width: 350 }}
                    placeholder="特征名称"
                    enterButton="搜索"
                    onSearch={this.onSearchFeature}
                  />
                  <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
                </Col>
              </Row >
              <Table
                pagination={emergency.pagination}
                rowSelection={this.state.rowSelection}
                columns={columns}
                dataSource={emergency.existEventFeaturesList}
                onChange={this.onhandleTableChange}
                rowKey={record => record.featureID}
              />
            </Modal>
            {current !== -1 && current !== -2 ? <Button type="primary" className={styles.eventButton} onClick={this.onSend} >提交</Button> : null}
          </Col>
        </Row >
      </div>
    );
  }
}
