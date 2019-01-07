import React from 'react';
import moment from 'moment';
import { Tag } from 'antd';
import { switchCode } from '../src/services/statusCode';
import { win3, win10, win11, win12, win13, win14, win15, win16, win17, win18, win19, win20, win21, win22, win23, win24, win25, win26, win27, win28, win29, win30, 
} from '../src/configIndex';


export const commonData = {
  // 状态码
  statusCode: {
    1001: '操作成功',
    1002: '操作失败',
    1003: '异常',
    1004: '错误',
    1005: '用户名或密码错误',
    1006: '参数为空',
    1007: '参数错误',
    1008: '文件创建失败',
    1009: '会话超时',
    1010: '唯一字段已经存在',
    1011: '导出失败',
    1012: '域账户不允许修改或删除',
    1013: '短信不允许修改',
    1014: '操作成功数据为空',
    1015: '此阶段只允许有一个实施方案',
    1016: '该特征值已存在在当前预案中，不能重复添加',
    1017: '该预案不允许删除',
  },
  // 初始化分页属性
  pageInitial: {
    // 当前页
    pageNum: 1,
    // 每页显示条数
    pageSize: 10,
    // isQuery: false,
    // fuzzy: false,
  },
  // 性别
  sex: [
    {
      id: 0,
      text: '男',
      value: '男',
    },
    {
      id: 1,
      text: '女',
      value: '女',
    }],
  // 布尔 值是布尔
  bool: [
    {
      id: 0,
      text: '是',
      value: true,
    },
    {
      id: 1,
      text: '否',
      value: false,
    },
  ],
  // 布尔 值是0/1
  boolNum: [
    {
      id: 0,
      text: '是',
      value: 0,
    },
    {
      id: 1,
      text: '否',
      value: 1,
    },
  ],
  // 角色类型
  roleType: [
    {
      id: 0,
      text: '功能角色',
      value: 1,
    },
    {
      id: 1,
      text: '数据角色',
      value: 2,
    },
  ],
  //  列属性 isExport是否是到处项，Filter：列筛选，isTableItem：是否是列表显示项
  columns: {
    user: {
      operateBtn: ['delete', 'update'],
      attributes:
        [
          { title: 'ID', dataIndex: 'userID', isExport: true },
          {
            title: '用户编码',
            dataIndex: 'userCode',
            isExport: true,
            isTableItem: true,
            width: '15%',
            key: 'userCode',
          },
          {
            title: '用户名称',
            dataIndex: 'userName',
            isExport: true,
            isTableItem: true,
            width: '10%',
            key: 'userName',
          },
          {
            title: '用户类型',
            dataIndex: 'userTypeName',
            isExport: true,
            isTableItem: true,
            width: '10%',
            key: 'userType',
          },
          {
            title: '所属部门',
            dataIndex: 'orgnizationName',
            isExport: false,
            isTableItem: true,
            width: '10%',
            key: 'orgnizationName',
          },
          { title: '拼音', dataIndex: 'queryKey', isExport: true },
          {
            title: '性别',
            dataIndex: 'sex',
            isExport: true,
            isTableItem: true,
            width: '10%',
            key: 'sex',
            filters: [{ text: '男', value: '男' }, { text: '女', value: '女' }],
          },
          { title: '电话', dataIndex: 'phoneNumber', isExport: true },
          {
            title: '手机',
            dataIndex: 'mobile',
            isExport: true,
            isTableItem: true,
            width: '10%',
            key: 'mobile',
          },
          { title: '短号', dataIndex: 'shortNumber', isExport: true },
          { title: '邮箱', dataIndex: 'eMail', isExport: true },
          { title: '办公地址', dataIndex: 'officeAddr', isExport: true },
          { title: '家庭地址', dataIndex: 'familyAddr', isExport: true },
          {
            title: '创建日期',
            dataIndex: 'createTime',
            isExport: true,
            isTableItem: true,
            width: '15%',
            key: 'createTime',
            sorter: true,
            defaultSortOrder: 'descend',
            render: val => <span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
          },
          { title: '学历', dataIndex: 'formalSchooling', isExport: true },
          { title: '专业', dataIndex: 'speciality', isExport: true },
          { title: '毕业学校', dataIndex: 'school', isExport: true },
          { title: '职称', dataIndex: 'professionalRanks', isExport: true },
          { title: '是否在职', dataIndex: 'working', isExport: true },
          { title: '说明', dataIndex: 'remark', isExport: true },
        ],
    },
    account: {
      attributes: [
        {
          title: '部门',
          dataIndex: 'baseUserInfo',
          isExport: false,
          isTableItem: true,
          width: win20,
          key: 'baseUserInfo',
          render: (text) => {
            return text ? text.orgnizationName : '';
          },
        },
        {
          title: '姓名',
          dataIndex: 'userName',
          isExport: false,
          isTableItem: true,
          width: win10,
          key: 'userName',
          render: (text, record) => {
            return record.baseUserInfo ? record.baseUserInfo.userName : '';
          },
        },
        {
          title: '账号',
          dataIndex: 'loginAccount',
          isExport: true,
          isTableItem: true,
          width: win10,
          key: 'loginAccount',
        },
        {
          title: '用户类型',
          dataIndex: 'accountTypeName',
          isExport: true,
          isTableItem: true,
          width: win10,
          key: 'accountType',
        },
        {
          title: '用户状态',
          dataIndex: 'accountState',
          isExport: true,
          isTableItem: true,
          width: win10,
          key: 'accountState',
          render: (text) => {
            return text === 1 ? <span color="blue">已启用</span> : <span color="red">已停用</span>;
          },
        },
        {
          title: '备注',
          dataIndex: 'remark',
          isExport: true,
          isTableItem: true,
          // width: win15,
          key: 'remark',
        },
      ],
    },
    role: {
      attributes: [
        { title: 'roleID',
          dataIndex: 'roleID',
          isExport: true,
          isTableItem: false,
          key: 'roleID' },
        { title: '角色名称',
          dataIndex: 'roleName',
          isExport: true,
          isTableItem: true,
          width: '15%',
          key: 'roleName' },
        { title: '角色编码',
          dataIndex: 'roleCode',
          isExport: true,
          width: '15%',
          isTableItem: false,
          key: 'roleCode' },
        { title: '角色类型',
          dataIndex: 'roleType',
          isExport: true,
          width: '15%',
          isTableItem: false,
          key: 'roleType' },
        { title: '角色描述',
          dataIndex: 'roleDes',
          isExport: true,
          isTableItem: true,
          width: '15%',
          key: 'roleDes' },
        {
          title: '是否有效',
          dataIndex: 'enabled',
          render: (text, record) => <span> {record.enabled ? '是' : '否'}</span>,
          isExport: true,
          isTableItem: true,
          width: '15%',
          key: 'enabled',
        },
      ],
    },
    msg: {
      attributes: [
        {
          title: '短信内容',
          dataIndex: 'msgContent',
          width: '30%',
          isExport: true,
          isTableItem: true,
          key: 'msgContent',
        },
        {
          title: '接收人',
          dataIndex: 'userName',
          width: '15%',
          isExport: true,
          isTableItem: true,
          key: 'userName' },
        {
          title: '接收号码',
          dataIndex: 'acceptNumber',
          width: '15%',
          isExport: true,
          isTableItem: true,
          key: 'acceptNumber' },
        {
          title: '发送时间',
          dataIndex: 'sendTime',
          width: '20%',
          isExport: true,
          isTableItem: true,
          key: 'sendTime',
          render: val => (val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : null),
        },
        {
          title: '发送结果',
          dataIndex: 'sendStatu',
          width: '15%',
          isExport: true,
          isTableItem: true,
          key: 'sendStatu',
          render: (text) => {
            switch (text) {
              case 0:
                return '待确定';
              case 1:
                return '待发送';
              case 2:
                return '发送中';
              case 3:
                return '发送失败';
              default:
                break;
            }
          },
        },
      ],
    },
    template: {
      attributes: [
        {
          title: '模板名称',
          dataIndex: 'templateTitle',
          isExport: true,
          isTableItem: true,
          key: 'templateTitle',
        },
        { title: '模板内容', dataIndex: 'content', isExport: true, isTableItem: true, key: 'content' },
        /* {
          title: '模板类型',
          dataIndex: 'templateType',
          isExport: true,
          isTableItem: true,
          key: 'templateType',
        }, */
      ],
    },
    // 短信分组
    msgGroup: {
      attributes: [
        { title: '分组名称', dataIndex: 'groupName', isExport: true, isTableItem: true, key: 'groupName' },
        { title: '备注', dataIndex: 'remark', isExport: true, isTableItem: true, key: 'remark' },
      ],
    },
    // 指令库维护
    commandLibrary: {
      operateBtn: ['delete', 'update'],
      attributes:
        [
          { title: 'ID', dataIndex: 'userID', isExport: true },
          {
            title: '指令名称',
            dataIndex: 'userCode',
            isExport: true,
            isTableItem: true,
            width: '15%',
            key: 'userCode',
          }, {
            title: '指令内容',
            dataIndex: 'userName',
            isExport: true,
            isTableItem: true,
            width: '10%',
            key: 'userName',
          }, {
            title: '执行岗位',
            dataIndex: 'userTypeName',
            isExport: true,
            isTableItem: true,
            width: '10%',
            key: 'userType',
          }, {
            title: '执行时长',
            dataIndex: 'userTypeName',
            isExport: true,
            isTableItem: true,
            width: '10%',
            key: 'userType',
          }, {
            title: '注意事项',
            dataIndex: 'userTypeName',
            isExport: true,
            isTableItem: true,
            width: '10%',
            key: 'userType',
          },
        ],
    },
    // 事件特征维护
    featureLibrary: {
      operateBtn: ['delete', 'update'],
      attributes:
        [
          { title: 'ID', dataIndex: 'userID', isExport: true },
          {
            title: '特征编号',
            dataIndex: 'userCode',
            isExport: true,
            isTableItem: true,
            width: '15%',
            key: 'userCode',
          }, {
            title: '特征名称',
            dataIndex: 'userName',
            isExport: true,
            isTableItem: true,
            width: '10%',
            key: 'userName',
          }, {
            title: '创建部门',
            dataIndex: 'userTypeName',
            isExport: true,
            isTableItem: true,
            width: '10%',
            key: 'userType',
          }, {
            title: '特征分类',
            dataIndex: 'userTypeName',
            isExport: true,
            isTableItem: true,
            width: '10%',
            key: 'userType',
          },
        ],
    },
    // 物料维护
    material: {
      operateBtn: ['delete', 'update'],
      attributes:
        [
          { title: 'ID', dataIndex: 'toolMaterialInfoID', isExport: true },
          {
            title: '物料编码',
            dataIndex: 'rawCode',
            isExport: true,
            isTableItem: true,
            width: 100,
            key: 'rawCode',
          },
          {
            title: '物料名称',
            dataIndex: 'rawMaterialName',
            isExport: true,
            isTableItem: true,
            width: 100,
            key: 'rawMaterialName',
          },
          {
            title: '物料类型',
            dataIndex: 'rawType',
            isExport: true,
            isTableItem: true,
            width: 100,
            key: 'rawType',
          },
          {
            title: '分子结构',
            dataIndex: 'molecularStructure',
            isExport: true,
            isTableItem: true,
            width: 100,
            key: 'molecularStructure',
          },
          {
            title: '分子量',
            dataIndex: 'formulaWeight',
            isExport: false,
            isTableItem: true,
            width: 120,
            key: 'formulaWeight',
          },
          {
            title: '相对密度',
            dataIndex: 'relativeDensity',
            isExport: false,
            isTableItem: true,
            width: 120,
            key: 'relativeDensity',
          },
          {
            title: '相对蒸汽密度',
            dataIndex: 'relativeSteamDensity',
            isExport: false,
            isTableItem: true,
            width: 140,
            key: 'relativeSteamDensity',
          },
          {
            title: '燃烧温度',
            dataIndex: 'burningTemperature',
            isExport: true,
            isTableItem: true,
            width: 100,
            key: 'burningTemperature',
          },
          {
            title: '沸点℃',
            dataIndex: 'boilingPoint',
            isExport: true,
            isTableItem: true,
            width: 100,
            key: 'boilingPoint',
          },
          {
            title: '闪点℃',
            dataIndex: 'flashPoint',
            isExport: true,
            isTableItem: true,
            width: 100,
            key: 'flashPoint',
          },
          {
            title: '爆炸范围',
            dataIndex: 'explosionRange',
            isExport: true,
            isTableItem: true,
            width: 100,
            key: 'explosionRange',
          },
          {
            title: '爆炸临界点',
            dataIndex: 'explosionPoint',
            isExport: true,
            isTableItem: true,
            width: 120,
            key: 'explosionPoint',
          },
          {
            title: '溶解性',
            dataIndex: 'solubility',
            isExport: true,
            isTableItem: true,
            width: 100,
            key: 'solubility',
          },
          {
            title: '外观',
            dataIndex: 'shape',
            isExport: true,
            isTableItem: true,
            width: 100,
            key: 'shape',
          },
          {
            title: '形状',
            dataIndex: 'shapeProperty',
            isExport: true,
            isTableItem: true,
            width: 100,
            key: 'shapeProperty',
          },
          {
            title: '健康危害',
            dataIndex: 'healthHazards',
            isExport: true,
            isTableItem: true,
            width: 120,
            key: 'healthHazards',
          },
          {
            title: '说明',
            dataIndex: 'remark',
            isExport: true,
            isTableItem: true,
            width: 120,
            key: 'remark',
          },
        ],
    },
    // 码表维护
    typeCode: {
      operateBtn: ['delete', 'update'],
      attributes:
        [
          { title: 'codeID', dataIndex: 'codeID', isExport: true },
          {
            title: '码表类型编码',
            dataIndex: 'codeTypeCode',
            isExport: true,
            isTableItem: false,
            width: '10%',
            key: 'codeTypeCode',
          },
          {
            title: '编码',
            dataIndex: 'code',
            isExport: true,
            isTableItem: false,
            width: '10%',
            key: 'code',
          },
          {
            title: '内部类型',
            dataIndex: 'innerCodeType',
            isExport: true,
            isTableItem: false,
            width: '10%',
            key: 'innerCodeType',
          },
          {
            title: '编码名称',
            dataIndex: 'codeName',
            isExport: true,
            isTableItem: true,
            width: '15%',
            key: 'codeName',
          },
          {
            title: '显示名称',
            dataIndex: 'codeCaption',
            isExport: true,
            isTableItem: true,
            width: '45%',
            key: 'codeCaption',
          },
          {
            title: '排序顺序',
            dataIndex: 'orderIndex',
            isExport: true,
            isTableItem: true,
            width: '20%',
            key: 'orderIndex',
          },
        ],
    },
    // 应急演练方案 管理
    emergencyDrill: {
      operateBtn: ['delete', 'update'],
      attributes:
        [
          { title: 'drillPlanID', dataIndex: 'drillPlanID', isExport: true },
          {
            title: '计划名称',
            dataIndex: 'drillPlanName',
            isExport: true,
            isTableItem: true,
            width: 160,
            key: 'drillPlanName',
          },
          {
            title: '演习地点',
            dataIndex: 'address',
            isExport: true,
            isTableItem: true,
            width: 200,
            key: 'address',
          },
          {
            title: '编制依据',
            dataIndex: 'basis',
            isExport: true,
            isTableItem: true,
            width: 200,
            key: 'basis',
          },
          {
            title: '事故假设',
            dataIndex: 'accident',
            isExport: true,
            isTableItem: true,
            width: 220,
            key: 'accident',
          },
          {
            title: '创建部门',
            dataIndex: 'createOrgName',
            isExport: true,
            isTableItem: true,
            width: 120,
            key: 'createOrgName',
          },
          {
            title: '开始时间',
            dataIndex: 'startTime',
            isExport: true,
            isTableItem: true,
            width: 160,
            key: 'startTime',
            render: val => <span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
          },
          {
            title: '结束时间',
            dataIndex: 'endTime',
            isExport: true,
            isTableItem: true,
            width: 160,
            key: 'endTime',
            render: val => <span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
          },
          {
            title: '演练方式',
            dataIndex: 'drillMode',
            isExport: true,
            isTableItem: true,
            width: 120,
            key: 'drillMode',
          },
          {
            title: '所属部门',
            dataIndex: 'belongOrgName',
            isExport: true,
            isTableItem: true,
            width: 120,
            key: 'belongOrgName',
            render: (text, record) => {
              return record.createOrgName;
            },
          },
          {
            title: '演习目的',
            dataIndex: 'target',
            isExport: true,
            isTableItem: true,
            width: 180,
            key: 'target',
          },
          {
            title: '演练准备',
            dataIndex: 'drillPrepare',
            isExport: true,
            isTableItem: true,
            width: 180,
            key: 'drillPrepare',
          },
          {
            title: '演练步骤',
            dataIndex: 'drillStep',
            isExport: true,
            isTableItem: true,
            width: 180,
            key: 'drillStep',
          },
          {
            title: '注意事项',
            dataIndex: 'attemption',
            isExport: true,
            isTableItem: true,
            width: 180,
            key: 'attemption',
          },
          {
            title: '演练总结',
            dataIndex: 'summarize',
            isExport: true,
            isTableItem: true,
            // width: 200,
            key: 'summarize',
          },
        ],
    },
    // 历史报警查询
    historyAlarmList: {
      operateBtn: ['delete', 'update'],
      attributes:
        [
          { title: 'alarmID', dataIndex: 'alarmID', isExport: true },
          {
            title: '报警点位',
            dataIndex: 'resourceID',
            isExport: true,
            isTableItem: true,
            key: 'ruleName',
          },
          {
            title: '报警类型',
            dataIndex: 'alarmTypeID',
            isExport: true,
            isTableItem: true,
            key: 'alarmTypeID',
          },
          {
            title: '首保时间',
            dataIndex: 'alarmTypeID',
            isExport: true,
            isTableItem: true,
            key: 'alarmTypeID',
          },
          {
            title: '报警编号',
            dataIndex: 'tartTime',
            isExport: true,
            isTableItem: true,
            key: 'alarmCode',
          },
          {
            title: '警情描述',
            dataIndex: 'onTime',
            isExport: true,
            isTableItem: true,
            key: 'onTime',
          },
          {
            title: '报警状态',
            dataIndex: 'alarmStatu',
            isExport: true,
            isTableItem: true,
            key: 'alarmStatu',
          },
          {
            title: '首报时间',
            dataIndex: 'startTime',
            isExport: true,
            isTableItem: true,
            key: 'startTime',
          },
        ],
    },
    // 应急演练方案 管理
    msgRule: {
      operateBtn: ['delete', 'update'],
      attributes:
        [
          { title: 'dealRuleID', dataIndex: 'dealRuleID', isExport: true },
          {
            title: '规则名称',
            dataIndex: 'ruleName',
            isExport: true,
            isTableItem: true,
            key: 'ruleName',
            width: win18,
          },
          {
            title: '设备选择类型',
            dataIndex: 'deviceSelectType',
            isExport: true,
            isTableItem: true,
            key: 'deviceSelectType',
            width: win18,
            render: (val) => {
              switch (val) {
                case 1: return '部门+专业系统';
                case 2: return '指定点位';
                default: break;
              }
            },
          },
          {
            title: '按部门',
            dataIndex: 'byOrg',
            isExport: true,
            isTableItem: true,
            key: 'byOrg',
            width: win18,
            render: (val) => {
              switch (val) {
                case 1: return '全部门';
                case 2: return '本部门';
                case 3: return '指定部门';
                default: break;
              }
            },
          },
          {
            title: '按专业系统',
            dataIndex: 'byProfession',
            isExport: true,
            isTableItem: true,
            key: 'byProfession',
            width: win18,
            render: (val) => {
              switch (val) {
                case 1: return '全专业系统';
                case 2: return '指定专业系统';
                default: break;
              }
            },
          },
          {
            title: '持续时长',
            dataIndex: 'onTime',
            isExport: true,
            isTableItem: true,
            key: 'onTime',
            width: win18,
          },
          {
            title: '报警类型',
            dataIndex: 'byAlarmType',
            isExport: true,
            isTableItem: true,
            key: 'byAlarmType',
            width: win18,
            render: (val) => {
              switch (val) {
                case 1: return '全类型';
                case 2: return '指定类型';
                default: break;
              }
            },
          },
          {
            title: '说明',
            dataIndex: 'remark',
            isExport: true,
            isTableItem: true,
            key: 'remark',
            width: win18,
          },
        ],
    },

  },

  //  模拟菜单数据
  menuData: [
    {
      name: '首页',
      icon: 'dashboard',
      path: 'homePage',
    },
    {
      name: '监控预警',
      icon: 'dashboard',
      path: 'monitorWarning',
      children: [{
        name: '环保',
        path: 'evr',
      }, {
        name: '列表',
        path: 'list',
      }, {
        name: 'Demo',
        path: 'demo',
      }, {
        name: '地图页',
        path: 'arcgis',
      }],
    },
    {
      name: '生产调度',
      icon: 'dashboard',
      path: 'productionDispatch',
      children: [{
        name: '子页面',
        path: 'part1',
      }, {
        name: '子页面',
        path: 'part2',
      }, {
        name: '子页面',
        path: 'part3',
      }],
    },
    {
      name: '应急指挥',
      icon: 'dashboard',
      path: 'command',
      children: [{
        name: '子页面',
        path: 'part1',
      }, {
        name: '子页面',
        path: 'part2',
      }, {
        name: '子页面',
        path: 'part3',
      }],
    },
    {
      name: '应急演练',
      icon: 'dashboard',
      path: 'exercise',
      children: [{
        name: '子页面',
        path: 'part1',
      }, {
        name: '子页面',
        path: 'part2',
      }, {
        name: '子页面',
        path: 'part3',
      }],
    },
    {
      name: '资源管理',
      icon: 'dashboard',
      path: 'resource',
      children: [{
        name: '子页面',
        path: 'part1',
      }, {
        name: '子页面',
        path: 'part2',
      }, {
        name: '子页面',
        path: 'part3',
      }],
    },
    {
      name: '通用工具',
      icon: 'dashboard',
      path: 'tools',
      children: [{
        name: '子页面',
        path: 'part1',
      }, {
        name: '子页面',
        path: 'part2',
      }, {
        name: '子页面',
        path: 'part3',
      }],
    },
    {
      name: '统计分析',
      icon: 'dashboard',
      path: 'analysis',
      children: [{
        name: '子页面',
        path: 'part1',
      }, {
        name: '子页面',
        path: 'part2',
      }, {
        name: '子页面',
        path: 'part3',
      }],
    },
    {
      name: '系统管理',
      icon: 'dashboard',
      path: 'system',
      children: [{
        name: '用户账号',
        icon: 'dashboard',
        path: 'list',
        children: [{
          name: '用户管理',
          path: 'user',
        }, {
          name: '账户管理',
          path: 'account',
        }, {
          name: '角色管理',
          path: 'role',
        }, {
          name: '测试',
          path: 'test',
        },
        ],
      }, {
        name: '部门管理',
        path: 'org',
      }, {
        name: '子页面',
        path: 'part3',
      }],
    },
  ],
  //  指令状态
  commandStatus: [
    { id: 1, value: 1, text: '未开始' },
    { id: 2, value: 2, text: '已完成' },
    { id: 3, value: 3, text: '执行中' },
  ],
  // 指令类型
  commandType: [
    { id: 1, value: 1, text: '指令' },
    { id: 2, value: 2, text: '通知' },
  ],
  // 短信发送状态
  msgStatus: [
    { id: 1, value: 0, text: '待确定' },
    { id: 2, value: 1, text: '待发送' },
    { id: 3, value: 2, text: '发送中' },
    { id: 4, value: 3, text: '发送失败' },
  ],
  // 短信规则 设备选择类型
  deviceSelectType: [
    { id: 1, value: 1, text: '部门+专业系统' },
    { id: 2, value: 2, text: '按资源' },
  ],
  // 短信规则 按部门
  byOrg: [
    { id: 1, value: 1, text: '全部门' },
    { id: 2, value: 2, text: '本部门' },
    { id: 3, value: 3, text: '指定部门' },
  ],
  // 短信规则 按专业系统
  byProfession: [
    { id: 1, value: 1, text: '全专业系统' },
    { id: 2, value: 2, text: '指定专业系统' },
  ],
  // 短信规则 报警类型
  byAlarmType: [
    { id: 1, value: 1, text: '全类型' },
    { id: 2, value: 2, text: '指定类型' },
  ],
  // 短信规则 资源类型
  byResouece: [
    { id: 1, value: 1, text: '全部资源' },
    { id: 2, value: 2, text: '指定资源' },
  ],
  // 数据权限 报警类型
  dataPowerByAlarmType: [
    { id: 1, value: 1, text: '全部' },
    { id: 2, value: 2, text: '报警' },
    { id: 3, value: 3, text: '故障' },
  ],
  // 预案管理 特征规则
  featureRuleList: [
    { id: 1, value: 'in', text: 'in' },
    { id: 2, value: '>', text: '>' },
    { id: 3, value: '<', text: '<' },
    { id: 4, value: '=', text: '=' },
    { id: 5, value: '<=', text: '<=' },
    { id: 6, value: '>=', text: '>=' },
  ],
};
export default { commonData };
