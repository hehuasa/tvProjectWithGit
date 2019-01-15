const imgArray = [
  { name: '可燃气体探测设备', sort: 0 },
  { name: '有毒气体探测设备', sort: 1 },
  { name: '感温探测器', sort: 2 },
  { name: '感烟探测器', sort: 3 },
  { name: '火焰探测器', sort: 4 },
  { name: '红外对射', sort: 5 },
  { name: '手动报警按钮', sort: 6 },
  { name: '环保在线仪表', sort: 7 },
  { name: '周界设备', sort: 8 },
  { name: '工业视频', sort: 9 },
  { name: '扩音对讲', sort: 10 },
  { name: '火炬', sort: 11 },
  { name: '门禁', sort: 12 },
  { name: '泡沫泵', sort: 13 },
  { name: '污水泵', sort: 14 },
  { name: '手提式', sort: 15 },
  { name: '推车式', sort: 16 },
  { name: '泡沫炮', sort: 17 },
  { name: '消防水泵', sort: 18 },
  { name: '消防炮', sort: 19 },
  { name: '消火栓', sort: 20 },
  { name: '重大危险源', sort: 21 },
  { name: '放射源', sort: 22 },
  { name: '呼吸机', sort: 23 },
  { name: '空气呼吸机', sort: 24 },
  { name: '默认设备', default: true },
];

const createList = () => {
  const mapLegendListWithAlarm = [];
  for (const item of imgArray) {
    const { name } = item;
    let index = 0;
    while (index < 5) {
      index += 1;
      const newName = name + index;
      try {
        const newItem = require(`../assets/map/lengend/${newName}.png`);
        if (newItem) {
          mapLegendListWithAlarm.push({ name: newName, url: newItem });
        }
      } catch (e) {

      }
    }
  }
  const cacheArray1 = [];
  const cacheArray2 = [];
  for (const iTem of imgArray) {
    const { name, sort } = iTem;
    try {
      const item = require(`../assets/map/lengend/${name}.png`);
      if (item) {
        const item1 = mapLegendListWithAlarm.find(value => value.name === name + 1);
        if (item1) {
          cacheArray1.push({ name, url: item, sort });
        } else {
          cacheArray2.push({ name, url: item, sort });
        }
      }
    } catch (e){}
  }
  const mapLegendList = cacheArray1.concat(cacheArray2);
  mapLegendList.sort((a, b) => {
    return a.sort - b.sort > 0 ? 1 : -1;
  });
  // 按颜色排个序
console.log('mapLegendListWithAlarm', mapLegendListWithAlarm);
  return { mapLegendList, mapLegendListWithAlarm };
};

const { mapLegendList, mapLegendListWithAlarm } = createList();
export { mapLegendList, mapLegendListWithAlarm };
