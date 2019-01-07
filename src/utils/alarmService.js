// 根据报警控制类型分类（水、电、气等）
export const groupingByType = (
  { list = {}, alarms }) => {
  const cacheList = list;
  for (const alarm of alarms) {
    if (alarm.alarmType) {
      if (cacheList[alarm.alarmType.profession]) {
        cacheList[alarm.alarmType.profession].push(alarm);
      } else {
        cacheList[alarm.alarmType.profession] = [];
        cacheList[alarm.alarmType.profession].push(alarm);
      }
    }
  }
  return cacheList;
};
// 根据区域类型分类
export const groupingByArea = (
  { list = {}, alarms = [] }) => {
  const newList = list;
  for (const alarm of alarms) {
    if (newList[alarm.areaName]) {
      newList[alarm.areaName].push(alarm);
    } else {
      newList[alarm.areaName] = [];
      newList[alarm.areaName].push(alarm);
    }
  }
  return newList;
};
// 根据报警总览类型分类
export const groupingByOverview = (
  { list = {}, alarms = [], para }
) => {
  const newList = list;
  newList.count = newList.count || { safetyCount: 0, envCount: 0, faultCount: 0 };
  newList.list = newList.list || [];
  for (const alarm of alarms) {
    const { alarmType } = alarm;
    if (alarmType) {
      const profession = alarmType.profession.substr(4, 3);
      if (alarm.areaGisCode) {
        switch (profession) {
          // 安全报警与
          case '101':
            if (para.showSafety) {
              newList.count.safetyCount += 1; newList.list.push(alarm);
            }
            break;
          case '102':
            if (para.showSafety) {
              newList.count.safetyCount += 1; newList.list.push(alarm);
            }
            break;
          case '103':
            if (para.showSafety) {
              newList.count.safetyCount += 1; newList.list.push(alarm);
            }
            break;
          // 环保报警
          case '301':
            if (para.showEnv) {
              newList.count.envCount += 1; newList.list.push(alarm);
            }
            break;
          case '901':
            if (para.showFault) {
              if (alarm.areaGisCode) {
                newList.count.faultCount += 1;
                newList.list.push(alarm);
              }
            }
            break;
          default: break;
        }
      }
    }
  }
  return newList;
};
