import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Tabs, Button, Popconfirm, message, Card } from 'antd';

import InfoContent from './InfoContent/InfoContent';
import InfoRecord from './InfoRecord/InfoRecord';

import styles from '../InfoJudgment/index.less';

const { TabPane } = Tabs;

const DisposalResearch = ({ onConfirm, emergency, child, judgeFunction }) => {
  return (
    <div>
      <Button type="primary" style={{ marginRight: 16 }} onClick={() => child.onGenerateReport()}>1. 生成应急报告</Button>
      {judgeFunction('应急研判权限') ? (
        <Popconfirm placement="bottomRight" title="是否跳转到信息处置与研判流程？" onConfirm={onConfirm} okText="是" cancelText="否">
          <Button disabled={!emergency.eventPosition || emergency.current > emergency.viewNode} >2. 信息处置与研判</Button>
        </Popconfirm>
      ) : null}
    </div>
  );
};

@connect(({ emergency, user }) => ({
  currentUser: user.currentUser,
  emergency,
  current: emergency.current,
  processFuncMenus: emergency.processFuncMenus,
}))
export default class InfoContentRecord extends PureComponent {
  state = {
    processFuncMenus: [], // 页面功能权限
  };
  componentDidMount() {
    // 查询事件阶段
    this.props.dispatch({
      type: 'emergency/queryEventPosition',
      payload: this.props.emergency.eventId,
    });
    this.initFuncMenus();
  }
  // 进入下一流程
  onConfirm = () => {
    const { currentUser } = this.props;
    const { userID } = currentUser.baseUserInfo;
    this.props.dispatch({
      type: 'emergency/updateProcessNode',
      payload: {
        eventID: this.props.emergency.eventId,
        eventStatu: 2,
        userID,
      },
    }).then(() => {
      this.props.dispatch({
        type: 'emergency/saveCurrent',
        payload: 2,
      });
      this.props.dispatch({
        type: 'emergency/saveViewNode',
        payload: 2,
      });
    });
  };
  onRef = (ref) => {
    this.child = ref;
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
    const { current } = this.props;
    return (
        <Tabs
          className={styles.infoJudgment}
          defaultActiveKey="2"
          tabBarExtraContent={
            current !== -1 && current !== -2 ? (
              <DisposalResearch
                onConfirm={this.onConfirm}
                child={this.child}
                emergency={this.props.emergency}
                judgeFunction={this.judgeFunction}
              />) : null
          }
        >
          <TabPane tab="事件信息记录" key="1">
            <Card bordered={false}>
              <InfoRecord />
            </Card>
          </TabPane>
          <TabPane tab="信息接报" key="2">
            <Card bordered={false}>
              <InfoContent onRef={this.onRef} />
            </Card>
          </TabPane>
        </Tabs>
    );
  }
}

