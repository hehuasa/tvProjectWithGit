import React, { PureComponent } from 'react';
import { Socket } from '../../utils/Socket';

export default class Webscoket extends PureComponent {
  componentDidMount() {
    const { onmessage, socketUrl, currentUser, alarmList } = this.props;
    const socket = new Socket({ onmessage, socketUrl, currentUser, alarmList });
  }
  render() {
    return (null);
  }
}

// const Webscoket = ({ onmessage, socketUrl, currentUser }) => {
//   // console.log(onmessage);
//   const socket = new Socket({ onmessage, socketUrl, currentUser });
//   return (
//     ''
//   );
// };
// export default connect()(Webscoket);
