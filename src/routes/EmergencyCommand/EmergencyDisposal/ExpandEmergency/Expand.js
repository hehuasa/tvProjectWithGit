import React, { PureComponent } from 'react';
import { Form, Tabs, Card, Row, Col, Select, Radio, Table } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const { TabPane } = Tabs;
const RadioGroup = Radio.Group;
const { Option } = Select;
@connect(({ emergency }) => ({
  eventID: emergency.eventId,
  expandCurrent: emergency.expandCurrent,
  expandFeatureList: emergency.expandFeatureList,
  planLevelList: emergency.planLevelList,
  eventLevel: emergency.eventLevel,
  eventInfo: emergency.eventInfo,
}))
@Form.create()
export default class Expand extends PureComponent {
  state = {
    expandRange: 1, // 事件扩大范围
  };
  componentDidMount() {
    const { dispatch, eventID } = this.props;
    // 请求事件特征
    dispatch({
      type: 'emergency/getExpandFeature',
      payload: { eventID },
    });
    //   请求预案等级列表
    dispatch({
      type: 'emergency/getPlanLevelList',
      payload: { eventID },
    });
    // 获取当前事件的响应等级
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
  onChange = (e) => {
    this.setState({
      expandRange: e.target.value,
    });
  };
  levelChange = (value) => {
    const { dispatch, eventID } = this.props;
    dispatch({
      type: 'emergency/updateExpandLevel',
      payload: { planState: 3, eventID, eventLevel: value },
    });
  };
  render() {
    const { expandFeatureList, planLevelList } = this.props;
    const title = (
      <div>
        <RadioGroup onChange={this.onChange} defaultValue={this.state.expandRange}>
          <Radio value={1}>事件级别升级</Radio>
          <Radio value={2}>事件范围扩大</Radio>
        </RadioGroup>
      </div>
    );
    const extra = (
      <div className={styles.expandExtra}>
        <span className={styles.eventLevel}>事件级别升级</span>
        <Select
          defaultValue={this.props.eventLevel}
          disabled={this.state.expandRange === 2}
          style={{ width: 200 }}
          onChange={this.levelChange}
        >
          <Option value="">请选择事件级别</Option>
          { planLevelList.map((item) => {
            return (
              <Option
                key={item.emgcLevelID}
                value={item.emgcLevelID}
              >{item.levelName}
              </Option>
);
          })
          }
        </Select>
      </div>
    );
    // 国家规范的表头
    const regulationsCol = [
      {
        title: '事件级别',
        dataIndex: 'eventLevel',
        key: 'eventLevel',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 3;
          }
          // These two are merged into above cell
          if (index > 0 && index < 3) {
            obj.props.rowSpan = 0;
          }
          if (index === 3) {
            obj.props.rowSpan = 3;
          }
          if (index > 3 && index < 6) {
            obj.props.rowSpan = 0;
          }
          if (index === 6) {
            obj.props.rowSpan = 2;
          }
          if (index > 6 && index < 8) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      }, {
        title: '特征',
        dataIndex: 'featureName',
        key: 'featureName',
      }, {
        title: '特征值',
        dataIndex: 'featureValue',
        key: 'featureValue',
      }, {
        title: '单位',
        dataIndex: 'unit',
        key: 'unit',
      }];
    // 国家规范数据
    const regulations = [
      { key: 0, eventLevel: 'I (中国石化)级事件', featureName: '死亡人数', featureValue: '>= 3', unit: '人' },
      { key: 1, eventLevel: 'I (中国石化)级事件', featureName: '受伤人数', featureValue: '>= 15', unit: '人' },
      { key: 2, eventLevel: 'I (中国石化)级事件', featureName: '经济损失', featureValue: '>= 1000', unit: '万' },
      { key: 3, eventLevel: 'II (中国石化)级事件', featureName: '死亡人数', featureValue: '1 - 2 ', unit: '人' },
      { key: 4, eventLevel: 'II (中国石化)级事件', featureName: '受伤人数', featureValue: '3 - 5 ', unit: '人' },
      { key: 5, eventLevel: 'II (中国石化)级事件', featureName: '经济损失', featureValue: '100 - 1000', unit: '万' },
      { key: 6, eventLevel: 'III (分部)级事件', featureName: '受伤人数', featureValue: '<= 2', unit: '人' },
      { key: 7, eventLevel: 'III (分部)级事件', featureName: '经济损失', featureValue: '< 100', unit: '万' },
    ];
    // 事件特征值表头
    const featureCol = [
      {
        title: '特征',
        dataIndex: 'featureName',
        key: 'featureName',
        width: '25%',
      }, {
        title: '事件特征值',
        dataIndex: 'emgcFeatureValue',
        key: 'emgcFeatureValue',
        width: '20%',
      }, {
        title: '预案特征值',
        dataIndex: 'panFeatureValue',
        key: 'panFeatureValue',
        width: '20%',
      }, {
        title: '单位',
        dataIndex: 'featureUnit',
        key: 'featureUnit',
        width: '15%',
      }, {
        title: '备注',
        dataIndex: 'eventFeatureDes',
        key: 'eventFeatureDes',
        width: '20%',
      }];
    return (
      <div className={styles.expand}>
        <Card title={title} extra={extra}>
          <Row gutter={16}>
            <Col span={12}>
              <Card title="事件特征" className={styles.cardStyle1} >
                <Table
                  columns={featureCol}
                  rowKey={(record, index) => index}
                  size="small"
                  dataSource={expandFeatureList}
                  pagenation={{ pageSize: 8 }}
                  bordered
                />
              </Card>
            </Col>
            <Col span={12} className={styles.cardStyle2}>
              <Card title="国家规范条件">
                <Table columns={regulationsCol} size="small" dataSource={regulations} bordered />
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

