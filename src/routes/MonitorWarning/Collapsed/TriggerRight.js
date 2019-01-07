import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import carouselRight from '../../../assets/homePage/carousel-right.png';
@connect(({ global }) => {
  return {
    collapsed: global.rightCollapsed,
  };
})
export default class TriggerRight extends PureComponent {
  handleCollapsed = () => {
    this.props.dispatch({
      type: 'homepage/changeRightCollapsed',
      payload: !this.props.collapsed,
    });
  };
  render() {
    return (
      <div className={styles.right}>
        <img alt="右折叠" src={carouselRight} onClick={this.handleCollapsed} />
      </div>
    );
  }
}
