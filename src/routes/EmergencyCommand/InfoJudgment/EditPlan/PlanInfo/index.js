import React, { PureComponent } from 'react';
import { Select, Table, Tabs, Card, Divider, Button, Row, Col, Form, Popconfirm } from 'antd';
import { connect } from 'dva';
import Zmage from 'react-zmage';
import AddFeature from './AddFeature/index';
import AddCommand from './AddCommand/index';
import AddResource from './AddResource/index';
import AddAnnex from './AddAnnex/index';
import AddPlan from './AddPlan/AddPlan';
import styles from './index.less';
import { commandType } from '../../../../../utils/utils';
<<<<<<< HEAD
import dealCard from '../../../../../assets/emergency/dealCard.png';
import processImg from '../../../../../assets/emergency/process.png';
import { Form } from 'antd/lib/index';
import { win3, win8, win10, win11, win12, win13, win14, win15, win16, win17, win18, win19, win20, win21, win22, win23, win24, win25, win26, win27, win28, win29, win30, } from '../../../../../utils/configIndex';
=======
import { win3, win8, win10, win11, win12, win13, win14, win15, win16, win17, win18, win19, win20, win21, win22, win23, win24, win25, win26, win27, win28, win29, win30, } from '../../../../../configIndex';
>>>>>>> 696be26b5790ebd003139803f0a7cd8be2c0cded

const Option = Select.Option;
const { TabPane } = Tabs;
@Form.create()
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
  annexPage: emergency.annexPage,
  implDealCardList: emergency.implDealCardList,
  implOrgAnnexList: emergency.implOrgAnnexList,
  implEmgcAnnex: emergency.implEmgcAnnex,
  executeList: emergency.executeList,
  eventExecPlanID: emergency.eventExecPlanID,
}))
export default class PlanInfo extends PureComponent {
  state = {
    featureVisible: false, // 事件特征的弹窗是否打开
    commandVisible: false, // 应急指令弹窗是否打开
    resourceVisible: false, // 应急资源弹窗是否打开
    annexVisible: false, // 预案附件弹窗是否打开
    isAdd: true, // 弹窗是否新增 false为修改状态
    uploadType: null, // 文件上传类型
  };
  componentDidMount() {
    this.props.onRef(this);
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
    const { eventID, eventExecPlanID } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { isAdd } = this.state;
      const url = isAdd ? 'emergency/addCommandInfo' : 'emergency/updateCommandInfo';
      this.props.dispatch({
        type: url,
        payload: { ...fieldsValue, eventID, userJson: JSON.stringify(checkedUser) },
      }).then(() => {
        this.setState({
          commandVisible: false,
        });
        this.props.dispatch({
          type: 'emergency/saveCheckedUser',
          payload: [],
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
  openAddAnnexModel = (uploadType) => {
    this.setState({
      annexVisible: true,
      uploadType,
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
      this.setState({
        commandVisible: false,
      });
    });
  };
  // 打开预案基本信息弹窗
  openAddPlanModel = (planBaseInfo) => {
    const { form } = this.props;
    form.setFieldsValue({
      planName: planBaseInfo.planName,
      userPlanCode: planBaseInfo.userPlanCode,
      planTypeName: planBaseInfo.planTypeName,
      planLevelName: planBaseInfo.planPlanLevel.levelName,
      emgcOrgID: planBaseInfo.emgcOrgID,
      applyObjectName: planBaseInfo.applyObjectName,
      organizationName: planBaseInfo.organization.organizationName,
    });
    this.setState({
      planVisible: true,
    });
  };
  // 关闭预案基本信息弹窗
  handleCancelPlan = () => {
    this.setState({
      planVisible: false,
    });
  };
  // 保存新增的预案附件
  addPlan = (form) => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { eventExecPlanID, dispatch, eventID } = this.props;
      const { emgcOrgID } = fieldsValue;
      dispatch({
        type: 'emergency/updateEmgcOrg',
        payload: { eventExecPlanID, emgcOrgID },
      }).then(() => {
        this.props.dispatch({
          type: 'emergency/getPlanBaseInfo',
          payload: { eventID, eventExecPlanID },
        });
        this.setState({
          planVisible: false,
        });
      });
    });
  };
  // 查询指令
  getCommand = (id) => {
    const { dispatch } = this.props;
    this.setState({
      commandVisible: true,
      isAdd: false,
    });
    dispatch({
      type: 'emergency/getCommandInfo',
      payload: { cmdExecID: id },
    }).then(() => {
      const { executeUser } = this.props.commandInfo;
      let arr = [];
      if (executeUser || executeUser.length) {
        arr = executeUser.map((item => item.orgPostionID));
      }
      dispatch({
        type: 'emergency/saveCheckedUser',
        // payload: this.props.commandInfo.executePostion,
        payload: arr,
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
      // 根据事件ID查询关联的预案
      dispatch({
        type: 'emergency/getPlansByEventID',
        payload: { eventID },
      }).then(() => {
        const { templatePlanID } = this.props;
        dispatch({
          type: 'emergency/saveSelectedRowKeys',
          payload: templatePlanID,
        });
      });
      //  请求实施方案列表
      this.props.dispatch({
        type: 'emergency/getExecuteList',
        payload: { eventID },
      }).then(() => {
        const { executeList } = this.props;
        if (executeList.length && executeList.length > 0) {
          const value = executeList[0].eventExecPlanID;
          // 默认选中后第一个方案
          this.props.dispatch({
            type: 'emergency/saveEventExecPlanID',
            payload: value,
          });
          // 根据eventID获取预案基本信息
          this.props.dispatch({
            type: 'emergency/getPlanBaseInfo',
            payload: { eventID, eventExecPlanID: value },
          });
          // 通过eventID获取预案指令
          this.props.dispatch({
            type: 'emergency/getEmgcCommandByEventID',
            payload: { eventID, eventExecPlanID: value },
          });
          // 通过eventID获取应急资源
          this.props.dispatch({
            type: 'emergency/getEmgcResourceByEventID',
            payload: { eventID, eventExecPlanID: value },
          });
          // 通过eventID获取事件特征
          this.props.dispatch({
            type: 'emergency/getEmgcFeatureByEventID',
            payload: { eventID, eventExecPlanID: value },
          });
          //  获取处置卡 eventID uploadType:1 为组织、2为附件、3为处置卡 4.应急流程
          this.props.dispatch({
            type: 'emergency/getImplDealCard',
            payload: { eventID, uploadType: 3, eventExecPlanID: value },
          });
          this.props.dispatch({
            type: 'emergency/getImplOrgAnnex',
            payload: { eventExecPlanID: value },
          });
          this.props.dispatch({
            type: 'emergency/getImplEmgcProcess',
            payload: { eventID, uploadType: 4, eventExecPlanID: value },
          });
          // 通过eventID 获取附件列表 // uploadType:1 为组织、2为附件、3为处置卡 4.应急流程
          const { pageNum, pageSize } = this.props.annexPage;
          this.props.dispatch({
            type: 'emergency/getAnnexPage',
            payload: { eventID, pageNum, pageSize, uploadType: 2, isQuery: true, fuzzy: false, eventExecPlanID: value },
          });
        } else {
          // 清空方案
          this.props.dispatch({
            type: 'emergency/saveEventExecPlanID',
            payload: null,
          });
          //  清空基本信息
          this.props.dispatch({
            type: 'emergency/savePlanBaseInfo',
            payload: [],
          });
          //  清空预案指令
          this.props.dispatch({
            type: 'emergency/saveEmgcCommandByEventID',
            payload: [],
          });
          //  清空应急指令
          this.props.dispatch({
            type: 'emergency/saveEmgcResourceByEventID',
            payload: [],
          });
          //  清空事件特征
          this.props.dispatch({
            type: 'emergency/saveEmgcFeature',
            payload: [],
          });
          //  清空处置卡
          this.props.dispatch({
            type: 'emergency/saveImplDealCard',
            payload: [],
          });
          //  清空应急流程
          this.props.dispatch({
            type: 'emergency/saveImplEmgcProcess',
            payload: [],
          });
          //  清空应急组织
          this.props.dispatch({
            type: 'emergency/saveImplOrgAnnex',
            payload: [],
          });
          //  清空应急附件
          this.props.dispatch({
            type: 'emergency/saveAnnexPage',
            payload: { pageNum: 1, pageSize: 5, result: [], sumCount: 0 },
          });
        }
      });
      // 清空等级
      this.props.dispatch({
        type: 'emergency/saveEventLevel',
        payload: '',
      });
    });
  };
  // 删除附件
  delete = (record) => {
    this.props.dispatch({
      type: 'emergency/deleteAnnex',
      payload: { id: record.eventExecPlanArchiveID },
    }).then(() => {
      const { pageNum, pageSize } = this.props.annexPage;
      const { eventID, eventExecPlanID } = this.props;
      this.props.dispatch({
        type: 'emergency/getAnnexPage',
        payload: { eventID, pageNum, pageSize, uploadType: 2, eventExecPlanID },
      });
    });
  };
  annexPageChange = (pageNum, pageSize) => {
    const { eventID, eventExecPlanID } = this.props;
    this.props.dispatch({
      type: 'emergency/getAnnexPage',
      payload: { eventID, eventExecPlanID, pageNum, pageSize, isQuery: true, fuzzy: true, uploadType: 2 },
    });
  };
  render() {
    const { isEdit, planBaseInfo, emgcResource, emgcCommand, emgcFeature,
      eventFeature, commandInfo, resourceInfo, hideFooter, viewNode, current } = this.props;
    const { isAdd } = this.state;
    // 实施方案 基本信息表头
    const columns = [
      {
        title: '预案编号',
        dataIndex: 'userPlanCode',
        width: win13,
        key: 'userPlanCode',
      }, {
        title: '预案名称',
        dataIndex: 'planName',
        width: win20,
        key: 'planName',
      }, {
        title: '预案类别',
        dataIndex: 'planTypeName',
        width: win13,
        key: 'planTypeName',
      }, {
        title: '预案等级',
        dataIndex: 'levelName',
        width: win13,
        key: 'levelName',
        render: (text, record) => {
          return record.planPlanLevel.levelName;
        },
      }, {
        title: '预案版本',
        dataIndex: 'version',
        width: win13,
        key: 'version',
      }, {
        title: '编写部门',
        dataIndex: 'organization',
        width: win15,
        key: 'organization',
        render: (text, record) => {
          return record.organization ? record.organization.orgnizationName : '';
        },
      }, {
        title: '应急组织',
        dataIndex: 'emgOrganization',
        width: win23,
        key: 'emgOrganization',
        render: (text, record) => {
          return record.emgOrganization ? record.emgOrganization.orgnizationName : '';
        },
      }, {
        title: '直接匹配特征',
        dataIndex: 'future',
        width: win18,
        key: 'future',
      }, {
        title: '操作',
        dataIndex: 'action',
        fixed: 'right',
        width: win10,
        render: (text, record) => {
          return isEdit ? (viewNode === current ? <a href="javascript:;" onClick={() => this.openAddPlanModel(record)}>修改</a> : null) : null;
        },
      },
    ];
    // 实施方案 事件特征表头
    const featureCols = [
      {
        title: '特征编号',
        dataIndex: 'featureCode',
        width: win10,
        key: 'featureCode',
        // render: (text, record) => {
        //   return record.planFeatureInfo.featureCode;
        // },
      }, {
        title: '特征类型',
        dataIndex: 'featureTypeName',
        width: win10,
        key: 'featureTypeName',
      }, {
        title: '特征名称',
        dataIndex: 'featureName',
        width: win12,
        key: 'featureName',
        // render: (text, record) => {
        //   return record.planFeatureInfo.featureName;
        // },
      }, {
        title: '规则',
        dataIndex: 'featureExpresstion',
        width: win8,
        key: 'featureExpresstion',
        // render: (text, record) => {
        //   return record.planFeatureInfo.featureExpresstion;
        // },
      }, {
        title: '特征值',
        dataIndex: 'featureValue',
        width: win8,
        key: 'featureValue',
        render: (text) => {
          switch (text) {
            case 'false': return '否';
            case 'true': return '是';
            default: return text;
          }
        },
      }, {
        title: '单位',
        dataIndex: 'featureUnit',
        width: win8,
        key: 'featureUnit',
        // render: (text, record) => {
        //   return record.planFeatureInfo.featureUnit;
        // },
      }, {
        title: '权重',
        dataIndex: 'weight',
        width: win8,
        key: 'weight',
        // render: (text, record) => {
        //   return record.planFeatureInfo.weight;
        // },
      }, {
        title: '特征描述',
        dataIndex: 'featureDes',
        width: win20,
        key: 'featureDes',
        // render: (text, record) => {
        //   return record.planFeatureInfo.featureDes;
        // },
      },
      // {
      //   title: isEdit ? '操作' : '',
      //   width: win20,
      //   key: 'action',
      //   render: (text, record) => (
      //     isEdit ? (
      //       <span>
      //         <a href="javascript:;" onClick={() => this.getFeature(record.entEmgcRFID)}>修改</a>
      //         <Divider type="vertical" />
      //         <Popconfirm title="确定要删除 ?" onConfirm={() => this.deleteFeature(record.entEmgcRFID)} okText="确定" cancelText="取消">
      //           <a href="javascript:;">删除</a>
      //         </Popconfirm>
      //       </span>
      //     ) : null
      //   ),
      // }
    ];
    // 实施方案 预案指令表头
    const commandCols = [
      {
        title: '流程节点',
        dataIndex: 'emgcFlowNode',
        width: win10,
        key: 'emgcFlowNode',
        render: (text, record) => {
          return record.emgcFlowNode.nodeName;
        },
      }, {
        title: '指令类型',
        dataIndex: 'commandType',
        width: win10,
        key: 'commandType',
        render: (text) => {
          return commandType(text);
        },
      }, {
        title: '指令分类',
        dataIndex: 'commandModelName',
        width: win10,
        key: 'commandModelName',
      }, {
        title: '指令内容',
        dataIndex: 'commandContent',
        width: win25,
        key: 'commandContent',
      }, {
        title: '执行岗位',
        dataIndex: 'executeUser',
        width: win12,
        key: 'executeUser',
        render: (text) => {
          let str = '';
          if (text && text.length > 0) {
            text.forEach((item, index) => {
              if (index !== text.length - 1) {
                str = `${str + item.postionName}, `;
              } else {
                str += item.postionName;
              }
            });
          }
          return str;
        },
      }, {
        title: '执行时长',
        dataIndex: 'executeTime',
        width: win10,
        key: 'executeTime',
      }, {
        title: '排列序号',
        dataIndex: 'executeIndex',
        width: 100,
        key: 'executeIndex',
      }, {
        title: '注意事项',
        dataIndex: 'attention',
        key: 'attention',
      }, {
        title: isEdit ? '操作' : '',
        width: win14,
        fixed: 'right',
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
        width: win10,
        key: 'resourceCode',
        render: (text, record) => {
          return record.resResourceInfo ? record.resResourceInfo.resourceCode :
            (record.resToolMaterialInfo ? record.resToolMaterialInfo.materialCode : '');
        },
      }, {
        title: '资源名称',
        dataIndex: 'resourceName',
        width: win10,
        key: 'resourceName',
        render: (text, record) => {
          return record.resourceName || record.materialName;
        },
      }, {
        title: '规格型号',
        dataIndex: 'type',
        width: win12,
        key: 'type',
        render: (text, record) => {
          return record.resourceName ? record.specification : record.specifications;
        },
      }, {
        title: '数量',
        dataIndex: 'useCount',
        width: win8,
        key: 'useCount',
      }, {
        title: '存放地点',
        dataIndex: 'savePlace',
        width: win12,
        key: 'savePlace',
      }, {
        title: '保管人',
        dataIndex: 'userName',
        width: win10,
        key: 'userName',
      }, {
        title: '备注',
        dataIndex: 'remark',
        width: win20,
        key: 'remark',
      }, {
        title: isEdit ? '操作' : '',
        width: win20,
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
            {isEdit ? <Divider type="vertical" /> : null}
            {isEdit ? <a href="javascript:;" onClick={() => this.delete(record)}>删除</a> : null}
          </span>
        ),
      }];
    return (
      <div className={styles.planInfo}>
        <Tabs tabPosition="left" defaultActiveKey="8" >
          <TabPane tab="基本信息" key="1">
            <Card title="基本信息">
              <Table
                columns={columns}
                dataSource={planBaseInfo}
                rowKey={record => record.planInfoID}
                pagination={{ pageSize: 5 }}
                scroll={{ x: 1200 + columns.length * win3 }}
              />
            </Card>
          </TabPane>
          <TabPane tab="应急组织" key="2">
            <Card title="组织机构">
              <div className={styles.cardExtra}>
                <Row gutter={16}>
                  {this.props.implOrgAnnexList.map((card) => {
                    return (
                      <Col md={24} lg={12} key={card}>
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
            <Card title="事件特征" style={{}}>
              <Table
                columns={featureCols}
                rowKey={(recoed, index) => index}
                dataSource={emgcFeature.map((item, index) => { return { ...item, key: index }; })}
                pagination={{ pageSize: 5 }}
                scroll={{ x: 1200 + columns.length * win3 }}
              />
            </Card>
          </TabPane>
          <TabPane tab="应急流程" key="4">
            <Card title="应急流程">
              <div className={styles.cardExtra}>
                <Row gutter={16}>
                  {this.props.implEmgcAnnex.map((card, index) => {
                    return (
                      <Col span={24} key={card}>
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
            <Card title="预案指令" extra={isEdit ? <Button onClick={this.openAddCommandModel}>新增指令</Button> : null} style={{}}>
              <Table
                columns={commandCols}
                rowKey={record => record.cmdExecID}
                dataSource={emgcCommand}
                scroll={{ x: 1100 + columns.length * win3 }}
                pagination={{ pageSize: 5 }}
              />
            </Card>
          </TabPane>
          <TabPane tab="应急资源" key="6">
            <Card title="应急资源" extra={isEdit ? <Button onClick={this.openAddResourceModel}>新增资源</Button> : null} style={{}}>
              <Table
                columns={resourceCols}
                dataSource={emgcResource}
                rowKey={record => record.execPlanResourceID}
                pagination={{ pageSize: 5 }}
                scroll={{ x: 1200 + columns.length * win3 }}
              />
            </Card>
          </TabPane>
          <TabPane tab="预案附件" key="7">
            <Card title="预案附件" extra={isEdit ? <Button onClick={() => this.openAddAnnexModel(2)}>新增附件</Button> : null} style={{}}>
              <Table
                columns={annexCols}
                rowKey={record => record.eventExecPlanArchiveID}
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
          <TabPane tab="处置卡" key="8">
            <Card title="处置卡信息">
              <div className={styles.cardExtra}>
                <Row gutter={16}>
                  {this.props.implDealCardList.map((card, index) => {
                    return (
                      <Col md={24} lg={12} key={card}>
                        <Card
                          title={card.resArchiveInfo.fileName}
                          style={{ marginBottom: 8 }}
                        >
                          <Zmage
                            className={styles.picture}
                            alt="预案处置卡"
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
                uploadType={this.state.uploadType}
                isAdd={isAdd}
              />
              <AddPlan
                handleCancel={this.handleCancelPlan}
                add={this.addPlan}
                form={this.props.form}
                visible={this.state.planVisible}
              />
            </div>
          ) : null
        }
      </div>
    );
  }
}
