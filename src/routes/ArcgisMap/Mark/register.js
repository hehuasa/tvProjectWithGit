import { PureComponent } from 'react';
// import Canvas from '@antv/g';
import { generateMixed, getStrLength } from '../../../utils/utils';
import jiuhu from '../../../assets/map/mark/jiuhu.png';
import wuzi from '../../../assets/map/mark/wuzhi.png';
import xiaofang from '../../../assets/map/mark/xiaofang.png';
import dP from '../../../assets/map/mark/医生.png';
import nP from '../../../assets/map/mark/护士.png';
import cP from '../../../assets/map/mark/警察.png';
import fP from '../../../assets/map/mark/消防人员.png';

const colorObj = {
  fill: '#fff',
  stroke: 'red',
};
const dragImg = [
  { id: 'jiuhu', name: '救护车', src: jiuhu },
  { id: 'wuzi', name: '物资车', src: wuzi },
  { id: 'xiaofang', name: '消防车', src: xiaofang },
  { id: '医生', name: '医生', src: dP },
  { id: '护士', name: '护士', src: nP },
  { id: '警察', name: '警察', src: cP },
  { id: '消防人员', name: '消防人员', src: fP },
];
const auxiliaryColor0 = 'rgba(0, 0, 0, 0)';
const auxiliaryColor1 = 'rgba(0, 0, 0, .8)';
const resgisterAuxiliary = ({ group, rectWidth, rectHeight, auxiliaryColor }) => {
  // 辅助形， 用于辅助改变size
  const size = 8;
  group.addShape('rect', {
    attrs: {
      x: 0 - size / 2,
      y: 0 - size / 2,
      width: size,
      height: size,
      fill: auxiliaryColor,
      stroke: auxiliaryColor,
      isAuxiliary: true,
    },
  });
  group.addShape('rect', {
    attrs: {
      x: 0 + rectWidth - size / 2,
      y: 0 - size / 2,
      width: size,
      height: size,
      fill: auxiliaryColor,
      stroke: auxiliaryColor,
      isAuxiliary: true,
    },
  });
  group.addShape('rect', {
    attrs: {
      x: 0 + rectWidth - size / 2,
      y: 0 + rectHeight - size / 2,
      width: size,
      height: size,
      fill: auxiliaryColor,
      stroke: auxiliaryColor,
      isAuxiliary: true,
    },
  });
  group.addShape('rect', {
    attrs: {
      x: 0 - size / 2,
      y: 0 + rectHeight - size / 2,
      width: size,
      height: size,
      fill: auxiliaryColor,
      stroke: auxiliaryColor,
      isAuxiliary: true,
    },
  });
};
const judge = (x, y, box, model, auxiliarySize) => {
  const { maxX, maxY, minX, minY } = box;
  const obj = [
    { x: [minX - auxiliarySize.x, minX + auxiliarySize.x], y: [minY - auxiliarySize.y, minY + auxiliarySize.y] },
    { x: [maxX - auxiliarySize.x, maxX + auxiliarySize.x], y: [minY - auxiliarySize.y, minY + auxiliarySize.y] },
    { x: [maxX - auxiliarySize.x, maxX + auxiliarySize.x], y: [maxY - auxiliarySize.y, maxY + auxiliarySize.y] },
    { x: [minX - auxiliarySize.x, minX + auxiliarySize.x], y: [maxY - auxiliarySize.y, maxY + auxiliarySize.y] },
  ];
  return obj.findIndex(value => value.x[0] < x && value.x[1] > x && value.y[0] < y && value.y[1] > y);
};

class G6Register extends PureComponent {
  registerBehaviour(G6) {
    G6.registerBehaviour('add', (graph) => {
      graph.behaviourOn('click', (ev) => {
        const { x, y } = ev;
        const { createNode } = this.state;
        const { fill, stroke } = colorObj;
        const id = generateMixed(8);
        switch (createNode.type) {
          // 线
          case 'line':
            this.graph.add('node', {
              points: [[x, y], [x, y]],
              id,
              stroke,
              circleColor: 'rgba(0,0,0,0)',
              layerType: this.state.layerValue,
              shape: 'customLine',
            });
            this.setState({ currenLineId: id }, () => {
              this.graph.changeMode('addCustomLine');
            });
            break;
          // 线
          case 'polyLine':
            this.graph.add('node', {
              points: [[x, y], [x, y]],
              id,
              stroke,
              circleColor: 'rgba(0,0,0,0)',
              layerType: this.state.layerValue,
              shape: 'custom_PolyLine',
            });
            this.setState({ currenLineId: id }, () => {
              this.graph.changeMode('addCustomPolyLine');
            });
            break;
            // 圆形 addCustomLine
          case 'circle':
            this.graph.add('node', {
              x: ev.x,
              y: ev.y,
              fill,
              stroke,
              r: 20,
              width: 40,
              height: 40,
              layerType: this.state.layerValue,
              auxiliaryColor: auxiliaryColor0,
              shape: 'customCircle',
            });
            break;
            // 矩形
          case 'box':
            this.graph.add('node', {
              x: ev.x,
              y: ev.y,
              fill,
              stroke,
              width: 40,
              height: 40,
              layerType: this.state.layerValue,
              auxiliaryColor: auxiliaryColor0,
              shape: 'customBox',
            });
            break;
            // 文字
          case 'text':
            this.graph.add('node', {
              x: ev.x,
              y: ev.y,
              fill,
              textFill: '#333',
              id,
              stroke,
              height: 30,
              text: '',
              layerType: this.state.layerValue,
              auxiliaryColor: auxiliaryColor0,
              shape: 'customTextBox',
            });
            this.setState({ currentTextId: id, modalVisible: true });
            break;
            // 多边形
          case 'polygon':
            this.graph.add('node', {
              x: ev.x,
              y: ev.y,
              fill,
              stroke,
              width: 40,
              height: 40,
              layerType: this.state.layerValue,
              auxiliaryColor: auxiliaryColor0,
              shape: 'customPolygon',
            });
            break;
            // 箭头
          // case 'arrow':
          //   this.graph.add('node', {
          //     x: ev.x,
          //     y: ev.y,
          //     fill: '#fff',
          //     stroke,
          //     r: 20,
          //     width: 80,
          //     height: 32,
          //     layerType: this.state.layerValue,
          //     auxiliaryColor: auxiliaryColor0,
          //     shape: 'customArrow',
          //   });
          //   break;
          case 'flag':
            this.graph.add('node', {
              x: ev.x,
              y: ev.y,
              fill1: '#cf3f3b',
              fill2: '#1a2227',
              fill3: '#3d5866',
              fill4: '#dc7650',
              id,
              layerType: this.state.layerValue,
              auxiliaryColor: auxiliaryColor0,
              shape: 'customFlag',
            });
            break;
            // 曲线箭头
          case 'arrow':
            {
              const sourceId = generateMixed(8);
              const targetId = generateMixed(8);
              const edgeId = generateMixed(8);
              this.graph.add('node', {
                x,
                y,
                id: sourceId,
                fill: 'rgba(0,0,0,0)',
                stroke: 'rgba(0,0,0,0)',
                type: 'start',
                layerType: this.state.layerValue,
                auxiliaryColor: auxiliaryColor0,
                shape: 'arrowCircle',
              });
              this.graph.add('node', {
                x: x + 100,
                y: y - 100,
                id: targetId,
                fill: 'rgba(0,0,0,0)',
                stroke: 'rgba(0,0,0,0)',
                type: 'end',
                layerType: this.state.layerValue,
                auxiliaryColor: auxiliaryColor0,
                shape: 'arrowCircle',
              });
              this.graph.add('edge', {
                id: edgeId,
                source: sourceId,
                ct: { x: x + 50, y: y - 50 },
                stroke,
                layerType: this.state.layerValue,
                target: targetId,
                shape: 'quadraticArrow',
              });
              this.setState({ currentArrow: { sourceId, targetId, edgeId } });
              this.graph.changeMode('editQuadratic');
            }
            break;
          // 折线箭头
          case 'arrowWithPolyLine':
            this.graph.add('node', {
              points: [[x, y], [x, y]],
              id,
              stroke,
              lineWidth: 2,
              circleColor: 'rgba(0,0,0,0)',
              layerType: this.state.layerValue,
              shape: 'custom_ArrowWithPolyLine',
            });
            this.setState({ currenLineId: id }, () => {
              this.graph.changeMode('addCustomPolyLine');
            });
            break;
            // 图片
          default:
            this.graph.add('node', {
              x: ev.x,
              y: ev.y,
              img: dragImg.find(value => value.id === createNode.type).src,
              width: 130,
              height: 60,
              layerType: this.state.layerValue,
              auxiliaryColor: auxiliaryColor0,
              shape: 'customImg',
            });
            break;
        }
        if (createNode.type !== 'line' && createNode.type !== 'arrow' && createNode.type !== 'polyLine' && createNode.type !== 'arrowWithPolyLine') {
          this.graph.changeMode('default');
        }
        this.setState({ createNode: { type: '' } });
      }
      );
    });
    // 拖拽行为 drag
    G6.registerBehaviour('drag', (graph) => {
      let node;
      let dx;
      let dy;
      graph.behaviourOn('node:dragstart', (ev) => {
        const { item } = ev;
        const model = item.getModel();
        node = item;
        dx = model.x - ev.x;
        dy = model.y - ev.y;
      });
      graph.behaviourOn('node:drag', (ev) => {
        node && graph.update(node, {
          x: ev.x + dx,
          y: ev.y + dy,
        });
      });
      graph.behaviourOn('node:dragend', () => {
        node = undefined;
      });
    });
    // 编辑行为 edit
    G6.registerBehaviour('edit', (graph) => {
      let isIn;
      const origin = {
        dx: 0,
        dy: 0,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        item: null,
      };
      graph.behaviourOn('node:dragstart', (ev) => {
        const { item, x, y } = ev;
        if (item) {
          // 判断是否在resizeNode的节点上
          const model = item.getModel();
          const box = item.getBBox();
          isIn = judge(x, y, box, model, { x: 5, y: 5 });
          if (isIn !== -1) {
            origin.x = x;
            origin.y = y;
            origin.item = item;
            origin.model = JSON.parse(JSON.stringify(model));
            origin.width = model.width;
            origin.height = model.height;
            graph.update(item, {
              isEdit: true,
            });
          }
        }
      });
      graph.behaviourOn('node:drag', (ev) => {
        if (isIn !== -1) {
          const { x, y } = ev;
          const { width, height, item, model } = origin;
          const dx = x - origin.x;
          const dy = y - origin.y;
          // 计算增量
          let xV;
          let yV;
          switch (isIn) {
            case 0:
              xV = dx > 0 ? { x: model.x - dx } : { x: model.x + dx, width: width - dx };
              yV = dy > 0 ? { y: model.y + dy, height: height - dy } : { y: model.y + dy, height: height - dy };
              break; // 3象限
            case 1:
              xV = dx > 0 ? { width: width + dx } : { width: width + dx };
              yV = dy > 0 ? { y: model.y + dy, height: height - dy } : { y: model.y + dy, height: height - dy };
              break; // 1象限
            case 2:
              xV = dx > 0 ? { width: width + dx } : { width: width + dx };
              yV = dy > 0 ? { height: height + dy } : { height: height + dy };
              break; // 4象限
            case 3:
              xV = dx > 0 ? { x: model.x + dx, width: width - dx } : { x: model.x + dx, width: width - dx };
              yV = dy > 0 ? { height: height + dy } : { height: height + dy };
              break; // 2象限
            default: break;
          }
          graph.update(item, {
            ...xV,
            ...yV,
          });
        }
      });
      graph.behaviourOn('node:dragend', () => {
        const { item } = origin;
        isIn = false;
        graph.update(item, {
          isEdit: false,
        });
      });
      graph.behaviourOn('node:mouseenter', (ev) => {
        const { item } = ev;
        if (item) {
          const model = item.getModel();
          // 显示辅助锚点（用于resizeNode）
          if (model.auxiliaryColor && model.auxiliaryColor === auxiliaryColor0) {
            graph.update(item, {
              auxiliaryColor: auxiliaryColor1,
            });
          }
        }
      });
      graph.behaviourOn('node:mouseleave', (ev) => {
        const { item } = ev;
        if (item) {
          const model = item.getModel();
          if (!model.isEdit) {
            // 显示辅助锚点（用于resizeNode）
            if (model.auxiliaryColor && model.auxiliaryColor === auxiliaryColor1) {
              graph.update(item, {
                auxiliaryColor: auxiliaryColor0,
              });
            }
          }
        }
      });
    });
    // 添加直线行为 addLine
    G6.registerBehaviour('addCustomLine', (graph) => {
      graph.behaviourOn('click', (ev) => {
        const { x, y } = ev;
        const item = graph.find(this.state.currenLineId);
        const model = item.getModel();
        model.points.push([x, y]);
        graph.remove(item);
        this.graph.add('node', model);
      });
      graph.behaviourOn('dblclick', () => {
        const item = graph.find(this.state.currenLineId);
        const model = item.getModel();
        model.points.shift();
        model.points.splice(model.points.length - 1, 1);
        graph.remove(item);
        this.graph.add('node', model);
        graph.changeMode('default');
      });
    });
    // 添加折线
    G6.registerBehaviour('addCustomPolyLine', (graph) => {
      graph.behaviourOn('click', (ev) => {
        const { x, y } = ev;
        const item = graph.find(this.state.currenLineId);
        const model = item.getModel();
        // 比较x y的差值，判断是画横线还是竖线
        const origin = model.points[model.points.length - 1];
        const dx = x - origin[0];
        const dy = y - origin[1];
        const res = Math.abs(dx) >= Math.abs(dy) ? [x, origin[1]] : [origin[0], y];
        model.points.push(res);
        graph.remove(item);
        this.graph.add('node', model);
      });
      graph.behaviourOn('dblclick', () => {
        const item = graph.find(this.state.currenLineId);
        const model = item.getModel();
        model.points.shift();
        model.points.splice(model.points.length - 1, 1);
        graph.remove(item);
        this.graph.add('node', model);
        graph.changeMode('default');
      });
    });
    // 添加曲线箭头
    G6.registerBehaviour('editQuadratic', (graph) => {
      let node;
      let edge;
      let dx;
      let dy;
      graph.behaviourOn('node:dragstart', (ev) => {
        const { item } = ev;
        const model = item.getModel();
        node = item;
        dx = model.x - ev.x;
        dy = model.y - ev.y;
      });
      graph.behaviourOn('node:drag', (ev) => {
        if (node) {
          graph.update(node, {
            x: ev.x + dx,
            y: ev.y + dy,
          });
        }
      });
      graph.behaviourOn('node:dragend', () => {
        node = undefined;
        edge = undefined;
        this.graph.changeMode('default');
        const { sourceId, targetId } = this.state.currentArrow;
        this.graph.update(sourceId, {
          fill: 'rgba(0,0,0,0)', stroke: 'rgba(0,0,0,0)',
        });
        this.graph.update(targetId, {
          fill: 'rgba(0,0,0,0)', stroke: 'rgba(0,0,0,0)',
        });
      });
      graph.behaviourOn('edge:dragstart', (ev) => {
        const { item } = ev;
        const model = item.getModel();
        edge = item;
        dx = model.ct.x - ev.x;
        dy = model.ct.y - ev.y;
      });
      graph.behaviourOn('edge:drag', (ev) => {
        if (!edge && ev.item) {
          edge = ev.item;
          const model = ev.item.getModel();
          dx = model.ct.x - ev.x;
          dy = model.ct.y - ev.y;
        }
        if (edge) {
          graph.update(edge, {
            ct: { x: ev.x + dx, y: ev.y + dy },
          });
        }
      });
      graph.behaviourOn('edge:dragend', () => {
        node = undefined;
        edge = undefined;
        this.graph.changeMode('default');
        const { sourceId, targetId } = this.state.currentArrow;
        this.graph.update(sourceId, {
          fill: 'rgba(0,0,0,0)', stroke: 'rgba(0,0,0,0)',
        });
        this.graph.update(targetId, {
          fill: 'rgba(0,0,0,0)', stroke: 'rgba(0,0,0,0)',
        });
      });
    });
  }
  registerNode(G6) {
    G6.registerNode('customFlag', {
      draw(item) {
        const path1 = 'm14.8,4.2l28.1,10.5l-28.1,11.8';
        const path2 = 'm6.4,42.5c0,-1.76796 2.86409,-3.2 6.4,-3.2c3.53591,0 6.4,1.43204 6.4,3.2c0,1.76796 -2.86409,3.2 -6.4,3.2c-3.53591,0 -6.4,-1.43204 -6.4,-3.2z';
        const path3 = 'm10.3,42.5c0,-0.44199 1.11878,-0.8 2.5,-0.8c1.38122,0 2.5,0.35801 2.5,0.8c0,0.44199 -1.11878,0.8 -2.5,0.8c-1.38122,0 -2.5,-0.35801 -2.5,-0.8z';
        const path4 = 'm14.8,42.2l-3.9,0l0,-39.3c0,-0.7 0.6,-1.2 1.2,-1.2l1.5,0c0.7,0 1.2,0.6 1.2,1.2l0,39.3z';
        const group = item.getGraphicGroup();
        const model = item.getModel();
        const { fill1, fill2, fill3, fill4 } = model;
        group.addShape('path', {
          attrs: {
            path: path2,
            lineWidth: 1,
            fill: fill2,
            stroke: fill2,
          },
        });
        group.addShape('path', {
          attrs: {
            path: path3,
            lineWidth: 1,
            fill: fill3,
            stroke: fill3,
          },
        });
         group.addShape('path', {
          attrs: {
            path: path4,
            lineWidth: 1,
            fill: fill4,
            stroke: fill4,
          },
        });
        group.addShape('path', {
          attrs: {
            path: path1,
            lineWidth: 1,
            fill: fill1,
            stroke: fill1,
          },
        });
        return group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: 48,
            height: 48,
            fill: 'rgba(0,0,0,0)',
            stroke: 'rgba(0,0,0,0)',
            isAuxiliary: true,
          },
        });
      },
    });
    G6.registerNode('customBox', {
      draw(item) {
        const group = item.getGraphicGroup();
        const model = item.getModel();
        const { width, height, auxiliaryColor, fill, stroke } = model;
        // 主要形
        resgisterAuxiliary({ group, rectWidth: width, rectHeight: height, auxiliaryColor });
        return group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width,
            height,
            lineWidth: 2,
            fill,
            stroke,
          },
        });
      },
    });
    G6.registerNode('customImg', {
      draw(item) {
        const group = item.getGraphicGroup();
        const model = item.getModel();
        const { width, height, auxiliaryColor, img } = model;
        // 主要形
        group.addShape('image', {
          attrs: {
            x: 0,
            y: 0,
            width,
            height,
            img,
          },
        });
        resgisterAuxiliary({ group, rectWidth: width, rectHeight: height, auxiliaryColor });
        return group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width,
            height,
            fill: 'rgba(0,0,0,0)',
            stroke: 'rgba(0,0,0,0)',
          },
        });
      },
    });
    G6.registerNode('customTextBox', {
      draw(item) {
        const group = item.getGraphicGroup();
        const model = item.getModel();
        const { height, auxiliaryColor, fill, stroke, text, id, textFill } = model;
        const { cnLength, enLength } = getStrLength(text);
        const width = cnLength * 16 + enLength * 8 === 0 ? 40 : cnLength * 16 + enLength * 8;
        group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width,
            height,
            lineWidth: 2,
            fill,
            stroke,
          },
        });
        group.addShape('text', {
          attrs: {
            x: width / 2,
            y: height / 2,
            id,
            fill: textFill,
            text,
            textAlign: 'center',
            textBaseline: 'middle',
          },
        });
        resgisterAuxiliary({ group, rectWidth: width, rectHeight: height, auxiliaryColor });
        return group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width,
            height,
            fill: 'rgba(0,0,0,0)',
            stroke: 'rgba(0,0,0,0)',
          },
        });
      },
    });
    G6.registerNode('customPolygon', {
      draw(item) {
        const group = item.getGraphicGroup();
        const model = item.getModel();
        const { width, height, auxiliaryColor, fill, stroke } = model;
        const r = (width + height) / 4;
        // 主要形
        group.addShape('polygon', {
          attrs: {
            points: [
              [0.5 * r, 0],
              [1.5 * r, 0],
              [r * 2, r * 0.875],
              [1.5 * r, r * 1.75],
              [0.5 * r, r * 1.75],
              [0, r * 0.875],
            ],
            fill,
            lineWidth: 2,
            stroke,
          },
        });
        const size = 8;
        group.addShape('rect', {
          attrs: {
            x: 0 - size / 2,
            y: 0 - size / 2,
            width: size,
            height: size,
            fill: auxiliaryColor,
            stroke: auxiliaryColor,
            isAuxiliary: true,
          },
        });
        group.addShape('rect', {
          attrs: {
            x: 0 + width - size / 2,
            y: 0 - size / 2,
            width: size,
            height: size,
            fill: auxiliaryColor,
            stroke: auxiliaryColor,
            isAuxiliary: true,
          },
        });
        group.addShape('rect', {
          attrs: {
            x: 0 + width - size / 2,
            y: 0 + height - size / 2,
            width: size,
            height: size,
            fill: auxiliaryColor,
            stroke: auxiliaryColor,
            isAuxiliary: true,
          },
        });
        group.addShape('rect', {
          attrs: {
            x: 0 - size / 2,
            y: 0 + height - size / 2,
            width: size,
            height: size,
            fill: auxiliaryColor,
            stroke: auxiliaryColor,
            isAuxiliary: true,
          },
        });
        return group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: Math.max(width, height),
            height: Math.max(width, height),
            fill: 'rgba(0,0,0,0)',
            stroke: 'rgba(0,0,0,0)',
          },
        });
      },
    });
    G6.registerNode('customArrow', {
      draw(item) {
        const group = item.getGraphicGroup();
        const model = item.getModel();
        const { stroke, start, end, ct, cY } = model;
        const lineWidth = 10;
        // 弧线
        group.addShape('path', {
          attrs: {
            path: [
              ['M', startX, startY],
              ['Q', cx, cy, endx, endy],
            ],
            lineWidth,
            stroke,
            // endArrow: {
            //   path: (() => {
            //     const width = lineWidth * 10 / 3;
            //     const halfHeight = lineWidth * 4 / 3;
            //     const radius = lineWidth * 4;
            //     const MIN_ARROW_SIZE = 3;
            //     return [
            //       ['M', -width, halfHeight],
            //       ['L', 0, 0],
            //       ['L', -width, -halfHeight],
            //       ['A', radius, radius, 0, 0, 1, -width, halfHeight],
            //       ['Z'],
            //     ];
            //   })(),
            //   stroke: 'blue',
            //   fill: 'blue',
            //   // shorten(item) {
            //   //   const keyShape = item.getKeyShape();
            //   //   const lineWidth = keyShape.attr('lineWidth');
            //   //   return (lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE) * 3.1;
            //   // },
            //   style(item) {
            //     const keyShape = item.getKeyShape();
            //     const { strokeOpacity, stroke } = keyShape.attr();
            //     return {
            //       fillOpacity: strokeOpacity,
            //       fill: stroke
            //     };
            //   }
            // },
            endArrow: true,
          },
        });
        group.addShape('rect', {
          attrs: {
            x: cx,
            y: cy,
            width: 8,
            height: 8,
            fill: 'red',
            isAuxiliary: true,
          },
        });
        // group.addShape('rect', {
        //   attrs: {
        //     x: endx,
        //     y: endy,
        //     width: 8,
        //     height: 8,
        //     fill: 'red',
        //     isQuadratic: true,
        //   },
        // });
        return group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: endx - startX,
            height: endy - startY,
            fill: 'rgba(0,0,0,0)',
            stroke: 'rgba(0,0,0,0)',
          },
        });
      },
    });
    G6.registerNode('customCircle', {
      draw(item) {
        const group = item.getGraphicGroup();
        const model = item.getModel();
        const { fill, stroke, width, height, auxiliaryColor } = model;
        const r = Math.max(width, height) / 2;
        // 主要形
        group.addShape('circle', {
          attrs: {
            x: r,
            y: r,
            r,
            fill,
            lineWidth: 2,
            stroke,
          },
        });
        resgisterAuxiliary({ group, rectWidth: 2 * r, rectHeight: 2 * r, auxiliaryColor });
        return group.addShape('rect', {
          attrs: {
            x: 0,
            y: 0,
            width: 2 * r,
            height: 2 * r,
            fill: 'rgba(0,0,0,0)',
            stroke: 'rgba(0,0,0,0)',
          },
        });
      },
    });
    G6.registerNode('customLine', {
      draw(item) {
        const group = item.getGraphicGroup();
        const model = item.getModel();
        const { stroke, id, points, circleColor } = model;
        // 主要形
        for (const point of points) {
          group.addShape('circle', {
            attrs: {
              x: point[0],
              y: point[1],
              r: 4,
              stroke: circleColor,
            },
          });
        }
        return group.addShape('polyline', {
          attrs: {
            id,
            points,
            lineWidth: 2,
            stroke,
          },
        });
      },
    });
    G6.registerNode('custom_PolyLine', {
      draw(item) {
        const group = item.getGraphicGroup();
        const model = item.getModel();
        const { stroke, id, points, circleColor } = model;
        console.log('model', model);
        // 主要形
        for (const point of points) {
          group.addShape('circle', {
            attrs: {
              x: point[0],
              y: point[1],
              r: 4,
              stroke: circleColor,
            },
          });
        }
        return group.addShape('polyline', {
          attrs: {
            id,
            points,
            lineWidth: 2,
            stroke,
          },
        });
      },
    });
    G6.registerNode('custom_ArrowWithPolyLine', {
      draw(item) {
        const group = item.getGraphicGroup();
        const model = item.getModel();
        const { stroke, id, points, circleColor, lineWidth } = model;
        // 主要形
        for (const point of points) {
          group.addShape('circle', {
            attrs: {
              x: point[0],
              y: point[1],
              r: 4,
              stroke: circleColor,
            },
          });
        }
        return group.addShape('polyline', {
          attrs: {
            id,
            points,
            lineWidth,
            stroke,
            endArrow: (points.length > 2),
            // endArrow: {
            //   path: (() => {
            //     console.log(11223);
            //     const width = lineWidth * 10 / 3;
            //     const halfHeight = lineWidth * 4 / 3;
            //     const radius = lineWidth * 4;
            //     const MIN_ARROW_SIZE = 3;
            //     return [
            //       ['M', -width, halfHeight],
            //       ['L', 0, 0],
            //       ['L', -width, -halfHeight],
            //       ['A', radius, radius, 0, 0, 1, -width, halfHeight],
            //       ['Z'],
            //     ];
            //   })(),
            //   // stroke,
            //   // fill: colorObj.fill,
            //   shorten(item) {
            //     console.log(112232222);
            //     console.log('item', item)
            //     const keyShape = item.getKeyShape();
            //     const lineWidth = keyShape.attr('lineWidth');
            //     return 31;
            //   },
            //   style(item) {
            //     const keyShape = item.getKeyShape();
            //     const { strokeOpacity, stroke } = keyShape.attr();
            //     return {
            //       fillOpacity: strokeOpacity,
            //       fill: 'blue',
            //     };
            //   },
            // },
          },
        });
      },
    });
    G6.registerNode('arrowCircle', {
      draw(item) {
        const group = item.getGraphicGroup();
        const model = item.getModel();
        const { fill, stroke } = model;
        // 主要形
        return group.addShape('circle', {
          attrs: {
            x: 0,
            y: 0,
            r: 20,
            fill,
            stroke,
          },
        });
      },
    });
    G6.registerEdge('quadraticArrow', {
      draw(item) {
        const group = item.getGraphicGroup();
        const start = item.source.getModel();
        const end = item.target.getModel();
        const lineWidth = 10;
        const { ct, stroke } = item.getModel();
        return group.addShape('path', {
          attrs: {
            path: [
              ['M', start.x, start.y],
              ['Q', ct.x, ct.y, end.x, end.y],
            ],
            lineWidth,
            stroke,
            endArrow: {
              path: (() => {
                const width = lineWidth * 10 / 3;
                const halfHeight = lineWidth * 4 / 3;
                const radius = lineWidth * 4;
                const MIN_ARROW_SIZE = 3;
                return [
                  ['M', -width, halfHeight],
                  ['L', 0, 0],
                  ['L', -width, -halfHeight],
                  ['A', radius, radius, 0, 0, 1, -width, halfHeight],
                  ['Z'],
                ];
              })(),
              stroke,
              fill: colorObj.fill,
              style(item) {
                const keyShape = item.getKeyShape();
                const { strokeOpacity, stroke } = keyShape.attr();
                return {
                  fillOpacity: strokeOpacity,
                  fill: stroke,
                };
              },
            },
          },
        });
      },
    });
  }
}

export { G6Register };
