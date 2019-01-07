import React from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import styles from './index.less';

const mapStateToProps = ({ map }) => {
  const { infoWindow } = map;
  return {
    style: infoWindow.style,
    show: infoWindow.show,
  };
};
const SimpleInfo = ({ style, dispatch, attributes, show }) => {
  const handleClick = () => {
    dispatch({
      type: 'map/infoWindow',
      payload: { show: false, load: false },
    });
  };
  const name = attributes.name || attributes['设备名称'] || attributes['建筑名称'] || attributes['罐区名称'] || attributes['区域名称'] || attributes['装置区名称'] || attributes['名称'];
  if (show) {
    style.width = name.length * 14 + 24 + 24 + 8;
  }
  return (
    show ? (
      <div className={styles.simpleInfo} style={style}>
        <span>{name}</span>
        <Icon type="close" style={{ cursor: 'pointer', marginTop: 0 }} onClick={handleClick} />
        <div
          className={styles.bottom}
          style={{ left: '50%',
          bottom: -5 }}
        />
      </div>
    ) : null
  );
};
export default connect(mapStateToProps)(SimpleInfo);
