import React, { PureComponent } from 'react';
import { Select, Table, Tabs, Card, Divider, Button, Row, Col, Popconfirm, Checkbox, Icon } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

import AddPlan from './AddPlan/AddPlan';
import AddFeature from './AddFeature/index';
import AddCommand from './AddCommand/index';
import AddResource from './AddResource/index';
import AddAnnex from './AddAnnex/index';

import Footer from './Footer/index';
import styles from './index.less';
import { commandType } from '../../../../../../utils/utils';

const Option = Select.Option;
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

@connect(({ planManagement }) => ({
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
    const { planInfoID } = this.props;
    this.props.dispatch({
      type: 'planManagement/getPlanInfo',
      payload: {
        id: planInfoID,
      },
    });
    this.props.dispatch({
      type: 'planManagement/getEventFeatures',
      payload: {
        planInfoID,
      },
    });
    this.props.dispatch({
      type: 'planManagement/getResourceContent',
      payload: {
        planInfoID,
      },
    });
    // 获取预案指令
    this.props.dispatch({
      type: 'planManagement/getPlanCommand',
      payload: {
        planInfoID,
      },
    });
    // 获取预案应急资源
    this.props.dispatch({
      type: 'planManagement/getPlanResource',
      payload: {
        planInfoID,
      },
    });
    // 通过预案ID 获取附件列表
    const { pageNum, pageSize } = this.props.annexPage;
    this.props.dispatch({
      type: 'planManagement/getAnnexPage',
      payload: { planInfoID, uploadType: 2, pageNum, pageSize, isQuery: true, fuzzy: false },
    });
    // 通过预案ID 获取处置卡列表 uploadType:1 为组织、2为附件、3为处置卡 4.应急流程
    this.props.dispatch({
      type: 'planManagement/getDealCard',
      payload: { planInfoID, uploadType: 3 },
    });
    // 获取组织结构
    this.props.dispatch({
      type: 'planManagement/getOrgAnnex',
      payload: { planInfoID, uploadType: 1 },
    });
    // 获取应急流程
    this.props.dispatch({
      type: 'planManagement/getEmgcProcess',
      payload: { planInfoID, uploadType: 4 },
    });
  }
  // 新增预案基本信息
  openAddPlan = () => {
    // 打开事件特征的新增弹窗 11
    this.setState({
      planVisible: true,
      isAdd: true,
    });
  }
  onPlanCodeToggle = (toggle) => {
    this.setState({
      codeToggle: !!toggle,
    });
  }
  // 保存预案基本信息
  addSavePlan = (form) => {
    form.validateFields((err, fieldsValue) => {
      if (!err && this.state.codeToggle) {
        if (!fieldsValue.planInfoID) {
          delete fieldsValue.planInfoID;
        }
        const { isAdd } = this.state;
        let type = null;
        if (isAdd) {
          // 保存add预案个人基本信息
          type = 'planManagement/addPlanInfo';
        } else {
          // 保存update预案个人基本信息
          type = 'planManagement/updatePlanInfo';
        }
        this.props.dispatch({
          type,
          payload: fieldsValue,
        }).then(() => {
          this.setState({
            planVisible: false,
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
  };
  // 关闭预案基本信息
  handleCancelPlan = () => {
    this.setState({
      planVisible: false,
    });
  };
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
        planInfoID: this.props.planInfoId,
      };

      getData.weight = fieldsValue.weight;
      getData.drectFeature = fieldsValue.drectFeature;
      getData.featureValue = fieldsValue.featureValue;
      getData.featureExpresstion = fieldsValue.featureExpresstion;
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
        dispatch({
          type: 'planManagement/addFeaturePlan',
          payload: getData,
        });
      } else {
        getData.panRedirectFeatureID = this.state.panRedirectFeatureID;
        dispatch({
          type: 'planManagement/updateFeaturePlan',
          payload: getData,
        });
      }

      this.setState({
        featureVisible: false,
      });
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
        this.props.dispatch({
          type: 'planManagement/getPlanResource',
          payload: { planInfoID },
        });
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
    });
    this.setState({
      featureVisible: true,
      isAdd: false,
      panRedirectFeatureID: id,
      featureID: record.planFeatureInfo.featureID,
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
    // this.props.dispatch({
    //   type: 'emergency/deleteResourceInfo',
    //   payload: { id },
    // }).then(() => {
    //   const { eventID } = this.props;
    //   this.props.dispatch({
    //     type: 'emergency/getEmgcResourceByEventID',
    //     payload: { eventID },
    //   });
    // });
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
    // 清空实施方案
    // dispatch({
    //   type: 'emergency/clearPlan',
    //   payload: { eventID },
    // }).then(() => {
    //   // 根据eventID获取预案基本信息
    //   this.props.dispatch({
    //     type: 'emergency/getPlanBaseInfo',
    //     payload: { eventID },
    //   });
    //   // 通过eventID获取预案指令
    //   this.props.dispatch({
    //     type: 'emergency/getEmgcCommandByEventID',
    //     payload: { eventID },
    //   });
    //   // 通过eventID获取应急资源
    //   this.props.dispatch({
    //     type: 'emergency/getEmgcResourceByEventID',
    //     payload: { eventID },
    //   });
    //   // 通过eventID获取事件特征
    //   this.props.dispatch({
    //     type: 'emergency/getEmgcFeatureByEventID',
    //     payload: { eventID },
    //   });
    // });
  }
  // 删除附件
  delete = (record, uploadType) => {
    // uploadType:1 为组织、2为附件、3为处置卡
    this.props.dispatch({
      type: 'planManagement/deleteAnnex',
      payload: { id: record.emgcPlanArchiveID },
    }).then(() => {
      const { pageNum, pageSize } = this.props.annexPage;
      switch (uploadType) {
        case 1:
          this.props.dispatch({
            type: 'planManagement/getOrgAnnex',
            payload: { planInfoID: record.planInfoID, uploadType: 1 },
          });
          break;
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
      payload: { planInfoID: planBasicInfo.planInfoID, pageNum, pageSize },
    });
  };
  render() {
    const { isEdit, planResource, planCommand,
      eventFeature, planCommandInfo, resourceInfo, hideFooter,
    } = this.props;
    // 新加参数
    const { planBasicInfo, eventFeatures, resourceContent } = this.props.planManagement;
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
        width: '10%',
      }, {
        title: '预案等级',
        dataIndex: 'levelName',
        width: 100,
        key: 'levelName',
        render: (text, record) => {
          return record.planPlanLevel.levelName;
        },
      },
      {
        title: '编制部门',
        dataIndex: 'orgID',
        width: '12%',
      },
      {
        title: '版本',
        dataIndex: 'version',
        width: '10%',
      },
      {
        title: '状态',
        dataIndex: 'statu',
        width: '12%',
        render: (text) => {
          switch (text) {
            case 0: return '启用';
            case 1: return '停用';
            case 2: return '发布';
            case 3: return '草稿';
            default: return '';
          }
        },
      },
      {
        title: '发布时间',
        dataIndex: 'releaseTime',
        sorter: true,
        width: '12%',
        render: (val) => {
          if (!val) {
            return '';
          }
          return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: isEdit ? '操作' : '',
        width: '12%',
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
        title: '特征编号',
        dataIndex: 'featureCode',
        width: 100,
        key: 'featureCode',
        render: (text, record) => {
          if (!record.planFeatureInfo) {
            return 'null';
          }
          return record.planFeatureInfo.featureCode;
        },
      }, {
        title: '特征类型',
        dataIndex: 'featureTypeName',
        width: 100,
        key: 'featureTypeName',
      }, {
        title: '特征名称',
        dataIndex: 'eventFeature',
        width: 120,
        key: 'eventFeature',
      }, {
        title: '规则',
        dataIndex: 'rule',
        width: 80,
        key: 'rule',
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
            return 'null';
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
            return 'null';
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
          text.forEach((item) => {
            if (item) {
              str = `${str}${item.postionName}, `;
            }
          });
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
    return (
      <div className={styles.planInfo} >
        <Tabs tabPosition="left">
          <TabPane tab="基本信息" key="1">
            <Card title="基本信息">
              <Table columns={columns} dataSource={Object.keys(planBasicInfo).length === 0 ? [] : [planBasicInfo]} scroll={{ x: 1200, y: 270 }} />
            </Card>
          </TabPane>
          <TabPane tab="应急组织" key="2">
            <Card title="组织机构">
              <div className={styles.cardExtra}>
                <Row gutter={16}>
                  {this.props.orgAnnexList.map((card, index) => {
                    return (
                      <Col span={8}>
                        <Card
                          title={card.resArchiveInfo.fileName}
                          style={{ marginBottom: 8 }}
                        >
                          <div className={styles.pictureList}>
                            <img
                              className={styles.picture}
                              alt="加载失败"
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
              <Table columns={featureCols} dataSource={eventFeatures} scroll={{ x: 1200, y: 270 }} />
            </Card>
          </TabPane>
          <TabPane tab="应急流程" key="4">
            <Card title="应急流程">
              <div className={styles.cardExtra}>
                <Row gutter={16}>
                  {this.props.emgcAnnex.map((card, index) => {
                    return (
                      <Col span={24}>
                        <Card
                          title={card.resArchiveInfo.fileName}
                          style={{ marginBottom: 8 }}
                        >
                          <div className={styles.pictureList}>
                            <img
                              className={styles.picture}
                              alt="加载失败"
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
              <Table columns={commandCols} dataSource={planCommand} scroll={{ x: 1200, y: 270 }} />
            </Card>
          </TabPane>
          <TabPane tab="应急资源" key="6" disabled={Object.keys(planBasicInfo).length === 0}>
            <Card title="应急资源">
              <Table columns={resourceCols} dataSource={planResource} scroll={{ x: 1200, y: 270 }} />
            </Card>
          </TabPane>
          <TabPane tab="预案附件" key="7" disabled={Object.keys(planBasicInfo).length === 0}>
            <Card title="预案附件">
              <Table
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
                      <Col span={8}>
                        <Card
                          title={card.resArchiveInfo.fileName}
                          style={{ marginBottom: 8 }}
                        >
                          <div className={styles.pictureList}>
                            <img
                              className={styles.picture}
                              alt="加载失败"
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
              {/*  uploadType:1 为组织、2为附件、3为处置卡 */}
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
