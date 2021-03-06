import moment from 'moment';
import { Tooltip } from 'bizcharts';
import React from 'react';

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

export const toolTipTheme = {
  'g2-tooltip': { backgroundColor: '#090f25' },
  'g2-tooltip-title': {
    color: '#fff',
    fontSize: '18px',
  },
  'g2-tooltip-list-item': {
    color: '#fff',
    fontSize: '18px',
  },
  'g2-tooltip-marker': {
    width: '10px',
    height: '10px',
  },
};
export const axisTextStyle = {
  fill: '#fff', // 文本的颜色
  fontSize: '18', // 文本大小
  rotate: 0,
};
export const labelTextStyle = {
  fill: '#fff', // 文本的颜色
  fontSize: '18', // 文本大小
};
