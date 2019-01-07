import React from 'react';
import styles from './index.less';

export default class Progress extends React.PureComponent {
  render() {
    const { bgColor, progressColor, percent } = this.props;
    const newPercent = percent > 100 ? percent / 2 : percent;
    return (
      <div className={styles.warp}>
        <div className={styles.bg} style={{ background: bgColor, width: percent > 100 ? '50%' : '100%' }} />
        <div className={styles.progress} style={{ background: progressColor, width: `${newPercent}%` }} />
      </div>
    );
  }
}
