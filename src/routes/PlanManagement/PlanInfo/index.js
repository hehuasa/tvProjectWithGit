import React, { PureComponent } from 'react';
import { Select, Table, Tabs, Card, Divider, Button, Row, Col, Popconfirm, Checkbox, Icon, Form, Input } from 'antd';
import { connect } from 'dva';
import Zmage from 'react-zmage';
import moment from 'moment';

import styles from './index.less';
import { commandType } from '../../../utils/utils';

const Option = Select.Option;
const FormItem = Form.Item;
const { Meta } = Card;
const { TabPane } = Tabs;
const FeatureTitle = ({ onCheckboxFeature }) => {
  return (
    <div>
      <div>确定要删除？</div>
      <Checkbox onChange={onCheckboxFeature}>是否删除特征？</Checkbox>
    </div>
  );
};

@Form.create()
@connect(({ planManagement, user }) => ({
  planManagement,
  planCommand: planManagement.planCommand,
  planBasicInfo: planManagement.planBasicInfo,
  planCommandInfo: planManagement.planCommandInfo,
  planResource: planManagement.planResource,
  resourceInfo: planManagement.resourceInfo,
  annexPage: planManagement.annexPage,
  dealCardList: planManagement.dealCardList,
  orgAnnexList: planManagement.orgAnnexList,
  emgcAnnex: planManagement.emgcAnnex,
  eventType: planManagement.eventType,
  currentUser: user.currentUser,
}))
export default class PlanInfo extends PureComponent {
  state = {
    planVisible: false, // 新增预案的弹窗是否打开
    featureVisible: false, // 事件特征的弹窗是否打开
    commandVisible: false, // 应急指令弹窗是否打开
    resourceVisible: false, // 应急资源弹窗是否打开
    annexVisible: false, // 预案附件弹窗是否打开
    isAdd: true, // 弹窗是否新增 false为修改状态
    isDelete: false, // 是否删除事件特征里的特征
    panRedirectFeatureID: null, // 主键id
    featureID: null, //  编辑第一次时候，特征id
    codeToggle: true, // 判断字段是否可用，是否可以提交
    uploadType: 1, // uploadType:1 为组织、2为附件、3为处置卡
  };
  componentDidMount() {
    const { eventID } = this.props;
    this.props.dispatch({
      type: 'user/currentUser',
    });
    this.props.dispatch({
      type: 'planManagement/savePlanResource',
      payload: { pageNum: 1, pageSize: 10, data: [] },
    });
  }
  // tab切换
  tabChange = (value) => {
    const { planInfoID } = this.props.planBasicInfo;
    const { pageNum, pageSize } = this.props.annexPage;
    const { planResource } = this.props;
    if (planInfoID) {
      switch (value) {
        case '2':
          // 获取组织结构
          this.props.dispatch({
            type: 'planManagement/getOrgAnnex',
            payload: { planInfoID, uploadType: 1 },
          });
          break;
        case '3':
          // 请求事件特征
          this.props.dispatch({
            type: 'planManagement/getEventFeatures',
            payload: {
              planInfoID,
            },
          });
          break;
        case '4':
          // 获取应急流程
          this.props.dispatch({
            type: 'planManagement/getEmgcProcess',
            payload: { planInfoID, uploadType: 4 },
          });
          break;
        case '5':
          // 预案指令
          this.props.dispatch({
            type: 'planManagement/getPlanCommand',
            payload: {
              planInfoID,
            },
          });
          break;
        case '6':
          // 应急资源
          this.searchResource(planResource.pageNum, planResource.pageSize);
          break;
        case '7':
          // 通过预案ID 获取附件列表
          this.props.dispatch({
            type: 'planManagement/getAnnexPage',
            payload: { planInfoID, uploadType: 2, pageNum, pageSize, isQuery: true, fuzzy: false },
          });
          break;
        case '8':
          // 通过预案ID 获取处置卡列表 uploadType:1 为组织、2为附件、3为处置卡 4.应急流程
          this.props.dispatch({
            type: 'planManagement/getDealCard',
            payload: { planInfoID, uploadType: 3 },
          });
          break;
        default: break;
      }
    }
  }
  // 查询应急资源
  searchResource = (pageNum, pageSize) => {
    const { form, dispatch, planBasicInfo } = this.props;
    const { planInfoID } = planBasicInfo;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'planManagement/getPlanResource',
        payload: {
          planInfoID,
          pageSize,
          pageNum,
          ...fieldsValue,
        },
      });
    });
  };
  resetResource = () => {
    const { form } = this.props;
    form.resetFields();
    this.searchResource(1, 10);
  }
  render() {
    const { isEdit, planResource, planCommand,
      eventFeature, planCommandInfo, resourceInfo, hideFooter, form,
    } = this.props;
    // 新加参数
    const { planBasicInfo, eventFeatures } = this.props.planManagement;
    const { isAdd } = this.state;
    // 实施方案 基本信息表头
    const columns = [
      {
        title: '预案名称',
        dataIndex: 'planName',
        width: '15%',
      },
      {
        title: '预案编号',
        dataIndex: 'userPlanCode',
        width: '10%',
      },
      {
        title: '预案分类',
        dataIndex: 'planTypeName',
        width: '20%',
      }, {
        title: '预案等级',
        dataIndex: 'levelName',
        width: '10%',
        key: 'levelName',
        render: (text, record) => {
          return record.planPlanLevel ? record.planPlanLevel.levelName : '';
        },
      },
      {
        title: '编制部门',
        dataIndex: 'organizationName',
        width: '15%',
      },
      {
        title: '应急组织',
        dataIndex: 'emgOrganization',
        width: '20%',
        render: (text) => {
          return text ? text.orgnizationName : '';
        },
      },
      {
        title: isEdit ? '操作' : '',
        width: '10%',
        key: 'action',
        render: (text, record) => (
          isEdit ? (
            <span>
              <a href="javascript:;" onClick={() => { this.updatePlanInfo(record); }}>修改</a>
            </span >
          ) : null
        ),
      },
    ];
    // 实施方案 事件特征表头
    const featureCols = [
      {
        title: '特征类型',
        dataIndex: 'featureTypeName',
        width: 100,
        key: 'featureTypeName',
      }, {
        title: '特征名称',
        dataIndex: 'featureName',
        width: 120,
        key: 'featureName',
      }, {
        title: '规则',
        dataIndex: 'featureExpresstion',
        width: 80,
        key: 'featureExpresstion',
      }, {
        title: '是否直接特征',
        dataIndex: 'drectFeature',
        width: 80,
        key: 'drectFeature',
        render: (text) => {
          switch (text) {
            case 0: return '否';
            case 1: return '是';
            default: return '';
          }
        },
      }, {
        title: '特征值',
        dataIndex: 'featureValue',
        width: 80,
        key: 'featureValue',
      }, {
        title: '单位',
        dataIndex: 'featureUnit',
        width: 80,
        key: 'featureUnit',
        render: (text, record) => {
          if (!record.planFeatureInfo) {
            return '';
          }
          return record.planFeatureInfo.featureUnit;
        },
      }, {
        title: '权重',
        dataIndex: 'weight',
        width: 80,
        key: 'weight',
      }, {
        title: '特征描述',
        dataIndex: 'featureDes',
        width: 200,
        key: 'featureDes',
        render: (text, record) => {
          if (!record.planFeatureInfo) {
            return '';
          }
          return record.planFeatureInfo.featureDes;
        },
      },
      {
        title: isEdit ? '操作' : '',
        width: 200,
        key: 'action',
        render: (text, record) => (
          isEdit ? (
            <span>
              <a href="javascript:;" onClick={() => this.getFeature(record)}>修改</a>
              <Divider type="vertical" />
              <Popconfirm title={<FeatureTitle onCheckboxFeature={this.onCheckboxFeature} />} onConfirm={() => this.deleteFeature(record.panRedirectFeatureID)} okText="确定" cancelText="取消">
                <a href="javascript:;">删除</a>
              </Popconfirm>
            </span >
          ) : null
        ),
      },
    ];
    // 实施方案 预案指令表头
    const commandCols = [
      {
        title: '流程节点',
        dataIndex: 'planFlowNode',
        width: 100,
        key: 'planFlowNode',
        render: (text, record) => {
          return record.planFlowNode.nodeName;
        },
      }, {
        title: '指令类型',
        dataIndex: 'commandType',
        width: 100,
        key: 'commandType',
        render: (text) => {
          return commandType(text);
        },
      }, {
        title: '指令内容',
        dataIndex: 'commandContent',
        width: 200,
        key: 'commandContent',
      }, {
        title: '执行岗位',
        dataIndex: 'excutePostionList',
        width: 120,
        key: 'excutePostionList',
        render: (text) => {
          let str = '';
          if (text) {
            text.forEach((item) => {
              str = item ? `${str}${item.postionName}, ` : `${str}`;
            });
          }
          return str;
        },
      }, {
        title: '执行时长',
        dataIndex: 'executeTime',
        width: 100,
        key: 'executeTime',
      }, {
        title: '注意事项',
        dataIndex: 'attention',
        width: 200,
        key: 'attention',
      }, {
        title: isEdit ? '操作' : '',
        width: 200,
        key: 'action',
        render: (text, record) => (
          isEdit ? (
            <span>
              <a href="javascript:;" onClick={() => this.getCommand(record.commandID)}>修改</a>
              <Divider type="vertical" />
              <Popconfirm title="确定要删除 ?" onConfirm={() => this.deleteCommand(record.commandID)} okText="确定" cancelText="取消">
                <a href="javascript:;">删除</a>
              </Popconfirm>
            </span>
          ) : null
        ),
      }];
    // 实施方案 应急资源表头
    const resourceCols = [
      {
        title: '资源编号',
        dataIndex: 'resourceCode',
        width: 100,
        key: 'resourceCode',
        render: (text, record) => {
          return record.resResourceInfo ? record.resResourceInfo.resourceCode :
            (record.resToolMaterialInfo ? record.resToolMaterialInfo.materialCode : '');
        },
      }, {
        title: '资源名称',
        dataIndex: 'resourceName',
        width: 100,
        key: 'resourceName',
        render: (text, record) => {
          return record.resResourceInfo ? record.resResourceInfo.resourceName :
            (record.resToolMaterialInfo ? record.resToolMaterialInfo.materialName : '');
        },
      }, {
        title: '规格型号',
        dataIndex: 'type',
        width: 120,
        key: 'type',
        render: (text, record) => {
          return record.resToolMaterialInfo ? record.resToolMaterialInfo.model : '';
        },
      }, {
        title: '数量',
        dataIndex: 'useCount',
        width: 80,
        key: 'useCount',
      }, {
        title: '存放地点',
        dataIndex: 'savePlace',
        width: 120,
        key: 'savePlace',
        render: (text, record) => {
          return record.resToolMaterialInfo ? record.resToolMaterialInfo.savePlace : '';
        },
      }, {
        title: '保管人',
        dataIndex: 'userID',
        width: 100,
        key: 'userID',
        render: (text, record) => {
          return record.resToolMaterialInfo ?
            (record.resToolMaterialInfo.baseUserInfo ?
              record.resToolMaterialInfo.baseUserInfo.userName : '') : '';
        },
      }, {
        title: '单位',
        dataIndex: 'materialUnit',
        width: 100,
        key: 'materialUnit',
        render: (text, record) => {
          return record.resToolMaterialInfo ? record.resToolMaterialInfo.materialUnit : '';
        },
      }, {
        title: '备注',
        dataIndex: 'remark',
        width: 200,
        key: 'remark',
        render: (text, record) => {
          return record.resToolMaterialInfo ? record.resToolMaterialInfo.remark : '';
        },
      }, {
        title: isEdit ? '操作' : '',
        width: 200,
        key: 'action',
        render: (text, record) => (
          isEdit ? (
            <span>
              <a href="javascript:;" onClick={() => this.getResource(record.readMaterialID)}>修改</a>
              <Divider type="vertical" />
              <Popconfirm title="确定要删除 ?" onConfirm={() => this.deleteResource(record.readMaterialID)} okText="确定" cancelText="取消">
                <a href="javascript:;">删除</a>
              </Popconfirm>
            </span>
          ) : null
        ),
      }];
    // 实施方案 预案附件
    const annexCols = [
      {
        title: '附件名称',
        dataIndex: 'annexName',
        width: '40%',
        key: 'annexName',
        render: (text, record) => {
          return record.resArchiveInfo ? record.resArchiveInfo.fileName : '';
        },
      }, {
        title: '操作',
        width: '20%',
        key: 'action',
        render: (text, record) => (
          <span>
            <a
              href={`/upload/${record.resArchiveInfo.savePath}`}
              download={record.resArchiveInfo.fileName}
            >下载
            </a>
          </span>),
      }];
    const emgcTitle = (
      <div className={styles.emgcResourceTitle}>
        <Row>
          <Col span={4}>应急资源</Col>
          <Col span={7}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="资源名称"
            >
              {form.getFieldDecorator('resourceName')(
                <Input autocomplete={false} placeholder="请输入资源名称" />
            )}
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              label="存放地点"
            >
              {form.getFieldDecorator('savePlace')(
                <Input autocomplete={false} placeholder="请输入存放地点" />
            )}
            </FormItem>
          </Col>
          <Col span={3} offset={1}>
            <Button type="primary" onClick={() => this.searchResource(1, 10)}>查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.resetResource}>重置</Button>
          </Col>
        </Row>
      </div>
    );
    return (
      <div className={styles.planInfo} >
        <Tabs tabPosition="left" onChange={this.tabChange}>
          <TabPane tab="基本信息" key="1">
            <Card title="基本信息">
              <Table
                columns={columns}
                scorll={{ x: 1560 }}
                dataSource={Object.keys(planBasicInfo).length === 0 ? [] : [planBasicInfo]}
                rowKey={record => record.planInfoID}
              />
            </Card>
          </TabPane>
          <TabPane tab="应急组织" key="2" disabled={Object.keys(planBasicInfo).length === 0}>
            <Card title="组织机构" extra={isEdit ? <Button onClick={this.openOrgAnnexModel}>新增组织机构图</Button> : null} style={{}}>
              <div className={styles.cardExtra}>
                <Row gutter={16}>
                  {this.props.orgAnnexList.map((card, index) => {
                    return (
                      <Col sm={24} md={24} lg={12} key={index}>
                        <Card
                          title={card.resArchiveInfo.fileName}
                          style={{ marginBottom: 8 }}
                        >
                          <div className={styles.pictureList}>
                            <Zmage
                              className={styles.picture}
                              alt="组织机构信息"
                              src={`/upload/${card.resArchiveInfo.savePath}`}
                            />
                          </div>
                        </Card>
                      </Col>
                    );
                  })
                  }
                </Row>
              </div>
            </Card>
          </TabPane>
          <TabPane tab="事件特征" key="3" disabled={Object.keys(planBasicInfo).length === 0}>
            <Card title="事件特征">
              <Table rowKey="panRedirectFeatureID" columns={featureCols} dataSource={eventFeatures} scroll={{ x: 1200, y: 270 }} />
            </Card>
          </TabPane>
          <TabPane tab="应急流程" key="4" disabled={Object.keys(planBasicInfo).length === 0}>
            <Card title="应急流程">
              <div className={styles.cardExtra}>
                <Row gutter={16}>
                  {this.props.emgcAnnex.map((card, index) => {
                    return (
                      <Col span={24} key={index}>
                        <Card
                          title={card.resArchiveInfo.fileName}
                          style={{ marginBottom: 8 }}
                        >
                          <div className={styles.pictureList}>
                            <Zmage
                              className={styles.picture}
                              alt="应急流程信息"
                              src={`/upload/${card.resArchiveInfo.savePath}`}
                            />
                          </div>
                        </Card>
                      </Col>
                    );
                  })
                  }
                </Row>
              </div>
            </Card>
          </TabPane>
          <TabPane tab="预案指令" key="5" disabled={Object.keys(planBasicInfo).length === 0}>
            <Card title="预案指令">
              <Table
                rowKey="commandID"
                columns={commandCols}
                dataSource={planCommand}
                scroll={{ x: 1200, y: 270 }}
              />
            </Card>
          </TabPane>
          <TabPane tab="应急资源" key="6" disabled={Object.keys(planBasicInfo).length === 0}>
            <div className={styles.emgcResource}>
              <Card title={emgcTitle}>
                <Table
                  columns={resourceCols}
                  dataSource={planResource.data}
                  rowKey={(record, index) => index}
                  pagination={{
                    current: planResource.pageNum,
                    pageSize: planResource.pageSize,
                    total: planResource.total,
                    onChange: this.searchResource,
                  }}
                  scroll={{ x: 1200, y: 270 }}
                />
              </Card>
            </div>
          </TabPane>
          <TabPane tab="预案附件" key="7" disabled={Object.keys(planBasicInfo).length === 0}>
            <Card title="预案附件">
              <Table
                rowKey="archiveID"
                columns={annexCols}
                dataSource={this.props.annexPage.result}
                pagination={{
                  pageSize: this.props.annexPage.pageSize,
                  current: this.props.annexPage.pageNum,
                  total: this.props.annexPage.total,
                  onChange: this.annexPageChange,
                }}
              />
            </Card>
          </TabPane>
          <TabPane tab="预案处置卡" key="8" disabled={Object.keys(planBasicInfo).length === 0}>
            <Card title="处置卡信息">
              <div className={styles.cardExtra}>
                <Row gutter={16}>
                  {this.props.dealCardList.map((card, index) => {
                    return (
                      <Col sm={24} md={24} lg={12} key={index}>
                        <Card
                          title={card.resArchiveInfo.fileName}
                          style={{ marginBottom: 8 }}
                        >
                          <div className={styles.pictureList}>
                            <Zmage
                              className={styles.picture}
                              alt="预案处置"
                              src={`/upload/${card.resArchiveInfo.savePath}`}
                            />
                          </div>
                        </Card>
                      </Col>
                    );
                  })
                  }
                </Row>
              </div>
            </Card>
          </TabPane>
        </Tabs>
      </div >
    );
  }
}
