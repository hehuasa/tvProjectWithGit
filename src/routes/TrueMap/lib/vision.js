// 影像实例对象
let truevision = null;
// 当前可视区域高度
const divHeight = document.documentElement.clientHeight;
// 当前可视区域宽度
const divWidth = document.documentElement.clientWidth;
// 页面加载时执行
function onLoad() {
  // 实例化影像控件类
  truevision = new TrueVision('flashContent', '../trueVision/flash/TrueMapExplorer.swf', 'TME');
}
// Flash控件加载完成时调用
function FlashInitEnd() {
  // 初始化Flash控件配置
  truevision.setConfig('../TrueVision/config.xml');
  // 注册影像移动和转动时候的回调函数
  truevision.registerImageMoveEvent('moveImage');
  // 注册影像缩放时的回调函数
  truevision.registerImageZoomEvent('zoomImage');
  if (typeof initLayout === 'function') {
    // 设置页面布局【上面显示影像，下面显示地图】
    initLayout();
  }
}


// 影像移动或转动时调用，改变地图上猴子状态
function moveImage(angle) {
  if (typeof getFlash !== 'undefined') {
    getFlash().TVchangeRotation(angle);
  } else if (typeof parent.pMap.getFlash !== 'undefined') {
    parent.pMap.getFlash().TVchangeRotation(angle);
  }
}
// 影像缩放时调用，改变地图上猴子状态
function zoomImage(range) {
  if (typeof getFlash !== 'undefined') {
    getFlash().TVchangeRotationRange(range);
  } else if (typeof parent.pMap.getFlash !== 'undefined') {
    parent.pMap.getFlash().TVchangeRotationRange(range);
  }
}
// Flash配置完成时，显示UI
function ConfigLoadEnd() {
  truevision.showUI();
}
// 站点变换事件[在这里调用画点功能]
function TVImageLoadEnd() {
  const info = truevision.getVisionInfo();
  const lon = info.Lon;
  const lat = info.Lat;
  const yaw = info.Yaw;
  parent.pMap.TVchangeLatLng(lon, lat);
  parent.TopFrame.setVisionInput(info.VisionID);
}
function goAPI() {
  parent.location.href = '../help/index.htm';
}

window.onload = function () {
  document.getElementById('flashContent').style.width = `${document.documentElement.clientWidth}px`;
  document.getElementById('flashContent').style.height = `${document.documentElement.clientHeight}px`;
  onLoad();
};
window.onresize = function () {
  document.getElementById('flashContent').style.width = `${document.documentElement.clientWidth}px`;
  document.getElementById('flashContent').style.height = `${document.documentElement.clientHeight}px`;
};
