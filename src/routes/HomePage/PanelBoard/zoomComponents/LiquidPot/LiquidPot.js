import React, { PureComponent } from 'react';
import { Table, DatePicker, Form, Row, Col, Button, Input } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { searchByAttr } from '../../../../../utils/mapService';
import styles from '../zoomComponents.less';

const FormItem = Form.Item;

// 罐存区域、罐组名称、罐编码、罐名称、罐存液位、罐容量、罐存率；
// 查询条件包括含 罐存区域、罐组名称、罐编码/罐名称 
const columns = [{
  title: '罐存区域',
  dataIndex: 'alarmType',
  key: 'alarmType',
}, {
  title: '罐组名称',
  dataIndex: 'alarmDes',
  key: 'alarmDes',
}, {
  title: '罐编码',
  dataIndex: 'resourceName',
  key: 'resourceName',
}, {
  title: '罐名称',
  dataIndex: 'resourceName5',
  key: 'resourceName5',
}, {
  title: '罐存液位',
  dataIndex: 'resourceName4',
  key: 'resourceName4',
}, {
  title: '罐容量',
  dataIndex: 'resourceName3',
  key: 'resourceName3',
}, {
  title: '罐存率',
  dataIndex: 'resourceName2',
  key: 'resourceName2',
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
class LiquidPot extends PureComponent {
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

  handleTableChange = (pagination, filtersArg, sorter) => {
    // const { dispatch } = this.props;
    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      isQuery: true,
      fuzzy: false,
    };
    // dispatch({
    //   type: 'vocs/areaQuery',
    //   payload: params,
    // });
  }

  handleSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      console.log( err, fieldsValue )
    })
  };

  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" className={styles.fomQuery}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>

          <Col span={8} >
            <FormItem
              label="罐存区域"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('title')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col span={8} >
            <FormItem
              label="罐组名称"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('title1')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col span={8} >
            <FormItem
              label="罐编码"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('title2')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col span={8} >
            <FormItem
              label="罐名称"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('title3')(
                <Input placeholder="请输入" />
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
          loading={this.state.loading}
          onChange={this.handleTableChange}

        />
      </div>
    );
  }
}

export default LiquidPot;

