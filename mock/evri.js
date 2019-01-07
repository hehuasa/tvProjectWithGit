
// 表单假数据行（首页右侧）
const tableData = { name: '裂解',
  data: [{
    key: '1',
    colSpan: 4,
    type: '投入',
    materiel: '加氢尾油',
    monthPlan: 100,
    dayFinish: 10,
    monthFinish: 80,
    yield: 17.05,
    monthProcess: 80,
  }, {
    key: '2',
    type: '投入',
    materiel: '饱和液化气',
    monthPlan: 100,
    dayFinish: 10,
    monthFinish: 80,
    yield: 17.05,
    monthProcess: 80,
  }, {
    key: '3',
    type: '投入',
    materiel: '加氢尾油',
    monthPlan: 100,
    dayFinish: 10,
    monthFinish: 80,
    yield: 17.05,
    monthProcess: 80,
  }, {
    key: '4',
    type: '投入',
    materiel: '饱和液化气',
    monthPlan: 100,
    dayFinish: 10,
    monthFinish: 80,
    yield: 17.05,
    monthProcess: 80,
  }, {
    key: '5',
    type: '产出',
    materiel: '加氢尾油',
    monthPlan: 100,
    dayFinish: 10,
    monthFinish: 80,
    yield: 17.05,
    monthProcess: 80,
  }, {
    key: '6',
    type: '产出',
    materiel: '加氢尾油',
    monthPlan: 100,
    dayFinish: 10,
    monthFinish: 80,
    yield: 17.05,
    monthProcess: 80,
  }, {
    key: '7',
    type: '产出',
    materiel: '加氢尾油',
    monthPlan: 100,
    dayFinish: 10,
    monthFinish: 80,
    yield: 17.05,
    monthProcess: 80,
  }, {
    key: '8',
    type: '产出',
    materiel: '加氢尾油',
    monthPlan: 100,
    dayFinish: 10,
    monthFinish: 80,
    yield: 17.05,
    monthProcess: 80,
  },
  ] };
// 饼图假数据（首页右侧）
const barData = { name: '污水总排口',
  data: [
    {
      x: 'COD',
      y: 6,
    },
    {
      x: '氮氧',
      y: 12,
    },
    {
      x: 'PH',
      y: 16,
    },
    {
      x: '油',
      y: 19,
    }] };

export const getFakeMonitorData = (req, res) => {
  res.send({ code: 1001,
    data: {
      tableData,
      barData,
    },
  });
};
