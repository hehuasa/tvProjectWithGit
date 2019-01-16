import { stringify } from 'qs';
import request from '../utils/request';
// import jsonpFetch from '../utils/jsonpRequest';
import downLoad from '../utils/downLoad';

const path = '/emgc';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function fakeMonitorSideData() {
  return request('/api/fake_monitor_side_data');
}

// export async function alarmList() {
//   return request(`${path}/system/alarmInfo/list`);
// }
export async function alarmList() {
  return request(`${path}/system/alarmInfo/getAllUntreared`);
}
export async function alarmQuery(params) {
  return request(`${path}/system/alarmInfo/getPageForQuery`, {
    method: 'POST',
    body: params,
  });
}

export async function clearTwinkle(params) {
  return request(`${path}/system/alarmDeal/setDisplayAlarm`, {
    method: 'POST',
    body: params,
  });
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeResourceTree(params) {
  return request('/api/fakeResourceTree', {
    method: 'POST',
    body: params,
  });
}

export async function resourceTree() {
  return request(`${path}/resource/resourceTree/getByParentTree`, {
    // method: 'POST',
    // body: params,
  });
}
export async function commonResourceTree() {
  return request(`${path}/resource/resourceTree/getResourceInfo`, {
    // method: 'POST',
    // body: params,
  });
}

export async function resourceTreeByCtrlType(params) {
  return request(`${path}/resource/resourceInfo/selectByCtrlType?ctrlType=${params.ctrlType}`, {
    method: 'GET',
  });
}

export async function accountLogin(params) {
  return request(`${path}/system/login`, {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function fakequeryWeather() {
  return request('/api/weather');
}

export async function queryWeatherData() {
  return request(`${path}/weather/weather`);
}

export async function queryHydrology() {
  return request(`${path}/weather/hydrology`);
}

export async function fakeTextCarousel() {
  return request('/api/TextCarousel');
}

export async function importConfigList() {
  return request('/importConfig/list');
}

export async function queryUserList(params) {
  return request(`/api/list/user?${stringify(params)}`);
}

export async function findUserList() {
  return request(`${path}/system/userInfo/list`);
}
export const getUserPage = async (params) => {
  return request(`${path}/system/userInfo/page`, {
    method: 'POST',
    body: params,
  });
};
// 根据parentCode取码表信息
export async function selectByTypeParent(params) {
  return request(`${path}/system/baseSystemCode/selectByCodeByCode?codeTypeCode=${params}`);
}
// 根据code取码表信息
export async function selectByCode(params) {
  return request(`${path}/system/baseSystemCode/selectByCodeByCode?code=${params}`);
}

export async function addUserInfo(params) {
  return request(`${path}/system/userInfo/add`, {
    method: 'POST',
    body: params,
  });
}

export async function deleteUserInfo(params) {
  return request(`${path}/system/userInfo/delete`, {
    method: 'POST',
    body: { id: params },
  });
}

export async function getUserInfo(params) {
  return request(`${path}/system/userInfo/get`, {
    method: 'POST',
    body: { id: params },
  });
}

export async function updateUserInfo(params) {
  return request(`${path}/system/userInfo/update`, {
    method: 'POST',
    body: params,
  });
}

export async function findUserPage(params) {
  return request(`${path}/system/userInfo/page`, {
    method: 'POST',
    body: params,
  });
}

export async function exportUserInfo(params) {
  return downLoad(`${path}/system/userInfo/export`, params);
}

export async function accountPage(params) {
  return request(`${path}/system/accountInfo/page`, {
    method: 'POST',
    body: params,
  });
}

export async function addAccountInfo(params) {
  return request(`${path}/system/accountInfo/add`, {
    method: 'POST',
    body: params,
  });
}

export async function getAccountInfo(params) {
  return request(`${path}/system/accountInfo/get`, {
    method: 'POST',
    body: { id: params },
  });
}

export async function deleteAccountInfo(params) {
  return request(`${path}/system/accountInfo/delete`, {
    method: 'POST',
    body: { id: params },
  });
}

export async function exportAccountInfo(params) {
  return downLoad(`${path}/system/accountInfo/export`, params);
}

export async function findRoleList() {
  return request(`${path}/system/roleInfo/list`);
}

export async function rolePage(params) {
  return request(`${path}/system/roleInfo/page`, {
    method: 'POST',
    body: params,
  });
}

export async function addRoleInfo(params) {
  return request(`${path}/system/roleInfo/add`, {
    method: 'POST',
    body: params,
  });
}

export async function roleUpdate(params) {
  return request(`${path}/system/roleInfo/update`, {
    method: 'POST',
    body: params,
  });
}

export async function getRoleInfo(params) {
  return request(`${path}/system/roleInfo/get`, {
    method: 'POST',
    body: { id: params },
  });
}

export async function deleteRoleInfo(params) {
  return request(`${path}/system/roleInfo/delete`, {
    method: 'POST',
    body: { id: params },
  });
}

export async function exportRoleInfo(params) {
  return downLoad(`${path}/system/roleInfo/export`, params);
}

export async function orgList() {
  return request(`${path}/system/organization/list`);
}

export async function orgGet(params) {
  return request(`${path}/system/organization/get`, {
    method: 'POST',
    body: { id: params },
  });
}

export async function orgAdd(params) {
  return request(`${path}/system/organization/add`, {
    method: 'POST',
    body: params,
  });
}

export async function orgUpdate(params) {
  return request(`${path}/system/organization/update`, {
    method: 'POST',
    body: params,
  });
}

export async function orgDelete(params) {
  return request(`${path}/system/organization/delete`, {
    method: 'POST',
    body: { id: params },
  });
}
// 重置密码
export async function resetPwd(params) {
  return request(`${path}/system/accountInfo/resetPass`, {
    method: 'POST',
    body: params,
  });
}

export async function updateAccountInfo(params) {
  return request(`${path}/system/accountInfo/update`, {
    method: 'POST',
    body: params,
  });
}

export async function sysFunctionList() {
  return request(`${path}/system/sysFunction/list`);
}

export async function findFunctionsByRoleID(params) {
  return request(`${path}/system/baseRoleFunction/selectByRoleID`, {
    method: 'POST',
    body: { roleID: params },
  });
}
// 权限配置功能
export async function addRoleFunctions(params) {
  return request(`${path}/system/baseRoleFunction/mergeFunction`, {
    method: 'POST',
    body: params,
  });
}

export async function addRoleAccountConfig(params) {
  return request(`${path}/system/baseAccountRole/add`, {
    method: 'POST',
    body: params,
  });
}

export async function selectAccountByRoleID(params) {
  return request(`${path}/system/baseAccountRole/selectByRoleID`, {
    method: 'POST',
    body: { roleID: params },
  });
}

export async function findFunctionsByUserID(params) {
  return request(`${path}/system/sysFunction/selectByAccountID`, {
    method: 'POST',
    body: params,
  });
}

export async function loginOut() {
  return request(`${path}/system/loginout`);
}

export async function getInfoByAccountID(params) {
  return request(`${path}/system/accountInfo/get`, {
    method: 'POST',
    body: { id: params },
  });
}

export async function addCommonResource(params) {
  return request(`${path}/resource/baseOftenResource/add`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function commonTreeList(params) {
  return request(`${path}/resource/baseOftenResource/selectAccountID`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function findOftenFunction(params) {
  return request(`${path}/system/sysFunction/selectByAccountID`, {
    method: 'POST',
    body: params,
  });
}

export async function deleteCommon(params) {
  return request(`${path}/resource/baseOftenResource/deleteByID`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function addOftenFunction(params) {
  return request(`${path}/system/baseOftenFunction/add`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function findOftenFuncs(params) {
  return request(`${path}/system/baseOftenFunction/selectByAccountID`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function selectIfOften(params) {
  return request(`${path}/resource/baseOftenResource/selectRes`, {
    method: 'POST',
    body: { ...params },
  });
}

export async function deleteOften(params) {
  return request(`${path}/system/baseOftenFunction/deleteInfo`, {
    method: 'POST',
    body: { ...params },
  });
}

// 重点关注
export async function majorInfoPage(params) {
  return request(`${path}/production/proConcern/page`, {
    method: 'POST',
    body: params,
  });
}

export async function updateMajorrInfo(params) {
  return request(`${path}/production/proConcern/update`, {
    method: 'POST',
    body: params,
  });
}

export async function deleteMajorInfo(params) {
  return request(`${path}/production/proConcern/delete`, {
    method: 'POST',
    body: params,
  });
}

export async function addMajorInfo(params) {
  return request(`${path}/production/proConcern/add`, {
    method: 'POST',
    body: params,
  });
}

export async function majorInfoPageList() {
  return request(`${path}/production/proConcern/focusList`);
}
// 重点关注排序
export async function majorInfoChangeIndex(params) {
  return request(`${path}/production/proConcern/changeIndex`, {
    method: 'POST',
    body: params,
  });
}
export async function sendList() {
  return request(`${path}/system/baseShortMsg/list`);
}

export async function sendPage(params) {
  return request(`${path}/system/baseShortMsg/page`, {
    method: 'POST',
    body: params,
  });
}

export async function addSend(params) {
  return request(`${path}/system/baseShortMsg/add`, {
    method: 'POST',
    body: params,
  });
}

export async function getSend(params) {
  return request(`${path}/system/baseShortMsg/get`, {
    method: 'POST',
    body: { id: params },
  });
}

export async function deleteSend(params) {
  return request(`${path}/system/baseShortMsg/delete`, {
    method: 'POST',
    body: { id: params },
  });
}

export async function updateSend(params) {
  return request(`${path}/system/baseShortMsg/update`, {
    method: 'POST',
    body: params,
  });
}

export async function selectByResult(params) {
  return request(`${path}/system/baseShortMsg/selectByResult`, {
    method: 'POST',
    body: { sendResult: params },
  });
}

export async function sendMsgs(params) {
  return request(`${path}/system/baseShortMsg/sendMsg`, {
    method: 'POST',
    body: params,
  });
}

export async function templateList() {
  return request(`${path}/system/baseShortMsgTemplate/list`);
}

export async function templatePage(params) {
  return request(`${path}/system/baseShortMsgTemplate/page`, {
    method: 'POST',
    body: params,
  });
}

export async function addTemplate(params) {
  return request(`${path}/system/baseShortMsgTemplate/add`, {
    method: 'POST',
    body: params,
  });
}

export async function getTemplate(params) {
  return request(`${path}/system/baseShortMsgTemplate/get`, {
    method: 'POST',
    body: { id: params },
  });
}

export async function deleteTemplate(params) {
  return request(`${path}/system/baseShortMsgTemplate/delete`, {
    method: 'POST',
    body: { id: params },
  });
}

export async function updateTemplate(params) {
  return request(`${path}/system/baseShortMsgTemplate/update`, {
    method: 'POST',
    body: params,
  });
}

// export async function videoCtrl(params) {
//   // return request('/api/Service/Notify', {
//   //   method: 'POST',
//   //   body: params,
//   // }, { needParam: false });
//   return jsonpFetch(params);
// }
export async function test(params) {
  return request('http://127.0.0.1:4000/resource/resourceTree/getByParentTree', {
    method: 'POST',
    body: params,
  });
}
export async function isOften(params) {
  return request(`${path}/system/baseOftenFunction/inOrNot`, {
    method: 'POST',
    body: params,
  });
}
export async function selectByGISCode(params) {
  return request(`${path}/resource/resourceInfo/getByIdOrGisCode`, {
    method: 'POST',
    body: params,
  });
}
export async function selectByPage(params) {
  return request(`${path}/resource/resourceInfo/page`, {
    method: 'POST',
    body: params,
  });
}
export async function getRawByResourceID(params) {
  return request(`${path}/system/rawMaterialInfo/getByResourceID?resourceID=${params}`);
}
export async function getMaterialHarmInfo(params) {
  return request(`${path}/system/materialHarmInfo/page`, {
    method: 'POST',
    body: params,
  });
}
export async function getMaterialFireControl(params) {
  return request(`${path}/system/materialFireControl/page`, {
    method: 'POST',
    body: params,
  });
}
// 请求环保实施数据
export async function getRealEnvironmental(params) {
  return request(`${path}/immediateData/immediateDataInfo/findOneByTime`, {
    method: 'POST',
    body: params,
  });
}
// 获取专题图实时数据
export async function getThematicMapData(params) {
  return request(`${path}/immediateData/immediateDataInfo/getNewsData`, {
    method: 'POST',
    body: params,
  });
}
// 获取门禁区域实时值(看板)
export async function getGuardCounting() {
  return request(`${path}/resource/doorCount/area`);
}
// 获取门禁实时值(看板)
export async function getGuardDoorCounting() {
  return request(`${path}/resource/doorCount/door`);
}

// 获取资源信息
export async function getResourceByID(params) {
  return request(`${path}/resource/resourceInfo/get`, {
    method: 'POST',
    body: params,
  });
}
// 获取资源信息
export async function getResourceByArea(params) {
  return request(`${path}/resource/resourceInfo/selectByCtrlTypeAndArea?ctrlType=${params.ctrlType}`);
}
// 获取装置生产情况数据
export async function getTimeUsePre(params) {
  return request(`${path}/report/proRptReportInfo/selectTimeUsePre`, {
    method: 'POST',
    body: params,
  });
}
// 获取装置生产情况时间进度
export async function getDeviceProduction(params) {
  return request(`${path}/report/proRptEquipmentProductInfo/selectToday`, {
    method: 'POST',
    body: params,
  });
}
// 修改装置生产情况数据 日产出
export async function updateDeviceProduction(params) {
  return request(`${path}/production/proProducOftDay/update`, {
    method: 'POST',
    body: params,
  });
}
// 获取裂解炉运行情况
export async function getCrackingFurnace(params) {
  return request(`${path}/report/proRptDissociationInfo/selectToday`, {
    method: 'POST',
    body: params,
  });
}
// 获取裂解炉运行天数
export async function getDissociationRunDay(params) {
  return request(`${path}/report/proRptDissociationInfo/selectRunDay`, {
    method: 'POST',
    body: params,
  });
}
// 获取裂解炉运行情况
export async function updateCrackingFurnace(params) {
  return request(`${path}/production/proEquipmentRunStateValue/update`, {
    method: 'POST',
    body: params,
  });
}
// 生产日报查询
export async function getDailyProduction() {
  return request(`${path}/production/proEquipmentProductInfo/selectAll`);
}
// 生产日报 动力消耗
export async function getPowerConsumption(params) {
  return request(`${path}/report/proRptPowerConsumeValue/selectToday`, {
    method: 'POST',
    body: params,
  });
}
// 生产日报 动力消耗
export async function updatePowerConsumption(params) {
  return request(`${path}/production/proPowerConsumeValue/update`, {
    method: 'POST',
    body: params,
  });
}
// 门禁区域
export async function queryAreaList(params) {
  return request(`${path}/resource/doorCount/area`, {
    method: 'POST',
    body: params,
  });
}
export async function queryAreaPerson(params) {
  return request(`${path}/resource/doorCount/areaDetail`, {
    method: 'POST',
    body: params,
  });
}
// 门禁（各部门的人员分布）
export async function queryDoorOrgCount(params) {
  return request(`${path}/resource/door/getDoorCountOrg`, {
    method: 'POST',
    body: params,
  });
}
// 门禁（人员进出实时情况）
export async function queryDoorPage(params) {
  return request(`${path}/resource/door/getPage`, {
    method: 'POST',
    body: params,
  });
}
// 门禁 （今日在场人数）
export async function queryCountByTime() {
  return request(`${path}/resource/door/getCountByTime`);
}
// 门禁 （每日入场人数）
export async function queryCountByDay(params) {
  return request(`${path}/resource/door/getCountByDay`, {
    method: 'POST',
    body: params,
  });
}
// 获取门禁区域实时值(专题图)
export async function getAllDoorCountArea() {
  return request(`${path}/resource/door/getAllDoorCountAreaOfArea`);
}
// 获取门禁实时值(专题图)
export async function getAllDoorCount() {
  return request(`${path}/resource/door/getAllDoorCountAreaOfDoor`);
}
// Vocs区域聚合
export async function vocsList() {
  return request(`${path}/vocs/ldarSceneDetectInfo/selectLadrInfo`);
}
// Vocs具体List
export async function vocsTasks(params) {
  return request(`${path}/vocs/ldarSceneDetectInfo/getTasks`, {
    method: 'POST',
    body: params,
  });
}
// 作业监控list
export async function constructMonitorList() {
  return request(`${path}/production/proJobMonitor/getAllUnEnd`);
}
// 根据组织id请求对应的area
export async function getAreaByOrgID(params) {
  return request(`${path}/resource/area/getByOrgID`, {
    method: 'POST',
    body: params,
  });
}
// 请求原材料信息
export async function getRawMaterial(params) {
  return request(`${path}/report/proRptRawInfo/selectToday`, {
    method: 'POST',
    body: params,
  });
}
// 修改原材料信息
export async function updateRawMaterial(params) {
  return request(`${path}/production/proProductRawOfDay/update`, {
    method: 'POST',
    body: params,
  });
}
// 生产日报 获取全厂蒸汽平衡数据
export async function getSteamBalance(params) {
  return request(`${path}/report/proRptGasWaterBalanceValue/selectSteamBalance`, {
    method: 'POST',
    body: params,
  });
}
// 修改生产情况
export async function updateProductionStatus(params) {
  return request(`${path}/report/proRptProductReportInfo/update`, {
    method: 'POST',
    body: params,
  });
}
// 获取生产情况
export async function getProductionStatus(params) {
  return request(`${path}/report/proRptProductReportInfo/selectToday`, {
    method: 'POST',
    body: params,
  });
}
// 修改生产蒸汽平衡 、修改生产蒸汽平衡
export async function updateSteamBalance(params) {
  return request(`${path}/production/proGasWaterBalanceValue/update`, {
    method: 'POST',
    body: params,
  });
}
// 请求同一控制类型实时数据
export async function getAllNewsData(params) {
  return request(`${path}/immediateData/immediateDataInfo/getNewsData`, {
    method: 'POST',
    body: params,
  });
}
// 特殊处理 裂解炉9A9B实时值
export async function getA9AndB9() {
  return request(`${path}/immediateData/immediateDataInfo/getA9AndB9`);
}
// 请求实时点位信息(包括历史数据)
export async function findByTime(params) {
  return request(`${path}/immediateData/immediateDataInfo/findByTime`, {
    method: 'POST',
    body: params,
  });
}
// 请求实时点位信息（单点位 最新实时数据）
export async function getNewsData(params) {
  return request(`${path}/immediateData/immediateDataInfo/getNewsData`, {
    method: 'POST',
    body: params,
  });
}
// // 请求专业系统
// export async function selectByCodeByCode(params) {
//   return request(`${path}/system/baseSystemCode/selectByCodeByCode`, {
//     method: 'POST',
//     body: params,
//   });
// }
// 请求专业系统 - 更改过后的接口
export async function selectByCodeByCode() {
  return request(`${path}/resource/resProfessionSystem/list`, {
    method: 'GET',
  });
}

// 请求监测指标组
export async function getGroup(params) {
  return request(`${path}/immediateData/immediateDataInfo/getGroup`, {
    method: 'POST',
    body: params,
  });
}
// 请求部门
export async function getParentOrgByQuotaGroupCode(params) {
  return request(`${path}/system/organization/getParentOrgByQuotaGroupCode`, {
    method: 'POST',
    body: params,
  });
}
// 请求分部
export async function getOrgByQuotaGroupCode(params) {
  return request(`${path}/system/organization/getOrgByQuotaGroupCode`, {
    method: 'POST',
    body: params,
  });
}
// 请求资源点位
export async function getByQuotaGroupCode(params) {
  return request(`${path}/immediateData/immediateDataInfo/getByQuotaGroupCode`, {
    method: 'POST',
    body: params,
  });
}
// 请求检测指标
export async function getAllQuota(params) {
  return request(`${path}/immediateData/immediateDataInfo/getAllQuota`, {
    method: 'POST',
    body: params,
  });
}

// 请求历史列表 222
export async function findHistory(params) {
  return request(`${path}/immediateData/immediateDataInfo/findHistory`, {
    method: 'POST',
    body: params,
  });
}

// Vocs map 对象
export async function getVocsMap() {
  return request(`${path}/vocs/proVOCsCheckPlan/getNumByArea`);
}
// 通过areaCode请求检测计划列表
export async function getAllPlanByArea(params) {
  return request(`${path}/vocs/proVOCsCheckPlan/getAllPlanByArea`, {
    method: 'POST',
    body: params,
  });
}
// 通过planID请求计划点位数据
export async function getAllPlanByID(params) {
  return request(`${path}/vocs/proVOCsCheckPoint/getAllByPlan`, {
    method: 'POST',
    body: params,
  });
}

// VOCS
export async function queryVOCSAreaList(params) {
  return request(`${path}/vocs/proVOCsCheckPlan/page`, {
    method: 'POST',
    body: params,
  });
}
export async function queryVOCSDoorList(params) {
  return request(`${path}/vocs/proVOCsCheckPoint/page`, {
    method: 'POST',
    body: params,
  });
}
//  根据ID请求危险源
export async function getSourceOfRisk(params) {
  return request(`${path}/resource/resHazardSource/get`, {
    method: 'POST',
    body: params,
  });
}
//  根据areaCode请求危险源
export async function getAllRiskByAreaCode(params) {
  return request(`${path}/resource/resHazardSource/getAllByArea`, {
    method: 'POST',
    body: params,
  });
}
// 根据ID请求安全风险
export async function getSecurityRisk(params) {
  return request(`${path}/resource/resRiskSource/get`, {
    method: 'POST',
    body: params,
  });
}
// 根据areaCode请求安全风险
export async function getAllSecurityByAreaCode(params) {
  return request(`${path}/resource/resRiskSource/getAllByArea`, {
    method: 'POST',
    body: params,
  });
}
// 获取后端服务地址
export async function getUrl() {
  return request(`${path}/sys/config`);
}
// 获取地图图层地址
export async function getMapLayer() {
  return request(`${path}/resource/resMapLayerInfo/list`);
}
// 取被resourceID监控的对象
export async function getMonitorResourceObj(params) {
  return request(`${path}/resource/resourceInfo/getMonitorResourceObj`, {
    method: 'POST',
    body: params,
  });
}
// 取监控resourceID的对象
export async function getMonitorResource(params) {
  return request(`${path}/resource/resourceInfo/getMonitorResource`, {
    method: 'POST',
    body: params,
  });
}
// 获取预案列表
export async function getPlanList() {
  return request(`${path}/plan/planPlanInfo/list`);
}
//  查询信息接报所以
export async function queryInfoContent() {
  return request(`${path}/system/alarmEventInfo/list`, {
    method: 'get',
  });
}
//  保存事件内容
export async function seveEventContent(params) {
  return request(`${path}/emgc/emgcEventProcess/add`, {
    method: 'POST',
    body: params,
  });
}
// 保存伤亡人数
export async function seveCasualties(params) {
  return request(`${path}/system/alarmCasualtyInfo/add`, {
    method: 'POST',
    body: params,
  });
}
// 查询事件信息记录
export async function queryEventEventInfo(params) {
  return request(`${path}/emgc/emgcEventProcess/selectByEventID`, {
    method: 'POST',
    body: params,
  });
}
// 查询预案特征
export async function getFeatures(params) {
  return request(`${path}/plan/planPanFeature/selectInfo`, {
    method: 'POST',
    body: params,
  });
}
// 查询预案指令
export async function getPlanCommand(params) {
  return request(`${path}/plan/planCommandInfo/selectCommand`, {
    method: 'POST',
    body: params,
  });
}
// 查询预案应急资源
export async function getPlanResource(params) {
  return request(`${path}/plan/planReadMaterial/selectMaterial`, {
    method: 'POST',
    body: params,
  });
}
// 应急资源列表
export async function getEmgcResource(params) {
  return request(`${path}/resource/resToolMaterialInfo/page`, {
    method: 'POST',
    body: params,
  });
}
// 新增应急资源
export async function addEmgcResource(params) {
  return request(`${path}/resource/resToolMaterialInfo/add`, {
    method: 'POST',
    body: params,
  });
}
// 删除应急资源
export async function delEmgcResource(params) {
  return request(`${path}/resource/resToolMaterialInfo/delete`, {
    method: 'POST',
    body: params,
  });
}
// 获取单个应急资源
export async function getEmgcResourceInfo(params) {
  return request(`${path}/resource/resToolMaterialInfo/get`, {
    method: 'POST',
    body: params,
  });
}
// 修改应急资源
export async function updateEmgcResource(params) {
  return request(`${path}/resource/resToolMaterialInfo/update`, {
    method: 'POST',
    body: params,
  });
}
// 应急资源code查重
export const selectMaterialCode = async (params) => {
  return request(`${path}/resource/resToolMaterialInfo/selectMaterialCode`, {
    method: 'POST',
    body: params,
  });
}
// 新增事件内容
export async function eventFeatures(params) {
  return request(`${path}/emgc/emgcEventEmgcReportFeature/add`, {
    method: 'POST',
    body: params,
  });
}
export async function test1(params) {
  return request(`${path}/system/alarmEventInfo/addEventInfo`, {
    method: 'POST',
    body: params,
  }, { needParam: false });
}

export async function delEventFeatures(params) {
  return request(`${path}/emgc/emgcEventEmgcReportFeature/delete`, {
    method: 'POST',
    body: params,
  });
}
// 查询事件特征
export async function queryEventFeatures(params) {
  return request(`${path}/system/alarmEventInfo/selectInfo`, {
    method: 'POST',
    body: params,
  });
}
// 查询信息接报 /system/alarmEventInfo/list
export async function queryEventInfoReport(params) {
  return request(`${path}/system/alarmEventInfo/get`, {
    method: 'POST',
    body: params,
  });
}
// 搜索事件特征
export async function searchEventFeatures(params) {
  // return request(`${path}/emgc/planFeatureInfo/page`, {
  return request(`${path}/emgc/planFeatureInfo/selectByOrgID`, {
    method: 'POST',
    body: params,
  });
}
// 报警生成事件
export async function alarmEvent(params) {
  return request(`${path}/system/alarmEventInfo/addEventInfo`, {
    method: 'POST',
    body: params,
  });
}
// 预案作为实施方案模板
export async function copyPlan(params) {
  return request(`${path}/emgc/emgcEventExecutePlan/add`, {
    method: 'POST',
    body: params,
  });
}
// 获取实施方案某个特征信息
export async function getEventFeature(params) {
  return request(`${path}/emgc/emgcEventExecutePlan/get`, {
    method: 'POST',
    body: params,
  });
}
// 修改实施方案某个特征信息
export async function updateEventFeature(params) {
  return request(`${path}/emgc/emgcEventExecutePlan/update`, {
    method: 'POST',
    body: params,
  });
}
// 删除实施方案某个特征信息
export async function deleteEventFeature(params) {
  return request(`${path}/emgc/emgcEventExecutePlan/delete`, {
    method: 'POST',
    body: params,
  });
}
// 获取实施方案某个应急指令
export async function getCommandInfo(params) {
  return request(`${path}/emgc/emgcEventCommand/selectEmgcCommand`, {
    method: 'POST',
    body: params,
  });
}
// 修改实施方案某个应急指令
export async function updateCommandInfo(params) {
  return request(`${path}/emgc/emgcEventCommand/update`, {
    method: 'POST',
    body: params,
  });
}
// 删除实施方案某个应急指令
export async function deleteCommandInfo(params) {
  return request(`${path}/emgc/emgcEventCommand/delete`, {
    method: 'POST',
    body: params,
  });
}
// 增加实施方案某个应急指令 param: eventID，指令信息
export async function addCommandInfo(params) {
  return request(`${path}/emgc/emgcEventCommand/add`, {
    method: 'POST',
    body: params,
  });
}
// 获取实施方案某个应急资源
export async function getResourceInfo(params) {
  return request(`${path}/emgc/emgcExecPlanResource/get`, {
    method: 'POST',
    body: params,
  });
}
// 修改实施方案某个应急资源
export async function updateResourceInfo(params) {
  return request(`${path}/emgc/emgcExecPlanResource/update`, {
    method: 'POST',
    body: params,
  });
}
// 删除实施方案某个应急资源
export async function deleteResourceInfo(params) {
  return request(`${path}/emgc/emgcExecPlanResource/delete`, {
    method: 'POST',
    body: params,
  });
}
// 删除预案某个应急资源
export async function deletePlanResourceInfo(params) {
  return request(`${path}/plan/planReadMaterial/delete`, {
    method: 'POST',
    body: params,
  });
}
// 增加实施方案某个应急资源
export async function addResourceInfo(params) {
  return request(`${path}/emgc/emgcExecPlanResource/add`, {
    method: 'POST',
    body: params,
  });
}
// 进入流程下个节点 参数：eventID eventStatu
export async function updateProcessNode(params) {
  return request(`${path}/system/alarmEventInfo/updateStatu`, {
    method: 'POST',
    body: params,
  });
}
// 编辑实施方案时  根据事件ID获取实施方案的预案基本信息
export async function getPlanBaseInfo(params) {
  // return request(`${path}/emgc/emgcEventExecutePlan/selectExecute`, {
  return request(`${path}/plan/planPlanInfo/selectExecutePlan`, {
    method: 'POST',
    body: params,
  });
}
// 编辑实施方案时  根据事件ID获取实施方应急指令
export async function getEmgcCommandByEventID(params) {
  return request(`${path}/emgc/emgcEventCommand/selectEmgcCommand`, {
    method: 'POST',
    body: params,
  });
}
// 编辑实施方案时  根据事件ID获取实施方应急资源
export async function getEmgcResourceByEventID(params) {
  return request(`${path}/emgc/emgcExecPlanResource/selectResource`, {
    method: 'POST',
    body: params,
  });
}
// 编辑实施方案时  根据事件ID获取实施方事件特征
export async function getEmgcFeatureByEventID(params) {
  // return request(`${path}/emgc/emgcEventEmgcReportFeature/selectFeature`, {
  return request(`${path}/emgc/emgcEventEmgcReportFeature/selectPlanInfo`, {
    method: 'POST',
    body: params,
  });
}
// 报警处理 不生成事件
export async function alarmDeal(params) {
  return request(`${path}/system/alarmInfo/alarmHandle`, {
    method: 'POST',
    body: params,
  });
}
// 获取预案等级列表
export async function getPlanLevelList(params) {
  return request(`${path}/emgc/emgcEmgcLevel/selectLevel`, {
    method: 'POST',
    body: params,
  });
}
// 根据eventID获取流程节点列表
export async function getFlowNodeList(params) {
  return request(`${path}/emgc/emgcFlowNode/selectFlowNodeID`, {
    method: 'POST',
    body: params,
  });
}

// 模糊查询物资 列表
export async function getMaterialList(params) {
  return request(`${path}/resource/resToolMaterialInfo/fuzzySelect`, {
    method: 'POST',
    body: params,
  });
}
// 物资 分页
export async function resMaterialPage(params) {
  return request(`${path}/resource/resToolMaterialInfo/page`, {
    method: 'POST',
    body: params,
  });
}
// 模糊查询资源 列表
export async function getResourceList(params) {
  return request(`${path}/resource/resourceInfo/fuzzySelect`, {
    method: 'POST',
    body: params,
  });
}
// 资源区域列表
export async function getAreaList(params) {
  return request(`${path}/resource/area/list`);
}
// 查询手动报警里面的搜索 资源筛查
export async function getResourceQueryPage(params) {
  return request(`${path}/resource/resourceInfo/getResourceQueryPage`, {
    method: 'POST',
    body: params,
  });
}

// 查询事件物质list   Integer[] resourceIDs
export async function getByResourceIDs(params) {
  return request(`${path}/system/rawMaterialInfo/getByResourceIDs`, {
    method: 'POST',
    body: params,
  });
}
// 获取指令列表
export async function getCommandList(params) {
  return request(`${path}/emgc/emgcEventCommand/selectEmgcCommand`, {
    method: 'POST',
    body: params,
  });
}
// 修改指令状态
export async function updateCommandStatus(params) {
  return request(`${path}/emgc/emgcEventCommand/updateStatu`, {
    method: 'POST',
    body: params,
  });
}
// 清空实时方案 param： eventID
export async function clearPlan(params) {
  return request(`${path}/emgc/emgcEventExecutePlan/deleteExecutePlan`, {
    method: 'POST',
    body: params,
  });
}
// 修改实施方案的应急等级 param： eventID、eventLevel、emgcOrgID
export async function updatePlanLevel(params) {
  return request(`${path}/emgc/emgcEventExecutePlan/updatePlan`, {
    method: 'POST',
    body: params,
  });
}
// 获取组织机构人员 param： pageNum, pageSize, orgId, orgnizationName, postion, userName
export async function getOrgList(params) {
  return request(`${path}/system/userInfo/userPage`, {
    method: 'POST',
    body: params,
  });
}
// 根据应急等级获取组织机构 param： emgcLevel（int）
export async function getOrgListByLevel(params) {
  return request(`${path}/system/organization/getOrgByLevel`, {
    method: 'POST',
    body: params,
  });
}
// 获取未完成的事件列表 参数eventStatu(应急所处的节点)
export async function undoneEventList(params) {
  return request(`${path}/system/alarmEventInfo/selectProcessing`, {
    method: 'POST',
    body: params,
  });
}
// 根据事件ID 获取事件信息 param: eventID
export async function getEventInfo(params) {
  return request(`${path}/emgc/emgcEventExecutePlan/selectExecute`, {
    method: 'POST',
    body: params,
  });
}
// 获取事件结束条件列表
export async function getFinishConditionList() {
  return request(`${path}/emgc/emgcEmgcFinishCondition/list`);
}
// 获取应急指挥流程节点模板列表
export async function getFlowNodeTemplateList() {
  return request(`${path}/emgc/planFlowNodeTemplate/list`);
}
// 获取手动报警装置
export async function getApparatus() {
  return request(`${path}/system/organization/getTree`);
}
// 根据事件ID 以及 事件当前状态 查询节点类型 参数：eventID、eventStatu
export async function selectNodeType(params) {
  return request(`${path}/emgc/emgcFlowNode/selectNodeType`, {
    method: 'POST',
    body: params,
  });
}
// 签到 参数： eventID、userID
export async function emgcUserSignIn(params) {
  return request(`${path}/emgc/emgcUserSignIn/add`, {
    method: 'POST',
    body: params,
  });
}
// 设为总指挥 参数：eventID、userID、isCommander
export async function emgcCommanderChange(params) {
  return request(`${path}/emgc/emgcUserSignIn/setCommander`, {
    method: 'POST',
    body: params,
  });
}
// 获取不同节点的指令类型 参数 nodeType，节点类型
export async function selectByNodeType(params) {
  return request(`${path}/plan/planCommandModel/selectByNodeType`, {
    method: 'POST',
    body: params,
  });
}
// 获取已有指令
export async function selectExistCommand(params) {
  return request(`${path}/plan/planCommandInfo/page`, {
    method: 'POST',
    body: params,
  });
}
// 应急终止 条件勾选
export async function emgcFinishConditionCheck(params) {
  return request(`${path}/emgc/emgcEventEmgcFinishCondition/add`, {
    method: 'POST',
    body: params,
  });
}
// 应急终止 去掉条件勾选 参数eventID、emgcFinishConditionID
export async function emgcFinishConditionUnCheck(params) {
  return request(`${path}/emgc/emgcEventEmgcFinishCondition/deleteInfo `, {
    method: 'POST',
    body: params,
  });
}
// 应急终止 获取已勾选的条件 参数 eventID
export async function getCheckedConditionList(params) {
  return request(`${path}/emgc/emgcEventEmgcFinishCondition/selectFinish`, {
    method: 'POST',
    body: params,
  });
}
// 获取报警类型
export async function getAlarmType(params) {
  return request(`${path}/system/alarmAlarmType/list`, {
    method: 'GET',
    body: params,
  });
}
// 指令接收人列表 参数 事件ID ：eventID、搜索关键字：name
export async function getCommandReceiver(params) {
  return request(`${path}/system/baseOrgPostion/selectEmgcPostion`, {
    method: 'POST',
    body: params,
  });
}
// 请求获取报警信息
export async function getAlarmConten(params) {
  return request(`${path}/system/alarmEventInfo/getAlarm`, {
    method: 'POST',
    body: params,
  });
}

// 生成应急报告
export async function emgcReport(params) {
  return request(`${path}/emgc/emgcEventExecutePlan/emgcReport`, {
    method: 'POST',
    body: params,
  });
}
// 保存手动报警
export async function addHandAlarm(params) {
  return request(`${path}/system/alarmEventInfo/addAlarm`, {
    method: 'POST',
    body: params,
  });
}
// 查询事件阶段
export async function queryEventPosition(params) {
  return request(`${path}/emgc/emgcEmgcReportInfo/selectCount?eventID=${params}`, {
    method: 'GET',
  });
}
// 修改指令执行情况
export async function updateExecuteContent(params) {
  return request(`${path}/emgc/emgcCommandExecuteProcess/add`, {
    method: 'POST',
    body: params,
  });
}
// 修改扩大应急所处的状态 参数： planState(int)
export async function updateExpandState(params) {
  return request(`${path}/emgc/emgcEventExecutePlan/updateState`, {
    method: 'POST',
    body: params,
  });
}
// 新增事件特征
export async function addFeature(params) {
  return request(`${path}/emgc/emgcEventEmgcReportFeature/addFeature`, {
    method: 'POST',
    body: params,
  });
}
// 获取扩大应急特征信息 参数 evenID
export async function getExpandFeature(params) {
  return request(`${path}/emgc/emgcEventEmgcReportFeature/selectFeatureInfo`, {
    method: 'POST',
    body: params,
  });
}
// 查询方案状态（扩大应急状态） 参数 evenID
export async function selectExpandState(params) {
  return request(`${path}/emgc/emgcEventExecutePlan/selectPlanState`, {
    method: 'POST',
    body: params,
  });
}
// 所有指令分类
export async function commandModelList(params) {
  return request(`${path}/plan/planCommandModel/list`);
}
// 扩大应急 预案级别更新eventID、planState、eventLevel
export async function updateExpandLevel(params) {
  return request(`${path}/emgc/emgcEventExecutePlan/createPlan`, {
    method: 'POST',
    body: params,
  });
}
// 预案列表 page接口
export async function getPlanInfoPage(params) {
  return request(`${path}/plan/planPlanInfo/weightPage`, {
    method: 'POST',
    body: params,
  });
}
// 扩大应急  保存所选择的预案信息
export async function expandSelectPlan(params) {
  return request(`${path}/emgc/emgcEventExecutePlan/expandPlan`, {
    method: 'POST',
    body: params,
  });
}

// 获取预案列表
export async function planManagementInfoPage(params) {
  // return request(`${path}/plan/planPlanInfo/page`, {
  return request(`${path}/plan/planPlanInfo/getAllInfo`, {
    method: 'POST',
    body: params,
  });
}
// 删除预案
export async function deletePlanManagementInfo(params) {
  return request(`${path}/plan/planPlanInfo/delete`, {
    method: 'POST',
    body: params,
  });
}
// 获取预案基本信息
export async function getPlanInfo(params) {
  return request(`${path}/plan/planPlanInfo/get`, {
    method: 'POST',
    body: params,
  });
}
// 获取预案事件特征
export async function getEventFeatures(params) {
  return request(`${path}/plan/planPanFeature/selectInfo`, {
    method: 'POST',
    body: params,
  });
}
// 获取预案资源接口
export async function getResourceContent(params) {
  return request(`${path}/plan/planReadMaterial/selectMaterial`, {
    method: 'POST',
    body: params,
  });
}
// 扩大应急 编辑实施方案 实施方案选择
export async function selectExecutePlanInfo(params) {
  return request(`${path}/plan/planPlanInfo/selectExecutePlanInfo`, {
    method: 'POST',
    body: params,
  });
}

// 报警归并
export async function mergeAlarm(params) {
  return request(`${path}/system/alarmEventInfo/mergeAlarm`, {
    method: 'POST',
    body: params,
  });
}
// 编辑实时方案时 方案是否有预案
export async function ifFromPlan(params) {
  return request(`${path}/emgc/emgcEventExecutePlan/yesorNo`, {
    method: 'POST',
    body: params,
  });
}
// 获取预案管理特征
export async function getFeaturePlan() {
  return request(`${path}/emgc/planFeatureInfo/list`, {
    method: 'GET',
  });
}
// 获取指令列表下 指令操作状态列表
export async function getCommandStatusList(params) {
  return request(`${path}/emgc/emgcEventCommand/commandStatInfo`, {
    method: 'POST',
    body: params,
  });
}

// 预案管理 - 新增事件特征
export async function addFeaturePlan(params) {
  return request(`${path}/plan/planPanFeature/add`, {
    method: 'POST',
    body: params,
  });
}
// 预案管理 - 修改事件特征
export async function updateFeaturePlan(params) {
  return request(`${path}/plan/planPanFeature/update`, {
    method: 'POST',
    body: params,
  });
}
// 预案管理 - 删除事件特征   /delectFeature?id
export async function delFeaturePlan(params) {
  return request(`${path}/plan/planPanFeature/delectFeature`, {
    method: 'POST',
    body: params,
  });
}
// 预案管理 - 查询单个事件特征  /get?id
export async function getEventFeaturePlan(params) {
  return request(`${path}/plan/planPanFeature/get`, {
    method: 'POST',
    body: params,
  });
}
// 添加预案
export async function addPlanInfo(params) {
  return request(`${path}/plan/planPlanInfo/add`, {
    method: 'POST',
    body: params,
  });
}
// 修改预案
export async function updatePlanInfo(params) {
  return request(`${path}/plan/planPlanInfo/update`, {
    method: 'POST',
    body: params,
  });
}
// 预案级别
export async function planLevel(params) {
  return request(`${path}/emgc/emgcEmgcLevel/list`, {
    method: 'GET',
  });
}
// 预案维护 添加预案指令
export async function addPlanCommand(params) {
  return request(`${path}/plan/planCommandInfo/add`, {
    method: 'POST',
    body: params,
  });
}
// 预案维护 修改预案指令
export async function updatePlanCommand(params) {
  return request(`${path}/plan/planCommandInfo/update`, {
    method: 'POST',
    body: params,
  });
}
// 预案维护 查询单个预案指令 参数：planInfoID(必须要)，commandID(单个请求的时候传)
export async function findPlanCommand(params) {
  return request(`${path}/plan/planCommandInfo/selectCommand`, {
    method: 'POST',
    body: params,
  });
}
// 预案维护 查询预案指令分页信息
export async function planCommandPage(params) {
  return request(`${path}/plan/planCommandInfo/page`, {
    method: 'POST',
    body: params,
  });
}
// 预案维护 删除预案指令
export async function deletePlanCommand(params) {
  return request(`${path}/plan/planCommandInfo/delete`, {
    method: 'POST',
    body: params,
  });
}
// 预案维护 获取指令流程节点
export async function getFlowList(params) {
  return request(`${path}/plan/planFlowNode/selectFlowNodeID`, {
    method: 'POST',
    body: params,
  });
}
// 预案维护 获取预案执行岗位
export async function planExecutePosition(params) {
  return request(`${path}/system/baseOrgPostion/selectEmgcPostion`, {
    method: 'POST',
    body: params,
  });
}
// 预案维护 查询应急资源
export async function findPlanResource(params) {
  return request(`${path}/plan/planReadMaterial/get`, {
    method: 'POST',
    body: params,
  });
}
// 预案维护 查询应急资源
export async function addPlanResource(params) {
  return request(`${path}/plan/planReadMaterial/add`, {
    method: 'POST',
    body: params,
  });
}
// 预案维护 修改应急资源
export async function updatePlanResource(params) {
  return request(`${path}/plan/planReadMaterial/update`, {
    method: 'POST',
    body: params,
  });
}
// 物料维护 新增
export async function materialAdd(params) {
  return request(`${path}/system/rawMaterialInfo/add`, {
    method: 'POST',
    body: params,
  });
}
// 物料维护 删除
export async function materialDelete(params) {
  return request(`${path}/system/rawMaterialInfo/delete`, {
    method: 'POST',
    body: params,
  });
}
// 物料维护 获取单个get接口
export async function materialGet(params) {
  return request(`${path}/system/rawMaterialInfo/get`, {
    method: 'POST',
    body: params,
  });
}
// 物料维护 修改
export async function materialUpdate(params) {
  return request(`${path}/system/rawMaterialInfo/update`, {
    method: 'POST',
    body: params,
  });
}
// 物料维护 分页查询
export async function materialPage(params) {
  return request(`${path}/system/rawMaterialInfo/page`, {
    method: 'POST',
    body: params,
  });
}
// 应急报告列表 分页查询
export async function emgcReportPage(params) {
  return request(`${path}/emgc/emgcEmgcReportInfo/page`, {
    method: 'POST',
    body: params,
  });
}
// 应急报告列表 分页查询
export async function exportReport(params) {
  return downLoad(`${path}/emgc/emgcEmgcReportInfo/writeDoc`, params, 'doc');
}
// 编制部门、发布机构
export async function getPublisher(params) {
  return request(`${path}/system/organization/list`, {
    method: 'GET',
  });
}
// 编制部门、发布机构
export async function selectPlanCode(params) {
  return request(`${path}/plan/planPlanInfo/selectPlanCode`, {
    method: 'POST',
    body: params,
  });
}
// 码表增加 系统编码信息
export async function addSystemCode(params) {
  return request(`${path}/system/baseSystemCode/add`, {
    method: 'POST',
    body: params,
  });
}
// 码表删除 系统编码信息
export async function deleteSystemCode(params) {
  return request(`${path}/system/baseSystemCode/delete`, {
    method: 'POST',
    body: params,
  });
}
// 码表 查询可以维护的类型
export async function codeTypeList(params) {
  return request(`${path}/system/baseSystemCode/selectByCode`, {
    method: 'POST',
    body: params,
  });
}
// 编辑实施方案 查询附件列表 pageNum，pageSize，eventID uploadType
export async function annexPage(params) {
  return request(`${path}/emgc/emgcEventExecPlanArchive/selectByEventID`, {
    method: 'POST',
    body: params,
  });
}
// 编辑实施方案 删除附件列表
export async function annexDelete(params) {
  return request(`${path}/emgc/emgcEventExecPlanArchive/delete`, {
    method: 'POST',
    body: params,
  });
}

// 获取组态图列表
export async function getFlowDataList() {
  return request(`${path}/resource/resDeviceStatuGraphics/list`, {
  });
}
// 获取单个组态图
export async function getFlowData(params) {
  return request(`${path}/resource/resDeviceStatuGraphics/getGraphicsByResourceID`, {
    method: 'POST',
    body: params,
  });
}
// 保存组态图
export async function saveFlowData(params) {
  return request(`${path}/resource/resDeviceStatuGraphics/merge`, {
    method: 'POST',
    body: params,
  });
}
// 组态图实时信息
export async function getGraphiceDatas(params) {
  return request(`${path}/resource/resDeviceStatuGraphics/getGraphiceDatas`, {
    method: 'POST',
    body: params,
  });
}
// 资源聚合信息
export async function getResNums() {
  return request(`${path}/resource/resourceInfo/getResourceNum`, {
  });
}
// 请求控制类型
export async function getByClassifyType(params) {
  return request(`${path}/resource/resResourceCtrlType/getByClassifyType`, {
    method: 'POST',
    body: params,
  });
}

// 获取预案附件信息
export async function getPlanAnnexPage(params) {
  return request(`${path}/plan/planEmergencyPlanArchive/page`, {
    method: 'POST',
    body: params,
  });
}
// 请求控制类型
export async function deletePlanAnnex(params) {
  return request(`${path}/plan/planEmergencyPlanArchive/delete`, {
    method: 'POST',
    body: params,
  });
}
// 请求预案 组织结构、处置卡的存储路径 Integer planInfoID, Integer uploadType
export async function getDealCard(params) {
  return request(`${path}/plan/planEmergencyPlanArchive/selectPicture`, {
    method: 'POST',
    body: params,
  });
}
// 请求预案 组织结构
export async function getOrgImages(params) {
  return request(`${path}/system/baseOrgaArchiveInfo/getByPlanID`, {
    method: 'POST',
    body: params,
  });
}
// 请求方案 组织结构 处置卡的存储路径 Integer eventID, Integer uploadType
export async function getImplPicture(params) {
  return request(`${path}/emgc/emgcEventExecPlanArchive/selectPicture`, {
    method: 'POST',
    body: params,
  });
}
// 请求阈值
export async function getConditionCalc(params) {
  return request(`${path}/condition/baseConditionCalcList/getConditionCalc`, {
    method: 'POST',
    body: params,
  });
}
// 请求应急演练方案数据
export async function getDrillList() {
  return request(`${path}/emgc/emgcEmgcDrillPlan/list`);
}
// 请求应急演练方案分页数据
export async function getDrillPage(params) {
  // return request(`${path}/emgc/emgcEmgcDrillPlan/page`, {
  return request(`${path}/emgc/emgcEmgcDrillPlan/selectPage`, {
    method: 'POST',
    body: params,
  });
}
// 添加演练方案
export async function addDrill(params) {
  return request(`${path}/emgc/emgcEmgcDrillPlan/add`, {
    method: 'POST',
    body: params,
  });
}
// 删除演练方案
export async function deleteDrill(params) {
  return request(`${path}/emgc/emgcEmgcDrillPlan/delete`, {
    method: 'POST',
    body: params,
  });
}
// 获取演练方案信息
export async function getDrillInfo(params) {
  return request(`${path}/emgc/emgcEmgcDrillPlan/get`, {
    method: 'POST',
    body: params,
  });
}
// 修改演练方案信息
export async function updateDrill(params) {
  return request(`${path}/emgc/emgcEmgcDrillPlan/update`, {
    method: 'POST',
    body: params,
  });
}
// 获取演练方案上传的附件 Integer drillPlanID, Integer uploadType 1 上传步奏 2战评总结 3 评审表 4.其他
export async function selectDrillAddAnnex(params) {
  return request(`${path}/emgc/emgcEmgcDrillPlan/selectByNew`, {
    method: 'POST',
    body: params,
  });
}
// 每次新增清除上次未清空的附件
export async function deleteDrillAnnex(params) {
  return request(`${path}/emgc/emgcEmgcDrillPlan/deleteInfo`, {
    method: 'POST',
    body: params,
  });
}
// 请求演练方案的附件 drillPlanID uploadType 1 2 3 4
export async function getDrillAnnex(params) {
  return request(`${path}/emgc/emgcEmgcDrillPlan/selectPicture`, {
    method: 'POST',
    body: params,
  });
}
// 删除附件接口
export async function deleteAnnex(params) {
  return request(`${path}/emgc/emgcEmgcDirllArichve/delete`, {
    method: 'POST',
    body: params,
  });
}
// 演练方案关联预案 drillPlanID、usePlanID(预案ID)
export async function linkPlan(params) {
  return request(`${path}/emgc/emgcEmgcDrillPlan/updatePlan`, {
    method: 'POST',
    body: params,
  });
}
// 获取树结构的部门信息
export async function getOrgTreeData() {
  return request(`${path}/system/organization/getTree`);
}
// 获取部门下的人员 orgID
export async function getUserByOrgID(params) {
  return request(`${path}/system/userInfo/selectByOrgID`, {
    method: 'POST',
    body: params,
  });
}
// 添加短信分组
export async function addMsgGroup(params) {
  return request(`${path}/system/baseShortMsgUserGroupList/add`, {
    method: 'POST',
    body: params,
  });
}
// 短信分组分页
export async function msgGroupPage(params) {
  return request(`${path}/system/baseShortMsgUserGroup/page`, {
    method: 'POST',
    body: params,
  });
}
// 删除短信分组
export async function deleteMsgGroup(params) {
  return request(`${path}/system/baseShortMsgUserGroup/delete`, {
    method: 'POST',
    body: params,
  });
}
// get短信分组
export async function getMsgGroup(params) {
  return request(`${path}/system/baseShortMsgUserGroup/get`, {
    method: 'POST',
    body: params,
  });
}
// 修改短信分组
export async function updateMsgGroup(params) {
  return request(`${path}/system/baseShortMsgUserGroupList/update`, {
    method: 'POST',
    body: params,
  });
}
// 请求扩音对讲系统信息
export async function fetchPASystem() {
  return request('/api/PASystem/fetchPASystem');
}
// 修改扩音对讲系统信息
export async function changePASystem(params) {
  return request('/api/PASystem/changePASystem', {
    method: 'POST',
    body: params,
  });
}
// 请求实施方案
export async function getExecuteList(params) {
  return request(`${path}/emgc/emgcEventExecutePlan/selectExecuteList`, {
    method: 'POST',
    body: params,
  });
}
// 新增短信
export async function addMsg(params) {
  return request(`${path}/system/baseShortMsg/add`, {
    method: 'POST',
    body: params,
  });
}
// 新增短信
export async function msgPage(params) {
  return request(`${path}/system/baseShortMsg/page`, {
    method: 'POST',
    body: params,
  });
}
// 资源分页
export async function resourcePage(params) {
  return request(`${path}/resource/resourceInfo/page`, {
    method: 'POST',
    body: params,
  });
}
// 专业系统 分页
export async function professionPage(params) {
  return request(`${path}/resource/resProfessionSystem/page`, {
    method: 'POST',
    body: params,
  });
}
// 短信规则 报警类型分页
export async function alarmTypePage(params) {
  return request(`${path}/system/alarmAlarmType/getPageInfo`, {
    method: 'POST',
    body: params,
  });
}
// 新增短信规则
export async function addMsgRule(params) {
  return request(`${path}/system/alarmAlarmDealRule/add`, {
    method: 'POST',
    body: params,
  });
}
// 修改短信规则
export async function updateMsgRule(params) {
  return request(`${path}/system/alarmAlarmDealRule/update`, {
    method: 'POST',
    body: params,
  });
}
// 修改短信规则
export async function getMsgRule(params) {
  return request(`${path}/system/alarmAlarmDealRule/get`, {
    method: 'POST',
    body: params,
  });
}
// 短信规则分页
export async function msgRulePage(params) {
  return request(`${path}/system/alarmAlarmDealRule/page`, {
    method: 'POST',
    body: params,
  });
}
// 删除短信规则
export async function deleteMsgRule(params) {
  return request(`${path}/system/alarmAlarmDealRule/delete`, {
    method: 'POST',
    body: params,
  });
}
// 删除短信规则
export async function msgRuleActionList() {
  return request(`${path}/system/alarmAlarmDealAction/list`);
}
// 获取环保地图数据
export async function fetchEnvData() {
  return request('/api/fake_envMonitor', {
    method: 'POST',
  });
}
// 广播分区状态请求
export async function getBroadcastState() {
  return request(`${path}/controldevice/Broadcast/state/getBroadcastState`);
}
// 广播分区控制（分区）
export async function BroadcastOptByArea(params) {
  return request(`${path}/controldevice/fm/BroadcastOptByArea`, {
    method: 'POST',
    body: params,
  });
}
// 广播分区控制（单个设备）
export async function BroadcastOptByResourceID(params) {
  return request(`${path}/controldevice/fm/BroadcastOptByResourceID`, {
    method: 'POST',
    body: params,
  });
}
// 生产日报请求历史数据(装置生产情况)
export async function getEquipmentProductInfoHistoryData(params) {
  return request(`${path}/report/proRptEquipmentProductInfo/selectMonth`, {
    method: 'POST',
    body: params,
  });
}
// 生产日报请求历史数据(裂解炉)
export async function getDissociationHistoryData(params) {
  return request(`${path}/report/proRptDissociationInfo/selectMonth`, {
      method: 'POST',
      body: params,
    });
}
// 生产日报请求历史数据(发电机)
export async function getRptAlternatorHistoryData(params) {
  return request(`${path}/report/proRptAlternatorInfo/selectMonth`, {
    method: 'POST',
    body: params,
  });
}
// 生产日报请求历史数据(热电炉)
export async function getRptHotFurnaceHistoryData(params) {
  return request(`${path}/report/proRptHotFurnaceInfo/selectMonth`, {
    method: 'POST',
    body: params,
  });
}
// 生产日报请求历史数据(原材料)
export async function getProRptRawInfoHistoryData(params) {
  return request(`${path}/report/proRptRawInfo/selectMonth`, {
    method: 'POST',
    body: params,
  });
}
// 生产日报请求历史数据(有机产品)
export async function getOrganicProductHistoryData(params) {
  return request(`${path}/report/proRptOrganicProductInfo/selectMonth`, {
    method: 'POST',
    body: params,
  });
}
// 生产日报请求历史数据(树脂产品)
export async function getRptResinReportHistoryData(params) {
  return request(`${path}/report/proRptResinReportInfo/selectMonth`, {
    method: 'POST',
    body: params,
  });
}
// 生成日报请求历史数据（动力消耗）report/proRptPowerConsumeValue/selectMonth
export async function getRptPowerConsumeHistoryData(params) {
  return request(`${path}/report/proRptPowerConsumeValue/selectMonth`, {
    method: 'POST',
    body: params,
  });
}
// 实时数据（附带阈值.分组）
export async function getNewsDataByGroup(params) {
  return request(`${path}/immediateData/immediateDataInfo/getDataByGroup`, {
  // return request('http://127.0.0.1:7000/getDataByGroup', {
    method: 'POST',
    body: params,
  });
}
// 实时数据（附带阈值.类型）
export async function getNewsDataByCtrlResourceType(params) {
  // return request('http://127.0.0.1:7000/getDatasByCtrlResourceType', {
    return request(`${path}/immediateData/immediateDataInfo/getDatasByCtrlResourceType`, {
    method: 'POST',
    body: params,
  });
}
// 数据权限配置新增
export async function dataPowerAdd(params) {
  return request(`${path}/power/baseDataPower/addPower`, {
    method: 'POST',
    body: params,
  });
}
// 热电锅炉
export async function getThermoelectricFurnace(params) {
  return request(`${path}/report/proRptHotFurnaceInfo/selectToday`, {
    method: 'POST',
    body: params,
  });
}
// 热电锅炉运行天数
export async function getHotFurnaceRunDay(params) {
  return request(`${path}/report/proRptHotFurnaceInfo/selectRunDay`, {
    method: 'POST',
    body: params,
  });
}
// 发电机
export async function getDynamotor(params) {
  return request(`${path}/report/proRptAlternatorInfo/selectToday`, {
    method: 'POST',
    body: params,
  });
}
// 发电机运行天数
export async function getAlternatorRunDay(params) {
  return request(`${path}/report/proRptAlternatorInfo/selectRunDay`, {
    method: 'POST',
    body: params,
  });
}
// 请求有机产品
export async function getOrganicProduct(params) {
  return request(`${path}/report/proRptOrganicProductInfo/selectToday`, {
    method: 'POST',
    body: params,
  });
}
// 请求树脂产品
export async function getResinProduct(params) {
  return request(`${path}/report/proRptResinReportInfo/selectToday`, {
    method: 'POST',
    body: params,
  });
}
// 请求固体产品
export async function getSolidDefects(params) {
  return request(`${path}/report/proRptImperfectionsInfo/selectToday`, {
    method: 'POST',
    body: params,
  });
}
// 数据权限配置查询 参数 roleID
export async function getDataPower(params) {
  return request(`${path}/power/baseDataPower/getByRole`, {
    method: 'POST',
    body: params,
  });
}
// 数据权限配置查询 参数 planInfoID, statu
export async function changePlanStatu(params) {
  return request(`${path}/plan/planPlanInfo/changeStatu`, {
    method: 'POST',
    body: params,
  });
}
// 请求生产情况 分页接口
export async function productionStatusPage(params) {
  return request(`${path}/report/proRptProductReportInfo/getPageInfo`, {
    method: 'POST',
    body: params,
  });
}
// 请求实体岗位
export async function selectEntityPostion(params) {
  // return request(`${path}/system/basePostionInfo/selectEntityPostion`, {
  return request(`${path}/system/baseOrgPostion/selectEntityPostion`, {
    method: 'POST',
    body: params,
  });
}
// 请求应急岗位
export async function selectEmgcPostion() {
  return request(`${path}/system/basePostionInfo/selectEmgcPostion`);
}
// 请求视频权限
export const getPtzPower = async () => {
  return request(`${path}/system/sysFunction/getPtz`);
};
// 请求应急机构树
export async function getEmgcOrgTree() {
  return request(`${path}/system/organization/getEmgcTree`);
}
// 生产日报 水循环
export async function getRecycledWater(params) {
  return request(`${path}/report/proRptPowerConsumeValue/selectTodayWater`, {
    method: 'POST',
    body: params,
  });
}
// 生产日报 全厂生产污水（吨/时）和氮气（立方米/时）平衡表
export async function getWasteWater(params) {
  return request(`${path}/report/proRptGasWaterBalanceValue/selectProduceSewage`, {
    method: 'POST',
    body: params,
  });
}
// 请求生产日报 上传历史记录
export async function uploadHistoryPage(params) {
  return request(`${path}/report/proRptReportFileUploadRecord/page`, {
    method: 'POST',
    body: params,
  });
}
// 查询事件所关联的预案 params eventID
export async function getPlansByEventID(params) {
  return request(`${path}/emgc/emgcEventExecutePlan/selectPlanInfo`, {
    method: 'POST',
    body: params,
  });
}
// 获取区域列表 参数: areaType(111.101: 装置区域,111.102:门禁分区,111.103:扩音分区,111.104:功能分区,111.104: 责任分区)
export async function queryAreaListByAreaType(params) {
  return request(`${path}/resource/area/getByAreaType`, {
    method: 'POST',
    body: params,
  });
}
// 请求公钥
export async function getPublicKey() {
  return request(`${path}/system/getPubKey`);
}
// 质量日报
export async function getLimisReportData(params) {
  return request(`${path}/limis/proLimisReportData/selectReport`, {
    method: 'POST',
    body: params,
  });
}
// 仓储物流 车辆实时进出厂监控 参数: data
export async function getCarInOut(params) {
  return request(`${path}/production/proRptCarInOutRealTime/getByDay?date=${params}`);
}
// 仓储物流 实时物资进厂列表
export async function getMaterialInFactory(params) {
  return request(`${path}/production/proRptMaterialInFactoryRealTime/getByDay?date=${params}`);
}
// 仓储物流 实时提货列表清单
export async function getTakeCargoList(params) {
  return request(`${path}/production/proRptRealTimeTakeCargoList/getByDay?date=${params}`);
}
// 判断物料编码是否重复
export async function judgeMaterialCode(params) {
  return request(`${path}/system/rawMaterialInfo/judgeCode`, {
    method: 'POST',
    body: params,
  });
}
// 账户配置角色 param: Integer orgID,String userName
export async function accountRolePage(params) {
  return request(`${path}/system/accountInfo/getAccounts`, {
    method: 'POST',
    body: params,
  });
}
// 账户配置角色 根据账号配置角色
export async function getRolesByAccountID(params) {
  return request(`${path}/system/roleInfo/getRolesByAccountID`, {
    method: 'POST',
    body: params,
  });
}
// 保存账户配置的角色 int accountID,int[] roleIDs
export async function saveAccountRole(params) {
  return request(`${path}/system/baseAccountRole/edit`, {
    method: 'POST',
    body: params,
  });
}
// 接口平台 接口列表
export async function getPluginList() {
  return request(`${path}/plugin/getpluginstate`);
}
// 账户启用停用
export async function accountEnable(params) {
  return request(`${path}/system/accountInfo/updateState`, {
    method: 'POST',
    body: params,
  });
}
// 扩大应急阶段的实施方案
export async function expandPlanPage(params) {
  return request(`${path}/plan/planPlanInfo/expandPlanPage`, {
    method: 'POST',
    body: params,
  });
}
// 扩大应急阶段的实施方案
export async function judgeAcceptUser(params) {
  return request(`${path}/system/baseWhiteList/checkWhiteNumber`, {
    method: 'POST',
    body: params,
  });
}
// 报警处理 保存报警信息
export async function editAlarm(params) {
  return request(`${path}/system/alarmInfo/editAlarm`, {
    method: 'POST',
    body: params,
  });
}
// 编辑实施方案 修改应急组织 参数：eventExecPlanID(方案ID)、emgcOrgID(修改后的应急组织ID)
export async function updateEmgcOrg(params) {
  return request(`${path}/emgc/emgcEventExecutePlan/updateEmgcOrg`, {
    method: 'POST',
    body: params,
  });
}
// 根据当前页的functionCode 获取功能菜单 param parentCode
export async function getFunctionMenus(params) {
  return request(`${path}/system/sysFunction/selectLeaf`, {
    method: 'POST',
    body: params,
  });
}
// 历史应急事件
export async function historyEventPage(params) {
  return request(`${path}/system/alarmEventInfo/selectHistoryList`, {
    method: 'POST',
    body: params,
  });
}
// 获取服务器时间
export async function getServerTime(params) {
  return request(`${path}/emgc/emgcEventExecutePlan/getNow`, {
    method: 'POST',
    body: params,
  });
}
// 校验特征是否存在
export async function checkFeature(params) {
  return request(`${path}/plan/planPanFeature/checkFeature`, {
    method: 'POST',
    body: params,
  });
}
// 删除预案的应急组织
export async function deleteOrgAnnex(params) {
  return request(`${path}/system/baseOrgaArchiveInfo/delete`, {
    method: 'POST',
    body: params,
  });
}
// 获取方案的应急组织
export async function getImplOrgAnnex(params) {
  return request(`${path}/system/baseOrgaArchiveInfo/getByExecPlanID`, {
    method: 'POST',
    body: params,
  });
}
// 手动报警获取报警类型
export async function getManualAlarmType(params) {
  return request(`${path}/system/alarmAlarmType/getManualAlarmType`, {
    method: 'POST',
    body: params,
  });
}

