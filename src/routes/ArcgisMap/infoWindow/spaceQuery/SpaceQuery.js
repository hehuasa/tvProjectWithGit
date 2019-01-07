import React from 'react';
import { connect } from 'dva';
import { spaceQuery } from '../../../../utils/mapService';
import styles from './index.less';
import { mapLayers, mapConstants } from '../../../../services/mapConstant';

const optinns = [
  { title: '火灾探测', param: 'fire', key: 0 },
  { title: '燃气探测', param: 'gas', key: 1 },
  { title: '消防设施', param: 'ctrl', key: 2 },
  { title: '环保设施', param: 'env', key: 3 },
  { title: '质量设施', param: 'qua', key: 4 },
  { title: '工业视频', param: 'video', key: 5 },
];
const mapStateToProps = ({ map, mapRelation }) => {
  const { centerRadius } = map;
  const { spaceQueryPop } = mapRelation;
  return {
    style: spaceQueryPop.style,
    show: spaceQueryPop.show,
    isDrag: spaceQueryPop.isDrag,
    centerRadius,
    screenPoint: spaceQueryPop.screenPoint,
    map: mapConstants.mainMap,
    view: mapConstants.view,
    mapPoint: spaceQueryPop.point,
  };
};
const dragEvent = {
  isDrag: false,
};
const SpaceQuery = ({ style, show, map, view, dispatch, mapPoint, screenPoint, isDrag, centerRadius }) => {
  let searchVlaue = '';
  // 分类图层容器
  const layers = {
    fire: [],
    gas: [],
    ctrl: [],
    env: [],
    qua: [],
    video: [],
  };
  // 遍历获取分类图层列表
  for (const layer of mapLayers.FeatureLayers) {
    const index = layer.layerAddress.indexOf('MapServer/');
    const order = layer.layerAddress.substr(index + 10);
    switch (Number(layer.layerType)) {
      case 21:
        layers.fire.push(order);
        break;
      case 22:
        layers.gas.push(order);
        break;
      case 23:
        layers.ctrl.push(order);
        break;
      case 24:
        layers.env.push(order);
        break;
      case 25:
        layers.qua.push(order);
        break;
      case 26:
        layers.video.push(order);
        break;
      default: break;
    }
  }
  // 关闭
  const handleClose = () => {
    dispatch({
      type: 'mapRelation/setSpaceQuery',
      payload: { load: false, show: false, style: { left: 0, top: 0 } },
    });
  };
  // 执行搜索
  const handleSearch = (e) => {
    const ids = layers[e.target.title]; // 被筛选的图层id
    spaceQuery({ map, view, ids, dispatch, searchText: searchVlaue, point: mapPoint, radius: centerRadius });
    dispatch({
      type: 'mapRelation/setSpaceQuery',
      payload: { load: false, show: false, style: { left: 0, top: 0 } },
    });
  };
  // 获取输入框的值
  const handleChange = (e) => {
    searchVlaue = e.target.value;
  };
  return (
    show ? (
      <div className={styles.warp} style={{ top: style.top - 86, left: style.left - 116 }}>
        <div className={styles.middle}>
          <div className={styles.title} title="spaceQueryTitle">
            <span>周边查询</span>          <div className={styles.close} onClick={handleClose}>×</div>
          </div>
          <div className={styles.content}>
            <input className={styles.input} placeholder="请输入关键字" onChange={handleChange} />
            <button className={styles.btn} onClick={handleSearch} title="search">搜索</button>
            <div className={styles.options}>
              {optinns.map(item =>
                <span key={item.key} onClick={handleSearch} title={item.param}>{item.title}</span>
              )}
            </div>
          </div>
        </div>
        <div
          className={styles.bottom}
          style={{ left: 120,
            bottom: -5 }}
        />
        <div
          className={styles['bottom-border']}
          style={{ left: 120,
            bottom: -6 }}
        />
        <div className={styles.circle} style={{ left: 116, bottom: -12 }} />
      </div>
    ) : null
  );
};
export default connect(mapStateToProps)(SpaceQuery);
