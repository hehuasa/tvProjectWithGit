import React, { PureComponent } from 'react';
import Trees from './Tree';

export default class OftenResourceTree extends PureComponent {
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
      <div onContextMenu={this.handleContextMenu} onClick={this.handClick}>
        <Trees />
      </div>
    );
  }
}

