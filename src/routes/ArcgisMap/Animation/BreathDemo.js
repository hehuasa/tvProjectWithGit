import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { connect } from 'dva';
import styles from './animation.less';

const randomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
};
const mapStateToProps = ({ map }) => {
  return {
    left: map.breath.x,
    top: map.breath.y,
    color: randomColor(),
    show: map.breath.show,
  };
};

class BreathDemo extends PureComponent {
  render() {
    const { left, top, color, show } = this.props;

    return (
      (show) ? (
        <div style={{ left, top }} className={styles.warp}>
          <div className={styles.wave}>
            <div className={styles.circle} style={{ background: color }} />
            <div className={styles.device}>
              <Icon type="bell" />
            </div>
          </div>
        </div>
      ) : null


    );
  }
}

export default connect(mapStateToProps)(BreathDemo);
