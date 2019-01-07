import React, { PureComponent } from 'react';
import { Select, Card, Row, Col } from 'antd';
import { connect } from 'dva';
import PlanInfo from './PlanInfo/index';
import styles from './index.less';

const { Option } = Select;
@connect(({ emergency }) => ({
  planLevelList: emergency.planLevelList,
  emgcOrgList: emergency.emgcOrgList,
  eventID: emergency.eventId,
  eventInfo: emergency.eventInfo,
  eventLevel: emergency.eventLevel,
  emgcOrgID: emergency.emgcOrgID,
  current: emergency.current,
  viewNode: emergency.viewNode,
  planAnnexPage: emergency.planAnnexPage,
  annexPage: emergency.annexPage,
  eventExecPlanID: emergency.eventExecPlanID,
  executeList: emergency.executeList,
}))
export default class EditPlan extends PureComponent {
  componentDidMount() {
    const { eventID } = this.props;
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
  // 实时方案改变时请求不同的方案信息
  onPlanChange = (value) => {
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
  // 获取方案基本信息
  getPlanBaseInfo = (eventExecPlanID, planID) => {
    const { eventID, dispatch } = this.props;
    // 获取预案基本信息
    dispatch({
      type: 'emergency/getPlanInfo',
      payload: { id: planID },
    });
    // 指令信息
    dispatch({
      type: 'emergency/getEmgcCommandByEventID',
      payload: { eventID, eventExecPlanID },
    });
    // 应急资源信息
    dispatch({
      type: 'emergency/getEmgcResourceByEventID',
      payload: { eventID, eventExecPlanID },
    });
    // 通过预案ID 获取处置卡列表 uploadType:1 为组织、2为附件、3为处置卡 4.应急流程
    this.props.dispatch({
      type: 'emergency/getOrgAnnex',
      payload: { planInfoID: planID, uploadType: 1 },
    });
    this.props.dispatch({
      type: 'emergency/getDealCard',
      payload: { planInfoID: planID, uploadType: 3 },
    });
    this.props.dispatch({
      type: 'emergency/getEmgcProcess',
      payload: { planInfoID: planID, uploadType: 4 },
    });
    //  获取附件列表
    this.annexPage(this.props.planAnnexPage.pageNum, this.props.planAnnexPage.pageSize, planID);
  };
  // 获取附件列表
  annexPage = (pageNum, pageSize, planInfoID) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergency/getPlanAnnexPage',
      payload: { pageNum, pageSize, planInfoID, uploadType: 2, isQuery: true, fuzzy: false },
    });
  };
  render() {
    const { hideFooter } = this.props;
    const extra = (
      <div>
        <span className={styles.labelStyle}>子方案</span>
        <Select
          placeholder="请选择"
          value={`${this.props.eventExecPlanID}`}
          style={{ width: 400 }}
          onChange={this.onPlanChange}
          dropdownMatchSelectWidth={false}
        >
          {this.props.executeList.map(item => (
            <Option
              key={item.eventExecPlanID}
              value={`${item.eventExecPlanID}`}
            >{item.planName}
            </Option>
))}
        </Select>
      </div>
    );
    return (
      <div className={styles.extra}>
        <Card extra={extra}>
          <PlanInfo isEdit hideFooter={hideFooter} />
        </Card>
      </div>
    );
  }
}
