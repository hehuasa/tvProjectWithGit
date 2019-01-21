import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Icon, Button, DatePicker, TreeSelect, Modal, Upload, Divider, Popconfirm, Table } from 'antd';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import AddResourceTemplate from './AddResourceTemplate/index';
import styles from './TableList.less';
import { commonData } from '../../../mock/commonData';
import { getUUID } from '../../utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;
const { TreeNode } = TreeSelect;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
// 新增 修改页
const CreateForm = Form.create()((props) => {
  const { modalVisible, form, handleAdd, handleModalVisible, loading } = props;
  const { drill, isAdd, depList, onTimeChange, startValue, endValue } = props;
  const { drillStepAnnex, summarizeAnnex, assessmentAnnex, otherAnnex } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };
  const renderDeptTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode
            title={item.orgnizationName}
            key={item.orgID}
            value={item.orgID}
          >
            {renderDeptTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.orgnizationName} key={item.orgID} value={item.orgID} />;
    });
  };
  const onOk = (value) => {
    console.log('onOk: ', value);
  };
  const onStartChange = (value) => {
    onTimeChange('startValue', value);
  };
  const onEndChange = (value) => {
    onTimeChange('endValue', value);
  };
  const disabledStartDate = (startTime) => {
    if (!startTime || !endValue) {
      return false;
    }
    return startTime.valueOf() > endValue.valueOf();
  };

  const disabledEndDate = (endTime) => {
    if (!endTime || !startValue) {
      return false;
    }
    return endTime.valueOf() <= startValue.valueOf();
  };
  const handleChange = (file, fileList, event, uploadType, drillPlanID) => {
    if (file.file.status === 'done' || file.file.status === 'uploading') {
      let url = '';
      let params = {};
      const { dispatch } = props;
      setTimeout(() => {
        switch (uploadType) {
          case 1:
            url = isAdd ? 'drillManage/getDrillAddStepAnnex' : 'drillManage/getDrillStepAnnex';
            params = isAdd ? { uploadType } : { drillPlanID, uploadType };
            dispatch({
              type: url,
              payload: params,
            });
            break;
          case 2:
            url = isAdd ? 'drillManage/getDrillAddSummarizeAnnex' : 'drillManage/getDrillSummarizeAnnex';
            params = isAdd ? { uploadType } : { drillPlanID, uploadType };
            dispatch({
              type: url,
              payload: params,
            });
            break;
          case 3:
            url = isAdd ? 'drillManage/getDrillAddAssessmentAnnex' : 'drillManage/getDrillAssessmentAnnex';
            params = isAdd ? { uploadType } : { drillPlanID, uploadType };
            dispatch({
              type: url,
              payload: params,
            });
            break;
          case 4:
            url = isAdd ? 'drillManage/getOtherAddAnnex' : 'drillManage/getOtherAnnex';
            params = isAdd ? { uploadType } : { drillPlanID, uploadType };
            dispatch({
              type: url,
              payload: params,
            });
            break;
          default: break;
        }
      }, 1);
    }
  };
  // 删除附件
  const deleteAnnex = (record) => {
    props.dispatch({
      type: 'drillManage/deleteAnnex',
      payload: { id: record.emgcDrillArichveID },
    }).then(() => {
      //   获取演练步骤附件列表
      const { dispatch } = props;
      dispatch({
        type: isAdd ? 'drillManage/getDrillAddStepAnnex' : 'drillManage/getDrillStepAnnex',
        payload: { drillPlanID: isAdd ? null : record.drillPlanID, uploadType: 1 },
      });
      //   获取演练总结附件列表
      dispatch({
        type: isAdd ? 'drillManage/getDrillAddSummarizeAnnex' : 'drillManage/getDrillSummarizeAnnex',
        payload: { drillPlanID: isAdd ? null : record.drillPlanID, uploadType: 2 },
      });
      //   获取演练步骤附件列表
      dispatch({
        type: isAdd ? 'drillManage/getDrillAddAssessmentAnnex' : 'drillManage/getDrillAssessmentAnnex',
        payload: { drillPlanID: isAdd ? null : record.drillPlanID, uploadType: 3 },
      });
      //   获取演练步骤附件列表
      dispatch({
        type: isAdd ? 'drillManage/getOtherAddAnnex' : 'drillManage/getOtherAnnex',
        payload: { drillPlanID: isAdd ? null : record.drillPlanID, uploadType: 4 },
      });
    });
  };
  // 附件表头信息
  const columns = [{
    title: '文件名',
    dataIndex: 'fileName',
    width: '60%',
    key: 'fileName',
    render: (text, record) => {
      return record.resArchiveInfo.fileName;
    },
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a href={`upload/${record.resArchiveInfo.savePath}`} download={record.resArchiveInfo.fileName}>下载</a>
        <Divider type="vertical" />
        <Popconfirm title="确定删除？" onConfirm={() => deleteAnnex(record)}>
          <a href="#">删除</a>
        </Popconfirm>
      </span>
    ),
  }];
  return (
    <Modal
      destroyOnClose
      title={isAdd ? '新增演练方案' : '修改演练方案'}
      visible={modalVisible}
      onOk={okHandle}
      confirmLoading={loading.global}
      width="80%"
      onCancel={() => handleModalVisible()}
    >
      <Scrollbars
        className={styles.scrollbarsStyle}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        autoHeight
        autoHeightMin={400}
        autoHeightMax={600}
      >
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <FormItem>
            {form.getFieldDecorator('drillPlanID', {
            initialValue: isAdd ? '' : drill.drillPlanID,
            rules: [],
          })(
            <Input type="hidden" />
          )}
          </FormItem>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="计划名称"
            >
              {form.getFieldDecorator('drillPlanName', {
                initialValue: isAdd ? '' : drill.drillPlanName,
              rules: [
                { required: true, message: '计划名称不能为空' },
                { max: 50, message: '最大长度不大于50字符' },
                ],
            })(
              <Input placeholder="请输入计划名称" />
            )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="演习地点"
            >
              {form.getFieldDecorator('address', {
              initialValue: isAdd ? '' : drill.address,
              rules: [
                { max: 100, message: '最大长度不大于100字符' },
                ],
            })(
              <Input placeholder="请输入演习地点" />
            )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="编制依据"
            >
              {form.getFieldDecorator('basis', {
              initialValue: isAdd ? '' : drill.basis,
              rules: [
                { max: 200, message: '最大长度不大于200字符' },
                ],
            })(
              <Input placeholder="请输入编制依据" />
            )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="事故假设"
            >
              {form.getFieldDecorator('accident', {
              initialValue: isAdd ? '' : drill.accident,
              rules: [
                { max: 200, message: '最大长度不大于200字符' },
              ],
            })(
              <Input placeholder="请输入事故假设" />
            )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="开始时间"
            >
              {form.getFieldDecorator('startTime', {
              initialValue: isAdd ? '' : (drill.startTime ? moment(drill.startTime) : ''),
            })(
              <DatePicker
                style={{ width: '100%' }}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择演练开始时间"
                onChange={onStartChange}
                disabledDate={disabledStartDate}
                onOk={onOk}
              />
            )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="结束时间"
            >
              {form.getFieldDecorator('endTime', {
              initialValue: isAdd ? '' : (drill.endTime ? moment(drill.endTime) : ''),
            })(
              <DatePicker
                showTime
                style={{ width: '100%' }}
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择演练结束时间"
                onChange={onEndChange}
                disabledDate={disabledEndDate}
                onOk={onOk}
              />
            )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="演练方式"
            >
              {form.getFieldDecorator('drillMode', {
              initialValue: isAdd ? '' : drill.drillMode,
              rules: [
                { max: 200, message: '最大长度不大于200字符' },
              ],
            })(
              <Input placeholder="请输入演练方式" />
            )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="所属部门"
            >
              {form.getFieldDecorator('createOrg', {
              initialValue: isAdd ? '' : drill.createOrg,
              rules: [],
            })(
              <TreeSelect
                showSearch
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择所属部门"
                allowClear
                treeNodeFilterProp="title"
                onChange={this.onChange}
              >
                {renderDeptTreeNodes(depList)}
              </TreeSelect>
            )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="演习目的"
            >
              {form.getFieldDecorator('target', {
                initialValue: isAdd ? '' : drill.target,
              rules: [
                { max: 1000, message: '最大长度不大于1000字符' },
              ],
            })(
              <TextArea placeholder="请输入演习目的" />
            )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="演练准备"
            >
              {form.getFieldDecorator('drillPrepare', {
                initialValue: isAdd ? '' : drill.drillPrepare,
              rules: [
                { max: 1000, message: '最大长度不大于1000字符' },
              ],
            })(
              <TextArea placeholder="请输入演练准备" />
            )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="注意事项"
            >
              {form.getFieldDecorator('attemption', {
                initialValue: isAdd ? '' : drill.attemption,
              rules: [
                { max: 1000, message: '最大长度不大于1000字符' },
              ],
            })(
              <TextArea placeholder="请输入注意事项" />
            )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="演练步骤"
            >
              {form.getFieldDecorator('drillStep', {
                initialValue: isAdd ? '' : drill.drillStep,
                rules: [
                  { max: 1000, message: '最大长度不大于1000字符' },
                ],
              })(
                <TextArea placeholder="请输入演练步骤" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="演练总结"
            >
              {form.getFieldDecorator('summarize', {
                initialValue: isAdd ? '' : drill.summarize,
                rules: [
                  { max: 1000, message: '最大长度不大于1000字符' },
                ],
              })(
                <TextArea placeholder="请输入演练总结" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="演练考核"
            >
              {form.getFieldDecorator('assessment', {
                initialValue: isAdd ? '' : drill.assessment,
                rules: [
                  { max: 2000, message: '最大长度不大于2000字符' },
                ],
              })(
                <TextArea placeholder="请输入演练考核" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24 }} type="flex">
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
              label="演练步骤"
            >
              <Upload
                action={isAdd ? '/emgc/emgc/emgcEmgcDrillPlan/uploadsFiles?uploadType=1' :
                  `/emgc/emgc/emgcEmgcDrillPlan/uploadsFiles?uploadType=1&drillPlanID=${drill.drillPlanID}`}
                onChange={(file, fileList, event) => handleChange(file, fileList, event, 1, drill.drillPlanID)}
                multiple
                fileList={[]}
              >
                <Button>
                  <Icon type="upload" /> 上传附件
                </Button>
              </Upload>
              <Table columns={columns} pagination={{ pageSize: 5 }} size="small" dataSource={drillStepAnnex} />
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
              label="演练总结"
            >
              <Upload
                action={isAdd ? '/emgc/emgc/emgcEmgcDrillPlan/uploadsFiles?uploadType=2' :
                  `/emgc/emgc/emgcEmgcDrillPlan/uploadsFiles?uploadType=2&drillPlanID=${drill.drillPlanID}`}
                onChange={(file, fileList, event) => handleChange(file, fileList, event, 2, drill.drillPlanID)}
                multiple
                fileList={[]}
              >
                <Button>
                  <Icon type="upload" /> 上传附件
                </Button>
              </Upload>
              <Table columns={columns} pagination={{ pageSize: 5 }} size="small" dataSource={summarizeAnnex} />
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
              label="演练评审表"
            >
              <Upload
                action={isAdd ? '/emgc/emgc/emgcEmgcDrillPlan/uploadsFiles?uploadType=3' :
                  `/emgc/emgc/emgcEmgcDrillPlan/uploadsFiles?uploadType=3&drillPlanID=${drill.drillPlanID}`}
                onChange={(file, fileList, event) => handleChange(file, fileList, event, 3, drill.drillPlanID)}
                multiple
                fileList={[]}
              >
                <Button>
                  <Icon type="upload" /> 上传附件
                </Button>
              </Upload>
              <Table columns={columns} pagination={{ pageSize: 5 }} size="small" dataSource={assessmentAnnex} />
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 18 }}
              label="其他附件"
            >
              <Upload
                action={isAdd ? '/emgc/emgc/emgcEmgcDrillPlan/uploadsFiles?uploadType=4' :
                  `/emgc/emgc/emgcEmgcDrillPlan/uploadsFiles?uploadType=4&drillPlanID=${drill.drillPlanID}`}
                onChange={(file, fileList, event) => handleChange(file, fileList, event, 4, drill.drillPlanID)}
                multiple
                fileList={[]}
              >
                <Button>
                  <Icon type="upload" /> 上传附件
                </Button>
              </Upload>
              <Table columns={columns} pagination={{ pageSize: 5 }} size="small" dataSource={otherAnnex} />
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col span={22} offset={1}>
            <AddResourceTemplate depList={depList} />
          </Col>
        </Row>
      </Scrollbars>

    </Modal>
  );
});

@connect(({ drillManage, typeCode, organization, loading }) => ({
  drillPage: drillManage.drillPage,
  orgList: drillManage.orgList,
  drillInfo: drillManage.drillInfo,
  drillStepAnnex: drillManage.drillStepAnnex,
  summarizeAnnex: drillManage.summarizeAnnex,
  assessmentAnnex: drillManage.assessmentAnnex,
  otherAnnex: drillManage.otherAnnex,
  planPage: drillManage.planPage,
  functionMenus: drillManage.functionMenus,
  typeCode,
  orgTree: organization.orgTree,
  loading,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    // 弹框的显示控制
    modalVisible: false,
    // 关联预案的弹窗
    planModalVisible: false,
    // 搜索栏是否展开
    expandForm: false,
    selectedRows: [],
    formValues: {},
    //  修改还是新增
    isAdd: true,
    // 需要关联的演练方案ID
    drillPlanID: null,
    // 选择的预案ID
    planInfoID: null,
    // 关联的预案
    usePlanID: null,
    startValue: null,
    endValue: null,
  };
  componentDidMount() {
    const { dispatch } = this.props;
    this.getFunctionMenus();
    // 请求部门数据
    dispatch({
      type: 'organization/getOrgTree',
    });
    // 请求演练方案列表
    this.page(commonData.pageInitial);
  }
  // 获取分页数据
  page = (page) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'drillManage/drillPage',
      payload: page,
    });
  };
  // 初始化表格数据
  initData = () => {
    const tableTitles = [];
    commonData.columns.emergencyDrill.attributes.forEach((item) => {
      if (item.isTableItem) {
        tableTitles.push(item);
      }
    });
    // 操作列
    tableTitles.push({
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (text, record) => {
        // 获取该行的id，可以获取的到，传到函数里的时候打印直接把整个表格所有行id全部打印了
        return (
          <Fragment>
            {this.judgeFunction('删除权限') ? (
              <Popconfirm title="确定删除？" onConfirm={() => this.delete(record)}>
                <a href="#">删除</a>
              </Popconfirm>
            ) : null}
            {this.judgeFunction('修改权限') ? (
              <Divider type="vertical" />
            ) : null}
            {this.judgeFunction('修改权限') ? (
              <a href="javascript: void(0)" onClick={() => this.update(record)}>修改</a>
            ) : null}
            {this.judgeFunction('关联预案权限') ? (
              <Divider type="vertical" />
            ) : null}
            {this.judgeFunction('关联预案权限') ? (
              <a href="javascript: void(0)" onClick={() => this.linkPlan(record)}>关联</a>
            ) : null}
          </Fragment>
        );
      },
    });
    return tableTitles;
  };
  onTimeChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  };
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      const filters = Object.keys(filtersArg).reduce((obj, key) => {
        const newObj = { ...obj };
        newObj[key] = getValue(filtersArg[key]);
        return newObj;
      }, {});
      const params = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...formValues,
        ...filters,
        ...fieldsValue,
      };
      if (sorter.field) {
        // params.sorter = `${sorter.field}_${sorter.order}`;
        const { field, order } = sorter;
        params.sorter = { field, order };
      }
      dispatch({
        type: 'drillManage/drillPage',
        payload: params,
      });
    });
  };
  // 重置搜索条件
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.page(commonData.pageInitial);
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  };
  // 搜索函数
  handleSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        startTimes: fieldsValue.startTime ? fieldsValue.startTime.valueOf() : undefined,
        endTimes: fieldsValue.endTime ? fieldsValue.endTime.valueOf() : undefined,
      };
      if (values.startTime) { delete values.startTime; }
      if (values.endTime) { delete values.endTime; }
      // 防止将空作为查询条件
      for (const obj in values) {
        if (values[obj] === '' || values[obj] === undefined) {
          delete values[obj];
        }
      }
      const search = { isQuery: true, fuzzy: true };
      Object.assign(search, commonData.pageInitial, values);
      this.page(search);
    });
  };
  // 打开关闭弹窗
  handleModalVisible = (flag) => {
    // 新增先删除上次新增未清除的附件
    this.props.dispatch({
      type: 'drillManage/deleteDrillAnnex',
    }).then(() => {
      // 还原参演部门
      this.props.dispatch({
        type: 'drillManage/saveOrgList',
        payload: [ // 应急演练参演部门
          {
            id: getUUID(),
            orgID: null,
            userCount: 0,
            resource: [
              // { id: getUUID(), resourceID: null, useCount: 0 },
            ],
            rawMaterial: [
              // { id: getUUID(), toolMaterialInfoID: null, useCount: 0 },
            ],
          },
        ],
      });
      // 还原附件信息
      this.props.dispatch({
        type: 'drillManage/saveDrillStepAnnex',
        payload: [],
      });
      this.props.dispatch({
        type: 'drillManage/saveDrillSummarizeAnnex',
        payload: [],
      });
      this.props.dispatch({
        type: 'drillManage/saveDrillAssessmentAnnex',
        payload: [],
      });
      this.props.dispatch({
        type: 'drillManage/saveOtherAnnex',
        payload: [],
      });
      this.setState({
        modalVisible: !!flag,
        isAdd: true,
      });
    });
  };
  // 确定新增还是修改
  handleAdd = (fields) => {
    if (this.state.isAdd) {
      this.doAdd(fields);
    } else {
      this.doUpdate(fields);
    }
  };
  // 新增
  doAdd = (fields) => {
    const data = {
      ...fields,
      startTimes: fields.startTime.valueOf(),
      endTimes: fields.endTime.valueOf(),
      orgList: JSON.stringify(this.props.orgList),
    };
    delete data.startTime;
    delete data.endTime;
    this.props.dispatch({
      type: 'drillManage/addDrill',
      payload: data,
    }).then(() => {
      this.page(commonData.pageInitial);
      this.setState({
        modalVisible: false,
      });
    });
  };
  // 修改函数
  doUpdate = (fields) => {
    const data = {
      ...fields,
      startTimes: fields.startTime.valueOf(),
      endTimes: fields.endTime.valueOf(),
      orgList: JSON.stringify(this.props.orgList),
    };
    delete data.startTime;
    delete data.endTime;
    this.props.dispatch({
      type: 'drillManage/updateDrill',
      payload: data,
    }).then(() => {
      this.page(commonData.pageInitial);
      this.setState({
        modalVisible: false,
      });
    });
  };
  // 执行删除函数
  delete = (record) => {
    this.props.dispatch({
      type: 'drillManage/deleteDrill',
      payload: { id: [record.drillPlanID] },
    }).then(() => {
      this.page(commonData.pageInitial);
    });
  };
  // 导出函数
  export = () => {
    const para = commonData.pageInitial;
    delete para.pageNum;
    delete para.pageSize;
    para.showJson = [];
    commonData.columns.emergencyDrill.attributes.forEach((item) => {
      if (item.isExport) {
        para.showJson.push({ en: item.dataIndex, cn: item.title });
      }
    }
    );
    para.showJson = JSON.stringify(para.showJson);
    this.props.dispatch({
      type: 'userList/export',
      payload: para,
    });
  };
  // 批量删除
  deleteAll = () => {
    const userIds = [];
    this.state.selectedRows.forEach((user) => {
      userIds.push(user.drillPlanID);
    });
    this.props.dispatch({
      type: 'drillManage/deleteDrill',
      payload: { id: userIds },
    });
  };
  // 获取单个信息
  update = (record) => {
    const { dispatch } = this.props;
    this.setState({
      modalVisible: !this.state.modalVisible,
      isAdd: false,
    });
    // 获取基本信息
    dispatch({
      type: 'drillManage/getDrill',
      payload: { id: record.drillPlanID },
    }).then(() => {
      const { emgcEmgcDrillOrgVOS } = this.props.drillInfo;
      const drill = emgcEmgcDrillOrgVOS.map((obj) => {
        obj.id = getUUID();
        obj.rawMaterial.map((raw) => {
          raw.id = getUUID();
          return raw;
        });
        obj.resource.map((res) => {
          res.id = getUUID();
          return res;
        });
        return obj;
      });
      dispatch({
        type: 'drillManage/saveOrgList',
        payload: drill,
      });
    });
    //   获取演练步骤附件列表
    dispatch({
      type: 'drillManage/getDrillStepAnnex',
      payload: { drillPlanID: record.drillPlanID, uploadType: 1 },
    });
    //   获取演练总结附件列表
    dispatch({
      type: 'drillManage/getDrillSummarizeAnnex',
      payload: { drillPlanID: record.drillPlanID, uploadType: 2 },
    });
    //   获取演练步骤附件列表
    dispatch({
      type: 'drillManage/getDrillAssessmentAnnex',
      payload: { drillPlanID: record.drillPlanID, uploadType: 3 },
    });
    //   获取演练步骤附件列表
    dispatch({
      type: 'drillManage/getOtherAnnex',
      payload: { drillPlanID: record.drillPlanID, uploadType: 4 },
    });
  };
  // 打开关联预案弹窗
  linkPlan = (record) => {
    // 请求预案列表
    this.planPage(1, 5);
    this.props.dispatch({
      type: 'drillManage/getDrill',
      payload: { id: record.drillPlanID },
    }).then(() => {
      this.setState({
        drillPlanID: record.drillPlanID,
        usePlanID: this.props.drillInfo.usePlanID,
      });
      this.handlePlanModalVisible(true);
    });
  };
   // 时间改变
   onChange = (value, dateString) => {
     console.log('Selected Time: ', value);
     console.log('Formatted Selected Time: ', dateString);
   };
   // 确定时间
   onOk = (value) => {
     console.log('onOk: ', value);
   };
   // 打开 关闭 关联预案弹窗
   handlePlanModalVisible = (tag) => {
     this.setState({
       planModalVisible: !!tag,
     });
   };
   // 演练方案关联预案
  updateSelectedPlan = () => {
    const { usePlanID, drillPlanID } = this.state;
    this.props.dispatch({
      type: 'drillManage/linkPlan',
      payload: { usePlanID, drillPlanID },
    }).then(() => {
      this.handlePlanModalVisible(false);
    });
  };
  // 预案列表选中的行
  selectedPlan = (selectedRowKeys, selectedRows) => {
    this.setState({
      usePlanID: selectedRows[0].planInfoID,
    });
  };
  // 预案分页
  planPage = (pageNum, pageSize) => {
    this.props.dispatch({
      type: 'drillManage/getPlanPage',
      payload: { pageNum, pageSize, isQuery: true, fuzzy: true, statu: 0 },
    });
  };
  // 获取页面功能权限
  getFunctionMenus = () => {
    const { dispatch, functionInfo } = this.props;
    dispatch({
      type: 'drillManage/getFunctionMenus',
      payload: { parentCode: functionInfo.functionCode },
    });
  };
  // 判断是否有该功能权限
  judgeFunction = (functionName) => {
    const { functionMenus } = this.props;
    const arr = functionMenus.filter(item => item.functionName === functionName);
    return arr.length > 0;
  };
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const { orgTree } = this.props;
    const renderDeptTreeNodes = (data) => {
      return data.map((item) => {
        if (item.children) {
          return (
            <TreeNode
              title={item.orgnizationName}
              key={item.orgID}
              value={item.orgID}
            >
              {renderDeptTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode title={item.orgnizationName} key={item.orgID} value={item.orgID} />;
      });
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="计划名称">
              {getFieldDecorator('drillPlanName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="创建部门">
              {getFieldDecorator('createOrg')(
                <TreeSelect
                  showSearch
                  treeNodeFilterProp="title"
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择创建部门"
                  allowClear
                  onChange={this.onChange}
                >
                  {renderDeptTreeNodes(orgTree)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              {this.judgeFunction('新增权限') ? (
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新增
                </Button>
              ) : null}
              <Button type="primary" style={{ marginLeft: 8 }} htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    const { orgTree } = this.props;
    const renderDeptTreeNodes = (data) => {
      return data.map((item) => {
        if (item.children) {
          return (
            <TreeNode
              title={item.orgnizationName}
              key={item.orgID}
              value={item.orgID}
            >
              {renderDeptTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode title={item.orgnizationName} key={item.orgID} value={item.orgID} />;
      });
    };
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="计划名称">
              {getFieldDecorator('drillPlanName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="创建部门">
              {getFieldDecorator('createOrg')(
                <TreeSelect
                  showSearch
                  treeNodeFilterProp="title"
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择所属部门"
                  allowClear
                  onChange={this.onChange}
                >
                  {renderDeptTreeNodes(orgTree)}
                </TreeSelect>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="开始时间">
              {getFieldDecorator('startTime')(
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择演练开始时间"
                />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="结束时间">
              {getFieldDecorator('endTime')(
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择演练结束时间"
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新增
            </Button>
            <Button type="primary" style={{ marginLeft: 8 }} htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }
  render() {
    const { loading, drillPage } = this.props;
    const { selectedRows, modalVisible } = this.state;
    const columns = this.initData();
    const planCols = [
      {
        title: '预案名称',
        dataIndex: 'planName',
        width: '19%',
      },
      {
        title: '预案编号',
        dataIndex: 'userPlanCode',
        width: '15%',
      },
      {
        title: '预案分类',
        dataIndex: 'planTypeName',
        width: '10%',
      },
      {
        title: '所属部门',
        dataIndex: 'content',
        width: '15%',
      },
      {
        title: '版本',
        dataIndex: 'version',
        width: '8%',
      },
      {
        title: '状态',
        dataIndex: 'statu',
        width: '8%',
        render: (text) => {
          switch (text) {
            case 0: return '启用';
            case 1: return '停用';
            case 2: return '发布';
            case 3: return '草稿';
            default: return '未知';
          }
        },
      },
      {
        title: '发布时间',
        dataIndex: 'releaseTime',
        sorter: true,
        width: '20%',
        render: (val) => {
          if (!val) {
            return '';
          }
          return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
    ];
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <PageHeaderLayout title="应急演练计划列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading.effects['emgc/emgcEmgcDrillPlan/selectPage']}
              data={drillPage}
              scroll={{ x: 2580 }}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              rowKey="drillPlanID"
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          drill={this.props.drillInfo}
          loading={this.props.loading.global}
          drillStepAnnex={this.props.drillStepAnnex}
          summarizeAnnex={this.props.summarizeAnnex}
          assessmentAnnex={this.props.assessmentAnnex}
          otherAnnex={this.props.otherAnnex}
          isAdd={this.state.isAdd}
          dispatch={this.props.dispatch}
          depList={this.props.orgTree}
          onTimeChange={this.onTimeChange}
          startValue={this.state.startValue}
          endValue={this.state.endValue}
        />
        <Modal
          destroyOnClose
          title="预案列表"
          visible={this.state.planModalVisible}
          onOk={this.updateSelectedPlan}
          width="80%"
          onCancel={() => this.handlePlanModalVisible(false)}
        >
          <Table
            dataSource={this.props.planPage.data}
            columns={planCols}
            rowKey={(record) => {
              return record.planInfoID;
            }}
            pagination={{
              ...this.props.planPage.pagination,
              onChange: this.planPage,
            }}
            rowSelection={{
              type: 'radio',
              onChange: this.selectedPlan,
              selectedRowKeys: [this.state.usePlanID],
            }}
          />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
