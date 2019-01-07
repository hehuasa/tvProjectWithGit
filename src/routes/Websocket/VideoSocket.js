import { connect } from 'dva';
import { SocketVideo } from '../../utils/Socket';

// export default class Webscoket extends PureComponent {
//   render() {
//     return
//   }
// }

const VideoSocket = ({ onmessage, socketUrl }) => {
  // console.log(onmessage);
  const socket = new SocketVideo({ onmessage, socketUrl });
  return (
    ''
  );
};
export default connect()(VideoSocket);
