let mapData={};
let bgMapUrl = 'http://10.157.12.98:6080';
bgMapUrl = bgMapUrl + '/arcgis/rest/services/YX04/MapServer';
let FeatureLayers=[
  // {name:"乙烯冷区消防路线",id:"test",visible:false,url:bgMapUrl+"/0"},
  {name:"消防栓2",visible:false,url:bgMapUrl+"/1"},
  {name:"预案消防车",visible:false,url:bgMapUrl+"/2"},
  {name:"阀门",visible:false,url:bgMapUrl+"/3"},
  {name:"固定高压水炮",visible:false,url:bgMapUrl+"/4"},
  {name:"报警点",visible:false,url:bgMapUrl+"/5"},
  {name:"球形煤仓",visible:false,url:bgMapUrl+"/6"},
  {name:"阀门1",visible:false,url:bgMapUrl+"/7"},
  {name:"消防栓",visible:false,url:bgMapUrl+"/8"},
  {name:"预案消防水线",visible:false,url:bgMapUrl+"/9"},
  {name:"消防管线2",visible:false,url:bgMapUrl+"/10"},
  {name:"铁路",visible:false,url:bgMapUrl+"/11"},
  {name:"管道",visible:false,url:bgMapUrl+"/12"},
  {name:"装置",visible:false,url:bgMapUrl+"/13"},
  {name:"阀门2",visible:false,url:bgMapUrl+"/14"},
  {name:"房屋",visible:false,url:bgMapUrl+"/15"},
  {name:"罐组",visible:false,url:bgMapUrl+"/16"},
  {name:"道路面",visible:false,url:bgMapUrl+"/17"},
  {name:"消防队",visible:false,url:bgMapUrl+"/18"},
  {name:"厂区面",visible:false,url:bgMapUrl+"/19"},
  {name:"报警分区",visible:false,url:bgMapUrl+"/20"},
  {name:"设备",visible:false,url:bgMapUrl+"/21"}
];

export  default FeatureLayers
