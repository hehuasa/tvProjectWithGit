import {
  selectByCodeByCode, getGroup, getParentOrgByQuotaGroupCode, getOrgByQuotaGroupCode, getByQuotaGroupCode, getAllQuota,
  findHistory
} from '../services/api';
import { lineData } from '../utils/Panel';
const stuData1 = [{
  collectTime: 1526869533099,
  systemCode: 'IP21',
  dataType: 'CO',     //指标
  acceptTime: 1526869533099,
  description: '一氧化碳',
  gISCode: '280',
  dataCode: '280',    //点位
  value: '30',
}, {
  collectTime: 1526871550346,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526871550346,
  description: '一氧化碳',
  gISCode: '280',
  dataCode: '280',
  value: '31',
}, {
  collectTime: 1526872569682,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526872569682,
  description: '一氧化碳',
  gISCode: '280',
  dataCode: '280',
  value: '32',
}, {
  collectTime: 1526888137296,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526888137296,
  description: '一氧化碳',
  gISCode: '280',
  dataCode: '280',
  value: '33',
}, {
  collectTime: 1526889137296,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526889137296,
  description: '一氧化碳',
  gISCode: '280',
  dataCode: '280',
  value: '34',
}, {
  collectTime: 1526890137296,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526890137296,
  description: '一氧化碳',
  gISCode: '280',
  dataCode: '280',
  value: '35',
}, {
  collectTime: 1526891137296,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526891137296,
  description: '一氧化碳',
  gISCode: '280',
  dataCode: '280',
  value: '36',
}, {
  collectTime: 1526892137296,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526892137296,
  description: '一氧化碳',
  gISCode: '280',
  dataCode: '280',
  value: '37',
}, {
  collectTime: 1526893137296,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526893137296,
  description: '一氧化碳',
  gISCode: '280',
  dataCode: '280',
  value: '38',
}, {
  collectTime: 1526894137296,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526894137296,
  description: '一氧化碳',
  gISCode: '280',
  dataCode: '280',
  value: '39',
}, {
  collectTime: 1526895137296,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526895137296,
  description: '一氧化碳',
  gISCode: '280',
  dataCode: '280',
  value: '40',
}, {
  collectTime: 1526896137296,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526896137296,
  description: '一氧化碳',
  gISCode: '280',
  dataCode: '280',
  value: '41',
}, {
  collectTime: 1526897137296,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526897137296,
  description: '一氧化碳',
  gISCode: '280',
  dataCode: '280',
  value: '42',
}, {
  collectTime: 1526874581817,
  systemCode: 'IP21',
  dataType: 'CO，一氧化碳',
  acceptTime: 1526874581817,
  description: '{1}',
  gISCode: '280',
  dataCode: '280',
  value: '11',
}, {
  collectTime: 1526876590857,
  systemCode: 'IP21',
  dataType: 'CO，一氧化碳',
  acceptTime: 1526876590857,
  description: '{1}',
  gISCode: '280',
  dataCode: '280',
  value: '22',
}];

const stuData2 = [{
  collectTime: 1526869533099,
  systemCode: 'IP22',
  dataType: 'CO',
  acceptTime: 1526869533099,
  description: '而氧化碳',
  gISCode: '400',
  dataCode: '400',
  value: '40',
}, {
  collectTime: 1526871550346,
  systemCode: 'IP22',
  dataType: 'CO',
  acceptTime: 1526871550346,
  description: '而氧化碳',
  gISCode: '400',
  dataCode: '400',
  value: '41',
}, {
  collectTime: 1526872569682,
  systemCode: 'IP22',
  dataType: 'CO',
  acceptTime: 1526872569682,
  description: '一氧化碳',
  gISCode: '400',
  dataCode: '400',
  value: '42',
}, {
  collectTime: 1526888137296,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526888137296,
  description: '一氧化碳',
  gISCode: '400',
  dataCode: '400',
  value: '43',
}, {
  collectTime: 1526889137296,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526889137296,
  description: '一氧化碳',
  gISCode: '400',
  dataCode: '400',
  value: '44',
}, {
  collectTime: 1526890137296,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526890137296,
  description: '一氧化碳',
  gISCode: '400',
  dataCode: '400',
  value: '45',
}, {
  collectTime: 1526891137296,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526891137296,
  description: '一氧化碳',
  gISCode: '400',
  dataCode: '400',
  value: '46',
}, {
  collectTime: 1526892137296,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526892137296,
  description: '一氧化碳',
  gISCode: '400',
  dataCode: '400',
  value: '47',
}, {
  collectTime: 1526893137296,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526893137296,
  description: '一氧化碳',
  gISCode: '400',
  dataCode: '400',
  value: '48',
}, {
  collectTime: 1526894137296,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526894137296,
  description: '一氧化碳',
  gISCode: '400',
  dataCode: '400',
  value: '49',
}, {
  collectTime: 1526895137296,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526895137296,
  description: '一氧化碳',
  gISCode: '400',
  dataCode: '400',
  value: '50',
}, {
  collectTime: 1526896137296,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526896137296,
  description: '一氧化碳',
  gISCode: '400',
  dataCode: '400',
  value: '51',
}, {
  collectTime: 1526897137296,
  systemCode: 'IP21',
  dataType: 'CO',
  acceptTime: 1526897137296,
  description: '一氧化碳',
  gISCode: '400',
  dataCode: '400',
  value: '52',
}, {
  collectTime: 1526874581817,
  systemCode: 'IP22',
  dataType: 'CO，一氧化碳',
  acceptTime: 1526874581817,
  description: '{1}',
  gISCode: '400',
  dataCode: '400',
  value: '30',
}, {
  collectTime: 1526876590857,
  systemCode: 'IP22',
  dataType: 'CO，一氧化碳',
  acceptTime: 1526876590857,
  description: '{1}',
  gISCode: '400',
  dataCode: '400',
  value: '35',
}];
// list: payload.list, resourceID: payload.resourceId, data: response.data
// const storeRealData = ({ type, resourceID, response }) => {
const storeRealData = ({ list, resourceID, response }) => {

  list.data[resourceID] = response.data;
  const lineRealData = lineData({ line: list }); // 数据转曲线对象数据

  // list.data = lineRealData.data;
  list.lineRealData = lineRealData;
  if (list.checkAll) {
    list.checkedList = list.plainOptions = lineRealData.dot;
  } else {
    const addDot = [];
    for (const item of lineRealData.dot) {
      if (list.plainOptions.indexOf(item) === -1) {
        addDot.push(item);
      }
    }
    list.plainOptions = lineRealData.dot;
    list.checkedList = list.checkedList.concat(addDot);
    list.indeterminate = true; // 判断是否已经被全选，有没有被选中的就为true
    list.checkAll = false; // 判断是否选择全部 全不选为false
  }

  if (list.targetCheckAll) {
    list.targetCheckedList = list.target = lineRealData.target; // 所有指标 固定
  } else {
    const addTarget = [];
    for (const item of lineRealData.target) {
      if (list.target.indexOf(item) === -1) {
        addTarget.push(item);
      }
    }
    list.target = lineRealData.target; // 所有指标 固定
    list.targetCheckedList = list.targetCheckedList.concat(addTarget);
    list.targetIndeterminate = true; // 判断是否已经被全选
    list.targetCheckAll = false; // 判断是否选择全部
  }
  return list;
};

export default {
  namespace: 'historyLine',

  state: {
    allProfessionList: [], // 专业系统
    targetAll: [], // 监测指标组
    departmentList: [], // 部门
    subsectionList: [], // 装置
    resourceList: [], // 资源点位
    target: [], // 检测指标

    list: {
      indeterminate: false, // 判断是否已经被全选
      checkAll: true, // 判断是否选择全部
      plainOptions: [],
      checkedList: [],

      targetIndeterminate: false, // 判断是否已经被全选
      targetCheckAll: true, // 判断是否选择全部
      target: [],
      targetCheckedList: [],

      beginTime: '',
      endTime: '',

      resourceIDs: [],
      lineRealData: {
        data: [],
      },
      data: {},
      tempData: [],
    }
  },

  effects: {
    // 请求专业系统
    *queryAllProfessionList({ payload }, { call, put }) {
      const response = yield call(selectByCodeByCode, payload);
      yield put({
        type: 'selectByCode',
        payload: response.data,
      });
    },
    // 请求监测指标组  
    *queryTargetAll({ payload }, { call, put }) {
      const response = yield call(getGroup, payload);
      yield put({
        type: 'targetAllList',
        payload: response.data,
      });
    },
    // 请求部门
    *querydepartment({ payload }, { call, put }) {
      const response = yield call(getParentOrgByQuotaGroupCode, payload);
      yield put({
        type: 'departmentList',
        payload: response.data,
      });
    },
    // 请求装置
    *querySubsection({ payload }, { call, put }) {
      const response = yield call(getOrgByQuotaGroupCode, payload);
      yield put({
        type: 'subsectionList',
        payload: response.data,
      });
    },
    // 请求资源点位
    *queryResource({ payload }, { call, put }) {
      const response = yield call(getByQuotaGroupCode, payload);
      yield put({
        type: 'resourceList',
        payload: response.data,
      });
    },
    // 请求检测指标
    *queryAllQuota({ payload }, { call, put }) {
      const resourceID = payload.resourceID.slice(0, payload.resourceID.indexOf('&'));
      const response = yield call(getAllQuota, {
        resourceID,
      });
      yield put({
        type: 'allQuotaList',
        payload: response.data,
      });
    },
    // 请求历史列表
    *queryHistory({ payload }, { call, put }) {
      const resourceId = payload.resourceId.slice(0, payload.resourceId.indexOf('&'));
      const response = yield call(findHistory, {
        groupId: payload.groupId,
        resourceId,
        quotaIds: payload.quotaIds,
      });
      const list = storeRealData({ list: payload.list, resourceID: payload.resourceId, response })
      yield put({
        type: 'historyList',
        payload: list,
      });

      // setTimeout(() => {
      //   const data = storeRealData({ list: payload.list, resourceID: "35852", response: stuData1 })
      //   yield put({
      //     type: 'historyList',
      //     payload: data,
      //   });
      // }, 0)
      // setTimeout(() => {
      //   const data = storeRealData({ list: payload.list, resourceID: "11111", response: stuData2 })
      //   yield put({
      //     type: 'historyList',
      //     payload: data,
      //   });
      // }, 2000)
    },
  },

  reducers: {
    selectByCode(state, action) {
      return {
        ...state,
        allProfessionList: action.payload,
      };
    },
    targetAllList(state, action) {
      return {
        ...state,
        targetAll: action.payload,
      };
    },
    departmentList(state, action) {
      return {
        ...state,
        departmentList: action.payload,
      };
    },
    subsectionList(state, action) {
      return {
        ...state,
        subsectionList: action.payload,
      };
    },
    resourceList(state, action) {
      return {
        ...state,
        resourceList: action.payload,
      };
    },
    allQuotaList(state, action) {
      return {
        ...state,
        target: action.payload,
      };
    },

    historyList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },

  },
};
