import React, { PureComponent } from 'react';
// import { Button } from 'antd';
import { connect } from 'dva';
import MapTools from './MapTools/index';
import ContextMenu from './ContextMenu/ContextMenu';
// import MeasurePop from './infoWindow/MeasurePop/MeasurePop';
import SpaceQuery from './infoWindow/spaceQuery/SpaceQuery';
import InfoPops from './infoWindow/Template/InfoPops';
import AccessPopup from './infoWindow/AccessPopup/AccessPopup';
import VOCsPopup from './infoWindow/VOCsPopup/VOCsPopup';
import ResourceClusterPopup from './infoWindow/ResourceClusterPopup/ResourceClusterPopup';
import AlarmClusterPopup from './infoWindow/AlarmClusterPopup/AlarmClusterPopup';
import MapIcon from './infoWindow/MapIcon/MapIcon';
import EnvIcon from './infoWindow/EnvIcon/EnvIcon';
import PAPopup from './infoWindow/PApopup/PApopup';
import ConstructMonitorPopup from './infoWindow/ConstructMonitorPopup/ConstructMonitorPopup';
import { infoPopsModal } from '../../services/constantlyModal';
import { mapLayers, mapConstants } from '../../services/mapConstant';
import styles from './index.less';
import Search from './Sraech';
import Mark from './Mark/Mark';
import MarkRender from './Mark/MarkRender';
import LeftBoard from './LeftBoard';
import { trueMapLocate } from '../../utils/mapService';
import trueMap from '../../assets/map/truemap.jpg';
import map_ from '../../assets/map/map.jpg';
import weix from '../../assets/map/weix.png';
import Legend from './Legend/Legend';

const current = {};

const dragEvent = {
  isDrag: false,
};
const mapStateToProps = ({ map, mapRelation, homepage, alarm, resourceTree, constantlyData, loading, global, emergency }) => {
  const { infoWindow, scale, popupScale, baseLayer, trueMapShow, locateTrueMap, mapPoint, screenBeforePoint, searchDeviceArray, screenPoint,
    constantlyValue, doorConstantlyValue, doorAreaConstantlyValue, gasConstantlyValue, envConstantlyValue, stopPropagation,
    vocConstantlyValue, waterConstantlyValue, steamConstantlyValue, contextPosition, isDraw,
    crackingConstantlyValue, generatorConstantlyValue, largeUnitConstantlyValue, boilerConstantlyValue,
  } = map;
  const { infoPops, vocsPopup, alarmIconData, eventIconData, envIconData, mapIconShow, resourceClusterPopup, accessPops, paPopup, popupShow, envIconShow, markShow, markData, markType, clusterPopups, constructMonitorClusterPopup,
    alarmClusterPopup } = mapRelation;
  const data = [];
  for (const item of constantlyData.constantlyComponents) {
    data.push(item);
  }
  const { show, load } = accessPops;
  const accessData = [];
  for (const item of accessPops.data) {
    accessData.push(item);
  }
  const newType = JSON.parse(JSON.stringify(markData.type));
  const newMarkData = { type: newType, data: markData.data };
  const newAccessPops = { show, load, data: accessData };
  return {
    serviceUrl: global.serviceUrl,
    infoWindow,
    mapHeight: homepage.mapHeight,
    scale,
    stopPropagation,
    isDraw,
    popupScale,
    baseLayer,
    popupShow,
    envIconShow,
    markShow,
    contextPosition,
    list: alarm.groupByOverview.list,
    alarmIconData,
    eventIconData,
    envIconData,
    mapIconShow,
    trueMapShow,
    locateTrueMap,
    mapPoint,
    screenBeforePoint,
    screenPoint,
    searchDeviceArray,
    constantlyValue,
    doorConstantlyValue,
    doorAreaConstantlyValue,
    gasConstantlyValue,
    envConstantlyValue,
    vocConstantlyValue,
    waterConstantlyValue,
    crackingConstantlyValue,
    generatorConstantlyValue,
    largeUnitConstantlyValue,
    boilerConstantlyValue,
    constantlyComponents: data,
    steamConstantlyValue,
    clusterPopups,
    resourceClusterPopup,
    undoneEventList: emergency.undoneEventList,
    constructMonitorClusterPopup,
    infoPops,
    resourceInfo: resourceTree.resourceInfo,
    vocsPopup,
    alarmClusterPopup,
    accessPops: newAccessPops,
    paPopup,
    markData: newMarkData,
    markType,
    resourceTree,
    fetchingAlarm: loading.effects['alarm/fetch'],
    fetchingMapApi: loading.effects['global/fetchUrl'],
    fetchLayers: loading.effects['map/fetchLayers'],
  };
};

@connect(mapStateToProps)
export default class MapRelation extends PureComponent {
  constructor(props) {
    super(props);
    const timeStample = new Date().getTime();
    this.state = {
      mapDivId: `mapdiv${timeStample}`,
      legendIndex: -1,
    };
  }

  preventContext= (e) => {
    e.preventDefault();
  };
  switchMap = (type) => {
    const { dispatch } = this.props;
    const switching = (showType) => {
      const tileLayer = mapConstants.mainMap.findLayerById('底图');
      const id = mapLayers.RasterLayers[0].id;
      const newLayer = mapConstants.baseLayer.findSublayerById(id); // 卫星图
      if (showType === 1) {
        tileLayer.visible = true;
        newLayer.visible = false;
      } else {
        tileLayer.visible = false;
        newLayer.visible = true;
      }
    };
    switch (Number(type)) {
      case 1:
        switching(1);
        break;
      case 2:
        switching(2);
        break;
      case 3:
        {
          let roadLine;
          for (const layer of mapLayers.FeatureLayers) {
            if (Number(layer.layerType) === 4) {
              // 取出道路图
              roadLine = layer.mapLayerName;
              break;
            }
          }
          trueMapLocate(mapConstants.mainMap, mapConstants.view, roadLine, dispatch);
        }
        break;
      default: break;
    }
  };

  showLegend = () => {
    const { legendIndex } = this.state;
    this.setState({
      legendIndex: legendIndex === -1 ? 12 : -1,
    });
  };
  render() {
    const { stopPropagation, popupShow, markShow, envIconShow, resourceInfo, undoneEventList, alarmIconData, eventIconData, envIconData, mapIconShow, markData, markType, trueMapShow, dispatch, serviceUrl, contextPosition, screenPoint, mapPoint, resourceClusterPopup, constructMonitorClusterPopup, clusterPopups, infoPops, vocsPopup, alarmClusterPopup, accessPops, baseLayer, paPopup, mapHeight } = this.props;
    const { legendIndex } = this.state;
    const { allSublayers } = baseLayer;
    const getCurrentPopups = () => {
      if (clusterPopups.length === 0) {
        return null;
      }
      const getType = () => {
        let index = 0;
        let success = false;
        while (!success) {
          if (this.props[clusterPopups[index].type].data.length > 0 || index === clusterPopups.length - 1) {
            success = true;
          } else {
            index += 1;
          }
        }
        return clusterPopups[index].type;
      };
      const type = getType();
      switch (type) {
        case 'resourceClusterPopup':
          return resourceClusterPopup.show && resourceClusterPopup.load ? resourceClusterPopup.data.map(item => <ResourceClusterPopup key={item.key} uniqueKey={item.uniqueKey} popValue={item} popKey={item.key} />) : null;
        case 'alarmClusterPopup':
          return alarmClusterPopup.show && alarmClusterPopup.load ? alarmClusterPopup.data.map(item => <AlarmClusterPopup key={item.uniqueKey} uniqueKey={item.uniqueKey} popValue={item} popKey={item.uniqueKey} dispatch={dispatch} />) : null;
        case 'vocsPopup':
          return vocsPopup.show && vocsPopup.load ? vocsPopup.data.map(item => <VOCsPopup key={item.uniqueKey} uniqueKey={item.uniqueKey} popValue={item} popKey={item.uniqueKey} dispatch={dispatch} />) : null;
        case 'paPopup':
          return paPopup.show && paPopup.load ? paPopup.data.map(item => <PAPopup dispatch={dispatch} key={item.uniqueKey} uniqueKey={item.uniqueKey} data={item.data} />) : null;
        case 'accessPops':
          return accessPops.show && accessPops.load ? accessPops.data.map(item => <AccessPopup dispatch={dispatch} key={item.uniqueKey} uniqueKey={item.uniqueKey} data={item.data} />) : null;
        case 'constructMonitorClusterPopup':
          return constructMonitorClusterPopup.show && constructMonitorClusterPopup.load ? constructMonitorClusterPopup.data.map(item => <ConstructMonitorPopup dispatch={dispatch} key={item.uniqueKey} popValue={item} uniqueKey={item.uniqueKey} />) : null;
        default:
          return null;
      }
    };
    //  扩音对讲气泡窗
    const paPopupComponents = () => {
      return paPopup.show && paPopup.load ? paPopup.data.map(item => <PAPopup dispatch={dispatch} key={item.uniqueKey} uniqueKey={item.uniqueKey} data={item.data} />) : null;
    };
    // 资源气泡窗
    const infoPropComponents = infoPops.map(item =>
      (item.show ? <InfoPops key={item.key} uniqueKey={item.uniqueKey} popValue={infoPopsModal[item.key]} popKey={item.key} /> : null)
    );
    const mapStyle = { height: mapHeight };
    return (
      serviceUrl.mapApiUrl === '' ? null : (
        <div
          className={styles.warpR} style={{ display: trueMapShow ? 'none' : '' }} >
          {!markShow.show ? <Search stopPropagation={stopPropagation} /> : null }
          <LeftBoard />
          {/* <div style={{ overflow: 'hidden' }}> */}
          {/* { allSublayers ? allSublayers.items.map((item) => { */}
          {/* return ( */}
          {/* <Switch checked={ item.visible } onChange={() => { item.visible = !item.visible }} checkedChildren={item.title} unCheckedChildren={item.title} /> */}
          {/* ) */}
          {/* }) : null } */}
          {/* </div> */}
          <div
            id={this.state.mapDivId}
            style={mapStyle}
            className={styles.map}
            onContextMenu={this.preventContext}
          >
            <Legend mapHeight={mapHeight} legendIndex={legendIndex} />
            { !markShow.show ? <MapTools stopPropagation={stopPropagation} showLegend={this.showLegend} /> : null }
            { markShow.show ? <Mark dispatch={dispatch} markData={markData} mapHeight={mapHeight} markType={markType} /> : null}
            { !markShow.show && markShow.load ? markData.data.filter(value => markData.type.indexOf(value.layerType) !== -1).map((item) => {
              return <MarkRender data={item} key={item.id} />;
            }) : null }
            { popupShow && contextPosition.show ? <ContextMenu map={mapConstants.mainMap} dispatch={dispatch} position={contextPosition} screenPoint={screenPoint} mapPoint={mapPoint} /> : null}
            { popupShow ? infoPropComponents : null }
            { popupShow ? getCurrentPopups() : null }
            { popupShow ? paPopupComponents() : null }
            {/*<MeasurePop />*/}
            { popupShow && envIconShow ? <EnvIcon envIconData={envIconData} infoPops={infoPops} resourceInfo={resourceInfo} dispatch={dispatch} /> : null }
            <SpaceQuery />
            { popupShow && mapIconShow ? <MapIcon mapIconData={{ alarmIconData, eventIconData }} resourceInfo={resourceInfo} infoPops={infoPops} dispatch={dispatch} undoneEventList={undoneEventList} /> : null }
          </div>
          { !markShow.show ? (
            <div className={styles.switch}>
              <div className={styles.arcMap} onClick={() => { this.switchMap(1); }} ><img src={map_} alt="切换至地图" /></div>
              <div className={styles.arcMapHide} onClick={() => { this.switchMap(2); }}><img src={weix} alt="切换至卫星图" /></div>
              <div className={styles.arcMapHide} onClick={() => { this.switchMap(3); }} ><img src={trueMap} alt="切换至实景" /></div>
            </div>
) : null }
        </div>
      ));
  }
}
