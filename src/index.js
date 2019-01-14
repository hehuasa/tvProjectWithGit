import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';
import { Modal } from 'antd';
import createHistory from 'history/createHashHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import FastClick from 'fastclick';
import './rollbar';
import './index.less';

window.serviceUrl = {
  mapApiUrl: '',
  socketUrl: '',
  mapDataUrl: '',
};
window.socketAlarms = { isDealing: false, add: [], update: [], del: [], data: [] };
window.isReset = false;
const onError = (e, dispatch) => {
  if (Number(e.message) === 0) {
    // 避免退出登录还会弹框
    if (window.location.href.indexOf('user/login') === -1) {
      Modal.error({
        title: '该账户未经认证',
        content: '将跳转至登录页.',
        okText: '确定',
        onOk: () => {
          dispatch({
            type: 'login/logout',
          });
        },
      });
    }
  }
  e.preventDefault();
};

const onReducer = (a) => {
  console.log('a', a);
};
const app = dva({
  history: createHistory(),
  onError,
  // onReducer,
});

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');


FastClick.attach(document.body);

export default app._store;  // eslint-disable-line
