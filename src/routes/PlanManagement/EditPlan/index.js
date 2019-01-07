import React, { PureComponent } from 'react';
import { Select, Table, Card, Row, Col } from 'antd';
import { connect } from 'dva';
import PlanInfo from './PlanInfo/index';
import styles from './index.less';

const Option = Select.Option;
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
      // dispatch({
      //   type: 'emergency/saveEmgcOrgID',
      //   payload: this.props.eventInfo.emgcOrgID,
      // });
      // // 根据当前实施方案的等级获取应急组织列表
      // dispatch({
      //   type: 'emergency/getOrgListByLevel',
      //   payload: { emgcLevel: this.props.eventInfo.eventLevel },
      // });
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
      // dispatch({
      //   type: 'emergency/saveEmgcOrgID',
      //   payload: '',
      // });
    });
  };
  // onOrgChange = (value) => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'emergency/saveEmgcOrgID',
  //     payload: value,
  //   });
  // };
  render() {
    const { planLevelList, viewNode, eventLevel, current, hideFooter,
      // 11
      planInfoId, planLevelData = [],
    } = this.props;
    const extra = (
      <Row>
        <Col span={24}>
          {/* <span style={{ marginRight: 16 }}>应急响应等级</span>
          <Select
            value={eventLevel}
            style={{ width: 150 }}
            onChange={this.onLevelChange}
          >
            <Option value="">请选择</Option>
            {planLevelData.map(item => (
              <Option
                key={item.emgcLevelID}
                value={item.emgcLevelID}
              >{item.levelName}
              </Option>
            ))}
          </Select> */}
        </Col>
      </Row>
    );
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
