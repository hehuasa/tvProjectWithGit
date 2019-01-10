
import moment from 'moment';
import { constantlyPanelModal, constantlyConditionCalc } from '../services/constantlyModal';

export const lineData = ({ list = { data: [], dot: [], target: [], dataName: [] }, line }) => {
  if (!line) {
    return list;
  }
  const obj = line.data;
  let dot = {};
  let target = {};
  let temp = {};
  let listTarget = {};
  // let gISCode = null;
  for (const item of Object.keys(obj)) {
    for (const key of obj[item]) {
      target[key.dataType] = [];
    }
    for (const key of obj[item]) {
      // gISCode = key.gISCode;
      const stringItem = `${item}`;
      temp.month = key.collectTime;
      temp[stringItem] = parseFloat(key.value);
      target[key.dataType].push(temp);
      listTarget[key.dataType] = key.dataTypeName;
      temp = {};
    }
    const stringItemCopy = `${item}`;
    dot[stringItemCopy] = target;
    // dot.visibility = true;
    list.data.push(dot);
    list.dot.push(stringItemCopy);
    target = {};
    dot = {};
  }
  // 显示10个点位
  // for (const item of list.data) {
  //   for (const obj of Object.keys(item)) {
  //     if (obj !== 'visibility') {
  //       for (const objChild of Object.keys(item[obj])) {
  //         item[obj][objChild].sort((a, b) => { return b.time - a.time; });
  //         item[obj][objChild].reverse();
  //         // for (const arr of item[obj][objChild].entries()) {
  //         //   arr[1].month = arr[0];
  //         // }
  //       }
  //     }
  //   }
  // }
  for (const name of Object.keys(listTarget)) {
    list.target.push(name);
    list.dataName.push(listTarget[name]);
  }
  dot = null;
  target = null;
  temp = null;
  listTarget = null;
  return list;
};

// 获取选择数据     queryLineData = 全部数据
export const getSelctData = ({ queryLineData = {} }) => {
  if (!queryLineData.lineRealData) {
    queryLineData.lineRealData = {};
    return queryLineData.lineRealData.data = [];
  }
  if (queryLineData.lineRealData.data.length === 0) {
    return queryLineData.lineRealData.data = [];
  }
  if (queryLineData.checkAll) {
    queryLineData.lineRealData.data.map((item) => {
      item.visibility = true;
    });
    return queryLineData.lineRealData.data;
  }
  queryLineData.lineRealData.data.map((item) => {
    // if (item.visibility === undefined) {
    //   item.visibility = true;
    // } else {
    for (const objItem of Object.keys(item)) {
      if (objItem !== 'visibility') {
        if (queryLineData.checkedList.indexOf(objItem) === -1) {
          item.visibility = false;
        } else {
          item.visibility = true;
        }
      }
      // }
    }
  });
  return queryLineData.lineRealData.data;
};

// 数组 转换 为曲线图数数据
export const objByArea = ({ data = { obj: {}, target: {} }, dataOll = [] }) => {

  let i = 0;
  let list = [];
  for (const item of dataOll) {
    if (item.visibility) {
      for (const k of Object.keys(item)) {
        if (k !== 'visibility') {
          for (const j of Object.keys(item[k])) {
            if (data.obj[j]) {
              // data.obj[j].push(item[k][j]);
              data.obj[j] = [...data.obj[j], ...item[k][j]]
            } else {
              // data.obj[j] = [];
              // data.obj[j].push(item[k][j]);
              data.obj[j] = item[k][j]
            }
          }
        }
      }
    }
  }

  for (const targetName of Object.keys(data.obj)) {
    data.obj[targetName].sort((a, b) => a.month - b.month)

    let currentTime = null; // 循环前一个时间
    let tempObj = {} // 组装的对象
    const mergeObj = []; // 存合并对象

    for (const item of data.obj[targetName].entries()) {
      if (currentTime === item[1].month) {

        for (const itemObj of Object.keys(item[1])) {
          if (itemObj !== "month") {
            tempObj[itemObj] = item[1][itemObj];
          }
        }

      } else {
        if (Object.keys(tempObj).length !== 0) {
          mergeObj.push(tempObj);
        }
        tempObj = {};
        for (const itemObj of Object.keys(item[1])) {
          tempObj[itemObj] = item[1][itemObj];
        }

        if (item[0] === data.obj[targetName].length - 1) {
          mergeObj.push(tempObj);
        }

      }
      currentTime = item[1].month;
    }

    data.target[targetName] = mergeObj;
  }
  return data;
};
// 曲线图需要的数据
export const newdatabyDataName = ({ list = [], newData = [] }) => {
  let trme = [];
  if (newData[0] &&newData[0][0]) {
    newData.map((item) => {
      for (const i of Object.keys(item[0])) {
        if (i !== 'month') { trme.push(i); }
      }
      list.push(trme);
      trme = [];
    });
  }
  trme = null;
  return list;
};
// 获取 columns
export const columnsList = ({ columns = [], combustibleGas }) => {
  if (combustibleGas.target) {
    columns.push({
      title: '位置',
      dataIndex: 'position',
      key: 'position',
      fixed: 'left',
      render: (text) => {
        if (!text) {
          return '';
        }
        return text.slice(text.indexOf('&') + 1);
      },
    });
    for (const item of combustibleGas.target.entries()) {
      columns.push({
        title: item[1],
        dataIndex: item[1],
        key: `target${item[0]}`,
      });
    }
  }
  return columns;
};
// 获取 list
export const dataSourceList = ({ newdata = [], combustibleGas }) => {
  if (combustibleGas.dot) {
    const selectData = combustibleGas.data;
    for (const name of combustibleGas.dot.entries()) {
      newdata.push({
        key: name[0],
        position: name[1],
      });
    }
    for (const item of selectData) {
      for (const obj of Object.keys(item)) {
        if (obj !== 'visibility') {
          for (const key of newdata) {
            if (key.position === obj) {
              for (const objChild of Object.keys(item[obj])) {
                key[objChild] = item[obj][objChild][0][obj];
              }
            }
          }
        }
      }
    }
  }
  return newdata;
};

// 获取实时数据
export const getRealData = (dispatch, type, panelBoardModel) => {
  // moment('2018-5-31 16:46:05').format('YYYY-MM-DD HH:mm:ss')
  // beginTime: moment().format('YYYY-MM-DD HH:mm:ss'),
  // endTime: moment().subtract(constantlyPanelModal[type].timeRange || 10, 'm').format('YYYY-MM-DD HH:mm:ss'),
  // constantlyData/getHistoryData
  // constantlyPanelModal[type].timeSpace = constantlyPanelModal[type].timeSpace || 3000;

  if (constantlyPanelModal && constantlyPanelModal[type] && constantlyPanelModal[type].resourceIDs) {
    let index = 0;
    const test = () => {
      // constantlyPanelModal[type].resourceIDs[index];
      dispatch({
        // type: 'constantlyData/getImmediateData',
        type: 'constantlyData/getHistoryData',
        payload: {
          resourceID: constantlyPanelModal[type].resourceIDs[index],
          type,
          endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
          beginTime: moment().subtract(constantlyPanelModal[type].timeRange || 10, 'm').format('YYYY-MM-DD HH:mm:ss'),
        },
      }).then(() => {
        const uniqueKey = constantlyPanelModal[type].uniqueKey = Math.random() * new Date().getTime();
        for (const activeKey of panelBoardModel.activeKeys) {
          if (activeKey.keys === type) {
            activeKey.uniqueKey = uniqueKey;
            dispatch({
              type: 'panelBoard/alterUniqueKey',
              payload: panelBoardModel.activeKeys,
            });
            break;
          }
        }

        const item = constantlyPanelModal[type].data[constantlyPanelModal[type].resourceIDs[index]];

        if (typeof item === 'object' && !isNaN(item.length) && item.length > 0) {
          dispatch({
            type: 'constantlyData/getConditionCalc',
            payload: {
              dataCode: item[0].dataCode,
              collectionName: item[0].collectionName,
              dataType: item[0].dataType,
            },
          }).then(() => {
            const uniqueKey1 = constantlyPanelModal[type].uniqueKey = Math.random() * new Date().getTime();
            for (const activeKey of panelBoardModel.activeKeys) {
              if (activeKey.keys === type) {
                activeKey.uniqueKey = uniqueKey1;
                dispatch({
                  type: 'panelBoard/alterUniqueKey',
                  payload: panelBoardModel.activeKeys,
                });
                break;
              }
            }
          })
        }

        index += 1
        if (index < constantlyPanelModal[type].resourceIDs.length) {
          test();
        }

      });
    }
    test();
    //   const queryRealTimeData = () => {
    //   }
    //   queryRealTimeData.prototype.test = (item) => {
    //     dispatch({
    //       // type: 'constantlyData/getImmediateData',
    //       type: 'constantlyData/getHistoryData',
    //       payload: {
    //         resourceID: item,
    //         type,
    //         endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    //         beginTime: moment().subtract(constantlyPanelModal[type].timeRange || 10, 'm').format('YYYY-MM-DD HH:mm:ss'),
    //       },
    //     }).then(() => {
    //       const uniqueKey = constantlyPanelModal[type].uniqueKey = Math.random() * new Date().getTime();
    //       for (const activeKey of panelBoardModel.activeKeys) {
    //         if (activeKey.keys === type) {
    //           activeKey.uniqueKey = uniqueKey;
    //           dispatch({
    //             type: 'panelBoard/alterUniqueKey',
    //             payload: panelBoardModel.activeKeys,
    //           });
    //           break;
    //         }
    //       }
    //       console.log(2, item)
    //     });
    // }
    //   constantlyPanelModal[type].resourceIDs.map((item) => {
    //     console.log(1, item)
    //     const a = new queryRealTimeData;
    //     a.test(item)
    //   });
  }
};

// 获取历史实时数据
export const getRealHistoryData = (dispatch, type, panelBoardModel, resourceID) => {
  // constantlyPanelModal[this.state.name].timeRange
  if (resourceID) {
    dispatch({
      type: 'constantlyData/getHistoryData',
      payload: {
        resourceID,
        type,
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        beginTime: moment().subtract(constantlyPanelModal[type].timeRange || 10, 'm').format('YYYY-MM-DD HH:mm:ss'),
      },
    }).then(() => {
      const uniqueKey = constantlyPanelModal[type].uniqueKey = Math.random() * new Date().getTime();
      for (const activeKey of panelBoardModel.activeKeys) {
        if (activeKey.keys === type) {
          activeKey.uniqueKey = uniqueKey;
          dispatch({
            type: 'panelBoard/alterUniqueKey',
            payload: panelBoardModel.activeKeys,
          });
          break;
        }
      }


    });
  }
};
