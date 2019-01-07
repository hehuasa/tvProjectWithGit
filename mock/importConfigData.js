
//导入配置页面假数据
const allTable=[
  {id:0,name:"用户表",propertys:[
      {id:"序号",en:"id"},
      {id:"账号",en:"account"},
      {id:"密码",en:"password"},
      {id:"姓名",en:"name"}
    ]},
  {id:1,name:"角色表",propertys:[
      {id:"序号",en:"id"},
      {id:"角色名",en:"name"},
      {id:"可用",en:"isValid"},
      {id:"等级",en:"level"}
    ]}
];

export  const getImportData={
  allTable:allTable
};
export default {getImportData}
