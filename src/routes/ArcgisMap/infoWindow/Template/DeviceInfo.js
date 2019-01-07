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
const DeviceInfo = ({ style, dispatch, attributes, arrowDirection, arrowStyle }) => {
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
        <span className={styles.titleName}>设备信息</span>
        <span className={styles.close} onClick={handleClick}>X</span>
      </div>
      <div className={styles.content}>
        <Scrollbars>
          {
            attributesArray.map((item, i) => {
              return (
                <div key={`info${i}`} className={styles.contentItem}>
                  <div>{item[0] + '：'}</div>
                  <div>{item[1]}</div>
                </div>
              )
            })
          }
        </Scrollbars>
      </div>
      {/*
            <List className={styles.content}
                split= {false}
                dataSource={attributesArray}
                renderItem={item => (
                    <List.Item>
                        <Card title={item[0]}>{item[1]}</Card>
                    </List.Item>
                )}
            />
            */}
      <div
        className={styles[arrowDirection]}
        style={arrowStyle}
      />
    </div>
  );
};
export default connect(mapStateToProps)(DeviceInfo);
