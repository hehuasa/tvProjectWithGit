import {
  findRoleList, addRoleInfo, deleteRoleInfo, getRoleInfo, roleUpdate, rolePage,
  exportRoleInfo, addRoleAccountConfig, selectAccountByRoleID, professionPage, alarmTypePage,
  resourcePage, getDataPower, getFunctionMenus,
} from '../services/api';
import { commonData } from '../../mock/commonData';
import { checkCode } from '../utils/utils';

export default {
  namespace: 'roleInfo',
  state: {
    data: {
      data: [],
      pagination: {},
    },
    role: {
      data: {},
    },
    list: [],
    roleAccount: {
      roleID: null,
      accouts: [],
    },

    deviceSelectType: 1, // 设备选择类型 1.部门+专业系统 2.点位
    byOrg: 1, // 按部门 1.全部门 2.本部门 3.指定部门
    checkedOrgIDs: [], // 数据权限 按部门选中的部门ID
    byProfession: 1, // 按专业系统 1.全专业系统 2.制定专业系统
    byAlarmType: 1, // 报警类型 1.全部 2.报警 3.故障
    professionPage: {
      data: [],
      pagination: {},
    }, // 专业系统
    professionIDs: [], // 数据权限 按专业选中的专业系统ID
    alarmTypePage: {
      data: [],
      pagination: {},
    }, // 报警类型
    alarmType: 1, // 报警类型 1.全类型 2.指定类型
    alarmTypeIDs: [], // 数据权限 选中的点位ID
    resourcePage: {
      data: [],
      pagination: {},
    }, // 资源点位
    resourceIDs: [], // 数据权限 选中的点位ID
    byResource: 1, // 1全部资源 2指定资源
    includeObj: {}, // 功能权限 部门是否包含下级对象
    powerData: {}, // 角色数据权限
    functionMenus: [], // 页面功能权限
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(findRoleList);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
    *page(payload, { call, put }) {
      const response = yield call(rolePage, payload.payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add(payload, { call, put }) {
      const response = yield call(addRoleInfo, payload.payload);
      checkCode(response);
      const roleInfo = yield call(rolePage, commonData.pageInitial);
      yield put({
        type: 'save',
        payload: roleInfo,
      });
    },
    *delete(payload, { call, put }) {
      yield call(deleteRoleInfo, payload.payload);
      const roleInfo = yield call(rolePage, commonData.pageInitial);
      yield put({
        type: 'save',
        payload: roleInfo,
      });
    },
    *get(payload, { call, put }) {
      const response = yield call(getRoleInfo, payload.payload);
      yield put({
        type: 'role',
        payload: response,
      });
    },
    *update(payload, { call, put }) {
      const response = yield call(roleUpdate, payload.payload);
      checkCode(response);
      const roleInfo = yield call(rolePage, commonData.pageInitial);
      yield put({
        type: 'save',
        payload: roleInfo,
      });
    },
    *export(payload, { call }) {
      yield call(exportRoleInfo, payload.payload);
    },
    *roleID(payload, { call, put }) {
      yield put({
        type: 'saveRoleID',
        payload: payload.payload,
      });
    },
    *addRoleAccount(payload, { call, put }) {
      const response = yield call(addRoleAccountConfig, payload.payload);
      checkCode(response);
    },
    *accounts(payload, { call, put }) {
      yield put({
        type: 'saveAccounts',
        payload: payload.payload,
      });
    },
    *selectByRoleID(payload, { call, put }) {
      const response = yield call(selectAccountByRoleID, payload.payload);
      const accountIDs = response.data.map(item => item.accountID);
      yield put({
        type: 'saveAccounts',
        payload: accountIDs,
      });
    },
    // 数据权限 指定专业系统分页数据
    *professionPage({ payload }, { call, put }) {
      const response = yield call(professionPage, payload);
      const data = {
        data: response.data.result,
        pagination: {
          current: response.data.pageNum,
          pageSize: response.data.pageSize,
          total: response.data.sumCount,
        },
      };
      yield put({
        type: 'saveProfessionPage',
        payload: data,
      });
    },
    // 数据权限 报警类型分页数据
    *alarmTypePage({ payload }, { call, put }) {
      const response = yield call(alarmTypePage, payload);
      const data = {
        data: response.data.result,
        pagination: {
          current: response.data.pageNum,
          pageSize: response.data.pageSize,
          total: response.data.sumCount,
        },
      };
      yield put({
        type: 'saveAlarmTypePage',
        payload: data,
      });
    },
    // 数据权限 资源点位
    *resourcePage({ payload }, { call, put }) {
      const response = yield call(resourcePage, payload);
      const data = {
        data: response.data.result,
        pagination: {
          current: response.data.pageNum,
          pageSize: response.data.pageSize,
          total: response.data.sumCount,
        },
      };
      yield put({
        type: 'saveResourcePage',
        payload: data,
      });
    },
    // 数据权限 资源点位
    *getDataPower({ payload }, { call, put }) {
      const res = yield call(getDataPower, payload);
      const { data } = res;
      // 保存权限信息
      yield put({
        type: 'savePowerData',
        payload: data,
      });
      // 保存按部门
      if (data && data.byOrg) {
        yield put({
          type: 'saveByOrg',
          payload: data.byOrg,
        });
      }
      // 保存按专业
      if (data && data.byProfession) {
        yield put({
          type: 'saveByProfession',
          payload: data.byProfession,
        });
      }
      // 保存按点位
      if (data && data.byResource) {
        yield put({
          type: 'saveByResource',
          payload: data.byResource,
        });
      }
      // 保存资源选择类型
      if (data && data.deviceSelectType) {
        yield put({
          type: 'saveDeviceSelectType',
          payload: data.deviceSelectType,
        });
      }
      // 保存专业ID
      if (data && data.professionSystemIDs) {
        yield put({
          type: 'saveProfessionIDs',
          payload: data.professionSystemIDs,
        });
      }
      // 保存指定部门ID
      if (data && data.orgIDs) {
        yield put({
          type: 'saveCheckedOrgIDs',
          payload: data.orgIDs,
        });
        // 保存部门是否包含下级 includeSub
        const obj = {};
        data.orgIDs.forEach((item, index) => {
          obj[item] = data.includeSub[index];
        });
        yield put({
          type: 'saveIncludeObj',
          payload: obj,
        });
      }
      // 保存指定部门ID
      if (data && data.resourceIDs) {
        yield put({
          type: 'saveResourceIDs',
          payload: data.resourceIDs,
        });
      }
      // 保存报警类型
      if (data && data.byAlarmType) {
        yield put({
          type: 'saveByAlarmType',
          payload: data.byAlarmType,
        });
      }
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
        data: {
          data: action.payload.data.result,
          pagination: {
            current: action.payload.data.pageNum,
            pageSize: action.payload.data.pageSize,
            total: action.payload.data.sumCount,
          },
        },
      };
    },
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    role(state, action) {
      return {
        ...state,
        role: action.payload,
      };
    },
    saveRoleID(state, action) {
      return {
        ...state,
        roleAccount: {
          ...state.roleAccount,
          roleID: action.payload,
        },
      };
    },
    saveAccounts(state, action) {
      return {
        ...state,
        roleAccount: {
          ...state.roleAccount,
          accouts: action.payload,
        },
      };
    },
    saveByOrg(state, { payload }) {
      return {
        ...state,
        byOrg: payload,
      };
    },
    saveCheckedOrgIDs(state, { payload }) {
      return {
        ...state,
        checkedOrgIDs: payload,
      };
    },
    saveByProfession(state, { payload }) {
      return {
        ...state,
        byProfession: payload,
      };
    },
    saveProfessionPage(state, { payload }) {
      return {
        ...state,
        professionPage: payload,
      };
    },
    saveProfessionIDs(state, { payload }) {
      return {
        ...state,
        professionIDs: payload,
      };
    },
    saveAlarmTypePage(state, { payload }) {
      return {
        ...state,
        alarmTypePage: payload,
      };
    },
    saveDeviceSelectType(state, { payload }) {
      return {
        ...state,
        deviceSelectType: payload,
      };
    },
    saveAlarmType(state, { payload }) {
      return {
        ...state,
        alarmType: payload,
      };
    },
    saveAlarmTypeID(state, { payload }) {
      return {
        ...state,
        alarmTypeIDs: payload,
      };
    },
    saveResourcePage(state, { payload }) {
      return {
        ...state,
        resourcePage: payload,
      };
    },
    saveResourceIDs(state, { payload }) {
      return {
        ...state,
        resourceIDs: payload,
      };
    },
    saveByResource(state, { payload }) {
      return {
        ...state,
        byResource: payload,
      };
    },
    saveIncludeObj(state, { payload }) {
      return {
        ...state,
        includeObj: payload,
      };
    },
    savePowerData(state, { payload }) {
      return {
        ...state,
        powerData: payload,
      };
    },
    saveByAlarmType(state, { payload }) {
      return {
        ...state,
        byAlarmType: payload,
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
