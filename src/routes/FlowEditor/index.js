import React, { PureComponent } from 'react';
import Canvas from './Canvas';

export default class FlowEditor extends PureComponent {
  render() {
    return (
      <div>
        <Canvas functionInfo={this.props.functionInfo} />
      </div>
    );
  }
}
