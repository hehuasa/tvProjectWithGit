const getWeather = (req, res) => {
  res.send({
    code: 1001,
    data:
      // {
      //   weatherTitleThi: '/src/assets/header/sun1.png',
      //   weatherThiImg: '/src/assets/header/sun.png',
      //   temperature: '26',
      //   climate: '晴',
      //   humidity: '43',
      //   wind: '东风三级',
      //   quality: '良 87',
      //   pressure: '100',
      //   flowNum: 268.52,
      //   flow: 3860,
      //   water: 26.52,
      // }
      { "humidity": "45%", "temperature": "29.0000℃", "time": "2018-04-20 05:00:00", "weather": "0.0000", "windDrection": "142", "windSpeed": "3.4000米/秒", },
  });
};
export default {
  getWeather,
};
