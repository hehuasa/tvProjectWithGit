import React, { PureComponent } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Trees from './Trees';
import styles from './ContextMenu/index.less';

export default class ResourceTree extends PureComponent {
  handleContextMenu = (e) => {
    e.preventDefault();
  };
  handClick = () => {
    this.props.dispatch({
      type: 'sysFunction/getContext',
      payload: { show: false },
    });
  };
  render() {
    return (
      <Scrollbars onContextMenu={this.handleContextMenu} className={styles.scrollbarsStyle} style={{ paddingTop: 20, height: '100%' }} onClick={this.handClick}>
        <Trees saveHeaderSelectText={this.props.saveHeaderSelectText} />
      </Scrollbars>
    );
  }
}

