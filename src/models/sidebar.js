export default {
  namespace: 'sidebar',

  state: {
    activeId: '',
    title: '',
    zoomData: {},
  },

  effects: {
    *zoomIn({ payload }, { put }) {
      yield put({
        type: 'zoomInPanel',
        payload,
      });
    },
  },
  reducers: {
    zoomInPanel(state, { payload }) {
      return {
        ...state,
        activeId: payload.id,
        title: payload.title,
      };
    },
  },
};

// import { fakeMonitorSideData } from '../services/api';
// // 表单假数据行（首页右侧）
// const tableData = {
//   name: '裂解',
//   data: [{
//     key: '1',
//     colSpan: 4,
//     type: '投入',
//     materiel: '加氢尾油',
//     monthPlan: 100,
//     dayFinish: 10,
//     monthFinish: 80,
//     yield: 17.05,
//     monthProcess: 80,
//   }, {
//     key: '2',
//     type: '投入',
//     materiel: '饱和液化气',
//     monthPlan: 100,
//     dayFinish: 10,
//     monthFinish: 80,
//     yield: 17.05,
//     monthProcess: 80,
//   }, {
//     key: '3',
//     type: '投入',
//     materiel: '加氢尾油',
//     monthPlan: 100,
//     dayFinish: 10,
//     monthFinish: 80,
//     yield: 17.05,
//     monthProcess: 80,
//   }, {
//     key: '4',
//     type: '投入',
//     materiel: '饱和液化气',
//     monthPlan: 100,
//     dayFinish: 10,
//     monthFinish: 80,
//     yield: 17.05,
//     monthProcess: 80,
//   }, {
//     key: '5',
//     type: '产出',
//     materiel: '加氢尾油',
//     monthPlan: 100,
//     dayFinish: 10,
//     monthFinish: 80,
//     yield: 17.05,
//     monthProcess: 80,
//   }, {
//     key: '6',
//     type: '产出',
//     materiel: '加氢尾油',
//     monthPlan: 100,
//     dayFinish: 10,
//     monthFinish: 80,
//     yield: 17.05,
//     monthProcess: 80,
//   }, {
//     key: '7',
//     type: '产出',
//     materiel: '加氢尾油',
//     monthPlan: 100,
//     dayFinish: 10,
//     monthFinish: 80,
//     yield: 17.05,
//     monthProcess: 80,
//   }, {
//     key: '8',
//     type: '产出',
//     materiel: '加氢尾油',
//     monthPlan: 100,
//     dayFinish: 10,
//     monthFinish: 80,
//     yield: 17.05,
//     monthProcess: 80,
//   },
//   ]
// };
// // 饼图假数据（首页右侧）
// const barData = {
//   name: '污水总排口',
//   data: [
//     {
//       x: 'COD',
//       y: 6,
//     },
//     {
//       x: '氮氧',
//       y: 12,
//     },
//     {
//       x: 'PH',
//       y: 16,
//     },
//     {
//       x: '油',
//       y: 19,
//     }]
// };

// export default {
//   namespace: 'sidebar',
//   state: {
//     activeKey: '',
//     activeKeys: [],
//     zoomData: {},
//     visiblePanel: [],
//     data: {
//       tableData: [],
//       barData: [],
//     },
//     boardList: {
//       open: false,
//       list: [5]
//     },
//   },
//   effects: {
//     *fakeMonitorSideData(
//       { payload }, { call, put }
//     ) {
//       // const response = {
//       //   tableData,
//       //   barData,
//       // };
//       const response = yield call(fakeMonitorSideData);
//       yield put({
//         type: 'save',
//         payload: response.data,
//       });
//     },
//     *getIfAllFold({ payload }, { call, put }) {
//       yield put({
//         type: 'saveIfAllFold',
//         payload,
//       });
//     },
//     *zoomIn({ payload }, { call, put }) {
//       yield put({
//         type: 'zoomInPanel',
//         payload,
//       });
//     },
//   },
//   reducers: {
//     zoomInPanel(state, { payload }) {
//       return {
//         ...state,
//         activeKey: payload.id,
//         zoomData: payload.data,
//       };
//     },
//     save(state, { payload }) {
//       return {
//         ...state,
//         data: payload,
//         activeKeys: state.activeKeys,
//       };
//     },
//     saveIfAllFold(state, { payload }) {
//       return {
//         ...state,
//         activeKeys: payload.activeKeys,
//       };
//     },
//     visiblePanel(state, { payload }) {
//       return {
//         ...state,
//         visiblePanel: payload,
//       };
//     },
//     clear() {
//       return {
//         data: {
//           tableData: [],
//           barData: [],
//         },

//       };
//     },
//     openBoardList(state, action) {
//       return {
//         ...state,
//         boardList: {
//           open: action.payload,
//           list: state.boardList.list
//         },
//       };
//     },
//   },
// };
