// import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';

const MapSwitch = ({ dispatch }) => {
  const switchMap = (e) => {
    const title = Number(e.target.title);
    let trueMapshow;
    switch (title) {
      case 0: trueMapshow = false; break;
      case 1: trueMapshow = true; break;
      default: return;
    }
    dispatch({
      type: 'map/trueMapShow',
      payload: trueMapshow,
    });
    dispatch({
      type: 'map/mapPoint',
      payload: '',
    });
  };
  return (
    <div className={styles.warp} onClick={switchMap}>
      <div className={styles['arc-map']} title="0">地图</div>
      <div className={styles['arc-map']} title="1" >实景</div>
    </div>
  );
};
export default connect()(MapSwitch);
