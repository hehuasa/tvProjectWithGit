import React, { Component } from 'react';
import { message } from 'antd';
import styles from './index.less';
import { hoveringAlarm } from '../../../../utils/mapService';



export default class EnvIcon extends Component {
  handleClick = (env, iconIndex) => {
    const { dispatch, envIconData, infoPops } = this.props;
    const { geometry, gISCode } = env;
  hoveringAlarm({ geometry, alarm: env, dispatch, infoPops, iconData: envIconData, iconIndex, iconDataType: 'env' });
    dispatch({
      type: 'resourceTree/selectByGISCode',
      payload: { gISCode },
    }).then(() => {
      if (this.props.resourceInfo === undefined) {
        message.error('未请求到资源相关数据');
      }
    });
};
  render() {
    const { envIconData } = this.props;
    const popups = envIconData.map((item, index) => {
      const style = { ...item.style };
      return (

        <div key={item.key} className={ item.isSelected ? styles.selected : styles.warp } style={style} onClick={() => this.handleClick(item, index)}>
          <div className={styles.value} style={{ background: item.isAlarm ? '#e6111d' : '#2dc12d' }}>{item.value}</div>
          {/*<div className={ item.isSelected ? styles.selected : null } />*/}
        </div>
      )
    });
    return (
      <div>
        { popups }
      </div>
    );
  }
}
