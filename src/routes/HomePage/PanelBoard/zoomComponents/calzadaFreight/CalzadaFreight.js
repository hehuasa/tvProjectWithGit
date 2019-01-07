import React, { PureComponent } from 'react';
import { Table, DatePicker, Form, Row, Col, Button, Select } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { searchByAttr } from '../../../../../utils/mapService';
import styles from '../zoomComponents.less';

const FormItem = Form.Item;
const Option = Select.Option;

// 排队状态（领取防火罩、已进厂、已出厂、准备进厂）、进出厂类别（物资进厂、物资出厂）、运输产品的名称、开卡量、库位、车牌号、驾驶员信息、登记门岗、进厂时间、出厂时间
// 查询条件有：进厂时间（时间段）、出厂时间（时间段）、排除状态、进出厂类别
const columns = [{
  title: '产品名称',
  dataIndex: 'alarmType',
  key: 'alarmType',
}, {
  title: '状态',
  dataIndex: 'alarmDes',
  key: 'alarmDes',
}, {
  title: '进出/厂',
  dataIndex: 'resourceName',
  key: 'resourceName',
}, {
  title: '开卡量',
  dataIndex: 'resourceName5',
  key: 'resourceName5',
}, {
  title: '库位',
  dataIndex: 'resourceName4',
  key: 'resourceName4',
}, {
  title: '车牌号',
  dataIndex: 'resourceName3',
  key: 'resourceName3',
}, {
  title: '驾驶员信息',
  dataIndex: 'resourceName2',
  key: 'resourceName2',
}, {
  title: '登记门岗',
  dataIndex: 'resourceName1',
  key: 'resourceName1',
}, {
  title: '进厂时间',
  dataIndex: 'receiveTime',
  key: 'receiveTime',
  render: (val) => {
    if (!val) {
      return '';
    }
    return <span>{moment(val).format('HH:mm:ss')}</span>;
  },
}, {
  title: '出厂时间',
  dataIndex: 'receiveTime1',
  key: 'receiveTime1',
  render: (val) => {
    if (!val) {
      return '';
    }
    return <span>{moment(val).format('HH:mm:ss')}</span>;
  },
}];

const dataSource = [{
  key: '1',
  name: '胡彦斌',
  age: 32,
  address: '西湖区湖底公园1号'
}, {
  key: '2',
  name: '胡彦祖',
  age: 42,
  address: '西湖区湖底公园1号'
}];

@Form.create()
@connect(({ alarm, map }) => ({
  alarm, mainMap: map.mainMap,
}))
class CalzadaFreight extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        pageNum: 1,
        pageSize: 10,
        isQuery: true,
        fuzzy: false,
      },
    };
  }
  componentDidMount() {
    // this.props.dispatch({
    //   type: 'alarm/fetch',
    // });
  }
  handleClick = (record) => {
    console.log(record);
    // const { mainMap } = this.props;
    // searchByAttr({ searchText: record.resourceGisCode, searchFields: ['ObjCode'] }).then(
    //   (res) => {
    //     if (res.length > 0) {
    //       mainMap.centerAt(res[0].feature.geometry).then(() => {
    //         mainMap.setScale(7000);
    //       });
    //     }
    //   }
    // );
  };

  handleSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      console.log(err, fieldsValue)
    })
  };

  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" className={styles.fomQuery}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>

          <Col span={12} >
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 19 }}
              label="进厂时间段"
            >
              {getFieldDecorator('time')(
                <DatePicker.RangePicker
                  style={{ width: '100%' }}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder={['开始日期', '结束日期']}
                  allowClear={false}
                />
              )}
            </FormItem>
          </Col>

          <Col span={12} >
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 19 }}
              label="出厂时间段"
            >
              {getFieldDecorator('time1')(
                <DatePicker.RangePicker
                  style={{ width: '100%' }}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder={['开始日期', '结束日期']}
                  allowClear={false}
                />
              )}
            </FormItem>
          </Col>

          <Col span={8} >
            <FormItem
              label="状态"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('areaId')(
                <Select
                  style={{ width: '100%' }}
                  onSelect={this.onSelectArea}
                >
                  <Select.Option value="jack">Jack</Select.Option>
                  <Select.Option value="lucy">Lucy</Select.Option>
                </Select>
              )}
            </FormItem>
          </Col>

          <Col span={8} >
            <FormItem
              label="进出/厂"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
               {getFieldDecorator('areaId')(
                <Select
                  style={{ width: '100%' }}
                  onSelect={this.onSelectArea}
                >
                  <Select.Option value="jack">Jack</Select.Option>
                  <Select.Option value="lucy">Lucy</Select.Option>
                </Select>
              )}
            </FormItem>
          </Col>


          <Col span={6} style={{ lineHeight: '39px' }}>
            <span>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { pagination } = this.state.pagination;
    return (
      <div className={styles.regionWarp}>
        <div>
          {this.renderForm()}
        </div>
        <Table
          columns={columns}
          bordered
          rowClassName={styles.cursorStyle}
          dataSource={dataSource}
          size="small"
          scroll={{ x: 450 }}
          rowKey={record => record.alarmCode}
          onRow={(record) => {
            return {
              onClick: () => this.handleClick(record), // 点击行
            };
          }}
          pagination={pagination}
        />
      </div>
    );
  }
}

export default CalzadaFreight;

