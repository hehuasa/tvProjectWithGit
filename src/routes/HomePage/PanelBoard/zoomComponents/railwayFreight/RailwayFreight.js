import React, { PureComponent } from 'react';
import { Table, DatePicker, Form, Row, Col, Button } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { searchByAttr } from '../../../../../utils/mapService';
import styles from '../zoomComponents.less';
const FormItem = Form.Item;

// .铁路运输看板以列表显示铁路运输的详细信息，显示的字段有：发货时间、发货单号、产品名称、实发量、计划量、车船号。
const columns = [{
  title: '产品名称',
  dataIndex: 'alarmType',
  key: 'alarmType',
}, {
  title: '发货时间',
  dataIndex: 'receiveTime',
  key: 'receiveTime',
  render: (val) => {
    if (!val) {
      return '';
    }
    return <span>{moment(val).format('HH:mm:ss')}</span>;
  },
}, {
  title: '发货单号',
  dataIndex: 'resourceName',
  key: 'resourceName',
}, {
  title: '实发量',
  dataIndex: 'resourceName5',
  key: 'resourceName5',
}, {
  title: '计划量',
  dataIndex: 'resourceName4',
  key: 'resourceName4',
}, {
  title: '车船号',
  dataIndex: 'resourceName3',
  key: 'resourceName3',
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
class RailwayFreight extends PureComponent {
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
    console.log(record)
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
              label="发货时间段"
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

export default RailwayFreight;

