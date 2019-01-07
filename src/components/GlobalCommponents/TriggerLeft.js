import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import styles from './index.less';
import { getBordStyle } from '../../utils/mapService';
import { mapConstants } from '../../services/mapConstant';

@connect(({ global }) => {
  return {
    collapsed: global.collapsed,
  };
})
export default class TriggerLeft extends PureComponent {
  handleLeftCollapsed = () => {
    const { dispatch, video, collapsed, domWarp } = this.props;
    let x;
    if (collapsed) {
      dispatch({
        type: 'video/reposition',
        payload: { left: video.padding.left + 120, right: video.padding.right },
      });
      x = video.position.x + 120;
    } else {
      dispatch({
        type: 'video/reposition',
        payload: { left: video.padding.left - 120, right: video.padding.right },
      });
      x = video.position.x - 120;
    }
    dispatch({
      type: 'video/reposition',
      payload: {
        CmdCode: '10002',
        Point:
                  {
                    x,
                    y: video.position.y,
                  },
      },
    });
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !this.props.collapsed,
    });
    const { view, accessInfoExtent } = mapConstants;
    if (view.height) {
      const width = domWarp.clientWidth;
      const a = setInterval(() => {
        if (domWarp.clientWidth !== width) {
          clearInterval(a);
          const { accessControlShow } = this.props;
          if (accessControlShow) {
            if (view.height) {
              view.goTo({ extent: accessInfoExtent }).then(() => {
                getBordStyle(view).then((style) => {
                  dispatch({
                    type: 'accessControl/queryStyle',
                    payload: style,
                  });
                });
              });
            }
          }
        }
      }, 500);
    }
  };
  render() {
    return (
      <div className={styles['trigger-left']}>
        <span className={styles.title} style={{ opacity: this.props.collapsed ? '0' : '1' }}>资源与功能</span>
        <Icon className={styles.icon} onClick={this.handleLeftCollapsed} type={this.props.collapsed ? 'right-circle-o' : 'left-circle-o'} />
      </div>
    );
  }
}
