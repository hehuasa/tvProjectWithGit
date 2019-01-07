import React, { PureComponent } from 'react';
import { Table, DatePicker, Form, Row, Col, Button, Select } from 'antd';
import moment from 'moment';
import { searchByAttr } from '../../../../../utils/mapService';
import styles from '../zoomComponents.less';

const Option = Select.Option;

const FormItem = Form.Item;
@Form.create()
export default class EntranceGuardListOneLevel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectStart: null,
      selectEnd: null,
      dateLength: 1,
    };
  }

  componentDidMount() {
    const { beginTime, endTime } = this.props.entranceGuard;
    this.page({ beginTime, endTime });
  }

  onOpenChangeTime = (status) => {
    if (!status) {
      this.setState({
        dateLength: 0,
      });
    }
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
  onEntranceGuardArea = (record) => {
    const { beginTime, endTime } = this.props.entranceGuard;
    this.props.dispatch({
      type: 'entranceGuard/stageAreaPerson',
      payload: {
        toggleTable: 'two',
        areaDoorData: {
          name: record.areaName,
          id: record.areaId,
        },
        beginTime: beginTime || moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        endTime: endTime || moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        type: 0,
      },
    });
  };
  onEntranceGuardDoor = (record) => {
    const { beginTime, endTime } = this.props.entranceGuard;
    this.props.dispatch({
      type: 'entranceGuard/stageDoorPerson',
      payload: {
        toggleTable: 'two',
        areaDoorData: {
          name: record.doorName,
          id: record.doorId,
        },
        beginTime: beginTime || moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        endTime: endTime || moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        type: 0,
      },
    });
  };


  handleFormReset = () => {
    this.page({
      beginTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      areaOrDoor: 1
    });
    this.props.form.setFieldsValue({
      time: [moment().startOf('day'), moment().endOf('day')],
    });
  };
  page = ({ beginTime = null, endTime = null, areaOrDoor = this.props.entranceGuard.areaOrDoor }) => {
    let typeModel;
    if (areaOrDoor === 2) {
      typeModel = 'entranceGuard/stageDoorQuery';
    } else {
      typeModel = 'entranceGuard/areaQuery';
    }
    this.props.dispatch({
      type: typeModel,
      payload: {
        toggleTable: 'one',
        beginTime: beginTime || moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        endTime: endTime || moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        areaOrDoor,
      },
    });
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
  onSelectArea = (value) => {
    this.page({ beginTime: this.props.entranceGuard.beginTime, endTime: this.props.entranceGuard.endTime, areaOrDoor: value });
  }
  handleSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const beginTime = fieldsValue.time ? fieldsValue.time[0].format('YYYY-MM-DD HH:mm:ss') : this.props.entranceGuard.beginTime;
      const endTime = fieldsValue.time ? fieldsValue.time[1].format('YYYY-MM-DD HH:mm:ss') : this.props.entranceGuard.endTime;
      this.page({ beginTime, endTime, areaOrDoor: fieldsValue.areaOrDoor });
    });
  };
  handleClick = (record) => {
    const { mapView } = this.props;
    searchByAttr({ searchText: record.gISCode, searchFields: ['ObjCode'] }).then(
      (res) => {
        if (res.length > 0) {
          mapView.goTo({ center: res[0].feature.geometry, scale: 7000 }).then(() => {
            this.props.dispatch({
              type: 'resourceTree/selectByGISCode',
              payload: { pageNum: 1, pageSize: 1, isQuery: true, fuzzy: false, gISCode: record.gISCode },
            })
          });
        }
      }
    );
  };
  renderForm = () => {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline" className={styles.fomQuery}>
        <Row >

          <Col span={8} >
            <FormItem
              label="门禁/区域"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('areaOrDoor', {
                initialValue: this.props.entranceGuard.areaOrDoor,
              })(
                <Select
                  style={{ width: '100%' }}
                  onSelect={this.onSelectArea}
                >
                  <Option value={1}>区域</Option>
                  <Option value={2}>门禁</Option>
                </Select>
              )}
            </FormItem>
          </Col>

          <Col span={12} >
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 19 }}
              label="日期"
            >
              {getFieldDecorator('time', {
                initialValue:
                  this.props.entranceGuard.beginTime ?
                    [moment(this.props.entranceGuard.beginTime, 'YYYY-MM-DD HH:mm:ss'), moment(this.props.entranceGuard.endTime, 'YYYY-MM-DD HH:mm:ss')] :
                    [moment().startOf('day'), moment().endOf('day')],
              })(
                <DatePicker.RangePicker
                  style={{ width: '100%' }}
                  placeholder={['开始日期', '结束日期']}
                  showTime={{
                    hideDisabledOptions: true,
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                  }}
                  format="YYYY-MM-DD HH:mm:ss"
                  setFieldsValue={[moment(this.props.entranceGuard.beginTime, 'YYYY-MM-DD HH:mm:ss'), moment(this.props.entranceGuard.endTime, 'YYYY-MM-DD HH:mm:ss')]}
                  allowClear={false}
                  onCalendarChange={this.onCalendarChange}
                  disabledDate={this.disabledDate}
                  onOpenChange={this.onOpenChangeTime}
                />
              )}
            </FormItem>
          </Col>

          <Col span={10} push={1} style={{ lineHeight: '39px' }}>
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
    let columns;
    switch (this.props.entranceGuard.areaOrDoor) {
      case 1:
        columns = [{
          title: '门禁区域',
          dataIndex: 'areaName',
          key: 'areaName',
          render: (text, record) => {
            return <a onClick={() => this.onEntranceGuardArea(record)} style={{ color: '#afe0ff', textDecoration: 'none' }}>{text}</a>;
          },
        }, {
          title: '进入区域人次',
          dataIndex: 'inNum',
          key: 'inNum',
        }, {
          title: '离开区域人次',
          dataIndex: 'outNum',
          key: 'outNum',
        }];
        break;
      case 2:
        columns = [
          {
            title: '门禁',
            dataIndex: 'doorName',
            key: 'doorName',
            render: (text, record) => {
              return <a onClick={() => this.onEntranceGuardDoor(record)} style={{ color: '#afe0ff', textDecoration: 'none' }}>{text}</a>;
            },
          }, {
            title: '进入人员数量',
            dataIndex: 'inNum',
            key: 'inNum',
          }, {
            title: '离开人员数量',
            dataIndex: 'outNum',
            key: 'outNum',
          }];

        break;
      default:
        break;
    }
    return (
      <div className={styles.regionWarp} >
        <div>
          {this.renderForm()}
        </div>
        <Table
          columns={columns}
          bordered
          dataSource={this.props.entranceGuard.list}
          scroll={{ x: 450 }}
          pagination
          rowKey={record => record.key}
          onRow={(record) => {
            return {
              onClick: () => this.handleClick(record), // 点击行
            };
          }}
        />
      </div>
    );
  }
}
