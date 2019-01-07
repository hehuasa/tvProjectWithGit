import React, { PureComponent } from 'react';
import { Input, Icon, Divider, Spin } from 'antd';
import { connect } from 'dva';
import Ellipsis from '../../../components/Ellipsis';
import styles from './index.less';
import { mapLayers, mapConstants } from '../../../services/mapConstant';
import fire from '../../../assets/map/search/火灾探测.png';
import gas from '../../../assets/map/search/燃气探测.png';
import firefighting from '../../../assets/map/search/消防设施.png';
import evr from '../../../assets/map/search/环保设施.png';
import quality from '../../../assets/map/search/质量设施.png';
import video from '../../../assets/map/search/工业视频.png';

const { Search } = Input;
// 获取本地存储的搜索历史
// let history = localStorage.getItem('searchHistory');
// if (history === null || history === '') {
//   const array = [];
//   localStorage.setItem('searchHistory', JSON.stringify(array));
//   history = JSON.parse(localStorage.getItem('searchHistory'));
// } else {
//   history = JSON.parse(history);
// }
// const editHistory = (value, that) => {
//   const arrays = JSON.parse(localStorage.getItem('searchHistory'));
//   // 去重
//   if (arrays.find(item => item === value)) {
//     return false;
//   }
//   arrays.push(value);
//   if (arrays.length > 5) {
//     arrays.shift();
//   }
//   localStorage.setItem('searchHistory', JSON.stringify(arrays));
//   that.setState({ history: arrays });
// };
// 搜索分组的id数组
const ids = [];
const layers = {
  searchType: 'all',
  fireLayers: [],
  gasLayers: [],
  ctrlLayers: [],
  evaLayers: [],
  quaLayers: [],
  videoLayers: [],
};
const mapStateToProps = ({ map, resourceTree, loading }) => {
  const { searchResult, searchDeviceArray, searchHistory } = map;
  return {
    searchResult,
    searchDeviceArray,
    searchHistory,
    resourceTree,
    fetchLayers: loading.effects['map/fetchLayers'],
  };
};
let onblur; // 失焦函数的id
class SearchBox extends PureComponent {
  state = {
    loading: false,
    showOption: false,
    opacity: 0,
    visibility: 'hidden',
    searchText: '',
    optionCheck: '',
  };
  componentDidMount() {
    const { dispatch } = this.props;
    let getAlarm = setInterval(() => {
      if (!this.props.fetchLayers) {
        clearInterval(getAlarm);
        getAlarm = null;
        // 获取到报警数据后，渲染图标ddd
        setTimeout(() => {
          for (const layer of mapLayers.FeatureLayers) {
            const index = layer.layerAddress.indexOf('MapServer/');
            const order = layer.layerAddress.substr(index + 10);
            switch (Number(layer.layerType)) {
              case 21:
                layers.fireLayers.push(order);
                break;
              case 22:
                layers.gasLayers.push(order);
                break;
              case 23:
                layers.ctrlLayers.push(order);
                break;
              case 24:
                layers.evaLayers.push(order);
                break;
              case 25:
                layers.quaLayers.push(order);
                break;
              case 26:
                layers.videoLayers.push(order);
                break;
              default: break;
            }
          }
        }, 2000);
      }
    }, 50);
    dispatch({
      type: 'map/editSearchText',
      payload: '',
    });
  }
  handleSearch = (value, hasOption) => {
    const { dispatch } = this.props;
    if (value === '') {
      this.setState({
        showOption: true,
      });
      return false;
    }
    this.setState({ loading: true });
    const payload = { searchText: value, layerIds: layers[layers.searchType], searchFields: ['设备名称', '设备位置', '所在单元', '分部名称', '主项名称', '装置名称', '分区名称', 'ObjCode'] };
    if (!hasOption) {
      delete payload.layerIds;
    }
    // 编辑历史搜索数据
    dispatch({
      type: 'map/editSearchText',
      payload: value,
    });
    // 执行搜索，首先清空value
    dispatch({
      type: 'map/getRecenter',
      payload: false,
    });
    // dispatch({
    //   type: 'map/saveSearchText',
    //   payload: value,
    // });
    dispatch({
      type: 'resourceTree/saveCtrlResourceType',
      payload: '',
    });
    dispatch({
      type: 'map/searchDeviceByAttrSorting',
      payload,
    }).then(() => {
      this.setState({ loading: false });
      if (this.props.searchDeviceArray.length === 0) {
        const { mainMap } = mapConstants;
        mainMap.remove(mainMap.findLayerById('地图搜索结果'));
      }
      dispatch({
        type: 'resourceTree/saveCtrlResourceType',
        payload: 'searchResult',
      });
    });
  };
  handleSearchOption = (e) => {
    const { searchText } = this.state;
    ids.splice(0, ids.length);
    clearTimeout(onblur);
    switch (e.target.title) {
      case '火灾探测':
        layers.searchType = 'fireLayers';
        this.handleSearch(searchText, true);
        break;
      case '燃气探测':
        layers.searchType = 'gasLayers';
        this.handleSearch(searchText, true);
        break;
      case '消防设施':
        layers.searchType = 'ctrlLayers';
        this.handleSearch(searchText, true);
        break;
      case '环保设施':
        layers.searchType = 'evaLayers';
        this.handleSearch(searchText, true);
        break;
      case '质量设施':
        layers.searchType = 'quaLayers';
        this.handleSearch(searchText, true);
        break;
      case '工业视频':
        layers.searchType = 'videoLayers';
        this.handleSearch(searchText, true);
        break;
      default: break;
    }
  };
  handleFocus = () => {
    this.setState({
      showOption: true,
    });
    setTimeout(() => {
      this.setState({
        opacity: 1,
        visibility: 'visible',
      });
    }, 1);
  };
  handleBlur = () => {
    // 延缓失焦函数运行
    onblur = setTimeout(() => {
      this.setState({
        showOption: true,
        opacity: 0,
        visibility: 'hidden',
      });
    }, 200);
  };
  handleChange = (e) => {
    const searchText = e.target.value;
    this.setState(
      { searchText }
    );
    if (e.target.value === '') {
      this.emitEmpty();
    }
  };
  emitEmpty = () => {
    const { mainMap } = mapConstants;
    const { dispatch } = this.props;
    this.searchInput.focus();
    this.setState({
      searchText: '',
    });
    // dispatch({
    //   type: 'map/saveSearchText',
    //   payload: '',
    // });
    mapConstants.spaceQueryPolygon = {};
    dispatch({
      type: 'map/getDeviceArray',
      payload: null,
    });
    dispatch({
      type: 'map/infoWindow',
      payload: { show: false, load: false },
    });
    // 关闭搜索结果面板 mapBoardShow
    this.props.dispatch({
      type: 'resourceTree/saveCtrlResourceType',
      payload: '',
    });
    this.props.dispatch({
      type: 'map/mapBoardShow',
      payload: false,
    });
    const array = ['地图搜索结果', '周边查询', '空间查询', '测量', '标注', '圈选'];
    for (const item of array) {
      const layer = mainMap.findLayerById(item);
      if (layer) {
        mainMap.remove(layer);
      }
    }
    dispatch({
      type: 'mapRelation/queryToolsBtnIndex',
      payload: -1,
    });
    clearTimeout(onblur);
  };
  handleClick = (item) => {
    clearTimeout(onblur);
    this.handleSearch(item);
    this.setState(
      { searchText: item }
    );
    this.searchInput.focus();
  };
  render() {
    const { searchDeviceArray, searchHistory } = this.props;
    const { showOption, opacity, optionCheck, searchText, visibility, loading } = this.state;
    const suffix = searchText !== '' || searchDeviceArray !== null ? <Icon type="close-circle" onClick={this.emitEmpty} style={{ marginRight: 8, cursor: 'pointer' }} /> : null;
    const options = (showOption && searchDeviceArray === null) ? (
      <div className={styles.option} style={{ opacity, visibility }}>
        <div className={styles.groups} onClick={this.handleSearchOption}>
          <div key={1} title="火灾探测"><img alt="火灾探测" title="火灾探测" src={fire} />火灾探测</div>
          <div key={2} title="燃气探测"><img alt="燃气探测" title="燃气探测" src={gas} />燃气探测</div>
          <div key={3} title="消防设施"><img alt="消防设施" title="消防设施" src={firefighting} />消防设施</div>
          <div key={4} style={optionCheck === '环保设施' ? null : null} title="环保设施"><img alt="环保设施" title="环保设施" src={evr} />环保设施</div>
          <div key={5} title="质量设施"><img alt="质量设施" title="质量设施" src={quality} />质量设施</div>
          <div key={6} title="工业视频"><img alt="工业视频" title="工业视频" src={video} />工业视频</div>
        </div>
        <Divider />
        {searchHistory.length > 0 ?
          <div className={styles.history}>
            {searchHistory.map((item) => {
              const that = this;
              return (
                <div
                  onClick={() => that.handleClick(item)}
                  key={Math.random() * new Date().getTime()}
                ><Icon type="clock-circle-o" />
                  <Ellipsis style={{ display: 'inline' }} key={Math.random() * new Date().getTime() * Math.random()} length={30} tooltip>{item}</Ellipsis>
                </div>
              );
            })}
          </div> :
          null
        }

      </div>
    ) : null;
    return (
      <div className={styles.searchBox} onBlur={this.handleBlur}>
        <Spin spinning={loading}>
        <Search
          onFocus={this.handleFocus}
          onChange={this.handleChange}
          placeholder="请输入关键字"
          onSearch={this.handleSearch}
          value={searchText}
          suffix={suffix}
          ref={(node) => { this.searchInput = node; }}
          enterButton
        />{options}
        </Spin>
      </div>
    );
  }
}
export default connect(mapStateToProps)(SearchBox);
