import React, { PureComponent } from 'react';
import { infoPopsModal } from '../../../../services/constantlyModal';
import styles from './index.less';

export default class AccessPopup extends PureComponent {
  render() {
    const { data } = this.props;
    const { style, name, in_, out } = data;
    return (
      <div className={styles.simpleInfo} style={style} >
          <span className={styles.name}>{name}</span>
        <div>
          <span>{in_}</span><span>{out}</span>
        </div>
        <div
          className={styles.bottom}
          style={{ left: '50%',
            bottom: -5 }}
        />
      </div>
    );
  }
}
