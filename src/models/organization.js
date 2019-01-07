import {
  orgList, orgGet, orgAdd, orgUpdate, orgDelete, getPlanLevelList,
  getOrgTreeData, selectEntityPostion, selectEmgcPostion, getEmgcOrgTree, getFunctionMenus,
} from '../services/api';
import { checkCode, makeTree } from '../utils/utils';

export default {
  namespace: 'organization',
  state: {
    list: [],
    orgObj: {},
    contextMenu: { show: false },
    selectedNodes: [],
    emgcLevelList: [],
    orgTree: [], // 不用手动组children 实体部门
    entityPostion: {
      data: [],
      pagination: {},
    }, // 实体岗位
    emgcPostion: [], // 应急岗位
    emgcOrgTree: [], // 应急组织树
    functionMenus: [], // 页面功能权限
  },
  effects: {
    *list(payload, { call, put }) {
      const response = yield call(orgList, payload.payload);
      yield put({
        type: 'save',
        payload: makeTree(response.data),
      });
    },
    *get(payload, { call, put }) {
      const response = yield call(orgGet, payload.payload);
      yield put({
        type: 'getOrg',
        payload: response,
      });
    },
    *add(payload, { call, put }) {
      const add = yield call(orgAdd, payload.payload);
      checkCode(add);
      const response = yield call(getEmgcOrgTree, payload.payload);
      yield put({
        type: 'saveEmgcOrgTree',
        payload: response.data,
      });
    },
    *update(payload, { call, put }) {
      const update = yield call(orgUpdate, payload.payload);
      checkCode(update);
      const response = yield call(getEmgcOrgTree, payload.payload);
      yield put({
        type: 'saveEmgcOrgTree',
        payload: response.data,
      });
    },
    *delete(payload, { call, put }) {
      const deleteOrg = yield call(orgDelete, payload.payload);
      checkCode(deleteOrg);
      if (deleteOrg.code === 1001) {
        const response = yield call(getEmgcOrgTree, payload.payload);
        yield put({
          type: 'saveEmgcOrgTree',
          payload: response.data,
        });
      }
    },
    *getEmgcLevelList(payload, { call, put }) {
      const response = yield call(getPlanLevelList, payload.payload);
      yield put({
        type: 'saveEmgcLevelList',
        payload: response.data,
      });
    },
    *getOrgTree({ payload }, { call, put }) {
      const response = yield call(getOrgTreeData, payload);
      yield put({
        type: 'saveOrgTree',
        payload: [response.data],
      });
    },
    // 请求实体岗位
    *selectEntityPostion({ payload }, { call, put }) {
      const response = yield call(selectEntityPostion, payload);
      yield put({
        type: 'saveEntityPostion',
        payload: response.data,
      });
    },
    // 请求应急岗位
    *selectEmgcPostion(payload, { call, put }) {
      const response = yield call(selectEmgcPostion);
      yield put({
        type: 'saveEmgcPostion',
        payload: response.data,
      });
    },
    // 请求应急机构树
    *getEmgcOrgTree(payload, { call, put }) {
      const response = yield call(getEmgcOrgTree);
      yield put({
        type: 'saveEmgcOrgTree',
        payload: response.data,
      });
    },
    * getFunctionMenus({ payload }, { call, put }) {
      const res = yield call(getFunctionMenus, payload);
      yield put({
        type: 'saveFunctionMenus',
        payload: res.data,
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    getOrg(state, action) {
      return {
        ...state,
        orgObj: action.payload.data,
      };
    },
    getContext(state, { payload }) {
      return {
        ...state,
        contextMenu: payload,
      };
    },
    selectedNodes(state, { payload }) {
      return {
        ...state,
        selectedNodes: payload,
      };
    },
    saveEmgcLevelList(state, { payload }) {
      return {
        ...state,
        emgcLevelList: payload,
      };
    },
    saveOrgTree(state, { payload }) {
      return {
        ...state,
        orgTree: payload,
      };
    },
    saveEntityPostion(state, { payload }) {
      return {
        ...state,
        entityPostion: {
          data: payload.result,
          pagination: {
            current: payload.pageNum,
            pageSize: payload.pageSize,
            total: payload.sumCount,
          },
        },
      };
    },
    saveEmgcPostion(state, { payload }) {
      return {
        ...state,
        emgcPostion: payload,
      };
    },
    saveEmgcOrgTree(state, { payload }) {
      return {
        ...state,
        emgcOrgTree: payload,
      };
    },
    saveFunctionMenus(state, { payload }) {
      return {
        ...state,
        functionMenus: payload,
      };
    },
  },

};
