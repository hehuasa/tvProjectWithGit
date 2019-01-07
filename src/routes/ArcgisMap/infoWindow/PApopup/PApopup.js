import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import styles from './index.less';

export default class PAPopup extends PureComponent {
  handleClick = () => {
    const { dispatch, data } = this.props;
    dispatch({
      type: 'map/queryPABordInfo',
      payload: data.attributes,
    });
    dispatch({
      type: 'resourceTree/saveCtrlResourceType',
      payload: 'paSystem',
    });
  };
  render() {
    const { style } = this.props.data;
    return (
      <div style={style} className={styles.warp} onClick={this.handleClick}>
        <div className={styles.wave}>
          <div className={styles.circle} />
          <div className={styles.device}>
            <Icon type="bell" />
          </div>
        </div>
      </div>
    );
  }
}

