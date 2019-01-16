import React, { PureComponent } from 'react';
import { Form, TreeSelect, Row, Col, Input, message, Icon, Table, Modal, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import CommonQuery from '../../../../components/GlobalHeader/CommonQuery';

import styles from './index.less';
import { win12, win20, win10, win3 } from '../../../../utils/configIndex';

const FormItem = Form.Item;
const { TextArea, Search } = Input;
const { Option } = Select;
const TreeNode = TreeSelect.TreeNode;

let selectedData = null; // 选择事发设备的一行的值
let selectedVal = null; // 选择事件物质的一行的值
let title = null; // 标题
let searchValue = null; // 子页面的默认文本
let whether = true; // 是否运行查询
const columns = [{
  title: '用户名字',
  dataIndex: 'userName',
  width: win12,
}, {
  title: '拼音',
  dataIndex: 'queryKey',
  width: win12,
}, {
  title: '性别',
  dataIndex: 'sex',
  width: win10,
}, {
  title: '手机号码',
  dataIndex: 'mobile',
  width: win20,
}, {
  title: '短号',
  dataIndex: 'shortNumber',
  width: win12,
}, {
  title: '电话号码',
  dataIndex: 'phoneNumber',
  width: win12,
}, {
  title: '邮箱',
  dataIndex: 'eMail',
  width: win12,
}, {
  title: '办公地址',
  dataIndex: 'officeAddr',
  width: win12,
}];


@connect(({ alarmDeal, organization, emergency }) => ({
  alarmDeal,
  emergency,
  orgTree: organization.orgTree,
}))
export default class AlarmEventInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      clickWhether: null, // 点击的放大镜的id
      selectedRows: [], // 报警人选择的数据
      alarmPersonVisible: false, // 报警人弹框显示
      searchPerson: null, // 查询输入值
      personRowSelection: {
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
          this.setState({
            selectedRows,
          });
        },
      },
      rowSelection: {
        type: 'radio',
        onChange: (selectedKeys, row) => {
          if (this.state.clickWhether === 2) {
            selectedData = row[0];
          } else if (this.state.clickWhether === 3) {
            selectedVal = row[0];
          } else if (this.state.clickWhether === 1) {
            selectedVal = row[0];
          }
        },
      },
    };
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'alarmDeal/getApparatus',
    });
    this.props.dispatch({
      type: 'organization/getOrgTree',
    });
    // 每次打开清空上次选择
    selectedData = null;
  }
  // 获取子组件的props
  onRef = (child) => {
    this.child = child;
  };
  onShowModal = (value, id) => {
    const { alarmInfo } = this.props.alarmDeal;
    const { orgID } = this.props.form.getFieldsValue(['orgID']);
    const areaID = this.props.form.getFieldsValue(['alarmAreaID']).alarmAreaID || null;
    switch (id) {
      case 1:
        // if (err) return;
        const fieldsValue = this.props.form.getFieldsValue(['probeResourceID1']).probeResourceID1;
        title = '监测器具';
        whether = true;
        searchValue = fieldsValue;
        // 检测器具受事发设备影响
        let urls = '';
        const param = {};
        const { resourceID } = this.props.form.getFieldsValue(['resourceID']);
        if (resourceID) {
          urls = 'alarmDeal/getMonitorResource';
          param.resourceID = resourceID;
        } else {
          urls = 'alarmDeal/getResourceQueryPage';
          param.resourceName = fieldsValue;
          param.isQuery = true;
          param.fuzzy = true;
          param.orgID = orgID;
          param.areaID = areaID;
          param.monitor = 1;
          param.pageNum = 1;
          param.pageSize = 10;
        }
        if (alarmInfo) {
          this.props.dispatch({
            type: urls,
            payload: param,
          }).then(() => {
            this.setState({
              visible: true,
              monitor: 1,
              clickWhether: id,
            });
            this.child.setOrgID(orgID);
            this.child.setAreaID(areaID);
          });
        } else {
          this.setState({
            visible: true,
            clickWhether: id,
            monitor: 1,
          });
        }
        break;
      case 2:
        title = '事发设备';
        whether = true;
        searchValue = null;
        const params = {};
        let url = '';
        if (alarmInfo && alarmInfo.resourceId !== 0) {
          url = 'alarmDeal/getMonitorResourceObj';
          params.resourceID = alarmInfo.resourceId;
        } else {
          url = 'alarmDeal/getResourceQueryPage';
          params.pageNum = 1;
          params.pageSize = 10;
          params.isQuery = true;
          params.fuzzy = true;
          params.orgID = orgID;
          params.areaID = areaID;
          params.monitor = 0;
        }
        this.props.dispatch({
          type: url,
          payload: params,
        }).then(() => {
          this.child.setOrgID(orgID);
          this.child.setAreaID(areaID);
          this.setState({
            visible: true,
            clickWhether: id,
            monitor: 0,
          });
        });
        break;
      case 3:
        title = '事件物质';
        whether = false;
        const resourceIDs = [];
        if (alarmInfo) {
          resourceIDs.push(alarmInfo.resourceId);
        }
        if (selectedData) {
          resourceIDs.push(selectedData.resourceID);
        }
        if (resourceIDs.length > 0) {
          this.props.dispatch({
            // type: 'alarmDeal/getByResourceIDs',
            type: 'alarmDeal/getMaterialPage',
            payload: {
              // resourceIDs,
              pageNum: 1,
              pageSize: 10,
              isQuery: true,
              fuzzy: true,
            },
          }).then(() => {
            this.setState({
              visible: true,
              clickWhether: id,
            });
          });
        } else {
          this.setState({
            visible: true,
            clickWhether: id,
          });
        }
        break;
      default:
        break;
    }
  };
  // 选择查询
  onSearchUser = (value) => {
    this.props.dispatch({
      type: 'emergency/searchPersonInfo',
      payload: {
        pageNum: 1,
        pageSize: 10,
        userName: value,
        isQuery: true,
        fuzzy: true,
      },
    });
    this.setState({
      alarmPersonVisible: true,
    });
  };
  // 报警人分页
  onhandleTableChange = (pagination, filtersArg, sorter) => {
    const params = {
      pageNum: pagination.current,
      pageSize: pagination.pageSize,
      isQuery: true,
      fuzzy: true,
    };
    this.props.form.validateFields(['userName', 'queryKey'], (err, values) => {
      if (err) return;
      Object.assign(params, values);
      for (const obj in params) {
        if (params[obj] === undefined || params[obj] === '' || params[obj] === null) {
          delete params[obj];
        }
      }
      this.props.dispatch({
        type: 'emergency/searchPersonInfo',
        payload: params,
      });
    });
  };
  // 搜索人员
  onSearchPerson = () => {
    const params = {
      pageNum: 1,
      pageSize: 10,
      isQuery: true,
      fuzzy: true,
    };
    this.props.form.validateFields(['userName', 'queryKey'], (err, values) => {
      if (err) return;
      Object.assign(params, values);
      for (const obj in params) {
        if (params[obj] === undefined || params[obj] === '' || params[obj] === null) {
          delete params[obj];
        }
      }
      this.props.dispatch({
        type: 'emergency/searchPersonInfo',
        payload: params,
      });
    });
  };
  // 重置
  handleReset = () => {
    this.props.form.resetFields(['userName', 'queryKey']);
    this.props.dispatch({
      type: 'emergency/searchPersonInfo',
      payload: { pageNum: 1, pageSize: 10 },
    });
  };
  // 确认
  onPersonHandleOk = () => {
    const row = this.state.selectedRows;
    if (row.length > 0) {
      const { form } = this.props;
      form.setFieldsValue({
        alarmPerson: row[0].userName,
        telPhone: row[0].mobile,
      });
      this.setState({
        alarmPersonVisible: false,
      });
    } else {
      message.info('请选择一条数据');
    }
  };
  // 关闭
  onPersonHandleCancel = (e) => {
    this.setState({
      alarmPersonVisible: false,
    });
  };
  onHandleOk = () => {
    const { form, dispatch } = this.props;
    if (this.state.clickWhether === 2) {
      if (!selectedData) {
        return message.info('请选择一条数据');
      }
      form.setFieldsValue({
        resourceID: selectedData.resourceID,
        resourceID1: selectedData.resourceName,
        installPosition: selectedData.installPosition,
        orgID: selectedData.organization.orgID || null,
        alarmAreaID: selectedData.area.areaID || null,
      });
      if (selectedData.resourceID) {
        // 请求事发设备对应的监测器具
        this.props.dispatch({
          type: 'alarmDeal/getMonitorResource',
          payload: {
            resourceID: selectedData.resourceID,
          },
        }).then(() => {
          if (this.props.alarmDeal.searchList.length === 1) {
            // 如果只有一个检测器具则选中
            form.setFieldsValue({
              probeResourceID: this.props.alarmDeal.searchList[0].resourceID,
              probeResourceID1: this.props.alarmDeal.searchList[0].resourceName,

            });
          }
        });
      }
    } else if (this.state.clickWhether === 3) {
      if (!selectedVal) {
        return message.info('请选择一条数据');
      }
      form.setFieldsValue({
        rawMaterialIds: selectedVal.rawMaterialID,
        rawMaterialIds1: selectedVal.rawMaterialName,
      });
    } else if (this.state.clickWhether === 1) {
      if (!selectedVal) {
        return message.info('请选择一条数据');
      }
      selectedData = selectedVal;
      form.setFieldsValue({
        probeResourceID: selectedVal.resourceID,
        probeResourceID1: selectedVal.resourceName,
        orgID: selectedVal.organization.orgID || null,
        alarmAreaID: selectedVal.area.areaID || null,
      });
      // 事发设备请求的数据
      this.props.dispatch({
        type: 'alarmDeal/getMonitorResourceObj',
        payload: {
          resourceID: selectedVal.resourceID,
        },
      }).then(() => {
        if (this.props.alarmDeal.searchList.length === 1) {
          form.setFieldsValue({
            resourceID: this.props.alarmDeal.searchList[0].resourceID,
            resourceID1: this.props.alarmDeal.searchList[0].resourceName,
            installPosition: this.props.alarmDeal.searchList[0].installPosition,
          });
        }
      });
    }

    this.setState({
      visible: false,
    });
    dispatch({
      type: 'alarmDeal/resetSearchList',
    });
  }

  onHandleCancel = (e) => {
    this.setState({
      visible: false,
    });
    this.props.dispatch({
      type: 'alarmDeal/resetSearchList',
    });
  }
  // 事发部门改变触发
  onSelectTreeChange = (value) => {
    // 取出区域信息放入装置区域字段
    const arr = [
      'resourceID',
      'resourceID1',
      'alarmOrgID',
      'alarmAreaID',
      'probeResourceID',
      'probeResourceID1',
      'installPosition',
    ];
    const { areaList } = this.props.alarmDeal;
    const orgAreaList = areaList.filter(item => Object.is(item.orgID, value));
    this.props.form.resetFields(arr);
    if (orgAreaList.length > 0) {
      this.props.form.setFieldsValue({
        areaID: orgAreaList[0].areaID,
      });
    }
  };
  // 循环获取数据
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.orgnizationName} key={item.orgID} value={`${item.orgID}`} >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.orgnizationName} key={item.orgID} value={`${item.orgID}`} />;
    });
  };

  render() {
    const { form, alarmInfoConten, isEvent, emergency } = this.props;
    const { alarmInfo, apparatusList } = this.props.alarmDeal;
    form.getFieldDecorator('eventName', {
      initialValue: alarmInfo.eventName,
    });
    return (
      <div className={styles.alarmDeal}>
        <Row type="flex" >
          <Col>
            <FormItem
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 0 }}
            >
              {form.getFieldDecorator('probeResourceID', {
                initialValue: alarmInfoConten.monitorResourceInfoVO ? alarmInfoConten.monitorResourceInfoVO.resourceID : null,
              })(
                <Input placeholder="请输入监测器具" />
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 0 }}
            >
              {form.getFieldDecorator('resourceID', {
                initialValue: alarmInfoConten.resourceInfoVO ? alarmInfoConten.resourceInfoVO.resourceID : null,
              })(
                <Input placeholder="请输入事发设备" />
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 0 }}
            >
              {form.getFieldDecorator('rawMaterialIds', {
                initialValue: alarmInfoConten.rawMaterialInfoVO ? alarmInfoConten.rawMaterialInfoVO.rawMaterialID : null,
              })(
                <Input placeholder="请输入事件物质" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <Row>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="报警类型"
              >
                {form.getFieldDecorator('eventPlace', {
                  initialValue: alarmInfoConten.alarmTypeVO ? alarmInfoConten.alarmTypeVO.alarmTypeName : null,
                })(
                  <Input disabled={!isEvent} />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="事发位置"
              >
                {form.getFieldDecorator('eventPlace', {
                  initialValue: alarmInfoConten.alarmExtendAlarmInfoVO ?
                    (alarmInfoConten.alarmExtendAlarmInfoVO.place || (
                      alarmInfoConten.resourceInfoVO ? alarmInfoConten.resourceInfoVO.installPosition : null
                    )) : null,
                  rules: [
                    { required: !!isEvent, message: '事发位置必填' },
                  ],
                })(
                  <Input disabled={!isEvent} placeholder="请输入事发位置" />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="事发部门"
              >
                {form.getFieldDecorator('orgID', {
                  initialValue: alarmInfoConten.alarmExtendAlarmInfoVO ? `${alarmInfoConten.alarmExtendAlarmInfoVO.alarmOrgID || ''}` : '', // alarmInfo.orgName
                  rules: [
                    { required: isEvent, message: '事发部门不能为空' },
                  ],
                })(
                  <TreeSelect
                    disabled={!isEvent}
                    showSearch
                    style={{ width: '100%' }}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择事发部门"
                    treeNodeFilterProp="title"
                    allowClear
                    treeDefaultExpandAll
                    onChange={this.onSelectTreeChange}
                  >
                    {this.renderTreeNodes(apparatusList)}
                  </TreeSelect>
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="事发区域"
              >
                {form.getFieldDecorator('alarmAreaID', {
                  initialValue: alarmInfoConten.area ? alarmInfoConten.area.areaID : null,
                })(
                  <Select
                    placeholder="请选择事发区域"
                    // onChange={this.handleChange}
                    optionFilterProp="title"
                    showSearch
                    style={{ width: '100%' }}
                  >
                    {this.props.alarmDeal.areaList.map(item => (
                      <Option
                        key={item.areaID}
                        value={item.areaID}
                        title={item.areaName}
                      >{item.areaName}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="事发设备"
              >
                {form.getFieldDecorator('resourceID1', {
                  initialValue: alarmInfoConten.resourceInfoVO ? alarmInfoConten.resourceInfoVO.resourceName : null,
                  rules: [
                    // { required: isEvent, message: '事发设备不能为空' },
                  ],
                })(
                  <Input
                    disabled
                    addonAfter={<Icon type="search" onClick={() => this.onShowModal('', 2)} />}
                    placeholder="请输入事发设备"
                  />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="设备位置"
              >
                {form.getFieldDecorator('installPosition', {
                  initialValue: alarmInfoConten.resourceInfoVO ? alarmInfoConten.resourceInfoVO.installPosition : null,
                })(
                  <Input disabled placeholder="设备位置" />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="监测器具"
              >
                {form.getFieldDecorator('probeResourceID1', {
                  initialValue: alarmInfoConten.monitorResourceInfoVO ? alarmInfoConten.monitorResourceInfoVO.resourceName : null,
                  rules: [
                    // { required: isEvent, message: '监测器具不能为空' },
                  ],
                })(
                  <Input
                    disabled
                    addonAfter={<Icon type="search" onClick={() => this.onShowModal('', 1)} />}
                    placeholder="请输入监测器具"
                  />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="器具位置"
              >
                {form.getFieldDecorator('monitorPlace', {
                  initialValue: alarmInfoConten.monitorResourceInfoVO ? alarmInfoConten.monitorResourceInfoVO.installPosition : null,
                })(
                  <Input disabled />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="事件物质"
              >
                {form.getFieldDecorator('rawMaterialIds1', {
                  initialValue: alarmInfoConten.rawMaterialInfoVO ? alarmInfoConten.rawMaterialInfoVO.rawMaterialName : null,
                  rules: [
                  ],
                })(
                  <Input
                    disabled
                    addonAfter={<Icon type="search" onClick={() => this.onShowModal('', 3)} />}
                    placeholder="请输入事件物质"
                  />
                )}
              </FormItem>
            </Row>
            <Row />
          </Col>
          <Col md={12}>
            <Row>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="事件名称"
              >
                {form.getFieldDecorator('eventName', {
                  initialValue: ((alarmInfoConten.alarmWay === 1) ? '自动报警' : '人工报警') +
                  (alarmInfoConten.org ? `${alarmInfoConten.org.orgnizationName}` : '') +
                  moment().format('YYYY-MM-DD HH:mm'),
                  rules: [
                    { required: isEvent, message: '事件名称不能为空' },
                  ],
                })(
                  <Input disabled={!isEvent} placeholder="请输入事件名称" />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="发生时间"
              >
                {form.getFieldDecorator('startTime', {
                  initialValue: alarmInfoConten.startTime ? moment(alarmInfoConten.startTime) : moment(),
                })(
                  <DatePicker format="YYYY-MM-DD HH:mm:ss" showTime style={{ width: '100%' }} />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="报警人"
              >
                {form.getFieldDecorator('alarmPerson', {
                  initialValue: alarmInfoConten.alarmExtendAlarmInfoVO ? alarmInfoConten.alarmExtendAlarmInfoVO.alarmUserName : null,
                  rules: [
                  ],
                })(
                  <Search
                    placeholder="选择报告人"
                    onSearch={value => this.onSearchUser(value)}
                  />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="联系电话"
              >
                {form.getFieldDecorator('telPhone', {
                  initialValue: alarmInfoConten.alarmExtendAlarmInfoVO ? alarmInfoConten.alarmExtendAlarmInfoVO.alarmUserPhone : null,
                  rules: [
                    { pattern: /^[0-9]*$/, message: '只能为数字' },
                  ],
                })(
                  <Input disabled={!isEvent} placeholder="请输入联系电话" />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="报警现状"
              >
                {form.getFieldDecorator('alarmStatuInfo', {
                  initialValue: alarmInfoConten.alarmExtendAlarmInfoVO ? alarmInfoConten.alarmExtendAlarmInfoVO.alarmStatuInfo : null,
                  rules: [
                  ],
                })(
                  <Input disabled={!isEvent} placeholder="请输入报警现状" />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="警情摘要"
              >
                {form.getFieldDecorator('alarmDes', {
                  initialValue: alarmInfoConten.alarmDes,
                  rules: [
                  ],
                })(
                  <TextArea disabled={!isEvent} rows={3} placeholder="请输入警情摘要" />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="已采取措施"
              >
                {form.getFieldDecorator('adoptMeasure', {
                  initialValue: alarmInfoConten.alarmExtendAlarmInfoVO ? alarmInfoConten.alarmExtendAlarmInfoVO.adoptMeasure : null,
                  rules: [
                  ],
                })(
                  <TextArea disabled={!isEvent} rows={3} placeholder="请输入已采取措施" />
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="处警说明"
              >
                {form.getFieldDecorator('extendAlarmDes', {
                  initialValue: alarmInfoConten.alarmExtendAlarmInfoVO ? alarmInfoConten.alarmExtendAlarmInfoVO.extendAlarmDes : null,
                  rules: [
                  ],
                })(
                  <TextArea rows={3} placeholder="请输入处警说明" />
                )}
              </FormItem>
            </Row>
          </Col>
        </Row>
        <CommonQuery
          {...this.state}
          dispatch={this.props.dispatch}
          alarmDeal={this.props.alarmDeal}
          orgTree={this.props.orgTree}
          onHandleOk={this.onHandleOk}
          onHandleCancel={this.onHandleCancel}
          useChangePage={this.useChangePage}
          onRef={this.onRef}
          title={title}
          searchValue={searchValue}
          whether={whether}
        />
        <Modal
          title="选择人员"
          visible={this.state.alarmPersonVisible}
          onOk={this.onPersonHandleOk}
          onCancel={this.onPersonHandleCancel}
          width="60%"
          bodyStyle={{ maxHeight: 600, overflow: 'auto' }}
          zIndex="1003"
        >
          <Row gutter={24}>
            <Col className={styles.search}>
              <Search
                style={{ width: 350, marginBottom: 16 }}
                placeholder="请输入名字"
                enterButton="搜索"
                onSearch={this.onSearchPerson}
              />
            </Col>
          </Row>
          <Table
            pagination={emergency.personPagination}
            rowSelection={this.state.personRowSelection}
            columns={columns}
            dataSource={emergency.personList}
            onChange={this.onhandleTableChange}
            rowKey={record => record.userID}
            scroll={{ x: 1300 + win3 * columns.length, y: 260 }}
          />
        </Modal>
      </div>
    );
  }
}
