// import { alarmList, clearTwinkle } from '../services/api';
//   不用的
export default {
  namespace: 'outerDrain',

  state: {
    indeterminate: false, // 判断是否已经被全选
    checkAll: true, // 判断是否选择全部
    plainOptions: ['点位1', '点位2', '点位3'],
    checkedList: ['点位1', '点位2', '点位3'],
    selectData: [
      {
        点位1: {
          指标1: [
            { month: '1525597260000', 点位1: 7.0, },
            { month: '1525597360000', 点位1: 16.9, },
            { month: '1525597460000', 点位1: 9.5, },
            { month: '1525597560000', 点位1: 7.0, },
            { month: '1525597660000', 点位1: 16.9, },
            { month: '1525597760000', 点位1: 9.5, },
          ],
          指标2: [
            { month: '1525597260000', 点位1: 3.9, },
            { month: '1525597360000', 点位1: 14.2, },
            { month: '1525597460000', 点位1: 5.7, },
            { month: '1525597500000', 点位1: 5, },
            { month: '1525597560000', 点位1: 3.9, },
            { month: '1525597660000', 点位1: 14.2, },
            { month: '1525597760000', 点位1: 5.7, },
          ],
        },
        visibility: true,
      },
      {
        点位2: {
          指标2: [
            { month: '1525597260000', 点位2: 6, },
            { month: '1525597360000', 点位2: 17, },
            { month: '1525597460000', 点位2: 9, },
            { month: '1525597500000', 点位2: 18, },
            { month: '1525597560000', 点位2: 6, },
            { month: '1525597660000', 点位2: 17, },
            { month: '1525597760000', 点位2: 9, },
          ],
          指标3: [
            { month: '1525597260000', 点位2: 8, },
            { month: '1525597360000', 点位2: 14, },
            { month: '1525597460000', 点位2: 3, },
            { month: '1525597560000', 点位2: 8, },
            { month: '1525597660000', 点位2: 14, },
            { month: '1525597760000', 点位2: 3, },
          ],
        },
        visibility: true,
      },
      {
        点位3: {
          指标1: [
            { month: '1525597260000', 点位3: 4.0, },
            { month: '1525597360000', 点位3: 5.9, },
            { month: '1525597460000', 点位3: 7.5, },
            { month: '1525597560000', 点位3: 4.0, },
            { month: '1525597660000', 点位3: 5.9, },
            { month: '1525597760000', 点位3: 7.5, },
          ],
          指标3: [
            { month: '1525597260000', 点位3: 4, },
            { month: '1525597360000', 点位3: 8, },
            { month: '1525597460000', 点位3: 11, },
            { month: '1525597560000', 点位3: 4, },
            { month: '1525597660000', 点位3: 8, },
            { month: '1525597760000', 点位3: 11, },
          ],
        },
        visibility: true,
      }
    ],
    target: ['指标1', '指标2', '指标3'],
    targetCheckedList: ['指标1', '指标2', '指标3'],
    targetIndeterminate: false, // 判断是否已经被全选
    targetCheckAll: true, // 判断是否选择全部
  },

  effects: {
    // *add({ payload }, { call, put }) {
    //   yield put({
    //     type: 'queryList',
    //     payload: payload,
    //   });
    // },
  },

  reducers: {
    // 渲染勾选
    checkedList(state, { payload }) {
      return {
        ...state,
        indeterminate: payload.indeterminate,
        checkAll: payload.checkAll,
        checkedList: payload.checkedList,
      };
    },
    targetCheckedList(state, { payload }) {
      return {
        ...state,
        targetIndeterminate: payload.targetIndeterminate,
        targetCheckAll: payload.targetCheckAll,
        targetCheckedList: payload.targetCheckedList,
      };
    },
  },
};
