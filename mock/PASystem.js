const getLists = () => {
  const array = [];
  const start = 16120; const end = 16133;
  let index = start;
  while (index <= end) {
    array.push({
      gisCode: index,
      paType: { smoke: Math.random() > 0.9, gas: Math.random() > 0.9, fire: Math.random() > 0.9, evacuate: Math.random() > 0.9 },
    });
    index += 1;
  }
  return array;
};

const array = getLists();
const fetchPASystem = (req, res) => {
  res.send({
    code: 1001,
    data: array,
  });
};
const changePASystem = (req, res) => {
  const { body } = req;
  const index = array.findIndex(value => value.gisCode === Number(body.areaId));
  if (index !== -1) {
    array[index].paType[body.type] = (body.value === 'true');
  }
  res.send({
    code: 1001,
    data: [...array],
  });
};
export default {
  fetchPASystem,
  changePASystem,
};
