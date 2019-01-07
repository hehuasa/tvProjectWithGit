// 影像操作类
// 构造函数参数：divName，Div容器名称；flashUrl，Flash文件路径；flashCtrl，Flash控件标识；
import flash from '../../../../public/flash/TrueMapExplorer.swf';

class Vision {
  constructor(visionid, lng, lat, x, y, h,
    yaw, pitch, roll, address) {
    this.VisionID = visionid;
    this.Lon = lng;
    this.Lat = lat;
    this.X = x;
    this.Y = y;
    this.H = h;
    this.Yaw = yaw;
    this.Pitch = pitch;
    this.Roll = roll;
    this.Address = address;
  }
}
export default class TrueVision {
  constructor(divName, flashUrl, flashCtrl, SWFObject, reactDom) {
    this.DivName = divName;
    this.FlashUrl = flashUrl;
    this.FlashCtrl = flashCtrl;
    this.SWFObject = SWFObject;
    this.reactDom = reactDom;
  }

  // 初始化影像Flash控件
  initVision = function () {
    // 初始化影像控件并加载到指定容器
    // const so = new this.SWFObject(this.FlashUrl, this.FlashCtrl, '100%', '100%', '10.0.0', '#ffffff');
    // so.addParam('menu', 'false');
    // so.addParam('quality', 'high');
    // so.addParam('wmode', 'windows'); // opaque,windows,transparent
    // so.addParam('allowscriptaccess', 'always');
    // so.addParam('bgcolor', '#ffffff');
    // so.addParam('allowfullscreen', 'true');
    // so.setAttribute('id', this.FlashCtrl);
    // so.setAttribute('ref', this.FlashCtrl);
    // so.setAttribute('name', this.FlashCtrl);
    // so.setAttribute('align', 'middle');
    // so.write(this.DivName);
    this.Instance = this.getVisionCtrl();
  };
  // 获取影像控件
  getVisionCtrl = function () {
    // return this.reactDom.refs[this.FlashCtrl];
    return document.getElementById(this.FlashCtrl);
  };

  /* 影像功能 */
  // 注册加载失败回调函数
  registerMonitor = function (fnc) {
    this.Instance.registerMonitor(fnc);
  };
  // 注册影像移动和转动事件
  registerImageMoveEvent = function (fnc) {
    this.Instance.registerImageMoveEvent(fnc);
  };
  // 注册影像缩放事件
  registerImageZoomEvent = function (fnc) {
    this.Instance.registerImageZoomEvent(fnc);
  };

  // 获取当前影像信息
  // 返回值：Vision对象
  getVisionInfo = function () {
    const obj = this.Instance.getVisionInfo();
    const vision = new Vision();
    vision.VisionID = obj.StationID;
    vision.Lon = obj.X;
    vision.Lat = obj.Y;
    return vision;
  };

  // 取得当前影像类型
  // 返回值：整型值
  getVisionType = function () {
    return this.Instance.getVisionType();
  };

  // 设置当前影像类型
  // 参数说明：type，影像类别（见emum.js中VisionType）
  setVisionType = function (type) {
    this.Instance.setVisionType(type);
  };

  // 影像放大
  zoomIn = function () {
    this.Instance.zoomIn();
  };
  // 影像缩小
  zoomOut = function () {
    this.Instance.zoomOut();
  };

  // 根据影像ID调用实景影像
  // 参数说明：id，影像ID
  showVisionByID = function (id) {
    this.Instance.showVisionByID(id);
  };
  // 根据经纬度调用实景影像
  // 参数说明：lng，经度；lat，纬度
  showVisionByLngLat = function (lng, lat) {
    this.Instance.showVisionByLngLat(lng, lat);
  };
  // 调用拼接实景左侧影像
  showLeftVision = function () {
    this.Instance.showLeftVision();
  };
  // 调用拼接实景右侧影像
  showRightVision = function () {
    this.Instance.showRightVision();
  };
  // 浏览上一帧实景影像
  showPreVision = function () {
    this.Instance.showPreVision();
  };
  // 浏览下一帧实景影像
  showNextVision = function () {
    this.Instance.showNextVision();
  };
  // 开始向前连续播放
  startPlay = function () {
    this.Instance.startPlay();
  };
  // 停止自动播放
  stopPlay = function () {
    this.Instance.stopPlay();
  };

  // 调用反向影像
  showOppositeVision = function () {
    this.Instance.showOppositeVision();
  };
  // 按角度调整影像的显示
  // 参数说明：angle，偏移角度数
  showVisionByAngle = function (angle) {
    this.Instance.showVisionByAngle(angle);
  };

  // 显示影像UI
  showUI = function () {
    this.Instance.showUI();
  };
  // 影藏影像UI
  hiddenUI = function () {
    this.Instance.hiddenUI();
  };
  // 打开标注界面
  openPoiUI = function () {
    this.Instance.openPoiUI();
  };
  // 关闭标注界面
  closePoiUI = function () {
    this.Instance.closePoiUI();
  };
  // 打开测距界面
  openMeasureUI = function () {
    this.Instance.openMeasureUI();
  };
  // 关闭测距界面
  closeMeasureUI = function () {
    this.Instance.closeMeasureUI();
  };
  // 初始化Flash控件配置
  setConfig = function (config) {
    this.Instance.setConfig(config);
  };
  // init = this.initVision();
  // 影像实例
  //
  // 初始化影像Flash控件
}

// const TrueVision = function (divName, flashUrl, flashCtrl) {
//   this.DivName = divName;
//   this.FlashUrl = flashUrl;
//   this.FlashCtrl = flashCtrl;
//   // 初始化影像Flash控件
//   this.initVision();
//   // 影像实例
//   this.Instance = this.getVisionCtrl();
// };
/* 影像功能 */

// 影像类
// 构造函数参数说明：visionid，影像ID；
// lng，经度；lat，纬度；x，地方坐标X；y，地方坐标Y；h，高程；
// yaw，航向角；pitch，俯仰角；roll，翻滚角；address，地址

