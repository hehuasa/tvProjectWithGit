import React, { Component } from 'react';
import { message } from 'antd';
import { mapLegendList, mapLegendListWithAlarm } from '../../../../services/mapLegendList';
import styles from './index.less';
import { mapConstants, mapLayers } from '../../../../services/mapConstant';
import { infoPopsModal } from '../../../../services/constantlyModal';
import { hoveringAlarm } from '../../../../utils/mapService';


export const getIcon = (alarm) => {
  const legendLayer = mapLayers.FeatureLayers.find(value => value.mapIcon === alarm.ctrlResourceType);

  if (!legendLayer) {
    return undefined;
  }
  let normalIconObj = mapLegendList.find(value => legendLayer.mapLayerName.indexOf(value.name) !== -1);
  let layerName = '';
  try {
    layerName = `${legendLayer.mapLayerName}${alarm.alarmType.dangerCoefficient === 0 ? 1 : alarm.alarmType.dangerCoefficient}`;
  } catch (e) {
  }
  if (legendLayer) {
    normalIconObj = mapLegendListWithAlarm.find(value => layerName.indexOf(value.name) !== -1);
    if (normalIconObj === undefined) {
      normalIconObj = mapLegendList.find(value => legendLayer.mapLayerName.indexOf(value.name) !== -1);
    }
  }
  return normalIconObj;
};

export default class AlarmIcon extends Component {
  handleClick = ({ alarm, geometry }, iconIndex) => {
    const { infoPops, dispatch, alarmIconData } = this.props;
    const name = alarm.resourceName;
    const screenPoint = mapConstants.view.toScreen(geometry);
    hoveringAlarm({ geometry, alarm, dispatch, screenPoint, infoPops, iconData: alarmIconData, iconIndex, iconDataType: 'alarm' });
    if (name) {
      // 添加弹窗(地图单击产生的弹窗为唯一，所以key固定)
      const index = infoPops.findIndex(value => value.key === 'mapClick');
      const index1 = infoPops.findIndex(value => Number(value.gISCode) === Number(alarm.resourceGisCode));
      const pop = {
        show: true,
        key: 'mapClick',
        gISCode: alarm.resourceGisCode,
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
        screenPoint, screenPointBefore: screenPoint, mapStyle: { width: mapConstants.view.width, height: mapConstants.view.height }, attributes: alarm, geometry, name,
      };
      dispatch({
        type: 'mapRelation/queryInfoPops',
        payload: infoPops,
      });
    }
    dispatch({
      type: 'resourceTree/selectByGISCode',
      payload: { gISCode: alarm.resourceGisCode },
    }).then(() => {
      if (this.props.resourceInfo === undefined) {
        message.error('未请求到资源相关数据');
      }
    });
  }

  render() {
    const { alarmIconData } = this.props;
    const icon = alarmIconData.map((item, index) => {
      const urlObj = getIcon(item.alarm);
      if (urlObj) {
        return (
          <div onClick={() => this.handleClick(item, index)} className={styles.alarmicon} style={{ ...item.style, zIndex: item.isSelected ? 13 : '' }} key={item.alarm.alarmCode}>
            <img alt="icon" src={urlObj.url} />
            <div className={item.isSelected ? styles.selected : styles.circle} />
          </div>
        );
      } else {
        return null;
      }
    }

    );
    return (
      <div>
        { icon }
      </div>
    );
  }
}
