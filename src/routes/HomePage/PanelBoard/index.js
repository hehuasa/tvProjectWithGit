import React, { PureComponent } from 'react';
import { Route } from 'dva/router';
import { connect } from 'dva';
import { Collapse, Icon } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { panelData } from './dynamicWrapper';
import HeaderPanel from './HeaderPanel';
import { constantlyPanelModal } from '../../../services/constantlyModal';
import styles from './index.less';

const titleColor = '#000';
const { Panel } = Collapse;
@connect(({ panelBoard, map, alarm }) => {
  return {
    panelBoard,
    map: map.mainMap,
    iconArray: alarm.iconArray,
  };
})
export default class PanelBoard extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'panelBoard/getList',
    });
    this.props.dispatch({
      type: 'panelBoard/getConstantlyPanelModal',
    });
  }
  iconImg = (key) => {
    switch (key) {
      case 1:
        return 'arrows-alt';
      case 2:
        return 'table';
      case 3:
        return 'bar-chart';
      case 4:
        return 'pie-chart';
      case 5:
        return 'line-chart';
      case 6:
        return 'icon-62';
      default:
        return '';
    }
  };
  handleClick = (e) => {
    e.stopPropagation();
    const { dispatch, panelBoard } = this.props;
    const { activeKeys, expandKeys } = panelBoard;
    if (expandKeys.length === 0) {
      const expands = [];
      for (const item of activeKeys) {
        expands.push(item.keys);
      }
      dispatch({
        type: 'panelBoard/queryList',
        payload: { expandKeys: expands, activeKeys },
      });
    } else {
      dispatch({
        type: 'panelBoard/queryList',
        payload: { expandKeys: [], activeKeys },
      });
    }
  };
  handChange = (activeKey) => {
    const { dispatch, panelBoard } = this.props;
    const { activeKeys } = panelBoard;
    dispatch({
      type: 'panelBoard/queryList',
      payload: { expandKeys: activeKey, activeKeys },
    });
  };
  render() {
    const { iconArray, map, panelBoard } = this.props;
    const { activeKeys, expandKeys } = panelBoard;
    return (
      <Scrollbars>
        <div className={styles['side-header']} onClick={this.handleClick} >
          <span>数据展示</span>
          {expandKeys.length === 0 ? <Icon type="up" className={styles['data-heading']} /> : <Icon type="down" className={styles['data-heading']} />}
        </div>
        <Collapse
          bordered={false}
          onChange={this.handChange}
          activeKey={expandKeys}
        >
          {activeKeys.map((item) => {
            const Component = panelData[item.name].component;
            return (
              panelData[item.name] ? (
                <Panel
                  header={
                    <HeaderPanel
                      // isCollapse={(expandKeys.indexOf(item.name) === -1)}
                      // name={panelData[item.name].name}
                      map={map}
                      iconArray={iconArray}
                      id={panelData[item.name].id}
                      title={item.param.title}
                      keys={item.keys}
                      name={item.name}
                      iconStyle={panelData[item.name].iconStyle}
                      iconImg={key => this.iconImg(key)}
                    />
                  }
                  key={item.keys}
                  showArrow={false}
                >
                  <div style={{ position: 'relative' }}>
                    <Route
                      render={props =>
                        (
                          <Component
                            {...props}
                            param={item.param}
                            uniqueKey={item.uniqueKey}
                            type={item.type}
                            keys={item.keys}
                            titleColor={titleColor}
                          />
                        )
                      }
                    />
                  </div>
                </Panel>
              ) : null
            );
          })}
        </Collapse>
      </Scrollbars>
    );
  }
}
