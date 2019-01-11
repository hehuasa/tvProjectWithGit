import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import ArcgisMap from '../ArcgisMap/ArcgisMap';
import MapRelation from '../ArcgisMap/MapRelation';
import TrueMap from '../TrueMap/TrueMap';
import AlarmDeal from '../EmergencyCommand/AlarmDeal/index';
import styles from './index.less';
import StatusGraphic from './StatusGraphic/StatusGraphic';
import DeviceMonitor from './DeviceMonitor/DeviceMonitor';
import AccessInfo from './AccessInfo/AccessInfo';
import { mapConstants } from '../../services/mapConstant';

const dragEvent = {
  isDrag: false,
};
@connect(({ homepage, map, alarmDeal, flow, accessControl, sysFunction, mapRelation }) => {
  return {
    trueMapShow: map.trueMapShow,
    deviceMonitor: homepage.deviceMonitor,
    deviceMonitors: homepage.deviceMonitors,
    dealModel: alarmDeal.dealModel,
    alarmInfo: alarmDeal.alarmInfo,
    alarmInfoConten: alarmDeal.alarmInfoConten,
    currentFlow: flow.currentFlow,
    currentFlows: flow.currentFlows,
    mapHeight: homepage.mapHeight,
    modalType: homepage.modalType,
    serverTime: homepage.serverTime,
    accessControl,
    spaceQueryPop: mapRelation.spaceQueryPop,
    ztreeObj: sysFunction.ztreeObj,
  };
})
export default class HomePage extends PureComponent {
    state = {
      modalZIndex: 1000,
    };
    componentDidMount() {
      // editor.net = new G6.Net({
      //     container: this.flow,
      //     mode: 'drag',
      //     forceFit: true,
      //     fitView: 'autoSize',
      //     // width: 1200,
      //     height: this.props.mapHeight,
      //     grid: null,
      // });
      this.props.dispatch({
        type: 'homepage/getServerTime',
      }).then(() => {
        this.intervalID = setInterval(() => {
          this.props.dispatch({
            type: 'homepage/saveServerTime',
            payload: this.props.serverTime + 1000,
          });
        }, 1000);
      });
    }
    componentWillUnmount() {
      clearInterval(this.intervalID);
    }
  // ;
  hideModal = () => {
    this.props.dispatch({
      type: 'alarmDeal/saveDealModel',
      payload: { isDeal: false },
    });
  };
  handleMouseDown = (e) => {
    if (e.target.title !== 'spaceQueryTitle') {
      e.stopPropagation();
      return false;
    }
    if (e.target.tagName === 'EMBED') {
      e.stopPropagation();
      return false;
    }
    if (e.target.title === 'spaceQueryTitle') {
      dragEvent.isDrag = true;
      dragEvent.start = {
        x: e.clientX,
        y: e.clientY,
      };
      e.stopPropagation();
    }
  };
  handleMouseMove = (e) => {
    if (e.target.tagName === 'EMBED') {
      e.stopPropagation();
      return false;
    }
    if (dragEvent.isDrag) {
      const { spaceQueryPop, dispatch } = this.props;
      if (spaceQueryPop) {
        const { mapPoint, screenPoint } = spaceQueryPop;
        if (dragEvent.isDrag) {
          const delta = {
            x: e.clientX - dragEvent.start.x,
            y: e.clientY - dragEvent.start.y,
          };
          dispatch({
            type: 'mapRelation/setSpaceQuery',
            payload: { load: true, show: true, style: { left: screenPoint.x + delta.x, top: screenPoint.y + delta.y }, point: mapPoint, screenPoint },
          });
          e.stopPropagation();
          e.preventDefault();
        }
      }
    } else {
      e.preventDefault();
    }

  };
  handleMouseUp = (e) => {
    if (e.target.tagName === 'EMBED') {
      e.stopPropagation();
      return false;
    }
    const { spaceQueryPop, dispatch } = this.props;
    if (spaceQueryPop) {
      const { style } = spaceQueryPop;
      if (dragEvent.isDrag) {
        dragEvent.isDrag = false;
        dispatch({
          type: 'mapRelation/setSpaceQuery',
          payload: { load: true, show: true, style, point: mapConstants.view.toMap({ x: style.left, y: style.top }), screenPoint: { x: style.left, y: style.top } },
        });
      }
    }


    e.stopPropagation();
    e.preventDefault();
  };
  titleNodeText = () => {
    const { alarmInfoConten, alarmInfo } = this.props;
    return (
      <div>
        <span className={styles.alarmTitle}>报警处理</span>
        <span className={styles.titleRange}>{alarmInfo.alarmType ? alarmInfo.alarmType.alarmTypeName ? `状态:${alarmInfo.alarmType.alarmTypeName}` : '' : ''}</span>
        <span className={styles.titleRange}>{alarmInfo.resourceName ? `资源名称:${alarmInfo.resourceName}` : ''}</span>
        <span className={styles.titleRange}>{alarmInfo.areaName ? `所在区域:${alarmInfo.areaName}` : ''}</span>
        <span className={styles.titleRange}>{alarmInfo.alarmTime ? `首报时间:${moment(alarmInfo.alarmTime).format('YYYY-MM-DD HH:mm:ss')}` : ''}</span>
        <span className={styles.titleRange}>{alarmInfoConten.alarmWay ? `类型:${(alarmInfoConten.alarmWay === 1) ? '自动报警' : '人工报警'}` : ''}</span>
      </div>
    );
  }
  render() {
    const { modalZIndex } = this.state;
    const { currentFlow, dealModel, deviceMonitor, currentFlows, mapHeight, dispatch, accessControl, modalType, deviceMonitors, ztreeObj } = this.props;
    const { isDeal } = dealModel;

    return (
      <div>
        {
              currentFlow.show ? <StatusGraphic zIndex={modalType === 'currentFlow' ? modalZIndex : -1} /> : null
            }
        {
              deviceMonitor.show ? <DeviceMonitor ztreeObj={ztreeObj} zIndex={modalType === 'deviceMonitor' ? modalZIndex : -1} currentFlows={currentFlows} deviceMonitors={deviceMonitors} mapHeight={mapHeight} dispatch={dispatch} deviceMonitor={deviceMonitor} currentFlow={currentFlow} /> : null
            }
        <div className={styles.mapContent}>
          <div
            onMouseDown={this.handleMouseDown}
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.handleMouseUp}
          >
            <ArcgisMap />
            <MapRelation />
          </div>
          {accessControl.show ? <AccessInfo dispatch={dispatch} accessControl={accessControl} /> : null}
          <TrueMap />
          <Modal
            title={this.titleNodeText()}
            footer={null}
            style={{ position: 'absolute', left: 260 }}
            zIndex="1002"
            visible={isDeal}
            mask={false}
            width="60%"
            onCancel={this.hideModal}
            okText="确认"
            cancelText="取消"
            maskClosable={false}
            destroyOnClose
          >
            <AlarmDeal />
          </Modal>
        </div>
      </div>
    );
  }
}
