const monthPlan = 157510;
let monthOver = 0;
const dayParam = monthPlan / 31;
const days = 30; let day = 0;
let dayOverCount = 0;
const array = [];

while (day <= days) {
  day += 1;
  const params = Math.ceil(Math.random() > 0.5 ? Math.floor(Math.random() * (2000)) : Math.floor(Math.random() * (-2000)));
  const dayOver = dayParam + params;
  dayOverCount += Math.ceil(dayOver);
  monthOver += Math.ceil(dayParam);
  if (monthOver - dayOverCount > 6000) {
    dayOverCount += 12000;
  } else if (dayOverCount - monthOver > 6000) {
    dayOverCount -= 12000;
  }
  const item =
    {
      day,
      params,
      dayParam,
      equipmentProductInfoID: 1,
      equipmentName: '裂解',
      inOutType: '投入',
      rawName: '石脑油',
      monthPlan,
      dayOverCount,
      monthOver,
      yieldPre: null,
      monthPre: 80.4,
    };
  array.push(item);
}
const getTrendData = (req, res) => {
  res.send({
    code: 1001,
    data: array,
  });
};

export default { getTrendData };
