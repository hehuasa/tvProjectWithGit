import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Row, Col, Input, Icon, message } from 'antd';
import { commonData } from '../../../../../mock/commonData';
import HandAlarmDeal from './HandAlarmDeal';
import AddTemplate from './AddTemplate';

import styles from './InfoContent.less';

const FormItem = Form.Item;

@connect(({ emergency, user }) => ({
  emergency,
  eventID: emergency.evenId,
  userID: user.currentUser.baseUserInfo.userID,
}))
@Form.create()
export default class InfoContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 展示特征 或 查询
      showFeature: true,
      // 搜索框值
      featureValue: '',
      // 选择的数据
      selectedRows: [],
      rowSelection: {
        type: 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
          this.setState({
            selectedRows,
          });
        },
      },
    };
  }
  componentDidMount() {
    this.props.onRef(this);
    // 查询所有信息接报
    // this.props.dispatch({
    //   type: 'emergency/queryInfoContent',
    // })
  }
  onDelFeature = (id) => {
    this.props.dispatch({
      type: 'emergency/delEventFeatures',
      payload: {
        id: id.target.dataset.type,
        eventID: this.props.emergency.eventId,
      },
    }).then(() => {
      message.success('删除成功');
    });
  };

  render() {
    const { form, emergency } = this.props;
    return (
      <div className={styles.infoContent}>
        <HandAlarmDeal form={form} />
        <div className={styles.alarmDeal}>
          <Row type="flex" >
            {
              emergency.eventFeaturesList.map((item) => {
                if (item.featureValue === 'true') {
                  item.featureValue = '是';
                }
                if (item.featureValue === 'false') {
                  item.featureValue = '否';
                }
 if (item.eventFeature !== '事发部门' && item.eventFeature !== '报警类型') {
                return (
                  <Col key={item.entEmgcRFID} md={12} sm={24}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      label={item.eventFeature}
                    >
                      {form.getFieldDecorator(`${item.entEmgcRFID}`, {
                        initialValue: item.featureValue || '',
                        rules: [
                          { required: true, message: '特征值不能为空' },
                        ],
                      })(
                        <Input
                          addonAfter={
                            !(emergency.current > emergency.viewNode) ? (
                              <Icon
                                type="close"
                                className={styles.cursor}
                                onClick={this.onDelFeature}
                                data-type={item.entEmgcRFID}
                              />
                            ) : false
                          }
                          placeholder="特征值"
                          disabled={!!(emergency.current > emergency.viewNode)}
                        />
                      )}
                    </FormItem>
                  </Col>
                );
              } else {
                return null;
              }
              })
            }
          </Row >
        </div>
        <div className={styles.addFooter}>
          <AddTemplate
            casualtiesData={emergency.casualties}
            form={form}
            isDisabled
            hiddenAddButton
            addDisable={this.props.emergency.current === this.props.emergency.viewNode}
            isHidden
          />
        </div>
      </div >
    );
  }
}
