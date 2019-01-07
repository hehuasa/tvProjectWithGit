import React, { PureComponent } from 'react';
import { Form, Tabs, Button, Popconfirm } from 'antd';
import { connect } from 'dva';
import CommandList from '../EmergencyStart/CommandList/index';
import SearchOrgUser from '../EmergencyStart/SearchOrgUser/index';
import InfoRecord from '../InfoContentRecord/InfoRecord/InfoRecord';
import styles from './index.less';

const { TabPane } = Tabs;
@connect(({ emergency, user }) => ({
  currentUser: user.currentUser,
  eventID: emergency.eventId,
  viewNode: emergency.viewNode,
  current: emergency.current,
  processFuncMenus: emergency.processFuncMenus,
}))
@Form.create()
export default class EarlyWarning extends PureComponent {
  state = {
    processFuncMenus: [], // 页面功能权限
  };
  componentDidMount() {
    const { dispatch } = this.props;
    this.initFuncMenus();
    dispatch({
      type: 'emergency/saveIsInsert',
      payload: false,
    });
  }
  // 进入应急处置
  intoEmergencyStart = () => {
    const { eventID, dispatch, currentUser } = this.props;
    const { userID } = currentUser.baseUserInfo;
    const eventStatu = 4;
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
  closeEvent = () => {
    const { eventID, dispatch, currentUser } = this.props;
    const { userID } = currentUser.baseUserInfo;
    const eventStatu = -2;
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
    const text = '是否跳转到事件关闭流程 ? ';
    const text1 = '是否跳转到应急响应流程 ? ';
    const { current, viewNode } = this.props;
    const tabBarExtraContent = (
      <div className={styles.extraBtn}>
        {this.judgeFunction('预警权限') ? (
          <Popconfirm placement="bottomRight" title={text} onConfirm={this.closeEvent} okText="确认" cancelText="取消">
            <Button disabled={viewNode < current}>事件关闭</Button>
          </Popconfirm>
        ) : null}
        {this.judgeFunction('应急启动权限') ? (
          <Popconfirm placement="bottomRight" title={text1} onConfirm={this.intoEmergencyStart} okText="确认" cancelText="取消">
            <Button disabled={viewNode < current}>应急启动</Button>
          </Popconfirm>
        ) : null}
      </div>
    );
    return (
      <Tabs
        defaultActiveKey="2"
        tabBarExtraContent={current !== -1 && current !== -2 ? tabBarExtraContent : null}
        className={styles.infoJudgment}
      >
        <TabPane tab="事件信息记录" key="1">
          <InfoRecord />
        </TabPane>
        <TabPane tab="预警指令" key="2">
          <CommandList />
        </TabPane>
        <TabPane tab="组织机构人员" key="3">
          <SearchOrgUser />
        </TabPane>
      </Tabs>
    );
  }
}
