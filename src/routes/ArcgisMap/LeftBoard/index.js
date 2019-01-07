import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon, Spin } from 'antd';
import SearchResult from './SearchResult/SearchResult';
import AlarmInfo from './Alarminfo/index';
import PAInfo from './PAInfo/PAInfo';
import AccessControl from './AccessControl/index';
import SourceOfRisk from './SourceOfRisk/index';
import VOCsMonitor from './VOCsMonitor/VOCsMonitor';
import QualityMonitor from './QualityMonitor/index';
import WarehouseLogistics from './WarehouseLogistics/index';
import styles from './index.less';
import ConstructMontior from './ConstructMontior/ConstructMontior';


const mapStateToProps = ({ map, resourceTree, loading }) => {
  const { searchText, mapBoardShow, searchDeviceArray, baseLayer, layerIds } = map;
  return {
    searchText,
    mapBoardShow,
    searchDeviceArray,
    baseLayer,
    layerIds,
    ctrlResourceType: resourceTree.ctrlResourceType,
    uniqueKey: resourceTree.uniqueKey,
    loading,
  };
};
class LeftBoard extends PureComponent {
  render() {
    const { searchText, ctrlResourceType } = this.props;
    const { backResult } = this.props.mapBoardShow;
    const handClick = () => {
      const { dispatch, baseLayer, layerIds } = this.props;
      const Ids = layerIds;
      // 执行搜索，首先清空value
      dispatch({
        type: 'map/getRecenter',
        payload: false,
      });
      dispatch({
        type: 'map/searchDeviceByAttr',
        payload: { baseLayer: baseLayer.url, searchText, layerIds: Ids },
      });
      dispatch({
        type: 'resourceTree/saveCtrlResourceType',
        payload: 'searchResult',
      });
      dispatch({
        type: 'map/mapBoardShow',
        payload: { backResult: false },
      });
    };
    return (
      <div className={styles.warp} style={{ display: ctrlResourceType === '' ? 'none' : ''}}>
        <Spin spinning={this.props.loading.effects['resourceTree/selectByGISCode'] === true}>
          {backResult ? <div className={styles.back} onClick={handClick}><Icon type="left" /> 返回 {searchText} 搜索结果</div> : null}
          <div>
            {/* 地图所搜结果 */}
            {ctrlResourceType.indexOf('searchResult') === 0 ? <SearchResult /> : null}
            {/* 火灾类设备 */}
            {(ctrlResourceType.indexOf('101.101.102') === 0 ||
              // 扩音设备
              ctrlResourceType.indexOf('101.103.102') === 0 || ctrlResourceType.indexOf('101.103.103') === 0 ||
              // 周界设备 与区域
              ctrlResourceType.indexOf('101.105.102') === 0 || ctrlResourceType.indexOf('101.105.103') === 0 ||
              // 电话设备
              ctrlResourceType.indexOf('101.106.102') === 0 ||
              // 气体检测设备
              ctrlResourceType.indexOf('101.107.102') === 0 ||
              // 环保设备
              ctrlResourceType.indexOf('102.102') === 0 ||
              // 传感器类
              ctrlResourceType.indexOf('103.105') === 0 ||
              // 通用消防设施
              ctrlResourceType.indexOf('104.101') === 0 ||
              // 消防保护区类
              ctrlResourceType.indexOf('104.105') === 0 ||
              ctrlResourceType.indexOf('104') === 0 ||
              // 基础设施类
              ctrlResourceType.indexOf('105') === 0 ||
              // 危险源
              ctrlResourceType.indexOf('101.201.101') === 0 ||
              // 安全风险
              ctrlResourceType.indexOf('101.201.102') === 0 ||
              // 水电汽风监测
             ctrlResourceType.indexOf('103.101.2') === 0 ||
             // 生产设备设施类 大机组、发电机、锅炉、裂解炉
             ctrlResourceType.indexOf('103.102') === 0 ||
            // 视频类设备
            ctrlResourceType.indexOf('101.102.101') === 0) ||
              // 事件
            ctrlResourceType.indexOf('event') !== -1 ||
            ctrlResourceType.indexOf('101') !== -1 ||
            ctrlResourceType.indexOf('102') !== -1 ||
            ctrlResourceType.indexOf('103') !== -1 ||
            ctrlResourceType.indexOf('104') !== -1 ||
            ctrlResourceType.indexOf('105') !== -1 ||
            // 地图资源
            ctrlResourceType.indexOf('mapResOnly') !== -1
              ? <AlarmInfo /> : null}
            {/* 生产类 罐设备信息 */}
            {/* {ctrlResourceType.indexOf('103.101') === 0 ? <Production /> : null} */}
            {/* 门禁设备 */}
            {ctrlResourceType.indexOf('101.104') === 0 ? <AccessControl /> : null}
            {/* 作业监控 */}
            {ctrlResourceType.indexOf('constructMonitor') === 0 ? <ConstructMontior /> : null}
            {/* 危险源专题图 或则 安全风险专题图 */}
            {ctrlResourceType.indexOf('sourceOfRisk') === 0 || ctrlResourceType.indexOf('securityRisk') === 0 ?
              <SourceOfRisk /> : null}
            {/* VOCs监控 */}
            {ctrlResourceType.indexOf('vocsMonitor') === 0 ? <VOCsMonitor /> : null}
            {/* 质量监测信息窗 */}
            {ctrlResourceType.indexOf('qualityMonitor') === 0 ? <QualityMonitor /> : null}
            {/* 仓储物流 */}
            {ctrlResourceType.indexOf('103.201') === 0 // 仓储设施
            || ctrlResourceType.indexOf('103.201') === 0 // 物流设施
              ? <WarehouseLogistics /> : null}
            {/* 扩音分区 */}
            {ctrlResourceType.indexOf('paSystem') === 0 ? <PAInfo /> : null}
          </div>
        </Spin>
      </div>
    );
  }
}
export default connect(mapStateToProps)(LeftBoard);
