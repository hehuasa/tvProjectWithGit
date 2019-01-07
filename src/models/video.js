import { videoCtrl } from '../services/api';
import { SocketVideo } from '../utils/Socket';

const transLayout = ({ Layout, WindowCount }) => {
  let type;
  switch (Layout) {
    case 'Transverse': type = 'reset'; break; // 初始布局
    case 'Standard':
      if (WindowCount === '4') {
        type = 'arrange4'; break;
      } else {
        type = 'arrange9'; break;
      }
    case 'UnStandard': type = 'arrange6'; break;
    default: break;
  }
  return type;
};
export default {
  namespace: 'video',
  state: {
    show: false,
    size: {},
    position: {},
    padding: {
      left: 0,
      right: 0,
    },
    layout: 'reset',
    layoutCommand: {
      CmdCode: '10003',
      Layout: 'Transverse',
      WindowCount: '4',
    },
    link: {},
    ctrl: {},
    isLoaded: false,
    videoWarp: {},
  },

  effects: {
    *resize({ payload }, { put }) {
      yield put({
        type: 'getSize',
        payload: {
          width: payload.Size.Width,
          height: payload.Size.Height,
        },
      });
      // yield call(videoCtrl, payload);
      const a = setInterval(() => {
        if (SocketVideo.socket) {
          clearInterval(a);
          SocketVideo.socket.send(JSON.stringify(payload));
        }
      }, 50);
    },
    *reposition({ payload }, { put }) {
      yield put({
        type: 'getPosition',
        payload: {
          x: payload.Point.x,
          y: payload.Point.y,
        },
      });
      // yield call(videoCtrl, payload);
      const a = setInterval(() => {
        if (SocketVideo.socket) {
          clearInterval(a);
          SocketVideo.socket.send(JSON.stringify(payload));
        }
      }, 50);
    },
    *relayout({ payload }, { put }) {
      const layout = transLayout(payload);
      yield put({
        type: 'getLayout',
        payload: layout,
      });
      yield put({
        type: 'getLayoutCommand',
        payload,
      });
      // yield call(videoCtrl, payload);
      const a = setInterval(() => {
        if (SocketVideo.socket) {
          clearInterval(a);
          SocketVideo.socket.send(JSON.stringify(payload));
        }
      }, 50);
    },
    *play({ payload }, { select }) {
      const ptzPower = yield select(({ global }) => {
        return global.ptzPower;
      });
      payload.Power = ptzPower;
      console.log('视频播放的参数：', payload);
      const a = setInterval(() => {
        if (SocketVideo.socket) {
          clearInterval(a);
          SocketVideo.socket.send(JSON.stringify(payload));
        }
      }, 50);
    },
    *switch({ payload }, { put }) {
      const a = setInterval(() => {
        if (SocketVideo.socket) {
          clearInterval(a);
          SocketVideo.socket.send(JSON.stringify(payload));
        }
      }, 50);
      yield put({
        type: 'queryStatus',
        payload: (payload.CmdCode === 'Show'),
      });
    },
    *devTools({ payload }) {
      const a = setInterval(() => {
        if (SocketVideo.socket) {
          clearInterval(a);
          SocketVideo.socket.send(JSON.stringify(payload));
        }
      }, 50);
    },
    *loginOut({ payload }) {
      const a = setInterval(() => {
        if (SocketVideo.socket) {
          clearInterval(a);
          SocketVideo.socket.send(JSON.stringify(payload));
        }
      }, 50);
    },
  },

  reducers: {
    // 尺寸
    getSize(state, { payload }) {
      return {
        ...state,
        size: payload,
      };
    },
    // 定位
    getPosition(state, { payload }) {
      return {
        ...state,
        position: payload,
      };
    },
    // 布局
    getLayout(state, { payload }) {
      return {
        ...state,
        layout: payload,
      };
    },
    getLayoutCommand(state, { payload }) {
      return {
        ...state,
        layoutCommand: payload,
      };
    },
    // 联动
    linkVideo(state, { payload }) {
      return {
        ...state,
        size: payload,
      };
    },
    // 左右边距
    getPadding(state, { payload }) {
      return {
        ...state,
        padding: payload,
      };
    },
    // socket对象
    getLoaded(state, { payload }) {
      return {
        ...state,
        isLoaded: payload,
      };
    },
    // 显示隐藏
    queryStatus(state, { payload }) {
      return {
        ...state,
        show: payload,
      };
    },
    // 容器
    queryVideoWarp(state, { payload }) {
      return {
        ...state,
        videoWarp: payload,
      };
    },
  },
};
