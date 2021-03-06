import React, { PureComponent } from 'react';
import { Menu } from 'antd';
import { connect } from 'dva';
import esriLoader from 'esri-loader';
import styles from './index.less';
import btn1 from '../../../assets/map/rightBtn1.png';
import btn2 from '../../../assets/map/rightBtn2.png';

// const mapStateToProps = ({ map }) => {
//   return {
//     position: map.contextPosition,
//     searchDeviceArray: map.searchDeviceArray,
//     centerRadius: map.centerRadius,
//   };
// };
export default class ContextMenu extends PureComponent {
    contextMenu = ({ key }) => {
      const { dispatch, screenPoint, mapPoint } = this.props;
      switch (key) {
        case '0':
          dispatch({
            type: 'map/trueMapShow',
            payload: true,
          });
          break;
        case '4':
          dispatch({
            type: 'mapRelation/setSpaceQuery',
            payload: { load: true, show: true, style: { left: screenPoint.x, top: screenPoint.y }, point: mapPoint, screenPoint },
          });
          break;
        default: break;
      }
      dispatch({
        type: 'map/contextMenu',
        payload: { show: false },
      });
    };
    render() {
      const { top, left } = this.props.position;
      return (
        <Menu style={{ top, left }} className={styles['context-menu']} onClick={this.contextMenu}>
          <Menu.Item key="0" className={styles.item}>
            <span className={styles.img}><img src={btn1} alt="实景" /></span><span>该点位实景</span>
          </Menu.Item>
          <Menu.Item key="4" className={styles.item}>
            <span className={styles.img}><img src={btn2} alt="查询周边" /></span><span>查询周边</span>
          </Menu.Item>
        </Menu>
      );
    }
}
{ /* <Menu style={{ top, left }} className={styles['context-menu']}> */ }
{ /* <Menu.Item key="0" className={styles.item}> */ }
{ /* <span className={styles.img}><img src={btn1} alt="实景" /></span><span>该点位实景</span> */ }
{ /* </Menu.Item> */ }
{ /* <Menu.Item key="4" className={styles.item}> */ }
{ /* <span className={styles.img}><img src={btn2} alt="查询周边" /></span><span>查询周边</span> */ }
{ /* </Menu.Item> */ }
{ /* </Menu> */ }
// const ContextMenu = ({ position, dispatch, map, searchDeviceArray, clickPoint, perimeter, layerIds, centerRadius }) => {
//   const { show, top, left } = position;
//   this.entries = searchDeviceArray.entries();
//   const contextMenu = ({ key }) => {
//     switch (key) {
//       // case '1': startBreathAnimation(); break;
//       // case '2': flowing(); break;
//       case '0':
//         dispatch({
//           type: 'map/mapPoint',
//           payload: clickPoint,
//         });
//         dispatch({
//           type: 'map/trueMapShow',
//           payload: true,
//         });
//         break;
//       case '4':
//         perimeter(map, clickPoint, layerIds, centerRadius, dispatch);
//         break;
//       default: break;
//     }
//     dispatch({
//       type: 'map/contextMenu',
//       payload: { show: false },
//     });
//   };
//   return (
//     show ? (
//       <Menu style={{ top, left }} className={styles['context-menu']} onClick={contextMenu}>
//         <Menu.Item key="0" className={styles.item}>
//           <span className={styles.img}><img src={btn1} alt="实景" /></span><span>该点位实景</span>
//         </Menu.Item>
//         <Menu.Item key="4" className={styles.item}>
//           <span className={styles.img}><img src={btn2} alt="查询周边" /></span><span>查询周边</span>
//         </Menu.Item>
//         {/* <Menu.Divider /> */}
//         {/* <Menu.Item key="1" className={styles.item}> */}
//         {/* <span>呼吸灯</span> */}
//         {/* </Menu.Item> */}
//         {/* <Menu.Divider /> */}
//         {/* <Menu.Item key="2" className={styles.item}> */}
//         {/* <span>管道流动</span> */}
//         {/* </Menu.Item> */}
//       </Menu>
//     ) : null
//   );
// };
// export default connect(mapStateToProps)(ContextMenu);
/*
 * 呼吸灯动画函数
 * startBreathAnimation：搜索设备，然后执行breathAnimation
 * breathAnimation:开始执行动画
 */
// const breathAnimation = () => {
//   const device = that.entries.next();
//   if (device.done) {
//     searchText += 1;
//     startBreathAnimation();
//   } else { // 执行动画
//     const animatePosition = map.toScreen(device.value[1].feature.geometry);// 转换为屏幕坐标
//     dispatch({
//       type: 'map/breath',
//       payload: { x: animatePosition.x, y: animatePosition.y, show: true },
//     }).then(() => { // 停止动画
//       setTimeout(() => {
//         dispatch({
//           type: 'map/breath',
//           payload: { show: false },
//         }).then(() => { // 循环
//           searchText += 1;
//           breathAnimation();
//         });
//       }, 2000);
//     });
//   }
// };
// const startBreathAnimation = () => {
//   // 搜索设备
//   dispatch({
//     type: 'map/searchDeviceByAttr',
//     payload: { baseLayer: 'http://192.168.0.5:6080/arcgis/rest/services/ZCDT01/MapServer', searchText },
//   }).then(() => { // 遍历设备数组，切换为屏幕坐标，若遍历完成重新执行搜索函数
//     breathAnimation();
//   });
// };
// /*
//  *flowing:流水动画
//  */
// const flowing = () => {
//   esriLoader.loadModules([
//     'esri/layers/GraphicsLayer', 'esri/SpatialReference', 'esri/symbols/SimpleMarkerSymbol',
//     'esri/geometry/Polyline', 'esri/symbols/SimpleLineSymbol', 'esri/graphic',
//     'esri/geometry/Point', 'esri/geometry/webMercatorUtils', 'esri/symbols/PictureMarkerSymbol',
//     'esri/symbols/PictureFillSymbol', 'esri/geometry/Polygon', 'esri/Color',
//   ]).then(
//     ([GraphicsLayer, SpatialReference, SimpleMarkerSymbol, Polyline, SimpleLineSymbol, Graphic, Point, webMercatorUtils, PictureMarkerSymbol, PictureFillSymbol, Polygon, Color]) => {
//       // 创建客户端图层
//       const graphicsLayer = new GraphicsLayer();
//       // 将客户端图层添加到地图中
//       map.addLayer(graphicsLayer);
//
//       // 新建一条路径线路
//       const pathDemo = [
//         [[[114.53198617538993, 30.640739975313604], [114.53552876586788, 30.64315395289592], [114.53148456965855, 30.64497227367221],
//           [114.52856898634484, 30.641899938567445], [114.5340239486737, 30.638921654537313], [114.53894595491298, 30.641586434985324],
//           [114.53935350956974, 30.64218209179135], [114.5390086556294, 30.642244792507775], [114.53910270670404, 30.64233884358241],
//           [114.53835029810696, 30.64218209179135], [114.53891460455478, 30.640583223522544], [114.53913405706226, 30.642746398239165],
//           [114.53803679452484, 30.642119391074928], [114.54289610004768, 30.644564719015456], [114.54198693965954, 30.64478417152294],
//           [114.54088967712212, 30.638764902746253], [114.54543547906285, 30.641053478895724],
//           [114.54831971201834, 30.63951731134334], [114.54314690291338, 30.645160375821483], [114.54264529718199, 30.645191726179696]]],
//       ];
//       const polylineJson = {
//         paths: pathDemo[0],
//         spatialReference: { wkid: 4326 },
//       };
//       const polyline = new Polyline(polylineJson);
//       const simpleLineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new esri.Color([0, 255, 0]), 3);
//       const lineGraphic = new Graphic(polyline, simpleLineSymbol);
//       graphicsLayer.add(lineGraphic);
//
//       let speed = 0.00002;// 水流移动速度
//       // 新建水流点(水流由数个点组成)
//       const water = [];
//       const symbol = new SimpleMarkerSymbol(
//         SimpleMarkerSymbol.STYLE_SQUARE, 3,
//         new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
//           new Color([0, 0, 0, 0.2]), 1),
//         new Color([0, 0, 0, 0.2])
//       );
//       const createPoint = () => {
//         if (water.length === 100) return false;
//         const waterPoint = {
//           start: 0,
//           end: 1,
//           point: new Point(polylineJson.paths[0][0], new SpatialReference({ wkid: 4326 })),
//           waterGraphic: new Graphic(waterPoint, symbol),
//         };
//         water.push(waterPoint);
//         graphicsLayer.add(waterPoint.waterGraphic);
//       };
//       const points = polylineJson.paths[0];
//       let moving;
//       // 移动的方法函数
//       function move() {
//         for (const waterPoint of water) {
//           if (waterPoint.end >= points.length) {
//             return false;
//           }
//           // 每个水流点的起始点位，以及起始点位之间的斜率
//           const startPoint = points[waterPoint.start];
//           const endPoint = points[waterPoint.end];
//           waterPoint.x1 = startPoint[0];
//           waterPoint.y1 = startPoint[1];
//           waterPoint.x2 = endPoint[0];
//           waterPoint.y2 = endPoint[1];
//           waterPoint.p = (waterPoint.y2 - waterPoint.y1) / (waterPoint.x2 - waterPoint.x1);// 斜率
//         }
//
//         moving = setInterval(() => {
//           for (const waterPoint of water) {
//             // 分别计算 x,y轴方向速度
//             if (Math.abs(waterPoint.p) === Number.POSITIVE_INFINITY) { // 无穷大
//               waterPoint.point.y += speed;
//             } else {
//               if (waterPoint.x2 < waterPoint.x1) {
//                 waterPoint.point.x -= (1 / Math.sqrt(1 + waterPoint.p * waterPoint.p)) * speed;
//                 waterPoint.point.y -= (waterPoint.p / Math.sqrt(1 + waterPoint.p * waterPoint.p)) * speed;
//               } else {
//                 waterPoint.point.x += (1 / Math.sqrt(1 + waterPoint.p * waterPoint.p)) * speed;
//                 waterPoint.point.y += (waterPoint.p / Math.sqrt(1 + waterPoint.p * waterPoint.p)) * speed;
//               }
//               // 计算角度
//               const tan = Math.atan(Math.abs((waterPoint.y2 - waterPoint.y1) / (waterPoint.x2 - waterPoint.x1))) * 180 / Math.PI;
//
//               waterPoint.waterGraphic.symbol.setAngle(CalulateXYAnagle(waterPoint.x1, waterPoint.y1, waterPoint.x2, waterPoint.y2, tan)); // //(Math.PI / 2 - Math.atan(p)) * 180 / Math.PI
//               // symbol.angle = CalulateXYAnagle(waterPoint.x1, waterPoint.y1, x2, y2, tan)
//             }
//             // waterPoint.waterGraphic.setSymbol(symbol);
//             waterPoint.waterGraphic.setGeometry(waterPoint.point);
//             // 转角时降低速度，纠正坐标误差
//             if (Math.abs(waterPoint.waterGraphic.geometry.x - waterPoint.x2) <= 0.000002 && Math.abs(waterPoint.waterGraphic.geometry.y - waterPoint.y2) <= 0.000002) {
//               speed = 0.000005;
//             } else {
//               speed = 0.00002;
//             }
//
//             // 图层刷新
//             if (Math.abs(waterPoint.waterGraphic.geometry.x - waterPoint.x2) <= speed && Math.abs(waterPoint.waterGraphic.geometry.y - waterPoint.y2) <= speed) {
//               clearInterval(moving);
//               waterPoint.start++;
//               waterPoint.end++;
//               if (waterPoint.end < points.length) {
//                 console.log(`第${waterPoint.start}次转弯`);
//                 move();
//               } else {
//                 clearInterval(moving);
//               }
//             }
//           }
//           if (water.length < 100) {
//             createPoint();
//             graphicsLayer.remove(water[0].waterGraphic);// 删掉第一个点，因为有间隙
//             clearInterval(moving);
//             move();
//             return false;
//           }
//         }, 1);
//       }
//
//       // 计算消偏移角度
//       function CalulateXYAnagle(startx, starty, endx, endy, tan) {
//         tan = Math.atan(Math.abs((endy - starty) / (endx - startx))) * 180 / Math.PI;
//
//         if (endx > startx && endy > starty)// 第一象限
//         {
//           tan = -tan;
//         } else if (endx < startx && endy > starty)// 第二象限
//         {
//           tan = tan;
//         } else if (endx < startx && endy < starty)// 第三象限
//         {
//           tan = -tan;
//         } else// 第四象限
//         {
//           tan += 90;
//         }
//         return tan;
//       }
//
//       // setTimeout(function () {
//       move(0, 1);
//       // }, 50);
//     });
// };
