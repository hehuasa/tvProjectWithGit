import {
  templateList, addTemplate, deleteTemplate, getTemplate, updateTemplate, templatePage,
  getOrgTreeData, getUserByOrgID, addMsgGroup, msgGroupPage, deleteMsgGroup, updateMsgGroup,
  getMsgGroup, addMsg, msgPage, resourcePage, professionPage, alarmTypePage, addMsgRule,
  msgRulePage, getMsgRule, deleteMsgRule, updateMsgRule, getFunctionMenus,
} from '../services/api';
import { commonData } from '../../mock/commonData';
import { checkCode } from '../utils/utils';

export default {
  namespace: 'template',
  state: {
    data: {
      data: [],
      pagination: {},
    },
    tem: {
      data: {},
    },
    templateList: [],
    orgTree: [], // 树结构部门
    orgUsers: [], // 部门下的人员
    checkedUsers: [], // 选中的人员
    customUsers: [], // 自定义短信接收人员
    msgGroup: {
      data: [],
      msgGroup: {},
    }, // 短息分组分页
    msgGroupInfo: {}, // 短信分组信息
    msgGroupUsers: [], // 选中分组的人员
    msgPage: {
      data: [],
      pagination: {},
    }, // 短信分页信息
    msgInfo: {}, // 短信详情
    alarmRange: 1, // 报警范围 1.部门+专业系统 2.点位
    byOrg: 3, // 按部门 1.全部门 2.本部门 3.指定部门
    byProfession: 2, // 按专业系统 1.全专业系统 2.制定专业系统
    alarmType: 2, // 报警类型 1.全类型 2.指定类型
    resourcePage: {
      data: [],
      pagination: {},
    }, // 资源点位
    professionPage: {
      data: [],
      pagination: {},
    }, // 专业系统
    alarmTypePage: {
      data: [],
      pagination: {},
    }, // 报警类型
    checkedOrgIDs: [], // 短信规则 按部门选中的部门ID
    professionIDs: [], // 短信规则 按专业选中的专业系统ID
    resourceIDs: [], // 短信规则 选中的点位ID
    alarmTypeIDs: [], // 短信规则 选中的点位ID
    msgGroupIDs: [], // 短信规则 选中短信分组
    msgRulePage: {
      data: [],
      pagination: {},
    }, // 短信规则分页信息
    msgRuleInfo: {}, // 短信规则详情
    functionMenus: [], // 页面功能权限
    templateMenus: [], // 短信模板页面功能权限
    msgRuleMenus: [], // 短信规则页面功能权限
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(templateList);
      yield put({
        type: 'saveList',
        payload: response.data,
      });
    },
    *page(payload, { call, put }) {
      const response = yield call(templatePage, payload.payload);
      // 排序
      const listSort = (propertyName, type) => {
        return function (object1, object2) {
          const value1 = object1[propertyName];
          const value2 = object2[propertyName];
          const tag = value1 > value2;
          switch (type) {
            case 'ascend': return tag;
            case 'descend': return !tag;
            default: return 0;
          }
        };
      };
      if (response.code === 1001) {
        // 列表页排序
        if (payload.payload.sorter) {
          const { field, order } = payload.payload.sorter;
          response.data.result = response.data.result.sort(listSort(field, order));
        }
        // 列表过滤
        if (payload.payload.sex) {
          response.data.result = response.data.result.filter(val => val.sex && val.sex.indexOf(payload.payload.sex) > -1);
        }
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *add(payload, { call, put }) {
      const response = yield call(addTemplate, payload.payload);
      checkCode(response);
      if (response.code === 1001) {
        const template = yield call(templatePage, commonData.pageInitial);
        yield put({
          type: 'save',
          payload: template,
        });
      }
    },
    *delete(payload, { call, put }) {
      const response = yield call(deleteTemplate, payload.payload);
      checkCode(response);
      if (response.code === 1001) {
        const template = yield call(templatePage, commonData.pageInitial);
        yield put({
          type: 'save',
          payload: template,
        });
      }
    },
    *get(payload, { call, put }) {
      const response = yield call(getTemplate, payload.payload);
      if (response.code === 1001) {
        yield put({
          type: 'tem',
          payload: response,
        });
      }
    },
    *update(payload, { call, put }) {
      const response = yield call(updateTemplate, payload.payload);
      checkCode(response);
      if (response.code === 1001) {
        const template = yield call(templatePage, commonData.pageInitial);
        yield put({
          type: 'save',
          payload: template,
        });
      }
    },
    // 获取部门机构树
    *getOrgTree(payload, { call, put }) {
      const response = yield call(getOrgTreeData, payload.payload);
      yield put({
        type: 'saveOrgTree',
        payload: response.data,
      });
    },
    // 获取部门机构树
    *getOrgUsers({ payload }, { call, put }) {
      const response = yield call(getUserByOrgID, payload);
      yield put({
        type: 'saveOrgUsers',
        payload: response.data,
        // payload: response.data.map((user, index) => {
        //   user.orgID = user.userID;
        //   user.orgnizationName = user.userName;
        //   return user;
        // }),
      });
    },
    // 添加短信分组
    *addMsgGroup({ payload }, { call }) {
      const response = yield call(addMsgGroup, payload);
      checkCode(response);
    },
    // 删除短信分组
    *deleteMsgGroup({ payload }, { call }) {
      const response = yield call(deleteMsgGroup, payload);
      checkCode(response);
    },
    // 修改短信分组
    *updateMsgGroup({ payload }, { call }) {
      const response = yield call(updateMsgGroup, payload);
      checkCode(response);
    },
    // 短信分组分页
    *msgGroupPage({ payload }, { call, put }) {
      const response = yield call(msgGroupPage, payload);
      const data = {
        data: response.data.result,
        pagination: {
          current: response.data.pageNum,
          pageSize: response.data.pageSize,
          total: response.data.sumCount,
        },
      };
      yield put({
        type: 'saveMsgGroup',
        payload: data,
      });
    },
    // 获取短信分组
    *getMsgGroup({ payload }, { call, put }) {
      const response = yield call(getMsgGroup, payload);
      yield put({
        type: 'saveMsgGroupInfo',
        payload: response.data,
      });
      // 外部短信接收人
      yield put({
        type: 'saveCustomUsers',
        payload: response.data.userList,
      });
      // 内部短信接收人
      const arr = response.data.userIDList.map((user) => {
        user.userName = user.userNames;
        user.mobile = user.mobiles;
        return user;
      });
      yield put({
        type: 'saveCheckedUsers',
        payload: arr,
      });
    },
    // 短信分页
    *msgPage({ payload }, { call, put }) {
      const response = yield call(msgPage, payload);
      const data = {
        data: response.data.result,
        pagination: {
          current: response.data.pageNum,
          pageSize: response.data.pageSize,
          total: response.data.sumCount,
        },
      };
      yield put({
        type: 'saveMsgPage',
        payload: data,
      });
    },
    *msgGet({ payload }, { call, put }) {
      const response = yield call(msgGroupPage, payload);
      yield put({
        type: 'saveMsgInfo',
        payload: response.data,
      });
    },
    // 新增短信
    *msgAdd({ payload }, { call }) {
      const response = yield call(addMsg, payload);
      checkCode(response);
    },
    // 删除短息
    *msgDelete({ payload }, { call }) {
      const response = yield call(msgGroupPage, payload);
      checkCode(response);
    },
    // 修改短信
    *msgUpdate({ payload }, { call }) {
      const response = yield call(msgGroupPage, payload);
      checkCode(response);
    },
    // 规则 资源点位
    *resourcePage({ payload }, { call, put }) {
      const response = yield call(resourcePage, payload);
      const data = {
        data: response.data.result,
        pagination: {
          current: response.data.pageNum,
          pageSize: response.data.pageSize,
          total: response.data.sumCount,
        },
      };
      yield put({
        type: 'saveResourcePage',
        payload: data,
      });
    },
    // 规则 专业系统
    *professionPage({ payload }, { call, put }) {
      const response = yield call(professionPage, payload);
      const data = {
        data: response.data.result,
        pagination: {
          current: response.data.pageNum,
          pageSize: response.data.pageSize,
          total: response.data.sumCount,
        },
      };
      yield put({
        type: 'saveProfessionPage',
        payload: data,
      });
    },
    // 规则 报警类型分页数据
    *alarmTypePage({ payload }, { call, put }) {
      const response = yield call(alarmTypePage, payload);
      const data = {
        data: response.data.result,
        pagination: {
          current: response.data.pageNum,
          pageSize: response.data.pageSize,
          total: response.data.sumCount,
        },
      };
      yield put({
        type: 'saveAlarmTypePage',
        payload: data,
      });
    },
    // 新增短信规则
    *msgRuleAdd({ payload }, { call }) {
      const response = yield call(addMsgRule, payload);
      checkCode(response);
    },
    // 删除短息规则
    *msgRuleDelete({ payload }, { call }) {
      const response = yield call(deleteMsgRule, payload);
      checkCode(response);
    },
    // 修改短信规则
    *msgRuleUpdate({ payload }, { call }) {
      const response = yield call(updateMsgRule, payload);
      checkCode(response);
    },
    // 短信规则 分页
    *msgRulePage({ payload }, { call, put }) {
      const response = yield call(msgRulePage, payload);
      const data = {
        data: response.data.result,
        pagination: {
          current: response.data.pageNum,
          pageSize: response.data.pageSize,
          total: response.data.sumCount,
        },
      };
      yield put({
        type: 'saveMsgRulePage',
        payload: data,
      });
    },
    // 短信规则get
    *getMsgRule({ payload }, { call, put }) {
      const response = yield call(getMsgRule, payload);
      // 保存短信规则详情
      yield put({
        type: 'saveMsgRuleInfo',
        payload: response.data,
      });
      // 保存设备选择类型
      yield put({
        type: 'saveAlarmRange',
        payload: response.data.deviceSelectType,
      });
      // 保存 按部门类型
      yield put({
        type: 'saveByOrg',
        payload: response.data.byOrg,
      });
      // 报讯选中的部门
      if (response.data.orgList) {
        const data = JSON.stringify(response.data.orgList.map(item => item.orgID.toString()));
        yield put({
          type: 'saveCheckedOrgIDs',
          payload: JSON.parse(data),
        });
      }
      // 保存 按专业系统
      yield put({
        type: 'saveByProfession',
        payload: response.data.byProfession,
      });
      // 保存选中的专业系统
      if (response.data.professionList) {
        yield put({
          type: 'saveProfessionIDs',
          payload: response.data.professionList.map(item => item.professionSystemID),
        });
      }
      // 保存 报警类型
      yield put({
        type: 'saveAlarmType',
        payload: response.data.byAlarmType,
      });
      // 保存选中的报警类型
      if (response.data.alarmTypeList) {
        yield put({
          type: 'saveAlarmTypeID',
          payload: response.data.alarmTypeList.map(item => item.alarmTypeID),
        });
      }
      // 保存选中的报警类型
      if (response.data.userInfoList) {
        // 保存选中的组织机构人员
        yield put({
          type: 'saveCheckedUsers',
          payload: response.data.userInfoList.userIDS,
        });
        // 保存选中的短信接受组
        yield put({
          type: 'saveMsgGroupIDs',
          payload: response.data.userInfoList.groupIDs.map(record => record.shortMsgUserGroupID),
        });
        // 保存选中的短信接受组
        yield put({
          type: 'saveCustomUsers',
          payload: response.data.userInfoList.customs,
        });
      }
    },
    * getFunctionMenus({ payload }, { call, put }) {
      const res = yield call(getFunctionMenus, payload);
      yield put({
        type: 'saveFunctionMenus',
        payload: res.data,
      });
    },
    * getTemplateMenus({ payload }, { call, put }) {
      const res = yield call(getFunctionMenus, payload);
      yield put({
        type: 'saveTemplateMenus',
        payload: res.data,
      });
    },
    * getMsgRuleMenus({ payload }, { call, put }) {
      const res = yield call(getFunctionMenus, payload);
      yield put({
        type: 'saveMsgRuleMenus',
        payload: res.data,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          data: action.payload.data.result,
          pagination: {
            current: action.payload.data.pageNum,
            pageSize: action.payload.data.pageSize,
            total: action.payload.data.sumCount,
          },
        },
      };
    },
    saveList(state, action) {
      return {
        ...state,
        templateList: action.payload,
      };
    },
    tem(state, action) {
      return {
        ...state,
        tem: action.payload,
      };
    },
    saveOrgTree(state, { payload }) {
      return {
        ...state,
        orgTree: payload,
      };
    },
    saveOrgUsers(state, { payload }) {
      return {
        ...state,
        orgUsers: payload,
      };
    },
    saveCheckedUsers(state, { payload }) {
      return {
        ...state,
        checkedUsers: payload,
      };
    },
    saveCustomUsers(state, { payload }) {
      return {
        ...state,
        customUsers: payload,
      };
    },
    saveMsgGroup(state, { payload }) {
      return {
        ...state,
        msgGroup: payload,
      };
    },
    saveMsgGroupInfo(state, { payload }) {
      return {
        ...state,
        msgGroupInfo: payload,
      };
    },
    saveMsgGroupUsers(state, { payload }) {
      return {
        ...state,
        msgGroupUsers: payload,
      };
    },
    saveMsgPage(state, { payload }) {
      return {
        ...state,
        msgPage: payload,
      };
    },
    saveMsgInfo(state, { payload }) {
      return {
        ...state,
        msgInfo: payload,
      };
    },
    saveAlarmRange(state, { payload }) {
      return {
        ...state,
        alarmRange: payload,
      };
    },
    saveByOrg(state, { payload }) {
      return {
        ...state,
        byOrg: payload,
      };
    },
    saveByProfession(state, { payload }) {
      return {
        ...state,
        byProfession: payload,
      };
    },
    saveAlarmType(state, { payload }) {
      return {
        ...state,
        alarmType: payload,
      };
    },
    saveResourcePage(state, { payload }) {
      return {
        ...state,
        resourcePage: payload,
      };
    },
    saveProfessionPage(state, { payload }) {
      return {
        ...state,
        professionPage: payload,
      };
    },
    saveAlarmTypePage(state, { payload }) {
      return {
        ...state,
        alarmTypePage: payload,
      };
    },
    saveCheckedOrgIDs(state, { payload }) {
      return {
        ...state,
        checkedOrgIDs: payload,
      };
    },
    saveProfessionIDs(state, { payload }) {
      return {
        ...state,
        professionIDs: payload,
      };
    },
    saveResourceIDs(state, { payload }) {
      return {
        ...state,
        resourceIDs: payload,
      };
    },
    saveAlarmTypeID(state, { payload }) {
      return {
        ...state,
        alarmTypeIDs: payload,
      };
    },
    saveMsgGroupIDs(state, { payload }) {
      return {
        ...state,
        msgGroupIDs: payload,
      };
    },
    saveMsgRulePage(state, { payload }) {
      return {
        ...state,
        msgRulePage: payload,
      };
    },
    saveMsgRuleInfo(state, { payload }) {
      return {
        ...state,
        msgRuleInfo: payload,
      };
    },
    saveFunctionMenus(state, { payload }) {
      return {
        ...state,
        functionMenus: payload,
      };
    },
    saveTemplateMenus(state, { payload }) {
      return {
        ...state,
        templateMenus: payload,
      };
    },
    saveMsgRuleMenus(state, { payload }) {
      return {
        ...state,
        msgRuleMenus: payload,
      };
    },
  },
};
