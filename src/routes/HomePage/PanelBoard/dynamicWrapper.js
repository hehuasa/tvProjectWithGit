import { createElement } from 'react';

const dynamicWrapper = (component) => {
  return (props) => {
    return createElement(component().default, {
      ...props,
    });
  };
};
export const panelData = {
  // iconStyle = 1：扩展态；2：table；3、柱状图；4：饼状图；5：折线图; 6： 柱状图1 AlarmList
  // 报警统计看板
  AlarmList: {
    name: 'AlarmList', id: 1, iconStyle: [1], component: dynamicWrapper(() => import('./components/AlarmList')),
  },
  AlarmListByFault: {
    name: 'AlarmListByFault', id: 11, iconStyle: [1], component: dynamicWrapper(() => import('./components/AlarmListByFault/AlarmListByFault')),
  },
  // 柱状图报警统计看板
  AlarmCountingPanel: {
    name: 'AlarmCountingPanel', id: 2, iconStyle: [3, 4, 2], component: dynamicWrapper(() => import('./components/AlarmCounting/AlarmCountingPanel')),
  },
  // 实时数据看板
  realDataPanel: {
    name: 'realDataPanel', id: 3, iconStyle: [5, 2], component: dynamicWrapper(() => import('./components/commonLine/CommonWrap')),
  },

  // 人员进出门禁看板
  EntranceGuard: {
    name: 'EntranceGuard', id: 4, iconStyle: [1, 2], component: dynamicWrapper(() => import('./components/entranceGuard/EntranceGuardList')),
  },

  // VOCs治理看板
  VOCSGovernList: {
    name: 'VOCSGovernList', id: 5, iconStyle: [1, 2], component: dynamicWrapper(() => import('./components/VOCSGovern/VOCSGovernList')),
  },

  LiquidPot: {
    name: 'LiquidPot', title: '液体罐存看板', id: 6, iconStyle: [1, 2], component: dynamicWrapper(() => import('./components/liquidPot/LiquidPot')),
  },
  CalzadaFreight: {
    name: 'CalzadaFreight', title: '公路运输看板', id: 7, iconStyle: [1, 2], component: dynamicWrapper(() => import('./components/calzadaFreight/CalzadaFreight')),
  },
  RailwayFreight: {
    name: 'RailwayFreight', title: '铁路运输看板', id: 8, iconStyle: [1, 2], component: dynamicWrapper(() => import('./components/railwayFreight/RailwayFreight')),
  },
  // 事件信息
  EventInfo: {
    name: 'EventInfo', id: 9, iconStyle: [], component: dynamicWrapper(() => import('./components/EventInfo/EventInfo')),
  },
  // 作业监控
  ConstructMontiorPanel: {
    name: 'ConstructMontiorPanel', id: 10, iconStyle: [1, 2, 3, 6], component: dynamicWrapper(() => import('./components/ConstructMonitor/ConstructMonitor')),
  },
  // AlarmCountingByFire: {
  //   name: 'AlarmCountingByFire', title: '火灾报警统计看板', id: 2, iconStyle: [3, 4], component: dynamicWrapper(() => import('./components/AlarmCounting/AlarmCounting')),
  // },
  // AlarmCountingByGas: {
  //   name: 'AlarmCountingByGas', title: '气体报警统计看板', id: 3, iconStyle: [3, 4], component: dynamicWrapper(() => import('./components/AlarmCounting/AlarmCounting')),
  // },
  // CombustibleGas: {
  //   name: 'CombustibleGas', title: '气体时实数据看板', id: 4, iconStyle: [5, 2], component: dynamicWrapper(() => import('./components/commonLine/CommonWrap')),
  // },
  // OuterDrain: {
  //   name: 'OuterDrain', title: '外排口实时数据看板', id: 5, iconStyle: [5, 2], component: dynamicWrapper(() => import('./components/commonLine/CommonWrap')),
  // },

  // WaterMonitoring: {
  //   name: 'WaterMonitoring', title: '水监控看板', id: 7, iconStyle: [5, 2], component: dynamicWrapper(() => import('./components/commonLine/CommonWrap')),
  // },
  // ElectricityMonitoring: {
  //   name: 'ElectricityMonitoring', title: '电监控看板', id: 8, iconStyle: [5, 2], component: dynamicWrapper(() => import('./components/commonLine/CommonWrap')),
  // },
  // GasMonitoring: {
  //   name: 'GasMonitoring', title: '汽监控看板', id: 9, iconStyle: [5, 2], component: dynamicWrapper(() => import('./components/commonLine/CommonWrap')),
  // },
  // WindMonitoring: {
  //   name: 'WindMonitoring', title: '风监控看板', id: 10, iconStyle: [5, 2], component: dynamicWrapper(() => import('./components/commonLine/CommonWrap')),
  // },
  // CrackingFurnace: {
  //   name: 'CrackingFurnace', title: '裂解炉看板', id: 11, iconStyle: [5, 2], component: dynamicWrapper(() => import('./components/commonLine/CommonWrap')),
  // },
  // Boiler: {
  //   name: 'Boiler', title: '锅炉看板', id: 12, iconStyle: [5, 2], component: dynamicWrapper(() => import('./components/commonLine/CommonWrap')),
  // },
  // Alternator: {
  //   name: 'Alternator', title: '发电机看板', id: 13, iconStyle: [5, 2], component: dynamicWrapper(() => import('./components/commonLine/CommonWrap')),
  // },
  // LargeUnit: {
  //   name: 'LargeUnit', title: '大机组看板', id: 14, iconStyle: [5, 2], component: dynamicWrapper(() => import('./components/commonLine/CommonWrap')),
  // },
  // JobMonitoring: {
  //   name: 'JobMonitoring', title: '作业监控看板', id: 15, iconStyle: [3], component: dynamicWrapper(() => import('./components/jobMonitoring/JobMonitoring')),
  // },

  // QualityMonitoring: {
  //   name: 'QualityMonitoring', title: '质量监测看板', id: 17, iconStyle: [5, 2], component: dynamicWrapper(() => import('./components/commonLine/CommonWrap')),
  // },

};
