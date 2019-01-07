import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { trueMapTem, transUnit, trueMapLocate } from '../../utils/mapService';
import { mapLayers, mapConstants } from '../../services/mapConstant';
import switchMap from '../../assets/map/map.jpg';
import weix from "../../assets/map/weix.png";
import maps from '../../assets/map/map.jpg';
import trueMap from "../../assets/map/truemap.jpg";

const { view, mainMap } = mapConstants;


const mapStateToProps = ({ homepage, map }) => {
  return {
    mapHeight: homepage.mapHeight,
    mapPoint: map.mapPoint,
    trueMapShow: map.trueMapShow,
    mainMap,
    mapView: view,
  };
};
@connect(mapStateToProps)
export default class TrueMap extends PureComponent {
  // changeSence = () => {
  //   const { mapPoint } = this.props;
  //   trueMap.showVisionByLngLat(mapPoint.x, mapPoint.y);
  // };
  componentWillMount() {
    this.props.dispatch({
      type: 'homepage/getMapHeight',
      payload: { domType: 'map' },
    }
    );
  }
  componentDidMount() {
    const trueMap = this.TME;
    // 实例化影像控件类
    window.showVisionByLngLat = () => {

    };
    // window.markerClickEvent = (markerInfo) => {
    //   console.log(markerInfo);
    // };
    // window.imageClickEvent = (imageID,x,y) => {
    //   console.log('imageClickEvent');
    //   console.log(imageID);
    //   console.log(x);
    //   console.log(y);
    //   trueMap.addMarkerForImage("123455","http://192.168.0.5:8008/Image3DMarkerService/GetMarkerSymbolFile/?Guid=&rnd=0.35921170515939593",x,y,0,[{ name: 'GUUD', value: '77442' }], 'string');
    // };
    // Flash控件加载完成时调用
    window.FlashInitEnd = () => {
      // 初始化Flash控件配置
      trueMap.setConfig('/flash/config.xml');

      // // 注册影像移动和转动时候的回调函数
      // truevision.registerImageMoveEvent('moveImage');
      // // // 注册影像缩放时的回调函数
      // truevision.registerImageZoomEvent('zoomImage');
      // truevision.showVisionByLngLat('showVisionByLngLat');
    };
    // Flash配置完成回调
    window.ConfigLoadEnd = () => {
      // 切换到arcgis地图传递过来的坐标
      const { mapPoint } = this.props;
      if (mapPoint.x) {
        transUnit(mapPoint, 0).then((res) => {
          const switchSence = setInterval(
            () => {
              if (trueMap.showVisionByLngLat) {
                setTimeout(() => {
                  trueMap.showVisionByLngLat(res.x, res.y);
                  // trueMap.registerMarkerClickEvent("markerClickEvent");
                  // trueMap.registerMouseClickEvent("imageClickEvent");
                  trueMap.setMarkerPopedom(true);
                }, 100);
                clearInterval(switchSence);
              }
            },
            100);
        });
      }
    };
    // 影像加载完成后的回调
    window.TVImageLoadEnd = () => {
      // 禁用播放、测量与标注按钮
      // trueMap.markerBtnEnabled(false);
      trueMap.measureEnabled(false);
      // trueMap.openPoiUI();
      trueMap.autoBtnEnabled(false);
      // changeSence()
    };
  }
  componentWillUnmount() {
    // 销毁为flash注册的事件
    const actions = ['showVisionByLngLat', 'FlashInitEnd', 'TVImageLoadEnd'];
    for (const action of actions) {
      window[action] = null;
    }
  }
  // switchMap = () => {
  //   const { view, mainMap } = mapConstants;
  //   const { dispatch } = this.props;
  //   const trueMap = this.TME;
  //   let roadLine;
  //   for (const layer of mapLayers.FeatureLayers) {
  //     if (Number(layer.layerType) === 4) {
  //       // 取出道路图
  //       roadLine = layer.mapLayerName;
  //       break;
  //     }
  //   }
  //   // 做个判断，看是否加载了地图
  //   if (Number(trueMap.getVisionInfo().X)) {
  //     transUnit(trueMap.getVisionInfo(), 1).then((point) => {
  //       dispatch({
  //         type: 'map/mapPoint',
  //         payload: point,
  //       });
  //       trueMapLocate(mainMap, view, roadLine, dispatch);
  //       trueMapTem(mainMap, view, point, dispatch);
  //     });
  //   } else {
  //     trueMapLocate(mainMap, view, roadLine, dispatch);
  //   }
  //   dispatch({
  //     type: 'map/trueMapShow',
  //     payload: false,
  //   });
  // };
    switchMap = (type) => {
        const { view, mainMap } = mapConstants;
        const { dispatch } = this.props;
        const switching = (showType) => {
              const trueMap = this.TME;
              let roadLine;
              for (const layer of mapLayers.FeatureLayers) {
                if (Number(layer.layerType) === 4) {
                  // 取出道路图
                  roadLine = layer.mapLayerName;
                  break;
                }
              }
              // 做个判断，看是否加载了地图
              if (Number(trueMap.getVisionInfo().X)) {
                transUnit(trueMap.getVisionInfo(), 1).then((point) => {
                  dispatch({
                    type: 'map/mapPoint',
                    payload: point,
                  });
                  trueMapLocate(mainMap, view, roadLine, dispatch);
                  trueMapTem(mainMap, view, point, dispatch);
                });
              } else {
                trueMapLocate(mainMap, view, roadLine, dispatch);
              }
              dispatch({
                type: 'map/trueMapShow',
                payload: false,
              });
            // trueMapLocate(mainMap, view, roadLine, dispatch);
            dispatch({
                type: 'map/trueMapShow',
                payload: false,
            });
            const tileLayer = mapConstants.mainMap.findLayerById('底图');
            const id = mapLayers.RasterLayers[0].id;
            const newLayer = mapConstants.baseLayer.findSublayerById(id);
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
                break;
            default: break;
        }
    };
  render() {
    const { trueMapShow } = this.props;
    return (
      <div id="flashContent" style={{ display: !trueMapShow ? 'none' : '', height: this.props.mapHeight }} className={styles.warp}>
          <div className={styles.switch}>
              <div className={styles.arcMap} onClick={() => { this.switchMap(1); }} ><img src={maps} alt="切换至地图" /></div>
              <div className={styles.arcMapHide} onClick={() => { this.switchMap(2); }}><img src={weix} alt="切换至卫星图" /></div>
              <div className={styles.arcMapHide} onClick={() => { this.switchMap(3); }} ><img src={trueMap} alt="切换至实景" /></div>
          </div>
        <embed
          type="application/x-shockwave-flash"
          src="/flash/TrueMapExplorer.swf"
          width="100%"
          height="100%"
          id="TME"
          name="TME"
          ref={(ref) => { this.TME = ref; }}
          bgcolor="#ffffff"
          quality="high"
          menu="false"
          wmode="windows"
          allowscriptaccess="always"
          allowFullScreen={true}
        />
      </div>
    );
  }
}
