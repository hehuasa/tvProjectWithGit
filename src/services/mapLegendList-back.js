const imgArray = [
  '1-放射源',
  '8-感温探测器',
  '9-感烟探测器',
  '14-工业视频',
  '15-扩音对讲',
  '10-红外对射',
  '6-呼吸机',
  '23-火炬',
  '13-可燃气体探测设备',
  '11-火焰探测器',
  '7-空气呼吸机',
  '16-门禁',
  '17-泡沫泵',
  '18-泡沫炮',
  '12-手动报警按钮',
  '19-手提式',
  '20-推车式',
  '21-污水泵',
  '5-消防水泵',
  '4-消防水炮',
  '3-消火栓',
  '22-有毒气体',
  '2-重大危险源',
];

const sorting = (name) => {
  const index = name.indexOf('-');
  return Number(name.substring(0, index));
};
const createList = () => {
  const array = [];
  const newArray = [];
  imgArray.sort((a, b) => {
    return sorting(a) - sorting(b);
  });
  for (const name of imgArray) {
    const index = name.indexOf('-') + 1;
    const newName = name.substring(index);
    newArray.push(newName);
  }
  for (const name of newArray) {
    const item = require(`../assets/map/lengend/${name}.png`);
    array.push({ name, url: item });
  }
  return array;
};

const mapLegendList = createList();

export { mapLegendList };
