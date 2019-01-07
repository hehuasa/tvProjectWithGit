import React, { PureComponent } from 'react';
import styles from './index.less';


export default class PanelHead extends PureComponent {
  render() {
    const { title, isHeader } = this.props;
    return (
      <div className={isHeader ? styles.headerStyle1 : styles.headerStyle}>
        <span>{title}</span>
      </div>
    );
  }
}
