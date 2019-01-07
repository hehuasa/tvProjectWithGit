// import { queryAreaList, queryDoorList, queryAreaPerson, queryDoorPerson } from '../services/api';   //queryPersonList, queryAllAreasList, queryAllDoorsList,
// import { checkCode } from '../utils/utils';
//
// export default {
//   namespace: 'entranceGuard',
//
//   state: {
//     toggleTable: null,
//     time: null,
//     beginTime: null,
//     endTime: null,
//     areaDoorData: {
//       name: '',
//       id: '',
//     },
//     list: [],
//     areaOrDoor: 1, // 判断门禁或区域
//     allAreaList: [],
//     // areasSelectList: [],
//     // doorSelectList: [],
//     // type: 0,
//   },
//
//   effects: {
//
//     *allAreaQuery({ payload }, { call, put }) {
//       const data = yield call(queryAreaList);
//       yield put({
//         type: 'allAreaQueryList',
//         payload: {
//           allAreaList: data.data,
//         },
//       });
//     },
//     // 请求区域
//     *areaQuery({ payload }, { call, put }) {
//       const data = yield call(queryAreaList, {
//         beginTime: payload.beginTime,
//         endTime: payload.endTime,
//       });
//       yield put({
//         type: 'areaQueryList',
//         payload: {
//           toggleTable: payload.toggleTable,
//           beginTime: payload.beginTime,
//           endTime: payload.endTime,
//           areaOrDoor: payload.areaOrDoor,
//           list: data.data,
//         },
//       });
//     },
//     // 请求门禁
//     *stageDoorQuery({ payload }, { call, put }) {
//       const data = yield call(queryDoorList, {
//         beginTime: payload.beginTime,
//         endTime: payload.endTime,
//       });
//       yield put({
//         type: 'stageDoorList',
//         payload: {
//           toggleTable: payload.toggleTable,
//           areaName: payload.areaName,
//           beginTime: payload.beginTime,
//           endTime: payload.endTime,
//           areaOrDoor: payload.areaOrDoor,
//           list: data.data,
//         },
//       });
//     },
//     // 请求区域里面的人员
//     *stageAreaPerson({ payload }, { call, put }) {
//       const data = yield call(queryAreaPerson, {
//         beginTime: payload.beginTime,
//         endTime: payload.endTime,
//         type: payload.type,
//         areaId: payload.areaDoorData.id
//       });
//       yield put({
//         type: 'stageAreaDoorPersonList',
//         payload: {
//           toggleTable: payload.toggleTable,
//           beginTime: payload.beginTime,
//           endTime: payload.endTime,
//           areaDoorData: payload.areaDoorData,
//           list: data.data,
//           areaOrDoor: payload.areaOrDoor,
//         },
//       });
//     },
//     // 请求门禁里面的人员
//     *stageDoorPerson({ payload }, { call, put }) {
//       const data = yield call(queryDoorPerson, {
//         beginTime: payload.beginTime,
//         endTime: payload.endTime,
//         type: payload.type,
//         doorId: payload.areaDoorData.id
//       });
//       yield put({
//         type: 'stageAreaDoorPersonList',
//         payload: {
//           toggleTable: payload.toggleTable,
//           beginTime: payload.beginTime,
//           endTime: payload.endTime,
//           areaDoorData: payload.areaDoorData,
//           list: data.data,
//           areaOrDoor: payload.areaOrDoor,
//         },
//       });
//     },
//   },
//
//   reducers: {
//     allAreaQueryList(state, { payload }) {
//       return {
//         ...state,
//         allAreaList: payload.allAreaList,
//       };
//     },
//     stageDoorList(state, { payload }) {
//       return {
//         ...state,
//         toggleTable: payload.toggleTable,
//         areaName: payload.areaName,
//         beginTime: payload.beginTime,
//         endTime: payload.endTime,
//         areaOrDoor: payload.areaOrDoor,
//         list: payload.list,
//       };
//     },
//     areaQueryList(state, { payload }) {
//       return {
//         ...state,
//         toggleTable: payload.toggleTable || state.toggleTable,
//         beginTime: payload.beginTime,
//         endTime: payload.endTime,
//         areaOrDoor: payload.areaOrDoor,
//         list: payload.list,
//       };
//     },
//     stageAreaDoorPersonList(state, { payload }) {
//       return {
//         ...state,
//         toggleTable: payload.toggleTable,
//         beginTime: payload.beginTime,
//         endTime: payload.endTime,
//         areaDoorData: payload.areaDoorData,
//         list: payload.list,
//         areaOrDoor: payload.areaOrDoor || state.areaOrDoor,
//       };
//     },
//
//   },
// };
// // const data = {
// //   data: [{
// //     "areaId": 3703,
// //     "areaName": "门禁测试区域1",
// //     "outNum": 8,
// //     "inNum": 10,
// //     "type": 0,
// //   }, {
// //     "areaId": 3706,
// //     "areaName": "门禁测试区域2",
// //     "outNum": 8,
// //     "inNum": 10,
// //     "type": 0,
// //   }]
// // };
//
// // const data = {
// //   data: [{
// //     "areaId": 3706,
// //     "areaName": "门禁测试区域2",
// //     "doorName": "门禁1",
// //     "outNum": 80,
// //     "inNum": 100,
// //     "doorId": 1,
// //     "type": 0,
// //   }, {
// //     "areaId": 3706,
// //     "areaName": "门禁测试区域2",
// //     "doorName": "门禁2",
// //     "outNum": 80,
// //     "inNum": 100,
// //     "doorId": 14,
// //     "type": 0,
// //   }]
// // };
//
// // const data = {
// //   data: [{
// //     "areaId": 3706,
// //     "personName": "名字19",
// //     "inCodes": [],
// //     "occurTime": '2018-05-11',
// //     "outNum": 8,
// //     "outCodes": [],
// //     "inNum": 10,
// //     "type": 1,
// //     "doorId": 1,
// //     "personId": 2,
// //   }, {
// //     "areaId": 3706,
// //     "personName": "名字81",
// //     "inCodes": [],
// //     "occurTime": '2018-05-11',
// //     "outNum": 8,
// //     "outCodes": [],
// //     "inNum": 10,
// //     "type": 1,
// //     "doorId": 2,
// //     "personId": 3,
// //   }, {
// //     "areaId": 3706,
// //     "personName": "名字19",
// //     "inCodes": [],
// //     "occurTime": '2018-05-11',
// //     "outNum": 8,
// //     "outCodes": [],
// //     "inNum": 10,
// //     "type": 1,
// //     "doorId": 1,
// //     "personId": 2,
// //   }, {
// //     "areaId": 3706,
// //     "personName": "名字81",
// //     "inCodes": [],
// //     "occurTime": '2018-05-11',
// //     "outNum": 8,
// //     "outCodes": [],
// //     "inNum": 10,
// //     "type": 1,
// //     "doorId": 2,
// //     "personId": 3,
// //   }, {
// //     "areaId": 3706,
// //     "personName": "名字19",
// //     "inCodes": [],
// //     "occurTime": '2018-05-11',
// //     "outNum": 8,
// //     "outCodes": [],
// //     "inNum": 10,
// //     "type": 1,
// //     "doorId": 1,
// //     "personId": 2,
// //   }, {
// //     "areaId": 3706,
// //     "personName": "名字81",
// //     "inCodes": [],
// //     "occurTime": '2018-05-11',
// //     "outNum": 8,
// //     "outCodes": [],
// //     "inNum": 10,
// //     "type": 1,
// //     "doorId": 2,
// //     "personId": 3,
// //   }, {
// //     "areaId": 3706,
// //     "personName": "名字19",
// //     "inCodes": [],
// //     "occurTime": '2018-05-11',
// //     "outNum": 8,
// //     "outCodes": [],
// //     "inNum": 10,
// //     "type": 1,
// //     "doorId": 1,
// //     "personId": 2,
// //   }, {
// //     "areaId": 3706,
// //     "personName": "名字81",
// //     "inCodes": [],
// //     "occurTime": '2018-05-11',
// //     "outNum": 8,
// //     "outCodes": [],
// //     "inNum": 10,
// //     "type": 1,
// //     "doorId": 2,
// //     "personId": 3,
// //   }, {
// //     "areaId": 3706,
// //     "personName": "名字19",
// //     "inCodes": [],
// //     "occurTime": '2018-05-11',
// //     "outNum": 8,
// //     "outCodes": [],
// //     "inNum": 10,
// //     "type": 1,
// //     "doorId": 1,
// //     "personId": 2,
// //   }, {
// //     "areaId": 3706,
// //     "personName": "名字81",
// //     "inCodes": [],
// //     "occurTime": '2018-05-11',
// //     "outNum": 8,
// //     "outCodes": [],
// //     "inNum": 10,
// //     "type": 1,
// //     "doorId": 2,
// //     "personId": 3,
// //   }, {
// //     "areaId": 3706,
// //     "personName": "名字19",
// //     "inCodes": [],
// //     "occurTime": '2018-05-11',
// //     "outNum": 8,
// //     "outCodes": [],
// //     "inNum": 10,
// //     "type": 1,
// //     "doorId": 1,
// //     "personId": 2,
// //   }, {
// //     "areaId": 3706,
// //     "personName": "名字81",
// //     "inCodes": [],
// //     "occurTime": '2018-05-11',
// //     "outNum": 8,
// //     "outCodes": [],
// //     "inNum": 10,
// //     "type": 1,
// //     "doorId": 2,
// //     "personId": 3,
// //   }, {
// //     "areaId": 3706,
// //     "personName": "名字19",
// //     "inCodes": [],
// //     "occurTime": '2018-05-11',
// //     "outNum": 8,
// //     "outCodes": [],
// //     "inNum": 10,
// //     "type": 1,
// //     "doorId": 1,
// //     "personId": 2,
// //   }, {
// //     "areaId": 3706,
// //     "personName": "名字81",
// //     "inCodes": [],
// //     "occurTime": '2018-05-11',
// //     "outNum": 8,
// //     "outCodes": [],
// //     "inNum": 10,
// //     "type": 1,
// //     "doorId": 2,
// //     "personId": 3,
// //   }, {
// //     "areaId": 3706,
// //     "personName": "名字19",
// //     "inCodes": [],
// //     "occurTime": '2018-05-11',
// //     "outNum": 8,
// //     "outCodes": [],
// //     "inNum": 10,
// //     "type": 1,
// //     "doorId": 1,
// //     "personId": 2,
// //   }, {
// //     "areaId": 3706,
// //     "personName": "名字81",
// //     "inCodes": [],
// //     "occurTime": '2018-05-11',
// //     "outNum": 8,
// //     "outCodes": [],
// //     "inNum": 10,
// //     "type": 1,
// //     "doorId": 2,
// //     "personId": 3,
// //   }, {
// //     "areaId": 3706,
// //     "personName": "名字19",
// //     "inCodes": [],
// //     "occurTime": '2018-05-11',
// //     "outNum": 8,
// //     "outCodes": [],
// //     "inNum": 10,
// //     "type": 1,
// //     "doorId": 1,
// //     "personId": 2,
// //   }, {
// //     "areaId": 3706,
// //     "personName": "名字81",
// //     "inCodes": [],
// //     "occurTime": '2018-05-11',
// //     "outNum": 8,
// //     "outCodes": [],
// //     "inNum": 10,
// //     "type": 1,
// //     "doorId": 2,
// //     "personId": 3,
// //   }]
// // }