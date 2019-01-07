import React, { PureComponent } from 'react';
import styles from './index.less';

export default class LeftTitle extends PureComponent {
  render() {
    const { title } = this.props;
    const dom = title ? title.split('').map(item => <div key={Math.random() * Math.random()}>{item}</div>) : null;
    console.log(511,  dom)
    return (
      <div className={styles.warp}>
        { dom }
      </div>

    );
  }
}
