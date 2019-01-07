import React, { PureComponent } from 'react';
import { Form, Tabs, Button, Popconfirm, Select, Card } from 'antd';
import { connect } from 'dva';
import PlanInfo from '../InfoJudgment/EditPlan/PlanInfo/index';
import CommandList from './CommandList/index';
import SearchOrgUser from './SearchOrgUser/index';
import InfoRecord from '../InfoContentRecord/InfoRecord/InfoRecord';
import styles from './index.less';

const { TabPane } = Tabs;
const { Option } = Select;
@connect(({ emergency, user }) => ({
  commandList: emergency.commandList,
  eventID: emergency.eventId,
  commandModel: emergency.commandModel,
  viewNode: emergency.viewNode,
  current: emergency.current,
  executeList: emergency.executeList,
  annexPage: emergency.annexPage,
  eventExecPlanID: emergency.eventExecPlanID,
  currentUser: user.currentUser,
  processFuncMenus: emergency.processFuncMenus,
}))
@Form.create()
export default class EmergencyStart extends PureComponent {
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
  // 进入应急处置
  confirm = () => {
    const { eventID, dispatch, currentUser } = this.props;
    const { userID } = currentUser.baseUserInfo;
    const eventStatu = 5;
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
    const text = '是否跳转到应急处置流程 ? ';
    const { current, viewNode } = this.props;
    const tabBarExtraContent = (
      <div className={styles.extraBtn}>
        <Popconfirm placement="bottomRight" title={text} onConfirm={this.confirm} okText="确认" cancelText="取消">
          <Button disabled={viewNode < current}>应急处置</Button>
        </Popconfirm>
      </div>
    );
    const extra = (
      <div className={styles.selectPlan}>
        <span style={{ marginRight: 16 }}>方案选择</span>
        <Select
          style={{ width: 400 }}
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
        defaultActiveKey="2"
        tabBarExtraContent={this.judgeFunction('应急处理权限') ? tabBarExtraContent : null}
        className={styles.infoJudgment}
      >
        <TabPane tab="事件信息记录" key="1">
          <InfoRecord />
        </TabPane>
        <TabPane tab="应急指令" key="2">
          <CommandList />
        </TabPane>
        <TabPane tab="组织机构人员" key="3">
          <SearchOrgUser />
        </TabPane>
        <TabPane tab="查看实施方案" key="4">
          <div className={styles.planInfo}>
            <Card bordered={false} extra={extra}>
              <PlanInfo onRef={() => {}} />
            </Card>
          </div>
        </TabPane>
      </Tabs>
    );
  }
}
