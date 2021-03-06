import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { connect } from 'dva';
import { select, measure, clearLayer } from '../../../utils/mapService';
import { mapConstants } from '../../../services/mapConstant';
import styles from './index.less';
import MyIcon from '../../../components/MyIcon/MyIcon';

// 地图工具函数
@connect(({ map, homepage, mapRelation }) => {
  const { layerIds, scale, legend, legendLayer, stopPropagation } = map;
  const layerids = JSON.parse(JSON.stringify(layerIds));
  return {
    scale,
    layerids,
    legend,
    legendLayer,
    toolsBtnIndex: mapRelation.toolsBtnIndex,
    stopPropagation,
    markShow: mapRelation.markShow,
    popupShow: mapRelation.popupShow,
    mapHeight: homepage.mapHeight,
  };
})
export default class MapTools extends PureComponent {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      layerListShow: false,
      showLegend: false,
      showMeasure: '',
      meters: 0,
      areas: 0,
    };
  }
  handleClick=(e) => {
    const { mainMap, view, extent } = mapConstants;
    const mapView = view;
    const { dispatch, stopPropagation, toolsBtnIndex } = this.props;
    const { showLegend } = this.state;
    if (stopPropagation) {
      return false;
    }
    console.log('@time-color')
    let title;
    (e.target.title) ? { title } = e.target : e.target.parentNode.title ? { title } = e.target.parentNode : { title } = e.target.parentNode.parentNode;
    switch (title) {
      case '放大':
        mapView.goTo({ scale: mapView.scale - 1000 });
        break;
      case '缩小':
        mapView.goTo({ scale: mapView.scale + 1000 });
        break;
      case '测距':
        dispatch({
          type: 'mapRelation/queryToolsBtnIndex',
          payload: toolsBtnIndex === 0 ? -1 : 0,
        });
        if (toolsBtnIndex !== 0) {
          this.setState({
            showMeasure: 'polyline',
          });
          measure(mainMap, mapView, 'polyline', dispatch, this.handleMeasure);
        } else {
          clearLayer(mainMap, dispatch);
          this.setState({
            showMeasure: '',
          });
        }
        break;
      case '测面积':
        clearLayer(mainMap, dispatch);
        dispatch({
          type: 'mapRelation/queryToolsBtnIndex',
          payload: toolsBtnIndex === 1 ? -1 : 1,
        });
        if (toolsBtnIndex !== 1) {
          this.setState({
            showMeasure: 'polygon',
          });
          measure(mainMap, mapView, 'polygon', dispatch, this.handleMeasure);
        } else {
          this.setState({
            showMeasure: '',
          });
        }
        break;
      case '圈选':
        clearLayer(mainMap, dispatch);
        dispatch({
          type: 'mapRelation/queryToolsBtnIndex',
          payload: toolsBtnIndex === 2 ? -1 : 2,
        });
        if (toolsBtnIndex !== 2) {
          this.setState({
            showMeasure: 'select',
          });
          select({ map: mainMap, view: mapView, dispatch, handleMeasure: this.handleMeasure });
        } else {
          this.setState({
            showMeasure: '',
          });
        }
        break;
      case '图例':
        this.setState({
          showLegend: !showLegend,
        });
        this.props.showLegend();
        break;
      case '图层':
        this.setState({ layerListShow: !this.state.layerListShow });
        break;
      case '还原':
        mapView.goTo({ extent });
        break;
      case '标绘': {
        dispatch({
          type: 'mapRelation/showMark',
          payload: { load: this.props.markShow.load, show: true },
        });
        dispatch({
          type: 'mapRelation/showPopup',
          payload: false,
        });
        this.setState({
          showLegend: false,
        });
        const markLayer = mainMap.findLayerById('地图标注');
        if (markLayer) {
          markLayer.visible = false;
        }
      }
        break;
      default: break;
    }
  };
  handleMeasure = (key, value) => {
    this.setState({
      [key]: value,
    });
  };
  render() {
    const { stopPropagation, toolsBtnIndex } = this.props;
    const { showLegend, meters, areas, showMeasure } = this.state;
    return (
      <div>
        <div className={styles.tools} onClick={this.handleClick} style={{ zIndex: stopPropagation ? -1 : null }}>
          <div title="放大"><Icon type="zoom-in" /></div>
          <div title="缩小"><Icon type="zoom-out" /></div>
          <div title="圈选" style={{ background: toolsBtnIndex === 2 ? '#999' : '' }}><MyIcon type="icon-weixuanzhongyuanquan" title="圈选"/></div>
          <div title="测距" style={{ background: toolsBtnIndex === 0 ? '#999' : '' }}><MyIcon type="icon-ruler" title="测距"/></div>
          <div title="测面积" style={{ background: toolsBtnIndex === 1 ? '#999' : '' }}><MyIcon type="icon-mianji" title="测面积"/></div>
          <div title="图例" style={{ background: showLegend ? '#999' : '' }} ><MyIcon type="icon-tuceng" title="图例"/></div>
          {/*<div title="标绘"><Icon title="标绘" type="highlight" /></div>*/}
          <div title="还原"><MyIcon type="icon-78" title="还原"/></div>
        </div>
        { showMeasure ? (
          <div className={styles.measure}>
            { showMeasure === 'polyline' || showMeasure === 'polygon' ?
              <div>
                <h4>单击开始测量，双击结束测量</h4>
                { showMeasure === 'polyline' ? <div>距离：{meters}</div> : null }
                { showMeasure === 'polygon' ? <div>面积：{areas}</div> : null }
              </div> : null }
            { showMeasure === 'select' ? <h4>单击确定搜索中心与筛选范围</h4> : null }
            { showMeasure === 'spaceQuery' ? <h4>拖动圆心平移圆圈，拖动边缘按钮缩放圆圈</h4> : null }
          </div>
) : null }
      </div>
    );
  }
}
