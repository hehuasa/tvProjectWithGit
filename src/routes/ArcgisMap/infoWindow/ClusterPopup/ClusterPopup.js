import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Popover, Divider } from 'antd';
import { mapConstants } from '../../../../services/mapConstant';
import { createExtent } from '../../../../utils/mapService';
import styles from './index.less';

const mapStateToProps = ({ map }) => {
  return {
    infoPops: map.infoPops,
  };
};
class ClusterPopup extends PureComponent {
  handleClick = () => {
    const { popValue } = this.props;
    const { extent } = popValue;
    const { view } = mapConstants;
    createExtent(extent).then((newExtent) => {
      view.goTo({ extent: newExtent.expand(1.6) });
    });
  };
  render() {
    const { popValue } = this.props;
    const { style } = popValue;
    // 弹出式气泡窗内容
    const content = (
      <div style={{ color: '#fff' }}>
        { popValue.alarms.count > 0 ? (
          <div>
            {popValue.alarms.data.map((item) => {
              return (
                <div key={Math.random() * new Date().getTime()}>
                  <span>{item.name}:  </span><span className={styles.alarm}> {item.value}</span>
                </div>
              );
            })}
          </div>
        ) : <div /> }
        { popValue.devices.count > 0 && popValue.alarms.count > 0 ? (<Divider style={{ margin: '4px 0 2px 0' }} />) : null }
        { popValue.devices.count > 0 ? (
          <div>
            {popValue.devices.data.map((item) => {
            return (
              <div key={Math.random() * new Date().getTime()}>
                <span>{item.name}: </span><span className={styles.device}> {item.value}</span>
              </div>
            );
          })}
          </div>
) : <div /> }
      </div>
    );
    // 聚合气泡窗内容
    let count;
    if (popValue.alarms.count === 0) {
      count = (
        <div>
          <div className={styles.blueCircleOnly}>{popValue.devices.count}</div>
        </div>
      );
    } else if (popValue.devices.count === 0) {
      count = (
        <div>
          <div className={styles.redCircleOnly}>{popValue.alarms.count}</div>
        </div>
      );
    } else {
      count = (
        <div>
          <div className={styles.redCircle}>{popValue.alarms.count}</div>
          <div className={styles.blueCircle}>{popValue.devices.count}</div>
        </div>
      );
    }
    const warp = popValue.alarms.count === 0 && popValue.devices.count === 0 ? null : (
      <Popover content={content} placement="rightTop" overlayClassName={styles.pop}>
        <div className={styles.warp} style={style} onClick={this.handleClick}>
          { count }
        </div>
      </Popover>
    );
    return (
      <div>
        { warp }
      </div>
    );
  }
}
export default connect(mapStateToProps)(ClusterPopup);
