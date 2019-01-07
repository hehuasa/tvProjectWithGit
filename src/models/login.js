import { routerRedux } from 'dva/router';
import { accountLogin, loginOut, fakeAccountLogin, getInfoByAccountID, getPublicKey } from '../services/api';
import { reloadAuthorized } from '../utils/Authorized';

const setCookies = (user, accountInfo) => {
  // const value = `currentUser=${user.loginAccount};currentAccountID=${user.accountID};accountInfo=${JSON.stringify(accountInfo)}`;
  // document.cookie = encodeURIComponent(value);
  // document.cookie = `currentUser=${user.loginAccount};currentAccountID=${user.accountID}`;
  const value = `${JSON.stringify(user)}`;
  document.cookie = encodeURIComponent(value);
};
const delCookies = () => {
  // document.cookie = 'currentUser=;currentAccountID=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = '';
};
export default {
  namespace: 'login',
  state: {
    code: '',
    status: '',
    pubKey: null,
  },

  effects: {
    *login({ payload }, { call, put }) {
      // const response = yield call(fakeAccountLogin, payload);
      const response = yield call(accountLogin, payload);
      // const accountInfo = yield call(getInfoByAccountID, response.data.accountID);
      if (response.code === 1001) {
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        setCookies(response.data);
        yield put(routerRedux.push('/'));
        window.isReset = false;
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
      }
    },
    *logout(payload, { call, put }) {
      const response = yield call(loginOut);
      if (response.code === 1001) {
        delCookies();
        // yield setTimeout(() => {
        yield put({
          type: 'video/switch',
          payload: {
            CmdCode: 'Hide',
          },
        });
        yield put({
          type: 'video/loginOut',
          payload: {
            CmdCode: 'StopVideo',
          },
        });
        yield put(routerRedux.push('/user/login'));
        // try {
        //   // get location pathname
        //   // const urlParams = new URL(window.location.href);
        //   // const pathname = yield select(state => state.routing.location.pathname);
        //   // // add the parameters in the url
        //   // urlParams.searchParams.set('redirect', pathname);
        //   // window.history.replaceState(null, 'login', urlParams.href);
        // } finally {
        //   // yield put({
        //   //   type: 'changeLoginStatus',
        //   //   payload: {
        //   //     status: false,
        //   //     currentAuthority: 'guest',
        //   //   },
        //   // });
        //   // reloadAuthorized();
        //   delCookies();
        //   // yield setTimeout(() => {
        //   yield put(routerRedux.push('/user/login'));
        //   // }, 500);
        // }
      }
    },
    *getPublicKey({ payload }, { call, put }) {
      const response = yield call(getPublicKey, payload);
      yield put({
        type: 'savePubKey',
        payload: response.data,
      });
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        code: payload.code,
      };
    },
    savePubKey(state, { payload }) {
      return {
        ...state,
        pubKey: payload,
      };
    },
  },
};
