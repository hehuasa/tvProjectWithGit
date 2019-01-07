export const mapService={
  searchByAttr:(baseLayer,component,dispatch,searchText)=>{
      esriLoader.loadModules(
        [
          "esri/tasks/FindTask",
          "esri/tasks/FindParameters"
         ]).then(([FindTask, FindParameters])=>{

        //创建属性查询对象
        const findTask = new FindTask(baseLayer);
        //创建属性查询参数
        const findParams = new FindParameters();
        //返回几何信息
        findParams.returnGeometry = true;
        //对哪一个图层进行属性查询
        findParams.layerIds = [2, 3, 4, 5, 6, 7,8,9,10,11,12,13,14,15,16,17,18,19,20,21];
        //查询的字段
        findParams.searchFields = ["ObjCode"];
        findParams.searchText = searchText;
        //执行查询对象
        findTask.execute(findParams, ShowFindResult);

        function ShowFindResult(findTaskResult) {
          return new Promise(findTaskResult);
        }
      })
  }

};
