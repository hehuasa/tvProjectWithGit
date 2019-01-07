import React, { PureComponent } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import Trees from './Trees';

export default class ResourceTree extends PureComponent {
  handleContextMenu= (e) => {
    e.preventDefault();
  };
  handClick = () => {
    this.props.dispatch({
      type: 'resourceTree/getContext',
      payload: { show: false },
    });
  };
  render() {
    return (
      <Scrollbars onContextMenu={this.handleContextMenu} style={{ paddingTop: 20, height: '100%' }} onClick={this.handClick}>
        <Trees />
      </Scrollbars>
    );
  }
}

