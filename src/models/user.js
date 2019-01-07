import { routerRedux } from 'dva/router';
import { query as queryUsers, queryCurrent } from '../services/user';


const getCurrent = (name) => {
  // let arr,
  //   reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  //   // reg = new RegExp(`${name}(.*);`);
  // const value = decodeURIComponent(document.cookie);
  // if (arr = value.match(reg)) {
  //   return {
  //     avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  //     userid: '00000001',
  //     name: decodeURI(arr[2]),
  //     notifyCount: 12,
  //   };
  // } else { return null; }
  // const cookieVal = decodeURIComponent(document.cookie);
  // return {
  //   avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  //   userid: '00000001',
  //   name: 'test',
  //   notifyCount: 12,
  // };
};

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      // const response = yield getCurrent('currentUser');
      if (document.cookie === '') {
        yield put(routerRedux.push('/user/login'));
      } else {
        const cookieVal = decodeURIComponent(document.cookie);
        const currentUser = JSON.parse(cookieVal);
        yield put({
          type: 'saveCurrentUser',
          payload: { ...currentUser, name: 'test' },
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },

  },
};
