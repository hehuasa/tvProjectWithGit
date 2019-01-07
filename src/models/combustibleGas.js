// import { alarmList, clearTwinkle } from '../services/api';

export default {
  namespace: 'combustibleGas',

  state: {
    // indeterminate: false, // 判断是否已经被全选
    // checkAll: true, // 判断是否选择全部
    // plainOptions: ['点位1', '点位2', '点位3'],
    // checkedList: ['点位1', '点位2', '点位3'],
    refresh: {
      gas: {
        time: 1000 * 60 * 2, intervalID: '', resourceIDs: [], data: {
          IP21: [{
            "collectTime": 1526869533099,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526869533099,
            "description": "一氧化碳",
            "gISCode": "280",
            "dataCode": "280",
            "value": "30"
          }, {
            "collectTime": 1526871550346,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526871550346,
            "description": "一氧化碳",
            "gISCode": "280",
            "dataCode": "280",
            "value": "31"
          }, {
            "collectTime": 1526872569682,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526872569682,
            "description": "一氧化碳",
            "gISCode": "280",
            "dataCode": "280",
            "value": "32"
          }, {
            "collectTime": 1526888137296,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526888137296,
            "description": "一氧化碳",
            "gISCode": "280",
            "dataCode": "280",
            "value": "33"
          }, {
            "collectTime": 1526889137296,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526889137296,
            "description": "一氧化碳",
            "gISCode": "280",
            "dataCode": "280",
            "value": "34"
          }, {
            "collectTime": 1526890137296,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526890137296,
            "description": "一氧化碳",
            "gISCode": "280",
            "dataCode": "280",
            "value": "35"
          }, {
            "collectTime": 1526891137296,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526891137296,
            "description": "一氧化碳",
            "gISCode": "280",
            "dataCode": "280",
            "value": "36"
          }, {
            "collectTime": 1526892137296,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526892137296,
            "description": "一氧化碳",
            "gISCode": "280",
            "dataCode": "280",
            "value": "37"
          }, {
            "collectTime": 1526893137296,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526893137296,
            "description": "一氧化碳",
            "gISCode": "280",
            "dataCode": "280",
            "value": "38"
          }, {
            "collectTime": 1526894137296,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526894137296,
            "description": "一氧化碳",
            "gISCode": "280",
            "dataCode": "280",
            "value": "39"
          }, {
            "collectTime": 1526895137296,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526895137296,
            "description": "一氧化碳",
            "gISCode": "280",
            "dataCode": "280",
            "value": "40"
          }, {
            "collectTime": 1526896137296,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526896137296,
            "description": "一氧化碳",
            "gISCode": "280",
            "dataCode": "280",
            "value": "41"
          }, {
            "collectTime": 1526897137296,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526897137296,
            "description": "一氧化碳",
            "gISCode": "280",
            "dataCode": "280",
            "value": "42"
          },

          {
            "collectTime": 1526874581817,
            "systemCode": "IP21",
            "dataType": "CO，一氧化碳",
            "acceptTime": 1526874581817,
            "description": "{1}",
            "gISCode": "280",
            "dataCode": "280",
            "value": "11"
          }, {
            "collectTime": 1526876590857,
            "systemCode": "IP21",
            "dataType": "CO，一氧化碳",
            "acceptTime": 1526876590857,
            "description": "{1}",
            "gISCode": "280",
            "dataCode": "280",
            "value": "22"
          }
          ],
          IP22: [{
            "collectTime": 1526869533099,
            "systemCode": "IP22",
            "dataType": "CO",
            "acceptTime": 1526869533099,
            "description": "而氧化碳",
            "gISCode": "400",
            "dataCode": "400",
            "value": "40"
          }, {
            "collectTime": 1526871550346,
            "systemCode": "IP22",
            "dataType": "CO",
            "acceptTime": 1526871550346,
            "description": "而氧化碳",
            "gISCode": "400",
            "dataCode": "400",
            "value": "41"
          }, {
            "collectTime": 1526872569682,
            "systemCode": "IP22",
            "dataType": "CO",
            "acceptTime": 1526872569682,
            "description": "一氧化碳",
            "gISCode": "400",
            "dataCode": "400",
            "value": "42"
          }, {
            "collectTime": 1526888137296,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526888137296,
            "description": "一氧化碳",
            "gISCode": "400",
            "dataCode": "400",
            "value": "43"
          }, {
            "collectTime": 1526889137296,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526889137296,
            "description": "一氧化碳",
            "gISCode": "400",
            "dataCode": "400",
            "value": "44"
          }, {
            "collectTime": 1526890137296,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526890137296,
            "description": "一氧化碳",
            "gISCode": "400",
            "dataCode": "400",
            "value": "45"
          }, {
            "collectTime": 1526891137296,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526891137296,
            "description": "一氧化碳",
            "gISCode": "400",
            "dataCode": "400",
            "value": "46"
          }, {
            "collectTime": 1526892137296,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526892137296,
            "description": "一氧化碳",
            "gISCode": "400",
            "dataCode": "400",
            "value": "47"
          }, {
            "collectTime": 1526893137296,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526893137296,
            "description": "一氧化碳",
            "gISCode": "400",
            "dataCode": "400",
            "value": "48"
          }, {
            "collectTime": 1526894137296,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526894137296,
            "description": "一氧化碳",
            "gISCode": "400",
            "dataCode": "400",
            "value": "49"
          }, {
            "collectTime": 1526895137296,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526895137296,
            "description": "一氧化碳",
            "gISCode": "400",
            "dataCode": "400",
            "value": "50"
          }, {
            "collectTime": 1526896137296,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526896137296,
            "description": "一氧化碳",
            "gISCode": "400",
            "dataCode": "400",
            "value": "51"
          }, {
            "collectTime": 1526897137296,
            "systemCode": "IP21",
            "dataType": "CO",
            "acceptTime": 1526897137296,
            "description": "一氧化碳",
            "gISCode": "400",
            "dataCode": "400",
            "value": "52"
          },

          {
            "collectTime": 1526874581817,
            "systemCode": "IP22",
            "dataType": "CO，一氧化碳",
            "acceptTime": 1526874581817,
            "description": "{1}",
            "gISCode": "400",
            "dataCode": "400",
            "value": "30"
          }, {
            "collectTime": 1526876590857,
            "systemCode": "IP22",
            "dataType": "CO，一氧化碳",
            "acceptTime": 1526876590857,
            "description": "{1}",
            "gISCode": "400",
            "dataCode": "400",
            "value": "35"
          }
          ],
        }
      },
    },
    selectData: {
      data: [
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
      dot: ['点位1', '点位2', '点位3'],
      target: ['指标1', '指标2', '指标3'],
    },
    line: [
      { month: '1525597260000', Tokyo: 7.0, London: 3.9 },
      { month: '1525597360000', Tokyo: 6.9, London: 4.2 },
      { month: '1525597460000', Tokyo: 9.5, London: 5.7 },
      { month: '1525597560000', Tokyo: 14.5, London: 8.5 },
      { month: '1525597660000', Tokyo: 18.4, London: 11.9 },
      { month: '1525597760000', Tokyo: 21.5, London: 15.2 },
      { month: '1525597860000', Tokyo: 25.2, London: 17.0 },
      { month: '1525598560000', Tokyo: 26.5, London: 16.6 },
      { month: '1525598860000', Tokyo: 23.3, London: 14.2 },
      { month: '1525599060000', Tokyo: 18.3, London: 10.3 },
      { month: '1525599260000', Tokyo: 13.9, London: 6.6 },
      { month: '1525599560000', Tokyo: 9.6, London: 4.8 }
    ],
    // allLine: [line, line, line,]

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
