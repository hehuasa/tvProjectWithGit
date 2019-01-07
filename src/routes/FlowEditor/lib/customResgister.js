import k201_ from '../../../assets/homePage/device/k201.png';
import K501_ from '../../../assets/homePage/device/k501.png';
import K601_ from '../../../assets/homePage/device/k601.png';
import K760_ from '../../../assets/homePage/device/k760.png';

const { G6_1 } = window;
const { Util } = G6_1;
/* 注册节点
* customNode1 默认自定义节点
* * customNode2 自定义节点
* * customNode3 自定义节点
* * customNode4 自定义节点
* * customNode5 自定义节点
* customText 默认自定义文本
* quotaRect 指标
* splitLine 分割线
* customLine 默认自定义线条（白色粗）
* customLineV 默认自定义线条（垂直）
* customDashLine 默认自定义虚线
* customDashLineV 默认自定义虚线（垂直）
* lineNewArrow 默认自定义连接线（直线+自定义箭头）
* strengthLine 粗线条（连线）
* lineNewArrowWithAngel 默认自定义连接线（直线+自定义箭头）+ 三角形
* loading 加载中
* 大机组K201
 */

/* 动态计算线条锚点
* @length 线长
* @type 线类型
* */
const getLinePoints = (length, type) => {
  // 动态计算需要分配的锚点个数
  const part = Math.ceil(length / 20);
  // 锚点间距
  const value = parseFloat((1 / part).toFixed(5));
  const anchorArray = [[0, 0], [0, 1], [1, 0], [1, 1]];
  let index = 0;
  while (index < part) {
    index += 1;
    switch (type) {
      // type === 0 为 横，1为竖直
      case 0:
        anchorArray.push([value * index, 0]);
        anchorArray.push([value * index, 1]);
        break;
      case 1:
        anchorArray.push([0, value * index]);
        anchorArray.push([1, value * index]);
        break;
      default: break;
    }
  }
  return anchorArray;
};
export const registerNode = () => {
  G6_1.registNode('customNode1', {
    draw: (cfg, group) => {
      const fontSize = cfg.model.fontSize;
      group.addShape('rect', {
        attrs: {
          x: cfg.x - cfg.size[0] / 2,
          y: cfg.y - cfg.size[1] / 2,
          width: cfg.size[0],
          height: cfg.size[1],
          radius: 4,
          lineWidth: 2,
          fill: cfg.model.fill,
          stroke: cfg.model.stroke,
        },
      });
      group.addShape('text', {
        attrs: {
          x: cfg.x,
          y: cfg.y + fontSize / 2,
          fill: cfg.model.textFill,
          text: cfg.label,
          textAlign: 'center',
          // textBaseline: 'Middle',
          fontFamily: 'Hiragino Sans GB',
          fontSize,
        },
      });
    },
    getAnchorPoints: () => {
      return [
        [0, 0.125],
        [0, 0.25],
        [0, 0.375],
        [0, 0.5],
        [0, 0.625],
        [0, 0.75],
        [0, 0.875],
        [1, 0.125],
        [1, 0.25],
        [1, 0.375],
        [1, 0.5],
        [1, 0.625],
        [1, 0.75],
        [1, 0.875],
        [0.125, 0],
        [0.25, 0],
        [0.375, 0],
        [0.5, 0],
        [0.625, 0],
        [0.75, 0],
        [0.875, 0],
        [0.125, 1],
        [0.25, 1],
        [0.375, 1],
        [0.5, 1],
        [0.625, 1],
        [0.75, 1],
        [0.875, 1],
      ];
    },
  }, 'rect');
  G6_1.registNode('customNode2', {
    draw: (cfg, group) => {
      const { fontSize, fill, fontFamily, fontWeight, textFill } = cfg.model;
      group.addShape('rect', {
        attrs: {
          x: cfg.x - cfg.size[0] / 2,
          y: cfg.y - cfg.size[1] / 2,
          width: cfg.size[0],
          height: cfg.size[1],
          radius: 4,
          fill,
          stroke: '#202121',
        },
      });
      group.addShape('text', {
        attrs: {
          x: cfg.x,
          y: cfg.y + fontSize / 2,
          fill: textFill,
          text: cfg.label,
          textAlign: 'center',
          // textBaseline: 'Middle',
          fontFamily: fontFamily || 'Hiragino Sans GB',
          fontSize,
          fontWeight,
        },
      });
    },
    getAnchorPoints: () => {
      return [
        [0, 0.25],
        [0, 0.5],
        [0, 0.75],
        [1, 0.25],
        [1, 0.5],
        [0.125, 0],
        [0.25, 0],
        [0.375, 0],
        [0.5, 0],
        [0.625, 0],
        [0.75, 0],
        [0.875, 0],
        [0.125, 1],
        [0.25, 1],
        [0.375, 1],
        [0.5, 1],
        [0.625, 1],
        [0.75, 1],
        [0.875, 1],
      ];
    },
  }, 'rect');
  G6_1.registNode('customNode2-1', {
    draw: (cfg, group) => {
      const { fontSize, fill, fontFamily, fontWeight, textFill } = cfg.model;

      group.addShape('ellipse', {
        attrs: {
          x: cfg.x,
          y: cfg.y - cfg.size[1] / 2,
          rx: cfg.size[0] / 2,
          ry: 18,
          fill: 'l (90) 0:#373737 1:#f3f3f3',
        },
      });
      group.addShape('ellipse', {
        attrs: {
          x: cfg.x,
          y: cfg.y + cfg.size[1] / 2,
          rx: cfg.size[0] / 2,
          ry: 18,
          fill: 'l (90) 0:#f3f3f3 1:#373737',
        },
      });
      group.addShape('rect', {
        attrs: {
          x: cfg.x - cfg.size[0] / 2,
          y: cfg.y - cfg.size[1] / 2,
          width: cfg.size[0],
          height: cfg.size[1],
          // radius: 4,
          fill,
          // stroke: '#202121',
        },
      });
      group.addShape('text', {
        attrs: {
          x: cfg.x,
          y: cfg.y + fontSize / 2,
          fill: textFill,
          text: cfg.label,
          textAlign: 'center',
          // textBaseline: 'Middle',
          fontFamily: fontFamily || 'Hiragino Sans GB',
          fontSize,
          fontWeight,
        },
      });
    },
    getAnchorPoints: () => {
      return [
        [0, 0.25],
        [0, 0.5],
        [0, 0.75],
        [1, 0.25],
        [1, 0.5],
        [0.125, 0],
        [0.25, 0],
        [0.375, 0],
        [0.5, 0],
        [0.625, 0],
        [0.75, 0],
        [0.875, 0],
        [0.125, 1],
        [0.25, 1],
        [0.375, 1],
        [0.5, 1],
        [0.625, 1],
        [0.75, 1],
        [0.875, 1],
      ];
    },
  }, 'rect');
  G6_1.registNode('customNode3', {
    draw: (cfg, group) => {
      const { stroke } = cfg.model;
      group.addShape('polygon', {
        attrs: {
          points: [
            [0, 10],
            [6, 5],
            [6, -5],
            [0, -10],
          ],
          stroke,
        },
      });
      return group.addShape('rect', {
        attrs: {
          x: cfg.x,
          y: cfg.y,
          width: 30,
          height: 30,
          fill: 'rgba(0,0,0,0)',
          stroke: 'rgba(0,0,0,0)',
        },
      });
    },
    getAnchorPoints: () => {
      return [
        [0, 0.25],
        [0, 0.5],
        [0, 0.75],
        [1, 0.25],
        [1, 0.5],
        [0.125, 0],
        [0.25, 0],
        [0.375, 0],
        [0.5, 0],
        [0.625, 0],
        [0.75, 0],
        [0.875, 0],
        [0.125, 1],
        [0.25, 1],
        [0.375, 1],
        [0.5, 1],
        [0.625, 1],
        [0.75, 1],
        [0.875, 1],
      ];
    },
  }, 'rect');
  G6_1.registNode('customNode4', {
    draw: (cfg, group) => {
      group.addShape('polygon', {
        attrs: {
          points: [
            [-11, 4],
            [-12, 8],
            [0, 0],
            [-12, -8],
            [-11, -4],
            [-30, -2],
            [-30, 2],
          ],
          stroke: '#fff',
          fill: '#fff',
        },
      });
    },
    getAnchorPoints: () => {
      return [
      ];
    },
  }, 'rect');
  G6_1.registNode('customNode4-1', {
    draw: (cfg, group) => {
      group.addShape('polygon', {
        attrs: {
          points: [
            [11, 4],
            [12, 8],
            [0, 0],
            [12, -8],
            [11, -4],
            [30, -2],
            [30, 2],
          ],
          stroke: '#fff',
          fill: '#fff',
        },
      });
    },
    getAnchorPoints: () => {
      return [
      ];
    },
  }, 'rect');
  G6_1.registNode('customNode5', {
    draw: (cfg, group) => {
      const { stroke } = cfg.model;
      group.addShape('line', {
        attrs: {
          x1: cfg.x - 28,
          y1: cfg.y + 20,
          x2: cfg.x + 28,
          y2: cfg.y - 20,
          lineWidth: 2,
          stroke,
        },
      });
      group.addShape('line', {
        attrs: {
          x1: cfg.x - 28,
          y1: cfg.y + 20,
          x2: cfg.x - 28,
          y2: cfg.y + 5,
          lineWidth: 2,
          stroke,
        },
      });
      group.addShape('line', {
        attrs: {
          x1: cfg.x - 28,
          y1: cfg.y + 20,
          x2: cfg.x - 13,
          y2: cfg.y + 20,
          lineWidth: 2,
          stroke,
        },
      });
      return group.addShape('ellipse', {
        attrs: {
          x: cfg.x,
          y: cfg.y,
          rx: 18,
          ry: 12,
          lineWidth: 2,
          stroke,
          fill: '#666',
        },
      });
    },
    getAnchorPoints: () => {
      return [
        [0, 0.25],
        [0, 0.5],
        [0, 0.75],
        [1, 0.25],
        [1, 0.5],
        [0.125, 0],
        [0.25, 0],
        [0.375, 0],
        [0.5, 0],
        [0.625, 0],
        [0.75, 0],
        [0.875, 0],
        [0.125, 1],
        [0.25, 1],
        [0.375, 1],
        [0.5, 1],
        [0.625, 1],
        [0.75, 1],
        [0.875, 1],
      ];
    },
  }, 'rect');
  G6_1.registNode('customNode6', {
    draw: (cfg, group) => {
      const { stroke } = cfg.model;
      group.addShape('line', {
        attrs: {
          x1: cfg.x,
          y1: cfg.y,
          x2: cfg.x - 20,
          y2: cfg.y + 30,
          lineWidth: 2,
          stroke,
        },
      });
      group.addShape('line', {
        attrs: {
          x1: cfg.x,
          y1: cfg.y,
          x2: cfg.x + 20,
          y2: cfg.y + 30,
          lineWidth: 2,
          stroke,
        },
      });
      group.addShape('line', {
        attrs: {
          x1: cfg.x - 20,
          y1: cfg.y + 30,
          x2: cfg.x + 20,
          y2: cfg.y + 30,
          lineWidth: 2,
          stroke,
        },
      });
      return group.addShape('ellipse', {
        attrs: {
          x: cfg.x,
          y: cfg.y,
          rx: 22,
          ry: 18,
          stroke,
          lineWidth: 2,
          fill: '#202121',
        },
      });
    },
    getAnchorPoints: () => {
      return [
        [0.5, 0.5],
        [0, 0.25],
        [0, 0.5],
        [0, 0.75],
        [1, 0.25],
        [1, 0.5],
        [0.125, 0],
        [0.25, 0],
        [0.375, 0],
        [0.5, 0],
        [0.625, 0],
        [0.75, 0],
        [0.875, 0],
        [0.125, 1],
        [0.25, 1],
        [0.375, 1],
        [0.5, 1],
        [0.625, 1],
        [0.75, 1],
        [0.875, 1],
      ];
    },
  }, 'rect');
  G6_1.registNode('customNode7', {
    draw: (cfg, group) => {
      const { stroke } = cfg.model;
      group.addShape('rect', {
        attrs: {
          x: cfg.x,
          y: cfg.y,
          width: 30,
          height: 15,
          fill: '#202121',
        },
      });
      group.addShape('line', {
        attrs: {
          x1: cfg.x,
          y1: cfg.y,
          x2: cfg.x,
          y2: cfg.y + 15,
          stroke,
        },
      });
      group.addShape('line', {
        attrs: {
          x1: cfg.x + 30,
          y1: cfg.y,
          x2: cfg.x + 30,
          y2: cfg.y + 15,
          stroke,
        },
      });

      return group.addShape('line', {
        attrs: {
          x1: cfg.x,
          y1: cfg.y,
          x2: cfg.x + 30,
          y2: cfg.y + 15,
          stroke,
        },
      });
    },
    afterDraw: (cfg, group) => {
      const { stroke } = cfg.model;
      const arrow = group.addShape('polygon', {
        attrs: {
          points: [
            [-3, 5],
            [4, 0],
            [-3, -5],
          ],
          stroke,
          fill: stroke,
        },
        class: 'arrow',
      });
      Util.arrowTo(arrow, cfg.x + 15, cfg.y + 7, cfg.x, cfg.y, cfg.x + 30, cfg.y + 15);
    },
    getAnchorPoints: () => {
    },
  }, 'rect');
  G6_1.registNode('customNode8', {
    draw: (cfg, group) => {
      const { stroke } = cfg.model;
      group.addShape('line', {
        attrs: {
          x1: cfg.x - 30,
          y1: cfg.y,
          x2: cfg.x - 15,
          y2: cfg.y - 10,
          stroke,
        },
      });
      group.addShape('line', {
        attrs: {
          x1: cfg.x - 15,
          y1: cfg.y - 10,
          x2: cfg.x + 15,
          y2: cfg.y + 10,
          stroke,
        },
      });
      group.addShape('line', {
        attrs: {
          x1: cfg.x + 15,
          y1: cfg.y + 10,
          x2: cfg.x + 30,
          y2: cfg.y,
          stroke,
        },
      });
      return group.addShape('ellipse', {
        attrs: {
          x: cfg.x,
          y: cfg.y,
          rx: 30,
          ry: 25,
          stroke,
          fill: 'rgba(0,0,0,0)',
        },
      });
    },
    getAnchorPoints: () => {
      return 'auto';
    },
  }, 'rect');
  G6_1.registNode('customText', {
    draw: (cfg, group) => {
      group.addShape('text', {
        attrs: {
          x: cfg.x - 15,
          y: cfg.y,
          fill: cfg.model.textFill,
          text: cfg.label,
          fontFamily: 'Hiragino Sans GB',
          fontSize: cfg.model.fontSize,
        },
      });
    },
    getAnchorPoints: () => {
      return 'auto';
    },
  }, 'text');
  G6_1.registNode('quotaRect', {
    draw: (cfg, group) => {
      // title
      group.addShape('text', {
        attrs: {
          x: cfg.x + cfg.size[0] / 2,
          y: cfg.y + cfg.size[1] / 2 + 8,
          textAlign: 'center',
          textBaseline: 'Middle',
          fill: cfg.model.quotaNameTextFill,
          text: cfg.model.quotaName,
          fontFamily: 'Hiragino Sans GB',
          fontSize: 14,
        },
      });
      // 指标值
      group.addShape('text', {
        attrs: {
          x: cfg.x + cfg.size[0] / 2,
          y: cfg.y + cfg.size[1] - 8,
          fill: cfg.model.quotaValueTextFill,
          text: cfg.model.quotaValue,
          textAlign: 'center',
          textBaseline: 'Middle',
          fontFamily: 'Hiragino Sans GB',
          fontSize: 12,
        },
      });
      // 容器
      return group.addShape('rect', {
        attrs: {
          x: cfg.x,
          y: cfg.y,
          width: cfg.size[0],
          height: cfg.size[1],
          fill: cfg.model.fill,
          stroke: 'rgba(0, 0, 0, 0)',
        },
      });
    },
    getAnchorPoints: () => {
      return 'auto';
    },
  }, 'rect');
  G6_1.registNode('quotaRectH', {
    draw: (cfg, group) => {
      // title
      group.addShape('text', {
        attrs: {
          x: cfg.x + cfg.size[0] / 2 - 35,
          y: cfg.y + cfg.size[1] / 2,
          textAlign: 'center',
          textBaseline: 'Middle',
          fill: cfg.model.quotaNameTextFill,
          text: cfg.model.quotaName,
          fontFamily: 'Hiragino Sans GB',
          fontSize: 14,
        },
      });
      // 指标值
      group.addShape('text', {
        attrs: {
          x: cfg.x + cfg.size[0] / 2 + 35,
          y: cfg.y + cfg.size[1] / 2,
          fill: cfg.model.quotaValueTextFill,
          text: cfg.model.quotaValue,
          textAlign: 'center',
          textBaseline: 'Middle',
          fontFamily: 'Hiragino Sans GB',
          fontSize: 12,
        },
      });
      // 容器
      return group.addShape('rect', {
        attrs: {
          x: cfg.x,
          y: cfg.y,
          width: cfg.size[0],
          height: cfg.size[1],
          fill: cfg.model.fill,
          stroke: 'rgba(0, 0, 0, 0)',
        },
      });
    },
    getAnchorPoints: () => {
      return 'auto';
    },
  }, 'rect');
  G6_1.registNode('splitLine', {
    draw: (cfg, group) => {
      group.addShape('line', {
        attrs: {
          x1: cfg.x,
          y1: cfg.y - 5,
          x2: cfg.x,
          y2: cfg.y + 20,
          stroke: cfg.model.stroke,
        },
      });
      group.addShape('line', {
        attrs: {
          x1: cfg.x + 8,
          y1: cfg.y,
          x2: cfg.x + 8,
          y2: cfg.y + 15,
          stroke: cfg.model.stroke,
          lineWidth: cfg.model.lineWidth,
        },
      });
      return group.addShape('rect', {
        attrs: {
          x: cfg.x - 20,
          y: cfg.y - 20,
          width: 40,
          height: 40,
          fill: 'rgba(0, 0, 0, 0)',
          stroke: 'rgba(0, 0, 0, 0)',
        },
      });
    },
    getAnchorPoints: () => {
      return [
        [0, 0.5],
        [1, 0.5],
      ];
    },
  }, 'line');
  G6_1.registNode('customLine', {
    draw: (cfg, group) => {
      group.addShape('rect', {
        attrs: {
          x: cfg.x - cfg.size[0] / 2,
          y: cfg.y - cfg.size[1] / 2,
          width: cfg.model.size[0],
          radius: 2,
          height: Number(cfg.model.lineSize),
          fill: cfg.model.stroke,
          stroke: cfg.model.stroke,
        },
      });
    },
    getAnchorPoints: (cfg) => {
      return getLinePoints(cfg.model.size[0], 0);
    },
  }, 'rect');
  G6_1.registNode('customLineV', {
    draw: (cfg, group) => {
      group.addShape('rect', {
        attrs: {
          x: cfg.x - cfg.size[0] / 2,
          y: cfg.y - cfg.size[1] / 2,
          radius: 2,
          width: Number(cfg.model.lineSize),
          height: cfg.model.size[1],
          fill: cfg.model.stroke,
          stroke: cfg.model.stroke,
          lineWidth: cfg.model.lineWidth,
        },
      });
    },
    getAnchorPoints: (cfg) => {
      return getLinePoints(cfg.model.size[1], 1);
    },
  }, 'rect');
  G6_1.registNode('customLineWithCircle', {
    draw: (cfg, group) => {
      group.addShape('circle', {
        attrs: {
          x: cfg.x - cfg.size[0] / 2 - 2.5,
          y: cfg.y - cfg.size[1] / 2 + 1.5,
          r: 5,
          // stroke: 'red',
          stroke: cfg.model.stroke,
          fill: cfg.model.stroke,
        },
      });
      group.addShape('circle', {
        attrs: {
          x: cfg.x - cfg.size[0] / 2 + cfg.model.size[0] + 2.5,
          y: cfg.y - cfg.size[1] / 2 + 1.5,
          r: 5,
          // stroke: 'red',
          stroke: cfg.model.stroke,
          fill: cfg.model.stroke,
        },
      });
      return group.addShape('rect', {
        attrs: {
          x: cfg.x - cfg.size[0] / 2,
          y: cfg.y - cfg.size[1] / 2,
          width: cfg.model.size[0],
          height: 3,
          fill: cfg.model.stroke,
          stroke: cfg.model.stroke,
        },
      });
    },
    getAnchorPoints: (cfg) => {
      return getLinePoints(cfg.model.size[0], 0);
    },
  }, 'rect');
  G6_1.registNode('customLineWithCircleV', {
    draw: (cfg, group) => {
      group.addShape('circle', {
        attrs: {
          x: cfg.x - cfg.size[0] / 2 + 1.5,
          y: cfg.y - cfg.size[1] / 2 - 2.5,
          r: 5,
          // stroke: 'red',
          stroke: cfg.model.stroke,
          fill: cfg.model.stroke,
        },
      });
      group.addShape('circle', {
        attrs: {
          x: cfg.x - cfg.size[0] / 2 + 1.5,
          y: cfg.y - cfg.size[1] / 2 + cfg.model.size[1] + 2.5,
          r: 5,
          // stroke: 'red',
          stroke: cfg.model.stroke,
          fill: cfg.model.stroke,
        },
      });
      return group.addShape('rect', {
        attrs: {
          x: cfg.x - cfg.size[0] / 2,
          y: cfg.y - cfg.size[1] / 2,
          width: 3,
          height: cfg.model.size[1],
          fill: cfg.model.stroke,
          stroke: cfg.model.stroke,
        },
      });
    },
    getAnchorPoints: (cfg) => {
      return getLinePoints(cfg.model.size[1], 1);
    },
  }, 'rect');
  G6_1.registNode('customDashLine', {
    draw: (cfg, group) => {
      const x2 = cfg.size ? cfg.model.size[0] : 200;
      group.addShape('line', {
        attrs: {
          x1: cfg.x,
          y1: cfg.y,
          x2: cfg.x + x2,
          y2: cfg.y,
          lineDash: [2, 2],
          stroke: cfg.model.stroke,
          lineWidth: cfg.model.lineWidth,
        },
      });
      return group.addShape('rect', {
        attrs: {
          x: cfg.x,
          y: cfg.y - 20,
          width: cfg.x + x2,
          height: 40,
          fill: 'rgba(0, 0, 0, 0)',
          stroke: 'rgba(0, 0, 0, 0)',
        },
      });
    },
    getAnchorPoints: () => {
      return [
        [0, 0.5],
        [1, 0.5],
      ];
    },
  }, 'rect');
  G6_1.registNode('customDashLineV', {
    draw: (cfg, group) => {
      const y2 = cfg.size ? cfg.model.size[1] : 200;
      group.addShape('line', {
        attrs: {
          x1: cfg.x,
          y1: cfg.y,
          x2: cfg.x,
          y2: cfg.y + y2,
          lineDash: [2, 2],
          stroke: cfg.model.stroke,
          lineWidth: cfg.model.lineWidth,
        },
      });
    },
    getAnchorPoints: () => {
      return [
        [0, 0.5],
        [1, 0.5],
      ];
    },
  }, 'line');
  G6_1.registEdge('lineNewArrow', {
    afterDraw: (cfg, group, keyShape) => {
      const { points } = cfg;
      const start = points[points.length - 2];
      const end = points[points.length - 1];
      let lineWidth = keyShape.attr('lineWidth');
      if (lineWidth < 5) {
        lineWidth = 30;
      }
      // 关于自身坐标系构造一个形，作为箭头
      const arrow = group.addShape('polygon', {
        attrs: {
          points: [
            // [-lineWidth / 8, lineWidth / 4],
            // [-lineWidth / 4, lineWidth / 2],
            // [lineWidth / 4, 0],
            // [-lineWidth / 4, -lineWidth / 2],
            // [-lineWidth / 8, -lineWidth / 4],
            // [-lineWidth / 2, -lineWidth / 4],
            // [-lineWidth / 2, lineWidth / 4],
            [-12, 5],
            [-12, 10],
            [0, 0],
            [-12, -10],
            [-12, -5],
            [-30, -3],
            [-30, 3],
          ],
          stroke: '#fff',
          fill: '#fff',
          fillOpacity: 1,
        },
        class: 'arrow',
      });
      Util.arrowTo(arrow, end.x, end.y, start.x, start.y, end.x, end.y);
    },
  });
  G6_1.registEdge('lineNewArrow1', {
    afterDraw: (cfg, group, keyShape) => {
      const { points } = cfg;
      const start = points[points.length - 2];
      const end = points[points.length - 1];
      let lineWidth = keyShape.attr('lineWidth');
      if (lineWidth < 5) {
        lineWidth = 30;
      }
      // 关于自身坐标系构造一个形，作为箭头
      const arrow = group.addShape('polygon', {
        attrs: {
          points: [
            [-12, 5],
            [0, 0],
            [-12, -5],
          ],
          stroke: cfg.color,
          fill: cfg.color,
          fillOpacity: 1,
        },
        class: 'arrow',
      });
      Util.arrowTo(arrow, end.x, end.y, start.x, start.y, end.x, end.y);
    },
  });
  G6_1.registEdge('lineNewArrowWithAngel', {
    afterDraw: (cfg, group, keyShape) => {
      const { points } = cfg;
      const start = points[points.length - 2];
      const end = points[points.length - 1];
      let lineWidth = keyShape.attr('lineWidth');
      if (lineWidth < 5) {
        lineWidth = 30;
      }
      // 关于自身坐标系构造一个形，作为箭头
      const triangle = group.addShape('polygon', {
        attrs: {
          points: [
            [1, 0],
            [13, -7],
            [13, 7],
            [1, 0],
            [0, 0],
            [-1, 0],
            [-13, -7],
            [-13, 7],
            [-1, 0],
            [0, 0],
          ],
          stroke: cfg.model.color,
          fill: '#202121',
          fillOpacity: 1,
        },
        class: 'arrow',
      });
      const arrow = group.addShape('polygon', {
        attrs: {
          points: [
            [-12, 5],
            [-12, 10],
            [0, 0],
            [-12, -10],
            [-12, -5],
            [-30, -3],
            [-30, 3],
          ],
          stroke: '#fff',
          fill: '#fff',
          fillOpacity: 1,
        },
        class: 'arrow',
      });
      Util.arrowTo(arrow, end.x, end.y, start.x, start.y, end.x, end.y);
      Util.arrowTo(triangle, start.x + (end.x - start.x) / 5, start.y + (end.y - start.y) / 5, start.x, start.y, end.x, end.y);
    },
  });
  G6_1.registEdge('strengthLine', {
    afterDraw: (cfg, group, keyShape) => {
      const { points } = cfg;
      const start = points[points.length - 2];
      const end = points[points.length - 1];
      let lineWidth = keyShape.attr('lineWidth');
      if (lineWidth < 5) {
        lineWidth = 30;
      }
      // 关于自身坐标系构造一个形，作为箭头
      const arrow = group.addShape('polygon', {
        attrs: {
          points: [
            // [-lineWidth / 8, lineWidth / 4],
            // [-lineWidth / 4, lineWidth / 2],
            // [lineWidth / 4, 0],
            // [-lineWidth / 4, -lineWidth / 2],
            // [-lineWidth / 8, -lineWidth / 4],
            // [-lineWidth / 2, -lineWidth / 4],
            // [-lineWidth / 2, lineWidth / 4],
            [-12, 5],
            [-12, 10],
            [0, 0],
            [-12, -10],
            [-12, -5],
            [-30, -3],
            [-30, 3],
          ],
          stroke: '#fff',
          fill: '#fff',
          fillOpacity: 1,
        },
        class: 'arrow',
      });
      Util.arrowTo(arrow, end.x, end.y, start.x, start.y, end.x, end.y);
    },
  });
  G6_1.registNode('loading', {
    draw: (cfg, group) => {
      const d1 = group.addShape('arc', {
        attrs: {
          x: cfg.x + cfg.size[0] / 2,
          y: cfg.y + cfg.size[1] - 8,
          r: 6,
          startAngle: 1 / 6 * Math.PI,
          endAngle: 5 / 4 * Math.PI,
          stroke: '#f7e541',
          lineDash: [20, 20],
        },
      });
      d1.animate({
        repeat: true,
        startAngle: 1 / 6 * Math.PI + 5,
        endAngle: 5 / 4 * Math.PI + 5,
      }, 500, 'linear');
    },
  });
  G6_1.registNode('K201', {
    draw: (cfg, group) => {
      group.addShape('image', {
        attrs: {
          x: cfg.x - 772 / 2,
          y: cfg.y - 132 / 2,
          img: k201_,
        },
      });
      return group.addShape('rect', {
        attrs: {
          x: cfg.x - 772 / 2,
          y: cfg.y - 132 / 2,
          width: 770,
          height: 173,
          fill: 'rgba(0,0,0,0)',
          stroke: 'rgba(0,0,0,0)',
        },
      });
    },
    getAnchorPoints: () => {
      return [
        [0, 0.125],
        [0, 0.25],
        [0, 0.375],
        [0, 0.5],
        [0, 0.625],
        [0, 0.75],
        [0, 0.875],
        [1, 0.125],
        [1, 0.25],
        [1, 0.375],
        [1, 0.5],
        [1, 0.625],
        [1, 0.75],
        [1, 0.875],
        [0.125, 0],
        [0.25, 0],
        [0.375, 0],
        [0.5, 0],
        [0.625, 0],
        [0.75, 0],
        [0.875, 0],
        [0.125, 1],
        [0.25, 1],
        [0.375, 1],
        [0.5, 1],
        [0.625, 1],
        [0.75, 1],
        [0.875, 1],
      ];
    },
  }, 'rect');
  G6_1.registNode('K501', {
    draw: (cfg, group) => {
      group.addShape('image', {
        attrs: {
          x: cfg.x - 551 / 2,
          y: cfg.y - 185 / 2,
          img: K501_,
        },
      });
      return group.addShape('rect', {
        attrs: {
          x: cfg.x - 551 / 2,
          y: cfg.y - 185 / 2,
          width: 551,
          height: 185,
          fill: 'rgba(0,0,0,0)',
          stroke: 'rgba(0,0,0,0)',
        },
      });
    },
    getAnchorPoints: () => {
      return [
        [0, 0.125],
        [0, 0.25],
        [0, 0.375],
        [0, 0.5],
        [0, 0.625],
        [0, 0.75],
        [0, 0.875],
        [1, 0.125],
        [1, 0.25],
        [1, 0.375],
        [1, 0.5],
        [1, 0.625],
        [1, 0.75],
        [1, 0.875],
        [0.125, 0],
        [0.25, 0],
        [0.375, 0],
        [0.5, 0],
        [0.625, 0],
        [0.75, 0],
        [0.875, 0],
        [0.125, 1],
        [0.25, 1],
        [0.375, 1],
        [0.5, 1],
        [0.625, 1],
        [0.75, 1],
        [0.875, 1],
      ];
    },
  }, 'rect');
  G6_1.registNode('K601', {
    draw: (cfg, group) => {
      group.addShape('image', {
        attrs: {
          x: cfg.x - 560 / 2,
          y: cfg.y - 173 / 2,
          img: K601_,
        },
      });
      return group.addShape('rect', {
        attrs: {
          x: cfg.x - 560 / 2,
          y: cfg.y - 173 / 2,
          width: 560,
          height: 173,
          fill: 'rgba(0,0,0,0)',
          stroke: 'rgba(0,0,0,0)',
        },
      });
    },
    getAnchorPoints: () => {
      return [
        [0, 0.125],
        [0, 0.25],
        [0, 0.375],
        [0, 0.5],
        [0, 0.625],
        [0, 0.75],
        [0, 0.875],
        [1, 0.125],
        [1, 0.25],
        [1, 0.375],
        [1, 0.5],
        [1, 0.625],
        [1, 0.75],
        [1, 0.875],
        [0.125, 0],
        [0.25, 0],
        [0.375, 0],
        [0.5, 0],
        [0.625, 0],
        [0.75, 0],
        [0.875, 0],
        [0.125, 1],
        [0.25, 1],
        [0.375, 1],
        [0.5, 1],
        [0.625, 1],
        [0.75, 1],
        [0.875, 1],
      ];
    },
  }, 'rect');
  G6_1.registNode('K760', {
    draw: (cfg, group) => {
      group.addShape('image', {
        attrs: {
          x: cfg.x - 586 / 2,
          y: cfg.y - 302 / 2,
          img: K760_,
        },
      });
      return group.addShape('rect', {
        attrs: {
          x: cfg.x - 586 / 2,
          y: cfg.y - 302 / 2,
          width: 586,
          height: 302,
          fill: 'rgba(0,0,0,0)',
          stroke: 'rgba(0,0,0,0)',
        },
      });
    },
    getAnchorPoints: () => {
      return [
        [0, 0.125],
        [0, 0.25],
        [0, 0.375],
        [0, 0.5],
        [0, 0.625],
        [0, 0.75],
        [0, 0.875],
        [1, 0.125],
        [1, 0.25],
        [1, 0.375],
        [1, 0.5],
        [1, 0.625],
        [1, 0.75],
        [1, 0.875],
        [0.125, 0],
        [0.25, 0],
        [0.375, 0],
        [0.5, 0],
        [0.625, 0],
        [0.75, 0],
        [0.875, 0],
        [0.125, 1],
        [0.25, 1],
        [0.375, 1],
        [0.5, 1],
        [0.625, 1],
        [0.75, 1],
        [0.875, 1],
      ];
    },
  }, 'rect');
};
