import React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { mapLegendList } from '../../../services/mapLegendList';
import styles from './index.less';

export default class Legend extends React.PureComponent {
  render() {
    const { legendIndex, mapHeight } = this.props;
    const lists = mapLegendList.map(item =>
      <div key={item.name} className={styles.row}><img src={item.url} alt={item.name} /><span>{item.name}</span></div>
    );
    return (
      <div className={styles.warp} style={{ zIndex: legendIndex }}>
        <Scrollbars style={{ width: '100%', height: mapHeight - 130 }}>
          <h3>图例</h3>
          { lists }
        </Scrollbars>
      </div>
    );
  }
}
