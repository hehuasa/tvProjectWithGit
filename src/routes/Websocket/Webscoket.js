import React, { PureComponent } from 'react';
import { Socket } from '../../utils/Socket';

export default class Webscoket extends PureComponent {
  componentDidMount() {
    const { onmessage, socketUrl, currentUser } = this.props;
    const socket = new Socket({ onmessage, socketUrl, currentUser, parent: this });
  }
  render() {
    return (null);
  }
}
