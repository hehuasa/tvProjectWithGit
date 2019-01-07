import React from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import { mapConstants } from '../../../../services/mapConstant';
import styles from './index.less';

const mapStateToProps = ({ map }) => {
  const { infoWindow } = map;
  return {
    style: infoWindow.style,
    mainMap: mapConstants.mainMap,
  };
};
const TrueMap = ({ style, dispatch, mainMap }) => {
  const handleClick = () => {
    dispatch({
      type: 'map/infoWindow',
      payload: { show: false, load: false },
    });
    if (mainMap.findLayerById('实景实时位置')) {
      mainMap.remove(mainMap.findLayerById('实景实时位置'));
    }
  };
  return (
    <div className={styles.simpleInfo} style={style}>
      <span>刚才在这里</span>
      <Icon type="close" style={{ cursor: 'pointer', marginTop: 0 }} onClick={handleClick} />
      <div
        className={styles.bottom}
        style={{ left: '50%',
          bottom: -5 }}
      />
    </div>
  );
};
export default connect(mapStateToProps)(TrueMap);
