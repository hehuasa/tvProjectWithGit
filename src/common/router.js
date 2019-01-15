import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic ..
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
    ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login', 'tabs', 'sysFunction', 'commonTree', 'majorList', 'video', 'oftenFunction', 'alarmDeal', 'emergency'], () => import('../layouts/BasicLayout')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/homePage': {
      component: dynamicWrapper(app, ['homepage', 'panelBoard', 'map', 'sidebar', 'mapRelation', 'tabs', 'resourceTree', 'websocket', 'paSystem', 'alarm', 'video', 'combustibleGas', 'outerDrain', 'vocsMonitor', 'constantlyData', 'flow', 'accessControl', 'constructMonitor', 'organization'], () => import('../routes/HomePage/HomePage')),
    },
    // '/monitorWarning/evr': {
    //   component: dynamicWrapper(app, ['homepage', 'sidebar', 'map'], () => import('../routes/MonitorWarning/evr')),
    // },
    // '/monitorWarning/list': {
    //   component: dynamicWrapper(app, [], () => import('../routes/List/TableList')),
    // },
    // '/monitorWarning/demo': {
    //   component: dynamicWrapper(app, ['resourceTree'], () => import('../routes/Demo/Demo')),
    // },
    // '/monitorWarning/arcgis': {
    //   component: dynamicWrapper(app, ['sidebar', 'map'], () => import('../routes/Exception/404')),
    // },
    // '/user/register': {
    //   component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    // },
    // '/user/register-result': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    // },
    // // '/analysis': {
    // //   component: dynamicWrapper(app, ['error', 'majorList'], () => import('../routes/Dashboard/Analysis')), // 重点关注维护页面
    // // },
    //
    // '/dashboard/monitor': {
    //   component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
    // },
    // '/dashboard/arcgis': {
    //   component: dynamicWrapper(app, ['monitor'], () => import('../routes/ArcgisMap/ArcgisMap')),
    // },
    // '/dashboard/workplace': {
    //   component: dynamicWrapper(app, ['project', 'activities', 'chart'], () => import('../routes/Dashboard/Workplace')),
    //   // hideInBreadcrumb: true,
    //   // name: '工作台',
    //   // authority: 'admin',
    // },
    // '/form/basic-form': {
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
    // },
    // '/form/step-form': {
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
    // },
    // '/form/step-form/info': {
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step1')),
    // },
    // '/form/step-form/confirm': {
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
    // },
    // '/form/step-form/result': {
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
    // },
    // '/form/advanced-form': {
    //   component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
    // },
    // '/list/table-list': {
    //   component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
    // },
    // '/list/basic-list': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
    // },
    // '/list/card-list': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
    // },
    // '/list/search': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')),
    // },
    // '/list/search/projects': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
    // },
    // '/list/search/applications': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
    // },
    // '/list/search/articles': {
    //   component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
    // },
    // '/profile/basic': {
    //   component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')),
    // },
    // '/profile/advanced': {
    //   component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/AdvancedProfile')),
    // },
    // '/result/success': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    // },
    // '/result/fail': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    // },
    // '/exception/403': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    // },
    // '/exception/404': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    // },
    // '/exception/500': {
    //   component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    // },
    // '/exception/trigger': {
    //   component: dynamicWrapper(app, ['error'], () => import('../routes/Exception/triggerException')),
    // },
    '/system/user': {
      component: dynamicWrapper(app, ['error', 'userList', 'typeCode'], () => import('../routes/System/User/UserInfo')),
    },
    '/system/account': {
      component: dynamicWrapper(app, ['error', 'userList', 'typeCode', 'accountInfo'], () => import('../routes/System/User/AccountInfo')),
    },
    '/system/role': {
      component: dynamicWrapper(app, ['error', 'roleInfo', 'typeCode', 'sysFunction'], () => import('../routes/System/User/RoleInfo')),
    },
    '/emgcManage/emgcOrg': {
      component: dynamicWrapper(app, ['error', 'organization'], () => import('../routes/System/Orgnization/Orgnization')),
    },
    // 接口平台管理
    '/system/systemInterface': {
      component: dynamicWrapper(app, ['system', 'error'], () => import('../routes/System/SystemInterface/InterfaceList')),
    },
    '/tools/template': {
      component: dynamicWrapper(app, ['error', 'template', 'typeCode'], () => import('../routes/UniversalTool/BaseShortMsgTemplate')),
    },
    '/tools/msgGroup': {
      component: dynamicWrapper(app, ['template', 'userList', 'sendMsg'], () => import('../routes/UniversalTool/MsgGroup')),
    },
    '/tools/msgManage': {
      component: dynamicWrapper(app, ['template'], () => import('../routes/UniversalTool/MsgManage')),
    },
    '/tools/msgRule': {
      component: dynamicWrapper(app, ['template'], () => import('../routes/UniversalTool/MsgRule')),
    },
    '/tools/sendMsg': {
      component: dynamicWrapper(app, ['template'], () => import('../routes/UniversalTool/SendMsg')),
    },
    '/tools/flowEdior': {
      component: dynamicWrapper(app, ['flow'], () => import('../routes/FlowEditor')),
    },
    '/productionDispatch/majorList': {
      component: dynamicWrapper(app, ['error', 'majorList'], () => import('../routes/productionDispatch/MajorList')), // 重点关注维护页面
    },
    '/productionDispatch/manage': {
      component: dynamicWrapper(app, ['productionDaily'], () => import('../routes/DailyProduction/Edit/index')),
    },
    // '/productionDispatch/query': {
    //   component: dynamicWrapper(app, ['productionDaily'], () => import('../routes/DailyProduction/List/List')),
    // },
    // 生产日报 各装置生产情况
    '/productionDispatch/eqProductInfo': {
      component: dynamicWrapper(app, ['productionDaily'], () => import('../routes/DailyProduction/EquipmentProductInfo')),
    },
    // 生产日报 全厂蒸汽平衡
    '/productionDispatch/gasBalance': {
      component: dynamicWrapper(app, ['productionDaily'], () => import('../routes/DailyProduction/SteamBalance')),
    },
    // 生产日报 生产情况
    '/productionDispatch/productReportInfo': {
      component: dynamicWrapper(app, ['productionDaily'], () => import('../routes/DailyProduction/ProductReportInfo')),
    },
    // 生产日报 生产情况维护
    '/productionDispatch/productMaintian': {
      component: dynamicWrapper(app, ['productionDaily'], () => import('../routes/DailyProduction/ProductReportInfoMaintain')),
    },
    // 生产日报 裂解炉运行情况
    '/productionDispatch/dissociationInfo': {
      component: dynamicWrapper(app, ['productionDaily'], () => import('../routes/DailyProduction/DissociationInfo')),
    },
    // 生产日报 热电炉运行情况
    '/productionDispatch/hotFurnaceInfo': {
      component: dynamicWrapper(app, ['productionDaily'], () => import('../routes/DailyProduction/HotFurnaceInfo')),
    },
    // 生产日报 原材料
    '/productionDispatch/rawInfo': {
      component: dynamicWrapper(app, ['productionDaily'], () => import('../routes/DailyProduction/RawInfo')),
    },
    // 生产日报 有机产品
    '/productionDispatch/organicProductInfo': {
      component: dynamicWrapper(app, ['productionDaily'], () => import('../routes/DailyProduction/OrganicProductInfo')),
    },
    // 生产日报 有机产品
    '/productionDispatch/resinReportInfo': {
      component: dynamicWrapper(app, ['productionDaily'], () => import('../routes/DailyProduction/ResinReportInfo')),
    },
    '/systemsAnalysis/historyDataList': {
      component: dynamicWrapper(app, ['error', 'historyData'], () => import('../routes/systemsAnalysis/HistoryDataList')), // 历史实时数据查询
    },
    // 应急指挥事件
    '/command/emergencyEvent': {
      component: dynamicWrapper(app, ['emergency', 'user', 'emergency', 'homepage', 'video', 'global', 'accessControl', 'map', 'resourceTree', 'commonResourceTree'], () => import('../routes/EmergencyCommand/index')),
    },
    // 未处理的事件列表
    '/command/unHandledEventAll': {
      component: dynamicWrapper(app, ['emergency', 'user'], () => import('../routes/EmergencyCommand/UnhandledEvent/unhandledEvent')),
    },
    // 未处理的事件列表 信息接报
    '/command/unHandledEventOne': {
      component: dynamicWrapper(app, ['emergency', 'user'], () => import('../routes/EmergencyCommand/UnhandledEvent/unhandledEvent')),
    },
    // 未处理的事件列表 应急研判
    '/command/unHandledEventTwo': {
      component: dynamicWrapper(app, ['emergency', 'user'], () => import('../routes/EmergencyCommand/UnhandledEvent/unhandledEvent')),
    },
    // 未处理的事件列表 应急预警
    '/command/unHandledEventThree': {
      component: dynamicWrapper(app, ['emergency', 'user'], () => import('../routes/EmergencyCommand/UnhandledEvent/unhandledEvent')),
    },
    // 未处理的事件列表 应急启动
    '/command/unHandledEventFour': {
      component: dynamicWrapper(app, ['emergency', 'user'], () => import('../routes/EmergencyCommand/UnhandledEvent/unhandledEvent')),
    },
    // 未处理的事件列表 应急处理
    '/command/unHandledEventFive': {
      component: dynamicWrapper(app, ['emergency', 'user'], () => import('../routes/EmergencyCommand/UnhandledEvent/unhandledEvent')),
    },
    // 未处理的事件列表 终止
    '/command/unHandledEventSix': {
      component: dynamicWrapper(app, ['emergency', 'user'], () => import('../routes/EmergencyCommand/UnhandledEvent/unhandledEvent')),
    },
    // 未处理的演练事件列表
    '/emgcDrill/unHandledDrillAll': {
      component: dynamicWrapper(app, ['emergency', 'user'], () => import('../routes/EmergencyCommand/UnhandledEvent/unhandledDrill')),
    },
    // 未处理的演练接报列表
    '/emgcDrill/unHandledDrillOne': {
      component: dynamicWrapper(app, ['emergency', 'user'], () => import('../routes/EmergencyCommand/UnhandledEvent/unhandledDrill')),
    },
    // 未处理的演练研判列表
    '/emgcDrill/unHandledDrillTwo': {
      component: dynamicWrapper(app, ['emergency', 'user'], () => import('../routes/EmergencyCommand/UnhandledEvent/unhandledDrill')),
    },
    // 未处理的演练预警列表
    '/emgcDrill/unHandledDrillThree': {
      component: dynamicWrapper(app, ['emergency', 'user'], () => import('../routes/EmergencyCommand/UnhandledEvent/unhandledDrill')),
    },
    // 未处理的演练启动列表
    '/emgcDrill/unHandledDrillFour': {
      component: dynamicWrapper(app, ['emergency', 'user'], () => import('../routes/EmergencyCommand/UnhandledEvent/unhandledDrill')),
    },
    // 未处理的演练处理列表
    '/emgcDrill/unHandledDrillFive': {
      component: dynamicWrapper(app, ['emergency', 'user'], () => import('../routes/EmergencyCommand/UnhandledEvent/unhandledDrill')),
    },
    // 未处理的演练终止列表
    '/emgcDrill/unHandledDrillSix': {
      component: dynamicWrapper(app, ['emergency', 'user'], () => import('../routes/EmergencyCommand/UnhandledEvent/unhandledDrill')),
    },
    '/emgcManage/planManagement': {
      component: dynamicWrapper(app, ['user', 'planManagement'], () => import('../routes/PlanManagement/PlanManagement')), // 预案管理
    },
    '/systemsAnalysis/historyDataLine': {
      component: dynamicWrapper(app, ['error', 'historyLine'], () => import('../routes/systemsAnalysis/HistoryDataLine')), // 历史实时数据查询
    },
    // 历史报警列表
    '/systemsAnalysis/historyAlarmList': {
      component: dynamicWrapper(app, ['error', 'historyLine'], () => import('../routes/systemsAnalysis/HistoryAlarmList')), // 历史实时数据查询
    },
    '/command/alarmMerge': {
      component: dynamicWrapper(app, ['user', 'alarm'], () => import('../routes/PlanManagement/AlarmMerge/AlarmMerge')), // 报警合并
    },
    '/emgcManage/emgcReport': {
      component: dynamicWrapper(app, [], () => import('../routes/PlanManagement/EmgcReport/index')), // 应急报告下载
    },
    // 应急资源管理 emgcResourceManage
    '/emgcManage/emgcResourceManage': {
      component: dynamicWrapper(app, ['emgcResource'], () => import('../routes/EmergencyResource/EmergencyResource')), // 应急方案管理
    },
    '/knowledgeBase/materialMaintain': {
      component: dynamicWrapper(app, [], () => import('../routes/KnowledgeBase/MaterialMaintain/index')), // 物料维护
    },
    '/system/systemCode': {
      component: dynamicWrapper(app, ['typeCode'], () => import('../routes/System/SystemCode/index')), // 码表维护
    },
    '/emgcDrill/manage': {
      component: dynamicWrapper(app, ['drillManage'], () => import('../routes/EmergencyDrill/DrillManage')), // 应急方案管理
    },
    // 生产日报 上传报表
    '/productionDispatch/uploadReport': {
      component: dynamicWrapper(app, ['productionDaily'], () => import('../routes/DailyProduction/UploadReport')),
    },
    // 生产日报 有机产品
    '/productionDispatch/powerConsumption': {
      component: dynamicWrapper(app, ['productionDaily'], () => import('../routes/DailyProduction/PowerConsumption')),
    },
    // 生产日报 有机产品
    '/productionDispatch/wastewaterBalance': {
      component: dynamicWrapper(app, ['productionDaily'], () => import('../routes/DailyProduction/WastWaterBalance')),
    },
    // 质量日报 原料
    '/productionDispatch/limisRawMaterial': {
      component: dynamicWrapper(app, ['productionDaily'], () => import('../routes/DailyProduction/LimisReportData/LimisRawMaterial')),
    },
    // 质量日报 中控
    '/productionDispatch/limisMiddleControl': {
      component: dynamicWrapper(app, ['productionDaily'], () => import('../routes/DailyProduction/LimisReportData/LimisCenterControl')),
    },
    // 质量日报 产品
    '/productionDispatch/limisProduct': {
      component: dynamicWrapper(app, ['productionDaily'], () => import('../routes/DailyProduction/LimisReportData/LimisProduct')),
    },
    // 仓储物流 车辆实时进出厂监控
    '/productionDispatch/carInOut': {
      component: dynamicWrapper(app, ['productionDaily'], () => import('../routes/DailyProduction/Logistics/CarInOut')),
    },
    // 仓储物流 实时物资进厂列表
    '/productionDispatch/materialInFactory': {
      component: dynamicWrapper(app, ['productionDaily'], () => import('../routes/DailyProduction/Logistics/MaterialInFactory')),
    },
    // 仓储物流 实时提货列表清单
    '/productionDispatch/takeCargoList': {
      component: dynamicWrapper(app, ['productionDaily'], () => import('../routes/DailyProduction/Logistics/TakeCargoList')),
    },
    // 历史应急事件
    '/emgcManage/historyEvent': {
      component: dynamicWrapper(app, ['emergency'], () => import('../routes/EmergencyCommand/UnhandledEvent/historyEmergencyEvent')),
    },
    // 历史应急事件
    '/emgcDrill/historyDrill': {
      component: dynamicWrapper(app, ['emergency'], () => import('../routes/EmergencyCommand/UnhandledEvent/historyDrillEvent')),
    },
    // 历史报警列表
    '/emgcManage/historyAlarmList': {
      component: dynamicWrapper(app, ['alarmHistory', 'alarm'], () => import('../routes/EmergencyCommand/AlarmHistory/AlarmHistory')),
    },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu

  Object.keys(routerConfig).forEach((path) => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`/${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
    };
    routerData[path] = router;
  });
  return routerData;
};
