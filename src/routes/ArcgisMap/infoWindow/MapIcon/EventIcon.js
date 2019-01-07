import React, { Component } from 'react';
import { message } from 'antd';
import eventIcon from '../../../../assets/map/event/eventIcon.png';
import styles from './index.less';
import { mapConstants } from '../../../../services/mapConstant';
import { infoPopsModal } from '../../../../services/constantlyModal';
import { hoveringAlarm } from '../../../../utils/mapService';


export default class EventIcon extends Component {
  handleClick = ({ event, geometry }, iconIndex) => {
    const { resResourceInfo } = event.event;
    const { infoPops, dispatch, eventIconData } = this.props;
    const name = resResourceInfo.resourceName;
    const screenPoint = mapConstants.view.toScreen(geometry);
    hoveringAlarm({ geometry, alarm: event.event, dispatch, screenPoint, infoPops, iconIndex, iconData: eventIconData, iconDataType: 'event' });
    if (resResourceInfo) {
      // 添加弹窗(地图单击产生的弹窗为唯一，所以key固定)
      const index = infoPops.findIndex(value => value.key === 'mapClick');
      const index1 = infoPops.findIndex(value => Number(value.gISCode) === Number(resResourceInfo.resourceGisCode));
      const pop = {
        show: true,
        key: 'mapClick',
        gISCode: resResourceInfo.gISCode,
        uniqueKey: Math.random() * new Date().getTime(),
      };
      if (index1 !== -1) {
        return false;
      }
      if (index === -1) {
        infoPops.push(pop);
      } else {
        infoPops.splice(index, 1, pop);
      }
      infoPopsModal.mapClick = {
        screenPoint, screenPointBefore: screenPoint, mapStyle: { width: mapConstants.view.width, height: mapConstants.view.height }, attributes: resResourceInfo, geometry, name,
      };
      dispatch({
        type: 'mapRelation/queryInfoPops',
        payload: infoPops,
      });
    }
    dispatch({
      type: 'resourceTree/selectEventByGISCode',
      payload: { pageNum: 1, pageSize: 1, isQuery: true, fuzzy: false, gISCode: resResourceInfo.gISCode, event: event.event },
    }).then(() => {
      if (this.props.resourceInfo === undefined) {
        message.error('未请求到资源相关数据');
      }
    });
  }

  render() {
    const { eventIconData } = this.props;
    const icon = eventIconData.map((item, index) => {
      return (
        <div onClick={() => this.handleClick(item, index)} className={styles.eventicon} style={{ ...item.style, zIndex: item.isSelected ? 13 : '' }} key={item.ObjCode}>
          <div className={item.isSelected ? styles.selected : styles.circle} />
          <img alt="icon" src={eventIcon} />
        </div>
      );
    }

    );
    return (
      <div>
        { icon }
      </div>
    );
  }
}
