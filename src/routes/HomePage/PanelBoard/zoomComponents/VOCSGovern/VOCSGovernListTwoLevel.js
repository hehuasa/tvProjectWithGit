import React, { PureComponent } from 'react';
import { Table, DatePicker, Form, Row, Col, Button, Select } from 'antd';
import moment from 'moment';
import styles from '../zoomComponents.less';

const FormItem = Form.Item;

@Form.create()
export default class VOCSGovernListTwoLevel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  onGetArea = () => {
    this.props.dispatch({
      type: 'vocs/toggleArea',
      payload: {
        toggleTable: 'one',
        list: [],
      },
    });
  };

  handleSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let areaName = {};
      if (fieldsValue.areaId) {
        this.props.vocs.areasSelectList.map((item) => {
          if (item.areaID === fieldsValue.areaId) {
            areaName = {
              id: fieldsValue.areaId,
              name: item.areaName,
            };
          }
        });
      }
      this.props.dispatch({
        type: 'vocs/stageDoorQuery',
        payload: {
          toggleTable: 'two',
          areaName,
        },
      });
    });
  };

  handleFormReset = () => {
    this.props.dispatch({
      type: 'vocs/stageDoorQuery',
      payload: {
        toggleTable: 'two',
        areaName: this.props.vocs.areaName,
      },
    });
    this.props.form.setFieldsValue({
      time: [moment().startOf('day'), moment().endOf('day')],
    });
  };

  // handleTableChange = (pagination, filtersArg, sorter) => {
  //   const { dispatch } = this.props;
  //   const params = {
  //     pageNum: pagination.current,
  //     pageSize: pagination.pageSize,
  //     isQuery: true,
  //     fuzzy: false,
  //   };
  //   dispatch({
  //     type: 'vocs/areaQuery',
  //     payload: params,
  //   });
  // }

  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" className={styles.fomQuery}>
        <Row >
          <Col span={6} >
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="计划名称"
            >
              {getFieldDecorator('areaId', {
                initialValue: this.props.vocs.planName.id,
              })(
                <Select style={{ width: '100%' }} >
                  {this.props.vocs.areasSelectList.map(item => (
                    <Select.Option
                      key={item.areaID}
                      value={item.areaID}
                    >{item.areaName}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={6} push={1} style={{ lineHeight: '39px' }}>
            <span>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    // 组件标签号、密封点描述、检测日期、密封点类型、泄漏部位、密封点扩展号、设备位号、维修次数、维修状态
    const { pagination } = this.props.vocs;
    const columns = [
      {
        title: '组件标签号',
        dataIndex: 'partTag',
        key: 'partTag',
        render: (text, record) => {
          return text;
        },
      }, {
        title: '密封点描述',
        dataIndex: 'sealDes',
        key: 'sealDes',

      }, {
        title: '检测日期',
        dataIndex: 'checkDate',
        key: 'checkDate',
      }, {
        title: '密封点类型',
        dataIndex: 'sealType',
        key: 'sealType',
      }, {
        title: '泄漏部位',
        dataIndex: 'leakPart',
        key: 'leakPart',
      }, {
        title: '密封点扩展号',
        dataIndex: 'sealExtendCode',
        key: 'sealExtendCode',
      }, {
        title: '设备位号',
        dataIndex: 'deviceCode',
        key: 'deviceCode',
      }, {
        title: '维修次数',
        dataIndex: 'repairTimes',
        key: 'repairTimes',
      }, {
        title: '维修状态',
        dataIndex: 'repairState',
        key: 'repairState',
      }];
    // const paginationProps = {
    //   showQuickJumper: true,
    //   ...pagination,
    // };

    return (
      <div className={styles.regionWarp} >
        <div className={styles.breadcrumb} >
          <a onClick={this.onGetArea} style={{ color: '#afe0ff', textDecoration: 'none' }}>装置区域</a>
          <i>{'>'}</i>
          <span>{this.props.vocs.planName.name}</span>
        </div>

        <Table
          columns={columns}
          bordered
          dataSource={this.props.vocs.list}
          scroll={{ x: 450 }}
          pagination
          rowKey={record => record.vOCsCheckPointID}
          onRow={(record) => {
            return {
              // onClick: () => console.log(record), // 点击行
            };
          }}
          // pagination={paginationProps}
          loading={this.state.loading}
          // onChange={this.handleTableChange}
        />
      </div>
    );
  }
}
