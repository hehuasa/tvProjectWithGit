import React, { PureComponent } from 'react';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'dva';
import { Row, Col, Button, Collapse } from 'antd';
import styles from './index.less';
import close from '../../../../assets/map/叉叉.png';

const { Panel } = Collapse;

@connect(({ homepage, vocsMonitor }) => ({
  data: vocsMonitor.mapSelectedList,
  mapHeight: homepage.mapHeight,
}))
export default class ConstructMontior extends PureComponent {
  handleClick = () => {
    // 清空设备控制类型
    this.props.dispatch({
      type: 'resourceTree/saveCtrlResourceType',
      payload: '',
    });
    // 清空地图保存的危险源、风险areaCode
    this.props.dispatch({
      type: 'resourceTree/saveRiskID',
      payload: '',
    });
  };
  handleChange = (keys) => {
    const { data, dispatch } = this.props;
    const { areaName, list } = data;
    dispatch({
      type: 'vocsMonitor/queryMapSelectedList',
      payload: { list, areaName, keys },
    });
  };
  render() {
    const { data, mapHeight } = this.props;
    const { areaName, list, keys } = data;
    const content = list.length > 0 ? (
      <div className={styles.warp}>
        <div className={styles.header}>
          <div className={styles.name}>{areaName}</div>
          <div className={styles.close}>
            <div onClick={this.handleClick}><img src={close} alt="关闭" /></div>
          </div>
        </div>
        <Scrollbars
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          autoHeight
          autoHeightMin={200}
          autoHeightMax={mapHeight - 73 - 48 - 32 - 32}
        >
          <div className={styles.panelContent}>
            <Collapse
              bordered={false}
              activeKey={keys}
              onChange={this.handleChange}
            >
              { list.map((item) => {
                return (
                  <Panel header={<div className={styles.panelHeader}>{item.taskName}</div>} key={String(item.ldarSceneDetectID)} >
                    <Row type="flex">
                      <Col span={10}>装置区域：</Col><Col span={14}>{areaName}</Col>
                      <Col span={10}>任务名称：</Col><Col span={14}>{item.taskName}</Col>
                      <Col span={10}>维修点数量：</Col><Col span={14}>{item.maintNumber}</Col>
                      <Col span={10}>已维修点数量：</Col><Col span={14}>{item.alreadyMaintNumber}</Col>
                      <Col span={10}>无法维修点数量：</Col><Col span={14}>{item.notMaintNumber}</Col>
                      <Col span={10}>待维修点数量：</Col><Col span={14}>{item.waitMaintNumber}</Col>
                      <Col span={10}>维修开始日期：</Col><Col span={14}>{`${moment(item.repairBeginDate).format('YYYY-MM-DD HH:mm:ss')}`}</Col>
                      <Col span={10}>维修结束日期：</Col><Col span={14}>{`${moment(item.repairEndDate).format('YYYY-MM-DD HH:mm:ss')}`}</Col>
                      <Col span={10}>下达时间：</Col><Col span={14}>{`${moment(item.distTime).format('YYYY-MM-DD HH:mm:ss')}`}</Col>
                      <Col span={10}>下达人名称：</Col><Col span={14}>{item.distUserName}</Col>
                      <Col span={10}>接受人名称：</Col><Col span={14}>{item.receUserName}</Col>
                      <Col span={10}>备注：</Col><Col span={14}>{item.remark}</Col>
                    </Row>
                  </Panel>
                );
              })}
            </Collapse>
          </div>
        </Scrollbars>
      </div>
    ) : <div />;
    return (
      content
    );
  }
}
