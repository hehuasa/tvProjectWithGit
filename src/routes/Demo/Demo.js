import React, { PureComponent } from 'react';
import styles from './index.less';

export default class Demo extends PureComponent {
  constructor() {
    super();
    this.state = {
      point1: { x: 100, y: 100 },
      point2: { x: 300, y: 50 },
    };
  }
  render() {
    const { point1, point2 } = this.state;
    const width = Math.abs(point2.x - point1.x);
    const height = Math.abs(point2.y - point1.y);
    const one = {
      top: point1.y - height,
      left: point1.x,
      borderWidth: `${height}px ${height}px ${height}px 0`,
    };
    const oneSpan = { borderWidth: `${height}px ${height}px ${height}px 0`, top: -height + 1 };
    const two = {
      top: point2.y,
      left: point2.x - width + height,
      width: width - height,
    };
    return (
      <div className={styles.warp}>
        <div className={styles.one} style={one} >
          <span style={oneSpan} />
        </div>
        <div className={styles.two} style={two} />
      </div>
    );
  }
}
