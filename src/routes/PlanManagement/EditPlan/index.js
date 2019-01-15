import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import PlanInfo from './PlanInfo/index';
import styles from './index.less';

@connect(({ emergency, planManagement }) => ({
  planLevelList: emergency.planLevelList,
  emgcOrgList: emergency.emgcOrgList,
  eventID: emergency.eventId,
  eventInfo: emergency.eventInfo,
  eventLevel: emergency.eventLevel,
  emgcOrgID: emergency.emgcOrgID,
  current: emergency.current,
  viewNode: emergency.viewNode,
  planLevelData: planManagement.planLevelData,
}))
export default class EditPlan extends PureComponent {
  componentDidMount() {
    const { eventID, dispatch } = this.props;
    dispatch({
      type: 'emergency/getEventInfo',
      payload: { eventID },
    }).then(() => {
      dispatch({
        type: 'emergency/saveEventLevel',
        payload: this.props.eventInfo.eventLevel,
      });
    });
  }
  onLevelChange = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergency/getOrgListByLevel',
      payload: { emgcLevel: value },
    }).then(() => {
      dispatch({
        type: 'emergency/saveEventLevel',
        payload: value,
      });
    });
  };
  render() {
    const { hideFooter, planInfoId } = this.props;
    return (
      <div className={styles.extra}>
        <Card bordered={false}>
          <PlanInfo
            isEdit={this.props.viewNode === this.props.current}
            hideFooter={hideFooter}
            planInfoId={planInfoId}
            handleModalVisible={this.props.handleModalVisible}
          />
        </Card>
      </div>
    );
  }
}
