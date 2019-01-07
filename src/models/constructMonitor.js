import { constructMonitorList, orgList } from '../services/api';

// 将数据按照区域分组
const groupingByOrg = (data) => {
  const array = [];
  for (const item of data) {
    const { gisCode, orgnizationName } = item.baseOrganization;
    const index = array.findIndex(value => value.gisCode === gisCode);
    if (index === -1) {
      array.push({
        gisCode,
        org: { gisCode, orgName: orgnizationName },
        count: 1,
        data: [item],
      });
    } else {
      array[index].count += 1;
      array[index].data.push(item);
    }
  }
  return array;
};
export default {
  namespace: 'constructMonitor',

  state: {
    list: [],
    groupingList: [],
    mapSelectedList: { list: [] },
    orgList: [],
  },

  effects: {
    // 作业监控列表
    * fetchConstructMonitorList({ payload }, { call, put }) {
      const { data } = yield call(constructMonitorList, payload);
      // 获取对应的区域
      // for (const item of data) {
      //   const { orgID } = item;
      //   item.areas = [];
      //   const area = yield call(getAreaByOrgID, { orgID });
      //   yield getAreas(area, item);
      // }
      // 分组
      const groupingList = groupingByOrg(data);
      yield put({
        type: 'queryList',
        payload: data,
      });
      yield put({
        type: 'queryGroupList',
        payload: groupingList,
      });
    },
    // 根据ID请求组织信息
    // *getOrgById(payload, { call, put }) {
    //     const response = yield call(orgGet, payload.payload);
    //     yield put({
    //         type: 'queryCurrentOrg',
    //         payload: response,
    //     });
    // },
    // 请求所有组织信息
    * fetchOrgList(_, { call, put }) {
      const response = yield call(orgList);
      yield put({
        type: 'queryOrgList',
        payload: response.data,
      });
    },
  },

  reducers: {
    queryList(state, { payload }) {
      return {
        ...state,
        list: payload,
      };
    },
    queryOrgList(state, { payload }) {
      return {
        ...state,
        orgList: payload,
      };
    },
    queryGroupList(state, { payload }) {
      return {
        ...state,
        groupingList: payload,
      };
    },
    queryMapSelectedList(state, { payload }) {
      return {
        ...state,
        mapSelectedList: payload,
      };
    },
  },
};
