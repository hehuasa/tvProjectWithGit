import React, { PureComponent } from 'react';
import ClusterPopup from '../../../../components/ClusterPopup/ClusterPopup';
import styles from './index.less';
import { addPopupHover } from '../../../../utils/mapService';

const circleBackground = '#296fce';
export default class ResourceClusterPopup extends PureComponent {
  handleClick = () => {
    return false;
  };
  handleMouseOver = () => {
    const { popValue } = this.props;
    const { attributes } = popValue;
    const { area } = attributes;
    addPopupHover(area, circleBackground);
  };
  handleMouseOut = () => {
    addPopupHover();
  };
  render() {
    const { popValue } = this.props;
    const { attributes } = popValue;
    const { style, devices } = attributes;
    // 弹出式气泡窗内容
    const content = (
      <div style={{ color: '#fff' }}>
        { devices.count > 0 ? (
          <div>
            {devices.data.map((item) => {
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
    return (
      <ClusterPopup count={devices.count} circleBackground={circleBackground} content={content} style={style} handleClick={this.handleClick} handleMouseOver={this.handleMouseOver} handleMouseOut={this.handleMouseOut} />
    );
  }
}
