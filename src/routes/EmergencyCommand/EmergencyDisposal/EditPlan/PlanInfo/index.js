import React, { PureComponent } from 'react';
import { Select, Table, Tabs, Card, Divider, Button, Row, Col, Icon, Popconfirm } from 'antd';
import { connect } from 'dva';
import Zmage from 'react-zmage';
import AddFeature from './AddFeature/index';
import AddCommand from './AddCommand/index';
import AddResource from './AddResource/index';
import AddAnnex from './AddAnnex/index';
import Footer from './Footer/index';
import styles from './index.less';
import { commandType } from '../../../../../utils/utils';
import emgcOrg from '../../../../../assets/emergency/emgcOrg.png';
import processImg from '../../../../../assets/emergency/process.png';
import dealCard from '../../../../../assets/emergency/dealCard.png';

const Option = Select.Option;
const { TabPane } = Tabs;
@connect(({ emergency }) => ({
  eventID: emergency.eventId,
  planBaseInfo: emergency.planBaseInfo,
  emgcCommand: emergency.emgcCommand,
  emgcResource: emergency.emgcResource,
  emgcFeature: emergency.emgcFeature,
  eventFeature: emergency.eventFeature,
  resourceInfo: emergency.resourceInfo,
  commandInfo: emergency.commandInfo,
  eventLevel: emergency.eventLevel,
  current: emergency.current,
  viewNode: emergency.viewNode,
  eventExecPlanID: emergency.eventExecPlanID,
  planInfo: emergency.planInfo,
  annexPage: emergency.annexPage,
  // dealCardList: emergency.dealCardList,
  // orgAnnexList: emergency.orgAnnexList,
  implOrgAnnexList: emergency.implOrgAnnexList,
  implDealCardList: emergency.implDealCardList,
  implEmgcAnnex: emergency.implEmgcAnnex,
  // emgcAnnex: emergency.emgcAnnex,
  planInfoID: emergency.planInfoID,
}))
export default class PlanInfo extends PureComponent {
  state = {
    featureVisible: false, // 事件特征的弹窗是否打开
    commandVisible: false, // 应急指令弹窗是否打开
    resourceVisible: false, // 应急资源弹窗是否打开
    annexVisible: false, // 预案附件弹窗是否打开
    isAdd: true, // 弹窗是否新增 false为修改状态
  };
  componentDidMount() {
    const { eventID, dispatch, planAnnexPage } = this.props;
    // 根据eventID获取预案基本信息
    dispatch({
      type: 'emergency/getPlanBaseInfo',
      payload: { eventID },
    });
  }
  // 打开事件特征的新增弹窗
  openAddFeatureModel = () => {
    this.setState({
      featureVisible: true,
      isAdd: true,
    });
  };
  // 关闭事件新增弹窗
  handleCancelFeature = () => {
    this.setState({
      featureVisible: false,
    });
  };
  // 保存新增的特征
  addFeature = (form) => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log('receive form:', fieldsValue);
      this.setState({
        featureVisible: false,
      });
    });
  };
  // 打开预案指令的新增弹窗
  openAddCommandModel = () => {
    this.setState({
      commandVisible: true,
      isAdd: true,
    });
  };
  // 关闭指令新增弹窗
  handleCancelCommand = () => {
    this.setState({
      commandVisible: false,
    });
  };
  // 保存新增的指令
  addCommand = (form, checkedUser) => {
    const { eventID } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { isAdd } = this.state;
      const { eventExecPlanID } = fieldsValue;
      delete fieldsValue.searchContent;
      delete fieldsValue.searchType;
      const url = isAdd ? 'emergency/addCommandInfo' : 'emergency/updateCommandInfo';
      this.props.dispatch({
        type: url,
        payload: { ...fieldsValue, eventID, userJson: JSON.stringify(checkedUser) },
      }).then(() => {
        this.setState({
          commandVisible: false,
        });
        this.props.dispatch({
          type: 'emergency/getEmgcCommandByEventID',
          payload: { eventID, eventExecPlanID },
        });
      });
    });
  };
  // 打开应急资源的新增弹窗
  openAddResourceModel = () => {
    this.setState({
      resourceVisible: true,
      isAdd: true,
    });
  };
  // 关闭应急资源新增弹窗
  handleCancelResource = () => {
    this.setState({
      resourceVisible: false,
      isAdd: true,
    });
  };
  // 保存新增的应急资源
  addResource = (form) => {
    const { eventID } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { isAdd } = this.state;
      let data = {};
      const url = isAdd ? 'emergency/addResourceInfo' : 'emergency/updateResourceInfo';
      const { execPlanResourceID, useCount, toolMaterialInfoID, resourceID, resourceType, eventExecPlanID } = fieldsValue;
      if (resourceType === 1) {
        data = { execPlanResourceID, useCount, resourceID, eventID, eventExecPlanID };
      } else {
        data = { execPlanResourceID, useCount, toolMaterialInfoID, eventID, eventExecPlanID };
      }

      this.props.dispatch({
        type: url,
        payload: { ...data },
      }).then(() => {
        this.setState({
          resourceVisible: false,
        });
        this.props.dispatch({
          type: 'emergency/getEmgcResourceByEventID',
          payload: { eventID, eventExecPlanID },
        });
      });
    });
  };
  // 打开预案附件的新增弹窗
  openAddAnnexModel = () => {
    this.setState({
      annexVisible: true,
    });
  };
  // 关闭预案附件新增弹窗
  handleCancelAnnex = () => {
    this.setState({
      annexVisible: false,
    });
  };
  // 保存新增的预案附件
  addAnnex = (form) => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log('receive form:', fieldsValue);
      this.setState({
        commandVisible: false,
      });
    });
  };
  // 查询指令
  getCommand = (id) => {
    this.setState({
      commandVisible: true,
      isAdd: false,
    });
    this.props.dispatch({
      type: 'emergency/getCommandInfo',
      payload: { cmdExecID: id },
    }).then(() => {
      // 默认选中的人员
      this.props.dispatch({
        type: 'emergency/saveCheckedUser',
        payload: this.props.commandInfo.executePostion,
      });
    });
  };
  // 删除指令
  deleteCommand = (id) => {
    this.props.dispatch({
      type: 'emergency/deleteCommandInfo',
      payload: { id },
    }).then(() => {
      const { eventID, eventExecPlanID } = this.props;
      this.props.dispatch({
        type: 'emergency/getEmgcCommandByEventID',
        payload: { eventID, eventExecPlanID },
      });
    });
  };
  // 查询应急资源
  getResource = (id) => {
    this.setState({
      resourceVisible: true,
      isAdd: false,
    });
    this.props.dispatch({
      type: 'emergency/getResourceInfo',
      payload: { id },
    });
  };
  // 删除应急资源
  deleteResource = (id) => {
    this.props.dispatch({
      type: 'emergency/deleteResourceInfo',
      payload: { id },
    }).then(() => {
      const { eventID, eventExecPlanID } = this.props;
      this.props.dispatch({
        type: 'emergency/getEmgcResourceByEventID',
        payload: { eventID, eventExecPlanID },
      });
    });
  };
  // 保存实时方案
  savePlan = () => {
    const { eventLevel, eventID, dispatch } = this.props;
    dispatch({
      type: 'emergency/updatePlanLevel',
      payload: { eventLevel, eventID },
    });
  };
  // 清空实时方案
  clearPlan = () => {
    const { dispatch, eventID } = this.props;
    // 清空实施方案
    dispatch({
      type: 'emergency/clearPlan',
      payload: { eventID },
    }).then(() => {
      // 根据eventID获取预案基本信息
      this.props.dispatch({
        type: 'emergency/getPlanBaseInfo',
        payload: { eventID },
      });
      // 通过eventID获取预案指令
      this.props.dispatch({
        type: 'emergency/getEmgcCommandByEventID',
        payload: { eventID },
      });
      // 通过eventID获取应急资源
      this.props.dispatch({
        type: 'emergency/getEmgcResourceByEventID',
        payload: { eventID },
      });
      // 通过eventID获取事件特征
      this.props.dispatch({
        type: 'emergency/getEmgcFeatureByEventID',
        payload: { eventID },
      });
    });
  };
  // 获取预案分页数据
  page = (pageNum, pageSize) => {
    const { dispatch, planInfoID } = this.props;
    dispatch({
      type: 'emergency/getPlanAnnexPage',
      payload: { pageNum, pageSize, planInfoID },
    });
  };
  render() {
    const { isEdit, planBaseInfo, emgcResource, emgcCommand, emgcFeature,
      eventFeature, commandInfo, resourceInfo, hideFooter, planInfo } = this.props;
    const { isAdd } = this.state;
    // 实施方案 基本信息表头
    const columns = [
      {
        title: '预案编号',
        dataIndex: 'userPlanCode',
        width: 100,
        key: 'userPlanCode',
      }, {
        title: '预案名称',
        dataIndex: 'planName',
        width: 100,
        key: 'planName',
      }, {
        title: '预案类别',
        dataIndex: 'planTypeName',
        width: 100,
        key: 'planTypeName',
      }, {
        title: '预案等级',
        dataIndex: 'planPlanLevel',
        width: 100,
        key: 'planPlanLevel',
        render: (text) => {
          return text ? text.levelName : '';
        },
      }, {
        title: '预案版本',
        dataIndex: 'version',
        width: 100,
        key: 'version',
      }, {
        title: '编写部门',
        dataIndex: 'organization',
        width: 100,
        key: 'organization',
        render: (text) => {
          return text ? text.orgnizationName : '';
        },
      }, {
        title: '直接匹配特征',
        dataIndex: 'future',
        width: 100,
        key: 'future',
      },
    ];
      // 实施方案 事件特征表头
    const featureCols = [
      {
        title: '特征编号',
        dataIndex: 'featureCode',
        width: 100,
        key: 'featureCode',
        // render: (text, record) => {
        //   return record.planFeatureInfo.featureCode;
        // },
      }, {
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
        dataIndex: 'featureExpresstion ',
        width: 80,
        key: 'featureExpresstion ',
        render: (text, record) => {
          return record.featureExpresstion;
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
        // render: (text, record) => {
        //   return record.planFeatureInfo.featureUnit;
        // },
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
        // render: (text, record) => {
        //   return record.planFeatureInfo.featureDes;
        // },
      },
    ];
      // 实施方案 预案指令表头
    const commandCols = [
      {
        title: '流程节点',
        dataIndex: 'emgcFlowNode',
        width: 100,
        key: 'emgcFlowNode',
        render: (text, record) => {
          return record.emgcFlowNode.nodeName;
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
        dataIndex: 'executeUser',
        width: 120,
        key: 'executeUser',
        render: (text) => {
          let str = '';
          if (text && text.length > 0) {
            text.forEach((item, index) => {
              if (item) {
                if (index !== text.length - 1) {
                  str = `${str + item.postionName}, `;
                } else {
                  str += item.postionName;
                }
              }
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
              <a href="javascript:;" onClick={() => this.getCommand(record.cmdExecID)}>修改</a>
              <Divider type="vertical" />
              <Popconfirm title="确定要删除 ?" onConfirm={() => this.deleteCommand(record.cmdExecID)} okText="确定" cancelText="取消">
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
        title: '备注',
        dataIndex: 'remark',
        width: 200,
        key: 'attention',
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
              <a href="javascript:;" onClick={() => this.getResource(record.execPlanResourceID)}>修改</a>
              <Divider type="vertical" />
              <Popconfirm title="确定要删除 ?" onConfirm={() => this.deleteResource(record.execPlanResourceID)} okText="确定" cancelText="取消">
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
          </span>
        ),
      }];
    return (
      <div className={styles.planInfo}>
        <Tabs tabPosition="left" defaultActiveKey="8">
          <TabPane tab="基本信息" key="1">
            <Card title="基本信息">
              <Table
                columns={columns}
                dataSource={planBaseInfo}
                rowKey={record => record.planInfoID}
                pagination={{ pageSize: 5 }}
                scroll={{ x: 1200 }}
              />
            </Card>
          </TabPane>
          <TabPane tab="应急组织" key="2">
            <Card title="组织机构">
              <div className={styles.cardExtra}>
                <Row gutter={16}>
                  {this.props.implOrgAnnexList.map((card, index) => {
                    return (
                      <Col span={8} key={index}>
                        <Card
                          title={card.resArchiveInfo.fileName}
                          style={{ marginBottom: 8 }}
                        >
                          <Zmage
                            className={styles.picture}
                            alt="组织机构信息"
                            src={`/upload/${card.resArchiveInfo.savePath}`}
                          />
                        </Card>
                      </Col>
                    );
                  })
                  }
                </Row>
              </div>
            </Card>
          </TabPane>
          <TabPane tab="事件特征" key="3">
            <Card title="事件特征" style={{ }}>
              <Table
                rowKey={(record, index) => index}
                columns={featureCols}
                dataSource={emgcFeature}
                pagination={{ pageSize: 5 }}
                scroll={{ x: 1200 }}
              />
            </Card>
          </TabPane>
          <TabPane tab="应急流程" key="4">
            <Card title="应急流程">
              <div className={styles.cardExtra}>
                <Row gutter={16}>
                  {this.props.implEmgcAnnex.map((card, index) => {
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
          <TabPane tab="预案指令" key="5">
            <Card title="预案指令" extra={isEdit ? <Button onClick={this.openAddCommandModel}>新增指令</Button> : null} style={{ }}>
              <Table
                rowKey={(record, index) => index}
                columns={commandCols}
                dataSource={emgcCommand}
                pagination={{ pageSize: 5 }}
                scroll={{ x: 1200 }}
              />
            </Card>
          </TabPane>
          <TabPane tab="应急资源" key="6">
            <Card title="应急资源" extra={isEdit ? <Button onClick={this.openAddResourceModel}>新增资源</Button> : null} style={{ }}>
              <Table
                rowKey={(record, index) => index}
                columns={resourceCols}
                dataSource={emgcResource}
                pagination={{ pageSize: 5 }}
                scroll={{ x: 1200 }}
              />
            </Card>
          </TabPane>
          <TabPane tab="预案附件" key="7">
            <Card title="预案附件" style={{ }}>
              <Table
                columns={annexCols}
                rowKey={(record, index) => index}
                dataSource={this.props.annexPage.result}
                pagination={{
                  pageSize: this.props.annexPage.pageSize,
                  current: this.props.annexPage.pageNum,
                  total: this.props.annexPage.total,
                  onChange: this.page,
                }}
              />
            </Card>
          </TabPane>
          <TabPane tab="处置卡" key="8">
            <Card title="处置卡信息">
              <div className={styles.cardExtra}>
                <Row gutter={16}>
                  {this.props.implDealCardList.map((card, index) => {
                    return (
                      <Col span={8} key={index}>
                        <Card
                          title={card.resArchiveInfo.fileName}
                          style={{ marginBottom: 8 }}
                        >
                          <Zmage
                            className={styles.picture}
                            alt="处置卡信息"
                            src={`/upload/${card.resArchiveInfo.savePath}`}
                          />
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
        {
          isEdit ? (
            <div>
              {
                (hideFooter || this.props.viewNode < this.props.current) ?
                  null : <Footer save={this.savePlan} cancel={this.clearPlan} />}
              <AddFeature
                handleCancel={this.handleCancelFeature}
                add={this.addFeature}
                visible={this.state.featureVisible}
                eventFeature={eventFeature}
                isAdd={isAdd}
              />
              <AddCommand
                handleCancel={this.handleCancelCommand}
                add={this.addCommand}
                commandInfo={commandInfo}
                visible={this.state.commandVisible}
                isAdd={isAdd}
              />
              <AddResource
                handleCancel={this.handleCancelResource}
                add={this.addResource}
                resourceInfo={resourceInfo}
                visible={this.state.resourceVisible}
                isAdd={isAdd}
              />
              <AddAnnex
                handleCancel={this.handleCancelAnnex}
                add={this.addAnnex}
                visible={this.state.annexVisible}
                isAdd={isAdd}
              />
            </div>
) : null
        }
      </div>
    );
  }
}
