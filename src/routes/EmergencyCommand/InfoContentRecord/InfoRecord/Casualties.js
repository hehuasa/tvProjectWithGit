import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Col, Input, Icon } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './InfoRecord.less';

import AddTemplate from '../../AlarmDeal/AddTemplate';

@connect(({ emergency, user }) => ({
  emergency,
  current: emergency.current,
  eventID: emergency.eventId,
  viewNode: emergency.viewNode,
  userId: user.currentUser.baseUserInfo.userID,
}))
@Form.create()
export default class Casualties extends PureComponent {
  onSend = () => {
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const personData = {
        eventID: this.props.emergency.eventId,
        userID: this.props.userId,
        list: [],
      };
      for (let i = 0; i < fieldsValue.location.length; i += 1) {
        if (fieldsValue.ID[i] === null) {
          if (fieldsValue.location[i] == null && fieldsValue.injured[i] == null && fieldsValue.deaths[i] == null) {
            break;
          }
          if (fieldsValue.injured[i] == null) {
            fieldsValue.injured[i] = 0;
          }
          if (fieldsValue.deaths[i] == null) {
            fieldsValue.deaths[i] = 0;
          }

          if (fieldsValue.recordTime[i]) {
            fieldsValue.recordTime[i] = fieldsValue.recordTime[i]._d.getTime();
          } else {
            fieldsValue.recordTime[i] = '';
          }
          personData.list.push({
            position: fieldsValue.location[i],
            injured: fieldsValue.injured[i],
            death: fieldsValue.deaths[i],
            reportUserId: fieldsValue.reportUserId[i],
            reportUserName: fieldsValue.reportUserName[i],
            recordTime: fieldsValue.recordTime[i],
          });
        }
      }
      if (personData.list.length !== 0) {
        this.props.dispatch({
          type: 'emergency/saveCasualties',
          payload: {
            personData: JSON.stringify(personData),
            eventID: this.props.emergency.eventId,
          },
        }).then(() => {
          // 更新面板的事件信息
          this.props.dispatch({
            type: 'emergency/queryEventFeatures',
            payload: {
              eventID: this.props.eventID,
            },
          });
        });
      }
    });
  }

  render() {
    const { form, emergency } = this.props;
    return (
      <Scrollbars>
        <div className={styles.eventContent}>
          <AddTemplate isHidden casualtiesData={emergency.casualties} isDisabled form={form} />
          <Row >
            <Col span={6} push={9}>
              <Button
                onClick={this.onSend}
                type="primary"
                disabled={this.props.current !== this.props.viewNode}
                style={{  margin: '8px 0 24px 0' }}
              >提交
              </Button>
            </Col>
          </Row>
        </div>
      </Scrollbars>
    );
  }
}
