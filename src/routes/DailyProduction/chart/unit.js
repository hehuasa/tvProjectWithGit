import moment from 'moment';

// 一个月的时间单位（数组）
export const getDatesData = (dateTimes) => {
  const array = [];
  const days = Number(moment(dateTimes).daysInMonth()); // 本月有多少天
  let index = 0;
  let day = moment(dateTimes).endOf('month');
  while (index < days) {
    day = moment(day).subtract(1, 'days');
    array.push(day.format('l'));
    index += 1;
  }
  return array;
};
// 一个月有多少天

export const getMonthDayNums = (dateTimes) => {
  const curMonth = dateTimes.getMonth();
  dateTimes.setMonth(curMonth + 1);
  dateTimes.setDate(0);
  return dateTimes.getDate();
};
