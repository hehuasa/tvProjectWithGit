import React, { PureComponent } from 'react';
import { Select, Table, Tabs, Card, Divider, Button, Row, Col, Popconfirm, Checkbox, Icon, Form, Input, Modal, Upload } from 'antd';
import { connect } from 'dva';
import Zmage from 'react-zmage';
import moment from 'moment';

import AddPlan from './AddPlan/AddPlan';
import AddFeature from './AddFeature/index';
import AddCommand from './AddCommand/index';
import AddResource from './AddResource/index';
import AddAnnex from './AddAnnex/index';
import Footer from './Footer/index';
import styles from './index.less';
import { commandType } from '../../../../utils/utils';

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
  checkResult: planManagement.checkResult,
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
            payload: { planInfoID },
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

  // 新增预案基本信息
  openAddPlan = () => {
    // 打开事件特征的新增弹窗 11
    this.setState({
      planVisible: true,
      isAdd: true,
    });
    // 1. 清空组织机构
    this.props.dispatch({
      type: 'planManagement/saveOrgAnnex',
      payload: [],
    });
    //  2. 清空事件特征
    this.props.dispatch({
      type: 'planManagement/saveEventFeatures',
      payload: [],
    });
    //  3. 清空应急流程
    this.props.dispatch({
      type: 'planManagement/saveEmgcProcess',
      payload: [],
    });
    //  4. 清空预案指令
    this.props.dispatch({
      type: 'planManagement/savePlanCommand',
      payload: [],
    });
    //  5. 清空应急资源
    this.props.dispatch({
      type: 'planManagement/savePlanResource',
      payload: [],
    });
    //  6. 清空预案附件
    this.props.dispatch({
      type: 'planManagement/saveAnnexPage',
      payload: {
        pageNum: 1,
        pageSize: 5,
        result: [],
        sumCount: 0,
      },
    });
    //  7. 清空处置卡
    this.props.dispatch({
      type: 'planManagement/saveDealCard',
      payload: [],
    });
  };
  // 保存预案基本信息
  addSavePlan = (form) => {
    form.validateFields((err, fieldsValue) => {
      const { baseUserInfo } = this.props.currentUser;
      const { userID } = baseUserInfo;
      if (!err && this.state.codeToggle) {
        const { isAdd } = this.state;
        let type = null;
        if (isAdd) {
          // 保存add预案个人基本信息
          type = 'planManagement/addPlanInfo';
        } else {
          // 保存update预案个人基本信息
          type = 'planManagement/updatePlanInfo';
        }
        const params = {
          ...fieldsValue,
          userID,
        };
        for (const key in params) {
          if (params[key] === null || params[key] === undefined || params[key] === '') {
            delete params[key];
          }
        }
        this.props.dispatch({
          type,
          payload: { ...params },
        }).then(() => {
          const { statu } = this.props.planBasicInfo;
          if (!isAdd && statu !== 0) {
            this.setState({
              planVisible: false,
            });
          } else {
            this.props.handleModalVisible(false);
            this.setState({
              planVisible: false,
            });
          }
          this.props.dispatch({
            type: 'planManagement/page',
            payload: { pageNum: 1, pageSize: 10 },
          });
        });
      } else if (!this.state.codeToggle) {
        form.setFields({
          planCode: {
            value: fieldsValue.planCode,
            errors: [new Error('唯一字段已经存在')],
          },
        });
      }
    });
  }
  // 修改预案基本信息
  updatePlanInfo = (record) => {
    // 获取单个预案信息
    // this.props.dispatch({
    //   type: 'emergency/getPlanInfo',
    //   payload: {
    //     id: record.planInfoID,
    //   },
    // });
    this.setState({
      planVisible: true,
      isAdd: false,
    });
  }
  // 关闭预案基本信息
  handleCancelPlan = () => {
    this.setState({
      planVisible: false,
    });
  }
  // 新增特征
  openAddFeatureModel = () => {
    // 请求预案特征 11
    this.props.dispatch({
      type: 'planManagement/getFeaturePlan',
    });
    // 请求   特征类型   事件类型
    this.props.dispatch({
      type: 'planManagement/selectByTypeParent',
    });
    this.props.dispatch({
      type: 'planManagement/saveEventFeaturePlan',
      payload: {},
    });
    // 打开事件特征的新增弹窗 11
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
  // 保存新增的特征 11
  addFeature = ({ form, feature = { props: { title: this.state.featureID } } }) => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const getData = {
        planInfoID: this.props.planBasicInfo.planInfoID,
      };

      getData.weight = fieldsValue.weight;
      getData.drectFeature = fieldsValue.drectFeature;
      getData.featureValue = fieldsValue.featureValue;
      getData.featureExpresstion = fieldsValue.featureExpresstion;
      getData.dataType = fieldsValue.dataType;
      if (feature && feature.props.title !== undefined) {
        getData.featureID = feature.props.title;
      } else {
        getData.featureName = fieldsValue.featureID;

        getData.featureUnit = fieldsValue.featureUnit;
        getData.featureType = fieldsValue.featureType;
        getData.featureDes = fieldsValue.featureDes;
        getData.featureCode = fieldsValue.featureCode;
        getData.dataType = fieldsValue.dataType;
      }
      const { dispatch } = this.props;
      if (this.state.isAdd) {
        // 检测当前预案已有同名特征
        const { planInfoID, featureName } = getData;
        dispatch({
          type: 'planManagement/checkFeature',
          payload: { planInfoID, featureName },
        }).then(() => {
          if (this.props.checkResult) {
            const handleCancelFeature = this.handleCancelFeature;
            Modal.confirm({
              title: '特征校验结果',
              content: '当前预案已存在同名特征，是否覆盖?',
              okText: '是',
              cancelText: '否',
              onOk() {
                getData.cover = true;
                dispatch({
                  type: 'planManagement/addFeaturePlan',
                  payload: getData,
                }).then(() => {
                  handleCancelFeature();
                });
              },
              onCancel() {},
            });
          } else {
            dispatch({
              type: 'planManagement/addFeaturePlan',
              payload: getData,
            }).then(() => {
              this.setState({
                featureVisible: false,
              });
            });
          }
        });
      } else {
        getData.panRedirectFeatureID = this.state.panRedirectFeatureID;
        dispatch({
          type: 'planManagement/updateFeaturePlan',
          payload: getData,
        }).then(() => {
          this.setState({
            featureVisible: false,
          });
        });
      }
    });
  };
  // 打开预案指令的新增弹窗
  openAddCommandModel = () => {
    const { planBasicInfo, dispatch } = this.props;
    // 根据预案ID 获取执行岗位
    dispatch({
      type: 'planManagement/planExecutePosition',
      payload: { planInfoID: planBasicInfo.planInfoID },
    });
    // 根据预案ID获取流程节点
    dispatch({
      type: 'planManagement/getFlowNodeList',
      payload: { planInfoID: planBasicInfo.planInfoID },
    });
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
    const { planBasicInfo } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { isAdd } = this.state;
      const url = isAdd ? 'planManagement/addPlanCommand' : 'planManagement/updatePlanCommand';
      const postionJson = JSON.stringify(fieldsValue.executePostion);
      delete fieldsValue.executePostion;
      this.props.dispatch({
        type: url,
        payload: { ...fieldsValue, planInfoID: planBasicInfo.planInfoID, postionJson },
      }).then(() => {
        this.setState({
          commandVisible: false,
        });
        // 刷新预案的指令
        this.props.dispatch({
          type: 'planManagement/getPlanCommand',
          payload: {
            planInfoID: planBasicInfo.planInfoID,
          },
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
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { isAdd } = this.state;
      const { planInfoID } = this.props.planBasicInfo;
      let data = {};
      const url = isAdd ? 'planManagement/addPlanResource' : 'planManagement/updatePlanResource';
      const { readMaterialID, toolMaterialInfoID, resourceID, resourceType, useCount } = fieldsValue;
      if (resourceType === 1) {
        data = { planInfoID, useCount, resourceID, readMaterialID };
      } else {
        data = { planInfoID, useCount, toolMaterialInfoID, readMaterialID };
      }

      this.props.dispatch({
        type: url,
        payload: { ...data },
      }).then(() => {
        this.setState({
          resourceVisible: false,
        });
        this.searchResource(1, 10);
      });
    });
  };
  // 打开预案附件的新增弹窗
  openAddAnnexModel = () => {
    this.setState({
      annexVisible: true,
      uploadType: 2,
    });
  };
  // 打开处置卡的新增弹窗
  openDealCardModel = () => {
    this.setState({
      annexVisible: true,
      uploadType: 3,
    });
  };
  // 打开应急流程的新增弹窗
  openEmgcProcessModel = () => {
    this.setState({
      annexVisible: true,
      uploadType: 4,
    });
  };
  // 打开组织机构的新增弹窗
  openOrgAnnexModel = () => {
    this.setState({
      annexVisible: true,
      uploadType: 1,
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
  // 修改查询特征 11
  getFeature = (record) => {
    const id = record.panRedirectFeatureID;
    // 请求预案特征 11
    this.props.dispatch({
      type: 'planManagement/getFeaturePlan',
    });
    // 请求   特征类型   事件类型
    this.props.dispatch({
      type: 'planManagement/selectByTypeParent',
    }).then(() => {
      this.setState({
        featureVisible: true,
        isAdd: false,
        panRedirectFeatureID: id,
        featureID: record.featureID,
      });
    });
    this.props.dispatch({
      type: 'planManagement/getEventFeaturePlan',
      payload: { id },
    });
  };
  // 删除特征 11
  deleteFeature = (panRedirectFeatureID) => {
    this.props.dispatch({
      type: 'planManagement/delFeaturePlan',
      payload: {
        panRedirectFeatureID,
        planInfoID: this.props.planInfoId,
        isDelete: this.state.isDelete,
      },
    });
  };
  // 修改特征 11
  // updateFeature = () => {
  //   this.props.dispatch({
  //     type: 'planManagement/updateEventFeature',
  //     payload: {},
  //   });
  // }
  // 查询指令
  getCommand = (id) => {
    const { planBasicInfo, dispatch } = this.props;
    this.setState({
      commandVisible: true,
      isAdd: false,
    });
    // 获取指令信息
    dispatch({
      type: 'planManagement/findPlanCommand',
      payload: { planInfoID: planBasicInfo.planInfoID, commandID: id },
    });
    // 根据预案ID 获取执行岗位
    dispatch({
      type: 'planManagement/planExecutePosition',
      payload: { planInfoID: planBasicInfo.planInfoID },
    });
    // 根据预案ID获取流程节点
    dispatch({
      type: 'planManagement/getFlowNodeList',
      payload: { planInfoID: planBasicInfo.planInfoID },
    });
  };
  // 删除指令
  deleteCommand = (id) => {
    this.props.dispatch({
      type: 'planManagement/deletePlanCommand',
      payload: { id },
    }).then(() => {
      const { planBasicInfo } = this.props;
      this.props.dispatch({
        type: 'planManagement/getPlanCommand',
        payload: { planInfoID: planBasicInfo.planInfoID },
      });
    });
  };
  // 查询应急资源
  getResource = (id) => {
    this.props.dispatch({
      type: 'planManagement/getResourceInfo',
      payload: { id },
    }).then(() => {
      this.setState({
        resourceVisible: true,
        isAdd: false,
      });
    });
  };
  // 删除应急资源
  deleteResource = (id) => {
    this.props.dispatch({
      type: 'planManagement/deleteResourceInfo',
      payload: { id },
    }).then(() => {
      this.searchResource(1, 10);
    });
  };
  // 保存实时方案
  savePlan = () => {
    const { eventLevel, eventID, dispatch } = this.props;
    // dispatch({
    //   type: 'emergency/updatePlanLevel',
    //   payload: { eventLevel, eventID },
    // });
  };
  // 清空实时方案
  clearPlan = () => {
    const { dispatch, eventID } = this.props;
  }
  deleteOrgAnnex = (record) => {
    const { planBasicInfo } = this.props;
    this.props.dispatch({
      type: 'planManagement/deleteOrgAnnex',
      payload: { id: record.orgaArchiveInfoID },
    }).then(() => {
      this.props.dispatch({
        type: 'planManagement/getOrgAnnex',
        payload: { planInfoID: planBasicInfo.planInfoID },
      });
    });
  };
  // 删除附件
  delete = (record, uploadType) => {
    // uploadType:1 为组织、2为附件、3为处置卡
    this.props.dispatch({
      type: 'planManagement/deleteAnnex',
      payload: { id: record.emgcPlanArchiveID },
    }).then(() => {
      const { pageNum, pageSize } = this.props.annexPage;
      switch (uploadType) {
        case 2:
          this.annexPageChange(pageNum, pageSize);
          break;
        case 3:
          this.props.dispatch({
            type: 'planManagement/getDealCard',
            payload: { planInfoID: record.planInfoID, uploadType: 3 },
          });
          break;
        case 4:
          this.props.dispatch({
            type: 'planManagement/getEmgcProcess',
            payload: { planInfoID: record.planInfoID, uploadType: 4 },
          });
          break;
        default: break;
      }
    });
  };
  // 附件分页信息
  annexPageChange = (pageNum, pageSize) => {
    const { planBasicInfo } = this.props;
    this.props.dispatch({
      type: 'planManagement/getAnnexPage',
      payload: { planInfoID: planBasicInfo.planInfoID, isQuery: true, fuzzy: false, pageNum, pageSize, uploadType: 2 },
    });
  };
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
  orgFileChange = (info) => {
    if (info.file.status === 'done') {
      const { planInfoID } = this.props.planBasicInfo;
      this.props.dispatch({
        type: 'planManagement/getOrgAnnex',
        payload: { planInfoID },
      });
    }
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
          <span>
            <a href="javascript:;" onClick={() => { this.updatePlanInfo(record); }}>修改</a>
          </span >
          // isEdit ? (
          //   <span>
          //     <a href="javascript:;" onClick={() => { this.updatePlanInfo(record); }}>修改</a>
          //   </span >
          // ) : null
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
        width: 200,
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
        title: '排列顺序',
        dataIndex: 'executeIndex',
        width: 100,
        key: 'executeIndex',
      }, {
        title: '注意事项',
        dataIndex: 'attention',
        key: 'attention',
      }, {
        title: isEdit ? '操作' : '',
        width: 200,
        fixed: 'right',
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
        title: isEdit ? '操作' : '',
        width: '20%',
        key: 'action',
        render: (text, record) => (
          isEdit ? (
            <span>
              <a
                href={`/upload/${record.resArchiveInfo.savePath}`}
                download={record.resArchiveInfo.fileName}
              >下载
              </a><Divider type="vertical" />
              <a href="javascript:;" onClick={() => this.delete(record, 2)}>删除</a>
            </span>
          ) : null
        ),
      }];
    const data = [];
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
    const props = {
      action: `/emgc/system/baseOrgaArchiveInfo/addOrgArchive?orgID=${planBasicInfo.emgcOrgID}`,
      listType: 'picture ',
      accept: '.png, .jpg, .jpeg',
      onChange: this.orgFileChange,
      showUploadList: false,
    };
    return (
      <div className={styles.planInfo} >
        <Tabs tabPosition="left" onChange={this.tabChange}>
          <TabPane tab="基本信息" key="1">
            <Card title="基本信息" extra={this.props.planInfoId ? null : <Button onClick={this.openAddPlan}>新增基本信息</Button>}>
              <Table
                columns={columns}
                scorll={{ x: 1560 }}
                dataSource={Object.keys(planBasicInfo).length === 0 ? [] : [planBasicInfo]}
                rowKey={record => record.planInfoID}
              />
            </Card>
          </TabPane>
          <TabPane tab="应急组织" key="2" disabled={Object.keys(planBasicInfo).length === 0 || planBasicInfo.statu === 0}>
            <Card
              title="组织机构"
              extra={isEdit ? (
                <Upload {...props}>
                  <Button>
                    <Icon type="upload" /> 上传织机构图
                  </Button>
                </Upload>) : null}
              style={{}}
            >
              <div className={styles.cardExtra}>
                <Row gutter={16}>
                  {this.props.orgAnnexList.map((card, index) => {
                    return (
                      <Col sm={24} md={24} lg={12} key={index}>
                        <Card
                          title={card.resArchiveInfo.fileName}
                          style={{ marginBottom: 8 }}
                          extra={
                            <Popconfirm title="确认删除" onConfirm={() => this.deleteOrgAnnex(card)} okText="确定" cancelText="取消">
                              <a href="#">
                                <Icon title="删除" type="close" />
                              </a>
                            </Popconfirm>
                              }
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
          <TabPane tab="事件特征" key="3" disabled={Object.keys(planBasicInfo).length === 0 || planBasicInfo.statu === 0}>
            <Card title="事件特征" extra={<Button onClick={this.openAddFeatureModel} >新增特征</Button>}>
              <Table rowKey="panRedirectFeatureID" columns={featureCols} dataSource={eventFeatures} scroll={{ x: 1200, y: 270 }} />
            </Card>
          </TabPane>
          <TabPane tab="应急流程" key="4" disabled={Object.keys(planBasicInfo).length === 0 || planBasicInfo.statu === 0}>
            <Card title="应急流程" extra={isEdit ? <Button onClick={this.openEmgcProcessModel}>新增应急流程</Button> : null} style={{}}>
              <div className={styles.cardExtra}>
                <Row gutter={16}>
                  {this.props.emgcAnnex.map((card, index) => {
                    return (
                      <Col span={24} key={index}>
                        <Card
                          title={card.resArchiveInfo.fileName}
                          style={{ marginBottom: 8 }}
                          extra={<a href="#" onClick={() => this.delete(card, 4)}><Icon title="删除" type="close" /></a>}
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
          <TabPane tab="预案指令" key="5" disabled={Object.keys(planBasicInfo).length === 0 || planBasicInfo.statu === 0}>
            <Card title="预案指令" extra={isEdit ? <Button onClick={this.openAddCommandModel}>新增指令</Button> : null} style={{}}>
              <Table
                rowKey="commandID"
                columns={commandCols}
                dataSource={planCommand}
                scroll={{ x: 1100, y: 270 }}
              />
            </Card>
          </TabPane>
          <TabPane tab="应急资源" key="6" disabled={Object.keys(planBasicInfo).length === 0 || planBasicInfo.statu === 0}>
            <div className={styles.emgcResource}>
              <Card title={emgcTitle} extra={isEdit ? <Button onClick={this.openAddResourceModel}>新增资源</Button> : null} style={{}}>
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
          <TabPane tab="预案附件" key="7" disabled={Object.keys(planBasicInfo).length === 0 || planBasicInfo.statu === 0}>
            <Card title="预案附件" extra={isEdit ? <Button onClick={this.openAddAnnexModel}>新增附件</Button> : null} style={{}}>
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
          <TabPane tab="预案处置卡" key="8" disabled={Object.keys(planBasicInfo).length === 0 || planBasicInfo.statu === 0}>
            <Card title="处置卡信息" extra={isEdit ? <Button onClick={this.openDealCardModel}>新增处置卡</Button> : null} style={{}}>
              <div className={styles.cardExtra}>
                <Row gutter={16}>
                  {this.props.dealCardList.map((card, index) => {
                    return (
                      <Col sm={24} md={24} lg={12} key={index}>
                        <Card
                          title={card.resArchiveInfo.fileName}
                          style={{ marginBottom: 8 }}
                          extra={
                            <Popconfirm title="确认删除" onConfirm={() => this.delete(card, 3)} okText="确定" cancelText="取消">
                              <a href="#">
                                <Icon title="删除" type="close" />
                              </a>
                            </Popconfirm>
                              }
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
        {
          isEdit ? (
            <div>
              {
                hideFooter ? null : <Footer save={this.savePlan} cancel={this.clearPlan} />
              }
              {/* // 个人基本信息 */}
              <AddPlan
                handleCancel={this.handleCancelPlan}
                add={this.addSavePlan}
                visible={this.state.planVisible}
                isAdd={isAdd}
                onPlanCodeToggle={this.onPlanCodeToggle}
              />
              {/* // 特征 */}
              <AddFeature
                handleCancel={this.handleCancelFeature}
                add={this.addFeature}
                visible={this.state.featureVisible}
                eventFeature={eventFeature}
                isAdd={isAdd}
              />
              {/* 指令 */}
              <AddCommand
                handleCancel={this.handleCancelCommand}
                add={this.addCommand}
                commandInfo={planCommandInfo}
                visible={this.state.commandVisible}
                isAdd={isAdd}
              />
              {/* 资源 */}
              <AddResource
                handleCancel={this.handleCancelResource}
                add={this.addResource}
                resourceInfo={resourceInfo}
                visible={this.state.resourceVisible}
                isAdd={isAdd}
              />
              {/*  uploadType:1 为组织、2为附件、3为处置卡 4.应急流程 */}
              <AddAnnex
                handleCancel={this.handleCancelAnnex}
                add={this.addAnnex}
                visible={this.state.annexVisible}
                uploadType={this.state.uploadType}
                isAdd={isAdd}
              />
            </div>
          ) : null
        }
      </div >
    );
  }
}
