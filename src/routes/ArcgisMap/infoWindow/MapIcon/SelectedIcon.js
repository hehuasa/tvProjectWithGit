import React, { Component } from 'react';
import styles from './index.less';


export default class SelectedIcon extends Component {
  render() {
    const { selectIconData } = this.props;
    const icon = selectIconData.map((item) => {
      return (
        <div className={styles.selsecticon} style={item.style} key={item.ObjCode} />
      );
    }

    );
    return (
      <div>
        { icon }
      </div>
    );
  }
}
