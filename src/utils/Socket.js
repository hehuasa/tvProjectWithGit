

const Socket = ({ onmessage, currentUser, parent }) => {
  // console.log('currentUser', currentUser.baseUserInfo.userID);
  if (window.serviceUrl.socketUrl !== '') {
    const id = (Math.ceil(currentUser.baseUserInfo.userID * Math.random() * 100 * Math.random() * 10));
    // return new Sockette(`${window.serviceUrl.socketUrl}websocket?${id}`, {
    const socket = new WebSocket(`${window.serviceUrl.socketUrl}websocket?${id}`);
    // const socket = new WebSocket('ws://192.168.0.6:10048/websocket');
    socket.onmessage = (message) => {
      // console.log('socketMessage', message);
      const { data } = message;
      const socketMessage = JSON.parse(data);

      if (socketMessage.H.F === '501001') {
        window.socketAlarms.data.push(socketMessage);
        if (!window.socketAlarms.isDealing) {
          window.socketAlarms.isDealing = true;
          setTimeout(() => {
            // console.clear();
            onmessage(parent.props.alarmList);
          }, 200);
      }
    }
  };
  return socket;
}};

const SocketVideo = ({ onmessage }) => {
  const start = 10000; const end = 10050;
  const wsSrc = 'ws://127.0.0.1:';
  let socket;
  let loopIndex = 0;
  const array = [];
  let index = -1;
  let isConnect = false;
  const getArray = (num) => {
    index += 1;
    if (array.length < num) {
      array.push(index);
      getArray(num);
    }
  };
  let range = 0;
  const onerror = (e) => {
    e.target.close();
  };
  const onopen = (e) => {
    isConnect = true;
    SocketVideo.socket = e.target;
  };
  let port = start;
  const findSocket = () => {
    array.splice(0, array.length);
    getArray(range);
    loopIndex += 1;
    for (const item of array) {
      port = start + item;
      if (isConnect === true || port > end) {
        break;
      }
      socket = new WebSocket(`${wsSrc + port}`);
      socket.onerror = onerror;
      socket.onmessage = onmessage;
      socket.onopen = onopen;
    }
    setTimeout(() => {
      if (!isConnect && loopIndex < 5) {
        range = 10;
        findSocket();
      }
    }, 1000);
  };
  range = 10;
  findSocket();
  return socket;
};
export { Socket, SocketVideo };
