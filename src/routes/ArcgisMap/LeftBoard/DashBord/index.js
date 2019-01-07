import React, { PureComponent } from 'react';
import { Chart, Axis, Geom, Coord, Guide, Shape } from 'bizcharts';


export default class DashBord extends PureComponent {
  // 图表模板
  render() {
    const { bordValue, cols, typeName } = this.props;
    const { Arc, Html, Line } = Guide;
    Shape.registerShape('point', 'pointer', {
      drawShape(cfg, group) {
        let point = cfg.points[0]; // 获取第一个标记点
        point = this.parsePoint(point);
        const center = this.parsePoint({ // 获取极坐标系下画布中心点
          x: 0,
          y: 0,
        });
        // 绘制指针
        group.addShape('line', {
          attrs: {
            x1: center.x,
            y1: center.y,
            x2: point.x,
            y2: point.y - 10,
            stroke: cfg.color,
            lineWidth: 1,
            lineCap: 'round',
          },
        });
        return group.addShape('circle', {
          attrs: {
            x: center.x,
            y: center.y,
            r: 4,
            stroke: cfg.color,
            lineWidth: 1,
            fill: '#fff',
          },
        });
      },
    });
    return (
      <div style={{ marginBottom: 40, marginTop: 10 }}>
        <Chart height={60} data={bordValue} scale={cols} padding={[0, 0, 0, 0]} forceFit>
          <Coord type="polar" startAngle={(-9 / 8) * Math.PI} endAngle={(1 / 8) * Math.PI} radius={0.75} />
          <Axis
            name="value"
            zIndex={2}
            line={null}
            label={{
              offset: 5,
              textStyle: {
                fontSize: 12,
                fill: 'rgba(0, 0, 0, 0.25)',
                textAlign: 'center',
                textBaseline: 'middle',
              } }}
            subTickCount={4}
            subTickLine={{
              length: -8,
              stroke: '#fff',
              strokeOpacity: 1,
            }}
            tickLine={{
              length: -18,
              stroke: '#fff',
              strokeOpacity: 1,
            }}
          />
          <Axis name="1" visible={false} />
          <Guide >
            <Arc
              zIndex={0}
              start={[0, 0.965]}
              end={[9, 0.965]}
              style={{ // 底灰色
                stroke: '#000',
                lineWidth: 4,
                opacity: 0.09,
              }}
            />
            <Arc
              zIndex={1}
              start={[0, 0.965]}
              end={[bordValue[0].value, 0.965]}
              style={{ // 底灰色
                stroke: '#1890FF',
                lineWidth: 4,
              }}
            />
            <Html
              position={['50%', '110%']}
              html={() => {
                return (`${`${'<div style="width: 150px;margin-top: 5px;text-align:' +
                ' center;font-size:' +
                ' 12px!important;">' +
                '<p style="font-size: 1em; color: rgba(0,0,0,0.43);margin: 0;">'}${typeName}</p>` +
                '<p style="font-size: 1.2em;color: rgba(0,0,0,0.85);margin: 0;">'}${bordValue[0].value}</p></div>`);
              }}
            />
          </Guide>
          <Geom
            type="point"
            position="value*1"
            shape="pointer"
            color="#1890FF"
            active={false}
            style={{ stroke: '#fff', lineWidth: 1 }}
          />
        </Chart>
      </div>
    );
  }
}
