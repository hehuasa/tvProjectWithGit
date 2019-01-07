import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Form, Input, Button, Select, DatePicker } from 'antd';
import styles from './index.less';


const { Option } = Select;
const FormItem = Form.Item;
//筛选与搜索
const switchData = (data, { endTime, orgnizationName, jobType, startTime }) => {
  const array = [];
  for (const item of data) {
    for (const item1 of item.data) {
      item1.area = item.area;
      array.push(item1);
    }
  }
  const array1 = orgnizationName !== '' ? array.filter(value => value.baseOrganization.orgnizationName.indexOf(orgnizationName) !== -1) : array;
  const array2 = jobType !== '' ? array1.filter(value => value.jobType.indexOf(jobType) !== -1 || jobType.indexOf(value.jobType)) : array1;
  const array3 = startTime === '' && endTime === '' ? array2 : array2.filter((value) => {
    return (
      (endTime === '' ? true : Number(value.startTime) < endTime.valueOf())
      &&
      (startTime === '' ? true : Number(value.endTime) > startTime.valueOf())
    );
  }
  );
  return array3;
};
const hasErrors = (fieldsError) => {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
};
const columns = [
  {
    title: '作业流水号',
    dataIndex: 'serialNumber',
    key: 'serialNumber',
  },
  {
    title: '作业类别',
    dataIndex: 'jobType',
    key: 'jobType',
  }, {
    title: '申请单位',
    dataIndex: 'baseOrganization',
    key: 'baseOrganization',
    render: (value) => {
      return value ? value.orgnizationName || '' : '';
    },
  }, {
    title: '作业地点',
    dataIndex: 'jobPlace',
    key: 'jobPlace',
  },
  {
    title: '作业开始时间',
    dataIndex: 'startTime',
    key: 'startTime',
    render: (value) => {
      return moment(value).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  {
    title: '作业结束时间',
    dataIndex: 'endTime',
    key: 'endTime',
    render: (value) => {
      return moment(value).format('YYYY-MM-DD HH:mm:ss');
    },
  },
];
const range = {
  startTime: '',
  endTime: '',
};
@connect(({ constructMonitor, map }) => {
  return {
    groupingList: constructMonitor.groupingList,
    list: constructMonitor.list,
    view: map.mapView,
  };
})
class FromComponent extends PureComponent {
  state = {
    orgnizationName: '',
    jobType: '',
    startTime: '',
    endTime: '',
  }
  handleSubmit= (e) => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const value = form.getFieldsValue();
    for (const [index, item] of Object.entries(value)) {
      this.setState({ [index]: item || '' });
      if (index === 'range') {
        for (const [index1, item1] of Object.entries(item)) {
          item[index1] = item1.valueOf();
        }
      }
    }
  };
  handlePageChange = (page) => {
    const { form, dispatch } = this.props;
    const value = form.getFieldsValue();
    dispatch({
      type: 'accessControl/getDoorPage',
      payload: { pageSize: 10, pageNum: page, ...value },
    });
  };
  handleChange = (date, type) => {
    range[type] = date;
  };
  disabledStartDate = (startValue) => {
    const { endTime } = range;
    if (!startValue || !endTime) {
      return false;
    }
    return startValue.valueOf() > endTime.valueOf();
  };
  disabledEndDate = (endValue) => {
    const { startTime } = range;
    if (!startTime || !endValue) {
      return false;
    }
    return endValue.valueOf() <= startTime.valueOf();
  };
  render() {
    const { startTime, orgnizationName, jobType, endTime } = this.state;
    const { groupingList, form } = this.props;
    const { getFieldDecorator, getFieldsError } = form;
    const newData = switchData(groupingList, { startTime, endTime, orgnizationName, jobType });
    return (
      <div className={styles.warp}>
        <h2>作业监控统计</h2>
        <Form layout="inline" onSubmit={this.handleSubmit} className={styles.form}>
          <FormItem>
            {getFieldDecorator('orgnizationName')(
              <Input placeholder="申请单位" />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('jobType')(
              <Input placeholder="作业类型" />
            )}
          </FormItem>
          {/*<FormItem>*/}
            {/*{getFieldDecorator('startTime')(<DatePicker disabledDate={this.disabledStartDate} value={range.startTime} onChange={(date) => { this.handleChange(date, 'startTime'); }} />)}*/}
            {/*~*/}
            {/*{getFieldDecorator('endTime')(<DatePicker disabledDate={this.disabledEndDate} style={{ marginBottom: 20 }} onChange={(date) => { this.handleChange(date, 'endTime'); }} value={range.endTime} />)}*/}
          {/*</FormItem>*/}
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              搜索
            </Button>
          </FormItem>
        </Form>
        <Table className={styles.table} size="small" dataSource={newData} columns={columns} scroll={{ x: 450 }} bordered pagination={{ onChange: this.handlePageChange }} />
      </div>
    );
  }
}
const ConstructMonitor = Form.create()(FromComponent);
export default ConstructMonitor;

