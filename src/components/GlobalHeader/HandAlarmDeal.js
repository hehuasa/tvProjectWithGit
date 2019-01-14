import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, TreeSelect, Row, Col, Input, message, Modal, Select, Icon, Table, Button } from 'antd';
import { alarmStatus } from '../../utils/utils';
import CommonQuery from './CommonQuery';
import AddTemplate from '../../routes/EmergencyCommand/AlarmDeal/AddTemplate/index';
import styles from '../../routes/EmergencyCommand/AlarmDeal/AlarmInfo/index.less';

const FormItem = Form.Item;
const { TextArea, Search } = Input;
const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;

let selectedValue = null; // 选择监测器具的一行的值
let selectedData = null; // 选择事发设备的一行的值
let selectedVal = null; // 选择事件物质的一行的值
let title = null; // 标题
let searchValue = null; // 子页面的默认文本
let whether = true; // 是否运行查询
const columns = [{
  title: '用户名字',
  dataIndex: 'userName',
  width: 200,
}, {
  title: '拼音',
  dataIndex: 'queryKey',
  width: 120,
}, {
  title: '性别',
  dataIndex: 'sex',
  width: 100,
}, {
  title: '手机号码',
  dataIndex: 'mobile',
  width: 200,
}, {
  title: '短号',
  dataIndex: 'shortNumber',
  width: 120,
}, {
  title: '电话号码',
  dataIndex: 'phoneNumber',
  width: 120,
}, {
  title: '邮箱',
  dataIndex: 'eMail',
  width: 200,
}, {
  title: '办公地址',
  dataIndex: 'officeAddr',
  width: 200,
}];

@connect(({ alarmDeal, alarm, emergency }) => ({
  alarmDeal,
  alarm,
  emergency,
}))
@Form.create()
export default class HandAlarmDeal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showAlarm: false,
      visible: false,
      clickWhether: null, // 点击的放大镜的id
      selectedRows: [], // 报警人选择的数据
      alarmPersonVisible: false, // 报警人弹框显示
      searchPerson: null, // 查询输入值
      orgID: null, // 事发部门
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
          if (this.state.clickWhether === 1) {
            selectedValue = row[0];
          } else if (this.state.clickWhether === 2) {
            selectedData = row[0];
          } else if (this.state.clickWhether === 3) {
            selectedVal = row[0];
          }
        },
      },
      isUsePage: false, // 分页是否发送请求
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'alarmDeal/getApparatus',
    });
  }

  // 获取子组件的方法
  onRef = (child) => {
    this.child = child;
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
  onSearchPerson = (e) => {
    e.preventDefault();
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
        alarmUserName: row[0].userName,
        alarmUserPhone: row[0].mobile,
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
  onShowModal = (value, id) => {
    let isUse = false;
    const orgID = this.props.form.getFieldsValue(['alarmOrgID']).alarmOrgID || null;
    const areaID = this.props.form.getFieldsValue(['alarmAreaID']).alarmAreaID || null;
    switch (id) {
      case 1:
        title = '监测器具';
        whether = true;
        searchValue = value;
        // 检测器具受事发设备影响
        let urls = '';
        const param = {};
        const { alarmResourceID } = this.props.form.getFieldsValue(['alarmResourceID']);
        if (alarmResourceID) {
          urls = 'alarmDeal/getMonitorResource';
          param.resourceID = alarmResourceID;
        } else {
          urls = 'alarmDeal/getResourceQueryPage';
          param.resourceName = value;
          param.isQuery = true;
          param.fuzzy = true;
          param.orgID = orgID;
          param.areaID = areaID;
          param.monitor = 1;
          param.pageNum = 1;
          param.pageSize = 10;
        }
        this.props.dispatch({
          type: urls,
          payload: param,
        }).then(() => {
          this.setState({
            isUsePage: isUse,
            visible: true,
            clickWhether: id,
            monitor: 1,
            orgID,
          });
          this.child.setOrgID(orgID);
          this.child.setAreaID(areaID);
        });
        break;
      case 2:
        title = '事发设备';
        whether = true;
        searchValue = null;
        isUse = true;
        const params = {};
        let url = '';
        if (selectedValue) {
          url = 'alarmDeal/getMonitorResourceObj';
          params.resourceID = selectedValue.resourceID;
        } else {
          url = 'alarmDeal/getResourceQueryPage';
          params.pageNum = 1;
          params.pageSize = 10;
          params.isQuery = true;
          params.fuzzy = true;
          params.orgID = orgID;
        }
        this.props.dispatch({
          type: url,
          payload: params,
        }).then(() => {
          this.child.setOrgID(orgID);
          this.child.setAreaID(areaID);
          this.setState({
            isUsePage: false,
            visible: true,
            clickWhether: id,
            orgID: null,
            monitor: 0,
          });
        });
        break;
      case 3:
        title = '事件物质';
        whether = false;
        isUse = true;
        const resourceIDs = [];
        if (selectedValue) {
          resourceIDs.push(selectedValue.resourceID);
        }
        if (selectedData) {
          resourceIDs.push(selectedData.resourceID);
        }
        this.props.dispatch({
          // type: 'alarmDeal/getByResourceIDs',
          type: 'alarmDeal/getMaterialPage',
          payload: {
            // resourceIDs,
            pageNum: 1,
            pageSize: 10,
            monitor: 0,
            isQuery: true,
            fuzzy: true,
          },
        }).then(() => {
          this.setState({
            isUsePage: false,
            visible: true,
            orgID: null,
            clickWhether: id,
          });
        });
        break;
      default:
        break;
    }
  }

  onHandleOk = (e) => {
    const { form, dispatch } = this.props;
    if (this.state.clickWhether === 1) {
      if (!selectedValue) {
        return message.info('请选择一条数据');
      }
      selectedData = selectedValue;
      form.setFieldsValue({
        resourceID: selectedValue.resourceID,
        resourceID1: selectedValue.resourceName,
        alarmOrgID: selectedValue.organization.orgID || null,
        alarmAreaID: selectedValue.area.areaID || null,
      });
      // 事发设备请求的数据
      this.props.dispatch({
        type: 'alarmDeal/getMonitorResourceObj',
        payload: {
          resourceID: selectedValue.resourceID,
        },
      }).then(() => {
        const resourceIDs = [];
        if (this.props.alarmDeal.searchList.length === 1) {
          form.setFieldsValue({
            alarmResourceID: this.props.alarmDeal.searchList[0].resourceID,
            alarmResourceID1: this.props.alarmDeal.searchList[0].resourceName,
            installPosition: this.props.alarmDeal.searchList[0].installPosition,
          });
          resourceIDs.push(this.props.alarmDeal.searchList[0].resourceID);
        }
        if (selectedValue) {
          resourceIDs.push(selectedValue.resourceID);
        }
        if (resourceIDs.length > 0) {
          //  事件物质请求的数据
          this.props.dispatch({
            type: 'alarmDeal/getByResourceIDs',
            payload: {
              resourceIDs,
            },
          }).then(() => {
            if (this.props.alarmDeal.searchList.length === 1) {
              form.setFieldsValue({
                rawMaterialIds: this.props.alarmDeal.searchList[0].rawMaterialID,
                rawMaterialIds1: this.props.alarmDeal.searchList[0].rawMaterialName,
              });
            }
          });
        }
      });
    } else if (this.state.clickWhether === 2) {
      if (!selectedData) {
        return message.info('请选择一条数据');
      }
      form.setFieldsValue({
        alarmResourceID: selectedData.resourceID,
        alarmResourceID1: selectedData.resourceName,
        installPosition: selectedData.installPosition,
        alarmOrgID: selectedData.organization.orgID || null,
        alarmAreaID: selectedData.area.areaID || null,
      });
      const resourceIDs = [];
      if (selectedValue) {
        resourceIDs.push(selectedValue.resourceID);
      }
      if (selectedData) {
        resourceIDs.push(selectedData.resourceID);
      }
      if (resourceIDs.length > 0) {
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
              resourceID: this.props.alarmDeal.searchList[0].resourceID,
              resourceID1: this.props.alarmDeal.searchList[0].resourceName,

            });
          }
        });
        // 请求事件物质
        this.props.dispatch({
          type: 'alarmDeal/getByResourceIDs',
          payload: {
            resourceIDs,
          },
        }).then(() => {
          if (this.props.alarmDeal.searchList.length === 1) {
            form.setFieldsValue({
              rawMaterialIds: this.props.alarmDeal.searchList[0].rawMaterialID,
              rawMaterialIds1: this.props.alarmDeal.searchList[0].rawMaterialName,
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
  // 改变是否可用分页
  useChangePage = () => {
    this.setState({
      isUsePage: false,
    });
  };

  onSelect = (value, node) => {
    // const { dataRef } = node.props;
    // 取出区域信息放入装置区域字段
    const arr = [
      'rawMaterialIds',
      'rawMaterialIds1',
      'resourceID',
      'resourceID1',
      'alarmOrgID',
      'alarmAreaID',
      'alarmResourceID',
      'alarmResourceID1',
      'installPosition',
    ];
    this.props.form.resetFields(arr);
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
          <TreeNode dataRef={item} title={item.orgnizationName} key={`${item.orgID}`} value={`${item.orgID}`}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode dataRef={item} title={item.orgnizationName} key={`${item.orgID}`} value={`${item.orgID}`} />;
    });
  }

  render() {
    const { form, emergency, alarmDeal } = this.props;
    return (
      <div className={styles.alarmReport}>
        <Row type="flex">
          <Col>
            <FormItem
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 0 }}
            >
              {form.getFieldDecorator('resourceID')( // resourceID
                <Input placeholder="请输入监测器具" />
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 0 }}
            >
              {form.getFieldDecorator('alarmResourceID')( // alarmResourceID
                <Input placeholder="请输入事发设备" />
              )}
            </FormItem>
          </Col>
          <Col>
            <FormItem
              labelCol={{ span: 0 }}
              wrapperCol={{ span: 0 }}
            >
              {form.getFieldDecorator('rawMaterialIds')(
                <Input placeholder="请输入事件物质" />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="事发位置"
            >
              {form.getFieldDecorator('place', {
                rules: [
                  { required: true, message: '事发位置必填' },
                ],
              })(
                <Input placeholder="请输入事发位置" />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="报警类型"
            >
              {form.getFieldDecorator('alarmTypeId', {
                rules: [
                  // { required: true, message: '报警类型不能为空' },
                ],
              })(
                <Select placeholder="请选择报警类型" style={{ width: '100%' }}>
                  {
                    this.props.alarm.alarmTypeList.map(item => (
                      <Option value={item.alarmTypeID} key={item.alarmTypeID}>{item.alarmTypeName}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>

          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="事发部门"
            >
              {form.getFieldDecorator('alarmOrgID', {
                rules: [
                  // { required: true, message: '事发装置不能为空' },
                ],
              })(
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择事发部门"
                  treeNodeFilterProp="title"
                  allowClear
                  treeDefaultExpandAll
                  onChange={this.onSelect}
                >
                  {this.renderTreeNodes(this.props.alarmDeal.apparatusList)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="事发区域"
            >
              {form.getFieldDecorator('alarmAreaID')(
                <Select
                  placeholder="请选择事发区域"
                  allowClear
                  optionFilterProp="title"
                  showSearch
                  style={{ width: '100%' }}
                >
                  {alarmDeal.areaList.map(item => (
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
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="监测器具"
            >
              {form.getFieldDecorator('resourceID1', {
                rules: [
                  // { required: true, message: '监测器具不能为空' },
                ],
              })(
                <Input
                  disabled
                  addonAfter={<Icon type="search" onClick={() => this.onShowModal('', 1)} />}
                  placeholder="请选择监测器具"
                />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="事发原因"
            >
              {form.getFieldDecorator('incidentReason')(
                <Input placeholder="请输入事发原因" />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="事发设备"
            >
              {form.getFieldDecorator('alarmResourceID1', {
                rules: [
                  // { required: true, message: '事发设备不能为空' },
                ],
              })(
                <Input
                  disabled
                  addonAfter={<Icon type="search" onClick={() => this.onShowModal('', 2)} />}
                  placeholder="请选择事发设备"
                />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="设备位置"
            >
              {form.getFieldDecorator('installPosition')(
                <Input placeholder="设备位置" />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="事件物质"
            >
              {form.getFieldDecorator('rawMaterialIds1')(
                <Input
                  disabled
                  addonAfter={<Icon type="search" onClick={() => this.onShowModal('', 3)} />}
                  placeholder="请选择事件物质"
                />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="报警人"
            >
              {form.getFieldDecorator('alarmUserName')(
                <Search
                  placeholder="选择报告人"
                  onSearch={value => this.onSearchUser(value)}
                />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="事发部位"
            >
              {form.getFieldDecorator('accidentPostion')(
                <Input placeholder="请输入事发部位" />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="联系电话"
            >
              {form.getFieldDecorator('alarmUserPhone', {
                rules: [
                  { pattern: /^(17[0-9]|13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/, message: '请输入正确的手机号码' },
                ],
              })(
                <Input placeholder="请输入联系电话" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="报警现状"
            >
              {form.getFieldDecorator('alarmStatuInfo')(
                <TextArea rows={3} placeholder="报警现状" />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="警情摘要"
            >
              {form.getFieldDecorator('alarmDes')(
                <TextArea rows={3} placeholder="请输入警情摘要" />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="已采取措施"
            >
              {form.getFieldDecorator('adoptMeasure')(
                <TextArea rows={3} placeholder="请输入已采取措施" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={23} offset={1}><AddTemplate form={form} /></Col>
        </Row>
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
            <Form
              className={styles.formSearch}
              onSubmit={this.onSearchPerson}
            >
              <Row gutter={24}>
                <Col span={8}>
                  <FormItem
                    label="姓名"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                  >
                    {form.getFieldDecorator('userName', {
                      rules: [],
                    })(
                      <Input placeholder="请输入姓名" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    label="拼音"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                  >
                    {form.getFieldDecorator('queryKey', {
                      rules: [],
                    })(
                      <Input placeholder="请输入拼音" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <Button type="primary" htmlType="submit">搜索</Button>
                  <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                    重置
                  </Button>
                </Col>
              </Row>
            </Form>
          </Row>
          <Table
            pagination={emergency.personPagination}
            rowSelection={this.state.personRowSelection}
            columns={columns}
            dataSource={emergency.personList}
            onChange={this.onhandleTableChange}
            rowKey={record => record.userID}
            scroll={{ x: 800, y: 600 }}
          />
        </Modal>
        <CommonQuery
          {...this.state}
          dispatch={this.props.dispatch}
          alarmDeal={this.props.alarmDeal}
          onHandleOk={this.onHandleOk}
          onHandleCancel={this.onHandleCancel}
          title={title}
          searchValue={searchValue}
          onRef={this.onRef}
          whether={whether}
          useChangePage={this.useChangePage}
        />
      </div>
    );
  }
}

