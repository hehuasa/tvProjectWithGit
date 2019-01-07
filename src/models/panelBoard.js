import { constantlyPanelModal } from "../services/constantlyModal";


const activeKeys = [
  { name: 'AlarmList', keys: 'AlarmList', uniqueKey: new Date().getTime(), param: { alarmType: 'AlarmList', title: '当前报警列表' } },
  { name: 'ConstructMontiorPanel', keys: 'ConstructMontiorPanel', uniqueKey: new Date().getTime(), param: { alarmType: '', title: '作业监控看板' } },
];
const expandKeys = ['AlarmList', 'ConstructMontiorPanel'];
localStorage.setItem('panelBoard', JSON.stringify({ activeKeys, expandKeys }));
export default {
  namespace: 'panelBoard',
  state: {
    constantlyPanelModal: {},
    expandKeys: [],
    activeKeys: [
      { name: 'EventInfo', keys: 'EventInfo', type: 'default', uniqueKey: 0, param: { alarmType: '', title: '事件信息' } }, // 事件信息
      // { name: 'EntranceGuard', keys: 223, uniqueKey: 0, type: 'default', param: { alarmType:"", title: '门禁' } }, // 门禁
      { name: 'AlarmList', keys: 'AlarmList', uniqueKey: new Date().getTime(), param: { alarmType: 'AlarmList', title: '当前报警列表' } }, // 报警统计列表
      // { name: 'AlarmCountingPanel', keys: "113", type:'default', param: { alarmType: 107.102, title: '气体报警统计看板' } }, // 气体报警统计看板
      // { name: 'AlarmCountingPanel', keys: "115", type:'default',  param: { alarmType: 101.102, title: '火灾报警统计看板' } }, // 火灾报警统计看板
      // { name: 'realData', keys: "364524", uniqueKey: 0, type: 'default', param: { title: 123 } }, // 气体时实数据看板
      // { name: 'OuterDrain', keys: 115, uniqueKey: 0, param: {} }, // 外排口实时数据看板
      // { name: 'WaterMonitoring', keys: 331, param: {} }, // 水监测
      // { name: 'ElectricityMonitoring', keys: 334, param: {} }, // 电监测
      // { name: 'GasMonitoring', keys: 445, param: {} }, // 汽监测
      // { name: 'WindMonitoring', keys: 556, param: {} }, // 风监测
      // { name: 'CrackingFurnace', keys: 665, param: {} }, // 裂解炉
      // { name: 'Boiler', keys: 446, param: {} }, // 锅炉
      // { name: 'Alternator', keys: 776, param: {} }, // 发电机
      // { name: 'LargeUnit', keys: 665, param: {} }, // 大机组
      // { name: 'JobMonitoring', keys: 448, param: {} }, // 作业监控
      // { name: 'VOCSGovernList', keys: 456, param: {} }, // VOCs治理
      // { name: 'QualityMonitoring', keys: 372, param: {} }, // 质量监测看板
      // { name: 'LiquidPot', keys: 257, param: {} }, //
      // { name: 'CalzadaFreight', keys: 276, param: {} }, //
      // { name: 'RailwayFreight', keys: 474, param: {} }, //

    ],
    // toggleContent: {
    //   // 火灾报警
    //   AlarmCountingByFire: { name: 'AlarmCountingByFire', type: 'default' },
    //   // 火灾报警
    //   AlarmCountingPanel: { name: 'AlarmCountingPanel', type: 'default' },
    //   // 气体报警看板
    //   AlarmCountingByGas: { name: 'AlarmCountingByGas', type: 'default' },
    //   // 气体时实数据看板
    //   CombustibleGas: { name: 'CombustibleGas', type: 'default' },
    //   // 外排口实时数据看板
    //   OuterDrain: { name: 'OuterDrain', type: 'default' },
    //   // 门禁
    //   // EntranceGuard: { name: 'EntranceGuard', type: 'default' },
    //   // 水监测
    //   WaterMonitoring: { name: 'WaterMonitoring', type: 'default' },
    //   // 汽监测
    //   ElectricityMonitoring: { name: 'ElectricityMonitoring', type: 'default' },
    //   // 气监测
    //   GasMonitoring: { name: 'GasMonitoring', type: 'default' },
    //   // 风监测
    //   WindMonitoring: { name: 'WindMonitoring', type: 'default' },
    //   // 裂解炉
    //   CrackingFurnace: { name: 'CrackingFurnace', type: 'default' },
    //   // 锅炉
    //   Boiler: { name: 'Boiler', type: 'default' },
    //   // 发电机
    //   Alternator: { name: 'Alternator', type: 'default' },
    //   // 大机组
    //   LargeUnit: { name: 'LargeUnit', type: 'default' },
    //   // 作业监控
    //   JobMonitoring: { name: 'JobMonitoring', type: 'default' },
    //   // VOCs治理
    //   // VOCSGovernList: { name: 'VOCSGovernList', type: 'default' },
    //   // 质量监测看板
    //   QualityMonitoring: { name: 'QualityMonitoring', type: 'default' },
    // },

  },
  effects: {
    *saveConstantlyPanelModal({ payload }, { put }) {
      localStorage.setItem('constantlyPanelModal', JSON.stringify(payload));
      // yield put({
      //   type: 'getConstantlyPanelModal',
      // });
    },
    *queryList({ payload }, { put }) {
      localStorage.setItem('panelBoard', JSON.stringify(payload));
      yield put({
        type: 'getList',
      });
    },
    *zoomIn({ payload }, { put }) {
      yield put({
        type: 'zoomInPanel',
        payload,
      });
    },
  },
  reducers: {
    getList(state) {
      let payload = localStorage.getItem('panelBoard');
      if (payload !== null) {
        payload = JSON.parse(payload);
      } else {
        payload = {
          expandKeys: [],
          activeKeys: [],
        };
      }
      return {
        ...state,
        expandKeys: payload.expandKeys,
        activeKeys: payload.activeKeys,
      };
    },
    getConstantlyPanelModal(state) {
      let payload = localStorage.getItem('constantlyPanelModal');
      if (payload !== null) {
        payload = JSON.parse(payload);
      } else {
        payload = {
        };
      }
      for (const i in payload) {
        if (Object.prototype.hasOwnProperty.call(payload, i)) {
          constantlyPanelModal[i] = payload[i];
        }
      }
      return {
        ...state,
        constantlyPanelModal: payload,
      };
    },
    zoomInPanel(state, { payload }) {
      return {
        ...state,
        activeKey: payload.id,
        zoomData: payload.data,
      };
    },
    collapseAll(state) {
      return {
        ...state,
        expandKeys: [],
      };
    },
    expandAll(state, { payload }) {
      return {
        ...state,
        expandKeys: payload,
      };
    },
    // toggleContent(state, { payload }) {
    //   return {
    //     ...state,
    //     toggleContent: payload,
    //   };
    // },
    alterUniqueKey(state, { payload }) {
      return {
        ...state,
        activeKeys: payload,
      };
    },
  },
};


// activeKeys:  'FieryStatistics', 'GasStatistics', 'CombustibleGas', 'OuterDrain', 'EntranceGuard', 'WaterMonitoring','ElectricityMonitoring', 'GasMonitoring',
//  'WindMonitoring', 'CrackingFurnace', 'Boiler', 'Alternator', 'LargeUnit','JobMonitoring','VOCSGovernList','QualityMonitoring','LiquidPot','CalzadaFreight',
// 'RailwayFreight',
