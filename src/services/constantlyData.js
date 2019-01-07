export const constantlyModal = {};
// 应急事件需要轮训的ID
export const emgcIntervalInfo = {
  timeSpace: 30 * 1000, // 轮训时间间隔
  intervalIDs: [], // 整个事件需要轮训的函数
  infoRecord: [], // 所有阶段信息接报需要轮训的函数
  commondList: [], // 信息预警/启动/处理三个阶段的指令列表
  userPage: [], // 信息预警/启动/处理三个阶段的组织结构人员列表
};
