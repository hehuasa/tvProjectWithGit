
import { lineData, getSelctData } from '../utils/Panel';
import { addDoorIcon, envMap } from '../utils/mapService';
import {
  getGuardCounting, getGuardDoorCounting, getConditionCalc, findByTime, getAllNewsData, getNewsData, getNewsDataByGroup, getNewsDataByCtrlResourceType,
  getHotFurnaceRunDay, getAlternatorRunDay, getDissociationRunDay, resourceTreeByCtrlType, getA9AndB9,
} from '../services/api';
import { constantlyModal, constantlyPanelModal, constantlyConditionCalc } from '../services/constantlyModal';
import { mapConstants } from '../services/mapConstant';
// 公共函数，在地图显示各种实时专题数据
const thematicMaping = ({ type, view, deviceArray, searchText, searchFields = ['ObjCode'], graphics, constantlyComponents, map, dispatch, scale }) => {
  const devices = [];
  const cacheObj = {};
  if (constantlyComponents.findIndex(value => value.type === type) === -1) {
    constantlyComponents.push({ type });
  }
  // 缓存数组，处理多条指标的情况
  for (const item of deviceArray) {
    if (cacheObj[item.gISCode] === undefined) {
      cacheObj[item.gISCode] = item;
      cacheObj[item.gISCode].valueArry = [];
      cacheObj[item.gISCode].valueArry.push({ dataTypeName: item.dataTypeName, value: `${item.value} ${item.meterUnit}` });
    } else {
      cacheObj[item.gISCode].valueArry.push({ dataTypeName: item.dataTypeName, value: `${item.value} ${item.meterUnit}` });
    }
  }
  // 如果已经传入地图信息，则不执行搜索
  if (graphics) {
    for (const [_, device] of Object.entries(cacheObj)) {
      for (const graphic of graphics) {
        if (Number(device[searchText]) === Number(graphic.attributes[searchFields])) {
          devices.push({ device: graphic, attributes: device });
          break;
        }
      }
    }
    const domType = 'constantly';
    constantlyInfo(map, view, dispatch, devices, type, constantlyComponents, domType, scale);
  }
  dispatch({
    type: 'resourceTree/saveUniqueKey',
    payload: new Date().getTime(),
  });
};
const thematicMapingDoor = ({ type, deviceArray, view, searchText, searchFields = ['ObjCode'], graphics, constantlyComponents, map, dispatch, domType, scale }) => {
  const devices = [];
  const cacheObj = {};
  // if (constantlyComponents.findIndex(value => value.type === type) === -1) {
  //   constantlyComponents.push({ type });
  // }
  // 缓存数组，处理多条指标的情况
  for (const item of deviceArray) {
    if (cacheObj[item.gISCode] === undefined) {
      cacheObj[item.gISCode] = item;
      cacheObj[item.gISCode].valueArry = [];
      cacheObj[item.gISCode].valueArry.push({ dataTypeName: item.dataTypeName, value: `${item.value} ${item.meterUnit}` });
    } else {
      cacheObj[item.gISCode].valueArry.push({ dataTypeName: item.dataTypeName, value: `${item.value} ${item.meterUnit}` });
    }
  }
  // 如果已经传入地图信息，则不执行搜索
  if (graphics) {
    for (const [_, device] of Object.entries(cacheObj)) {
      for (const graphic of graphics) {
        if (Number(device[searchText]) === Number(graphic.attributes[searchFields])) {
          devices.push({ device: graphic, attributes: device });
          break;
        }
      }
    }
    // constantlyInfo(map, view, dispatch, devices, type, [], domType, scale, true);
  }
};
// 看板实时数据处理
const storeRealData = ({ type, resourceID, response }) => {
  if (constantlyPanelModal[type]) {
    if (constantlyPanelModal[type].data) {
      constantlyPanelModal[type].data[resourceID] = response.data;
    } else {
      constantlyPanelModal[type].data = {};
      constantlyPanelModal[type].data[resourceID] = response.data;
    }
  } else {
    constantlyPanelModal[type] = { data: {}, resourceIDs: [], temp: response.data };
  }
  const lineRealData = lineData({ line: constantlyPanelModal[type] }); // 数据转曲线对象数据

  constantlyPanelModal[type].lineRealData = lineRealData;
  if (constantlyPanelModal[type].checkedList === undefined || constantlyPanelModal[type].checkAll === true) {
    constantlyPanelModal[type].plainOptions = lineRealData.dot; // 所有点位 固定
    constantlyPanelModal[type].checkedList = lineRealData.dot; // 显示的点位
    constantlyPanelModal[type].indeterminate = false; // 判断是否已经被全选
    constantlyPanelModal[type].checkAll = true; // 判断是否选择全部 全选为true
  } else {
    const addDot = [];
    for (const item of lineRealData.dot) {
      if (constantlyPanelModal[type].plainOptions.indexOf(item) === -1) {
        addDot.push(item);
      }
    }
    constantlyPanelModal[type].plainOptions = lineRealData.dot;
    constantlyPanelModal[type].checkedList = constantlyPanelModal[type].checkedList.concat(addDot);
    constantlyPanelModal[type].indeterminate = true; // 判断是否已经被全选，有没有被选中的就为true
    constantlyPanelModal[type].checkAll = false; // 判断是否选择全部 全不选为false
    showDot = null;
  }
  if (constantlyPanelModal[type].targetCheckAll === undefined || constantlyPanelModal[type].targetCheckAll === true) {
    constantlyPanelModal[type].target = lineRealData.target; // 所有指标 固定
    constantlyPanelModal[type].dataName = lineRealData.dataName;
    constantlyPanelModal[type].targetCheckedList = lineRealData.target; // 显示的指标
    constantlyPanelModal[type].targetIndeterminate = false; // 判断是否已经被全选
    constantlyPanelModal[type].targetCheckAll = true; // 判断是否选择全部 全选为true
  } else {
    const addTarget = [];
    for (const item of lineRealData.target) {
      if (constantlyPanelModal[type].target.indexOf(item) === -1) {
        addTarget.push(item);
      }
    }
    constantlyPanelModal[type].target = lineRealData.target; // 所有指标 固定
    constantlyPanelModal[type].dataName = lineRealData.dataName;
    constantlyPanelModal[type].targetCheckedList = constantlyPanelModal[type].targetCheckedList.concat(addTarget);
    constantlyPanelModal[type].targetIndeterminate = true; // 判断是否已经被全选
    constantlyPanelModal[type].targetCheckAll = false; // 判断是否选择全部
  }
  console.log('constantlyPanelModal', constantlyPanelModal);
};

export default {
  namespace: 'constantlyData',
  state: {
    // 专题图实时数据
    thematicMap: { isloaded: false, data: {} },
    constantlyComponents: [],
    // 质量检测实时数据
    analysisPoint: {}, // 在线分析点位的实时数据
    analysisPointList: {}, // 区域在线分析点位的实时数据列表
    showLevel: 'plantLevel',
    //  危险源区域code
  },
  effects: {
    // 请求专题图实时数据
    *getConstantlyData({ payload }, { call }) {
      const { type, searchText, map, view, dispatch, searchFields, graphics, constantlyComponents, scale } = payload;
      const response = yield call(getAllNewsData, payload.param);
      thematicMaping({ type, view, deviceArray: constantlyModal[payload.type].data = response.data, searchText, map, dispatch, searchFields, graphics, constantlyComponents, scale });
    },
    // 请求区域（门禁）信息
    *getGuardAreaCounting({ payload }, { call }) {
      const { type, searchText, map, view, dispatch, searchFields, graphics, constantlyComponents, domType, scale } = payload;
      const response = yield call(getGuardCounting);
      thematicMapingDoor({ type, view, deviceArray: constantlyModal[payload.type].data = response.data, searchText, map, dispatch, searchFields, graphics, domType, scale });
    },
    // 设备监测实时值
    *getDeviceMonitorData({ payload }, { call }) {
      const { ctrlResourceType } = payload;

      const resourceInfos = yield call(resourceTreeByCtrlType, { ctrlType: ctrlResourceType });
      const response = yield call(getAllNewsData, payload);
      if (ctrlResourceType === '103.102.102') {
        const { data } = yield call(getA9AndB9);
        const newData = [];
        for (const item of data) {
          const obj1 = { ...item }; obj1.dataTypeName = 'COT'; obj1.value = item.cot;
          const res = resourceInfos.data.find(value => obj1.dissociationName.indexOf(value.processNumber) !== -1);
          obj1.gISCode = res ? res.gISCode : ''; obj1.resResourceInfo = res; obj1.meterUnit = '℃'; obj1.processNumber = res ? res.processNumber : '';
          const obj2 = { ...item }; obj2.dataTypeName = '运行负荷'; obj2.value = Number(item.loadValue) * 1000;
          obj2.gISCode = res ? res.gISCode : ''; obj2.resResourceInfo = res; obj2.meterUnit = 't/h'; obj2.processNumber = res ? res.processNumber : '';
          newData.push(obj1, obj2);
        }
        response.data.push(...newData);
      }
      const newData = [];
      for (const item of resourceInfos.data) {
        const data = response.data.filter(value => value.gISCode === item.gISCode);
        if (data.length > 0) {
          newData.push(...data);
        } else {
          newData.push({
            gISCode: item.gISCode,
            resResourceInfo: item,
          });
        }
      }
      let runDayUrl;
      const yesterday = new Date();// 获取当前时间
      yesterday.setDate(yesterday.getDate() - 1);// 设置天数 -1 天
      switch (payload.selectRunDay) {
        case 'proRptAlternatorInfo':
          runDayUrl = getAlternatorRunDay;
          break;
        case 'proRptDissociationInfo':
          runDayUrl = getDissociationRunDay;
          break;
        case 'proRptHotFurnaceInfo':
          runDayUrl = getHotFurnaceRunDay;
          break;
        default: break;
      }
      // 运行天数,同时更新实时数据
      const runDayData = yield call(runDayUrl, { date: yesterday.getTime() });
      if (constantlyModal[payload.ctrlResourceType] === undefined) {
        constantlyModal[payload.ctrlResourceType] = {};
        constantlyModal[payload.ctrlResourceType].data = newData;
        // constantlyModal[payload.ctrlResourceType].data = response.data;
        constantlyModal[payload.ctrlResourceType].runDayData = runDayData.data;
      } else {
        constantlyModal[payload.ctrlResourceType].data = newData;
        constantlyModal[payload.ctrlResourceType].runDayData = runDayData.data;
      }
    },
    *getGuardDoorCounting({ payload }, { call }) {
      const responseDoor = yield call(getGuardDoorCounting);
      const responseArea = yield call(getGuardCounting);
      yield constantlyModal[payload.domTypeDoor].data = responseDoor.data;
      yield constantlyModal[payload.domTypeArea].data = responseArea.data;
    },
    *getImmediateData({ payload }, { call }) {
      const response = yield call(getNewsData, {
        resourceID: payload.resourceID,
      });
      storeRealData({ type: payload.type, resourceID: payload.resourceID, response });
    },
    // 请求阈值
    *getConditionCalc({ payload }, { call }) {
      if (constantlyConditionCalc[payload.dataType] === undefined) {
        const { data } = yield call(getConditionCalc, payload);
        const obj = {
          minValue: data[0].startValue,
          maxValue: data[0].endValue,
          conditionCalc: [],
          quotaName: data[0].baseConditionCalc.dataItem.quotaName,
        };
        for (const item of data) {
          const { alarmType, baseConditionExpressShowInfoVOS } = item;
          const type = { name: alarmType.alarmTypeName, level: alarmType.dangerCoefficient };
          const range = [];
          for (const item1 of baseConditionExpressShowInfoVOS) {
            range.push({
              start: item1.startValue,
              end: item1.endValue,
            });
          }
          obj.conditionCalc.push({ type, range });
        }
        obj.conditionCalc.sort((a, b) => {
          return a.range[0].start - b.range[0].start;
        });
        constantlyConditionCalc[payload.dataType] = obj;
      }
    },
    // 点击加入看板请求曲线图实时数据
    *getHistoryData({ payload }, { call }) {
      const resourceID = payload.resourceID.slice(0, payload.resourceID.indexOf('&'));
      const response = yield call(findByTime, {
        resourceID,
        beginTime: payload.beginTime,
        endTime: payload.endTime,
      });
      storeRealData({ type: payload.type, resourceID: payload.resourceID, response });
    },
    // 请求环保实时数据(根据控制类型)
    *getNewsDataByCtrlResourceType({ payload }, { call }) {
      const { view, map, graphics, dispatch, ctrlResourceType, treeID } = payload;
      const { data } = yield call(getNewsDataByCtrlResourceType, { ctrlResourceType });
      // const data = {"15738":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15740":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15741":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15742":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15743":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15748":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15749":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15750":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15751":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15756":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15757":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15758":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15759":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15769":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15770":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15771":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15772":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15773":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15777":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15779":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15783":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15784":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15785":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15786":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15788":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15789":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15790":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15791":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15793":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15794":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15796":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15797":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15798":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15799":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15810":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15811":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15851":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15853":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15855":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15874":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15875":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"15876":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"16008":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"16009":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"16010":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}},"16011":{"ENVA1228":{"alarm":false,"baseConditionExpressShowInfoVOS":[{"conditionCalcListID":707,"conditionExpressShowInfoID":1344,"endValue":14,"remark":"环保超标（偏高）","startValue":9},{"conditionCalcListID":751,"conditionExpressShowInfoID":1388,"endValue":6,"remark":"环保超标（偏低）","startValue":0}],"collectTime":1545967171995,"gISCode":"16011","maxValue":14,"meterUnit":"PH","minValue":0,"profession":"107.301","quotaGroupCode":"ENV","quotaItem":"A1228","resourceCode":"15876","resourceID":13913,"value":"8.832079"}}};
      // const layer = mapConstants.baseLayer.findSublayerById(72);
      // console.log('layer', layer);
      // console.log('data', JSON.stringify(data));
      if (constantlyModal.env) {
        if (constantlyModal.env[treeID]) {
          constantlyModal.env.data = data;
          envMap({ view, map, graphics, dispatch });
        }
      }
    },
    // 请求环保实时数据(根据分组ID)
    *getNewsDataByGroup({ payload }, { call }) {
      const { view, map, graphics, dispatch, groupID, treeID } = payload;
      const { data } = yield call(getNewsDataByGroup, { groupID });
      if (constantlyModal.env) {
        if (constantlyModal.env[treeID]) {
          constantlyModal.env.data = data;
          envMap({ view, map, graphics, dispatch });
        }
      }
    },
  },
  reducers: {
    // 存储实时专题的值
    saveThematicMap(state, { payload }) {
      return {
        ...state,
        thematicMap: { isloaded: true, data: payload },
      };
    },
    // 存储门禁及区域的值
    saveGuardCounting(state, { payload }) {
      return {
        ...state,
        guardAreaCounting: payload,
      };
    },
    saveDoorCounting(state, { payload }) {
      return {
        ...state,
        guardDoorCounting: payload,
      };
    },
    // 实时专题图
    constantlyInfo(state, { payload }) {
      return {
        ...state,
        constantlyValue: payload,
      };
    },
    // 门禁实时专题图
    doorConstantlyInfo(state, { payload }) {
      return {
        ...state,
        doorConstantlyValue: payload,
      };
    },
    // 门禁区域实时专题图
    doorAreaConstantlyInfo(state, { payload }) {
      return {
        ...state,
        doorAreaConstantlyValue: payload,
      };
    },
    // 气体实时专题图
    gasConstantlyInfo(state, { payload }) {
      return {
        ...state,
        gasConstantlyValue: payload,
      };
    },
    // 环保实时专题图
    envConstantlyInfo(state, { payload }) {
      return {
        ...state,
        envConstantlyValue: payload,
      };
    },
    // Voc实时专题图
    vocConstantlyInfo(state, { payload }) {
      return {
        ...state,
        vocConstantlyValue: payload,
      };
    },
    // 质量检测地图显示级别 showLevel
    saveShowLevel(state, { payload }) {
      return {
        ...state,
        showLevel: payload,
      };
    },
    // 气体实时数据
    gas(state, { payload }) {
      return {
        ...state,
        gas: {
          ...state.gas,
          temp: payload,
        },
      };
    },
    updataGas(state, { payload }) {
      return {
        ...state,
        gas: payload,
      };
    },
    // 外排口实时数据
    outerDrain(state, { payload }) {
      return {
        ...state,
        outerDrain: {
          ...state.outerDrain,
          temp: payload,
        },
      };
    },
    // 更新外排口实时数据
    updataOuterDrain(state, { payload }) {
      return {
        ...state,
        outerDrain: payload,
      };
    },
    // 水监控实时数据
    waterMonitoring(state, { payload }) {
      return {
        ...state,
        waterMonitoring: {
          ...state.waterMonitoring,
          temp: payload,
        },
      };
    },
    // 更新水监控实时数据
    updataWaterMonitoring(state, { payload }) {
      return {
        ...state,
        waterMonitoring: payload,
      };
    },

    // 电监控实时数据
    electricityMonitoring(state, { payload }) {
      return {
        ...state,
        electricityMonitoring: {
          ...state.electricityMonitoring,
          temp: payload,
        },
      };
    },
    // 更新电监控实时数据
    updataElectricityMonitoring(state, { payload }) {
      return {
        ...state,
        electricityMonitoring: payload,
      };
    },

    // 汽监控实时数据
    gasMonitoring(state, { payload }) {
      return {
        ...state,
        gasMonitoring: {
          ...state.gasMonitoring,
          temp: payload,
        },
      };
    },
    // 更新汽监控实时数据
    updataGasMonitoring(state, { payload }) {
      return {
        ...state,
        gasMonitoring: payload,
      };
    },

    // 风监控实时数据
    windMonitoring(state, { payload }) {
      return {
        ...state,
        windMonitoring: {
          ...state.windMonitoring,
          temp: payload,
        },
      };
    },
    // 更新风监控实时数据
    updataWindMonitoring(state, { payload }) {
      return {
        ...state,
        windMonitoring: payload,
      };
    },

    saveGasResourceIDs(state, { payload }) {
      return {
        ...state,
        gas: {
          ...state.gas,
          resourceIDs: payload,
        },
      };
    },
    saveEnvrResourceIDs(state, { payload }) {
      return {
        ...state,
        outerDrain: {
          ...state.outerDrain,
          resourceIDs: payload,
        },
      };
    },
    // 实时专题图列表与数据
    queryConstantlyComponents(state, { payload }) {
      return {
        ...state,
        constantlyComponents: payload,
      };
    },

  },
};
