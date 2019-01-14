import React, { PureComponent } from 'react';
import { Form, Tabs, Button, Steps, Select } from 'antd';
import { connect } from 'dva';
import rightCicle from '../../../../assets/emergency/right-cicle.png';
import rightCicleActive from '../../../../assets/emergency/right-cicle-active.png';
import Expand from './Expand';
import SelectPlan from '../SelectPlan/index';
import EditPlan from '../EditPlan/index';
import styles from './index.less';

const { TabPane } = Tabs;
const { Step } = Steps;
@connect(({ emergency }) => ({
  eventID: emergency.eventId,
  expandCurrent: emergency.expandCurrent,
  executeList: emergency.executeList,
  annexPage: emergency.annexPage,
}))
@Form.create()
export default class ExpandEmergency extends PureComponent {
  componentDidMount() {
    // this.props.dispatch({
    //   type: 'emergency/saveDisposalActiveKey',
    //   payload: '2',
    // });
  }
  // 上一步
  previous = () => {
    const { dispatch, expandCurrent } = this.props;
    this.updateState(expandCurrent - 1);
    dispatch({
      type: 'emergency/saveExpandCurrent',
      payload: expandCurrent - 1,
    });
  };
  // 下一步
  next = () => {
    const { dispatch, expandCurrent } = this.props;
    this.updateState(expandCurrent + 1);
    dispatch({
      type: 'emergency/saveExpandCurrent',
      payload: expandCurrent + 1,
    });
  };
  // 修改扩大应急状态
  updateState = (expandCurrent) => {
    const { dispatch, eventID } = this.props;
    dispatch({
      type: 'emergency/updateExpandState',
      payload: { planState: expandCurrent, eventID },
    });
  };
  publish = () => {
    const { eventID } = this.props;
    // 修改扩大状态
    this.updateState(1);
    //  显示指令
    this.props.dispatch({
      type: 'emergency/saveDisposalActiveKey',
      payload: '2',
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
      }
    });
  };
  clearPlan = () => {
    const { eventID, dispatch } = this.props;
    dispatch({
      type: 'emergency/clearPlan',
      payload: { eventID },
    }).then(() => {
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
        }
      });
    });
  };
  render() {
    const { expandCurrent } = this.props;
    return (
      <div>
        <div className={styles.steps}>
          <div className={styles.stepContent}>
            <Steps size="small">
              <Step status={this.props.expandCurrent === 3 ? 'process' : (expandCurrent > 3 ? 'finish' : 'wait')} title="扩大应急" />
              <Step status={this.props.expandCurrent === 4 ? 'process' : (expandCurrent > 4 ? 'finish' : 'wait')} title="预案选择" />
              <Step status={this.props.expandCurrent === 5 ? 'process' : (expandCurrent > 5 ? 'finish' : 'wait')} title="编辑方案" />
              <Step status={this.props.expandCurrent === 6 ? 'process' : (expandCurrent > 6 ? 'finish' : 'wait')} title="发布" />
            </Steps>
          </div>
        </div>
        <div>
          {expandCurrent === 3 ? <Expand /> : null}
          {expandCurrent === 4 ? <SelectPlan /> : null}
          {expandCurrent === 5 ? <EditPlan hideFooter /> : null}
          {expandCurrent === 6 ? <div className={styles.release}>是否要发布 ? </div> : null}
        </div>
        <div className={styles.stepFooter}>
          {expandCurrent > 3 ? <Button onClick={this.previous}>上一步</Button> : null }
          {expandCurrent < 6 ? <Button onClick={this.next}>下一步</Button> :
            (expandCurrent === 6 ? <Button onClick={this.publish}>发布</Button> : null)}
          {expandCurrent === 5 ? <Button onClick={this.clearPlan}>清空实施方案</Button> : null }
        </div>
      </div>

    );
  }
}
