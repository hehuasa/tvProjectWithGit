import React, { PureComponent } from 'react';
import { Form, Tabs, Row, Col, Input, Card, Radio, Button, Checkbox } from 'antd';
import { connect } from 'dva';
import AlarmInfo from './AlarmInfo/index';
import Footer from './Footer/index';
import styles from './index.less';
import { addEventIcon, delAlarmAnimation } from '../../../utils/mapService';
import { mapConstants } from '../../../services/mapConstant';

const { TabPane } = Tabs;
const { TextArea } = Input;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RealEvent = Form.create()((props) => {
  const { form, save, cancel, type } = props;
  return (
    <div>
      <Row type="flex">
        <Col md={16} sm={24}>
          <FormItem
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15 }}
            label="处警说明"
          >
            {form.getFieldDecorator('remark', {
              initialValue: '',
              rules: [],
            })(
              <TextArea rows={4} placeholder="请输入处警说明" />
            )}
          </FormItem>
        </Col>
      </Row>
      <Footer save={() => save(props.form, type)} cancel={cancel} />
    </div>
  );
});

@connect(({ alarmDeal, emergency, alarm, mapRelation }) => ({
  alarmInfo: alarmDeal.alarmInfo,
  alarmInfoConten: alarmDeal.alarmInfoConten,
  alarmDealTypeList: alarmDeal.alarmDealTypeList,
  isDrill: alarmDeal.isDrill,
  alarmDeal,
  emergency,
  undoneEventList: emergency.undoneEventList,
  alarm,
  alarmIconData: mapRelation.alarmIconData,
}))
@Form.create()
export default class AlarmDeal extends PureComponent {
  state = {
    dealType: '104.103',
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'alarmDeal/getAlarmDealTypeList',
      payload: 104,
    });
  }
  componentWillUnmount() {
    this.props.dispatch({
      type: 'alarmDeal/saveIsDrill',
      payload: 0,
    });
  }
  // 提交报警处理为事件
  save = () => {
    // e.preventDefault();
    const { dispatch, alarmInfo, form, alarmIconData } = this.props;
    const { alarmId } = alarmInfo;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!err) {
        const rawMaterialIds = [fieldsValue.rawMaterialIds];
        fieldsValue.rawMaterialIds = [fieldsValue.rawMaterialIds];
        if (this.state.dealType === '104.103') {
          fieldsValue.casualtys = [];
          fieldsValue.keys.map((obj, i) => {
            const template = {};
            template.postion = fieldsValue.location[i];
            template.injured = fieldsValue.injured[i];
            template.death = fieldsValue.deaths[i];
            template.reportUserId = fieldsValue.reportUserId[i];
            template.reportUserName = fieldsValue.reportUserName[i];
            template.recordTime = fieldsValue.recordTime[i];
            fieldsValue.casualtys.push(JSON.parse(JSON.stringify(template)));
          });
        }
        delete fieldsValue.rawMaterialIds;
        delete fieldsValue.probeResourceID1;
        delete fieldsValue.resourceID1;
        delete fieldsValue.rawMaterialIds1;

        dispatch({
          type: 'emergency/getAlarmEvent',
          payload: {
            eventStr: JSON.stringify({ ...fieldsValue, isDrill: this.props.isDrill }),
            code: this.state.dealType,
            rawMaterialIds,
            alarmId,
          },
        }).then(() => {
          dispatch({
            type: 'alarm/fetch',
          });
          // 删除地图报警图标
          delAlarmAnimation(alarmIconData, alarmInfo, dispatch);
          // 更新事件图标
          addEventIcon(this.props.undoneEventList, dispatch);
          // 更新头部应急事件下拉.
          dispatch({
            type: 'emergency/undoneEventList',
          });
          // 关闭资源信息窗.
          dispatch({
            type: 'resourceTree/saveCtrlResourceType',
            payload: '',
          });
          form.resetFields();
          dispatch({
            type: 'alarmDeal/saveDealModel',
            payload: { isDeal: false },
          });
        });
      }
    });
  };
  // 保存报警信息不生成事件
  editAlarm = () => {
    // e.preventDefault();
    const { dispatch, alarmInfo, form } = this.props;
    const { alarmId } = alarmInfo;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!err) {
        const rawMaterialIds = [fieldsValue.rawMaterialIds];
        fieldsValue.rawMaterialIds = [fieldsValue.rawMaterialIds];
        if (this.state.dealType === '104.103') {
          fieldsValue.casualtys = [];
          fieldsValue.keys.map((obj, i) => {
            const template = {};
            template.postion = fieldsValue.location[i];
            template.injured = fieldsValue.injured[i];
            template.death = fieldsValue.deaths[i];
            template.reportUserId = fieldsValue.reportUserId[i];
            template.reportUserName = fieldsValue.reportUserName[i];
            template.recordTime = fieldsValue.recordTime[i];
            fieldsValue.casualtys.push(JSON.parse(JSON.stringify(template)));
          });
        }
        delete fieldsValue.rawMaterialIds;
        delete fieldsValue.probeResourceID1;
        delete fieldsValue.resourceID1;
        delete fieldsValue.rawMaterialIds1;

        dispatch({
          type: 'emergency/editAlarm',
          payload: {
            eventStr: JSON.stringify({ ...fieldsValue, isDrill: this.props.isDrill }),
            code: this.state.dealType,
            rawMaterialIds,
            alarmId,
          },
        }).then(() => {
          dispatch({
            type: 'alarm/fetch',
          });
          // 关闭资源信息窗.
          dispatch({
            type: 'resourceTree/saveCtrlResourceType',
            payload: '',
          });
          form.resetFields();
          dispatch({
            type: 'alarmDeal/saveDealModel',
            payload: { isDeal: false },
          });
        });
      }
    });
  };
  // 关闭报警处理弹窗
  cancel = () => {
    this.props.dispatch({
      type: 'alarmDeal/saveDealModel',
      payload: { isDeal: false },
    });
  };
  // 是否是应急演练
  onChange = (e) => {
    this.props.dispatch({
      type: 'alarmDeal/saveIsDrill',
      payload: e.target.checked ? 1 : 0,
    });
  };
  // 报警处理类型改变
  alarmDealTypeChange = (e) => {
    this.setState({
      dealType: e.target.value,
    });
  };
  render() {
    const { alarmDealTypeList } = this.props;
    console.log(666, this.props.alarmInfo);
    const title = (
      <RadioGroup onChange={this.alarmDealTypeChange} defaultValue="104.103">
        {alarmDealTypeList.map((item) => {
          return <Radio key={item.codeID} value={item.code}>{item.codeName}</Radio>;
        })
        }
      </RadioGroup>
    );
    const extra = (
      <div className={styles.extra}>
        {this.props.alarmInfoConten.alarmWay === 1 ? (
          <Button type="primary" onClick={this.editAlarm}>保存</Button>
        ) : null }
        <Button onClick={this.save} type="primary">提交</Button>
        <Checkbox checked={!!this.props.isDrill} value={this.props.isDrill} onChange={this.onChange}>应急演练</Checkbox>
      </div>
    );
    return (
      <Card title={title} extra={extra} >
        <AlarmInfo
          save={this.save}
          dispatch={this.props.dispatch}
          alarmInfo={this.props.alarmInfo}
          alarmDeal={this.props.alarmDeal}
          isEvent={this.state.dealType === '104.103'}
          cancel={this.cancel}
          form={this.props.form}
          onChange={this.onChange}
        />
      </Card>
    );
  }
}
