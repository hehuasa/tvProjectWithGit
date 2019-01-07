import React, { PureComponent } from 'react';
import { Table, DatePicker, Form, Row, Col, Button, Select, Card } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './historyData.less';

const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
class HistoryData extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectStart: null,
      selectEnd: null,
      dateLength: 1,

      beginTime: null,
      endTime: null,

      quotaGroupCode: null,
      tableColumns: [],
    };
  }

  // onChange = (value) => {
  //   console.log('onChange ', value, arguments);
  //   this.setState({ value });
  // }
  componentDidMount() {
    this.props.dispatch({
      type: 'historyData/queryAllProfessionList',
      payload: {
        codeTypeCode: 107,
      },
    });
  }
  onProfessionAlsystem = (value) => {
    this.props.dispatch({
      type: 'historyData/queryTargetAll',
      payload: {
        profession: value,
      },
    });
    this.props.form.setFieldsValue({
      monitorQuotaGroupID: '',
      orgnizationCode: '',
      subsectionCode: '',
      resourceID: '',
      monitorQuotaID: [],
    });
  }
  onTargetAll = (value, option) => {
    this.props.dispatch({
      type: 'historyData/querydepartment',
      payload: {
        quotaGroupCode: option.ref,
      },
    });
    this.setState({
      quotaGroupCode: option.ref,
    });
    this.props.form.setFieldsValue({
      orgnizationCode: '',
      subsectionCode: '',
      resourceID: '',
      monitorQuotaID: [],
    });
  }
  onSelectDepartment = (value) => {
    const { getFieldsValue } = this.props.form;
    this.props.dispatch({
      type: 'historyData/querySubsection',
      payload: {
        quotaGroupCode: this.state.quotaGroupCode,
        parentOrganization: value,
      },
    });
    this.props.form.setFieldsValue({
      subsectionCode: '',
      resourceID: '',
      monitorQuotaID: [],
    });
  }
  onSelectSubsection = (value) => {
    const { getFieldsValue } = this.props.form;
    this.props.dispatch({
      type: 'historyData/queryResource',
      payload: {
        quotaGroupCode: this.state.quotaGroupCode,
        organizationCode: value,
      },
    });
    this.props.form.setFieldsValue({
      resourceID: '',
      monitorQuotaID: [],
    });
  }
  onSelectResource = (value) => {
    this.props.dispatch({
      type: 'historyData/queryAllQuota',
      payload: {
        resourceID: value,
      },
    });
    this.props.form.setFieldsValue({
      monitorQuotaID: [],
    });
  }
  onChangeTarget = (value, option) => {
    if (option.length === 0) {
      return;
    }
    const columns = [{
      title: '接收时间',
      dataIndex: 'collectTime',
      key: 'collectTime',
      render: (val) => {
        if (!val) {
          return '';
        }
        return moment(val).format('YYYY-MM-DD HH:mm:ss');
      },
    }];
    for (const item of option) {
      columns.push({
        title: item.props.children,
        dataIndex: item.ref,
        key: item.ref,
      });
    }
    this.setState({
      tableColumns: columns,
    });
  }
  handleSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const queryData = {
        // beginTime: fieldsValue.time[0].format('MM-DD HH:mm:ss'),
        // endTime: fieldsValue.time[1].format('MM-DD HH:mm:ss'),
        groupId: fieldsValue.monitorQuotaGroupID,
        resourceId: fieldsValue.resourceID,
        quotaIds: fieldsValue.monitorQuotaID,
      };

      //  测试
      const queryData22 = {
        groupId: [2],
        resourceId: 35864,
        quotaIds: 1,
        //  groupId - 分组ID
        // resourceId - 资源ID
        // quotaIds - 指标ID数组
      };

      this.props.dispatch({
        type: 'historyData/queryHistory',
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
  handleFormReset = () => {
    this.props.form.setFieldsValue({
      time: [moment().startOf('day'), moment().endOf('day')],
    });
  };
  handleClick = (record) => {
    // const { mapView } = this.props;
    // searchByAttr({ searchText: record.gISCode, searchFields: ['ObjCode'] }).then(
    //   (res) => {
    //     if (res.length > 0) {
    //       mapView.goTo({center: res[0].feature.geometry, scale: 7000}).then(() => {
    //         this.props.dispatch({
    //           type: 'resourceTree/selectByGISCode',
    //           payload: { pageNum: 1, pageSize: 1, isQuery: true, fuzzy: false, gISCode: record.gISCode },
    //         })
    //       });
    //     }
    //   }
    // );
  };


  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    const { allProfessionList, targetAll, departmentList, subsectionList, resourceList, target, targetSelectAll } = this.props.historyData;
    return (
      <Form onSubmit={this.handleSearch}>
        <div className={styles.formItem}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="专业系统"
              >
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
                      key={item.professionSystemCode}
                      value={item.professionSystemCode}
                    >{item.professionSystemName}
                    </Option>
                  ))}
                </Select>
              )}
              </FormItem>
            </Col>
            <Col md={8} sm={24}>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="监测指标组"
              >
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
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="部门"
              >
                {getFieldDecorator('orgnizationCode', {
                rules: [{ required: true, message: '部门不能为空' }],
              })(
                <Select
                  onSelect={this.onSelectDepartment}
                  placeholder="请选择"
                  style={{ width: '100%' }}
                >
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
                  style={{ width: '100%' }}
                >
                  {resourceList.map(item => (
                    <Option
                      key={item.resourceID}
                      value={item.resourceID}
                    >{item.installPosition}
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
                  onChange={this.onChangeTarget}
                  style={{ width: '100%' }}
                >
                  {target.map((item, index) => (
                    <Option
                      ref={item.quotaItem}
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

            <Col span={6} >
              <span>
                <Button type="primary" htmlType="submit">查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              </span>
            </Col>
          </Row>
        </div>
      </Form>
    );
  }

  render() {
    // const tableColumns = [
    //   {
    //     title: '时间',
    //     dataIndex: 'time',
    //     key: 'time',
    //   }, {
    //     title: '点位值',
    //     dataIndex: 'dot',
    //     key: 'dot',
    //   },
    // ];
    const loading = false;
    // this.props.historyData.list
    // console.log(33, this.state.tableColumns);
    // console.log(44, this.props.historyData.newListData);
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableListForm}>
            {this.renderForm()}
          </div>

          {/* <div style={{ height: '30px', lineHeight: '30px' }}>{`点位：`}</div> */}
          <Table
            loading={loading}
            rowKey={record => record.key}
            dataSource={this.props.historyData.newListData}
            columns={this.state.tableColumns}
            pagination
          />

        </Card>
      </PageHeaderLayout>

    );
  }
}

const anewHistoryData = (historyData) => {
  for (const item of historyData.subsectionList) {
    item.subsectionCode = item.orgnizationCode;
  }
  // 单个指标
  historyData.targetSelectAll = [];
  for (const itemObj of historyData.target) {
    historyData.targetSelectAll.push(itemObj.monitorQuotaID);
  }
  // 处理数据转为需要的格式
  const dataSourceList = []; // 新数组
  const newList = historyData.list;
  newList.sort((a, b) => { return a.collectTime - b.collectTime; });

  let currentTime = null; // 循环前一个时间
  let tempObj = {}; // 组装的对象

  for (const item of newList) {
    if (currentTime === item.collectTime) {
      tempObj[item.dataType] = item.value;
    } else {
      if (Object.keys(tempObj).length !== 0) {
        dataSourceList.push(tempObj);
      }
      tempObj = {};
      tempObj.collectTime = item.collectTime;
      tempObj[item.dataType] = item.value;
    }
    currentTime = item.collectTime;
  }
  historyData.newListData = dataSourceList;
  return historyData;
};
const defaultHistoryData = connect(({ historyData }) => ({
  historyData: anewHistoryData(historyData),
}))(HistoryData);

export default defaultHistoryData;
