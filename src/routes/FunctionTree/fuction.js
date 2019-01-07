// 资源树组装

export const ajaxDataFilter = (treeId, parentNode, responseData) => {
  if (typeof (responseData) === 'string') {
    responseData = { data: [] };
  }
  if (responseData && responseData.data) {
    if (responseData.data.length > 0 && responseData.data[0].sortIndex) {
      responseData.data.sort((a, b) => {
        return a.sortIndex - b.sortIndex;
      });
    }
    for (const node of responseData.data) {
      node.name = node.treeName;
      // 单选节点
      if (node.checkClickFunTemplate === 'StatusGraphics' || node.checkClickFunTemplate === 'EnvMonitor' || node.checkClickFunTemplate === 'DeviceMonitor') {
        node.nocheck = true;
      }
      //  继承图层信息,treeType属性
      if (parentNode) {
        node.treeType = node.treeType || parentNode.treeType;
        if (node.resResourceTreeMapLayers === undefined || node.resResourceTreeMapLayers === null || node.resResourceTreeMapLayers.length === 0) {
          node.resResourceTreeMapLayers = parentNode.resResourceTreeMapLayers;
        }
      }
      if (parentNode != null) {
        node.loadResource = node.loadResource || parentNode.loadResource;
        node.treeID = node.treeID || parentNode.treeID;
        node.parentOrgCode =
          node.orgCode ||
          node.orgnizationCode ||
          parentNode.orgCode ||
          parentNode.orgnizationCode ||
          parentNode.parentOrgCode;
      }
      node.leftClickFunTemplate = node.leftClickFunTemplate ? node.leftClickFunTemplate : (parentNode ? parentNode.leftClickFunTemplate : '');
      // 判断树节点类型
      node.chkDisabled = (Number(node.haveCheckBox) === 0);
      switch (Number(node.treeType)) {
        case 1: // 专题图层
          node.isParent = true;
          break;
        case 2: // 专题图层--子级
          node.isParent = false;
          break;
        case 3: // 资源图层
          node.isParent = true;
          break;
        case 4: // 区域图元
          node.isParent = true;
          break;
        case 5: // 资源图元
          node.isParent = false;
          node.chkDisabled = true;
          break;
        case 6: // 看板
          node.isParent = false;
          break;
        case 7: // 图层
          node.isParent = false;
          break;
        default: break;
      }
    }
  }
  return responseData.data;
};

