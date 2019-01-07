import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import carouselRight from '../../../assets/homePage/carousel-right.png';
import carouselRightIn from '../../../assets/homePage/carousel-right-in.png';
import { mapConstants } from '../../../services/mapConstant';
import { getBordStyle } from '../../../utils/mapService';
@connect(({ global, video }) => {
  return {
    collapsed: global.rightCollapsed,
    video,
  };
})
export default class TriggerRight extends PureComponent {
  handleCollapsed = () => {
    const { dispatch, video, collapsed, domWarp } = this.props;
    let x;
    if (collapsed) {
      dispatch({
        type: 'video/reposition',
        payload: { left: video.padding.left, right: video.padding.right - 230 },
      });
      x = video.position.x - 230;
    } else {
      dispatch({
        type: 'video/reposition',
        payload: { left: video.padding.left, right: video.padding.right + 230 },
      });
      x = video.position.x + 230;
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
      type: 'global/changeRightCollapsed',
      payload: !this.props.collapsed,
    }).then(() => {
      const { view, accessInfoExtent } = mapConstants;
      if (view.height) {
        const width = domWarp.clientWidth;
        const a = setInterval(() => {
          if (domWarp.clientWidth !== width) {
            clearInterval(a);
            const { accessControlShow } = this.props;
            if (accessControlShow) {
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
        }, 500);
      }
    });
  };
  render() {
    const { collapsed } = this.props;
    return (
      <div className={styles.right}>
        {collapsed ?
          <img alt="右折叠" src={carouselRightIn} onClick={this.handleCollapsed} /> :
          <img alt="右折叠" src={carouselRight} onClick={this.handleCollapsed} />}
      </div>
    );
  }
}
