import { getMenuData } from '../common/menu';
import { emgcIntervalInfo } from '../services/constantlyData';

const menuData = getMenuData();
const getTabTitle = (array, tabPath) => {
  let tab;
  const getName = (tabs, path) => {
    for (const item of tabs) {
      const itemPath = item.path.startsWith('/') ? item.path : `/${item.path}`;
      if (itemPath === path) {
        tab = item;
        break;
      }
      if (item.children) {
        getName(item.children, path);
      }
    }
  };
  getName(array, tabPath);
  return tab.name;
};
const delTabUnit = (tabs, tabKey) => {
  const getTab = () => {
    let index;
    for (const tab of tabs) {
      if (tab.key === tabKey) {
        index = tabs.findIndex(value => value === tab);
        break;
      }
    }
    return index;
  };
  const index = getTab();
  if (index) { tabs.splice(index, 1); }
  return tabs;
};
export default {
  namespace: 'tabs',
  state: {
    tabs: [
      {
        key: '/homePage',
        title: '首页',
        closable: false,
      }],
    activeKey: '/homePage',
  },
  effects: {
    *add({ payload }, { put }) {
      // 生成tab对象
      const tab = {
        key: payload.key,
        title: getTabTitle(payload.list, payload.key),
        functionInfo: payload.functionInfo,
        closable: true,
      };
      yield put({
        type: 'addTab',
        payload: tab,
      });
    },
    *addTabs({ payload }, { put }) {
      // 生成tab对象
      const tab = {
        key: payload.key,
        title: payload.title,
        functionInfo: payload.functionInfo,
        closable: true,
      };
      yield put({
        type: 'addTab',
        payload: tab,
      });
    },
    *del({ payload }, { put }) {
      // 清空事件的轮训
      const { intervalIDs, infoRecord, commondList, userPage } = emgcIntervalInfo;
      const arr = intervalIDs.concat(infoRecord, commondList, userPage);
      arr.forEach((item) => {
        clearInterval(item);
      });
      yield put({
        type: 'delTab',
        payload: payload.key,
      });
    },
    *active({ payload }, { put }) {
      yield put({
        type: 'activeTab',
        payload: payload.key,
      });
    },
    // 更新某一tabs
    *update({ payload }, { put }) {
      yield put({
        type: 'updateTab',
        payload,
      });
    },
  },
  reducers: {
    list(state, { payload }) {
      return {
        ...state,
        tabs: payload.tabs,
        activeKey: payload.activeKey,
      };
    },
    addTab(state, { payload }) {
      // 更新tabs，存session
      state.tabs.push(payload);
      const tabs = {
        tabs: state.tabs,
        activeKey: payload.key,
      };
      sessionStorage.setItem('tabs', JSON.stringify(tabs));
      return {
        ...state,
        tabs: state.tabs,
        activeKey: payload.key,
      };
    },
    delTab(state, { payload }) {
      // 更新tabs，存session
      const tabs = delTabUnit(state.tabs, payload);
      sessionStorage.setItem('tabs', JSON.stringify({
        activeKey: state.tabs[state.tabs.length - 1].key,
        tabs,
      }));
      return {
        ...state,
        tabs,
        activeKey: state.tabs[state.tabs.length - 1].key,
      };
    },
    activeTab(state, { payload }) {
      // 更新tabs，存session
      sessionStorage.setItem('tabs', JSON.stringify({
        activeKey: payload,
        tabs: state.tabs,
      }));
      return {
        ...state,
        activeKey: payload,
      };
    },
    // 更新已有tabs的title
    updateTab(state, { payload }) {
      const { tabs } = state;
      let arr = [];
      arr = tabs.map((item) => {
        if (item.key === payload.key) { return { ...item, title: payload.title }; }
        return item;
      });
      return {
        ...state,
        tabs: arr,
        activeKey: payload.activeKey,
      };
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      const tabs = JSON.parse(sessionStorage.getItem('tabs'));
      if (tabs !== null) {
        dispatch({
          type: 'tabs/list',
          payload: tabs,
        });
      }
    },
  },
};
