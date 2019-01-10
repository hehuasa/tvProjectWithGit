import React, { PureComponent } from 'react';
import { Form, Tabs, Button, Popconfirm, Modal, Card, Select } from 'antd';
import { connect } from 'dva';
import PlanInfo from '../InfoJudgment/EditPlan/PlanInfo/index';
import CommandList from '../EmergencyStart/CommandList/index';
import SearchOrgUser from '../EmergencyStart/SearchOrgUser/index';
import InfoRecord from '../InfoContentRecord/InfoRecord/InfoRecord';
import ExpandEmergency from './ExpandEmergency/index';
import styles from './index.less';

const { TabPane } = Tabs;
const { confirm } = Modal;
const { Option } = Select;
@connect(({ emergency, user }) => ({
  commandList: emergency.commandList,
  currentUser: user.currentUser,
  eventID: emergency.eventId,
  commandModel: emergency.commandModel,
  viewNode: emergency.viewNode,
  current: emergency.current,
  expandCurrent: emergency.expandCurrent,
  disposalActiveKey: emergency.disposalActiveKey,
  executeList: emergency.executeList,
  annexPage: emergency.annexPage,
  eventExecPlanID: emergency.eventExecPlanID,
  processFuncMenus: emergency.processFuncMenus,
}))
@Form.create()
export default class EmergencyDisposal extends PureComponent {
  state = {
    processFuncMenus: [],
  };
  componentDidMount() {
    const { dispatch, eventID } = this.props;
    this.initFuncMenus();
    dispatch({
      type: 'emergency/saveIsInsert',
      payload: false,
    });
    // 获取所有方案列表
    dispatch({
      type: 'emergency/getExecuteList',
      payload: { eventID },
    }).then(() => {
      const { executeList } = this.props;
      if (executeList.length && executeList.length > 0) {
        const value = this.props.executeList[0].eventExecPlanID;
        // 保存选择的执行方案
        this.props.dispatch({
          type: 'emergency/saveEventExecPlanID',
          payload: value,
        });
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
          payload: { eventID, uploadType: 1, eventExecPlanID: value },
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
      }
    });
  }
  confirm = () => {
    const { eventID, dispatch, currentUser } = this.props;
    const { userID } = currentUser.baseUserInfo;
    const eventStatu = 6;
    dispatch({
      type: 'emergency/updateProcessNode',
      payload: { eventID, eventStatu, userID },
    }).then(() => {
      dispatch({
        type: 'emergency/saveCurrent',
        payload: eventStatu,
      });
      dispatch({
        type: 'emergency/saveViewNode',
        payload: eventStatu,
      });
    });
  };
  // 页签切换函数
  tabChange = (activeKey) => {
    const { dispatch, eventID } = this.props;
    if (activeKey === '5') {
      //   请求预案等级列表
      dispatch({
        type: 'emergency/getPlanLevelList',
        payload: { eventID },
      });
      dispatch({
        type: 'emergency/selectExpandState',
        payload: { eventID },
      }).then(() => {
        if (this.props.expandCurrent >= 3 && this.props.expandCurrent <= 6) {
          // this.setState({
          //   activeKey,
          // });
          // 改变当前激活页签
          dispatch({
            type: 'emergency/saveDisposalActiveKey',
            payload: activeKey,
          });
          // 扩大应急所处的状态
          dispatch({
            type: 'emergency/saveExpandCurrent',
            payload: this.props.expandCurrent,
          });
        } else {
          this.expandConfirm(activeKey, this);
        }
      });
    } else {
      dispatch({
        type: 'emergency/saveDisposalActiveKey',
        payload: activeKey,
      });
    }
  };
  expandConfirm = (activeKey, that) => {
    confirm({
      title: '确定需要扩大应急 ?',
      content: '请求支援,扩大应急',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        // 如果扩大应急已经发布 则再次扩大进入第一个流程
        const { dispatch, expandCurrent } = that.props;
        dispatch({
          type: 'emergency/saveExpandCurrent',
          payload: 3,
        });
        dispatch({
          type: 'emergency/saveDisposalActiveKey',
          payload: activeKey,
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  // 选择方案
  onExecuteChange = (value) => {
    const { eventID } = this.props;
    // 保存选择的执行方案
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
      payload: { eventID, uploadType: 1, eventExecPlanID: value },
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
  };
  // 判断是否有该功能权限
  judgeFunction = (functionName) => {
    const { processFuncMenus } = this.state;
    const arr = processFuncMenus.filter(item => item.functionName === functionName);
    return arr.length > 0;
  };
  // 将数据存在state
  initFuncMenus = () => {
    const { processFuncMenus } = this.props;
    this.setState({
      processFuncMenus,
    });
  };
  render() {
    const text = '是否跳转到应急终止流程 ? ';
    const { current, viewNode } = this.props;
    const tabBarExtraContent = (
      <div className={styles.extraBtn}>
        <Popconfirm placement="bottomRight" title={text} onConfirm={this.confirm} okText="确认" cancelText="取消">
          <Button disabled={viewNode < current}>应急终止</Button>
        </Popconfirm>
      </div>
    );
    const extra = (
      <div>
        <span style={{ marginRight: 16 }}>方案选择</span>
        <Select
          style={{ width: 180 }}
          value={this.props.eventExecPlanID}
          onChange={this.onExecuteChange}
        >
          {this.props.executeList.map(item => (
            <Option
              key={item.eventExecPlanID}
              value={item.eventExecPlanID}
            >{item.planName}
            </Option>
          ))}
        </Select>
      </div>
    );
    return (
      <Tabs
        tabBarExtraContent={current !== -1 && this.judgeFunction('应急终止权限') ? tabBarExtraContent : null}
        className={styles.infoJudgment}
        onChange={this.tabChange}
        activeKey={this.props.disposalActiveKey}
      >
        <TabPane tab="事件信息记录" key="1">
          <InfoRecord />
        </TabPane>
        <TabPane tab="应急处置" key="2">
          <CommandList />
        </TabPane>
        <TabPane tab="组织机构人员" key="3">
          <SearchOrgUser />
        </TabPane>
        <TabPane tab="查看实施方案" key="4">
          <div className={styles.planExtra}>
            <div className={styles.planExtraHea}>

            <div className={styles.planExtraCon}>
              <span style={{ marginRight: 16 }}>方案选择</span>
              <Select
                style={{ width: 220 }}
                value={this.props.eventExecPlanID}
                onChange={this.onExecuteChange}
              >
                {this.props.executeList.map(item => (
                  <Option
                    key={item.eventExecPlanID}
                    value={item.eventExecPlanID}
                  >{item.planName}
                  </Option>
                ))}
              </Select>
            </div>
            </div>

            <PlanInfo onRef={() => { }} />
          </div>
        </TabPane>
        <TabPane tab="扩大应急" key="5" disabled={current === -1 || viewNode < current || !this.judgeFunction('应急处理权限')}>
          <ExpandEmergency />
        </TabPane>
      </Tabs>
    );
  }
}

{/* <Card bordered={false} extra={extra}>
</Card> */}