import React, { PureComponent } from 'react';
import { Form, Tabs, Button, Popconfirm, Card, Icon, Row, Col, Checkbox } from 'antd';
import { connect } from 'dva';
import InfoRecord from '../InfoContentRecord/InfoRecord/InfoRecord';
import styles from './index.less';
import { getBrowserStyle } from '../../../utils/utils';
import Result from '../../../components/Result';
import { mapConstants } from '../../../services/mapConstant';
import { getBordStyle } from '../../../utils/mapService';
import { emgcIntervalInfo } from '../../../services/constantlyData';

const { TabPane } = Tabs;
@connect(({ emergency, user, tabs, video, homepage, global }) => ({
  commandList: emergency.commandList,
  eventID: emergency.eventId,
  tableId: emergency.tableId,
  commandModel: emergency.commandModel,
  finishConditionList: emergency.finishConditionList,
  checkedConditionList: emergency.checkedConditionList,
  processFuncMenus: emergency.processFuncMenus,
  current: emergency.current,
  currentUser: user.currentUser,
  global,
  tabs,
  video,
  videoFooterHeight: homepage.videoFooterHeight,
}))
@Form.create()
export default class EmergencyStop extends PureComponent {
  state = {
    disabled: true,
    processFuncMenus: [],
  };
  componentDidMount() {
    const { dispatch } = this.props;
    this.initFuncMenus();
    // 获取应急终止条件的list
    dispatch({
      type: 'emergency/getFinishConditionList',
    }).then(() => {
      // 获取应急终止已勾选条件的list
      this.getCheckedCondition();
      this.intervalID = setInterval(this.getCheckedCondition, emgcIntervalInfo.timeSpace);
      emgcIntervalInfo.intervalIDs.push(this.intervalID);
    });
  }
  componentWillUnmount() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
    }
  }
  // 获取已勾选的list
  getCheckedCondition = () => {
    this.props.dispatch({
      type: 'emergency/getCheckedConditionList',
      payload: { eventID: this.props.eventID },
    }).then(() => {
      // 是否勾选完
      this.setState({
        disabled: this.isAllConditionFinish(),
      });
    });
  };
  // 应急终止
  confirm = () => {
    const { eventID, dispatch, currentUser } = this.props;
    const { userID } = currentUser.baseUserInfo;
    const eventStatu = -1;
    dispatch({
      type: 'emergency/updateProcessNode',
      payload: { eventID, eventStatu, userID },
    }).then(() => {
      // 改变当前节点
      dispatch({
        type: 'emergency/saveCurrent',
        payload: eventStatu,
      });
      dispatch({
        type: 'emergency/saveViewNode',
        payload: eventStatu,
      });
      // 关闭也签
      this.handleEdit();
      //  清空事件的轮询
      emgcIntervalInfo.intervalIDs.forEach((item) => {
        clearInterval(item);
      });
    });
  };
  // 关闭tab页
  handleEdit = () => {
    const { dispatch, video, tableId } = this.props;
    dispatch({
      type: 'tabs/del',
      payload: { key: tableId },
    }).then(() => {
      const { winHeight } = getBrowserStyle();
      if (this.props.tabs.activeKey.indexOf('homePage') !== -1) {
        // 恢复看板
        dispatch({
          type: 'global/changeRightCollapsed',
          payload: false,
        }).then(() => {
          const { view, extent } = mapConstants;
          if (view.height) {
            view.goTo({ extent }).then(() => {
              getBordStyle(view).then((style) => {
                dispatch({
                  type: 'accessControl/queryStyle',
                  payload: style,
                });
              });
            });
          }
        });
        // 恢复视频区
        dispatch({
          type: 'video/reposition',
          payload: {
            CmdCode: '10002',
            Point:
              {
                x: video.position.x,
                y: winHeight - 112 - 30, // 误差为43
              },
          },
        });
        dispatch({
          type: 'video/relayout',
          payload: {
            CmdCode: '10003',
            Layout: 'Transverse',
            WindowCount: '4',
          },
        });
        dispatch({
          type: 'video/resize',
          payload: {
            CmdCode: '10001',
            Size:
              {
                Width: video.size.width,
                Height: '155',
              },
          },
        });
        dispatch({
          type: 'homepage/getVideoFooterHeight',
          payload: 0,
        });
        dispatch({
          type: 'homepage/getMapHeight',
          payload: { domType: 'map' },
        });
      }
    });
  };
  // 勾选取消勾选
  checkBoxChange = (e) => {
    const { dispatch, eventID, currentUser } = this.props;
    const { userID } = currentUser.baseUserInfo;
    if (e.target.checked) {
      dispatch({
        type: 'emergency/emgcFinishConditionCheck',
        payload: { emgcFinishConditionID: e.target.value, eventID, userID },
      }).then(() => {
        dispatch({
          type: 'emergency/getCheckedConditionList',
          payload: { eventID: this.props.eventID },
        }).then(() => {
          this.setState({
            disabled: this.isAllConditionFinish(),
          });
        });
      });
    } else {
      dispatch({
        type: 'emergency/emgcFinishConditionUnCheck',
        payload: { emgcFinishConditionID: e.target.value, eventID: this.props.eventID },
      }).then(() => {
        dispatch({
          type: 'emergency/getCheckedConditionList',
          payload: { eventID: this.props.eventID },
        }).then(() => {
          this.setState({
            disabled: this.isAllConditionFinish(),
          });
        });
      });
    }
  };
  // 判断是否所有条件已经完成
  isAllConditionFinish = () => {
    const { finishConditionList } = this.props;
    for (const item of finishConditionList) {
      if (!this.props.checkedConditionList.find(value => value === item.emgcFinishConditionID)) {
        return false;
      }
    }
    return true;
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
    const { finishConditionList, current } = this.props;
    const text = '是否终止应急 ? ';
    const tabBarExtraContent = (
      <div className={styles.extraBtn}>
        <Popconfirm placement="bottomRight" title={text} onConfirm={this.confirm} okText="确认" cancelText="取消">
          <Button disabled={!this.state.disabled}>应急终止</Button>
        </Popconfirm>
      </div>
    );
    const extra = (
      <Row>
        {
        finishConditionList.map((item, index) => {
        return (
          <Col span={index % 2 === 0 ? 14 : 10} key={item.emgcFinishConditionID}>
            <div className={styles.checkList}>
              <Checkbox
                checked={this.props.checkedConditionList.find(value => value === item.emgcFinishConditionID)}
                value={item.emgcFinishConditionID}
                disabled={current === -1}
                onChange={this.checkBoxChange}
              >
                {item.conditionContent}
              </Checkbox>
            </div>
          </Col>
        );
})}
      </Row>
    );
    return (
      <Tabs
        tabBarExtraContent={current !== -1 && this.judgeFunction('应急终止权限') ? tabBarExtraContent : null}
        className={styles.infoJudgment}
      >
        <TabPane tab="应急终止" key="1">
          <Card bordered={false}>
            { !this.state.disabled ?
              <div className={styles.error}><Icon type="close-circle" /></div> :
              <div className={styles.success}><Icon type="check-circle" /></div>
            }
            <Result
              title="下列条件同时满足时，由总指挥判断终止应急响应"
              description=""
              extra={extra}
              actions
              style={{ marginTop: 32, marginBottom: 24 }}
            />
          </Card>
        </TabPane>
        <TabPane tab="事件信息记录" key="2">
          <InfoRecord />
        </TabPane>
      </Tabs>
    );
  }
}

