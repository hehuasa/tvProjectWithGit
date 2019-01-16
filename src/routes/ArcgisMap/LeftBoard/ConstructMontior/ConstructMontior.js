import React, { PureComponent } from 'react';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';
import { connect } from 'dva';
import { Row, Col, Button, Collapse } from 'antd';
import styles from './index.less';
import close from '../../../../assets/map/叉叉.png';

const { Panel } = Collapse;

@connect(({ homepage, constructMonitor, panelBoard }) => ({
  list: constructMonitor.mapSelectedList,
  mapHeight: homepage.mapHeight,
  panelBoard,
  orgList: constructMonitor.orgList,
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
    const { list, dispatch } = this.props;
    const { area } = list;
    dispatch({
      type: 'constructMonitor/queryMapSelectedList',
      payload: { list: list.list, area, keys },
    });
  };
  // 打开看板
  openBoard = () => {
    const openBoard = (param, name) => {
      const { expandKeys, activeKeys } = this.props.panelBoard;
      const newArr = [];
      for (const arr of activeKeys) {
        newArr.push(arr);
      }
      if (!activeKeys.find(value => value.name === 'ConstructMontiorPanel')) {
        newArr.unshift({ name, uniqueKey: 0, keys: 'ConstructMontiorPanel', param });
      }
      if (activeKeys.indexOf('ConstructMontiorPanel') === -1) {
        expandKeys.push('ConstructMontiorPanel');
        this.props.dispatch({
          type: 'panelBoard/queryList',
          payload: {
            expandKeys,
            activeKeys: newArr,
          },
        });
      }
    };
    const param = { title: '作业监控看板' };
    openBoard(param, 'ConstructMontiorPanel');
  };
  render() {
    const { list, mapHeight, orgList } = this.props;
    const content = list.list.length > 0 ? (
      <div className={styles.warp}>
        <div className={styles.header}>
          <div className={styles.name}>{`${list.list[0].baseOrganization.orgnizationName}作业监控`}</div>
          <div className={styles.close}>
            <div className={styles.button} onClick={this.handleClick}><img src={close} alt="关闭" /></div>
          </div>
        </div>
        <Scrollbars
          className={styles.scrollbarsStyle}
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
              activeKey={list.keys}
              onChange={this.handleChange}
            >
              { list.list.map((item) => {
                return (
                  <Panel header={<div className={styles.panelHeader}>{item.jobType}</div>} key={String(item.jobMonitorID)} >
                    <Row type="flex">
                      <Col span={10}>作业流水号：</Col><Col span={14}>{item.serialNumber}</Col>
                      <Col span={10}>申请人：</Col><Col span={14}>{item.proposerName}</Col>
                      <Col span={10}>申请单位：</Col><Col span={14}>{item.baseOrganization.orgnizationName}</Col>
                      <Col span={10}>作业开始时间：</Col><Col span={14}>{`${moment(item.startTime).format('YYYY-MM-DD HH:mm:ss')}`}</Col>
                      <Col span={10}>作业结束时间：</Col><Col span={14}>{`${moment(item.endTime).format('YYYY-MM-DD HH:mm:ss')}`}</Col>
                      <Col span={10}>作业类别：</Col><Col span={14}>{item.jobType}</Col>
                      <Col span={10}>作业等级：</Col><Col span={14}>{item.useFireGrade}</Col>
                      <Col span={10}>项目负责人：</Col><Col span={14}>{item.projectLeader}</Col>
                      <Col span={10}>施工单位：</Col><Col span={14}>{item.construction}</Col>
                      <Col span={10}>作业内容：</Col><Col span={14}>{item.jobContent}</Col>
                    </Row>
                  </Panel>
                );
              })}
            </Collapse>
          </div>
        </Scrollbars>
        <div className={styles.btn}>
          <Button htmlType="button" size="small" onClick={this.openBoard}>打开看板</Button>
        </div>
      </div>
    ) : <div />;
    return (
      content
    );
  }
}
