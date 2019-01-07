import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import MyIcon from '../../../components/MyIcon/MyIcon';
import { constantlyPanelModal } from '../../../services/constantlyModal';
import styles from './index.less';
import up from '../../../assets/envi/carousel-up.png';
import down from '../../../assets/envi/carousel-down.png';
import bar from '../../../assets/homePage/panel/bar.png';
import { delLayer } from '../../../utils/mapService';

const switchTitle = (title) => {
  let name = '';
  switch (Number(title)) {
    case 1: name = '放大'; break;
    case 2: name = '表格'; break;
    case 3: name = '柱状图'; break;
    case 4: name = '饼状图'; break;
    case 5: name = '折线图'; break;
    case 6: name = '柱状图1'; break;
    default: break;
  }
  return name;
};
const switchTitle1 = (name) => {
  let title = '';
  switch (name) {
    case '放大': title = 1; break;
    case '表格': title = 2; break;
    case '柱状图': title = 3; break;
    case '饼状图': title = 4; break;
    case '折线图': title = 5; break;
    case '柱状图1': title = 6; break;
    default: break;
  }
  return title;
};
class HeaderPanelData extends PureComponent {
  constructor(props) {
    super(props);
  }
  closePanel = (keys) => {
    const { iconArray, map, dispatch, panelBoard } = this.props;
    const { expandKeys, activeKeys } = panelBoard;
    const expandNames = expandKeys.filter(item => item !== keys);
    const activeNames = activeKeys.filter(item => item.keys !== keys);
    // 针对报警列表，单独做个判断，删除图标
    delLayer(map, ['缓存报警动画'], dispatch);
    clearInterval(iconArray[0]);
    this.props.dispatch({
      type: 'panelBoard/queryList',
      payload: { expandKeys: expandNames, activeKeys: activeNames },
    });
    delete constantlyPanelModal[keys];
    this.props.dispatch({
      type: 'panelBoard/saveConstantlyPanelModal',
      payload: constantlyPanelModal,
    });
  };
  //  添加一个面板，控制面板切换图形
  toggleIconPanel = (keys, type) => {
    const { activeKeys } = this.props.panelBoard;
    for (const item of activeKeys) {
      if (item.keys === keys) {
        item.type = type;
      }
    }
    this.props.dispatch({
      type: 'panelBoard/alterUniqueKey',
      payload: activeKeys,
    });
  };
  // 添加一个图标(一个图形)，需要添加一个toggleIconPanel
  handleClick = (e) => {
    e.stopPropagation();
    const targetTitle = switchTitle1(e.target.title || e.target.parentElement.title || e.target.parentElement.parentElement.title);
    // if (!e.target.title) {
    //   if (!e.target.parentElement.title) {
    //     console.log(e.target.parentElement.parentElement.title);
    //   }
    // }
    switch (Number(targetTitle)) {
      case 0:
        this.closePanel(this.props.keys);
        break;
      case 1:
        this.props.dispatch({
          type: 'sidebar/zoomIn',
          payload: {
            id: this.props.id,
            title: this.props.title,
          },
        });
        break;
      case 2:
        this.toggleIconPanel(this.props.keys, 'table');
        break;
      case 3:
        this.toggleIconPanel(this.props.keys, 'bar');
        break;
      case 4:
        this.toggleIconPanel(this.props.keys, 'pie');
        break;
      case 5:
        this.toggleIconPanel(this.props.keys, 'line');
        break;
      case 6:
        this.toggleIconPanel(this.props.keys, 'bar1');
        break;
      default:
        this.toggleIconPanel(this.props.keys, 'default');
        break;
    }
  };
  // 折叠标签的header
  render() {
    return (
      <div className={styles.headerStyle}>
        {this.props.panelBoard.expandKeys.find(value => value === this.props.keys) === undefined ?
          // <span className={styles.icon}><img alt="up" src={up} /></span> :
          // <span className={styles.icon}><img alt="down" src={down} /></span>
          <Icon type="up-circle" className={styles.icon} /> :
          <Icon type="down-circle" className={styles.icon} />
        }
        <span>{this.props.title}</span>
        <Icon type="close" className={styles['zoom-in']} style={{ fontSize: 18 }} data-type={0} onClick={this.handleClick} title={0} />
        {
          this.props.iconStyle.map((item) => {
            return item === 6 ? (
              // <div
              //   className={styles['zoom-in']}
              //   data-type={item}
              //   title={switchTitle(item)}
              //   key={item}
              //   onClick={this.handleClick}
              // ><img data-type={item} src={bar} alt="柱状图" />
              // </div>
              <MyIcon
                key={`icon${item}`
                }
                type={this.props.iconImg(item)
                }
                className={styles['zoom-in']}
                data-type={item}
                title={switchTitle(item)}
                onClick={this.handleClick}
              />
            ) : (
                <Icon
                  key={`icon${item}`
                  }
                  type={this.props.iconImg(item)
                  }
                  className={styles['zoom-in']}
                  data-type={item}
                  title={switchTitle(item)}
                  onClick={this.handleClick}
                />
              );
          }
          )
        }
      </div>
    );
  }
}
const HeaderPanel = connect(
  ({ panelBoard }) => ({ panelBoard })
)(HeaderPanelData);
export default HeaderPanel;

