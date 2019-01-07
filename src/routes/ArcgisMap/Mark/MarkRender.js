import React, { PureComponent } from 'react';
import styles from './index.less';

const { G6 } = window;
export default class MarkRender extends PureComponent {
  componentDidMount() {
    const { data } = this.props;
    const graph = new G6.Graph({
      container: this.canvas,
    });
    const newData = { ...data };
     if (newData.points) {
       newData.points = JSON.parse(JSON.stringify(data.points)); // 临时处理深浅拷贝
     }

    newData.x = 1;
    newData.y = 1;
    if (newData.shape === 'custom_PolyLine' || newData.shape === 'custom_ArrowWithPolyLine'|| newData.shape === 'customLine') {
      const { minX, minY } = newData.box;
      for (const point of newData.points) {
        point[0] -= minX;
        point[1] -= minY;
      }
    }
    // 有边
    if (newData.hasEdge) {
      const nodes = [newData.source[0], newData.target[0]];
      graph.read({ nodes, edges: [newData.edge] });
    } else {
      graph.read({ nodes: [newData] });
    }
  }
  render() {
    const { data } = this.props;
    const { box } = data;
    const { width, height, minX, minY } = box;
    const style = {
      top: Math.ceil(minY - 1),
      left: Math.ceil(minX - 1),
      width: Math.ceil(width + 2),
      height: Math.ceil(height + 2),
    };
    return (
      <div className={styles.renderWarp} style={style} >
        <div className={styles.canvas} ref={(ref) => { this.canvas = ref; }} />
      </div>
    );
  }
}
