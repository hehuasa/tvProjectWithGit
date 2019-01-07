import React, { PureComponent } from 'react';
import { Table, DatePicker, Form, Row, Col, Button, Select, Icon } from 'antd';
import moment from 'moment';
import { searchByAttr } from '../../../../../utils/mapService';
import styles from '../zoomComponents.less';

const FormItem = Form.Item;
const Option = Select.Option;

const personType = [{
  typeId: 0, type: '全部',
}, {
  typeId: 1, type: '进入',
}, {
  typeId: 2, type: '出去',
}];

@Form.create()
export default class EntranceGuardListThreeLevel extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectStart: null,
      selectEnd: null,
      dateLength: 1,
    };
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
  onSelectArea = (value) => {
    this.props.dispatch({
      type: 'entranceGuard/queryAreaOfDoor',
      payload: {
        areaId: value,
        doorName: {
          id: 0,
          name: '全部',
        },
      },
    });

    this.props.form.setFieldsValue({
      doorID: 0,
    });
  };
  onGetArea = () => {
    // this.props.dispatch({
    //   type: 'entranceGuard/toggleArea',
    //   payload: {},
    // });
    let typeModel;
    if (this.props.entranceGuard.areaOrDoor === 2) {
      typeModel = 'entranceGuard/stageDoorQuery';
    } else {
      typeModel = 'entranceGuard/areaQuery';
    }
    this.props.dispatch({
      type: typeModel,
      payload: {
        toggleTable: 'one',
        beginTime: this.props.entranceGuard.beginTime,
        endTime: this.props.entranceGuard.endTime,
        areaOrDoor: this.props.entranceGuard.areaOrDoor,
      },
    });


  };

  handleSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;



    form.validateFields((err, fieldsValue) => {
      if (err) return;
      // console.log(this.props.entranceGuard)
      // this.props.dispatch({
      //   type: 'entranceGuard/stageAreaDoorPerson',
      //   payload: {
      //     toggleTable: 'two',
      //     areaDoorData: this.props.entranceGuard.areaDoorData,
      //     beginTime: fieldsValue.time[0].format('YYYY-MM-DD HH:mm:ss'),
      //     endTime: fieldsValue.time[1].format('YYYY-MM-DD HH:mm:ss'),
      //     type: fieldsValue.type,
      //   },
      // });

      let typeModel;
      if (this.props.entranceGuard.areaOrDoor === 2) {
        typeModel = 'entranceGuard/stageDoorPerson';
      } else {
        typeModel = 'entranceGuard/stageAreaPerson';
      }

      this.props.dispatch({
        type: typeModel,
        payload: {
          toggleTable: 'two',
          areaDoorData: this.props.entranceGuard.areaDoorData,
          beginTime: fieldsValue.time[0].format('YYYY-MM-DD HH:mm:ss'),
          endTime: fieldsValue.time[1].format('YYYY-MM-DD HH:mm:ss'),
          type: fieldsValue.type,
        },
      });

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

  handleFormReset = () => {
    this.props.dispatch({
      type: 'entranceGuard/stageAreaDoorPerson',
      payload: {
        toggleTable: 'two',
        areaDoorData: this.props.entranceGuard.areaDoorData,
        type: 0,
        beginTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      },
    });
    this.props.form.setFieldsValue({
      time: [moment().startOf('day'), moment().endOf('day')],
      personType: 0,
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
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col span={8} >
            <FormItem
              label="进出类型"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              {getFieldDecorator('type', {
                initialValue: 0,
              })(
                <Select style={{ width: '100%' }}>
                  {personType.map(item => (
                    <Select.Option
                      key={item.typeId}
                      value={item.typeId}
                    >{item.type}
                    </Select.Option>
                  ))}
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
                initialValue: [moment(this.props.entranceGuard.beginTime, 'YYYY-MM-DD HH:mm:ss'), moment(this.props.entranceGuard.endTime, 'YYYY-MM-DD HH:mm:ss')],
              })(
                <DatePicker.RangePicker
                  style={{ width: '100%' }}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder={['开始日期', '结束日期']}
                  allowClear={false}
                  onCalendarChange={this.onCalendarChange}
                  disabledDate={this.disabledDate}
                  onOpenChange={this.onOpenChangeTime}
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
    const { entranceGuard } = this.props;
    let columns;
    let showText;
    switch (entranceGuard.areaOrDoor) {
      case 1:
        columns = [
          {
            title: '门禁区域',
            dataIndex: 'areaName',
            key: 'areaName',
          }, {
            title: '人员姓名',
            dataIndex: 'personName',
            key: 'personName',
          }, {
            title: '进出时间',
            dataIndex: 'occurTime',
            key: 'occurTime',
          }, {
            title: '进/出',
            dataIndex: 'type',
            key: 'type',
            render: (text) => {
              switch (text) {
                case 1:
                  return '进入';
                case 2:
                  return '出去';
                default:
                  return '未分辨';
              }
            },
          }];
        showText = '门禁区域';
        break;
      case 2:
        columns = [
          {
            title: '门禁',
            dataIndex: 'doorName',
            key: 'doorName',
          }, {
            title: '人员姓名',
            dataIndex: 'personName',
            key: 'personName',
          }, {
            title: '进出时间',
            dataIndex: 'occurTime',
            key: 'occurTime',
          }, {
            title: '进/出',
            dataIndex: 'type',
            key: 'type',
            render: (text) => {
              switch (text) {
                case 1:
                  return '进入';
                case 2:
                  return '出去';
                default:
                  return '未分辨';
              }
            },
          }];
        showText = '门禁';
        break;
      default:
        break;
    }

    return (
      <div className={styles.regionWarp}>
        <div>
          <a onClick={this.onGetArea} style={{ color: '#afe0ff', textDecoration: 'none' }}>{showText} </a>
          <i>{'>'}</i>
          <span>{entranceGuard.areaDoorData.name}</span>
        </div>
        <div className={styles.tableListForm}>
          {this.renderForm()}
        </div>
        <Table
          columns={columns}
          bordered
          dataSource={entranceGuard.list}
          scroll={{ x: 450 }}
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
