import React, { PureComponent } from 'react';
import ClusterPopup from '../../../../components/ClusterPopup/ClusterPopup';
import styles from './index.less';
import { addPopupHover, createExtent } from '../../../../utils/mapService';
import { mapConstants } from '../../../../services/mapConstant';

const circleBackground = '#e6111d';
export default class AlarmClusterPopup extends PureComponent {
  handleClick = () => {
    const { popValue } = this.props;
    const { attributes } = popValue;
    const { extent } = attributes;
    const { view } = mapConstants;
    createExtent(extent).then((newExtent) => {
      view.goTo({ extent: newExtent.expand(1.6) });
    });
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
    const { style, alarms } = attributes;
    // 弹出式气泡窗内容
    const content = (
      <div style={{ color: '#fff' }}>
        { alarms.count > 0 ? (
          <div>
            {alarms.data.map((item) => {
              return (
                <div key={item.name}>
                  <span>{item.name}:  </span><span className={styles.alarm}> {item.value}</span>
                </div>
              );
            })}
          </div>
        ) : <div /> }
      </div>
    );
    return (
      <ClusterPopup
        count={alarms.count}
        circleBackground={circleBackground}
        content={content}
        style={style}
        handleClick={this.handleClick}
        handleMouseOver={this.handleMouseOver}
        handleMouseOut={this.handleMouseOut}
      />
    );
  }
}
