import React from 'react';
import { connect } from 'dva';
import { Rate } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import styles from './index.less';

const mapStateToProps = ({ map }) => {
  const { infoWindow } = map;
  const { arrowDirection, style, attributes, arrowStyle } = infoWindow;
  return {
    arrowDirection, style, attributes, arrowStyle,
  };
};
const WarnInfo = ({ style, dispatch, attributes, arrowDirection, arrowStyle }) => {
  const handleClick = () => {
    dispatch({
      type: 'map/infoWindow',
      payload: { show: false, load: false },
    });
  };
  const attributesArray = Object.entries(attributes);

  return (
    <div style={style} className={styles.deviceInfo}>
      <div className={styles.title}>
        <span className={styles.titleName}>可燃气报警</span>
        <Rate disabled count={3} value={3} className={styles.rate} />
        <span className={styles.frequency}>{`1次`}</span>
        <span className={styles.close} onClick={handleClick}>X</span>
      </div>
      <div className={styles.content}>
        <Scrollbars>
          {
            attributesArray.map((item, index) => {
              return (
                <div key={`attributesArray${index}`} className={styles.contentItem}>
                  <div>{item[0] + '：'}</div>
                  <div>{item[1]}</div>
                </div>
              )
            })
          }
        </Scrollbars>
      </div>
      <div
        className={styles.warnBottom}
        style={arrowStyle}
      />
    </div>
  );
};
export default connect(mapStateToProps)(WarnInfo);
