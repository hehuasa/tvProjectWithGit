import React, { PureComponent } from 'react';
import { Pagination, message } from 'antd';
import { connect } from 'dva';
import { addSearchIcon, changeIcon } from '../../../../utils/mapService';
import styles from '../../Sraech/index.less';
import locateHover from '../../../../assets/map/search/locate.png';
import locate from '../../../../assets/map/search/locate-hover.png';
import { mapConstants } from '../../../../services/mapConstant';

const mapStateToProps = ({ map, resourceTree }) => {
  const { searchDeviceArray, isRecenter } = map;
  return {
    searchDeviceArray,
    isRecenter,
    resourceTree,
  };
};
class SearchResult extends PureComponent {
  state = {
    lists: [],
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
  };
  componentDidMount() {
    const { searchDeviceArray, dispatch, isRecenter } = this.props;
    const { view, mainMap } = mapConstants;
    if (searchDeviceArray.length !== 0) {
      const lists = searchDeviceArray.slice(0, 5);
      this.setState({
        lists,
      });
      addSearchIcon(mainMap, view, lists, dispatch, isRecenter);
    } else {
      // addSearchIcon(mainMap, mapView, [], dispatch, isRecenter);
    }
  }
  handleChange = (page, pageSize) => {
    const { searchDeviceArray, dispatch, isRecenter } = this.props;
    const { view, mainMap } = mapConstants;
    const lastPage = page - 1;
    const sliceStart = lastPage * pageSize;
    const lists = searchDeviceArray.slice(sliceStart, sliceStart + pageSize);
    this.setState({
      lists,
    });
    //  添加定位标
    addSearchIcon(mainMap, view, lists, dispatch, isRecenter);
  };
  handleMouseOver = (index) => {
    const { mainMap } = mapConstants;
    this.setState({
      [index]: true,
    });
    changeIcon(mainMap, '地图搜索结果', index, 'resultId', 'locateHover');
  };
  handleMouseLeave= (index) => {
    const { mainMap } = mapConstants;
    this.setState({
      [index]: false,
    });
    changeIcon(mainMap, '地图搜索结果', index, 'resultId', 'locate');
  };
  handleClick = (item) => {
    const { view, mainMap } = mapConstants;
    const { dispatch } = this.props;
    // 根据ObjCode 作为giscode 请求资源数据
    const { attributes } = item.feature;
    const gISCode = attributes.ObjCode || attributes['唯一编码'];
    dispatch({
      type: 'resourceTree/selectByGISCode',
      payload: { pageNum: 1, pageSize: 1, isQuery: true, fuzzy: false, gISCode, attributes },
    }).then(() => {
      if (this.props.resourceTree.resourceInfo === undefined || this.props.resourceTree.resourceInfo === {}) {
        message.error('未请求到资源相关数据');
      } else {
        // 返回搜索列表区域
        dispatch({
          type: 'map/mapBoardShow',
          payload: { backResult: true },
        });
      }
    });
    // 首先清除弹窗
    dispatch({
      type: 'map/trueMapShow',
      payload: false,
    });
    // 居中并弹窗
    view.goTo({ center: item.feature.geometry }).then(() => {
      const screenPoint = mainMap.toScreen(item.feature.geometry);
      dispatch({
        type: 'map/showInfoWindow',
        payload: { show: true, type: 'simpleInfo', screenPoint, mapStyle: { width: mainMap.width, height: mainMap.height }, attributes: item.feature.attributes },
      });
    });
  };
  getSecContent = (feature) => {
    let content = '设备编号:  /';
    const { attributes } = feature;
    const parms = ['设备位置', '设备编号'];
    for (const item of parms) {
      if (attributes[item]) {
        content = `${item}:  ${attributes[item]}`;
        break;
      }
    }
    return content;
  }

  render() {
    const { searchDeviceArray } = this.props;
    return (
      searchDeviceArray !== null && searchDeviceArray.length > 0 ? (
        <div className={styles.searchResult}>
          {this.state.lists.map((item, index) => {
          return (
            <div
              key={item.feature.geometry.x}
              onMouseOver={() => { this.handleMouseOver(index); }}
              onMouseLeave={() => { this.handleMouseLeave(index); }}
              onClick={() => { this.handleClick(item); }}
            >
              <div className={styles.img}>
                {this.state[index] ? <img alt="定位示意(鼠标进入)" src={locateHover} /> : <img alt="定位示意" src={locate} />}
                <div>{`${index + 1}`}</div>
              </div>
              <div>
                <div className={styles.resultName}>{item.feature.attributes['设备名称'] === '空' ? item.feature.attributes['设备类型'] : item.feature.attributes['设备名称']}</div>
                <div>{this.getSecContent(item.feature)}</div>
              </div>
            </div>
          );
        })}
          <Pagination
            total={searchDeviceArray.length}
            showTotal={total => `共 ${Math.ceil(total / 5)}页`}
            defaultPageSize={5}
            defaultCurrent={1}
            onChange={this.handleChange}
            size="small"
            hideOnSinglePage
          />
        </div>
      ) : <div className={styles.searchResult} style={{ marginLeft: 8 }}>搜索结果为空</div>);
  }
}
export default connect(mapStateToProps)(SearchResult);
